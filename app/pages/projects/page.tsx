"use client";

import { projects } from "@/lib/data";
import ProjectCard from "@/components/project-card";
import SectionHeading from "@/components/section-heading";
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
        className="leading-8 text-gray-700 mb-12 text-center max-w-[40rem] -mt-4"
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
        className="bg-white border border-3 border-black/30 rounded-lg p-8 sm:p-10 max-w-[65rem] w-full"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.175 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className={`group p-4${
                index % 2 === 0 ? " sm:border-r sm:border-black/15" : ""
              }${
                index < projects.length - 2
                  ? " border-b border-black/15"
                  : projects.length % 2 !== 0 && index === projects.length - 1
                    ? ""
                    : index < projects.length - 2
                      ? " border-b border-black/15"
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

      <motion.div
        className="flex justify-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <Link
          href="/#projects"
          className="group bg-gray-900 text-white px-8 py-3
            flex items-center gap-3 rounded-full outline-none
            focus:outline-none focus:scale-105 hover:scale-105
            hover:bg-gray-950 active:scale-110 transition
            font-semibold"
        >
          <BsArrowLeft className="opacity-70 group-hover:-translate-x-1 transition" />
          Back to Home
        </Link>
      </motion.div>
    </motion.main>
  );
}
