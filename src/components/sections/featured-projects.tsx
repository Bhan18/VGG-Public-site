"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Maximize, ArrowRight, X, Trees, IndianRupee, Phone, Download, ChevronRight } from "lucide-react";
import { useProjects, usePlots, useLayouts, useGallery, useBrochures, useNearbyPlaces } from "@/hooks/use-vgg-data";
import { computePlotStats, formatINR, PLOT_STATUS_COLORS } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/types";

export function FeaturedProjects() {
  const { data: projects, loading } = useProjects(120000);

  return (
    <section id="projects" className="py-20 md:py-28 bg-gradient-to-b from-background via-secondary/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-4">
            <Trees className="h-3.5 w-3.5" /> Featured Projects
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Explore Our <span className="text-gradient-green">Premium Farmland</span> Projects
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            Every VGG project is handpicked for location, soil quality, and appreciation potential.
            All layouts are DTCP approved with clear titles, modern infrastructure, and flexible payment plans.
            Click any project to view detailed information, gallery, plot availability, and downloads.
          </p>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[28rem] rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {(projects ?? []).map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { data: allPlots } = usePlots();
  const stats = useMemo(() => {
    const projectPlots = (allPlots ?? []).filter((p) => p.projectId === project.id);
    return computePlotStats(projectPlots);
  }, [allPlots, project.id]);
  const startingPrice = project.startingPrice ?? (project.pricePerCent ? project.pricePerCent * 8 : 1800000);

  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        onClick={() => setOpen(true)}
        className="group text-left rounded-3xl overflow-hidden glass-card gradient-border hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300"
      >
        {/* Cover image */}
        <div className="relative h-56 overflow-hidden">
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
              <Trees className="h-12 w-12 text-white/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className="bg-amber-500 text-amber-950 border-0 font-semibold hover:bg-amber-500">
              {project.status === "active" ? "Active" : project.status === "planned" ? "Pre-Launch" : project.status}
            </Badge>
            {stats.available > 0 && (
              <Badge className="bg-emerald-500 text-emerald-950 border-0 font-semibold hover:bg-emerald-500">
                {stats.available} Available
              </Badge>
            )}
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white tracking-tight">{project.name}</h3>
            <p className="flex items-center gap-1 text-emerald-100/90 text-sm mt-1">
              <MapPin className="h-3.5 w-3.5" /> {project.location}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{project.description}</p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 py-3 border-y border-border">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total</p>
              <p className="text-base font-bold text-foreground">{stats.total || project.numberOfPlots}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Area</p>
              <p className="text-base font-bold text-foreground">{project.totalArea}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Avail.</p>
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">{stats.available}</p>
            </div>
          </div>

          {/* Price + CTA */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Starting at</p>
              <p className="text-2xl font-extrabold text-gradient-green">{formatINR(startingPrice)}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
              View Details <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </motion.button>

      <ProjectDetailModal project={project} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

// ============================================================
// Project Detail Modal — acts as the project details page
// (since the preview only shows /, we use a modal for details)
// ============================================================
function ProjectDetailModal({ project, open, onClose }: { project: Project; open: boolean; onClose: () => void }) {
  const { data: allPlots } = usePlots();
  const { data: layouts } = useLayouts();
  const { data: gallery } = useGallery();
  const { data: brochures } = useBrochures();
  const { data: nearby } = useNearbyPlaces();

  const plots = useMemo(() => (allPlots ?? []).filter((p) => p.projectId === project.id), [allPlots, project.id]);
  const projectLayouts = useMemo(() => (layouts ?? []).filter((l) => l.projectId === project.id), [layouts, project.id]);
  const projectGallery = useMemo(
    () => (gallery ?? []).filter((g) => !g.projectId || g.projectId === project.id).slice(0, 8),
    [gallery, project.id]
  );
  const projectBrochures = useMemo(
    () => (brochures ?? []).filter((b) => !b.projectId || b.projectId === project.id),
    [brochures, project.id]
  );
  const stats = useMemo(() => computePlotStats(plots), [plots]);

  if (!open) return null;

  const mapSrc = project.mapLat && project.mapLng
    ? `https://www.google.com/maps?q=${project.mapLat},${project.mapLng}&z=${project.mapZoom ?? 13}&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(project.location)}&z=13&output=embed`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-6"
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto glass-card rounded-3xl shadow-2xl"
        >
          {/* Header banner */}
          <div className="relative h-56 md:h-72 overflow-hidden rounded-t-3xl">
            {project.coverImage ? (
              <Image src={project.coverImage} alt={project.name} fill className="object-cover" sizes="100vw" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/40 to-accent/40" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-4 right-4">
              <Badge className="bg-amber-500 text-amber-950 border-0 mb-2">{project.status}</Badge>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">{project.name}</h2>
              <p className="flex items-center gap-1 text-emerald-100/90 text-sm mt-1">
                <MapPin className="h-4 w-4" /> {project.location}
              </p>
            </div>
          </div>

          <div className="p-5 md:p-8 space-y-8">
            {/* Description */}
            <div>
              <h3 className="text-lg font-bold mb-2">About this project</h3>
              <p className="text-muted-foreground leading-relaxed">{project.description}</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: "Total Plots", value: stats.total || project.numberOfPlots },
                { label: "Available", value: stats.available, color: "text-emerald-600" },
                { label: "Booked", value: stats.booked, color: "text-amber-600" },
                { label: "Sold", value: stats.sold, color: "text-rose-600" },
                { label: "Total Area", value: project.totalArea, raw: true },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-secondary/40 p-3 text-center">
                  <p className={`text-xl font-bold ${s.color ?? ""}`}>{s.raw ? s.value : s.value}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-bold mb-3">Pricing</h3>
              <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 p-5 flex flex-wrap items-center gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Starting Price</p>
                  <p className="text-2xl font-extrabold text-gradient-green">
                    {formatINR(project.startingPrice ?? (project.pricePerCent ? project.pricePerCent * 8 : 1800000))}
                  </p>
                </div>
                {project.pricePerCent && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Per Cent</p>
                    <p className="text-2xl font-extrabold text-foreground">₹{project.pricePerCent.toLocaleString("en-IN")}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Area Unit</p>
                  <p className="text-2xl font-extrabold text-foreground capitalize">{project.areaUnit ?? "cents"}</p>
                </div>
                <Button className="ml-auto" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
                  <Phone className="h-4 w-4 mr-2" /> Enquire Now
                </Button>
              </div>
            </div>

            {/* Plot availability */}
            {plots.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3">Plot Availability</h3>
                <div className="rounded-2xl border border-border overflow-hidden">
                  <div className="max-h-72 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary/60 sticky top-0">
                        <tr>
                          <th className="text-left p-3 font-semibold">Plot #</th>
                          <th className="text-left p-3 font-semibold">Block</th>
                          <th className="text-right p-3 font-semibold">Size</th>
                          <th className="text-left p-3 font-semibold">Facing</th>
                          <th className="text-right p-3 font-semibold">Price</th>
                          <th className="text-center p-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {plots.slice(0, 50).map((p) => {
                          const c = PLOT_STATUS_COLORS[p.status];
                          return (
                            <tr key={p.id} className="border-t border-border hover:bg-secondary/30">
                              <td className="p-3 font-medium">{p.plotNumber}{p.cornerPlot && <span className="ml-1 text-amber-500">★</span>}</td>
                              <td className="p-3 text-muted-foreground">{p.block}</td>
                              <td className="p-3 text-right">{p.size} {p.sizeUnit}</td>
                              <td className="p-3 text-muted-foreground">{p.facing}</td>
                              <td className="p-3 text-right font-medium">{formatINR(p.totalPrice)}</td>
                              <td className="p-3 text-center">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
                                  {c.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {plots.length > 50 && <p className="p-3 text-xs text-muted-foreground text-center bg-secondary/30">Showing 50 of {plots.length} plots — use the Interactive Layout below for full view.</p>}
                </div>
              </div>
            )}

            {/* Gallery */}
            {projectGallery.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {projectGallery.map((g) => (
                    <div key={g.id} className="relative aspect-square rounded-xl overflow-hidden">
                      <Image src={g.image} alt={g.title ?? "Gallery"} fill className="object-cover hover:scale-110 transition-transform" sizes="25vw" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Layout image */}
            {projectLayouts[0]?.image && (
              <div>
                <h3 className="text-lg font-bold mb-3">Master Layout</h3>
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-border">
                  <Image src={projectLayouts[0].image} alt="Layout" fill className="object-contain bg-secondary/20" sizes="100vw" />
                </div>
              </div>
            )}

            {/* Map */}
            <div>
              <h3 className="text-lg font-bold mb-3">Location</h3>
              <div className="rounded-2xl overflow-hidden border border-border aspect-video">
                <iframe title={`${project.name} map`} src={mapSrc} className="w-full h-full" loading="lazy" />
              </div>
              {nearby && nearby.length > 0 && (
                <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {nearby.slice(0, 6).map((n) => (
                    <div key={n.id} className="rounded-xl bg-secondary/40 p-3 flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">{n.name}</p>
                        <p className="text-xs text-muted-foreground">{n.type}</p>
                      </div>
                      <div className="text-right">
                        {n.distanceKm && <p className="font-semibold text-primary">{n.distanceKm} km</p>}
                        {n.travelMinutes && <p className="text-xs text-muted-foreground">{n.travelMinutes} min</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Brochures */}
            {projectBrochures.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3">Downloads</h3>
                <div className="space-y-2">
                  {projectBrochures.map((b) => (
                    <a
                      key={b.id}
                      href={b.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Download className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium text-sm">{b.title}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
              <Button className="flex-1" size="lg" onClick={() => { onClose(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}>
                <Phone className="h-4 w-4 mr-2" /> Book a Site Visit
              </Button>
              <Button variant="outline" size="lg" onClick={() => { onClose(); document.querySelector("#layout")?.scrollIntoView({ behavior: "smooth" }); }}>
                <Maximize className="h-4 w-4 mr-2" /> View Interactive Layout
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
