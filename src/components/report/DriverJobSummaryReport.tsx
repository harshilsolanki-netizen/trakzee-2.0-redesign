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
import { driverJobSummaryRows, type DriverJobSummaryRow } from "@/data/reports";
import { cn } from "@/lib/utils";

function IconButton({
  label,
  children,
  onClick,
  disabled,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          onClick={onClick}
          disabled={disabled}
          className="inline-flex h-7 w-7 items-center justify-center rounded border border-input bg-background text-muted-foreground transition-all duration-150 hover:bg-muted hover:text-foreground hover:border-border disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

const SEARCHABLE_COLUMNS = [
  { id: "company", label: "Company" },
  { id: "branch", label: "Branch" },
  { id: "driver", label: "Driver" },
];

export function DriverJobSummaryReport() {
  const [filters, setFilters] = useState<ReportFilters>({
    ...DEFAULT_FILTERS,
    from: "01-12-2024",
    to: "31-12-2024",
  });
  const [configOpen, setConfigOpen] = useState(false);
  const [configTab, setConfigTab] = useState<"quick" | "advanced">("quick");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [modal, setModal] = useState<ModalKind | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>("job-2"); // default expanded like in screenshot
  const [query, setQuery] = useState("");
  const [selectedSearchField, setSelectedSearchField] = useState<string>("all");
  const pageSize = 50;

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return driverJobSummaryRows;
    return driverJobSummaryRows.filter((r) => {
      if (selectedSearchField === "company")
        return r.company.toLowerCase().includes(q);
      if (selectedSearchField === "branch")
        return r.branch.toLowerCase().includes(q);
      if (selectedSearchField === "driver")
        return r.driver.toLowerCase().includes(q);
      return (
        r.company.toLowerCase().includes(q) ||
        r.branch.toLowerCase().includes(q) ||
        r.driver.toLowerCase().includes(q)
      );
    });
  }, [query, selectedSearchField]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleExport = (format: string) => {
    toast.success(`Exporting Driver Job Summary as ${format}`, {
      description: `${filteredRows.length} records exported.`,
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-2 p-2.5 overflow-hidden">
      {/* Action Bar matching minimal subtle slate tint */}
      <header className="flex h-[76px] min-h-[76px] max-h-[76px] shrink-0 items-center justify-between gap-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 px-4 shadow-2xs backdrop-blur-xs">
        {/* Left: Line 1 = Title, Line 2 = Date time, Branch/driver, and Advanced Filter below */}
        <div className="flex flex-col justify-center gap-0.5 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <FavoriteToggle
              reportId="job"
              className="text-muted-foreground hover:text-amber-500"
            />
            <h1 className="text-sm font-bold text-foreground leading-tight tracking-tight whitespace-nowrap">
              Driver Job Summary
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
                {filters.from} 12:00 AM → {filters.to} 11:59 PM
              </span>
              <ChevronDown className="h-2.5 w-2.5 opacity-60" />
            </button>

            <span className="text-muted-foreground/40 font-mono">|</span>

            {/* Driver / Branch Badge */}
            <button
              type="button"
              onClick={() => {
                setConfigTab("quick");
                setConfigOpen(true);
              }}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground cursor-pointer font-normal"
            >
              <span>Planet Eco Building Materials LLC +6 more</span>
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
              <CalendarClock className="h-3.5 w-3.5" />
            </IconButton>
            <IconButton
              label="Column visibility"
              onClick={() => setModal("columns")}
            >
              <Settings className="h-3.5 w-3.5" />
            </IconButton>
            <IconButton label="Chart view" onClick={() => setModal("chart")}>
              <BarChart3 className="h-3.5 w-3.5" />
            </IconButton>
            <IconButton label="Help & guide" onClick={() => setModal("help")}>
              <HelpCircle className="h-3.5 w-3.5" />
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
                onClick={() => toast.success("Driver job data refreshed")}
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </IconButton>
            </div>
          </div>
        </div>
      </header>

      {/* Driver Job Table matching Reference media_1787743965213.png */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-border bg-surface shadow-xs">
        <div className="min-h-0 flex-1 overflow-auto overscroll-contain scroll-smooth">
          <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
            <thead className="sticky top-0 z-10 bg-nav text-nav-foreground text-[11px] select-none">
              <tr className="border-b border-border/40 divide-x divide-white/10">
                <th className="w-10 px-2 py-2.5 text-center font-semibold"></th>
                <th className="px-3 py-2.5 font-semibold">Company</th>
                <th className="px-3 py-2.5 font-semibold">Branch</th>
                <th className="px-3 py-2.5 font-semibold">Driver</th>
                <th className="px-3 py-2.5 text-right font-semibold">
                  Distance
                </th>
                <th className="px-3 py-2.5 text-right font-semibold">
                  Total Job Cost
                </th>
                <th className="px-3 py-2.5 text-right font-semibold">
                  Allocated Job
                </th>
                <th className="px-3 py-2.5 text-right font-semibold text-emerald-300">
                  Completed Without Issue
                </th>
                <th className="px-3 py-2.5 text-right font-semibold text-amber-300">
                  Completed With Issue
                </th>
                <th className="px-3 py-2.5 text-right font-semibold text-rose-300">
                  Failed
                </th>
                <th className="px-3 py-2.5 text-right font-semibold text-rose-300">
                  Total Alert
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border text-foreground">
              {filteredRows.map((row) => {
                const isExpanded = expandedId === row.id;

                return (
                  <tbody key={row.id} className="divide-y divide-border">
                    {/* Primary Driver Job Row */}
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
                          className={cn(
                            "flex h-4.5 w-4.5 items-center justify-center rounded text-[11px] font-bold transition-transform cursor-pointer",
                            isExpanded
                              ? "bg-sky-500 text-white"
                              : "bg-sky-500/15 text-sky-600 hover:bg-sky-500 hover:text-white",
                          )}
                        >
                          {isExpanded ? (
                            <Minus className="h-3 w-3" />
                          ) : (
                            <Plus className="h-3 w-3" />
                          )}
                        </button>
                      </td>
                      <td className="px-3 py-2.5 font-medium text-foreground">
                        {row.company}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {row.branch}
                      </td>
                      <td className="px-3 py-2.5 font-semibold text-foreground">
                        {row.driver}
                      </td>
                      <td className="px-3 py-2.5 text-right font-medium text-foreground">
                        {row.distance.toFixed(1)}
                      </td>
                      <td className="px-3 py-2.5 text-right text-muted-foreground">
                        {row.totalJobCost}
                      </td>
                      <td className="px-3 py-2.5 text-right font-medium text-foreground">
                        {row.allocatedJob}
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        {row.completedWithoutIssue}
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-amber-600 dark:text-amber-400">
                        {row.completedWithIssue}
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-rose-600 dark:text-rose-400">
                        {row.failed}
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-rose-600 dark:text-rose-400">
                        {row.totalAlert}
                      </td>
                    </tr>

                    {/* Expanded Detailed Jobs Sub-Table */}
                    {isExpanded && (
                      <tr className="bg-muted/20">
                        <td colSpan={11} className="p-3 pl-6">
                          <div className="overflow-hidden rounded border border-border/80 bg-surface shadow-xs">
                            {/* Header Banner matching screenshot */}
                            <div className="bg-muted/80 px-3 py-1.5 text-center text-xs font-bold text-foreground border-b border-border">
                              {row.company} - {row.branch} - {row.driver} From :
                              2024-12-01 00:00:00 To 2024-12-31 23:59:00
                            </div>

                            <table className="w-full border-collapse text-left text-xs">
                              <thead className="bg-muted/60 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
                                <tr className="divide-x divide-border/60">
                                  <th className="px-2.5 py-2">Job Name</th>
                                  <th className="px-2.5 py-2">Job ID</th>
                                  <th className="px-2.5 py-2">
                                    Invoice Number
                                  </th>
                                  <th className="px-2.5 py-2">
                                    Shipment Number
                                  </th>
                                  <th className="px-2.5 py-2">Product</th>
                                  <th className="px-2 py-2 text-right">
                                    Quantity
                                  </th>
                                  <th className="px-2.5 py-2">Consign Name</th>
                                  <th className="px-2.5 py-2">Status</th>
                                  <th className="px-2.5 py-2">Planned Start</th>
                                  <th className="px-2.5 py-2">Actual Start</th>
                                  <th className="px-2 py-2 text-center text-rose-600">
                                    Difference
                                  </th>
                                  <th className="px-2.5 py-2 text-right">
                                    Start Odo
                                  </th>
                                  <th className="px-2.5 py-2">Planned End</th>
                                  <th className="px-2.5 py-2">Work End</th>
                                  <th className="px-2.5 py-2">Actual End</th>
                                  <th className="px-2 py-2 text-center text-emerald-600">
                                    Difference
                                  </th>
                                  <th className="px-2.5 py-2 text-right">
                                    End Odo
                                  </th>
                                  <th className="px-2 py-2 text-right">
                                    Job Dist
                                  </th>
                                  <th className="px-2.5 py-2 text-right">
                                    Job Dur
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border text-[11px]">
                                {row.jobs.map((job, idx) => (
                                  <tr
                                    key={idx}
                                    className="hover:bg-muted/40 divide-x divide-border/40"
                                  >
                                    <td
                                      className="px-2.5 py-1.5 font-medium text-foreground truncate max-w-[140px]"
                                      title={job.jobName}
                                    >
                                      {job.jobName}
                                    </td>
                                    <td className="px-2.5 py-1.5 text-muted-foreground">
                                      {job.jobId}
                                    </td>
                                    <td className="px-2.5 py-1.5 text-muted-foreground">
                                      {job.invoiceNumber}
                                    </td>
                                    <td className="px-2.5 py-1.5 text-muted-foreground">
                                      {job.shipmentNumber}
                                    </td>
                                    <td className="px-2.5 py-1.5 text-muted-foreground">
                                      {job.product}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {job.quantity}
                                    </td>
                                    <td className="px-2.5 py-1.5 text-muted-foreground">
                                      {job.consignName}
                                    </td>
                                    <td
                                      className={cn(
                                        "px-2.5 py-1.5 font-medium",
                                        job.status.includes("Error")
                                          ? "text-emerald-600 font-semibold"
                                          : "text-amber-600 font-semibold",
                                      )}
                                    >
                                      {job.status}
                                    </td>
                                    <td className="px-2.5 py-1.5 text-muted-foreground text-[10px]">
                                      {job.plannedStartTime}
                                    </td>
                                    <td className="px-2.5 py-1.5 text-muted-foreground text-[10px]">
                                      {job.actualStartTime}
                                    </td>
                                    <td className="px-2 py-1.5 text-center font-bold text-rose-600">
                                      {job.diffStart}
                                    </td>
                                    <td className="px-2.5 py-1.5 text-right font-medium">
                                      {job.startOdometer.toFixed(1)}
                                    </td>
                                    <td className="px-2.5 py-1.5 text-muted-foreground text-[10px]">
                                      {job.plannedEndTime}
                                    </td>
                                    <td className="px-2.5 py-1.5 text-muted-foreground text-[10px]">
                                      {job.workEndTime}
                                    </td>
                                    <td className="px-2.5 py-1.5 text-muted-foreground text-[10px]">
                                      {job.actualEndTime}
                                    </td>
                                    <td className="px-2 py-1.5 text-center font-bold text-emerald-600">
                                      {job.diffEnd}
                                    </td>
                                    <td className="px-2.5 py-1.5 text-right font-medium">
                                      {job.endOdometer.toFixed(1)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right font-semibold">
                                      {job.jobDistance.toFixed(1)}
                                    </td>
                                    <td className="px-2.5 py-1.5 text-right font-medium text-foreground">
                                      {job.jobDuration}
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
        objectOptions={driverJobSummaryRows.map((r) => ({
          id: r.id,
          label: r.driver,
          imei: "861234567890123",
          branch: r.branch,
        }))}
        onApply={() => {
          setConfigOpen(false);
          toast.success("Filters applied — driver job data updated");
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
          { key: "company", label: "Company" },
          { key: "branch", label: "Branch" },
          { key: "driver", label: "Driver" },
          { key: "distance", label: "Distance" },
          { key: "allocatedJob", label: "Allocated Job" },
          { key: "completedWithoutIssue", label: "Completed Without Issue" },
          { key: "completedWithIssue", label: "Completed With Issue" },
          { key: "failed", label: "Failed" },
          { key: "totalAlert", label: "Total Alert" },
        ]}
        hidden={[]}
        onToggleColumn={() => {}}
        chartType="Bar"
        onChartType={(t) => toast.success(`${t} chart selected`)}
      />
    </div>
  );
}
