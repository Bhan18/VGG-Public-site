// ============================================================
// VGG Infra Developers — Demo Data
// Shown when NEXT_PUBLIC_SUPABASE_URL / ANON_KEY aren't set, so the
// website still renders. Once env vars are added, real data from your
// Supabase project (admin dashboard) is fetched instead.
// ============================================================
import type {
  Project, Layout, Plot, CompanySettings, HeroBanner, GalleryImage,
  Amenity, Testimonial, FAQ, TeamMember, Offer, Brochure, NewsItem,
  NearbyPlace, VideoItem, CompanyStat, TimelineEvent, PlotStatus, FacingDirection,
} from "./types";

export const demoSettings: CompanySettings = {
  companyName: "VGG Infra Developers",
  companyLogo: "",
  gst: "29ABCDE1234F1Z5",
  address: "No. 42, MG Road, Bengaluru, Karnataka 560001",
  phone: "+91 98765 43210",
  email: "info@vgginfra.com",
  upi: "vgginfra@upi",
  bankDetails: {
    bankName: "HDFC Bank",
    accountName: "VGG Infra Developers Pvt Ltd",
    accountNumber: "501000123456789",
    ifsc: "HDFC0001234",
    branch: "MG Road, Bengaluru",
  },
};

export const demoHeroBanners: HeroBanner[] = [
  {
    id: "h1",
    title: "Own a Piece of Nature",
    subtitle: "Premium Farmland Plots Near Bengaluru",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80",
    ctaText: "Explore Projects",
    ctaLink: "#projects",
    order: 0,
    active: true,
  },
  {
    id: "h2",
    title: "Sandalwood Farmlands",
    subtitle: "Invest in Green Wealth That Grows With Time",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80",
    ctaText: "View Layout",
    ctaLink: "#layout",
    order: 1,
    active: true,
  },
  {
    id: "h3",
    title: "Mango Orchard Estates",
    subtitle: "Plots Starting at ₹18 Lakhs",
    image: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=1920&q=80",
    ctaText: "Get Brochure",
    ctaLink: "#contact",
    order: 2,
    active: true,
  },
];

export const demoProjects: Project[] = [
  {
    id: "p-demo1",
    name: "Vijaya Sandalwood Farm",
    location: "Anekal, Bengaluru South",
    totalArea: "12 Acres",
    numberOfPlots: 48,
    layoutImage: "",
    coverImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
    status: "active",
    description:
      "A premium sandalwood farmland project spread across 12 acres of lush landscape. Each plot is DTCP approved with clear titles, designed for both investment and weekend retreats. The project features wide internal roads, underground electricity, drip irrigation, and a gated community layout with 24/7 security.",
    startingPrice: 1800000,
    pricePerCent: 65000,
    areaUnit: "cents",
    mapLat: 12.7106,
    mapLng: 77.6963,
    mapZoom: 13,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p-demo2",
    name: "Mango Orchard Estates",
    location: "Hosur, Tamil Nadu",
    totalArea: "20 Acres",
    numberOfPlots: 64,
    layoutImage: "",
    coverImage: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=1200&q=80",
    status: "active",
    description:
      "Mango Orchard Estates offers spacious farmland plots within a working mango orchard. Owners enjoy seasonal mango yield, maintenance-free farming, and appreciation potential. Plots are sized from 8 to 20 cents with corner plots facing 30-ft internal roads.",
    startingPrice: 2200000,
    pricePerCent: 72000,
    areaUnit: "cents",
    mapLat: 12.7409,
    mapLng: 77.8253,
    mapZoom: 13,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p-demo3",
    name: "Green Valley Farmhouse Plots",
    location: "Devanahalli, Bengaluru North",
    totalArea: "15 Acres",
    numberOfPlots: 36,
    layoutImage: "",
    coverImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
    status: "planned",
    description:
      "Green Valley Farmhouse Plots is an upcoming premium project near Kempegowda International Airport. Generously sized plots (15–30 cents), clubhouse, swimming pool, and organic farming zones. Pre-launch prices available for early investors.",
    startingPrice: 3500000,
    pricePerCent: 95000,
    areaUnit: "cents",
    mapLat: 13.2516,
    mapLng: 77.7077,
    mapZoom: 13,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const facings: FacingDirection[] = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];
const statuses: PlotStatus[] = ["available", "available", "available", "booked", "sold", "reserved"];

function genPlots(projectId: string, layoutId: string, blocks: { name: string; count: number }[]): Plot[] {
  const plots: Plot[] = [];
  let idx = 0;
  blocks.forEach((block, bIdx) => {
    const cols = Math.min(6, Math.ceil(Math.sqrt(block.count * 1.5)));
    const rows = Math.ceil(block.count / cols);
    const blockW = 100 / blocks.length;
    const blockH = 100;
    const blockX = bIdx * blockW;
    const titleH = 6;
    const innerW = blockW - 4;
    const innerH = blockH - titleH - 4;
    const plotW = (innerW - (cols - 1) * 0.6) / cols;
    const plotH = (innerH - (rows - 1) * 0.6) / rows;

    for (let i = 0; i < block.count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const plotNum = i + 1;
      const isCorner = (i === 0 || i === block.count - 1 || col === 0 || col === cols - 1) && (row === 0 || row === rows - 1);
      const facing = facings[(i + bIdx) % facings.length];
      const status = statuses[(i + bIdx) % statuses.length];
      const size = 8 + (i % 4) * 2;
      const pricePerCent = 65000 + (isCorner ? 5000 : 0) + (bIdx * 2000);
      plots.push({
        id: `plot-${projectId}-${block.name}-${plotNum}`,
        layoutId,
        projectId,
        plotNumber: `${block.name}${plotNum}`,
        block: block.name,
        size,
        sizeUnit: "cents",
        facing,
        pricePerCent,
        totalPrice: size * pricePerCent,
        status,
        cornerPlot: isCorner,
        roadWidth: 30,
        notes: "",
        x: blockX + 2 + col * (plotW + 0.6),
        y: titleH + 2 + row * (plotH + 0.6),
        width: plotW,
        height: plotH,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      idx++;
    }
  });
  return plots;
}

export const demoLayouts: Layout[] = [
  { id: "l-demo1", projectId: "p-demo1", name: "Phase 1", image: "", description: "Phase 1 — 48 plots", numberOfPlots: 48, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "l-demo2", projectId: "p-demo2", name: "Phase 1", image: "", description: "Phase 1 — 64 plots", numberOfPlots: 64, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "l-demo3", projectId: "p-demo3", name: "Phase 1", image: "", description: "Phase 1 — 36 plots", numberOfPlots: 36, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const demoPlots: Plot[] = [
  ...genPlots("p-demo1", "l-demo1", [{ name: "A", count: 12 }, { name: "B", count: 12 }, { name: "C", count: 12 }, { name: "D", count: 12 }]),
  ...genPlots("p-demo2", "l-demo2", [{ name: "A", count: 16 }, { name: "B", count: 16 }, { name: "C", count: 16 }, { name: "D", count: 16 }]),
  ...genPlots("p-demo3", "l-demo3", [{ name: "A", count: 12 }, { name: "B", count: 12 }, { name: "C", count: 12 }]),
];

export const demoGallery: GalleryImage[] = [
  { id: "g1", title: "Entrance Gateway", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80", category: "Project", order: 0, createdAt: new Date().toISOString() },
  { id: "g2", title: "Internal Roads", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80", category: "Infrastructure", order: 1, createdAt: new Date().toISOString() },
  { id: "g3", title: "Sandalwood Saplings", image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80", category: "Plantation", order: 2, createdAt: new Date().toISOString() },
  { id: "g4", title: "Sunset View", image: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=800&q=80", category: "Project", order: 3, createdAt: new Date().toISOString() },
  { id: "g5", title: "Water Body", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80", category: "Nature", order: 4, createdAt: new Date().toISOString() },
  { id: "g6", title: "Farmhouse Plot", image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80", category: "Plot", order: 5, createdAt: new Date().toISOString() },
  { id: "g7", title: "Tree Lined Avenue", image: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=800&q=80", category: "Infrastructure", order: 6, createdAt: new Date().toISOString() },
  { id: "g8", title: "Mango Harvest", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=800&q=80", category: "Plantation", order: 7, createdAt: new Date().toISOString() },
  { id: "g9", title: "Panoramic View", image: "https://images.unsplash.com/photo-1444065381814-865dc9da92c0?w=800&q=80", category: "Nature", order: 8, createdAt: new Date().toISOString() },
];

export const demoAmenities: Amenity[] = [
  { id: "a1", title: "Gated Community", description: "Secured entrance with 24/7 security personnel and CCTV surveillance.", icon: "shield", image: "", order: 0 },
  { id: "a2", title: "Wide Internal Roads", description: "30-ft wide black-topped internal roads with street lighting.", icon: "road", image: "", order: 1 },
  { id: "a3", title: "Underground Electricity", description: "BESCOM connection with underground cabling to every plot.", icon: "zap", image: "", order: 2 },
  { id: "a4", title: "Water Supply", description: "Borewell + Cauvery water supply with overhead tanks.", icon: "droplet", image: "", order: 3 },
  { id: "a5", title: "Drip Irrigation", description: "Ready-to-use drip irrigation for every plot.", icon: "spray", image: "", order: 4 },
  { id: "a6", title: "Clubhouse", description: "Modern clubhouse with pool, gym, and indoor games.", icon: "home", image: "", order: 5 },
  { id: "a7", title: "Children's Play Area", description: "Safe, rubber-floored play zone with modern equipment.", icon: "smile", image: "", order: 6 },
  { id: "a8", title: "Jogging Track", description: "Tree-lined jogging and cycling track around the property.", icon: "activity", image: "", order: 7 },
  { id: "a9", title: "DTCP Approved", description: "All layouts are DTCP approved with clear titles and documentation.", icon: "check", image: "", order: 8 },
  { id: "a10", title: "Organic Farming", description: "Dedicated zones for community organic farming.", icon: "sprout", image: "", order: 9 },
];

export const demoTestimonials: Testimonial[] = [
  { id: "t1", name: "Rajesh Kumar", role: "Software Engineer, Bengaluru", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80", rating: 5, text: "Bought a sandalwood plot from VGG last year. The documentation was crystal clear and the team was transparent throughout. The plot value has already appreciated by 18%.", order: 0 },
  { id: "t2", name: "Lakshmi Narayanan", role: "Doctor, Chennai", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80", rating: 5, text: "Excellent service and genuine farmland. The drip irrigation and road infrastructure exceeded my expectations. Highly recommend VGG Infra.", order: 1 },
  { id: "t3", name: "Mohammed Iqbal", role: "Business Owner, Hyderabad", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80", rating: 4, text: "I compared 5+ developers before choosing VGG. Their pricing was fair, no hidden charges, and the location is fantastic. Will buy again.", order: 2 },
  { id: "t4", name: "Priya Sharma", role: "Architect, Bengaluru", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80", rating: 5, text: "The interactive layout tool made it so easy to pick the right plot — I could see exactly what was available and at what price. Brilliant experience.", order: 3 },
];

export const demoFAQs: FAQ[] = [
  { id: "f1", question: "Are the plots DTCP approved?", answer: "Yes, all our projects are DTCP approved with clear titles. We provide complete documentation including EC, parent deed, and conversion order before booking.", category: "Legal", order: 0 },
  { id: "f2", question: "What is the booking amount?", answer: "The booking amount is 10% of the plot value, payable via cheque, NEFT, RTGS, or UPI. The balance can be paid in installments over 3 months.", category: "Payment", order: 1 },
  { id: "f3", question: "Can I visit the site before booking?", answer: "Absolutely. We offer free site visits on weekends. Our team will pick you up from a convenient location and show you all available projects.", category: "Visit", order: 2 },
  { id: "f4", question: "Is bank loan available?", answer: "Yes, we have tie-ups with leading banks including HDFC, SBI, and ICICI for plot loans up to 80% of the plot value at attractive interest rates.", category: "Payment", order: 3 },
  { id: "f5", question: "What amenities are included?", answer: "All projects include gated security, wide internal roads, underground electricity, water supply, drip irrigation, and landscaping. Premium projects also feature clubhouse and swimming pool.", category: "Amenities", order: 4 },
  { id: "f6", question: "How do I track my plot booking status?", answer: "Once booked, you will receive a reference code. Our team will keep you updated on registration, payment schedules, and handover via SMS and email.", category: "Booking", order: 5 },
  { id: "f7", question: "Can NRI customers buy plots?", answer: "Yes, NRIs can purchase farmland plots. We assist with FEMA compliance, POA documentation, and repatriation guidelines. Contact us for NRI-specific assistance.", category: "Legal", order: 6 },
  { id: "f8", question: "What is the resale policy?", answer: "Plots can be resold after registration. We offer a resale assistance program where we list your plot on our platform and connect you with verified buyers.", category: "Resale", order: 7 },
];

export const demoTeam: TeamMember[] = [
  { id: "tm1", name: "Venkatesh G", role: "Founder & Managing Director", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80", bio: "20+ years in real estate development. Passionate about sustainable farmland investments.", phone: "+91 98765 43210", email: "venkatesh@vgginfra.com", order: 0 },
  { id: "tm2", name: "Gayathri R", role: "Director — Sales", photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80", bio: "Leads our sales team with 15+ years of experience in property advisory.", phone: "+91 98765 43211", email: "gayathri@vgginfra.com", order: 1 },
  { id: "tm3", name: "Arjun K", role: "Head of Operations", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80", bio: "Civil engineer ensuring every project meets the highest quality standards.", phone: "+91 98765 43212", email: "arjun@vgginfra.com", order: 2 },
  { id: "tm4", name: "Meena S", role: "Legal & Compliance", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80", bio: "Ensures all documentation is bulletproof. 12+ years in property law.", phone: "+91 98765 43213", email: "meena@vgginfra.com", order: 3 },
];

export const demoOffers: Offer[] = [
  { id: "o1", title: "Monsoon Special — 5% Off", description: "Book any plot before July 31 and get 5% off + free site visit + complimentary legal verification.", image: "https://images.unsplash.com/photo-1438449805896-28a666819a20?w=800&q=80", validUntil: "2026-07-31", active: true, order: 0 },
  { id: "o2", title: "Refer & Earn ₹50,000", description: "Refer a friend who books a plot and earn ₹50,000 cashback on your next maintenance payment.", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80", validUntil: "2026-12-31", active: true, order: 1 },
  { id: "o3", title: "NRI Early-Bird Pricing", description: "Exclusive pre-launch pricing for NRI customers on Green Valley Farmhouse Plots. Limited to first 10 bookings.", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80", validUntil: "2026-09-30", active: true, order: 2 },
];

export const demoBrochures: Brochure[] = [
  { id: "b1", title: "Vijaya Sandalwood Farm — Brochure", fileUrl: "#", projectId: "p-demo1", order: 0 },
  { id: "b2", title: "Mango Orchard Estates — Price List", fileUrl: "#", projectId: "p-demo2", order: 1 },
  { id: "b3", title: "Green Valley — Pre-Launch Deck", fileUrl: "#", projectId: "p-demo3", order: 2 },
];

export const demoNews: NewsItem[] = [
  { id: "n1", title: "VGG Infra Launches Green Valley Pre-Launch Bookings", content: "Pre-launch bookings for our premium Devanahalli project are now open. Limited plots available at introductory pricing.", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80", date: "2026-07-01", link: "#", order: 0 },
  { id: "n2", title: "Sandalwood Farm Phase 2 — 80% Sold Out", content: "Thanks to overwhelming response, Phase 2 of Vijaya Sandalwood Farm is 80% sold within 60 days of launch.", image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80", date: "2026-06-15", link: "#", order: 1 },
  { id: "n3", title: "New Tie-up with HDFC for Plot Loans", content: "We're happy to announce our partnership with HDFC Bank for instant plot loan approvals up to 80% LTV.", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80", date: "2026-05-28", link: "#", order: 2 },
];

export const demoNearby: NearbyPlace[] = [
  { id: "np1", name: "Kempegowda International Airport", type: "Airport", distanceKm: 28, travelMinutes: 35, icon: "plane", order: 0 },
  { id: "np2", name: "Anekal Town", type: "Town", distanceKm: 6, travelMinutes: 12, icon: "building", order: 1 },
  { id: "np3", name: "BMR Bus Stand", type: "Transport", distanceKm: 4, travelMinutes: 8, icon: "bus", order: 2 },
  { id: "np4", name: "Sarjapur Tech Park", type: "IT Hub", distanceKm: 22, travelMinutes: 40, icon: "building", order: 3 },
  { id: "np5", name: "Apollo Hospital", type: "Healthcare", distanceKm: 14, travelMinutes: 25, icon: "heart", order: 4 },
  { id: "np6", name: "Delhi Public School", type: "Education", distanceKm: 9, travelMinutes: 18, icon: "book", order: 5 },
];

export const demoVideos: VideoItem[] = [
  { id: "v1", title: "Project Walkthrough — Vijaya Sandalwood Farm", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", thumbnail: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80", projectId: "p-demo1", order: 0 },
  { id: "v2", title: "Drone View — Mango Orchard Estates", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", thumbnail: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=800&q=80", projectId: "p-demo2", order: 1 },
];

export const demoStats: CompanyStat[] = [
  { id: "s1", label: "Acres Developed", value: 47, suffix: "+", icon: "trees", order: 0 },
  { id: "s2", label: "Happy Customers", value: 850, suffix: "+", icon: "users", order: 1 },
  { id: "s3", label: "Projects Completed", value: 12, suffix: "", icon: "check", order: 2 },
  { id: "s4", label: "Years of Trust", value: 15, suffix: "+", icon: "award", order: 3 },
];

export const demoTimeline: TimelineEvent[] = [
  { id: "tl1", year: "2010", title: "VGG Infra Founded", description: "Started with a single 5-acre project in Anekal.", order: 0 },
  { id: "tl2", year: "2014", title: "First DTCP Approval", description: "Vijaya Farms became our first DTCP-approved layout.", order: 1 },
  { id: "tl3", year: "2018", title: "100+ Plots Sold", description: "Crossed 100 happy customers across 3 projects.", order: 2 },
  { id: "tl4", year: "2022", title: "Sandalwood Project Launch", description: "Launched Vijaya Sandalwood Farm — sold out Phase 1 in 90 days.", order: 3 },
  { id: "tl5", year: "2026", title: "Green Valley Pre-Launch", description: "Premium farmhouse plots near the airport — pre-launch bookings open.", order: 4 },
];
