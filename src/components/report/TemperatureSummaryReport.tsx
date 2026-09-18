import {
  BarChart3,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CornerDownLeft,
  Download,
  HelpCircle,
  Plus,
  Minus,
  RefreshCw,
  Search,
  Settings,
  SlidersHorizontal,
  Thermometer,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FavoriteToggle } from "@/components/chrome/FavoritesMenu";
import { ExportPopover } from "@/components/report/ExportPopover";
import {
  ReportConfigPanel,
  type ReportFilters,
  DEFAULT_FILTERS,
} from "@/components/report/ReportConfigPanel";
import { ReportModals, type ModalKind } from "@/components/report/ReportModals";
import { ScheduleDrawer } from "@/components/report/ScheduleDrawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  temperatureSummaryRows,
  type TemperatureSummaryRow,
} from "@/data/reports";
import { cn } from "@/lib/utils";

function IconButton({
  label,
  children,
  onClick,
  disabled,
  className,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          onClick={onClick}
          disabled={disabled}
          className={cn(
            "toolbar-icon-btn inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-800 disabled:cursor-not-allowed group",
            className,
          )}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

const SEARCHABLE_COLUMNS = [
  { id: "object", label: "Vehicle No" },
  { id: "vehicleBrand", label: "Vehicle Brand" },
  { id: "vehicleModel", label: "Vehicle Model" },
  { id: "startLocation", label: "Start Location" },
  { id: "endLocation", label: "End Location" },
];

export function TemperatureSummaryReport() {
  const [filters, setFilters] = useState<ReportFilters>({
    ...DEFAULT_FILTERS,
    from: "27-11-2024",
    to: "30-11-2024",
  });
  const [configOpen, setConfigOpen] = useState(false);
  const [configTab, setConfigTab] = useState<"quick" | "advanced">("quick");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [modal, setModal] = useState<ModalKind | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>("temp-5"); // default expanded like in screenshot
  const [query, setQuery] = useState("");
  const [selectedSearchField, setSelectedSearchField] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 50;

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return temperatureSummaryRows;
    return temperatureSummaryRows.filter((r) => {
      if (selectedSearchField === "object")
        return r.object.toLowerCase().includes(q);
      if (selectedSearchField === "vehicleBrand")
        return r.vehicleBrand.toLowerCase().includes(q);
      if (selectedSearchField === "vehicleModel")
        return r.vehicleModel.toLowerCase().includes(q);
      if (selectedSearchField === "startLocation")
        return r.startLocation.toLowerCase().includes(q);
      if (selectedSearchField === "endLocation")
        return r.endLocation.toLowerCase().includes(q);
      return (
        r.object.toLowerCase().includes(q) ||
        r.vehicleBrand.toLowerCase().includes(q) ||
        r.vehicleModel.toLowerCase().includes(q) ||
        r.startLocation.toLowerCase().includes(q) ||
        r.endLocation.toLowerCase().includes(q)
      );
    });
  }, [query, selectedSearchField]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleExport = (format: string) => {
    toast.success(`Exporting Temperature Summary as ${format}`, {
      description: `${filteredRows.length} records exported.`,
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-2 p-2.5 overflow-hidden">
      {/* Action Bar matching minimal subtle slate tint */}
      <header className="flex h-[76px] min-h-[76px] max-h-[76px] shrink-0 items-center justify-between gap-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 px-4 shadow-2xs backdrop-blur-xs">
        {/* Left: Line 1 = Title, Line 2 = Date time, Vehicle list, and Advanced Filter below */}
        <div className="flex flex-col justify-center gap-0.5 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <FavoriteToggle
              reportId="temperature"
              className="text-muted-foreground hover:text-amber-500"
            />
            <h1 className="text-[18px] font-medium text-foreground leading-tight tracking-tight whitespace-nowrap">
              Temperature Summary
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
            {/* Date Selection Badge */}
            <button
              type="button"
              onClick={() => {
                setConfigTab("quick");
                setConfigOpen(true);
              }}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground cursor-pointer font-normal"
            >
              <span>
                {filters.from} 12:00 AM → {filters.to} 10:52 PM
              </span>
              <ChevronDown className="h-2.5 w-2.5 opacity-60" />
            </button>

            <span className="text-muted-foreground/40 font-mono">|</span>

            {/* Vehicle Selection Badge */}
            <button
              type="button"
              onClick={() => {
                setConfigTab("quick");
                setConfigOpen(true);
              }}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground cursor-pointer font-normal"
            >
              <span>MH18CC2635 +7 more</span>
              <ChevronDown className="h-2.5 w-2.5 opacity-60" />
            </button>

            <span className="text-muted-foreground/40 font-mono">|</span>

            {/* Quick Filter */}
            <button
              type="button"
              onClick={() => {
                setConfigTab("quick");
                setConfigOpen(true);
              }}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="h-3 w-3" />
              <span>Quick Filter</span>
            </button>
          </div>
        </div>

        {/* Right: Integrated Search + Download + Quick Action Icons + Pagination */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Integrated Search with Field Selector Ahead on Left */}
          <div className="relative flex h-7 items-center rounded border border-input bg-background shadow-2xs focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  title="Select specific field to search"
                  className="flex h-full items-center gap-1 border-r border-input bg-surface-muted/60 px-2 text-[11px] font-medium text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0 rounded-l"
                >
                  <span className="max-w-[76px] truncate">
                    {SEARCHABLE_COLUMNS.find(
                      (c) => c.id === selectedSearchField,
                    )?.label || "All"}
                  </span>
                  <ChevronDown className="h-2.5 w-2.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44 p-1 text-xs">
                <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground px-2 py-1">
                  Search Column
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => setSelectedSearchField("all")}
                  className={cn(
                    "flex items-center justify-between cursor-pointer text-xs rounded px-2 py-1",
                    selectedSearchField === "all" &&
                      "bg-primary/10 font-bold text-primary",
                  )}
                >
                  <span>All Columns</span>
                  {selectedSearchField === "all" && (
                    <Check className="h-3 w-3" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                {SEARCHABLE_COLUMNS.map((col) => (
                  <DropdownMenuItem
                    key={col.id}
                    onClick={() => setSelectedSearchField(col.id)}
                    className={cn(
                      "flex items-center justify-between cursor-pointer text-xs rounded px-2 py-1",
                      selectedSearchField === col.id &&
                        "bg-primary/10 font-bold text-primary",
                    )}
                  >
                    <span>{col.label}</span>
                    {selectedSearchField === col.id && (
                      <Check className="h-3 w-3" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="relative flex items-center flex-1">
              <Search className="ml-2 h-3 w-3 text-muted-foreground shrink-0 pointer-events-none" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (query.trim()) {
                      toast.success(
                        `Showing ${filteredRows.length} matching records`,
                        {
                          description: `Search: "${query.trim()}" in ${selectedSearchField === "all" ? "all fields" : SEARCHABLE_COLUMNS.find((c) => c.id === selectedSearchField)?.label}`,
                        },
                      );
                    }
                  }
                }}
                placeholder={
                  selectedSearchField === "all"
                    ? "Search in all fields..."
                    : `Search in ${SEARCHABLE_COLUMNS.find((c) => c.id === selectedSearchField)?.label || "field"}...`
                }
                aria-label="Search records"
                className="h-6.5 w-32 sm:w-44 bg-transparent px-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
              {query && (
                <div className="flex items-center gap-1 mr-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="rounded p-0.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <kbd
                    title="Press Enter to search"
                    className="inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[9px] font-mono font-medium text-muted-foreground bg-muted/80 border border-border/80 shadow-2xs select-none"
                  >
                    <CornerDownLeft className="h-2.5 w-2.5" />
                    <span>Enter</span>
                  </kbd>
                </div>
              )}
            </div>
          </div>

          {/* Export / Download Menu */}
          <ExportPopover onSelect={(f, s) => handleExport(`${f} (${s})`)} />

          {/* Quick Action Utility Icons */}
          <div className="flex items-center gap-1">
            <IconButton
              label="Schedule report"
              onClick={() => setScheduleOpen(true)}
            >
              <CalendarClock className="h-[18px] w-[18px] text-slate-800 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white stroke-[2.2] transition-colors" />
            </IconButton>
            <IconButton
              label="Column visibility"
              onClick={() => setModal("columns")}
            >
              <Settings className="h-[18px] w-[18px] text-slate-800 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white stroke-[2.2] transition-colors" />
            </IconButton>
            <IconButton label="Chart view" onClick={() => setModal("chart")}>
              <BarChart3 className="h-[18px] w-[18px] text-slate-800 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white stroke-[2.2] transition-colors" />
            </IconButton>
            <IconButton label="Help & guide" onClick={() => setModal("help")}>
              <HelpCircle className="h-[18px] w-[18px] text-slate-800 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white stroke-[2.2] transition-colors" />
            </IconButton>
          </div>

          {/* Page size & Pagination */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="text-[11px] font-medium text-foreground/80">
              1–{filteredRows.length} of {filteredRows.length}
            </span>
            <div className="flex items-center gap-1">
              <IconButton label="Previous page" disabled onClick={() => {}}>
                <ChevronLeft className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton label="Next page" disabled onClick={() => {}}>
                <ChevronRight className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton
                label="Refresh"
                onClick={() => toast.success("Temperature data refreshed")}
              >
                <RefreshCw className="h-[18px] w-[18px] text-slate-800 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white stroke-[2.2] transition-colors" />
              </IconButton>
            </div>
          </div>
        </div>
      </header>

      {/* Multi-Level Temperature Table */}
      <div className="relative flex min-h-0 flex-1 flex-row overflow-hidden rounded-md border border-border bg-surface shadow-xs">
        <div className="min-h-0 flex-1 overflow-auto overscroll-contain scroll-smooth">
          <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
            <thead className="sticky top-0 z-10 bg-nav text-nav-foreground text-[11px] select-none">
              {/* Header Level 1 */}
              <tr className="border-b border-border/40 divide-x divide-white/10">
                <th
                  rowSpan={2}
                  className="w-10 px-2 py-2 text-center font-semibold"
                ></th>
                <th rowSpan={2} className="px-3 py-2 font-semibold">
                  Object
                </th>
                <th rowSpan={2} className="px-3 py-2 font-semibold">
                  Vehicle Brand
                </th>
                <th rowSpan={2} className="px-3 py-2 font-semibold">
                  Vehicle Model
                </th>
                <th
                  colSpan={2}
                  className="px-3 py-1.5 text-center font-semibold bg-nav/90"
                >
                  Port
                </th>
                <th rowSpan={2} className="px-3 py-2 font-semibold text-right">
                  Distance (km)
                </th>
                <th rowSpan={2} className="px-3 py-2 font-semibold">
                  Start Location
                </th>
                <th
                  colSpan={3}
                  className="px-3 py-1.5 text-center font-semibold bg-nav/90"
                >
                  Temperature
                </th>
                <th rowSpan={2} className="px-2 py-2 text-center font-semibold">
                  Unit
                </th>
                <th
                  colSpan={3}
                  className="px-3 py-1.5 text-center font-semibold bg-nav/90"
                >
                  Humidity (%RH)
                </th>
                <th rowSpan={2} className="px-3 py-2 font-semibold">
                  End Location
                </th>
                <th rowSpan={2} className="px-3 py-2 text-center font-semibold">
                  Temperature Chart
                </th>
              </tr>
              {/* Header Level 2 */}
              <tr className="border-b border-border/60 divide-x divide-white/10 text-[10px] bg-nav/95">
                <th className="px-2.5 py-1 text-center font-medium">
                  Temperature
                </th>
                <th className="px-2.5 py-1 text-center font-medium">
                  Humidity
                </th>
                <th className="px-2.5 py-1 text-right font-medium">Average</th>
                <th className="px-2.5 py-1 text-right font-medium">Min</th>
                <th className="px-2.5 py-1 text-right font-medium">Max</th>
                <th className="px-2.5 py-1 text-right font-medium">Average</th>
                <th className="px-2.5 py-1 text-right font-medium">Min</th>
                <th className="px-2.5 py-1 text-right font-medium">Max</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border text-foreground">
              {filteredRows.map((row) => {
                const isExpanded = expandedId === row.id;

                return (
                  <tbody key={row.id} className="divide-y divide-border">
                    {/* Primary Vehicle Row */}
                    <tr
                      onClick={() => toggleExpand(row.id)}
                      className={cn(
                        "transition-colors duration-75 cursor-pointer divide-x divide-border/50",
                        isExpanded
                          ? "bg-amber-100/50 dark:bg-amber-950/40 font-medium"
                          : "hover:bg-muted/50",
                      )}
                    >
                      <td className="px-2 py-2.5 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(row.id);
                          }}
                          aria-label={isExpanded ? "Collapse temperature" : "Expand temperature"}
                          className="table-expand-btn inline-flex items-center justify-center p-0.5 bg-transparent border-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
                        >
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 stroke-[2.2] transition-transform duration-200",
                              isExpanded && "rotate-90 text-[#0089FF]",
                            )}
                          />
                        </button>
                      </td>
                      <td className="px-3 py-2.5 font-bold text-foreground">
                        {row.object}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {row.vehicleBrand}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {row.vehicleModel}
                      </td>
                      <td className="px-3 py-2.5 text-center text-xs text-foreground/90">
                        {row.portTemp}
                      </td>
                      <td className="px-3 py-2.5 text-center text-muted-foreground">
                        {row.portHumidity}
                      </td>
                      <td className="px-3 py-2.5 text-right font-semibold text-foreground">
                        {row.distance.toFixed(2)}
                      </td>
                      <td
                        className="px-3 py-2.5 text-muted-foreground max-w-[200px] truncate"
                        title={row.startLocation}
                      >
                        {row.startLocation}
                      </td>
                      <td
                        className={cn(
                          "px-3 py-2.5 text-right font-medium",
                          row.tempAvg < 0
                            ? "text-cyan-600 dark:text-cyan-400"
                            : "text-amber-600",
                        )}
                      >
                        {row.tempAvg.toFixed(2)}
                      </td>
                      <td
                        className={cn(
                          "px-3 py-2.5 text-right",
                          row.tempMin < 0
                            ? "text-cyan-600 dark:text-cyan-400"
                            : "",
                        )}
                      >
                        {row.tempMin.toFixed(1)}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        {row.tempMax.toFixed(1)}
                      </td>
                      <td className="px-2 py-2.5 text-center text-muted-foreground">
                        {row.unit}
                      </td>
                      <td className="px-3 py-2.5 text-right text-muted-foreground">
                        {row.humidityAvg.toFixed(1)}
                      </td>
                      <td className="px-3 py-2.5 text-right text-muted-foreground">
                        {row.humidityMin.toFixed(1)}
                      </td>
                      <td className="px-3 py-2.5 text-right text-muted-foreground">
                        {row.humidityMax.toFixed(1)}
                      </td>
                      <td
                        className="px-3 py-2.5 text-muted-foreground max-w-[200px] truncate"
                        title={row.endLocation}
                      >
                        {row.endLocation}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.info(
                              `Opening temperature graph for ${row.object}`,
                            );
                            setModal("chart");
                          }}
                          className="inline-flex h-6 w-6 items-center justify-center rounded text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/40 cursor-pointer"
                          title="View Temperature Chart"
                        >
                          <Thermometer className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Day-Wise Sub-Table */}
                    {isExpanded && (
                      <tr className="bg-muted/20">
                        <td colSpan={17} className="p-3 pl-8">
                          <div className="overflow-hidden rounded border border-border/80 bg-surface shadow-xs">
                            <table className="w-full border-collapse text-left text-xs">
                              <thead className="bg-muted/70 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
                                <tr className="divide-x divide-border/60">
                                  <th className="px-3 py-2">Date</th>
                                  <th className="px-3 py-2 text-right">
                                    Distance (km)
                                  </th>
                                  <th className="px-3 py-2">Start Location</th>
                                  <th className="px-3 py-2 text-right">
                                    Temp (Avg)
                                  </th>
                                  <th className="px-3 py-2 text-right">
                                    Temp (Min)
                                  </th>
                                  <th className="px-3 py-2 text-right">
                                    Temp (Max)
                                  </th>
                                  <th className="px-2 py-2 text-center">
                                    Unit
                                  </th>
                                  <th className="px-3 py-2 text-right">
                                    Humidity (Avg)
                                  </th>
                                  <th className="px-3 py-2 text-right">
                                    Humidity (Min)
                                  </th>
                                  <th className="px-3 py-2 text-right">
                                    Humidity (Max)
                                  </th>
                                  <th className="px-3 py-2">End Location</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border text-[11px]">
                                {row.daily.map((d, i) => (
                                  <tr
                                    key={i}
                                    className="hover:bg-muted/40 divide-x divide-border/40"
                                  >
                                    <td className="px-3 py-1.5 font-medium text-foreground">
                                      {d.date}
                                    </td>
                                    <td className="px-3 py-1.5 text-right font-semibold">
                                      {d.distance.toFixed(2)}
                                    </td>
                                    <td
                                      className="px-3 py-1.5 text-muted-foreground truncate max-w-[220px]"
                                      title={d.startLocation}
                                    >
                                      {d.startLocation}
                                    </td>
                                    <td
                                      className={cn(
                                        "px-3 py-1.5 text-right font-medium",
                                        d.tempAvg < 0
                                          ? "text-cyan-600"
                                          : "text-amber-600",
                                      )}
                                    >
                                      {d.tempAvg.toFixed(2)}
                                    </td>
                                    <td className="px-3 py-1.5 text-right">
                                      {d.tempMin.toFixed(1)}
                                    </td>
                                    <td className="px-3 py-1.5 text-right">
                                      {d.tempMax.toFixed(1)}
                                    </td>
                                    <td className="px-2 py-1.5 text-center text-muted-foreground">
                                      {d.unit}
                                    </td>
                                    <td className="px-3 py-1.5 text-right text-muted-foreground">
                                      {d.humidityAvg.toFixed(1)}
                                    </td>
                                    <td className="px-3 py-1.5 text-right text-muted-foreground">
                                      {d.humidityMin.toFixed(1)}
                                    </td>
                                    <td className="px-3 py-1.5 text-right text-muted-foreground">
                                      {d.humidityMax.toFixed(1)}
                                    </td>
                                    <td
                                      className="px-3 py-1.5 text-muted-foreground truncate max-w-[220px]"
                                      title={d.endLocation}
                                    >
                                      {d.endLocation}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ReportConfigPanel
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        filters={filters}
        onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
        objectOptions={temperatureSummaryRows.map((r) => ({
          id: r.id,
          label: r.object,
          imei: "861234567890123",
          branch: "Gujarat",
        }))}
        onApply={() => {
          setConfigOpen(false);
          toast.success("Filters applied — temperature data updated");
        }}
        onExport={(format, scope) => handleExport(`${format} (${scope})`)}
      />

      <ScheduleDrawer
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
      />
      <ReportModals
        kind={modal}
        onClose={() => setModal(null)}
        columns={[
          { key: "object", label: "Object" },
          { key: "vehicleBrand", label: "Vehicle Brand" },
          { key: "vehicleModel", label: "Vehicle Model" },
          { key: "distance", label: "Distance" },
          { key: "startLocation", label: "Start Location" },
          { key: "tempAvg", label: "Temperature (Avg)" },
          { key: "tempMin", label: "Temperature (Min)" },
          { key: "tempMax", label: "Temperature (Max)" },
          { key: "endLocation", label: "End Location" },
        ]}
        hidden={[]}
        onToggleColumn={() => {}}
        chartType="Line"
        onChartType={(t) => toast.success(`${t} chart selected`)}
      />
    </div>
  );
}
