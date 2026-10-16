"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

export function useTheme() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    setTheme(stored);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  return { theme, toggleTheme };
}
