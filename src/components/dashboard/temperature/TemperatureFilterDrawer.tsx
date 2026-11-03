import React, { useState, useEffect } from "react";
import {
  X,
  RotateCcw,
  Search,
  Filter,
  Check,
  Thermometer,
  Key,
  Building2,
  ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarState } from "@/lib/useSidebarState";
import { toast } from "sonner";

export interface TemperatureFilterState {
  searchQuery: string;
  status: ("safe" | "warning" | "high" | "deep-freeze")[];
  ignition: "all" | "on" | "off";
  branches: string[];
  sortBy: "temp-desc" | "temp-asc" | "name";
}

export const DEFAULT_TEMPERATURE_FILTERS: TemperatureFilterState = {
  searchQuery: "",
  status: [],
  ignition: "all",
  branches: [],
  sortBy: "temp-desc",
};

interface TemperatureFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: TemperatureFilterState;
  onApply: (next: TemperatureFilterState) => void;
  availableBranches: string[];
}

export function TemperatureFilterDrawer({
  open,
  onClose,
  filters,
  onApply,
  availableBranches,
}: TemperatureFilterDrawerProps) {
  const { isCollapsed } = useSidebarState();
  const [draft, setDraft] = useState<TemperatureFilterState>(filters);

  // Synchronize draft when opened
  useEffect(() => {
    if (open) {
      setDraft(filters);
    }
  }, [open, filters]);

  const toggleStatus = (st: "safe" | "warning" | "high" | "deep-freeze") => {
    setDraft((prev) => {
      const exists = prev.status.includes(st);
      return {
        ...prev,
        status: exists
          ? prev.status.filter((x) => x !== st)
          : [...prev.status, st],
      };
    });
  };

  const toggleBranch = (b: string) => {
    setDraft((prev) => {
      const exists = prev.branches.includes(b);
      return {
        ...prev,
        branches: exists
          ? prev.branches.filter((x) => x !== b)
          : [...prev.branches, b],
      };
    });
  };

  const handleReset = () => {
    setDraft(DEFAULT_TEMPERATURE_FILTERS);
    toast.info("Filter options reset to default");
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
    toast.success("Filters applied");
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <button
          type="button"
          aria-label="Close filter"
          onClick={onClose}
          className={cn(
            "fixed top-[45px] bottom-0 right-0 z-40 bg-black/40 backdrop-blur-xs transition-all duration-300 cursor-pointer",
            isCollapsed ? "left-0 sm:left-[60px]" : "left-0 sm:left-[200px]"
          )}
        />
      )}

      {/* Slide-in Drawer */}
      <aside
        aria-hidden={!open}
        aria-label="Dashboard Filter Options"
        className={cn(
          "fixed right-0 top-[45px] bottom-0 z-50 flex w-full max-w-[400px] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out select-none",
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        )}
      >
        {/* 1. Header (Matching Reference Screenshot & 56px standard) */}
        <header className="flex h-[56px] items-center justify-between border-b border-border px-5 bg-background shrink-0">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#0089FF]" />
            <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
              Filter Options
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* 2. Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Search Input */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Search Vehicle or Location
            </label>
            <div className="relative flex items-center h-8.5 rounded-lg border border-border/80 bg-muted/30 px-2.5 focus-within:border-[#0089FF] focus-within:ring-1 focus-within:ring-[#0089FF]/20 transition-all">
              <Search className="h-3.5 w-3.5 text-muted-foreground mr-2 shrink-0" />
              <input
                type="text"
                value={draft.searchQuery}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, searchQuery: e.target.value }))
                }
                placeholder="Vehicle plate, model, location..."
                className="h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {draft.searchQuery && (
                <button
                  type="button"
                  onClick={() =>
                    setDraft((prev) => ({ ...prev, searchQuery: "" }))
                  }
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Temperature Status Filters */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Temperature Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => toggleStatus("safe")}
                className={cn(
                  "flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                  draft.status.includes("safe")
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "border-border/80 bg-background hover:bg-muted text-foreground"
                )}
              >
                <div>
                  <span className="block font-semibold">In-Range</span>
                  <span className="text-[10px] text-muted-foreground">0°C to 40°C</span>
                </div>
                {draft.status.includes("safe") && (
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                )}
              </button>

              <button
                type="button"
                onClick={() => toggleStatus("warning")}
                className={cn(
                  "flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                  draft.status.includes("warning")
                    ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold"
                    : "border-border/80 bg-background hover:bg-muted text-foreground"
                )}
              >
                <div>
                  <span className="block font-semibold">Warning</span>
                  <span className="text-[10px] text-muted-foreground">41°C to 50°C</span>
                </div>
                {draft.status.includes("warning") && (
                  <Check className="h-4 w-4 text-amber-500 shrink-0" />
                )}
              </button>

              <button
                type="button"
                onClick={() => toggleStatus("high")}
                className={cn(
                  "flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                  draft.status.includes("high")
                    ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold"
                    : "border-border/80 bg-background hover:bg-muted text-foreground"
                )}
              >
                <div>
                  <span className="block font-semibold">Critical High</span>
                  <span className="text-[10px] text-muted-foreground">&gt; 50°C</span>
                </div>
                {draft.status.includes("high") && (
                  <Check className="h-4 w-4 text-rose-500 shrink-0" />
                )}
              </button>

              <button
                type="button"
                onClick={() => toggleStatus("deep-freeze")}
                className={cn(
                  "flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                  draft.status.includes("deep-freeze")
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold"
                    : "border-border/80 bg-background hover:bg-muted text-foreground"
                )}
              >
                <div>
                  <span className="block font-semibold">Deep Freeze</span>
                  <span className="text-[10px] text-muted-foreground">&lt; 0°C (Reefer)</span>
                </div>
                {draft.status.includes("deep-freeze") && (
                  <Check className="h-4 w-4 text-cyan-500 shrink-0" />
                )}
              </button>
            </div>
          </div>

          {/* Ignition Status */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Ignition Status
            </label>
            <div className="flex items-center rounded-lg border border-border/80 bg-muted/30 p-1">
              <button
                type="button"
                onClick={() =>
                  setDraft((prev) => ({ ...prev, ignition: "all" }))
                }
                className={cn(
                  "flex-1 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer text-center",
                  draft.ignition === "all"
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                All
              </button>
              <button
                type="button"
                onClick={() =>
                  setDraft((prev) => ({ ...prev, ignition: "on" }))
                }
                className={cn(
                  "flex-1 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5",
                  draft.ignition === "on"
                    ? "bg-background text-emerald-600 shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Ignition ON
              </button>
              <button
                type="button"
                onClick={() =>
                  setDraft((prev) => ({ ...prev, ignition: "off" }))
                }
                className={cn(
                  "flex-1 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5",
                  draft.ignition === "off"
                    ? "bg-background text-rose-600 shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                Ignition OFF
              </button>
            </div>
          </div>

          {/* Branch / Depot Filter */}
          {availableBranches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Branch / Depot
                </label>
                {draft.branches.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((prev) => ({ ...prev, branches: [] }))
                    }
                    className="text-[11px] text-[#0089FF] hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1 rounded-lg border border-border/80 bg-muted/20 p-2">
                {availableBranches.map((branch) => {
                  const checked = draft.branches.includes(branch);
                  return (
                    <label
                      key={branch}
                      className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/60 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleBranch(branch)}
                        className="h-3.5 w-3.5 rounded border-border accent-[#0089FF]"
                      />
                      <span className="text-xs text-foreground font-medium truncate">
                        {branch}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sort By */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Sort Order
            </label>
            <div className="space-y-1">
              {[
                { id: "temp-desc", label: "Temperature: High to Low" },
                { id: "temp-asc", label: "Temperature: Low to High" },
                { id: "name", label: "Vehicle Name (A to Z)" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/40 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="tempSort"
                    checked={draft.sortBy === opt.id}
                    onChange={() =>
                      setDraft((prev) => ({
                        ...prev,
                        sortBy: opt.id as any,
                      }))
                    }
                    className="h-3.5 w-3.5 accent-[#0089FF]"
                  />
                  <span className="text-xs text-foreground font-medium">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Footer */}
        <footer className="flex items-center gap-2 border-t border-border px-5 py-3 bg-background shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-9 rounded-lg border border-border/80 hover:bg-muted text-xs font-semibold text-foreground transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 h-9 rounded-lg bg-[#0089FF] hover:bg-blue-600 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer text-center"
          >
            Apply Filters
          </button>
        </footer>
      </aside>
    </>
  );
}
