"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const THEME_STORAGE_KEY = "vgg-theme";

export function ThemeToggle({ onDark = false }: { onDark?: boolean }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
    window.dispatchEvent(new CustomEvent("vgg-theme-change", { detail: next }));
    setIsDark(next === "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={toggle}
      className={cn("rounded-full", onDark ? "text-white hover:bg-white/15" : "hover:bg-accent/20")}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-400" />
      ) : onDark ? (
        <Moon className="h-5 w-5 text-white" />
      ) : (
        <Moon className="h-5 w-5 text-primary" />
      )}
    </Button>
  );
}
