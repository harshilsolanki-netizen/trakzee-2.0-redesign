import React, { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  CircleGauge,
  Truck,
  Plus,
  RotateCcw,
  Download,
  Copy,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Trash2,
  Edit2,
  SlidersHorizontal,
  Snowflake,
  RefreshCw,
  FileText,
  Info,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectDropdown, type DropdownOption } from "@/components/ui/select-dropdown";
import { cn } from "@/lib/utils";
import { useLayoutMode } from "@/lib/useLayoutMode";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ColumnConfigModal,
  type ColumnConfigItem,
  type ReportColumnSettings,
} from "@/components/report/ColumnConfigModal";

export type AlertSeverity = "Low" | "Medium" | "High" | "Critical";

export type AlertRuleItem = {
  id: string;
  company: string;
  branch: string;
  name: string;
  severity: AlertSeverity;
  vehicleCount: number;
  alertType: string;
  timezone: string;
  reason: string;
  sms: boolean;
  email: boolean;
  notification: boolean;
  immobilizer: boolean;
  buzzer: boolean;
  emailVerified: boolean;
  createdDate: string;
  // Detail config fields
  basedOn: "Vehicle" | "Vehicle Group" | "Vehicle Type";
  targetObject: string;
  triggerPhase: "Start" | "Cancel" | "Both";
  messageText: string;
  validDays: "Everyday" | "Custom";
  customDays?: string[];
  timeFrom: string;
  timeTo: string;
};

export type AlertFilterState = {
  companies: string[];
  branches: string[];
  vehicles: string[];
  alertTypes: string[];
  company: string;
  branch: string;
  vehicle: string;
  alertType: string;
};

export const COMPANY_OPTIONS = [
  "ABC Logistic",
  "XYZ Transport",
  "HP Company",
  "Planet Eco Building Materials LLC",
  "Uffizio Indonesia",
  "Uffizio Thailand",
  "Global Logistics Inc",
  "Fleet Cargo West",
  "FastTrack Mobility",
];

export const BRANCH_OPTIONS = [
  "Central Branch",
  "North Terminal",
  "West Hub",
  "South Depot",
  "East Yard",
  "Downtown Station",
  "Airport Depot",
];

export const VEHICLE_OPTIONS = [
  "HP Boom Barrier Object",
  "HP BLE Tamper Object",
  "HP EV Object 29",
  "HP Custom Object",
  "HP EV Object 36",
  "GL Cold Liner Express 08",
];

export const ALERT_TYPE_OPTIONS = [
  "911",
  "Abnormal Flameout Warning",
  "Automatic Capture Event",
  "Calibration Fail",
  "Camera Cover",
  "Camera Error Code",
  "Camera Occlusion Warning",
  "Distraction",
  "Door Opening While Driving",
  "Drinking Water Warning",
  "Driver Assist Function Failure Warning",
  "Driver Back",
  "Driver Changed",
  "Driver ID Identification Failed",
  "Driver ID Identification Successful",
  "Driver On Call",
  "Driver Shift",
  "EDS Unauthorized Movement",
  "Exceeding Road Sign Warning",
  "Eye closed",
  "Over Speed",
  "SOS Panic",
  "Geofence In/Out",
  "Harsh Braking",
  "Harsh Acceleration",
  "Fuel Drop (Theft)",
  "Temperature Alert",
  "Night Driving",
];

export const DEFAULT_ALERT_FILTERS: AlertFilterState = {
  companies: [...COMPANY_OPTIONS],
  branches: [...BRANCH_OPTIONS],
  vehicles: [...VEHICLE_OPTIONS],
  alertTypes: [...ALERT_TYPE_OPTIONS],
  company: "All",
  branch: "All",
  vehicle: "All",
  alertType: "All",
};

export const INITIAL_ALERTS: AlertRuleItem[] = [
  {
    id: "alt-1",
    company: "HP Company",
    branch: "Central Branch",
    name: "Abnormal Flameout Warning",
    severity: "High",
    vehicleCount: 383,
    alertType: "Abnormal Flameout Warning",
    timezone: "Asia/Kolkata",
    reason: "--",
    sms: false,
    email: true,
    notification: true,
    immobilizer: false,
    buzzer: false,
    emailVerified: true,
    createdDate: "14/09/2026 02:06 PM",
    basedOn: "Vehicle",
    targetObject: "All",
    triggerPhase: "Start",
    messageText: "Abnormal flameout detected on {vehicleNo} at {location}.",
    validDays: "Everyday",
    timeFrom: "12:00 AM",
    timeTo: "11:59 PM",
  },
  {
    id: "alt-2",
    company: "HP Company",
    branch: "Central Branch",
    name: "Automatic Capture Event",
    severity: "High",
    vehicleCount: 383,
    alertType: "Automatic Capture Event",
    timezone: "Asia/Kolkata",
    reason: "--",
    sms: false,
    email: true,
    notification: true,
    immobilizer: false,
    buzzer: false,
    emailVerified: true,
    createdDate: "14/09/2026 02:08 PM",
    basedOn: "Vehicle",
    targetObject: "All",
    triggerPhase: "Start",
    messageText: "Dashcam event snapshot captured for {vehicleNo}.",
    validDays: "Everyday",
    timeFrom: "12:00 AM",
    timeTo: "11:59 PM",
  },
  {
    id: "alt-3",
    company: "HP Company",
    branch: "Central Branch",
    name: "Calibration Fail Alert",
    severity: "Medium",
    vehicleCount: 383,
    alertType: "Calibration Fail",
    timezone: "Asia/Kolkata",
    reason: "--",
    sms: false,
    email: true,
    notification: true,
    immobilizer: false,
    buzzer: false,
    emailVerified: true,
    createdDate: "14/09/2026 02:15 PM",
    basedOn: "Vehicle",
    targetObject: "All",
    triggerPhase: "Start",
    messageText: "ADAS sensor calibration failure reported on {vehicleNo}.",
    validDays: "Everyday",
    timeFrom: "12:00 AM",
    timeTo: "11:59 PM",
  },
  {
    id: "alt-4",
    company: "HP Company",
    branch: "Central Branch",
    name: "Camera Cover Warning",
    severity: "High",
    vehicleCount: 383,
    alertType: "Camera Cover",
    timezone: "Asia/Kolkata",
    reason: "--",
    sms: false,
    email: true,
    notification: true,
    immobilizer: false,
    buzzer: false,
    emailVerified: true,
    createdDate: "14/09/2026 02:18 PM",
    basedOn: "Vehicle",
    targetObject: "All",
    triggerPhase: "Start",
    messageText: "Camera lens obscured / covered on {vehicleNo}.",
    validDays: "Everyday",
    timeFrom: "12:00 AM",
    timeTo: "11:59 PM",
  },
  {
    id: "alt-5",
    company: "HP Company",
    branch: "Central Branch",
    name: "Camera Error Code 0x88",
    severity: "Medium",
    vehicleCount: 383,
    alertType: "Camera Error Code",
    timezone: "Asia/Kolkata",
    reason: "--",
    sms: false,
    email: true,
    notification: true,
    immobilizer: false,
    buzzer: false,
    emailVerified: true,
    createdDate: "14/09/2026 02:22 PM",
    basedOn: "Vehicle",
    targetObject: "All",
    triggerPhase: "Start",
    messageText: "Internal camera diagnostics reported hardware error.",
    validDays: "Everyday",
    timeFrom: "12:00 AM",
    timeTo: "11:59 PM",
  },
  {
    id: "alt-6",
    company: "HP Company",
    branch: "Central Branch",
    name: "Camera Occlusion Warning",
    severity: "High",
    vehicleCount: 383,
    alertType: "Camera Occlusion Warning",
    timezone: "Asia/Kolkata",
    reason: "--",
    sms: false,
    email: true,
    notification: true,
    immobilizer: false,
    buzzer: false,
    emailVerified: true,
    createdDate: "14/09/2026 02:30 PM",
    basedOn: "Vehicle",
    targetObject: "All",
    triggerPhase: "Start",
    messageText: "Camera view blocked by physical obstacle.",
    validDays: "Everyday",
    timeFrom: "12:00 AM",
    timeTo: "11:59 PM",
  },
  {
    id: "alt-7",
    company: "HP Company",
    branch: "Central Branch",
    name: "Driver Distraction Warning",
    severity: "High",
    vehicleCount: 383,
    alertType: "Distraction",
    timezone: "Asia/Kolkata",
    reason: "--",
    sms: false,
    email: true,
    notification: true,
    immobilizer: false,
    buzzer: true,
    emailVerified: true,
    createdDate: "14/09/2026 02:40 PM",
    basedOn: "Vehicle",
    targetObject: "All",
    triggerPhase: "Both",
    messageText: "Driver distraction detected for vehicle {vehicleNo}.",
    validDays: "Everyday",
    timeFrom: "12:00 AM",
    timeTo: "11:59 PM",
  },
  {
    id: "alt-8",
    company: "HP Company",
    branch: "Central Branch",
    name: "Drinking Water / Bottle Warning",
    severity: "Low",
    vehicleCount: 383,
    alertType: "Drinking Water Warning",
    timezone: "Asia/Kolkata",
    reason: "--",
    sms: false,
    email: true,
    notification: true,
    immobilizer: false,
    buzzer: false,
    emailVerified: true,
    createdDate: "14/09/2026 02:52 PM",
    basedOn: "Vehicle",
    targetObject: "All",
    triggerPhase: "Start",
    messageText: "In-cabin violation detected by AI sensor.",
    validDays: "Everyday",
    timeFrom: "12:00 AM",
    timeTo: "11:59 PM",
  },
  {
    id: "alt-9",
    company: "HP Company",
    branch: "Central Branch",
    name: "Driver Fatigue / Eye Closed",
    severity: "Critical",
    vehicleCount: 383,
    alertType: "Eye closed",
    timezone: "Asia/Kolkata",
    reason: "--",
    sms: true,
    email: true,
    notification: true,
    immobilizer: false,
    buzzer: true,
    emailVerified: true,
    createdDate: "14/09/2026 02:56 PM",
    basedOn: "Vehicle",
    targetObject: "All",
    triggerPhase: "Start",
    messageText: "Driver eyes closed for > 2.0s! High collision risk.",
    validDays: "Everyday",
    timeFrom: "12:00 AM",
    timeTo: "11:59 PM",
  },
  {
    id: "alt-10",
    company: "HP Company",
    branch: "Central Branch",
    name: "Over Speed Alert (> 80 km/h)",
    severity: "Critical",
    vehicleCount: 412,
    alertType: "Over Speed",
    timezone: "Asia/Kolkata",
    reason: "--",
    sms: true,
    email: true,
    notification: true,
    immobilizer: false,
    buzzer: true,
    emailVerified: true,
    createdDate: "14/09/2026 01:15 PM",
    basedOn: "Vehicle",
    targetObject: "All",
    triggerPhase: "Start",
    messageText: "Speed limit exceeded! Current speed: {speed} km/h (Threshold: 80 km/h).",
    validDays: "Everyday",
    timeFrom: "12:00 AM",
    timeTo: "11:59 PM",
  },
  {
    id: "alt-11",
    company: "HP Company",
    branch: "Central Branch",
    name: "SOS Emergency Panic Button",
    severity: "Critical",
    vehicleCount: 383,
    alertType: "SOS Panic",
    timezone: "Asia/Kolkata",
    reason: "--",
    sms: true,
    email: true,
    notification: true,
    immobilizer: false,
    buzzer: true,
    emailVerified: true,
    createdDate: "14/09/2026 01:20 PM",
    basedOn: "Vehicle",
    targetObject: "All",
    triggerPhase: "Start",
    messageText: "911 / SOS Panic Button pressed by driver on {vehicleNo} at {location}!",
    validDays: "Everyday",
    timeFrom: "12:00 AM",
    timeTo: "11:59 PM",
  },
  {
    id: "alt-12",
    company: "HP Company",
    branch: "Central Branch",
    name: "EDS Unauthorized Movement",
    severity: "Medium",
    vehicleCount: 383,
    alertType: "EDS Unauthorized Movement",
    timezone: "Asia/Kolkata",
    reason: "--",
    sms: false,
    email: true,
    notification: true,
    immobilizer: false,
    buzzer: false,
    emailVerified: true,
    createdDate: "14/09/2026 02:32 PM",
    basedOn: "Vehicle",
    targetObject: "All",
    triggerPhase: "Start",
    messageText: "Vehicle moved without valid driver authentication.",
    validDays: "Everyday",
    timeFrom: "12:00 AM",
    timeTo: "11:59 PM",
  },
  {
    id: "alt-13",
    company: "HP Company",
    branch: "Central Branch",
    name: "Harsh Braking Event",
    severity: "High",
    vehicleCount: 383,
    alertType: "Harsh Braking",
    timezone: "Asia/Kolkata",
    reason: "--",
    sms: false,
    email: true,
    notification: true,
    immobilizer: false,
    buzzer: true,
    emailVerified: true,
    createdDate: "14/09/2026 12:45 PM",
    basedOn: "Vehicle",
    targetObject: "All",
    triggerPhase: "Start",
    messageText: "Harsh braking deceleration (-0.45g) detected on {vehicleNo}.",
    validDays: "Everyday",
    timeFrom: "12:00 AM",
    timeTo: "11:59 PM",
  },
  {
    id: "alt-14",
    company: "HP Company",
    branch: "Central Branch",
    name: "Sudden Rapid Acceleration",
    severity: "Medium",
    vehicleCount: 383,
    alertType: "Harsh Acceleration",
    timezone: "Asia/Kolkata",
    reason: "--",
    sms: false,
    email: true,
    notification: true,
    immobilizer: false,
    buzzer: false,
    emailVerified: true,
    createdDate: "14/09/2026 12:30 PM",
    basedOn: "Vehicle",
    targetObject: "All",
    triggerPhase: "Start",
    messageText: "Sudden acceleration (+0.40g) detected on {vehicleNo}.",
    validDays: "Everyday",
    timeFrom: "12:00 AM",
    timeTo: "11:59 PM",
  },
  {
    id: "alt-15",
    company: "HP Company",
    branch: "Central Branch",
    name: "Geofence Exit (Restricted Zone)",
    severity: "Critical",
    vehicleCount: 290,
    alertType: "Geofence In/Out",
    timezone: "Asia/Kolkata",
    reason: "--",
    sms: true,
    email: true,
    notification: true,
    immobilizer: false,
    buzzer: false,
    emailVerified: true,
    createdDate: "14/09/2026 11:10 AM",
    basedOn: "Vehicle",
    targetObject: "All",
    triggerPhase: "Start",
    messageText: "Vehicle {vehicleNo} exited designated authorized perimeter.",
    validDays: "Everyday",
    timeFrom: "12:00 AM",
    timeTo: "11:59 PM",
  },
  {
    id: "alt-16",
    company: "HP Company",
    branch: "Central Branch",
    name: "Night Driving Violation (11 PM - 5 AM)",
    severity: "High",
    vehicleCount: 383,
    alertType: "Night Driving",
    timezone: "Asia/Kolkata",
    reason: "--",
    sms: true,
    email: true,
    notification: true,
    immobilizer: false,
    buzzer: true,
    emailVerified: true,
    createdDate: "14/09/2026 10:40 AM",
    basedOn: "Vehicle",
    targetObject: "All",
    triggerPhase: "Start",
    messageText: "Unauthorized ignition during curfew night hours on {vehicleNo}.",
    validDays: "Everyday",
    timeFrom: "11:00 PM",
    timeTo: "05:00 AM",
  },
  {
    id: "alt-17",
    company: "HP Company",
    branch: "Central Branch",
    name: "Fuel Drop / Potential Theft Anomaly",
    severity: "Critical",
    vehicleCount: 383,
    alertType: "Fuel Drop (Theft)",
    timezone: "Asia/Kolkata",
    reason: "--",
    sms: true,
    email: true,
    notification: true,
    immobilizer: false,
    buzzer: false,
    emailVerified: true,
    createdDate: "14/09/2026 09:25 AM",
    basedOn: "Vehicle",
    targetObject: "All",
    triggerPhase: "Start",
    messageText: "Sudden fuel level decline (-18L in 3 mins) on {vehicleNo}!",
    validDays: "Everyday",
    timeFrom: "12:00 AM",
    timeTo: "11:59 PM",
  },
  {
    id: "alt-18",
    company: "HP Company",
    branch: "Central Branch",
    name: "Engine Coolant Temperature High (> 105°C)",
    severity: "High",
    vehicleCount: 383,
    alertType: "Temperature Alert",
    timezone: "Asia/Kolkata",
    reason: "--",
    sms: false,
    email: true,
    notification: true,
    immobilizer: false,
    buzzer: true,
    emailVerified: true,
    createdDate: "14/09/2026 09:00 AM",
    basedOn: "Vehicle",
    targetObject: "All",
    triggerPhase: "Start",
    messageText: "Engine temperature exceeded safe threshold on {vehicleNo}.",
    validDays: "Everyday",
    timeFrom: "12:00 AM",
    timeTo: "11:59 PM",
  },
  {
    id: "alt-19",
    company: "HP Company",
    branch: "Central Branch",
    name: "Seatbelt Unbuckled While Moving",
    severity: "Medium",
    vehicleCount: 383,
    alertType: "Driver Assist Function Failure Warning",
    timezone: "Asia/Kolkata",
    reason: "--",
    sms: false,
    email: true,
    notification: true,
    immobilizer: false,
    buzzer: true,
    emailVerified: true,
    createdDate: "14/09/2026 08:30 AM",
    basedOn: "Vehicle",
    targetObject: "All",
    triggerPhase: "Start",
    messageText: "Driver moving with seatbelt unfastened on {vehicleNo}.",
    validDays: "Everyday",
    timeFrom: "12:00 AM",
    timeTo: "11:59 PM",
  },
  {
    id: "alt-20",
    company: "HP Company",
    branch: "Central Branch",
    name: "Route Deviation (> 500m off-path)",
    severity: "Medium",
    vehicleCount: 383,
    alertType: "EDS Unauthorized Movement",
    timezone: "Asia/Kolkata",
    reason: "--",
    sms: false,
    email: true,
    notification: true,
    immobilizer: false,
    buzzer: false,
    emailVerified: true,
    createdDate: "14/09/2026 08:15 AM",
    basedOn: "Vehicle",
    targetObject: "All",
    triggerPhase: "Start",
    messageText: "Vehicle has departed from designated corridor route.",
    validDays: "Everyday",
    timeFrom: "12:00 AM",
    timeTo: "11:59 PM",
  },
];

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PAGE_SIZES = [10, 20, 50];

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

const TIMEZONES = [
  "Asia/Kolkata (UTC+05:30)",
  "UTC (UTC+00:00)",
  "America/New_York (UTC-05:00)",
  "Europe/London (UTC+00:00)",
  "Asia/Dubai (UTC+04:00)",
  "Asia/Jakarta (UTC+07:00)",
  "Asia/Singapore (UTC+08:00)",
];

/* =========================================================================
   Reusable Multi-Select Filter Popover (Matching Report Overlay Theme)
   ========================================================================= */
export function MultiSelectFilterPopover({
  label,
  title,
  placeholder,
  options,
  selected,
  onChange,
}: {
  label: string; // e.g. "Company"
  title: string; // e.g. "Select Company"
  placeholder: string; // e.g. "Search company..."
  options: string[];
  selected: string[];
  onChange: (newSelected: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [draftSelected, setDraftSelected] = useState<string[]>(selected);

  // Sync draft whenever popover opens
  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDraftSelected([...selected]);
      setSearch("");
    }
    setOpen(nextOpen);
  };

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, search]);

  const isAllSelected = options.length > 0 && draftSelected.length === options.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setDraftSelected([]);
    } else {
      setDraftSelected([...options]);
    }
  };

  const toggleOption = (opt: string) => {
    setDraftSelected((prev) =>
      prev.includes(opt) ? prev.filter((item) => item !== opt) : [...prev, opt],
    );
  };

  const handleClear = () => {
    setDraftSelected([]);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleApply = () => {
    onChange(draftSelected);
    setOpen(false);
  };

  // Determine trigger label text
  const displayLabel = useMemo(() => {
    if (selected.length === 0) return "None";
    if (selected.length === options.length) return "All";
    if (selected.length === 1) return selected[0];
    return `${selected[0]} +${selected.length - 1}`;
  }, [selected, options]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium shrink-0 cursor-pointer hover:opacity-80 transition-opacity select-none text-xs py-1 px-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800",
            open && "bg-slate-100 dark:bg-slate-800",
          )}
        >
          <span className="text-slate-500 dark:text-slate-400 font-normal">{label}:</span>
          <span className="text-slate-900 dark:text-white font-semibold inline-flex items-center gap-1">
            <span className="max-w-[130px] truncate">{displayLabel}</span>
            <ChevronDown className="h-3 w-3 text-slate-500 dark:text-slate-400 opacity-80 shrink-0" />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-68 p-0 text-xs bg-popover/95 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-50 overflow-hidden select-none"
      >
        {/* Header with Title & Selected Badge & Search */}
        <div className="p-3 px-4 border-b border-border/70 space-y-2 bg-muted/20">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span>{title}</span>
            <span className="text-[10px] font-semibold text-[#0089FF] bg-[#0089FF]/10 px-2 py-0.5 rounded-full">
              {draftSelected.length} selected
            </span>
          </div>

          <div className="flex h-8 items-center gap-2 rounded-md border border-input bg-background px-2.5 focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className="h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="rounded-md p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Select All Checkbox Row */}
        <div className="px-4 py-1.5 border-b border-border/60 flex items-center justify-between bg-muted/10">
          <label className="flex items-center gap-2 cursor-pointer select-none w-full text-xs font-semibold text-foreground">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAll}
              className="h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer"
            />
            <span>Select All</span>
          </label>
        </div>

        {/* Options List */}
        <div className="max-h-52 overflow-y-auto p-1 space-y-0.5 custom-scrollbar">
          {filteredOptions.map((opt) => {
            const checked = draftSelected.includes(opt);
            return (
              <label
                key={opt}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm hover:bg-muted cursor-pointer transition-colors text-xs select-none"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleOption(opt)}
                  className="h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer shrink-0"
                />
                <span
                  className={cn(
                    "text-foreground font-medium",
                    checked && "font-semibold text-foreground",
                  )}
                >
                  {opt}
                </span>
              </label>
            );
          })}
          {filteredOptions.length === 0 && (
            <div className="p-4 text-center text-xs text-muted-foreground">
              No matching options found
            </div>
          )}
        </div>

        {/* Footer with Clear, Cancel, Apply Buttons */}
        <div className="p-2.5 px-4 border-t border-border/70 flex items-center justify-between bg-muted/20">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer transition-colors"
          >
            Clear
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1.5 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-1.5 text-xs rounded-md bg-[#0089FF] text-white hover:bg-[#0070d6] cursor-pointer font-semibold shadow-xs transition-all active:scale-98"
            >
              Apply
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const DEFAULT_ALERT_COLUMNS: ColumnConfigItem[] = [
  { id: "company", label: "Company", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 0 },
  { id: "branch", label: "Branch", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 1 },
  { id: "name", label: "Name", showable: true, printable: true, sortable: true, sortPriority: 1, sortDir: "asc", pinned: true, originalIndex: 2 },
  { id: "severity", label: "Severity", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 3 },
  { id: "vehicles", label: "Vehicles", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "desc", numeric: true, originalIndex: 4 },
  { id: "alertType", label: "Alert Type", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 5 },
  { id: "timezone", label: "Timezone", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 6 },
  { id: "reason", label: "Reason", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 7 },
  { id: "sms", label: "SMS", showable: true, printable: true, sortable: false, sortPriority: null, sortDir: "asc", originalIndex: 8 },
  { id: "email", label: "Email", showable: true, printable: true, sortable: false, sortPriority: null, sortDir: "asc", originalIndex: 9 },
  { id: "notif", label: "Notif", showable: true, printable: true, sortable: false, sortPriority: null, sortDir: "asc", originalIndex: 10 },
  { id: "immo", label: "Immo", showable: true, printable: true, sortable: false, sortPriority: null, sortDir: "asc", originalIndex: 11 },
  { id: "buzzer", label: "Buzzer", showable: true, printable: true, sortable: false, sortPriority: null, sortDir: "asc", originalIndex: 12 },
  { id: "emailVerify", label: "Email Verify", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 13 },
  { id: "createdDate", label: "Created Date", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 14 },
];

function IconButton({
  label,
  onClick,
  disabled,
  children,
  className,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <TooltipProvider delayDuration={150}>
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
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const ALERT_SEARCH_FIELDS = [
  { id: "all", label: "All fields" },
  { id: "name", label: "Alert Name" },
  { id: "type", label: "Alert Type" },
  { id: "company", label: "Company" },
  { id: "branch", label: "Branch" },
  { id: "severity", label: "Severity" },
];

export function AlertSettingPage() {
  const { isSingle } = useLayoutMode();
  const [alerts, setAlerts] = useState<AlertRuleItem[]>(INITIAL_ALERTS);
  const [searchField, setSearchField] = useState("all");
  const selectedSearchFieldLabel = ALERT_SEARCH_FIELDS.find((f) => f.id === searchField)?.label || "All fields";
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageSizeOpen, setPageSizeOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Right Side Filter Drawer State
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [columnSettings, setColumnSettings] = useState<ReportColumnSettings>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("trakzee_alert_columns_v1");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.columns?.length) return parsed;
        }
      } catch {}
    }
    return {
      columns: DEFAULT_ALERT_COLUMNS,
      frozenColumnsCount: 1,
      detailDownloadMode: "multiple",
      detailScreenSetting: "summary",
    };
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("trakzee_alert_columns_v1", JSON.stringify(columnSettings));
    }
  }, [columnSettings]);

  const [columnModalOpen, setColumnModalOpen] = useState(false);

  const visibleColumns = useMemo(() => {
    return (columnSettings.columns || DEFAULT_ALERT_COLUMNS).filter((c) => c.showable);
  }, [columnSettings.columns]);

  const [activeFilters, setActiveFilters] = useState<AlertFilterState>(DEFAULT_ALERT_FILTERS);

  // View Mode: "list" for Alert Table, "form" for In-Screen Add/Edit Alert
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [editingAlert, setEditingAlert] = useState<AlertRuleItem | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Modal State for Copy Alert
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [copySourceAlert, setCopySourceAlert] = useState<AlertRuleItem | null>(null);

  const activeDrawerFilterCount = useMemo(() => {
    let count = 0;
    if (activeFilters.companies.length < COMPANY_OPTIONS.length) count++;
    if (activeFilters.branches.length < BRANCH_OPTIONS.length) count++;
    if (activeFilters.vehicles.length < VEHICLE_OPTIONS.length) count++;
    if (activeFilters.alertTypes.length < ALERT_TYPE_OPTIONS.length) count++;
    return count;
  }, [activeFilters]);

  const openCreateForm = () => {
    setEditingAlert(null);
    setViewMode("form");
  };

  const openEditForm = (item: AlertRuleItem) => {
    setEditingAlert(item);
    setViewMode("form");
  };

  const openCopyModal = (item?: AlertRuleItem) => {
    setCopySourceAlert(item || filteredAlerts[0] || alerts[0] || null);
    setCopyModalOpen(true);
  };

  const handleSaveAlert = (savedAlert: AlertRuleItem) => {
    if (editingAlert) {
      setAlerts((prev) =>
        prev.map((a) => (a.id === savedAlert.id ? savedAlert : a)),
      );
      toast.success(`Alert rule "${savedAlert.name}" updated successfully`);
    } else {
      setAlerts((prev) => [savedAlert, ...prev]);
      toast.success(`Alert rule "${savedAlert.name}" created successfully`);
    }
    setViewMode("list");
  };

  const handleCopySuccess = (newAlerts: AlertRuleItem[]) => {
    setAlerts((prev) => [...newAlerts, ...prev]);
    setCopyModalOpen(false);
    toast.success(`Successfully copied ${newAlerts.length} alert rule${newAlerts.length > 1 ? "s" : ""}`);
  };

  const handleDeleteAlert = (id: string) => {
    const item = alerts.find((a) => a.id === id);
    if (!item) return;
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
      toast.success(`Alert rule "${item.name}" deleted`);
    }
  };

  const handleResetTable = () => {
    setSearchQuery("");
    setSearchField("all");
    setActiveFilters(DEFAULT_ALERT_FILTERS);
    setCurrentPage(1);
    toast.success("Table filters and search reset");
  };

  // Filtered alerts: applying drawer/toolbar filters + search query
  const filteredAlerts = useMemo(() => {
    let list = alerts;

    // Apply multi-select Company filter
    if (activeFilters.companies.length < COMPANY_OPTIONS.length) {
      if (activeFilters.companies.length === 0) return [];
      const compSet = new Set(activeFilters.companies.map((c) => c.toLowerCase()));
      list = list.filter((item) => compSet.has(item.company.toLowerCase()));
    }

    // Apply multi-select Branch filter
    if (activeFilters.branches.length < BRANCH_OPTIONS.length) {
      if (activeFilters.branches.length === 0) return [];
      const branchSet = new Set(activeFilters.branches.map((b) => b.toLowerCase()));
      list = list.filter((item) => branchSet.has(item.branch.toLowerCase()));
    }

    // Apply multi-select Alert Type filter
    if (activeFilters.alertTypes.length < ALERT_TYPE_OPTIONS.length) {
      if (activeFilters.alertTypes.length === 0) return [];
      const typeSet = new Set(activeFilters.alertTypes.map((t) => t.toLowerCase()));
      list = list.filter((item) => typeSet.has(item.alertType.toLowerCase()));
    }

    const q = searchQuery.toLowerCase().trim();
    if (!q) return list;

    return list.filter((item) => {
      if (searchField === "company") return item.company.toLowerCase().includes(q);
      if (searchField === "branch") return item.branch.toLowerCase().includes(q);
      if (searchField === "name") return item.name.toLowerCase().includes(q);
      if (searchField === "type") return item.alertType.toLowerCase().includes(q);
      if (searchField === "severity") return item.severity.toLowerCase().includes(q);

      // All fields
      return (
        item.name.toLowerCase().includes(q) ||
        item.alertType.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        item.branch.toLowerCase().includes(q) ||
        item.severity.toLowerCase().includes(q) ||
        item.timezone.toLowerCase().includes(q)
      );
    });
  }, [alerts, activeFilters, searchQuery, searchField]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / pageSize));
  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAlerts.slice(start, start + pageSize);
  }, [filteredAlerts, currentPage, pageSize]);

  const firstRecord = filteredAlerts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastRecord = Math.min(currentPage * pageSize, filteredAlerts.length);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#F0F0F0] dark:bg-slate-950 p-[10px]">
      <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white dark:bg-slate-900 rounded-xl border border-[#DFE3EB]/80 dark:border-slate-800 shadow-2xs">
      {/* 1. Top Header Strip (Tabbed vs Single Screen Mode) */}
      {!isSingle ? (
        <div className="relative flex items-end justify-between h-[45px] pt-[10px] px-0 select-none shrink-0 bg-[#F1F5F9] dark:bg-slate-950 rounded-tl-lg">
        {/* Baseline border that runs across the entire strip under inactive tabs */}
        <div className="absolute left-0 right-0 bottom-0 h-px bg-[#DFE3EB] dark:bg-slate-800 z-0" />

        {/* Tab bar list */}
        <div className="relative z-10 flex min-w-0 flex-1 items-end overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden h-full pl-[10px]">
          <div
            className="group relative flex shrink-0 cursor-pointer items-center gap-2 text-xs transition-all duration-150 select-none h-[35px] px-4 rounded-t-lg bg-white dark:bg-slate-900 border-t border-l border-r border-[#DFE3EB] dark:border-slate-800 text-slate-800 dark:text-white font-semibold mb-[-1px] z-20 shadow-2xs"
          >
            {/* Left Inverted Concave Fillet for Active Tab */}
            <div className="absolute -left-[8px] bottom-0 w-[8px] h-[8px] overflow-hidden pointer-events-none z-20">
              <svg className="w-full h-full" viewBox="0 0 8 8" fill="none">
                <path
                  d="M 0 8 L 8 8 L 8 0 C 8 4.418 4.418 8 0 8 Z"
                  className="fill-white dark:fill-slate-900"
                />
                <path
                  d="M 0 8 C 4.418 8 8 4.418 8 0"
                  className="stroke-[#DFE3EB] dark:stroke-slate-800"
                  strokeWidth="1"
                />
              </svg>
            </div>

            {/* Right Inverted Concave Fillet for Active Tab */}
            <div className="absolute -right-[8px] bottom-0 w-[8px] h-[8px] overflow-hidden pointer-events-none z-20">
              <svg className="w-full h-full" viewBox="0 0 8 8" fill="none">
                <path
                  d="M 8 8 L 0 8 L 0 0 C 0 4.418 3.582 8 8 8 Z"
                  className="fill-white dark:fill-slate-900"
                />
                <path
                  d="M 8 8 C 3.582 8 0 4.418 0 0"
                  className="stroke-[#DFE3EB] dark:stroke-slate-800"
                  strokeWidth="1"
                />
              </svg>
            </div>

            {/* Star Favorite Icon in List Mode / Back Button in Form Mode */}
            {viewMode === "form" ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewMode("list");
                }}
                className="p-0.5 -ml-1 rounded text-slate-700 dark:text-slate-200 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title="Back to Alert List"
              >
                <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFavorite(!isFavorite);
                }}
                className="p-0.5 rounded transition-colors cursor-pointer shrink-0 text-slate-400 hover:text-amber-400"
                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Star
                  className={cn(
                    "h-3.5 w-3.5 transition-colors",
                    isFavorite ? "fill-amber-400 text-amber-400" : ""
                  )}
                />
              </button>
            )}

            {/* Tab Title */}
            <span className="truncate max-w-[180px] whitespace-nowrap text-xs">
              Alert
            </span>
          </div>
        </div>
      </div>
      ) : (
        /* SINGLE SCREEN TITLE */
        <div className="relative z-20 flex items-center justify-between px-5 pt-5 pb-2.5 select-none shrink-0 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            {viewMode === "form" ? (
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className="p-1 -ml-1 rounded text-slate-700 dark:text-slate-200 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title="Back to Alert List"
              >
                <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-1 -ml-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Star
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isFavorite ? "fill-amber-400 text-amber-400" : "text-slate-400 stroke-[2]"
                  )}
                />
              </button>
            )}
            <h1 className="text-[24px] font-medium text-slate-900 dark:text-white tracking-tight">
              {viewMode === "form" ? (editingAlert ? `Edit: ${editingAlert.name}` : "Add Alert") : "Alert"}
            </h1>
          </div>
        </div>
      )}

      {viewMode === "list" ? (
        <>
          {/* 2. Top Single-Row Filter & Utilities Toolbar (Visible only in List Mode) */}
          <div className="relative z-20 flex min-h-[42px] items-center justify-between gap-3 bg-white dark:bg-slate-900 px-5 pb-3.5 shrink-0 select-none">
            {/* Left: Filter Pills */}
            <div className="flex items-center min-w-0 flex-1 overflow-x-auto scrollbar-none gap-3 text-xs select-none">
              {/* Company Filter Pill */}
              <MultiSelectFilterPopover
                label="Company"
                title="Select Company"
                placeholder="Search company..."
                options={COMPANY_OPTIONS}
                selected={activeFilters.companies}
                onChange={(companies) => {
                  setActiveFilters((prev) => ({ ...prev, companies }));
                  setCurrentPage(1);
                }}
              />

              {/* Divider 1 */}
              <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />

              {/* Branch Filter Pill */}
              <MultiSelectFilterPopover
                label="Branch"
                title="Select Branch"
                placeholder="Search branch..."
                options={BRANCH_OPTIONS}
                selected={activeFilters.branches}
                onChange={(branches) => {
                  setActiveFilters((prev) => ({ ...prev, branches }));
                  setCurrentPage(1);
                }}
              />

              {/* Divider 2 */}
              <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />

              {/* Vehicle Filter Pill */}
              <MultiSelectFilterPopover
                label="Vehicle"
                title="Select Vehicle"
                placeholder="Search vehicle..."
                options={VEHICLE_OPTIONS}
                selected={activeFilters.vehicles}
                onChange={(vehicles) => {
                  setActiveFilters((prev) => ({ ...prev, vehicles }));
                  setCurrentPage(1);
                }}
              />

              {/* Divider 3 */}
              <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />

              {/* Alert Type Filter Pill */}
              <MultiSelectFilterPopover
                label="Alert Type"
                title="Select Alert Type"
                placeholder="Search alert type..."
                options={ALERT_TYPE_OPTIONS}
                selected={activeFilters.alertTypes}
                onChange={(alertTypes) => {
                  setActiveFilters((prev) => ({ ...prev, alertTypes }));
                  setCurrentPage(1);
                }}
              />

              {/* Divider 4 */}
              <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />

              {/* Filter Button (Matching Report & Vehicle section) */}
              <button
                type="button"
                onClick={() => setFilterDrawerOpen((prev) => !prev)}
                aria-label="Open Filter Drawer"
                className="inline-flex h-7 items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white transition-all cursor-pointer select-none shadow-2xs active:scale-98 shrink-0"
              >
                <SlidersHorizontal className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Filter</span>
                {activeDrawerFilterCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold leading-tight bg-[#0089FF] text-white">
                    {activeDrawerFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Right Toolbar: Search & + Alert */}
            <div className="flex items-center gap-2 ml-auto shrink-0">
              {/* Field Search */}
              <div className="relative flex h-7.5 items-center rounded-md border border-border/80 bg-background shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all overflow-hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      title="Select specific column to search"
                      className="flex h-full items-center gap-1 border-r border-border/60 bg-muted/30 px-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0 select-none"
                    >
                      <span className="max-w-[76px] truncate">
                        {searchField === "all" ? "All fields" : selectedSearchFieldLabel}
                      </span>
                      <ChevronDown className="h-3 w-3 opacity-60" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="max-h-64 w-52 overflow-y-auto text-xs p-1 rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md shadow-lg z-50 select-none"
                  >
                    <DropdownMenuItem
                      onClick={() => {
                        setSearchField("all");
                        setCurrentPage(1);
                      }}
                      className={cn(
                        "cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors select-none",
                        searchField === "all"
                          ? "bg-muted font-semibold text-foreground"
                          : "text-foreground hover:bg-muted/80 hover:text-foreground font-medium",
                      )}
                    >
                      <span>All fields</span>
                      {searchField === "all" && (
                        <Check className="h-3.5 w-3.5 text-[#0089FF]" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 -mx-1" />
                    {ALERT_SEARCH_FIELDS.filter((f) => f.id !== "all").map((f) => {
                      const isSelected = searchField === f.id;
                      return (
                        <DropdownMenuItem
                          key={f.id}
                          onClick={() => {
                            setSearchField(f.id);
                            setCurrentPage(1);
                          }}
                          className={cn(
                            "cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors select-none",
                            isSelected
                              ? "bg-muted font-semibold text-foreground"
                              : "text-foreground hover:bg-muted/80 hover:text-foreground font-medium",
                          )}
                        >
                          <span className="truncate">{f.label}</span>
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
                    setCurrentPage(1);
                  }}
                  placeholder="Search in all fields..."
                  className="h-full w-32 sm:w-44 bg-transparent px-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                    className="mr-1.5 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer rounded-full transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Primary Action Button: + Alert */}
              <button
                type="button"
                onClick={openCreateForm}
                className="inline-flex h-7.5 items-center gap-1.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-3.5 text-xs font-semibold text-white transition-all cursor-pointer shadow-xs active:scale-98"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Alert</span>
              </button>

              <IconButton
                label="Column Settings"
                onClick={() => setColumnModalOpen(true)}
              >
                <Settings className="h-[18px] w-[18px] text-slate-800 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white stroke-[2.2] transition-colors" />
              </IconButton>
            </div>
          </div>

          {/* Horizontal divider with 20px space from left and right */}
          <div className="mx-5 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0 relative z-20 bg-white dark:bg-slate-900" />

          {/* Table & Inline Filter Area */}
          <div className="relative min-h-0 flex-1 flex overflow-hidden bg-white dark:bg-slate-900">
            {/* Table Scroll Area */}
            <div className="relative min-h-0 flex-1 overflow-auto overscroll-contain scroll-smooth pt-1 mx-5">
              <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 z-10 shadow-xs">
                    <tr className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold tracking-wider text-[11px] uppercase border-b border-[#DFE3EB] dark:border-slate-700 select-none whitespace-nowrap h-[38px]">
                      <th className="py-2.5 px-3 text-center w-10 bg-white dark:bg-slate-900">
                        #
                      </th>
                      {visibleColumns.map((col) => {
                        const isCenter = ["severity", "vehicles", "reason", "sms", "email", "notif", "immo", "buzzer", "emailVerify"].includes(col.id);
                        return (
                          <th
                            key={col.id}
                            className={cn(
                              "py-2.5 px-3.5 bg-white dark:bg-slate-900",
                              isCenter && "text-center",
                              col.pinned && "bg-slate-50/80 dark:bg-slate-800/80",
                            )}
                          >
                            {col.label}
                          </th>
                        );
                      })}
                      <th className="py-2.5 px-3 text-right sticky right-0 bg-white dark:bg-slate-900 shadow-l">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DFE3EB] dark:divide-slate-800 bg-white dark:bg-slate-900 font-medium">
                    {pageRows.map((row, idx) => (
                      <tr
                        key={row.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                        onClick={() => openEditForm(row)}
                      >
                        <td className="py-2 px-3 text-center text-muted-foreground font-mono text-[11px]">
                          {(currentPage - 1) * pageSize + idx + 1}
                        </td>
                        {visibleColumns.map((col) => renderAlertCell(col.id, row))}
                        <td className="py-2 px-3 text-right sticky right-0 bg-white dark:bg-slate-900 shadow-l" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openEditForm(row)}
                              className="p-1 rounded text-muted-foreground hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Edit Alert"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCloneAlert(row)}
                              className="p-1 rounded text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors cursor-pointer"
                              title="Clone Alert"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAlert(row.id)}
                              className="p-1 rounded text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                              title="Delete Alert"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {pageRows.length === 0 && (
                      <tr>
                        <td colSpan={visibleColumns.length + 2} className="py-14 text-center text-xs text-muted-foreground">
                          No fleet alerts found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
            </div>

            {/* Inline Right-Side Filter Panel */}
            <AlertFilterDrawer
              open={filterDrawerOpen}
              onClose={() => setFilterDrawerOpen(false)}
              filters={activeFilters}
              onApply={(nextFilters) => {
                setActiveFilters(nextFilters);
                setCurrentPage(1);
              }}
              onReset={() => {
                setActiveFilters(DEFAULT_ALERT_FILTERS);
                setCurrentPage(1);
              }}
              allAlerts={alerts}
            />
          </div>

          {/* Horizontal divider with 20px space from left and right */}
          <div className="mx-5 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0" />

          {/* Standard Application Bottom Frame with Centered HubSpot-Style Pagination & Operations */}
          <footer className="flex h-11 items-center justify-between px-5 bg-white dark:bg-slate-900 shrink-0 select-none">
            {/* Left: Total records */}
            <div className="flex items-center min-w-[140px]">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 tabular-nums select-none">
                {filteredAlerts.length.toLocaleString()} records
              </span>
            </div>

            {/* Center: Pagination */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Prev */}
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors px-1.5 py-1 rounded"
              >
                <ChevronLeft className="h-3.5 w-3.5 stroke-[2.2]" />
                <span>Prev</span>
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-0.5 sm:gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const isActive = p === currentPage;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCurrentPage(p)}
                      className={cn(
                        "h-6 min-w-[24px] px-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center justify-center",
                        isActive
                          ? "border border-slate-400 dark:border-slate-500 bg-transparent text-slate-900 dark:text-white font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",
                      )}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              {/* Next */}
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors px-1.5 py-1 rounded"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5 stroke-[2.2]" />
              </button>

              {/* Page Size Selector */}
              <div className="ml-1 sm:ml-2">
                <Popover open={pageSizeOpen} onOpenChange={setPageSizeOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white cursor-pointer select-none transition-colors px-1.5 py-1 rounded bg-transparent border-0 hover:bg-slate-100 dark:hover:bg-slate-800",
                        pageSizeOpen && "bg-slate-100 dark:bg-slate-800 text-black dark:text-white",
                      )}
                    >
                      <span>{pageSize} per page</span>
                      <ChevronDown className={cn("h-3 w-3 opacity-60 transition-transform", pageSizeOpen && "rotate-180")} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="center" sideOffset={6} className="w-32 p-1 rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md shadow-lg select-none z-50">
                    {PAGE_SIZES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setPageSize(s);
                          setCurrentPage(1);
                          setPageSizeOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between px-2.5 py-1.5 text-xs rounded-sm cursor-pointer transition-colors text-left select-none",
                          pageSize === s ? "bg-muted font-semibold text-foreground" : "text-foreground hover:bg-muted/80 hover:text-foreground font-medium",
                        )}
                      >
                        <span>{s} per page</span>
                        {pageSize === s && <Check className="h-3.5 w-3.5 text-[#0089FF]" />}
                      </button>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Right: Other Operations */}
            <div className="flex items-center gap-1 min-w-[140px] justify-end">
              {/* Reset Table */}
              <button
                type="button"
                onClick={handleResetTable}
                className="toolbar-icon-btn inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-95 group"
                title="Reset Table"
              >
                <RotateCcw className="h-[18px] w-[18px] text-slate-800 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white stroke-[2.2] transition-colors" />
              </button>

              {/* Export XLS */}
              <button
                type="button"
                onClick={() => toast.success("Exported Alert Rules as XLS")}
                className="toolbar-icon-btn inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-95 group"
                title="Download Excel XLS"
              >
                <Download className="h-[18px] w-[18px] text-slate-800 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white stroke-[2.2] transition-colors" />
              </button>

              {/* Copy Alert */}
              <button
                type="button"
                onClick={() => {
                  setCopySourceAlert(filteredAlerts[0] || alerts[0] || null);
                  setCopyModalOpen(true);
                }}
                className="toolbar-icon-btn inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-95 group"
                title="Copy Alert Rule"
              >
                <Copy className="h-[18px] w-[18px] text-slate-800 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white stroke-[2.2] transition-colors" />
              </button>
            </div>
          </footer>
        </>
      ) : (
        /* In-Screen Form View (No Modal) */
        <AlertDetailFormView
          alert={editingAlert}
          onSave={handleSaveAlert}
          onCancel={() => setViewMode("list")}
        />
      )}
      </div>

      {/* Copy Alert Modal */}
      <CopyAlertModal
        open={copyModalOpen}
        onClose={() => setCopyModalOpen(false)}
        sourceAlert={copySourceAlert}
        allAlerts={alerts}
        onCopySuccess={handleCopySuccess}
      />

      {/* Column Settings Modal */}
      <ColumnConfigModal
        open={columnModalOpen}
        onClose={() => setColumnModalOpen(false)}
        settings={columnSettings}
        onSave={(newSettings) => {
          setColumnSettings(newSettings);
          try {
            localStorage.setItem("trakzee_alert_columns_v1", JSON.stringify(newSettings));
          } catch {}
          setColumnModalOpen(false);
          toast.success("Column settings updated");
        }}
        hideDetailTab={true}
        hidePreferenceTab={true}
        hideTabs={true}
        defaultColumns={DEFAULT_ALERT_COLUMNS}
        title="Column Setting"
      />

      
    </div>
  );
}

/* =========================================================================
   Alert Filter Drawer (Right Side Panel matching Report & Vehicle Filter Theme)
   ========================================================================= */
export function AlertFilterDrawer({
  open,
  onClose,
  filters,
  onApply,
  onReset,
  allAlerts,
}: {
  open: boolean;
  onClose: () => void;
  filters: AlertFilterState;
  onApply: (nextFilters: AlertFilterState) => void;
  onReset: () => void;
  allAlerts: AlertRuleItem[];
}) {
  const [draftCompany, setDraftCompany] = useState(
    filters.companies.length === 1
      ? filters.companies[0]
      : filters.companies.length === COMPANY_OPTIONS.length
      ? "All"
      : filters.company || "All"
  );
  const [draftBranch, setDraftBranch] = useState(
    filters.branches.length === 1
      ? filters.branches[0]
      : filters.branches.length === BRANCH_OPTIONS.length
      ? "All"
      : filters.branch || "All"
  );
  const [draftVehicle, setDraftVehicle] = useState(
    filters.vehicles.length === 1
      ? filters.vehicles[0]
      : filters.vehicles.length === VEHICLE_OPTIONS.length
      ? "All"
      : filters.vehicle || "All"
  );
  const [draftAlertType, setDraftAlertType] = useState(
    filters.alertTypes.length === 1
      ? filters.alertTypes[0]
      : filters.alertTypes.length === ALERT_TYPE_OPTIONS.length
      ? "All"
      : filters.alertType || "All"
  );

  // Sync draft with active filters when drawer opens
  useEffect(() => {
    if (open) {
      setDraftCompany(
        filters.companies.length === 1
          ? filters.companies[0]
          : filters.companies.length === COMPANY_OPTIONS.length
          ? "All"
          : filters.company || "All"
      );
      setDraftBranch(
        filters.branches.length === 1
          ? filters.branches[0]
          : filters.branches.length === BRANCH_OPTIONS.length
          ? "All"
          : filters.branch || "All"
      );
      setDraftVehicle(
        filters.vehicles.length === 1
          ? filters.vehicles[0]
          : filters.vehicles.length === VEHICLE_OPTIONS.length
          ? "All"
          : filters.vehicle || "All"
      );
      setDraftAlertType(
        filters.alertTypes.length === 1
          ? filters.alertTypes[0]
          : filters.alertTypes.length === ALERT_TYPE_OPTIONS.length
          ? "All"
          : filters.alertType || "All"
      );
    }
  }, [open, filters]);

  // Unique companies
  const companyOptions = useMemo(() => {
    return ["All", ...COMPANY_OPTIONS];
  }, []);

  // Unique branches based on company
  const branchOptions = useMemo(() => {
    return ["All", ...BRANCH_OPTIONS];
  }, []);

  // Unique vehicles
  const vehicleOptions = useMemo(() => {
    return ["All", ...VEHICLE_OPTIONS];
  }, []);

  // Unique alert types based on data
  const alertTypeOptions = useMemo(() => {
    const set = new Set<string>(["All"]);
    allAlerts.forEach((a) => {
      if (
        (draftCompany === "All" || a.company.toLowerCase() === draftCompany.toLowerCase()) &&
        (draftBranch === "All" || a.branch.toLowerCase() === draftBranch.toLowerCase())
      ) {
        set.add(a.alertType);
      }
    });
    ALERT_TYPE_OPTIONS.forEach((t) => set.add(t));
    return Array.from(set);
  }, [allAlerts, draftCompany, draftBranch]);

  const handleDrawerApply = () => {
    onApply({
      company: draftCompany,
      branch: draftBranch,
      vehicle: draftVehicle,
      alertType: draftAlertType,
      companies: draftCompany === "All" ? [...COMPANY_OPTIONS] : [draftCompany],
      branches: draftBranch === "All" ? [...BRANCH_OPTIONS] : [draftBranch],
      vehicles: draftVehicle === "All" ? [...VEHICLE_OPTIONS] : [draftVehicle],
      alertTypes: draftAlertType === "All" ? [...ALERT_TYPE_OPTIONS] : [draftAlertType],
    });
    onClose();
    toast.success("Filters applied successfully");
  };

  const handleDrawerReset = () => {
    setDraftCompany("All");
    setDraftBranch("All");
    setDraftVehicle("All");
    setDraftAlertType("All");
    onReset();
    onClose();
    toast.info("Filters reset to default");
  };

  return (
    <>
      {/* Backdrop blur overlay */}
      {open && (
        <div
          className="fixed inset-0 top-[45px] z-30 bg-black/40 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in-0"
          onClick={onClose}
        />
      )}

      {/* Slide-over Drawer Panel matching Report Side Panel */}
      <aside
        className={cn(
          "fixed right-0 top-[45px] bottom-0 z-40 flex w-full max-w-[420px] xl:max-w-[430px] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
      >
        {/* Standardized 56px Header matching Report Side Panel */}
        <header className="flex h-[56px] items-center justify-between border-b border-border px-5 bg-background select-none shrink-0">
          <h2 className="text-[16px] font-semibold tracking-tight text-foreground">
            Filter Options
          </h2>
          <button
            type="button"
            aria-label="Close filter"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Drawer Scrollable Body: Company, Branch, Vehicle, Alert Type */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs custom-scrollbar">
          {/* 1. Company */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Company <span className="text-muted-foreground font-normal">:</span>
            </label>
            <SelectDropdown
              value={draftCompany}
              options={companyOptions}
              onChange={(c) => {
                setDraftCompany(c);
                setDraftBranch("All");
                setDraftAlertType("All");
              }}
              placeholder="Select Company"
            />
          </div>

          {/* 2. Branch */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Branch <span className="text-muted-foreground font-normal">:</span>
            </label>
            <SelectDropdown
              value={draftBranch}
              options={branchOptions}
              onChange={(b) => {
                setDraftBranch(b);
                setDraftAlertType("All");
              }}
              placeholder="Select Branch"
            />
          </div>

          {/* 3. Vehicle */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Vehicle <span className="text-muted-foreground font-normal">:</span>
            </label>
            <SelectDropdown
              value={draftVehicle}
              options={vehicleOptions}
              onChange={setDraftVehicle}
              placeholder="Select Vehicle"
            />
          </div>

          {/* 4. Alert Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Alert Type <span className="text-muted-foreground font-normal">:</span>
            </label>
            <SelectDropdown
              value={draftAlertType}
              options={alertTypeOptions}
              onChange={setDraftAlertType}
              placeholder="Select Alert Type"
            />
          </div>
        </div>

        {/* Standard Drawer Footer (56px) */}
        <footer className="flex h-[56px] items-center justify-between border-t border-border bg-background px-5 shrink-0 select-none">
          <button
            type="button"
            onClick={handleDrawerReset}
            className="inline-flex items-center gap-1.5 rounded-md border border-input/80 bg-background px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all hover:bg-muted cursor-pointer shadow-2xs active:scale-98"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleDrawerApply}
            className="h-8 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer active:scale-98"
          >
            Apply Filters
          </button>
        </footer>
      </aside>
    </>
  );
}

/* =========================================================================
   In-Screen Alert Detail Form View (Field-Beside-Value horizontal layout)
   ========================================================================= */
export function AlertDetailFormView({
  alert,
  onSave,
  onCancel,
}: {
  alert: AlertRuleItem | null;
  onSave: (saved: AlertRuleItem) => void;
  onCancel: () => void;
}) {
  const isEdit = Boolean(alert);

  // Form states
  const [company, setCompany] = useState(alert?.company || "HP Company");
  const [branch, setBranch] = useState(alert?.branch || "All");
  const [basedOn, setBasedOn] = useState<"Vehicle" | "Vehicle Group" | "Vehicle Type">(alert?.basedOn || "Vehicle");
  const [object, setObject] = useState(alert?.targetObject || "All");
  const [alertName, setAlertName] = useState(alert?.name || "");
  const [alertType, setAlertType] = useState(alert?.alertType || "911");
  const [triggerPhase, setTriggerPhase] = useState<"Start" | "Cancel" | "Both">(alert?.triggerPhase || "Start");
  const [messageText, setMessageText] = useState(alert?.messageText || "911 Emergency Alert Triggered");
  const [validDays, setValidDays] = useState<"Everyday" | "Custom">(alert?.validDays || "Everyday");
  const [customDays, setCustomDays] = useState<string[]>(alert?.customDays || DAYS_OF_WEEK);
  const [timeFrom, setTimeFrom] = useState(alert?.timeFrom || "12:00 AM");
  const [timeTo, setTimeTo] = useState(alert?.timeTo || "11:59 PM");
  const [timezone, setTimezone] = useState(alert?.timezone || "Asia/Kolkata (UTC+05:30)");
  const [severity, setSeverity] = useState<AlertSeverity>(alert?.severity || "High");
  const [sms, setSms] = useState(alert?.sms ?? false);
  const [email, setEmail] = useState(alert?.email ?? true);
  const [notification, setNotification] = useState(alert?.notification ?? true);
  const [immobilizer, setImmobilizer] = useState(alert?.immobilizer ?? false);
  const [buzzer, setBuzzer] = useState(alert?.buzzer ?? false);

  useEffect(() => {
    if (alert) {
      setCompany(alert.company);
      setBranch(alert.branch);
      setBasedOn(alert.basedOn || "Vehicle");
      setObject(alert.targetObject || "All");
      setAlertName(alert.name);
      setAlertType(alert.alertType || "911");
      setTriggerPhase(alert.triggerPhase || "Start");
      setMessageText(alert.messageText || `${alert.name} triggered on {vehicleNo}`);
      setValidDays(alert.validDays || "Everyday");
      setCustomDays(alert.customDays || DAYS_OF_WEEK);
      setTimeFrom(alert.timeFrom || "12:00 AM");
      setTimeTo(alert.timeTo || "11:59 PM");
      setTimezone(alert.timezone || "Asia/Kolkata (UTC+05:30)");
      setSeverity(alert.severity || "High");
      setSms(alert.sms ?? false);
      setEmail(alert.email ?? true);
      setNotification(alert.notification ?? true);
      setImmobilizer(alert.immobilizer ?? false);
      setBuzzer(alert.buzzer ?? false);
    } else {
      setCompany("HP Company");
      setBranch("All");
      setBasedOn("Vehicle");
      setObject("All");
      setAlertName("");
      setAlertType("911");
      setTriggerPhase("Start");
      setMessageText("911 Emergency Alert Triggered");
      setValidDays("Everyday");
      setCustomDays(DAYS_OF_WEEK);
      setTimeFrom("12:00 AM");
      setTimeTo("11:59 PM");
      setTimezone("Asia/Kolkata (UTC+05:30)");
      setSeverity("High");
      setSms(false);
      setEmail(true);
      setNotification(true);
      setImmobilizer(false);
      setBuzzer(false);
    }
  }, [alert]);

  const handleReset = () => {
    if (alert) {
      setCompany(alert.company);
      setBranch(alert.branch);
      setBasedOn(alert.basedOn || "Vehicle");
      setObject(alert.targetObject || "All");
      setAlertName(alert.name);
      setAlertType(alert.alertType || "911");
      setTriggerPhase(alert.triggerPhase || "Start");
      setMessageText(alert.messageText || "");
      setValidDays(alert.validDays || "Everyday");
      setCustomDays(alert.customDays || DAYS_OF_WEEK);
      setTimeFrom(alert.timeFrom || "12:00 AM");
      setTimeTo(alert.timeTo || "11:59 PM");
      setTimezone(alert.timezone || "Asia/Kolkata (UTC+05:30)");
      setSeverity(alert.severity || "High");
      setSms(alert.sms);
      setEmail(alert.email);
      setNotification(alert.notification);
      setImmobilizer(alert.immobilizer);
      setBuzzer(alert.buzzer);
    } else {
      setCompany("HP Company");
      setBranch("All");
      setBasedOn("Vehicle");
      setObject("All");
      setAlertName("");
      setAlertType("911");
      setTriggerPhase("Start");
      setMessageText("911 Emergency Alert Triggered");
      setValidDays("Everyday");
      setCustomDays(DAYS_OF_WEEK);
      setTimeFrom("12:00 AM");
      setTimeTo("11:59 PM");
      setTimezone("Asia/Kolkata (UTC+05:30)");
      setSeverity("High");
      setSms(false);
      setEmail(true);
      setNotification(true);
      setImmobilizer(false);
      setBuzzer(false);
    }
    toast.info("Form fields reset");
  };

  const handleSave = () => {
    if (!alertName.trim()) {
      toast.error("Please enter an Alert Name");
      return;
    }

    const payload: AlertRuleItem = {
      id: alert ? alert.id : `alt-${Date.now()}`,
      company,
      branch,
      name: alertName.trim(),
      severity,
      vehicleCount: alert ? alert.vehicleCount : 383,
      alertType,
      timezone,
      reason: alert?.reason || "--",
      sms,
      email,
      notification,
      immobilizer,
      buzzer,
      emailVerified: alert?.emailVerified ?? true,
      createdDate: alert?.createdDate || "14/09/2026 03:45 PM",
      basedOn,
      targetObject: object,
      triggerPhase,
      messageText,
      validDays,
      customDays: validDays === "Custom" ? customDays : undefined,
      timeFrom,
      timeTo,
    };

    onSave(payload);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-slate-900">
      {/* Scrollable Form Body with Field-Beside-Value horizontal layout */}
      <div className="flex-1 min-h-0 overflow-y-auto px-8 py-6 space-y-3.5 custom-scrollbar text-xs">
        {/* 1. Company */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Company <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <SelectDropdown
              value={company}
              options={["HP Company", "Global Logistics Inc", "Fleet Cargo West", "FastTrack Mobility"]}
              onChange={setCompany}
              placeholder="Select Company"
            />
          </div>
        </div>

        {/* 2. Branch */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Branch <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <SelectDropdown
              value={branch}
              options={["All", "Central Branch", "North Terminal", "West Hub", "South Depot"]}
              onChange={setBranch}
              placeholder="Select Branch"
            />
          </div>
        </div>

        {/* 3. Based On */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Based On <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <div className="w-80 sm:w-96 max-w-md grid grid-cols-3 gap-2.5">
            {(["Vehicle", "Vehicle Group", "Vehicle Type"] as const).map((b) => (
              <label
                key={b}
                onClick={() => setBasedOn(b)}
                className={cn(
                  "flex items-center gap-2.5 rounded-md border px-3 py-2 transition-all cursor-pointer select-none text-left h-9",
                  basedOn === b
                    ? "border-[#0089FF] bg-[#0089FF]/5 shadow-xs ring-1 ring-[#0089FF]/30 text-foreground font-semibold"
                    : "border-input/80 bg-background hover:bg-muted/40 hover:border-border text-foreground font-medium",
                )}
              >
                <input
                  type="radio"
                  name="formBasedOn"
                  checked={basedOn === b}
                  onChange={() => setBasedOn(b)}
                  className="accent-[#0089FF] h-4 w-4 cursor-pointer"
                />
                <span className="text-xs leading-tight truncate">{b}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 4. Object */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Object <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <SelectDropdown
              value={object}
              options={[
                "All",
                "Fuel - 1001 (B 1234 XYZ)",
                "Truck - 2004 (B 5678 KLM)",
                "Semi-Trailer - 3008",
                "HP Boom Barrier Object",
                "HP BLE Tamper Object",
                "HP EV Object 29",
                "HP Custom Object",
                "HP EV Object 36",
              ]}
              onChange={setObject}
              placeholder="Select Object"
            />
          </div>
        </div>

        {/* 5. Alert Type */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Alert Type <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <SelectDropdown
              value={alertType}
              options={ALERT_TYPE_OPTIONS}
              onChange={setAlertType}
              placeholder="Select Alert Type"
            />
          </div>
        </div>

        {/* 6. Alert Name */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Alert Name <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <input
              type="text"
              value={alertName}
              onChange={(e) => setAlertName(e.target.value)}
              placeholder="e.g. Abnormal Flameout Warning"
              className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 shadow-2xs transition-all hover:border-[#0089FF]/60"
            />
          </div>
        </div>

        {/* 7. Value / Trigger Phase */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Value / Trigger Phase <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <div className="w-80 sm:w-96 max-w-md grid grid-cols-3 gap-2.5">
            {(["Start", "Cancel", "Both"] as const).map((phase) => (
              <label
                key={phase}
                onClick={() => setTriggerPhase(phase)}
                className={cn(
                  "flex items-center gap-2.5 rounded-md border px-3 py-2 transition-all cursor-pointer select-none text-left h-9",
                  triggerPhase === phase
                    ? "border-[#0089FF] bg-[#0089FF]/5 shadow-xs ring-1 ring-[#0089FF]/30 text-foreground font-semibold"
                    : "border-input/80 bg-background hover:bg-muted/40 hover:border-border text-foreground font-medium",
                )}
              >
                <input
                  type="radio"
                  name="formTriggerPhase"
                  checked={triggerPhase === phase}
                  onChange={() => setTriggerPhase(phase)}
                  className="accent-[#0089FF] h-4 w-4 cursor-pointer"
                />
                <span className="text-xs leading-tight">{phase}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 8. Message Template */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Message Template <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="e.g. Abnormal flameout detected on {vehicleNo} at {location}."
              className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 shadow-2xs transition-all hover:border-[#0089FF]/60"
            />
          </div>
        </div>

        {/* 9. Valid Day(s) */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0 pt-2">
            Valid Day(s) <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <div className="w-80 sm:w-96 max-w-md space-y-2">
            <div className="grid grid-cols-2 gap-2.5">
              <label
                onClick={() => setValidDays("Everyday")}
                className={cn(
                  "flex items-center gap-2.5 rounded-md border px-3 py-2 transition-all cursor-pointer select-none text-left h-9",
                  validDays === "Everyday"
                    ? "border-[#0089FF] bg-[#0089FF]/5 shadow-xs ring-1 ring-[#0089FF]/30 text-foreground font-semibold"
                    : "border-input/80 bg-background hover:bg-muted/40 hover:border-border text-foreground font-medium",
                )}
              >
                <input
                  type="radio"
                  name="formValidDays"
                  checked={validDays === "Everyday"}
                  onChange={() => setValidDays("Everyday")}
                  className="accent-[#0089FF] h-4 w-4 cursor-pointer"
                />
                <span className="text-xs leading-tight">Everyday</span>
              </label>

              <label
                onClick={() => setValidDays("Custom")}
                className={cn(
                  "flex items-center gap-2.5 rounded-md border px-3 py-2 transition-all cursor-pointer select-none text-left h-9",
                  validDays === "Custom"
                    ? "border-[#0089FF] bg-[#0089FF]/5 shadow-xs ring-1 ring-[#0089FF]/30 text-foreground font-semibold"
                    : "border-input/80 bg-background hover:bg-muted/40 hover:border-border text-foreground font-medium",
                )}
              >
                <input
                  type="radio"
                  name="formValidDays"
                  checked={validDays === "Custom"}
                  onChange={() => setValidDays("Custom")}
                  className="accent-[#0089FF] h-4 w-4 cursor-pointer"
                />
                <span className="text-xs leading-tight">Custom Days</span>
              </label>
            </div>

            {validDays === "Custom" && (
              <div className="flex items-center gap-1.5 pt-1">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = customDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        setCustomDays((prev) =>
                          isSelected
                            ? prev.filter((d) => d !== day)
                            : [...prev, day],
                        );
                      }}
                      className={cn(
                        "h-8.5 flex-1 rounded-md text-xs font-semibold transition-all cursor-pointer select-none flex items-center justify-center",
                        isSelected
                          ? "bg-[#0089FF] text-white shadow-xs"
                          : "border border-border/80 bg-background text-foreground hover:bg-muted/60 shadow-2xs",
                      )}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 10. Start Time */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Start Time <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <SelectDropdown
              value={timeFrom}
              options={TIME_OPTIONS}
              onChange={setTimeFrom}
              placeholder="Start Time"
            />
          </div>
        </div>

        {/* 11. End Time */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            End Time <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <SelectDropdown
              value={timeTo}
              options={TIME_OPTIONS}
              onChange={setTimeTo}
              placeholder="End Time"
            />
          </div>
        </div>

        {/* 12. Timezone */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Timezone <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <SelectDropdown
              value={timezone}
              options={TIMEZONES}
              onChange={setTimezone}
              placeholder="Select Timezone"
            />
          </div>
        </div>

        {/* 13. Severity */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Severity <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <SelectDropdown
              value={severity}
              options={["Low", "Medium", "High", "Critical"]}
              onChange={(v) => setSeverity(v as AlertSeverity)}
              placeholder="Select Severity"
            />
          </div>
        </div>

        {/* 14. Action Channels */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0 pt-2">
            Notification Channels
          </label>
          <div className="w-80 sm:w-96 max-w-md flex flex-wrap items-center gap-4 p-3 rounded-md border border-input/80 bg-muted/20">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-foreground">
              <input
                type="checkbox"
                checked={sms}
                onChange={(e) => setSms(e.target.checked)}
                className="h-4 w-4 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
              />
              <span>SMS</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-foreground">
              <input
                type="checkbox"
                checked={email}
                onChange={(e) => setEmail(e.target.checked)}
                className="h-4 w-4 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
              />
              <span>Email</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-foreground">
              <input
                type="checkbox"
                checked={notification}
                onChange={(e) => setNotification(e.target.checked)}
                className="h-4 w-4 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
              />
              <span>Push Notification</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-foreground">
              <input
                type="checkbox"
                checked={immobilizer}
                onChange={(e) => setImmobilizer(e.target.checked)}
                className="h-4 w-4 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
              />
              <span>Remote Immobilizer</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-foreground">
              <input
                type="checkbox"
                checked={buzzer}
                onChange={(e) => setBuzzer(e.target.checked)}
                className="h-4 w-4 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
              />
              <span>In-Cabin Buzzer</span>
            </label>
          </div>
        </div>
      </div>

      {/* Horizontal divider with 20px space from left and right */}
      <div className="mx-5 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0" />

      {/* Standard Bottom Footer Frame with Action Buttons */}
      <footer className="flex h-12 items-center justify-start gap-2.5 px-5 bg-white dark:bg-slate-900 shrink-0 select-none">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-background px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-[#0089FF]/40 transition-all cursor-pointer shadow-2xs active:scale-98"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
          <span>Reset</span>
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer active:scale-98"
        >
          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Save</span>
        </button>
      </footer>
    </div>
  );
}

/* =========================================================================
   Compatibility Wrapper for AlertDetailModal
   ========================================================================= */
export function AlertDetailModal({
  open,
  onClose,
  alert,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  alert: AlertRuleItem | null;
  onSave: (saved: AlertRuleItem) => void;
}) {
  if (!open) return null;
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[94vw] max-w-[1000px] h-[88vh] max-h-[88vh] p-0 gap-0 overflow-hidden rounded-2xl border border-border bg-background shadow-2xl flex flex-col">
        <AlertDetailFormView alert={alert} onSave={onSave} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================================
   Alert Copy From Modal (Matching Trakzee 2.0 Theme & Reference)
   ========================================================================= */
export function CopyAlertModal({
  open,
  onClose,
  sourceAlert,
  allAlerts,
  onCopySuccess,
}: {
  open: boolean;
  onClose: () => void;
  sourceAlert: AlertRuleItem | null;
  allAlerts: AlertRuleItem[];
  onCopySuccess: (newAlerts: AlertRuleItem[]) => void;
}) {
  const COMPANY_LIST = [
    "HP Company",
    "Global Logistics Inc",
    "Fleet Cargo West",
    "FastTrack Mobility",
  ];

  const [copyFromCompany, setCopyFromCompany] = useState<string>("HP Company");
  const [copyToCompany, setCopyToCompany] = useState<string>("");
  const [selectedAlertIds, setSelectedAlertIds] = useState<string[]>([]);
  const [alertSearch, setAlertSearch] = useState("");

  // Available alerts belonging to copyFromCompany
  const availableAlerts = useMemo(() => {
    return allAlerts.filter(
      (a) =>
        a.company.toLowerCase() === copyFromCompany.toLowerCase() ||
        copyFromCompany === "All",
    );
  }, [allAlerts, copyFromCompany]);

  // Filtered by search inside modal
  const displayedAlerts = useMemo(() => {
    if (!alertSearch.trim()) return availableAlerts;
    const q = alertSearch.toLowerCase();
    return availableAlerts.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.alertType.toLowerCase().includes(q),
    );
  }, [availableAlerts, alertSearch]);

  // When opening or sourceAlert changes
  useEffect(() => {
    if (open) {
      const initialCompany = sourceAlert?.company || "HP Company";
      setCopyFromCompany(initialCompany);
      setCopyToCompany("");
      setAlertSearch("");
      if (sourceAlert) {
        setSelectedAlertIds([sourceAlert.id]);
      } else {
        const list = allAlerts.filter(
          (a) => a.company.toLowerCase() === initialCompany.toLowerCase(),
        );
        setSelectedAlertIds(list.map((a) => a.id));
      }
    }
  }, [open, sourceAlert, allAlerts]);

  // Update selected alerts when copy from company changes
  const handleCopyFromChange = (newCompany: string) => {
    setCopyFromCompany(newCompany);
    if (copyToCompany === newCompany) {
      setCopyToCompany("");
    }
    const list = allAlerts.filter(
      (a) => a.company.toLowerCase() === newCompany.toLowerCase(),
    );
    setSelectedAlertIds(list.map((a) => a.id));
  };

  const handleToggleAlert = (id: string) => {
    setSelectedAlertIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedAlertIds.length === availableAlerts.length) {
      setSelectedAlertIds([]);
    } else {
      setSelectedAlertIds(availableAlerts.map((a) => a.id));
    }
  };

  const handleReset = () => {
    setCopyToCompany("");
    setAlertSearch("");
    const defaultCo = sourceAlert?.company || "HP Company";
    setCopyFromCompany(defaultCo);
    if (sourceAlert) {
      setSelectedAlertIds([sourceAlert.id]);
    } else {
      const list = allAlerts.filter((a) => a.company === defaultCo);
      setSelectedAlertIds(list.map((a) => a.id));
    }
    toast.info("Alert copy form reset");
  };

  const handleCopy = () => {
    if (!copyToCompany || copyToCompany === "Select") {
      toast.error("Please select a target company in 'Copy To'");
      return;
    }
    if (copyToCompany === copyFromCompany) {
      toast.error("'Copy To' company must be different from 'Copy From' company");
      return;
    }
    if (selectedAlertIds.length === 0) {
      toast.error("Please select at least one alert to copy");
      return;
    }

    const alertsToClone = allAlerts.filter((a) => selectedAlertIds.includes(a.id));
    const now = new Date();
    const dateFormatted =
      now.toLocaleDateString("en-GB") +
      " " +
      now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const clonedItems: AlertRuleItem[] = alertsToClone.map((a, idx) => ({
      ...a,
      id: `alt-copy-${Date.now()}-${idx}`,
      name: `${a.name} (${copyToCompany})`,
      company: copyToCompany,
      branch: "All",
      // Reference note: "Email / SMS parameters will not be copied"
      sms: false,
      email: false,
      createdDate: dateFormatted,
    }));

    onCopySuccess(clonedItems);
  };

  const targetCompanyOptions = useMemo(() => {
    return COMPANY_LIST.filter((c) => c !== copyFromCompany);
  }, [copyFromCompany]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      {/* 80-90% backdrop overlay */}
      <DialogContent
        overlayClassName="bg-slate-950/80 backdrop-blur-md"
        className="max-w-2xl max-h-[90vh] p-0 gap-0 overflow-hidden rounded-xl border border-border bg-background shadow-2xl flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5 bg-background shrink-0">
          <DialogTitle className="text-sm font-bold text-foreground">
            Alert Copy From
          </DialogTitle>
          <DialogDescription className="sr-only">
            Copy alerts from one company to another
          </DialogDescription>
        </div>

        {/* Modal Body: Vertically stacked matching Trakzee theme */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs custom-scrollbar">
          {/* 1. Copy From */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Copy From <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <SelectDropdown
              value={copyFromCompany}
              options={COMPANY_LIST}
              onChange={handleCopyFromChange}
              placeholder="Select Source Company"
            />
          </div>

          {/* 2. Copy To */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Copy To <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <SelectDropdown
              value={copyToCompany}
              options={targetCompanyOptions}
              onChange={setCopyToCompany}
              placeholder="Select Target Company"
            />
          </div>

          {/* 3. Alerts Multi-Select Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Alerts <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground font-medium">
                  {selectedAlertIds.length} of {availableAlerts.length} selected
                </span>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-[11px] font-semibold text-[#0089FF] hover:underline cursor-pointer"
                >
                  {selectedAlertIds.length === availableAlerts.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>
            </div>

            {/* Container for Alerts List */}
            <div className="rounded-lg border border-input/80 bg-background overflow-hidden shadow-2xs">
              {/* Search Bar for filtering alerts */}
              {availableAlerts.length > 5 && (
                <div className="flex items-center px-3 py-2 border-b border-border/60 bg-muted/20">
                  <Search className="h-3.5 w-3.5 text-muted-foreground mr-2 shrink-0" />
                  <input
                    type="text"
                    value={alertSearch}
                    onChange={(e) => setAlertSearch(e.target.value)}
                    placeholder="Search alerts to copy..."
                    className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                  />
                  {alertSearch && (
                    <button
                      type="button"
                      onClick={() => setAlertSearch("")}
                      className="text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}

              {/* Scrollable list of selectable alerts */}
              <div className="max-h-56 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {displayedAlerts.length === 0 ? (
                  <div className="py-6 text-center text-xs text-muted-foreground">
                    No alerts found for this company
                  </div>
                ) : (
                  displayedAlerts.map((alt) => {
                    const isChecked = selectedAlertIds.includes(alt.id);
                    return (
                      <label
                        key={alt.id}
                        onClick={() => handleToggleAlert(alt.id)}
                        className={cn(
                          "flex items-center justify-between p-2.5 rounded-md cursor-pointer transition-colors text-xs select-none",
                          isChecked
                            ? "bg-[#0089FF]/8 border border-[#0089FF]/30 text-foreground font-semibold"
                            : "hover:bg-muted/60 border border-transparent text-muted-foreground hover:text-foreground font-medium",
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // handled by label onClick
                            className="h-4 w-4 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                          />
                          <div className="truncate">
                            <span className="text-foreground font-medium truncate block">
                              {alt.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground truncate block">
                              {alt.alertType} • {alt.timezone}
                            </span>
                          </div>
                        </div>

                        {/* Severity Badge */}
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 uppercase tracking-wider",
                            alt.severity === "Critical" &&
                              "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900",
                            alt.severity === "High" &&
                              "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900",
                            alt.severity === "Medium" &&
                              "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900",
                            alt.severity === "Low" &&
                              "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900",
                          )}
                        >
                          {alt.severity}
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* 4. Note Info Callout matching reference */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-blue-200/80 bg-blue-50/70 dark:border-blue-900/60 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200">
            <Info className="h-4 w-4 text-[#0089FF] shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-semibold text-foreground">Note:</span>{" "}
              Email / SMS parameters will not be copied.
            </div>
          </div>
        </div>

        {/* Modal Footer: Reset on Left, Copy Alert on Right */}
        <div className="flex items-center justify-between border-t border-border bg-muted/20 px-5 py-3 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-8.5 items-center gap-1.5 rounded-md border border-input/80 bg-background px-3.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="h-8.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-5 text-xs font-semibold text-white transition-all cursor-pointer shadow-xs active:scale-98"
          >
            Copy {selectedAlertIds.length > 0 ? `(${selectedAlertIds.length}) ` : ""}Alerts
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* Severity Tag */
function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  switch (severity) {
    case "Critical":
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          Critical
        </span>
      );
    case "High":
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          High
        </span>
      );
    case "Medium":
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          Medium
        </span>
      );
    case "Low":
    default:
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/20">
          Low
        </span>
      );
  }
}

/* Channel Indicator Checkmark */
function ChannelCheck({ active }: { active: boolean }) {
  if (active) {
    return <Check className="h-3.5 w-3.5 text-emerald-600 mx-auto stroke-[2.5]" />;
  }
  return <span className="text-slate-300 dark:text-slate-700 font-bold mx-auto text-xs">✕</span>;
}
