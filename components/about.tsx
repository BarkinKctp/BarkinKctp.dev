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
        I'm a <span className="font-medium">Software Engineering student</span>{" "}
        with professional experience working with{" "}
        <span className="font-medium">
          cloud infrastructure and DevOps systems
        </span>
        . During my internship at <span className="font-medium">Microsoft</span>
        , I worked with teams focused on{" "}
        <span className="underline">Azure services</span> and{" "}
        <span className="underline">DevOps tooling</span>, gaining hands-on
        experience with modern cloud environments and development workflows.
        <br />
        My main interests are{" "}
        <span className="font-medium">
          Cloud Computing, DevOps, Distributed Systems, and Artificial
          Intelligence
        </span>
        .
        <br />
        <br />
        <span className="italic">When I'm not working on projects</span>, I
        enjoy listening to music, reading books, watching movies, and gaming.
        <br />I also enjoy{" "}
        <span className="font-medium">learning new languages</span> and
        exploring new places around the world.
        <span className="italic text-gray-800 hover:text-cyan-600 transition">
          <br />
          <br />
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
          bg-gradient-to-r from-emerald-400 to-sky-300
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
