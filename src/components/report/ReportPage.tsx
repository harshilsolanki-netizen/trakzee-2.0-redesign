import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BarChart3,
  CalendarClock,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CornerDownLeft,
  Download,
  HelpCircle,
  Loader2,
  MoreVertical,
  Pin,
  Play,
  RefreshCw,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useLocation, useSearch } from "@tanstack/react-router";
import { FavoriteToggle } from "@/components/chrome/FavoritesMenu";
import { DriverJobSummaryReport } from "@/components/report/DriverJobSummaryReport";
import { ReportQuickFilterBar } from "@/components/report/ReportQuickFilterBar";
import {
  DEFAULT_FILTERS,
  ReportConfigPanel,
  type ExportFormat,
  type ExportScope,
  type ReportFilters,
} from "@/components/report/ReportConfigPanel";
import { ReportModals, type ModalKind } from "@/components/report/ReportModals";
import {
  ColumnConfigModal,
  DEFAULT_COLUMN_SETTINGS,
  type ColumnConfigItem,
  type ReportColumnSettings,
} from "@/components/report/ColumnConfigModal";
import {
  ChartConfigModal,
  DEFAULT_CHART_CONFIG,
  type ChartConfig,
} from "@/components/report/ChartConfigModal";
import { ProgressComparisonOverlay } from "@/components/report/ProgressComparisonOverlay";
import { ScheduleModal } from "@/components/report/ScheduleModal";
import { ExportPopover } from "@/components/report/ExportPopover";
import { TemperatureSummaryReport } from "@/components/report/TemperatureSummaryReport";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fleetObjects, travelRows, type TravelRow } from "@/data/fleet";
import { findReport, getVehiclesForBranches } from "@/data/reports";
import { dailyRowsFor, detailRowsFor, type DailyRow } from "@/data/travelDrill";
import { downloadReport } from "@/lib/export";
import { cn } from "@/lib/utils";

const SEARCHABLE_COLUMNS: { id: string; label: string }[] = [
  { id: "vehicleNo", label: "Vehicle No" },
  { id: "driver", label: "Driver" },
  { id: "company", label: "Company" },
  { id: "startLocation", label: "Start Location" },
  { id: "endLocation", label: "End Location" },
  { id: "distance", label: "Distance" },
  { id: "avgSpeed", label: "Avg Speed" },
  { id: "maxSpeed", label: "Max Speed" },
  { id: "tollCost", label: "Toll Cost" },
  { id: "alerts", label: "Alerts" },
];

const PAGE_SIZES = [10, 20, 50];

const DEFAULT_COLUMN_WIDTHS: Record<string, number> = {
  vehicleNo: 145,
  employeeNo: 130,
  imei: 135,
  startLocation: 170,
  startOdometer: 135,
  firstIgnitionOn: 140,
  distance: 110,
  idleVsInactive: 160,
  running: 145,
  idle: 135,
  stop: 135,
  inactive: 145,
  duration: 135,
  workDuration: 130,
  workingDays: 115,
  maxStoppage: 125,
  noOfIdle: 105,
  endOdometer: 135,
  lastIgnitionOff: 140,
  overSpeedTimes: 140,
  costDistance: 115,
  costDuration: 115,
  driver: 140,
  company: 140,
  endLocation: 170,
  avgSpeed: 100,
  maxSpeed: 100,
  tollCost: 105,
  alerts: 90,
};

const objectOptions = fleetObjects.map((o) => ({
  id: o.id,
  label: o.name,
  imei: o.imei,
  branch: o.branch,
}));

const LEVEL_TITLE = [
  "Travel Summary",
  "Travel Daily Summary",
  "Travel Detail",
] as const;

// Helper to convert "HH:MM:SS" to seconds
function parseDurationToSeconds(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 3) {
    return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
  }
  if (parts.length === 2) {
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  }
  return Number(timeStr) || 0;
}

// Helper to extract numeric value for chart metric
function getMetricValue(row: TravelRow, metricName: string): number {
  switch (metricName) {
    case "Running":
      return parseDurationToSeconds(row.running);
    case "Idle":
      return parseDurationToSeconds(row.idle);
    case "Stop":
      return parseDurationToSeconds(row.stop);
    case "Inactive":
      return parseDurationToSeconds("00:00:00");
    case "Duration":
      return parseDurationToSeconds("24:00:00");
    case "Work Duration":
      return parseDurationToSeconds("08:00:00");
    case "Distance":
      return row.distance;
    case "Max Speed":
      return row.maxSpeed;
    default:
      return parseDurationToSeconds(row.running);
  }
}

// Helper to format metric display string
function formatMetricDisplay(row: TravelRow, metricName: string): string {
  switch (metricName) {
    case "Running":
      return row.running;
    case "Idle":
      return row.idle;
    case "Stop":
      return row.stop;
    case "Inactive":
      return "00:00:00";
    case "Duration":
      return "24:00:00";
    case "Work Duration":
      return "08:00:00";
    case "Distance":
      return row.distance.toFixed(2) + " km";
    case "Max Speed":
      return row.maxSpeed + " km/h";
    default:
      return "-";
  }
}

export function ReportPage() {
  const search = useSearch({ strict: false }) as { type?: string };
  const searchType = search?.type || "travel";

  if (searchType === "temperature" || searchType === "temperature-summary") {
    return <TemperatureSummaryReport />;
  }

  if (searchType === "job" || searchType === "driver-job-summary") {
    return <DriverJobSummaryReport />;
  }

  const [configOpen, setConfigOpen] = useState(false);
  const [configTab, setConfigTab] = useState<"quick" | "advanced">("quick");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [modal, setModal] = useState<ModalKind>(null);
  const [filters, setFilters] = useState<ReportFilters>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(true);

  // Chart Comparison Configuration State (Synchronized with chart settings modal)
  const [chartConfig, setChartConfig] = useState<ChartConfig>(() => {
    try {
      const saved = localStorage.getItem("fleet-report-chart-config-v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.header && parsed?.xAxis && parsed?.yAxis) return parsed;
      }
    } catch {}
    return DEFAULT_CHART_CONFIG;
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "fleet-report-chart-config-v2",
        JSON.stringify(chartConfig),
      );
    } catch {}
  }, [chartConfig]);

  // Column Configuration state with persistence
  const [columnSettings, setColumnSettings] = useState<ReportColumnSettings>(
    () => {
      try {
        const saved = localStorage.getItem("fleet-report-columns-v3");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.columns?.length) return parsed;
        }
      } catch {}
      return DEFAULT_COLUMN_SETTINGS;
    },
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        "fleet-report-columns-v3",
        JSON.stringify(columnSettings),
      );
    } catch {}
  }, [columnSettings]);

  // Update comparison column label to match chartConfig.header dynamically
  const visibleColumns = useMemo(() => {
    return columnSettings.columns
      .filter((c) => !c.isGroupHeader && c.showable)
      .map((c) => {
        if (c.id === "idleVsInactive") {
          return { ...c, label: chartConfig.header };
        }
        return c;
      });
  }, [columnSettings.columns, chartConfig.header]);

  // Column resizing state with persistent storage
  const [colWidths, setColWidths] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("fleet-report-col-widths-v2");
      if (saved) return { ...DEFAULT_COLUMN_WIDTHS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_COLUMN_WIDTHS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "fleet-report-col-widths-v2",
        JSON.stringify(colWidths),
      );
    } catch {}
  }, [colWidths]);

  const [resizingCol, setResizingCol] = useState<string | null>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const resizingColRef = useRef<string | null>(null);

  const startResize = useCallback(
    (colId: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      resizingColRef.current = colId;
      setResizingCol(colId);
      startXRef.current = e.clientX;
      startWidthRef.current =
        colWidths[colId] || DEFAULT_COLUMN_WIDTHS[colId] || 110;

      const onMouseMove = (moveEvent: MouseEvent) => {
        if (!resizingColRef.current) return;
        const delta = moveEvent.clientX - startXRef.current;
        const newWidth = Math.max(60, startWidthRef.current + delta);
        setColWidths((prev) => ({
          ...prev,
          [resizingColRef.current!]: newWidth,
        }));
      };

      const onMouseUp = () => {
        resizingColRef.current = null;
        setResizingCol(null);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [colWidths],
  );

  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" }>({
    key: "distance",
    dir: "desc",
  });

  const toggleSort = (key: string) => {
    setSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === "asc" ? "desc" : "asc",
    }));
  };

  const [expanded, setExpanded] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [selectedSearchField, setSelectedSearchField] = useState<string>("ALL");
  const [pageSize, setPageSize] = useState(10);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [page, setPage] = useState(1);

  const selectedSearchFieldLabel = useMemo(() => {
    if (selectedSearchField === "ALL" || selectedSearchField === "all")
      return "All Fields";
    const found = visibleColumns.find((c) => c.id === selectedSearchField);
    return found ? found.label : "All Fields";
  }, [selectedSearchField, visibleColumns]);

  /* drill-down state */
  const [level, setLevel] = useState<0 | 1 | 2>(0);
  const [drillVehicle, setDrillVehicle] = useState<TravelRow | null>(null);
  const [drillDay, setDrillDay] = useState<DailyRow | null>(null);
  const history = useRef<{ level: 0 | 1 | 2 }[]>([]);

  const timer = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const patchFilters = useCallback(
    (patch: Partial<ReportFilters>) => setFilters((f) => ({ ...f, ...patch })),
    [],
  );

  const load = useCallback((message: string) => {
    setLoading(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setLoading(false);
      setLoaded(true);
      toast.success(message);
    }, 550);
  }, []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = travelRows.filter((r) => {
      // 1. Company Filter
      if (
        filters.companies &&
        filters.companies.length > 0 &&
        !filters.companies.includes("All")
      ) {
        if (!filters.companies.includes(r.company)) {
          return false;
        }
      }

      // 2. Branch Filter
      if (
        filters.branches &&
        filters.branches.length > 0 &&
        !filters.branches.includes("All")
      ) {
        const branchVehicles = getVehiclesForBranches(filters.branches).map(
          (v) => v.name,
        );
        if (!branchVehicles.includes(r.vehicleNo)) {
          return false;
        }
      }

      // 3. Object / Vehicle Filter
      if (
        filters.objects &&
        filters.objects.length > 0 &&
        !filters.objects.includes("All")
      ) {
        if (!filters.objects.includes(r.vehicleNo)) {
          return false;
        }
      }

      if (q === "") return true;
      if (selectedSearchField !== "ALL" && selectedSearchField !== "all") {
        const val = (r as any)[selectedSearchField];
        return (
          val !== undefined &&
          val !== null &&
          String(val).toLowerCase().includes(q)
        );
      }
      return visibleColumns.some((col) => {
        const val = (r as any)[col.id];
        return (
          val !== undefined &&
          val !== null &&
          String(val).toLowerCase().includes(q)
        );
      });
    });

    return [...list].sort((a, b) => {
      const activeSortKey = sort.key;
      const dir = sort.dir === "asc" ? 1 : -1;
      const av = (a as any)[activeSortKey] ?? 0;
      const bv = (b as any)[activeSortKey] ?? 0;
      if (typeof av === "number" && typeof bv === "number") {
        return (av - bv) * dir;
      }
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [
    query,
    selectedSearchField,
    sort,
    filters.companies,
    filters.branches,
    filters.objects,
    visibleColumns,
  ]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = useMemo(
    () => rows.slice((page - 1) * pageSize, page * pageSize),
    [rows, page, pageSize],
  );

  // Summary Totals Calculation for the Top Summary Row (matching Image 3 reference)
  const summaryTotals = useMemo(() => {
    const totalDist = rows.reduce((acc, r) => acc + r.distance, 0);
    const totalRunningSec = rows.reduce(
      (acc, r) => acc + parseDurationToSeconds(r.running),
      0,
    );
    const totalIdleSec = rows.reduce(
      (acc, r) => acc + parseDurationToSeconds(r.idle),
      0,
    );
    const totalStopSec = rows.reduce(
      (acc, r) => acc + parseDurationToSeconds(r.stop),
      0,
    );
    const totalInactiveSec = 79 * 3600 + 40 * 60 + 30; // 79:40:30
    const totalAlerts = rows.reduce((acc, r) => acc + r.alerts, 0);

    const formatSec = (s: number) => {
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sc = s % 60;
      return (
        String(h).padStart(2, "0") +
        ":" +
        String(m).padStart(2, "0") +
        ":" +
        String(sc).padStart(2, "0")
      );
    };

    return {
      distance: totalDist.toFixed(2),
      running: formatSec(totalRunningSec),
      idle: formatSec(totalIdleSec),
      stop: formatSec(totalStopSec),
      inactive: formatSec(totalInactiveSec),
      duration: "85:40",
      workingDays: "11.0",
      maxStoppage: "09:16:0",
      noOfIdle: "358.0",
      alerts: totalAlerts,
    };
  }, [rows]);

  const drillToDaily = (r: TravelRow) => {
    history.current.push({ level });
    setDrillVehicle(r);
    setLevel(1);
    toast.info("Daily summary for " + r.vehicleNo, {
      description: r.driver + " · " + r.company,
    });
  };

  const drillToDetail = (d: DailyRow) => {
    history.current.push({ level });
    setDrillDay(d);
    setLevel(2);
    toast.info("Travel detail for " + d.date, {
      description: (drillVehicle?.vehicleNo ?? "") + " · " + d.driver,
    });
  };

  const goBack = () => {
    const prev = history.current.pop();
    if (!prev) {
      setLevel(0);
      setDrillVehicle(null);
      setDrillDay(null);
      return;
    }
    setLevel(prev.level);
    if (prev.level === 0) setDrillVehicle(null);
    if (prev.level <= 1) setDrillDay(null);
  };

  const resetToRoot = () => {
    history.current = [];
    setLevel(0);
    setDrillVehicle(null);
    setDrillDay(null);
  };

  const dailyRows: DailyRow[] = useMemo(
    () => (drillVehicle ? dailyRowsFor(drillVehicle) : []),
    [drillVehicle],
  );

  const detailRows = useMemo(
    () =>
      drillVehicle && drillDay ? detailRowsFor(drillVehicle, drillDay) : [],
    [drillVehicle, drillDay],
  );

  const reportMeta =
    findReport(searchType) ||
    findReport("today-activity") ||
    findReport("travel");

  const handleExport = (
    format: ExportFormat,
    exportScope: ExportScope,
    excelMode: "single" | "multiple" = "multiple",
    extraMsg = "",
  ) => {
    const printableColNames = columnSettings.columns
      .filter((c) => !c.isGroupHeader && c.printable)
      .map((c) => c.label);

    const currentTitle =
      level === 0
        ? reportMeta?.name || "Today Activity"
        : level === 1
          ? "Travel Daily Summary"
          : "Travel Detail";

    downloadReport(rows, format, exportScope);
    toast.success(
      currentTitle +
        " exported as " +
        format +
        " (" +
        (exportScope === "detail" ? "Detail Report" : "Summary Report") +
        ")" +
        (extraMsg ? " — " + extraMsg : ""),
      {
        description:
          printableColNames.length +
          " printable columns · " +
          (excelMode === "multiple" ? "Multiple Sheets" : "Single Sheet"),
      },
    );
  };

  const first = rows.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, rows.length);
  const frozenCount = columnSettings.frozenColumnsCount ?? 0;
  const getStickyLeftOffset = useCallback(
    (colIdx: number) => {
      let offset = 36; // '#' column fixed width
      for (let i = 0; i < colIdx; i++) {
        const prevCol = visibleColumns[i];
        if (prevCol) {
          offset +=
            colWidths[prevCol.id] || DEFAULT_COLUMN_WIDTHS[prevCol.id] || 110;
        }
      }
      return offset + "px";
    },
    [visibleColumns, colWidths],
  );

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-3 p-3 overflow-hidden">
      {/* Top Header & Sub-Header Frame with minimal subtle slate tint */}
      <header className="h-[76px] flex flex-col justify-between rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 px-4 py-2 shadow-2xs shrink-0 select-none backdrop-blur-xs">
        {/* Row 1: Title on left, Utilities + Search + Download on right */}
        <div className="flex items-center justify-between gap-3 min-w-0 h-7">
          {/* Left: Star + Report Title / Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs shrink-0"
          >
            {level > 0 ? (
              <button
                type="button"
                onClick={goBack}
                aria-label="Back to previous level"
                className="inline-flex h-6 w-6 items-center justify-center rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer mr-0.5"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : null}

            {/* Favorite toggle ahead of the title - Only on level 0 */}
            {level === 0 && (
              <FavoriteToggle
                reportId={searchType || "today-activity"}
                className="-ml-1 mr-0.5"
              />
            )}

            {level === 0 ? (
              <span className="text-base font-bold text-foreground leading-tight tracking-tight">
                {reportMeta?.name || "Today Activity"}
              </span>
            ) : level === 1 ? (
              <>
                <button
                  type="button"
                  onClick={resetToRoot}
                  className="text-base font-bold text-foreground transition-colors hover:text-brand hover:underline cursor-pointer leading-tight tracking-tight"
                >
                  Travel Daily Summary
                </button>
                {drillVehicle ? (
                  <>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    <span className="text-xs font-semibold text-foreground">
                      {drillVehicle.vehicleNo} ({drillVehicle.driver})
                    </span>
                  </>
                ) : null}
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={resetToRoot}
                  className="text-base font-bold text-foreground transition-colors hover:text-brand hover:underline cursor-pointer leading-tight tracking-tight"
                >
                  Travel Detail
                </button>
                {drillVehicle ? (
                  <>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    <button
                      type="button"
                      onClick={() => {
                        history.current.push({ level: 1 });
                        setLevel(1);
                        setDrillDay(null);
                      }}
                      className="text-xs font-semibold text-foreground transition-colors hover:text-brand hover:underline cursor-pointer"
                    >
                      {drillVehicle.vehicleNo}
                    </button>
                  </>
                ) : null}
                {drillDay ? (
                  <>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    <span className="text-xs font-semibold text-foreground">
                      {drillDay.date}
                    </span>
                  </>
                ) : null}
              </>
            )}
          </nav>

          {/* Right: Field Search, Download, Utilities Icons */}
          {/* Right: Search, Utilities Icons, Download, and Pagination Controls (Kept upside on Row 1) */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            {/* 1. Integrated Field-Specific Search Control */}
            <div className="relative flex h-7 items-center rounded-md border border-border/80 bg-background shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all overflow-hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    title="Select specific column to search"
                    className="flex h-full items-center gap-1 border-r border-border/60 bg-muted/30 px-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0 select-none"
                  >
                    <span className="max-w-[76px] truncate">
                      {selectedSearchField === "ALL" ||
                      selectedSearchField === "all"
                        ? "All"
                        : selectedSearchFieldLabel}
                    </span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="max-h-64 w-52 overflow-y-auto text-xs p-1 rounded-lg border border-border/80 bg-popover/98 backdrop-blur-xl shadow-lg z-50 select-none"
                >
                  <DropdownMenuItem
                    onClick={() => setSelectedSearchField("ALL")}
                    className={cn(
                      "cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors select-none",
                      selectedSearchField === "ALL" ||
                        selectedSearchField === "all"
                        ? "bg-[#0089FF]/10 text-[#0089FF] font-bold hover:bg-[#0089FF]/15"
                        : "text-foreground hover:bg-muted/80 hover:text-foreground font-medium",
                    )}
                  >
                    <span>All Fields</span>
                    {(selectedSearchField === "ALL" ||
                      selectedSearchField === "all") && (
                      <Check className="h-3.5 w-3.5 text-[#0089FF]" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 -mx-1" />
                  {visibleColumns.map((c) => {
                    const isSelected = selectedSearchField === c.id;
                    return (
                      <DropdownMenuItem
                        key={c.id}
                        onClick={() => setSelectedSearchField(c.id)}
                        className={cn(
                          "cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors select-none",
                          isSelected
                            ? "bg-[#0089FF]/10 text-[#0089FF] font-bold hover:bg-[#0089FF]/15"
                            : "text-foreground hover:bg-muted/80 hover:text-foreground font-medium",
                        )}
                      >
                        <span className="truncate">{c.label}</span>
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-[#0089FF] shrink-0" />
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              <Search className="ml-2 h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  selectedSearchField === "ALL" || selectedSearchField === "all"
                    ? "Search in all fields..."
                    : `Search ${selectedSearchFieldLabel}...`
                }
                className="h-full w-36 sm:w-44 bg-transparent px-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="mr-1.5 rounded-full p-0.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* 2. Export / Download Menu */}
            <ExportPopover onSelect={(f, s, m) => handleExport(f, s, m)} />

            {/* 3. Quick Action Utility Icons */}
            <div className="flex items-center gap-1">
              <IconButton
                label="Schedule report"
                onClick={() => setScheduleOpen(true)}
              >
                <CalendarClock className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton
                label="Column Settings"
                onClick={() => setModal("columns")}
              >
                <Settings className="h-3.5 w-3.5" />
              </IconButton>
            </div>

            {/* Vertical Divider */}
            <div className="h-4 w-px bg-border/80 mx-0.5 shrink-0" />

            {/* 4. Page Size & Pagination Controls (Upside on Row 1) */}
            <Popover open={pageSizeOpen} onOpenChange={setPageSizeOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label="Rows per page"
                  className={cn(
                    "h-7 inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-background px-2 text-xs font-semibold text-foreground cursor-pointer shadow-2xs transition-all select-none hover:bg-muted hover:border-[#0089FF]/50 active:scale-98",
                    pageSizeOpen &&
                      "bg-muted border-[#0089FF]/50 ring-2 ring-[#0089FF]/20",
                  )}
                >
                  <span>{pageSize} / page</span>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 opacity-60 ml-0.5 transition-transform",
                      pageSizeOpen && "rotate-180",
                    )}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                sideOffset={6}
                className="w-28 p-1 rounded-lg border border-border/80 bg-popover/98 backdrop-blur-xl shadow-lg select-none animate-in fade-in-0 zoom-in-95"
              >
                {PAGE_SIZES.map((s) => {
                  const isActive = pageSize === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setPageSize(s);
                        setPage(1);
                        setPageSizeOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between px-2.5 py-1.5 text-xs rounded-sm cursor-pointer transition-colors text-left select-none",
                        isActive
                          ? "bg-[#0089FF]/10 text-[#0089FF] font-bold hover:bg-[#0089FF]/15"
                          : "text-foreground hover:bg-muted/80 hover:text-foreground font-medium",
                      )}
                    >
                      <span>{s} / page</span>
                      {isActive && (
                        <Check className="h-3.5 w-3.5 text-[#0089FF]" />
                      )}
                    </button>
                  );
                })}
              </PopoverContent>
            </Popover>

            {/* Page counter & Navigation */}
            <div className="flex items-center gap-1">
              <span className="px-1 text-xs font-semibold tabular-nums text-muted-foreground whitespace-nowrap">
                {first}–{last} of {rows.length}
              </span>
              <IconButton
                label="Previous page"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={level !== 0 || page === 1}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton
                label="Next page"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={level !== 0 || page >= totalPages}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton
                label="Refresh data"
                onClick={() => load("Report refreshed")}
                disabled={loading}
              >
                <RefreshCw
                  className={cn("h-3.5 w-3.5", loading && "animate-spin")}
                />
              </IconButton>
            </div>
          </div>
        </div>

        {/* Row 2: Sub-Header Quick Filter Bar */}
        <div className="flex items-center justify-between gap-3 min-w-0 h-7">
          <div className="flex items-center min-w-0 flex-1 overflow-x-auto scrollbar-none">
            <ReportQuickFilterBar
              filters={filters}
              onChange={(patch) => {
                setFilters((prev) => ({ ...prev, ...patch }));
                load("Filters updated");
              }}
              onOpenFilterDrawer={() => setConfigOpen(true)}
            />
          </div>
        </div>
      </header>

      {/* Main Table Area with Modern Design */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
        <div className="min-h-0 flex-1 overflow-auto overscroll-contain scroll-smooth">
          {level === 0 ? (
            <table className="w-full min-w-[1000px] text-xs border-collapse">
              <thead className="sticky top-0 z-20 shadow-xs">
                {/* Column Titles Header Row */}
                <tr className="bg-slate-900 text-slate-100 dark:bg-slate-950 font-semibold tracking-wider text-[11px] uppercase border-b border-white/10">
                  <th
                    scope="col"
                    className="sticky left-0 z-30 w-9 min-w-[36px] max-w-[36px] bg-slate-900 dark:bg-slate-950 border-r border-white/10 px-2 py-2.5 text-center shadow-xs text-slate-400 font-bold"
                  >
                    #
                  </th>
                  {visibleColumns.map((c, colIdx) => {
                    const isFrozen = colIdx < frozenCount;
                    const leftOffset = isFrozen
                      ? getStickyLeftOffset(colIdx)
                      : undefined;
                    const w =
                      colWidths[c.id] || DEFAULT_COLUMN_WIDTHS[c.id] || 110;

                    if (c.id === "idleVsInactive") {
                      return (
                        <th
                          key={c.id}
                          scope="col"
                          style={{
                            width: w + "px",
                            minWidth: w + "px",
                            maxWidth: w + "px",
                            left: leftOffset,
                          }}
                          className={cn(
                            "group relative border-r border-white/10 px-1.5 py-1 font-medium last:border-r-0 overflow-visible whitespace-nowrap select-none text-center",
                            isFrozen &&
                              cn(
                                "sticky z-30 bg-slate-900 dark:bg-slate-950",
                                colIdx === frozenCount - 1 &&
                                  "shadow-[2px_0_4px_rgba(0,0,0,0.2)]",
                              ),
                          )}
                        >
                          <div className="flex items-center justify-center w-full">
                            <ProgressComparisonOverlay
                              config={chartConfig}
                              onSave={setChartConfig}
                            />
                          </div>

                          {/* Interactive Drag Resizer Handle matching Jira/Modern tables */}
                          <div
                            role="separator"
                            onMouseDown={(e) => startResize(c.id, e)}
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                              "absolute right-0 top-0 bottom-0 w-2.5 cursor-col-resize z-40 transition-colors",
                              "hover:bg-blue-400/80 active:bg-blue-500",
                              resizingCol === c.id && "bg-blue-400",
                            )}
                            title="Drag to resize column"
                          />
                        </th>
                      );
                    }

                    return (
                      <th
                        key={c.id}
                        scope="col"
                        style={{
                          width: w + "px",
                          minWidth: w + "px",
                          maxWidth: w + "px",
                          left: leftOffset,
                        }}
                        onClick={() => {
                          if (c.sortable) {
                            toggleSort(c.id);
                          }
                        }}
                        title={c.label}
                        className={cn(
                          "group relative border-r border-white/10 px-2.5 py-2 font-medium last:border-r-0 overflow-hidden text-ellipsis whitespace-nowrap select-none",
                          c.numeric ? "text-right" : "text-left",
                          c.sortable && "cursor-pointer hover:bg-white/10",
                          sort.key === c.id &&
                            "bg-white/15 font-semibold text-white",
                          isFrozen &&
                            cn(
                              "sticky z-30 bg-slate-900 dark:bg-slate-950",
                              colIdx === frozenCount - 1 &&
                                "shadow-[2px_0_4px_rgba(0,0,0,0.2)]",
                            ),
                        )}
                      >
                        <div
                          className={cn(
                            "flex items-center gap-1 overflow-hidden",
                            c.numeric
                              ? "justify-end flex-row-reverse"
                              : "justify-start",
                          )}
                        >
                          <span className="truncate">{c.label}</span>
                          {isFrozen && (
                            <Pin
                              className="h-3 w-3 fill-blue-400 text-blue-400 shrink-0"
                              title="Pinned column on left"
                            />
                          )}
                          {c.sortable &&
                            (sort.key === c.id ? (
                              sort.dir === "asc" ? (
                                <ArrowUp className="h-3 w-3 text-blue-400 shrink-0" />
                              ) : (
                                <ArrowDown className="h-3 w-3 text-blue-400 shrink-0" />
                              )
                            ) : (
                              <span className="opacity-0 group-hover:opacity-40 shrink-0">
                                •
                              </span>
                            ))}
                        </div>

                        {/* Interactive Drag Resizer Handle matching Jira/Modern tables */}
                        <div
                          role="separator"
                          onMouseDown={(e) => startResize(c.id, e)}
                          onClick={(e) => e.stopPropagation()}
                          className={cn(
                            "absolute right-0 top-0 bottom-0 w-2.5 cursor-col-resize z-40 transition-colors",
                            "hover:bg-blue-400/80 active:bg-blue-500",
                            resizingCol === c.id && "bg-blue-400",
                          )}
                          title="Drag to resize column"
                        />
                      </th>
                    );
                  })}
                </tr>

                {/* Overall Totals / Summary Row */}
                <tr className="bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-foreground border-b border-border">
                  <td className="sticky left-0 z-20 w-9 min-w-[36px] max-w-[36px] bg-slate-100 dark:bg-slate-800 border-r border-border px-2 py-1.5 text-center text-muted-foreground">
                    ∑
                  </td>
                  {visibleColumns.map((col, colIdx) => {
                    const isFrozen = colIdx < frozenCount;
                    const leftOffset = isFrozen
                      ? getStickyLeftOffset(colIdx)
                      : undefined;
                    const w =
                      colWidths[col.id] || DEFAULT_COLUMN_WIDTHS[col.id] || 110;

                    const frozenSummaryClass = isFrozen
                      ? cn(
                          "sticky z-20 bg-slate-100 dark:bg-slate-800 shadow-xs",
                          colIdx === frozenCount - 1 &&
                            "shadow-[2px_0_4px_rgba(0,0,0,0.08)]",
                        )
                      : "";

                    const commonProps = {
                      style: {
                        width: w + "px",
                        minWidth: w + "px",
                        maxWidth: w + "px",
                        left: leftOffset,
                      },
                    };

                    switch (col.id) {
                      case "distance":
                        return (
                          <td
                            key={col.id}
                            {...commonProps}
                            className={cn(
                              "px-2.5 py-1.5 text-right tabular-nums truncate text-blue-600 dark:text-blue-400",
                              frozenSummaryClass,
                            )}
                            title={summaryTotals.distance}
                          >
                            {summaryTotals.distance}
                          </td>
                        );
                      case "idleVsInactive":
                        return (
                          <td
                            key={col.id}
                            {...commonProps}
                            className={cn(
                              "px-2.5 py-1.5 truncate",
                              frozenSummaryClass,
                            )}
                          >
                            <div
                              className="flex items-center justify-center w-full min-w-[60px] max-w-[120px] mx-auto py-1"
                              title="Summary Overall Proportion"
                            >
                              <div className="h-1.5 w-full bg-slate-300 dark:bg-slate-600 rounded-full overflow-hidden flex shadow-2xs">
                                <div
                                  style={{ width: "75%" }}
                                  className="bg-emerald-500 h-full"
                                />
                                <div
                                  style={{ width: "25%" }}
                                  className="bg-amber-500 h-full"
                                />
                              </div>
                            </div>
                          </td>
                        );
                      case "running":
                        return (
                          <td
                            key={col.id}
                            {...commonProps}
                            className={cn(
                              "px-2.5 py-1.5 truncate text-emerald-600 dark:text-emerald-400",
                              frozenSummaryClass,
                            )}
                            title={summaryTotals.running}
                          >
                            {summaryTotals.running}
                          </td>
                        );
                      case "idle":
                        return (
                          <td
                            key={col.id}
                            {...commonProps}
                            className={cn(
                              "px-2.5 py-1.5 truncate text-amber-600 dark:text-amber-400",
                              frozenSummaryClass,
                            )}
                            title={summaryTotals.idle}
                          >
                            {summaryTotals.idle}
                          </td>
                        );
                      case "stop":
                        return (
                          <td
                            key={col.id}
                            {...commonProps}
                            className={cn(
                              "px-2.5 py-1.5 truncate text-rose-600 dark:text-rose-400",
                              frozenSummaryClass,
                            )}
                            title={summaryTotals.stop}
                          >
                            {summaryTotals.stop}
                          </td>
                        );
                      case "inactive":
                        return (
                          <td
                            key={col.id}
                            {...commonProps}
                            className={cn(
                              "px-2.5 py-1.5 truncate text-muted-foreground",
                              frozenSummaryClass,
                            )}
                            title={summaryTotals.inactive}
                          >
                            {summaryTotals.inactive}
                          </td>
                        );
                      case "duration":
                        return (
                          <td
                            key={col.id}
                            {...commonProps}
                            className={cn(
                              "px-2.5 py-1.5 truncate",
                              frozenSummaryClass,
                            )}
                            title={summaryTotals.duration}
                          >
                            {summaryTotals.duration}
                          </td>
                        );
                      case "workingDays":
                        return (
                          <td
                            key={col.id}
                            {...commonProps}
                            className={cn(
                              "px-2.5 py-1.5 text-center truncate",
                              frozenSummaryClass,
                            )}
                            title={summaryTotals.workingDays}
                          >
                            {summaryTotals.workingDays}
                          </td>
                        );
                      case "maxStoppage":
                        return (
                          <td
                            key={col.id}
                            {...commonProps}
                            className={cn(
                              "px-2.5 py-1.5 truncate",
                              frozenSummaryClass,
                            )}
                            title={summaryTotals.maxStoppage}
                          >
                            {summaryTotals.maxStoppage}
                          </td>
                        );
                      case "noOfIdle":
                        return (
                          <td
                            key={col.id}
                            {...commonProps}
                            className={cn(
                              "px-2.5 py-1.5 text-right tabular-nums truncate",
                              frozenSummaryClass,
                            )}
                            title={summaryTotals.noOfIdle}
                          >
                            {summaryTotals.noOfIdle}
                          </td>
                        );
                      case "alerts":
                        return (
                          <td
                            key={col.id}
                            {...commonProps}
                            className={cn(
                              "px-2.5 py-1.5 text-right tabular-nums truncate",
                              frozenSummaryClass,
                            )}
                            title={String(summaryTotals.alerts)}
                          >
                            {summaryTotals.alerts}
                          </td>
                        );
                      default:
                        return (
                          <td
                            key={col.id}
                            {...commonProps}
                            className={cn(
                              "px-2.5 py-1.5 text-muted-foreground/40 truncate",
                              frozenSummaryClass,
                            )}
                          >
                            -
                          </td>
                        );
                    }
                  })}
                </tr>
              </thead>
              <tbody>
                {!loaded && !loading ? (
                  <tr>
                    <td
                      colSpan={visibleColumns.length + 1}
                      className="px-3 py-16 text-center text-xs text-muted-foreground"
                    >
                      No records loaded. Open the Filter panel and press “Apply
                      Filter”.
                    </td>
                  </tr>
                ) : (
                  pageRows.map((r, index) => (
                    <ReportRow
                      key={r.id}
                      row={r}
                      rowIndex={(page - 1) * pageSize + index + 1}
                      columns={visibleColumns}
                      colSpan={visibleColumns.length + 1}
                      frozenCount={frozenCount}
                      chartConfig={chartConfig}
                      colWidths={colWidths}
                      getStickyLeftOffset={getStickyLeftOffset}
                      open={expanded.includes(r.id)}
                      onToggle={() =>
                        setExpanded((e) =>
                          e.includes(r.id)
                            ? e.filter((x) => x !== r.id)
                            : [...e, r.id],
                        )
                      }
                      onDrill={() => drillToDaily(r)}
                    />
                  ))
                )}
                {loaded && !loading && rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={visibleColumns.length + 1}
                      className="px-3 py-12 text-center text-muted-foreground"
                    >
                      No vehicles match your search.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          ) : level === 1 ? (
            <SimpleTable
              headers={[
                "Date",
                "Day",
                "Driver",
                "Start Location",
                "Distance",
                "Running",
                "Stop",
                "Idle",
                "Max Speed",
                "Alerts",
              ]}
              numeric={[4, 8, 9]}
              rows={dailyRows.map((d) => ({
                key: d.id,
                onDoubleClick: () => drillToDetail(d),
                cells: [
                  d.date,
                  d.day,
                  d.driver,
                  d.startLocation,
                  d.distance.toFixed(2),
                  d.running,
                  d.stop,
                  d.idle,
                  d.maxSpeed,
                  d.alerts,
                ],
              }))}
              hint="Double-click a day to open Travel Detail"
            />
          ) : (
            <SimpleTable
              headers={[
                "Date",
                "Time",
                "IGN",
                "Location",
                "Speed",
                "Distance",
                "Latitude",
                "Longitude",
              ]}
              numeric={[4, 5, 6, 7]}
              rows={detailRows.map((p) => ({
                key: p.id,
                cells: [
                  p.date,
                  p.time,
                  p.ignition,
                  p.location,
                  p.speed,
                  p.distance.toFixed(2),
                  p.latitude,
                  p.longitude,
                ],
              }))}
            />
          )}
        </div>

        {loading ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-surface/70 backdrop-blur-[1px]">
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading report…
            </span>
          </div>
        ) : null}
      </div>

      <ReportConfigPanel
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        filters={filters}
        onChange={patchFilters}
        objectOptions={objectOptions}
        onApply={() => {
          setConfigOpen(false);
          setPage(1);
          resetToRoot();
          load("Filters applied — report loaded");
        }}
        onExport={(format, exportScope) =>
          handleExport(format, exportScope, "downloaded without loading")
        }
      />

      <ScheduleModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
      />

      <ReportModals
        kind={modal}
        onClose={() => setModal(null)}
        columnSettings={columnSettings}
        onSaveColumnSettings={setColumnSettings}
        chartConfig={chartConfig}
        onSaveChartConfig={setChartConfig}
      />
    </div>
  );
}

function SimpleTable({
  headers,
  rows,
  numeric = [],
  hint,
}: {
  headers: string[];
  rows: {
    key: string;
    cells: (string | number)[];
    onDoubleClick?: () => void;
  }[];
  numeric?: number[];
  hint?: string;
}) {
  return (
    <table className="w-full min-w-[900px] text-xs">
      <thead className="sticky top-0 z-10">
        <tr className="bg-nav text-nav-foreground">
          {headers.map((h, i) => (
            <th
              key={h}
              scope="col"
              className={cn(
                "border-r border-white/10 px-2.5 py-2 font-medium last:border-r-0",
                numeric.includes(i) ? "text-right" : "text-left",
              )}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr
            key={r.key}
            onDoubleClick={r.onDoubleClick}
            className={cn(
              "border-b border-border transition-colors duration-150 hover:bg-muted",
              r.onDoubleClick && "cursor-pointer",
            )}
          >
            {r.cells.map((c, i) => (
              <td
                key={r.key + "-" + i}
                className={cn(
                  "px-2.5 py-1.5",
                  numeric.includes(i) && "text-right tabular-nums",
                )}
              >
                {c}
              </td>
            ))}
          </tr>
        ))}
        {hint ? (
          <tr>
            <td
              colSpan={headers.length}
              className="px-2.5 py-2 text-[11px] text-muted-foreground"
            >
              {hint}
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          onClick={onClick}
          disabled={disabled}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border/80 bg-background text-muted-foreground transition-all duration-150 hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer shadow-2xs active:scale-95"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function ReportRow({
  row,
  rowIndex,
  open,
  onToggle,
  onDrill,
  columns,
  colSpan,
  frozenCount = 0,
  chartConfig,
  colWidths,
  getStickyLeftOffset,
}: {
  row: TravelRow;
  rowIndex: number;
  open: boolean;
  onToggle: () => void;
  onDrill: () => void;
  columns: ColumnConfigItem[];
  colSpan: number;
  frozenCount?: number;
  chartConfig: ChartConfig;
  colWidths: Record<string, number>;
  getStickyLeftOffset: (idx: number) => string;
}) {
  const rowIdNum =
    parseInt(String(row.id).replace(/\D/g, "") || String(rowIndex), 10) ||
    rowIndex ||
    1;
  const employeeNo = "EMP-" + (1000 + rowIdNum);
  const imeiNo = "8610" + String(10000000 + rowIdNum * 987654).slice(0, 8);
  const startOdometer = (124000 + rowIdNum * 520).toLocaleString();
  const endOdometer = (
    124000 +
    rowIdNum * 520 +
    Math.round(row.distance)
  ).toLocaleString();
  const firstIgnitionOn = row.trips[0]?.firstIgnitionOn || "07:15 AM";
  const lastIgnitionOff =
    row.trips[row.trips.length - 1]?.lastIgnitionOn || "08:45 PM";
  const noOfIdle = Math.max(1, Math.round(row.alerts * 1.5));
  const overSpeedTimes = row.alerts > 3 ? "2 times" : "0 times";
  const costDistance = "₹" + (row.tollCost * 3).toLocaleString();
  const costDuration = "₹" + (row.tollCost * 2).toLocaleString();

  const cellFor = (col: ColumnConfigItem, colIdx: number) => {
    const isFrozen = colIdx < frozenCount;
    const leftOffset = isFrozen ? getStickyLeftOffset(colIdx) : undefined;
    const w = colWidths[col.id] || DEFAULT_COLUMN_WIDTHS[col.id] || 110;

    const frozenClass = isFrozen
      ? cn(
          "sticky z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/90 shadow-xs",
          colIdx === frozenCount - 1 && "shadow-[2px_0_4px_rgba(0,0,0,0.08)]",
        )
      : "";

    const cellStyle = {
      width: w + "px",
      minWidth: w + "px",
      maxWidth: w + "px",
      left: leftOffset,
    };

    switch (col.id) {
      case "vehicleNo":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn("px-2.5 py-1.5 truncate", frozenClass)}
            title={row.vehicleNo}
          >
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] font-bold tracking-wider text-foreground shadow-2xs">
              <Car className="h-3 w-3 text-blue-500 shrink-0" />
              <span>{row.vehicleNo}</span>
            </div>
          </td>
        );
      case "employeeNo":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 text-muted-foreground font-mono text-xs truncate",
              frozenClass,
            )}
            title={employeeNo}
          >
            {employeeNo}
          </td>
        );
      case "imei":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 text-muted-foreground font-mono text-[11px] tracking-wide truncate",
              frozenClass,
            )}
            title={imeiNo}
          >
            {imeiNo}
          </td>
        );
      case "startLocation":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 font-medium text-foreground truncate",
              frozenClass,
            )}
            title={row.startLocation}
          >
            {row.startLocation}
          </td>
        );
      case "startOdometer":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 text-right font-mono text-xs tabular-nums text-foreground truncate",
              frozenClass,
            )}
            title={startOdometer}
          >
            {startOdometer}
          </td>
        );
      case "firstIgnitionOn":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 text-muted-foreground font-mono text-[11px] truncate",
              frozenClass,
            )}
            title={firstIgnitionOn}
          >
            {firstIgnitionOn}
          </td>
        );
      case "distance":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 text-right font-mono text-xs font-bold text-blue-600 dark:text-blue-400 tabular-nums truncate",
              frozenClass,
            )}
            title={row.distance.toFixed(2)}
          >
            {row.distance.toFixed(2)}
          </td>
        );
      case "idleVsInactive": {
        const xVal = getMetricValue(row, chartConfig.xAxis);
        const yVal = getMetricValue(row, chartConfig.yAxis);
        const total = xVal + yVal;
        const xPct = total > 0 ? (xVal / total) * 100 : 50;
        const yPct = total > 0 ? (yVal / total) * 100 : 50;
        const xDisp = formatMetricDisplay(row, chartConfig.xAxis);
        const yDisp = formatMetricDisplay(row, chartConfig.yAxis);

        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn("px-2.5 py-1.5 truncate", frozenClass)}
          >
            <div
              className="flex items-center justify-center w-full min-w-[60px] max-w-[120px] mx-auto py-1"
              title={
                chartConfig.xAxis +
                ": " +
                xDisp +
                " (" +
                xPct.toFixed(0) +
                "%) | " +
                chartConfig.yAxis +
                ": " +
                yDisp +
                " (" +
                yPct.toFixed(0) +
                "%)"
              }
            >
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex shadow-2xs">
                <div
                  style={{ width: xPct + "%" }}
                  className="bg-emerald-500 h-full transition-all duration-300"
                />
                <div
                  style={{ width: yPct + "%" }}
                  className="bg-amber-500 h-full transition-all duration-300"
                />
              </div>
            </div>
          </td>
        );
      }
      case "running":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 truncate",
              frozenClass,
            )}
            title={row.running}
          >
            {row.running}
          </td>
        );
      case "idle":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 font-mono text-xs font-medium text-amber-600 dark:text-amber-400 truncate",
              frozenClass,
            )}
            title={row.idle}
          >
            {row.idle}
          </td>
        );
      case "stop":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 font-mono text-xs font-medium text-rose-600 dark:text-rose-400 truncate",
              frozenClass,
            )}
            title={row.stop}
          >
            {row.stop}
          </td>
        );
      case "inactive":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 truncate text-muted-foreground",
              frozenClass,
            )}
            title="00:00:00"
          >
            00:00:00
          </td>
        );
      case "duration":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 truncate text-muted-foreground",
              frozenClass,
            )}
            title="24:00:00"
          >
            24:00:00
          </td>
        );
      case "workDuration":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 truncate text-muted-foreground",
              frozenClass,
            )}
            title="08:00:00"
          >
            08:00:00
          </td>
        );
      case "workingDays":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn("px-2.5 py-1.5 text-center truncate", frozenClass)}
            title="1"
          >
            1
          </td>
        );
      case "maxStoppage":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 truncate text-muted-foreground",
              frozenClass,
            )}
            title="04:15:00"
          >
            04:15:00
          </td>
        );
      case "noOfIdle":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 text-right tabular-nums truncate",
              frozenClass,
            )}
            title={String(noOfIdle)}
          >
            {noOfIdle}
          </td>
        );
      case "avgSpeed":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 text-right tabular-nums truncate",
              frozenClass,
            )}
            title={row.avgSpeed + " km/h"}
          >
            {row.avgSpeed}
          </td>
        );
      case "maxSpeed":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 text-right tabular-nums font-medium truncate",
              frozenClass,
            )}
            title={row.maxSpeed + " km/h"}
          >
            {row.maxSpeed}
          </td>
        );
      case "costDistance":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 text-right tabular-nums truncate font-medium",
              frozenClass,
            )}
            title={costDistance}
          >
            {costDistance}
          </td>
        );
      case "costDuration":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 text-right tabular-nums truncate font-medium",
              frozenClass,
            )}
            title={costDuration}
          >
            {costDuration}
          </td>
        );
      case "overSpeed":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 text-center truncate text-muted-foreground",
              frozenClass,
            )}
            title={overSpeedTimes}
          >
            {overSpeedTimes}
          </td>
        );
      case "alerts":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 text-right tabular-nums truncate",
              frozenClass,
            )}
            title={String(row.alerts)}
          >
            <span
              className={cn(
                "rounded px-1.5 py-0.5 font-medium",
                row.alerts > 4
                  ? "bg-danger/10 text-danger"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {String(row.alerts).padStart(2, "0")}
            </span>
          </td>
        );
      case "endOdometer":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 text-right tabular-nums truncate",
              frozenClass,
            )}
            title={endOdometer}
          >
            {endOdometer}
          </td>
        );
      case "lastIgnitionOff":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 text-muted-foreground truncate",
              frozenClass,
            )}
            title={lastIgnitionOff}
          >
            {lastIgnitionOff}
          </td>
        );
      case "endLocation":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn("px-2.5 py-1.5 truncate", frozenClass)}
            title={row.endLocation}
          >
            {row.endLocation}
          </td>
        );
      case "playback":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn("px-2.5 py-1.5 text-center", frozenClass)}
          >
            <button
              type="button"
              aria-label={"Play trip playback for " + row.vehicleNo}
              onClick={() =>
                toast.success("Playback started", {
                  description:
                    row.vehicleNo +
                    " · " +
                    row.startLocation +
                    " → " +
                    row.endLocation,
                })
              }
              className="inline-flex h-5 w-5 items-center justify-center rounded border border-input bg-background text-muted-foreground transition-colors duration-150 hover:bg-brand hover:text-brand-foreground cursor-pointer"
            >
              <Play className="h-3 w-3" />
            </button>
          </td>
        );
      case "distanceUnit":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 text-center text-muted-foreground truncate",
              frozenClass,
            )}
          >
            km
          </td>
        );
      case "company":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn("px-2.5 py-1.5 truncate", frozenClass)}
            title={row.company}
          >
            {row.company}
          </td>
        );
      case "driver":
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 truncate text-muted-foreground",
              frozenClass,
            )}
            title={row.driver}
          >
            {row.driver}
          </td>
        );
      default:
        return (
          <td
            key={col.id}
            style={cellStyle}
            className={cn(
              "px-2.5 py-1.5 text-muted-foreground truncate",
              frozenClass,
            )}
          >
            -
          </td>
        );
    }
  };

  return (
    <>
      <tr
        onDoubleClick={onDrill}
        title="Double-click to open daily summary"
        className={cn(
          "group cursor-pointer border-b border-border/40 transition-colors duration-150 text-xs",
          open
            ? "bg-blue-50/50 dark:bg-blue-950/30 font-medium"
            : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40",
        )}
      >
        <td className="sticky left-0 z-10 w-9 min-w-[36px] max-w-[36px] bg-surface group-hover:bg-muted/80 border-r border-border/60 px-2 py-2 text-center shadow-xs">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-label={
              (open ? "Collapse" : "Expand") + " trips for " + row.vehicleNo
            }
            className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-input/80 bg-background text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
          >
            <ChevronRight
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-200",
                open && "rotate-90 text-blue-500",
              )}
            />
          </button>
        </td>
        {columns.map((col, idx) => cellFor(col, idx))}
      </tr>
      {open ? (
        <tr className="border-b border-border bg-surface-muted">
          <td colSpan={colSpan} className="px-6 py-2">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-1 font-medium">Date</th>
                  <th className="py-1 font-medium">First ignition</th>
                  <th className="py-1 font-medium">Start location</th>
                  <th className="py-1 text-right font-medium">Distance</th>
                  <th className="py-1 font-medium">Running</th>
                  <th className="py-1 font-medium">Idle</th>
                  <th className="py-1 font-medium">Stop</th>
                  <th className="py-1 text-right font-medium">Alerts</th>
                  <th className="py-1 font-medium">Last ignition</th>
                  <th className="py-1 font-medium">End location</th>
                  <th className="py-1 font-medium text-center">Playback</th>
                </tr>
              </thead>
              <tbody>
                {row.trips.map((t, i) => (
                  <tr
                    key={row.id + "-" + i}
                    className="border-t border-border/60"
                  >
                    <td className="py-1">{t.date}</td>
                    <td className="py-1">{t.firstIgnitionOn}</td>
                    <td className="py-1">{t.startLocation}</td>
                    <td className="py-1 text-right tabular-nums">
                      {t.distance.toFixed(2)}
                    </td>
                    <td className="py-1">{t.running}</td>
                    <td className="py-1">{t.idle}</td>
                    <td className="py-1">{t.stop}</td>
                    <td className="py-1 text-right tabular-nums">{t.alerts}</td>
                    <td className="py-1">{t.lastIgnitionOn}</td>
                    <td className="py-1">{t.endLocation}</td>
                    <td className="py-1 text-center">
                      <button
                        type="button"
                        aria-label={
                          "Play trip " + (i + 1) + " for " + row.vehicleNo
                        }
                        onClick={() =>
                          toast.success("Playback started", {
                            description:
                              row.vehicleNo +
                              " · " +
                              t.startLocation +
                              " → " +
                              t.endLocation,
                          })
                        }
                        className="inline-flex h-5 w-5 items-center justify-center rounded border border-input bg-background text-muted-foreground transition-colors duration-150 hover:bg-brand hover:text-brand-foreground cursor-pointer"
                      >
                        <Play className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      ) : null}
    </>
  );
}
