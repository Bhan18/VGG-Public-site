"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, X, ArrowUp, ArrowDown, Loader2, AlertCircle,
  Search, Eye, EyeOff, Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { fetchRows, createRow, updateRow, deleteRow, reorderRows, usingLocalFallback, type Row } from "../crud";
import { FieldRenderer } from "./field-renderer";
import type { EditorConfig, FieldConfig } from "./field-types";

export function EditorShell({ config }: { config: EditorConfig }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRows(config.table);
      setRows(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [config.table]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = rows.filter((r) => {
    if (!search) return true;
    return Object.values(r).some((v) =>
      String(v ?? "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleAdd = () => {
    const empty: Row = { id: "" };
    config.fields.forEach((f) => {
      empty[f.key] = f.default ?? (f.type === "boolean" ? false : f.type === "number" ? 0 : "");
    });
    empty[config.orderField ?? "order"] = rows.length;
    setEditing(empty);
    setIsFormOpen(true);
  };

  const handleEdit = (row: Row) => {
    setEditing({ ...row });
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    // Validate required
    for (const f of config.fields) {
      if (f.required && !editing[f.key]) {
        toast.error(`${f.label} is required`);
        return;
      }
    }
    setSaving(true);
    try {
      const { id, created_at, ...patch } = editing;
      if (id) {
        await updateRow(config.table, id, patch);
        toast.success(`${config.singular} updated`);
      } else {
        await createRow(config.table, patch);
        toast.success(`${config.singular} added`);
      }
      setIsFormOpen(false);
      setEditing(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteRow(config.table, deleteId);
      toast.success(`${config.singular} deleted`);
      setDeleteId(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const handleToggleActive = async (row: Row, value: boolean) => {
    try {
      await updateRow(config.table, row.id as string, { active: value });
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  };

  const moveRow = async (idx: number, dir: "up" | "down") => {
    const newRows = [...filtered];
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newRows.length) return;
    [newRows[idx], newRows[targetIdx]] = [newRows[targetIdx], newRows[idx]];
    // Update order field based on new positions
    const orderedIds = newRows.map((r) => r.id as string);
    setRows((prev) => {
      const map = new Map(prev.map((r) => [r.id, r]));
      const reordered = orderedIds.map((id, i) => ({ ...(map.get(id) as Row), [config.orderField ?? "order"]: i }));
      // Merge back with any rows that were filtered out
      const filteredIds = new Set(orderedIds);
      const others = prev.filter((r) => !filteredIds.has(r.id));
      return [...reordered, ...others];
    });
    try {
      await reorderRows(config.table, orderedIds);
      toast.success("Order updated");
    } catch (e) {
      toast.error("Reorder failed");
      await load();
    }
  };

  const Icon = config.icon;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{config.title}</h2>
            {config.description && <p className="text-xs text-muted-foreground">{config.description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {usingLocalFallback() && (
            <Badge variant="outline" className="text-amber-600 border-amber-500/40">Local Mode</Badge>
          )}
          <Button onClick={handleAdd} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add {config.singular}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm">{error}</p>
          <Button variant="ghost" size="sm" onClick={load} className="ml-auto">Retry</Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden bg-card">
        {loading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <Icon className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>No {config.title.toLowerCase()} yet. Click "Add {config.singular}" to create one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="p-3 text-left font-semibold w-12">#</th>
                  {config.fields.filter((f) => !f.hideInTable).slice(0, 4).map((f) => (
                    <th key={f.key} className="p-3 text-left font-semibold">{f.label}</th>
                  ))}
                  {config.hasActiveToggle && <th className="p-3 text-center font-semibold w-20">Active</th>}
                  <th className="p-3 text-right font-semibold w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr key={row.id as string} className="border-b border-border last:border-0 hover:bg-secondary/30">
                    <td className="p-3 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">{idx + 1}</span>
                        <div className="flex flex-col">
                          <button
                            onClick={() => moveRow(idx, "up")}
                            disabled={idx === 0}
                            className="text-muted-foreground hover:text-primary disabled:opacity-30"
                            aria-label="Move up"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => moveRow(idx, "down")}
                            disabled={idx === filtered.length - 1}
                            className="text-muted-foreground hover:text-primary disabled:opacity-30"
                            aria-label="Move down"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </td>
                    {config.fields.filter((f) => !f.hideInTable).slice(0, 4).map((f) => (
                      <td key={f.key} className="p-3 max-w-xs">
                        <CellRenderer field={f} value={row[f.key]} />
                      </td>
                    ))}
                    {config.hasActiveToggle && (
                      <td className="p-3 text-center">
                        <Switch
                          checked={Boolean(row.active)}
                          onCheckedChange={(v) => handleToggleActive(row, v)}
                        />
                      </td>
                    )}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(row)} aria-label="Edit">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(row.id as string)} aria-label="Delete">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {isFormOpen && editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-card rounded-2xl shadow-2xl border border-border"
            >
              <div className="sticky top-0 bg-card border-b border-border p-5 flex items-center justify-between z-10">
                <h3 className="font-bold text-lg">
                  {editing.id ? `Edit ${config.singular}` : `Add ${config.singular}`}
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setIsFormOpen(false)} aria-label="Close">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-5 grid sm:grid-cols-2 gap-4">
                {config.fields.map((f) => (
                  <FieldRenderer
                    key={f.key}
                    field={f}
                    value={editing[f.key]}
                    onChange={(v) => setEditing({ ...editing, [f.key]: v })}
                  />
                ))}
              </div>
              <div className="sticky bottom-0 bg-card border-t border-border p-5 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {config.singular.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The item will be permanently removed from your website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CellRenderer({ field, value }: { field: FieldConfig; value: unknown }) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-muted-foreground/40">—</span>;
  }
  if (field.type === "image") {
    return (
      <div className="w-12 h-12 rounded-lg overflow-hidden border border-border bg-secondary flex-shrink-0">
        <img src={value as string} alt="" className="w-full h-full object-cover" />
      </div>
    );
  }
  if (field.type === "boolean") {
    return value ? <Eye className="h-4 w-4 text-emerald-500" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />;
  }
  if (field.type === "textarea") {
    return <span className="line-clamp-2 text-muted-foreground">{String(value)}</span>;
  }
  const str = String(value);
  if (str.length > 60) {
    return <span className="line-clamp-2">{str}</span>;
  }
  return <span className="font-medium">{str}</span>;
}
