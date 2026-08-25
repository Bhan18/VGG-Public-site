"use client";
import { useState, useEffect } from "react";
import { Info, X, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function DemoDataBanner() {
  const [show, setShow] = useState(false);
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    // Check if Supabase is configured by hitting our API
    fetch("/api/status")
      .then((r) => r.json())
      .then((d) => {
        setConfigured(Boolean(d.configured));
        if (!d.configured) {
          const dismissed = sessionStorage.getItem("demo-banner-dismissed");
          if (!dismissed) setShow(true);
        }
      })
      .catch(() => setConfigured(true));
  }, []);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem("demo-banner-dismissed", "1");
  };

  return (
    <AnimatePresence>
      {show && !configured && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] max-w-2xl w-[calc(100%-2rem)]"
        >
          <div className="glass-card rounded-2xl p-4 shadow-2xl border-amber-500/40 flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Database className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1 text-sm">
              <p className="font-semibold text-foreground mb-1">Showing Demo Data</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Add your Supabase credentials to <code className="px-1 py-0.5 rounded bg-secondary text-foreground">.env</code> file
                (<code className="px-1 py-0.5 rounded bg-secondary text-foreground">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                <code className="px-1 py-0.5 rounded bg-secondary text-foreground">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>), then restart the dev server.
                Run <code className="px-1 py-0.5 rounded bg-secondary text-foreground">scripts/supabase-migration.sql</code> in your Supabase SQL editor to create the new content tables.
                The site will then automatically reflect all admin dashboard updates.
              </p>
            </div>
            <button onClick={dismiss} aria-label="Dismiss" className="w-7 h-7 rounded-full hover:bg-secondary flex items-center justify-center flex-shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
