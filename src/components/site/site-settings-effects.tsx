"use client";
import { useEffect } from "react";
import { useSettings } from "@/hooks/use-vgg-data";

const THEME_STORAGE_KEY = "vgg-theme";

function applyTheme(mode: string) {
  document.documentElement.classList.toggle("dark", mode !== "light");
}

/**
 * Applies admin-controlled site settings that affect the document:
 * - theme_mode: site-wide default theme (visitor's personal choice wins)
 * - company_logo: swaps the browser favicon dynamically
 */
export function SiteSettingsEffects() {
  const { data: settings } = useSettings();
  const themeMode = settings?.themeMode ?? "dark";
  const logo = settings?.companyLogo;

  useEffect(() => {
    const urlTheme = new URLSearchParams(window.location.search).get("theme");
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {}
    applyTheme(urlTheme ?? stored ?? themeMode);
  }, [themeMode]);

  useEffect(() => {
    const handler = (e: Event) => applyTheme((e as CustomEvent<string>).detail);
    window.addEventListener("vgg-theme-change", handler);
    return () => window.removeEventListener("vgg-theme-change", handler);
  }, []);

  useEffect(() => {
    if (!logo) return;
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    const mime = logo.match(/^data:([^;]+);/)?.[1];
    if (mime) link.type = mime;
    link.href = logo;
  }, [logo]);

  return null;
}
