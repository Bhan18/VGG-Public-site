"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Sprout, Target, Eye, Heart, Award, Trees, Users, Check } from "lucide-react";
import { useStats, useTimeline } from "@/hooks/use-vgg-data";
import { Skeleton } from "@/components/ui/skeleton";

const ICONS: Record<string, React.ElementType> = {
  trees: Trees, users: Users, award: Award, check: Check, sprout: Sprout,
};

export function About() {
  const { data: stats, loading: statsLoading } = useStats();
  const { data: timeline, loading: tlLoading } = useTimeline();

  return (
    <section id="about" className="py-20 md:py-28 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-4">
            <Sprout className="h-3.5 w-3.5" /> Our Story
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Cultivating <span className="text-gradient-green">Trusted Farmland</span> Investments Since 2010
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            VGG Infra Developers was founded with a singular mission: to make premium farmland ownership accessible,
            transparent, and rewarding. Over 15 years, we have delivered 12+ DTCP-approved projects across 47 acres,
            helping 850+ families own a piece of nature that grows in value year after year. Every plot we sell comes
            with clear titles, modern infrastructure, and the personal attention of our founding team.
          </p>
        </motion.div>

        {/* Stats counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20">
          {statsLoading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
            : (stats ?? []).map((stat, i) => {
                const Icon = ICONS[stat.icon ?? ""] ?? Award;
                return (
                  <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="glass-card rounded-2xl p-6 text-center gradient-border"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-3xl md:text-4xl font-extrabold text-gradient-green">
                      <CountUp value={stat.value} />
                      {stat.suffix}
                    </div>
                    <p className="mt-1 text-xs md:text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  </motion.div>
                );
              })}
        </div>

        {/* Vision / Mission / Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <ValueCard
            icon={Eye}
            title="Our Vision"
            desc="To be South India's most trusted farmland developer, creating sustainable green investments that families cherish for generations."
            delay={0}
          />
          <ValueCard
            icon={Target}
            title="Our Mission"
            desc="Deliver DTCP-approved farmland plots with clear titles, modern amenities, and transparent pricing — making land ownership simple and secure."
            delay={0.1}
          />
          <ValueCard
            icon={Heart}
            title="Our Values"
            desc="Integrity, sustainability, and customer-first thinking guide every decision. We treat your investment like our own family's legacy."
            delay={0.2}
          />
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-center mb-12"
          >
            Our Journey Through The Years
          </motion.h3>
          {tlLoading ? (
            <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 via-accent/40 to-transparent md:-translate-x-1/2" />
              <div className="space-y-8">
                {(timeline ?? []).map((ev, i) => (
                  <motion.div
                    key={ev.id}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: 0.05 * i }}
                    className={`relative flex items-center gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-md md:-translate-x-1/2 z-10" />
                    {/* Card */}
                    <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <div className="glass-card rounded-2xl p-5 gradient-border">
                        <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-xs font-bold mb-2">
                          {ev.year}
                        </span>
                        <h4 className="font-bold text-foreground">{ev.title}</h4>
                        {ev.description && <p className="text-sm text-muted-foreground mt-1">{ev.description}</p>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ValueCard({ icon: Icon, title, desc, delay }: { icon: React.ElementType; title: string; desc: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass-card rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/5 transition-shadow gradient-border"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 1500;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{display}</>;
}
