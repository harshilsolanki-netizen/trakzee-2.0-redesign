import {
  Check,
  ChevronDown,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
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

/**
 * Single Select Dropdown visually matching the report title frame dropdowns
 */
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
          "flex h-7.5 w-full items-center justify-between rounded-md border border-input/80 bg-background px-2.5 text-xs shadow-2xs transition-all hover:border-[#0089FF]/60 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF] cursor-pointer select-none",
          open && "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-muted/40",
        )}
      >
        <span
          className={cn(
            "truncate",
            value
              ? "text-muted-foreground font-medium"
              : "text-muted-foreground/60 font-medium italic",
          )}
        >
          {value || placeholder || "Select"}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70 transition-transform duration-200 ml-1",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-52 overflow-y-auto rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md p-1 shadow-xl animate-in fade-in-0 zoom-in-95 select-none custom-scrollbar">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs transition-colors cursor-pointer select-none",
                value === opt
                  ? "bg-[#0089FF]/10 font-semibold text-[#0089FF] hover:bg-[#0089FF]/15"
                  : "text-foreground hover:bg-muted/80 hover:text-foreground font-medium",
              )}
            >
              <span className="truncate">{opt}</span>
              {value === opt && (
                <Check className="h-3.5 w-3.5 text-[#0089FF] shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Universal Multi-Select Dropdown matching the title frame styling visually:
 * - h-7.5 / h-8 sleek trigger
 * - FirstItem +Count formatted display (e.g. "HP Group +7", "Dumper +2")
 * - Real-time search box
 * - Select all checkbox
 * - Red warning message when 0 items selected
 * - Clear / Cancel / Apply footer
 */
function UniversalMultiSelectDropdown({
  label,
  selected,
  options,
  onChange,
  className,
  placeholder,
}: {
  label: string;
  selected: string[];
  options: string[];
  onChange: (next: string[]) => void;
  className?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<string[]>(selected);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      setDraft(selected);
      setSearch("");
    }
  }, [open, selected]);

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

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, search]);

  const isAllDraftSelected =
    filteredOptions.length > 0 &&
    filteredOptions.every((opt) => draft.includes(opt));

  const toggleDraft = (opt: string) => {
    if (draft.includes(opt)) {
      setDraft(draft.filter((s) => s !== opt));
    } else {
      setDraft([...draft, opt]);
    }
  };

  const toggleAllDraft = () => {
    if (isAllDraftSelected) {
      setDraft(draft.filter((s) => !filteredOptions.includes(s)));
    } else {
      setDraft([...new Set([...draft, ...filteredOptions])]);
    }
  };

  const handleApply = () => {
    onChange(draft);
    setOpen(false);
  };

  const handleCancel = () => {
    setDraft(selected);
    setOpen(false);
  };

  const handleClear = () => {
    setDraft([]);
  };

  const displayText = useMemo(() => {
    if (!selected || selected.length === 0) {
      return placeholder || `Select ${label}`;
    }
    if (selected.length === 1) return selected[0];
    return `${selected[0]} +${selected.length - 1}`;
  }, [selected, label, placeholder]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-7.5 w-full items-center justify-between rounded-md border border-input/80 bg-background px-2.5 text-xs shadow-2xs transition-all hover:border-[#0089FF]/60 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF] cursor-pointer select-none",
          open && "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-muted/40",
        )}
      >
        <div className="flex items-center min-w-0 flex-1 overflow-hidden">
          {!selected || selected.length === 0 ? (
            <span className="text-muted-foreground/60 font-medium italic truncate">
              {placeholder || `Select ${label}`}
            </span>
          ) : (
            <>
              <span className="text-muted-foreground font-medium truncate">
                {selected[0]}
              </span>
              {selected.length > 1 && (
                <span className="ml-1.5 inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-[#0089FF]/10 text-[#0089FF] border border-[#0089FF]/20 shrink-0">
                  +{selected.length - 1}
                </span>
              )}
            </>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70 transition-transform duration-200 ml-1",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 w-full rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md shadow-2xl animate-in fade-in-0 zoom-in-95 select-none overflow-hidden flex flex-col">
          {/* Header Row */}
          <div className="p-2.5 pb-2 border-b border-border/60 bg-muted/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                Select {label}
              </span>
              <span className="text-[10px] font-semibold text-[#0089FF] bg-[#0089FF]/10 px-2 py-0.5 rounded-full">
                {draft.length} selected
              </span>
            </div>

            {/* Search Box */}
            <div className="flex h-7 items-center gap-1.5 rounded-md border border-input bg-background px-2 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all">
              <Search className="h-3 w-3 text-muted-foreground shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="rounded-md p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              )}
            </div>
          </div>

          {/* Select All Checkbox */}
          <div className="px-3 py-1.5 border-b border-border/60 flex items-center justify-between bg-muted/10">
            <label className="flex items-center gap-2 cursor-pointer select-none w-full text-xs font-semibold text-foreground">
              <input
                type="checkbox"
                checked={isAllDraftSelected}
                onChange={toggleAllDraft}
                className="h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer"
              />
              <span>Select All</span>
            </label>
          </div>

          {/* Warning Message when 0 items selected */}
          {draft.length === 0 && (
            <div className="mx-2.5 my-1.5 px-2 py-1.5 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200/70 dark:border-red-800/40 text-[10px] text-red-600 dark:text-red-400 font-medium leading-snug">
              Select at least one item, or all items will be selected by default.
            </div>
          )}

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto p-1 space-y-0.5 custom-scrollbar">
            {filteredOptions.map((opt) => {
              const isChecked = draft.includes(opt);
              return (
                <label
                  key={opt}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-foreground transition-colors cursor-pointer select-none",
                    isChecked
                      ? "bg-[#0089FF]/10 text-[#0089FF] font-semibold hover:bg-[#0089FF]/15"
                      : "hover:bg-muted/80 hover:text-foreground font-medium",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleDraft(opt)}
                    className="rounded border-input text-brand cursor-pointer h-3.5 w-3.5 accent-[#0089FF]"
                  />
                  <span className="truncate">{opt}</span>
                </label>
              );
            })}

            {filteredOptions.length === 0 && (
              <div className="p-3 text-center text-xs text-muted-foreground italic">
                No {label.toLowerCase()} found
              </div>
            )}
          </div>

          {/* Footer Toolbar */}
          <div className="p-2 px-3 border-t border-border/70 flex items-center justify-between bg-muted/20">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer transition-colors"
            >
              Clear
            </button>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCancel}
                className="px-2.5 py-1 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-3.5 py-1 text-xs rounded-md font-semibold text-white bg-[#155dfc] hover:bg-[#124ecf] shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
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
    return ["Dumper", "Truck", "Bus", "SUV", "Taxi", "Trailer"];
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

  const handleReset = () => {
    onChange({
      groups: ["HP Group", "Trucks", "Buses", "Cars"],
      types: ["Dumper", "Truck", "Bus"],
      brands: ["Ashok Leyland"],
      models: ["10 Wheel"],
      durationCompare: "Greater Than",
      durationUnit: "Hour",
      durationValue: "",
      distanceCompare: "Greater Than",
      distanceValue: "",
    });
    toast.info("Report filter options reset to default");
  };

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
          className="fixed top-[45px] bottom-0 left-0 sm:left-[68px] right-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
        />
      ) : null}

      <aside
        aria-hidden={!open}
        aria-label="Report filter options"
        className={cn(
          "fixed right-0 top-[45px] bottom-0 z-40 flex w-full max-w-[420px] xl:max-w-[430px] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
      >
        {/* Standardized 56px Header matching Side Panel Design System */}
        <header className="flex h-[56px] items-center justify-between border-b border-border px-5 bg-background select-none shrink-0">
          <h2 className="text-[16px] font-semibold tracking-tight text-foreground">
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

        {/* Main Body with visually matched sleeker field controls */}
        <div className="min-h-0 flex-1 flex flex-col p-5 space-y-4 overflow-y-auto custom-scrollbar">
          {/* Field 1: Group */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Group
            </label>
            <UniversalMultiSelectDropdown
              label="Group"
              selected={filters.groups || []}
              options={groupOptions}
              onChange={(groups) => onChange({ groups })}
              placeholder="Select Group"
            />
          </div>

          {/* Field 2: Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Type
            </label>
            <UniversalMultiSelectDropdown
              label="Type"
              selected={filters.types || ["Dumper", "Truck", "Bus"]}
              options={typeOptions}
              onChange={(types) => onChange({ types })}
              placeholder="Select Type"
            />
          </div>

          {/* Field 3: Brand */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Brand
            </label>
            <SelectDropdown
              value={filters.brands?.[0] || "Ashok Leyland"}
              options={brandOptions}
              onChange={(b) => onChange({ brands: [b] })}
              placeholder="Select Brand"
            />
          </div>

          {/* Field 4: Model */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Model
            </label>
            <SelectDropdown
              value={filters.models?.[0] || "10 Wheel"}
              options={modelOptions}
              onChange={(m) => onChange({ models: [m] })}
              placeholder="Select Model"
            />
          </div>

          {/* Field 5: Duration Threshold */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Duration Threshold
            </label>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-5">
                <SelectDropdown
                  value={filters.durationCompare}
                  options={COMPARATORS}
                  onChange={(durationCompare) => onChange({ durationCompare })}
                />
              </div>
              <div className="col-span-4">
                <SelectDropdown
                  value={filters.durationUnit}
                  options={DURATION_UNITS}
                  onChange={(durationUnit) => onChange({ durationUnit })}
                />
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  value={filters.durationValue}
                  onChange={(e) => onChange({ durationValue: e.target.value })}
                  placeholder="e.g. 5"
                  className="h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-muted-foreground placeholder:font-medium placeholder:italic placeholder:text-muted-foreground/60 transition-all hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Field 6: Distance Threshold */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Distance Threshold (km)
            </label>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-7">
                <SelectDropdown
                  value={filters.distanceCompare}
                  options={COMPARATORS}
                  onChange={(distanceCompare) => onChange({ distanceCompare })}
                />
              </div>
              <div className="col-span-5">
                <input
                  type="text"
                  value={filters.distanceValue}
                  onChange={(e) => onChange({ distanceValue: e.target.value })}
                  placeholder="e.g. 5"
                  className="h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-muted-foreground placeholder:font-medium placeholder:italic placeholder:text-muted-foreground/60 transition-all hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Standardized Drawer Footer matching Side Panel Design System (56px) */}
        <footer className="flex h-[56px] items-center justify-between border-t border-border bg-background px-5 shrink-0 select-none">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-md border border-input/80 bg-background px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-muted cursor-pointer shadow-2xs active:scale-98"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleDrawerApply}
            className="h-8 rounded-md bg-[#155dfc] px-5 text-xs font-medium text-white shadow-xs transition-all hover:bg-[#124ecf] cursor-pointer active:scale-98"
          >
            Apply Filters
          </button>
        </footer>
      </aside>
    </>
  );
}
