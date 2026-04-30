import About from "@/components/about";
import Experience from "@/components/experience";
import Intro from "@/components/intro";
import Projects from "@/components/projects";
import SectionDivider from "@/components/section-divider";
import Skills from "@/components/skills";
import Contact from "@/components/contact";
import { getProjectsFromDb } from "@/lib/projects";
import { getExperiencesFromDb } from "@/lib/experiences";
import { getSkillsFromDb } from "@/lib/skills";

export default async function Home() {
  const [projects, experiences, skills] = await Promise.all([
    getProjectsFromDb(),
    getExperiencesFromDb(),
    getSkillsFromDb(),
  ]);

  return (
    <main
      className="flex flex-col items-center
    px-[1rem]"
    >
      <Intro />
      <SectionDivider />
      <About />
      <SectionDivider />
      <Projects projects={projects} />
      <SectionDivider />
      <Experience experiences={experiences} />
      <SectionDivider />
      <Skills skills={skills} />
      <SectionDivider />
      <Contact />
    </main>
  );
}
