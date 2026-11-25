import React, { useState, useMemo } from "react";
import {
  Check,
  Undo2,
  Shuffle,
  Car,
  ArrowUpDown,
  User,
  MapPin,
  ListFilter,
  Truck,
  Wifi,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  RotateCw,
  PlusCircle,
  Filter,
  ChevronDown,
  Power,
  ThumbsUp,
  Navigation,
  GitFork,
  Route,
  Bus,
  Key,
  Plus,
  Trash2,
  Flag,
  Shield,
  Layers,
  GitCompare,
  BusFront,
  X,
  Compass,
  FileSpreadsheet,
  FileText,
  Edit3,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ShuttleTrackingPanel, type ShuttleTrip } from "./ShuttleTrackingPanel";

export interface LiveVehicle {
  id: string;
  name: string;
  company: string;
  speed: number;
  status: "running" | "idle" | "stopped" | "inactive" | "nodata";
  driver: string;
  driverSub?: string;
  address?: string;
  lat?: number;
  lng?: number;
  ignition?: boolean;
  gps?: boolean;
  timestamp?: string;
}

export interface LiveCompanyGroup {
  name: string;
  count: number;
  vehicles: LiveVehicle[];
}

export const INITIAL_LIVE_GROUPS: LiveCompanyGroup[] = [
  {
    name: "ETSCompany",
    count: 1,
    vehicles: [
      {
        id: "ets-1",
        name: "Test vehicle 01 - Test vehi...",
        company: "ETSCompany",
        speed: 97,
        status: "running",
        driver: "Test Driver 01",
        driverSub: "01",
        address: "Gaviyar Vanta, Gaviyar, Surat, Gujarat (SW)",
        lat: 21.162,
        lng: 72.748,
        ignition: true,
        gps: true,
        timestamp: "20-10-2026 12:30:14",
      },
    ],
  },
  {
    name: "ETSV01",
    count: 1,
    vehicles: [
      {
        id: "etsv-1",
        name: "ETSV01 Vehicle 1 - ETSV01...",
        company: "ETSV01",
        speed: 0,
        status: "inactive",
        driver: "—",
        address: "—",
        lat: 21.148,
        lng: 72.735,
        ignition: false,
        gps: true,
        timestamp: "20-09-2026 12:50:00",
      },
    ],
  },
  {
    name: "RamETCompany01",
    count: 6,
    vehicles: [
      {
        id: "fu-1",
        name: "FU01 - Fuel Vehicle",
        company: "RamETCompany01",
        speed: 4,
        status: "running",
        driver: "Driver01",
        driverSub: "Comp01",
        address: "Dumas Jumma Masjid, Dumas Town, Surat - ...",
        lat: 21.087,
        lng: 72.714,
        ignition: true,
        gps: true,
        timestamp: "20-09-2026 12:50:00",
      },
      {
        id: "fu-2",
        name: "FU02 - Fuel Vehicle02",
        company: "RamETCompany01",
        speed: 80,
        status: "running",
        driver: "Driver02",
        driverSub: "Comp01",
        address: "—",
        lat: 21.112,
        lng: 72.729,
        ignition: true,
        gps: true,
        timestamp: "17-09-2026 17:59:24",
      },
      {
        id: "fu-3",
        name: "FU03 - Fuel Vehicle03",
        company: "RamETCompany01",
        speed: 102,
        status: "running",
        driver: "Driver03",
        driverSub: "Comp01",
        address: "Dumas Langar, Sultanabad, Surat, Gujarat (SE)",
        lat: 21.074,
        lng: 72.705,
        ignition: true,
        gps: true,
        timestamp: "17-09-2026 18:07:13",
      },
      {
        id: "fu-4",
        name: "FU04 - Fuel Vehicle04",
        company: "RamETCompany01",
        speed: 80,
        status: "running",
        driver: "Driver04",
        driverSub: "Comp01",
        address: "—",
        lat: 21.135,
        lng: 72.738,
        ignition: true,
        gps: true,
        timestamp: "17-09-2026 17:58:34",
      },
      {
        id: "fu-5",
        name: "FU05 - Fuel Vehicle05",
        company: "RamETCompany01",
        speed: 42,
        status: "running",
        driver: "Driver05",
        driverSub: "Comp01",
        address: "—",
        lat: 21.121,
        lng: 72.742,
        ignition: true,
        gps: true,
        timestamp: "17-09-2026 17:58:23",
      },
      {
        id: "veh-01",
        name: "Vehicle01 - Vehicle01",
        company: "RamETCompany01",
        speed: 0,
        status: "inactive",
        driver: "—",
        address: "—",
        lat: 21.155,
        lng: 72.76,
        ignition: false,
        gps: false,
        timestamp: "—",
      },
    ],
  },
  {
    name: "RamNewCompany",
    count: 29,
    vehicles: [
      {
        id: "rn-1",
        name: "MH0112 - Vehicle0112",
        company: "RamNewCompany",
        speed: 0,
        status: "inactive",
        driver: "—",
        address: "—",
        lat: 21.168,
        lng: 72.772,
        ignition: false,
        gps: false,
        timestamp: "—",
      },
      {
        id: "rn-2",
        name: "MH0113 - Vehicle0113",
        company: "RamNewCompany",
        speed: 0,
        status: "inactive",
        driver: "—",
        address: "—",
        lat: 21.175,
        lng: 72.785,
        ignition: false,
        gps: false,
        timestamp: "—",
      },
      {
        id: "rn-3",
        name: "MH101 - Vehicle 101",
        company: "RamNewCompany",
        speed: 0,
        status: "inactive",
        driver: "—",
        address: "—",
        lat: 21.182,
        lng: 72.795,
        ignition: false,
        gps: false,
        timestamp: "—",
      },
      {
        id: "rn-4",
        name: "MH102 - Vehicle 102",
        company: "RamNewCompany",
        speed: 0,
        status: "inactive",
        driver: "—",
        address: "—",
        lat: 21.189,
        lng: 72.805,
        ignition: false,
        gps: false,
        timestamp: "—",
      },
      {
        id: "rn-5",
        name: "MH103 - Vehicle 103",
        company: "RamNewCompany",
        speed: 0,
        status: "inactive",
        driver: "—",
        address: "—",
        lat: 21.196,
        lng: 72.815,
        ignition: false,
        gps: false,
        timestamp: "—",
      },
      {
        id: "rn-6",
        name: "MH104 - Vehicle 104",
        company: "RamNewCompany",
        speed: 0,
        status: "inactive",
        driver: "—",
        address: "—",
        lat: 21.203,
        lng: 72.825,
        ignition: false,
        gps: false,
        timestamp: "—",
      },
    ],
  },
];

// Mock Address Data
const MOCK_ADDRESS_GROUPS = [
  {
    group: "Ha Company",
    subgroups: [
      {
        name: "HS - Bank",
        addresses: [
          { id: "a-1", name: "Vortex - Safety Operations Hub", category: "Safety", lat: 21.17, lng: 72.75 },
          { id: "a-2", name: "Aegis - Security Assessment Area", category: "Security", lat: 21.16, lng: 72.76 },
          { id: "a-3", name: "Sentinel - Emergency Response Zone", category: "Emergency", lat: 21.15, lng: 72.74 },
          { id: "a-4", name: "Fortress - Threat Analysis Division", category: "Analysis", lat: 21.14, lng: 72.73 },
          { id: "a-5", name: "Haven - Cautionary Measures Facility", category: "Facility", lat: 21.13, lng: 72.72 },
          { id: "a-6", name: "Nexus - High-Risk Operations Center", category: "High-Risk", lat: 21.12, lng: 72.71 },
        ],
      },
    ],
  },
];

// Mock Geofence Data
const MOCK_GEOFENCE_GROUPS = [
  {
    group: "Ha Company Geofences",
    geofences: [
      { id: "g-1", name: "HS - Bank", category: "Financial / Bank", type: "Polygon Zone", checked: true },
      { id: "g-2", name: "Zin - AI Studio", category: "Tech Hub", type: "Circular Zone", checked: true },
      { id: "g-3", name: "Vortex - Safety Operations Hub", category: "Safety Operations", type: "Polygon Zone", checked: true },
      { id: "g-4", name: "Aegis - Security Assessment Area", category: "Security Area", type: "Polygon Zone", checked: true },
      { id: "g-5", name: "Sentinel - Emergency Response Zone", category: "Emergency Response", type: "Circular Zone", checked: true },
      { id: "g-6", name: "Fortress - Threat Analysis Division", category: "Threat Analysis", type: "Polygon Zone", checked: false },
    ],
  },
];

// Cloned Roster Trip Checkpoints
const CLONED_TRIP_CHECKPOINTS = [
  {
    id: "cp-1",
    index: 1,
    type: "start",
    location: "Central Fleet Depot, Gate 1",
    allocatedEmployees: 0,
    returnPoint: false,
    estimatedReachTime: "12:00 PM",
    halt: "—",
  },
  {
    id: "cp-2",
    index: 2,
    type: "stop",
    location: "Metro Station Hub, East Exit",
    allocatedEmployees: 4,
    returnPoint: false,
    estimatedReachTime: "12:20 PM",
    halt: "5 min",
  },
  {
    id: "cp-3",
    index: 3,
    type: "end",
    location: "Corporate Tech Park, Tower B",
    allocatedEmployees: 0,
    returnPoint: false,
    estimatedReachTime: "12:45 PM",
    halt: "—",
  },
];

// Exact Live Production Geofences Dataset (1:1 with media_1795434917075_5f3f3041.jpg)
const LIVE_PRODUCTION_GEOFENCES = [
  { id: "g-1", name: "HS - Bank", checked: true, category: "Financial / Bank", type: "Polygon Zone" },
  { id: "g-2", name: "Zin - AI Studio", checked: true, category: "Tech Hub", type: "Circular Zone" },
  { id: "g-3", name: "Vortex - Safety Operations Hub", checked: true, category: "Safety Operations", type: "Polygon Zone" },
  { id: "g-4", name: "Aegis - Security Assessment Area", checked: true, category: "Security Area", type: "Polygon Zone" },
  { id: "g-5", name: "Sentinel - Emergency Response Zone", checked: true, category: "Emergency Response", type: "Circular Zone" },
  { id: "g-6", name: "Fortress - Threat Analysis Division", checked: false, category: "Threat Analysis", type: "Polygon Zone" },
  { id: "g-7", name: "Haven - Cautionary Measures Facility", checked: false, category: "Cautionary Facility", type: "Circular Zone" },
  { id: "g-8", name: "Outpost - Hazard Evaluation Grounds", checked: false, category: "Hazard Evaluation", type: "Polygon Zone" },
  { id: "g-9", name: "Nexus - High-Risk Operations Center", checked: false, category: "Operations Center", type: "Polygon Zone" },
  { id: "g-10", name: "Bastion - Vulnerability Assessment Zone", checked: false, category: "Vulnerability Zone", type: "Circular Zone" },
  { id: "g-11", name: "Beacon - Warning Response Area", checked: false, category: "Warning Response", type: "Polygon Zone" },
  { id: "g-12", name: "Pinnacle - Alert Management Zone", checked: false, category: "Alert Management", type: "Circular Zone" },
  { id: "g-13", name: "Horizon - Unsafe Assessment Grounds", checked: false, category: "Assessment Grounds", type: "Polygon Zone" },
  { id: "g-14", name: "Elysium - Threat Monitoring Area", checked: false, category: "Threat Monitoring", type: "Polygon Zone" },
  { id: "g-15", name: "Apex - Risk Evaluation Zone", checked: false, category: "Risk Evaluation", type: "Circular Zone" },
  { id: "g-16", name: "Citadel - Dangerous Territory Hub", checked: false, category: "Dangerous Hub", type: "Polygon Zone" },
  { id: "g-17", name: "Crisis Point - Emergency Zone", checked: false, category: "Emergency Zone", type: "Circular Zone" },
  { id: "g-18", name: "Peril Point - Risk Assessment Zone", checked: false, category: "Risk Assessment", type: "Polygon Zone" },
  { id: "g-19", name: "Hazard Haven - Safety Zone", checked: false, category: "Safety Zone", type: "Polygon Zone" },
];

export type TrackingPanelTab = "vehicle" | "trip" | "shuttle" | "address" | "geofence";

export interface LiveTrackingReferencePanelProps {
  onSelectVehicle?: (vehicle: LiveVehicle) => void;
  selectedVehicleId?: string | null;
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
  liveVehicles?: LiveVehicle[];
  onLiveVehiclesChange?: React.Dispatch<React.SetStateAction<LiveVehicle[]>>;
  checkedVehiclesMap?: Record<string, boolean>;
  onCheckedVehiclesChange?: (map: Record<string, boolean>) => void;
  onCenterFleet?: () => void;
  activeTab?: TrackingPanelTab;
  onTabChange?: (tab: TrackingPanelTab) => void;
  panelWidth?: number;
  onStartResize?: () => void;
  onResetWidth?: () => void;
  isResizing?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function LiveTrackingReferencePanel({
  onSelectVehicle,
  selectedVehicleId,
  onToggleCollapse,
  isCollapsed = false,
  liveVehicles,
  onLiveVehiclesChange,
  checkedVehiclesMap,
  onCheckedVehiclesChange,
  onCenterFleet,
  activeTab = "vehicle",
  onTabChange,
  panelWidth = 560,
  onStartResize,
  onResetWidth,
  isResizing = false,
  className,
  style,
}: LiveTrackingReferencePanelProps) {
  const [internalTab, setInternalTab] = useState<TrackingPanelTab>("vehicle");
  const currentTab = onTabChange ? activeTab : internalTab;
  const setTab = onTabChange || setInternalTab;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // Toolbar & filter states
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortField, setSortField] = useState<string>("name");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tripFilter, setTripFilter] = useState<"all" | "on_trip" | "off_trip" | "no_trip">("all");

  // Trips tab reference states (1:1 with media_1795431048618_549a83d5.jpg)
  const [selectedTripStatusFilter, setSelectedTripStatusFilter] = useState<"all" | "running" | "completed" | "upcoming" | "failed">("all");
  const [tripSearchQuery, setTripSearchQuery] = useState("");
  const [isRefreshingTrips, setIsRefreshingTrips] = useState(false);
  const [isTripGroupCollapsed, setIsTripGroupCollapsed] = useState(false);
  const [tripsChecked, setTripsChecked] = useState<Record<string, boolean>>({
    "trip-1": true,
    "trip-2": true,
    "trip-3": true,
    "trip-4": true,
    "trip-5": true,
  });
  
  // Trip tab state (Cloned from Roster Management)
  const [selectedTripId, setSelectedTripId] = useState("trip-1");
  const [checkpoints, setCheckpoints] = useState(CLONED_TRIP_CHECKPOINTS);
  const [considerTripWithRoute, setConsiderTripWithRoute] = useState(true);

  // Selected detail state for Trips & Shuttle tabs
  const [selectedTripDetail, setSelectedTripDetail] = useState<{ id: string; name: string } | null>(null);
  // Shuttle tab state
  const [selectedShuttleTrip, setSelectedShuttleTrip] = useState<ShuttleTrip | null>(null);

  // Live production geofences state (1:1 with media_1795434917075_5f3f3041.jpg)
  const [liveGeofences, setLiveGeofences] = useState(LIVE_PRODUCTION_GEOFENCES);
  const [geofenceSearchQuery, setGeofenceSearchQuery] = useState("");
  const [isHaCompanyCollapsed, setIsHaCompanyCollapsed] = useState(false);

  // Geofence & Address checkboxes
  const [geofenceChecked, setGeofenceChecked] = useState<Record<string, boolean>>({
    "g-1": true,
    "g-2": true,
    "g-3": true,
    "g-4": true,
    "g-5": true,
    "g-6": false,
  });
  const [addressChecked, setAddressChecked] = useState<Record<string, boolean>>({
    "a-1": true,
    "a-2": true,
    "a-3": true,
    "a-4": true,
  });

  const [internalChecked, setInternalChecked] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    INITIAL_LIVE_GROUPS.forEach((g) => {
      g.vehicles.forEach((v) => {
        map[v.id] = true;
      });
    });
    return map;
  });

  const checkedVehicles = checkedVehiclesMap || internalChecked;
  const updateChecked = (next: Record<string, boolean>) => {
    setInternalChecked(next);
    onCheckedVehiclesChange?.(next);
  };

  const currentGroups: LiveCompanyGroup[] = useMemo(() => {
    if (!liveVehicles || liveVehicles.length === 0) return INITIAL_LIVE_GROUPS;
    const groupMap: Record<string, LiveVehicle[]> = {
      ETSCompany: [],
      ETSV01: [],
      RamETCompany01: [],
      RamNewCompany: [],
    };
    liveVehicles.forEach((v) => {
      if (groupMap[v.company]) {
        groupMap[v.company].push(v);
      } else {
        groupMap[v.company] = [v];
      }
    });
    return [
      { name: "ETSCompany", count: 1, vehicles: groupMap["ETSCompany"] || [] },
      { name: "ETSV01", count: 1, vehicles: groupMap["ETSV01"] || [] },
      { name: "RamETCompany01", count: 6, vehicles: groupMap["RamETCompany01"] || [] },
      { name: "RamNewCompany", count: 29, vehicles: groupMap["RamNewCompany"] || [] },
    ];
  }, [liveVehicles]);

  const toggleGroupCollapse = (name: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const toggleCheckVehicle = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const next = { ...checkedVehicles, [id]: !checkedVehicles[id] };
    updateChecked(next);
  };

  const toggleCheckAll = () => {
    const allChecked = Object.values(checkedVehicles).every(Boolean);
    const next: Record<string, boolean> = {};
    currentGroups.forEach((g) => {
      g.vehicles.forEach((v) => {
        next[v.id] = !allChecked;
      });
    });
    updateChecked(next);
  };

  // Status KPI counts calculated dynamically or matching reference 1, 0, 0, 8, 42, 51
  const allVehiclesFlat = useMemo(() => {
    return currentGroups.flatMap((g) => g.vehicles);
  }, [currentGroups]);

  const statusCounts = useMemo(() => {
    const running = allVehiclesFlat.filter((v) => v.status === "running").length;
    const idle = allVehiclesFlat.filter((v) => v.status === "idle").length;
    const stopped = allVehiclesFlat.filter((v) => v.status === "stopped").length;
    const inactive = allVehiclesFlat.filter((v) => v.status === "inactive").length;
    const nodata = allVehiclesFlat.filter((v) => v.status === "nodata").length;
    return {
      running: running || 1,
      idle: idle || 0,
      stopped: stopped || 0,
      inactive: inactive || 8,
      nodata: nodata || 42,
      total: 51,
    };
  }, [allVehiclesFlat]);

  const tripCounts = useMemo(() => {
    return {
      onTrip: 0,
      offTrip: 9,
      noTrip: 42,
      total: 51,
    };
  }, []);

  const filteredGroups = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return currentGroups.map((group) => {
      let matchedVehicles = group.vehicles.filter((v) => {
        const matchesStatus =
          selectedStatusFilter === "all" || v.status === selectedStatusFilter;
        const matchesTrip =
          tripFilter === "all" ||
          (tripFilter === "on_trip" && false) ||
          (tripFilter === "off_trip" && v.speed > 0) ||
          (tripFilter === "no_trip" && v.speed === 0);
        const matchesQuery =
          !q ||
          v.name.toLowerCase().includes(q) ||
          (v.driver && v.driver.toLowerCase().includes(q)) ||
          (v.address && v.address.toLowerCase().includes(q));
        return matchesStatus && matchesTrip && matchesQuery;
      });

      if (sortField === "speed") {
        matchedVehicles = [...matchedVehicles].sort((a, b) => b.speed - a.speed);
      } else if (sortField === "name") {
        matchedVehicles = [...matchedVehicles].sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortField === "status") {
        matchedVehicles = [...matchedVehicles].sort((a, b) => a.status.localeCompare(b.status));
      } else if (sortField === "driver") {
        matchedVehicles = [...matchedVehicles].sort((a, b) => (a.driver || "").localeCompare(b.driver || ""));
      }

      return {
        ...group,
        vehicles: matchedVehicles,
      };
    }).filter((g) => g.vehicles.length > 0 || !searchQuery);
  }, [currentGroups, searchQuery, selectedStatusFilter, tripFilter, sortField]);

  const shownCount = useMemo(() => {
    return filteredGroups.reduce((acc, g) => acc + g.vehicles.length, 0);
  }, [filteredGroups]);

  if (isCollapsed) {
    return null;
  }

  // The 8 Tabs matching the exact reference screenshot media_1795424582961_6d54505a.png
  // 5 Tabs only: 1: Vehicle (BusFront), 2: Trips (Shuffle), 3: Shuttle (Bus - 1:1 with live production), 4: Address (MapPin), 5: Geofence (Shield - 1:1 with live production)
  const TABS = [
    { id: "vehicle", label: "Vehicle", icon: BusFront, target: "vehicle" as TrackingPanelTab },
    { id: "trip", label: "Trips", icon: Shuffle, target: "trip" as TrackingPanelTab },
    { id: "shuttle", label: "Shuttle", icon: Bus, target: "shuttle" as TrackingPanelTab },
    { id: "address", label: "Address", icon: MapPin, target: "address" as TrackingPanelTab },
    { id: "geofence", label: "Geofence", icon: Shield, target: "geofence" as TrackingPanelTab },
  ] as const;

  return (
    <aside
      style={{ width: `${panelWidth}px`, ...style }}
      className={cn(
        "relative h-full flex flex-col select-none text-slate-800 shrink-0 z-20 overflow-visible font-sans pointer-events-auto",
        isResizing ? "transition-none select-none cursor-col-resize" : "transition-[width] duration-75",
        className
      )}
    >
      {/* ── INTERACTIVE CURSOR DRAG-TO-RESIZE HANDLE BAR (1:1 with Trakzee FleetExplorerPanel) ── */}
      {onStartResize && (
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onStartResize();
          }}
          onDoubleClick={() => {
            if (onResetWidth) onResetWidth();
          }}
          title="Drag to resize panel (Double-click to reset to 560px default width)"
          className="absolute top-0 bottom-0 -right-2.5 w-5 z-40 flex items-center justify-center cursor-col-resize group select-none pointer-events-auto"
        >
          <div className="h-16 w-1 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-[#0089FF] group-active:bg-[#0089FF] group-hover:w-1.5 transition-all shadow-xs flex flex-col items-center justify-center gap-1">
            <div className="w-0.5 h-0.5 rounded-full bg-white dark:bg-slate-900" />
            <div className="w-0.5 h-0.5 rounded-full bg-white dark:bg-slate-900" />
            <div className="w-0.5 h-0.5 rounded-full bg-white dark:bg-slate-900" />
          </div>
        </div>
      )}

      {/* ── SLEEK FLOATING RIGHT-EDGE COLLAPSE HANDLE (1:1 with live production FleetExplorerPanel line 1920) ── */}
      {onToggleCollapse && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollapse();
          }}
          className="absolute left-[calc(100%-1px)] top-[18px] z-50 flex h-10 w-5 items-center justify-center rounded-r-xl border border-l-0 border-[#DFE3EB] bg-white text-slate-600 shadow-md hover:bg-sky-50 hover:text-[#0089FF] transition-all cursor-pointer active:scale-95 pointer-events-auto"
          title="Collapse Live Tracking Panel"
        >
          <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
        </button>
      )}

      {/* ── CARD CONTAINER (with rounded-2xl on ALL 4 corners and overflow-hidden so bottom curves never clip) ── */}
      <div className="flex flex-col h-full w-full bg-white border border-[#DFE3EB] rounded-2xl shadow-xl overflow-hidden">

      {/* ── ROW 1: Panel Header Tab Bar / Trip Detail Header (1:1 with live production FleetExplorerPanel) ── */}
      <div className="h-11 px-3 border-b border-[#DFE3EB] flex items-center justify-between bg-white shrink-0 rounded-t-2xl">
        {currentTab === "shuttle" && selectedShuttleTrip ? (
          <div className="flex items-center justify-between w-full min-w-0">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setSelectedShuttleTrip(null)}
                className="flex items-center gap-1.5 text-slate-800 hover:text-[#0089FF] text-xs font-extrabold transition-all cursor-pointer shrink-0 active:scale-95 py-1 tracking-wide"
                title="Back to Shuttle Trips"
              >
                <ChevronLeft className="h-4 w-4 stroke-[2.5] text-slate-600" />
                <span className="font-bold text-sm text-slate-900">{selectedShuttleTrip.code}</span>
              </button>
            </div>
          </div>
        ) : currentTab === "trip" && selectedTripDetail ? (
          <div className="flex items-center justify-between w-full min-w-0">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setSelectedTripDetail(null)}
                className="flex items-center gap-1.5 text-slate-800 hover:text-[#0089FF] text-xs font-extrabold transition-all cursor-pointer shrink-0 active:scale-95 py-1 tracking-wide"
                title="Back to Trips"
              >
                <ChevronLeft className="h-4 w-4 stroke-[2.5] text-slate-600" />
                <span className="font-bold text-sm text-slate-900">{selectedTripDetail.name}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-2">
            {TABS.map((tab) => {
              const isActive = currentTab === tab.target && tab.id === currentTab;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setTab(tab.target);
                  }}
                  title={tab.label}
                  className={cn(
                    "h-8 flex items-center justify-center gap-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 active:scale-98",
                    isActive
                      ? "bg-[#0089FF] text-white shadow-xs px-3 font-bold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 w-8"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 stroke-[2.2]" />
                  {isActive && <span>{tab.label}</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── TAB 1: VEHICLE (1:1 with media_1795424582961_6d54505a.png) ── */}
      {currentTab === "vehicle" && (
        <div className="flex-1 min-h-0 flex flex-col bg-white overflow-hidden font-sans rounded-b-2xl">
          {/* ROW 2: Trip Status Bar with 4 Rounded Pill Cards (1:1 with reference) */}
          <div className="px-2.5 pt-2 pb-1.5 border-b border-[#DFE3EB] bg-white select-none shrink-0">
            <div className="grid grid-cols-4 gap-1.5">
              {/* 1. On trip */}
              <button
                type="button"
                onClick={() => setTripFilter(tripFilter === "on_trip" ? "all" : "on_trip")}
                className={cn(
                  "flex items-center justify-center gap-1.5 h-8 px-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs transition-all hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer",
                  tripFilter === "on_trip" && "bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700 shadow-2xs font-semibold"
                )}
                title="Filter On trip vehicles"
              >
                <Route className="h-3.5 w-3.5 text-[#008446] shrink-0 stroke-[2.2]" />
                <span className="font-bold text-[#008446] tabular-nums text-xs">{tripCounts.onTrip}</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium text-xs">On trip</span>
              </button>

              {/* 2. Off trip */}
              <button
                type="button"
                onClick={() => setTripFilter(tripFilter === "off_trip" ? "all" : "off_trip")}
                className={cn(
                  "flex items-center justify-center gap-1.5 h-8 px-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs transition-all hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer",
                  tripFilter === "off_trip" && "bg-rose-50 border-rose-300 dark:bg-rose-950/40 dark:border-rose-700 shadow-2xs font-semibold"
                )}
                title="Filter Off trip vehicles"
              >
                <GitFork className="h-3.5 w-3.5 text-[#C70036] shrink-0 stroke-[2.2] rotate-180" />
                <span className="font-bold text-[#C70036] tabular-nums text-xs">{tripCounts.offTrip}</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium text-xs">Off trip</span>
              </button>

              {/* 3. No trip */}
              <button
                type="button"
                onClick={() => setTripFilter(tripFilter === "no_trip" ? "all" : "no_trip")}
                className={cn(
                  "flex items-center justify-center gap-1.5 h-8 px-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs transition-all hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer",
                  tripFilter === "no_trip" && "bg-slate-100 border-slate-300 dark:bg-slate-800 dark:border-slate-600 shadow-2xs font-semibold"
                )}
                title="Filter No trip vehicles"
              >
                <Bus className="h-3.5 w-3.5 text-slate-500 shrink-0 stroke-[2.2]" />
                <span className="font-bold text-slate-700 dark:text-slate-300 tabular-nums text-xs">{tripCounts.noTrip}</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium text-xs">No trip</span>
              </button>

              {/* 4. Total */}
              <button
                type="button"
                onClick={() => setTripFilter("all")}
                className={cn(
                  "flex items-center justify-center gap-1.5 h-8 px-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs transition-all hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer",
                  tripFilter === "all" && "bg-slate-200/70 border-slate-300 dark:bg-slate-700 dark:border-slate-600 shadow-2xs font-semibold"
                )}
                title="Show all trips"
              >
                <MapPin className="h-3.5 w-3.5 text-slate-800 dark:text-slate-100 fill-current shrink-0 stroke-[2]" />
                <span className="font-bold text-slate-900 dark:text-white tabular-nums text-xs">{tripCounts.total}</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium text-xs">Total</span>
              </button>
            </div>
          </div>

          {/* ROW 3: Segmented 6 KPI Status Counters (1:1 with reference & Trakzee FleetExplorerPanel) */}
          <div className="px-2.5 py-1.5 border-b border-[#DFE3EB] bg-white select-none shrink-0">
            <div className="grid grid-cols-6 gap-1.5">
              {/* Running */}
              <button
                type="button"
                onClick={() => setSelectedStatusFilter(selectedStatusFilter === "running" ? "all" : "running")}
                style={{
                  backgroundColor: selectedStatusFilter === "running" ? "#008446" : "#ECFDF3",
                  borderColor: selectedStatusFilter === "running" ? "#008446" : "#A6F4C5",
                  color: selectedStatusFilter === "running" ? "#FFFFFF" : "#008446",
                }}
                className={cn(
                  "flex flex-col items-center justify-center h-[42px] px-0.5 rounded-xl transition-all duration-150 cursor-pointer select-none border font-sans",
                  selectedStatusFilter === "running" && "shadow-sm shadow-[#008446]/25 font-bold scale-[1.02]",
                )}
              >
                <span className="text-[13px] font-bold tabular-nums leading-none">
                  {statusCounts.running}
                </span>
                <span className="text-[10px] font-bold tracking-wide uppercase leading-tight mt-0.5">
                  RUNNING
                </span>
              </button>

              {/* Idle */}
              <button
                type="button"
                onClick={() => setSelectedStatusFilter(selectedStatusFilter === "idle" ? "all" : "idle")}
                style={{
                  backgroundColor: selectedStatusFilter === "idle" ? "#C46F37" : "#FEF7E6",
                  borderColor: selectedStatusFilter === "idle" ? "#C46F37" : "#FEDF89",
                  color: selectedStatusFilter === "idle" ? "#FFFFFF" : "#C46F37",
                }}
                className={cn(
                  "flex flex-col items-center justify-center h-[42px] px-0.5 rounded-xl transition-all duration-150 cursor-pointer select-none border font-sans",
                  selectedStatusFilter === "idle" && "shadow-sm shadow-[#C46F37]/25 font-bold scale-[1.02]",
                )}
              >
                <span className="text-[13px] font-bold tabular-nums leading-none">
                  {statusCounts.idle}
                </span>
                <span className="text-[10px] font-bold tracking-wide uppercase leading-tight mt-0.5">
                  IDLE
                </span>
              </button>

              {/* Stopped */}
              <button
                type="button"
                onClick={() => setSelectedStatusFilter(selectedStatusFilter === "stopped" ? "all" : "stopped")}
                style={{
                  backgroundColor: selectedStatusFilter === "stopped" ? "#C70036" : "#FFF1F3",
                  borderColor: selectedStatusFilter === "stopped" ? "#C70036" : "#FCCEE8",
                  color: selectedStatusFilter === "stopped" ? "#FFFFFF" : "#C70036",
                }}
                className={cn(
                  "flex flex-col items-center justify-center h-[42px] px-0.5 rounded-xl transition-all duration-150 cursor-pointer select-none border font-sans",
                  selectedStatusFilter === "stopped" && "shadow-sm shadow-[#C70036]/25 font-bold scale-[1.02]",
                )}
              >
                <span className="text-[13px] font-bold tabular-nums leading-none">
                  {statusCounts.stopped}
                </span>
                <span className="text-[10px] font-bold tracking-wide uppercase leading-tight mt-0.5">
                  STOPPED
                </span>
              </button>

              {/* Inactive */}
              <button
                type="button"
                onClick={() => setSelectedStatusFilter(selectedStatusFilter === "inactive" ? "all" : "inactive")}
                style={{
                  backgroundColor: selectedStatusFilter === "inactive" ? "#372AAC" : "#F0EFFF",
                  borderColor: selectedStatusFilter === "inactive" ? "#372AAC" : "#D9D6FE",
                  color: selectedStatusFilter === "inactive" ? "#FFFFFF" : "#372AAC",
                }}
                className={cn(
                  "flex flex-col items-center justify-center h-[42px] px-0.5 rounded-xl transition-all duration-150 cursor-pointer select-none border font-sans",
                  selectedStatusFilter === "inactive" && "shadow-sm shadow-[#372AAC]/25 font-bold scale-[1.02]",
                )}
              >
                <span className="text-[13px] font-bold tabular-nums leading-none">
                  {statusCounts.inactive}
                </span>
                <span className="text-[10px] font-bold tracking-wide uppercase leading-tight mt-0.5">
                  INACTIVE
                </span>
              </button>

              {/* No Data */}
              <button
                type="button"
                onClick={() => setSelectedStatusFilter(selectedStatusFilter === "nodata" ? "all" : "nodata")}
                style={{
                  backgroundColor: selectedStatusFilter === "nodata" ? "#62748E" : "#F1F5F9",
                  borderColor: selectedStatusFilter === "nodata" ? "#62748E" : "#E2E8F0",
                  color: selectedStatusFilter === "nodata" ? "#FFFFFF" : "#62748E",
                }}
                className={cn(
                  "flex flex-col items-center justify-center h-[42px] px-0.5 rounded-xl transition-all duration-150 cursor-pointer select-none border font-sans",
                  selectedStatusFilter === "nodata" && "shadow-sm shadow-[#62748E]/25 font-bold scale-[1.02]",
                )}
              >
                <span className="text-[13px] font-bold tabular-nums leading-none">
                  {statusCounts.nodata}
                </span>
                <span className="text-[10px] font-bold tracking-wide uppercase leading-tight mt-0.5">
                  NO DATA
                </span>
              </button>

              {/* Total */}
              <button
                type="button"
                onClick={() => setSelectedStatusFilter("all")}
                style={{
                  backgroundColor: selectedStatusFilter === "all" ? "#1E2530" : "#1E2530",
                  borderColor: "#1E2530",
                  color: "#FFFFFF",
                }}
                className={cn(
                  "flex flex-col items-center justify-center h-[42px] px-0.5 rounded-xl transition-all duration-150 cursor-pointer select-none border font-sans bg-[#1E2530]",
                  selectedStatusFilter === "all" && "shadow-sm shadow-[#223344]/25 font-bold scale-[1.02]",
                )}
              >
                <span className="text-[13px] font-bold tabular-nums leading-none text-white">
                  {statusCounts.total}
                </span>
                <span className="text-[10px] font-bold tracking-wide uppercase leading-tight mt-0.5 text-white">
                  TOTAL
                </span>
              </button>
            </div>
          </div>

          {/* ROW 4: Search & Operation Icons Toolbar (1:1 with reference) */}
          <div className="flex items-center gap-1.5 border-b border-[#DFE3EB] p-2 bg-white shrink-0">
            {/* Select All Checkbox */}
            <label
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white cursor-pointer shrink-0 hover:bg-sky-50 hover:border-[#0089FF]/50 transition-all shadow-2xs active:scale-90"
              title="Select / Deselect all vehicles on map"
            >
              <input
                type="checkbox"
                checked={Object.values(checkedVehicles).every(Boolean)}
                onChange={toggleCheckAll}
                className="h-[13px] w-[13px] rounded border-slate-300 text-[#0089FF] accent-[#0089FF] cursor-pointer"
              />
            </label>

            {/* Search Input */}
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vehicle, registration or driver..."
                className="h-8 w-full rounded-md border border-slate-200 bg-slate-50/60 pl-3 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF] focus:bg-white transition-colors"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-1.5 p-0.5 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <Search className="absolute right-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              )}
            </div>

            {/* 4 Action Toolbar Icons: RotateCw, PlusCircle, Filter, ArrowUpDown */}
            <div className="flex items-center gap-1.5 shrink-0 text-slate-600">
              {/* 1. Reload Button */}
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedStatusFilter("all");
                        setTripFilter("all");
                        setIsRefreshing(true);
                        setTimeout(() => setIsRefreshing(false), 600);
                        toast.success("Live fleet data refreshed");
                      }}
                      className={cn(
                        "group relative h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-[#0089FF] hover:bg-sky-50 hover:border-[#0089FF]/50 transition-all duration-300 shadow-2xs cursor-pointer active:scale-90",
                        isRefreshing && "bg-sky-50 text-[#0089FF] border-[#0089FF]"
                      )}
                    >
                      <RotateCw
                        className={cn(
                          "h-3.5 w-3.5 stroke-[2.2] transition-transform duration-500 ease-out group-hover:rotate-180",
                          isRefreshing && "animate-spin text-[#0089FF]"
                        )}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="font-semibold text-xs bg-slate-900 text-white border-slate-800">
                    Refresh Live Telemetry
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* 2. PlusCircle (Add Object) */}
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => toast.info("Opening Add New Object modal...")}
                      className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-[#0089FF] hover:bg-sky-50 hover:border-[#0089FF]/50 transition-all shadow-2xs cursor-pointer active:scale-95"
                    >
                      <PlusCircle className="h-3.5 w-3.5 stroke-[2.2]" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="font-semibold text-xs bg-slate-900 text-white border-slate-800">
                    Add New Object
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* 3. Filter Popover */}
              <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            "h-8 w-8 flex items-center justify-center rounded-lg border transition-all shadow-2xs cursor-pointer active:scale-95",
                            filterOpen
                              ? "bg-sky-50 text-[#0089FF] border-[#0089FF]/50 shadow-xs"
                              : "border-slate-200 bg-white text-slate-600 hover:text-[#0089FF] hover:bg-sky-50 hover:border-[#0089FF]/50"
                          )}
                        >
                          <Filter className="h-3.5 w-3.5 stroke-[2.2]" />
                        </button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="font-semibold text-xs bg-slate-900 text-white border-slate-800">
                      Filter Options
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <PopoverContent
                  align="end"
                  sideOffset={6}
                  className="w-56 p-3 bg-white border border-slate-200 shadow-2xl rounded-2xl text-xs z-50 select-none"
                >
                  <div className="font-bold text-slate-900 pb-2 border-b border-slate-200 mb-2">
                    Filter by Status
                  </div>
                  <div className="space-y-1">
                    {[
                      { key: "all", label: "All Vehicles" },
                      { key: "running", label: "Running Only" },
                      { key: "idle", label: "Idle Only" },
                      { key: "stopped", label: "Stopped Only" },
                      { key: "inactive", label: "Inactive Only" },
                      { key: "nodata", label: "No Data Only" },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          setSelectedStatusFilter(item.key);
                          setFilterOpen(false);
                          toast.success(`Filter: ${item.label}`);
                        }}
                        className={cn(
                          "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between",
                          selectedStatusFilter === item.key ? "bg-sky-50 text-[#0089FF] font-bold" : "hover:bg-slate-100 text-slate-700"
                        )}
                      >
                        <span>{item.label}</span>
                        {selectedStatusFilter === item.key && <span className="h-1.5 w-1.5 rounded-full bg-[#0089FF]" />}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* 4. ArrowUpDown (Sorting / Order Popover) */}
              <Popover open={sortOpen} onOpenChange={setSortOpen}>
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            "h-8 w-8 flex items-center justify-center rounded-lg border transition-all shadow-2xs cursor-pointer active:scale-95",
                            sortOpen
                              ? "bg-sky-50 text-[#0089FF] border-[#0089FF]/50 shadow-xs"
                              : "border-slate-200 bg-white text-slate-600 hover:text-[#0089FF] hover:bg-sky-50 hover:border-[#0089FF]/50"
                          )}
                        >
                          <ArrowUpDown className="h-3.5 w-3.5 stroke-[2.2]" />
                        </button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="font-semibold text-xs bg-slate-900 text-white border-slate-800">
                      Sorting / Order
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <PopoverContent
                  align="end"
                  sideOffset={6}
                  className="w-52 p-3 bg-white border border-slate-200 shadow-2xl rounded-2xl text-xs z-50 select-none"
                >
                  <div className="font-bold text-slate-900 pb-2 border-b border-slate-200 mb-2">
                    Sort By
                  </div>
                  <div className="space-y-1">
                    {[
                      { id: "name", label: "Object / Name" },
                      { id: "speed", label: "Speed" },
                      { id: "status", label: "Status" },
                      { id: "driver", label: "Driver Name" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSortField(item.id);
                          setSortOpen(false);
                          toast.success(`Sorted by ${item.label}`);
                        }}
                        className={cn(
                          "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between",
                          sortField === item.id ? "bg-sky-50 text-[#0089FF] font-bold" : "hover:bg-slate-100 text-slate-700"
                        )}
                      >
                        <span>{item.label}</span>
                        {sortField === item.id && <span className="h-1.5 w-1.5 rounded-full bg-[#0089FF]" />}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* ROW 5: Column Headers Bar (1:1 with media_1795424582961_6d54505a.png) */}
          <div className="h-8 px-3 bg-[#F8FAFC] border-b border-[#DFE3EB] grid grid-cols-[20px_1fr_48px_48px_86px_110px_46px] items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
            <span className="flex items-center justify-center">
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </span>
            <span>VEHICLE / NAME</span>
            <span className="text-center">SPEED</span>
            <span className="text-center">STATUS</span>
            <span>DRIVER INFO</span>
            <span>LOCATION / ADDRESS</span>
            <span className="text-right">ACTIONS</span>
          </div>

          {/* ROW 6: Group Accordions & Vehicle Rows (1:1 with media_1795424582961_6d54505a.png) */}
          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-[#DFE3EB]/60 custom-scrollbar bg-white">
            {filteredGroups.map((group) => {
              const isCollapsed = collapsedGroups[group.name];
              const allChecked = group.vehicles.every((v) => checkedVehicles[v.id]);

              return (
                <div key={group.name} className="flex flex-col">
                  {/* Group Header Row */}
                  <div
                    onClick={() => toggleGroupCollapse(group.name)}
                    className="h-7 px-3 bg-[#F1F5F9]/70 hover:bg-[#F1F5F9] flex items-center justify-between text-xs font-bold text-slate-800 cursor-pointer select-none border-b border-[#DFE3EB]/40"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronDown
                        className={cn("h-3.5 w-3.5 text-slate-500 transition-transform", isCollapsed && "-rotate-90")}
                      />
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => {
                          const next = { ...checkedVehicles };
                          group.vehicles.forEach((v) => {
                            next[v.id] = !allChecked;
                          });
                          updateChecked(next);
                        }}
                        className="h-3.5 w-3.5 rounded border-[#DFE3EB] text-[#0089FF] focus:ring-0 cursor-pointer"
                      />
                      <span>{group.name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">[{group.count}]</span>
                  </div>

                  {/* Group Vehicle Rows */}
                  {!isCollapsed && (
                    <div className="divide-y divide-[#DFE3EB]/40">
                      {group.vehicles.map((v) => {
                        const isSelected = selectedVehicleId === v.id;
                        const isChecked = checkedVehicles[v.id] !== false;
                        const isRunning = v.status === "running";

                        return (
                          <div
                            key={v.id}
                            onClick={() => onSelectVehicle?.(v)}
                            className={cn(
                              "px-3 py-2 grid grid-cols-[20px_1fr_48px_48px_86px_110px_46px] items-center text-xs hover:bg-slate-50 transition-colors cursor-pointer select-none",
                              isSelected ? "bg-sky-50/90 font-medium" : "bg-white"
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => toggleCheckVehicle(v.id, e as any)}
                              onClick={(e) => e.stopPropagation()}
                              className="h-3.5 w-3.5 rounded border-[#DFE3EB] text-[#0089FF] focus:ring-0 cursor-pointer"
                            />
                            <div className="flex items-center gap-2 min-w-0 pr-1">
                              <span
                                className={cn(
                                  "h-2 w-2 rounded-full shrink-0 shadow-2xs",
                                  v.status === "running" && "bg-[#008446]",
                                  v.status === "idle" && "bg-[#C46F37]",
                                  v.status === "stopped" && "bg-[#C70036]",
                                  v.status === "inactive" && "bg-[#372AAC]",
                                  (!v.status || v.status === "nodata") && "bg-[#62748E]"
                                )}
                                title={`Status: ${(v.status || "nodata").toUpperCase()}`}
                              />
                              <div className="flex flex-col min-w-0">
                                <span className="font-semibold text-slate-900 truncate text-[11.5px] leading-tight">
                                  {v.name}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono leading-tight mt-0.5">
                                  {v.timestamp || "—"}
                                </span>
                              </div>
                            </div>
                            <div className={cn("text-center font-bold text-[11px]", isRunning ? "text-emerald-600" : "text-slate-400")}>
                              {v.speed > 0 ? v.speed : "0"}
                            </div>

                            {/* Status: Key + Wifi Icons matching media_1795424582961_6d54505a.png */}
                            <div className="flex items-center justify-center gap-1.5">
                              <Key className={cn("h-3 w-3", isRunning ? "text-emerald-500" : "text-slate-300")} />
                              <Wifi className={cn("h-3 w-3", v.gps ? "text-emerald-500" : "text-slate-300")} />
                            </div>

                            <div className="flex flex-col min-w-0">
                              <span className="truncate text-slate-700 text-[11px] leading-tight font-medium">
                                {v.driver}
                              </span>
                              {v.driverSub && (
                                <span className="text-[9.5px] text-slate-400 font-mono leading-tight">
                                  {v.driverSub}
                                </span>
                              )}
                            </div>
                            <div className="truncate text-[10.5px] text-slate-500 pr-1 leading-tight">
                              {v.address || "—"}
                            </div>

                            {/* Actions: Power + ThumbsUp Icons matching media_1795424582961_6d54505a.png */}
                            <div className="flex items-center justify-end gap-1.5 text-slate-400">
                              <button
                                type="button"
                                title="Engine command"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onLiveVehiclesChange) {
                                    onLiveVehiclesChange((prev) =>
                                      prev.map((item) => {
                                        if (item.id === v.id) {
                                          const nextIgnition = !item.ignition;
                                          return {
                                            ...item,
                                            ignition: nextIgnition,
                                            status: nextIgnition ? "running" : "stopped",
                                            speed: nextIgnition ? 45 : 0,
                                          };
                                        }
                                        return item;
                                      })
                                    );
                                  }
                                  toast.success(`Engine ${v.ignition ? "cutoff" : "start"} command sent for ${v.name}`);
                                }}
                                className="hover:text-emerald-600 transition-colors p-0.5"
                              >
                                <Power className={cn("h-3.5 w-3.5", v.ignition ? "text-emerald-600" : "text-slate-400")} />
                              </button>
                              <button
                                type="button"
                                title="Approve / Acknowledge"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success(`Vehicle ${v.name} status acknowledged`);
                                }}
                                className="hover:text-sky-600 transition-colors p-0.5"
                              >
                                <ThumbsUp className="h-3.5 w-3.5 text-[#0089FF]" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 2: TRIP (1:1 matching media_1795431048618_549a83d5.jpg) ── */}
      {currentTab === "trip" && (
        <div className="flex-1 min-h-0 flex flex-col bg-white overflow-hidden font-sans">
          {/* ROW 2: 5 Segmented Status KPI Counter Cards */}
          <div className="px-2.5 py-1.5 border-b border-[#DFE3EB] bg-white select-none shrink-0">
            <div className="grid grid-cols-5 gap-1.5">
              {/* 1. Running */}
              <button
                type="button"
                onClick={() => setSelectedTripStatusFilter(selectedTripStatusFilter === "running" ? "all" : "running")}
                style={{
                  backgroundColor: selectedTripStatusFilter === "running" ? "#008446" : "#ECFDF3",
                  borderColor: selectedTripStatusFilter === "running" ? "#008446" : "#A6F4C5",
                  color: selectedTripStatusFilter === "running" ? "#FFFFFF" : "#008446",
                }}
                className={cn(
                  "flex flex-col items-center justify-center h-[42px] px-0.5 rounded-xl transition-all duration-150 cursor-pointer select-none border font-sans",
                  selectedTripStatusFilter === "running" && "shadow-sm shadow-[#008446]/25 font-bold scale-[1.02]",
                )}
              >
                <span className="text-[13px] font-bold tabular-nums leading-none">21</span>
                <span className="text-[10px] font-bold tracking-wide leading-tight mt-0.5">
                  Running
                </span>
              </button>

              {/* 2. Completed */}
              <button
                type="button"
                onClick={() => setSelectedTripStatusFilter(selectedTripStatusFilter === "completed" ? "all" : "completed")}
                style={{
                  backgroundColor: selectedTripStatusFilter === "completed" ? "#0089FF" : "#EBF5FF",
                  borderColor: selectedTripStatusFilter === "completed" ? "#0089FF" : "#B9E6FE",
                  color: selectedTripStatusFilter === "completed" ? "#FFFFFF" : "#0089FF",
                }}
                className={cn(
                  "flex flex-col items-center justify-center h-[42px] px-0.5 rounded-xl transition-all duration-150 cursor-pointer select-none border font-sans",
                  selectedTripStatusFilter === "completed" && "shadow-sm shadow-[#0089FF]/25 font-bold scale-[1.02]",
                )}
              >
                <span className="text-[13px] font-bold tabular-nums leading-none">2</span>
                <span className="text-[10px] font-bold tracking-wide leading-tight mt-0.5">
                  Completed
                </span>
              </button>

              {/* 3. Upcoming */}
              <button
                type="button"
                onClick={() => setSelectedTripStatusFilter(selectedTripStatusFilter === "upcoming" ? "all" : "upcoming")}
                style={{
                  backgroundColor: selectedTripStatusFilter === "upcoming" ? "#C46F37" : "#FEF7E6",
                  borderColor: selectedTripStatusFilter === "upcoming" ? "#C46F37" : "#FEDF89",
                  color: selectedTripStatusFilter === "upcoming" ? "#FFFFFF" : "#C46F37",
                }}
                className={cn(
                  "flex flex-col items-center justify-center h-[42px] px-0.5 rounded-xl transition-all duration-150 cursor-pointer select-none border font-sans",
                  selectedTripStatusFilter === "upcoming" && "shadow-sm shadow-[#C46F37]/25 font-bold scale-[1.02]",
                )}
              >
                <span className="text-[13px] font-bold tabular-nums leading-none">4</span>
                <span className="text-[10px] font-bold tracking-wide leading-tight mt-0.5">
                  Upcoming
                </span>
              </button>

              {/* 4. Failed */}
              <button
                type="button"
                onClick={() => setSelectedTripStatusFilter(selectedTripStatusFilter === "failed" ? "all" : "failed")}
                style={{
                  backgroundColor: selectedTripStatusFilter === "failed" ? "#C70036" : "#FFF1F3",
                  borderColor: selectedTripStatusFilter === "failed" ? "#C70036" : "#FCCEE8",
                  color: selectedTripStatusFilter === "failed" ? "#FFFFFF" : "#C70036",
                }}
                className={cn(
                  "flex flex-col items-center justify-center h-[42px] px-0.5 rounded-xl transition-all duration-150 cursor-pointer select-none border font-sans",
                  selectedTripStatusFilter === "failed" && "shadow-sm shadow-[#C70036]/25 font-bold scale-[1.02]",
                )}
              >
                <span className="text-[13px] font-bold tabular-nums leading-none">19</span>
                <span className="text-[10px] font-bold tracking-wide leading-tight mt-0.5">
                  Failed
                </span>
              </button>

              {/* 5. Total */}
              <button
                type="button"
                onClick={() => setSelectedTripStatusFilter("all")}
                style={{
                  backgroundColor: selectedTripStatusFilter === "all" ? "#1E2530" : "#1E2530",
                  borderColor: "#1E2530",
                  color: "#FFFFFF",
                }}
                className={cn(
                  "flex flex-col items-center justify-center h-[42px] px-0.5 rounded-xl transition-all duration-150 cursor-pointer select-none border font-sans bg-[#1E2530]",
                  selectedTripStatusFilter === "all" && "shadow-sm shadow-[#223344]/25 font-bold scale-[1.02]",
                )}
              >
                <span className="text-[13px] font-bold tabular-nums leading-none text-white">48</span>
                <span className="text-[10px] font-bold tracking-wide leading-tight mt-0.5 text-white">
                  Total
                </span>
              </button>
            </div>
          </div>

          {/* ROW 3: Search & Reload Bar */}
          <div className="flex items-center gap-2 border-b border-[#DFE3EB] p-2 bg-white shrink-0">
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                value={tripSearchQuery}
                onChange={(e) => setTripSearchQuery(e.target.value)}
                placeholder="Search vehicle, registration or driver..."
                className="h-8 w-full rounded-md border border-slate-200 bg-slate-50/60 pl-3 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF] focus:bg-white transition-colors"
              />
              {tripSearchQuery ? (
                <button
                  type="button"
                  onClick={() => setTripSearchQuery("")}
                  className="absolute right-1.5 p-0.5 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <Search className="absolute right-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              )}
            </div>

            {/* Reload Button */}
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => {
                      setTripSearchQuery("");
                      setSelectedTripStatusFilter("all");
                      setIsRefreshingTrips(true);
                      setTimeout(() => setIsRefreshingTrips(false), 500);
                      toast.success("Trips list refreshed");
                    }}
                    className={cn(
                      "h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-[#0089FF] hover:bg-sky-50 hover:border-[#0089FF]/50 transition-all shadow-2xs cursor-pointer active:scale-90",
                      isRefreshingTrips && "bg-sky-50 text-[#0089FF] border-[#0089FF]"
                    )}
                  >
                    <RotateCw className={cn("h-3.5 w-3.5 stroke-[2.2] transition-transform duration-500", isRefreshingTrips && "animate-spin text-[#0089FF]")} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="font-semibold text-xs bg-slate-900 text-white">
                  Refresh Trips
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* ROW 4: Table Header Bar */}
          <div className="h-8 px-3 bg-[#F8FAFC] border-b border-[#DFE3EB] grid grid-cols-[20px_1fr_120px_76px_22px_22px_22px_22px] items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 gap-1 select-none">
            <input
              type="checkbox"
              checked={Object.values(tripsChecked).every(Boolean)}
              onChange={(e) => {
                const nextVal = e.target.checked;
                setTripsChecked({
                  "trip-1": nextVal,
                  "trip-2": nextVal,
                  "trip-3": nextVal,
                  "trip-4": nextVal,
                  "trip-5": nextVal,
                });
              }}
              className="h-3.5 w-3.5 rounded border-[#DFE3EB] text-[#0089FF] accent-[#0089FF] cursor-pointer"
            />
            <span className="truncate">Trip</span>
            <span className="truncate">Vehicle</span>
            <span className="truncate">Trip type</span>
            <span className="flex items-center justify-center text-[#D97706]" title="Visited Checkpoints">
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
            </span>
            <span className="flex items-center justify-center text-[#DC2626]" title="Skipped / Failed Checkpoints">
              <X className="h-3.5 w-3.5 stroke-[2.5]" />
            </span>
            <span className="flex items-center justify-center text-[#0089FF]" title="Pending Checkpoints">
              <Undo2 className="h-3.5 w-3.5 stroke-[2.2]" />
            </span>
            <span className="flex items-center justify-center text-[#7C3AED]" title="Passenger Count">
              <User className="h-3.5 w-3.5 stroke-[2.2]" />
            </span>
          </div>

          {/* ROW 5: Group Accordion Row */}
          <div
            onClick={() => setIsTripGroupCollapsed(!isTripGroupCollapsed)}
            className="h-7 px-3 bg-[#F1F5F9]/80 hover:bg-[#F1F5F9] flex items-center justify-between text-xs font-bold text-slate-800 cursor-pointer select-none border-b border-[#DFE3EB]/40 shrink-0"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Object.values(tripsChecked).every(Boolean)}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  const nextVal = e.target.checked;
                  setTripsChecked({
                    "trip-1": nextVal,
                    "trip-2": nextVal,
                    "trip-3": nextVal,
                    "trip-4": nextVal,
                    "trip-5": nextVal,
                  });
                }}
                className="h-3.5 w-3.5 rounded border-[#DFE3EB] text-[#0089FF] accent-[#0089FF] cursor-pointer"
              />
              <ChevronDown
                className={cn("h-3.5 w-3.5 text-slate-500 transition-transform", isTripGroupCollapsed && "-rotate-90")}
              />
              <span className="text-slate-900 font-bold text-xs">Company 1 (31)</span>
            </div>
          </div>

          {/* ROW 6: Trips List */}
          {!isTripGroupCollapsed && (
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar divide-y divide-[#DFE3EB]/50 bg-white">
              {[
                {
                  id: "trip-1",
                  name: "Employee transport11",
                  subtext: "Completed 2h 2m ago - 2:15 PM",
                  vehicle: "MH 4D CT 1781 - Car",
                  vehicleDate: "03-01-2022 11:11:13 AM",
                  type: "pickup",
                  status: "completed",
                  visited: 2,
                  skipped: 5,
                  pending: 5,
                  pax: 2,
                },
                {
                  id: "trip-2",
                  name: "Employee transport21",
                  subtext: "Upcoming in 2h 3m - 2:30 PM",
                  vehicle: "MH 4D CT 1781 - Travel",
                  vehicleDate: "03-01-2022 11:11:13 AM",
                  type: "drop",
                  status: "upcoming",
                  visited: 2,
                  skipped: 5,
                  pending: 5,
                  pax: 2,
                },
                {
                  id: "trip-3",
                  name: "Employee transport0025",
                  subtext: "Completed 2h 2m ago - 2:15 PM",
                  vehicle: "MH 4D CT 1781 - Tran",
                  vehicleDate: "03-01-2022 11:11:13 AM",
                  type: "drop",
                  status: "completed",
                  visited: 2,
                  skipped: 5,
                  pending: 5,
                  pax: 2,
                },
                {
                  id: "trip-4",
                  name: "Employee transport678",
                  subtext: "No point visited",
                  vehicle: "MH 4D CT 1781 - Volvo",
                  vehicleDate: "03-01-2022 11:11:13 AM",
                  type: "pickup",
                  status: "failed",
                  visited: 2,
                  skipped: 5,
                  pending: 5,
                  pax: 2,
                },
                {
                  id: "trip-5",
                  name: "Employee transport5477",
                  subtext: "Vehicle did not leave the location",
                  vehicle: "MH 4D CT 1781 - Car",
                  vehicleDate: "03-01-2022 11:11:13 AM",
                  type: "drop",
                  status: "failed",
                  visited: 2,
                  skipped: 5,
                  pending: 5,
                  pax: 2,
                },
              ]
                .filter((t) => {
                  const matchStatus = selectedTripStatusFilter === "all" || t.status === selectedTripStatusFilter;
                  const q = tripSearchQuery.toLowerCase().trim();
                  const matchQ = !q || t.name.toLowerCase().includes(q) || t.vehicle.toLowerCase().includes(q);
                  return matchStatus && matchQ;
                })
                .map((trip) => {
                  const isSelected = selectedTripId === trip.id;
                  return (
                    <div
                      key={trip.id}
                      onClick={() => {
                        setSelectedTripId(trip.id);
                        setSelectedTripDetail({ id: trip.id, name: trip.name });
                        window.dispatchEvent(new CustomEvent("trip-selected", { detail: trip }));
                        toast.info(`Selected ${trip.name}`);
                      }}
                      className={cn(
                        "grid grid-cols-[20px_1fr_120px_76px_22px_22px_22px_22px] px-3 py-2 text-xs items-center gap-1 cursor-pointer transition-colors border-b border-[#DFE3EB]/40 hover:bg-slate-50",
                        isSelected ? "bg-sky-50/90 font-medium" : "bg-white"
                      )}
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={tripsChecked[trip.id] ?? true}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          setTripsChecked((prev) => ({ ...prev, [trip.id]: e.target.checked }));
                        }}
                        className="h-3.5 w-3.5 rounded border-[#DFE3EB] text-[#0089FF] accent-[#0089FF] cursor-pointer"
                      />

                      {/* Trip Name & Subtext with Vertically Centered Status Dot */}
                      <div className="flex items-center gap-2 min-w-0 pr-1">
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full shrink-0 shadow-2xs",
                            trip.status === "running" && "bg-[#008446]",
                            trip.status === "completed" && "bg-[#0089FF]",
                            trip.status === "upcoming" && "bg-[#C46F37]",
                            trip.status === "failed" && "bg-[#C70036]",
                            (!trip.status || trip.status === "nodata") && "bg-[#62748E]"
                          )}
                          title={`Status: ${(trip.status || "upcoming").toUpperCase()}`}
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-900 truncate text-[11.5px] leading-tight">
                            {trip.name}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate mt-0.5 leading-tight">
                            {trip.subtext}
                          </span>
                        </div>
                      </div>

                      {/* Vehicle Name (Blue) & Date with Vertically Centered Status Dot */}
                      <div className="flex items-center gap-1.5 min-w-0 pr-1">
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full shrink-0 shadow-2xs",
                            trip.status === "running" ? "bg-[#008446]" : "bg-[#0089FF]"
                          )}
                          title={`Vehicle: ${trip.vehicle}`}
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-[#0089FF] truncate text-[11px] hover:underline leading-tight">
                            {trip.vehicle}
                          </span>
                          <span className="text-[9.5px] text-slate-400 truncate mt-0.5 leading-tight">
                            {trip.vehicleDate}
                          </span>
                        </div>
                      </div>

                      {/* Trip Type Badge */}
                      <div>
                        {trip.type === "pickup" ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-sky-50 text-[#0089FF] border border-sky-200/80 text-[10px] font-bold tracking-tight">
                            <span className="text-[9px]">➔|</span>
                            <span>Pickup</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-600 border border-purple-200/80 text-[10px] font-bold tracking-tight">
                            <span className="text-[9px]">|➔</span>
                            <span>Drop</span>
                          </span>
                        )}
                      </div>

                      {/* 4 Status Counters */}
                      <div className="flex items-center justify-center font-bold text-[#D97706] text-xs tabular-nums">
                        {trip.visited}
                      </div>
                      <div className="flex items-center justify-center font-bold text-[#DC2626] text-xs tabular-nums">
                        {trip.skipped}
                      </div>
                      <div className="flex items-center justify-center font-bold text-[#0089FF] text-xs tabular-nums">
                        {trip.pending}
                      </div>
                      <div className="flex items-center justify-center font-bold text-[#7C3AED] text-xs tabular-nums">
                        {trip.pax}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: SHUTTLE (From ShuttleTrackingPanel.tsx) ── */}
      {currentTab === "shuttle" && (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white">
          <ShuttleTrackingPanel
            query={searchQuery}
            selectedTrip={selectedShuttleTrip}
            onSelectTrip={setSelectedShuttleTrip}
          />
        </div>
      )}

      {/* ── TAB 4: ADDRESS (From FleetExplorerPanel.tsx) ── */}
      {currentTab === "address" && (
        <div className="flex-1 min-h-0 flex flex-col bg-white overflow-hidden">
          <div className="p-2.5 border-b border-[#DFE3EB] flex items-center gap-2 bg-[#F8FAFC] shrink-0">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search addresses, landmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs bg-white border border-[#DFE3EB] rounded-md focus:outline-none focus:border-[#0089FF]"
              />
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </div>
            <button
              type="button"
              onClick={() => toast.info("Add new address modal")}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-md bg-[#0089FF] text-white hover:bg-[#0070d6] transition-colors shadow-2xs cursor-pointer shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar divide-y divide-[#DFE3EB]">
            {MOCK_ADDRESS_GROUPS.map((g) => (
              <div key={g.group} className="flex flex-col">
                <div className="px-3 py-1.5 bg-[#F1F5F9] font-bold text-xs text-slate-800 flex items-center justify-between">
                  <span>{g.group}</span>
                  <span className="text-[11px] text-slate-500 font-mono">[{g.subgroups[0].addresses.length}]</span>
                </div>
                <div className="divide-y divide-[#DFE3EB]/60">
                  {g.subgroups[0].addresses
                    .filter((a) => !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((a) => (
                      <div
                        key={a.id}
                        onClick={() => toast.info(`Address ${a.name} centered on map`)}
                        className="px-3 py-2 flex items-center justify-between text-xs hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <input
                            type="checkbox"
                            checked={addressChecked[a.id] !== false}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setAddressChecked((prev) => ({ ...prev, [a.id]: checked }));
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="h-3.5 w-3.5 rounded border-[#DFE3EB] text-[#0089FF]"
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-slate-800 truncate text-[11.5px]">{a.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{a.lat.toFixed(4)}, {a.lng.toFixed(4)}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {a.category}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 5: GEOFENCE (1:1 with live production media_1795434917075_5f3f3041.jpg) ── */}
      {currentTab === "geofence" && (
        <div className="flex-1 min-h-0 flex flex-col bg-white overflow-hidden">
          {/* Row 2: Search & Action Controls Toolbar (1:1 with live production FleetExplorerPanel line 2814) */}
          <div className="flex items-center gap-1.5 border-b border-[#DFE3EB] p-2 bg-white shrink-0">
            {/* 1. Select All Checkbox Box */}
            <label
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white cursor-pointer shrink-0 hover:bg-sky-50 hover:border-[#0089FF]/50 transition-all shadow-2xs active:scale-90"
              title="Select / Deselect all geofences on map"
            >
              <input
                type="checkbox"
                checked={liveGeofences.length > 0 && liveGeofences.every((g) => g.checked)}
                ref={(el) => {
                  if (el) {
                    const allChecked = liveGeofences.every((g) => g.checked);
                    const someChecked = liveGeofences.some((g) => g.checked);
                    el.indeterminate = someChecked && !allChecked;
                  }
                }}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setLiveGeofences((prev) => prev.map((g) => ({ ...g, checked })));
                }}
                className="h-[13px] w-[13px] rounded border-slate-300 text-[#0089FF] accent-[#0089FF] cursor-pointer"
              />
            </label>

            {/* 2. Search Input (Standard h-8 Height with border & clear button) */}
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                placeholder="Search by Geofence Name, Zone, Group, etc."
                value={geofenceSearchQuery}
                onChange={(e) => setGeofenceSearchQuery(e.target.value)}
                className="h-8 w-full rounded-md border border-slate-200 bg-slate-50/60 pl-3 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF] focus:bg-white transition-colors font-sans"
              />
              {geofenceSearchQuery ? (
                <button
                  type="button"
                  onClick={() => setGeofenceSearchQuery("")}
                  className="absolute right-1.5 p-0.5 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <Search className="absolute right-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              )}
            </div>

            {/* 3. Action Toolbar Icons (With standard h-8 w-8 boxes, 1:1 with FleetExplorerPanel) */}
            <div className="flex items-center gap-1.5 shrink-0 text-slate-600">
              {/* Reload Button */}
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => {
                        toast.success("Geofences reloaded successfully");
                      }}
                      className="group relative h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-[#0089FF] hover:bg-sky-50 hover:border-[#0089FF]/50 transition-all duration-200 shadow-2xs cursor-pointer active:scale-90"
                      title="Reload / Refresh Geofence List"
                    >
                      <RotateCw className="h-3.5 w-3.5 stroke-[2.2] transition-transform duration-500 ease-out group-hover:rotate-180" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="font-semibold text-xs bg-slate-900 text-white border-slate-800">
                    Reload / Refresh Geofence List
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Add Geofence Button */}
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => {
                        toast.info("Opening Add Geofence modal...");
                      }}
                      className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-[#0089FF] hover:bg-sky-50 hover:border-[#0089FF]/50 transition-all shadow-2xs cursor-pointer active:scale-90"
                      title="Add Geofence"
                    >
                      <PlusCircle className="h-3.5 w-3.5 stroke-[2.2]" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="font-semibold text-xs bg-slate-900 text-white border-slate-800">
                    Add Geofence
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Filter Button */}
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => {
                        toast.info("Opening Geofence Filter...");
                      }}
                      className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-[#0089FF] hover:bg-sky-50 hover:border-[#0089FF]/50 transition-all shadow-2xs cursor-pointer active:scale-90"
                      title="Geofence Filter"
                    >
                      <Filter className="h-3.5 w-3.5 stroke-[2.2]" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="font-semibold text-xs bg-slate-900 text-white border-slate-800">
                    Geofence Filter
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Main Geofences Tree List */}
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar divide-y divide-[#DFE3EB]/40 bg-white select-none">
            {/* Top Level Branch Header: Ha Company [11] */}
            <div className="flex items-center justify-between pl-3 pr-3 py-1.5 bg-[#F8FAFC] border-b border-[#DFE3EB]">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={liveGeofences.length > 0 && liveGeofences.every((g) => g.checked)}
                  ref={(el) => {
                    if (el) {
                      const allChecked = liveGeofences.every((g) => g.checked);
                      const someChecked = liveGeofences.some((g) => g.checked);
                      el.indeterminate = someChecked && !allChecked;
                    }
                  }}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setLiveGeofences((prev) => prev.map((g) => ({ ...g, checked })));
                  }}
                  className="h-3.5 w-3.5 rounded border-[#DFE3EB] text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                />
                <button
                  type="button"
                  onClick={() => setIsHaCompanyCollapsed(!isHaCompanyCollapsed)}
                  className="flex items-center gap-1 text-left text-xs font-bold text-slate-800 hover:text-[#0089FF] cursor-pointer truncate"
                >
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-500 transition-transform duration-150",
                      isHaCompanyCollapsed && "-rotate-90"
                    )}
                  />
                  <span>Ha Company</span>
                </button>
              </div>
              <span className="text-[11px] font-mono text-slate-400 font-semibold">[11]</span>
            </div>

            {/* Geofence Items under Ha Company (1:1 with media_1795434917075_5f3f3041.jpg) */}
            {!isHaCompanyCollapsed && (
              <div className="divide-y divide-[#DFE3EB]/40">
                {liveGeofences
                  .filter((geo) => {
                    if (!geofenceSearchQuery.trim()) return true;
                    const q = geofenceSearchQuery.toLowerCase().trim();
                    return geo.name.toLowerCase().includes(q) || geo.category.toLowerCase().includes(q);
                  })
                  .map((geo) => {
                    const isChecked = geo.checked;

                    return (
                      <div
                        key={geo.id}
                        className={cn(
                          "flex items-center justify-between px-3 py-1.5 text-xs transition-colors hover:bg-slate-50 select-none min-h-[34px]",
                          isChecked && "bg-sky-50/40"
                        )}
                      >
                        {/* Left: Checkbox + Status Dot + Name */}
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setLiveGeofences((prev) =>
                                prev.map((item) => (item.id === geo.id ? { ...item, checked } : item))
                              );
                            }}
                            className="h-3.5 w-3.5 rounded border-[#DFE3EB] text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                          />

                          <span
                            className={cn(
                              "h-2 w-2 rounded-full shrink-0 transition-all",
                              isChecked
                                ? "bg-[#0089FF] ring-2 ring-sky-500/20 shadow-xs"
                                : "border border-slate-400 bg-transparent"
                            )}
                          />

                          <span
                            className={cn(
                              "truncate text-xs transition-colors cursor-pointer",
                              isChecked ? "text-[#0089FF] font-bold" : "text-slate-700 font-medium"
                            )}
                            title={geo.name}
                            onClick={() => {
                              setLiveGeofences((prev) =>
                                prev.map((item) => (item.id === geo.id ? { ...item, checked: !isChecked } : item))
                              );
                              toast.info(`Focusing map on geofence "${geo.name}"`);
                            }}
                          >
                            {geo.name}
                          </span>
                        </div>

                        {/* Right Actions: Locate Pin, Edit Pencil, Delete Trash */}
                        <div className="flex items-center gap-2 shrink-0 text-slate-400">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info(`Focusing map on geofence "${geo.name}"`);
                            }}
                            className="p-1 hover:text-[#0089FF] hover:bg-sky-50 rounded transition-colors cursor-pointer"
                            title="Locate Geofence on Map"
                          >
                            <MapPin className="h-3.5 w-3.5 stroke-[2]" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.success(`Editing geofence configuration for "${geo.name}"`);
                            }}
                            className="p-1 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                            title="Edit Geofence"
                          >
                            <Edit3 className="h-3.5 w-3.5 stroke-[2]" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLiveGeofences((prev) => prev.filter((item) => item.id !== geo.id));
                              toast.error(`Geofence "${geo.name}" deleted`);
                            }}
                            className="p-1 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Delete Geofence"
                          >
                            <Trash2 className="h-3.5 w-3.5 stroke-[2]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Clean Export Action Footer Bar (1:1 with media_1795434917075_5f3f3041.jpg) */}
          <div className="shrink-0 px-3 py-2 bg-[#F8FAFC] border-t border-[#DFE3EB] flex items-center justify-between gap-2 select-none rounded-b-2xl">
            <div className="text-xs font-bold text-slate-700">
              Export
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  toast.success("Exporting Geofences to KML...", {
                    description: "19 geofence spatial zone files generated.",
                  })
                }
                className="h-7 px-2.5 rounded-md bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white border border-purple-200 hover:border-purple-600 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95 group"
              >
                <Compass className="h-3.5 w-3.5 text-purple-600 group-hover:text-white transition-colors" />
                <span>KML</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  toast.success("Exporting Geofences to XLS (.xlsx)...", {
                    description: "19 geofences exported to XLS.",
                  })
                }
                className="h-7 px-2.5 rounded-md bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-600 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95 group"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 group-hover:text-white transition-colors" />
                <span>XLS</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  toast.success("Exporting Geofences to PDF...", {
                    description: "Printable geofence document report generated.",
                  })
                }
                className="h-7 px-2.5 rounded-md bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 hover:border-rose-600 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95 group"
              >
                <FileText className="h-3.5 w-3.5 text-rose-600 group-hover:text-white transition-colors" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </aside>
  );
}
