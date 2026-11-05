import React, { useState, useMemo } from "react";
import {
  CloudDownload,
  Search,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronLeft,
  FileSpreadsheet,
  Video,
  ChevronDown,
  Check,
  Download,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { TablePaginationBar } from "@/components/common/TablePaginationBar";
import {
  CloudDateTimeRangePicker,
  type CloudDateTimeRangeValue,
} from "@/components/cloud/CloudDateTimeRangePicker";
import {
  CloudDownloadFilterDrawer,
  type CloudDownloadFilters,
  DEFAULT_CLOUD_FILTERS,
} from "@/components/cloud/CloudDownloadFilterDrawer";
import { useCloudDownload } from "@/components/cloud/CloudDownloadContext";
import { DownloadOverlayMenu, type CompletedDownloadItem } from "@/components/cloud/DownloadOverlayMenu";
import { cn } from "@/lib/utils";

export type CloudTaskStatus = "Completed" | "In Progress" | "Failed";

export interface CloudDownloadTask {
  id: string;
  company: string;
  branch: string;
  plateNo: string;
  channelNo: string;
  task: string;
  startTime: string;
  endTime: string;
  requestedBy: string;
  requestedTime: string;
  status: CloudTaskStatus;
  completionTime: string;
  fileSize?: string;
  fileFormat?: string;
}

// Exactly matches tasks in reference media_1793781387873_9c10d6a4.png
const INITIAL_TASKS: CloudDownloadTask[] = [
  {
    id: "CD-8841",
    company: "HP Company",
    branch: "--",
    plateNo: "--",
    channelNo: "--",
    task: "Travel Summary",
    startTime: "04/11/2026 12:00 AM",
    endTime: "04/11/2026 11:02 AM",
    requestedBy: "hpcompany@yopmail.com",
    requestedTime: "04/11/2026 11:10 AM",
    status: "Completed",
    completionTime: "04/11/2026 11:10 AM",
    fileSize: "2.8 MB",
    fileFormat: "CSV",
  },
  {
    id: "CD-8840",
    company: "HP Company",
    branch: "HP Branch 1",
    plateNo: "HP Howen Object 1",
    channelNo: "Channel 3",
    task: "Travel Summary",
    startTime: "04/11/2026 12:50 AM",
    endTime: "04/11/2026 01:05 AM",
    requestedBy: "hpadmin@yopmail.com",
    requestedTime: "04/11/2026 10:43 AM",
    status: "Completed",
    completionTime: "04/11/2026 10:43 AM",
    fileSize: "1.4 MB",
    fileFormat: "CSV",
  },
  {
    id: "CD-8839",
    company: "HP Company",
    branch: "All",
    plateNo: "--",
    channelNo: "--",
    task: "Travel Summary",
    startTime: "04/11/2026 12:00 AM",
    endTime: "04/11/2026 10:30 AM",
    requestedBy: "hpcompany@yopmail.com",
    requestedTime: "04/11/2026 10:32 AM",
    status: "Completed",
    completionTime: "04/11/2026 10:32 AM",
    fileSize: "3.2 MB",
    fileFormat: "CSV",
  },
  {
    id: "CD-8838",
    company: "HP Company",
    branch: "All",
    plateNo: "--",
    channelNo: "--",
    task: "Travel Summary",
    startTime: "04/11/2026 12:00 AM",
    endTime: "04/11/2026 09:36 AM",
    requestedBy: "hpcompany@yopmail.com",
    requestedTime: "04/11/2026 09:37 AM",
    status: "Completed",
    completionTime: "04/11/2026 09:37 AM",
    fileSize: "2.4 MB",
    fileFormat: "CSV",
  },
  {
    id: "CD-8837",
    company: "HP Company",
    branch: "All",
    plateNo: "--",
    channelNo: "--",
    task: "Travel Summary",
    startTime: "04/11/2026 12:00 AM",
    endTime: "04/11/2026 09:36 AM",
    requestedBy: "hpcompany@yopmail.com",
    requestedTime: "04/11/2026 09:37 AM",
    status: "Completed",
    completionTime: "04/11/2026 09:37 AM",
    fileSize: "2.4 MB",
    fileFormat: "CSV",
  },
  {
    id: "CD-8836",
    company: "HP Company",
    branch: "All",
    plateNo: "--",
    channelNo: "--",
    task: "Travel Summary",
    startTime: "04/11/2026 12:00 AM",
    endTime: "04/11/2026 09:35 AM",
    requestedBy: "hpcompany@yopmail.com",
    requestedTime: "04/11/2026 09:35 AM",
    status: "Completed",
    completionTime: "04/11/2026 09:35 AM",
    fileSize: "2.1 MB",
    fileFormat: "CSV",
  },
  {
    id: "CD-8835",
    company: "FleetCorp",
    branch: "Valsad",
    plateNo: "HR55AC5305",
    channelNo: "CH-01 (Front)",
    task: "Video Telematics Download",
    startTime: "04/11/2026 08:00 AM",
    endTime: "04/11/2026 09:15 AM",
    requestedBy: "fleetmgr@fleetcorp.com",
    requestedTime: "04/11/2026 09:20 AM",
    status: "Completed",
    completionTime: "04/11/2026 09:24 AM",
    fileSize: "36.8 MB",
    fileFormat: "MP4",
  },
  {
    id: "CD-8834",
    company: "FleetCorp",
    branch: "Surat",
    plateNo: "GJ15BQ1180",
    channelNo: "--",
    task: "Speed & Sensor Telemetry",
    startTime: "04/11/2026 06:00 AM",
    endTime: "04/11/2026 09:30 AM",
    requestedBy: "fleetmgr@fleetcorp.com",
    requestedTime: "04/11/2026 09:38 AM",
    status: "In Progress",
    completionTime: "--",
    fileSize: "Processing...",
    fileFormat: "XLSX",
  },
  {
    id: "CD-8833",
    company: "LogisticsPro",
    branch: "Ahmedabad",
    plateNo: "GJ01AB1234",
    channelNo: "CH-02 (Cabin)",
    task: "Video Telematics Download",
    startTime: "04/11/2026 07:00 AM",
    endTime: "04/11/2026 08:45 AM",
    requestedBy: "ops@logisticspro.com",
    requestedTime: "04/11/2026 08:50 AM",
    status: "Completed",
    completionTime: "04/11/2026 08:55 AM",
    fileSize: "48.2 MB",
    fileFormat: "MP4",
  },
  {
    id: "CD-8832",
    company: "LogisticsPro",
    branch: "Vadodara",
    plateNo: "GJ06CD5678",
    channelNo: "--",
    task: "Fuel Consumption Summary",
    startTime: "04/11/2026 12:00 AM",
    endTime: "04/11/2026 08:30 AM",
    requestedBy: "ops@logisticspro.com",
    requestedTime: "04/11/2026 08:35 AM",
    status: "Completed",
    completionTime: "04/11/2026 08:36 AM",
    fileSize: "1.8 MB",
    fileFormat: "CSV",
  },
  {
    id: "CD-8831",
    company: "Uffizio Global",
    branch: "Valsad",
    plateNo: "HR55AC5305",
    channelNo: "--",
    task: "Engine Diagnostics & DTC",
    startTime: "04/11/2026 05:00 AM",
    endTime: "04/11/2026 08:00 AM",
    requestedBy: "admin@uffizio.com",
    requestedTime: "04/11/2026 08:05 AM",
    status: "Completed",
    completionTime: "04/11/2026 08:08 AM",
    fileSize: "3.2 MB",
    fileFormat: "XLSX",
  },
  {
    id: "CD-8830",
    company: "Uffizio Global",
    branch: "Surat",
    plateNo: "GJ05XY9900",
    channelNo: "--",
    task: "Trip Playback Export",
    startTime: "04/11/2026 02:00 AM",
    endTime: "04/11/2026 07:30 AM",
    requestedBy: "suratops@uffizio.com",
    requestedTime: "04/11/2026 07:35 AM",
    status: "In Progress",
    completionTime: "--",
    fileSize: "Generating...",
    fileFormat: "CSV",
  },
];

const SEARCH_COLUMNS = [
  { id: "company", label: "Company" },
  { id: "branch", label: "Branch" },
  { id: "plateNo", label: "Plate No" },
  { id: "channelNo", label: "Channel No" },
  { id: "task", label: "Task" },
  { id: "requestedBy", label: "Requested By" },
  { id: "status", label: "Status" },
];

const COMPANY_OPTIONS = ["All", "HP Company", "FleetCorp", "LogisticsPro", "Uffizio Global"];
const BRANCH_OPTIONS = ["All", "HP Branch 1", "Valsad", "Surat", "Ahmedabad", "Vadodara"];
const STATUS_OPTIONS = ["All", "Completed", "In Progress", "Failed"];
const REQUEST_FOR_OPTIONS = [
  "All",
  "Travel Summary",
  "Video Telematics Download",
  "Speed & Sensor Telemetry",
  "Fuel Consumption Summary",
  "Engine Diagnostics & DTC",
  "Trip Playback Export",
];

export function CloudDownloadPage() {
  const [tasks] = useState<CloudDownloadTask[]>(INITIAL_TASKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSearchField, setSelectedSearchField] = useState<string>("ALL");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Global cloud download progress manager
  const {
    activeDownload,
    isDownloading,
    progress,
    startDownload,
    startExportAll,
  } = useCloudDownload();

  // Filter drawer state
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [completedOverlayItems, setCompletedOverlayItems] = useState<CompletedDownloadItem[]>([
    {
      id: "dl-card-1",
      taskName: "Travel Summary",
      fileName: "travel_summary_CD-8841.csv",
    },
    {
      id: "dl-card-2",
      taskName: "Travel Summary",
      fileName: "travel_summary_CD-8840.csv",
    },
  ]);
  const [filters, setFilters] = useState<CloudDownloadFilters>(DEFAULT_CLOUD_FILTERS);

  // Quick toolbar popover states
  const [companyPopoverOpen, setCompanyPopoverOpen] = useState(false);
  const [branchPopoverOpen, setBranchPopoverOpen] = useState(false);

  // Pagination states matching ReportPage
  const [pageSize, setPageSize] = useState<number>(20);
  const [page, setPage] = useState<number>(1);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.company !== "All") count++;
    if (filters.branch !== "All") count++;
    if (filters.status !== "All") count++;
    if (filters.downloadRequestFor !== "All") count++;
    if (filters.dateTime.preset !== "Today") count++;
    return count;
  }, [filters]);

  const handleDownload = (task: CloudDownloadTask) => {
    if (task.status !== "Completed") {
      toast.error("Download unavailable", {
        description: "This task is currently in progress. Please wait for completion.",
      });
      return;
    }
    // Triggers smooth download animation in top bar and row, followed by browser file download
    startDownload(task);
    setCompletedOverlayItems((prev) => [
      {
        id: `dl-${task.id}-${Date.now()}`,
        taskName: task.task,
        fileName: `${task.task.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${task.id}.csv`,
      },
      ...prev.slice(0, 3),
    ]);
  };

  const handleExportAll = () => {
    if (filteredTasks.length === 0) {
      toast.error("No records to export");
      return;
    }
    startExportAll(filteredTasks);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedSearchField("ALL");
    setFilters(DEFAULT_CLOUD_FILTERS);
    setSortDir("desc");
    setPage(1);
    toast.info("Filters reset to default");
  };

  // Filter tasks strictly by the reference filter parameters + search query
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        const q = searchQuery.toLowerCase().trim();
        let matchesSearch = true;
        if (q) {
          if (selectedSearchField === "plateNo") {
            matchesSearch = t.plateNo.toLowerCase().includes(q);
          } else if (selectedSearchField === "task") {
            matchesSearch = t.task.toLowerCase().includes(q);
          } else if (selectedSearchField === "requestedBy") {
            matchesSearch = t.requestedBy.toLowerCase().includes(q);
          } else if (selectedSearchField === "company") {
            matchesSearch = t.company.toLowerCase().includes(q);
          } else if (selectedSearchField === "branch") {
            matchesSearch = t.branch.toLowerCase().includes(q);
          } else if (selectedSearchField === "channelNo") {
            matchesSearch = t.channelNo.toLowerCase().includes(q);
          } else if (selectedSearchField === "status") {
            matchesSearch = t.status.toLowerCase().includes(q);
          } else {
            matchesSearch =
              t.task.toLowerCase().includes(q) ||
              t.plateNo.toLowerCase().includes(q) ||
              t.requestedBy.toLowerCase().includes(q) ||
              t.company.toLowerCase().includes(q) ||
              t.branch.toLowerCase().includes(q) ||
              t.channelNo.toLowerCase().includes(q) ||
              t.status.toLowerCase().includes(q) ||
              t.id.toLowerCase().includes(q);
          }
        }

        const matchesCompany =
          filters.company === "All" || t.company.toLowerCase() === filters.company.toLowerCase();

        const matchesBranch =
          filters.branch === "All" ||
          t.branch.toLowerCase() === filters.branch.toLowerCase() ||
          (filters.branch === "All" && (t.branch === "--" || t.branch === "All"));

        const matchesStatus =
          filters.status === "All" || t.status.toLowerCase() === filters.status.toLowerCase();

        const matchesRequestFor =
          filters.downloadRequestFor === "All" ||
          t.task.toLowerCase() === filters.downloadRequestFor.toLowerCase();

        return matchesSearch && matchesCompany && matchesBranch && matchesStatus && matchesRequestFor;
      })
      .sort((a, b) => {
        const dir = sortDir === "asc" ? 1 : -1;
        return a.requestedTime.localeCompare(b.requestedTime) * dir;
      });
  }, [tasks, searchQuery, selectedSearchField, filters, sortDir]);

  const paginatedTasks = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTasks.slice(start, start + pageSize);
  }, [filteredTasks, page, pageSize]);

  const selectedSearchFieldLabel =
    selectedSearchField === "ALL"
      ? "All fields"
      : SEARCH_COLUMNS.find((c) => c.id === selectedSearchField)?.label || selectedSearchField;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#F0F0F0] dark:bg-slate-950 p-[10px]">
      <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white dark:bg-slate-900 rounded-xl border border-[#DFE3EB]/80 dark:border-slate-800 shadow-2xs">
        {/* 1. Top Title Header Row: Star replaced with back chevron; clean header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2.5 select-none shrink-0 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="p-1 -ml-1 rounded text-slate-700 dark:text-slate-200 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              title="Go Back"
            >
              <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
            </button>
            <h1 className="text-[24px] font-medium text-slate-900 dark:text-white tracking-tight">
              Cloud Download
            </h1>
          </div>
        </div>

        {/* 2. Toolbar Row: From-To Date/Time ahead of Company (matching Report screen), then Branch, then Filter */}
        <div className="relative z-20 flex min-h-[48px] items-center justify-between gap-4 bg-white dark:bg-slate-900 px-5 pt-1 pb-3.5 shrink-0 select-none">
          {/* Left: Date/Time (Ahead of Company), Company, Branch, and Filter */}
          <div className="flex items-center min-w-0 flex-1 overflow-x-auto scrollbar-none gap-2">
            {/* Ahead of Company: Exact Date Range & Time Range Popover from Report Screen */}
            <CloudDateTimeRangePicker
              value={filters.dateTime}
              onChange={(newDateTime) => {
                setFilters((prev) => ({ ...prev, dateTime: newDateTime }));
                setPage(1);
              }}
            />

            <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 shrink-0 mx-0.5" />

            {/* Company : */}
            <Popover open={companyPopoverOpen} onOpenChange={setCompanyPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "inline-flex h-7.5 items-center gap-1.5 rounded-md px-2 text-xs transition-colors cursor-pointer select-none hover:bg-muted/70 shrink-0",
                    companyPopoverOpen && "bg-muted"
                  )}
                >
                  <span className="font-normal text-slate-500 dark:text-slate-400">Company :</span>
                  <span className="font-semibold text-slate-900 dark:text-white max-w-[110px] truncate">
                    {filters.company}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 text-slate-500 shrink-0 transition-transform duration-200",
                      companyPopoverOpen && "rotate-180"
                    )}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={4}
                className="w-48 p-1 text-xs bg-popover/98 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-50 select-none space-y-0.5"
              >
                {COMPANY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, company: opt }));
                      setCompanyPopoverOpen(false);
                      setPage(1);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-2.5 py-1.5 rounded-sm text-xs transition-colors cursor-pointer select-none text-left",
                      filters.company === opt
                        ? "bg-[#0089FF]/10 text-[#0089FF] font-semibold"
                        : "text-foreground hover:bg-muted font-medium"
                    )}
                  >
                    <span>{opt}</span>
                    {filters.company === opt && <Check className="h-3.5 w-3.5 text-[#0089FF]" />}
                  </button>
                ))}
              </PopoverContent>
            </Popover>

            <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 shrink-0 mx-0.5" />

            {/* Branch : */}
            <Popover open={branchPopoverOpen} onOpenChange={setBranchPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "inline-flex h-7.5 items-center gap-1.5 rounded-md px-2 text-xs transition-colors cursor-pointer select-none hover:bg-muted/70 shrink-0",
                    branchPopoverOpen && "bg-muted"
                  )}
                >
                  <span className="font-normal text-slate-500 dark:text-slate-400">Branch :</span>
                  <span className="font-semibold text-slate-900 dark:text-white max-w-[110px] truncate">
                    {filters.branch}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 text-slate-500 shrink-0 transition-transform duration-200",
                      branchPopoverOpen && "rotate-180"
                    )}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={4}
                className="w-48 p-1 text-xs bg-popover/98 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-50 select-none space-y-0.5"
              >
                {BRANCH_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, branch: opt }));
                      setBranchPopoverOpen(false);
                      setPage(1);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-2.5 py-1.5 rounded-sm text-xs transition-all cursor-pointer text-left",
                      filters.branch === opt
                        ? "bg-[#0089FF]/10 text-[#0089FF] font-semibold"
                        : "text-foreground hover:bg-muted font-medium"
                    )}
                  >
                    <span>{opt}</span>
                    {filters.branch === opt && <Check className="h-3.5 w-3.5 text-[#0089FF]" />}
                  </button>
                ))}
              </PopoverContent>
            </Popover>

            <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 shrink-0 mx-0.5" />

            {/* Filter Button (beside company and branch) */}
            <button
              type="button"
              onClick={() => setFilterDrawerOpen((prev) => !prev)}
              className={cn(
                "inline-flex h-7.5 items-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold transition-colors cursor-pointer select-none shadow-2xs shrink-0",
                filterDrawerOpen || activeFilterCount > 0
                  ? "border-[#0089FF] bg-[#0089FF]/10 text-[#0089FF]"
                  : "border-border/80 bg-background text-foreground hover:bg-muted"
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#0089FF] text-[9.5px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Right: Search Box only */}
          <div className="flex items-center gap-2.5 shrink-0 ml-auto">
            <div className="relative flex h-7.5 items-center rounded-md border border-border/80 bg-background shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all overflow-hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    title="Select specific column to search"
                    className="flex h-full items-center gap-1 border-r border-border/60 bg-muted/30 px-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0 select-none"
                  >
                    <span className="max-w-[76px] truncate">
                      {selectedSearchField === "ALL" ? "All fields" : selectedSearchFieldLabel}
                    </span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="max-h-64 w-48 overflow-y-auto text-xs p-1 rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md shadow-lg z-50 select-none"
                >
                  <DropdownMenuItem
                    onClick={() => setSelectedSearchField("ALL")}
                    className={cn(
                      "cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors select-none",
                      selectedSearchField === "ALL"
                        ? "bg-muted font-semibold text-foreground"
                        : "text-foreground hover:bg-muted/80 font-medium"
                    )}
                  >
                    <span>All fields</span>
                    {selectedSearchField === "ALL" && <Check className="h-3.5 w-3.5 text-[#0089FF]" />}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 -mx-1" />
                  {SEARCH_COLUMNS.map((c) => {
                    const isSelected = selectedSearchField === c.id;
                    return (
                      <DropdownMenuItem
                        key={c.id}
                        onClick={() => setSelectedSearchField(c.id)}
                        className={cn(
                          "cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors select-none",
                          isSelected
                            ? "bg-muted font-semibold text-foreground"
                            : "text-foreground hover:bg-muted/80 font-medium"
                        )}
                      >
                        <span className="truncate">{c.label}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-[#0089FF]" />}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              <Search className="ml-2.5 h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder={
                  selectedSearchField === "ALL"
                    ? "Search in all fields..."
                    : `Search ${selectedSearchFieldLabel}...`
                }
                className="h-full w-36 sm:w-48 bg-transparent px-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="mr-1.5 rounded-full p-0.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Horizontal divider with 20px space from left and right */}
        <div className="mx-5 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0" />

        {/* 3. Table Scroll Area */}
        <div className="relative min-h-0 flex-1 overflow-auto overscroll-contain scroll-smooth pt-1 mx-5 bg-white dark:bg-slate-900">
          <table className="w-full min-w-[1050px] text-xs border-collapse">
            <thead className="sticky top-0 z-20 shadow-xs">
              <tr className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold tracking-wider text-[11px] uppercase border-b border-[#DFE3EB] dark:border-slate-700 select-none">
                <th
                  scope="col"
                  className="sticky left-0 z-30 w-10 min-w-[40px] max-w-[40px] bg-white dark:bg-slate-900 px-3 py-2 text-center text-slate-500 font-bold border-b border-[#DFE3EB] dark:border-slate-700 align-middle"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 overflow-hidden text-ellipsis whitespace-nowrap select-none bg-white dark:bg-slate-900 border-b border-[#DFE3EB] dark:border-slate-700 align-middle text-left"
                >
                  Branch
                </th>
                <th
                  scope="col"
                  className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 overflow-hidden text-ellipsis whitespace-nowrap select-none bg-white dark:bg-slate-900 border-b border-[#DFE3EB] dark:border-slate-700 align-middle text-left"
                >
                  Plate No
                </th>
                <th
                  scope="col"
                  className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 overflow-hidden text-ellipsis whitespace-nowrap select-none bg-white dark:bg-slate-900 border-b border-[#DFE3EB] dark:border-slate-700 align-middle text-left"
                >
                  Channel No
                </th>
                <th
                  scope="col"
                  className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 overflow-hidden text-ellipsis whitespace-nowrap select-none bg-white dark:bg-slate-900 border-b border-[#DFE3EB] dark:border-slate-700 align-middle text-left"
                >
                  Task
                </th>
                <th
                  scope="col"
                  className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 overflow-hidden text-ellipsis whitespace-nowrap select-none bg-white dark:bg-slate-900 border-b border-[#DFE3EB] dark:border-slate-700 align-middle text-left"
                >
                  Start time
                </th>
                <th
                  scope="col"
                  className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 overflow-hidden text-ellipsis whitespace-nowrap select-none bg-white dark:bg-slate-900 border-b border-[#DFE3EB] dark:border-slate-700 align-middle text-left"
                >
                  End Time
                </th>
                <th
                  scope="col"
                  className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 overflow-hidden text-ellipsis whitespace-nowrap select-none bg-white dark:bg-slate-900 border-b border-[#DFE3EB] dark:border-slate-700 align-middle text-left"
                >
                  Requested By
                </th>
                <th
                  scope="col"
                  onClick={() => setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))}
                  className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 overflow-hidden text-ellipsis whitespace-nowrap select-none bg-white dark:bg-slate-900 border-b border-[#DFE3EB] dark:border-slate-700 align-middle text-left cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                  title="Sort by Requested Time"
                >
                  <div className="flex items-center gap-1">
                    <span>Requested Time</span>
                    <span className="text-[10px] text-amber-500 font-mono">
                      {sortDir === "asc" ? "▲" : "▼"}
                    </span>
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 overflow-hidden text-ellipsis whitespace-nowrap select-none bg-white dark:bg-slate-900 border-b border-[#DFE3EB] dark:border-slate-700 align-middle text-center"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 overflow-hidden text-ellipsis whitespace-nowrap select-none bg-white dark:bg-slate-900 border-b border-[#DFE3EB] dark:border-slate-700 align-middle text-left"
                >
                  Completion Time
                </th>
                <th
                  scope="col"
                  className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 overflow-hidden text-ellipsis whitespace-nowrap select-none bg-white dark:bg-slate-900 border-b border-[#DFE3EB] dark:border-slate-700 align-middle text-center"
                >
                  Download
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFE3EB]/70 dark:divide-slate-800/80">
              {paginatedTasks.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-24 text-center text-slate-400">
                    <CloudDownload className="h-12 w-12 mx-auto mb-3 opacity-30 text-slate-400" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      No cloud download records found
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try adjusting filters or clear your search query.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedTasks.map((task, idx) => {
                  const isCompleted = task.status === "Completed";
                  const isInProgress = task.status === "In Progress";
                  const rowNumber = (page - 1) * pageSize + idx + 1;
                  const isRowDownloading = activeDownload?.id === task.id && isDownloading;
                  const isRowCompleted =
                    activeDownload?.id === task.id && activeDownload?.status === "completed";

                  return (
                    <tr
                      key={task.id}
                      className="group cursor-pointer border-b border-border/40 transition-colors duration-150 text-xs hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                    >
                      {/* # Sticky Column */}
                      <td className="sticky left-0 z-10 w-10 min-w-[40px] max-w-[40px] bg-white dark:bg-slate-900 group-hover:bg-slate-50/70 dark:group-hover:bg-slate-800/40 px-3 py-2 text-center text-muted-foreground font-mono">
                        {rowNumber}
                      </td>

                      {/* Branch */}
                      <td className="px-2.5 py-2 truncate text-slate-900 dark:text-slate-100 font-medium">
                        {task.branch}
                      </td>

                      {/* Plate No */}
                      <td className="px-2.5 py-2 font-mono text-slate-700 dark:text-slate-300">
                        {task.plateNo !== "--" ? (
                          <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[#0089FF] font-semibold text-[11px]">
                            {task.plateNo}
                          </span>
                        ) : (
                          <span className="text-slate-400">--</span>
                        )}
                      </td>

                      {/* Channel No */}
                      <td className="px-2.5 py-2 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                        {task.channelNo}
                      </td>

                      {/* Task */}
                      <td className="px-2.5 py-2 text-slate-900 dark:text-slate-100 font-medium">
                        <div className="flex items-center gap-1.5">
                          {task.task.toLowerCase().includes("video") ? (
                            <Video className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                          ) : (
                            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          )}
                          <span className="truncate">{task.task}</span>
                        </div>
                      </td>

                      {/* Start time */}
                      <td className="px-2.5 py-2 font-mono text-muted-foreground text-[11px] whitespace-nowrap">
                        {task.startTime}
                      </td>

                      {/* End Time */}
                      <td className="px-2.5 py-2 font-mono text-muted-foreground text-[11px] whitespace-nowrap">
                        {task.endTime}
                      </td>

                      {/* Requested By */}
                      <td className="px-2.5 py-2 text-muted-foreground max-w-[180px] truncate" title={task.requestedBy}>
                        {task.requestedBy}
                      </td>

                      {/* Requested Time */}
                      <td className="px-2.5 py-2 font-mono text-muted-foreground text-[11px] whitespace-nowrap">
                        {task.requestedTime}
                      </td>

                      {/* Status */}
                      <td className="px-2.5 py-2 text-center whitespace-nowrap">
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            Completed
                          </span>
                        )}
                        {isInProgress && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60">
                            <Clock className="h-3 w-3 animate-spin text-sky-600 dark:text-sky-400" />
                            In Progress
                          </span>
                        )}
                        {task.status === "Failed" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/60">
                            <AlertCircle className="h-3 w-3 text-red-600" />
                            Failed
                          </span>
                        )}
                      </td>

                      {/* Completion Time */}
                      <td className="px-2.5 py-2 font-mono text-muted-foreground text-[11px] whitespace-nowrap">
                        {task.completionTime}
                      </td>

                      {/* Download */}
                      <td className="px-2.5 py-2 text-center">
                        {isRowDownloading ? (
                          <div className="inline-flex items-center justify-center min-w-[66px] h-7 px-2 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[#0089FF] gap-1.5 shadow-2xs font-mono text-[11.5px] font-bold select-none">
                            <div className="relative flex h-4 w-4 items-center justify-center shrink-0">
                              <svg
                                className="absolute -inset-0.5 h-5 w-5 -rotate-90 pointer-events-none transform"
                                viewBox="0 0 36 36"
                              >
                                <circle
                                  cx="18"
                                  cy="18"
                                  r="14"
                                  fill="none"
                                  stroke="rgba(0, 137, 255, 0.2)"
                                  strokeWidth="3.5"
                                />
                                <circle
                                  cx="18"
                                  cy="18"
                                  r="14"
                                  fill="none"
                                  stroke="#0089FF"
                                  strokeWidth="3.5"
                                  strokeDasharray={2 * Math.PI * 14}
                                  strokeDashoffset={2 * Math.PI * 14 * (1 - progress / 100)}
                                  strokeLinecap="round"
                                  className="transition-all duration-75 ease-linear"
                                />
                              </svg>
                              <Download className="h-2.5 w-2.5 text-[#0089FF]" />
                            </div>
                            <span>{Math.round(progress)}%</span>
                          </div>
                        ) : isRowCompleted ? (
                          <div className="inline-flex items-center justify-center min-w-[58px] h-7 px-2 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 gap-1 shadow-2xs text-[11px] font-semibold select-none">
                            <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Done</span>
                          </div>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                disabled={!isCompleted}
                                onClick={() => handleDownload(task)}
                                aria-label={`Download ${task.task}`}
                                className={cn(
                                  "inline-flex items-center justify-center h-7 w-7 rounded-md transition-all",
                                  isCompleted
                                    ? "text-[#0089FF] hover:bg-[#0089FF]/10 border border-blue-200 dark:border-blue-800 hover:border-[#0089FF] cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                                    : "text-slate-300 dark:text-slate-600 opacity-40 cursor-not-allowed"
                                )}
                              >
                                <Download className="h-3.5 w-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="text-xs">
                              {isCompleted ? "Download CSV export" : "Task in progress"}
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Horizontal divider with 20px space from left and right */}
        <div className="mx-5 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0" />

        {/* 4. Table Pagination Bar */}
        <TablePaginationBar
          page={page}
          pageSize={pageSize}
          totalRows={filteredTasks.length}
          pageSizeOptions={[10, 20, 50, 100]}
          itemLabel="records"
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
          }}
          showReset={true}
          onReset={handleReset}
          showExport={false}
        />
      </div>

      {/* 5. Cloud Download Dedicated Filter Drawer */}
      <CloudDownloadFilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={(newFilters) => {
          setFilters(newFilters);
          setPage(1);
        }}
        companyOptions={COMPANY_OPTIONS}
        branchOptions={BRANCH_OPTIONS}
        statusOptions={STATUS_OPTIONS}
        requestForOptions={REQUEST_FOR_OPTIONS}
      />
      {/* 6. Download Overlay Menu matching reference image */}
      <DownloadOverlayMenu
        completedItems={completedOverlayItems}
        onDismissItem={(id) => setCompletedOverlayItems((prev) => prev.filter((i) => i.id !== id))}
      />
    </div>
  );
}
