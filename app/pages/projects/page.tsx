import type { Metadata } from "next";
import { getProjectsFromDb } from "@/lib/projects";
import ProjectsClient from "./projects-client";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected software projects by Barkin Kocatepe across cloud, distributed systems, and DevOps.",
  alternates: { canonical: "/pages/projects" },
  openGraph: {
    title: "Projects | Barkin Kocatepe",
    description:
      "Selected software projects by Barkin Kocatepe across cloud, distributed systems, and DevOps.",
    url: "https://barkinkocatepe.dev/pages/projects",
  },
};

export default async function ProjectsPage() {
  const projects = await getProjectsFromDb();

  return <ProjectsClient projects={projects} />;
}
