"use client";
import { motion } from "framer-motion";
export default function SectionDivider() {
  return (
    <motion.div
      className="bg-gray-700 mb-[10rem] h-18 w-[0.42rem] hidden hover:bg-cyan-600 
      transition rounded-full border-[0.02rem] sm:block "
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut", delay: 0.2 }}
    ></motion.div>
  );
}
