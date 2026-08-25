"use client";
import { useEffect } from "react";
import { useSettings } from "@/hooks/use-vgg-data";

/**
 * Applies admin-controlled site settings that affect the document:
 * - theme_mode: toggles the `dark` class on <html> for all visitors
 * - company_logo: swaps the browser favicon dynamically
 */
export function SiteSettingsEffects() {
  const { data: settings } = useSettings();
  const themeMode = settings?.themeMode ?? "dark";
  const logo = settings?.companyLogo;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", themeMode !== "light");
  }, [themeMode]);

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
