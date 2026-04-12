"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { links } from "@/lib/data";
import Link from "next/link";
import clsx from "clsx";
import { useActiveSection } from "@/app/context/active-section-context";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

export default function Header() {
  const { activeSection, setActiveSection } = useActiveSection();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = (section: (typeof links)[number]["name"]) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="z-999 relative">
      <motion.div
        className="fixed top-0 left-1/2 -translate-x-1/2 flex items-center justify-between
        h-[5rem] w-full rounded-none border border-black/60 dark:border-white/10
        bg-white/95 dark:bg-slate-900/90 shadow-lg shadow-black/[0.35]
        pl-14 pr-12 sm:top-[1.5rem] sm:h-[3.1rem] 
        sm:w-[68rem] sm:rounded-full sm:pl-20 sm:pr-10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <motion.span
          className="flex text-[1.1rem] font-semibold tracking-wide text-gray-800 dark:text-slate-100
          hover:text-cyan-600 transition sm:h-[3.3rem]
          py-[0.6,rem] px-[0.6rem] sm:text-[1.28rem] sm:py-[0.6rem] sm:px-[1.25rem]"
          initial={{ y: -25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          Barkin Kocatepe
        </motion.span>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/20
          bg-white/80 text-gray-900 transition hover:text-cyan-600 dark:border-white/20
          dark:bg-slate-900/80 dark:text-slate-100 sm:hidden"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? (
            <HiOutlineX className="text-[1.8rem]" />
          ) : (
            <HiOutlineMenu className="text-[1.8rem]" />
          )}
        </button>

        <nav className="hidden sm:block">
          <ul
            className="flex flex-wrap items-center 
            justify-center gap-y-1 text-[1.05rem]
            font-medium text-gray-700 dark:text-slate-300 sm:flex-nowrap sm:gap-1"
          >
            {links.map((link) => (
              <motion.li
                className="h-3/4 flex relative items-center justify-center"
                key={link.hash}
                initial={{ y: -25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut", delay: 0.2 }}
              >
                <Link
                  className={clsx(
                    "flex w-full items-center justify-center px-[0.75rem] py-[0.75rem] \
                     hover:text-cyan-600 transition",
                    {
                      "text-gray-950 dark:text-white":
                        activeSection === link.name,
                    },
                  )}
                  href={`/${link.hash}`}
                  onClick={() => handleLinkClick(link.name)}
                >
                  {link.name}
                  {link.name === activeSection && (
                    <motion.span
                      className="bg-cyan-600 absolute
                  bottom-0.25 left-0 w-full h-[2.5px] rounded-full"
                      layoutId="underline"
                      transition={{
                        duration: 0.24,
                        delay: 0.35,
                        ease: "easeInOut",
                      }}
                    ></motion.span>
                  )}
                </Link>
              </motion.li>
            ))}
            <motion.li
              className="h-3/4 flex relative items-center justify-center ml-1"
              initial={{ y: -25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut", delay: 0.25 }}
            >
              <Link
                href="/pages/blog"
                className="flex w-full items-center justify-center px-[0.65rem] py-[0.65rem] 
                text-gray-900 dark:text-slate-100 rounded-full 
                hover:text-cyan-600 transition font-medium text-[1.025rem]"
              >
                My Blog
              </Link>
            </motion.li>
          </ul>
        </nav>
      </motion.div>

      {isMobileMenuOpen && (
        <motion.nav
          className="fixed top-[5rem] left-1/2 z-[998] w-[92vw] -translate-x-1/2 rounded-2xl
          border border-black/20 bg-white/95 p-3 shadow-xl dark:border-white/10 dark:bg-slate-900/95 sm:hidden"
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
        >
          <ul className="flex flex-col gap-1 text-[1rem] font-medium text-gray-700 dark:text-slate-200">
            {links.map((link) => (
              <li key={`mobile-${link.hash}`}>
                <Link
                  className={clsx(
                    "block rounded-xl px-4 py-3 transition hover:bg-cyan-50 hover:text-cyan-600 dark:hover:bg-slate-800/80",
                    {
                      "bg-cyan-50 text-cyan-700 dark:bg-slate-800 dark:text-cyan-300":
                        activeSection === link.name,
                    },
                  )}
                  href={`/${link.hash}`}
                  onClick={() => handleLinkClick(link.name)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.nav>
      )}
    </header>
  );
}
