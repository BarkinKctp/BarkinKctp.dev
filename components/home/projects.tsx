"use client";

import SectionHeading from "../section-heading";
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
    <section ref={ref} id="projects" className="cloud-projects scroll-mt-40 mb-40">
      <SectionHeading>Project Fleet</SectionHeading>
      <p className="fleet-caption">ACTIVE AIRCRAFT · SELECT A PROJECT</p>
      <div className="fleet-formation">
        {displayedProjects.map((project, index) => (
          <Project
            {...project}
            fleetNumber={index + 1}
            fleetVariant={index % 2 === 0 ? "plane" : "blimp"}
            key={index}
          />
        ))}
      </div>
      <div className="flex justify-center mt-32">
        <Link
          href="/pages/projects"
          className="fleet-hangar-link group inline-flex items-center gap-4"
        >
          <GrProjects />
          View All Projects
          <HiCursorClick className="opacity-90 group-hover:scale-115 transition" />
        </Link>
      </div>
    </section>
  );
}
