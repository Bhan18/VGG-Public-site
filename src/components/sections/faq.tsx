"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Search, Plus, Minus, ChevronDown } from "lucide-react";
import { useFAQs } from "@/hooks/use-vgg-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

export function FAQ() {
  const { data: faqs, loading } = useFAQs();
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    (faqs ?? []).forEach((f) => { if (f.category) set.add(f.category); });
    return ["All", ...Array.from(set)];
  }, [faqs]);

  const filtered = useMemo(
    () => (faqs ?? []).filter((f) => {
      if (category !== "All" && f.category !== category) return false;
      if (search && !f.question.toLowerCase().includes(search.toLowerCase()) && !f.answer.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }),
    [faqs, search, category]
  );

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-4">
            <HelpCircle className="h-3.5 w-3.5" /> FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Questions? <span className="text-gradient-green">We've Got Answers</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            Everything you need to know about buying a farmland plot with VGG Infra Developers. Can't find what you're looking for?
            Our team is just a phone call away.
          </p>
        </motion.div>

        {/* Search + category */}
        <div className="max-w-3xl mx-auto mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 rounded-full bg-secondary/40 border-border text-base"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  category === c ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/70"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto space-y-3">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No FAQs match your search.</div>
          ) : (
            filtered.map((faq, i) => {
              const isOpen = openId === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-card rounded-2xl overflow-hidden transition-all ${isOpen ? "gradient-border shadow-lg shadow-primary/5" : ""}`}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full p-5 flex items-center justify-between gap-4 text-left hover:bg-secondary/30 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      {faq.category && (
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider mt-1">
                          {faq.category}
                        </span>
                      )}
                      <span className="font-semibold text-foreground">{faq.question}</span>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isOpen ? "bg-primary text-primary-foreground rotate-180" : "bg-secondary"}`}>
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
