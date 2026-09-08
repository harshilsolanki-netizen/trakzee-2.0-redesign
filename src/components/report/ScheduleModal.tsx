import {
  ArrowLeft,
  ArrowRight,
  Bold,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Download,
  FileSpreadsheet,
  FileText,
  Fuel,
  GripVertical,
  HelpCircle,
  Italic,
  Layers,
  List,
  Mail,
  Map as MapIcon,
  MoreVertical,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Settings2,
  Sliders,
  Trash2,
  Underline,
  UploadCloud,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  COMPARATORS,
  COMPANIES,
  DURATION_STATUS,
  DURATION_UNITS,
  VEHICLE_BRANDS,
  VEHICLE_MODELS,
  VEHICLE_TYPES,
  getBranchesForCompanies,
  getGroupsForBranches,
  getVehiclesForBranches,
} from "@/data/reports";
import { fleetObjects, type FleetObject } from "@/data/fleet";
import { cn } from "@/lib/utils";

export type ScheduleItem = {
  id: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  nextRun: string;
  relativeType: string;
  timezone: string;
  scheduleType: "Daily" | "Weekly" | "Monthly";
  selectedDays?: string[]; // e.g. ["Mo", "We", "Fr"]
  selectedDates?: number[]; // e.g. [1, 15]
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
  selectedVehicles: string[];
  // FTP Configuration
  ftpHost?: string;
  ftpPort?: string;
  ftpUsername?: string;
  ftpPassword?: string;
  ftpFolder?: string;
  // SFTP Configuration (Cloud Storage)
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
    id: "endLocation",
    label: "End Location",
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
    sortPriority: "3",
    sortDirection: "desc",
  },
  {
    id: "running",
    label: "Running Time",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: "-",
    sortDirection: "asc",
  },
  {
    id: "idle",
    label: "Idle Time",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: "-",
    sortDirection: "asc",
  },
  {
    id: "stop",
    label: "Stop Time",
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
    name: "Weekly Travel Summary",
    status: "ACTIVE",
    nextRun: "21 Aug 2026, 03:00 PM",
    relativeType: "This Week",
    timezone: "Asia/Kolkata (UTC+05:30)",
    scheduleType: "Weekly",
    selectedDays: ["Mo"],
    hasTimeRange: true,
    timeRangeStart: "12:00 AM",
    timeRangeEnd: "11:59 PM",
    generationTime: "15:00",
    reportType: "Summary",
    format: "XLS",
    actionType: "Email",
    toAddress: "manager@company.com",
    emailRetryWindow: "15",
    subject: "Weekly Travel Summary Report",
    message:
      "Please find attached the latest travel summary report for review.",
    selectedVehicles: ["KA01AB9988", "TS07FA7788", "MH12AB1234"],
  },
  {
    id: "sched-2",
    name: "Daily Fuel & Distance Audit",
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
    subject: "Daily Fuel & Distance Audit",
    message: "Attached is the automated daily audit log.",
    selectedVehicles: ["KA01AB9988", "MH03DE4242"],
  },
  {
    id: "sched-3",
    name: "Vehicle Idle Report",
    status: "ACTIVE",
    nextRun: "22 Aug 2026, 11:00 PM",
    relativeType: "Yesterday",
    timezone: "Asia/Kolkata (UTC+05:30)",
    scheduleType: "Daily",
    hasTimeRange: true,
    timeRangeStart: "00:00",
    timeRangeEnd: "23:59",
    generationTime: "23:00",
    reportType: "Detail",
    format: "PDF",
    actionType: "Email",
    toAddress: "ops@company.com",
    emailRetryWindow: "15",
    subject: "Vehicle Idle Report",
    message: "Attached is the latest vehicle idle activity report.",
    selectedVehicles: ["KA01AB9988", "MH12AB1234"],
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
  relativeType: "This Week",
  timezone: "Asia/Kolkata (UTC+05:30)",
  scheduleType: "Weekly",
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

// Reusable Select Dropdown Component with Unified Theme
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
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-xs text-foreground shadow-2xs transition-all hover:border-[#0089FF] hover:bg-muted/30 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none cursor-pointer select-none",
          open && "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-muted/30",
        )}
      >
        <span className="truncate font-medium">{value || placeholder || "Select"}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1 transition-transform duration-200",
            open && "rotate-180 text-[#0089FF]",
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-[100] mt-1.5 max-h-56 overflow-y-auto rounded-lg border border-border/80 bg-popover/98 backdrop-blur-xl p-1 shadow-lg animate-in fade-in-80 select-none">
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
                  "flex w-full items-center justify-between rounded-sm px-2.5 py-1.5 text-left text-xs cursor-pointer transition-colors",
                  isSelected
                    ? "bg-[#0089FF]/10 font-bold text-[#0089FF]"
                    : "text-foreground hover:bg-muted/80 font-medium",
                )}
              >
                <span>{opt}</span>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 text-[#0089FF]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Expandable / Collapsible Multi-Select Vehicle Panel matching Reference Mockup
function VehicleMultiSelectDropdown({
  selectedVehicles,
  onToggleVehicle,
  onToggleRegion,
  regionGroups,
  allVisibleVehicleIds,
  isAllSelected,
  onToggleSelectAll,
}: {
  selectedVehicles: string[];
  onToggleVehicle: (id: string) => void;
  onToggleRegion: (vehicles: FleetObject[]) => void;
  regionGroups: { region: string; vehicles: FleetObject[] }[];
  allVisibleVehicleIds: string[];
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [search, setSearch] = useState("");

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return regionGroups;
    return regionGroups
      .map((g) => ({
        region: g.region,
        vehicles: g.vehicles.filter(
          (v) =>
            v.name.toLowerCase().includes(q) ||
            v.imei.toLowerCase().includes(q) ||
            v.branch.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.vehicles.length > 0);
  }, [regionGroups, search]);

  // Selected vehicle summary when collapsed (e.g., "Fuel - 1001 +3" / "GJ21HS1609+100")
  const collapsedSummary = useMemo(() => {
    if (selectedVehicles.length === 0) return null;
    const vehicleMap = new Map<string, FleetObject>();
    for (const g of regionGroups) {
      for (const v of g.vehicles) {
        vehicleMap.set(v.id, v);
      }
    }
    const firstVehicle =
      vehicleMap.get(selectedVehicles[0]) ||
      fleetObjects.find((f) => f.id === selectedVehicles[0]);
    const firstName = firstVehicle ? firstVehicle.name : selectedVehicles[0];
    const extraCount = selectedVehicles.length - 1;
    return {
      firstName,
      extraCount,
    };
  }, [regionGroups, selectedVehicles]);

  return (
    <div className="rounded-lg border border-border/80 bg-background overflow-hidden shadow-2xs transition-all">
      {/* Top Search & Toggle Bar matching mockup */}
      {isExpanded ? (
        <div className="flex h-9.5 items-center px-3 gap-2 bg-background border-b border-border/60 transition-colors">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vehicles..."
            className="h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none font-medium"
            autoFocus
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="p-1 text-muted-foreground hover:text-foreground cursor-pointer rounded-xs"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="p-1 text-muted-foreground hover:text-foreground cursor-pointer rounded-xs"
            aria-label="Collapse vehicle list"
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground rotate-180 transition-transform duration-200" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => setIsExpanded(true)}
          className="flex h-9.5 items-center px-3 gap-2 bg-background cursor-pointer hover:bg-muted/30 transition-colors select-none group"
        >
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          {collapsedSummary ? (
            <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-hidden">
              <span className="text-xs font-semibold text-foreground truncate">
                {collapsedSummary.firstName}
              </span>
              {collapsedSummary.extraCount > 0 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-[#0089FF]/10 text-[#0089FF] border border-[#0089FF]/20 shrink-0">
                  +{collapsedSummary.extraCount}
                </span>
              )}
            </div>
          ) : (
            <span className="flex-1 text-xs text-muted-foreground/70 font-medium truncate">
              Search vehicles...
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(true);
            }}
            className="p-1 text-muted-foreground hover:text-foreground cursor-pointer rounded-xs"
            aria-label="Expand vehicle list"
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
          </button>
        </div>
      )}

      {/* Expanded Tree List matching reference image */}
      {isExpanded && (
        <div className="max-h-52 overflow-y-auto p-3 space-y-3.5 custom-scrollbar bg-background">
          {filteredGroups.map(({ region, vehicles }) => {
            const groupIds = vehicles.map((v) => v.id);
            const allChecked =
              groupIds.length > 0 &&
              groupIds.every((id) => selectedVehicles.includes(id));
            const someChecked =
              groupIds.some((id) => selectedVehicles.includes(id)) &&
              !allChecked;

            return (
              <div key={region} className="space-y-2">
                {/* Region Group Header */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    ref={(el) => {
                      if (el) el.indeterminate = someChecked;
                    }}
                    onChange={() => onToggleRegion(vehicles)}
                    className="h-4 w-4 rounded border-border/80 text-[#0089FF] focus:ring-[#0089FF] accent-[#0089FF] cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-foreground">
                    {region}
                  </span>
                  <span className="text-xs text-muted-foreground font-normal">
                    [{vehicles.length}]
                  </span>
                </div>

                {/* Indented Vehicles List */}
                <div className="pl-6 space-y-2.5">
                  {vehicles.map((v) => {
                    const isChecked = selectedVehicles.includes(v.id);
                    return (
                      <label
                        key={v.id}
                        className="flex items-start gap-2.5 cursor-pointer select-none group"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleVehicle(v.id)}
                          className="h-4 w-4 mt-0.5 rounded border-border/80 text-[#0089FF] focus:ring-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                          <span
                            className={cn(
                              "text-xs leading-tight transition-colors truncate",
                              isChecked
                                ? "font-semibold text-[#0089FF]"
                                : "font-medium text-foreground group-hover:text-foreground",
                            )}
                          >
                            {v.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground leading-tight mt-0.5 font-mono">
                            {v.imei}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filteredGroups.length === 0 && (
            <div className="py-6 text-center text-xs text-muted-foreground">
              No vehicles found matching &quot;{search}&quot;.
            </div>
          )}
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

function ScheduleItemActionsMenu({
  onDuplicate,
  onDelete,
}: {
  onDuplicate: () => void;
  onDelete: () => void;
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
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "h-8.5 w-8.5 rounded-xl border border-border/80 bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 hover:border-[#0089FF]/40 transition-all cursor-pointer shadow-2xs active:scale-95",
          open && "border-[#0089FF] bg-muted/60 text-foreground",
        )}
        aria-label="More actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-36 rounded-xl border border-border/80 bg-popover/98 backdrop-blur-xl p-1.5 shadow-xl z-50 animate-in fade-in-80 zoom-in-95 text-xs select-none">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDuplicate();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-foreground hover:bg-muted cursor-pointer transition-colors font-medium"
          >
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Duplicate</span>
          </button>
          <div className="my-1 h-px bg-border/60" />
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-destructive hover:bg-destructive/10 cursor-pointer transition-colors font-medium"
          >
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}

export function ScheduleModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>(INITIAL_SCHEDULES);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"list" | "form">("list");
  const [step, setStep] = useState<1 | 2>(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<ScheduleItem, "id">>(DEFAULT_DRAFT);
  const [copyFrom, setCopyFrom] = useState<string>("None");
  const [errors, setErrors] = useState<{ name?: string; toAddress?: string }>({});

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

  const handleDuplicate = (item: ScheduleItem) => {
    const duplicated: ScheduleItem = {
      ...item,
      id: `sched-${Date.now()}`,
      name: `${item.name} (Copy)`,
    };
    setSchedules((prev) => [...prev, duplicated]);
    toast.success(`Duplicated "${item.name}"`);
  };

  // Advance Configuration Sub-Modal State
  const [advanceModalOpen, setAdvanceModalOpen] = useState(false);
  const [columnsConfig, setColumnsConfig] =
    useState<ReportColumnConfig[]>(INITIAL_COLUMNS);
  const [detailDownloadMode, setDetailDownloadMode] = useState<
    "multiple" | "single"
  >("multiple");

  // Step 1: Filter Criteria State
  const [criteriaCompany, setCriteriaCompany] = useState<string>("All");
  const [criteriaBranch, setCriteriaBranch] = useState<string>("All");
  const [criteriaGroup, setCriteriaGroup] = useState<string>("All");
  const [criteriaType, setCriteriaType] = useState<string>("All");
  const [criteriaBrand, setCriteriaBrand] = useState<string>("All");
  const [criteriaModel, setCriteriaModel] = useState<string>("All");
  const [criteriaDurationStatus, setCriteriaDurationStatus] =
    useState<string>("All");
  const [criteriaDurationCompare, setCriteriaDurationCompare] =
    useState<string>("Greater Than");
  const [criteriaDurationUnit, setCriteriaDurationUnit] =
    useState<string>("Hour");
  const [criteriaDurationValue, setCriteriaDurationValue] =
    useState<string>("");
  const [criteriaDistanceCompare, setCriteriaDistanceCompare] =
    useState<string>("Greater Than");
  const [criteriaDistanceValue, setCriteriaDistanceValue] =
    useState<string>("");
  const [criteriaDurationFormat, setCriteriaDurationFormat] = useState<
    "hhmm" | "decimal"
  >("hhmm");

  // Derive Region Hierarchical Groups from Fleet Data
  const regionGroups = useMemo(() => {
    let list = fleetObjects;

    if (criteriaBranch !== "All") {
      list = list.filter((o) =>
        o.branch.toLowerCase().includes(criteriaBranch.toLowerCase()),
      );
    }
    if (criteriaCompany !== "All") {
      list = list.filter((o) =>
        o.company.toLowerCase().includes(criteriaCompany.toLowerCase()),
      );
    }

    const map = new Map<string, FleetObject[]>();
    for (const v of list) {
      const g = map.get(v.branch) ?? [];
      g.push(v);
      map.set(v.branch, g);
    }

    return [...map.entries()].map(([region, vehicles]) => ({
      region,
      vehicles,
    }));
  }, [criteriaBranch, criteriaCompany]);

  const allVisibleVehicleIds = useMemo(
    () => regionGroups.flatMap((g) => g.vehicles.map((v) => v.id)),
    [regionGroups],
  );

  const isAllVehiclesSelected =
    allVisibleVehicleIds.length > 0 &&
    allVisibleVehicleIds.every((id) => draft.selectedVehicles.includes(id));

  const toggleSelectAllVehicles = () => {
    if (isAllVehiclesSelected) {
      setDraft((d) => ({
        ...d,
        selectedVehicles: d.selectedVehicles.filter(
          (id) => !allVisibleVehicleIds.includes(id),
        ),
      }));
    } else {
      setDraft((d) => ({
        ...d,
        selectedVehicles: Array.from(
          new Set([...d.selectedVehicles, ...allVisibleVehicleIds]),
        ),
      }));
    }
  };

  const toggleRegionVehicles = (vehicles: FleetObject[]) => {
    const ids = vehicles.map((v) => v.id);
    const allIn = ids.every((id) => draft.selectedVehicles.includes(id));
    setDraft((d) => {
      if (allIn) {
        return {
          ...d,
          selectedVehicles: d.selectedVehicles.filter(
            (id) => !ids.includes(id),
          ),
        };
      } else {
        return {
          ...d,
          selectedVehicles: Array.from(
            new Set([...d.selectedVehicles, ...ids]),
          ),
        };
      }
    });
  };

  const toggleSingleVehicle = (vehicleId: string) => {
    setDraft((d) => {
      const current = d.selectedVehicles;
      const next = current.includes(vehicleId)
        ? current.filter((id) => id !== vehicleId)
        : [...current, vehicleId];
      return { ...d, selectedVehicles: next };
    });
  };

  // Step 2 Dynamic Timing Handlers
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
      const next = current.includes(dayId)
        ? current.filter((x) => x !== dayId)
        : [...current, dayId];
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
    setDraft({ ...DEFAULT_DRAFT, selectedVehicles: [] });
    setErrors({});
    setStep(1);
    setView("form");
  };

  const startEdit = (item: ScheduleItem) => {
    setEditingId(item.id);
    setDraft({ ...item });
    setErrors({});
    setStep(1);
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

    if (editingId) {
      setSchedules((prev) =>
        prev.map((s) => (s.id === editingId ? { ...draft, id: editingId } : s)),
      );
      toast.success("Schedule updated successfully");
    } else {
      const newSchedule: ScheduleItem = {
        ...draft,
        id: `sched-${Date.now()}`,
      };
      setSchedules((prev) => [...prev, newSchedule]);
      toast.success("Schedule created successfully");
    }

    setView("list");
  };

  const handleDelete = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    toast.success("Schedule removed");
    setView("list");
  };

  if (!open) return null;

  return (
    <>
      {/* Centered Modal Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Main Modal Window - Responsive Sizing matching reference */}
        <div
          className={cn(
            "relative flex flex-col bg-background border border-border/80 text-foreground shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ease-out",
            view === "list"
              ? schedules.length === 0
                ? "w-full max-w-lg"
                : "w-[94vw] max-w-2xl max-h-[85vh]"
              : "w-[94vw] max-w-3xl max-h-[88vh]",
          )}
        >
          {/* Modern Seamless Modal Header (45px) */}
          <header className="flex h-[45px] items-center justify-between border-b border-border/70 px-6 bg-card/60 select-none shrink-0">
            <h2 className="text-sm font-bold tracking-tight text-foreground">
              {view === "list"
                ? "Scheduled Reports"
                : editingId
                  ? "Edit Schedule Report"
                  : "Create Schedule Report"}
            </h2>
            <button
              type="button"
              aria-label="Close schedule modal"
              onClick={onClose}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          {/* Stepper (Sticky under Header in Creation Flow) */}
          {view === "form" && (
            <div className="flex items-center justify-between border-b border-border bg-muted/20 px-6 py-3 text-xs select-none shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={cn(
                    "flex items-center gap-2 font-bold transition-colors cursor-pointer",
                    step === 1
                      ? "text-[#0089FF]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5.5 w-5.5 items-center justify-center rounded-md text-xs font-bold",
                      step === 1
                        ? "bg-[#0089FF] text-white shadow-xs"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    1
                  </span>
                  <span>Select Vehicles</span>
                </button>

                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className={cn(
                    "flex items-center gap-2 font-bold transition-colors cursor-pointer",
                    step === 2
                      ? "text-[#0089FF]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5.5 w-5.5 items-center justify-center rounded-md text-xs font-bold",
                      step === 2
                        ? "bg-[#0089FF] text-white shadow-xs"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    2
                  </span>
                  <span>Configure Settings</span>
                </button>
              </div>

              <div className="text-xs text-muted-foreground font-semibold bg-muted/60 px-2.5 py-1 rounded-md">
                Step {step} of 2
              </div>
            </div>
          )}

          {/* Modal Body Content Area */}
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {view === "list" ? (
              schedules.length === 0 ? (
                /* VIEW 1A: Empty State View matching reference */
                <div className="flex flex-col items-center justify-center py-12 px-8 text-center animate-in fade-in-50 duration-200 select-none">
                  {/* Clean Graphic/Illustration with soft accents */}
                  <div className="relative mb-5 flex items-center justify-center">
                    <div className="absolute -inset-4 rounded-full bg-[#0089FF]/10 blur-xl pointer-events-none" />
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-500/[0.07] border border-blue-500/20 shadow-xs text-[#0089FF]">
                      {/* Soft burst dashes */}
                      <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-[#0089FF]/60" />
                      <span className="absolute -left-2 top-7 h-1 w-2.5 rounded-full bg-[#0089FF]/40 -rotate-12" />
                      <span className="absolute -right-2 top-11 h-1 w-2.5 rounded-full bg-[#0089FF]/40 rotate-12" />

                      <svg
                        className="h-12 w-12"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13 7C13 5.89543 13.8954 5 15 5H27L35 13V41C35 42.1046 34.1046 43 33 43H15C13.8954 43 13 42.1046 13 41V7Z"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M27 5V13H35"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <rect
                          x="19"
                          y="23"
                          width="3"
                          height="10"
                          rx="1"
                          fill="currentColor"
                        />
                        <rect
                          x="24.5"
                          y="18"
                          width="3"
                          height="15"
                          rx="1"
                          fill="currentColor"
                        />
                        <rect
                          x="30"
                          y="26"
                          width="3"
                          height="7"
                          rx="1"
                          fill="currentColor"
                        />
                        <line
                          x1="18"
                          y1="37"
                          x2="26"
                          y2="37"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-foreground tracking-tight">
                    No scheduled reports yet
                  </h3>

                  <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                    Create a schedule to receive reports automatically at your preferred time and frequency.
                  </p>

                  <button
                    type="button"
                    onClick={startCreate}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0089FF] px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-[#0077e6] hover:shadow-lg hover:shadow-blue-500/25 active:scale-98 cursor-pointer transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create New Schedule</span>
                  </button>
                </div>
              ) : (
                /* VIEW 1B: Scheduled Reports List View matching reference */
                <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                  {/* Top Action Toolbar */}
                  <div className="flex items-center justify-between gap-3 p-5 pb-3 shrink-0">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70 pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search scheduled reports..."
                        className="h-10 w-full rounded-xl border border-input bg-background pl-10 pr-9 text-xs text-foreground placeholder:text-muted-foreground/70 transition-all hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs font-medium"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-md cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={startCreate}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0089FF] px-4.5 h-10 text-xs font-semibold text-white shadow-xs hover:bg-[#0077e6] active:scale-98 cursor-pointer transition-all shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create New Schedule</span>
                    </button>
                  </div>

                  {/* Cards List */}
                  <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-5 space-y-3 custom-scrollbar">
                    {filteredSchedules.map((item) => {
                      const iconScheme = getScheduleIconScheme(item);
                      const recurrenceText = formatRecurrence(item);

                      return (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-border/80 bg-card p-4 flex items-center justify-between gap-4 shadow-2xs transition-all hover:border-[#0089FF]/40 hover:shadow-xs group"
                        >
                          {/* Left section: Icon badge + Details */}
                          <div className="flex items-center gap-3.5 min-w-0 flex-1">
                            <div
                              className={cn(
                                "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105",
                                iconScheme.badgeBg,
                                iconScheme.borderColor,
                                iconScheme.iconColor,
                              )}
                            >
                              {iconScheme.icon}
                            </div>

                            <div className="min-w-0 flex-1 space-y-1">
                              <h3 className="text-sm font-bold text-foreground truncate">
                                {item.name}
                              </h3>

                              {/* Row 1: Next run + Recurrence */}
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                                <span className="inline-flex items-center gap-1.5 font-medium">
                                  <Calendar className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                                  <span>Next run: {item.nextRun}</span>
                                </span>
                                <span className="text-muted-foreground/40">•</span>
                                <span className="inline-flex items-center gap-1.5 font-medium">
                                  <RotateCcw className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                                  <span>{recurrenceText}</span>
                                </span>
                              </div>

                              {/* Row 2: Delivery + Format */}
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                                <span className="inline-flex items-center gap-1.5 font-medium">
                                  <Mail className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                                  <span>{item.actionType}</span>
                                </span>
                                <span className="text-muted-foreground/40">•</span>
                                <span className="inline-flex items-center gap-1.5 font-medium">
                                  <FileSpreadsheet className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                                  <span>{item.format}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right section: Actions (NO status toggle/dropdown) */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => startEdit(item)}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted/60 hover:border-[#0089FF]/40 cursor-pointer transition-all shadow-2xs active:scale-98"
                            >
                              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>Edit</span>
                            </button>

                            <ScheduleItemActionsMenu
                              onDuplicate={() => handleDuplicate(item)}
                              onDelete={() => handleDelete(item.id)}
                            />
                          </div>
                        </div>
                      );
                    })}

                    {filteredSchedules.length === 0 && schedules.length > 0 && (
                      <div className="py-12 text-center text-xs text-muted-foreground">
                        No scheduled reports found matching &quot;{searchQuery}&quot;.
                      </div>
                    )}
                  </div>
                </div>
              )
            ) : step === 1 ? (
              /* VIEW 2 - STEP 1: Unified Form with 3-in-a-row layout and clean filters */
              <div className="flex-1 min-h-0 overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar w-full select-none">
                {/* 3-in-a-row Filter Selectors */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Company */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Company
                    </label>
                    <SelectDropdown
                      value={criteriaCompany}
                      options={COMPANIES}
                      onChange={setCriteriaCompany}
                    />
                  </div>

                  {/* Branch */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Branch
                    </label>
                    <SelectDropdown
                      value={criteriaBranch}
                      options={[
                        "All",
                        ...getBranchesForCompanies(
                          criteriaCompany === "All"
                            ? ["ABC Logistic"]
                            : [criteriaCompany],
                        ),
                      ]}
                      onChange={setCriteriaBranch}
                    />
                  </div>

                  {/* Vehicle Group */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Vehicle Group
                    </label>
                    <SelectDropdown
                      value={criteriaGroup}
                      options={[
                        "All",
                        "HP Group",
                        "Trucks",
                        "Buses",
                        "Cars",
                        "Cold Chain",
                      ]}
                      onChange={setCriteriaGroup}
                    />
                  </div>

                  {/* Vehicle Type */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Vehicle Type
                    </label>
                    <SelectDropdown
                      value={criteriaType}
                      options={[
                        "All",
                        "Dumper",
                        "Truck",
                        "Bus",
                        "SUV",
                        "Taxi",
                      ]}
                      onChange={setCriteriaType}
                    />
                  </div>

                  {/* Vehicle Brand */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Vehicle Brand
                    </label>
                    <SelectDropdown
                      value={criteriaBrand}
                      options={[
                        "All",
                        "Ashok Leyland",
                        "Tata Motors",
                        "BharatBenz",
                        "Volvo",
                      ]}
                      onChange={setCriteriaBrand}
                    />
                  </div>

                  {/* Vehicle Model */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Vehicle Model
                    </label>
                    <SelectDropdown
                      value={criteriaModel}
                      options={[
                        "All",
                        "10 Wheel",
                        "12 Wheel",
                        "6 Wheel",
                        "4 Wheel",
                      ]}
                      onChange={setCriteriaModel}
                    />
                  </div>

                  {/* Select Vehicle: Full Width Tree Dropdown */}
                  <div className="col-span-3 space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-foreground">
                        Select Vehicle
                      </label>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {draft.selectedVehicles.length} of {allVisibleVehicleIds.length} Selected
                      </span>
                    </div>
                    <VehicleMultiSelectDropdown
                      selectedVehicles={draft.selectedVehicles}
                      onToggleVehicle={toggleSingleVehicle}
                      onToggleRegion={toggleRegionVehicles}
                      regionGroups={regionGroups}
                      allVisibleVehicleIds={allVisibleVehicleIds}
                      isAllSelected={isAllVehiclesSelected}
                      onToggleSelectAll={toggleSelectAllVehicles}
                    />
                  </div>
                </div>

                {/* Duration & Distance Filters - 2 Columns Layout matching reference mockup */}
                <div className="pt-2">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {/* Row 1, Col 1: Duration Status */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground">
                        Duration Status
                      </label>
                      <SelectDropdown
                        value={criteriaDurationStatus}
                        options={DURATION_STATUS}
                        onChange={setCriteriaDurationStatus}
                      />
                    </div>

                    {/* Row 1, Col 2: Duration Format */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground">
                        Duration Format
                      </label>
                      <div className="flex items-center gap-6 h-9">
                        <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none font-medium">
                          <input
                            type="radio"
                            name="durationFormat"
                            checked={criteriaDurationFormat === "hhmm"}
                            onChange={() => setCriteriaDurationFormat("hhmm")}
                            className="h-4 w-4 accent-[#0089FF] cursor-pointer"
                          />
                          <span>HH:MM</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none font-medium">
                          <input
                            type="radio"
                            name="durationFormat"
                            checked={criteriaDurationFormat === "decimal"}
                            onChange={() =>
                              setCriteriaDurationFormat("decimal")
                            }
                            className="h-4 w-4 accent-[#0089FF] cursor-pointer"
                          />
                          <span>Decimal</span>
                        </label>
                      </div>
                    </div>

                    {/* Row 2, Col 1: Duration Filter */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground">
                        Duration Filter
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <SelectDropdown
                          value={criteriaDurationCompare}
                          options={COMPARATORS}
                          onChange={setCriteriaDurationCompare}
                        />
                        <SelectDropdown
                          value={criteriaDurationUnit}
                          options={DURATION_UNITS}
                          onChange={setCriteriaDurationUnit}
                        />
                        <input
                          type="text"
                          value={criteriaDurationValue}
                          onChange={(e) =>
                            setCriteriaDurationValue(e.target.value)
                          }
                          placeholder="e.g. 5"
                          className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-all hover:border-[#0089FF] focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs font-medium"
                        />
                      </div>
                    </div>

                    {/* Row 2, Col 2: Distance Filter */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground">
                        Distance Filter
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <SelectDropdown
                          value={criteriaDistanceCompare}
                          options={COMPARATORS}
                          onChange={setCriteriaDistanceCompare}
                        />
                        <input
                          type="text"
                          value={criteriaDistanceValue}
                          onChange={(e) =>
                            setCriteriaDistanceValue(e.target.value)
                          }
                          placeholder="e.g. 100"
                          className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-all hover:border-[#0089FF] focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* VIEW 2 - STEP 2: Configure Settings */
              <div className="flex-1 min-h-0 overflow-y-auto px-8 py-6 space-y-5 custom-scrollbar w-full select-none">
                {/* 1. Report Information - Side by Side */}
                <div className="grid grid-cols-2 gap-4">
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
                      placeholder="e.g. Weekly Operations Summary"
                      className={cn(
                        "h-9 w-full rounded-md border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-all font-medium shadow-2xs focus:outline-none",
                        errors.name
                          ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : "border-input hover:border-[#0089FF] focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20",
                      )}
                    />
                    {errors.name && (
                      <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium animate-in fade-in duration-150">
                        <HelpCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                        <span>{errors.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Copy From
                    </label>
                    <SelectDropdown
                      value={copyFrom}
                      options={["None", ...schedules.map((s) => s.name)]}
                      onChange={handleCopySettings}
                    />
                  </div>
                </div>

                {/* 2. Schedule Timing (Relative Type -> Timezone -> Generation Time) */}
                <div className="pt-2 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground">
                        Relative Type
                      </label>
                      <SelectDropdown
                        value={draft.relativeType}
                        options={RELATIVE_TYPES}
                        onChange={handleRelativeTypeChange}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground">
                        Timezone
                      </label>
                      <SelectDropdown
                        value={draft.timezone}
                        options={TIMEZONES}
                        onChange={(timezone) =>
                          setDraft((d) => ({ ...d, timezone }))
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground">
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
                  {(draft.scheduleType === "Weekly" ||
                    draft.scheduleType === "Monthly") && (
                    <div className="pt-1 space-y-3">

                    {/* If Weekly: Clickable Day-of-Week Buttons with Hover & Active styling */}
                    {draft.scheduleType === "Weekly" && (
                      <div className="space-y-1.5">
                        <span className="block text-[11px] font-medium text-muted-foreground">
                          Select execution days:
                        </span>
                        <div className="flex items-center gap-2">
                          {WEEK_DAYS.map(({ id, label }) => {
                            const isSelected = (
                              draft.selectedDays || []
                            ).includes(id);
                            return (
                              <button
                                key={id}
                                type="button"
                                onClick={() => toggleDay(id)}
                                className={cn(
                                  "h-9 w-9 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center justify-center shadow-2xs hover:border-[#0089FF] active:scale-95",
                                  isSelected
                                    ? "bg-[#0089FF] text-white shadow-xs border border-[#0089FF]"
                                    : "bg-background border border-input text-foreground hover:bg-muted/40",
                                )}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* If Monthly: Clickable Date Grid (1-31) */}
                    {draft.scheduleType === "Monthly" && (
                      <div className="space-y-1.5">
                        <span className="block text-[11px] font-medium text-muted-foreground">
                          Select execution day of month:
                        </span>
                        <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5">
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(
                            (dateNum) => {
                              const isSelected = (
                                draft.selectedDates || []
                              ).includes(dateNum);
                              return (
                                <button
                                  key={dateNum}
                                  type="button"
                                  onClick={() => toggleDate(dateNum)}
                                  className={cn(
                                    "h-8 w-8 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center justify-center shadow-2xs hover:border-[#0089FF] active:scale-95",
                                    isSelected
                                      ? "bg-[#0089FF] text-white shadow-xs border border-[#0089FF]"
                                      : "bg-background border border-input text-foreground hover:bg-muted/40",
                                  )}
                                >
                                  {dateNum}
                                </button>
                              );
                            },
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Time Range Checkbox & Aligned Inputs */}
                  <div className="pt-2 space-y-3">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-semibold text-foreground">
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
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-foreground">
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
                              className="h-9 w-full rounded-md border border-input bg-background px-3 pr-9 text-xs text-foreground transition-all hover:border-[#0089FF] focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs font-medium"
                            />
                            <Clock className="absolute right-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-foreground">
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
                              className="h-9 w-full rounded-md border border-input bg-background px-3 pr-9 text-xs text-foreground transition-all hover:border-[#0089FF] focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs font-medium"
                            />
                            <Clock className="absolute right-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Output & Delivery */}
                <div className="pt-2 space-y-4">
                  {/* Report Type */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Report Type
                    </label>
                    <div className="flex items-center gap-6 h-8">
                      {(["Summary", "Daily", "Detail"] as const).map(
                        (level) => (
                          <label
                            key={level}
                            className="flex items-center gap-2 cursor-pointer text-xs text-foreground select-none"
                          >
                            <input
                              type="radio"
                              name="reportType"
                              checked={draft.reportType === level}
                              onChange={() =>
                                setDraft((d) => ({ ...d, reportType: level }))
                              }
                              className="h-3.5 w-3.5 accent-[#0089FF] cursor-pointer"
                            />
                            <span className="font-medium">{level}</span>
                          </label>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Delivery Method */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Delivery Method
                    </label>
                    <div className="flex items-center gap-6 h-8">
                      {(["Email", "FTP", "SFTP", "Media API"] as const).map(
                        (method) => (
                          <label
                            key={method}
                            className="flex items-center gap-2 cursor-pointer text-xs text-foreground select-none"
                          >
                            <input
                              type="radio"
                              name="actionType"
                              checked={draft.actionType === method}
                              onChange={() =>
                                setDraft((d) => ({ ...d, actionType: method }))
                              }
                              className="h-3.5 w-3.5 accent-[#0089FF] cursor-pointer"
                            />
                            <span className="font-medium">{method}</span>
                          </label>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Delivery Configuration Details: EMAIL */}
                  {draft.actionType === "Email" && (
                    <div className="pt-1 space-y-4 animate-in fade-in-50 duration-150">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-1.5">
                          <label className="block text-xs font-semibold text-foreground">
                            To Address <span className="text-red-500 font-bold ml-0.5">*</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="email"
                              value={draft.toAddress}
                              onChange={(e) => {
                                setDraft((d) => ({
                                  ...d,
                                  toAddress: e.target.value,
                                }));
                                if (e.target.value.trim()) {
                                  setErrors((prev) => ({ ...prev, toAddress: undefined }));
                                }
                              }}
                              placeholder="manager@company.com"
                              className={cn(
                                "h-9 flex-1 rounded-md border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-all font-medium shadow-2xs focus:outline-none",
                                errors.toAddress
                                  ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                  : "border-input hover:border-[#0089FF] focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20",
                              )}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (!draft.toAddress)
                                  toast.error("Enter an email first");
                                else
                                  toast.success(
                                    `Email "${draft.toAddress}" verified`,
                                  );
                              }}
                              className="px-4 h-9 text-xs rounded-md border border-input bg-background hover:bg-muted/40 hover:border-[#0089FF] font-semibold text-foreground cursor-pointer transition-all shadow-2xs active:scale-98"
                            >
                              Verify
                            </button>
                          </div>
                          {errors.toAddress && (
                            <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium animate-in fade-in duration-150">
                              <HelpCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                              <span>{errors.toAddress}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-foreground">
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
                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground transition-all hover:border-[#0089FF] focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-foreground">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={draft.subject}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, subject: e.target.value }))
                          }
                          placeholder="Weekly Travel Summary Report"
                          className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground transition-all hover:border-[#0089FF] focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold text-foreground">
                            Message
                          </label>
                          <div className="flex items-center gap-1 border border-border rounded-md bg-muted/40 px-1.5 py-0.5">
                            <button
                              type="button"
                              className="p-1 rounded-xs hover:bg-muted text-muted-foreground hover:text-foreground"
                            >
                              <Bold className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              className="p-1 rounded-xs hover:bg-muted text-muted-foreground hover:text-foreground"
                            >
                              <Italic className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              className="p-1 rounded-xs hover:bg-muted text-muted-foreground hover:text-foreground"
                            >
                              <Underline className="h-3 w-3" />
                            </button>
                            <div className="h-3 w-px bg-border my-auto mx-0.5" />
                            <button
                              type="button"
                              className="p-1 rounded-xs hover:bg-muted text-muted-foreground hover:text-foreground"
                            >
                              <List className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <textarea
                          rows={3}
                          value={draft.message}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, message: e.target.value }))
                          }
                          placeholder="Write your email body message here..."
                          className="w-full rounded-md border border-input bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-all hover:border-[#0089FF] focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs custom-scrollbar font-medium"
                        />
                      </div>
                    </div>
                  )}

                  {/* Delivery Configuration Details: FTP */}
                  {draft.actionType === "FTP" && (
                    <div className="pt-1 space-y-4 animate-in fade-in-50 duration-150">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-1.5">
                          <label className="block text-xs font-semibold text-foreground">
                            Host Address <span className="text-red-500 font-bold ml-0.5">*</span>
                          </label>
                          <input
                            type="text"
                            value={draft.ftpHost || ""}
                            onChange={(e) => {
                              setDraft((d) => ({ ...d, ftpHost: e.target.value }));
                              if (e.target.value.trim()) setErrors((prev) => ({ ...prev, ftpHost: undefined }));
                            }}
                            placeholder="e.g. ftp.example.com"
                            className={cn(
                              "h-9 w-full rounded-md border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-all font-medium shadow-2xs focus:outline-none",
                              errors.ftpHost
                                ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                : "border-input hover:border-[#0089FF] focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20",
                            )}
                          />
                          {errors.ftpHost && (
                            <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium">
                              <HelpCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                              <span>{errors.ftpHost}</span>
                            </div>
                          )}
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
                              if (e.target.value.trim()) setErrors((prev) => ({ ...prev, ftpPort: undefined }));
                            }}
                            placeholder="21"
                            className={cn(
                              "h-9 w-full rounded-md border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-all font-medium shadow-2xs focus:outline-none",
                              errors.ftpPort
                                ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                : "border-input hover:border-[#0089FF] focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20",
                            )}
                          />
                          {errors.ftpPort && (
                            <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium">
                              <HelpCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                              <span>{errors.ftpPort}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-foreground">
                            Username <span className="text-red-500 font-bold ml-0.5">*</span>
                          </label>
                          <input
                            type="text"
                            value={draft.ftpUsername || ""}
                            onChange={(e) => {
                              setDraft((d) => ({ ...d, ftpUsername: e.target.value }));
                              if (e.target.value.trim()) setErrors((prev) => ({ ...prev, ftpUsername: undefined }));
                            }}
                            placeholder="e.g. ftp_user"
                            className={cn(
                              "h-9 w-full rounded-md border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-all font-medium shadow-2xs focus:outline-none",
                              errors.ftpUsername
                                ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                : "border-input hover:border-[#0089FF] focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20",
                            )}
                          />
                          {errors.ftpUsername && (
                            <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium">
                              <HelpCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                              <span>{errors.ftpUsername}</span>
                            </div>
                          )}
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
                              if (e.target.value.trim()) setErrors((prev) => ({ ...prev, ftpPassword: undefined }));
                            }}
                            placeholder="••••••••"
                            className={cn(
                              "h-9 w-full rounded-md border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-all font-medium shadow-2xs focus:outline-none",
                              errors.ftpPassword
                                ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                : "border-input hover:border-[#0089FF] focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20",
                            )}
                          />
                          {errors.ftpPassword && (
                            <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium">
                              <HelpCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                              <span>{errors.ftpPassword}</span>
                            </div>
                          )}
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
                            if (e.target.value.trim()) setErrors((prev) => ({ ...prev, ftpFolder: undefined }));
                          }}
                          placeholder="e.g. /reports/daily"
                          className={cn(
                            "h-9 w-full rounded-md border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-all font-medium shadow-2xs focus:outline-none",
                            errors.ftpFolder
                              ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                              : "border-input hover:border-[#0089FF] focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20",
                          )}
                        />
                        {errors.ftpFolder && (
                          <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium">
                            <HelpCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                            <span>{errors.ftpFolder}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Delivery Configuration Details: SFTP (Cloud Storage) */}
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
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-foreground">
                            Access key ID <span className="text-red-500 font-bold ml-0.5">*</span>
                          </label>
                          <input
                            type="text"
                            value={draft.sftpAccessKey || ""}
                            onChange={(e) => {
                              setDraft((d) => ({ ...d, sftpAccessKey: e.target.value }));
                              if (e.target.value.trim()) setErrors((prev) => ({ ...prev, sftpAccessKey: undefined }));
                            }}
                            placeholder="e.g. AKIAIOSFODNN7EXAMPLE"
                            className={cn(
                              "h-9 w-full rounded-md border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-all font-medium shadow-2xs focus:outline-none",
                              errors.sftpAccessKey
                                ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                : "border-input hover:border-[#0089FF] focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20",
                            )}
                          />
                          {errors.sftpAccessKey && (
                            <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium">
                              <HelpCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                              <span>{errors.sftpAccessKey}</span>
                            </div>
                          )}
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
                              if (e.target.value.trim()) setErrors((prev) => ({ ...prev, sftpSecretKey: undefined }));
                            }}
                            placeholder="••••••••••••••••••••••••"
                            className={cn(
                              "h-9 w-full rounded-md border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-all font-medium shadow-2xs focus:outline-none",
                              errors.sftpSecretKey
                                ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                : "border-input hover:border-[#0089FF] focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20",
                            )}
                          />
                          {errors.sftpSecretKey && (
                            <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium">
                              <HelpCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                              <span>{errors.sftpSecretKey}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-foreground">
                            Region <span className="text-red-500 font-bold ml-0.5">*</span>
                          </label>
                          <input
                            type="text"
                            value={draft.sftpRegion || ""}
                            onChange={(e) => {
                              setDraft((d) => ({ ...d, sftpRegion: e.target.value }));
                              if (e.target.value.trim()) setErrors((prev) => ({ ...prev, sftpRegion: undefined }));
                            }}
                            placeholder="e.g. ap-south-1"
                            className={cn(
                              "h-9 w-full rounded-md border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-all font-medium shadow-2xs focus:outline-none",
                              errors.sftpRegion
                                ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                : "border-input hover:border-[#0089FF] focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20",
                            )}
                          />
                          {errors.sftpRegion && (
                            <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium">
                              <HelpCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                              <span>{errors.sftpRegion}</span>
                            </div>
                          )}
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
                              if (e.target.value.trim()) setErrors((prev) => ({ ...prev, sftpBucketName: undefined }));
                            }}
                            placeholder="e.g. company-fleet-reports"
                            className={cn(
                              "h-9 w-full rounded-md border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-all font-medium shadow-2xs focus:outline-none",
                              errors.sftpBucketName
                                ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                : "border-input hover:border-[#0089FF] focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20",
                            )}
                          />
                          {errors.sftpBucketName && (
                            <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium">
                              <HelpCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                              <span>{errors.sftpBucketName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delivery Configuration Details: MEDIA API */}
                  {draft.actionType === "Media API" && (
                    <div className="pt-1 space-y-4 animate-in fade-in-50 duration-150">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-foreground">
                          Gateway <span className="text-red-500 font-bold ml-0.5">*</span>
                        </label>
                        <SelectDropdown
                          value={draft.mediaGateway || "WhatsApp"}
                          options={MEDIA_GATEWAYS}
                          onChange={(mediaGateway) => setDraft((d) => ({ ...d, mediaGateway }))}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold text-foreground">
                            Recipient Number <span className="text-red-500 font-bold ml-0.5">*</span>
                          </label>
                          <span className="text-[11px] text-muted-foreground font-medium">
                            Comma (,) for multiple recipient numbers
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          value={draft.mediaRecipientNumber || ""}
                          onChange={(e) => {
                            setDraft((d) => ({ ...d, mediaRecipientNumber: e.target.value }));
                            if (e.target.value.trim()) setErrors((prev) => ({ ...prev, mediaRecipientNumber: undefined }));
                          }}
                          placeholder="+91 9876543210, +1 5550192834"
                          className={cn(
                            "w-full rounded-md border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-all font-medium shadow-2xs custom-scrollbar focus:outline-none",
                            errors.mediaRecipientNumber
                              ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                              : "border-input hover:border-[#0089FF] focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20",
                          )}
                        />
                        {errors.mediaRecipientNumber && (
                          <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium">
                            <HelpCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                            <span>{errors.mediaRecipientNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* File Format - Positioned in the last above Advance Configuration */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-semibold text-foreground">
                      File Format
                    </label>
                    <div className="flex items-center gap-6 h-8">
                      {(["XLS", "PDF", "CSV"] as const).map((fmt) => (
                        <label
                          key={fmt}
                          className="flex items-center gap-2 cursor-pointer text-xs text-foreground select-none"
                        >
                          <input
                            type="radio"
                            name="format"
                            checked={draft.format === fmt}
                            onChange={() =>
                              setDraft((d) => ({ ...d, format: fmt }))
                            }
                            className="h-3.5 w-3.5 accent-[#0089FF] cursor-pointer"
                          />
                          <span className="font-medium">{fmt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Advance Configuration Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setAdvanceModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/40 hover:border-[#0089FF] transition-all cursor-pointer shadow-2xs active:scale-98"
                    >
                      <Settings2 className="h-4 w-4 text-[#0089FF]" />
                      <span>Advance Configuration</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Global Sticky Footer */}
          {view === "form" && (
            <footer className="flex items-center justify-between border-t border-border bg-muted/20 px-6 py-3.5 select-none shrink-0">
              <div className="flex items-center gap-2.5">
                {step === 1 ? (
                  <button
                    type="button"
                    onClick={() => setView("list")}
                    className="px-4.5 h-9 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all shadow-2xs active:scale-98"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 px-4.5 h-9 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all shadow-2xs active:scale-98"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                  </button>
                )}

                {editingId && (
                  <button
                    type="button"
                    onClick={() => handleDelete(editingId)}
                    title="Delete schedule"
                    className="p-2 rounded-md text-destructive hover:bg-destructive/10 cursor-pointer transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                  {draft.selectedVehicles.length} Vehicles Selected
                </span>

                {step === 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 rounded-md bg-[#155dfc] px-5 h-9 text-xs font-semibold text-white shadow-xs hover:bg-[#124ecf] cursor-pointer transition-all active:scale-98"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSave}
                    className="rounded-md bg-emerald-600 px-6 h-9 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 cursor-pointer transition-all active:scale-98"
                  >
                    Save Schedule
                  </button>
                )}
              </div>
            </footer>
          )}
        </div>
      </div>

      {/* Advance Configuration Sub-Modal */}
      {advanceModalOpen && (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setAdvanceModalOpen(false);
          }}
        >
          <div className="w-full max-w-3xl max-h-[85vh] flex flex-col bg-background border border-border/80 shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95">
            {/* Modern Header (45px) */}
            <header className="flex h-[45px] items-center justify-between border-b border-border/70 px-6 bg-card/60 select-none shrink-0">
              <div className="flex items-center gap-2.5">
                <Settings2 className="h-4 w-4 text-[#0089FF]" />
                <h3 className="text-sm font-bold tracking-tight text-foreground">
                  Advance Configuration
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAdvanceModalOpen(false)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {/* Sub-Modal Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5 custom-scrollbar text-xs">
              {/* Columns Configuration Table */}
              <div className="rounded-xl border border-border/80 overflow-hidden bg-card shadow-2xs">
                <table className="w-full text-left">
                  <thead className="bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border">
                    <tr>
                      <th className="py-2.5 px-3 w-8"></th>
                      <th className="py-2.5 px-3">Column Name</th>
                      <th className="py-2.5 px-2 text-center">Showable</th>
                      <th className="py-2.5 px-2 text-center">Printable</th>
                      <th className="py-2.5 px-2 text-center">Sortable</th>
                      <th className="py-2.5 px-2 text-center">Sort Priority</th>
                      <th className="py-2.5 px-3 text-center">Sorting</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {columnsConfig.map((col, idx) => (
                      <tr
                        key={col.id}
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <td className="py-2 px-3 text-muted-foreground cursor-grab">
                          <GripVertical className="h-3.5 w-3.5" />
                        </td>
                        <td className="py-2 px-3 font-semibold text-foreground">
                          {col.label}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <input
                            type="checkbox"
                            checked={col.showable}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setColumnsConfig((prev) =>
                                prev.map((c) =>
                                  c.id === col.id
                                    ? { ...c, showable: checked }
                                    : c,
                                ),
                              );
                            }}
                            className="h-4 w-4 rounded-md border-input text-brand accent-[#155dfc] cursor-pointer"
                          />
                        </td>
                        <td className="py-2 px-2 text-center">
                          <input
                            type="checkbox"
                            checked={col.printable}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setColumnsConfig((prev) =>
                                prev.map((c) =>
                                  c.id === col.id
                                    ? { ...c, printable: checked }
                                    : c,
                                ),
                              );
                            }}
                            className="h-4 w-4 rounded-md border-input text-brand accent-[#155dfc] cursor-pointer"
                          />
                        </td>
                        <td className="py-2 px-2 text-center">
                          <input
                            type="checkbox"
                            checked={col.sortable}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setColumnsConfig((prev) =>
                                prev.map((c) =>
                                  c.id === col.id
                                    ? { ...c, sortable: checked }
                                    : c,
                                ),
                              );
                            }}
                            className="h-4 w-4 rounded-md border-input text-brand accent-[#155dfc] cursor-pointer"
                          />
                        </td>
                        <td className="py-2 px-2 text-center flex justify-center">
                          <SelectDropdown
                            value={col.sortPriority}
                            options={["-", "1", "2", "3", "4", "5"]}
                            onChange={(val) => {
                              setColumnsConfig((prev) =>
                                prev.map((c) =>
                                  c.id === col.id
                                    ? { ...c, sortPriority: val }
                                    : c,
                                ),
                              );
                            }}
                            className="w-16"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setColumnsConfig((prev) =>
                                prev.map((c) =>
                                  c.id === col.id
                                    ? {
                                        ...c,
                                        sortDirection:
                                          c.sortDirection === "asc"
                                            ? "desc"
                                            : "asc",
                                      }
                                    : c,
                                ),
                              );
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded-md border border-border bg-background hover:bg-muted cursor-pointer transition-colors shadow-2xs"
                          >
                            {col.sortDirection === "asc" ? "↑ Asc" : "↓ Desc"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Detail Report Download Settings */}
              <div className="p-4 rounded-xl border border-border/80 bg-card space-y-2.5">
                <label className="block text-xs font-bold text-foreground">
                  Detail Report Download Mode
                </label>
                <div className="flex items-center gap-6 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-foreground select-none">
                    <input
                      type="radio"
                      name="detailDownloadMode"
                      checked={detailDownloadMode === "multiple"}
                      onChange={() => setDetailDownloadMode("multiple")}
                      className="h-4 w-4 text-brand accent-[#155dfc] cursor-pointer"
                    />
                    <span className="font-semibold">Multiple Sheet</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-foreground select-none">
                    <input
                      type="radio"
                      name="detailDownloadMode"
                      checked={detailDownloadMode === "single"}
                      onChange={() => setDetailDownloadMode("single")}
                      className="h-4 w-4 text-brand accent-[#155dfc] cursor-pointer"
                    />
                    <span className="font-semibold">Single Sheet</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Sub-Modal Footer */}
            <footer className="flex items-center justify-between border-t border-border bg-muted/20 px-6 py-4 shrink-0 select-none">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setColumnsConfig(INITIAL_COLUMNS)}
                  className="flex items-center gap-1.5 px-3.5 h-9 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-semibold text-foreground cursor-pointer transition-all shadow-2xs active:scale-98"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setAdvanceModalOpen(false)}
                  className="px-4.5 h-9 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all shadow-2xs active:scale-98"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Advance configurations applied");
                    setAdvanceModalOpen(false);
                  }}
                  className="rounded-md bg-[#155dfc] px-5 h-9 text-xs font-semibold text-white shadow-xs hover:bg-[#124ecf] cursor-pointer transition-all active:scale-98"
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

// Export for backward-compatibility
export const ScheduleDrawer = ScheduleModal;
