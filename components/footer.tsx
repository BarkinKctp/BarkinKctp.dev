"use client";

import { useState } from "react";
import { links } from "@/lib/data";
import { BsLinkedin, BsGithub } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { LinkedIn, Github, pages } from "@/lib/links";

export default function Footer() {
  const [language, setLanguage] = useState<"en" | "tr">("en");

  return (
    <footer className="bg-gray-700 text-zinc-300 dark:bg-zinc-950 dark:text-zinc-400 mt-15 sm:mt-22 border-t border-black/60 dark:border-white/20">
      <div className="max-w-6xl mx-auto px-6 py-8 sm:px-10 sm:py-9">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.6fr_1.4fr] lg:gap-2 overflow-hidden">
          {/* Brand */}
          <div className="space-y-2">
            <p className="text-zinc-100 dark:text-white font-semibold tracking-wide">
              Barkın Kocatepe
            </p>
            <p className="text-xs sm:text-sm text-zinc-300/90 dark:text-zinc-500">
              Cloud-focused software engineer building clean and scalable apps.
            </p>
          </div>

          {/* Navigate */}
          <div className="space-y-4">
            <p className="text-[12px] font-semibold tracking-[0.14em] text-zinc-200 dark:text-zinc-300">
              NAVIGATE
            </p>
            <nav className="flex items-center gap-2 text-sm whitespace-nowrap">
              {links.map((l) => (
                <a
                  key={l.hash}
                  href={l.hash}
                  className="hover:text-white transition-colors duration-150"
                >
                  {l.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Pages */}
          <div className="space-y-4">
            <p className="text-[12px] font-semibold tracking-[0.14em] text-zinc-200 dark:text-zinc-300">
              PAGES
            </p>
            <nav className="flex flex-wrap items-center gap-2 text-sm">
              {pages.map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  className="hover:text-white transition-colors duration-150"
                >
                  {p.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <p className="text-[12px] font-semibold tracking-[0.14em] text-zinc-200 dark:text-zinc-300">
              CONNECT
            </p>
            <div className="flex items-center gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-5 text-sm">
                <a
                  href={LinkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition-colors duration-150"
                  aria-label="LinkedIn"
                >
                  <span>LinkedIn</span>
                  <BsLinkedin />
                </a>
                <a
                  href={Github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition-colors duration-150"
                  aria-label="GitHub"
                >
                  <span>GitHub</span>
                  <BsGithub />
                </a>
                <a
                  href="mailto:barkinkocatepe12@gmail.com"
                  className="flex items-center gap-1.5 hover:text-white transition-colors duration-150"
                  aria-label="Email"
                >
                  <span>Mail</span>
                  <MdEmail />
                </a>
              </div>

              {/* Language Toggle */}
              <div className="relative flex items-center bg-zinc-300/60 dark:bg-zinc-800/40 rounded-full p-0.5 text-xs gap-0 w-fit">
                <div
                  className="absolute left-0.5 top-0.5 bottom-0.5 w-11 bg-white dark:bg-zinc-100 rounded-full transition-all duration-300"
                  style={{
                    transform:
                      language === "tr" ? "translateX(44px)" : "translateX(0)",
                  }}
                />
                <button
                  onClick={() => setLanguage("en")}
                  className={`relative px-3.5 py-1 rounded-full font-medium transition-colors ${
                    language === "en"
                      ? "text-zinc-900"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("tr")}
                  className={`relative px-3.5 py-1 rounded-full font-medium transition-colors ${
                    language === "tr"
                      ? "text-zinc-900"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  TR
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-black/60 dark:border-white/10 mt-6 pt-4 flex flex-col gap-2 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; 2026 Barkın Kocatepe. All rights reserved.</span>
          <span>
            Built with Next.js · TypeScript · Tailwind CSS · Framer Motion ·
            Vercel
          </span>
        </div>
      </div>
    </footer>
  );
}
