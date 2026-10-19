import {
  Activity,
  AlertTriangle,
  ArrowUpDown,
  Bookmark,
  Briefcase,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleDot,
  Clock,
  Compass,
  Copy,
  Download,
  Droplet,
  Eye,
  FileText,
  Filter,
  Flame,
  Gauge,
  GitCompare,
  GripHorizontal,
  GripVertical,
  HelpCircle,
  Info,
  Layers,
  ListFilter,
  MapPin,
  Maximize2,
  Minimize2,
  Minus,
  Navigation,
  Pause,
  Play,
  Plus,
  Power,
  Printer,
  RotateCcw,
  Route,
  Search,
  Share2,
  ShieldAlert,
  SlidersHorizontal,
  SquarePen,
  Target,
  Thermometer,
  Timer,
  TrafficCone,
  Truck,
  User,
  Video,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { type FleetObject } from "@/data/fleet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from "recharts";
import { CustomDateRangeModal } from "./CustomDateRangeModal";

interface RoutePlaybackBarProps {
  vehicle: FleetObject;
  allVehicles?: FleetObject[];
  timeframe?: string;
  customDateRange?: string | null;
  onSelectVehicle?: (vehicle: FleetObject) => void;
  onClose: () => void;
  className?: string;
}

// 5,000 Vehicles Dataset Generator for High-Performance Search Test
const generate5000Vehicles = (initialList: FleetObject[]): FleetObject[] => {
  if (initialList.length >= 5000) return initialList;
  const branches = ["Company", "Indonesia", "Thailand", "Valsad", "Itriangle", "Ruptela", "Shivam Test"];
  const statuses = ["running", "idle", "stopped", "nodata"] as const;
  const models = ["Teltonika FMB920", "Ruptela HCV5", "Meitrack T333", "Concox AT4", "Queclink GV300"];

  const extended: FleetObject[] = [...initialList];
  const targetCount = 5000;
  for (let i = initialList.length + 1; i <= targetCount; i++) {
    const status = statuses[i % 4];
    const branch = branches[i % branches.length];
    const model = models[i % models.length];
    extended.push({
      id: `veh-gen-${i}`,
      name: `TRK-${1000 + i} (${model.split(" ")[0]})`,
      branch: branch,
      imei: `86420${100000000 + i}`,
      status: status,
      speed: status === "running" ? 35 + (i % 65) : 0,
      address: `Logistics Hub Sector ${1 + (i % 50)}, Area ${i % 12}`,
      lastUpdated: "Just now",
      ignition: status === "running" || status === "idle",
      gps: true,
      driver: `Driver ${1 + (i % 250)}`,
      plateNumber: `GJ ${(i % 30) + 1} XX ${1000 + (i % 8999)}`,
      battery: 80 + (i % 20),
      odometer: 142000 + i * 15,
      currentTrip: 210.5 + (i % 50),
    });
  }
  return extended;
};

// Mock trips matching reference image 1:1
const MOCK_TRIPS = [
  {
    id: "trip-1",
    startTime: "30/09/2026 10:17:17 AM",
    startLocation: "At HP Address 120",
    endTime: "30/09/2026 10:18:47 AM",
    endLocation: "At HP Address 153",
    running: "02:58",
    distance: "22.11",
    avgSpeed: "7",
    maxSpeed: "150",
    alerts: 35,
    driver: "HP Driver 1",
    status: "Unclassified",
  },
  {
    id: "trip-2",
    startTime: "30/09/2026 10:25:17 AM",
    startLocation: "At Point 3",
    endTime: "30/09/2026 11:20:07 AM",
    endLocation: "At HP Address 95",
    running: "00:03",
    distance: "0.37",
    avgSpeed: "8",
    maxSpeed: "119",
    alerts: 4,
    driver: "HP Driver 1",
    status: "Unclassified",
  },
  {
    id: "trip-3",
    startTime: "30/09/2026 11:38:57 AM",
    startLocation: "At HP Address 95",
    endTime: "30/09/2026 01:35:27 PM",
    endLocation: "At HP Address 1",
    running: "01:59",
    distance: "15.4",
    avgSpeed: "8",
    maxSpeed: "150",
    alerts: 15,
    driver: "HP Driver 1",
    status: "Unclassified",
  },
];

const MOCK_DATA_POINTS_REFERENCE = [
  { id: "dp-1", status: "Running", time: "30/09/2026 10:30:43 AM", lat: "20.61007", lng: "72.89223", speed: 148, distance: "0", address: "At HP Address 135", driver: "Patch 210 Driver 1", battery: "0" },
  { id: "dp-2", status: "Running", time: "30/09/2026 10:30:53 AM", lat: "20.60872", lng: "72.89254", speed: 150, distance: "0.15", address: "At HP Address 100", driver: "Patch 210 Driver 1", battery: "0" },
  { id: "dp-3", status: "Running", time: "30/09/2026 10:31:03 AM", lat: "20.60854", lng: "72.88257", speed: 147, distance: "0.17", address: "At HP Address 100", driver: "Patch 210 Driver 1", battery: "0" },
  { id: "dp-4", status: "Running", time: "30/09/2026 10:31:13 AM", lat: "20.60777", lng: "72.89276", speed: 145, distance: "0.26", address: "At HP Address 100", driver: "Patch 210 Driver 1", battery: "0" },
  { id: "dp-5", status: "Running", time: "30/09/2026 10:31:23 AM", lat: "20.60661", lng: "72.89300", speed: 149, distance: "0.39", address: "At HP Address 99", driver: "Patch 210 Driver 1", battery: "0" },
  { id: "dp-6", status: "Running", time: "30/09/2026 10:31:33 AM", lat: "20.60511", lng: "72.89320", speed: 150, distance: "0.45", address: "At HP Address 99", driver: "Patch 210 Driver 1", battery: "0" },
];

const MOCK_EVENTS_REFERENCE = [
  { id: "ev-1", event: "Alert 1 - Harsh Acceleration 1", time: "30/09/2026 10:30:43 AM", duration: "00:00:00", address: "At HP Address 135", driver: "Patch 210 Driver 1" },
  { id: "ev-2", event: "Alert 2 - Over Speed 1", time: "30/09/2026 10:30:53 AM", duration: "00:00:00", address: "At HP Address 100", driver: "Patch 210 Driver 1" },
  { id: "ev-3", event: "Stoppage 1", time: "30/09/2026 10:32:03 AM", duration: "00:07:20", address: "At HP Address 99", driver: "Patch 210 Driver 1" },
  { id: "ev-4", event: "Alert 3 - Harsh Acceleration 2", time: "30/09/2026 10:39:23 AM", duration: "00:00:00", address: "At HP Address 99", driver: "Patch 210 Driver 1" },
  { id: "ev-5", event: "Alert 4 - Over Speed 2", time: "30/09/2026 10:39:33 AM", duration: "00:00:00", address: "At HP Address 99", driver: "Patch 210 Driver 1" },
];

const MOCK_SPEED_CHART_DATA = [
  { time: "11:00", speed: 148 },
  { time: "11:15", speed: 120 },
  { time: "11:30", speed: 145 },
  { time: "11:45", speed: 149 },
  { time: "12:00", speed: 90 },
  { time: "12:15", speed: 75 },
  { time: "12:30", speed: 110 },
  { time: "12:45", speed: 45 },
  { time: "13:00", speed: 15 },
  { time: "13:30", speed: 40 },
  { time: "14:00", speed: 50 },
  { time: "14:30", speed: 30 },
  { time: "15:00", speed: 65 },
  { time: "15:30", speed: 130 },
  { time: "16:00", speed: 100 },
];

const MOCK_LOAD_CHART_DATA = [
  { time: "16:00", load: 2000 },
  { time: "16:30", load: 9500 },
  { time: "17:00", load: 4200 },
  { time: "17:30", load: 8800 },
  { time: "18:00", load: 11000 },
  { time: "18:30", load: 7400 },
  { time: "19:00", load: 9200 },
  { time: "19:30", load: 6100 },
  { time: "20:00", load: 10500 },
  { time: "20:30", load: 8300 },
  { time: "21:00", load: 11800 },
  { time: "21:30", load: 9000 },
  { time: "22:00", load: 7800 },
];

const MOCK_FUEL_CHART_DATA = [
  { time: "11:00", level: 95 },
  { time: "12:00", level: 88 },
  { time: "13:00", level: 76 },
  { time: "14:00", level: 68 },
  { time: "15:00", level: 98 },
  { time: "16:00", level: 90 },
];

const MOCK_TEMP_CHART_DATA = [
  { time: "11:00", sensor1: 4.2, sensor2: -18.5 },
  { time: "12:00", sensor1: 4.8, sensor2: -18.0 },
  { time: "13:00", sensor1: 5.2, sensor2: -17.5 },
  { time: "14:00", sensor1: 4.5, sensor2: -18.2 },
  { time: "15:00", sensor1: 4.0, sensor2: -19.0 },
  { time: "16:00", sensor1: 4.1, sensor2: -18.8 },
];

const MOCK_CAM_LOGS = [
  { id: "cm-1", camName: "CH-1 (Road Facing)", event: "ADAS Distance Warning", time: "30/09/2026 10:17:45 AM", status: "Captured Snapshot" },
  { id: "cm-2", camName: "CH-2 (Driver Cabin)", event: "DMS Fatigue Alert", time: "30/09/2026 10:25:12 AM", status: "Recorded 10s Clip" },
  { id: "cm-3", camName: "CH-3 (Cargo Door)", event: "Door Unlocked Event", time: "30/09/2026 11:20:05 AM", status: "Snapshot Uploaded" },
];

export function RoutePlaybackBar({
  vehicle,
  allVehicles = [],
  timeframe = "Today",
  customDateRange = null,
  onSelectVehicle,
  onClose,
  className,
}: RoutePlaybackBarProps) {
  // Current Active Vehicle
  const [currentVehicle, setCurrentVehicle] = useState<FleetObject>(vehicle);

  // Custom Date Range State
  const [currentCustomRange, setCurrentCustomRange] = useState<string | null>(customDateRange || null);
  const [isCustomDateModalOpen, setIsCustomDateModalOpen] = useState(false);

  useEffect(() => {
    if (customDateRange) {
      setCurrentCustomRange(customDateRange);
    }
  }, [customDateRange]);

  useEffect(() => {
    setCurrentVehicle(vehicle);
  }, [vehicle]);

  // 5,000+ Vehicle Selector State
  const [isVehicleSelectorOpen, setIsVehicleSelectorOpen] = useState(false);
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState<"all" | "running" | "idle" | "stopped">("all");
  const [vehicleGroupFilter, setVehicleGroupFilter] = useState<string>("all");
  const selectorRef = useRef<HTMLDivElement>(null);

  // Full 5,000 vehicles list memoized
  const fullVehiclesList = useMemo(() => {
    return generate5000Vehicles(allVehicles.length > 0 ? allVehicles : [vehicle]);
  }, [allVehicles, vehicle]);

  // Real-time filtered vehicles list
  const filteredVehicles = useMemo(() => {
    const q = vehicleSearch.trim().toLowerCase();
    return fullVehiclesList.filter((v) => {
      const matchesStatus = vehicleStatusFilter === "all" || v.status === vehicleStatusFilter;
      const matchesGroup = vehicleGroupFilter === "all" || v.branch === vehicleGroupFilter;
      const matchesQuery =
        q === "" ||
        v.name.toLowerCase().includes(q) ||
        v.imei.toLowerCase().includes(q) ||
        v.branch.toLowerCase().includes(q) ||
        (v.plateNumber && v.plateNumber.toLowerCase().includes(q)) ||
        (v.driver && v.driver.toLowerCase().includes(q));

      return matchesStatus && matchesGroup && matchesQuery;
    });
  }, [fullVehiclesList, vehicleSearch, vehicleStatusFilter, vehicleGroupFilter]);

  // Limit DOM rendering to top 50 items for 60fps scrolling
  const visibleVehicles = useMemo(() => {
    return filteredVehicles.slice(0, 50);
  }, [filteredVehicles]);

  // Close vehicle selector popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        setIsVehicleSelectorOpen(false);
      }
    };
    if (isVehicleSelectorOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVehicleSelectorOpen]);

  // Handle Switching Active Vehicle
  const handleSelectVehicleItem = (v: FleetObject) => {
    setCurrentVehicle(v);
    if (onSelectVehicle) {
      onSelectVehicle(v);
    }
    setProgress(0);
    setIsPlaying(true);
    setIsVehicleSelectorOpen(false);
    toast.success(`Playback switched to ${v.name}`, {
      description: `IMEI: ${v.imei} · Branch: ${v.branch}`,
    });
  };

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35); // 0 to 100%
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 2 | 5 | 6 | 10>(6);
  const [isMuted, setIsMuted] = useState(false);
  const [isFollowVehicle, setIsFollowVehicle] = useState(true);

  // Panels visibility & height state
  const [showSettings, setShowSettings] = useState(false);
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);
  const [tableHeight, setTableHeight] = useState<number>(220);
  const [activeBottomTab, setActiveBottomTab] = useState<string>("trips");

  const isResizingTableRef = useRef(false);
  const resizeStartYRef = useRef(0);
  const resizeStartHeightRef = useRef(220);

  const handleStartResizeTable = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingTableRef.current = true;
    resizeStartYRef.current = e.clientY;
    resizeStartHeightRef.current = tableHeight;

    const handleMouseMove = (moveEvt: MouseEvent) => {
      if (!isResizingTableRef.current) return;
      const deltaY = resizeStartYRef.current - moveEvt.clientY;
      const newHeight = Math.max(120, Math.min(window.innerHeight - 150, resizeStartHeightRef.current + deltaY));
      setTableHeight(newHeight);
      setIsTableCollapsed(false);
    };

    const handleMouseUp = () => {
      isResizingTableRef.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Playback settings state
  const [tripCalcEnabled, setTripCalcEnabled] = useState(true);
  const [tripCalcType, setTripCalcType] = useState<"Ignition" | "Motion">("Ignition");
  
  const [stoppageEnabled, setStoppageEnabled] = useState(true);
  const [stoppageMin, setStoppageMin] = useState("0");

  const [idleEnabled, setIdleEnabled] = useState(true);
  const [idleMin, setIdleMin] = useState("0");

  const [speedEnabled, setSpeedEnabled] = useState(false);
  const [speedLimit, setSpeedLimit] = useState("60 km/hr");

  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [alertsFilter, setAlertsFilter] = useState("All");

  const [inactiveEnabled, setInactiveEnabled] = useState(false);
  const [fuelEnabled, setFuelEnabled] = useState(false);
  const [routeEnabled, setRouteEnabled] = useState(true);
  const [emergencyLightsEnabled, setEmergencyLightsEnabled] = useState(false);
  const [tollInfoEnabled, setTollInfoEnabled] = useState(false);
  const [opalEventEnabled, setOpalEventEnabled] = useState(false);
  const [dataPointsEnabled, setDataPointsEnabled] = useState(false);

  // Dynamic Route Path Coordinates matching Reference System (Boisar to Daman coastline)
  const routePoints = useMemo(() => [
    { x: 420, y: 640 }, // Start (Palghar / Boisar)
    { x: 425, y: 550 }, // Stoppage 2
    { x: 423, y: 460 }, // Umargam
    { x: 426, y: 410 }, // Alert 18
    { x: 425, y: 350 }, // Alert 16 / Vapi
    { x: 427, y: 280 }, // Alert 14
    { x: 430, y: 220 }, // Alert 11
    { x: 435, y: 150 }, // Stoppage 1 (Daman)
  ], []);

  // Compute active vehicle position along route based on progress percentage (0..100)
  const activePos = useMemo(() => {
    const totalSegs = routePoints.length - 1;
    const scaledProgress = (progress / 100) * totalSegs;
    const index = Math.min(Math.floor(scaledProgress), totalSegs - 1);
    const segT = scaledProgress - index;
    const p1 = routePoints[index];
    const p2 = routePoints[index + 1] || p1;
    return {
      x: p1.x + (p2.x - p1.x) * segT,
      y: p1.y + (p2.y - p1.y) * segT,
    };
  }, [progress, routePoints]);

  // Drag State for Playback Settings Panel
  const [settingsPos, setSettingsPos] = useState<{ x: number; y: number } | null>(null);
  const isDraggingSettingsRef = useRef(false);
  const dragStartOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const settingsPanelRef = useRef<HTMLDivElement>(null);

  // Streaming App Speed Selector Popover State
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const speedMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideSpeed = (e: MouseEvent) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(e.target as Node)) {
        setIsSpeedMenuOpen(false);
      }
    };
    if (isSpeedMenuOpen) {
      document.addEventListener("mousedown", handleClickOutsideSpeed);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSpeed);
    };
  }, [isSpeedMenuOpen]);

  const handleSettingsHeaderMouseDown = (e: React.MouseEvent) => {
    const targetEl = e.target as HTMLElement;
    if (targetEl.closest("button") || targetEl.closest("input") || targetEl.closest("select")) {
      return;
    }

    isDraggingSettingsRef.current = true;

    if (settingsPanelRef.current) {
      const rect = settingsPanelRef.current.getBoundingClientRect();
      dragStartOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }

    const handleMouseMove = (moveEvt: MouseEvent) => {
      if (!isDraggingSettingsRef.current) return;
      const newX = Math.max(10, Math.min(window.innerWidth - 300, moveEvt.clientX - dragStartOffsetRef.current.x));
      const newY = Math.max(10, Math.min(window.innerHeight - 300, moveEvt.clientY - dragStartOffsetRef.current.y));
      setSettingsPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      isDraggingSettingsRef.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Timeframe date range text
  const dateRangeText = useMemo(() => {
    if (currentCustomRange) {
      return currentCustomRange;
    }
    switch (timeframe) {
      case "Today":
        return "30/09/2026 00:00:00 AM To 30/09/2026 11:59:59 PM";
      case "Last 24 Hour":
        return "29/09/2026 01:41 PM To 30/09/2026 01:41 PM";
      case "Yesterday":
        return "29/09/2026 00:00:00 AM To 29/09/2026 11:59:59 PM";
      case "This Week":
        return "24/09/2026 00:00:00 AM To 30/09/2026 11:59:59 PM";
      case "Last Week":
        return "17/09/2026 00:00:00 AM To 23/09/2026 11:59:59 PM";
      case "This Month":
        return "01/09/2026 00:00:00 AM To 30/09/2026 11:59:59 PM";
      case "Last Month":
        return "01/08/2026 00:00:00 AM To 31/08/2026 11:59:59 PM";
      default:
        return "29/09/2026 01:41 PM To 30/09/2026 01:41 PM";
    }
  }, [timeframe, currentCustomRange]);

  // Playback timer simulation
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1 * (speedMultiplier / 2)));
      }, 300);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speedMultiplier]);

  return (
    <div className="absolute inset-0 z-30 pointer-events-none select-none overflow-hidden">
      {/* ==========================================
          0. INTERACTIVE ROUTE PATH & MAP MARKERS OVERLAY
          (Dynamically driven by Playback Settings checkboxes matching Reference System 1:1)
      ========================================== */}
      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 1000 800" preserveAspectRatio="none">
        {/* Polyline Route Line Path */}
        {routeEnabled && (
          <g>
            {/* Main Blue Route Line */}
            <path
              d="M 420 640 L 425 550 L 423 460 L 426 410 L 425 350 L 427 280 L 430 220 L 435 150"
              fill="none"
              stroke="#0089FF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-md"
            />

            {/* Over Speed Section Highlight (Red Line when Speed checkbox is ON or speed > threshold) */}
            {speedEnabled && (
              <path
                d="M 423 460 L 426 410 L 425 350 L 427 280 L 430 220"
                fill="none"
                stroke="#EF4444"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse drop-shadow-md"
              />
            )}
          </g>
        )}

        {/* Data Points Layer (Dots along route path) */}
        {dataPointsEnabled && (
          <g>
            {[
              { x: 420, y: 640 }, { x: 422, y: 600 }, { x: 425, y: 550 },
              { x: 424, y: 500 }, { x: 423, y: 460 }, { x: 425, y: 435 },
              { x: 426, y: 410 }, { x: 425, y: 380 }, { x: 425, y: 350 },
              { x: 426, y: 315 }, { x: 427, y: 280 }, { x: 428, y: 250 },
              { x: 430, y: 220 }, { x: 432, y: 185 }, { x: 435, y: 150 },
            ].map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
            ))}
          </g>
        )}
      </svg>

      {/* HTML Markers & Callout Layer Over Map */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* 1. Trip Start / End Flag Markers */}
        {tripCalcEnabled && (
          <>
            <div style={{ left: "42.0%", top: "80.0%" }} className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex items-center gap-1 bg-emerald-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded shadow border border-white">
              <MapPin className="h-3 w-3" />
              <span>Start (120)</span>
            </div>
            <div style={{ left: "43.5%", top: "18.75%" }} className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex items-center gap-1 bg-rose-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded shadow border border-white">
              <MapPin className="h-3 w-3" />
              <span>End (153)</span>
            </div>
          </>
        )}

        {/* 2. Stoppage Markers (Green Circles matching Reference Image) */}
        {stoppageEnabled && (
          <>
            <div style={{ left: "43.5%", top: "18.75%" }} className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex items-center gap-1 bg-emerald-500 text-white font-black text-[11px] px-2 py-0.5 rounded-full shadow-lg border-2 border-white animate-bounce">
              <span className="h-4 w-4 rounded-full bg-white text-emerald-600 flex items-center justify-center font-mono font-extrabold text-[10px]">1</span>
              <span>07m 20s</span>
            </div>
            <div style={{ left: "42.5%", top: "68.75%" }} className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex items-center gap-1 bg-emerald-500 text-white font-black text-[11px] px-2 py-0.5 rounded-full shadow-lg border-2 border-white">
              <span className="h-4 w-4 rounded-full bg-white text-emerald-600 flex items-center justify-center font-mono font-extrabold text-[10px]">2</span>
              <span>14m 10s</span>
            </div>
          </>
        )}

        {/* 3. Idle Markers (Yellow Circles matching Reference Image) */}
        {idleEnabled && (
          <div style={{ left: "42.3%", top: "57.5%" }} className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex items-center gap-1 bg-amber-500 text-white font-black text-[11px] px-2 py-0.5 rounded-full shadow-lg border-2 border-white">
            <span className="h-4 w-4 rounded-full bg-white text-amber-600 flex items-center justify-center font-mono font-extrabold text-[10px]">3</span>
            <span>04m 15s</span>
          </div>
        )}

        {/* 4. Alert Markers (Red Triangles matching Reference Image 11, 13, 14, 16, 18, 19) */}
        {(alertsEnabled || speedEnabled) && (
          <>
            {[
              { id: "19", top: "51.25%", left: "42.6%" },
              { id: "18", top: "48.75%", left: "42.5%" },
              { id: "16", top: "43.75%", left: "42.5%" },
              { id: "14", top: "35.00%", left: "42.7%" },
              { id: "13", top: "31.25%", left: "42.8%" },
              { id: "11", top: "27.50%", left: "43.0%" },
            ].map((al) => (
              <div key={al.id} style={{ left: al.left, top: al.top }} className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex items-center justify-center">
                <div className="h-5 w-5 bg-rose-600 text-white rounded-md flex items-center justify-center font-mono font-black text-[10px] shadow-md border-2 border-white rotate-45">
                  <span className="-rotate-45">{al.id}</span>
                </div>
              </div>
            ))}
          </>
        )}

        {/* 5. Fuel Refill Marker */}
        {fuelEnabled && (
          <div style={{ left: "42.5%", top: "47.5%" }} className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md border border-white">
            <Droplet className="h-3 w-3 fill-current" />
            <span>Fuel Fill 45L</span>
          </div>
        )}

        {/* 6. Toll Information Marker */}
        {tollInfoEnabled && (
          <div style={{ left: "42.7%", top: "33.0%" }} className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex items-center gap-1 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md border border-white">
            <FileText className="h-3 w-3" />
            <span>Toll Plaza</span>
          </div>
        )}

        {/* 7. Inactive Marker */}
        {inactiveEnabled && (
          <div style={{ left: "43.5%", top: "15.0%" }} className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex items-center gap-1 bg-slate-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md border border-white">
            <Power className="h-3 w-3" />
            <span>InActive</span>
          </div>
        )}

        {/* 8. Emergency Lights Marker */}
        {emergencyLightsEnabled && (
          <div style={{ left: "42.6%", top: "41.0%" }} className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md border border-white">
            <Zap className="h-3 w-3 fill-current" />
            <span>Emergency</span>
          </div>
        )}

        {/* 9. Opal Event Marker */}
        {opalEventEnabled && (
          <div style={{ left: "42.3%", top: "54.0%" }} className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex items-center gap-1 bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md border border-white">
            <Activity className="h-3 w-3" />
            <span>Opal Event</span>
          </div>
        )}
      </div>

      {/* ==========================================
          1. TOP FLOATING NAVIGATION HEADER BAR
      ========================================== */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 pointer-events-auto max-w-[95vw]">
        <div className="flex items-center gap-2 p-1.5 rounded-full border border-[#DFE3EB] dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl text-xs font-semibold text-slate-800 dark:text-slate-100">
          
          {/* Interactive 5,000+ Vehicle Selector Badge Dropdown */}
          <div className="relative" ref={selectorRef}>
            <button
              type="button"
              onClick={() => setIsVehicleSelectorOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-2.5 h-7 rounded-full bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 text-[#0089FF] hover:bg-sky-100 dark:hover:bg-sky-900/80 transition-all cursor-pointer active:scale-95"
              title="Click to search & select from 5,000+ vehicles"
            >
              <Truck className="h-3.5 w-3.5 stroke-[2.2] shrink-0" />
              <span className="font-bold text-xs whitespace-nowrap max-w-[150px] truncate">
                {currentVehicle.name}
              </span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200 shrink-0",
                  isVehicleSelectorOpen ? "rotate-180" : ""
                )}
              />
            </button>

            {/* 5,000+ Vehicle High-Performance Search & Select Popover */}
            {isVehicleSelectorOpen && (
              <div className="absolute top-full left-0 mt-2 w-84 rounded-xl border border-[#DFE3EB] dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl p-2.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                {/* Popover Title & Total Count */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100">
                    <Truck className="h-3.5 w-3.5 text-[#0089FF]" />
                    <span>Select Vehicle</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#0089FF] bg-sky-50 dark:bg-sky-950 px-1.5 py-0.5 rounded border border-sky-100 dark:border-sky-800">
                    {fullVehiclesList.length.toLocaleString()} Vehicles
                  </span>
                </div>

                {/* Real-time Search Input */}
                <div className="relative flex items-center mb-2">
                  <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={vehicleSearch}
                    onChange={(e) => setVehicleSearch(e.target.value)}
                    placeholder="Search 5,000+ vehicles by name, IMEI..."
                    className="w-full h-8 pl-8 pr-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0089FF]"
                    autoFocus
                  />
                  {vehicleSearch && (
                    <button
                      type="button"
                      onClick={() => setVehicleSearch("")}
                      className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Status Segment Filter Pills */}
                <div className="grid grid-cols-4 gap-1 mb-2 select-none">
                  {(["all", "running", "idle", "stopped"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setVehicleStatusFilter(st)}
                      className={cn(
                        "py-1 px-1 rounded-md text-[10px] font-bold capitalize transition-all cursor-pointer text-center",
                        vehicleStatusFilter === st
                          ? "bg-[#0089FF] text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                      )}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* Group Dropdown Filter */}
                <div className="relative flex items-center mb-2">
                  <Layers className="absolute left-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <select
                    value={vehicleGroupFilter}
                    onChange={(e) => setVehicleGroupFilter(e.target.value)}
                    className="w-full h-8 pl-8 pr-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0089FF] cursor-pointer appearance-none"
                  >
                    <option value="all">Group: All Groups</option>
                    <option value="Company">Group: Company</option>
                    <option value="Indonesia">Group: Indonesia</option>
                    <option value="Thailand">Group: Thailand</option>
                    <option value="Valsad">Group: Valsad</option>
                    <option value="Itriangle">Group: Itriangle</option>
                    <option value="Ruptela">Group: Ruptela</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>

                {/* High-Performance Vehicle Scroll List (Max 50 rendered items for 60fps) */}
                <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 pr-1 scrollbar-thin">
                  {visibleVehicles.length > 0 ? (
                    visibleVehicles.map((v) => {
                      const isSelected = v.id === currentVehicle.id;
                      return (
                        <div
                          key={v.id}
                          onClick={() => handleSelectVehicleItem(v)}
                          className={cn(
                            "flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors cursor-pointer select-none",
                            isSelected
                              ? "bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800"
                              : "hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
                          )}
                        >
                          {/* Left Info: Status Dot + Name & IMEI */}
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span
                              style={{
                                backgroundColor:
                                  v.status === "running"
                                    ? "#008446"
                                    : v.status === "idle"
                                      ? "#C46F37"
                                      : v.status === "stopped"
                                        ? "#C70036"
                                        : v.status === "inactive"
                                          ? "#372AAC"
                                          : "#62748E",
                              }}
                              className="h-2 w-2 rounded-full shrink-0"
                            />
                            <div className="flex flex-col min-w-0 truncate">
                              <span className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">
                                {v.name}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate">
                                IMEI: {v.imei} · {v.branch}
                              </span>
                            </div>
                          </div>

                          {/* Right: Check indicator if selected */}
                          {isSelected && (
                            <Check className="h-4 w-4 text-[#0089FF] stroke-[2.5] shrink-0 ml-1" />
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No vehicles found matching "{vehicleSearch}"
                    </div>
                  )}
                </div>

                {/* Footer Count Summary */}
                <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Showing {visibleVehicles.length} of {filteredVehicles.length} matching</span>
                  <span>(Search for 5,000+)</span>
                </div>
              </div>
            )}
          </div>

          <span className="text-slate-300 dark:text-slate-700">|</span>

          {/* Date Range Display (Clickable to change date range) */}
          <button
            type="button"
            onClick={() => setIsCustomDateModalOpen(true)}
            className="flex items-center gap-1.5 text-[11px] font-mono text-slate-600 dark:text-slate-300 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-slate-800 px-1.5 py-0.5 rounded-md transition-colors cursor-pointer group/daterange"
            title="Click to change playback date range"
          >
            <Calendar className="h-3.5 w-3.5 text-[#0089FF] group-hover/daterange:scale-110 transition-transform" />
            <span className="whitespace-nowrap">{dateRangeText}</span>
          </button>

          <span className="text-slate-300 dark:text-slate-700">|</span>

          {/* Quick Header Action Icons */}
          <div className="flex items-center gap-1">
            {/* Zoom In Button */}
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent("map-zoom-in"))}
                    className="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Zoom In Route</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Zoom Out Button */}
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent("map-zoom-out"))}
                    className="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Minus className="h-4 w-4 stroke-[2.5]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Zoom Out Route</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Fit Entire Route Bounds Button */}
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent("map-fit-route"))}
                    className="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Target className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Fit Route to Screen</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <span className="text-slate-200 dark:text-slate-700 h-4 border-r border-slate-200 dark:border-slate-800 mx-0.5" />

            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => toast.success("Printing route playback report...")}
                    className="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Print Report</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Playback link copied to clipboard!");
                    }}
                    className="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Share Playback</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setShowSettings((prev) => !prev)}
                    className={cn(
                      "p-1 rounded-md transition-colors cursor-pointer",
                      showSettings
                        ? "text-[#0089FF] bg-sky-50 dark:bg-sky-950/70"
                        : "text-slate-500 dark:text-slate-400 hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-slate-800"
                    )}
                  >
                    <SlidersHorizontal className="h-4 w-4 stroke-[2.2]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Toggle Playback Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer ml-1"
                  >
                    <X className="h-4 w-4 stroke-[2.5]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Close Playback</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* ==========================================
          2. RIGHT FLOATING "PLAYBACK SETTINGS" PANEL
      ========================================== */}
      {showSettings && (
        <div
          ref={settingsPanelRef}
          style={
            settingsPos
              ? { left: `${settingsPos.x}px`, top: `${settingsPos.y}px`, right: "auto", position: "fixed" }
              : undefined
          }
          className={cn(
            "z-40 w-72 pointer-events-auto rounded-xl border border-[#DFE3EB] dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl p-3 text-xs animate-in slide-in-from-right-4 duration-200 select-none",
            !settingsPos && "absolute top-2.5 right-[58px]"
          )}
        >
          {/* Header (Draggable Handle) */}
          <div
            onMouseDown={handleSettingsHeaderMouseDown}
            className="flex items-center justify-between border-b border-[#DFE3EB] dark:border-slate-800 pb-2 mb-2.5 cursor-grab active:cursor-grabbing hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-t-lg transition-colors px-1 pt-0.5"
            title="Click and drag header to adjust position"
          >
            <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
              Playback Settings
            </span>
            <div className="flex items-center gap-1.5">
              <GripVertical className="h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 cursor-grab active:cursor-grabbing" title="Drag to move panel" />
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Form Controls List */}
          <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 scrollbar-thin text-slate-700 dark:text-slate-300">
            {/* Trip Calculation */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <Route className="h-3.5 w-3.5 text-[#0089FF] shrink-0" />
                <input
                  type="checkbox"
                  checked={tripCalcEnabled}
                  onChange={(e) => setTripCalcEnabled(e.target.checked)}
                  className="rounded text-[#0089FF] focus:ring-[#0089FF] h-3.5 w-3.5 cursor-pointer"
                />
                <span className="font-medium text-[11px]">Trip Calculation</span>
              </label>
              <select
                value={tripCalcType}
                onChange={(e) => setTripCalcType(e.target.value as any)}
                disabled={!tripCalcEnabled}
                className="h-6 px-1.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-800 dark:text-slate-200 focus:outline-none disabled:opacity-50"
              >
                <option value="Ignition">Ignition</option>
                <option value="Motion">Motion</option>
              </select>
            </div>

            {/* Stoppage more than */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <input
                  type="checkbox"
                  checked={stoppageEnabled}
                  onChange={(e) => setStoppageEnabled(e.target.checked)}
                  className="rounded text-[#0089FF] focus:ring-[#0089FF] h-3.5 w-3.5 cursor-pointer"
                />
                <span className="font-medium text-[11px]">Stoppage more than</span>
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={stoppageMin}
                  onChange={(e) => setStoppageMin(e.target.value)}
                  disabled={!stoppageEnabled}
                  className="w-12 h-6 px-1.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-center text-slate-800 dark:text-slate-200 focus:outline-none disabled:opacity-50"
                />
                <span className="text-[10px] text-slate-500">Min</span>
              </div>
            </div>

            {/* Idle more than */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <Timer className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <input
                  type="checkbox"
                  checked={idleEnabled}
                  onChange={(e) => setIdleEnabled(e.target.checked)}
                  className="rounded text-[#0089FF] focus:ring-[#0089FF] h-3.5 w-3.5 cursor-pointer"
                />
                <span className="font-medium text-[11px]">Idle more than</span>
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={idleMin}
                  onChange={(e) => setIdleMin(e.target.value)}
                  disabled={!idleEnabled}
                  className="w-12 h-6 px-1.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-center text-slate-800 dark:text-slate-200 focus:outline-none disabled:opacity-50"
                />
                <span className="text-[10px] text-slate-500">Min</span>
              </div>
            </div>

            {/* Speed more than */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <Gauge className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                <input
                  type="checkbox"
                  checked={speedEnabled}
                  onChange={(e) => setSpeedEnabled(e.target.checked)}
                  className="rounded text-[#0089FF] focus:ring-[#0089FF] h-3.5 w-3.5 cursor-pointer"
                />
                <span className="font-medium text-[11px]">Speed more than</span>
              </label>
              <select
                value={speedLimit}
                onChange={(e) => setSpeedLimit(e.target.value)}
                disabled={!speedEnabled}
                className="h-6 px-1.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-800 dark:text-slate-200 focus:outline-none disabled:opacity-50"
              >
                <option value="40 km/hr">40 km/hr</option>
                <option value="60 km/hr">60 km/hr</option>
                <option value="80 km/hr">80 km/hr</option>
                <option value="100 km/hr">100 km/hr</option>
              </select>
            </div>

            {/* Alerts */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                <input
                  type="checkbox"
                  checked={alertsEnabled}
                  onChange={(e) => setAlertsEnabled(e.target.checked)}
                  className="rounded text-[#0089FF] focus:ring-[#0089FF] h-3.5 w-3.5 cursor-pointer"
                />
                <span className="font-medium text-[11px]">Alerts</span>
              </label>
              <select
                value={alertsFilter}
                onChange={(e) => setAlertsFilter(e.target.value)}
                disabled={!alertsEnabled}
                className="h-6 px-2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-800 dark:text-slate-200 focus:outline-none disabled:opacity-50 min-w-[70px]"
              >
                <option value="All">All</option>
                <option value="Speeding">Speeding</option>
                <option value="Geofence">Geofence</option>
                <option value="SOS">SOS</option>
              </select>
            </div>

            {/* Simple Toggle Options */}
            {[
              { id: "inactive", label: "InActive", value: inactiveEnabled, setter: setInactiveEnabled, icon: Power, color: "text-slate-400" },
              { id: "fuel", label: "Fuel", value: fuelEnabled, setter: setFuelEnabled, icon: Droplet, color: "text-emerald-500" },
              { id: "route", label: "Route", value: routeEnabled, setter: setRouteEnabled, icon: Navigation, color: "text-[#0089FF]" },
              { id: "emergency", label: "Emergency Lights", value: emergencyLightsEnabled, setter: setEmergencyLightsEnabled, icon: Zap, color: "text-amber-400" },
              { id: "toll", label: "Toll Information", value: tollInfoEnabled, setter: setTollInfoEnabled, icon: FileText, color: "text-indigo-500" },
              { id: "opal", label: "Opal Event", value: opalEventEnabled, setter: setOpalEventEnabled, icon: Activity, color: "text-teal-500" },
              { id: "datapoints", label: "Data Points", value: dataPointsEnabled, setter: setDataPointsEnabled, icon: CircleDot, color: "text-sky-500" },
            ].map((item) => {
              const IconComponent = item.icon;
              return (
                <label key={item.id} className="flex items-center gap-2 cursor-pointer py-0.5">
                  <IconComponent className={cn("h-3.5 w-3.5 shrink-0", item.color)} />
                  <input
                    type="checkbox"
                    checked={item.value}
                    onChange={(e) => item.setter(e.target.checked)}
                    className="rounded text-[#0089FF] focus:ring-[#0089FF] h-3.5 w-3.5 cursor-pointer"
                  />
                  <span className="font-medium text-[11px]">{item.label}</span>
                </label>
              );
            })}

            {/* Responsive Data Points Note */}
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-950/30 p-2 rounded-lg leading-relaxed">
              <span className="font-bold block mb-0.5">⚠️ Data Points Note:</span>
              It may have an impact on the responsiveness of your map if you have a lot of data-points on path.
            </div>

            {/* Prompt & Save Buttons Footer (Left Aligned matching Reference System 1:1) */}
            <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
              <p className="font-bold text-left mb-2 text-slate-800 dark:text-slate-200">
                Do you want to save playback settings?
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Playback settings saved!");
                    setShowSettings(false);
                  }}
                  className="px-5 py-1 rounded-md bg-[#0089FF] hover:bg-[#0070d6] text-white font-bold text-[11px] shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px] transition-all cursor-pointer active:scale-95"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          3. CENTER BOTTOM FLOATING CONTROLLER BAR (STREAMING APP STYLE)
      ========================================== */}
      <div
        style={{
          bottom: isTableCollapsed ? "66px" : `${tableHeight + 22}px`,
        }}
        className="absolute left-1/2 -translate-x-1/2 z-40 transition-all duration-150 pointer-events-auto"
      >
        <div className="flex items-center gap-2 pl-1.5 pr-2 h-[38px] rounded-full border border-[#DFE3EB] dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl">
          {/* Play / Pause Toggle Button */}
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="flex items-center justify-center h-7 w-7 rounded-full bg-[#0089FF] hover:bg-[#0070d6] text-white shadow-md transition-all cursor-pointer active:scale-95 shrink-0"
            title={isPlaying ? "Pause Playback" : "Start Playback"}
          >
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5 fill-current" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
            )}
          </button>

          {/* Streaming App Speed Selector Dropdown */}
          <div className="relative shrink-0" ref={speedMenuRef}>
            <button
              type="button"
              onClick={() => setIsSpeedMenuOpen((prev) => !prev)}
              className="flex items-center gap-1 px-2 py-1 h-6 rounded-full bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-[#0089FF] text-[11px] font-black hover:bg-sky-100 dark:hover:bg-sky-900 transition-all cursor-pointer select-none"
              title="Change speed rate"
            >
              <span>{speedMultiplier}X</span>
              <ChevronUp className={cn("h-3 w-3 transition-transform duration-200", isSpeedMenuOpen && "rotate-180")} />
            </button>

            {/* Speed Options Popover Menu */}
            {isSpeedMenuOpen && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 rounded-xl border border-[#DFE3EB] dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl p-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150 text-xs">
                <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1">
                  Speed Rate
                </div>
                {([0.5, 1, 2, 5, 6, 10, 16] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSpeedMultiplier(s);
                      setIsSpeedMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer",
                      speedMultiplier === s
                        ? "bg-[#0089FF] text-white"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    <span>{s}X {s === 1 ? "(Normal)" : ""}</span>
                    {speedMultiplier === s && <Check className="h-3.5 w-3.5 text-white stroke-[2.5]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-slate-200 dark:text-slate-800">|</span>

          {/* Scrubber Range Timeline Slider */}
          <div className="flex items-center gap-2 w-40 sm:w-56">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0089FF]"
            />
          </div>

          {/* Speed Indicator Badge */}
          <div className="text-[10px] font-mono font-bold text-[#0089FF] bg-sky-50 dark:bg-sky-950/60 px-1.5 py-0.5 h-6 flex items-center rounded-md border border-sky-100 dark:border-sky-800/60 whitespace-nowrap shrink-0">
            {Math.round(12 + (progress % 45))} km/h
          </div>

          {/* Quick Action Icons & GIS Tools Suite */}
          <div className="flex items-center gap-0.5 border-l border-slate-200 dark:border-slate-800 pl-1.5">
            <button
              type="button"
              onClick={() => setProgress(0)}
              title="Restart from beginning"
              className="p-1 rounded-md text-slate-600 dark:text-slate-400 hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsFollowVehicle((f) => !f)}
              title={isFollowVehicle ? "Unfollow vehicle on map" : "Follow vehicle on map"}
              className={cn(
                "p-1 rounded-md transition-colors cursor-pointer",
                isFollowVehicle ? "text-[#0089FF] bg-sky-50 dark:bg-sky-950/70" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <Target className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsMuted((m) => !m)}
              title={isMuted ? "Unmute audio" : "Mute audio"}
              className="p-1 rounded-md text-slate-600 dark:text-slate-400 hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>

            <span className="text-slate-200 dark:text-slate-800 mx-0.5">|</span>

            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => toast.success("Route path saved to favorites!")}
                    className="p-1 rounded-md text-slate-600 dark:text-slate-400 hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Save Path</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => toast.info("Opening path comparison tool...")}
                    className="p-1 rounded-md text-slate-600 dark:text-slate-400 hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <GitCompare className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Compare Path</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => toast.success("Downloading KML route file...")}
                    className="p-1 rounded-md text-slate-600 dark:text-slate-400 hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">KML Download</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => toast.success("Opening job creation modal...")}
                    className="p-1 rounded-md text-slate-600 dark:text-slate-400 hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Briefcase className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Create Job</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => toast.success("Creating road fence geofence...")}
                    className="p-1 rounded-md text-slate-600 dark:text-slate-400 hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <TrafficCone className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Create Road Fence</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* ==========================================
          4. BOTTOM COLLAPSIBLE TELEMETRY & DATA TABLE DRAWER
      ========================================== */}
      <div
        style={{
          height: isTableCollapsed ? "44px" : `${tableHeight}px`,
        }}
        className="absolute bottom-2.5 left-2.5 right-2.5 z-40 pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-[#DFE3EB] dark:border-slate-800 rounded-2xl shadow-2xl transition-[height] duration-150 flex flex-col select-none overflow-hidden"
      >
        {/* Top Edge Drag Handle Line */}
        <div
          onMouseDown={handleStartResizeTable}
          className="absolute -top-1.5 left-0 right-0 h-3 cursor-ns-resize flex items-center justify-center group z-50"
          title="Drag up/down to adjust panel height"
        >
          <div className="w-12 h-1 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-[#0089FF] group-hover:w-20 transition-all shadow-xs" />
        </div>
        {/* Table Top Header Toolbar */}
        <div className="h-11 px-2 flex items-center justify-between border-b border-[#DFE3EB] dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shrink-0 gap-2">
          
          {/* Left: Scalable Scrollable Category Tabs (Matching Reference System 1:1) */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-1 max-w-[55vw] sm:max-w-[65vw]">
            {[
              { id: "trips", label: "Trips", icon: Route, count: MOCK_TRIPS.length, color: "text-[#0089FF]" },
              { id: "events", label: "Events", icon: ShieldAlert, count: MOCK_EVENTS_REFERENCE.length, color: "text-amber-500" },
              { id: "datapoints", label: "Data Points", icon: CircleDot, count: MOCK_DATA_POINTS_REFERENCE.length, color: "text-sky-500" },
              { id: "speed", label: "Speed", icon: Gauge, count: MOCK_SPEED_CHART_DATA.length, color: "text-rose-500" },
              { id: "fuel", label: "Fuel", icon: Droplet, count: MOCK_FUEL_CHART_DATA.length, color: "text-emerald-500" },
              { id: "temperature", label: "Temperature", icon: Thermometer, count: MOCK_TEMP_CHART_DATA.length, color: "text-amber-500" },
              { id: "load", label: "Load", icon: Activity, count: MOCK_LOAD_CHART_DATA.length, color: "text-indigo-500" },
              { id: "camera", label: "Camera", icon: Video, count: MOCK_CAM_LOGS.length, color: "text-purple-500" },
            ].map((tb) => {
              const TabIcon = tb.icon;
              const isActive = activeBottomTab === tb.id;
              return (
                <TooltipProvider key={tb.id} delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => {
                          if (activeBottomTab === tb.id) {
                            setIsTableCollapsed((c) => !c);
                          } else {
                            setActiveBottomTab(tb.id);
                            setIsTableCollapsed(false);
                          }
                        }}
                        className={cn(
                          "py-1 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 select-none",
                          isActive
                            ? "bg-[#0089FF] text-white shadow-xs px-3 rounded-lg"
                            : "bg-slate-100/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 px-2 rounded-lg"
                        )}
                      >
                        <TabIcon className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-white" : tb.color)} />
                        {isActive && <span className="whitespace-nowrap font-black">{tb.label}</span>}
                        <span
                          className={cn(
                            "px-1.5 py-0.2 rounded-full text-[10px] font-extrabold font-mono",
                            isActive ? "bg-white/20 text-white" : "bg-slate-200/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-400"
                          )}
                        >
                          {tb.count}
                        </span>
                      </button>
                    </TooltipTrigger>
                    {!isActive && <TooltipContent side="top">{tb.label}</TooltipContent>}
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>

          {/* Right side: Arrow-Only Expand / Collapse Toggle Button */}
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setIsTableCollapsed((prev) => !prev)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-[#0089FF] transition-all cursor-pointer shrink-0"
                >
                  <ChevronUp className={cn("h-4 w-4 transition-transform duration-200 stroke-[2.5]", !isTableCollapsed && "rotate-180")} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {isTableCollapsed ? "Expand Data Panel" : "Collapse to Tab Bar"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Tab Content Display Area (Matching Reference System 1:1) */}
        {!isTableCollapsed && (
          <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar p-2">
            
            {/* 1. TRIPS TAB (Reference Image 1:1) */}
            {activeBottomTab === "trips" && (
              <div>
                <div className="flex items-center justify-end gap-1 mb-1 px-1">
                  <button type="button" onClick={() => toast.success("Printing Trips...")} className="p-1 text-slate-500 hover:text-[#0089FF]" title="Print"><Printer className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => toast.success("Exporting XLS...")} className="p-1 text-slate-500 hover:text-emerald-600" title="Export XLS"><FileText className="h-3.5 w-3.5" /></button>
                </div>
                <table className="w-full text-left text-[11px] whitespace-nowrap border-collapse">
                  <thead className="bg-slate-100/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 font-bold sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-2 px-3">Start Time</th>
                      <th className="py-2 px-3">Start Location</th>
                      <th className="py-2 px-3">End Time</th>
                      <th className="py-2 px-3">End Location</th>
                      <th className="py-2 px-3">Running</th>
                      <th className="py-2 px-3">Distance (km)</th>
                      <th className="py-2 px-3">Avg Speed (km/h)</th>
                      <th className="py-2 px-3">Max Speed (km/h)</th>
                      <th className="py-2 px-3">Alerts</th>
                      <th className="py-2 px-3">Driver</th>
                      <th className="py-2 px-3">Trip Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-slate-800 dark:text-slate-200">
                    {MOCK_TRIPS.map((tr) => (
                      <tr key={tr.id} className="hover:bg-sky-50/60 dark:hover:bg-sky-950/40 transition-colors cursor-pointer">
                        <td className="py-1.5 px-3 text-slate-600 dark:text-slate-400">{tr.startTime}</td>
                        <td className="py-1.5 px-3 font-sans font-medium text-slate-900 dark:text-slate-100">{tr.startLocation}</td>
                        <td className="py-1.5 px-3 text-slate-600 dark:text-slate-400">{tr.endTime}</td>
                        <td className="py-1.5 px-3 font-sans font-medium text-slate-900 dark:text-slate-100">{tr.endLocation}</td>
                        <td className="py-1.5 px-3 font-semibold text-sky-600 dark:text-sky-400">{tr.running}</td>
                        <td className="py-1.5 px-3 font-bold text-slate-900 dark:text-slate-100">{tr.distance}</td>
                        <td className="py-1.5 px-3 text-slate-700 dark:text-slate-300">{tr.avgSpeed}</td>
                        <td className="py-1.5 px-3 text-rose-600 dark:text-rose-400 font-bold">{tr.maxSpeed}</td>
                        <td className="py-1.5 px-3">
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                            {tr.alerts}
                          </span>
                        </td>
                        <td className="py-1.5 px-3 font-sans font-medium">{tr.driver}</td>
                        <td className="py-1.5 px-3">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold">
                            {tr.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 2. EVENTS TAB (Reference Image 4) */}
            {activeBottomTab === "events" && (
              <div>
                <div className="flex items-center justify-end gap-1 mb-1 px-1">
                  <button type="button" onClick={() => toast.success("Printing events...")} className="p-1 text-slate-500 hover:text-[#0089FF]" title="Print"><Printer className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => toast.success("Exporting XLS...")} className="p-1 text-slate-500 hover:text-emerald-600" title="Export XLS"><FileText className="h-3.5 w-3.5" /></button>
                </div>
                <table className="w-full text-left text-[11px] whitespace-nowrap border-collapse">
                  <thead className="bg-slate-100/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 font-bold sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-2 px-3">Event</th>
                      <th className="py-2 px-3">
                        <div className="flex items-center gap-1 cursor-pointer">
                          <span>Time</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-2 px-3">Event Duration</th>
                      <th className="py-2 px-3">Address</th>
                      <th className="py-2 px-3">Driver</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-slate-800 dark:text-slate-200">
                    {MOCK_EVENTS_REFERENCE.map((ev) => (
                      <tr key={ev.id} className="hover:bg-sky-50/60 dark:hover:bg-sky-950/40 transition-colors cursor-pointer">
                        <td className="py-1.5 px-3 font-sans font-medium text-slate-900 dark:text-slate-100">{ev.event}</td>
                        <td className="py-1.5 px-3 text-slate-600 dark:text-slate-400">{ev.time}</td>
                        <td className="py-1.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">{ev.duration}</td>
                        <td className="py-1.5 px-3 font-sans text-slate-700 dark:text-slate-300">{ev.address}</td>
                        <td className="py-1.5 px-3 font-sans font-medium">{ev.driver}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 2. DATA POINTS TAB (Reference Image 3) */}
            {activeBottomTab === "datapoints" && (
              <div>
                <div className="flex items-center justify-end gap-1 mb-1 px-1">
                  <button type="button" onClick={() => toast.success("Printing Data Points...")} className="p-1 text-slate-500 hover:text-[#0089FF]" title="Print"><Printer className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => toast.success("Exporting XLS...")} className="p-1 text-slate-500 hover:text-emerald-600" title="Export XLS"><FileText className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => toast.success("Exporting CSV...")} className="p-1 text-slate-500 hover:text-indigo-600" title="Export CSV"><Download className="h-3.5 w-3.5" /></button>
                </div>
                <table className="w-full text-left text-[11px] whitespace-nowrap border-collapse">
                  <thead className="bg-slate-100/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 font-bold sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-2 px-3">
                        <div className="flex items-center gap-1 cursor-pointer">
                          <span>Status</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-2 px-3">
                        <div className="flex items-center gap-1 cursor-pointer">
                          <span>Time</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-2 px-3">Latitude</th>
                      <th className="py-2 px-3">Longitude</th>
                      <th className="py-2 px-3">
                        <div className="flex items-center gap-1 cursor-pointer">
                          <span>Speed</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-2 px-3">Distance(km)</th>
                      <th className="py-2 px-3">Address</th>
                      <th className="py-2 px-3">Driver</th>
                      <th className="py-2 px-3">
                        <div className="flex items-center gap-1 cursor-pointer">
                          <span>Battery Voltage %</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-slate-800 dark:text-slate-200">
                    {MOCK_DATA_POINTS_REFERENCE.map((dp) => (
                      <tr key={dp.id} className="hover:bg-sky-50/60 dark:hover:bg-sky-950/40 transition-colors cursor-pointer">
                        <td className="py-1.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">{dp.status}</td>
                        <td className="py-1.5 px-3 text-slate-600 dark:text-slate-400">{dp.time}</td>
                        <td className="py-1.5 px-3">{dp.lat}</td>
                        <td className="py-1.5 px-3">{dp.lng}</td>
                        <td className="py-1.5 px-3 font-extrabold text-[#0089FF]">{dp.speed}</td>
                        <td className="py-1.5 px-3 font-semibold">{dp.distance}</td>
                        <td className="py-1.5 px-3 font-sans text-slate-700 dark:text-slate-300">{dp.address}</td>
                        <td className="py-1.5 px-3 font-sans">{dp.driver}</td>
                        <td className="py-1.5 px-3">{dp.battery}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 3. SPEED CHART TAB (Reference Image 2) */}
            {activeBottomTab === "speed" && (
              <div className="h-36 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_SPEED_CHART_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#94A3B8" />
                    <YAxis domain={[0, 150]} label={{ value: "Speed (km/hr)", angle: -90, position: "insideLeft", offset: 10, style: { fontSize: "10px", fill: "#94A3B8" } }} tick={{ fontSize: 10 }} stroke="#94A3B8" />
                    <RechartsTooltip formatter={(val: any) => [`${val} km/hr`, "Speed"]} />
                    <Area type="monotone" dataKey="speed" stroke="#F43F5E" fill="url(#speedGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* 4. LOAD CHART TAB (Reference Image 1) */}
            {activeBottomTab === "load" && (
              <div className="h-36 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_LOAD_CHART_DATA} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0089FF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0089FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#94A3B8" />
                    <YAxis domain={[0, 12000]} label={{ value: "Load", angle: -90, position: "insideLeft", offset: 10, style: { fontSize: "10px", fill: "#94A3B8" } }} tick={{ fontSize: 10 }} stroke="#94A3B8" />
                    <RechartsTooltip formatter={(val: any) => [`${val} kg`, "Load Weight"]} />
                    <Area type="monotone" dataKey="load" stroke="#0089FF" fill="url(#loadGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* 5. FUEL CHART TAB */}
            {activeBottomTab === "fuel" && (
              <div className="h-36 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_FUEL_CHART_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fuelGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#94A3B8" />
                    <YAxis domain={[0, 100]} label={{ value: "Fuel Level (%)", angle: -90, position: "insideLeft", offset: 10, style: { fontSize: "10px", fill: "#94A3B8" } }} tick={{ fontSize: 10 }} stroke="#94A3B8" />
                    <RechartsTooltip formatter={(val: any) => [`${val}%`, "Fuel Level"]} />
                    <Area type="monotone" dataKey="level" stroke="#10B981" fill="url(#fuelGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* 6. TEMPERATURE CHART TAB */}
            {activeBottomTab === "temperature" && (
              <div className="h-36 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_TEMP_CHART_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#94A3B8" />
                    <YAxis label={{ value: "Temp (°C)", angle: -90, position: "insideLeft", offset: 10, style: { fontSize: "10px", fill: "#94A3B8" } }} tick={{ fontSize: 10 }} stroke="#94A3B8" />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="sensor1" name="Cold Store (°C)" stroke="#0284C7" strokeWidth={2} />
                    <Line type="monotone" dataKey="sensor2" name="Freezer (°C)" stroke="#2563EB" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* 7. CAMERA TAB */}
            {activeBottomTab === "camera" && (
              <table className="w-full text-left text-[11px] whitespace-nowrap">
                <thead className="bg-slate-100/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 font-bold sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2 px-3">Camera Channel</th>
                    <th className="py-2 px-3">Detection Event</th>
                    <th className="py-2 px-3">Captured Timestamp</th>
                    <th className="py-2 px-3">Media Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-slate-800 dark:text-slate-200">
                  {MOCK_CAM_LOGS.map((cm) => (
                    <tr key={cm.id} className="hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-colors cursor-pointer">
                      <td className="py-1.5 px-3 font-bold text-indigo-600 dark:text-indigo-400">{cm.camName}</td>
                      <td className="py-1.5 px-3 font-sans font-bold text-slate-900 dark:text-slate-100">{cm.event}</td>
                      <td className="py-1.5 px-3 text-slate-600 dark:text-slate-400">{cm.time}</td>
                      <td className="py-1.5 px-3 font-bold text-indigo-500"><span className="px-2 py-0.5 rounded bg-indigo-500/15">{cm.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Custom Date Range Modal for changing playback timeframe */}
      <CustomDateRangeModal
        open={isCustomDateModalOpen}
        onClose={() => setIsCustomDateModalOpen(false)}
        initialPreset={timeframe === "Custom" ? "Custom Range" : timeframe}
        onApply={(result) => {
          setIsCustomDateModalOpen(false);
          setCurrentCustomRange(result.formattedRange);
          toast.success("Playback date range updated", {
            description: result.formattedRange,
          });
        }}
      />
    </div>
  );
}
