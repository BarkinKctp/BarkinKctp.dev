import About from "@/components/about";
import Intro from "@/components/intro";
import Projects from "@/components/projects";
import SectionDivider from "@/components/section-divier";

export default function Home() {
  return (
    <main
      className="flex flex-col items-center
    px-[1rem]"
    >
      <Intro />
      <SectionDivider />
      <About />
      <SectionDivider />
      <Projects />
    </main>
  );
}
