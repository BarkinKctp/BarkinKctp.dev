"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import SectionHeading from "./section-heading";
import { useSectionInView } from "@/lib/hooks";

export default function About() {
  const { ref } = useSectionInView("About", 0.5);
  return (
    <motion.section
      id="about"
      ref={ref}
      className="mb-[10rem] max-w-[50rem] text-center 
      leading-6 sm:mb-[10rem] scroll-mt-40"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
    >
      <SectionHeading>About Me</SectionHeading>
      <motion.p
        className="leading-8 text-gray-700"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        I am a <span className="font-bold">Software Engineering student</span>{" "}
        in <span className="font-bold">Halic University</span> with a strong
        interest in <span className="underline">Cloud Computing</span>,{" "}
        <span className="underline">DevOps</span>,{" "}
        <span className="underline">Distributed Systems</span>, and{" "}
        <span className="underline">Artificial Intelligence</span>. I enjoy
        building practical projects that combine software development with
        automation and modern infrastructure.
        <br />
        <br />
        Recently, I have been focusing on{" "}
        <span className="font-bold">CI/CD pipelines</span>,{" "}
        <span className="font-bold">cloud deployments</span>, and{" "}
        <span className="font-bold">DevOps</span> using technologies such as{" "}
        <span className="font-bold">Azure</span>,{" "}
        <span className="font-bold">Github Actions</span>,{" "}
        <span className="font-bold">Docker</span>,{" "}
        <span className="font-bold">Linux</span> and{" "}
        <span className="font-bold">React</span>.
        <br />
        <br />
        Outside of technology, I enjoy{" "}
        <span className="font-bold">listening to music</span>,{" "}
        <span className="font-bold">reading books</span>,{" "}
        <span className="font-bold">watching movies</span>, and{" "}
        <span className="font-bold">gaming</span>. I'm also passionate about{" "}
        <span className="font-bold">learning new languages</span> and{" "}
        <span className="font-bold">exploring new places around the world</span>
        . I'm currently learning <span className="font-bold">French</span> and
        playing the <span className="font-bold">piano</span>.{" "}
        <span className="italic text-gray-700">
          I'm always curious and eager to learn something new.
        </span>
      </motion.p>

      <motion.div
        className="mt-8 flex justify-center "
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <Link
          href="/pages/about-me"
          className="group inline-flex items-center gap-3
          bg-gradient-to-r from-emerald-400 to-sky-400
          text-white px-8 py-3 rounded-xl
          font-semibold shadow-lg border 
          border-b-4 border-gray-700 hover:border-gray-900
          hover:scale-105 hover:shadow-xl
          transition hover:text-white"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
        >
          <FaUser />
          More about me
          <BsArrowRight className="opacity-90 group-hover:translate-x-1 transition" />
        </Link>
      </motion.div>
    </motion.section>
  );
}
