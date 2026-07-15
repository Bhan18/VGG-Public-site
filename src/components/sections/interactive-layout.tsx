"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers, X, MapPin, Compass, Ruler, IndianRupee, Route, Phone, Search,
  Filter, Star, ChevronDown, Maximize2, Info, CheckCircle2, AlertCircle,
} from "lucide-react";
import { useProjects, useLayouts, usePlots } from "@/hooks/use-vgg-data";
import { computePlotStats, formatINR, PLOT_STATUS_COLORS } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Plot, Project } from "@/lib/types";

export function InteractiveLayout() {
  const { data: projects, loading: pLoading } = useProjects(60000);
  const { data: layouts } = useLayouts();
  const { data: plots, loading: plLoading } = usePlots(45000); // refresh every 45s — auto-reflects admin status changes

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cornerOnly, setCornerOnly] = useState(false);
  const [facingFilter, setFacingFilter] = useState<string>("all");
  const [hoveredPlot, setHoveredPlot] = useState<Plot | null>(null);

  // Derived: auto-select first project if none chosen
  const effectiveProjectId = selectedProjectId ?? projects?.[0]?.id ?? null;

  const selectedProject: Project | undefined = (projects ?? []).find((p) => p.id === effectiveProjectId);
  const selectedLayout = (layouts ?? []).find((l) => l.projectId === effectiveProjectId);

  const projectPlots = useMemo(
    () => (plots ?? []).filter((p) => p.projectId === effectiveProjectId),
    [plots, effectiveProjectId]
  );

  const filteredPlots = useMemo(() => {
    return projectPlots.filter((p) => {
      if (search && !p.plotNumber.toLowerCase().includes(search.toLowerCase()) && !p.block.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (facingFilter !== "all" && p.facing !== facingFilter) return false;
      if (cornerOnly && !p.cornerPlot) return false;
      return true;
    });
  }, [projectPlots, search, statusFilter, facingFilter, cornerOnly]);

  const stats = useMemo(() => computePlotStats(projectPlots), [projectPlots]);

  return (
    <section id="layout" className="py-20 md:py-28 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-1/2 -left-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-xs font-semibold uppercase tracking-widest mb-4">
            <Layers className="h-3.5 w-3.5" /> Interactive Layout
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Click Any Plot To See <span className="text-gradient-gold">Live Status</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            Explore the actual master layout of each project. Plots are color-coded by availability in real-time —
            when our admin marks a plot as sold, it turns red here instantly. Click any plot to see its size, facing,
            price, and book it on the spot.
          </p>
        </motion.div>

        {/* Project selector */}
        {pLoading ? (
          <Skeleton className="h-12 w-full max-w-md mx-auto mb-8 rounded-full" />
        ) : (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {(projects ?? []).map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  effectiveProjectId === p.id
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                    : "bg-secondary text-foreground hover:bg-secondary/70"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {(["available", "booked", "sold", "reserved"] as const).map((s) => {
            const c = PLOT_STATUS_COLORS[s];
            return (
              <div key={s} className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-xs font-medium">
                <span className={`w-3 h-3 rounded-full ${c.dot}`} />
                <span>{c.label}</span>
                <span className="text-muted-foreground">({s === "available" ? stats.available : s === "booked" ? stats.booked : s === "sold" ? stats.sold : stats.reserved})</span>
              </div>
            );
          })}
        </div>

        {/* Filters bar */}
        <div className="rounded-2xl glass-card p-4 mb-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plot number or block..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background/50"
            />
          </div>
          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "all", label: "All Status" },
              { value: "available", label: "Available" },
              { value: "booked", label: "Booked" },
              { value: "sold", label: "Sold" },
              { value: "reserved", label: "Reserved" },
            ]}
          />
          <FilterSelect
            label="Facing"
            value={facingFilter}
            onChange={setFacingFilter}
            options={[
              { value: "all", label: "All Facing" },
              { value: "North", label: "North" },
              { value: "South", label: "South" },
              { value: "East", label: "East" },
              { value: "West", label: "West" },
              { value: "North-East", label: "North-East" },
              { value: "North-West", label: "North-West" },
              { value: "South-East", label: "South-East" },
              { value: "South-West", label: "South-West" },
            ]}
          />
          <button
            onClick={() => setCornerOnly(!cornerOnly)}
            className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
              cornerOnly ? "bg-amber-500 text-amber-950 border-amber-500" : "border-border hover:bg-secondary"
            }`}
          >
            <Star className="h-3.5 w-3.5 inline mr-1" /> Corner Only
          </button>
          <div className="text-xs text-muted-foreground ml-auto">
            Showing {filteredPlots.length} of {projectPlots.length} plots
          </div>
        </div>

        {/* Layout canvas */}
        <div className="rounded-3xl glass-card overflow-hidden shadow-2xl">
          {plLoading ? (
            <Skeleton className="aspect-[16/10] w-full" />
          ) : (
            <div className="relative aspect-[16/10] bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/30 dark:to-amber-950/30">
              {/* Layout background image (if any) */}
              {selectedLayout?.image ? (
                <Image src={selectedLayout.image} alt="Layout" fill className="object-contain" sizes="100vw" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-emerald-700/30 dark:text-emerald-300/20">
                    <Maximize2 className="h-16 w-16 mx-auto mb-2" />
                    <p className="text-sm">Auto-generated grid layout</p>
                  </div>
                </div>
              )}

              {/* Plot overlay */}
              <div className="absolute inset-0">
                {filteredPlots.map((plot) => {
                  const c = PLOT_STATUS_COLORS[plot.status];
                  const isHovered = hoveredPlot?.id === plot.id;
                  return (
                    <button
                      key={plot.id}
                      onClick={() => setSelectedPlot(plot)}
                      onMouseEnter={() => setHoveredPlot(plot)}
                      onMouseLeave={() => setHoveredPlot(null)}
                      style={{
                        left: `${plot.x}%`,
                        top: `${plot.y}%`,
                        width: `${plot.width}%`,
                        height: `${plot.height}%`,
                      }}
                      className={`absolute rounded-md border-2 ${c.bg} ${c.border} hover:scale-110 hover:z-10 transition-all duration-200 flex items-center justify-center text-[10px] sm:text-xs font-bold ${c.text} cursor-pointer group`}
                      aria-label={`Plot ${plot.plotNumber} — ${c.label}`}
                    >
                      <span className="drop-shadow-sm">{plot.plotNumber}</span>
                      {plot.cornerPlot && (
                        <Star className="absolute -top-1 -right-1 h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                      )}
                      {/* Hover tooltip */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 px-2 py-1 rounded-md bg-foreground text-background text-[10px] whitespace-nowrap pointer-events-none shadow-lg"
                          >
                            <span className="font-bold">{plot.plotNumber}</span> · {plot.size}{plot.sizeUnit} · {formatINR(plot.totalPrice)}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  );
                })}
              </div>

              {/* Empty state */}
              {filteredPlots.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No plots match your filters</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Helper note */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5" />
          <span>Plot colors update automatically when the admin changes status. Click any plot for full details.</span>
        </div>
      </div>

      {/* Plot modal */}
      <PlotModal
        plot={selectedPlot}
        project={selectedProject}
        onClose={() => setSelectedPlot(null)}
      />
    </section>
  );
}

function FilterSelect({
  label, value, onChange, options,
}: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-border bg-background/50 text-sm font-medium cursor-pointer hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}

// ============================================================
// Plot detail modal with full info + enquiry
// ============================================================
function PlotModal({ plot, project, onClose }: { plot: Plot | null; project?: Project; onClose: () => void }) {
  if (!plot) return null;
  const c = PLOT_STATUS_COLORS[plot.status];
  const isAvailable = plot.status === "available";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative max-w-2xl w-full glass-card rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className={`p-6 bg-gradient-to-r ${c.bg} border-b border-border`}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-background/40 backdrop-blur-md flex items-center justify-center hover:bg-background/60"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${c.bg} ${c.text} border ${c.border}`}>
                {c.label}
              </span>
              {plot.cornerPlot && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-amber-950">
                  <Star className="h-3 w-3 fill-amber-950" /> Corner Plot
                </span>
              )}
            </div>
            <h2 className="text-3xl font-extrabold text-foreground">Plot {plot.plotNumber}</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Block {plot.block} · {project?.name ?? "Project"} · {project?.location ?? ""}
            </p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Specs grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Spec icon={Ruler} label="Size" value={`${plot.size} ${plot.sizeUnit}`} />
              <Spec icon={Compass} label="Facing" value={plot.facing} />
              <Spec icon={Route} label="Road Width" value={`${plot.roadWidth} ft`} />
              <Spec icon={IndianRupee} label="Per Cent" value={`₹${plot.pricePerCent.toLocaleString("en-IN")}`} />
              <Spec icon={IndianRupee} label="Total Price" value={formatINR(plot.totalPrice)} highlight />
              <Spec icon={MapPin} label="Block" value={plot.block} />
            </div>

            {/* Status banner */}
            {isAvailable ? (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-emerald-700 dark:text-emerald-300">This plot is available!</p>
                  <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">Book it now with just 10% advance. Free site visit available.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-amber-700 dark:text-amber-300">This plot is currently {c.label.toLowerCase()}.</p>
                  <p className="text-sm text-amber-600/80 dark:text-amber-400/80">Contact us for similar available plots in this project.</p>
                </div>
              </div>
            )}

            {/* Notes */}
            {plot.notes && (
              <div className="p-3 rounded-xl bg-secondary/40 text-sm">
                <p className="text-muted-foreground">{plot.notes}</p>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                size="lg"
                className="flex-1"
                onClick={() => { onClose(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
              >
                <Phone className="h-4 w-4 mr-2" /> Enquire About This Plot
              </Button>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="outline" size="lg" className="w-full bg-emerald-500/10 border-emerald-500/40 hover:bg-emerald-500/20">
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Spec({ icon: Icon, label, value, highlight }: { icon: React.ElementType; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-3 ${highlight ? "bg-primary/10 border border-primary/30" : "bg-secondary/40"}`}>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider mb-1">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className={`text-sm font-bold ${highlight ? "text-primary" : ""}`}>{value}</p>
    </div>
  );
}
