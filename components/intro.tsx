"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { HiDownload } from "react-icons/hi";
import { BsArrowRight, BsLinkedin } from "react-icons/bs";
import { FaGithubSquare } from "react-icons/fa";
import { useSectionInView } from "@/lib/hooks";
import { Github, LinkedIn } from "@/lib/links";
import { useActiveSection } from "@/app/context/active-section-context";

export default function Intro() {
  const { ref } = useSectionInView("Home", 0.5);
  const { setActiveSection } = useActiveSection();
  return (
    <section
      id="home"
      ref={ref}
      className="mb-[4rem] max-w-[50rem] 
    text-center sm:mb-[4rem] scroll-mt-100 "
    >
      <div className="flex items-center justify-center ">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: "tween", delay: 0.1 }}
            whileHover={{ scale: 1.08 }}
          >
            <Image
              src="/bg-images/barkin-portrait.jpeg"
              alt="Barkin Portrait"
              width={192}
              height={192}
              priority={true}
              className="h-[8rem] w-[8rem] rounded-full hover:border-cyan-500 hover:shadow-2xl
              transition object-cover border-[0.24rem] border-white dark:border-slate-800 shadow-xl shadow-black/20"
            />
            <motion.span
              className="absolute bottom-[-0.3rem] right-[-0.3rem] text-4xl"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 125,
                delay: 0.4,
                duration: 0.7,
              }}
            >
              👋
            </motion.span>
          </motion.div>
        </div>
      </div>
      <motion.h1
        className="mb-[2.5rem] mt-[1rem] px-[1rem] text-xl 
        font-medium !leading-[1.5] sm:text-[1.5rem]"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.3 }}
      >
        <span className="font-bold">Hello, I'm Barkin Kocatepe. </span>I'm a{" "}
        <span className="font-bold"> Software Engineering student </span>
        with <span className="font-bold"> 2.5 years of experience </span>
        working on{" "}
        <span className="font-bold">
          {" "}
          cloud platforms and developer infrastructure.{" "}
        </span>{" "}
        My focus is{" "}
        <span className="underline ">
          {" "}
          Cloud Computing, Distributed Systems,{" "}
        </span>{" "}
        <span className="underline "> DevOps</span> and{" "}
        <span className="underline ">Artificial Intelligence</span>.
      </motion.h1>
      <motion.div
        className="flex flex-col sm:flex-row items-center
      justify-center gap-2 font-medium"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut", delay: 0.2 }}
      >
        <Link
          href="#contact"
          className="group bg-gray-900 dark:bg-cyan-600 text-white px-7
        py-3 flex items-center gap-2 
        rounded-full outline-none focus:outline-none 
        focus:scale-105 hover:scale-105 hover:bg-gray-950 dark:hover:bg-cyan-500
        active:scale-110 transition"
          onClick={() => setActiveSection("Contact")}
        >
          Contact me here{" "}
          <BsArrowRight className="opacity-70 group-hover:translate-x-1 transition" />
        </Link>
        <a
          className="group bg-white dark:bg-slate-900 px-7 py-3 flex items-center gap-[0.5rem]
        rounded-full outline-none border border-black/60 dark:border-white/15 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-800
        hover:scale-107 focus:scale-107 active:scale-112 transition"
          href="/Barkin_Kocatepe-Resume.pdf"
          download
        >
          Download CV{" "}
          <HiDownload className="opacity-60 group-hover:translate-y-1 transition" />{" "}
        </a>
        <a
          className="bg-white dark:bg-slate-900 p-4 text-gray-700 dark:text-slate-200
        flex items-center gap-[0.5rem] text-[1.3rem] rounded-full 
        border border-black/60 dark:border-white/15 hover:bg-gray-200 dark:hover:bg-slate-800 hover:text-blue-700
        hover:scale-110 focus:scale-110 active:scale-115 transition"
          href={LinkedIn}
          target="_blank"
        >
          <BsLinkedin className="opacity-100 " />{" "}
        </a>
        <a
          className="bg-white dark:bg-slate-900 p-4 text-gray-700 dark:text-slate-200
        flex items-center gap-[0.5rem] text-[1.3rem] hover:text-gray-950
        rounded-full border border-black/60 dark:border-white/15 hover:bg-gray-200 dark:hover:bg-slate-800 dark:hover:text-white
        hover:scale-110 focus:scale-110 active:scale-115 transition"
          href={Github}
          target="_blank"
        >
          <FaGithubSquare className="opacity-100 " />{" "}
        </a>
      </motion.div>
    </section>
  );
}
