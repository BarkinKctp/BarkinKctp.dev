"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    window.scrollTo(0, 0.2);
  }, []);

  return (
    <motion.div
      className="relative flex flex-col items-center px-[1rem] min-h-[50px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Floating background clouds - shared across all subpages */}
      <motion.div
        className="fixed top-[6rem] left-[1%] -z-[5] opacity-[0.4] pointer-events-none"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src="/cloud-blue.svg" alt="" width={120} height={83} />
      </motion.div>

      <motion.div
        className="fixed top-[8rem] right-[1%] -z-[5] opacity-[0.4] pointer-events-none"
        animate={{ y: [0, 22, 0], rotate: [0, -4, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src="/cloud-cicd.svg" alt="" width={98} height={75} />
      </motion.div>

      <motion.div
        className="fixed bottom-[8rem] left-[1%] -z-[5] opacity-[0.4] pointer-events-none"
        animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src="/cloud1.svg" alt="" width={113} height={75} />
      </motion.div>

      <motion.div
        className="fixed top-[55%] right-[1%] -z-[5] opacity-[1] pointer-events-none"
        animate={{ y: [0, 25, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src="/cloud2.svg" alt="" width={135} height={90} />
      </motion.div>

      {children}
    </motion.div>
  );
}
