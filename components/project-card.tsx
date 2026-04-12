"use client";

import { useRef } from "react";
import { projects } from "@/lib/data";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

type ProjectCardProps = (typeof projects)[number];

export default function ProjectCard({
  title,
  description,
  tags,
  imageUrl,
  link,
}: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });
  const scaleProg = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProg = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  return (
    <motion.div
      ref={ref}
      style={{
        scale: scaleProg,
        opacity: opacityProg,
      }}
    >
      <section
        className="group bg-slate-900 border-2 border-white/35 overflow-hidden 
        rounded-lg hover:bg-slate-800 transition-colors duration-300 flex flex-col h-full min-h-[20rem] sm:min-h-[25rem]"
      >
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-full h-[8rem] sm:h-[11rem] overflow-hidden rounded-t-lg border-b border-white/15 bg-gray-900 block cursor-pointer"
        >
          <Image
            src={imageUrl}
            fill
            alt={title}
            className="object-cover object-center transition-transform duration-300 will-change-transform
            group-hover:scale-[1.06]
            group-hover:translate-x-1
            group-hover:translate-y-1
            group-hover:rotate-1

            group-even:group-hover:-translate-x-1
            group-even:group-hover:translate-y-1
            group-even:group-hover:-rotate-1"
          />
        </a>
        <div className="pt-4 pb-6 px-5 flex flex-col flex-1">
          <h3 className="text-lg font-semibold text-white hover:text-cyan-300 transition">
            {title}
          </h3>
          <p className="mt-2 leading-relaxed text-gray-200 text-[0.95rem]">
            {description}
          </p>
          <ul className="flex flex-wrap justify-center mt-auto gap-2 pt-3">
            {tags.map((tag, index) => (
              <li
                className="bg-slate-700 hover:bg-cyan-700 px-[0.63rem] py-[0.52rem] text-[0.7rem] 
                uppercase tracking-wider text-white rounded-full transition "
                key={index}
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </motion.div>
  );
}
