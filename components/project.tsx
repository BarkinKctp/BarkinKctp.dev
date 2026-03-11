"use client";

import { useRef } from "react";
import { projects } from "@/lib/data";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

type ProjectProps = (typeof projects)[number];

export default function Project({
  title,
  description,
  tags,
  imageUrl,
}: ProjectProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });
  const scaleProg = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
  const opacityProg = useTransform(scrollYProgress, [0, 1], [0.75, 1]);
  return (
    <motion.div
      className="group mb-[7rem] sm:mb-[10rem] last:mb-0 "
      ref={ref}
      style={{
        scale: scaleProg,
        opacity: opacityProg,
      }}
    >
      <section
        className=" bg-gray-100 max-w-[42rem] relative 
    border border-black/15 overflow-hidden sm:pr-8 rounded-lg 
    relative sm:h-[20rem] group-even:pl-8 hover:bg-gray-200 transition"
      >
        <div
          className="pt-4 pb-7 px-5 sm:pl-10 sm:pt-10
      sm:pr-2 sm:max-w-1/2 flex flex-col h-full
       group-even:ml-[18rem] "
        >
          <h3 className="text-2xl font-semibold text-gray-700 hover:text-cyan-600">
            {title}
          </h3>
          <p className="mt-2 leading-relaxed text-gray-700">{description}</p>
          <ul className="flex flex-wrap mt-4 gap-2 sm:mt-auto">
            {tags.map((tags, index) => (
              <li
                className="bg-gray-700 hover:bg-cyan-600 px-3 py-1 text-[0.7rem] 
          uppercase tracking-wider text-white rounded-full transition"
                key={index}
              >
                {tags}
              </li>
            ))}
          </ul>
        </div>
        <Image
          src={imageUrl}
          width={450}
          height={300}
          alt="Projects that I worked on"
          className="absolute hidden sm:block top-13 -right-40 
          w-[28.25rem] rounded-t-lg shadow-2xl transition 
        group-hover:scale-[1.04] object-cover object-center
        group-hover:-translate-x-3
        group-hover:translate-y-3
        group-hover:-rotate-2

        group-even:group-hover:translate-x-3
        group-even:group-hover:translate-y-3
        group-even:group-hover:rotate-2
        group-even:right-[initial] group-even:-left-40"
        />
      </section>
    </motion.div>
  );
}
