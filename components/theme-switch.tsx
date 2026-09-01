"use client";

import { useTheme } from "@/app/context/theme-context";
import { BsMoon, BsSun } from "react-icons/bs";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="helicopter-theme-switch fixed bottom-5 right-5 z-[999]"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <span className="helicopter-rotor" aria-hidden="true" />
      <span className="helicopter-tail" aria-hidden="true" />
      <span className="helicopter-body">
        {theme === "light" ? <BsMoon /> : <BsSun />}
      </span>
    </button>
  );
}
