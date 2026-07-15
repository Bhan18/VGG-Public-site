"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { FieldConfig } from "./field-types";

export function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const labelEl = (
    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
      {field.label} {field.required && <span className="text-destructive">*</span>}
    </Label>
  );

  const wrapperClass = cn(field.fullWidth && "sm:col-span-2");

  switch (field.type) {
    case "text":
      return (
        <div className={wrapperClass}>
          {labelEl}
          <Input
            type="text"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
          {field.helpText && <p className="text-xs text-muted-foreground mt-1">{field.helpText}</p>}
        </div>
      );
    case "url":
      return (
        <div className={wrapperClass}>
          {labelEl}
          <Input
            type="url"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? "https://..."}
            required={field.required}
          />
          {field.helpText && <p className="text-xs text-muted-foreground mt-1">{field.helpText}</p>}
        </div>
      );
    case "textarea":
      return (
        <div className={wrapperClass}>
          {labelEl}
          <Textarea
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            required={field.required}
          />
          {field.helpText && <p className="text-xs text-muted-foreground mt-1">{field.helpText}</p>}
        </div>
      );
    case "number":
      return (
        <div className={wrapperClass}>
          {labelEl}
          <Input
            type="number"
            value={(value as number) ?? ""}
            onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder={field.placeholder}
            required={field.required}
          />
          {field.helpText && <p className="text-xs text-muted-foreground mt-1">{field.helpText}</p>}
        </div>
      );
    case "date":
      return (
        <div className={wrapperClass}>
          {labelEl}
          <Input
            type="date"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        </div>
      );
    case "boolean":
      return (
        <div className={wrapperClass}>
          <div className="flex items-center gap-3 h-9">
            <Switch
              checked={Boolean(value)}
              onCheckedChange={onChange}
            />
            <span className="text-sm">{field.label}</span>
          </div>
          {field.helpText && <p className="text-xs text-muted-foreground mt-1">{field.helpText}</p>}
        </div>
      );
    case "select":
      return (
        <div className={wrapperClass}>
          {labelEl}
          <Select value={(value as string) ?? ""} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder ?? "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.helpText && <p className="text-xs text-muted-foreground mt-1">{field.helpText}</p>}
        </div>
      );
    case "image":
      return (
        <div className={wrapperClass}>
          {labelEl}
          <div className="flex gap-3">
            <Input
              type="url"
              value={(value as string) ?? ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder ?? "https://images..."}
              required={field.required}
              className="flex-1"
            />
            {value && (
              <div className="w-14 h-14 rounded-lg overflow-hidden border border-border flex-shrink-0 bg-secondary">
                <img src={value as string} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          {field.helpText && <p className="text-xs text-muted-foreground mt-1">{field.helpText}</p>}
        </div>
      );
    default:
      return null;
  }
}
