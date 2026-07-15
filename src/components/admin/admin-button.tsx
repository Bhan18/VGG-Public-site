"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X } from "lucide-react";
import { ContentManager } from "./content-manager";

export function AdminButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 2, type: "spring", stiffness: 200, damping: 15 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-emerald-700 text-primary-foreground shadow-xl shadow-primary/30 flex items-center justify-center group"
        aria-label="Open Admin"
      >
        <Settings className="h-6 w-6 group-hover:rotate-90 transition-transform duration-500" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-background" />
        {/* Tooltip */}
        <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Manage Website Content
        </span>
      </motion.button>

      <ContentManager open={open} onClose={() => setOpen(false)} />
    </>
  );
}
