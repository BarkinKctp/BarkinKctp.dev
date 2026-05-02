import { getProjectsFromDb } from "@/lib/projects";
import ProjectsClient from "./projects-client";

export default async function ProjectsPage() {
  const projects = await getProjectsFromDb();

  return <ProjectsClient projects={projects} />;
}
