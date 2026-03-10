"use client";
import { motion } from "framer-motion";

export default function ProjectsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative">
      {/* Blue blob - right */}
      <div
        className="bg-blue-200 fixed top-[-6rem] 
        -z-10 right-[-25rem] h-[45rem] w-[60rem] rounded-full 
        blur-[10rem] sm:w-[75rem] md:right-[-33rem]
        lg:right-[-28rem] xl:right-[-15rem] 2xl:right-[-5rem]"
      ></div>
      {/* Sky blob - left */}
      <div
        className="bg-sky-200 fixed top-[-1rem] 
        -z-10 left-[-25rem] h-[45rem] w-[55rem] rounded-full 
        blur-[10rem] sm:w-[65rem] md:left-[-33rem]   
        lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem]"
      ></div>

      {/* Soft lower tint for full-page coverage */}
      <div
        className="bg-cyan-100/45 fixed bottom-[-10rem] 
        -z-10 right-[10%] h-[32rem] w-[32rem] rounded-full blur-[9rem]"
      ></div>

      {/* Background emojis */}
      <motion.div
        className="fixed top-[10rem] right-[7%] -z-[5] opacity-[0.25] pointer-events-none text-[4rem]"
        animate={{ y: [0, -12, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        ⚙️
      </motion.div>

      {children}
    </div>
  );
}
