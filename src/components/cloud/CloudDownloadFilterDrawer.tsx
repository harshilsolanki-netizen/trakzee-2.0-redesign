import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CloudDateTimeRangePicker,
  type CloudDateTimeRangeValue,
} from "@/components/cloud/CloudDateTimeRangePicker";
import { useSidebarState } from "@/lib/useSidebarState";
import { cn } from "@/lib/utils";

export interface CloudDownloadFilters {
  company: string;
  branch: string;
  status: string;
  downloadRequestFor: string;
  dateTime: CloudDateTimeRangeValue;
}

export const DEFAULT_CLOUD_FILTERS: CloudDownloadFilters = {
  company: "All",
  branch: "All",
  status: "All",
  downloadRequestFor: "All",
  dateTime: {
    preset: "Today",
    from: "2026-11-04",
    to: "2026-11-04",
    fromTime: "00:00",
    toTime: "23:59",
  },
};

interface CloudDownloadFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: CloudDownloadFilters;
  onApplyFilters: (newFilters: CloudDownloadFilters) => void;
  companyOptions?: string[];
  branchOptions?: string[];
  statusOptions?: string[];
  requestForOptions?: string[];
}

export function CloudDownloadFilterDrawer({
  open,
  onClose,
  filters,
  onApplyFilters,
  companyOptions = ["All", "HP Company", "FleetCorp", "LogisticsPro", "Uffizio Global"],
  branchOptions = ["All", "HP Branch 1", "Valsad", "Surat", "Ahmedabad", "Vadodara"],
  statusOptions = ["All", "Completed", "In Progress", "Failed"],
  requestForOptions = [
    "All",
    "Travel Summary",
    "Video Telematics Download",
    "Speed & Sensor Telemetry",
    "Fuel Consumption Summary",
    "Engine Diagnostics & DTC",
    "Trip Playback Export",
  ],
}: CloudDownloadFilterDrawerProps) {
  const { isCollapsed } = useSidebarState();

  // Local draft filter state
  const [draft, setDraft] = useState<CloudDownloadFilters>(filters);

  // Field dropdown popover open states
  const [companyOpen, setCompanyOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [requestForOpen, setRequestForOpen] = useState(false);

  // Sync draft when opened or external filters change
  useEffect(() => {
    setDraft(filters);
  }, [filters, open]);

  // Handle ESC key to close
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleApply = () => {
    onApplyFilters(draft);
    toast.success("Filters Applied", {
      description: "Cloud download table updated with selected parameters.",
    });
    onClose();
  };

  const handleSaveFilter = () => {
    onApplyFilters(draft);
    try {
      localStorage.setItem("trakzee-cloud-download-filter-preset", JSON.stringify(draft));
    } catch {}
    toast.success("Filter Saved", {
      description: "Your filter preferences have been saved as default.",
    });
    onClose();
  };

  const handleDeleteFilter = () => {
    setDraft(DEFAULT_CLOUD_FILTERS);
    onApplyFilters(DEFAULT_CLOUD_FILTERS);
    try {
      localStorage.removeItem("trakzee-cloud-download-filter-preset");
    } catch {}
    toast.info("Filter Deleted", {
      description: "All filter parameters reset back to default 'All'.",
    });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <button
          type="button"
          aria-label="Close filter drawer"
          onClick={onClose}
          className={cn(
            "fixed top-[45px] bottom-0 right-0 z-40 bg-black/30 backdrop-blur-xs transition-all duration-300 cursor-pointer animate-in fade-in duration-200",
            isCollapsed ? "left-0 sm:left-[60px]" : "left-0 sm:left-[200px]"
          )}
        />
      )}

      {/* Side Panel Drawer strictly matching reference */}
      <aside
        aria-hidden={!open}
        aria-label="Cloud Download filter options"
        className={cn(
          "fixed right-0 top-[45px] bottom-0 z-50 flex w-full max-w-[360px] flex-col border-l border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ease-out select-none",
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        )}
      >
        {/* Drawer Header (h-[56px] matching ReportConfigPanel) */}
        <header className="flex h-[56px] items-center justify-between border-b border-[#DFE3EB] dark:border-slate-800 px-6 bg-white dark:bg-slate-900 select-none shrink-0">
          <h2 className="text-[16px] font-semibold tracking-tight text-slate-900 dark:text-white">
            Filter
          </h2>
          <button
            type="button"
            aria-label="Close filter"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Drawer Body: Custom themed dropdowns & active states (no native <select>) */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          {/* 1. Company : */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Company :
            </label>
            <Popover open={companyOpen} onOpenChange={setCompanyOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex h-8.5 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-xs font-medium text-slate-900 dark:text-slate-100 transition-all cursor-pointer shadow-2xs hover:bg-muted/30 hover:border-[#0089FF]/60",
                    companyOpen && "border-[#0089FF] ring-2 ring-[#0089FF]/20"
                  )}
                >
                  <span className="truncate">{draft.company}</span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-400 transition-transform duration-200 shrink-0",
                      companyOpen && "rotate-180"
                    )}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-[312px] p-1 text-xs bg-popover/98 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-60 select-none animate-in fade-in-0 zoom-in-95 space-y-0.5"
              >
                {companyOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setDraft({ ...draft, company: opt });
                      setCompanyOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-2.5 py-2 rounded-md text-xs transition-colors cursor-pointer select-none text-left",
                      draft.company === opt
                        ? "bg-[#0089FF]/10 text-[#0089FF] font-semibold"
                        : "text-foreground hover:bg-muted font-medium"
                    )}
                  >
                    <span>{opt}</span>
                    {draft.company === opt && <Check className="h-3.5 w-3.5 text-[#0089FF] shrink-0" />}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>

          {/* 2. Branch : */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Branch :
            </label>
            <Popover open={branchOpen} onOpenChange={setBranchOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex h-8.5 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-xs font-medium text-slate-900 dark:text-slate-100 transition-all cursor-pointer shadow-2xs hover:bg-muted/30 hover:border-[#0089FF]/60",
                    branchOpen && "border-[#0089FF] ring-2 ring-[#0089FF]/20"
                  )}
                >
                  <span className="truncate">{draft.branch}</span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-400 transition-transform duration-200 shrink-0",
                      branchOpen && "rotate-180"
                    )}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-[312px] p-1 text-xs bg-popover/98 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-60 select-none animate-in fade-in-0 zoom-in-95 space-y-0.5"
              >
                {branchOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setDraft({ ...draft, branch: opt });
                      setBranchOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-2.5 py-2 rounded-md text-xs transition-colors cursor-pointer select-none text-left",
                      draft.branch === opt
                        ? "bg-[#0089FF]/10 text-[#0089FF] font-semibold"
                        : "text-foreground hover:bg-muted font-medium"
                    )}
                  >
                    <span>{opt}</span>
                    {draft.branch === opt && <Check className="h-3.5 w-3.5 text-[#0089FF] shrink-0" />}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>

          {/* 3. Status : */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Status :
            </label>
            <Popover open={statusOpen} onOpenChange={setStatusOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex h-8.5 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-xs font-medium text-slate-900 dark:text-slate-100 transition-all cursor-pointer shadow-2xs hover:bg-muted/30 hover:border-[#0089FF]/60",
                    statusOpen && "border-[#0089FF] ring-2 ring-[#0089FF]/20"
                  )}
                >
                  <span className="truncate">{draft.status}</span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-400 transition-transform duration-200 shrink-0",
                      statusOpen && "rotate-180"
                    )}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-[312px] p-1 text-xs bg-popover/98 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-60 select-none animate-in fade-in-0 zoom-in-95 space-y-0.5"
              >
                {statusOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setDraft({ ...draft, status: opt });
                      setStatusOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-2.5 py-2 rounded-md text-xs transition-colors cursor-pointer select-none text-left",
                      draft.status === opt
                        ? "bg-[#0089FF]/10 text-[#0089FF] font-semibold"
                        : "text-foreground hover:bg-muted font-medium"
                    )}
                  >
                    <span>{opt}</span>
                    {draft.status === opt && <Check className="h-3.5 w-3.5 text-[#0089FF] shrink-0" />}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>

          {/* 4. Download Request For : */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Download Request For :
            </label>
            <Popover open={requestForOpen} onOpenChange={setRequestForOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex h-8.5 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-xs font-medium text-slate-900 dark:text-slate-100 transition-all cursor-pointer shadow-2xs hover:bg-muted/30 hover:border-[#0089FF]/60",
                    requestForOpen && "border-[#0089FF] ring-2 ring-[#0089FF]/20"
                  )}
                >
                  <span className="truncate">{draft.downloadRequestFor}</span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-400 transition-transform duration-200 shrink-0",
                      requestForOpen && "rotate-180"
                    )}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-[312px] p-1 text-xs bg-popover/98 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-60 select-none animate-in fade-in-0 zoom-in-95 space-y-0.5"
              >
                {requestForOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setDraft({ ...draft, downloadRequestFor: opt });
                      setRequestForOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-2.5 py-2 rounded-md text-xs transition-colors cursor-pointer select-none text-left",
                      draft.downloadRequestFor === opt
                        ? "bg-[#0089FF]/10 text-[#0089FF] font-semibold"
                        : "text-foreground hover:bg-muted font-medium"
                    )}
                  >
                    <span className="truncate">{opt}</span>
                    {draft.downloadRequestFor === opt && (
                      <Check className="h-3.5 w-3.5 text-[#0089FF] shrink-0" />
                    )}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>

          {/* 5. Date Selection : (Using CloudDateTimeRangePicker matching media_1793783456954_640383bf.png) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Date Selection :
            </label>
            <CloudDateTimeRangePicker
              className="w-full"
              align="end"
              triggerClassName="w-full justify-between h-8.5 border border-input bg-background shadow-2xs hover:border-[#0089FF]/60 font-mono text-[11px]"
              value={draft.dateTime}
              onChange={(newVal) => setDraft({ ...draft, dateTime: newVal })}
            />
          </div>
        </div>

        {/* Standardized Drawer Footer matching ReportConfigPanel (h-[56px]) */}
        <footer className="flex h-[56px] items-center justify-between border-t border-[#DFE3EB] dark:border-slate-800 px-5 bg-background select-none shrink-0 gap-2">
          {/* Left CTAs: Save Filter & Delete Filter with exact theme styling */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveFilter}
              title="Save current filters as preset"
              className="h-9 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 sm:px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs active:scale-98 shrink-0"
            >
              Save Filter
            </button>

            <button
              type="button"
              onClick={handleDeleteFilter}
              title="Delete and reset filters to default"
              className="h-9 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 sm:px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs active:scale-98 shrink-0"
            >
              Delete Filter
            </button>
          </div>

          {/* Right CTA: Apply button at the bottom side matching theme */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleApply}
              className="h-9 rounded-lg bg-[#0089FF] hover:bg-[#0070d6] px-5 sm:px-6 text-xs font-semibold text-white transition-all cursor-pointer shadow-xs active:scale-98 shrink-0"
            >
              Apply
            </button>
          </div>
        </footer>
      </aside>
    </>
  );
}
