import { Check, ChevronDown, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  COMPARATORS,
  DURATION_UNITS,
  VEHICLE_BRANDS,
  VEHICLE_MODELS,
  VEHICLE_TYPES,
  getGroupsForBranches,
} from "@/data/reports";
import { cn } from "@/lib/utils";

export type ReportFilters = {
  durationStatus: string;
  durationCompare: string;
  durationUnit: string;
  durationValue: string;
  distanceCompare: string;
  distanceValue: string;
  durationFormat: "hhmm" | "decimal";
  datePreset: string;
  from: string;
  to: string;
  enableTimeRange?: boolean;
  fromTime?: string;
  toTime?: string;
  companies?: string[];
  branches?: string[];
  groups?: string[];
  types?: string[];
  brands?: string[];
  models?: string[];
  objects: string[];
};

export const DEFAULT_FILTERS: ReportFilters = {
  durationStatus: "All",
  durationCompare: "Greater Than",
  durationUnit: "Hour",
  durationValue: "",
  distanceCompare: "Greater Than",
  distanceValue: "",
  durationFormat: "hhmm",
  datePreset: "Today",
  from: "2026-09-02",
  to: "2026-09-02",
  enableTimeRange: true,
  fromTime: "00:00",
  toTime: "23:59",
  companies: [],
  branches: [],
  groups: [],
  types: ["Dumper", "Truck", "Bus"],
  brands: ["Ashok Leyland"],
  models: ["10 Wheel"],
  objects: [],
};

export type ExportFormat = "XLS" | "PDF" | "CSV";
export type ExportScope = "summary" | "detail";

function SelectDropdown({
  value,
  options,
  onChange,
  className,
  placeholder,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input/80 bg-background px-3 text-xs text-foreground font-semibold shadow-2xs transition-all hover:border-[#0089FF]/60 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF] cursor-pointer select-none",
          open && "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-muted/40",
        )}
      >
        <span className="truncate">{value || placeholder || "Select"}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 max-h-52 overflow-y-auto rounded-lg border border-border/80 bg-popover/98 backdrop-blur-xl p-1 shadow-lg animate-in fade-in-0 zoom-in-95 select-none">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-sm px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer select-none",
                value === opt
                  ? "bg-[#0089FF]/10 font-bold text-[#0089FF] hover:bg-[#0089FF]/15"
                  : "text-foreground hover:bg-muted/80 hover:text-foreground font-medium",
              )}
            >
              <span>{opt}</span>
              {value === opt && (
                <Check className="h-3.5 w-3.5 text-[#0089FF]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MultiSelectDropdown({
  label,
  selected,
  options,
  onChange,
  className,
}: {
  label: string;
  selected: string[];
  options: string[];
  onChange: (next: string[]) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  const isAll = selected.length === options.length && options.length > 0;

  const displayText = useMemo(() => {
    if (!selected || selected.length === 0) {
      const first = options[0] || label;
      const remaining = Math.max(0, options.length - 1);
      return remaining > 0 ? `${first} +${remaining}` : first;
    }
    if (selected.length === 1) return selected[0];
    return `${selected[0]} +${selected.length - 1}`;
  }, [selected, options, label]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input/80 bg-background px-3 text-xs text-foreground font-semibold shadow-2xs transition-all hover:border-[#0089FF]/60 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF] cursor-pointer select-none",
          open && "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-muted/40",
        )}
      >
        <span className="truncate">{displayText}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 max-h-56 overflow-y-auto rounded-lg border border-border/80 bg-popover/98 backdrop-blur-xl p-1 shadow-lg animate-in fade-in-0 zoom-in-95 select-none">
          <label className="flex items-center gap-2.5 rounded-sm px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/80 hover:text-foreground cursor-pointer transition-colors select-none">
            <input
              type="checkbox"
              checked={isAll}
              onChange={() => {
                if (isAll) onChange([]);
                else onChange([...options]);
              }}
              className="rounded-md border-input text-brand cursor-pointer h-4 w-4 accent-[#0089FF]"
            />
            <span>Select All</span>
          </label>

          {/* Red helper message when 0 selected */}
          {selected.length === 0 && (
            <div className="mx-2 my-1 px-2.5 py-1.5 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200/70 dark:border-red-800/40 text-[10px] text-red-600 dark:text-red-400 font-medium leading-snug">
              Select at least one item, or all items will be selected by
              default.
            </div>
          )}

          <div className="my-1 border-t border-border/60" />
          {options.map((opt) => {
            const isChecked = selected.includes(opt);
            return (
              <label
                key={opt}
                className={cn(
                  "flex items-center gap-2.5 rounded-sm px-2.5 py-1.5 text-xs text-foreground transition-colors cursor-pointer select-none",
                  isChecked
                    ? "bg-[#0089FF]/10 text-[#0089FF] font-bold hover:bg-[#0089FF]/15"
                    : "hover:bg-muted/80 hover:text-foreground font-medium",
                )}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggle(opt)}
                  className="rounded-md border-input text-brand cursor-pointer h-4 w-4 accent-[#0089FF]"
                />
                <span className="truncate">{opt}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ReportConfigPanel({
  open,
  onClose,
  filters,
  onChange,
  objectOptions,
  onApply,
  onExport,
}: {
  open: boolean;
  onClose: () => void;
  filters: ReportFilters;
  onChange: (patch: Partial<ReportFilters>) => void;
  objectOptions: { id: string; label: string; imei: string; branch: string }[];
  onApply: () => void;
  onExport?: (format: ExportFormat, scope: ExportScope) => void;
}) {
  // Dynamically derive available groups from selected branches
  const availableGroups = useMemo(() => {
    return getGroupsForBranches(filters.branches || []);
  }, [filters.branches]);

  const groupOptions = useMemo(() => {
    return availableGroups.length > 0
      ? availableGroups
      : ["HP Group", "Trucks", "Buses", "Cars", "Cold Chain"];
  }, [availableGroups]);

  const typeOptions = useMemo(() => {
    return ["Dumper", "Truck", "Bus", "SUV", "Taxi"];
  }, []);

  const brandOptions = useMemo(() => {
    return [
      "Ashok Leyland",
      ...VEHICLE_BRANDS.filter((b) => b !== "All" && b !== "Ashok Leyland"),
    ];
  }, []);

  const modelOptions = useMemo(() => {
    return [
      "10 Wheel",
      ...VEHICLE_MODELS.filter((m) => m !== "All" && m !== "10 Wheel"),
    ];
  }, []);

  const handleDrawerApply = () => {
    const patch: Partial<ReportFilters> = {};
    if (!filters.groups || filters.groups.length === 0) {
      patch.groups = groupOptions;
    }
    if (!filters.types || filters.types.length === 0) {
      patch.types = typeOptions;
    }
    if (Object.keys(patch).length > 0) {
      onChange(patch);
    }
    onApply();
    onClose();
  };

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close filter"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
        />
      ) : null}

      <aside
        aria-hidden={!open}
        aria-label="Report filter"
        className={cn(
          "fixed right-0 top-0 z-50 flex h-screen w-full max-w-[400px] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
      >
        {/* Modern Clean Drawer Header (45px) */}
        <header className="flex h-[45px] items-center justify-between border-b border-border/70 px-6 bg-card/60 select-none shrink-0">
          <h2 className="text-sm font-bold tracking-tight text-foreground">
            Filter Options
          </h2>
          <button
            type="button"
            aria-label="Close filter"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Main Body */}
        <div className="min-h-0 flex-1 flex flex-col p-6 space-y-4.5 overflow-y-auto">
          {/* Field 1: Group */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-foreground">
              Group
            </label>
            <MultiSelectDropdown
              label="Group"
              selected={
                filters.groups || ["HP Group", "Trucks", "Buses", "Cars"]
              }
              options={groupOptions}
              onChange={(groups) => onChange({ groups })}
            />
          </div>

          {/* Field 2: Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-foreground">
              Type
            </label>
            <MultiSelectDropdown
              label="Type"
              selected={filters.types || ["Dumper", "Truck", "Bus"]}
              options={typeOptions}
              onChange={(types) => onChange({ types })}
            />
          </div>

          {/* Field 3: Brand */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-foreground">
              Brand
            </label>
            <SelectDropdown
              value={filters.brands?.[0] || "Ashok Leyland"}
              options={brandOptions}
              onChange={(b) => onChange({ brands: [b] })}
            />
          </div>

          {/* Field 4: Model */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-foreground">
              Model
            </label>
            <SelectDropdown
              value={filters.models?.[0] || "10 Wheel"}
              options={modelOptions}
              onChange={(m) => onChange({ models: [m] })}
            />
          </div>

          {/* Field 5: Duration */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-foreground">
              Duration Threshold
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <SelectDropdown
                  value={filters.durationCompare}
                  options={COMPARATORS}
                  onChange={(durationCompare) => onChange({ durationCompare })}
                />
              </div>
              <div>
                <SelectDropdown
                  value={filters.durationUnit}
                  options={DURATION_UNITS}
                  onChange={(durationUnit) => onChange({ durationUnit })}
                />
              </div>
              <div>
                <input
                  type="text"
                  value={filters.durationValue}
                  onChange={(e) => onChange({ durationValue: e.target.value })}
                  placeholder="e.g. 5"
                  className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-all font-medium hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Field 6: Distance */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-foreground">
              Distance Threshold (km)
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <SelectDropdown
                  value={filters.distanceCompare}
                  options={COMPARATORS}
                  onChange={(distanceCompare) => onChange({ distanceCompare })}
                />
              </div>
              <div>
                <input
                  type="text"
                  value={filters.distanceValue}
                  onChange={(e) => onChange({ distanceValue: e.target.value })}
                  placeholder="e.g. 5"
                  className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-all font-medium hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <footer className="flex items-center justify-end border-t border-border bg-muted/20 px-6 py-4 shrink-0 select-none">
          <button
            type="button"
            onClick={handleDrawerApply}
            className="h-9 rounded-md bg-[#155dfc] px-6 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#124ecf] cursor-pointer active:scale-98"
          >
            Apply Filters
          </button>
        </footer>
      </aside>
    </>
  );
}
