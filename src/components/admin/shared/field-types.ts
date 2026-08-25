// ============================================================
// Field type definitions for the generic admin editor
// ============================================================
import type { LucideIcon } from "lucide-react";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "image"
  | "date"
  | "url";

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: { value: string; label: string }[]; // for select
  default?: unknown;
  // Hide from table columns to keep it compact
  hideInTable?: boolean;
  // Span full width in form
  fullWidth?: boolean;
}

export interface EditorConfig {
  table: string;           // Supabase table name
  title: string;           // e.g. "Hero Banners"
  singular: string;        // e.g. "Hero Banner"
  icon: LucideIcon;
  description?: string;
  fields: FieldConfig[];
  // Default order field name (usually "order")
  orderField?: string;
  // Whether the table supports active/inactive toggle
  hasActiveToggle?: boolean;
}
