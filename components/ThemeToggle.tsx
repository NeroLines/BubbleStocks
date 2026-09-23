"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "@phosphor-icons/react";

// Light is primary; this flips to dark and remembers the choice. The pre-hydration
// script in layout.tsx applies the stored theme before paint, so no flash.
export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("bs-theme", next); } catch {}
    setDark(!dark);
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid h-9 w-9 place-items-center rounded-full border border-border bg-panel text-ink-soft transition hover:text-ink"
    >
      {dark ? <Sun size={16} weight="bold" /> : <Moon size={16} weight="bold" />}
    </button>
  );
}
