import About from "@/components/about";
import Experience from "@/components/experience";
import Intro from "@/components/intro";
import Projects from "@/components/projects";
import SectionDivider from "@/components/section-divider";
import Skills from "@/components/skills";
import Contact from "@/components/contact";
import { getProjectsFromDb } from "@/lib/projects";

export default async function Home() {
  const projects = await getProjectsFromDb();

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
      <Experience />
      <SectionDivider />
      <Skills />
      <SectionDivider />
      <Contact />
    </main>
  );
}
