// ============================================================
// VGG Infra Developers — Public Website Type Definitions
// Mirrors the admin dashboard schema (Supabase snake_case → camelCase).
// ============================================================

export type PlotStatus = "available" | "booked" | "reserved" | "sold" | "blocked";

export type FacingDirection =
  | "North"
  | "South"
  | "East"
  | "West"
  | "North-East"
  | "North-West"
  | "South-East"
  | "South-West";

export interface Project {
  id: string;
  name: string;
  location: string;
  totalArea: string;
  numberOfPlots: number;
  layoutImage?: string;
  status: "active" | "planned" | "completed" | "archived";
  description?: string;
  coverImage?: string;
  startingPrice?: number;
  pricePerCent?: number;
  areaUnit?: "cents" | "sqyd";
  mapLat?: number;
  mapLng?: number;
  mapZoom?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Layout {
  id: string;
  projectId: string;
  name: string;
  image?: string;
  description?: string;
  numberOfPlots: number;
  createdAt: string;
  updatedAt: string;
}

export interface Plot {
  id: string;
  layoutId: string;
  projectId: string;
  plotNumber: string;
  block: string;
  size: number;
  sizeUnit: "cents" | "sqyd";
  facing: FacingDirection;
  pricePerCent: number;
  totalPrice: number;
  status: PlotStatus;
  cornerPlot: boolean;
  roadWidth: number;
  notes?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  customerId?: string;
  bookingId?: string;
  saleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanySettings {
  companyName: string;
  companyLogo?: string;
  gst?: string;
  address?: string;
  phone?: string;
  email?: string;
  upi?: string;
  bankDetails?: {
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    ifsc?: string;
    branch?: string;
  };
}

// ---------- New content tables (created by SQL migration) ----------
export interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  active: boolean;
}

export interface GalleryImage {
  id: string;
  title?: string;
  image: string;
  category?: string;
  projectId?: string;
  order: number;
  createdAt: string;
}

export interface Amenity {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  image?: string;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  photo?: string;
  rating: number;
  text: string;
  videoUrl?: string;
  order: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  photo?: string;
  bio?: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  order: number;
}

export interface Offer {
  id: string;
  title: string;
  description?: string;
  image?: string;
  validUntil?: string;
  active: boolean;
  order: number;
}

export interface Brochure {
  id: string;
  title: string;
  fileUrl: string;
  projectId?: string;
  order: number;
}

export interface NewsItem {
  id: string;
  title: string;
  content?: string;
  image?: string;
  date: string;
  link?: string;
  order: number;
}

export interface NearbyPlace {
  id: string;
  name: string;
  type: string;
  distanceKm?: number;
  travelMinutes?: number;
  icon?: string;
  order: number;
}

export interface VideoItem {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  projectId?: string;
  order: number;
}

export interface CompanyStat {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  icon?: string;
  order: number;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description?: string;
  order: number;
}
