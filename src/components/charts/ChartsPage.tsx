import { useLocation, useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Download,
  SlidersHorizontal,
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

  /* fuel toggles */
  const [toggles, setToggles] = useState({
    fuel: true,
    fuelRaw: false,
    ignition: true,
    speed: false,
    power: false,
  });

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

  const crumbs: { label: string; onClick?: () => void }[] = [
    {
      label: currentChart.categoryLabel,
    },
    {
      label: currentChart.label,
      ...(level > 0
        ? {
            onClick: () => (
              setLevel(0),
              setDrillVehicle(null),
              setDrillDate(null)
            ),
          }
        : {}),
    },
  ];
  if (drillVehicle) {
    crumbs.push({
      label: drillVehicle,
      ...(level === 2
        ? { onClick: () => (setLevel(1), setDrillDate(null)) }
        : {}),
    });
  }
  if (drillDate) {
    crumbs.push({ label: drillDate });
  }

  const chartTitle = isFuel
    ? `Fuel Fill-Drain · ${drillVehicle ?? CHART_VEHICLES[0]}`
    : `${currentChart.label} (${currentChart.unit})`;

  const handleDownload = (label: string) =>
    toast.success(`Generating ${label} report…`, {
      description: `${chartTitle} · ${filter.from} → ${filter.to}`,
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

  const chartVehicleBadgeLabel = useMemo(() => {
    if (filter.vehicles.length === 1) {
      return filter.vehicles[0];
    }
    if (filter.vehicles.length > 1) {
      return `${filter.vehicles[0]} +${filter.vehicles.length - 1} more`;
    }
    const first = CHART_VEHICLES[0] || "GJ15MM2654";
    return `${first} +${CHART_VEHICLES.length - 1} more`;
  }, [filter.vehicles]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-3 p-3 overflow-hidden">
      {/* Chart action header matching reference image */}
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-4 rounded-md border border-border bg-surface px-4 py-3 shadow-xs min-h-[64px]">
        {/* Left: Breadcrumbs on top, Date + Vehicle + Advanced Filter below */}
        <div className="flex flex-col gap-1.5 min-w-0">
          {/* Top Level: Primary chart label + secondary grey drilldown text */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2">
            {/* Primary Chart Label */}
            {level === 0 ? (
              <h1 className="text-base font-bold text-foreground leading-tight tracking-tight">
                {currentChart.label}
              </h1>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setLevel(0);
                  setDrillVehicle(null);
                  setDrillDate(null);
                }}
                className="text-base font-bold text-foreground transition-colors hover:text-brand hover:underline cursor-pointer leading-tight tracking-tight"
              >
                {currentChart.label}
              </button>
            )}

            {/* Level 1: Vehicle Name (Secondary grey text) */}
            {drillVehicle && level >= 1 && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                {level === 1 ? (
                  <span className="text-xs font-medium text-muted-foreground">
                    {drillVehicle}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setLevel(1);
                      setDrillDate(null);
                    }}
                    className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline cursor-pointer"
                  >
                    {drillVehicle}
                  </button>
                )}
              </>
            )}

            {/* Level 2: Date (Secondary grey text) */}
            {drillDate && level === 2 && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                <span className="text-xs font-medium text-muted-foreground">
                  {drillDate}
                </span>
              </>
            )}
          </nav>

          {/* Bottom Level: Date Badge + Vehicle Badge + Advanced Filter (Border/stroke removed) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Date Selector Badge (Opens Quick Filter / Date tab) */}
            <button
              type="button"
              title="Click to edit date range"
              onClick={() => {
                setFilterOpen(true);
              }}
              className="inline-flex h-6.5 items-center gap-1 rounded px-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer font-normal"
            >
              <span>
                {filter.from} 12:00 AM → {filter.to} 11:59 PM
              </span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>

            {/* Vehicle Selector Badge (Opens Quick Filter / Vehicles tab) */}
            <button
              type="button"
              title="Click to select vehicles"
              onClick={() => {
                setFilterOpen(true);
              }}
              className="inline-flex h-6.5 items-center gap-1 rounded px-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer font-normal"
            >
              <span>{chartVehicleBadgeLabel}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
          </div>
        </div>

        {/* Right Controls: Download & Filter matching Report screen CTA size (h-7) */}
        <div className="flex items-center gap-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Download options"
                className="flex h-7 items-center gap-1 rounded border border-input bg-background px-2 text-[11px] font-medium text-foreground transition-colors hover:bg-muted cursor-pointer select-none shadow-2xs"
              >
                <Download className="h-3 w-3 text-muted-foreground" />
                <span>Download</span>
                <ChevronDown className="h-2.5 w-2.5 opacity-60 ml-0.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 p-1 text-xs">
              <DropdownMenuItem
                onClick={() => handleDownload("PDF")}
                className="cursor-pointer text-xs rounded px-2 py-1.5"
              >
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDownload("Excel (XLS)")}
                className="cursor-pointer text-xs rounded px-2 py-1.5"
              >
                Excel (XLS)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDownload("CSV")}
                className="cursor-pointer text-xs rounded px-2 py-1.5"
              >
                CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            type="button"
            aria-label="Filter"
            onClick={() => {
              setFilterOpen(true);
            }}
            className="inline-flex h-7 items-center gap-1.5 rounded bg-brand px-2.5 text-[11px] font-semibold text-brand-foreground shadow-2xs transition-opacity duration-150 hover:opacity-90 cursor-pointer"
          >
            <SlidersHorizontal className="h-3 w-3" />
            <span>Filter</span>
          </button>
        </div>
      </header>

      {/* Split-pane main content */}
      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[290px_1fr]">
        {/* left data list */}
        <div className="flex min-h-0 flex-col overflow-hidden rounded-md border border-border bg-surface shadow-xs">
          <div className="flex items-center justify-between border-b border-border bg-surface-muted/50 px-3 py-2">
            <h2 className="text-xs font-bold text-foreground">Data</h2>
            <span className="rounded bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand">
              {currentChart.unit}
            </span>
          </div>

          <div className={cn("min-h-0 flex-1 overflow-auto", SCROLL)}>
            {isFuel ? (
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-surface-muted border-b border-border">
                  <tr>
                    <th className="px-2.5 py-1.5 text-left font-semibold text-muted-foreground">
                      Start Time
                    </th>
                    <th className="px-2.5 py-1.5 text-left font-semibold text-muted-foreground">
                      End Time
                    </th>
                    <th className="px-2.5 py-1.5 text-right font-semibold text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fuelEvts.map((e) => (
                    <tr
                      key={e.id}
                      className="border-t border-border hover:bg-muted/60 transition-colors"
                    >
                      <td className="px-2.5 py-1.5 tabular-nums font-medium">
                        {e.start}
                      </td>
                      <td className="px-2.5 py-1.5 tabular-nums text-muted-foreground">
                        {e.end}
                      </td>
                      <td className="px-2.5 py-1.5 text-right">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold",
                            e.valid
                              ? "bg-success/15 text-success"
                              : "bg-danger/15 text-danger",
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
                <thead className="sticky top-0 bg-surface-muted border-b border-border">
                  <tr>
                    {level === 0 ? (
                      <>
                        <th className="px-2.5 py-1.5 text-left font-semibold text-muted-foreground">
                          Sr No
                        </th>
                        <th className="px-2.5 py-1.5 text-left font-semibold text-muted-foreground">
                          Object
                        </th>
                        <th className="px-2.5 py-1.5 text-right font-semibold text-muted-foreground">
                          {currentChart.label} ({currentChart.unit})
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="px-2.5 py-1.5 text-left font-semibold text-muted-foreground">
                          {level === 1 ? "Date" : "Time"}
                        </th>
                        <th className="px-2.5 py-1.5 text-right font-semibold text-muted-foreground">
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
                        "border-t border-border hover:bg-muted/70 transition-colors",
                        level < 2 && "cursor-pointer",
                      )}
                    >
                      {level === 0 ? (
                        <>
                          <td className="px-2.5 py-2 tabular-nums text-muted-foreground">
                            {r.sr}
                          </td>
                          <td className="px-2.5 py-2 font-medium text-foreground">
                            {r.name}
                          </td>
                          <td className="px-2.5 py-2 text-right tabular-nums font-semibold text-foreground">
                            {r.value.toFixed(2)}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-2.5 py-2 font-medium text-foreground">
                            {r.name}
                          </td>
                          <td className="px-2.5 py-2 text-right tabular-nums font-semibold text-foreground">
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

          {!isFuel && level < 2 ? (
            <p className="border-t border-border bg-surface-muted/30 px-2.5 py-1.5 text-[11px] text-muted-foreground">
              💡 Click any vehicle or date row to drill down.
            </p>
          ) : null}
        </div>

        {/* right canvas area with chart type toolbar */}
        <div className="relative flex min-h-0">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col rounded-md border border-border bg-surface p-3 shadow-xs">
            {/* contextual fuel controls */}
            {isFuel ? (
              <div className="mb-3 flex flex-wrap items-center gap-2 border-b border-border pb-2.5">
                {(
                  [
                    ["fuel", "Fuel Algorithm"],
                    ["fuelRaw", "Fuel Raw Data"],
                    ["ignition", "Ignition"],
                    ["speed", "Speed"],
                    ["power", "Power"],
                  ] as const
                ).map(([key, label]) => (
                  <label
                    key={key}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-surface-muted px-2.5 py-1 text-[11px] font-medium transition-colors hover:bg-muted"
                  >
                    <input
                      type="checkbox"
                      checked={toggles[key]}
                      onChange={() =>
                        setToggles((t) => ({ ...t, [key]: !t[key] }))
                      }
                    />
                    {label}
                  </label>
                ))}
                <span className="inline-flex items-center rounded-full bg-brand/15 px-2.5 py-1 text-[11px] font-semibold text-brand">
                  Total correction: {totalCorrection} ltr
                </span>
              </div>
            ) : null}

            <div className="min-h-0 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                {isFuel ? (
                  <ComposedChart
                    data={fuelData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
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
                      height={42}
                      label={{
                        value: "Time (HH:mm)",
                        position: "insideBottom",
                        offset: -6,
                        fill: "#334155",
                        fontSize: 12,
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
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 6 }} />
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
                    <Legend wrapperStyle={{ fontSize: 12 }} />
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
                    margin={{ top: 20, right: 28, left: 16, bottom: 28 }}
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
                      height={45}
                      interval={0}
                      label={{
                        value: xAxisTitle,
                        position: "insideBottom",
                        offset: -6,
                        fill: "#334155",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    />
                    <YAxis
                      stroke={axisStroke}
                      tick={axisTickStyle}
                      tickLine={{ stroke: axisStroke }}
                      width={65}
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
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 4 }} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name={chartTitle}
                      stroke="#155dfc"
                      strokeWidth={2.5}
                      dot={{
                        r: 4,
                        fill: "#155dfc",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart
                    data={baseData}
                    layout={
                      chartType === "bar-horizontal" ||
                      chartType === "stacked-bar"
                        ? "vertical"
                        : "horizontal"
                    }
                    margin={{ top: 20, right: 28, left: 16, bottom: 28 }}
                  >
                    <CartesianGrid
                      stroke="#e2e8f0"
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    {chartType === "bar-horizontal" ||
                    chartType === "stacked-bar" ? (
                      <>
                        <XAxis
                          type="number"
                          stroke={axisStroke}
                          tick={axisTickStyle}
                          tickLine={{ stroke: axisStroke }}
                          height={45}
                          label={{
                            value: yAxisTitle,
                            position: "insideBottom",
                            offset: -6,
                            fill: "#334155",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={100}
                          stroke={axisStroke}
                          tick={axisTickStyle}
                          tickLine={{ stroke: axisStroke }}
                          label={{
                            value: xAxisTitle,
                            angle: -90,
                            position: "insideLeft",
                            offset: 12,
                            fill: "#334155",
                            fontSize: 12,
                            fontWeight: 600,
                            style: { textAnchor: "middle" },
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <XAxis
                          dataKey="name"
                          stroke={axisStroke}
                          tick={axisTickStyle}
                          tickLine={{ stroke: axisStroke }}
                          height={45}
                          interval={0}
                          label={{
                            value: xAxisTitle,
                            position: "insideBottom",
                            offset: -6,
                            fill: "#334155",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        />
                        <YAxis
                          stroke={axisStroke}
                          tick={axisTickStyle}
                          tickLine={{ stroke: axisStroke }}
                          width={65}
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
                      </>
                    )}
                    <Tooltip
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: "1px solid #cbd5e1",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 4 }} />
                    <Bar
                      dataKey="value"
                      name={chartTitle}
                      fill="#155dfc"
                      radius={[4, 4, 0, 0]}
                      barSize={28}
                      {...(chartType === "stacked-column" ||
                      chartType === "stacked-bar"
                        ? { stackId: "s" }
                        : {})}
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
          </div>

          {/* right chart-type toolbar */}
          <ChartTypeToolbar chartType={chartType} onChange={setChartType} />
        </div>
      </div>

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
