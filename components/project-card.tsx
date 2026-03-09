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
        className="bg-gray-100 border border-black/15 overflow-hidden 
        rounded-lg hover:bg-gray-200 transition flex flex-col h-full"
      >
        <div className="relative w-full h-[10rem] overflow-hidden">
          <Image
            src={imageUrl}
            fill
            alt={title}
            className="object-cover object-center transition 
            group-hover:scale-[1.06]
            group-hover:translate-x-3
            group-hover:translate-y-3
            group-hover:rotate-2

            group-even:group-hover:-translate-x-3
            group-even:group-hover:translate-y-3
            group-even:group-hover:-rotate-2"
          />
        </div>
        <div className="pt-4 pb-6 px-5 flex flex-col flex-1">
          <h3 className="text-xl font-semibold text-gray-700 hover:text-cyan-600 transition">
            {title}
          </h3>
          <p className="mt-2 leading-relaxed text-gray-700 text-sm">
            {description}
          </p>
          <ul className="flex flex-wrap mt-4 gap-2 pt-2">
            {tags.map((tag, index) => (
              <li
                className="bg-gray-700 hover:bg-cyan-600 px-3 py-1 text-[0.65rem] 
                uppercase tracking-wider text-white rounded-full transition"
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
