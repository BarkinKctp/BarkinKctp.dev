"use client";

import SectionHeading from "./section-heading";
import { skills } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { motion } from "framer-motion";

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

  return (
    <section
      id="skills"
      ref={ref}
      className="mb-[9rem] max-w-[53rem] 
      scroll-mt-40 text-center sm:mb-36"
    >
      <SectionHeading>My skills</SectionHeading>
      <ul
        className="flex flex-wrap justify-center 
      gap-2 text-lg text-gray-800"
      >
        {skills.map((skill, index) => (
          <motion.li
            className="bg-white border border-black rounded-xl px-5 py-3
             text-gray-700 hover:text-cyan-600
            hover:bg-gray-100 hover:scale-105 hover:ring-4 hover:ring-cyan-400/30 duration-300 cursor-default transition "
            key={index}
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
        ))}
      </ul>
    </section>
  );
}
