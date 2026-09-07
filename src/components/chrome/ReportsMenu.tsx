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
  X,
  Sparkles,
} from "lucide-react";
import { useState, useMemo, useEffect, type ComponentType } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  REPORT_CATEGORIES,
  ALL_REPORTS,
  type ReportCategoryNode,
  type ReportTreeItem,
} from "@/data/reports";
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

export function ReportsMenu() {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("activity");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const search = useSearch({ strict: false }) as { type?: string };

  const isReportsRoute = location.pathname.startsWith("/report");
  const currentReportType = search?.type || "travel";

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
    return (
      REPORT_CATEGORIES.find((c) => c.category === activeCategory) ??
      REPORT_CATEGORIES[0]!
    );
  }, [activeCategory]);

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

  const handleSelectReport = (item: ReportTreeItem) => {
    setOpen(false);
    navigate({
      to: "/report",
      search: { type: item.id } as Record<string, unknown>,
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Report"
          className="group flex w-full flex-col items-center gap-1 py-1 cursor-pointer select-none"
        >
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
              open || isReportsRoute
                ? "bg-[#0089FF] text-white shadow-md shadow-blue-500/25"
                : "text-slate-400 group-hover:bg-white/10 group-hover:text-white",
            )}
          >
            <FileText className="h-5 w-5" />
          </div>
          <span
            className={cn(
              "text-[10px] leading-tight tracking-tight transition-colors",
              open || isReportsRoute
                ? "font-semibold text-white"
                : "font-medium text-slate-400 group-hover:text-white",
            )}
          >
            Report
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="right"
        align="start"
        sideOffset={8}
        className="w-auto min-w-[460px] max-w-[520px] overflow-hidden rounded-2xl border border-slate-700/60 bg-[#0c1424]/98 p-0 text-slate-100 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-150"
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
              <span className="text-[10px] font-mono text-slate-500 bg-slate-800/60 border border-slate-700/50 px-1.5 py-0.5 rounded">
                105 Reports
              </span>
            )}
          </div>
        </div>

        {/* Content Body: Instant Search Mode OR 2-Column Cascading Mode */}
        {searchQuery.trim() ? (
          /* Instant Search Results View */
          <div className="max-h-[68vh] min-h-[220px] overflow-y-auto overscroll-contain p-2 space-y-1">
            {searchResults.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                <Search className="mx-auto h-6 w-6 opacity-30 mb-2" />
                No reports found matching &ldquo;{searchQuery}&rdquo;
              </div>
            ) : (
              searchResults.map((item) => {
                const isSelected =
                  item.id === currentReportType && isReportsRoute;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectReport(item)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-all cursor-pointer group",
                      isSelected
                        ? "bg-blue-600 text-white font-semibold shadow-md"
                        : "text-slate-200 hover:bg-slate-800/80 hover:text-white",
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                        {item.category}
                      </span>
                      {isSelected ? (
                        <Check className="h-3.5 w-3.5 text-white" />
                      ) : (
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        ) : (
          /* 2-Column Categorized Cascading View */
          <div className="flex divide-x divide-slate-800/80 text-xs">
            {/* Left Column: Categories List with Groups & Badges */}
            <div className="flex w-[205px] flex-col py-2 max-h-[72vh] overflow-y-auto overscroll-contain space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
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
                    const Icon =
                      REPORT_CATEGORY_ICONS[cat.category] || Activity;
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

            {/* Right Column: Sub-reports List with Category Header & Precision Highlighting */}
            <div className="flex w-[245px] flex-col py-2 bg-slate-950/40 max-h-[72vh] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-slate-800">
              {/* Category Subtitle Header */}
              <div className="px-3 pb-2 mb-1 border-b border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300">
                  {selectedCategoryNode.label} Reports
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {selectedCategoryNode.items.length} options
                </span>
              </div>

              {/* Sub-report Items */}
              <div className="space-y-0.5 px-1.5">
                {selectedCategoryNode.items.map((item: ReportTreeItem) => {
                  // Exactly highlight active report only when viewing that specific report
                  const isSelected =
                    item.id === currentReportType && isReportsRoute;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectReport(item)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-all duration-100 cursor-pointer group",
                        isSelected
                          ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/25"
                          : "text-slate-300 hover:bg-slate-800/80 hover:text-white",
                      )}
                    >
                      <span className="truncate">{item.name}</span>
                      {isSelected ? (
                        <Check className="h-3.5 w-3.5 shrink-0 text-white" />
                      ) : (
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>
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
      </PopoverContent>
    </Popover>
  );
}
