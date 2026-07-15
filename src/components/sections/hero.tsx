"use client";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MapPin, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import { useHeroBanners, usePlots } from "@/hooks/use-vgg-data";
import { computePlotStats } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

export function Hero() {
  const { data: banners, loading } = useHeroBanners();
  const { data: plots } = usePlots(60000); // refetch every 60s
  const [idx, setIdx] = useState(0);

  const stats = useMemo(() => computePlotStats(plots ?? []), [plots]);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % banners.length), 6000);
    return () => clearInterval(t);
  }, [banners]);

  const current = banners?.[idx];

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background slider */}
      <div className="absolute inset-0 -z-10">
        <AnimatePresence mode="sync">
          {current && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={current.image}
                alt={current.title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/80 via-emerald-900/60 to-amber-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        {/* Animated blobs */}
        <motion.div
          className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-amber-500/20 blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl"
          animate={{ y: [0, -40, 0], x: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 pb-16">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-amber-300 text-sm font-medium mb-6"
          >
            <Sparkles className="h-4 w-4" />
            DTCP Approved Farmland Plots Near Bengaluru
          </motion.div>

          {/* Title */}
          {loading ? (
            <Skeleton className="h-20 w-3/4 bg-white/10 mb-4" />
          ) : (
            <motion.h1
              key={current?.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05]"
            >
              {current?.title?.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="text-gradient-gold">{current?.title?.split(" ").slice(-1)}</span>
            </motion.h1>
          )}

          {/* Subtitle */}
          {!loading && current?.subtitle && (
            <motion.p
              key={`sub-${current?.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 text-lg sm:text-xl text-emerald-50/90 max-w-2xl leading-relaxed"
            >
              {current.subtitle}
            </motion.p>
          )}

          {/* Location */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-4 flex items-center gap-2 text-emerald-100/80 text-sm"
          >
            <MapPin className="h-4 w-4" />
            <span>Anekal · Hosur · Devanahalli · Bengaluru</span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <button
              onClick={() => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })}
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 font-semibold shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 transition-all"
            >
              {current?.ctaText ?? "Explore Projects"}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => document.querySelector("#layout")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full glass text-white font-semibold hover:bg-white/10 transition-colors"
            >
              View Interactive Layout
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl"
          >
            <StatCard label="Total Plots" value={stats.total} color="text-white" />
            <StatCard label="Available" value={stats.available} color="text-emerald-300" />
            <StatCard label="Booked" value={stats.booked} color="text-amber-300" />
            <StatCard label="Sold" value={stats.sold} color="text-rose-300" />
          </motion.div>
        </div>
      </div>

      {/* Slide indicators */}
      {banners && banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === idx ? "w-8 bg-amber-400" : "w-2 bg-white/40 hover:bg-white/60"}`}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 text-white/60 text-xs uppercase tracking-widest z-20"
      >
        <span>Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.div>

      {/* Floating premium badge */}
      <motion.div
        className="absolute top-32 right-8 hidden lg:block z-20"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="glass-card rounded-2xl p-4 max-w-[200px]">
          <div className="flex items-center gap-2 text-amber-300 mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Trending</span>
          </div>
          <p className="text-white text-sm font-medium">Sandalwood plots +18% YoY appreciation</p>
        </div>
      </motion.div>
    </section>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="glass-card rounded-2xl p-4 backdrop-blur-md">
      <AnimatedCounter value={value} className={`text-3xl font-bold ${color}`} />
      <p className="text-white/70 text-xs uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}

function AnimatedCounter({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(start + (value - start) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span className={className}>{display}</span>;
}
