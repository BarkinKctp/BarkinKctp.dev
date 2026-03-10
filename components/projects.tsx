"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { projects } from "@/lib/data";
import Project from "./project";
import Link from "next/link";
import { FaCode } from "react-icons/fa";
import { useSectionInView } from "@/lib/hooks";

export default function Projects() {
  const { ref } = useSectionInView("Projects", 0.7);

  const displayedProjects = projects.slice(0, 3);
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
            bg-gradient-to-r from-sky-500 to-fuchsia-600
            text-white px-8 py-3 rounded-xl
            font-semibold shadow-lg border 
            border-b-4 border-gray-700 hover:border-gray-900
            hover:scale-105 hover:shadow-xl
            transition hover:text-white"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
        >
          <FaCode />
          View All Projects
        </Link>
      </div>
    </section>
  );
}
