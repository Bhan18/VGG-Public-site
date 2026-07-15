// ============================================================
// VGG Infra Developers — Supabase Client
// Reads from existing admin dashboard database.
// If env vars aren't set (or are placeholders), returns null so
// callers can fall back to demo data.
// ============================================================
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;
let _initialized = false;

const PLACEHOLDER_VALUES = new Set([
  "",
  "placeholder",
  "PASTE_YOUR_ANON_KEY_HERE",
  "YOUR-ANON-KEY",
  "YOUR_ANON_KEY",
  "https://placeholder.supabase.co",
]);

function isRealValue(v: string | undefined): boolean {
  if (!v) return false;
  if (PLACEHOLDER_VALUES.has(v)) return false;
  // Supabase URLs must start with https:// and contain .supabase.co
  if (v.startsWith("http") && !v.includes("supabase.co")) return false;
  // Anon keys are JWTs — they start with eyJ
  if (!v.startsWith("http") && !v.startsWith("eyJ")) return false;
  return true;
}

export function getSupabase(): SupabaseClient | null {
  if (_initialized) return _client;
  _initialized = true;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isRealValue(supabaseUrl) || !isRealValue(supabaseAnonKey)) {
    // Not configured — caller falls back to demo data.
    return null;
  }

  _client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

export function isSupabaseConfigured(): boolean {
  return (
    isRealValue(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    isRealValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}
