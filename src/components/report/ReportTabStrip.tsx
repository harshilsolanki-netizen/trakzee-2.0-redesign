import React, { useState, useMemo } from "react";
import {
  Star,
  Plus,
  X,
  Search,
  Folder,
  ArrowLeft,
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
    id: "tab-travel-1",
    reportId: "today-activity",
    title: "Travel Summary",
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
  {
    id: "tab-temperature-summary",
    reportId: "temperature-summary",
    title: "Temperature",
    isFavorite: false,
  },
];

export function ReportTabStrip({
  tabs,
  activeTabId,
  level = 0,
  onGoBack,
  onSelectTab,
  onCloseTab,
  onAddTab,
  onToggleFavorite,
}: {
  tabs: ReportTab[];
  activeTabId: string;
  level?: number;
  onGoBack?: () => void;
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
    <div className="relative flex items-end justify-between h-[45px] pt-[10px] px-0 select-none shrink-0 bg-[#F1F5F9] dark:bg-slate-950 rounded-tl-lg">
      {/* Baseline border that runs across the entire strip under inactive tabs */}
      <div className="absolute left-0 right-0 bottom-0 h-px bg-[#DFE3EB] dark:bg-slate-800 z-0" />

      {/* Tab bar list */}
      <div className="relative z-10 flex min-w-0 flex-1 items-end overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden h-full pl-[10px]">
        {tabs.map((tab, tabIndex) => {
          const isActive = tab.id === activeTabId;
          const isFirstTab = tabIndex === 0;

          // Dynamic tab title based on drilldown level
          let displayTitle = tab.title;
          if (isActive) {
            if (level === 1) {
              displayTitle = "Travel Daily Summary";
            } else if (level === 2) {
              displayTitle = "Travel Detail";
            }
          }

          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={cn(
                "group relative flex shrink-0 cursor-pointer items-center gap-2 text-xs transition-all duration-150 select-none",
                isActive
                  ? "h-[35px] px-4 rounded-t-lg bg-white dark:bg-slate-900 border-t border-l border-r border-[#DFE3EB] dark:border-slate-800 text-slate-800 dark:text-white font-semibold mb-[-1px] z-20 shadow-2xs"
                  : "h-[32px] px-3 rounded-t-md bg-transparent hover:bg-slate-200/60 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-slate-900 font-medium mb-0 z-10",
              )}
            >
              {/* Left Inverted Concave Fillet for Active Tab (curving into baseline) */}
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

              {/* Right Inverted Concave Fillet for Active Tab (curving into baseline) */}
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

              {/* Leading Icon: Back button if active & drilled (level > 0), otherwise Star favorite */}
              {isActive && level > 0 ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onGoBack?.();
                  }}
                  className="flex h-5 w-5 items-center justify-center rounded hover:bg-muted p-0.5 text-foreground transition-colors cursor-pointer shrink-0 -ml-0.5"
                  title="Back to previous level"
                >
                  <ArrowLeft className="h-3.5 w-3.5 stroke-[2.2]" />
                </button>
              ) : (
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
                      : "text-slate-400 hover:text-amber-400",
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
              )}

              {/* Tab Title */}
              <span className="truncate max-w-[180px] whitespace-nowrap text-xs">
                {displayTitle}
              </span>

              {/* Close Button (visible when more than 1 tab exists) */}
              {tabs.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  className="p-0.5 rounded-full transition-all opacity-0 group-hover:opacity-100 cursor-pointer ml-0.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50"
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
                "inline-flex shrink-0 items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#0089FF] hover:text-[#0070d6] hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer rounded-md self-center z-10 ml-2",
                newMenuOpen && "bg-slate-200/80",
              )}
            >
              <Plus className="h-3.5 w-3.5 text-[#0089FF] stroke-[2.2]" />
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
