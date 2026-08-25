// ============================================================
// VGG Infra Developers — Unified Data Access
// - If Supabase env vars are set, fetches live data from your
//   existing admin dashboard database.
// - Otherwise falls back to demo data so the site still renders.
//   For the 13 new content tables, reads from localStorage first
//   (so admin changes in local mode are reflected on the website).
// All functions return Promises so callers can use React Query / Suspense.
// ============================================================
import { getSupabase, isSupabaseConfigured } from "./supabase-client";
import type {
  Project, Layout, Plot, CompanySettings, HeroBanner, GalleryImage,
  Amenity, Testimonial, FAQ, TeamMember, Offer, Brochure, NewsItem,
  NearbyPlace, VideoItem, CompanyStat, TimelineEvent,
} from "./types";
import * as demo from "./demo-data";

export const usingDemoData = !isSupabaseConfigured();

// ---------- Local storage helper for content tables ----------
const LS_PREFIX = "vgg-admin-";
function lsGet<T>(table: string): T[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_PREFIX + table);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ---------- Projects ----------
export async function fetchProjects(): Promise<Project[]> {
  if (usingDemoData) return demo.demoProjects;
  const s = getSupabase()!;
  const { data, error } = await s.from("projects").select("*").order("created_at", { ascending: false });
  if (error || !data) return demo.demoProjects;
  return (data as Record<string, unknown>[]).map(mapProject);
}

// ---------- Layouts ----------
export async function fetchLayouts(): Promise<Layout[]> {
  if (usingDemoData) return demo.demoLayouts;
  const s = getSupabase()!;
  const { data, error } = await s.from("layouts").select("*").order("created_at", { ascending: true });
  if (error || !data) return demo.demoLayouts;
  return (data as Record<string, unknown>[]).map(mapLayout);
}

export async function fetchLayoutsByProject(projectId: string): Promise<Layout[]> {
  const all = await fetchLayouts();
  return all.filter((l) => l.projectId === projectId);
}

// ---------- Plots ----------
export async function fetchPlots(): Promise<Plot[]> {
  if (usingDemoData) return demo.demoPlots;
  const s = getSupabase()!;
  const { data, error } = await s.from("plots").select("*").order("plot_number", { ascending: true });
  if (error || !data) return demo.demoPlots;
  return (data as Record<string, unknown>[]).map(mapPlot);
}

export async function fetchPlotsByProject(projectId: string): Promise<Plot[]> {
  const all = await fetchPlots();
  return all.filter((p) => p.projectId === projectId);
}

// ---------- Settings ----------
export async function fetchSettings(): Promise<CompanySettings> {
  if (usingDemoData) return demo.demoSettings;
  const s = getSupabase()!;
  const { data, error } = await s.from("settings").select("*").eq("id", 1).single();
  if (error || !data) return demo.demoSettings;
  return mapSettings(data as Record<string, unknown>);
}

// ---------- Hero banners ----------
export async function fetchHeroBanners(): Promise<HeroBanner[]> {
  if (usingDemoData) {
    const local = lsGet<HeroBanner>("hero_banners");
    return (local && local.length > 0) ? local.filter(b => b.active !== false) : demo.demoHeroBanners;
  }
  const s = getSupabase()!;
  const { data, error } = await s.from("hero_banners").select("*").eq("active", true).order("order", { ascending: true });
  if (error || !data || data.length === 0) return demo.demoHeroBanners;
  return (data as Record<string, unknown>[]).map(mapHeroBanner);
}

// ---------- Gallery ----------
export async function fetchGallery(): Promise<GalleryImage[]> {
  if (usingDemoData) {
    const local = lsGet<GalleryImage>("gallery_images");
    return (local && local.length > 0) ? local : demo.demoGallery;
  }
  const s = getSupabase()!;
  const { data, error } = await s.from("gallery_images").select("*").order("order", { ascending: true });
  if (error || !data || data.length === 0) return demo.demoGallery;
  return (data as Record<string, unknown>[]).map(mapGalleryImage);
}

// ---------- Amenities ----------
export async function fetchAmenities(): Promise<Amenity[]> {
  if (usingDemoData) {
    const local = lsGet<Amenity>("amenities");
    return (local && local.length > 0) ? local : demo.demoAmenities;
  }
  const s = getSupabase()!;
  const { data, error } = await s.from("amenities").select("*").order("order", { ascending: true });
  if (error || !data || data.length === 0) return demo.demoAmenities;
  return (data as Record<string, unknown>[]).map(mapAmenity);
}

// ---------- Testimonials ----------
export async function fetchTestimonials(): Promise<Testimonial[]> {
  if (usingDemoData) {
    const local = lsGet<Testimonial>("testimonials");
    return (local && local.length > 0) ? local : demo.demoTestimonials;
  }
  const s = getSupabase()!;
  const { data, error } = await s.from("testimonials").select("*").order("order", { ascending: true });
  if (error || !data || data.length === 0) return demo.demoTestimonials;
  return (data as Record<string, unknown>[]).map(mapTestimonial);
}

// ---------- FAQs ----------
export async function fetchFAQs(): Promise<FAQ[]> {
  if (usingDemoData) {
    const local = lsGet<FAQ>("faqs");
    return (local && local.length > 0) ? local : demo.demoFAQs;
  }
  const s = getSupabase()!;
  const { data, error } = await s.from("faqs").select("*").order("order", { ascending: true });
  if (error || !data || data.length === 0) return demo.demoFAQs;
  return (data as Record<string, unknown>[]).map(mapFAQ);
}

// ---------- Team ----------
export async function fetchTeam(): Promise<TeamMember[]> {
  if (usingDemoData) {
    const local = lsGet<TeamMember>("team_members");
    return (local && local.length > 0) ? local : demo.demoTeam;
  }
  const s = getSupabase()!;
  const { data, error } = await s.from("team_members").select("*").order("order", { ascending: true });
  if (error || !data || data.length === 0) return demo.demoTeam;
  return (data as Record<string, unknown>[]).map(mapTeam);
}

// ---------- Offers ----------
export async function fetchOffers(): Promise<Offer[]> {
  if (usingDemoData) {
    const local = lsGet<Offer>("offers");
    return (local && local.length > 0) ? local.filter(o => o.active !== false) : demo.demoOffers;
  }
  const s = getSupabase()!;
  const { data, error } = await s.from("offers").select("*").eq("active", true).order("order", { ascending: true });
  if (error || !data || data.length === 0) return demo.demoOffers;
  return (data as Record<string, unknown>[]).map(mapOffer);
}

// ---------- Brochures ----------
export async function fetchBrochures(): Promise<Brochure[]> {
  if (usingDemoData) {
    const local = lsGet<Brochure>("brochures");
    return (local && local.length > 0) ? local : demo.demoBrochures;
  }
  const s = getSupabase()!;
  const { data, error } = await s.from("brochures").select("*").order("order", { ascending: true });
  if (error || !data || data.length === 0) return demo.demoBrochures;
  return (data as Record<string, unknown>[]).map(mapBrochure);
}

// ---------- News ----------
export async function fetchNews(): Promise<NewsItem[]> {
  if (usingDemoData) {
    const local = lsGet<NewsItem>("news");
    return (local && local.length > 0) ? local : demo.demoNews;
  }
  const s = getSupabase()!;
  const { data, error } = await s.from("news").select("*").order("date", { ascending: false });
  if (error || !data || data.length === 0) return demo.demoNews;
  return (data as Record<string, unknown>[]).map(mapNews);
}

// ---------- Nearby places ----------
export async function fetchNearbyPlaces(): Promise<NearbyPlace[]> {
  if (usingDemoData) {
    const local = lsGet<NearbyPlace>("nearby_places");
    return (local && local.length > 0) ? local : demo.demoNearby;
  }
  const s = getSupabase()!;
  const { data, error } = await s.from("nearby_places").select("*").order("order", { ascending: true });
  if (error || !data || data.length === 0) return demo.demoNearby;
  return (data as Record<string, unknown>[]).map(mapNearby);
}

// ---------- Videos ----------
export async function fetchVideos(): Promise<VideoItem[]> {
  if (usingDemoData) {
    const local = lsGet<VideoItem>("videos");
    return (local && local.length > 0) ? local : demo.demoVideos;
  }
  const s = getSupabase()!;
  const { data, error } = await s.from("videos").select("*").order("order", { ascending: true });
  if (error || !data || data.length === 0) return demo.demoVideos;
  return (data as Record<string, unknown>[]).map(mapVideo);
}

// ---------- Stats ----------
export async function fetchStats(): Promise<CompanyStat[]> {
  if (usingDemoData) {
    const local = lsGet<CompanyStat>("company_stats");
    return (local && local.length > 0) ? local : demo.demoStats;
  }
  const s = getSupabase()!;
  const { data, error } = await s.from("company_stats").select("*").order("order", { ascending: true });
  if (error || !data || data.length === 0) return demo.demoStats;
  return (data as Record<string, unknown>[]).map(mapStat);
}

// ---------- Timeline ----------
export async function fetchTimeline(): Promise<TimelineEvent[]> {
  if (usingDemoData) {
    const local = lsGet<TimelineEvent>("timeline_events");
    return (local && local.length > 0) ? local : demo.demoTimeline;
  }
  const s = getSupabase()!;
  const { data, error } = await s.from("timeline_events").select("*").order("order", { ascending: true });
  if (error || !data || data.length === 0) return demo.demoTimeline;
  return (data as Record<string, unknown>[]).map(mapTimeline);
}

// ============================================================
// Mappers: DB row (snake_case) → TypeScript interface (camelCase)
// ============================================================
function mapProject(r: Record<string, unknown>): Project {
  return {
    id: r.id as string,
    name: r.name as string,
    location: r.location as string,
    totalArea: (r.total_area as string) ?? "",
    numberOfPlots: (r.number_of_plots as number) ?? 0,
    layoutImage: (r.layout_image as string) ?? undefined,
    coverImage: (r.cover_image as string) ?? undefined,
    startingPrice: (r.starting_price as number) ?? undefined,
    pricePerCent: (r.price_per_cent as number) ?? undefined,
    areaUnit: (r.area_unit as "cents" | "sqyd") ?? "cents",
    mapLat: (r.map_lat as number) ?? undefined,
    mapLng: (r.map_lng as number) ?? undefined,
    mapZoom: (r.map_zoom as number) ?? 13,
    status: (r.status as Project["status"]) ?? "active",
    description: (r.description as string) ?? undefined,
    createdAt: (r.created_at as string) ?? new Date().toISOString(),
    updatedAt: (r.updated_at as string) ?? new Date().toISOString(),
  };
}
function mapLayout(r: Record<string, unknown>): Layout {
  return {
    id: r.id as string,
    projectId: (r.project_id as string) ?? "",
    name: r.name as string,
    image: (r.image as string) ?? undefined,
    description: (r.description as string) ?? undefined,
    numberOfPlots: (r.number_of_plots as number) ?? 0,
    createdAt: (r.created_at as string) ?? new Date().toISOString(),
    updatedAt: (r.updated_at as string) ?? new Date().toISOString(),
  };
}
function mapPlot(r: Record<string, unknown>): Plot {
  return {
    id: r.id as string,
    layoutId: (r.layout_id as string) ?? "",
    projectId: (r.project_id as string) ?? "",
    plotNumber: (r.plot_number as string) ?? "",
    block: (r.block as string) ?? "",
    size: (r.size as number) ?? 0,
    sizeUnit: (r.size_unit as "cents" | "sqyd") ?? "cents",
    facing: (r.facing as Plot["facing"]) ?? "East",
    pricePerCent: (r.price_per_cent as number) ?? 0,
    totalPrice: (r.total_price as number) ?? 0,
    status: (r.status as Plot["status"]) ?? "available",
    cornerPlot: (r.corner_plot as boolean) ?? false,
    roadWidth: (r.road_width as number) ?? 30,
    notes: (r.notes as string) ?? "",
    x: (r.x as number) ?? 0,
    y: (r.y as number) ?? 0,
    width: (r.width as number) ?? 5,
    height: (r.height as number) ?? 5,
    customerId: (r.customer_id as string) ?? undefined,
    bookingId: (r.booking_id as string) ?? undefined,
    saleId: (r.sale_id as string) ?? undefined,
    createdAt: (r.created_at as string) ?? new Date().toISOString(),
    updatedAt: (r.updated_at as string) ?? new Date().toISOString(),
  };
}
function mapSettings(r: Record<string, unknown>): CompanySettings {
  return {
    companyName: (r.company_name as string) ?? "VGG Infra Developers",
    companyLogo: (r.company_logo as string) ?? undefined,
    gst: (r.gst as string) ?? undefined,
    address: (r.address as string) ?? undefined,
    phone: (r.phone as string) ?? undefined,
    email: (r.email as string) ?? undefined,
    upi: (r.upi as string) ?? undefined,
    bankDetails: {
      bankName: (r.bank_name as string) ?? undefined,
      accountName: (r.account_name as string) ?? undefined,
      accountNumber: (r.account_number as string) ?? undefined,
      ifsc: (r.ifsc as string) ?? undefined,
      branch: (r.branch as string) ?? undefined,
    },
  };
}
function mapHeroBanner(r: Record<string, unknown>): HeroBanner {
  return {
    id: r.id as string,
    title: r.title as string,
    subtitle: (r.subtitle as string) ?? undefined,
    image: r.image as string,
    ctaText: (r.cta_text as string) ?? undefined,
    ctaLink: (r.cta_link as string) ?? undefined,
    order: (r.order as number) ?? 0,
    active: (r.active as boolean) ?? true,
  };
}
function mapGalleryImage(r: Record<string, unknown>): GalleryImage {
  return {
    id: r.id as string,
    title: (r.title as string) ?? undefined,
    image: r.image as string,
    category: (r.category as string) ?? undefined,
    projectId: (r.project_id as string) ?? undefined,
    order: (r.order as number) ?? 0,
    createdAt: (r.created_at as string) ?? new Date().toISOString(),
  };
}
function mapAmenity(r: Record<string, unknown>): Amenity {
  return {
    id: r.id as string,
    title: r.title as string,
    description: (r.description as string) ?? undefined,
    icon: (r.icon as string) ?? undefined,
    image: (r.image as string) ?? undefined,
    order: (r.order as number) ?? 0,
  };
}
function mapTestimonial(r: Record<string, unknown>): Testimonial {
  return {
    id: r.id as string,
    name: r.name as string,
    role: (r.role as string) ?? undefined,
    photo: (r.photo as string) ?? undefined,
    rating: (r.rating as number) ?? 5,
    text: r.text as string,
    videoUrl: (r.video_url as string) ?? undefined,
    order: (r.order as number) ?? 0,
  };
}
function mapFAQ(r: Record<string, unknown>): FAQ {
  return {
    id: r.id as string,
    question: r.question as string,
    answer: r.answer as string,
    category: (r.category as string) ?? undefined,
    order: (r.order as number) ?? 0,
  };
}
function mapTeam(r: Record<string, unknown>): TeamMember {
  return {
    id: r.id as string,
    name: r.name as string,
    role: (r.role as string) ?? undefined,
    photo: (r.photo as string) ?? undefined,
    bio: (r.bio as string) ?? undefined,
    phone: (r.phone as string) ?? undefined,
    email: (r.email as string) ?? undefined,
    linkedin: (r.linkedin as string) ?? undefined,
    order: (r.order as number) ?? 0,
  };
}
function mapOffer(r: Record<string, unknown>): Offer {
  return {
    id: r.id as string,
    title: r.title as string,
    description: (r.description as string) ?? undefined,
    image: (r.image as string) ?? undefined,
    validUntil: (r.valid_until as string) ?? undefined,
    active: (r.active as boolean) ?? true,
    order: (r.order as number) ?? 0,
  };
}
function mapBrochure(r: Record<string, unknown>): Brochure {
  return {
    id: r.id as string,
    title: r.title as string,
    fileUrl: r.file_url as string,
    projectId: (r.project_id as string) ?? undefined,
    order: (r.order as number) ?? 0,
  };
}
function mapNews(r: Record<string, unknown>): NewsItem {
  return {
    id: r.id as string,
    title: r.title as string,
    content: (r.content as string) ?? undefined,
    image: (r.image as string) ?? undefined,
    date: (r.date as string) ?? new Date().toISOString(),
    link: (r.link as string) ?? undefined,
    order: (r.order as number) ?? 0,
  };
}
function mapNearby(r: Record<string, unknown>): NearbyPlace {
  return {
    id: r.id as string,
    name: r.name as string,
    type: r.type as string,
    distanceKm: (r.distance_km as number) ?? undefined,
    travelMinutes: (r.travel_minutes as number) ?? undefined,
    icon: (r.icon as string) ?? undefined,
    order: (r.order as number) ?? 0,
  };
}
function mapVideo(r: Record<string, unknown>): VideoItem {
  return {
    id: r.id as string,
    title: r.title as string,
    url: r.url as string,
    thumbnail: (r.thumbnail as string) ?? undefined,
    projectId: (r.project_id as string) ?? undefined,
    order: (r.order as number) ?? 0,
  };
}
function mapStat(r: Record<string, unknown>): CompanyStat {
  return {
    id: r.id as string,
    label: r.label as string,
    value: (r.value as number) ?? 0,
    suffix: (r.suffix as string) ?? undefined,
    icon: (r.icon as string) ?? undefined,
    order: (r.order as number) ?? 0,
  };
}
function mapTimeline(r: Record<string, unknown>): TimelineEvent {
  return {
    id: r.id as string,
    year: r.year as string,
    title: r.title as string,
    description: (r.description as string) ?? undefined,
    order: (r.order as number) ?? 0,
  };
}

// ---------- Derived: aggregate plot stats ----------
export function computePlotStats(plots: Plot[]) {
  return {
    total: plots.length,
    available: plots.filter((p) => p.status === "available").length,
    booked: plots.filter((p) => p.status === "booked").length,
    sold: plots.filter((p) => p.status === "sold").length,
    reserved: plots.filter((p) => p.status === "reserved").length,
    blocked: plots.filter((p) => p.status === "blocked").length,
  };
}

export function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)} K`;
  return `₹${amount}`;
}

export const PLOT_STATUS_COLORS: Record<Plot["status"], { bg: string; border: string; text: string; label: string; dot: string }> = {
  available: { bg: "bg-emerald-500/30", border: "border-emerald-500", text: "text-emerald-700 dark:text-emerald-300", label: "Available", dot: "bg-emerald-500" },
  booked: { bg: "bg-amber-500/30", border: "border-amber-500", text: "text-amber-700 dark:text-amber-300", label: "Booked", dot: "bg-amber-500" },
  sold: { bg: "bg-rose-500/30", border: "border-rose-500", text: "text-rose-700 dark:text-rose-300", label: "Sold", dot: "bg-rose-500" },
  reserved: { bg: "bg-slate-500/30", border: "border-slate-500", text: "text-slate-700 dark:text-slate-300", label: "Reserved", dot: "bg-slate-500" },
  blocked: { bg: "bg-zinc-700/40", border: "border-zinc-700", text: "text-zinc-700 dark:text-zinc-300", label: "Blocked", dot: "bg-zinc-700" },
};
