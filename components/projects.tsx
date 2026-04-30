"use client";

import React from "react";
import SectionHeading from "./section-heading";
import type { Project as ProjectType } from "@/lib/projects";
import Project from "./project";
import Link from "next/link";
import { GrProjects } from "react-icons/gr";
import { HiCursorClick } from "react-icons/hi";
import { useSectionInView } from "@/lib/hooks";

export default function Projects({ projects }: { projects: ProjectType[] }) {
  const { ref } = useSectionInView("Projects", 0.5);

  const displayedProjects = projects.slice(0, 2);
  return (
    <section ref={ref} id="projects" className="scroll-mt-40 mb-40">
      <SectionHeading>Projects</SectionHeading>
      <div>
        {displayedProjects.map((project, index) => (
          <React.Fragment key={index}>
            <Project {...project} />
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-center mt-12">
        <Link
          href="/pages/projects"
          className="group inline-flex items-center gap-3
            bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-cyan-700 dark:to-blue-800
            text-white/88 px-8 py-3 rounded-xl
            font-semibold shadow-lg border 
            border-b-4 border-gray-700 dark:border-slate-900 hover:border-gray-900
            hover:scale-110 hover:shadow-xl
            transition hover:text-white"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
        >
          <GrProjects />
          View All Projects
          <HiCursorClick className="opacity-90 group-hover:scale-115 transition" />
        </Link>
      </div>
    </section>
  );
}
