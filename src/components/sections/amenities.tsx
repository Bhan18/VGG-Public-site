"use client";
import { motion } from "framer-motion";
import {
  Shield, Route, Zap, Droplet, SprayCan, Home, Smile, Activity, Check, Sprout,
  type LucideIcon,
} from "lucide-react";
import { useAmenities } from "@/hooks/use-vgg-data";
import { Skeleton } from "@/components/ui/skeleton";

const ICON_MAP: Record<string, LucideIcon> = {
  shield: Shield, road: Route, zap: Zap, droplet: Droplet, spray: SprayCan,
  home: Home, smile: Smile, activity: Activity, check: Check, sprout: Sprout,
};

export function Amenities() {
  const { data: amenities, loading } = useAmenities();

  return (
    <section id="amenities" className="py-20 md:py-28 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-4">
            <Sprout className="h-3.5 w-3.5" /> Amenities
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Premium Amenities In <span className="text-gradient-green">Every Project</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            We don't just sell plots — we deliver a complete lifestyle. Every VGG project comes with thoughtfully designed
            infrastructure and amenities that make farmland ownership effortless, secure, and rewarding for years to come.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {(amenities ?? []).map((a, i) => {
              const Icon = ICON_MAP[a.icon ?? ""] ?? Check;
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: (i % 5) * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="group relative rounded-2xl glass-card gradient-border p-5 text-center overflow-hidden"
                >
                  {/* Animated gradient glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/10 transition-all duration-500" />
                  <div className="relative">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-sm md:text-base mb-1.5">{a.title}</h3>
                    {a.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{a.description}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
