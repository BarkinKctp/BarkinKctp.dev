"use client";
import { motion } from "framer-motion";

export default function AboutMeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative">
      {/* Green blob - right */}
      <div
        className="bg-green-100 fixed top-[-6rem] 
        -z-10 right-[-25rem] h-[45rem] w-[60rem] rounded-full 
        blur-[10rem] sm:w-[75rem] md:right-[-33rem]
        lg:right-[-28rem] xl:right-[-15rem] 2xl:right-[-5rem]"
      ></div>
      {/* Green blob - left */}
      <div
        className="bg-emerald-100 fixed top-[-1rem] 
        -z-10 left-[-25rem] h-[45rem] w-[55rem] rounded-full 
        blur-[10rem] sm:w-[65rem] md:left-[-33rem]   
        lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem]"
      ></div>

      {/* Soft lower tint for full-page coverage */}
      <div
        className="bg-lime-100/25 fixed bottom-[-10rem] 
        -z-10 left-[12%] h-[32rem] w-[32rem] rounded-full blur-[9rem]"
      ></div>

      {/* Background emojis */}
      <motion.div
        className="fixed top-[16rem] left-[6%] -z-[5] opacity-[0.14] pointer-events-none text-[4rem]"
        animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        🌍
      </motion.div>

      <motion.div
        className="fixed top-[34rem] right-[6%] -z-[5] opacity-[0.14] pointer-events-none text-[3.35rem] "
        animate={{ y: [0, 14, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      >
        🎵
      </motion.div>

      <motion.div
        className="fixed top-[78%] left-[1%] -z-[5] opacity-[0.14] pointer-events-none text-[4rem]"
        animate={{ y: [0, -10, 0], x: [0, 12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        📚
      </motion.div>

      <motion.div
        className="fixed top-[10rem] right-[6%] -z-[5] opacity-[0.14] pointer-events-none text-[4rem]"
        animate={{ y: [0, -11, 0], x: [0, 13, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      >
        ✈️
      </motion.div>

      {children}
    </div>
  );
}
