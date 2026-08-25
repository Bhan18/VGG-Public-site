import { NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase-client";

const TABLES = [
  "amenities", "brochures", "company_stats", "faqs", "gallery_images",
  "hero_banners", "layouts", "nearby_places", "news", "offers", "plots",
  "projects", "settings", "team_members", "testimonials", "timeline_events",
  "videos",
] as const;

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        configured: false,
        hint: "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing at build time.",
      },
      { status: 503 },
    );
  }

  const s = getSupabase()!;
  const tables: Record<string, { ok: boolean; count?: number; error?: string }> = {};

  await Promise.all(
    TABLES.map(async (t) => {
      const { count, error } = await s
        .from(t)
        .select("*", { count: "exact", head: true });
      tables[t] = error
        ? { ok: false, error: error.message }
        : { ok: true, count: count ?? 0 };
    }),
  );

  const okCount = Object.values(tables).filter((t) => t.ok).length;
  return NextResponse.json({ configured: true, ok: okCount, total: TABLES.length, tables });
}
