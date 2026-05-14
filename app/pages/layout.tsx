"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/context/theme-context";

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useTheme();
  const router = useRouter();
  const [showCat, setShowCat] = useState(true);
  const catClicks = useRef(0);
  const catTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCatClick = useCallback(() => {
    catClicks.current += 1;
    if (catClicks.current >= 2) {
      catClicks.current = 0;
      if (catTimer.current) clearTimeout(catTimer.current);
      router.push("/admin/login");
      return;
    }
    if (catTimer.current) clearTimeout(catTimer.current);
    catTimer.current = setTimeout(() => {
      catClicks.current = 0;
    }, 800);
  }, [router]);

  useEffect(() => {
    window.scrollTo(0, 0.2);
  }, []);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowCat(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(footer);
    return () => observer.disconnect();
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
        className="fixed top-[7rem] left-[2%] -z-[5] opacity-[0.3] pointer-events-none"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src="/bg-images/cloud-blue.svg" alt="" width={120} height={83} />
      </motion.div>

      <motion.div
        className="fixed bottom-[13rem] left-[2%] -z-[5] opacity-[0.6] pointer-events-none"
        animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src="/bg-images/cloud1.svg" alt="" width={113} height={75} />
      </motion.div>

      <motion.div
        className="fixed top-[50%] right-[1%] -z-[5] opacity-[0.6] pointer-events-none"
        animate={{ y: [0, 25, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src="/bg-images/cloud2.svg" alt="" width={135} height={90} />
      </motion.div>

      {/* Floating cat — clickable easter egg */}
      {showCat && (
        <motion.div
          className="fixed bottom-3.5 left-[3%] z-50 text-3xl sm:text-4xl cursor-pointer opacity-40 hover:opacity-90 transition-opacity"
          animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.4 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCatClick}
          title="Meow?"
        >
          {theme === "dark" ? "🐈‍⬛" : "🐈"}
        </motion.div>
      )}

      {children}
    </motion.div>
  );
}
