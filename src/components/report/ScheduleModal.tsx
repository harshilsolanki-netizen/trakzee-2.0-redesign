import {
  ArrowLeft,
  ArrowRight,
  Bold,
  Calendar,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Clock,
  FileSpreadsheet,
  FileText,
  Fuel,
  GripVertical,
  HelpCircle,
  Italic,
  List,
  Loader2,
  Mail,
  Map as MapIcon,
  Maximize2,
  Minimize2,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Settings2,
  SlidersHorizontal,
  Trash2,
  Truck,
  Underline,
  X,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  BRANCHES,
  COMPANIES,
  getBranchesForCompanies,
  getVehiclesForBranches,
} from "@/data/reports";
import { fleetObjects, type FleetObject } from "@/data/fleet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type ReportFilters } from "@/components/report/ReportConfigPanel";
import { cn } from "@/lib/utils";

export type ScheduleItem = {
  id: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  nextRun: string;
  relativeType: string;
  timezone: string;
  scheduleType: "Daily" | "Weekly" | "Monthly";
  selectedDays?: string[];
  selectedDates?: number[];
  hasTimeRange: boolean;
  timeRangeStart: string;
  timeRangeEnd: string;
  generationTime: string;
  reportType: "Summary" | "Daily" | "Detail";
  format: "XLS" | "PDF" | "CSV";
  actionType: "Email" | "FTP" | "SFTP" | "Media API";
  toAddress: string;
  emailRetryWindow: string;
  subject: string;
  message: string;
  vehicleScope: "current" | "custom";
  selectedVehicles: string[];
  // FTP Configuration
  ftpHost?: string;
  ftpPort?: string;
  ftpUsername?: string;
  ftpPassword?: string;
  ftpFolder?: string;
  // SFTP Configuration
  sftpPlatform?: string;
  sftpAccessKey?: string;
  sftpSecretKey?: string;
  sftpRegion?: string;
  sftpBucketName?: string;
  // Media API Configuration
  mediaGateway?: string;
  mediaRecipientNumber?: string;
};

export type ReportColumnConfig = {
  id: string;
  label: string;
  showable: boolean;
  printable: boolean;
  sortable: boolean;
  sortPriority: string;
  sortDirection: "asc" | "desc";
};

const INITIAL_COLUMNS: ReportColumnConfig[] = [
  {
    id: "vehicleNo",
    label: "Vehicle Number",
    showable: true,
    printable: true,
    sortable: true,
    sortPriority: "1",
    sortDirection: "asc",
  },
  {
    id: "driver",
    label: "Driver Name",
    showable: true,
    printable: true,
    sortable: true,
    sortPriority: "2",
    sortDirection: "asc",
  },
  {
    id: "company",
    label: "Company",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: "-",
    sortDirection: "asc",
  },
  {
    id: "branch",
    label: "Branch",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: "-",
    sortDirection: "asc",
  },
  {
    id: "startLocation",
    label: "Start Location",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: "-",
    sortDirection: "asc",
  },
  {
    id: "distance",
    label: "Distance (km)",
    showable: true,
    printable: true,
    sortable: true,
    sortPriority: "-",
    sortDirection: "asc",
  },
  {
    id: "running",
    label: "Running Duration",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: "-",
    sortDirection: "asc",
  },
  {
    id: "idle",
    label: "Idle Duration",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: "-",
    sortDirection: "asc",
  },
  {
    id: "stop",
    label: "Stop Duration",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: "-",
    sortDirection: "asc",
  },
  {
    id: "startOdometer",
    label: "Start Odometer",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: "-",
    sortDirection: "asc",
  },
  {
    id: "firstIgnitionOn",
    label: "First Ignition",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: "-",
    sortDirection: "asc",
  },
  {
    id: "lastIgnitionOff",
    label: "Last Ignition",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: "-",
    sortDirection: "asc",
  },
  {
    id: "endOdometer",
    label: "End Odometer",
    showable: true,
    printable: true,
    sortable: true,
    sortPriority: "-",
    sortDirection: "asc",
  },
];

const INITIAL_SCHEDULES: ScheduleItem[] = [
  {
    id: "sched-1",
    name: "Weekly Operations Summary",
    status: "ACTIVE",
    nextRun: "21 Aug 2026, 03:00 PM",
    relativeType: "This Week",
    timezone: "Asia/Kolkata (UTC+05:30)",
    scheduleType: "Weekly",
    selectedDays: ["Mo"],
    hasTimeRange: true,
    timeRangeStart: "12:00 AM",
    timeRangeEnd: "11:59 PM",
    generationTime: "09:00",
    reportType: "Summary",
    format: "XLS",
    actionType: "Email",
    toAddress: "manager@company.com",
    emailRetryWindow: "15",
    subject: "Weekly Operations Summary Report",
    message: "Please find attached the latest travel summary report for review.",
    vehicleScope: "current",
    selectedVehicles: ["KA01AB9988", "TS07FA7788", "MH12AB1234"],
  },
  {
    id: "sched-2",
    name: "Daily Fuel & Activity Audit",
    status: "ACTIVE",
    nextRun: "03 Sep 2026, 06:00 AM",
    relativeType: "Yesterday",
    timezone: "Asia/Kolkata (UTC+05:30)",
    scheduleType: "Daily",
    hasTimeRange: true,
    timeRangeStart: "00:00",
    timeRangeEnd: "23:59",
    generationTime: "06:00",
    reportType: "Daily",
    format: "PDF",
    actionType: "Email",
    toAddress: "audit@company.com",
    emailRetryWindow: "30",
    subject: "Daily Fuel & Activity Audit",
    message: "Attached is the automated daily audit log.",
    vehicleScope: "current",
    selectedVehicles: ["KA01AB9988", "MH03DE4242"],
  },
];

const RELATIVE_TYPES = [
  "Today",
  "Yesterday",
  "This Week",
  "Last Week",
  "Last 7 Days",
  "This Month",
  "Last Month",
];

const TIMEZONES = [
  "Asia/Kolkata (UTC+05:30)",
  "UTC (UTC+00:00)",
  "America/New_York (UTC-05:00)",
  "Europe/London (UTC+00:00)",
  "Asia/Dubai (UTC+04:00)",
  "Asia/Singapore (UTC+08:00)",
];

const WEEK_DAYS = [
  { id: "Su", label: "Su" },
  { id: "Mo", label: "Mo" },
  { id: "Tu", label: "Tu" },
  { id: "We", label: "We" },
  { id: "Th", label: "Th" },
  { id: "Fr", label: "Fr" },
  { id: "Sa", label: "Sa" },
];

const GENERATION_TIMES = [
  "00:00",
  "03:00",
  "06:00",
  "09:00",
  "12:00",
  "15:00",
  "18:00",
  "21:00",
];

const SFTP_PLATFORMS = [
  "Amazon S3",
  "Google Cloud Storage",
  "Azure Blob Storage",
  "Custom SFTP Server",
];

const MEDIA_GATEWAYS = [
  "WhatsApp",
  "Telegram",
  "SMS Gateway",
  "Slack Webhook",
];

const DEFAULT_DRAFT: Omit<ScheduleItem, "id"> = {
  name: "",
  status: "ACTIVE",
  nextRun: "03/09/2026 09:00 AM",
  relativeType: "Today",
  timezone: "Asia/Kolkata (UTC+05:30)",
  scheduleType: "Daily",
  selectedDays: ["Mo"],
  selectedDates: [1],
  hasTimeRange: true,
  timeRangeStart: "12:00 AM",
  timeRangeEnd: "11:59 PM",
  generationTime: "09:00",
  reportType: "Summary",
  format: "XLS",
  actionType: "Email",
  toAddress: "",
  emailRetryWindow: "15",
  subject: "Scheduled Travel Report",
  message: "Please find attached the scheduled report.",
  vehicleScope: "current",
  selectedVehicles: [],
  // FTP defaults
  ftpHost: "",
  ftpPort: "21",
  ftpUsername: "",
  ftpPassword: "",
  ftpFolder: "/reports",
  // SFTP defaults
  sftpPlatform: "Amazon S3",
  sftpAccessKey: "",
  sftpSecretKey: "",
  sftpRegion: "ap-south-1",
  sftpBucketName: "",
  // Media API defaults
  mediaGateway: "WhatsApp",
  mediaRecipientNumber: "",
};

function SelectDropdown({
  value,
  options,
  onChange,
  className,
  placeholder,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-7.5 w-full items-center justify-between rounded-md border border-input/80 bg-background px-2.5 text-xs text-foreground font-medium shadow-2xs transition-all hover:border-[#0089FF]/60 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF] cursor-pointer select-none",
          open && "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-muted/40",
        )}
      >
        <span
          className={cn(
            "truncate",
            value
              ? "text-foreground font-medium"
              : "text-muted-foreground/60 font-normal italic",
          )}
        >
          {value || placeholder || "Select"}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70 transition-transform duration-200 ml-1",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-[100] mt-1 max-h-56 overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-lg animate-in fade-in-80 select-none custom-scrollbar">
          {options.map((opt) => {
            const isSelected = value === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded px-2 py-1.5 text-xs text-left cursor-pointer transition-colors",
                  isSelected
                    ? "bg-muted font-semibold text-foreground"
                    : "text-foreground hover:bg-muted/80 font-medium",
                )}
              >
                <span className="truncate">{opt}</span>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 text-[#0089FF] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function UniversalMultiSelectDropdown({
  label,
  selected,
  options,
  onChange,
  className,
  placeholder,
}: {
  label: string;
  selected: string[];
  options: string[];
  onChange: (next: string[]) => void;
  className?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<string[]>(selected);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      setDraft(selected);
      setSearch("");
    }
  }, [open, selected]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, search]);

  const isAllDraftSelected =
    filteredOptions.length > 0 &&
    filteredOptions.every((opt) => draft.includes(opt));

  const toggleDraft = (opt: string) => {
    if (draft.includes(opt)) {
      setDraft(draft.filter((s) => s !== opt));
    } else {
      setDraft([...draft, opt]);
    }
  };

  const toggleAllDraft = () => {
    if (isAllDraftSelected) {
      setDraft(draft.filter((s) => !filteredOptions.includes(s)));
    } else {
      setDraft([...new Set([...draft, ...filteredOptions])]);
    }
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-7.5 w-full items-center justify-between rounded-md border border-input/80 bg-background px-2.5 text-xs shadow-2xs transition-all hover:border-[#0089FF]/60 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF] cursor-pointer select-none",
          open && "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-muted/40",
        )}
      >
        <div className="flex items-center min-w-0 flex-1 overflow-hidden">
          {!selected || selected.length === 0 ? (
            <span className="text-muted-foreground/60 font-medium italic truncate">
              {placeholder || `Select ${label}`}
            </span>
          ) : (
            <>
              <span className="text-foreground font-medium truncate">
                {selected[0]}
              </span>
              {selected.length > 1 && (
                <span className="ml-1.5 inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-[#0089FF]/10 text-[#0089FF] border border-[#0089FF]/20 shrink-0">
                  +{selected.length - 1}
                </span>
              )}
            </>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70 transition-transform duration-200 ml-1",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 w-full rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md shadow-2xl animate-in fade-in-0 zoom-in-95 select-none overflow-hidden flex flex-col">
          <div className="p-2.5 pb-2 border-b border-border/60 bg-muted/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                Select {label}
              </span>
              <span className="text-[10px] font-semibold text-[#0089FF] bg-[#0089FF]/10 px-2 py-0.5 rounded-full">
                {draft.length} selected
              </span>
            </div>

            <div className="flex h-7 items-center gap-1.5 rounded-md border border-input bg-background px-2 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all">
              <Search className="h-3 w-3 text-muted-foreground shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="rounded-md p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              )}
            </div>
          </div>

          <div className="px-3 py-1.5 border-b border-border/60 flex items-center justify-between bg-muted/10">
            <label className="flex items-center gap-2 cursor-pointer select-none w-full text-xs font-semibold text-foreground">
              <input
                type="checkbox"
                checked={isAllDraftSelected}
                onChange={toggleAllDraft}
                className="h-3.5 w-3.5 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
              />
              <span>Select All</span>
            </label>
          </div>

          <div className="max-h-48 overflow-y-auto p-1 space-y-0.5 custom-scrollbar">
            {filteredOptions.map((opt) => {
              const isChecked = draft.includes(opt);
              return (
                <label
                  key={opt}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-foreground transition-colors cursor-pointer select-none hover:bg-muted/80 font-medium"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleDraft(opt)}
                    className="rounded border-input text-[#0089FF] cursor-pointer h-3.5 w-3.5 accent-[#0089FF]"
                  />
                  <span className={cn("truncate", isChecked && "font-semibold text-foreground")}>
                    {opt}
                  </span>
                </label>
              );
            })}

            {filteredOptions.length === 0 && (
              <div className="p-3 text-center text-xs text-muted-foreground italic">
                No {label.toLowerCase()} found
              </div>
            )}
          </div>

          <div className="p-2 px-3 border-t border-border/70 flex items-center justify-between bg-muted/20">
            <button
              type="button"
              onClick={() => setDraft([])}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer transition-colors"
            >
              Clear
            </button>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setDraft(selected);
                  setOpen(false);
                }}
                className="px-2.5 py-1 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange(draft);
                  setOpen(false);
                }}
                className="px-3.5 py-1 text-xs rounded-md font-semibold text-white bg-[#0089FF] hover:bg-[#0070d6] shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatRecurrence(item: ScheduleItem): string {
  if (item.scheduleType === "Weekly") {
    const dayMap: Record<string, string> = {
      Mo: "Mon",
      Tu: "Tue",
      We: "Wed",
      Th: "Thu",
      Fr: "Fri",
      Sa: "Sat",
      Su: "Sun",
    };
    const days = (item.selectedDays || []).map((d) => dayMap[d] || d);
    return `Every week (${days.length > 0 ? days.join(", ") : "Mon"})`;
  }
  if (item.scheduleType === "Monthly") {
    const dates = item.selectedDates || [1];
    return `Every month (${dates.join(", ")})`;
  }
  return "Every day";
}

function getScheduleIconScheme(item: ScheduleItem) {
  const nameLower = (item.name || "").toLowerCase();
  if (
    nameLower.includes("fuel") ||
    nameLower.includes("distance") ||
    nameLower.includes("audit")
  ) {
    return {
      badgeBg: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      icon: <Fuel className="h-5 w-5" />,
    };
  }
  if (
    nameLower.includes("idle") ||
    nameLower.includes("location") ||
    nameLower.includes("map") ||
    nameLower.includes("route")
  ) {
    return {
      badgeBg: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      icon: <MapIcon className="h-5 w-5" />,
    };
  }
  return {
    badgeBg: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    iconColor: "text-[#0089FF]",
    icon: <FileText className="h-5 w-5" />,
  };
}

function RowDeletePopover({
  itemName,
  onDelete,
}: {
  itemName: string;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title="Delete schedule"
          aria-label={`Delete schedule ${itemName}`}
          className="h-[30px] w-[30px] rounded-md border border-border/80 bg-background flex items-center justify-center text-muted-foreground hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer shadow-2xs active:scale-95"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={6}
        avoidCollisions={true}
        collisionPadding={8}
        className="w-64 p-3 rounded-lg border border-border bg-popover text-foreground shadow-lg z-[90] text-xs select-none animate-in fade-in-0 zoom-in-95"
      >
        <div className="space-y-1">
          <p className="font-semibold text-foreground text-xs leading-tight">
            Delete scheduled report?
          </p>
          <p className="text-[11px] text-muted-foreground leading-normal">
            Are you sure you want to delete <strong className="text-foreground font-medium">&quot;{itemName}&quot;</strong>?
          </p>
        </div>

        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="h-7 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-all active:scale-98"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="h-7 rounded-md bg-rose-600 px-3 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 active:scale-98 cursor-pointer transition-all"
          >
            Delete
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function ScheduleModal({
  open,
  onClose,
  currentFilters,
  reportTitle = "Today Activity",
}: {
  open: boolean;
  onClose: () => void;
  currentFilters?: ReportFilters;
  reportTitle?: string;
}) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("trakzee_scheduled_reports");
        if (saved !== null) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.error("Failed to load schedules", e);
      }
    }
    return INITIAL_SCHEDULES;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("trakzee_scheduled_reports", JSON.stringify(schedules));
      } catch (e) {
        console.error("Failed to save schedules", e);
      }
    }
  }, [schedules]);

  // Main View: Directly open in 'form' (create schedule) by default
  const [view, setView] = useState<"form" | "list">("form");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Compute Loaded Vehicles from the Active Report Page
  const currentLoadedVehicles = useMemo(() => {
    const selectedBranches =
      currentFilters?.branches && currentFilters.branches.length > 0 && !currentFilters.branches.includes("All")
        ? currentFilters.branches
        : getBranchesForCompanies(currentFilters?.companies || []);
    
    const branchVehicles = getVehiclesForBranches(selectedBranches);
    if (currentFilters?.objects && currentFilters.objects.length > 0) {
      return branchVehicles.filter((v) => currentFilters.objects.includes(v.id));
    }
    return branchVehicles;
  }, [currentFilters]);

  const currentLoadedVehicleIds = useMemo(() => {
    return currentLoadedVehicles.map((v) => v.id);
  }, [currentLoadedVehicles]);

  // Draft form state
  const [draft, setDraft] = useState<Omit<ScheduleItem, "id">>(() => ({
    ...DEFAULT_DRAFT,
    name: `${reportTitle} Schedule`,
    vehicleScope: "current",
    selectedVehicles: currentLoadedVehicleIds,
  }));

  // Synchronize initial draft when panel opens
  useEffect(() => {
    if (open && !editingId) {
      setView("form");
      setDraft((d) => ({
        ...DEFAULT_DRAFT,
        name: `${reportTitle} Schedule`,
        vehicleScope: "current",
        selectedVehicles: currentLoadedVehicleIds,
      }));
      setVehicleFilterMode("current");
    }
  }, [open, reportTitle, currentLoadedVehicleIds, editingId]);

  // Vehicle Scope Mode: "current" (use loaded filter) or "custom" (pick custom)
  const [vehicleFilterMode, setVehicleFilterMode] = useState<"current" | "custom">("current");

  // Overlay state for Custom Vehicle Selection
  const [vehicleOverlayOpen, setVehicleOverlayOpen] = useState(false);
  const [customFilterOverlayOpen, setCustomFilterOverlayOpen] = useState(false);
  const [customCompanies, setCustomCompanies] = useState<string[]>([]);
  const [customBranches, setCustomBranches] = useState<string[]>([]);
  const [customVehicleSearch, setCustomVehicleSearch] = useState("");
  const [draftCustomVehicles, setDraftCustomVehicles] = useState<string[]>([]);
  const [vehicleBoxHeight, setVehicleBoxHeight] = useState<number>(200);

  // Branch Accordions for Custom Vehicle Selection
  const [openBranchGroups, setOpenBranchGroups] = useState<string[]>(() => [
    "Indonesia",
    "Thailand",
    "Valsad",
    "Planet Eco AL Khabaisi",
    "Planet Eco AL Nakheel",
    "HP Branch 1",
    "HP Branch 2",
    "Delhi Branch",
    "Mumbai Branch",
    "Planet Eco Abu Dhabi",
    "Planet Eco Ajman",
  ]);

  // Advance Configuration Sub-Modal State
  const [advanceModalOpen, setAdvanceModalOpen] = useState(false);
  const [columnsConfig, setColumnsConfig] = useState<ReportColumnConfig[]>(INITIAL_COLUMNS);
  const [detailDownloadMode, setDetailDownloadMode] = useState<"multiple" | "single">("multiple");
  const [copyFrom, setCopyFrom] = useState<string>("None");
  const [errors, setErrors] = useState<{
    name?: string;
    toAddress?: string;
    ftpHost?: string;
    ftpPort?: string;
    ftpUsername?: string;
    ftpPassword?: string;
    ftpFolder?: string;
    sftpAccessKey?: string;
    sftpSecretKey?: string;
    sftpRegion?: string;
    sftpBucketName?: string;
    mediaRecipientNumber?: string;
  }>({});

  const [emailVerificationStatus, setEmailVerificationStatus] = useState<
    "idle" | "verifying" | "success" | "failed"
  >("idle");

  // Custom Vehicle Filtering Logic inside Overlay
  const customAvailableBranches = useMemo(() => {
    return getBranchesForCompanies(customCompanies);
  }, [customCompanies]);

  const customActiveBranches = useMemo(() => {
    if (!customBranches || customBranches.length === 0 || customBranches.includes("All")) {
      return customAvailableBranches;
    }
    const valid = customBranches.filter((b) => customAvailableBranches.includes(b));
    return valid.length > 0 ? valid : customAvailableBranches;
  }, [customBranches, customAvailableBranches]);

  const customFilteredVehicles = useMemo(() => {
    return getVehiclesForBranches(customActiveBranches);
  }, [customActiveBranches]);

  const customFilteredVehicleIds = useMemo(() => {
    return customFilteredVehicles.map((v) => v.id);
  }, [customFilteredVehicles]);

  const customActiveFilterCount = useMemo(() => {
    let count = 0;
    if (customCompanies.length > 0 && !customCompanies.includes("All")) count++;
    if (customBranches.length > 0 && !customBranches.includes("All")) count++;
    return count;
  }, [customCompanies, customBranches]);

  const handleCustomCompanyChange = (companies: string[]) => {
    const newAvail = getBranchesForCompanies(companies);
    const nextB = customBranches.filter((b) => newAvail.includes(b));
    setCustomCompanies(companies);
    setCustomBranches(nextB);
  };

  const handleCustomBranchChange = (branches: string[]) => {
    setCustomBranches(branches);
  };

  const groupedCustomVehicles = useMemo(() => {
    const q = customVehicleSearch.trim().toLowerCase();
    const map = new Map<
      string,
      { id: string; name: string; imei: string; branch: string; driver?: string }[]
    >();

    for (const branch of customActiveBranches) {
      const vList = customFilteredVehicles.filter((v) => v.branch === branch);
      const matched = vList.filter((v) => {
        if (!q) return true;
        const matchName = v.name.toLowerCase().includes(q);
        const matchImei = v.imei.toLowerCase().includes(q);
        const matchBranch = v.branch.toLowerCase().includes(q);
        const matchDriver = (v.driver || "").toLowerCase().includes(q);
        return matchName || matchImei || matchBranch || matchDriver;
      });
      if (matched.length > 0) {
        map.set(branch, matched);
      }
    }

    return Array.from(map.entries()).map(([branch, vehicles]) => ({
      branch,
      vehicles,
    }));
  }, [customActiveBranches, customFilteredVehicles, customVehicleSearch]);

  const isCustomAllVehiclesSelected =
    customFilteredVehicleIds.length > 0 &&
    customFilteredVehicleIds.every((id) => draftCustomVehicles.includes(id));

  const isCustomSomeVehiclesSelected =
    draftCustomVehicles.length > 0 && !isCustomAllVehiclesSelected;

  const toggleSelectAllCustomVehicles = () => {
    if (isCustomAllVehiclesSelected) {
      setDraftCustomVehicles([]);
    } else {
      setDraftCustomVehicles(customFilteredVehicleIds);
    }
  };

  const toggleCustomBranchVehicles = (branchVehicles: { id: string }[]) => {
    const bIds = branchVehicles.map((v) => v.id);
    const allIn = bIds.every((id) => draftCustomVehicles.includes(id));
    if (allIn) {
      setDraftCustomVehicles(draftCustomVehicles.filter((id) => !bIds.includes(id)));
    } else {
      setDraftCustomVehicles(Array.from(new Set([...draftCustomVehicles, ...bIds])));
    }
  };

  const toggleCustomSingleVehicle = (id: string) => {
    if (draftCustomVehicles.includes(id)) {
      setDraftCustomVehicles(draftCustomVehicles.filter((vId) => vId !== id));
    } else {
      setDraftCustomVehicles([...draftCustomVehicles, id]);
    }
  };

  const toggleBranchAccordion = (branch: string) => {
    setOpenBranchGroups((prev) =>
      prev.includes(branch) ? prev.filter((b) => b !== branch) : [...prev, branch],
    );
  };

  const toggleAllBranchAccordions = () => {
    if (openBranchGroups.length === groupedCustomVehicles.length) {
      setOpenBranchGroups([]);
    } else {
      setOpenBranchGroups(groupedCustomVehicles.map((g) => g.branch));
    }
  };

  // Drag resizer for vehicle list box inside overlay
  const isResizingVehicleBox = useRef(false);
  const resizeStartY = useRef(0);
  const resizeStartHeight = useRef(200);

  const startResizeVehicleBox = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isResizingVehicleBox.current = true;
      resizeStartY.current = e.clientY;
      resizeStartHeight.current = vehicleBoxHeight;

      const handleMouseMove = (event: MouseEvent) => {
        if (!isResizingVehicleBox.current) return;
        const delta = event.clientY - resizeStartY.current;
        const newH = Math.min(Math.max(resizeStartHeight.current + delta, 120), 480);
        setVehicleBoxHeight(newH);
      };

      const handleMouseUp = () => {
        isResizingVehicleBox.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ns-resize";
      document.body.style.userSelect = "none";
    },
    [vehicleBoxHeight],
  );

  const handleOpenCustomVehicleOverlay = () => {
    setDraftCustomVehicles(
      draft.selectedVehicles.length > 0 ? draft.selectedVehicles : customFilteredVehicleIds,
    );
    setCustomVehicleSearch("");
    setVehicleOverlayOpen(true);
  };

  const handleVerifyEmail = () => {
    const email = (draft.toAddress || "").trim();
    if (!email) {
      setEmailVerificationStatus("failed");
      setErrors((prev) => ({
        ...prev,
        toAddress: "Please enter recipient email address",
      }));
      toast.error("Please enter a recipient email address first");
      return;
    }

    setEmailVerificationStatus("verifying");

    setTimeout(() => {
      const isInvalidFormat = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const hasFailKeyword =
        email.toLowerCase().includes("fail") ||
        email.toLowerCase().includes("error") ||
        email.toLowerCase().includes("invalid") ||
        email.toLowerCase().includes("bad") ||
        email.toLowerCase().includes("test-fail");

      if (isInvalidFormat || hasFailKeyword) {
        setEmailVerificationStatus("failed");
        setErrors((prev) => ({
          ...prev,
          toAddress: "Verification failed: Invalid email Id",
        }));
        toast.error("Verification failed: Invalid email Id");
      } else {
        setEmailVerificationStatus("success");
        setErrors((prev) => ({ ...prev, toAddress: undefined }));
        toast.success(`Recipient email "${email}" verified successfully. Mailbox is active!`);
      }
    }, 450);
  };

  const handleRelativeTypeChange = (newType: string) => {
    let schedType: "Daily" | "Weekly" | "Monthly" = "Daily";
    if (newType.includes("Week") || newType.includes("7 Days")) {
      schedType = "Weekly";
    } else if (newType.includes("Month")) {
      schedType = "Monthly";
    }

    setDraft((d) => ({
      ...d,
      relativeType: newType,
      scheduleType: schedType,
    }));
  };

  const toggleDay = (dayId: string) => {
    setDraft((d) => {
      const current = d.selectedDays || [];
      const next = current.includes(dayId) ? current.filter((x) => x !== dayId) : [...current, dayId];
      return { ...d, selectedDays: next.length > 0 ? next : [dayId] };
    });
  };

  const toggleDate = (dateNum: number) => {
    setDraft((d) => {
      const current = d.selectedDates || [];
      const next = current.includes(dateNum)
        ? current.filter((x) => x !== dateNum)
        : [...current, dateNum];
      return { ...d, selectedDates: next.length > 0 ? next : [dateNum] };
    });
  };

  const handleCopySettings = (schedName: string) => {
    setCopyFrom(schedName);
    if (schedName === "None") return;
    const found = schedules.find((s) => s.name === schedName);
    if (found) {
      setDraft({
        ...found,
        name: draft.name || `${found.name} (Copy)`,
      });
      setErrors((prev) => ({ ...prev, name: undefined }));
      toast.info(`Copied settings from "${found.name}"`);
    }
  };

  const startCreate = () => {
    setEditingId(null);
    setDraft({
      ...DEFAULT_DRAFT,
      name: `${reportTitle} Schedule`,
      vehicleScope: "current",
      selectedVehicles: currentLoadedVehicleIds,
    });
    setVehicleFilterMode("current");
    setErrors({});
    setView("form");
  };

  const startEdit = (item: ScheduleItem) => {
    setEditingId(item.id);
    setDraft({ ...item });
    setVehicleFilterMode(item.vehicleScope || "current");
    setErrors({});
    setView("form");
  };

  const handleSave = () => {
    const newErrors: Record<string, string | undefined> = {};
    if (!draft.name.trim()) {
      newErrors.name = "Please enter report name";
    }
    if (draft.actionType === "Email" && !draft.toAddress.trim()) {
      newErrors.toAddress = "Please enter recipient email address";
    }
    if (draft.actionType === "FTP") {
      if (!draft.ftpHost?.trim()) newErrors.ftpHost = "Please enter host address";
      if (!draft.ftpPort?.trim()) newErrors.ftpPort = "Please enter port";
      if (!draft.ftpUsername?.trim()) newErrors.ftpUsername = "Please enter username";
      if (!draft.ftpPassword?.trim()) newErrors.ftpPassword = "Please enter password";
      if (!draft.ftpFolder?.trim()) newErrors.ftpFolder = "Please enter folder name";
    }
    if (draft.actionType === "SFTP") {
      if (!draft.sftpAccessKey?.trim()) newErrors.sftpAccessKey = "Please enter Access key ID";
      if (!draft.sftpSecretKey?.trim()) newErrors.sftpSecretKey = "Please enter Secret Access Key";
      if (!draft.sftpRegion?.trim()) newErrors.sftpRegion = "Please enter region";
      if (!draft.sftpBucketName?.trim()) newErrors.sftpBucketName = "Please enter bucket name";
    }
    if (draft.actionType === "Media API") {
      if (!draft.mediaRecipientNumber?.trim()) newErrors.mediaRecipientNumber = "Please enter recipient number(s)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalVehicles =
      vehicleFilterMode === "current"
        ? currentLoadedVehicleIds
        : draft.selectedVehicles.length > 0
          ? draft.selectedVehicles
          : customFilteredVehicleIds;

    const payload: ScheduleItem = {
      ...draft,
      id: editingId || `sched-${Date.now()}`,
      vehicleScope: vehicleFilterMode,
      selectedVehicles: finalVehicles,
    };

    if (editingId) {
      setSchedules((prev) => prev.map((s) => (s.id === editingId ? payload : s)));
      toast.success("Schedule updated successfully");
    } else {
      setSchedules((prev) => [...prev, payload]);
      toast.success("Schedule report created successfully");
    }

    onClose();
  };

  const handleDelete = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    toast.success("Schedule removed");
  };

  const filteredSchedules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return schedules;
    return schedules.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.actionType.toLowerCase().includes(q) ||
        s.format.toLowerCase().includes(q) ||
        (s.toAddress && s.toAddress.toLowerCase().includes(q)) ||
        s.relativeType.toLowerCase().includes(q),
    );
  }, [schedules, searchQuery]);

  return (
    <>
      {/* Side Panel Backdrop */}
      {open ? (
        <button
          type="button"
          aria-label="Close scheduled reports panel"
          onClick={onClose}
          className="fixed top-[45px] bottom-0 left-0 sm:left-[68px] right-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
        />
      ) : null}

      {/* Standard Side Panel Drawer matching Design System */}
      <aside
        aria-hidden={!open}
        aria-label="Scheduled Reports"
        className={cn(
          "fixed right-0 top-[45px] bottom-0 z-40 flex w-full max-w-[440px] xl:max-w-[480px] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
      >
        {/* Standardized 56px Header */}
        <header className="flex h-[56px] items-center justify-between border-b border-border px-5 bg-background select-none shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-semibold tracking-tight text-foreground">
              {view === "list"
                ? "Scheduled Reports"
                : editingId
                  ? "Edit Schedule Report"
                  : "Create Schedule Report"}
            </h2>
            {schedules.length > 0 && view === "form" && (
              <button
                type="button"
                onClick={() => setView("list")}
                className="px-2 py-0.5 text-[11px] font-semibold text-[#0089FF] bg-[#0089FF]/10 hover:bg-[#0089FF]/20 rounded-md transition-colors cursor-pointer"
                title="View saved scheduled reports"
              >
                Saved ({schedules.length})
              </button>
            )}
          </div>
          <div className="flex items-center gap-1">
            {view === "list" && (
              <button
                type="button"
                onClick={startCreate}
                className="px-2 py-1 text-xs font-semibold text-[#0089FF] hover:bg-muted rounded-md transition-colors cursor-pointer flex items-center gap-1"
                title="Create New Schedule"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New</span>
              </button>
            )}
            <button
              type="button"
              aria-label="Close scheduled reports panel"
              onClick={onClose}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Side Panel Body Content Area */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {view === "list" ? (
            /* SAVED SCHEDULES LIST VIEW */
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between gap-2 px-4 pt-3.5 pb-2 shrink-0">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search scheduled reports..."
                    className="h-7.5 w-full rounded-md border border-input/80 bg-background pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground/60 transition-all hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs font-medium"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-md cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={startCreate}
                  title="Create New Schedule"
                  aria-label="Create New Schedule"
                  className="inline-flex items-center justify-center rounded-md bg-[#0089FF] h-7.5 w-7.5 text-white shadow-2xs hover:bg-[#0070d6] active:scale-95 cursor-pointer transition-all shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 divide-y divide-border/60 custom-scrollbar">
                {filteredSchedules.map((item) => {
                  const iconScheme = getScheduleIconScheme(item);
                  const recurrenceText = formatRecurrence(item);

                  return (
                    <div
                      key={item.id}
                      className="py-3 px-1 flex items-center justify-between gap-3 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={cn(
                            "h-8.5 w-8.5 rounded-md flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                            iconScheme.badgeBg,
                            iconScheme.iconColor,
                          )}
                        >
                          {iconScheme.icon}
                        </div>

                        <div className="min-w-0 flex-1 space-y-0.5">
                          <h3 className="text-xs font-bold text-foreground truncate">
                            {item.name}
                          </h3>

                          <div className="flex flex-wrap items-center gap-x-1.5 text-[11px] text-muted-foreground">
                            <span className="inline-flex items-center gap-1 font-medium">
                              <Calendar className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                              <span>{item.nextRun}</span>
                            </span>
                            <span className="text-muted-foreground/40">•</span>
                            <span className="inline-flex items-center gap-1 font-medium">
                              <RotateCcw className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                              <span>{recurrenceText}</span>
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-1.5 text-[11px] text-muted-foreground">
                            <span className="inline-flex items-center gap-1 font-medium">
                              <Mail className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                              <span>{item.actionType}</span>
                            </span>
                            <span className="text-muted-foreground/40">•</span>
                            <span className="inline-flex items-center gap-1 font-medium">
                              <FileSpreadsheet className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                              <span>{item.format}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="inline-flex items-center justify-center rounded-md border border-border/80 bg-background h-7.5 w-7.5 text-xs font-semibold text-foreground hover:bg-muted hover:border-[#0089FF]/40 cursor-pointer transition-all shadow-2xs active:scale-95"
                          title="Edit schedule"
                        >
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>

                        <RowDeletePopover
                          itemName={item.name}
                          onDelete={() => handleDelete(item.id)}
                        />
                      </div>
                    </div>
                  );
                })}

                {filteredSchedules.length === 0 && schedules.length > 0 && (
                  <div className="py-10 text-center text-xs text-muted-foreground">
                    No scheduled reports found matching &quot;{searchQuery}&quot;.
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* SCHEDULE CONFIGURATION FORM (DIRECT DEFAULT VIEW) */
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5 custom-scrollbar select-none">
              {/* 1. Report Name */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-foreground">
                  Report Name <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => {
                    setDraft((d) => ({ ...d, name: e.target.value }));
                    if (e.target.value.trim()) {
                      setErrors((prev) => ({ ...prev, name: undefined }));
                    }
                  }}
                  placeholder="e.g. Weekly Operations Summary"
                  className={cn(
                    "h-7.5 w-full rounded-md border bg-background px-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none",
                    errors.name
                      ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-input/80 hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20",
                  )}
                />
                {errors.name && (
                  <div className="flex items-center gap-1.5 text-[11px] text-red-500 mt-1 font-medium animate-in fade-in duration-150">
                    <HelpCircle className="h-3 w-3 shrink-0 text-red-500" />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

              {/* 2. Vehicle Scope & Selection Option */}
              <div className="space-y-2 p-3 rounded-lg border border-border/80 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-foreground">
                    Vehicles to Include
                  </span>
                  <span className="text-[10px] font-semibold text-[#0089FF] bg-[#0089FF]/10 px-2 py-0.5 rounded-full">
                    {vehicleFilterMode === "current"
                      ? `${currentLoadedVehicles.length} Loaded Vehicles`
                      : `${draft.selectedVehicles.length > 0 ? draft.selectedVehicles.length : customFilteredVehicleIds.length} Custom Selected`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Option 1: Current Applied Filter */}
                  <label
                    className={cn(
                      "flex flex-col gap-1 p-2.5 rounded-md border text-xs cursor-pointer transition-all select-none",
                      vehicleFilterMode === "current"
                        ? "border-[#0089FF] bg-[#0089FF]/5 ring-1 ring-[#0089FF]/30"
                        : "border-border/70 bg-background hover:bg-muted/40",
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="vehicleFilterMode"
                        checked={vehicleFilterMode === "current"}
                        onChange={() => {
                          setVehicleFilterMode("current");
                          setDraft((d) => ({ ...d, selectedVehicles: currentLoadedVehicleIds }));
                        }}
                        className="h-3.5 w-3.5 accent-[#0089FF] cursor-pointer"
                      />
                      <span className="font-semibold text-foreground">Current Filter</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground pl-5 leading-tight">
                      Use currently loaded vehicles ({currentLoadedVehicles.length})
                    </p>
                  </label>

                  {/* Option 2: Custom Vehicles Selection */}
                  <label
                    onClick={() => {
                      if (vehicleFilterMode !== "custom") {
                        setVehicleFilterMode("custom");
                      }
                    }}
                    className={cn(
                      "flex flex-col gap-1 p-2.5 rounded-md border text-xs cursor-pointer transition-all select-none",
                      vehicleFilterMode === "custom"
                        ? "border-[#0089FF] bg-[#0089FF]/5 ring-1 ring-[#0089FF]/30"
                        : "border-border/70 bg-background hover:bg-muted/40",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="radio"
                          name="vehicleFilterMode"
                          checked={vehicleFilterMode === "custom"}
                          onChange={() => {
                            setVehicleFilterMode("custom");
                            handleOpenCustomVehicleOverlay();
                          }}
                          className="h-3.5 w-3.5 accent-[#0089FF] cursor-pointer"
                        />
                        <span className="font-semibold text-foreground">Custom Filter</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pl-5 mt-0.5">
                      <span className="text-[10px] text-muted-foreground leading-tight">
                        {vehicleFilterMode === "custom" && draft.selectedVehicles.length > 0
                          ? `${draft.selectedVehicles.length} vehicles`
                          : "Pick vehicles"}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setVehicleFilterMode("custom");
                          handleOpenCustomVehicleOverlay();
                        }}
                        className="text-[10px] font-semibold text-[#0089FF] hover:underline cursor-pointer"
                      >
                        {vehicleFilterMode === "custom" && draft.selectedVehicles.length > 0
                          ? "Change"
                          : "Select"}
                      </button>
                    </div>
                  </label>
                </div>
              </div>

              {/* 3. Copy From & Relative Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-foreground">
                    Copy From
                  </label>
                  <SelectDropdown
                    value={copyFrom}
                    options={["None", ...schedules.map((s) => s.name)]}
                    onChange={handleCopySettings}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-foreground">
                    Relative Type
                  </label>
                  <SelectDropdown
                    value={draft.relativeType}
                    options={RELATIVE_TYPES}
                    onChange={handleRelativeTypeChange}
                  />
                </div>
              </div>

              {/* 4. Timezone & Generation Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-foreground">
                    Timezone
                  </label>
                  <SelectDropdown
                    value={draft.timezone}
                    options={TIMEZONES}
                    onChange={(timezone) => setDraft((d) => ({ ...d, timezone }))}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-foreground">
                    Generation Time
                  </label>
                  <SelectDropdown
                    value={draft.generationTime}
                    options={GENERATION_TIMES}
                    onChange={(generationTime) =>
                      setDraft((d) => ({ ...d, generationTime }))
                    }
                  />
                </div>
              </div>

              {/* Dynamic Timing Sub-Section Based on Relative Type */}
              {(draft.scheduleType === "Weekly" || draft.scheduleType === "Monthly") && (
                <div className="pt-1 space-y-2 border-t border-border/60">
                  {draft.scheduleType === "Weekly" && (
                    <div className="space-y-1.5">
                      <span className="block text-[11px] font-semibold text-foreground">
                        Select execution days:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {WEEK_DAYS.map(({ id, label }) => {
                          const isSelected = (draft.selectedDays || []).includes(id);
                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() => toggleDay(id)}
                              className={cn(
                                "h-7 w-7 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center justify-center shadow-2xs active:scale-95",
                                isSelected
                                  ? "bg-[#0089FF] text-white shadow-xs border border-[#0089FF]"
                                  : "bg-background border border-input/80 text-foreground hover:bg-muted/60 hover:border-[#0089FF]/60",
                              )}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {draft.scheduleType === "Monthly" && (
                    <div className="space-y-1.5">
                      <span className="block text-[11px] font-semibold text-foreground">
                        Select execution day of month:
                      </span>
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((dateNum) => {
                          const isSelected = (draft.selectedDates || []).includes(dateNum);
                          return (
                            <button
                              key={dateNum}
                              type="button"
                              onClick={() => toggleDate(dateNum)}
                              className={cn(
                                "h-6.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-center shadow-2xs active:scale-95",
                                isSelected
                                  ? "bg-[#0089FF] text-white shadow-xs border border-[#0089FF]"
                                  : "bg-background border border-input/80 text-foreground hover:bg-muted/60 hover:border-[#0089FF]/60",
                              )}
                            >
                              {dateNum}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 5. Time Range */}
              <div className="pt-1 space-y-2 border-t border-border/60">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-foreground">
                  <input
                    type="checkbox"
                    checked={draft.hasTimeRange}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        hasTimeRange: e.target.checked,
                      }))
                    }
                    className="h-3.5 w-3.5 rounded border-border text-[#0089FF] focus:ring-[#0089FF] accent-[#0089FF] cursor-pointer"
                  />
                  <span>Time Range</span>
                </label>

                {draft.hasTimeRange && (
                  <div className="grid grid-cols-2 gap-3 pt-0.5">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-foreground">
                        Start Time
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={draft.timeRangeStart}
                          onChange={(e) =>
                            setDraft((d) => ({
                              ...d,
                              timeRangeStart: e.target.value,
                            }))
                          }
                          className="h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 pr-8 text-xs font-medium text-foreground transition-all hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs"
                        />
                        <Clock className="absolute right-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-foreground">
                        End Time
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={draft.timeRangeEnd}
                          onChange={(e) =>
                            setDraft((d) => ({
                              ...d,
                              timeRangeEnd: e.target.value,
                            }))
                          }
                          className="h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 pr-8 text-xs font-medium text-foreground transition-all hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs"
                        />
                        <Clock className="absolute right-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Report Type */}
              <div className="pt-1 space-y-1 border-t border-border/60">
                <label className="block text-[11px] font-semibold text-foreground">
                  Report Type
                </label>
                <div className="flex items-center gap-5 h-7.5">
                  {(["Summary", "Daily", "Detail"] as const).map((level) => (
                    <label
                      key={level}
                      className="flex items-center gap-1.5 cursor-pointer text-xs text-foreground select-none font-medium"
                    >
                      <input
                        type="radio"
                        name="reportType"
                        checked={draft.reportType === level}
                        onChange={() => setDraft((d) => ({ ...d, reportType: level }))}
                        className="h-3.5 w-3.5 accent-[#0089FF] cursor-pointer"
                      />
                      <span>{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 7. Delivery Method */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-foreground">
                  Delivery Method
                </label>
                <div className="flex items-center gap-4 h-7.5 flex-wrap">
                  {(["Email", "FTP", "SFTP", "Media API"] as const).map((method) => (
                    <label
                      key={method}
                      className="flex items-center gap-1.5 cursor-pointer text-xs text-foreground select-none font-medium"
                    >
                      <input
                        type="radio"
                        name="actionType"
                        checked={draft.actionType === method}
                        onChange={() => setDraft((d) => ({ ...d, actionType: method }))}
                        className="h-3.5 w-3.5 accent-[#0089FF] cursor-pointer"
                      />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Delivery Configuration Details: EMAIL */}
              {draft.actionType === "Email" && (
                <div className="pt-1 space-y-3 animate-in fade-in-50 duration-150">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-foreground">
                      To Address <span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        value={draft.toAddress}
                        onChange={(e) => {
                          setEmailVerificationStatus("idle");
                          setDraft((d) => ({ ...d, toAddress: e.target.value }));
                          if (e.target.value.trim()) {
                            setErrors((prev) => ({ ...prev, toAddress: undefined }));
                          }
                        }}
                        placeholder="manager@company.com"
                        className={cn(
                          "h-7.5 flex-1 rounded-md border bg-background px-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none",
                          emailVerificationStatus === "success"
                            ? "border-emerald-500/80 bg-emerald-500/[0.04] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            : emailVerificationStatus === "failed" || errors.toAddress
                              ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                              : "border-input/80 hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20",
                        )}
                      />
                      <button
                        type="button"
                        disabled={emailVerificationStatus === "verifying"}
                        onClick={handleVerifyEmail}
                        className={cn(
                          "px-3 h-7.5 text-xs rounded-md border font-semibold cursor-pointer transition-all shadow-2xs active:scale-98 inline-flex items-center gap-1.5 shrink-0",
                          emailVerificationStatus === "verifying" &&
                            "opacity-75 cursor-wait border-input/80 bg-muted/40 text-muted-foreground",
                          emailVerificationStatus === "success" &&
                            "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20",
                          emailVerificationStatus === "failed" &&
                            "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20",
                          emailVerificationStatus === "idle" &&
                            "border-input/80 bg-background hover:bg-muted/40 hover:border-[#0089FF]/60 text-foreground",
                        )}
                      >
                        {emailVerificationStatus === "verifying" && (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0089FF]" />
                            <span>Verifying...</span>
                          </>
                        )}
                        {emailVerificationStatus === "success" && (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Verified</span>
                          </>
                        )}
                        {emailVerificationStatus === "failed" && (
                          <>
                            <XCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                            <span>Failed</span>
                          </>
                        )}
                        {emailVerificationStatus === "idle" && <span>Verify</span>}
                      </button>
                    </div>
                    {emailVerificationStatus === "success" && (
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium animate-in fade-in duration-150">
                        <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-600" />
                        <span>Recipient email verified & active.</span>
                      </div>
                    )}
                    {(emailVerificationStatus === "failed" || errors.toAddress) && (
                      <div className="flex items-center gap-1.5 text-[11px] text-red-500 mt-1 font-medium animate-in fade-in duration-150">
                        <HelpCircle className="h-3 w-3 shrink-0 text-red-500" />
                        <span>{errors.toAddress || "Verification failed: Invalid email Id"}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-foreground">
                        Retry Window (Mins)
                      </label>
                      <input
                        type="text"
                        value={draft.emailRetryWindow}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            emailRetryWindow: e.target.value,
                          }))
                        }
                        placeholder="15"
                        className="h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 transition-all hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-foreground">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={draft.subject}
                        onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))}
                        placeholder="Weekly Report"
                        className="h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 transition-all hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-semibold text-foreground">
                        Message
                      </label>
                      <div className="flex items-center gap-0.5 border border-border rounded-md bg-muted/30 px-1 py-0.5">
                        <button
                          type="button"
                          className="p-0.5 rounded-xs hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Bold className="h-2.5 w-2.5" />
                        </button>
                        <button
                          type="button"
                          className="p-0.5 rounded-xs hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Italic className="h-2.5 w-2.5" />
                        </button>
                        <button
                          type="button"
                          className="p-0.5 rounded-xs hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Underline className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={2}
                      value={draft.message}
                      onChange={(e) => setDraft((d) => ({ ...d, message: e.target.value }))}
                      placeholder="Write your email body message here..."
                      className="w-full rounded-md border border-input/80 bg-background p-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 transition-all hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs custom-scrollbar"
                    />
                  </div>
                </div>
              )}

              {/* Delivery Configuration Details: FTP */}
              {draft.actionType === "FTP" && (
                <div className="pt-1 space-y-3 animate-in fade-in-50 duration-150">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-foreground">
                        Host Address <span className="text-red-500 font-bold ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        value={draft.ftpHost || ""}
                        onChange={(e) => {
                          setDraft((d) => ({ ...d, ftpHost: e.target.value }));
                          if (e.target.value.trim())
                            setErrors((prev) => ({ ...prev, ftpHost: undefined }));
                        }}
                        placeholder="ftp.example.com"
                        className={cn(
                          "h-7.5 w-full rounded-md border bg-background px-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none",
                          errors.ftpHost
                            ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : "border-input/80 hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20",
                        )}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-foreground">
                        Port <span className="text-red-500 font-bold ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        value={draft.ftpPort || "21"}
                        onChange={(e) => {
                          setDraft((d) => ({ ...d, ftpPort: e.target.value }));
                          if (e.target.value.trim())
                            setErrors((prev) => ({ ...prev, ftpPort: undefined }));
                        }}
                        placeholder="21"
                        className={cn(
                          "h-7.5 w-full rounded-md border bg-background px-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none",
                          errors.ftpPort
                            ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : "border-input/80 hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20",
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-foreground">
                        Username <span className="text-red-500 font-bold ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        value={draft.ftpUsername || ""}
                        onChange={(e) => {
                          setDraft((d) => ({ ...d, ftpUsername: e.target.value }));
                          if (e.target.value.trim())
                            setErrors((prev) => ({ ...prev, ftpUsername: undefined }));
                        }}
                        placeholder="ftp_user"
                        className="h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-foreground">
                        Password <span className="text-red-500 font-bold ml-0.5">*</span>
                      </label>
                      <input
                        type="password"
                        value={draft.ftpPassword || ""}
                        onChange={(e) => {
                          setDraft((d) => ({ ...d, ftpPassword: e.target.value }));
                          if (e.target.value.trim())
                            setErrors((prev) => ({ ...prev, ftpPassword: undefined }));
                        }}
                        placeholder="••••••••"
                        className="h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-foreground">
                      Folder Name <span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      value={draft.ftpFolder || ""}
                      onChange={(e) => {
                        setDraft((d) => ({ ...d, ftpFolder: e.target.value }));
                        if (e.target.value.trim())
                          setErrors((prev) => ({ ...prev, ftpFolder: undefined }));
                      }}
                      placeholder="/reports/daily"
                      className="h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Delivery Configuration Details: SFTP */}
              {draft.actionType === "SFTP" && (
                <div className="pt-1 space-y-3 animate-in fade-in-50 duration-150">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-foreground">
                      Platform <span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>
                    <SelectDropdown
                      value={draft.sftpPlatform || "Amazon S3"}
                      options={SFTP_PLATFORMS}
                      onChange={(sftpPlatform) => setDraft((d) => ({ ...d, sftpPlatform }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-foreground">
                        Access key ID <span className="text-red-500 font-bold ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        value={draft.sftpAccessKey || ""}
                        onChange={(e) => {
                          setDraft((d) => ({ ...d, sftpAccessKey: e.target.value }));
                          if (e.target.value.trim())
                            setErrors((prev) => ({ ...prev, sftpAccessKey: undefined }));
                        }}
                        placeholder="AKIAIOSFODNN7EXAMPLE"
                        className="h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-foreground">
                        Secret Access Key <span className="text-red-500 font-bold ml-0.5">*</span>
                      </label>
                      <input
                        type="password"
                        value={draft.sftpSecretKey || ""}
                        onChange={(e) => {
                          setDraft((d) => ({ ...d, sftpSecretKey: e.target.value }));
                          if (e.target.value.trim())
                            setErrors((prev) => ({ ...prev, sftpSecretKey: undefined }));
                        }}
                        placeholder="••••••••••••••••••••"
                        className="h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-foreground">
                        Region <span className="text-red-500 font-bold ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        value={draft.sftpRegion || ""}
                        onChange={(e) => {
                          setDraft((d) => ({ ...d, sftpRegion: e.target.value }));
                          if (e.target.value.trim())
                            setErrors((prev) => ({ ...prev, sftpRegion: undefined }));
                        }}
                        placeholder="ap-south-1"
                        className="h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-foreground">
                        Bucket Name <span className="text-red-500 font-bold ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        value={draft.sftpBucketName || ""}
                        onChange={(e) => {
                          setDraft((d) => ({ ...d, sftpBucketName: e.target.value }));
                          if (e.target.value.trim())
                            setErrors((prev) => ({ ...prev, sftpBucketName: undefined }));
                        }}
                        placeholder="fleet-reports"
                        className="h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery Configuration Details: MEDIA API */}
              {draft.actionType === "Media API" && (
                <div className="pt-1 space-y-3 animate-in fade-in-50 duration-150">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-foreground">
                      Gateway <span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>
                    <SelectDropdown
                      value={draft.mediaGateway || "WhatsApp"}
                      options={MEDIA_GATEWAYS}
                      onChange={(mediaGateway) => setDraft((d) => ({ ...d, mediaGateway }))}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-semibold text-foreground">
                        Recipient Number <span className="text-red-500 font-bold ml-0.5">*</span>
                      </label>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        Comma (,) for multiple
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={draft.mediaRecipientNumber || ""}
                      onChange={(e) => {
                        setDraft((d) => ({ ...d, mediaRecipientNumber: e.target.value }));
                        if (e.target.value.trim())
                          setErrors((prev) => ({ ...prev, mediaRecipientNumber: undefined }));
                      }}
                      placeholder="+91 9876543210, +1 5550192834"
                      className="w-full rounded-md border border-input/80 bg-background p-2 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 transition-all shadow-2xs custom-scrollbar focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* 8. File Format */}
              <div className="space-y-1 pt-1">
                <label className="block text-[11px] font-semibold text-foreground">
                  File Format
                </label>
                <div className="flex items-center gap-5 h-7.5">
                  {(["XLS", "PDF", "CSV"] as const).map((fmt) => (
                    <label
                      key={fmt}
                      className="flex items-center gap-1.5 cursor-pointer text-xs text-foreground select-none font-medium"
                    >
                      <input
                        type="radio"
                        name="format"
                        checked={draft.format === fmt}
                        onChange={() => setDraft((d) => ({ ...d, format: fmt }))}
                        className="h-3.5 w-3.5 accent-[#0089FF] cursor-pointer"
                      />
                      <span>{fmt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 9. Advance Configuration Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setAdvanceModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-input/80 bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted hover:border-[#0089FF]/60 transition-all cursor-pointer shadow-2xs active:scale-98"
                >
                  <Settings2 className="h-3.5 w-3.5 text-[#0089FF]" />
                  <span>Advance Configuration</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Standardized 56px Drawer Footer */}
        {view === "form" ? (
          <footer className="flex h-[56px] items-center justify-between border-t border-border bg-background px-5 shrink-0 select-none">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 px-3.5 h-8 text-xs rounded-md border border-input/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all shadow-2xs active:scale-98"
              >
                <span>Close</span>
              </button>

              {editingId && (
                <RowDeletePopover
                  itemName={draft.name || "this report"}
                  onDelete={() => {
                    handleDelete(editingId);
                    setView("list");
                  }}
                />
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
                {vehicleFilterMode === "current"
                  ? `${currentLoadedVehicles.length} Vehicles`
                  : `${draft.selectedVehicles.length > 0 ? draft.selectedVehicles.length : customFilteredVehicleIds.length} Vehicles`}
              </span>

              <button
                type="button"
                onClick={handleSave}
                className="rounded-md bg-[#0089FF] px-4.5 h-8 text-xs font-semibold text-white shadow-xs hover:bg-[#0070d6] cursor-pointer transition-all active:scale-98"
              >
                {editingId ? "Update Schedule" : "Schedule"}
              </button>
            </div>
          </footer>
        ) : (
          <footer className="flex h-[56px] items-center justify-between border-t border-border bg-background px-5 shrink-0 select-none">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 h-8 text-xs rounded-md border border-input/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all shadow-2xs active:scale-98"
            >
              Close
            </button>

            <button
              type="button"
              onClick={startCreate}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#0089FF] px-4.5 h-8 text-xs font-semibold text-white shadow-xs hover:bg-[#0070d6] cursor-pointer transition-all active:scale-98"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Schedule</span>
            </button>
          </footer>
        )}
      </aside>

      {/* OVERLAY: Custom Vehicle Selection Overlay matching Reference Image */}
      {vehicleOverlayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in-0 duration-200">
          <div className="w-full max-w-[440px] rounded-xl border border-border bg-background text-foreground shadow-2xl flex flex-col max-h-[88vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header (56px) */}
            <div className="flex h-[56px] items-center justify-between border-b border-border px-5 bg-background select-none shrink-0">
              <div>
                <h3 className="text-[15px] font-semibold text-foreground tracking-tight">
                  Select Vehicles
                </h3>
                <p className="text-[10px] text-muted-foreground font-medium">
                  Choose specific vehicles for this schedule
                </p>
              </div>
              <button
                type="button"
                onClick={() => setVehicleOverlayOpen(false)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Overlay Body */}
            <div className="p-4 space-y-3 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
              {/* Top Search Bar & Filter button */}
              <div className="relative shrink-0">
                <div className="flex h-7.5 items-center gap-1.5 rounded-md border border-input/80 bg-background px-2.5 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] hover:border-[#0089FF]/60 transition-all">
                  <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <input
                    type="text"
                    value={customVehicleSearch}
                    onChange={(e) => setCustomVehicleSearch(e.target.value)}
                    placeholder="Select vehicle"
                    className="h-full flex-1 bg-transparent text-xs font-medium text-foreground placeholder:italic placeholder:text-muted-foreground/60 focus:outline-none min-w-0"
                  />

                  {customVehicleSearch && (
                    <button
                      type="button"
                      onClick={() => setCustomVehicleSearch("")}
                      className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded mr-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setCustomFilterOverlayOpen(!customFilterOverlayOpen)}
                    className="flex items-center gap-1 px-1 py-0.5 text-xs font-semibold text-[#0089FF] hover:text-[#0070d6] transition-colors cursor-pointer select-none shrink-0 active:scale-95"
                    title="Filter by Company and Branch"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-[#0089FF]" />
                    <span>Filter</span>
                    {customActiveFilterCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold leading-tight bg-[#0089FF] text-white">
                        {customActiveFilterCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Company & Branch Filter Popover inside Vehicle Selection Overlay */}
                {customFilterOverlayOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-black/10"
                      onClick={() => setCustomFilterOverlayOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 z-50 mt-1.5 rounded-xl border border-border/80 bg-card p-4 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 space-y-3 custom-scrollbar">
                      {/* Company */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-semibold text-foreground">
                          Company
                        </label>
                        <UniversalMultiSelectDropdown
                          label="Company"
                          selected={customCompanies}
                          options={COMPANIES.filter((c) => c !== "All")}
                          onChange={handleCustomCompanyChange}
                          placeholder="Select Company"
                        />
                      </div>

                      {/* Branch */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-semibold text-foreground">
                          Branch
                        </label>
                        <UniversalMultiSelectDropdown
                          label="Branch"
                          selected={customBranches}
                          options={customAvailableBranches}
                          onChange={handleCustomBranchChange}
                          placeholder="Select Branch"
                        />
                      </div>

                      {/* Overlay Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/60">
                        <button
                          type="button"
                          onClick={() => {
                            setCustomCompanies([]);
                            setCustomBranches([]);
                          }}
                          className="text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer transition-colors"
                        >
                          Reset
                        </button>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setCustomFilterOverlayOpen(false)}
                            className="px-2.5 py-1 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs"
                          >
                            Close
                          </button>
                          <button
                            type="button"
                            onClick={() => setCustomFilterOverlayOpen(false)}
                            className="px-3.5 py-1 rounded-md bg-[#0089FF] text-white text-xs font-semibold hover:bg-[#0070d6] cursor-pointer shadow-xs transition-all active:scale-98"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Resizable Vehicle Checklist Tree */}
              <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
                {/* Master Select All Toolbar */}
                <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-3 py-2 shrink-0 select-none">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground">
                    <input
                      type="checkbox"
                      checked={isCustomAllVehiclesSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isCustomSomeVehiclesSelected;
                      }}
                      onChange={toggleSelectAllCustomVehicles}
                      className="rounded border-input text-[#0089FF] cursor-pointer h-3.5 w-3.5 accent-[#0089FF]"
                    />
                    <span>Select all</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {draftCustomVehicles.length === 0
                        ? `All (${customFilteredVehicleIds.length})`
                        : `${draftCustomVehicles.length} / ${customFilteredVehicleIds.length} selected`}
                    </span>
                    <button
                      type="button"
                      onClick={toggleAllBranchAccordions}
                      className="text-[10px] text-muted-foreground hover:text-[#0089FF] font-semibold flex items-center gap-0.5 cursor-pointer p-0.5 rounded hover:bg-muted"
                      title="Expand/Collapse All Branches"
                    >
                      <ChevronsUpDown className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setVehicleBoxHeight((prev) => (prev > 220 ? 190 : 340))
                      }
                      className="text-[10px] text-muted-foreground hover:text-[#0089FF] font-semibold flex items-center gap-0.5 cursor-pointer p-0.5 rounded hover:bg-muted ml-0.5"
                      title={vehicleBoxHeight > 220 ? "Compact height" : "Expand height"}
                    >
                      {vehicleBoxHeight > 220 ? (
                        <Minimize2 className="h-3 w-3" />
                      ) : (
                        <Maximize2 className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Scrollable Branch Tree */}
                <div
                  style={{
                    height: `${vehicleBoxHeight}px`,
                    maxHeight: `${vehicleBoxHeight}px`,
                  }}
                  className="overflow-y-auto p-1 divide-y divide-border/40 custom-scrollbar transition-[height] duration-75 ease-out"
                >
                  {groupedCustomVehicles.map(({ branch, vehicles }) => {
                    const isExpanded =
                      openBranchGroups.includes(branch) ||
                      customVehicleSearch.trim() !== "";
                    const branchIds = vehicles.map((v) => v.id);
                    const selectedBranchCount = vehicles.filter((v) =>
                      draftCustomVehicles.includes(v.id),
                    ).length;
                    const isBranchAllSelected =
                      selectedBranchCount === vehicles.length && vehicles.length > 0;
                    const isBranchSomeSelected =
                      selectedBranchCount > 0 && !isBranchAllSelected;

                    return (
                      <div key={branch} className="py-1">
                        {/* Branch Accordion Header */}
                        <div className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted/50 transition-colors select-none">
                          <div className="flex items-center gap-2 min-w-0">
                            <input
                              type="checkbox"
                              aria-label={`Select all vehicles in ${branch}`}
                              checked={isBranchAllSelected}
                              ref={(el) => {
                                if (el) el.indeterminate = isBranchSomeSelected;
                              }}
                              onChange={() => toggleCustomBranchVehicles(vehicles)}
                              className="rounded border-input text-[#0089FF] cursor-pointer h-3.5 w-3.5 accent-[#0089FF]"
                            />
                            <button
                              type="button"
                              onClick={() => toggleBranchAccordion(branch)}
                              className="flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-[#0089FF] transition-colors cursor-pointer text-left truncate"
                            >
                              <ChevronRight
                                className={cn(
                                  "h-3.5 w-3.5 text-muted-foreground transition-transform duration-150",
                                  isExpanded && "rotate-90",
                                )}
                              />
                              <span className="truncate">{branch}</span>
                              <span className="text-[10px] tabular-nums text-muted-foreground font-normal">
                                [{vehicles.length}]
                              </span>
                            </button>
                          </div>
                          <span className="text-[10px] font-semibold text-muted-foreground bg-muted/80 px-1.5 py-0.5 rounded-full">
                            {selectedBranchCount}/{vehicles.length}
                          </span>
                        </div>

                        {/* Branch Vehicles Sub-List */}
                        {isExpanded && (
                          <div className="mt-1 pl-6 pr-2 space-y-0.5">
                            {vehicles.map((v) => {
                              const isChecked = draftCustomVehicles.includes(v.id);
                              return (
                                <label
                                  key={v.id}
                                  className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs transition-colors cursor-pointer select-none hover:bg-muted/60 text-foreground font-medium"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => toggleCustomSingleVehicle(v.id)}
                                      className="rounded border-input text-[#0089FF] cursor-pointer h-3.5 w-3.5 accent-[#0089FF]"
                                    />
                                    <Truck className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                    <div className="min-w-0 truncate">
                                      <span className="block truncate leading-tight text-xs font-semibold">
                                        {v.name}
                                      </span>
                                      <span className="block text-[10px] text-muted-foreground truncate leading-tight font-normal">
                                        {v.imei} · {v.driver}
                                      </span>
                                    </div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {groupedCustomVehicles.length === 0 && (
                    <div className="p-6 text-center text-xs text-muted-foreground italic">
                      No vehicles found matching &ldquo;{customVehicleSearch}&rdquo;
                    </div>
                  )}
                </div>

                {/* Resizer Bar at bottom */}
                <div
                  onMouseDown={startResizeVehicleBox}
                  onDoubleClick={() =>
                    setVehicleBoxHeight((prev) => (prev > 220 ? 190 : 340))
                  }
                  className="relative flex h-3.5 w-full cursor-ns-resize items-center justify-center border-t border-border/60 bg-muted/20 hover:bg-muted/60 transition-colors select-none group"
                  title="Drag to resize height (Double-click to expand/collapse)"
                >
                  <div className="h-1 w-8 rounded-full bg-muted-foreground/30 group-hover:bg-[#0089FF] transition-colors" />
                  <div
                    className="absolute right-1 bottom-0.5 text-muted-foreground/40 group-hover:text-[#0089FF] transition-colors pointer-events-none"
                    title="Resize handle"
                  >
                    <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor">
                      <circle cx="5" cy="5" r="1" />
                      <circle cx="5" cy="1" r="1" />
                      <circle cx="1" cy="5" r="1" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlay Footer (56px) */}
            <div className="flex h-[56px] items-center justify-between border-t border-border px-5 bg-background select-none shrink-0">
              <button
                type="button"
                onClick={() => setDraftCustomVehicles([])}
                className="text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer"
              >
                Clear All
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVehicleOverlayOpen(false)}
                  className="px-3.5 h-8 text-xs rounded-md border border-input/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all shadow-2xs active:scale-98"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const chosen =
                      draftCustomVehicles.length > 0
                        ? draftCustomVehicles
                        : customFilteredVehicleIds;
                    setDraft((d) => ({ ...d, selectedVehicles: chosen }));
                    setVehicleFilterMode("custom");
                    setVehicleOverlayOpen(false);
                    toast.success(`${chosen.length} vehicles selected for report schedule`);
                  }}
                  className="px-4 h-8 text-xs rounded-md bg-[#0089FF] text-white font-semibold hover:bg-[#0070d6] cursor-pointer shadow-xs transition-all active:scale-98"
                >
                  Apply Vehicles
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advance Configuration Sub-Modal */}
      {advanceModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close Advance Configuration"
            onClick={() => setAdvanceModalOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
          />
          <div className="relative z-10 w-full max-w-2xl max-h-[85vh] flex flex-col bg-background border border-border text-foreground shadow-2xl rounded-lg overflow-hidden animate-in zoom-in-95">
            <header className="flex h-[56px] items-center justify-between border-b border-border px-5 bg-background select-none shrink-0">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-[#0089FF]" />
                <h3 className="text-[16px] font-semibold tracking-tight text-foreground">
                  Advance Configuration
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close Advance Configuration"
                onClick={() => setAdvanceModalOpen(false)}
                className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4 custom-scrollbar text-xs">
              <div className="rounded-md border border-border overflow-hidden bg-card shadow-2xs">
                <table className="w-full text-left">
                  <thead className="bg-muted/60 text-muted-foreground text-[10px] font-bold uppercase tracking-wider border-b border-border">
                    <tr>
                      <th className="py-2 px-2.5 w-6"></th>
                      <th className="py-2 px-2.5">Column Name</th>
                      <th className="py-2 px-2 text-center">Show</th>
                      <th className="py-2 px-2 text-center">Print</th>
                      <th className="py-2 px-2 text-center">Sort</th>
                      <th className="py-2 px-2 text-center">Priority</th>
                      <th className="py-2 px-2.5 text-center">Order</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {columnsConfig.map((col) => (
                      <tr
                        key={col.id}
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <td className="py-1.5 px-2.5 text-muted-foreground cursor-grab">
                          <GripVertical className="h-3.5 w-3.5" />
                        </td>
                        <td className="py-1.5 px-2.5 font-semibold text-foreground text-xs">
                          {col.label}
                        </td>
                        <td className="py-1.5 px-2 text-center">
                          <input
                            type="checkbox"
                            checked={col.showable}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setColumnsConfig((prev) =>
                                prev.map((c) =>
                                  c.id === col.id ? { ...c, showable: checked } : c,
                                ),
                              );
                            }}
                            className="h-3.5 w-3.5 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
                          />
                        </td>
                        <td className="py-1.5 px-2 text-center">
                          <input
                            type="checkbox"
                            checked={col.printable}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setColumnsConfig((prev) =>
                                prev.map((c) =>
                                  c.id === col.id ? { ...c, printable: checked } : c,
                                ),
                              );
                            }}
                            className="h-3.5 w-3.5 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
                          />
                        </td>
                        <td className="py-1.5 px-2 text-center">
                          <input
                            type="checkbox"
                            checked={col.sortable}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setColumnsConfig((prev) =>
                                prev.map((c) =>
                                  c.id === col.id ? { ...c, sortable: checked } : c,
                                ),
                              );
                            }}
                            className="h-3.5 w-3.5 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
                          />
                        </td>
                        <td className="py-1.5 px-2 text-center flex justify-center">
                          <SelectDropdown
                            value={col.sortPriority}
                            options={["-", "1", "2", "3", "4", "5"]}
                            onChange={(val) => {
                              setColumnsConfig((prev) =>
                                prev.map((c) =>
                                  c.id === col.id ? { ...c, sortPriority: val } : c,
                                ),
                              );
                            }}
                            className="w-14"
                          />
                        </td>
                        <td className="py-1.5 px-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setColumnsConfig((prev) =>
                                prev.map((c) =>
                                  c.id === col.id
                                    ? {
                                        ...c,
                                        sortDirection:
                                          c.sortDirection === "asc" ? "desc" : "asc",
                                      }
                                    : c,
                                ),
                              );
                            }}
                            className="px-2 py-0.5 text-[10px] font-semibold rounded-md border border-border bg-background hover:bg-muted cursor-pointer transition-colors shadow-2xs"
                          >
                            {col.sortDirection === "asc" ? "↑ Asc" : "↓ Desc"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 rounded-md border border-border bg-card space-y-2">
                <label className="block text-xs font-semibold text-foreground">
                  Detail Report Download Mode
                </label>
                <div className="flex items-center gap-5 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer text-foreground select-none">
                    <input
                      type="radio"
                      name="detailDownloadMode"
                      checked={detailDownloadMode === "multiple"}
                      onChange={() => setDetailDownloadMode("multiple")}
                      className="h-3.5 w-3.5 text-[#0089FF] accent-[#0089FF] cursor-pointer"
                    />
                    <span className="font-medium">Multiple Sheet</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-foreground select-none">
                    <input
                      type="radio"
                      name="detailDownloadMode"
                      checked={detailDownloadMode === "single"}
                      onChange={() => setDetailDownloadMode("single")}
                      className="h-3.5 w-3.5 text-[#0089FF] accent-[#0089FF] cursor-pointer"
                    />
                    <span className="font-medium">Single Sheet</span>
                  </label>
                </div>
              </div>
            </div>

            <footer className="flex h-[56px] items-center justify-between border-t border-border bg-background px-5 shrink-0 select-none">
              <button
                type="button"
                onClick={() => setColumnsConfig(INITIAL_COLUMNS)}
                className="flex items-center gap-1.5 px-3 h-8 text-xs rounded-md border border-input/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all shadow-2xs active:scale-98"
              >
                <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Reset</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAdvanceModalOpen(false)}
                  className="px-3.5 h-8 text-xs rounded-md border border-input/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all shadow-2xs active:scale-98"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Advance configurations applied");
                    setAdvanceModalOpen(false);
                  }}
                  className="rounded-md bg-[#0089FF] px-4.5 h-8 text-xs font-semibold text-white shadow-xs hover:bg-[#0070d6] cursor-pointer transition-all active:scale-98"
                >
                  Save & Apply
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}

export const ScheduleDrawer = ScheduleModal;
