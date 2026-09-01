"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BsArrowLeft } from "react-icons/bs";

export default function NotFound() {
  return (
    <motion.main
      className="flex flex-col items-center justify-center min-h-screen
      px-[1rem] pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-center space-y-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1 
          className="text-6xl sm:text-8xl font-bold text-gray-900 dark:text-white"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          404
        </motion.h1>
        <motion.h2 
          className="text-2xl sm:text-3xl font-semibold text-gray-700 dark:text-slate-300"
          whileHover={{ scale: 1.02, color: "#06b6d4" }}
          transition={{ duration: 0.3 }}
        >
          Page Not Found
        </motion.h2>
        <motion.p 
          className="text-gray-600 dark:text-slate-400 max-w-[30rem] mx-auto text-sm sm:text-base"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </motion.p>
      </motion.div>

      <motion.div
        className="bg-gray-900 dark:bg-slate-950 border-2 border-black/60 dark:border-white/10 rounded-lg p-8 sm:p-10 max-w-[75rem] w-full mt-12 min-h-[15rem] flex items-center justify-center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.175 }}
      >
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.p 
            className="text-gray-400 text-lg"
            whileHover={{ scale: 1.05, color: "#22d3ee" }}
            transition={{ duration: 0.3 }}
          >
            This page has wandered off into the cloud ☁️
          </motion.p>
          <motion.p 
            className="text-gray-500 text-sm"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            Let&apos;s get you back on track!
          </motion.p>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex justify-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <Link
          href="/"
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
