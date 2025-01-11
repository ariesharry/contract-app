"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

import { Moon, Sun } from "@/assets/icons";

const ThemeToggler = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme, resolvedTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // If enableSystem is true and the active theme is "system" (when a user firsts visits a website), resolvedTheme returns whether the system preference resolved to "dark" or "light".
  // So we need to set theme to resolvedTheme first time the user visits, but next time the theme is gonna come from localStorage
  if (theme === "system" && resolvedTheme) {
    setTheme(resolvedTheme);
  }

  const toggleTheme = () => {
    theme === "dark" ? setTheme("light") : setTheme("dark");
  };

  return (
    <button
      aria-label="theme toggler"
      onClick={toggleTheme}
      className="p-4 mx-2 sm:mx-4 md:my-2"
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
};

export default ThemeToggler;
