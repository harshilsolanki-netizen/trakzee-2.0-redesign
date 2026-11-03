import React, { useState, useEffect } from "react";
import { X, RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FuelFilterState {
  searchQuery: string;
  status: ("normal" | "warning" | "critical")[];
  fuelType: "all" | "Diesel" | "Petrol";
  ignition: "all" | "on" | "off";
  branches: string[];
  sortBy: "fuel-desc" | "fuel-asc" | "name" | "speed-desc";
}

export const DEFAULT_FUEL_FILTERS: FuelFilterState = {
  searchQuery: "",
  status: [],
  fuelType: "all",
  ignition: "all",
  branches: [],
  sortBy: "fuel-desc",
};

interface FuelFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: FuelFilterState;
  onApply: (next: FuelFilterState) => void;
  availableBranches: string[];
}

export function FuelFilterDrawer({
  open,
  onClose,
  filters,
  onApply,
  availableBranches,
}: FuelFilterDrawerProps) {
  const [local, setLocal] = useState<FuelFilterState>(filters);

  useEffect(() => {
    setLocal(filters);
  }, [filters, open]);

  if (!open) return null;

  const handleApply = () => {
    onApply(local);
    onClose();
  };

  const handleReset = () => {
    setLocal(DEFAULT_FUEL_FILTERS);
  };

  const toggleStatus = (st: "normal" | "warning" | "critical") => {
    setLocal((prev) => ({
      ...prev,
      status: prev.status.includes(st)
        ? prev.status.filter((x) => x !== st)
        : [...prev.status, st],
    }));
  };

  const toggleBranch = (branch: string) => {
    setLocal((prev) => ({
      ...prev,
      branches: prev.branches.includes(branch)
        ? prev.branches.filter((b) => b !== branch)
        : [...prev.branches, branch],
    }));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[360px] flex-col bg-white dark:bg-slate-900 border-l border-[#DFE3EB]/90 dark:border-slate-800 shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex h-[52px] items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Filter Vehicles
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">
              Fuel Telemetry
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Filters Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* 1. Search Query */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Quick Search
            </label>
            <input
              type="text"
              value={local.searchQuery}
              onChange={(e) =>
                setLocal((prev) => ({ ...prev, searchQuery: e.target.value }))
              }
              placeholder="Filter by vehicle name, plate, location..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF] focus:ring-1 focus:ring-[#0089FF]/30 transition-all"
            />
          </div>

          {/* 2. Fuel Status Checkboxes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Fuel Level Status
            </label>
            <div className="space-y-1.5">
              {[
                {
                  key: "normal",
                  label: "Optimal / Normal (> 35%)",
                  color: "#0089FF",
                },
                {
                  key: "warning",
                  label: "Low Fuel (15% to 35%)",
                  color: "#F59E0B",
                },
                {
                  key: "critical",
                  label: "Critical Low (< 15%)",
                  color: "#EF4444",
                },
              ].map((item) => {
                const active = local.status.includes(
                  item.key as "normal" | "warning" | "critical"
                );
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      toggleStatus(
                        item.key as "normal" | "warning" | "critical"
                      )
                    }
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-xl border text-left transition-all cursor-pointer",
                      active
                        ? "bg-blue-50/60 dark:bg-blue-950/30 border-[#0089FF]/60 text-slate-900 dark:text-white font-semibold"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.label}</span>
                    </div>
                    {active && <Check className="h-3.5 w-3.5 text-[#0089FF]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Fuel Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Fuel Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["all", "Diesel", "Petrol"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setLocal((prev) => ({ ...prev, fuelType: type }))}
                  className={cn(
                    "py-1.5 px-2 rounded-lg border text-center font-medium transition-all cursor-pointer capitalize",
                    local.fuelType === type
                      ? "bg-[#0089FF] text-white border-[#0089FF] font-semibold shadow-xs"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                  )}
                >
                  {type === "all" ? "All Types" : type}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Ignition State */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Ignition
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "all", label: "All" },
                { key: "on", label: "ON" },
                { key: "off", label: "OFF" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() =>
                    setLocal((prev) => ({
                      ...prev,
                      ignition: item.key as "all" | "on" | "off",
                    }))
                  }
                  className={cn(
                    "py-1.5 px-2 rounded-lg border text-center font-medium transition-all cursor-pointer",
                    local.ignition === item.key
                      ? "bg-[#0089FF] text-white border-[#0089FF] font-semibold shadow-xs"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Sort By */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Sort By
            </label>
            <select
              value={local.sortBy}
              onChange={(e) =>
                setLocal((prev) => ({
                  ...prev,
                  sortBy: e.target.value as FuelFilterState["sortBy"],
                }))
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0089FF] transition-all cursor-pointer"
            >
              <option value="fuel-desc">Fuel Level: High to Low</option>
              <option value="fuel-asc">Fuel Level: Low to High</option>
              <option value="name">Vehicle Name: A to Z</option>
              <option value="speed-desc">Speed: High to Low</option>
            </select>
          </div>

          {/* 6. Branch Filter */}
          {availableBranches.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Logistics Hubs / Branches
              </label>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {availableBranches.map((branch) => {
                  const active = local.branches.includes(branch);
                  return (
                    <button
                      key={branch}
                      type="button"
                      onClick={() => toggleBranch(branch)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-left text-[11.5px] transition-all cursor-pointer",
                        active
                          ? "bg-blue-50 dark:bg-blue-950/30 border-[#0089FF]/60 text-slate-900 dark:text-white font-medium"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      )}
                    >
                      <span>{branch}</span>
                      {active && (
                        <Check className="h-3.5 w-3.5 text-[#0089FF]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 dark:border-slate-800 p-4 bg-slate-50/60 dark:bg-slate-900/60 flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-2 rounded-xl bg-[#0089FF] hover:bg-blue-600 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}
