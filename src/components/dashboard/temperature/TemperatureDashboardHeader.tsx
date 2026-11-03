import React from "react";
import { SlidersHorizontal, RefreshCw, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemperatureDashboardHeaderProps {
  onOpenFilter: () => void;
  filterOpen: boolean;
  activeFilterCount: number;
  onRefresh: () => void;
  isRefreshing: boolean;
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  totalVehicles?: number;
}

export function TemperatureDashboardHeader({
  onOpenFilter,
  filterOpen,
  activeFilterCount,
  onRefresh,
  isRefreshing,
  viewMode,
  onViewModeChange,
  totalVehicles,
}: TemperatureDashboardHeaderProps) {
  return (
    <header className="flex h-[48px] min-h-[48px] items-center justify-between border-b border-[#DFE3EB]/90 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-5 shrink-0 select-none shadow-2xs z-10">
      {/* 1. Left: Single Clean Page Title (No curved tab fillets) */}
      <div className="flex items-center gap-3">
        <h1 className="text-[15px] sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Temperature Dashboard
        </h1>
      </div>

      {/* 2. Right: Theme-compliant Actions (Refresh, View Switcher, Filter) */}
      <div className="flex items-center gap-2">
        {/* Refresh Telemetry Button */}
        <button
          type="button"
          onClick={onRefresh}
          title="Refresh telemetry"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:border-[#0089FF]/50 cursor-pointer select-none shadow-2xs active:scale-95"
        >
          <RefreshCw
            className={cn(
              "h-3.5 w-3.5",
              isRefreshing && "animate-spin text-[#0089FF]"
            )}
          />
        </button>

        {/* View Mode Switcher (Grid: strictly 3 cards/row vs Table) */}
        <div className="flex items-center rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5 h-8 shadow-2xs">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            title="Grid View (3 per row)"
            className={cn(
              "h-7 w-7 rounded-md flex items-center justify-center transition-colors cursor-pointer",
              viewMode === "grid"
                ? "bg-slate-100 dark:bg-slate-700 text-[#0089FF] shadow-2xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            title="Table View"
            className={cn(
              "h-7 w-7 rounded-md flex items-center justify-center transition-colors cursor-pointer",
              viewMode === "table"
                ? "bg-slate-100 dark:bg-slate-700 text-[#0089FF] shadow-2xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            )}
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Filter Button According to Our Theme */}
        <button
          type="button"
          onClick={onOpenFilter}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:border-[#0089FF]/50 cursor-pointer select-none shadow-2xs active:scale-95",
            filterOpen &&
              "bg-blue-50 dark:bg-blue-950/40 border-[#0089FF]/60 ring-2 ring-[#0089FF]/20 text-[#0089FF]"
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <span className="h-4 min-w-4 px-1 rounded-full bg-[#0089FF] text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
