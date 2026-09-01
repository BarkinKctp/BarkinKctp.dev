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
      className="intro-flight-deck mb-[4rem] max-w-[50rem]
    text-center sm:mb-[4rem] scroll-mt-100 "
    >
      <div className="intro-cloud-layer" aria-hidden="true"><i /><i /><i /></div>
      <div className="flex items-center justify-center ">
        <div className="crew-badge-wrap relative">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: "tween", delay: 0.1 }}
            whileHover={{ scale: 1.08 }}
            className="crew-badge relative h-[8rem] w-[8rem]"
          >
            <div className="aircraft-window">
              <Image
                src="/bg-images/barkin-portrait.jpeg"
                alt="Barkin Portrait"
                width={192}
                height={192}
                priority
                className="h-full w-full object-cover"
              />
              <span className="aircraft-window-glass" aria-hidden="true" />
              <span className="aircraft-window-curtain" aria-hidden="true" />
            </div>
            <motion.span
              className="absolute bottom-[-0.3rem] right-[-0.3rem] z-20 text-4xl"
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
      <motion.p
        className="intro-flight-code"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
      >
        CRUISING ALTITUDE · 40,000 FT
      </motion.p>
      <motion.h1
        className="mb-[2.5rem] mt-[1rem] px-[1rem] text-xl 
        font-medium !leading-[1.5] sm:text-[1.5rem]"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.3 }}
      >
        Hi, I&apos;m <span className="font-bold">Barkın Kocatepe</span> - a Software
        Engineer focused on cloud, DevOps, and automation, with 2.5 years of
        experience in Cloud and DevOps at Microsoft, now continuing in DevOps at
        Siemens.
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
          Contact Tower{" "}
          <BsArrowRight className="opacity-70 group-hover:translate-x-1 transition" />
        </Link>
        <a
          className="group bg-white dark:bg-slate-900 px-7 py-3 flex items-center gap-[0.5rem]
        rounded-full outline-none border border-black/60 dark:border-white/15 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-800
        hover:scale-107 focus:scale-107 active:scale-112 transition cursor-pointer"
          href="/api/resume"
          download="Barkin_Kocatepe-Resume.pdf"
        >
          Download CV{" "}
          <HiDownload className="opacity-60 group-hover:translate-y-1 transition" />{" "}
        </a>
        <div className="intro-social-row">
        <a
          className="intro-social-button"
          href={LinkedIn}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <BsLinkedin />
        </a>
        <a
          className="intro-social-button"
          href={Github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <FaGithubSquare />
        </a>
        </div>
      </motion.div>
    </section>
  );
}
