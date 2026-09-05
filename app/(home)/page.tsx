import About from "@/components/home/about";
import Experience from "@/components/home/experience";
import Intro from "@/components/home/intro";
import Projects from "@/components/home/projects";
import SectionDivider from "@/components/home/section-divider";
import Skills from "@/components/home/skills";
import Contact from "@/components/home/contact";
import StructuredData from "@/components/structured-data";
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
      <StructuredData />
      <Intro />
      <SectionDivider />
      <About />
      <SectionDivider />
      <Projects projects={projects} />
      <SectionDivider />
      <Experience experiences={experiences} />
      <SectionDivider />
      <Skills skills={skills} />
      <div className="low-altitude-birds" aria-hidden="true">
        <i className="seagull seagull-one" />
        <i className="seagull seagull-two" />
        <i className="seagull seagull-three" />
        <i className="seagull seagull-four" />
        <i className="seagull seagull-five" />
      </div>
      <SectionDivider />
      <Contact />
    </main>
  );
}
