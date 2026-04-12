"use client";

import SectionHeading from "./section-heading";
import { skills } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FiAward } from "react-icons/fi";
import { HiCursorClick } from "react-icons/hi";

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * index,
    },
  }),
};

export default function Skills() {
  const { ref } = useSectionInView("Skills");
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 640);
    const handleResize = () => setIsDesktop(window.innerWidth >= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      id="skills"
      ref={ref}
      className="mb-[7rem] max-w-[53rem] 
      scroll-mt-40 text-center sm:mb-[10rem]"
    >
      <SectionHeading>My skills</SectionHeading>
      <ul
        className="flex flex-wrap justify-center 
      gap-2 text-lg text-gray-800 dark:text-slate-200"
      >
        {skills.map((skill, index) => {
          const skillItem = (
            <motion.li
              className="bg-white dark:bg-slate-900 border border-black/60 dark:border-white/20 rounded-xl px-5 py-3
               text-gray-700 dark:text-slate-200 hover:text-cyan-600
              hover:bg-gray-100 dark:hover:bg-slate-800 hover:scale-105 hover:ring-4 hover:ring-cyan-400/30 duration-300 cursor-pointer transition"
              variants={fadeInAnimationVariants}
              initial="initial"
              whileInView="animate"
              viewport={{
                once: true,
              }}
              custom={index}
            >
              {skill}
            </motion.li>
          );

          return isDesktop ? (
            <Link key={index} href="https://www.linkedin.com/in/barkin-kocatepe-6a43922a2/details/skills/" target="_blank" rel="noopener noreferrer">
              {skillItem}
            </Link>
          ) : (
            <div key={index}>{skillItem}</div>
          );
        })}
      </ul>
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.55 }}
      >
        <a
          href="https://www.linkedin.com/in/barkin-kocatepe-6a43922a2/details/certifications/"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3
            bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600
            text-white px-8 py-3 rounded-xl
            font-semibold shadow-lg border 
            border-b-4 border-amber-600 hover:border-amber-600
            hover:scale-110 hover:shadow-xl
            transition"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
        >
          <FiAward className="opacity-90" />
          View My Certificates
          <HiCursorClick className="opacity-90 group-hover:scale-115 transition" />
        </a>
      </motion.div>
    </section>
  );
}
