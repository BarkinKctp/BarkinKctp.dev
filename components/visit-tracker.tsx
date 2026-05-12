"use client";

import { useEffect } from "react";

export default function VisitTracker() {
  useEffect(() => {
    const key = "visit_tracked";
    if (sessionStorage.getItem(key)) return;

    // Don't track admin or API routes
    const path = window.location.pathname;
    if (path.startsWith("/admin") || path.startsWith("/api")) return;

    sessionStorage.setItem(key, "1");
    fetch("/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: window.location.pathname }),
    }).catch(() => {});
  }, []);

  return null;
}
