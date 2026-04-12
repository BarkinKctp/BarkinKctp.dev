"use client";

import { projects } from "@/lib/data";
import ProjectCard from "@/components/project-card";
import SectionHeading from "@/components/section-heading";
import GitHubStats from "@/components/github-stats";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import { motion } from "framer-motion";

export default function ProjectsPage() {
  return (
    <motion.main
      className="flex flex-col items-center
      px-[1rem] pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SectionHeading>My Projects</SectionHeading>
      </motion.div>
      <motion.p
        className="leading-8 text-gray-700 dark:text-slate-300 mb-12 text-center max-w-[40rem] -mt-4"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        Here is a collection of all the{" "}
        <span className="font-bold">projects</span> I have worked on. Each one
        reflects my passion for <span className="underline">building</span> and{" "}
        <span className="underline">learning new technologies</span>.
      </motion.p>

      <motion.div
        className="bg-gray-900 dark:bg-slate-950 border-2 border-black/60 dark:border-white/10 rounded-lg p-8 sm:p-10 max-w-[75rem] w-full"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.175 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className={`group p-4${
                index % 2 === 0 ? " sm:border-r sm:border-white/20" : ""
              }${
                index < projects.length - 2
                  ? " border-b border-white/20"
                  : projects.length % 2 !== 0 && index === projects.length - 1
                    ? ""
                    : index < projects.length - 2
                      ? " border-b border-white/20"
                      : ""
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <GitHubStats limit={20} />

      <motion.div
        className="flex justify-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <Link
          href="/#projects"
          className="group bg-gray-900 dark:bg-cyan-600 text-white px-7
            py-3 flex items-center gap-2
            rounded-full outline-none focus:outline-none
            focus:scale-105 hover:scale-105 hover:bg-gray-950 dark:hover:bg-cyan-500
            active:scale-110 transition"
        >
          <BsArrowLeft className="opacity-70 group-hover:-translate-x-1 transition" />
          Back to Home
        </Link>
      </motion.div>
    </motion.main>
  );
}
