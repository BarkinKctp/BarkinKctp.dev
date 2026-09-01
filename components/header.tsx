"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { links } from "@/lib/data";
import Link from "next/link";
import clsx from "clsx";
import { useActiveSection } from "@/app/context/active-section-context";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const { activeSection, setActiveSection } = useActiveSection();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTurbulent, setIsTurbulent] = useState(false);
  const [turbulenceStrength, setTurbulenceStrength] = useState<"soft" | "full">("full");
  const [isPlaneBumped, setIsPlaneBumped] = useState(false);
  const turbulenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const planeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const triggerTurbulence = useCallback((strength: "soft" | "full" = "full") => {
    setIsTurbulent(false);
    setTurbulenceStrength(strength);
    if (turbulenceTimer.current) clearTimeout(turbulenceTimer.current);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setIsTurbulent(true);
        turbulenceTimer.current = setTimeout(() => setIsTurbulent(false), 900);
      });
    });
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let travelled = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      travelled += Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      const scrollableHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const triggerDistance = Math.max(240, scrollableHeight / 4.2);

      if (travelled >= triggerDistance) {
        travelled %= triggerDistance;
        triggerTurbulence("soft");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (turbulenceTimer.current) clearTimeout(turbulenceTimer.current);
      if (planeTimer.current) clearTimeout(planeTimer.current);
    };
  }, [triggerTurbulence]);

  const bumpPlane = () => {
    if (isPlaneBumped) return;
    setIsPlaneBumped(true);
    triggerTurbulence();
    planeTimer.current = setTimeout(() => setIsPlaneBumped(false), 760);
  };

  if (pathname.startsWith("/admin")) return null;

  const handleLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    link: (typeof links)[number],
  ) => {
    triggerTurbulence();
    setActiveSection(link.name);
    setIsMobileMenuOpen(false);

    if (link.hash.startsWith("#") && (pathname === "/" || pathname === "")) {
      event.preventDefault();
      document.querySelector(link.hash)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[999] px-3 pt-3 sm:px-6 sm:pt-5">
      <motion.div
        className={clsx(
          "flight-header mx-auto flex h-[4.5rem] max-w-[74rem] items-center",
          isTurbulent && "header-turbulence",
          isTurbulent && turbulenceStrength === "soft" && "header-scroll-turbulence",
        )}
        initial={{ x: -140, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          type="button"
          className={clsx("header-plane", isPlaneBumped && "plane-click-turbulence")}
          aria-label="Give the header plane a little turbulence"
          onClick={bumpPlane}
        >
          <Image className="plane-day" src="/bg-images/header-plane-red.png" alt="" width={239} height={160} priority />
          <Image className="plane-night" src="/bg-images/header-plane-transparent-clean.png" alt="" width={239} height={160} priority />
        </button>
        <div className="tow-rope" aria-hidden="true" />
        <div className="name-banner"><span>Barkın Kocatepe</span></div>

        <nav
          className="header-flags hidden items-start gap-1 sm:flex"
          aria-label="Primary navigation"
          onAnimationEnd={() => setIsTurbulent(false)}
        >
          {links.map((link, index) => (
            <motion.div
              key={link.hash}
              className={clsx("flag-wrap", link.name === "My Blog" && "blog-flag-wrap")}
              initial={{ y: -45, rotate: -5, opacity: 0 }}
              animate={{ y: 0, rotate: index % 2 ? 1.5 : -1.5, opacity: 1 }}
              transition={{ delay: 0.08 * index + 0.35, type: "spring", stiffness: 150 }}
            >
              <Link
                className={clsx(
                  "nav-flag",
                  link.name === "My Blog" && "blog-nav-flag",
                  activeSection === link.name && "nav-flag-active",
                )}
                href={link.hash.startsWith("http") ? link.hash : `/${link.hash}`}
                target={link.hash.startsWith("http") ? "_blank" : undefined}
                rel={link.hash.startsWith("http") ? "noopener noreferrer" : undefined}
                onClick={(event) => handleLinkClick(event, link)}
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
        </nav>

        <button
          type="button"
          className="cloud-menu-button ml-auto sm:hidden"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((previous) => !previous)}
        >
          {isMobileMenuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
        </button>
      </motion.div>

      {isMobileMenuOpen ? (
        <motion.nav
          className="mobile-cloud-menu mx-auto mt-2 w-[min(92vw,25rem)] p-5 sm:hidden"
          initial={{ y: -16, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.22 }}
          aria-label="Mobile navigation"
        >
          <ul className="grid grid-cols-2 gap-2 text-sm font-semibold text-sky-950">
            {links.map((link) => (
              <li key={`mobile-${link.hash}`}>
                <Link
                  className={clsx(
                    "block rounded-full border border-sky-200 bg-white/80 px-4 py-3 text-center",
                    link.name === "My Blog" && "blog-mobile-link",
                    activeSection === link.name && "bg-sky-600! text-white",
                  )}
                  href={link.hash.startsWith("http") ? link.hash : `/${link.hash}`}
                  target={link.hash.startsWith("http") ? "_blank" : undefined}
                  rel={link.hash.startsWith("http") ? "noopener noreferrer" : undefined}
                  onClick={(event) => handleLinkClick(event, link)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.nav>
      ) : null}
    </header>
  );
}
