// ============================================================
// Editor configs for all 13 content tables
// ============================================================
import {
  Image, Images, Sparkles, MessageSquare, HelpCircle, Users, Tag,
  FileText, Newspaper, MapPin, Video, BarChart3, GitBranch,
  type LucideIcon,
} from "lucide-react";
import type { EditorConfig } from "./field-types";

export const EDITOR_CONFIGS: EditorConfig[] = [
  // 1. Hero Banners
  {
    table: "hero_banners",
    title: "Hero Banners",
    singular: "Hero Banner",
    icon: Image,
    description: "Homepage slider images with title, subtitle, and CTA",
    orderField: "order",
    hasActiveToggle: true,
    fields: [
      { key: "title", label: "Title", type: "text", required: true, placeholder: "Own a Piece of Nature", fullWidth: true },
      { key: "subtitle", label: "Subtitle", type: "text", placeholder: "Premium Farmland Plots Near Bengaluru", fullWidth: true },
      { key: "image", label: "Image URL", type: "image", required: true, helpText: "Recommended: 1920×1080px landscape", fullWidth: true },
      { key: "cta_text", label: "CTA Text", type: "text", placeholder: "Explore Projects" },
      { key: "cta_link", label: "CTA Link", type: "text", placeholder: "#projects" },
      { key: "order", label: "Order", type: "number", default: 0, hideInTable: true },
      { key: "active", label: "Active", type: "boolean", default: true, hideInTable: true },
    ],
  },
  // 2. Gallery
  {
    table: "gallery_images",
    title: "Gallery",
    singular: "Gallery Image",
    icon: Images,
    description: "Photo gallery shown on homepage",
    orderField: "order",
    fields: [
      { key: "title", label: "Title", type: "text", placeholder: "Entrance Gateway" },
      { key: "image", label: "Image URL", type: "image", required: true, fullWidth: true },
      { key: "category", label: "Category", type: "text", placeholder: "Project / Infrastructure / Nature" },
      { key: "order", label: "Order", type: "number", default: 0, hideInTable: true },
    ],
  },
  // 3. Amenities
  {
    table: "amenities",
    title: "Amenities",
    singular: "Amenity",
    icon: Sparkles,
    description: "Amenity icons shown on homepage",
    orderField: "order",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, placeholder: "Gated Community" },
      { key: "description", label: "Description", type: "textarea", fullWidth: true },
      {
        key: "icon", label: "Icon", type: "select",
        options: [
          { value: "shield", label: "Shield" }, { value: "road", label: "Road" },
          { value: "zap", label: "Zap (Electricity)" }, { value: "droplet", label: "Droplet (Water)" },
          { value: "spray", label: "Spray (Irrigation)" }, { value: "home", label: "Home" },
          { value: "smile", label: "Smile (Play Area)" }, { value: "activity", label: "Activity (Jogging)" },
          { value: "check", label: "Check (Approved)" }, { value: "sprout", label: "Sprout (Organic)" },
        ],
        default: "check",
      },
      { key: "image", label: "Image URL (optional)", type: "image", fullWidth: true },
      { key: "order", label: "Order", type: "number", default: 0, hideInTable: true },
    ],
  },
  // 4. Testimonials
  {
    table: "testimonials",
    title: "Testimonials",
    singular: "Testimonial",
    icon: MessageSquare,
    description: "Customer reviews shown in carousel",
    orderField: "order",
    fields: [
      { key: "name", label: "Customer Name", type: "text", required: true, placeholder: "Rajesh Kumar" },
      { key: "role", label: "Role / Location", type: "text", placeholder: "Software Engineer, Bengaluru" },
      { key: "photo", label: "Photo URL", type: "image" },
      { key: "rating", label: "Rating (1-5)", type: "number", default: 5, required: true },
      { key: "text", label: "Testimonial Text", type: "textarea", required: true, fullWidth: true },
      { key: "video_url", label: "Video URL (optional)", type: "url", fullWidth: true },
      { key: "order", label: "Order", type: "number", default: 0, hideInTable: true },
    ],
  },
  // 5. FAQs
  {
    table: "faqs",
    title: "FAQs",
    singular: "FAQ",
    icon: HelpCircle,
    description: "Frequently asked questions",
    orderField: "order",
    fields: [
      { key: "question", label: "Question", type: "text", required: true, fullWidth: true },
      { key: "answer", label: "Answer", type: "textarea", required: true, fullWidth: true },
      { key: "category", label: "Category", type: "text", placeholder: "Legal / Payment / Visit / Amenities" },
      { key: "order", label: "Order", type: "number", default: 0, hideInTable: true },
    ],
  },
  // 6. Team Members
  {
    table: "team_members",
    title: "Team Members",
    singular: "Team Member",
    icon: Users,
    description: "People shown in the Team section",
    orderField: "order",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "role", label: "Role", type: "text", placeholder: "Founder & MD" },
      { key: "photo", label: "Photo URL", type: "image" },
      { key: "bio", label: "Bio", type: "textarea", fullWidth: true },
      { key: "phone", label: "Phone", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "linkedin", label: "LinkedIn URL", type: "url", fullWidth: true },
      { key: "order", label: "Order", type: "number", default: 0, hideInTable: true },
    ],
  },
  // 7. Offers
  {
    table: "offers",
    title: "Offers",
    singular: "Offer",
    icon: Tag,
    description: "Limited-time offers shown on homepage",
    orderField: "order",
    hasActiveToggle: true,
    fields: [
      { key: "title", label: "Title", type: "text", required: true, fullWidth: true },
      { key: "description", label: "Description", type: "textarea", fullWidth: true },
      { key: "image", label: "Image URL", type: "image", fullWidth: true },
      { key: "valid_until", label: "Valid Until", type: "date" },
      { key: "order", label: "Order", type: "number", default: 0, hideInTable: true },
      { key: "active", label: "Active", type: "boolean", default: true, hideInTable: true },
    ],
  },
  // 8. Brochures
  {
    table: "brochures",
    title: "Brochures",
    singular: "Brochure",
    icon: FileText,
    description: "PDF brochures and price lists",
    orderField: "order",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, placeholder: "Vijaya Sandalwood Farm — Brochure", fullWidth: true },
      { key: "file_url", label: "PDF URL", type: "url", required: true, fullWidth: true, helpText: "Upload to Supabase Storage and paste the public URL" },
      {
        key: "project_id", label: "Project", type: "select",
        options: [], // populated dynamically at runtime via projects
        helpText: "Leave empty to show on all projects",
      },
      { key: "order", label: "Order", type: "number", default: 0, hideInTable: true },
    ],
  },
  // 9. News
  {
    table: "news",
    title: "News & Announcements",
    singular: "News Item",
    icon: Newspaper,
    description: "News articles and announcements",
    orderField: "order",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, fullWidth: true },
      { key: "content", label: "Content", type: "textarea", fullWidth: true },
      { key: "image", label: "Image URL", type: "image", fullWidth: true },
      { key: "date", label: "Date", type: "date", required: true },
      { key: "link", label: "External Link (optional)", type: "url", fullWidth: true },
      { key: "order", label: "Order", type: "number", default: 0, hideInTable: true },
    ],
  },
  // 10. Nearby Places
  {
    table: "nearby_places",
    title: "Nearby Places",
    singular: "Nearby Place",
    icon: MapPin,
    description: "Places shown in the Location section",
    orderField: "order",
    fields: [
      { key: "name", label: "Name", type: "text", required: true, placeholder: "Kempegowda International Airport" },
      { key: "type", label: "Type", type: "text", placeholder: "Airport / Town / Hospital / School" },
      { key: "distance_km", label: "Distance (km)", type: "number" },
      { key: "travel_minutes", label: "Travel Time (min)", type: "number" },
      {
        key: "icon", label: "Icon", type: "select",
        options: [
          { value: "plane", label: "Plane" }, { value: "building", label: "Building" },
          { value: "bus", label: "Bus" }, { value: "heart", label: "Heart (Hospital)" },
          { value: "book", label: "Book (School)" },
        ],
        default: "building",
      },
      { key: "order", label: "Order", type: "number", default: 0, hideInTable: true },
    ],
  },
  // 11. Videos
  {
    table: "videos",
    title: "Videos",
    singular: "Video",
    icon: Video,
    description: "Video tours shown on homepage",
    orderField: "order",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, fullWidth: true },
      { key: "url", label: "Embed URL", type: "url", required: true, fullWidth: true, helpText: "YouTube embed URL like https://www.youtube.com/embed/VIDEO_ID" },
      { key: "thumbnail", label: "Thumbnail URL", type: "image", fullWidth: true },
      { key: "order", label: "Order", type: "number", default: 0, hideInTable: true },
    ],
  },
  // 12. Company Stats
  {
    table: "company_stats",
    title: "Company Stats",
    singular: "Stat",
    icon: BarChart3,
    description: "Animated counters in the About section",
    orderField: "order",
    fields: [
      { key: "label", label: "Label", type: "text", required: true, placeholder: "Acres Developed" },
      { key: "value", label: "Value", type: "number", required: true },
      { key: "suffix", label: "Suffix", type: "text", placeholder: "+ / %" },
      {
        key: "icon", label: "Icon", type: "select",
        options: [
          { value: "trees", label: "Trees" }, { value: "users", label: "Users" },
          { value: "award", label: "Award" }, { value: "check", label: "Check" },
          { value: "sprout", label: "Sprout" },
        ],
        default: "award",
      },
      { key: "order", label: "Order", type: "number", default: 0, hideInTable: true },
    ],
  },
  // 13. Timeline Events
  {
    table: "timeline_events",
    title: "Timeline Events",
    singular: "Timeline Event",
    icon: GitBranch,
    description: "Milestones shown in the About section timeline",
    orderField: "order",
    fields: [
      { key: "year", label: "Year", type: "text", required: true, placeholder: "2010" },
      { key: "title", label: "Title", type: "text", required: true, fullWidth: true },
      { key: "description", label: "Description", type: "textarea", fullWidth: true },
      { key: "order", label: "Order", type: "number", default: 0, hideInTable: true },
    ],
  },
];

export function getEditorConfig(table: string): EditorConfig | undefined {
  return EDITOR_CONFIGS.find((c) => c.table === table);
}

export const EDITOR_GROUPS: { label: string; tables: string[] }[] = [
  { label: "Homepage", tables: ["hero_banners", "company_stats", "timeline_events"] },
  { label: "Content", tables: ["gallery", "amenities", "videos", "offers", "news"] },
  { label: "Social Proof", tables: ["testimonials", "team_members"] },
  { label: "Info", tables: ["faqs", "nearby_places", "brochures"] },
];

export function getGroupedEditors(): { label: string; configs: EditorConfig[] }[] {
  return EDITOR_GROUPS.map((g) => ({
    label: g.label,
    configs: g.tables.map((t) => EDITOR_CONFIGS.find((c) => c.table === t)!).filter(Boolean),
  }));
}

export type { LucideIcon };
