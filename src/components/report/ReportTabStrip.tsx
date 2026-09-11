import React, { useState, useMemo } from "react";
import {
  Star,
  Plus,
  X,
  Search,
  Folder,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { REPORT_CATEGORIES, type ReportTreeItem } from "@/data/reports";
import { cn } from "@/lib/utils";

export type ReportTab = {
  id: string; // unique tab instance ID
  reportId: string; // e.g. "today-activity", "temperature-summary", "fuel", "geofence-duration"
  title: string;
  isFavorite?: boolean;
};

export const DEFAULT_REPORT_TABS: ReportTab[] = [
  {
    id: "tab-travel",
    reportId: "today-activity",
    title: "Travel Summary",
    isFavorite: true,
  },
  {
    id: "tab-temperature",
    reportId: "temperature-summary",
    title: "Temperature",
    isFavorite: false,
  },
  {
    id: "tab-fuel",
    reportId: "fuel",
    title: "Fuel Economy",
    isFavorite: false,
  },
  {
    id: "tab-geofence",
    reportId: "geofence-duration",
    title: "Geofence",
    isFavorite: false,
  },
];

export function ReportTabStrip({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onAddTab,
  onToggleFavorite,
}: {
  tabs: ReportTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onAddTab: (reportItem: ReportTreeItem) => void;
  onToggleFavorite?: (tabId: string) => void;
}) {
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return REPORT_CATEGORIES;
    }
    return REPORT_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [searchQuery]);

  return (
    <div className="flex items-end justify-between gap-2 px-0 pt-0 pb-0 select-none shrink-0 relative">
      {/* Tab bar list */}
      <div className="relative z-10 flex min-w-0 flex-1 items-end gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab, tabIndex) => {
          const isActive = tab.id === activeTabId;
          const isFirstTab = tabIndex === 0;

          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={cn(
                "group relative flex shrink-0 cursor-pointer items-center gap-2 px-4 py-2 text-xs transition-all duration-150 select-none",
                isFirstTab ? "rounded-tl-xl rounded-tr-xl" : "rounded-t-xl",
                isActive
                  ? "bg-card dark:bg-slate-900 border-t border-l border-r border-[#DFE3EB] dark:border-slate-800 -mb-[1px] z-20 shadow-xs text-foreground font-semibold"
                  : "bg-transparent hover:bg-slate-200/60 dark:hover:bg-slate-800/60 text-muted-foreground hover:text-foreground mb-0 font-medium rounded-t-lg",
              )}
            >
              {/* Left Inverted Concave Curve Fillet for Active Tab (only rendered if not the first tab) */}
              {isActive && !isFirstTab && (
                <svg
                  viewBox="0 0 12 12"
                  className="absolute -left-3 bottom-0 h-3 w-3 fill-card dark:fill-slate-900 pointer-events-none z-20"
                >
                  <path d="M12 0 C12 6.627 6.627 12 0 12 L12 12 Z" />
                  <path
                    d="M12 0 C12 6.627 6.627 12 0 12"
                    fill="none"
                    className="stroke-[#DFE3EB] dark:stroke-slate-800"
                    strokeWidth="1"
                  />
                </svg>
              )}

              {/* Right Inverted Concave Curve Fillet for Active Tab */}
              {isActive && (
                <svg
                  viewBox="0 0 12 12"
                  className="absolute -right-3 bottom-0 h-3 w-3 fill-card dark:fill-slate-900 pointer-events-none z-20"
                >
                  <path d="M0 0 C0 6.627 5.373 12 12 12 L0 12 Z" />
                  <path
                    d="M0 0 C0 6.627 5.373 12 12 12"
                    fill="none"
                    className="stroke-[#DFE3EB] dark:stroke-slate-800"
                    strokeWidth="1"
                  />
                </svg>
              )}

              {/* Seamless bottom mask strictly within the active tab boundary to merge into toolbar frame */}
              {isActive && (
                <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-card dark:bg-slate-900 z-30 pointer-events-none" />
              )}

              {/* Star Favorite Icon */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite?.(tab.id);
                }}
                className={cn(
                  "p-0.5 rounded transition-colors cursor-pointer shrink-0",
                  tab.isFavorite
                    ? "text-amber-400 hover:text-amber-500"
                    : "text-muted-foreground/60 hover:text-amber-400 opacity-60 group-hover:opacity-100",
                )}
                title={tab.isFavorite ? "Unfavorite report" : "Favorite report"}
              >
                <Star
                  className={cn(
                    "h-3.5 w-3.5",
                    tab.isFavorite && "fill-amber-400 text-amber-400",
                  )}
                />
              </button>

              {/* Tab Title */}
              <span className="truncate max-w-[160px] whitespace-nowrap text-xs font-semibold">
                {tab.title}
              </span>

              {/* Close Button (visible when more than 1 tab exists) */}
              {tabs.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  className={cn(
                    "p-0.5 rounded-full text-muted-foreground/60 hover:text-foreground hover:bg-muted/80 transition-all opacity-0 group-hover:opacity-100 cursor-pointer ml-0.5",
                    isActive && "opacity-60",
                  )}
                  title="Close tab"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          );
        })}

        {/* + New Button with Dropdown Popover */}
        <Popover open={newMenuOpen} onOpenChange={setNewMenuOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex shrink-0 items-center gap-1 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer rounded-t-lg mb-0.5",
                newMenuOpen && "text-foreground font-semibold bg-slate-200/70",
              )}
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.2]" />
              <span>New</span>
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            sideOffset={6}
            className="w-80 p-0 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl animate-in fade-in-0 zoom-in-95 duration-100 z-50 text-xs"
          >
            {/* Header & Search */}
            <div className="p-3 border-b border-border/70 bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  Open Report in New Tab
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {REPORT_CATEGORIES.reduce((acc, c) => acc + c.items.length, 0)} available
                </span>
              </div>
              <div className="flex h-7 items-center gap-1.5 rounded-md border border-input/80 bg-background px-2 focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all">
                <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search report name or category..."
                  className="h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* List of Report Categories & Items */}
            <div className="max-h-64 overflow-y-auto p-1.5 space-y-2 custom-scrollbar">
              {filteredCategories.map((cat) => (
                <div key={cat.category} className="space-y-0.5">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
                    <Folder className="h-3 w-3 text-muted-foreground" />
                    <span>{cat.label}</span>
                  </div>
                  {cat.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onAddTab(item);
                        setNewMenuOpen(false);
                        setSearchQuery("");
                      }}
                      className="w-full flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-foreground hover:bg-muted transition-colors cursor-pointer text-left group"
                    >
                      <span className="font-medium group-hover:text-[#0089FF] group-hover:font-semibold transition-colors">
                        {item.name}
                      </span>
                      <Plus className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-[#0089FF] transition-all" />
                    </button>
                  ))}
                </div>
              ))}
              {filteredCategories.length === 0 && (
                <div className="p-4 text-center text-xs text-muted-foreground italic">
                  No reports found matching &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
