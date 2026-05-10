"use client";

import Wordle from "@/components/wordle";
import SectionHeading from "@/components/section-heading";
import Link from "next/link";
import Image from "next/image";
import { BsArrowLeft } from "react-icons/bs";
import { motion } from "framer-motion";

export default function SecretPage() {
  return (
    <motion.div
      className="relative flex flex-col items-center px-4 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Floating background clouds */}
      <motion.div
        className="fixed top-[7rem] left-[2%] -z-[5] opacity-30 pointer-events-none"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src="/bg-images/cloud-blue.svg" alt="" width={120} height={83} />
      </motion.div>
      <motion.div
        className="fixed bottom-[13rem] left-[2%] -z-[5] opacity-60 pointer-events-none"
        animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src="/bg-images/cloud1.svg" alt="" width={113} height={75} />
      </motion.div>
      <motion.div
        className="fixed top-[50%] right-[1%] -z-[5] opacity-60 pointer-events-none"
        animate={{ y: [0, 25, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src="/bg-images/cloud2.svg" alt="" width={135} height={90} />
      </motion.div>

      <motion.main
        className="flex flex-col items-center pb-20 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SectionHeading>Secret Page</SectionHeading>
        </motion.div>

        {/* Discovery message */}
        <motion.p
          className="leading-8 text-gray-800 dark:text-slate-300 mb-8 text-center max-w-[40rem] -mt-4"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          🎉 You found the <span className="font-bold">secret!</span> Enjoy a
          game of <span className="font-bold underline">Wordle</span>.
        </motion.p>

        {/* Wordle card */}
        <motion.div
          className="bg-white dark:bg-slate-900 border-2 border-black/60 dark:border-white/15 
            rounded-lg p-6 sm:p-10 max-w-[42rem] w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, type: "spring", stiffness: 80 }}
          whileHover={{
            boxShadow: "0 20px 50px -12px rgba(0,0,0,0.25)",
            y: -4,
          }}
        >
          <Wordle />
        </motion.div>

        {/* Back to Home */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
    </motion.div>
  );
}
