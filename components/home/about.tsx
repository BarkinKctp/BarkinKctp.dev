"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import SectionHeading from "../section-heading";
import { useSectionInView } from "@/lib/hooks";
import { useTheme } from "@/app/context/theme-context";

export default function About() {
  const { ref } = useSectionInView("About", 0.5);
  const { theme } = useTheme();
  const [basketBump, setBasketBump] = useState(false);
  const basketTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const swingBasket = () => {
    if (basketBump) return;
    setBasketBump(true);
    basketTimer.current = setTimeout(() => setBasketBump(false), 920);
  };
  return (
    <motion.section
      id="about"
      ref={ref}
      className="about-balloon-section mb-[9rem] max-w-[54rem] text-center
      leading-6 sm:mb-[13rem] scroll-mt-40"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
    >
      <div className={basketBump ? "about-balloon-rig basket-click-swing" : "about-balloon-rig"}>
      <div className="about-balloon">
        <div className="balloon-glint" aria-hidden="true" />
        <SectionHeading>About Me</SectionHeading>
        <motion.p
          className="leading-8 text-gray-700 dark:text-slate-300"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
        I&apos;m interested in cloud architecture, DevOps, AI, and SDLC.
        <br />
        Throughout my career, I&apos;ve worked across Azure, GitHub, DevOps, AI, and
        various other technologies and environments.
        <br />
        <br />
        Outside of tech, I enjoy music, books, movies, gaming, and traveling.
        <span className="about-learning-note italic text-gray-800 dark:text-slate-200 hover:text-cyan-600 transition">
          <br />
          <br />
          I&apos;m always looking to learn and improve.
        </span>
        </motion.p>

        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/pages/about-me"
            className="group inline-flex items-center gap-4 rounded-full border-2 border-sky-800
            bg-amber-100 px-8 py-3 font-semibold text-sky-950 shadow-lg transition
            hover:-translate-y-1 hover:bg-amber-200 hover:shadow-xl dark:border-sky-200"
          >
            <FaUser />
            More about me
            <HiCursorClick className="opacity-90 transition group-hover:scale-115" />
          </Link>
        </motion.div>
      </div>
      <div className="balloon-ropes" aria-hidden="true"><i /><i /></div>
      <div className="balloon-burner" aria-hidden="true">
        <motion.span
          className="balloon-flame"
          initial={false}
          animate={
            theme === "dark"
              ? { opacity: 1, scaleY: [0.08, 1.12, 0.9, 1.06] }
              : { opacity: 0, scaleY: 0.04 }
          }
          transition={
            theme === "dark"
              ? { duration: 0.9, times: [0, 0.55, 0.78, 1], repeat: Infinity, repeatType: "mirror" }
              : { duration: 0.62, ease: [0.4, 0, 0.6, 1] }
          }
        />
      </div>
      <button
        type="button"
        className="balloon-basket"
        aria-label="Swing the About Me balloon"
        onClick={swingBasket}
      />
      </div>
    </motion.section>
  );
}
