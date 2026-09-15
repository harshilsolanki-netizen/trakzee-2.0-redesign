import React, { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
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
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
  company: string;
  branch: string;
  alertType: string;
};

export const DEFAULT_ALERT_FILTERS: AlertFilterState = {
  company: "All",
  branch: "All",
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

const ALERT_TYPE_OPTIONS = [
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

export function AlertSettingPage() {
  const [alerts, setAlerts] = useState<AlertRuleItem[]>(INITIAL_ALERTS);
  const [searchField, setSearchField] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageSizeOpen, setPageSizeOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Right Side Filter Drawer State
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<AlertFilterState>(DEFAULT_ALERT_FILTERS);

  // Modal State for Alert Detail (Add / Edit)
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<AlertRuleItem | null>(null);

  // Modal State for Copy Alert
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [copySourceAlert, setCopySourceAlert] = useState<AlertRuleItem | null>(null);

  const activeDrawerFilterCount = useMemo(() => {
    let count = 0;
    if (activeFilters.company !== "All") count++;
    if (activeFilters.branch !== "All") count++;
    if (activeFilters.alertType !== "All") count++;
    return count;
  }, [activeFilters]);

  const openCreateModal = () => {
    setEditingAlert(null);
    setDetailModalOpen(true);
  };

  const openEditModal = (item: AlertRuleItem) => {
    setEditingAlert(item);
    setDetailModalOpen(true);
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
    setDetailModalOpen(false);
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

  // Filtered alerts: applying drawer filters + search query
  const filteredAlerts = useMemo(() => {
    let list = alerts;

    // Apply Drawer filters
    if (activeFilters.company !== "All") {
      list = list.filter((item) => item.company.toLowerCase() === activeFilters.company.toLowerCase());
    }
    if (activeFilters.branch !== "All") {
      list = list.filter((item) => item.branch.toLowerCase() === activeFilters.branch.toLowerCase());
    }
    if (activeFilters.alertType !== "All") {
      list = list.filter((item) => item.alertType.toLowerCase() === activeFilters.alertType.toLowerCase());
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
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#F8FAFC] dark:bg-slate-950">
      {/* 1. Top Header Bar with integrated Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0">
        {/* Left: Page Title */}
        <h1 className="text-base font-bold text-slate-900 dark:text-white select-none">
          Alert
        </h1>

        {/* Right Toolbar: Search, Actions, Pagination, + Alert */}
        <div className="flex items-center gap-2">
          {/* Search Dropdown + Input Group */}
          <div className="flex items-center rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-background overflow-hidden shadow-2xs h-7.5">
            {/* Field Selector */}
            <div className="relative border-r border-[#DFE3EB] dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
              <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                className="h-7.5 appearance-none bg-transparent pl-2.5 pr-6 text-xs font-semibold text-foreground cursor-pointer focus:outline-none"
              >
                <option value="all">All fields</option>
                <option value="name">Name</option>
                <option value="type">Alert Type</option>
                <option value="company">Company</option>
                <option value="branch">Branch</option>
                <option value="severity">Severity</option>
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none text-muted-foreground" />
            </div>

            {/* Search Input */}
            <div className="relative flex items-center px-2">
              <Search className="h-3.5 w-3.5 text-muted-foreground mr-1.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search in all fields..."
                className="h-full w-32 sm:w-44 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Action Utility Icons: Filter, Download, Column Config, Copy Alert */}
          <div className="flex items-center gap-1">
            {/* 0. Filter Button (Opens Right-Side Panel matching Report Filter) */}
            <button
              type="button"
              onClick={() => setFilterDrawerOpen(true)}
              className={cn(
                "inline-flex h-7.5 items-center gap-1.5 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-background px-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-[#0089FF]/50 transition-all cursor-pointer shadow-2xs active:scale-98 select-none",
                activeDrawerFilterCount > 0 && "border-[#0089FF] bg-blue-50/70 dark:bg-blue-950/40 text-[#0089FF]",
              )}
              title="Filter Options"
            >
              <SlidersHorizontal className={cn("h-3.5 w-3.5", activeDrawerFilterCount > 0 ? "text-[#0089FF]" : "text-slate-600 dark:text-slate-300")} />
              <span>Filter</span>
              {activeDrawerFilterCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0089FF] text-[10px] font-bold text-white leading-none">
                  {activeDrawerFilterCount}
                </span>
              )}
            </button>

            {/* 1. Export XLS */}
            <button
              type="button"
              onClick={() => toast.success("Exported Alert Rules as XLS")}
              className="inline-flex h-7.5 w-7.5 items-center justify-center rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-background text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-[#0089FF]/50 transition-all cursor-pointer shadow-2xs active:scale-98"
              title="Download Excel XLS"
            >
              <Download className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
            </button>

            {/* 2. Copy Alert */}
            <button
              type="button"
              onClick={() => openCopyModal()}
              className="inline-flex h-7.5 w-7.5 items-center justify-center rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-background text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-[#0089FF]/50 transition-all cursor-pointer shadow-2xs active:scale-98"
              title="Copy Alert Rule"
            >
              <Copy className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>

          {/* Vertical Divider */}
          <div className="h-4 w-px bg-border/80 mx-0.5 shrink-0" />

          {/* Page Size Dropdown */}
          <Popover open={pageSizeOpen} onOpenChange={setPageSizeOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "h-7.5 inline-flex items-center gap-1.5 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-background px-2.5 text-xs font-semibold text-foreground cursor-pointer shadow-2xs transition-all select-none hover:bg-muted hover:border-[#0089FF]/50 active:scale-98",
                  pageSizeOpen && "bg-muted border-[#0089FF]/50 ring-2 ring-[#0089FF]/20",
                )}
              >
                <span>{pageSize} / page</span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 opacity-60 transition-transform",
                    pageSizeOpen && "rotate-180",
                  )}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={6}
              className="w-28 p-1 rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md shadow-lg select-none"
            >
              {PAGE_SIZES.map((s) => {
                const isActive = pageSize === s;
                return (
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
                      isActive
                        ? "bg-muted font-semibold text-foreground"
                        : "text-foreground hover:bg-muted/80 hover:text-foreground font-medium",
                    )}
                  >
                    <span>{s} / page</span>
                    {isActive && <Check className="h-3.5 w-3.5 text-[#0089FF]" />}
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>

          {/* Range & Navigation Buttons */}
          <div className="flex items-center gap-1">
            <span className="px-1 text-xs font-semibold tabular-nums text-muted-foreground whitespace-nowrap select-none">
              {firstRecord}-{lastRecord} of {filteredAlerts.length}
            </span>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-7.5 w-7.5 inline-flex items-center justify-center rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-background text-foreground disabled:opacity-40 hover:bg-muted transition-all cursor-pointer disabled:cursor-not-allowed shadow-2xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-7.5 w-7.5 inline-flex items-center justify-center rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-background text-foreground disabled:opacity-40 hover:bg-muted transition-all cursor-pointer disabled:cursor-not-allowed shadow-2xs"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Reset Table & Filters Button (Beside + Alert) */}
          <button
            type="button"
            onClick={handleResetTable}
            className="inline-flex h-7.5 w-7.5 items-center justify-center rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-background text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-[#0089FF]/50 transition-all cursor-pointer shadow-2xs active:scale-98"
            title="Reset Table"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
          </button>

          {/* Primary Action Button: + Alert */}
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-7.5 items-center gap-1.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-3.5 text-xs font-semibold text-white transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Alert</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content Area with Clean Data Table */}
      <div className="flex-1 min-h-0 min-w-0 flex flex-col p-2.5 overflow-hidden">
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-lg shadow-2xs">
          {/* Scrollable Table Area */}
          <div className="flex-1 min-h-0 overflow-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 z-10 shadow-xs">
                <tr className="bg-[#EAF0F6] text-slate-900 dark:bg-slate-800 dark:text-slate-100 font-bold tracking-wider text-[11px] uppercase border-b border-[#DFE3EB] dark:border-slate-700 select-none">
                  <th className="py-2.5 px-3 border-r border-[#DFE3EB] dark:border-slate-700 text-center w-10">
                    #
                  </th>
                  <th className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-700">
                    Company
                  </th>
                  <th className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-700">
                    Branch
                  </th>
                  <th className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-700">
                    Name
                  </th>
                  <th className="py-2.5 px-3 border-r border-[#DFE3EB] dark:border-slate-700 text-center">
                    Severity
                  </th>
                  <th className="py-2.5 px-3 border-r border-[#DFE3EB] dark:border-slate-700 text-center">
                    Vehicles
                  </th>
                  <th className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-700">
                    Alert Type
                  </th>
                  <th className="py-2.5 px-3 border-r border-[#DFE3EB] dark:border-slate-700">
                    Timezone
                  </th>
                  <th className="py-2.5 px-3 border-r border-[#DFE3EB] dark:border-slate-700 text-center">
                    Reason
                  </th>
                  <th className="py-2.5 px-2 border-r border-[#DFE3EB] dark:border-slate-700 text-center w-10" title="SMS Trigger">
                    SMS
                  </th>
                  <th className="py-2.5 px-2 border-r border-[#DFE3EB] dark:border-slate-700 text-center w-10" title="Email Trigger">
                    Email
                  </th>
                  <th className="py-2.5 px-2 border-r border-[#DFE3EB] dark:border-slate-700 text-center w-10" title="App Push Notification">
                    Notif
                  </th>
                  <th className="py-2.5 px-2 border-r border-[#DFE3EB] dark:border-slate-700 text-center w-10" title="Remote Engine Cut / Immobilizer">
                    Immo
                  </th>
                  <th className="py-2.5 px-2 border-r border-[#DFE3EB] dark:border-slate-700 text-center w-10" title="In-Cabin Buzzer">
                    Buzzer
                  </th>
                  <th className="py-2.5 px-2.5 border-r border-[#DFE3EB] dark:border-slate-700 text-center" title="Email Verify Status">
                    Email Verify
                  </th>
                  <th className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-700">
                    Created Date
                  </th>
                  <th className="py-2.5 px-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFE3EB] dark:divide-slate-800 bg-white dark:bg-slate-900 font-medium">
                {pageRows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => openEditModal(row)}
                  >
                    <td className="py-2 px-3 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-center text-muted-foreground font-mono text-[11px]">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="py-2 px-3.5 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                      {row.company}
                    </td>
                    <td className="py-2 px-3.5 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-muted-foreground">
                      {row.branch}
                    </td>
                    <td className="py-2 px-3.5 border-r border-[#DFE3EB]/70 dark:border-slate-800 font-semibold text-foreground group-hover:text-[#0089FF] transition-colors">
                      {row.name}
                    </td>
                    <td className="py-2 px-3 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-center">
                      <SeverityBadge severity={row.severity} />
                    </td>
                    <td className="py-2 px-3 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-center">
                      <span className="font-mono font-bold text-[#0089FF] bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 text-[11px]">
                        {row.vehicleCount}
                      </span>
                    </td>
                    <td className="py-2 px-3.5 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      {row.alertType}
                    </td>
                    <td className="py-2 px-3 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-muted-foreground font-mono text-[11px]">
                      {row.timezone}
                    </td>
                    <td className="py-2 px-3 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-center text-muted-foreground font-mono text-[11px]">
                      {row.reason || "--"}
                    </td>
                    <td className="py-2 px-2 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-center">
                      <ChannelCheck active={row.sms} />
                    </td>
                    <td className="py-2 px-2 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-center">
                      <ChannelCheck active={row.email} />
                    </td>
                    <td className="py-2 px-2 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-center">
                      <ChannelCheck active={row.notification} />
                    </td>
                    <td className="py-2 px-2 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-center">
                      <ChannelCheck active={row.immobilizer} />
                    </td>
                    <td className="py-2 px-2 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-center">
                      <ChannelCheck active={row.buzzer} />
                    </td>
                    <td className="py-2 px-2.5 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-center">
                      <span title="Email Verified" className="inline-flex items-center justify-center p-0.5 rounded text-slate-500 dark:text-slate-400">
                        <FileText className="h-3.5 w-3.5" />
                      </span>
                    </td>
                    <td className="py-2 px-3.5 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-muted-foreground font-mono text-[11px]">
                      {row.createdDate}
                    </td>
                    <td className="py-2 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(row)}
                          className="p-1 rounded text-muted-foreground hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit Alert"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openCopyModal(row)}
                          className="p-1 rounded text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
                          title="Copy Alert Rule"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAlert(row.id)}
                          className="p-1 rounded text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 && (
                  <tr>
                    <td colSpan={17} className="py-14 text-center text-xs text-muted-foreground">
                      No alert rules found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. Alert Detail Modal (All fields one below another, no back button) */}
      <AlertDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        alert={editingAlert}
        onSave={handleSaveAlert}
      />

      {/* 4. Copy Alert Modal */}
      <CopyAlertModal
        open={copyModalOpen}
        onClose={() => setCopyModalOpen(false)}
        sourceAlert={copySourceAlert}
        allAlerts={alerts}
        onCopySuccess={handleCopySuccess}
      />

      {/* 5. Right Side Filter Drawer (Matching Report Panel Theme) */}
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
  );
}

/* =========================================================================
   Alert Filter Drawer (Right Side Panel matching Report Filter Theme)
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
  const [draftCompany, setDraftCompany] = useState(filters.company);
  const [draftBranch, setDraftBranch] = useState(filters.branch);
  const [draftAlertType, setDraftAlertType] = useState(filters.alertType);

  // Sync draft with active filters when drawer opens
  useEffect(() => {
    if (open) {
      setDraftCompany(filters.company);
      setDraftBranch(filters.branch);
      setDraftAlertType(filters.alertType);
    }
  }, [open, filters]);

  // Unique companies
  const companyOptions = useMemo(() => {
    const list = [
      "All",
      "HP Company",
      "Global Logistics Inc",
      "Fleet Cargo West",
      "FastTrack Mobility",
    ];
    return list;
  }, []);

  // Unique branches based on company
  const branchOptions = useMemo(() => {
    return ["All", "Central Branch", "North Terminal", "West Hub"];
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
    set.add("911");
    set.add("Abnormal Flameout Warning");
    set.add("Automatic Capture Event");
    set.add("Calibration Fail");
    set.add("Camera Cover");
    set.add("Camera Error Code");
    set.add("Distraction");
    set.add("Over Speed");
    set.add("SOS Panic");
    return Array.from(set);
  }, [allAlerts, draftCompany, draftBranch]);

  const handleDrawerApply = () => {
    onApply({
      company: draftCompany,
      branch: draftBranch,
      alertType: draftAlertType,
    });
    onClose();
    toast.success("Filters applied successfully");
  };

  const handleDrawerReset = () => {
    setDraftCompany("All");
    setDraftBranch("All");
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

        {/* Drawer Scrollable Body: Exactly Company, Branch, Alert Type from user reference */}
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

          {/* 3. Alert Type */}
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
   Alert Detail Modal (One below another vertical stack, No Back button)
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
  const isEdit = Boolean(alert);

  // Form states
  const [company, setCompany] = useState("HP Company");
  const [branch, setBranch] = useState("All");
  const [basedOn, setBasedOn] = useState<"Vehicle" | "Vehicle Group" | "Vehicle Type">("Vehicle");
  const [object, setObject] = useState("All");
  const [alertName, setAlertName] = useState("");
  const [alertType, setAlertType] = useState("911");
  const [triggerPhase, setTriggerPhase] = useState<"Start" | "Cancel" | "Both">("Start");
  const [messageText, setMessageText] = useState("911 Emergency Alert Triggered");
  const [validDays, setValidDays] = useState<"Everyday" | "Custom">("Everyday");
  const [customDays, setCustomDays] = useState<string[]>(DAYS_OF_WEEK);
  const [timeFrom, setTimeFrom] = useState("12:00 AM");
  const [timeTo, setTimeTo] = useState("11:59 PM");
  const [timezone, setTimezone] = useState("Asia/Kolkata (UTC+05:30)");
  const [severity, setSeverity] = useState<AlertSeverity>("High");
  const [sms, setSms] = useState(false);
  const [email, setEmail] = useState(true);
  const [notification, setNotification] = useState(true);
  const [immobilizer, setImmobilizer] = useState(false);
  const [buzzer, setBuzzer] = useState(false);

  // Synchronize state on open or alert change
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
      // Defaults for new alert
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
  }, [alert, open]);

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
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      {/* 80-90% backdrop overlay keeping the underlying app visibly grounded */}
      <DialogContent
        overlayClassName="bg-slate-950/80 backdrop-blur-md"
        className="max-w-2xl max-h-[90vh] p-0 gap-0 overflow-hidden rounded-xl border border-border bg-background shadow-2xl flex flex-col"
      >
        {/* Modal Header: Clean Title + Close X (No bell icon badge, no subtext per user feedback) */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5 bg-background shrink-0">
          <DialogTitle className="text-sm font-bold text-foreground">
            {isEdit ? `Edit Alert Rule: ${alert?.name}` : "Alert Detail"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Alert Rule Configuration Form
          </DialogDescription>
        </div>

        {/* Modal Scrollable Form Body: ALL FIELDS ONE BELOW ANOTHER */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar text-xs">
          {/* 1. Company */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Company <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <SelectDropdown
              value={company}
              options={["HP Company", "Global Logistics Inc", "Fleet Cargo West"]}
              onChange={setCompany}
              placeholder="Select Company"
            />
          </div>

          {/* 2. Branch (Below Company) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Branch <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <SelectDropdown
              value={branch}
              options={["All", "Central Branch", "North Terminal", "West Hub"]}
              onChange={setBranch}
              placeholder="Select Branch"
            />
          </div>

          {/* 3. Based On */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Based On <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
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
                    name="modalBasedOn"
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
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Object <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <SelectDropdown
              value={object}
              options={[
                "All",
                "Fuel - 1001 (B 1234 XYZ)",
                "Truck - 2004 (B 5678 KLM)",
                "Semi-Trailer - 3008",
              ]}
              onChange={setObject}
              placeholder="Select Object"
            />
          </div>

          {/* 5. Alert Type (Below Object) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Alert Type <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <SelectDropdown
              value={alertType}
              options={ALERT_TYPE_OPTIONS}
              onChange={setAlertType}
              placeholder="Select Alert Type"
            />
          </div>

          {/* 6. Alert Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Alert Name <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <input
              type="text"
              value={alertName}
              onChange={(e) => setAlertName(e.target.value)}
              placeholder="e.g. 911 / Abnormal Flameout Warning"
              className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 shadow-2xs transition-all hover:border-[#0089FF]/60"
            />
          </div>

          {/* 7. Value / Trigger Phase */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Value / Trigger Phase <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
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
                    name="modalTriggerPhase"
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
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Message Template <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="e.g. 911 Emergency Alert Triggered on {vehicleNo}"
              className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 shadow-2xs transition-all hover:border-[#0089FF]/60"
            />
          </div>

          {/* 9. Valid Day(s) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-foreground">
              Valid Day(s) <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
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
                  name="modalValidDays"
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
                  name="modalValidDays"
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

          {/* 10. Start Time */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Start Time <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <SelectDropdown
              value={timeFrom}
              options={TIME_OPTIONS}
              onChange={setTimeFrom}
              placeholder="Start Time"
            />
          </div>

          {/* 11. End Time (Below Start Time) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              End Time <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <SelectDropdown
              value={timeTo}
              options={TIME_OPTIONS}
              onChange={setTimeTo}
              placeholder="End Time"
            />
          </div>

          {/* 12. Timezone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Timezone <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <SelectDropdown
              value={timezone}
              options={TIMEZONES}
              onChange={setTimezone}
              placeholder="Select Timezone"
            />
          </div>

          {/* 13. Severity (Below Timezone) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Severity <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <SelectDropdown
              value={severity}
              options={["Low", "Medium", "High", "Critical"]}
              onChange={(v) => setSeverity(v as AlertSeverity)}
              placeholder="Select Severity"
            />
          </div>

          {/* 14. Action Channels */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-semibold text-foreground">
              Notification & Action Channels
            </label>
            <div className="flex flex-wrap items-center gap-4 p-3 rounded-md border border-input/80 bg-muted/20">
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

        {/* Modal Footer: Reset on left, Save Alert Rule on right (Back button removed per user request) */}
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
            onClick={handleSave}
            className="h-8.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-5 text-xs font-semibold text-white transition-all cursor-pointer shadow-xs active:scale-98"
          >
            {isEdit ? "Update Alert Rule" : "Save Alert Rule"}
          </button>
        </div>
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

/* =========================================================================
   Reusable SelectDropdown (Exact Component matching Image 5)
   ========================================================================= */
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
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md p-1 shadow-xl animate-in fade-in-0 zoom-in-95 select-none custom-scrollbar">
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
