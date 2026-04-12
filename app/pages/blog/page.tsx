"use client";

import SectionHeading from "@/components/section-heading";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import { motion } from "framer-motion";

export default function BlogPage() {
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
        <SectionHeading>My Blog</SectionHeading>
      </motion.div>

      <motion.p
        className="leading-8 text-gray-700 dark:text-slate-300 mb-12 text-center max-w-[40rem] -mt-4"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        Coming soon! I'll be sharing my thoughts on <span className="font-bold">DevOps</span>, <span className="font-bold">cloud architecture</span>, and 
        <span className="underline"> technology advancements</span>.
      </motion.p>

      <motion.div
        className="bg-gray-900 dark:bg-slate-950 border-2 border-black/60 dark:border-white/10 rounded-lg p-8 sm:p-10 max-w-[75rem] w-full min-h-[20rem] flex items-center justify-center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.175 }}
      >
        <div className="text-center space-y-4">
          <p className="text-gray-400 text-lg">Blog posts coming soon...</p>
          <p className="text-gray-500 text-sm">Check back later for technical articles and insights</p>
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
