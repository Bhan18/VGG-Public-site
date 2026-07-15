"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, ArrowLeft, Database, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { usingLocalFallback } from "./crud";
import { EDITOR_CONFIGS, getGroupedEditors } from "./shared/editor-configs";
import { EditorShell } from "./shared/editor-shell";

const ADMIN_PIN = "1234"; // In production, use real auth (NextAuth / Supabase Auth)

export function ContentManager({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Re-mount inner state when overlay opens (clears pin + auth on each open)
  return (
    <AnimatePresence>
      {open && <ContentManagerInner key={`cm-${open}`} onClose={onClose} />}
    </AnimatePresence>
  );
}

function ContentManagerInner({ onClose }: { onClose: () => void }) {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [activeTable, setActiveTable] = useState<string>("hero_banners");
  const [checking, setChecking] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setTimeout(() => {
      if (pin === ADMIN_PIN) {
        setAuthed(true);
        toast.success("Welcome to VGG Admin");
      } else {
        toast.error("Incorrect PIN");
      }
      setChecking(false);
    }, 400);
  };

  const grouped = getGroupedEditors();
  const activeConfig = EDITOR_CONFIGS.find((c) => c.table === activeTable);

  return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-background"
      >
          {!authed ? (
            // Auth gate
            <div className="min-h-screen flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full glass-card rounded-3xl p-8 shadow-2xl gradient-border"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center mb-4">
                    <Lock className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold">Admin Access</h2>
                  <p className="text-sm text-muted-foreground mt-1">Enter PIN to manage website content</p>
                </div>
                <form onSubmit={handleAuth} className="space-y-4">
                  <Input
                    type="password"
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="text-center text-2xl tracking-[0.5em] h-14"
                    autoFocus
                  />
                  <Button type="submit" className="w-full h-12" disabled={checking || !pin}>
                    {checking ? <Loader2 className="h-5 w-5 animate-spin" /> : "Unlock"}
                  </Button>
                </form>
                <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300">
                  <p className="font-semibold mb-1">Demo PIN: 1234</p>
                  <p>In production, integrate with your existing NextAuth / Supabase Auth from the admin dashboard.</p>
                </div>
                <Button variant="ghost" className="w-full mt-4" onClick={onClose}>
                  Back to Website
                </Button>
              </motion.div>
            </div>
          ) : (
            // Admin shell
            <div className="h-screen flex flex-col lg:flex-row">
              {/* Sidebar */}
              <aside className="lg:w-72 lg:flex-shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-secondary/30 overflow-y-auto">
                <div className="p-4 sticky top-0 bg-secondary/30 backdrop-blur z-10 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center">
                        <Database className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">VGG Admin</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Content Manager</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close admin" className="lg:hidden">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  {usingLocalFallback() && (
                    <div className="mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-700 dark:text-amber-300">
                      <p className="font-semibold">Local Mode</p>
                      <p>Changes save to browser. Connect Supabase to persist.</p>
                    </div>
                  )}
                </div>

                <nav className="p-3 space-y-4">
                  {grouped.map((group) => (
                    <div key={group.label}>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2 px-2">
                        {group.label}
                      </p>
                      <div className="space-y-1">
                        {group.configs.map((c) => {
                          const Icon = c.icon;
                          const isActive = activeTable === c.table;
                          return (
                            <button
                              key={c.table}
                              onClick={() => setActiveTable(c.table)}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                  ? "bg-primary text-primary-foreground shadow-sm"
                                  : "text-foreground hover:bg-secondary"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                              <span className="flex-1 text-left">{c.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>

                <div className="p-3 border-t border-border">
                  <Button variant="outline" className="w-full" onClick={onClose}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Website
                  </Button>
                </div>
              </aside>

              {/* Main content */}
              <main className="flex-1 overflow-y-auto">
                <div className="sticky top-0 bg-background/80 backdrop-blur z-20 border-b border-border p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Admin</span>
                    <span>/</span>
                    <span className="font-semibold text-foreground">{activeConfig?.title}</span>
                  </div>
                  <a
                    href="/"
                    target="_blank"
                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                  >
                    View Website <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="p-4 md:p-6 max-w-6xl mx-auto">
                  {activeConfig && <EditorShell key={activeConfig.table} config={activeConfig} />}
                </div>
              </main>
            </div>
          )}
      </motion.div>
  );
}
