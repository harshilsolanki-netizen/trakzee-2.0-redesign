import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate, useLocation, useSearch } from "@tanstack/react-router";
import {
  FileText,
  ChevronRight,
  Activity,
  MapPin,
  Cpu,
  Bell,
  CalendarClock,
  Receipt,
  Fuel,
  Droplet,
  Zap,
  Thermometer,
  Briefcase,
  Lock,
  CircleGauge,
  UserCheck,
  Gauge,
  Route,
  CreditCard,
  Weight,
  Sliders,
  FileCode,
  Award,
  Wrench,
  Users,
  Search,
  Check,
  ArrowRight,
  Star,
  X,
  Sparkles,
} from "lucide-react";
import { useState, useMemo, useEffect, useRef, type ComponentType } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDashboard } from "@/dashboard/store";
import {
  REPORT_CATEGORIES,
  ALL_REPORTS,
  findReport,
  REPORT_CATEGORY_DESCRIPTIONS,
  type ReportCategoryNode,
  type ReportTreeItem,
} from "@/data/reports";
import { useSideMenuViewMode } from "@/lib/useSideMenuViewMode";
import { SideMenuFullView, type FullViewCategory } from "./SideMenuFullView";
import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const REPORT_CATEGORY_ICONS: Record<
  string,
  ComponentType<{ className?: string }>
> = {
  activity: Activity,
  geofence_address: MapPin,
  sensor: Cpu,
  alert: Bell,
  reminder: CalendarClock,
  expense: Receipt,
  fuel: Fuel,
  adblue: Droplet,
  rpm: Zap,
  temperature: Thermometer,
  job: Briefcase,
  elock: Lock,
  tire: CircleGauge,
  driver: UserCheck,
  obd: Gauge,
  trip_classification: Route,
  billing: CreditCard,
  load: Weight,
  customized: Sliders,
  logs: FileCode,
  kpi: Award,
  hardware_maintenance: Wrench,
  employee: Users,
};

// Logical grouping for 23 categories in the trending UI
const CATEGORY_GROUPS = [
  {
    groupLabel: "OPERATIONS",
    categoryKeys: [
      "activity",
      "geofence_address",
      "sensor",
      "alert",
      "reminder",
      "trip_classification",
    ],
  },
  {
    groupLabel: "TELEMATICS & ASSETS",
    categoryKeys: [
      "fuel",
      "adblue",
      "rpm",
      "temperature",
      "job",
      "elock",
      "tire",
      "driver",
      "obd",
      "load",
    ],
  },
  {
    groupLabel: "BUSINESS & SYSTEM",
    categoryKeys: [
      "expense",
      "billing",
      "customized",
      "logs",
      "kpi",
      "hardware_maintenance",
      "employee",
    ],
  },
];

export function ReportsMenu({ collapsed }: { collapsed?: boolean }) {
  const { favorites = [], toggleFavorite, isFavorite } = useDashboard();
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("activity");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const search = useSearch({ strict: false }) as { type?: string };

  const isReportsRoute = location.pathname.startsWith("/report");
  const currentReportType = search?.type || "travel";
  const { sideMenuViewMode, setSideMenuViewMode } = useSideMenuViewMode();

  const fullViewCategories = useMemo<FullViewCategory[]>(() => {
    return REPORT_CATEGORIES.map((cat) => {
      const Icon = REPORT_CATEGORY_ICONS[cat.category] || FileText;
      const desc =
        REPORT_CATEGORY_DESCRIPTIONS[cat.category] ||
        "Comprehensive reports, analytics, and operational metrics.";
      return {
        id: cat.category,
        label: cat.label,
        icon: Icon,
        countLabel: `${cat.items.length} Reports available`,
        description: desc,
        items: cat.items.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          to: item.to,
        })),
        primaryActionLabel: "Configure Module",
      };
    });
  }, []);


  const favoriteItems = useMemo(() => {
    return (favorites ?? []).map(findReport).filter(Boolean) as ReportTreeItem[];
  }, [favorites]);

  // Automatically switch active category to the currently active report's category when opening
  useEffect(() => {
    if (open) {
      setSearchQuery("");
      const currentReport = ALL_REPORTS.find((r) => r.id === currentReportType);
      if (currentReport) {
        const matchingCat = REPORT_CATEGORIES.find((c) =>
          c.items.some((item) => item.id === currentReport.id),
        );
        if (matchingCat) {
          setActiveCategory(matchingCat.category);
        }
      }
    }
  }, [open, currentReportType]);

  const selectedCategoryNode: ReportCategoryNode = useMemo(() => {
    if (activeCategory === "favorites") {
      return {
        category: "favorites",
        label: "Favourites",
        items: favoriteItems,
      };
    }
    return (
      REPORT_CATEGORIES.find((c) => c.category === activeCategory) ??
      REPORT_CATEGORIES[0]!
    );
  }, [activeCategory, favoriteItems]);

  // Global search filtering across all 105 reports
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return ALL_REPORTS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Click outside and ESC listeners
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSelectReport = (item: ReportTreeItem) => {
    setOpen(false);
    navigate({
      to: "/report",
      search: { type: item.id } as Record<string, unknown>,
    });
  };

  const triggerButton = (
    <button
      ref={triggerRef}
      type="button"
      aria-label="Report"
      onClick={() => setOpen((prev) => !prev)}
      className={cn(
        "group flex w-full h-10 items-center rounded-xl transition-colors duration-200 cursor-pointer select-none overflow-hidden",
        collapsed ? "justify-center px-0" : "px-2.5",
        open || isReportsRoute
          ? "bg-[#0089FF] text-white shadow-lg shadow-[#0089FF]/35 font-semibold"
          : "text-slate-400 hover:bg-white/10 hover:text-white font-medium"
      )}
    >
      <div className="flex h-5 w-5 shrink-0 items-center justify-center">
        <FileText
          className={cn(
            "h-5 w-5 shrink-0 transition-transform duration-200",
            open || isReportsRoute ? "text-white" : "text-slate-400 group-hover:text-white group-hover:scale-105"
          )}
        />
      </div>
      <div
        className={cn(
          "overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
          collapsed
            ? "w-0 max-w-0 opacity-0 m-0 p-0 pointer-events-none"
            : "max-w-[130px] opacity-100 translate-x-0 ml-3"
        )}
      >
        <span
          className={cn(
            "leading-tight tracking-tight block truncate text-xs",
            open || isReportsRoute ? "font-semibold text-white" : "font-medium text-slate-300 group-hover:text-white"
          )}
        >
          Report
        </span>
      </div>
    </button>
  );

  return (
    <div className="w-full relative">
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{triggerButton}</TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={12}
            className="bg-[#18191b] text-white text-xs px-2.5 py-1 rounded shadow-xl border border-white/10 font-medium"
          >
            Report
          </TooltipContent>
        </Tooltip>
      ) : (
        triggerButton
      )}

      {open && sideMenuViewMode === "full" && (
        <SideMenuFullView
          title="Reports Explorer"
          subtitle="Explore all 23 telematics and operations categories"
          collapsed={collapsed}
          categories={fullViewCategories}
          activeItemId={currentReportType}
          onSelectItem={handleSelectReport}
          onConfigureModule={(cat) => {
            const firstItem = cat.items[0];
            if (firstItem) {
              handleSelectReport(firstItem as ReportTreeItem);
            }
          }}
          onClose={() => setOpen(false)}
        />
      )}

      {open && sideMenuViewMode === "standard" && (
        <>
          {/* Backdrop for outside click dismiss with blur effect */}
          <div
            className={cn("fixed inset-0 top-[45px] z-40 bg-black/40 backdrop-blur-sm transition-all animate-in fade-in duration-200", collapsed ? "left-[60px]" : "left-[200px]")}
            onClick={() => setOpen(false)}
          />

          {/* Bottom-Anchored Flyout Panel with 10px bottom & left margin */}
          <div
            ref={menuRef}
            className={cn("fixed bottom-[10px] z-50 flex flex-col w-auto min-w-[480px] max-w-[530px] max-h-[calc(100vh-65px)] overflow-hidden rounded-2xl border border-slate-700/60 bg-[#0B1736]/98 p-0 text-slate-100 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 animate-in fade-in slide-in-from-left-2 duration-150", collapsed ? "left-[70px]" : "left-[210px]")}
          >
            {/* Top Search & Filter Header */}
            <div className="border-b border-slate-800/80 bg-slate-900/60 px-3 py-2.5">
              <div className="relative flex items-center rounded-lg border border-slate-700/60 bg-slate-950/60 px-2.5 py-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/30 transition-all">
                <Search className="h-3.5 w-3.5 text-slate-400 shrink-0 mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 100+ fleet reports, metrics..."
                  className="h-full flex-1 bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
                  autoFocus
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-slate-400 hover:text-slate-200 cursor-pointer p-0.5 rounded"
                  >
                    <X className="h-3 w-3" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-800/60 border border-slate-700/50 px-1.5 py-0.5 rounded">
                      105 Reports
                    </span>
                    <button
                      type="button"
                      title="Switch to Full View"
                      onClick={() => setSideMenuViewMode("full")}
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800/60 hover:bg-[#0089FF] hover:text-white border border-slate-700/50 text-[10px] font-semibold text-slate-400 transition-colors cursor-pointer"
                    >
                      <LayoutGrid className="h-3 w-3" />
                      <span>Full</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content Body: Instant Search Mode OR 2-Column Cascading Mode */}
            {searchQuery.trim() ? (
              /* Instant Search Results View */
              <div className="max-h-[68vh] min-h-[220px] overflow-y-auto overscroll-contain p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
                {searchResults.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    <Search className="mx-auto h-6 w-6 opacity-30 mb-2" />
                    No reports found matching &ldquo;{searchQuery}&rdquo;
                  </div>
                ) : (
                  searchResults.map((item) => {
                    const isSelected =
                      item.id === currentReportType && isReportsRoute;
                    const fav = isFavorite(item.id);
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs transition-all group",
                          isSelected
                            ? "bg-blue-600 text-white font-semibold shadow-md"
                            : "text-slate-200 hover:bg-slate-800/80 hover:text-white",
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => handleSelectReport(item)}
                          className="flex flex-1 items-center gap-2 min-w-0 text-left cursor-pointer"
                        >
                          <span className="font-medium truncate">{item.name}</span>
                        </button>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                            {item.category}
                          </span>
                          <button
                            type="button"
                            title={fav ? "Remove from favourites" : "Add to favourites"}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(item.id);
                            }}
                            className="p-1 text-slate-400 hover:text-amber-400 cursor-pointer rounded transition-all"
                          >
                            <Star
                              className={cn(
                                "h-3.5 w-3.5 transition-colors",
                                fav
                                  ? "fill-amber-400 text-amber-400"
                                  : "opacity-0 group-hover:opacity-70 hover:opacity-100",
                              )}
                            />
                          </button>
                          {isSelected ? (
                            <Check className="h-3.5 w-3.5 text-white ml-1" />
                          ) : (
                            <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 ml-1" />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              /* 2-Column Categorized Cascading View */
              <div className="flex divide-x divide-slate-800/80 text-xs">
                {/* Left Column: Categories List with Groups */}
                <div className="flex w-[215px] flex-col py-2 max-h-[72vh] overflow-y-auto overscroll-contain space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
                  {/* Favourites Shortcut if exists */}
                  {favoriteItems.length > 0 && (
                    <div className="space-y-0.5 px-1.5">
                      <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>FAVOURITES</span>
                      </div>
                      <button
                        type="button"
                        onMouseEnter={() => setActiveCategory("favorites")}
                        onClick={() => setActiveCategory("favorites")}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left transition-all duration-100 cursor-pointer group",
                          activeCategory === "favorites"
                            ? "bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 shadow-xs"
                            : "text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent",
                        )}
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                          <span className="truncate">Saved Favourites</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span
                            className={cn(
                              "text-[10px] font-mono px-1.5 py-0.2 rounded transition-colors",
                              activeCategory === "favorites"
                                ? "bg-amber-500/30 text-amber-200"
                                : "bg-slate-800/80 text-slate-400 group-hover:text-slate-300",
                            )}
                          >
                            {favoriteItems.length}
                          </span>
                          <ChevronRight
                            className={cn(
                              "h-3 w-3 shrink-0 transition-transform",
                              activeCategory === "favorites"
                                ? "text-amber-400 translate-x-0.5"
                                : "text-slate-600 opacity-40",
                            )}
                          />
                        </div>
                      </button>
                    </div>
                  )}

                  {CATEGORY_GROUPS.map((group) => (
                    <div key={group.groupLabel} className="space-y-0.5 px-1.5">
                      <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {group.groupLabel}
                      </div>
                      {group.categoryKeys.map((catKey) => {
                        const cat = REPORT_CATEGORIES.find(
                          (c) => c.category === catKey,
                        );
                        if (!cat) return null;
                        const Icon = REPORT_CATEGORY_ICONS[cat.category] || FileText;
                        const isActive =
                          cat.category === selectedCategoryNode.category;

                        return (
                          <button
                            key={cat.category}
                            type="button"
                            onMouseEnter={() => setActiveCategory(cat.category)}
                            onClick={() => setActiveCategory(cat.category)}
                            className={cn(
                              "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left transition-all duration-100 cursor-pointer group",
                              isActive
                                ? "bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30 shadow-xs"
                                : "text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent",
                            )}
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <Icon
                                className={cn(
                                  "h-3.5 w-3.5 shrink-0 transition-colors",
                                  isActive
                                    ? "text-blue-400"
                                    : "text-slate-400 group-hover:text-slate-200",
                                )}
                              />
                              <span className="truncate">{cat.label}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span
                                className={cn(
                                  "text-[10px] font-mono px-1.5 py-0.2 rounded transition-colors",
                                  isActive
                                    ? "bg-blue-500/30 text-blue-200"
                                    : "bg-slate-800/80 text-slate-400 group-hover:text-slate-300",
                                )}
                              >
                                {cat.items.length}
                              </span>
                              <ChevronRight
                                className={cn(
                                  "h-3 w-3 shrink-0 transition-transform",
                                  isActive
                                    ? "text-blue-400 translate-x-0.5"
                                    : "text-slate-600 opacity-40",
                                )}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Right Column: Sub-items List with Header & Star Action */}
                <div className="flex w-[265px] flex-col py-2 bg-slate-950/40 max-h-[72vh] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-slate-800">
                  {/* Category Subtitle Header */}
                  <div className="px-3 pb-2 mb-1 border-b border-slate-800/60 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      {selectedCategoryNode.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {selectedCategoryNode.items.length} items
                    </span>
                  </div>

                  {/* Sub-item List */}
                  <div className="space-y-0.5 px-1.5">
                    {selectedCategoryNode.items.map((item: ReportTreeItem) => {
                      const isSelected =
                        item.id === currentReportType && isReportsRoute;
                      const fav = isFavorite(item.id);

                      return (
                        <div
                          key={item.id}
                          className={cn(
                            "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-all duration-100 group",
                            isSelected
                              ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/25"
                              : "text-slate-300 hover:bg-slate-800/80 hover:text-white",
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectReport(item)}
                            className="flex flex-1 items-center gap-1.5 min-w-0 text-left cursor-pointer"
                          >
                            <span className="truncate">{item.name}</span>
                          </button>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              title={fav ? "Remove from favourites" : "Add to favourites"}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(item.id);
                              }}
                              className="p-1 text-slate-400 hover:text-amber-400 cursor-pointer rounded transition-all"
                            >
                              <Star
                                className={cn(
                                  "h-3.5 w-3.5 transition-colors",
                                  fav
                                    ? "fill-amber-400 text-amber-400"
                                    : "opacity-0 group-hover:opacity-70 hover:opacity-100",
                                )}
                              />
                            </button>
                            {isSelected ? (
                              <Check className="h-3.5 w-3.5 shrink-0 text-white ml-0.5" />
                            ) : (
                              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Footer Quick Status Bar */}
            <div className="flex items-center justify-between border-t border-slate-800/80 bg-slate-950/80 px-3 py-1.5 text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-blue-400" />
                <span>23 Categories · 105 Reports</span>
              </div>
              <span className="text-slate-400 font-mono">Click to open</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
