"use client";

import SectionHeading from "../section-heading";
import { useSectionInView } from "@/lib/hooks";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { FiAward } from "react-icons/fi";
import { HiCursorClick } from "react-icons/hi";

interface SkillItem {
  id: string;
  name: string;
  order: number;
}

const desktopMediaQuery = "(min-width: 640px)";

function subscribeToDesktopView(onChange: () => void) {
  const mediaQuery = window.matchMedia(desktopMediaQuery);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getDesktopSnapshot() {
  return window.matchMedia(desktopMediaQuery).matches;
}

type SkillAnimationCustom = {
  index: number;
  rowSize: number;
  simultaneous: boolean;
};

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: -120,
    rotate: -7,
  },
  animate: ({ index, rowSize, simultaneous }: SkillAnimationCustom) => {
    const row = Math.floor(index / rowSize);
    const column = index % rowSize;

    return {
    opacity: 1,
    y: 0,
    rotate: index % 2 === 0 ? -1.2 : 1.2,
    transition: {
      delay: simultaneous ? 0 : row * 2.35 + column * 0.08,
      type: "tween" as const,
      duration: 1.55,
      ease: [0.18, 0.65, 0.28, 1] as const,
    },
  };
  },
};

export default function Skills({ skills }: { skills: SkillItem[] }) {
  const { ref } = useSectionInView("Skills");
  const isDesktop = useSyncExternalStore(
    subscribeToDesktopView,
    getDesktopSnapshot,
    () => false,
  );
  const rowSize = isDesktop ? 8 : Math.max(skills.length, 1);
  const rowCount = Math.ceil(skills.length / rowSize);

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
          const row = Math.floor(index / rowSize);
          const column = index % rowSize;
          const landingDelay = row * 2.35 + column * 0.08;
          const skillItem = (
            <motion.li
              key={skill.id}
              className="cargo-skill px-5 py-3 hover:scale-105 duration-300 cursor-pointer transition"
              variants={fadeInAnimationVariants}
              initial="initial"
              whileInView="animate"
              viewport={{
                once: true,
                amount: 0.65,
              }}
              custom={{ index, rowSize, simultaneous: !isDesktop }}
            >
              <motion.div
                className="cargo-parachute"
                aria-hidden="true"
                initial={{ opacity: 1, scale: 1, y: 0 }}
                whileInView={{ opacity: 0, scale: 0.58, y: 14 }}
                viewport={{ once: true, amount: 0.65 }}
                transition={{ delay: landingDelay + 1.48, duration: 0.48 }}
              >
                <i />
                <i />
              </motion.div>
              <Link href="https://www.linkedin.com/in/barkin-kocatepe-6a43922a2/details/skills/" target="_blank" rel="noopener noreferrer">
                <span className="cargo-label">{skill.name}</span>
              </Link>
            </motion.li>
          );

          return skillItem;
        })}
      </ul>
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: rowCount * 2.35 + 0.25 }}
      >
        <a
          href="https://www.linkedin.com/in/barkin-kocatepe-6a43922a2/details/certifications/"
          target="_blank"
          rel="noopener noreferrer"
          className="flight-log-link certificates-flight-link group"
        >
          <FiAward className="opacity-90" />
          View My Certificates
          <HiCursorClick className="opacity-90 group-hover:scale-115 transition" />
        </a>
      </motion.div>
    </section>
  );
}
