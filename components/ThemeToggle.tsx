"use client";
import { useSyncExternalStore } from "react";
import { Sun, Moon } from "@phosphor-icons/react";

const THEME_EVENT = "bubblestocks:theme-change";
const subscribe = (notify: () => void) => {
  window.addEventListener(THEME_EVENT, notify);
  return () => window.removeEventListener(THEME_EVENT, notify);
};
const getTheme = () => document.documentElement.getAttribute("data-theme") === "dark";
const getServerTheme = () => false;

// Light is primary; this flips to dark and remembers the choice. The pre-hydration
// script in layout.tsx applies the stored theme before paint, so no flash.
export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("bs-theme", next); } catch {}
    window.dispatchEvent(new Event(THEME_EVENT));
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
