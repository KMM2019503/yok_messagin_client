"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import LinkButton from "./ui/link";
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
  return mount ? (
    <div className="max-lg:bottom-2.5 lg:top-1/3">
      <LinkButton
        icon={
          currentTheme === "light" ? (
            <Sun className="size-[1rem]" />
          ) : (
            <Moon className="size-[1rem]" />
          )
        }
        type="button"
        className="px-1 rounded-3xl"
        onClick={handleThemeChange}
      />
    </div>
  ) : null;
};
export default ThemeSwitcher;
