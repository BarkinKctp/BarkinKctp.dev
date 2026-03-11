import { links } from "@/lib/data";
import { BsLinkedin, BsGithub } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { LINKEDIN, GITHUB } from "@/lib/links";

const pages = [
  { label: "About Me", href: "/pages/about-me" },
  { label: "Projects", href: "/pages/projects" },
];

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-8 sm:px-10 sm:py-9">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-2">
            <p className="text-white font-semibold tracking-wide">
              Barkın Kocatepe
            </p>
            <p className="text-xs sm:text-sm text-zinc-500">
              Cloud-focused software engineer building clean and scalable apps.
            </p>
          </div>

          {/* Navigate */}
          <div className="space-y-4">
            <p className="text-[12px] font-semibold tracking-[0.14em] text-zinc-300">
              NAVIGATE
            </p>
            <nav className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
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
            <p className="text-[12px] font-semibold tracking-[0.14em] text-zinc-300">
              PAGES
            </p>
            <nav className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
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
            <p className="text-[12px] font-semibold tracking-[0.14em] text-zinc-300">
              CONNECT
            </p>
            <div className="flex items-center gap-4 text-base">
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-150"
                aria-label="LinkedIn"
              >
                <BsLinkedin />
              </a>
              <a
                href={GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-150"
                aria-label="GitHub"
              >
                <BsGithub />
              </a>
              <a
                href="mailto:barkinkocatepe12@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-150"
                aria-label="Email"
              >
                <MdEmail />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-6 pt-4 flex flex-col gap-2 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
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
