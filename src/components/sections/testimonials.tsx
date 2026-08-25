"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { useTestimonials } from "@/hooks/use-vgg-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function Testimonials() {
  const { data: items, loading } = useTestimonials();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIdx((i) => (i + 1) % Math.max(1, items?.length ?? 1)), [items]);
  const prev = () => setIdx((i) => (i - 1 + Math.max(1, items?.length ?? 1)) % Math.max(1, items?.length ?? 1));

  useEffect(() => {
    if (paused || !items || items.length <= 1) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [paused, items, next]);

  return (
    <section
      id="testimonials"
      className="py-20 md:py-28 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-xs font-semibold uppercase tracking-widest mb-4">
            <MessageSquare className="h-3.5 w-3.5" /> Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            What Our <span className="text-gradient-gold">Customers Say</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            Real stories from real plot owners. From first-time investors to seasoned buyers, our customers trust VGG Infra
            for transparency, quality, and lifelong partnership in their farmland journey.
          </p>
        </motion.div>

        {loading ? (
          <Skeleton className="max-w-3xl mx-auto h-64 rounded-3xl" />
        ) : items && items.length > 0 ? (
          <div className="max-w-4xl mx-auto">
            <div className="relative glass-card rounded-3xl p-8 md:p-12 gradient-border">
              <Quote className="absolute top-6 left-6 h-12 w-12 text-primary/15" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={items[idx].id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="relative"
                >
                  {/* Rating */}
                  <div className="flex gap-1 mb-4 justify-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < items[idx].rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30"}`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-lg md:text-xl text-foreground leading-relaxed text-center mb-6 italic">
                    &ldquo;{items[idx].text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-center gap-4">
                    {items[idx].photo ? (
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary/30">
                        <Image src={items[idx].photo} alt={items[idx].name} fill className="object-cover" sizes="56px" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                        {items[idx].name.charAt(0)}
                      </div>
                    )}
                    <div className="text-left">
                      <p className="font-bold">{items[idx].name}</p>
                      {items[idx].role && <p className="text-sm text-muted-foreground">{items[idx].role}</p>}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Nav buttons */}
              {items.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 md:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-card"
                    onClick={prev}
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 md:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-card"
                    onClick={next}
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>

            {/* Dots */}
            {items.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${i === idx ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
