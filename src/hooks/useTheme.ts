import { useState, useEffect } from "react";

type Theme = "light" | "dark";

const useTheme = () => {
  const [theme, setThemeState] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = (theme: string) => {
    setThemeState(theme);
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  };
  return { theme, toggleTheme };
};

export default useTheme;
