import {
  ArrowLeft,
  Bold,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Clock,
  FileSpreadsheet,
  FileText,
  Fuel,
  Italic,
  Loader2,
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
  COMPARATORS,
  DURATION_UNITS,
  VEHICLE_BRANDS,
  VEHICLE_MODELS,
  VEHICLE_TYPES,
  getBranchesForCompanies,
  getGroupsForBranches,
  getVehiclesForBranches,
} from "@/data/reports";
import { fleetObjects } from "@/data/fleet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type ReportFilters } from "@/components/report/ReportConfigPanel";
import {
  ColumnConfigModal,
  DEFAULT_COLUMN_SETTINGS,
  type ReportColumnSettings,
} from "@/components/report/ColumnConfigModal";
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
    nextRun: "18 Aug 2026, 08:30 PM",
    relativeType: "Today",
    timezone: "Asia/Kolkata (UTC+05:30)",
    scheduleType: "Daily",
    hasTimeRange: true,
    timeRangeStart: "08:00 AM",
    timeRangeEnd: "08:00 PM",
    generationTime: "21:00",
    reportType: "Daily",
    format: "PDF",
    actionType: "Email",
    toAddress: "audit@company.com",
    emailRetryWindow: "30",
    subject: "Daily Fuel and Activity Audit",
    message: "Automated daily fleet report containing fuel and activity details.",
    vehicleScope: "current",
    selectedVehicles: ["DL01XY5544", "GJ01EF3344", "MH03DE4242"],
  },
];

const RELATIVE_TYPES = [
  {
    label: "Today",
    value: "Today",
    description: "Current day from 12:00 AM until now",
  },
  {
    label: "Yesterday",
    value: "Yesterday",
    description: "Previous calendar day",
  },
  {
    label: "Last 7 Days",
    value: "Last 7 Days",
    description: "Previous 7 days including today",
  },
  {
    label: "This Week",
    value: "This Week",
    description: "Current week from Monday until today",
  },
  {
    label: "Last Week",
    value: "Last Week",
    description: "Previous complete week (Monday to Sunday)",
  },
  {
    label: "This Month",
    value: "This Month",
    description: "Current month from the 1st day until today",
  },
  {
    label: "Last Month",
    value: "Last Month",
    description: "Previous complete month",
  },
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

const TIME_OPTIONS = [
  "12:00 AM",
  "01:00 AM",
  "02:00 AM",
  "03:00 AM",
  "04:00 AM",
  "05:00 AM",
  "06:00 AM",
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
  "11:00 PM",
  "11:59 PM",
];

const SFTP_PLATFORMS = [
  "Amazon S3",
  "Google Cloud Storage",
  "Azure Blob Storage",
  "Custom SFTP Server",
];

const MEDIA_GATEWAYS = [
  "WhatsApp",
  "Telegram API",
  "SMS Gateway Provider",
  "Slack Webhook",
];

const DEFAULT_DRAFT: ScheduleItem = {
  id: "",
  name: "Travel Summary Schedule",
  status: "ACTIVE",
  nextRun: "Tomorrow, 09:00 AM",
  relativeType: "Today",
  timezone: "Asia/Kolkata (UTC+05:30)",
  scheduleType: "Daily",
  selectedDays: ["Mo", "Tu", "We", "Th", "Fr"],
  selectedDates: [1],
  hasTimeRange: true,
  timeRangeStart: "12:00 AM",
  timeRangeEnd: "11:59 PM",
  generationTime: "09:00",
  reportType: "Summary",
  format: "XLS",
  actionType: "Email",
  toAddress: "manager@company.com",
  emailRetryWindow: "15",
  subject: "Scheduled Travel Report",
  message: "Please find attached the scheduled travel report for your review.",
  vehicleScope: "current",
  selectedVehicles: [],
  // FTP defaults
  ftpHost: "ftp.fleetplatform.net",
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

export type DropdownOption =
  | string
  | {
      label: string;
      value?: string;
      description?: string;
    };

function SelectDropdown({
  value,
  options,
  onChange,
  className,
  placeholder,
}: {
  value: string;
  options: DropdownOption[];
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

  const selectedOption = options.find((opt) => {
    if (typeof opt === "object") {
      return (opt.value ?? opt.label) === value || opt.label === value;
    }
    return opt === value;
  });

  const displayLabel = selectedOption
    ? typeof selectedOption === "object"
      ? selectedOption.label
      : selectedOption
    : value || placeholder || "Select";

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input/80 bg-background px-3 text-xs shadow-2xs transition-all hover:border-[#0089FF]/60 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF] cursor-pointer select-none font-normal",
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
          {displayLabel}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground shrink-0 opacity-70 transition-transform duration-200 ml-1.5",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-72 overflow-y-auto rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md p-1 shadow-xl animate-in fade-in-0 zoom-in-95 select-none custom-scrollbar">
          {options.map((opt) => {
            const isObj = typeof opt === "object";
            const optLabel = isObj ? opt.label : opt;
            const optVal = isObj ? (opt.value ?? opt.label) : opt;
            const optDesc = isObj ? opt.description : undefined;
            const isSelected = value === optVal || value === optLabel;

            return (
              <button
                key={optVal}
                type="button"
                onClick={() => {
                  onChange(optVal);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors cursor-pointer select-none",
                  isSelected
                    ? "bg-muted font-semibold text-foreground"
                    : "text-foreground hover:bg-muted/80 font-normal",
                )}
              >
                <div className="flex flex-col min-w-0 pr-2">
                  <span
                    className={cn(
                      "text-xs leading-tight truncate",
                      isSelected
                        ? "font-semibold text-foreground"
                        : "font-medium text-foreground",
                    )}
                  >
                    {optLabel}
                  </span>
                  {optDesc && (
                    <span className="text-[11px] leading-snug text-muted-foreground mt-0.5 font-normal">
                      {optDesc}
                    </span>
                  )}
                </div>
                {isSelected && (
                  <Check className="h-4 w-4 text-[#0089FF] shrink-0 ml-1" />
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
          "flex h-9 w-full items-center justify-between rounded-md border border-input/80 bg-background px-3 text-xs shadow-2xs transition-all hover:border-[#0089FF]/60 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF] cursor-pointer select-none font-normal",
          open && "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-muted/40",
        )}
      >
        <div className="flex items-center min-w-0 flex-1 overflow-hidden">
          {!selected || selected.length === 0 ? (
            <span className="text-muted-foreground/60 font-normal italic truncate">
              {placeholder || `Select ${label}`}
            </span>
          ) : (
            <>
              <span className="text-foreground font-medium truncate">
                {selected[0]}
              </span>
              {selected.length > 1 && (
                <span className="ml-1.5 inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#0089FF]/10 text-[#0089FF] border border-[#0089FF]/20 shrink-0">
                  +{selected.length - 1}
                </span>
              )}
            </>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground shrink-0 opacity-70 transition-transform duration-200 ml-1.5",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 w-full rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md shadow-2xl animate-in fade-in-0 zoom-in-95 select-none overflow-hidden flex flex-col">
          <div className="p-3 pb-2.5 border-b border-border/60 bg-muted/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                Select {label}
              </span>
              <span className="text-[10px] font-semibold text-[#0089FF] bg-[#0089FF]/10 px-2 py-0.5 rounded-full">
                {draft.length} selected
              </span>
            </div>

            <div className="flex h-7 items-center gap-1.5 rounded-md border border-input/80 bg-background px-2 focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all">
              <Search className="h-3 w-3 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}…`}
                className="h-full flex-1 bg-transparent text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none min-w-0"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground select-none">
                <input
                  type="checkbox"
                  checked={isAllDraftSelected}
                  onChange={toggleAllDraft}
                  className="rounded border-input text-[#0089FF] cursor-pointer h-3.5 w-3.5 accent-[#0089FF]"
                />
                <span>Select all</span>
              </label>
              <span className="text-[11px] text-muted-foreground">
                {filteredOptions.length} available
              </span>
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
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
        : currentFilters?.companies && currentFilters.companies.length > 0 && !currentFilters.companies.includes("All")
          ? getBranchesForCompanies(currentFilters.companies)
          : BRANCHES;
    return getVehiclesForBranches(selectedBranches);
  }, [currentFilters]);

  const currentLoadedVehicleIds = useMemo(() => {
    if (currentFilters?.objects && currentFilters.objects.length > 0) {
      return currentFilters.objects;
    }
    return currentLoadedVehicles.map((v) => v.id);
  }, [currentFilters, currentLoadedVehicles]);

  // Form State
  const [draft, setDraft] = useState<ScheduleItem>(() => ({
    ...DEFAULT_DRAFT,
    name: `${reportTitle} Schedule`,
    vehicleScope: "current",
    selectedVehicles: currentLoadedVehicleIds,
  }));

  // Vehicle Selection Scope State: 'current' (Applied Filter) vs 'custom' (New Filter)
  const [vehicleFilterMode, setVehicleFilterMode] = useState<"current" | "custom">("current");

  // Advance Configuration Modal State
  const [advanceModalOpen, setAdvanceModalOpen] = useState(false);
  const [columnSettings, setColumnSettings] = useState<ReportColumnSettings>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("fleet-report-columns-v3");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.columns?.length) return parsed;
        }
      } catch {}
    }
    return DEFAULT_COLUMN_SETTINGS;
  });

  // Email Verification State
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<
    "idle" | "verifying" | "success" | "failed"
  >("idle");

  // Errors State
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // Reset Draft when opening Create Form
  useEffect(() => {
    if (open && !editingId) {
      setDraft({
        ...DEFAULT_DRAFT,
        name: `${reportTitle} Schedule`,
        vehicleScope: "current",
        selectedVehicles: currentLoadedVehicleIds,
      });
      setVehicleFilterMode("current");
      setEmailVerificationStatus("idle");
      setErrors({});
      setView("form");
    }
  }, [open, editingId, reportTitle, currentLoadedVehicleIds]);

  // Custom Vehicle Selection & Filter Options Overlay State
  const [vehicleOverlayOpen, setVehicleOverlayOpen] = useState(false);
  const [customVehicleSearch, setCustomVehicleSearch] = useState("");
  const [customFilterOverlayOpen, setCustomFilterOverlayOpen] = useState(false);
  const [customCompanies, setCustomCompanies] = useState<string[]>([]);
  const [customBranches, setCustomBranches] = useState<string[]>([]);
  const [customGroups, setCustomGroups] = useState<string[]>([]);
  const [customTypes, setCustomTypes] = useState<string[]>([]);
  const [customBrands, setCustomBrands] = useState<string[]>([]);
  const [customModels, setCustomModels] = useState<string[]>([]);
  const [customDurationCompare, setCustomDurationCompare] = useState("Greater Than");
  const [customDurationUnit, setCustomDurationUnit] = useState("Hour");
  const [customDurationValue, setCustomDurationValue] = useState("");
  const [customDistanceCompare, setCustomDistanceCompare] = useState("Greater Than");
  const [customDistanceValue, setCustomDistanceValue] = useState("");
  const [draftCustomVehicles, setDraftCustomVehicles] = useState<string[]>([]);
  const [vehicleBoxHeight, setVehicleBoxHeight] = useState<number>(190);
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

  // Cascading Company/Branch Logic for Custom Filter
  const customAvailableBranches = useMemo(() => {
    return getBranchesForCompanies(customCompanies);
  }, [customCompanies]);

  const customActiveBranches = useMemo(() => {
    if (customBranches.length > 0 && !customBranches.includes("All")) {
      return customBranches;
    }
    if (customCompanies.length > 0 && !customCompanies.includes("All")) {
      return customAvailableBranches;
    }
    return BRANCHES;
  }, [customBranches, customCompanies, customAvailableBranches]);

  const customGroupOptions = useMemo(() => {
    return getGroupsForBranches(customActiveBranches);
  }, [customActiveBranches]);

  const customActiveFilterCount = useMemo(() => {
    let count = 0;
    if (customCompanies.length > 0 && !customCompanies.includes("All")) count++;
    if (customBranches.length > 0 && !customBranches.includes("All")) count++;
    return count;
  }, [customCompanies, customBranches]);

  const allAvailableCustomVehicles = useMemo(() => {
    return getVehiclesForBranches(customActiveBranches);
  }, [customActiveBranches]);

  // Filter custom vehicles based on search, group, type, brand, model
  const filteredCustomVehicles = useMemo(() => {
    const q = customVehicleSearch.trim().toLowerCase();
    return allAvailableCustomVehicles.filter((v) => {
      // Group filter
      if (customGroups.length > 0 && !customGroups.includes("All")) {
        const vFleet = fleetObjects.find((fo) => fo.id === v.id);
        if (vFleet?.group && !customGroups.includes(vFleet.group)) {
          return false;
        }
      }
      // Type filter
      if (customTypes.length > 0 && !customTypes.includes("All")) {
        const vFleet = fleetObjects.find((fo) => fo.id === v.id);
        if (vFleet?.type && !customTypes.includes(vFleet.type)) {
          return false;
        }
      }
      // Brand filter
      if (customBrands.length > 0 && !customBrands.includes("All") && customBrands[0] !== "") {
        const vFleet = fleetObjects.find((fo) => fo.id === v.id);
        if (vFleet?.brand && vFleet.brand !== customBrands[0]) {
          return false;
        }
      }
      // Model filter
      if (customModels.length > 0 && !customModels.includes("All") && customModels[0] !== "") {
        const vFleet = fleetObjects.find((fo) => fo.id === v.id);
        if (vFleet?.model && vFleet.model !== customModels[0]) {
          return false;
        }
      }
      // Search query filter
      if (q) {
        const matchName = v.name.toLowerCase().includes(q);
        const matchImei = v.imei.toLowerCase().includes(q);
        const matchBranch = v.branch.toLowerCase().includes(q);
        const matchDriver = (v.driver || "").toLowerCase().includes(q);
        if (!matchName && !matchImei && !matchBranch && !matchDriver) {
          return false;
        }
      }
      return true;
    });
  }, [
    allAvailableCustomVehicles,
    customGroups,
    customTypes,
    customBrands,
    customModels,
    customVehicleSearch,
  ]);

  const customFilteredVehicleIds = useMemo(() => {
    return filteredCustomVehicles.map((v) => v.id);
  }, [filteredCustomVehicles]);

  const groupedCustomVehicles = useMemo(() => {
    const map = new Map<
      string,
      { id: string; name: string; imei: string; branch: string; driver?: string }[]
    >();

    for (const branch of customActiveBranches) {
      const vList = filteredCustomVehicles.filter((v) => v.branch === branch);
      if (vList.length > 0) {
        map.set(branch, vList);
      }
    }

    return Array.from(map.entries()).map(([branch, vehicles]) => ({
      branch,
      vehicles,
    }));
  }, [customActiveBranches, filteredCustomVehicles]);

  const handleCustomCompanyChange = (companies: string[]) => {
    setCustomCompanies(companies);
    const newAvail = getBranchesForCompanies(companies);
    setCustomBranches((prev) => prev.filter((b) => newAvail.includes(b)));
  };

  const handleCustomBranchChange = (branches: string[]) => {
    setCustomBranches(branches);
  };

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
    const branchIds = branchVehicles.map((v) => v.id);
    const allInBranchSelected = branchIds.every((id) =>
      draftCustomVehicles.includes(id),
    );

    if (allInBranchSelected) {
      setDraftCustomVehicles(draftCustomVehicles.filter((id) => !branchIds.includes(id)));
    } else {
      setDraftCustomVehicles(Array.from(new Set([...draftCustomVehicles, ...branchIds])));
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
  const resizeStartHeight = useRef(190);

  const startResizeVehicleBox = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isResizingVehicleBox.current = true;
      resizeStartY.current = e.clientY;
      resizeStartHeight.current = vehicleBoxHeight;

      const handleMouseMove = (event: MouseEvent) => {
        if (!isResizingVehicleBox.current) return;
        const delta = event.clientY - resizeStartY.current;
        const newH = Math.min(Math.max(resizeStartHeight.current + delta, 100), 520);
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

  const handleResetCustomFilters = () => {
    setCustomCompanies([]);
    setCustomBranches([]);
    setCustomGroups([]);
    setCustomTypes([]);
    setCustomBrands([]);
    setCustomModels([]);
    setCustomDurationCompare("Greater Than");
    setCustomDurationUnit("Hour");
    setCustomDurationValue("");
    setCustomDistanceCompare("Greater Than");
    setCustomDistanceValue("");
    setCustomVehicleSearch("");
    setDraftCustomVehicles(allAvailableCustomVehicles.map((v) => v.id));
    toast.info("Filter options reset to default");
  };

  const handleApplyCustomFilters = () => {
    const chosen =
      draftCustomVehicles.length > 0
        ? draftCustomVehicles
        : customFilteredVehicleIds;
    setDraft((d) => ({ ...d, selectedVehicles: chosen }));
    setVehicleFilterMode("custom");
    setVehicleOverlayOpen(false);
    toast.success(`${chosen.length} vehicles selected for report schedule`);
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

  const copyOptions = useMemo(() => {
    return ["None", ...schedules.map((s) => s.name)];
  }, [schedules]);

  const handleCopyFrom = (selectedName: string) => {
    if (!selectedName || selectedName === "None") return;
    const found = schedules.find((s) => s.name === selectedName);
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

    setEditingId(null);
    setView("list");
  };

  const handleDelete = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    toast.success("Schedule removed");
  };

  const toggleDayOfWeek = (dayId: string) => {
    const current = draft.selectedDays || [];
    if (current.includes(dayId)) {
      if (current.length > 1) {
        setDraft((d) => ({ ...d, selectedDays: current.filter((x) => x !== dayId) }));
      }
    } else {
      setDraft((d) => ({ ...d, selectedDays: [...current, dayId] }));
    }
  };

  const toggleMonthDate = (dateNum: number) => {
    const current = draft.selectedDates || [1];
    if (current.includes(dateNum)) {
      if (current.length > 1) {
        setDraft((d) => ({
          ...d,
          selectedDates: current.filter((x) => x !== dateNum),
        }));
      }
    } else {
      setDraft((d) => ({
        ...d,
        selectedDates: [...current, dateNum].sort((a, b) => a - b),
      }));
    }
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

      {/* Standard Side Panel Drawer matching Application Design System */}
      <aside
        aria-hidden={!open}
        aria-label="Scheduled Reports"
        className={cn(
          "fixed right-0 top-[45px] bottom-0 z-40 flex w-full max-w-[480px] xl:max-w-[500px] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out overflow-hidden",
          open ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
      >
        {/* Standardized 56px Header */}
        <header className="flex h-[56px] items-center justify-between border-b border-border px-6 bg-background select-none shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {view === "form" && (
              <button
                type="button"
                onClick={() => setView("list")}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer mr-0.5"
                title="Back to scheduled reports list"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <h2 className="text-[16px] font-semibold tracking-tight text-foreground truncate">
              {view === "list"
                ? "Scheduled Reports"
                : editingId
                  ? "Edit Schedule Report"
                  : "Schedule Report"}
            </h2>
          </div>
          <div className="flex items-center gap-1 shrink-0">
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

        {/* View 1: Saved Schedule List View matching Application Design System */}
        {view === "list" ? (
          <div className="flex flex-1 min-h-0 flex-col bg-background">
            {/* Search Bar */}
            <div className="p-4 border-b border-border bg-muted/20 shrink-0">
              <div className="flex h-9 items-center gap-2 rounded-md border border-input/80 bg-background px-3 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] hover:border-[#0089FF]/60 transition-all">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search schedules..."
                  className="h-full flex-1 bg-transparent text-xs font-normal text-foreground placeholder:text-muted-foreground/60 focus:outline-none min-w-0"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* List Body without heavy cards, clean divided rows matching Design System */}
            <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-border/60 custom-scrollbar">
              {filteredSchedules.map((item) => {
                const iconScheme = getScheduleIconScheme(item);
                return (
                  <div
                    key={item.id}
                    className="p-4 hover:bg-muted/30 transition-colors group flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                          iconScheme.badgeBg,
                          iconScheme.borderColor,
                          iconScheme.iconColor,
                        )}
                      >
                        {iconScheme.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-foreground truncate">
                            {item.name}
                          </h4>
                          <span
                            className={cn(
                              "px-1.5 py-0.2 rounded-full text-[9px] font-bold tracking-wide uppercase shrink-0",
                              item.status === "ACTIVE"
                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                : "bg-muted text-muted-foreground",
                            )}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground truncate font-normal">
                          {formatRecurrence(item)} · {item.relativeType} · {item.generationTime}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="h-8 w-8 rounded-md border border-border/80 bg-background flex items-center justify-center text-muted-foreground hover:text-[#0089FF] hover:border-[#0089FF]/60 hover:bg-muted transition-all cursor-pointer shadow-2xs active:scale-95"
                        title="Edit schedule"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <RowDeletePopover
                        itemName={item.name}
                        onDelete={() => handleDelete(item.id)}
                      />
                    </div>
                  </div>
                );
              })}

              {filteredSchedules.length === 0 && (
                <div className="flex flex-col items-center justify-center py-14 text-center text-muted-foreground">
                  <FileSpreadsheet className="h-10 w-10 text-muted-foreground/40 mb-2" />
                  <p className="text-xs font-semibold text-foreground">
                    No scheduled reports found
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Create a new schedule to automate delivery
                  </p>
                </div>
              )}
            </div>

            {/* List Footer (60px) */}
            <footer className="flex h-[60px] items-center justify-end border-t border-border px-6 bg-background select-none shrink-0">
              <button
                type="button"
                onClick={startCreate}
                className="h-9 rounded-md bg-[#0089FF] px-5 text-xs font-semibold text-white shadow-xs hover:bg-[#0070d6] transition-all cursor-pointer active:scale-98 flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>New Schedule</span>
              </button>
            </footer>
          </div>
        ) : (
          /* View 2: Form View (Direct Create / Edit Schedule Configuration matching Design System) */
          <div className="flex flex-1 min-h-0 flex-col bg-background">
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              {/* Report Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
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
                  placeholder="e.g. Travel Summary Schedule"
                  className={cn(
                    "h-9 w-full rounded-md border bg-background px-3 text-xs font-normal text-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none",
                    errors.name
                      ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-input/80 hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20",
                  )}
                />
                {errors.name && (
                  <p className="text-[11px] text-red-500 font-medium">{errors.name}</p>
                )}
              </div>

              {/* File Format */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  File Format <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(["XLS", "PDF", "CSV"] as const).map((fmt) => (
                    <label
                      key={fmt}
                      onClick={() => setDraft((d) => ({ ...d, format: fmt }))}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md border px-3 py-2 transition-all cursor-pointer select-none text-left h-9",
                        draft.format === fmt
                          ? "border-[#0089FF] bg-[#0089FF]/5 shadow-xs ring-1 ring-[#0089FF]/30 text-foreground font-semibold"
                          : "border-input/80 bg-background hover:bg-muted/40 hover:border-border text-foreground font-medium",
                      )}
                    >
                      <input
                        type="radio"
                        name="fileFormat"
                        checked={draft.format === fmt}
                        onChange={() => setDraft((d) => ({ ...d, format: fmt }))}
                        className="accent-[#0089FF] h-4 w-4 cursor-pointer"
                      />
                      <span className="text-xs leading-tight">
                        {fmt}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Report Content */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Report Content <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Option 1: Current Filter */}
                  <label
                    onClick={() => setVehicleFilterMode("current")}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md border px-3 py-2 transition-all cursor-pointer select-none text-left h-9",
                      vehicleFilterMode === "current"
                        ? "border-[#0089FF] bg-[#0089FF]/5 shadow-xs ring-1 ring-[#0089FF]/30 text-foreground font-semibold"
                        : "border-input/80 bg-background hover:bg-muted/40 hover:border-border text-foreground font-medium",
                    )}
                  >
                    <input
                      type="radio"
                      name="vehicleScope"
                      checked={vehicleFilterMode === "current"}
                      onChange={() => setVehicleFilterMode("current")}
                      className="accent-[#0089FF] h-4 w-4 cursor-pointer"
                    />
                    <span className="text-xs leading-tight truncate">
                      Current Filter
                    </span>
                  </label>

                  {/* Option 2: Custom Filter */}
                  <div
                    onClick={() => setVehicleFilterMode("custom")}
                    className={cn(
                      "flex items-center justify-between rounded-md border px-3 py-2 transition-all cursor-pointer select-none text-left h-9 relative",
                      vehicleFilterMode === "custom"
                        ? "border-[#0089FF] bg-[#0089FF]/5 shadow-xs ring-1 ring-[#0089FF]/30 text-foreground font-semibold"
                        : "border-input/80 bg-background hover:bg-muted/40 hover:border-border text-foreground font-medium",
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="radio"
                        name="vehicleScope"
                        checked={vehicleFilterMode === "custom"}
                        onChange={() => setVehicleFilterMode("custom")}
                        className="accent-[#0089FF] h-4 w-4 cursor-pointer"
                      />
                      <span className="text-xs leading-tight truncate">
                        Custom Filter
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCustomVehicleOverlay();
                      }}
                      title="Change vehicle filter"
                      aria-label="Change vehicle filter"
                      className="p-1 rounded text-[#0089FF] hover:text-[#0070d6] hover:bg-[#0089FF]/10 cursor-pointer transition-all active:scale-90 shrink-0"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Copy From */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Copy From
                </label>
                <SelectDropdown
                  value="None"
                  options={copyOptions}
                  onChange={handleCopyFrom}
                  placeholder="None"
                />
              </div>

              {/* Relative Type */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Relative Type <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <SelectDropdown
                  value={draft.relativeType}
                  options={RELATIVE_TYPES}
                  onChange={(relativeType) => {
                    let nextScheduleType = draft.scheduleType;
                    if (relativeType === "This Week" || relativeType === "Last Week") {
                      nextScheduleType = "Weekly";
                    } else if (relativeType === "This Month" || relativeType === "Last Month") {
                      nextScheduleType = "Monthly";
                    } else if (
                      relativeType === "Today" ||
                      relativeType === "Yesterday" ||
                      relativeType === "Last 7 Days"
                    ) {
                      nextScheduleType = "Daily";
                    }
                    setDraft((d) => ({
                      ...d,
                      relativeType,
                      scheduleType: nextScheduleType,
                    }));
                  }}
                  placeholder="Select Relative Type"
                />

                {/* Weekly: Day Selection Pills directly below Relative Type */}
                {(draft.relativeType === "This Week" ||
                  draft.relativeType === "Last Week" ||
                  draft.scheduleType === "Weekly") && (
                  <div className="pt-2 space-y-1.5 animate-in fade-in-50 duration-150">
                    <label className="block text-xs font-semibold text-foreground">
                      Select Day(s) of Week <span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {WEEK_DAYS.map((day) => {
                        const isSelected = (draft.selectedDays || []).includes(day.id);
                        return (
                          <button
                            key={day.id}
                            type="button"
                            onClick={() => toggleDayOfWeek(day.id)}
                            className={cn(
                              "h-8.5 w-8.5 rounded-md text-xs font-semibold transition-all cursor-pointer select-none flex items-center justify-center",
                              isSelected
                                ? "bg-[#0089FF] text-white shadow-xs"
                                : "border border-border/80 bg-background text-foreground hover:bg-muted/60 shadow-2xs",
                            )}
                          >
                            {day.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Monthly: Day/Date Selection Pills (1 to 31) directly below Relative Type */}
                {(draft.relativeType === "This Month" ||
                  draft.relativeType === "Last Month" ||
                  draft.scheduleType === "Monthly") && (
                  <div className="pt-2 space-y-1.5 animate-in fade-in-50 duration-150">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-foreground">
                        Select Month Date(s) <span className="text-red-500 font-bold ml-0.5">*</span>
                      </label>
                      <span className="text-xs font-medium text-muted-foreground">
                        {(draft.selectedDates || []).length} selected
                      </span>
                    </div>
                    <div className="grid grid-cols-7 gap-1.5">
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((dateNum) => {
                        const isSelected = (draft.selectedDates || []).includes(dateNum);
                        return (
                          <button
                            key={dateNum}
                            type="button"
                            onClick={() => toggleMonthDate(dateNum)}
                            className={cn(
                              "h-8.5 rounded-md text-xs font-semibold transition-all cursor-pointer select-none flex items-center justify-center",
                              isSelected
                                ? "bg-[#0089FF] text-white shadow-xs"
                                : "border border-border/80 bg-background text-foreground hover:bg-muted/60 shadow-2xs",
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

              {/* Time Range Checkbox & Pickers - Placed directly below Relative Type */}
              <div className="space-y-2 pt-1 pb-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-foreground select-none">
                  <input
                    type="checkbox"
                    checked={draft.hasTimeRange}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, hasTimeRange: e.target.checked }))
                    }
                    className="rounded border-input text-[#0089FF] cursor-pointer h-4 w-4 accent-[#0089FF]"
                  />
                  <span>Time Range</span>
                </label>

                {draft.hasTimeRange && (
                  <div className="grid grid-cols-2 gap-3.5 pt-1 animate-in fade-in-50 duration-150">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground">
                        Start Time
                      </label>
                      <SelectDropdown
                        value={draft.timeRangeStart || "12:00 AM"}
                        options={TIME_OPTIONS}
                        onChange={(timeRangeStart) =>
                          setDraft((d) => ({ ...d, timeRangeStart }))
                        }
                        placeholder="Start Time"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground">
                        End Time
                      </label>
                      <SelectDropdown
                        value={draft.timeRangeEnd || "11:59 PM"}
                        options={TIME_OPTIONS}
                        onChange={(timeRangeEnd) =>
                          setDraft((d) => ({ ...d, timeRangeEnd }))
                        }
                        placeholder="End Time"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Timezone & Generation Time in a single row */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Timezone <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <SelectDropdown
                    value={draft.timezone}
                    options={TIMEZONES}
                    onChange={(timezone) => setDraft((d) => ({ ...d, timezone }))}
                    placeholder="Select Timezone"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Generation Time <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <SelectDropdown
                    value={draft.generationTime}
                    options={GENERATION_TIMES}
                    onChange={(generationTime) => setDraft((d) => ({ ...d, generationTime }))}
                    placeholder="Select Generation Time"
                  />
                </div>
              </div>

              {/* Report Type */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Report Type <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(["Summary", "Daily", "Detail"] as const).map((t) => (
                    <label
                      key={t}
                      onClick={() => setDraft((d) => ({ ...d, reportType: t }))}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md border px-3 py-2 transition-all cursor-pointer select-none text-left h-9",
                        draft.reportType === t
                          ? "border-[#0089FF] bg-[#0089FF]/5 shadow-xs ring-1 ring-[#0089FF]/30 text-foreground font-semibold"
                          : "border-input/80 bg-background hover:bg-muted/40 hover:border-border text-foreground font-medium",
                      )}
                    >
                      <input
                        type="radio"
                        name="reportType"
                        checked={draft.reportType === t}
                        onChange={() => setDraft((d) => ({ ...d, reportType: t }))}
                        className="accent-[#0089FF] h-4 w-4 cursor-pointer"
                      />
                      <span className="text-xs leading-tight">
                        {t}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Delivery Method */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Delivery Method <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(["Email", "FTP", "SFTP", "Media API"] as const).map((method) => (
                    <label
                      key={method}
                      onClick={() => setDraft((d) => ({ ...d, actionType: method }))}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md border px-3 py-2 transition-all cursor-pointer select-none text-left h-9",
                        draft.actionType === method
                          ? "border-[#0089FF] bg-[#0089FF]/5 shadow-xs ring-1 ring-[#0089FF]/30 text-foreground font-semibold"
                          : "border-input/80 bg-background hover:bg-muted/40 hover:border-border text-foreground font-medium",
                      )}
                    >
                      <input
                        type="radio"
                        name="actionType"
                        checked={draft.actionType === method}
                        onChange={() => setDraft((d) => ({ ...d, actionType: method }))}
                        className="accent-[#0089FF] h-4 w-4 cursor-pointer"
                      />
                      <span className="text-xs leading-tight truncate">
                        {method}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Delivery Configuration Details: Email */}
              {draft.actionType === "Email" && (
                <div className="pt-1 space-y-4 animate-in fade-in-50 duration-150">
                  {/* Email Address with Verification */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Email Address <span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="email"
                        value={draft.toAddress}
                        onChange={(e) => {
                          setDraft((d) => ({ ...d, toAddress: e.target.value }));
                          setEmailVerificationStatus("idle");
                          if (e.target.value.trim()) {
                            setErrors((prev) => ({ ...prev, toAddress: undefined }));
                          }
                        }}
                        placeholder="manager@company.com"
                        className={cn(
                          "h-9 w-full rounded-md border bg-background pl-3 pr-24 text-xs font-normal text-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none",
                          errors.toAddress
                            ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : "border-input/80 hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20",
                        )}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyEmail}
                        disabled={emailVerificationStatus === "verifying"}
                        className={cn(
                          "absolute right-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer active:scale-95 select-none",
                          emailVerificationStatus === "success"
                            ? "text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20"
                            : emailVerificationStatus === "failed"
                              ? "text-rose-600 bg-rose-500/10 hover:bg-rose-500/20"
                              : "text-foreground hover:text-[#0089FF] hover:bg-muted/80",
                        )}
                      >
                        {emailVerificationStatus === "verifying" ? (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Loader2 className="h-3 w-3 animate-spin" /> Verifying…
                          </span>
                        ) : emailVerificationStatus === "success" ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                          </span>
                        ) : emailVerificationStatus === "failed" ? (
                          <span className="flex items-center gap-1">
                            <XCircle className="h-3.5 w-3.5" /> Failed
                          </span>
                        ) : (
                          "Verify"
                        )}
                      </button>
                    </div>
                    {errors.toAddress && (
                      <p className="text-[11px] text-red-500 font-medium">{errors.toAddress}</p>
                    )}
                  </div>

                  {/* Retry Window & Subject Row */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={draft.subject}
                        onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))}
                        placeholder="Scheduled Travel Report"
                        className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs font-normal text-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground">
                        Email Retry Window (Mins)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={draft.emailRetryWindow}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, emailRetryWindow: e.target.value }))
                        }
                        placeholder="15"
                        className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs font-normal text-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Message with Rich Text Buttons */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-foreground">
                        Message
                      </label>
                      <div className="flex items-center gap-1 border border-border/80 rounded-md px-1.5 py-0.5 bg-background shadow-2xs">
                        <button
                          type="button"
                          className="p-1 rounded-xs hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Bold className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          className="p-1 rounded-xs hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Italic className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          className="p-1 rounded-xs hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Underline className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={3}
                      value={draft.message}
                      onChange={(e) => setDraft((d) => ({ ...d, message: e.target.value }))}
                      placeholder="Write your email body message here..."
                      className="w-full min-h-[90px] rounded-md border border-input/80 bg-background p-3 text-xs font-normal text-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs custom-scrollbar leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* Delivery Configuration Details: FTP */}
              {draft.actionType === "FTP" && (
                <div className="pt-1 space-y-4 animate-in fade-in-50 duration-150">
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground">
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
                          "h-9 w-full rounded-md border bg-background px-3 text-xs font-normal text-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none",
                          errors.ftpHost
                            ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : "border-input/80 hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20",
                        )}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground">
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
                          "h-9 w-full rounded-md border bg-background px-3 text-xs font-normal text-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none",
                          errors.ftpPort
                            ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : "border-input/80 hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20",
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground">
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
                        className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs font-normal text-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground">
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
                        className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs font-normal text-foreground placeholder:font-medium placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
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
                      className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs font-normal text-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Delivery Configuration Details: SFTP */}
              {draft.actionType === "SFTP" && (
                <div className="pt-1 space-y-4 animate-in fade-in-50 duration-150">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Platform <span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>
                    <SelectDropdown
                      value={draft.sftpPlatform || "Amazon S3"}
                      options={SFTP_PLATFORMS}
                      onChange={(sftpPlatform) => setDraft((d) => ({ ...d, sftpPlatform }))}
                      placeholder="Select Platform"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground">
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
                        className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs font-normal text-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground">
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
                        placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                        className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs font-normal text-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground">
                        Region <span className="text-red-500 font-bold ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        value={draft.sftpRegion || "ap-south-1"}
                        onChange={(e) => {
                          setDraft((d) => ({ ...d, sftpRegion: e.target.value }));
                          if (e.target.value.trim())
                            setErrors((prev) => ({ ...prev, sftpRegion: undefined }));
                        }}
                        placeholder="ap-south-1"
                        className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs font-normal text-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground">
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
                        placeholder="my-fleet-reports"
                        className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs font-normal text-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery Configuration Details: Media API / WhatsApp */}
              {draft.actionType === "Media API" && (
                <div className="pt-1 space-y-4 animate-in fade-in-50 duration-150">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Media Gateway <span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>
                    <SelectDropdown
                      value={draft.mediaGateway || "WhatsApp"}
                      options={MEDIA_GATEWAYS}
                      onChange={(mediaGateway) => setDraft((d) => ({ ...d, mediaGateway }))}
                      placeholder="Select Media Gateway"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Recipient Mobile Number(s) <span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      value={draft.mediaRecipientNumber || ""}
                      onChange={(e) => {
                        setDraft((d) => ({ ...d, mediaRecipientNumber: e.target.value }));
                        if (e.target.value.trim())
                          setErrors((prev) => ({ ...prev, mediaRecipientNumber: undefined }));
                      }}
                      placeholder="+91 9876543210, +91 9898989898"
                      className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs font-normal text-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none"
                    />
                    <p className="text-[11px] text-muted-foreground font-normal">
                      Separate multiple numbers with commas (include country code).
                    </p>
                  </div>
                </div>
              )}

              {/* Advance Configuration Trigger */}
              <div className="pt-1.5">
                <button
                  type="button"
                  onClick={() => setAdvanceModalOpen(true)}
                  className="flex items-center gap-2 text-xs font-semibold text-[#0089FF] hover:text-[#0070d6] cursor-pointer transition-colors"
                >
                  <Settings2 className="h-4 w-4" />
                  <span>Advance Configuration</span>
                </button>
              </div>
            </div>

            {/* Standardized 60px Footer */}
            <footer className="flex h-[60px] items-center justify-between border-t border-border px-6 bg-background select-none shrink-0">
              <button
                type="button"
                onClick={() => setView("list")}
                className="h-9 rounded-md border border-input/80 bg-background px-4 text-xs font-medium text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs active:scale-98 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="h-9 rounded-md bg-[#0089FF] px-6 text-xs font-semibold text-white shadow-xs hover:bg-[#0070d6] transition-all cursor-pointer active:scale-98"
              >
                {editingId ? "Update" : "Schedule"}
              </button>
            </footer>
          </div>
        )}

        {/* Filter Options Overlay directly inside the Side Panel matching Application Design System */}
        {vehicleOverlayOpen && (
          <div className="absolute inset-0 z-30 flex flex-col bg-background animate-in slide-in-from-right-10 duration-200">
            {/* Header (56px) */}
            <header className="flex h-[56px] items-center justify-between border-b border-border px-5 bg-background select-none shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVehicleOverlayOpen(false)}
                  className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer mr-1"
                  title="Back to schedule settings"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <h2 className="text-[16px] font-semibold tracking-tight text-foreground">
                  Filter Options
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close filter options"
                onClick={() => setVehicleOverlayOpen(false)}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {/* Main Body: Scrollable with top filter bar, chips, vehicle list box, and form dropdowns below */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
              {/* 1. Top Search Bar with Embedded Filter/Edit Button */}
              <div className="relative shrink-0">
                <div className="flex h-7.5 items-center gap-1.5 rounded-md border border-input/80 bg-background px-2.5 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] hover:border-[#0089FF]/60 transition-all">
                  <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <input
                    type="text"
                    value={customVehicleSearch}
                    onChange={(e) => setCustomVehicleSearch(e.target.value)}
                    placeholder="Select vehicle"
                    aria-label="Search vehicles"
                    className="h-full flex-1 bg-transparent text-xs font-medium text-foreground placeholder:font-medium placeholder:italic placeholder:text-muted-foreground/60 focus:outline-none min-w-0"
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

                  {/* Filter Button */}
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

                {/* Company & Branch Filter Popover */}
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

                      {/* Overlay Popover Footer */}
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

              {/* 2. Resizable Vehicle Checklist Tree */}
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

              {/* 3. Filter Form Fields matching Design System (Group, Type, Brand, Model, Thresholds) */}
              <div className="space-y-3 pt-1">
                {/* Group */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-foreground">
                    Group
                  </label>
                  <UniversalMultiSelectDropdown
                    label="Group"
                    selected={customGroups}
                    options={customGroupOptions}
                    onChange={setCustomGroups}
                    placeholder="Select Group"
                  />
                </div>

                {/* Type */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-foreground">
                    Type
                  </label>
                  <UniversalMultiSelectDropdown
                    label="Type"
                    selected={customTypes}
                    options={VEHICLE_TYPES.filter((t) => t !== "All")}
                    onChange={setCustomTypes}
                    placeholder="Select Type"
                  />
                </div>

                {/* Brand */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-foreground">
                    Brand
                  </label>
                  <SelectDropdown
                    value={customBrands[0] || ""}
                    options={VEHICLE_BRANDS}
                    onChange={(b) => setCustomBrands(b && b !== "All" ? [b] : [])}
                    placeholder="Select Brand"
                  />
                </div>

                {/* Model */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-foreground">
                    Model
                  </label>
                  <SelectDropdown
                    value={customModels[0] || ""}
                    options={VEHICLE_MODELS}
                    onChange={(m) => setCustomModels(m && m !== "All" ? [m] : [])}
                    placeholder="Select Model"
                  />
                </div>

                {/* Duration Threshold */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-foreground">
                    Duration Threshold
                  </label>
                  <div className="grid grid-cols-12 gap-1.5">
                    <div className="col-span-5">
                      <SelectDropdown
                        value={customDurationCompare}
                        options={COMPARATORS}
                        onChange={setCustomDurationCompare}
                        placeholder="Comparator"
                      />
                    </div>
                    <div className="col-span-4">
                      <SelectDropdown
                        value={customDurationUnit}
                        options={DURATION_UNITS}
                        onChange={setCustomDurationUnit}
                        placeholder="Unit"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={customDurationValue}
                        onChange={(e) => setCustomDurationValue(e.target.value)}
                        placeholder="e.g. 5"
                        className="h-7.5 w-full rounded-md border border-input/80 bg-background px-2 text-xs font-medium text-foreground placeholder:font-medium placeholder:italic placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 shadow-2xs transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Distance Threshold (km) */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-foreground">
                    Distance Threshold (km)
                  </label>
                  <div className="grid grid-cols-12 gap-1.5">
                    <div className="col-span-7">
                      <SelectDropdown
                        value={customDistanceCompare}
                        options={COMPARATORS}
                        onChange={setCustomDistanceCompare}
                        placeholder="Comparator"
                      />
                    </div>
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={customDistanceValue}
                        onChange={(e) => setCustomDistanceValue(e.target.value)}
                        placeholder="e.g. 5"
                        className="h-7.5 w-full rounded-md border border-input/80 bg-background px-2 text-xs font-medium text-foreground placeholder:font-medium placeholder:italic placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 shadow-2xs transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Standardized Drawer Footer matching Application Design System (56px) */}
            <footer className="flex h-[56px] items-center justify-between border-t border-border bg-background px-5 shrink-0 select-none">
              <button
                type="button"
                onClick={handleResetCustomFilters}
                className="inline-flex items-center gap-1.5 rounded-md border border-input/80 bg-background px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-muted cursor-pointer shadow-2xs active:scale-98"
              >
                <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={handleApplyCustomFilters}
                className="h-8 rounded-md bg-[#0089FF] px-5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#0070d6] cursor-pointer active:scale-98"
              >
                Apply Filters
              </button>
            </footer>
          </div>
        )}
      </aside>

      {/* Column Setting Modal for Advance Configuration */}
      {advanceModalOpen && (
        <ColumnConfigModal
          open={advanceModalOpen}
          onClose={() => setAdvanceModalOpen(false)}
          settings={columnSettings}
          hideDetailTab={true}
          onSave={(newSettings) => {
            setColumnSettings(newSettings);
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem(
                  "fleet-report-columns-v3",
                  JSON.stringify(newSettings),
                );
              } catch {}
            }
            setAdvanceModalOpen(false);
          }}
        />
      )}
    </>
  );
}

export const ScheduleDrawer = ScheduleModal;
export default ScheduleModal;
