"use client";
import { motion } from "framer-motion";
export default function SectionDivider() {
  return (
    <motion.div
      className="bg-white my-12 h-18 w-[0.42rem] hidden
        rounded-full border-[0.23rem] sm:block border-black/20"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut", delay: 0.2 }}
    ></motion.div>
  );
}
