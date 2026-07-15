"use client";
// ============================================================
// VGG Admin — CRUD helpers for content tables
// Uses Supabase when configured, falls back to in-memory state
// (persisted to localStorage) so the admin UI is fully functional
// even in the preview environment.
// ============================================================
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase-client";

export type Row = Record<string, unknown>;

const LS_PREFIX = "vgg-admin-";

function lsGet(table: string): Row[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_PREFIX + table);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function lsSet(table: string, rows: Row[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_PREFIX + table, JSON.stringify(rows));
}

function genId(table: string): string {
  return `${table.slice(0, 3)}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export async function fetchRows(table: string): Promise<Row[]> {
  // Supabase path
  if (isSupabaseConfigured()) {
    const s = getSupabase()!;
    const { data, error } = await s.from(table).select("*").order("order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Row[];
  }
  // Local fallback
  return lsGet(table);
}

export async function createRow(table: string, row: Partial<Row>): Promise<Row> {
  const fullRow: Row = { id: genId(table), ...row, created_at: new Date().toISOString() };
  if (isSupabaseConfigured()) {
    const s = getSupabase()!;
    const { data, error } = await s.from(table).insert(fullRow).select().single();
    if (error) throw error;
    return data as Row;
  }
  const rows = lsGet(table);
  rows.push(fullRow);
  lsSet(table, rows);
  return fullRow;
}

export async function updateRow(table: string, id: string, patch: Partial<Row>): Promise<void> {
  if (isSupabaseConfigured()) {
    const s = getSupabase()!;
    const { error } = await s.from(table).update(patch).eq("id", id);
    if (error) throw error;
    return;
  }
  const rows = lsGet(table);
  const idx = rows.findIndex((r) => r.id === id);
  if (idx >= 0) {
    rows[idx] = { ...rows[idx], ...patch };
    lsSet(table, rows);
  }
}

export async function deleteRow(table: string, id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const s = getSupabase()!;
    const { error } = await s.from(table).delete().eq("id", id);
    if (error) throw error;
    return;
  }
  const rows = lsGet(table).filter((r) => r.id !== id);
  lsSet(table, rows);
}

export async function reorderRows(table: string, orderedIds: string[]): Promise<void> {
  if (isSupabaseConfigured()) {
    const s = getSupabase()!;
    // Update each row's order field
    await Promise.all(
      orderedIds.map((id, idx) => s.from(table).update({ order: idx }).eq("id", id))
    );
    return;
  }
  const rows = lsGet(table);
  const reordered = orderedIds
    .map((id, idx) => {
      const r = rows.find((x) => x.id === id);
      return r ? { ...r, order: idx } : null;
    })
    .filter(Boolean) as Row[];
  lsSet(table, reordered);
}

export function usingLocalFallback(): boolean {
  return !isSupabaseConfigured();
}
