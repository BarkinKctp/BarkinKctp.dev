"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const checkpoints = [
  { id: "home", short: "H", label: "Home", altitude: 40000 },
  { id: "about", short: "A", label: "About", altitude: 32000 },
  { id: "projects", short: "P", label: "Projects", altitude: 24000 },
  { id: "experience", short: "E", label: "Experience", altitude: 16000 },
  { id: "skills", short: "S", label: "Skills", altitude: 8000 },
  { id: "contact", short: "C", label: "Contact", altitude: 2000 },
  { id: "runway", short: "R", label: "Runway", altitude: 0 },
] as const;

export default function AltitudeScrollbar() {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string>("home");
  const [altitude, setAltitude] = useState(40000);
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const routeRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromScroll = useCallback(() => {
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const nextProgress = Math.min(1, Math.max(0, window.scrollY / scrollable));
    const scanLine = window.scrollY + window.innerHeight * 0.35;
    let nextActive: string = checkpoints[0].id;

    const locatedCheckpoints = checkpoints.map((checkpoint) => {
      const element = document.getElementById(checkpoint.id);
      const documentTop = element ? element.getBoundingClientRect().top + window.scrollY : 0;
      return { ...checkpoint, documentTop, ratio: Math.min(1, documentTop / scrollable) };
    });

    locatedCheckpoints.forEach(({ id, documentTop }) => {
      if (documentTop <= scanLine) nextActive = id;
    });

    let nextAltitude = locatedCheckpoints[0].altitude;
    for (let index = 0; index < locatedCheckpoints.length - 1; index += 1) {
      const current = locatedCheckpoints[index];
      const next = locatedCheckpoints[index + 1];
      if (nextProgress >= current.ratio && nextProgress <= next.ratio) {
        const range = Math.max(next.ratio - current.ratio, 0.0001);
        const localProgress = (nextProgress - current.ratio) / range;
        nextAltitude = current.altitude + (next.altitude - current.altitude) * localProgress;
        break;
      }
      if (nextProgress > next.ratio) nextAltitude = next.altitude;
    }

    setProgress(nextProgress);
    setActiveId(nextActive);
    setAltitude(Math.max(0, Math.round(nextAltitude / 100) * 100));
  }, []);

  useEffect(() => {
    let frame = 0;
    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateFromScroll);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [updateFromScroll]);

  const scrollFromPointer = (clientY: number) => {
    const route = routeRef.current;
    if (!route) return;
    const bounds = route.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientY - bounds.top) / bounds.height));
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: ratio * scrollable, behavior: "auto" });
  };

  const scrollToCheckpoint = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!mounted) return null;

  return createPortal(
    <aside
      className="altitude-scrollbar"
      aria-label="Page altitude scrollbar"
    >
      <span className="altitude-scrollbar-title">ALT</span>
      <div className="altitude-scrollbar-route-shell">
        <div
          ref={routeRef}
          className="altitude-scrollbar-route"
          onPointerDown={(event) => {
            dragging.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            scrollFromPointer(event.clientY);
          }}
          onPointerMove={(event) => {
            if (dragging.current) scrollFromPointer(event.clientY);
          }}
          onPointerUp={(event) => {
            dragging.current = false;
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
          }}
        >
          <i className="altitude-scrollbar-thumb" style={{ top: `${progress * 100}%` }} />
        </div>
        <div className="altitude-scrollbar-checkpoints">
          {checkpoints.map((checkpoint, index) => (
            <button
              key={checkpoint.id}
              type="button"
              className={activeId === checkpoint.id ? "is-active" : undefined}
              style={{ top: `${(index / (checkpoints.length - 1)) * 100}%` }}
              title={checkpoint.label}
              aria-label={`Scroll to ${checkpoint.label}`}
              onClick={() => scrollToCheckpoint(checkpoint.id)}
            >
              <span>{checkpoint.short}</span>
              <em>{checkpoint.altitude.toLocaleString("en-US")} FT</em>
            </button>
          ))}
        </div>
      </div>
      <strong>{altitude.toLocaleString("en-US")} FT</strong>
    </aside>,
    document.body,
  );
}
