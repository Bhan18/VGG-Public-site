"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Compass, IndianRupee, Ruler, Filter, X, ChevronRight } from "lucide-react";
import { useProjects, usePlots } from "@/hooks/use-vgg-data";
import { formatINR, PLOT_STATUS_COLORS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export function PlotSearch() {
  const { data: projects } = useProjects(120000);
  const { data: plots, loading } = usePlots(60000);

  const [project, setProject] = useState("all");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [facing, setFacing] = useState("all");
  const [maxBudget, setMaxBudget] = useState("");
  const [minSize, setMinSize] = useState("");
  const [resultsOpen, setResultsOpen] = useState(false);

  const filtered = useMemo(() => {
    return (plots ?? []).filter((p) => {
      if (project !== "all" && p.projectId !== project) return false;
      if (query && !p.plotNumber.toLowerCase().includes(query.toLowerCase()) && !p.block.toLowerCase().includes(query.toLowerCase())) return false;
      if (status !== "all" && p.status !== status) return false;
      if (facing !== "all" && p.facing !== facing) return false;
      if (maxBudget && p.totalPrice > Number(maxBudget) * 100000) return false;
      if (minSize && p.size < Number(minSize)) return false;
      return true;
    }).slice(0, 50);
  }, [plots, project, query, status, facing, maxBudget, minSize]);

  const projectMap = useMemo(() => {
    const m: Record<string, string> = {};
    (projects ?? []).forEach((p) => { m[p.id] = p.name; });
    return m;
  }, [projects]);

  const triggerSearch = () => setResultsOpen(true);

  return (
    <section id="search" className="py-16 md:py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-xs font-semibold uppercase tracking-widest mb-4">
            <Filter className="h-3.5 w-3.5" /> Smart Search
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Find Your <span className="text-gradient-gold">Perfect Plot</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Search across all projects by plot number, size, budget, facing, and availability.
          </p>
        </motion.div>

        {/* Search card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto glass-card rounded-3xl gradient-border p-5 md:p-7"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Project */}
            <Field label="Project" icon={MapPin}>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full bg-transparent outline-none text-sm py-1"
              >
                <option value="all">All Projects</option>
                {(projects ?? []).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </Field>

            {/* Plot # */}
            <Field label="Plot / Block #" icon={Search}>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. A5 or B"
                className="border-0 px-0 py-0 h-auto focus-visible:ring-0 bg-transparent"
              />
            </Field>

            {/* Status */}
            <Field label="Availability" icon={Filter}>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-transparent outline-none text-sm py-1"
              >
                <option value="all">Any</option>
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="sold">Sold</option>
                <option value="reserved">Reserved</option>
              </select>
            </Field>

            {/* Facing */}
            <Field label="Facing" icon={Compass}>
              <select
                value={facing}
                onChange={(e) => setFacing(e.target.value)}
                className="w-full bg-transparent outline-none text-sm py-1"
              >
                <option value="all">Any</option>
                <option>North</option>
                <option>South</option>
                <option>East</option>
                <option>West</option>
                <option>North-East</option>
                <option>North-West</option>
                <option>South-East</option>
                <option>South-West</option>
              </select>
            </Field>

            {/* Budget */}
            <Field label="Max Budget (₹ Lakh)" icon={IndianRupee}>
              <Input
                type="number"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                placeholder="e.g. 30"
                className="border-0 px-0 py-0 h-auto focus-visible:ring-0 bg-transparent"
              />
            </Field>

            {/* Min size */}
            <Field label="Min Size (cents)" icon={Ruler}>
              <Input
                type="number"
                value={minSize}
                onChange={(e) => setMinSize(e.target.value)}
                placeholder="e.g. 8"
                className="border-0 px-0 py-0 h-auto focus-visible:ring-0 bg-transparent"
              />
            </Field>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading plots..." : `${filtered.length} plots match your criteria`}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setProject("all"); setQuery(""); setStatus("all"); setFacing("all");
                  setMaxBudget(""); setMinSize("");
                }}
              >
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
              <Button onClick={triggerSearch}>
                <Search className="h-4 w-4 mr-1" /> Show Results
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Results modal */}
        <AnimatePresence>
          {resultsOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] flex items-center justify-center p-4"
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setResultsOpen(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative max-w-4xl w-full max-h-[85vh] glass-card rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="p-5 border-b border-border flex items-center justify-between">
                  <h3 className="font-bold text-lg">Search Results — {filtered.length} plots</h3>
                  <Button variant="ghost" size="icon" onClick={() => setResultsOpen(false)} aria-label="Close">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="overflow-y-auto p-5">
                  {filtered.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Search className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      <p>No plots match your criteria. Try adjusting filters.</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {filtered.map((p) => {
                        const c = PLOT_STATUS_COLORS[p.status];
                        return (
                          <button
                            key={p.id}
                            onClick={() => {
                              setResultsOpen(false);
                              document.querySelector("#layout")?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="text-left p-4 rounded-2xl border border-border hover:border-primary hover:shadow-md transition-all"
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <p className="font-bold">Plot {p.plotNumber}</p>
                                <p className="text-xs text-muted-foreground">{projectMap[p.projectId] ?? "Project"} · Block {p.block}</p>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${c.bg} ${c.text}`}>{c.label}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div><span className="text-muted-foreground">Size:</span> <span className="font-medium">{p.size} {p.sizeUnit}</span></div>
                              <div><span className="text-muted-foreground">Facing:</span> <span className="font-medium">{p.facing}</span></div>
                              <div><span className="text-muted-foreground">Road:</span> <span className="font-medium">{p.roadWidth} ft</span></div>
                              <div><span className="text-muted-foreground">Price:</span> <span className="font-bold text-primary">{formatINR(p.totalPrice)}</span></div>
                            </div>
                            <div className="mt-2 text-xs text-primary font-medium flex items-center gap-1">
                              View on layout <ChevronRight className="h-3 w-3" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-secondary/40 border border-border px-3 py-2 focus-within:border-primary transition-colors">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      {children}
    </div>
  );
}
