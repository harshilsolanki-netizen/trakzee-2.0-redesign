import React, { useState, useMemo } from "react";
import { List, Map as MapIcon, RefreshCw, SlidersHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SafetyDashboardTab } from "./SafetyDashboardTab";
import { SafeReachTab, type SafeReachFilterState } from "./SafeReachTab";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DashTab = "safety" | "safe_reach";
type ViewMode = "map" | "table";

export function SafetyDashboardPage() {
  const [activeTab, setActiveTab] = useState<DashTab>("safety");
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [resetMapTrigger, setResetMapTrigger] = useState(0);

  // Safe Reach Filters & Refresh Trigger
  const [safeReachRefreshTrigger, setSafeReachRefreshTrigger] = useState(0);
  const [safeReachFilterOpen, setSafeReachFilterOpen] = useState(false);
  const [safeReachFilters, setSafeReachFilters] = useState<SafeReachFilterState>({
    office: "ALL",
    channel: "ALL",
    status: "ALL",
  });

  // Draft filter states for Safe Reach filter popover
  const [draftOffice, setDraftOffice] = useState("ALL");
  const [draftChannel, setDraftChannel] = useState("ALL");
  const [draftStatus, setDraftStatus] = useState("ALL");

  // Safety Dashboard Filter Popover State
  const [safetyFilterOpen, setSafetyFilterOpen] = useState(false);

  const tabs: { id: DashTab; label: string }[] = [
    { id: "safety", label: "Safety dashboard" },
    { id: "safe_reach", label: "Safe reach confirmation" },
  ];

  const handleOpenSafeReachFilter = (open: boolean) => {
    if (open) {
      setDraftOffice(safeReachFilters.office);
      setDraftChannel(safeReachFilters.channel);
      setDraftStatus(safeReachFilters.status);
    }
    setSafeReachFilterOpen(open);
  };

  const handleApplySafeReachFilter = () => {
    setSafeReachFilters({
      office: draftOffice,
      channel: draftChannel,
      status: draftStatus,
    });
    setSafeReachFilterOpen(false);
    toast.success("Safe reach filters applied");
  };

  const handleResetSafeReachFilter = () => {
    const defaultFilters: SafeReachFilterState = {
      office: "ALL",
      channel: "ALL",
      status: "ALL",
    };
    setDraftOffice("ALL");
    setDraftChannel("ALL");
    setDraftStatus("ALL");
    setSafeReachFilters(defaultFilters);
    setSafeReachFilterOpen(false);
    toast.info("Safe reach filters reset");
  };

  const activeSafeReachFilterCount = useMemo(() => {
    let count = 0;
    if (safeReachFilters.office !== "ALL") count++;
    if (safeReachFilters.channel !== "ALL") count++;
    if (safeReachFilters.status !== "ALL") count++;
    return count;
  }, [safeReachFilters]);

  const handleRefresh = () => {
    if (activeTab === "safety") {
      setResetMapTrigger((n) => n + 1);
      toast.success("Safety dashboard refreshed");
    } else {
      setSafeReachRefreshTrigger((n) => n + 1);
      toast.success("Safe reach confirmation refreshed");
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#F1F5F9] dark:bg-slate-950">
      {/* ─── Fleet Overview Tab Strip (Exact match to TabStrip.tsx in Fleet Overview) ─── */}
      <div className="relative flex items-end justify-between h-[45px] pt-[10px] px-0 text-xs select-none shrink-0 bg-[#F1F5F9] dark:bg-slate-950">
        {/* Baseline border running across entire strip under inactive tabs */}
        <div className="absolute left-0 right-0 bottom-0 h-px bg-[#DFE3EB] dark:bg-slate-800 z-0" />

        {/* 1. Left Tab Bar */}
        <div className="relative z-10 flex min-w-0 flex-1 items-end h-full pl-[10px] gap-1">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "group relative flex shrink-0 cursor-pointer items-center gap-2 text-xs transition-all duration-150 select-none",
                  isActive
                    ? "h-[35px] px-4 rounded-t-lg bg-white dark:bg-slate-900 border-t border-l border-r border-[#DFE3EB] dark:border-slate-800 text-slate-800 dark:text-white font-semibold mb-[-1px] z-20 shadow-2xs"
                    : "h-[32px] px-3 rounded-t-md bg-transparent hover:bg-slate-200/60 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-slate-900 font-medium mb-0 z-10"
                )}
              >
                {/* Left Inverted Concave Fillet for Active Tab */}
                {isActive && (
                  <div className="absolute -left-[8px] bottom-0 w-[8px] h-[8px] overflow-hidden pointer-events-none z-20">
                    <svg className="w-full h-full" viewBox="0 0 8 8" fill="none">
                      <path
                        d="M 0 8 L 8 8 L 8 0 C 8 4.418 4.418 8 0 8 Z"
                        className="fill-white dark:fill-slate-900"
                      />
                      <path
                        d="M 0 8 C 4.418 8 8 4.418 8 0"
                        className="stroke-[#DFE3EB] dark:stroke-slate-800"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                )}

                {/* Right Inverted Concave Fillet for Active Tab */}
                {isActive && (
                  <div className="absolute -right-[8px] bottom-0 w-[8px] h-[8px] overflow-hidden pointer-events-none z-20">
                    <svg className="w-full h-full" viewBox="0 0 8 8" fill="none">
                      <path
                        d="M 8 8 L 0 8 L 0 0 C 0 4.418 3.582 8 8 8 Z"
                        className="fill-white dark:fill-slate-900"
                      />
                      <path
                        d="M 8 8 C 3.582 8 0 4.418 0 0"
                        className="stroke-[#DFE3EB] dark:stroke-slate-800"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                )}

                {/* Seamless Active Tab Bottom Bridge: Completely removes any line under the active tab */}
                {isActive && (
                  <div className="absolute -bottom-[2px] -left-[1px] -right-[1px] h-[4px] bg-white dark:bg-slate-900 z-30 pointer-events-none" />
                )}

                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 2. Right Toolbar: Matching media_1795085596060_1a6a4f0b.jpg & media_1795085575394_cef11725.png */}
        <div className="relative z-10 flex items-center gap-2 shrink-0 pb-1.5 pr-[10px]">
          {/* Refresh Button (Present in BOTH tabs) */}
          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:border-[#0089FF]/50 cursor-pointer transition-colors active:scale-95 shrink-0"
          >
            <RefreshCw className="h-3.5 w-3.5 stroke-[2.2]" />
          </button>

          {/* Segmented View Mode Switcher: [ ≡ List | 🗺 Map ] (Only in Safety Dashboard tab) */}
          {activeTab === "safety" && (
            <div className="flex items-center rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5 h-8 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                title="Table View"
                className={cn(
                  "h-7 w-7 rounded-md flex items-center justify-center transition-colors cursor-pointer",
                  viewMode === "table"
                    ? "bg-slate-100 dark:bg-slate-700 text-[#0089FF] shadow-2xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                )}
              >
                <List className="h-3.5 w-3.5 stroke-[2.2]" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                title="Map View"
                className={cn(
                  "h-7 w-7 rounded-md flex items-center justify-center transition-colors cursor-pointer",
                  viewMode === "map"
                    ? "bg-slate-100 dark:bg-slate-700 text-[#0089FF] shadow-2xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                )}
              >
                <MapIcon className="h-3.5 w-3.5 stroke-[2.2]" />
              </button>
            </div>
          )}

          {/* Filter Button: in BOTH Safety Dashboard and Safe Reach Confirmation tabs */}
          {activeTab === "safety" ? (
            <Popover open={safetyFilterOpen} onOpenChange={setSafetyFilterOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:border-[#0089FF]/50 cursor-pointer shadow-2xs active:scale-95 shrink-0",
                    safetyFilterOpen && "border-[#0089FF] text-[#0089FF]"
                  )}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Filter</span>
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-64 p-3 text-xs bg-popover/95 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-50 select-none space-y-2.5"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                  <span className="font-bold text-xs text-foreground">Safety Filters</span>
                  <button
                    type="button"
                    onClick={() => setSafetyFilterOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">Filter alerts by vehicle status, zone, or severity level.</p>
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setSafetyFilterOpen(false);
                      toast.success("Safety filters applied");
                    }}
                    className="px-3 py-1 rounded-md bg-[#0089FF] text-white font-semibold text-xs cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Popover open={safeReachFilterOpen} onOpenChange={handleOpenSafeReachFilter}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:border-[#0089FF]/50 cursor-pointer shadow-2xs active:scale-95 shrink-0",
                    (safeReachFilterOpen || activeSafeReachFilterCount > 0) &&
                      "border-[#0089FF] text-[#0089FF]"
                  )}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Filter</span>
                  {activeSafeReachFilterCount > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold leading-tight bg-[#0089FF] text-white">
                      {activeSafeReachFilterCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-72 p-3 text-xs bg-popover/95 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-50 select-none space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <span className="font-bold text-xs text-foreground">Filter Safe Reach</span>
                  <button
                    type="button"
                    onClick={handleResetSafeReachFilter}
                    className="text-[11px] font-semibold text-[#0089FF] hover:underline cursor-pointer"
                  >
                    Reset all
                  </button>
                </div>

                {/* Office Filter */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-500">Office</label>
                  <select
                    value={draftOffice}
                    onChange={(e) => setDraftOffice(e.target.value)}
                    className="w-full h-8 px-2 text-xs rounded-md border border-border/80 bg-background text-foreground focus:outline-none focus:border-[#0089FF]"
                  >
                    <option value="ALL">All Offices</option>
                    <option value="ABC company">ABC company</option>
                    <option value="XYZ company">XYZ company</option>
                  </select>
                </div>

                {/* Channel Filter */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-500">Channel</label>
                  <select
                    value={draftChannel}
                    onChange={(e) => setDraftChannel(e.target.value)}
                    className="w-full h-8 px-2 text-xs rounded-md border border-border/80 bg-background text-foreground focus:outline-none focus:border-[#0089FF]"
                  >
                    <option value="ALL">All Channels</option>
                    <option value="mobile_app">App (Mobile)</option>
                    <option value="geofence">GEO (Geofence)</option>
                    <option value="ivr">IVR</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-500">Status</label>
                  <select
                    value={draftStatus}
                    onChange={(e) => setDraftStatus(e.target.value)}
                    className="w-full h-8 px-2 text-xs rounded-md border border-border/80 bg-background text-foreground focus:outline-none focus:border-[#0089FF]"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="failed">Failed</option>
                    <option value="nt">Not on trip</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-border/60 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSafeReachFilterOpen(false)}
                    className="px-2.5 py-1 text-xs rounded-md border border-border/80 hover:bg-muted text-foreground cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApplySafeReachFilter}
                    className="px-3 py-1 text-xs font-semibold rounded-md bg-[#0089FF] text-white hover:bg-[#0070d6] cursor-pointer shadow-xs"
                  >
                    Apply
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* ─── Content Area Connected Seamlessly to Active Tab (Matching index.tsx of Fleet Overview) ─── */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-white dark:bg-slate-900">
        <div className="flex-1 min-h-0 p-[10px] flex flex-col h-full overflow-hidden">
          {activeTab === "safety" ? (
            <SafetyDashboardTab
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              resetMapTrigger={resetMapTrigger}
            />
          ) : (
            <SafeReachTab
              refreshTrigger={safeReachRefreshTrigger}
              filters={safeReachFilters}
              onFilterChange={setSafeReachFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
}
