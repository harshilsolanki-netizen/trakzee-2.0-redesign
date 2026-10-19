import { useLocation, useNavigate, useSearch } from "@tanstack/react-router";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import {
  ChartFilterDrawer,
  type ChartQuickFilter,
} from "@/components/charts/ChartFilterDrawer";
import {
  ChartTypeToolbar,
  type ChartType,
} from "@/components/charts/ChartTypeToolbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CHART_CATEGORIES,
  CHART_VEHICLES,
  findChartItem,
  fuelEvents,
  fuelSeries,
  hourlyLevelData,
  dailyLevelData,
  objectLevelData,
  type ChartTreeItem,
} from "@/data/charts";
import { cn } from "@/lib/utils";

const PIE_COLORS = [
  "#155dfc", // secondary brand blue (#155dfc)
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#f59e0b", // amber
  "#ef4444", // red
  "#6366f1", // indigo
  "#8b5cf6", // purple
  "#ec4899", // pink
];

const VEHICLE_GROUPS = [
  { group: "Agarwal Industries", vehicles: CHART_VEHICLES.slice(0, 3) },
  { group: "Balaji Logistics", vehicles: CHART_VEHICLES.slice(3) },
];

const PRESET_OPTIONS = [
  "Today",
  "Yesterday",
  "This Week",
  "Last Week",
  "Last 7 Days",
  "This Month",
  "Last Month",
  "Custom Range",
];

const MONTH_FULL_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function formatDateToISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateToDisplayDDMM(isoStr: string): string {
  if (!isoStr) return "";
  const parts = isoStr.split("-");
  if (parts.length !== 3) return isoStr;
  const [y, m, d] = parts;
  return `${d}/${m}/${y}`;
}

function parseISOToDate(isoStr: string): Date {
  if (!isoStr) return new Date();
  const parts = isoStr.split("-");
  if (parts.length === 3) {
    const y = parseInt(parts[0] || "2024", 10);
    const m = parseInt(parts[1] || "1", 10) - 1;
    const d = parseInt(parts[2] || "1", 10);
    return new Date(y, m, d);
  }
  return new Date();
}

function getDateRangeFromPreset(preset: string): { from: string; to: string } {
  const now = new Date(2024, 11, 10);

  if (preset === "Today") {
    const str = formatDateToISO(now);
    return { from: str, to: str };
  }
  if (preset === "Yesterday") {
    const y = new Date(now);
    y.setDate(y.getDate() - 1);
    const str = formatDateToISO(y);
    return { from: str, to: str };
  }
  if (preset === "This Week") {
    const start = new Date(now);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    return { from: formatDateToISO(start), to: formatDateToISO(now) };
  }
  if (preset === "Last Week") {
    const start = new Date(now);
    const day = start.getDay();
    const diff = start.getDate() - day - 6 + (day === 0 ? -6 : 1);
    start.setDate(diff);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { from: formatDateToISO(start), to: formatDateToISO(end) };
  }
  if (preset === "Last 7 Days") {
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    return { from: formatDateToISO(start), to: formatDateToISO(now) };
  }
  if (preset === "This Month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { from: formatDateToISO(start), to: formatDateToISO(now) };
  }
  if (preset === "Last Month") {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    return { from: formatDateToISO(start), to: formatDateToISO(end) };
  }
  return { from: formatDateToISO(now), to: formatDateToISO(now) };
}

type Point = { name: string; value: number; sr?: number; value2?: number };

const SCROLL =
  "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent";

export function ChartsPage() {
  const search = useSearch({ strict: false }) as { chart?: string };
  const location = useLocation();
  const navigate = useNavigate();

  // Read active chart from search or fallback to "distance"
  const urlChartId = search?.chart || "distance";
  const [chartId, setChartId] = useState(urlChartId);

  // Sync state if URL search param changes
  useEffect(() => {
    if (search?.chart && search.chart !== chartId) {
      setChartId(search.chart);
      setLevel(0);
      setDrillVehicle(null);
      setDrillDate(null);
      if (search.chart === "fuel-fill-drain") {
        setChartType("line");
      }
    }
  }, [search?.chart]);

  const currentChart: ChartTreeItem = useMemo(() => {
    return (
      findChartItem(chartId) ?? {
        id: "distance",
        label: "Distance",
        metric: "distance",
        unit: "km",
        range: [40, 620],
        category: "activity",
        categoryLabel: "Activity",
      }
    );
  }, [chartId]);

  const isFuel = chartId === "fuel-fill-drain";
  const isAlert = currentChart.category === "alert";

  /* drill-down state */
  const [level, setLevel] = useState<0 | 1 | 2>(0);
  const [drillVehicle, setDrillVehicle] = useState<string | null>(null);
  const [drillDate, setDrillDate] = useState<string | null>(null);

  /* toolbar + filter state */
  const [chartType, setChartType] = useState<ChartType>(
    isFuel ? "line" : "column",
  );
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState<ChartQuickFilter>({
    datePreset: "Last 7 Days",
    from: "2024-12-04",
    to: "2024-12-10",
    vehicles: [],
  });

  /* Quick Filter Popover States */
  const [dateOpen, setDateOpen] = useState(false);
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [presetMenuOpen, setPresetMenuOpen] = useState(false);

  // Date Draft States
  const [draftPreset, setDraftPreset] = useState(filter.datePreset || "Last 7 Days");
  const [draftFrom, setDraftFrom] = useState(filter.from || "2024-12-04");
  const [draftTo, setDraftTo] = useState(filter.to || "2024-12-10");
  const [selectionStep, setSelectionStep] = useState<"start" | "end">("start");
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [viewDate, setViewDate] = useState(() => {
    const d = parseISOToDate(filter.from || "2024-12-04");
    return new Date(d.getFullYear(), d.getMonth() - 1, 1);
  });

  // Sync date drafts when popover opens
  useEffect(() => {
    if (dateOpen) {
      setDraftPreset(filter.datePreset || "Last 7 Days");
      setDraftFrom(filter.from || "2024-12-04");
      setDraftTo(filter.to || "2024-12-10");
      setPresetMenuOpen(false);
      setSelectionStep("start");
      const d = parseISOToDate(filter.from || "2024-12-04");
      setViewDate(new Date(d.getFullYear(), d.getMonth() - 1, 1));
    }
  }, [dateOpen, filter]);

  // Vehicle Draft States
  const [draftVehicles, setDraftVehicles] = useState<string[]>([]);
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);

  useEffect(() => {
    if (vehicleOpen) {
      setDraftVehicles(filter.vehicles.length > 0 ? [...filter.vehicles] : [...CHART_VEHICLES]);
      setVehicleSearch("");
    }
  }, [vehicleOpen, filter.vehicles]);

  /* fuel toggles */
  const [toggles, setToggles] = useState({
    fuel: true,
    fuelRaw: false,
    ignition: true,
    speed: false,
    power: false,
  });

  /* Date navigation */
  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handlePresetSelect = (preset: string) => {
    setDraftPreset(preset);
    setPresetMenuOpen(false);
    if (preset === "Custom Range") {
      setSelectionStep("start");
      return;
    }
    const range = getDateRangeFromPreset(preset);
    setDraftFrom(range.from);
    setDraftTo(range.to);
    const d = parseISOToDate(range.from);
    setViewDate(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };

  const handleDualCalendarDayClick = (isoDate: string) => {
    setDraftPreset("Custom Range");
    if (selectionStep === "start") {
      setDraftFrom(isoDate);
      setDraftTo(isoDate);
      setSelectionStep("end");
    } else {
      if (isoDate < draftFrom) {
        setDraftFrom(isoDate);
        setDraftTo(draftFrom);
      } else {
        setDraftTo(isoDate);
      }
      setSelectionStep("start");
    }
  };

  const handleApplyDate = () => {
    setFilter((prev) => ({
      ...prev,
      datePreset: draftPreset,
      from: draftFrom,
      to: draftTo,
    }));
    setDateOpen(false);
    setLevel(0);
    setDrillVehicle(null);
    setDrillDate(null);
    toast.success("Date range updated", {
      description: `${draftFrom} → ${draftTo}`,
    });
  };

  const handleResetDate = () => {
    const range = getDateRangeFromPreset("Last 7 Days");
    setDraftPreset("Last 7 Days");
    setDraftFrom(range.from);
    setDraftTo(range.to);
    setPresetMenuOpen(false);
    const d = parseISOToDate(range.from);
    setViewDate(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };

  // Dual Month Calendar Generator
  const renderDualMonth = (
    year: number,
    month: number,
    isFromMonth: boolean,
  ) => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: {
      dateStr: string;
      dayNum: number;
      isCurrentMonth: boolean;
    }[] = [];

    // Prev month trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevM = month === 0 ? 11 : month - 1;
      const prevY = month === 0 ? year - 1 : year;
      const dateStr = formatDateToISO(new Date(prevY, prevM, d));
      cells.push({ dateStr, dayNum: d, isCurrentMonth: false });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = formatDateToISO(new Date(year, month, d));
      cells.push({ dateStr, dayNum: d, isCurrentMonth: true });
    }

    // Next month leading days
    const totalSlots = cells.length > 35 ? 42 : 35;
    const remaining = totalSlots - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const nextM = month === 11 ? 0 : month + 1;
      const nextY = month === 11 ? year + 1 : year;
      const dateStr = formatDateToISO(new Date(nextY, nextM, d));
      cells.push({ dateStr, dayNum: d, isCurrentMonth: false });
    }

    const monthLabel = `${MONTH_FULL_NAMES[month]} ${year}`;

    return (
      <div className="flex-1 select-none">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="font-bold text-xs text-foreground">
            {monthLabel}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
              title="Previous month"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
              title="Next month"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-bold text-muted-foreground uppercase mb-1">
          {WEEKDAY_NAMES.map((w) => (
            <div key={w} className="h-4 flex items-center justify-center">
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
          {cells.map(({ dateStr, dayNum, isCurrentMonth }, idx) => {
            const isStart = dateStr === draftFrom;
            const isEnd = dateStr === draftTo;
            const effectiveEnd =
              selectionStep === "end" && hoverDate && hoverDate >= draftFrom
                ? hoverDate
                : draftTo;
            const inRange =
              draftFrom &&
              effectiveEnd &&
              dateStr > draftFrom &&
              dateStr < effectiveEnd;
            const isSelected = isStart || isEnd;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleDualCalendarDayClick(dateStr)}
                onMouseEnter={() => {
                  if (selectionStep === "end") setHoverDate(dateStr);
                }}
                className={cn(
                  "h-7 w-full flex items-center justify-center text-xs rounded-md transition-all cursor-pointer relative font-medium",
                  !isCurrentMonth &&
                    "text-muted-foreground/30 pointer-events-none",
                  isCurrentMonth &&
                    !isSelected &&
                    !inRange &&
                    "text-foreground hover:bg-muted",
                  inRange &&
                    "bg-[#0089FF]/15 text-[#0089FF] font-semibold rounded-none first:rounded-l-md last:rounded-r-md",
                  isSelected &&
                    "bg-[#0089FF] text-white font-bold shadow-xs z-10",
                )}
              >
                {dayNum}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  /* Vehicle handlers */
  const filteredVehicleGroups = useMemo(() => {
    const q = vehicleSearch.trim().toLowerCase();
    return VEHICLE_GROUPS.map((g) => ({
      group: g.group,
      vehicles: g.vehicles.filter(
        (v) =>
          !q ||
          v.toLowerCase().includes(q) ||
          g.group.toLowerCase().includes(q),
      ),
    })).filter((g) => g.vehicles.length > 0);
  }, [vehicleSearch]);

  const isAllVehiclesDraftSelected =
    draftVehicles.length === CHART_VEHICLES.length && CHART_VEHICLES.length > 0;

  const toggleAllDraftVehicles = () => {
    if (isAllVehiclesDraftSelected) {
      setDraftVehicles([]);
    } else {
      setDraftVehicles([...CHART_VEHICLES]);
    }
  };

  const toggleDraftVehicle = (v: string) => {
    if (draftVehicles.includes(v)) {
      setDraftVehicles(draftVehicles.filter((x) => x !== v));
    } else {
      setDraftVehicles([...draftVehicles, v]);
    }
  };

  const toggleDraftGroupVehicles = (groupVehicles: string[]) => {
    const allIn = groupVehicles.every((v) => draftVehicles.includes(v));
    if (allIn) {
      setDraftVehicles(draftVehicles.filter((v) => !groupVehicles.includes(v)));
    } else {
      setDraftVehicles([...new Set([...draftVehicles, ...groupVehicles])]);
    }
  };

  const toggleCollapseGroup = (g: string) => {
    setCollapsedGroups((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );
  };

  const handleApplyVehicles = () => {
    const isAll =
      draftVehicles.length === 0 ||
      draftVehicles.length === CHART_VEHICLES.length;
    setFilter((prev) => ({
      ...prev,
      vehicles: isAll ? [] : draftVehicles,
    }));
    setVehicleOpen(false);
    setLevel(0);
    setDrillVehicle(null);
    setDrillDate(null);
    toast.success("Vehicles updated", {
      description: isAll
        ? "All vehicles selected"
        : `${draftVehicles.length} vehicles selected`,
    });
  };

  /* ---------------- data ---------------- */
  const baseData: Point[] = useMemo(() => {
    if (isFuel) return [];
    let rows: Point[];
    if (level === 0) rows = objectLevelData(chartId);
    else if (level === 1) rows = dailyLevelData(chartId, drillVehicle!);
    else rows = hourlyLevelData(chartId, drillVehicle!, drillDate!);

    if (level === 0 && filter.vehicles.length > 0) {
      rows = rows.filter((r) => filter.vehicles.includes(r.name));
    }
    return rows.map((r, i) => ({
      ...r,
      sr: i + 1,
      value2: Math.round(r.value * 0.35 * 100) / 100,
    }));
  }, [isFuel, level, chartId, drillVehicle, drillDate, filter.vehicles]);

  const fuelData = useMemo(
    () => (isFuel ? fuelSeries(drillVehicle ?? CHART_VEHICLES[0]!) : []),
    [isFuel, drillVehicle],
  );
  const fuelEvts = useMemo(() => fuelEvents(fuelData), [fuelData]);
  const totalCorrection = useMemo(
    () => fuelEvts.reduce((s, e) => s + e.volume, 0).toFixed(1),
    [fuelEvts],
  );

  /* ---------------- drill-down ---------------- */
  const handleBarClick = (entry: Point) => {
    if (isFuel) return;
    if (level === 0) {
      setDrillVehicle(entry.name);
      setLevel(1);
    } else if (level === 1) {
      setDrillDate(entry.name);
      setLevel(2);
    }
  };

  const handleGoBack = () => {
    if (level === 2) {
      setLevel(1);
      setDrillDate(null);
    } else if (level === 1) {
      setLevel(0);
      setDrillVehicle(null);
      setDrillDate(null);
    }
  };

  const pageTitle = useMemo(() => {
    if (isFuel) {
      return `Fuel Fill-Drain · ${drillVehicle ?? CHART_VEHICLES[0]}`;
    }
    if (level === 0) {
      return currentChart.label;
    }
    if (level === 1) {
      return `${currentChart.label} · ${drillVehicle}`;
    }
    return `${currentChart.label} · ${drillVehicle} (${drillDate})`;
  }, [isFuel, level, currentChart.label, drillVehicle, drillDate]);

  const handleDownload = (label: string) =>
    toast.success(`Generating ${label} report…`, {
      description: `${pageTitle} · ${filter.from} → ${filter.to}`,
    });

  // Explicit, crisp axis styles for high readability
  const axisTickStyle = { fill: "#475569", fontSize: 11, fontWeight: 500 };
  const axisStroke = "#cbd5e1";

  const xAxisTitle =
    level === 0
      ? "Object (Vehicle)"
      : level === 1
        ? "Date (DD-MM-YYYY)"
        : "Time (Hours)";
  const yAxisTitle = `${currentChart.label} (${currentChart.unit})`;

  const dateRangeTriggerLabel = useMemo(() => {
    const fDate = formatDateToDisplayDDMM(filter.from || "2024-12-04");
    const tDate = formatDateToDisplayDDMM(filter.to || "2024-12-10");
    return `${fDate} 12:00 AM - ${tDate} 11:59 PM`;
  }, [filter.from, filter.to]);

  const vehicleTriggerLabel = useMemo(() => {
    if (
      filter.vehicles.length === 0 ||
      filter.vehicles.length === CHART_VEHICLES.length
    ) {
      return "All";
    }
    if (filter.vehicles.length === 1) {
      return filter.vehicles[0];
    }
    return `${filter.vehicles[0]} +${filter.vehicles.length - 1}`;
  }, [filter.vehicles]);

  const activeSideFilterCount = useMemo(() => {
    let count = 0;
    if (filter.vehicles.length > 0 && filter.vehicles.length < CHART_VEHICLES.length) count++;
    if (filter.datePreset && filter.datePreset !== "Last 7 Days") count++;
    return count;
  }, [filter.vehicles.length, filter.datePreset]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#F0F0F0] dark:bg-slate-950 p-[10px]">
      {/* Unified Card Container matching Report Screen */}
      <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white dark:bg-slate-900 rounded-xl border border-[#DFE3EB]/80 dark:border-slate-800 shadow-2xs">
        {/* 1. Title Row matching Report Screen Theme */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2.5 select-none shrink-0 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            {level > 0 ? (
              <button
                type="button"
                onClick={handleGoBack}
                className="p-1 -ml-1 rounded text-slate-700 dark:text-slate-200 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title="Go Back"
              >
                <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
              </button>
            ) : null}
            <h1 className="text-[24px] font-medium text-slate-900 dark:text-white tracking-tight">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* 2. Toolbar Row with Quick Filters aligned to the left */}
        <div className="relative z-20 flex min-h-[48px] items-center justify-start gap-4 bg-white dark:bg-slate-900 px-5 pt-1 pb-3.5 shrink-0 select-none">
          {/* Left Controls: Date Range Popover, Vehicle Popover, Filter CTA */}
          <div className="flex items-center min-w-0 overflow-x-auto scrollbar-none gap-2.5">
            {/* 1. Date Range Dropdown Popover */}
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "inline-flex h-7.5 items-center gap-1.5 rounded-md px-2.5 text-xs transition-colors cursor-pointer select-none hover:bg-muted/70",
                    dateOpen && "bg-muted",
                  )}
                >
                  <CalendarIcon className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {dateRangeTriggerLabel}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-200",
                      dateOpen && "rotate-180",
                    )}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={4}
                className={cn(
                  "p-0 text-xs bg-popover/95 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-50 select-none overflow-visible transition-all duration-200 space-y-0",
                  draftPreset === "Custom Range" ? "w-[580px]" : "w-[360px]",
                )}
              >
                <div className="p-4 space-y-3">
                  <div className="space-y-1.5 relative">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="h-3.5 w-3.5 text-[#0089FF]" />
                        <span className="text-xs font-semibold text-foreground block">
                          Date Range
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDateOpen(false)}
                        className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPresetMenuOpen((prev) => !prev)}
                      className={cn(
                        "flex h-8.5 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-xs font-medium text-muted-foreground transition-all cursor-pointer shadow-2xs hover:bg-muted/40 hover:border-[#0089FF]/50",
                        presetMenuOpen && "border-[#0089FF] ring-2 ring-[#0089FF]/20",
                      )}
                    >
                      <span>{draftPreset}</span>
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                          presetMenuOpen && "rotate-180",
                        )}
                      />
                    </button>

                    {presetMenuOpen && (
                      <div className="absolute left-0 top-full mt-1 w-full rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md shadow-lg p-1 z-60 animate-in fade-in zoom-in-95 space-y-0.5">
                        {PRESET_OPTIONS.map((opt) => {
                          const isSelected = draftPreset === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handlePresetSelect(opt)}
                              className={cn(
                                "flex w-full items-center justify-between px-2.5 py-1.5 rounded-sm text-xs transition-all cursor-pointer select-none text-left",
                                isSelected
                                  ? "bg-[#0089FF]/10 text-[#0089FF] font-bold"
                                  : "text-foreground hover:bg-muted font-medium",
                              )}
                            >
                              <span>{opt}</span>
                              {isSelected && (
                                <Check className="h-3.5 w-3.5 text-[#0089FF] shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {draftPreset === "Custom Range" ? (
                    <div className="pt-2 flex gap-4">
                      {renderDualMonth(
                        viewDate.getFullYear(),
                        viewDate.getMonth(),
                        true,
                      )}
                      <div className="w-px bg-border/60 my-1" />
                      {renderDualMonth(
                        new Date(
                          viewDate.getFullYear(),
                          viewDate.getMonth() + 1,
                          1,
                        ).getFullYear(),
                        new Date(
                          viewDate.getFullYear(),
                          viewDate.getMonth() + 1,
                          1,
                        ).getMonth(),
                        false,
                      )}
                    </div>
                  ) : (
                    <div className="pt-1 grid grid-cols-2 gap-2.5">
                      <div className="rounded-md border border-input/80 bg-muted/20 p-2.5 space-y-1">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                          From Date
                        </span>
                        <span className="text-xs font-semibold text-foreground block">
                          {formatDateToDisplayDDMM(draftFrom)} 12:00 AM
                        </span>
                      </div>
                      <div className="rounded-md border border-input/80 bg-muted/20 p-2.5 space-y-1">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                          To Date
                        </span>
                        <span className="text-xs font-semibold text-foreground block">
                          {formatDateToDisplayDDMM(draftTo)} 11:59 PM
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 px-4 border-t border-border/70 flex items-center justify-between bg-muted/20">
                  <button
                    type="button"
                    onClick={handleResetDate}
                    className="text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer transition-colors"
                  >
                    Clear
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDateOpen(false)}
                      className="px-3 py-1.5 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyDate}
                      className="px-4 py-1.5 text-xs rounded-md bg-[#0089FF] text-white hover:bg-[#0070d6] cursor-pointer font-semibold shadow-xs transition-all active:scale-98"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Divider */}
            <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 shrink-0 mx-0.5" />

            {/* 2. Vehicle Selector Popover */}
            <Popover open={vehicleOpen} onOpenChange={setVehicleOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "inline-flex h-7.5 items-center gap-1.5 rounded-md px-2.5 text-xs transition-colors cursor-pointer select-none hover:bg-muted/70",
                    vehicleOpen && "bg-muted",
                  )}
                >
                  <span className="font-normal text-slate-500 dark:text-slate-400">
                    Vehicle:
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {vehicleTriggerLabel}
                  </span>
                  <ChevronDown className="h-3 w-3 text-slate-500 dark:text-slate-400 shrink-0" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={4}
                className="w-84 p-0 text-xs bg-popover/95 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-50 overflow-hidden select-none"
              >
                {/* Header with Search */}
                <div className="p-3 px-4 border-b border-border/70 space-y-2 bg-muted/20">
                  <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                    <span>Select Vehicles</span>
                    <span className="text-[10px] font-semibold text-[#0089FF] bg-[#0089FF]/10 px-2 py-0.5 rounded-full">
                      {draftVehicles.length} / {CHART_VEHICLES.length} selected
                    </span>
                  </div>
                  <div className="flex h-8 items-center gap-2 rounded-md border border-input bg-background px-2.5 focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all">
                    <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <input
                      value={vehicleSearch}
                      onChange={(e) => setVehicleSearch(e.target.value)}
                      placeholder="Search vehicle..."
                      className="h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                    />
                    {vehicleSearch && (
                      <button
                        type="button"
                        onClick={() => setVehicleSearch("")}
                        className="rounded-md p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Select All Option */}
                <div className="px-4 py-1.5 border-b border-border/60 flex items-center justify-between bg-muted/10">
                  <label className="flex items-center gap-2 cursor-pointer select-none w-full text-xs font-semibold text-foreground">
                    <input
                      type="checkbox"
                      checked={isAllVehiclesDraftSelected}
                      onChange={toggleAllDraftVehicles}
                      className="h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer"
                    />
                    <span>Select All Vehicles</span>
                  </label>
                </div>

                {/* Grouped Tree List */}
                <div className="max-h-64 overflow-y-auto p-1.5 space-y-1.5 custom-scrollbar">
                  {filteredVehicleGroups.map(({ group, vehicles }) => {
                    const isCollapsed =
                      collapsedGroups.includes(group) && !vehicleSearch;
                    const groupSelectedCount = vehicles.filter((v) =>
                      draftVehicles.includes(v),
                    ).length;
                    const allGroupIn =
                      groupSelectedCount === vehicles.length &&
                      vehicles.length > 0;
                    const someGroupIn =
                      groupSelectedCount > 0 && !allGroupIn;

                    return (
                      <div
                        key={group}
                        className="rounded-md border border-border/70 bg-card/60 overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-2.5 py-1.5 bg-muted/30 border-b border-border/50 text-xs">
                          <label className="flex items-center gap-2 cursor-pointer select-none font-semibold text-foreground">
                            <input
                              type="checkbox"
                              checked={allGroupIn}
                              ref={(el) => {
                                if (el) el.indeterminate = someGroupIn;
                              }}
                              onChange={() => toggleDraftGroupVehicles(vehicles)}
                              className="h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer"
                            />
                            <span>{group}</span>
                          </label>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-muted-foreground font-semibold bg-background px-1.5 py-0.5 rounded-sm border border-border/60">
                              {groupSelectedCount}/{vehicles.length}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleCollapseGroup(group)}
                              className="p-0.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
                            >
                              {isCollapsed ? (
                                <ChevronRight className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {!isCollapsed && (
                          <div className="p-1 space-y-0.5 pl-2.5">
                            {vehicles.map((v) => {
                              const checked = draftVehicles.includes(v);
                              return (
                                <label
                                  key={v}
                                  className={cn(
                                    "flex items-center gap-2 px-2 py-1 rounded-sm hover:bg-muted cursor-pointer transition-colors text-xs select-none",
                                    checked && "bg-muted/40",
                                  )}
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleDraftVehicle(v)}
                                    className="h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer shrink-0"
                                  />
                                  <span
                                    className={cn(
                                      "text-xs leading-tight text-foreground",
                                      checked && "font-semibold text-foreground",
                                    )}
                                  >
                                    {v}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {filteredVehicleGroups.length === 0 && (
                    <div className="p-4 text-center text-xs text-muted-foreground">
                      No vehicles found matching search
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="p-2.5 px-4 border-t border-border/70 flex items-center justify-between bg-muted/20">
                  <button
                    type="button"
                    onClick={() => setDraftVehicles([])}
                    className="text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer transition-colors"
                  >
                    Clear
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setVehicleOpen(false)}
                      className="px-3 py-1.5 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyVehicles}
                      className="px-4 py-1.5 text-xs rounded-md bg-[#0089FF] text-white hover:bg-[#0070d6] cursor-pointer font-semibold shadow-xs transition-all active:scale-98"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Divider */}
            <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 shrink-0 mx-0.5" />

            {/* 3. Filter CTA Button matching Report Screen */}
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              aria-label="Open Filter Drawer"
              className="inline-flex h-7.5 items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white transition-all cursor-pointer select-none shadow-2xs active:scale-98"
            >
              <SlidersHorizontal className="h-3 w-3 text-slate-500 dark:text-slate-400" />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Filter
              </span>
              {activeSideFilterCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold leading-tight bg-[#0089FF] text-white">
                  {activeSideFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Horizontal divider with 20px space from left and right */}
        <div className="mx-5 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0" />

        {/* 3. Split-pane main content */}
        <div className="flex min-h-0 flex-1 gap-4 px-5 pt-4 pb-2 overflow-hidden bg-white dark:bg-slate-900">
          {/* Left Data List Card */}
          <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs w-[310px] shrink-0">
            <div className="flex items-center justify-between border-b border-[#DFE3EB] dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-3.5 py-2.5 shrink-0">
              <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Data
              </h2>
              <span className="rounded bg-[#0089FF]/10 px-2 py-0.5 text-[10px] font-bold text-[#0089FF]">
                {currentChart.unit}
              </span>
            </div>

            <div className={cn("min-h-0 flex-1 overflow-auto", SCROLL)}>
              {isFuel ? (
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-xs border-b border-[#DFE3EB] dark:border-slate-800 z-10">
                    <tr className="h-[34px] text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      <th className="px-3 py-1.5 text-left font-semibold">
                        Start Time
                      </th>
                      <th className="px-3 py-1.5 text-left font-semibold">
                        End Time
                      </th>
                      <th className="px-3 py-1.5 text-right font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fuelEvts.map((e) => (
                      <tr
                        key={e.id}
                        className="border-b border-[#DFE3EB]/70 dark:border-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                      >
                        <td className="px-3 py-2 tabular-nums font-medium text-slate-900 dark:text-slate-100">
                          {e.start}
                        </td>
                        <td className="px-3 py-2 tabular-nums text-slate-500 dark:text-slate-400">
                          {e.end}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold",
                              e.valid
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                : "bg-rose-500/15 text-rose-600 dark:text-rose-400",
                            )}
                          >
                            {e.valid ? "Valid" : "Invalid"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-xs border-b border-[#DFE3EB] dark:border-slate-800 z-10">
                    <tr className="h-[34px] text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      {level === 0 ? (
                        <>
                          <th className="px-3 py-1.5 text-left font-semibold">
                            Sr No
                          </th>
                          <th className="px-3 py-1.5 text-left font-semibold">
                            Object
                          </th>
                          <th className="px-3 py-1.5 text-right font-semibold">
                            {currentChart.label} ({currentChart.unit})
                          </th>
                        </>
                      ) : (
                        <>
                          <th className="px-3 py-1.5 text-left font-semibold">
                            {level === 1 ? "Date" : "Time"}
                          </th>
                          <th className="px-3 py-1.5 text-right font-semibold">
                            {currentChart.label} ({currentChart.unit})
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {baseData.map((r) => (
                      <tr
                        key={r.name}
                        onClick={() => handleBarClick(r)}
                        className={cn(
                          "border-b border-[#DFE3EB]/70 dark:border-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors",
                          level < 2 && "cursor-pointer",
                        )}
                      >
                        {level === 0 ? (
                          <>
                            <td className="px-3 py-2 tabular-nums text-slate-500 dark:text-slate-400">
                              {r.sr}
                            </td>
                            <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">
                              {r.name}
                            </td>
                            <td className="px-3 py-2 text-right tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                              {r.value.toFixed(2)}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">
                              {r.name}
                            </td>
                            <td className="px-3 py-2 text-right tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                              {r.value.toFixed(2)}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Right Chart Canvas Card */}
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs">
            {/* Contextual fuel controls */}
            {isFuel ? (
              <div className="mb-3 flex flex-wrap items-center gap-2 border-b border-[#DFE3EB] dark:border-slate-800 pb-2.5 shrink-0">
                {(
                  [
                    ["fuel", "Fuel Algorithm"],
                    ["fuelRaw", "Fuel Raw"],
                    ["ignition", "Ignition"],
                    ["speed", "Speed"],
                    ["power", "Power"],
                  ] as const
                ).map(([key, label]) => (
                  <label
                    key={key}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all select-none",
                      toggles[key]
                        ? "border-[#0089FF]/40 bg-[#0089FF]/10 text-[#0089FF] font-semibold"
                        : "border-[#DFE3EB] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={toggles[key]}
                      onChange={() =>
                        setToggles((t) => ({ ...t, [key]: !t[key] }))
                      }
                      className="h-3 w-3 accent-[#0089FF] cursor-pointer"
                    />
                    {label}
                  </label>
                ))}
                <span className="inline-flex items-center rounded-full bg-[#0089FF]/10 px-2.5 py-1 text-[11px] font-semibold text-[#0089FF] ml-auto">
                  Total correction: {totalCorrection} ltr
                </span>
              </div>
            ) : null}

            <div className="min-h-0 flex-1 relative">
              <ResponsiveContainer width="100%" height="100%">
                {isFuel ? (
                  <ComposedChart
                    data={fuelData}
                    margin={{ top: 16, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid
                      stroke="#e2e8f0"
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="time"
                      stroke={axisStroke}
                      tick={axisTickStyle}
                      tickLine={{ stroke: axisStroke }}
                      height={46}
                      label={{
                        value: "Time (HH:mm)",
                        position: "insideBottom",
                        offset: 0,
                        fill: "#475569",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    />
                    <YAxis
                      yAxisId="fuel"
                      domain={[0, 100]}
                      stroke={axisStroke}
                      tick={axisTickStyle}
                      tickLine={{ stroke: axisStroke }}
                      width={65}
                      label={{
                        value: "Fuel Level (ltr)",
                        angle: -90,
                        position: "insideLeft",
                        offset: 12,
                        fill: "#334155",
                        fontSize: 12,
                        fontWeight: 600,
                        style: { textAnchor: "middle" },
                      }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 1]}
                      tickFormatter={(v: number) => (v === 1 ? "ON" : "OFF")}
                      stroke={axisStroke}
                      tick={axisTickStyle}
                      tickLine={{ stroke: axisStroke }}
                      width={55}
                      label={{
                        value: "Status (ON / OFF)",
                        angle: 90,
                        position: "insideRight",
                        offset: 12,
                        fill: "#334155",
                        fontSize: 12,
                        fontWeight: 600,
                        style: { textAnchor: "middle" },
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: "1px solid #cbd5e1",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{
                        fontSize: 12,
                        fontWeight: 500,
                        paddingTop: 12,
                      }}
                    />
                    {toggles.ignition ? (
                      <Area
                        yAxisId="right"
                        type="stepAfter"
                        dataKey="ignition"
                        name="Ignition"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.18}
                      />
                    ) : null}
                    {toggles.power ? (
                      <Area
                        yAxisId="right"
                        type="stepAfter"
                        dataKey="power"
                        name="Power"
                        stroke="#06b6d4"
                        fill="#06b6d4"
                        fillOpacity={0.12}
                      />
                    ) : null}
                    {toggles.fuel ? (
                      <Line
                        yAxisId="fuel"
                        type="monotone"
                        dataKey="fuel"
                        name="Fuel Algorithm (ltr)"
                        stroke="#155dfc"
                        strokeWidth={2.5}
                        dot={false}
                      />
                    ) : null}
                    {toggles.fuelRaw ? (
                      <Line
                        yAxisId="fuel"
                        type="monotone"
                        dataKey="fuelRaw"
                        name="Fuel Raw Data (ltr)"
                        stroke="#10b981"
                        strokeWidth={1.5}
                        strokeDasharray="4 3"
                        dot={false}
                      />
                    ) : null}
                    {toggles.speed ? (
                      <Line
                        yAxisId="fuel"
                        type="monotone"
                        dataKey="speed"
                        name="Speed (km/h)"
                        stroke="#6366f1"
                        strokeWidth={1.5}
                        dot={false}
                      />
                    ) : null}
                  </ComposedChart>
                ) : chartType === "pie" || chartType === "donut" ? (
                  <PieChart>
                    <Tooltip
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: "1px solid #cbd5e1",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{
                        fontSize: 12,
                        fontWeight: 500,
                        paddingTop: 12,
                      }}
                    />
                    <Pie
                      data={baseData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={chartType === "donut" ? "45%" : 0}
                      outerRadius="78%"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {baseData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                ) : chartType === "line" ? (
                  <LineChart
                    data={baseData}
                    margin={{ top: 16, right: 28, left: 16, bottom: 20 }}
                  >
                    <CartesianGrid
                      stroke="#e2e8f0"
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke={axisStroke}
                      tick={axisTickStyle}
                      tickLine={{ stroke: axisStroke }}
                      height={46}
                      label={{
                        value: xAxisTitle,
                        position: "insideBottom",
                        offset: 0,
                        fill: "#475569",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    />
                    <YAxis
                      stroke={axisStroke}
                      tick={axisTickStyle}
                      tickLine={{ stroke: axisStroke }}
                      width={55}
                      label={{
                        value: yAxisTitle,
                        angle: -90,
                        position: "insideLeft",
                        offset: 12,
                        fill: "#334155",
                        fontSize: 12,
                        fontWeight: 600,
                        style: { textAnchor: "middle" },
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: "1px solid #cbd5e1",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{
                        fontSize: 12,
                        fontWeight: 500,
                        paddingTop: 12,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name={currentChart.label}
                      stroke="#155dfc"
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                ) : chartType === "bar-horizontal" ? (
                  <BarChart
                    data={baseData}
                    layout="vertical"
                    margin={{ top: 16, right: 28, left: 24, bottom: 20 }}
                  >
                    <CartesianGrid
                      stroke="#e2e8f0"
                      strokeDasharray="3 3"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      stroke={axisStroke}
                      tick={axisTickStyle}
                      tickLine={{ stroke: axisStroke }}
                      height={46}
                      label={{
                        value: yAxisTitle,
                        position: "insideBottom",
                        offset: 0,
                        fill: "#475569",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke={axisStroke}
                      tick={axisTickStyle}
                      tickLine={{ stroke: axisStroke }}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: "1px solid #cbd5e1",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{
                        fontSize: 12,
                        fontWeight: 500,
                        paddingTop: 12,
                      }}
                    />
                    <Bar
                      dataKey="value"
                      name={currentChart.label}
                      fill="#155dfc"
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                      {...(level < 2
                        ? {
                            onClick: (d: unknown) => handleBarClick(d as Point),
                            cursor: "pointer" as const,
                          }
                        : {})}
                    />
                  </BarChart>
                ) : (
                  <BarChart
                    data={baseData}
                    margin={{ top: 16, right: 28, left: 16, bottom: 20 }}
                  >
                    <CartesianGrid
                      stroke="#e2e8f0"
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke={axisStroke}
                      tick={axisTickStyle}
                      tickLine={{ stroke: axisStroke }}
                      height={46}
                      label={{
                        value: xAxisTitle,
                        position: "insideBottom",
                        offset: 0,
                        fill: "#475569",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    />
                    <YAxis
                      stroke={axisStroke}
                      tick={axisTickStyle}
                      tickLine={{ stroke: axisStroke }}
                      width={55}
                      label={{
                        value: yAxisTitle,
                        angle: -90,
                        position: "insideLeft",
                        offset: 12,
                        fill: "#334155",
                        fontSize: 12,
                        fontWeight: 600,
                        style: { textAnchor: "middle" },
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: "1px solid #cbd5e1",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{
                        fontSize: 12,
                        fontWeight: 500,
                        paddingTop: 12,
                      }}
                    />
                    <Bar
                      dataKey="value"
                      name={currentChart.label}
                      fill="#155dfc"
                      radius={[4, 4, 0, 0]}
                      barSize={28}
                      stackId={
                        chartType === "stacked-column" ||
                        chartType === "stacked-bar"
                          ? "s"
                          : undefined
                      }
                      {...(level < 2
                        ? {
                            onClick: (d: unknown) => handleBarClick(d as Point),
                            cursor: "pointer" as const,
                          }
                        : {})}
                    />
                    {chartType === "stacked-column" ||
                    chartType === "stacked-bar" ? (
                      <Bar
                        dataKey="value2"
                        name="Secondary"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                        barSize={28}
                        stackId="s"
                      />
                    ) : null}
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Right chart-type toolbar */}
            <ChartTypeToolbar chartType={chartType} onChange={setChartType} />
          </div>
        </div>

        {/* Bottom Footer Bar with Download on the right matching Travel Summary Report */}
        <footer className="flex items-center justify-end px-5 pt-1 pb-3 bg-white dark:bg-slate-900 shrink-0 select-none">
          <div className="flex items-center gap-2 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Download options"
                  className="inline-flex h-7.5 items-center gap-1.5 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white transition-all cursor-pointer active:scale-98"
                >
                  <Download className="h-3.5 w-3.5 text-slate-700 dark:text-slate-300 stroke-[2.2]" />
                  <span>Download</span>
                  <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-44 p-1 text-xs rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md shadow-lg z-50"
              >
                <DropdownMenuItem
                  onClick={() => handleDownload("PDF")}
                  className="cursor-pointer text-xs rounded-sm px-2.5 py-1.5 font-medium text-foreground hover:bg-muted"
                >
                  PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDownload("Excel (XLS)")}
                  className="cursor-pointer text-xs rounded-sm px-2.5 py-1.5 font-medium text-foreground hover:bg-muted"
                >
                  Excel (XLS)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDownload("CSV")}
                  className="cursor-pointer text-xs rounded-sm px-2.5 py-1.5 font-medium text-foreground hover:bg-muted"
                >
                  CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </footer>
      </div>

      {/* Filter Drawer */}
      <ChartFilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        value={filter}
        onChange={(patch) => setFilter((f) => ({ ...f, ...patch }))}
        vehicleGroups={VEHICLE_GROUPS}
        onApply={() => {
          setFilterOpen(false);
          setLevel(0);
          setDrillVehicle(null);
          setDrillDate(null);
          toast.success("Filter applied", {
            description: `${filter.from} → ${filter.to} · ${filter.vehicles.length === 0 ? "all vehicles" : `${filter.vehicles.length} vehicles`}`,
          });
        }}
      />
    </div>
  );
}
