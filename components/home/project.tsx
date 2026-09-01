"use client";

import { useRef } from "react";
import type { Project as ProjectType } from "@/lib/projects";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type ProjectProps = ProjectType & {
  fleetNumber?: number;
  fleetVariant?: "plane" | "blimp";
};

export default function Project({
  title,
  description,
  tags,
  imageUrl,
  link,
  fleetNumber,
  fleetVariant,
}: ProjectProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });
  const scaleProg = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
  const opacityProg = useTransform(scrollYProgress, [0, 1], [0.75, 1]);

  if (fleetVariant) {
    return (
      <motion.div
        className={`fleet-css-unit fleet-css-${fleetVariant}`}
        ref={ref}
        style={{ scale: scaleProg, opacity: opacityProg }}
      >
        <Link href={link} target="_blank" rel="noopener noreferrer" aria-label={`Open ${title} project`}>
          <article className="fleet-css-aircraft" data-fleet={`0${fleetNumber}`}>
            <span className="aircraft-cockpit" aria-hidden="true"><i /><i /></span>
            <span className="aircraft-tail" aria-hidden="true" />
            <span className="aircraft-wing" aria-hidden="true" />
            <span className="blimp-seams" aria-hidden="true" />
            <span className="blimp-gondola" aria-hidden="true"><i /><i /><i /><i /></span>
            <span className="blimp-propeller" aria-hidden="true" />
            <span className="aircraft-light aircraft-light-red" aria-hidden="true" />
            <span className="aircraft-light aircraft-light-green" aria-hidden="true" />
            <span className="aircraft-light aircraft-light-yellow aircraft-light-yellow-front" aria-hidden="true" />
            <span className="aircraft-light aircraft-light-yellow aircraft-light-yellow-lower" aria-hidden="true" />
            <div className="aircraft-project-window">
              <div className="aircraft-project-copy">
                <small>PROJECT 0{fleetNumber}</small>
                <h3>{title}</h3>
                <p>{description}</p>
                <ul>
                  {tags.slice(0, 5).map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </div>
              <Image src={imageUrl} width={450} height={300} alt={`${title} project preview`} className="aircraft-project-image" />
            </div>
          </article>
        </Link>
      </motion.div>
    );
  }

  const sectionContent = (
    <>
      <div
        className="pt-4 pb-7 px-5 sm:pl-10 sm:pt-10
        sm:pr-2 sm:max-w-1/2 flex flex-col h-full
         sm:group-even:ml-[18rem] "
      >
        <h3 className="text-2xl font-semibold text-gray-700 dark:text-slate-100 hover:text-cyan-600">
          {title}
        </h3>
        <p className="mt-2 leading-relaxed text-gray-700 dark:text-slate-300">
          {description}
        </p>
        <ul className="flex flex-wrap mt-4 gap-2 sm:mt-auto">
          {tags.map((tags, index) => (
            <li
              className="bg-gray-700 dark:bg-slate-700 hover:bg-cyan-600 px-3 py-1 text-[0.7rem]
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
        alt={`${title} project preview`}
        className="sm:absolute top-13 sm:-right-40 
          w-full sm:w-[28.25rem] rounded-t-lg shadow-2xl transition 
        group-hover:scale-[1.04] object-cover object-center
        sm:group-hover:-translate-x-3
        sm:group-hover:translate-y-3
        sm:group-hover:-rotate-2

        sm:group-even:group-hover:translate-x-3
        sm:group-even:group-hover:translate-y-3
        sm:group-even:group-hover:rotate-2
        sm:group-even:right-[initial] sm:group-even:-left-40"
      />
    </>
  );

  return (
    <motion.div
      className={`${fleetNumber ? `fleet-unit fleet-${fleetVariant} ` : ""}group cloud-project-wrap mb-[7rem] sm:mb-[10rem] last:mb-0`}
      data-fleet={fleetNumber ? `0${fleetNumber}` : undefined}
      ref={ref}
      style={{
        scale: scaleProg,
        opacity: opacityProg,
      }}
    >
      <Link href={link} target="_blank" rel="noopener noreferrer">
        <section
          className="cloud-project max-w-[42rem] relative overflow-hidden sm:pr-8
    sm:h-[20rem] sm:group-even:pl-8 transition cursor-pointer"
        >
          {sectionContent}
        </section>
      </Link>
    </motion.div>
  );
}
