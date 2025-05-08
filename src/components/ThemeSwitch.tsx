"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
const ThemeSwitcher = () => {
  const [mount, setMount] = useState(false);
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const handleThemeChange = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };
  useEffect(() => {
    setMount(true);
  }, []);
  console.log(currentTheme);
  return mount ? (
    <div className="max-lg:bottom-2.5 lg:top-1/3">
      <button
        onClick={handleThemeChange}
        type="button"
        className="flex h-10 w-10 p-2 items-center justify-center rounded-md border border-gray-800 text-gray-800 focus:outline-none focus:ring-0 focus:ring-gray-200 dark:border-slate-300 dark:text-white"
      >
        {currentTheme === "light" ? (
          <Sun className="size-4" />
        ) : (
          <Moon className="size-4" />
        )}
      </button>
    </div>
  ) : null;
};
export default ThemeSwitcher;
