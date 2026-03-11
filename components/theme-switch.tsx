"use client";

import { useTheme } from "@/app/context/theme-context";
import { BsMoon, BsSun } from "react-icons/bs";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="fixed bottom-5 right-5 z-[999] h-12 w-12 rounded-full border border-black/10
      bg-white/85 text-gray-700 shadow-xl backdrop-blur-sm transition-all
      hover:scale-110 hover:text-cyan-600 active:scale-105
      dark:border-white/10 dark:bg-slate-900/85 dark:text-slate-100"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <span className="flex h-full w-full items-center justify-center">
        {theme === "light" ? <BsMoon /> : <BsSun />}
      </span>
    </button>
  );
}
