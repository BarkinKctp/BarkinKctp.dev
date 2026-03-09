"use client";
import { motion } from "framer-motion";
import { links } from "@/lib/data";
import Link from "next/link";

export default function Header() {
  return (
    <header className="z-999 relative">
      <motion.div
        className="fixed top-0 left-1/2 -translate-x-1/2 flex items-center justify-between
        h-[5rem] w-full rounded-none border border-white/40
        bg-white/95 shadow-lg shadow-black/[0.03]
        pl-12 pr-4 sm:top-[1.5rem] sm:h-[3.1rem]
        sm:w-[68rem] sm:rounded-full sm:pl-16 sm:pr-16"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <motion.span
          className="flex text-[1.2rem] font-bold text-gray-700
          hover:text-cyan-600 transition sm:h-[3.3rem]
          py-[0.6,rem] px-[0.6rem] sm:text-[1.3rem] sm:py-[0.6rem] sm:px-[1.25rem]"
          initial={{ y: -25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          Barkin Kocatepe
        </motion.span>

        <nav>
          <ul
            className="flex flex-wrap items-center 
            justify-center gap-y-1 text-[1.05rem]
            font-medium text-gray-700 sm:flex-nowrap sm:gap-[1.25rem]"
          >
            {links.map((link) => (
              <motion.li
                className="h-3/4 flex items-center justify-center"
                key={link.hash}
                initial={{ y: -25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut", delay: 0.2 }}
              >
                <Link
                  className="flex w-full items-center justify-center
                  px-[0.75rem] py-[0.75rem] hover:text-gray-950 transition"
                  href={link.hash}
                >
                  {link.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>
      </motion.div>
    </header>
  );
}
