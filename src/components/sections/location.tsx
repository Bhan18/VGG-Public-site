"use client";
import { motion } from "framer-motion";
import { MapPin, Plane, Building, Bus, Heart, Book } from "lucide-react";
import { useNearbyPlaces, useProjects } from "@/hooks/use-vgg-data";
import { Skeleton } from "@/components/ui/skeleton";

const ICON_MAP: Record<string, React.ElementType> = {
  plane: Plane, building: Building, bus: Bus, heart: Heart, book: Book,
};

export function Location() {
  const { data: nearby, loading } = useNearbyPlaces();
  const { data: projects } = useProjects();
  const firstProject = projects?.[0];

  const mapSrc = firstProject?.mapLat && firstProject?.mapLng
    ? `https://www.google.com/maps?q=${firstProject.mapLat},${firstProject.mapLng}&z=${firstProject.mapZoom ?? 13}&output=embed`
    : `https://www.google.com/maps?q=Bengaluru&z=10&output=embed`;

  return (
    <section id="location" className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-4">
            <MapPin className="h-3.5 w-3.5" /> Location
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Strategically Located, <span className="text-gradient-green">Easily Connected</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            Our projects are placed at the sweet spot between nature and connectivity — close enough to Bengaluru for daily commute,
            far enough to enjoy clean air, green landscapes, and peaceful surroundings. Here's what's around our flagship project.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 rounded-3xl overflow-hidden glass-card gradient-border aspect-video lg:aspect-auto lg:min-h-[400px]"
          >
            <iframe
              title="Project location"
              src={mapSrc}
              className="w-full h-full min-h-[400px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

          {/* Nearby places */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl glass-card gradient-border p-6"
          >
            <h3 className="font-bold text-lg mb-4">What's Nearby</h3>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
              </div>
            ) : (
              <div className="space-y-2">
                {(nearby ?? []).map((n, i) => {
                  const Icon = ICON_MAP[n.icon ?? ""] ?? MapPin;
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{n.name}</p>
                        <p className="text-xs text-muted-foreground">{n.type}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {n.distanceKm && <p className="text-sm font-bold text-primary">{n.distanceKm} km</p>}
                        {n.travelMinutes && <p className="text-[10px] text-muted-foreground">{n.travelMinutes} min drive</p>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
