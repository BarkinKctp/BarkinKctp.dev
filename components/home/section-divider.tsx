"use client";

import { motion } from "framer-motion";
import { FaPlane } from "react-icons/fa";

export default function SectionDivider() {
  return (
    <div className="flight-divider" aria-hidden="true">
      <motion.div
        className="flight-divider-plane"
        initial={{ x: -90, opacity: 0 }}
        whileInView={{ x: 90, opacity: [0, 1, 1, 0] }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      ><FaPlane /></motion.div>
    </div>
  );
}
