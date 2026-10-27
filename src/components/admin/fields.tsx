import { useId, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { iconNames, type IconName } from "@/content/eduarc";
import { FeatureIcon } from "@/components/site/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const inputClass = "rounded-xl bg-background/70 text-[15px]";

export function Panel({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string | undefined;
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <section className={cn("glass animate-rise rounded-3xl p-6 md:p-8", className)}>
      <h2 className="text-[19px] font-semibold tracking-tight text-foreground">{title}</h2>
      {description && <p className="mt-1 text-[14px] text-muted-foreground">{description}</p>}
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

export function TextField({
  label,
  value,
  onChange,
  long,
  hint,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  long?: boolean | undefined;
  hint?: string | undefined;
  type?: string | undefined;
}) {
  const id = useId();
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[13px] font-medium text-foreground">
        {label}
      </Label>
      {long ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={cn(inputClass, "min-h-[88px] resize-y")}
        />
      ) : (
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(inputClass, "h-11")}
        />
      )}
      {hint && <p className="text-[12px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  prefix,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string | undefined;
  hint?: string | undefined;
}) {
  const id = useId();
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[13px] font-medium text-foreground">
        {label}
      </Label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          id={id}
          inputMode="numeric"
          value={value === 0 ? "" : String(value)}
          placeholder="0"
          onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "").slice(0, 9)) || 0)}
          className={cn(inputClass, "h-11", prefix && "pl-8")}
        />
      </div>
      {hint && <p className="text-[12px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

type FieldSpec<T> = {
  key: keyof T & string;
  label: string;
  long?: boolean | undefined;
  hint?: string;
};

/** Renders a text field for each listed key of a flat string object. */
export function ObjectFields<T extends Record<string, string>>({
  value,
  onChange,
  fields,
}: {
  value: T;
  onChange: (v: T) => void;
  fields: FieldSpec<T>[];
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {fields.map((f) => (
        <div key={f.key} className={f.long ? "md:col-span-2" : undefined}>
          <TextField
            label={f.label}
            long={f.long}
            hint={f.hint}
            value={value[f.key] ?? ""}
            onChange={(v) => onChange({ ...value, [f.key]: v })}
          />
        </div>
      ))}
    </div>
  );
}

export function IconSelect({
  value,
  onChange,
}: {
  value: IconName;
  onChange: (v: IconName) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-[13px] font-medium text-foreground">Icon</Label>
      <Select value={value} onValueChange={(v) => onChange(v as IconName)}>
        <SelectTrigger className={cn(inputClass, "h-11")} aria-label="Icon">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {iconNames.map((name) => (
            <SelectItem key={name} value={name}>
              <span className="flex items-center gap-2 capitalize">
                <FeatureIcon
                  name={name}
                  className="h-6 w-6 rounded-lg [&_svg]:h-3.5 [&_svg]:w-3.5"
                />
                {name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function move<T>(items: T[], from: number, to: number) {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item as T);
  return next;
}

export function ListEditor<T>({
  label,
  items,
  onChange,
  max,
  newItem,
  itemTitle,
  renderItem,
  addLabel = "Add item",
}: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  max: number;
  newItem: () => T;
  itemTitle: (item: T, i: number) => string;
  renderItem: (item: T, set: (v: T) => void) => ReactNode;
  addLabel?: string | undefined;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-foreground">
          {label} <span className="text-muted-foreground">({items.length})</span>
        </p>
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          className="hover-lift rounded-2xl border border-hairline bg-background/60 p-4 md:p-5"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="truncate text-[14px] font-semibold text-foreground">
              <span className="mr-2 text-muted-foreground">{i + 1}.</span>
              {itemTitle(item, i) || "Untitled"}
            </p>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                disabled={i === 0}
                onClick={() => onChange(move(items, i, i - 1))}
                aria-label="Move up"
              >
                <ArrowUp />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                disabled={i === items.length - 1}
                onClick={() => onChange(move(items, i, i + 1))}
                aria-label="Move down"
              >
                <ArrowDown />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-destructive hover:text-destructive"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                aria-label="Remove"
              >
                <Trash2 />
              </Button>
            </div>
          </div>
          {renderItem(item, (v) => onChange(items.map((it, j) => (j === i ? v : it))))}
        </div>
      ))}
      {items.length < max && (
        <Button
          type="button"
          variant="pill-outline"
          size="pill-sm"
          onClick={() => onChange([...items, newItem()])}
        >
          <Plus /> {addLabel}
        </Button>
      )}
    </div>
  );
}

export function StringList({
  label,
  items,
  onChange,
  max,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  max: number;
  placeholder?: string | undefined;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[13px] font-medium text-foreground">{label}</p>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={item}
            placeholder={placeholder}
            onChange={(e) => onChange(items.map((it, j) => (j === i ? e.target.value : it)))}
            className={cn(inputClass, "h-10")}
            aria-label={`${label} ${i + 1}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-full text-destructive hover:text-destructive"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            aria-label="Remove"
          >
            <Trash2 />
          </Button>
        </div>
      ))}
      {items.length < max && (
        <Button
          type="button"
          variant="text-link"
          size="inline"
          className="text-[14px]"
          onClick={() => onChange([...items, ""])}
        >
          <Plus /> Add line
        </Button>
      )}
    </div>
  );
}
