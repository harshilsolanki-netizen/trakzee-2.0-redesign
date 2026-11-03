import React, { useState, useMemo, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Play,
  Pause,
  Check,
  CheckCircle2,
  AlertTriangle,
  Download,
  Image as ImageIcon,
  MapPin,
  SlidersHorizontal,
  RefreshCw,
  Search,
  X,
  ChevronDown,
  Calendar,
  Video,
  ShieldAlert,
  Volume2,
  VolumeX,
  Maximize2,
  Eye,
  Clock,
  Sparkles,
  Filter,
  Layers,
  ArrowUpDown,
  Car,
  User,
  UserCheck,
  RotateCcw,
  Gauge,
  Compass,
  FileVideo,
  Share2,
  Info,
  ShieldCheck,
  CheckSquare,
  Edit3,
  Copy,
  Map as MapIcon,
  Plus,
  Minus,
  Upload,
  Pipette,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type MediaIncident = {
  id: string;
  title: string;
  category: "ADAS" | "DMS" | "Safety" | "Security";
  channel: string;
  channelNumber: number;
  status: "unreviewed" | "reviewed";
  reviewedAt?: string;
  reviewedBy?: string;
  verdict?: string;
  reviewNotes?: string;
  actionsTaken?: string[];
  vehicleNo: string;
  driver: string;
  dateTimeRange: string;
  incidentTime: string;
  fileSize: string;
  format: string;
  duration: string;
  durationSeconds: number;
  thumbnail: string;
  alternateAngles?: {
    channel: string;
    channelNumber: number;
    thumbnail: string;
  }[];
  speed: string;
  speedLimit: string;
  location: string;
  coordinates: { lat: number; lng: number };
  gForce: { x: number; y: number; z: number };
  aiConfidence: number;
  severity: "low" | "medium" | "high" | "critical";
};

// Format review date and time e.g. "02 Nov 2026, 10:15 AM"
export function formatReviewDateTime(date: Date = new Date()) {
  const day = String(date.getDate()).padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
}

// Initial Mock Incidents matching reference screenshots (12 incidents)
export const INITIAL_MEDIA_INCIDENTS: MediaIncident[] = [
  {
    id: "inc-001",
    title: "Driver Distraction",
    category: "ADAS",
    channel: "Channel 1",
    channelNumber: 1,
    status: "unreviewed",
    vehicleNo: "GJ 15 AB 0001",
    driver: "Rajesh Patel",
    dateTimeRange: "5-12-2023 12:00AM To 5-12-2023 4:02PM",
    incidentTime: "12:42:15 PM",
    fileSize: "4.91 MB",
    format: "H264",
    duration: "00:15",
    durationSeconds: 15,
    thumbnail: "/telematics/driver_phone_distraction.png",
    alternateAngles: [
      {
        channel: "Channel 1 (In-Cabin)",
        channelNumber: 1,
        thumbnail: "/telematics/driver_phone_distraction.png",
      },
      {
        channel: "Channel 2 (Road Front)",
        channelNumber: 2,
        thumbnail: "/telematics/driver_cabin_1.jpg",
      },
      {
        channel: "Channel 3 (Cargo)",
        channelNumber: 3,
        thumbnail: "/telematics/cargo_hold.png",
      },
    ],
    speed: "54 km/h",
    speedLimit: "50 km/h",
    location: "Surat - Navsari Highway, Gujarat",
    coordinates: { lat: 21.1702, lng: 72.8311 },
    gForce: { x: 0.12, y: -0.34, z: 0.98 },
    aiConfidence: 98.4,
    severity: "high",
  },
  {
    id: "inc-002",
    title: "Driver Distraction",
    category: "ADAS",
    channel: "Channel 1",
    channelNumber: 1,
    status: "unreviewed",
    vehicleNo: "GJ 15 AB 0001",
    driver: "Rajesh Patel",
    dateTimeRange: "5-12-2023 12:00AM To 5-12-2023 4:02PM",
    incidentTime: "01:15:30 PM",
    fileSize: "4.91 MB",
    format: "H264",
    duration: "00:20",
    durationSeconds: 20,
    thumbnail: "/telematics/driver_phone_night_1.png",
    alternateAngles: [
      {
        channel: "Channel 1 (In-Cabin)",
        channelNumber: 1,
        thumbnail: "/telematics/driver_phone_night_1.png",
      },
      {
        channel: "Channel 2 (Road Front)",
        channelNumber: 2,
        thumbnail: "/telematics/driver_cabin_2.png",
      },
    ],
    speed: "48 km/h",
    speedLimit: "50 km/h",
    location: "Ring Road, Surat",
    coordinates: { lat: 21.1959, lng: 72.8302 },
    gForce: { x: 0.05, y: -0.15, z: 1.01 },
    aiConfidence: 96.2,
    severity: "high",
  },
  {
    id: "inc-003",
    title: "Driver Distraction",
    category: "ADAS",
    channel: "Channel 1",
    channelNumber: 1,
    status: "unreviewed",
    vehicleNo: "GJ 15 AB 0001",
    driver: "Rajesh Patel",
    dateTimeRange: "5-12-2023 12:00AM To 5-12-2023 4:02PM",
    incidentTime: "02:08:44 PM",
    fileSize: "4.91 MB",
    format: "H264",
    duration: "00:18",
    durationSeconds: 18,
    thumbnail: "/telematics/driver_yawning.png",
    alternateAngles: [
      {
        channel: "Channel 1 (In-Cabin)",
        channelNumber: 1,
        thumbnail: "/telematics/driver_yawning.png",
      },
      {
        channel: "Channel 2 (Road Front)",
        channelNumber: 2,
        thumbnail: "/telematics/driver_cabin_1.jpg",
      },
    ],
    speed: "62 km/h",
    speedLimit: "60 km/h",
    location: "NH-48, Bharuch Corridor",
    coordinates: { lat: 21.7051, lng: 72.9959 },
    gForce: { x: 0.08, y: -0.22, z: 0.99 },
    aiConfidence: 94.7,
    severity: "medium",
  },
  {
    id: "inc-004",
    title: "Driver Distraction",
    category: "ADAS",
    channel: "Channel 1",
    channelNumber: 1,
    status: "unreviewed",
    vehicleNo: "GJ 15 AB 0001",
    driver: "Rajesh Patel",
    dateTimeRange: "5-12-2023 12:00AM To 5-12-2023 4:02PM",
    incidentTime: "02:35:10 PM",
    fileSize: "4.91 MB",
    format: "H264",
    duration: "00:15",
    durationSeconds: 15,
    thumbnail: "/telematics/driver_cabin_1.jpg",
    speed: "58 km/h",
    speedLimit: "60 km/h",
    location: "Ankleshwar Bypass",
    coordinates: { lat: 21.6264, lng: 73.0034 },
    gForce: { x: 0.14, y: -0.42, z: 0.96 },
    aiConfidence: 97.8,
    severity: "high",
  },
  {
    id: "inc-005",
    title: "Driver Distraction",
    category: "ADAS",
    channel: "Channel 1",
    channelNumber: 1,
    status: "unreviewed",
    vehicleNo: "GJ 15 AB 0001",
    driver: "Rajesh Patel",
    dateTimeRange: "5-12-2023 12:00AM To 5-12-2023 4:02PM",
    incidentTime: "03:02:19 PM",
    fileSize: "4.91 MB",
    format: "H264",
    duration: "00:15",
    durationSeconds: 15,
    thumbnail: "/telematics/driver_smoking.png",
    speed: "45 km/h",
    speedLimit: "50 km/h",
    location: "Kamrej Toll Plaza",
    coordinates: { lat: 21.2684, lng: 72.9568 },
    gForce: { x: 0.02, y: -0.1, z: 1.0 },
    aiConfidence: 93.5,
    severity: "medium",
  },
  {
    id: "inc-006",
    title: "Driver Distraction",
    category: "ADAS",
    channel: "Channel 1",
    channelNumber: 1,
    status: "unreviewed",
    vehicleNo: "GJ 15 AB 0001",
    driver: "Rajesh Patel",
    dateTimeRange: "5-12-2023 12:00AM To 5-12-2023 4:02PM",
    incidentTime: "03:22:50 PM",
    fileSize: "4.91 MB",
    format: "H264",
    duration: "00:22",
    durationSeconds: 22,
    thumbnail: "/telematics/driver_phone_distraction.png",
    speed: "51 km/h",
    speedLimit: "50 km/h",
    location: "Udhna - Magdalla Rd",
    coordinates: { lat: 21.1517, lng: 72.7845 },
    gForce: { x: 0.18, y: -0.38, z: 0.97 },
    aiConfidence: 99.1,
    severity: "high",
  },
  {
    id: "inc-007",
    title: "Driver Distraction",
    category: "ADAS",
    channel: "Channel 1",
    channelNumber: 1,
    status: "unreviewed",
    vehicleNo: "GJ 15 AB 0001",
    driver: "Rajesh Patel",
    dateTimeRange: "5-12-2023 12:00AM To 5-12-2023 4:02PM",
    incidentTime: "03:45:12 PM",
    fileSize: "4.91 MB",
    format: "H264",
    duration: "00:16",
    durationSeconds: 16,
    thumbnail: "/telematics/driver_fatigue.png",
    speed: "68 km/h",
    speedLimit: "60 km/h",
    location: "Hazira Industrial Belt",
    coordinates: { lat: 21.1112, lng: 72.6514 },
    gForce: { x: 0.22, y: -0.52, z: 0.95 },
    aiConfidence: 98.7,
    severity: "critical",
  },
  {
    id: "inc-008",
    title: "Driver Distraction",
    category: "ADAS",
    channel: "Channel 1",
    channelNumber: 1,
    status: "unreviewed",
    vehicleNo: "GJ 15 AB 0001",
    driver: "Rajesh Patel",
    dateTimeRange: "5-12-2023 12:00AM To 5-12-2023 4:02PM",
    incidentTime: "04:01:30 PM",
    fileSize: "4.91 MB",
    format: "H264",
    duration: "00:15",
    durationSeconds: 15,
    thumbnail: "/telematics/driver_cabin_2.png",
    speed: "55 km/h",
    speedLimit: "50 km/h",
    location: "Surat Port Corridor",
    coordinates: { lat: 21.1352, lng: 72.6985 },
    gForce: { x: 0.11, y: -0.28, z: 0.99 },
    aiConfidence: 97.4,
    severity: "high",
  },
  {
    id: "inc-009",
    title: "Driver Fatigue",
    category: "DMS",
    channel: "Channel 1",
    channelNumber: 1,
    status: "unreviewed",
    vehicleNo: "MH 04 CD 2045",
    driver: "Vikram Singh",
    dateTimeRange: "5-12-2023 10:00AM To 5-12-2023 2:15PM",
    incidentTime: "11:20:05 AM",
    fileSize: "5.62 MB",
    format: "H264",
    duration: "00:15",
    durationSeconds: 15,
    thumbnail: "/telematics/driver_fatigue_rubbing_eyes.png",
    speed: "72 km/h",
    speedLimit: "70 km/h",
    location: "Mumbai-Pune Expressway",
    coordinates: { lat: 18.7512, lng: 73.3421 },
    gForce: { x: 0.15, y: -0.45, z: 0.98 },
    aiConfidence: 96.8,
    severity: "critical",
  },
  {
    id: "inc-010",
    title: "Cargo Door Alert",
    category: "Security",
    channel: "Channel 3",
    channelNumber: 3,
    status: "unreviewed",
    vehicleNo: "DL 01 AX 9982",
    driver: "Suresh Kumar",
    dateTimeRange: "5-12-2023 09:30AM To 5-12-2023 1:00PM",
    incidentTime: "10:14:22 AM",
    fileSize: "4.12 MB",
    format: "H264",
    duration: "00:12",
    durationSeconds: 12,
    thumbnail: "/telematics/cargo_hold.png",
    speed: "38 km/h",
    speedLimit: "40 km/h",
    location: "Kashmere Gate, Delhi",
    coordinates: { lat: 28.6672, lng: 77.2285 },
    gForce: { x: 0.04, y: -0.09, z: 1.0 },
    aiConfidence: 99.5,
    severity: "high",
  },
  {
    id: "inc-011",
    title: "Driver Distraction",
    category: "ADAS",
    channel: "Channel 1",
    channelNumber: 1,
    status: "unreviewed",
    vehicleNo: "GJ 15 AB 0001",
    driver: "Rajesh Patel",
    dateTimeRange: "5-12-2023 12:00AM To 5-12-2023 4:02PM",
    incidentTime: "01:45:00 AM",
    fileSize: "4.91 MB",
    format: "H264",
    duration: "00:15",
    durationSeconds: 15,
    thumbnail: "/telematics/driver_phone_night_2.png",
    speed: "60 km/h",
    speedLimit: "60 km/h",
    location: "Surat Bypass Highway",
    coordinates: { lat: 21.1823, lng: 72.8456 },
    gForce: { x: 0.09, y: -0.21, z: 0.99 },
    aiConfidence: 95.8,
    severity: "high",
  },
  {
    id: "inc-012",
    title: "Driver Fatigue",
    category: "DMS",
    channel: "Channel 1",
    channelNumber: 1,
    status: "unreviewed",
    vehicleNo: "KA 03 MM 7712",
    driver: "Ramesh Gowda",
    dateTimeRange: "5-12-2023 02:00PM To 5-12-2023 5:30PM",
    incidentTime: "04:12:08 PM",
    fileSize: "5.10 MB",
    format: "H264",
    duration: "00:15",
    durationSeconds: 15,
    thumbnail: "/telematics/driver_yawning.png",
    speed: "65 km/h",
    speedLimit: "60 km/h",
    location: "Electronic City, Bangalore",
    coordinates: { lat: 12.8399, lng: 77.677 },
    gForce: { x: 0.16, y: -0.32, z: 0.97 },
    aiConfidence: 97.1,
    severity: "critical",
  },
];

const MAP_TILE_OPTIONS = [
  {
    id: "osm",
    label: "OpenStreetMap (Standard)",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    subdomains: "abc",
    maxZoom: 19,
  },
  {
    id: "carto-voyager",
    label: "Carto Voyager (Clean)",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    subdomains: "abcd",
    maxZoom: 20,
  },
  {
    id: "satellite",
    label: "Satellite Imagery",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    subdomains: "abc",
    maxZoom: 19,
  },
  {
    id: "dark",
    label: "Dark Theme",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    subdomains: "abcd",
    maxZoom: 20,
  },
];

// Color conversion utilities for rich interactive color palette popover
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.replace("#", "").trim();
  if (c.length === 3) {
    c = c.split("").map((x) => x + x).join("");
  }
  const num = parseInt(c || "0089FF", 16);
  return {
    r: isNaN((num >> 16) & 255) ? 0 : (num >> 16) & 255,
    g: isNaN((num >> 8) & 255) ? 137 : (num >> 8) & 255,
    b: isNaN(num & 255) ? 255 : num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(isNaN(n) ? 0 : n)));
    return clamped.toString(16).padStart(2, "0");
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const f = (n: number, k = (n + h / 60) % 6) =>
    v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return {
    r: Math.round(f(5) * 255),
    g: Math.round(f(3) * 255),
    b: Math.round(f(1) * 255),
  };
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case rN:
        h = (gN - bN) / d + (gN < bN ? 6 : 0);
        break;
      case gN:
        h = (bN - rN) / d + 2;
        break;
      case bN:
        h = (rN - gN) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s, v };
}

const PRESET_COLORS = [
  "#0089FF",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#64748B",
  "#F97316",
  "#14B8A6",
  "#6366F1",
  "#84CC16",
];

export function MediaGalleryReport() {
  const [incidents, setIncidents] = useState<MediaIncident[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("trakzee_media_incidents_v2");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_MEDIA_INCIDENTS;
  });

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "unreviewed" | "reviewed">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [vehicleFilter, setVehicleFilter] = useState<string>("all");

  // Interactive Modals
  const [activeIncidentForPlayer, setActiveIncidentForPlayer] = useState<MediaIncident | null>(null);
  const [activeIncidentForLocation, setActiveIncidentForLocation] = useState<MediaIncident | null>(null);
  const [activeIncidentForSnapshot, setActiveIncidentForSnapshot] = useState<MediaIncident | null>(null);

  // Dedicated Review Modal State (Opens when clicking Review button on card)
  const [activeIncidentForReviewModal, setActiveIncidentForReviewModal] = useState<MediaIncident | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  // Video Player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0); // 0 to 100
  const [activeChannel, setActiveChannel] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Location Modal Extended State (In-modal Tabs, Map Layer, Search & Forms)
  const [locationTab, setLocationTab] = useState<"info" | "address" | "geofence">("info");
  const [isMapMenuOpen, setIsMapMenuOpen] = useState(false);
  const [selectedMapLayer, setSelectedMapLayer] = useState<string>("osm");
  const [locationSearchInput, setLocationSearchInput] = useState<string>("");
  const [incidentCoords, setIncidentCoords] = useState<{ lat: number; lng: number }>({
    lat: 21.1702,
    lng: 72.8311,
  });

  // Add Address Form State (inside Location Modal)
  const [addressCompany, setAddressCompany] = useState("Ha Company");
  const [addressName, setAddressName] = useState("");
  const [addressType, setAddressType] = useState("Financial / Bank");
  const [addressTolerance, setAddressTolerance] = useState(200);
  const [addressDescription, setAddressDescription] = useState("");

  // Add Geofence Form State (inside Location Modal)
  const [geofenceTab, setGeofenceTab] = useState<"Custom" | "KML/KMZ" | "Excel/XLS">("Custom");
  const [geofenceCompany, setGeofenceCompany] = useState("Ha Company");
  const [geofenceName, setGeofenceName] = useState("");
  const [geofenceCategory, setGeofenceCategory] = useState("Area");
  const [geofenceAccess, setGeofenceAccess] = useState<"Public" | "Private">("Public");
  const [geofenceGroup, setGeofenceGroup] = useState("Ha Company Geofences");
  const [geofenceType, setGeofenceType] = useState<"Circular Zone" | "Polygon Zone" | "Rectangle Zone">("Circular Zone");
  const [geofenceContactNo, setGeofenceContactNo] = useState("");
  const [geofenceAddress, setGeofenceAddress] = useState("");
  const [geofenceColor, setGeofenceColor] = useState("#0089FF");
  const [geofenceTolerance, setGeofenceTolerance] = useState(10);
  const [geofenceDescription, setGeofenceDescription] = useState("");

  // Color Picker Popover State
  const [isGeofenceColorPickerOpen, setIsGeofenceColorPickerOpen] = useState(false);
  const geofenceColorPickerRef = useRef<HTMLDivElement>(null);

  // HSV State for Saturation/Value Spectrum Canvas
  const geofenceRgb = hexToRgb(geofenceColor);
  const geofenceHsv = rgbToHsv(geofenceRgb.r, geofenceRgb.g, geofenceRgb.b);
  const [geofenceHue, setGeofenceHue] = useState(geofenceHsv.h);
  const [geofenceSat, setGeofenceSat] = useState(geofenceHsv.s);
  const [geofenceVal, setGeofenceVal] = useState(geofenceHsv.v);

  // Sync HSV when geofenceColor hex changes
  useEffect(() => {
    const { r, g, b } = hexToRgb(geofenceColor);
    const { h, s, v } = rgbToHsv(r, g, b);
    setGeofenceHue(h);
    setGeofenceSat(s);
    setGeofenceVal(v);
  }, [geofenceColor]);

  // Close color popover on outside click
  useEffect(() => {
    if (!isGeofenceColorPickerOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        geofenceColorPickerRef.current &&
        !geofenceColorPickerRef.current.contains(e.target as Node)
      ) {
        setIsGeofenceColorPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isGeofenceColorPickerOpen]);

  const handleGeofenceSpectrumClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    const newSat = x / rect.width;
    const newVal = 1 - y / rect.height;
    setGeofenceSat(newSat);
    setGeofenceVal(newVal);
    const { r, g, b } = hsvToRgb(geofenceHue, newSat, newVal);
    setGeofenceColor(rgbToHex(r, g, b));
  };

  const handleGeofenceHueSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = Number(e.target.value);
    setGeofenceHue(newHue);
    const { r, g, b } = hsvToRgb(newHue, geofenceSat, geofenceVal);
    setGeofenceColor(rgbToHex(r, g, b));
  };

  const handleGeofenceRgbInputChange = (channel: "r" | "g" | "b", valueStr: string) => {
    const valNum = parseInt(valueStr || "0", 10);
    const currentRgb = hexToRgb(geofenceColor);
    const newRgb = {
      ...currentRgb,
      [channel]: isNaN(valNum) ? 0 : Math.max(0, Math.min(255, valNum)),
    };
    setGeofenceColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleGeofenceEyedropper = async () => {
    if (typeof window !== "undefined" && "EyeDropper" in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          setGeofenceColor(result.sRGBHex);
          toast.success(`Color picked: ${result.sRGBHex}`);
        }
      } catch (e) {
        // User canceled eyedropper
      }
    } else {
      toast.info("Native Eyedropper tool not supported in this browser.");
    }
  };

  // Refs for Leaflet Map inside Location Modal
  const locationMapRef = useRef<HTMLDivElement>(null);
  const locationMapInstanceRef = useRef<L.Map | null>(null);
  const locationMarkerRef = useRef<L.Marker | null>(null);
  const locationCircleRef = useRef<L.Circle | null>(null);
  const locationTileLayerRef = useRef<L.TileLayer | null>(null);
  const mapMenuRef = useRef<HTMLDivElement>(null);

  // Close Map Layer Menu on outside click
  useEffect(() => {
    if (!isMapMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (mapMenuRef.current && !mapMenuRef.current.contains(e.target as Node)) {
        setIsMapMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMapMenuOpen]);

  // Sync coords and pre-fill form fields when activeIncidentForLocation opens
  useEffect(() => {
    if (activeIncidentForLocation) {
      setLocationTab("info");
      setIncidentCoords(activeIncidentForLocation.coordinates);
      setLocationSearchInput("");
      setIsMapMenuOpen(false);

      // Pre-fill Add Address
      setAddressCompany("Ha Company");
      setAddressName(activeIncidentForLocation.location);
      setAddressType("Financial / Bank");
      setAddressTolerance(200);
      setAddressDescription(`Marked from incident: ${activeIncidentForLocation.title} (${activeIncidentForLocation.vehicleNo})`);

      // Pre-fill Add Geofence
      setGeofenceTab("Custom");
      setGeofenceCompany("Ha Company");
      setGeofenceName(`${activeIncidentForLocation.title} Zone - ${activeIncidentForLocation.vehicleNo}`);
      setGeofenceCategory("Area");
      setGeofenceAccess("Public");
      setGeofenceGroup("Ha Company Geofences");
      setGeofenceType("Circular Zone");
      setGeofenceContactNo("+91 98765 43210");
      setGeofenceAddress(activeIncidentForLocation.location);
      setGeofenceColor("#0089FF");
      setGeofenceTolerance(10);
      setGeofenceDescription(`Safety buffer around incident coordinates for vehicle ${activeIncidentForLocation.vehicleNo}`);
    }
  }, [activeIncidentForLocation]);

  // Leaflet map setup for Location Modal
  useEffect(() => {
    if (!activeIncidentForLocation) return;

    const timer = setTimeout(() => {
      if (!locationMapRef.current) return;

      if (locationMapInstanceRef.current) {
        try {
          locationMapInstanceRef.current.remove();
        } catch (_) {}
        locationMapInstanceRef.current = null;
      }

      if (locationMapRef.current) {
        delete (locationMapRef.current as any)._leaflet_id;
      }

      try {
        const initialLat = activeIncidentForLocation.coordinates.lat;
        const initialLng = activeIncidentForLocation.coordinates.lng;

        const map = L.map(locationMapRef.current, {
          center: [initialLat, initialLng],
          zoom: 15,
          zoomControl: false,
          attributionControl: false,
        });

        locationMapInstanceRef.current = map;

        const activeTile =
          MAP_TILE_OPTIONS.find((t) => t.id === selectedMapLayer) || MAP_TILE_OPTIONS[0];
        const tileLayer = L.tileLayer(activeTile.url, {
          maxZoom: activeTile.maxZoom,
          subdomains: activeTile.subdomains,
        }).addTo(map);
        locationTileLayerRef.current = tileLayer;

        const customPinIcon = L.divIcon({
          className: "custom-incident-pin-marker",
          html: `
            <div style="background-color: #0089FF; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 14px rgba(0,137,255,0.45); cursor: pointer;">
              <div style="width: 12px; height: 12px; background-color: white; border-radius: 50%; transform: rotate(45deg); margin: auto;"></div>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 34],
        });

        const marker = L.marker([initialLat, initialLng], {
          icon: customPinIcon,
          draggable: true,
        }).addTo(map);

        marker.bindPopup(
          `<div style="font-family: inherit; font-size: 12px; padding: 3px;">
            <div style="color: #0089FF; font-weight: 700;">${activeIncidentForLocation.vehicleNo}</div>
            <div style="font-weight: 600;">${activeIncidentForLocation.title} (${activeIncidentForLocation.speed})</div>
            <div style="color: #64748B; font-size: 11px; margin-top: 2px;">${activeIncidentForLocation.location}</div>
          </div>`,
          { closeButton: false }
        );

        locationMarkerRef.current = marker;

        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          const rLat = parseFloat(pos.lat.toFixed(6));
          const rLng = parseFloat(pos.lng.toFixed(6));
          setIncidentCoords({ lat: rLat, lng: rLng });
          if (locationCircleRef.current) {
            locationCircleRef.current.setLatLng([rLat, rLng]);
          }
        });

        map.on("click", (e: L.LeafletMouseEvent) => {
          const { lat: clickLat, lng: clickLng } = e.latlng;
          const rLat = parseFloat(clickLat.toFixed(6));
          const rLng = parseFloat(clickLng.toFixed(6));
          setIncidentCoords({ lat: rLat, lng: rLng });
          marker.setLatLng([rLat, rLng]);
          if (locationCircleRef.current) {
            locationCircleRef.current.setLatLng([rLat, rLng]);
          }
        });

        setTimeout(() => {
          map.invalidateSize();
        }, 120);
      } catch (err) {
        console.error("Leaflet map initialization error:", err);
      }
    }, 60);

    return () => {
      clearTimeout(timer);
      if (locationMapInstanceRef.current) {
        try {
          locationMapInstanceRef.current.remove();
        } catch (_) {}
        locationMapInstanceRef.current = null;
      }
      if (locationMapRef.current) {
        delete (locationMapRef.current as any)._leaflet_id;
      }
    };
  }, [activeIncidentForLocation]);

  // Synchronize circle radius, color and map resize whenever tab, form values, or coordinates change
  useEffect(() => {
    if (!locationMapInstanceRef.current) return;
    const map = locationMapInstanceRef.current;

    const resizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 120);

    if (locationTab === "info") {
      // In Location Details: only the pinpoint marker is shown, no circle!
      if (locationCircleRef.current) {
        try {
          map.removeLayer(locationCircleRef.current);
        } catch (_) {}
        locationCircleRef.current = null;
      }
    } else if (locationTab === "address") {
      // In Add Address: show circle with radius addressTolerance
      if (locationCircleRef.current) {
        locationCircleRef.current.setLatLng([incidentCoords.lat, incidentCoords.lng]);
        locationCircleRef.current.setRadius(addressTolerance);
        locationCircleRef.current.setStyle({
          color: "#0089FF",
          fillColor: "#0089FF",
          fillOpacity: 0.18,
          weight: 2,
        });
      } else {
        locationCircleRef.current = L.circle([incidentCoords.lat, incidentCoords.lng], {
          radius: addressTolerance,
          color: "#0089FF",
          fillColor: "#0089FF",
          fillOpacity: 0.18,
          weight: 2,
        }).addTo(map);
      }
    } else if (locationTab === "geofence") {
      // In Add Geofence: show circle with radius geofenceTolerance and selected color
      const color = geofenceColor || "#0089FF";
      if (locationCircleRef.current) {
        locationCircleRef.current.setLatLng([incidentCoords.lat, incidentCoords.lng]);
        locationCircleRef.current.setRadius(geofenceTolerance);
        locationCircleRef.current.setStyle({
          color,
          fillColor: color,
          fillOpacity: 0.22,
          weight: 2,
        });
      } else {
        locationCircleRef.current = L.circle([incidentCoords.lat, incidentCoords.lng], {
          radius: geofenceTolerance,
          color,
          fillColor: color,
          fillOpacity: 0.22,
          weight: 2,
        }).addTo(map);
      }
    }

    return () => clearTimeout(resizeTimer);
  }, [
    locationTab,
    addressTolerance,
    geofenceTolerance,
    geofenceColor,
    incidentCoords.lat,
    incidentCoords.lng,
  ]);

  // Update tile layer when selected map layer changes
  useEffect(() => {
    if (!locationMapInstanceRef.current) return;
    if (locationTileLayerRef.current) {
      locationMapInstanceRef.current.removeLayer(locationTileLayerRef.current);
    }
    const tileConfig =
      MAP_TILE_OPTIONS.find((t) => t.id === selectedMapLayer) || MAP_TILE_OPTIONS[0];
    const newLayer = L.tileLayer(tileConfig.url, {
      maxZoom: tileConfig.maxZoom,
      subdomains: tileConfig.subdomains,
    }).addTo(locationMapInstanceRef.current);
    locationTileLayerRef.current = newLayer;
  }, [selectedMapLayer]);

  // Search Location handler
  const handleLocationSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!locationSearchInput.trim() || !locationMapInstanceRef.current) return;

    const parts = locationSearchInput.split(",").map((s) => s.trim());
    if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
      const nLat = parseFloat(Number(parts[0]).toFixed(6));
      const nLng = parseFloat(Number(parts[1]).toFixed(6));
      setIncidentCoords({ lat: nLat, lng: nLng });
      locationMarkerRef.current?.setLatLng([nLat, nLng]);
      locationCircleRef.current?.setLatLng([nLat, nLng]);
      locationMapInstanceRef.current.panTo([nLat, nLng]);
      toast.success(`Position set to Lat ${nLat}, Lng ${nLng}`);
      return;
    }

    const q = locationSearchInput.toLowerCase();
    const presets: Record<string, [number, number]> = {
      surat: [21.1702, 72.8311],
      navsari: [20.9467, 72.952],
      ahmedabad: [23.0225, 72.5714],
      mumbai: [19.076, 72.8777],
      delhi: [28.6139, 77.209],
      pune: [18.5204, 73.8567],
      vadodara: [22.3072, 73.1812],
    };

    const matched = Object.keys(presets).find((k) => q.includes(k));
    if (matched) {
      const [nLat, nLng] = presets[matched];
      setIncidentCoords({ lat: nLat, lng: nLng });
      locationMarkerRef.current?.setLatLng([nLat, nLng]);
      locationCircleRef.current?.setLatLng([nLat, nLng]);
      locationMapInstanceRef.current.panTo([nLat, nLng]);
      toast.success(`Centered map to "${locationSearchInput}"`);
    } else {
      toast.info(`Searched for "${locationSearchInput}"`);
    }
  };

  // In-modal Save Handlers for Add Address & Add Geofence
  const handleSaveAddressFromTab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressName.trim()) {
      toast.error("Please enter a valid Address Name");
      return;
    }
    toast.success(`Address "${addressName}" added successfully!`, {
      description: `Type: ${addressType} · Tolerance: ${addressTolerance}m · GPS: ${incidentCoords.lat.toFixed(4)}, ${incidentCoords.lng.toFixed(4)}`,
    });
    setLocationTab("info");
  };

  const handleSaveGeofenceFromTab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!geofenceName.trim()) {
      toast.error("Please enter a valid Geofence Name");
      return;
    }
    toast.success(`Geofence "${geofenceName}" created successfully!`, {
      description: `Category: ${geofenceCategory} · Access: ${geofenceAccess} · Radius: ${geofenceTolerance}m`,
    });
    setLocationTab("info");
  };

  // Persist incident statuses in localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("trakzee_media_incidents_v2", JSON.stringify(incidents));
      } catch {}
    }
  }, [incidents]);

  // Video play simulation ticker
  useEffect(() => {
    let interval: any;
    if (isPlaying && activeIncidentForPlayer) {
      interval = setInterval(() => {
        setPlayProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 100 / (activeIncidentForPlayer.durationSeconds * 10);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeIncidentForPlayer]);

  // Unique vehicles for dropdown
  const uniqueVehicles = useMemo(() => {
    return Array.from(new Set(incidents.map((i) => i.vehicleNo)));
  }, [incidents]);

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          inc.title.toLowerCase().includes(q) ||
          inc.vehicleNo.toLowerCase().includes(q) ||
          inc.driver.toLowerCase().includes(q) ||
          inc.location.toLowerCase().includes(q) ||
          inc.category.toLowerCase().includes(q) ||
          (inc.reviewedBy && inc.reviewedBy.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Status
      if (statusFilter !== "all" && inc.status !== statusFilter) {
        return false;
      }

      // Category
      if (categoryFilter !== "all" && inc.category !== categoryFilter) {
        return false;
      }

      // Channel
      if (channelFilter !== "all" && inc.channelNumber.toString() !== channelFilter) {
        return false;
      }

      // Vehicle
      if (vehicleFilter !== "all" && inc.vehicleNo !== vehicleFilter) {
        return false;
      }

      return true;
    });
  }, [incidents, searchQuery, statusFilter, categoryFilter, channelFilter, vehicleFilter]);

  // Counts
  const totalCount = incidents.length;
  const unreviewedCount = incidents.filter((i) => i.status === "unreviewed").length;
  const reviewedCount = incidents.filter((i) => i.status === "reviewed").length;

  const isAllSelected =
    filteredIncidents.length > 0 &&
    filteredIncidents.every((inc) => selectedIds.has(inc.id));

  // Toggle Single Selection
  const toggleSelectOne = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle Select All
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredIncidents.map((i) => i.id)));
    }
  };

  // Clear Selection
  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  // Open Review Modal for an Incident
  const openReviewModal = (incident: MediaIncident, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveIncidentForReviewModal(incident);
    setReviewNotes(incident.reviewNotes || "");
  };

  // 1. Submit Single Incident Review (from Review Modal)
  const handleConfirmReview = () => {
    if (!activeIncidentForReviewModal) return;
    const now = formatReviewDateTime(new Date());
    const reviewer = "VK (Safety Officer)";

    setIncidents((prev) =>
      prev.map((i) =>
        i.id === activeIncidentForReviewModal.id
          ? {
              ...i,
              status: "reviewed",
              reviewedAt: now,
              reviewedBy: reviewer,
              reviewNotes: reviewNotes.trim() || undefined,
            }
          : i,
      ),
    );

    toast.success(`Incident Marked as Reviewed`, {
      description: `Reviewed by ${reviewer} on ${now}`,
    });

    setActiveIncidentForReviewModal(null);
  };

  // Mark Incident as Unreviewed / Re-open (from Review Modal)
  const handleMarkUnreviewed = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === incidentId
          ? {
              ...i,
              status: "unreviewed",
              reviewedAt: undefined,
              reviewedBy: undefined,
              verdict: undefined,
              reviewNotes: undefined,
              actionsTaken: undefined,
            }
          : i,
      ),
    );

    toast.info("Incident Reset to Unreviewed");
    setActiveIncidentForReviewModal(null);
  };

  // 2. Bulk Incident Review Handler
  const handleBulkReview = (reviewer = "VK (Safety Officer)") => {
    if (selectedIds.size === 0) return;
    const count = selectedIds.size;
    const now = formatReviewDateTime(new Date());

    setIncidents((prev) =>
      prev.map((i) =>
        selectedIds.has(i.id)
          ? {
              ...i,
              status: "reviewed",
              reviewedAt: now,
              reviewedBy: reviewer,
              verdict: "Confirmed Violation",
              reviewNotes: i.reviewNotes || "Bulk verified and approved by Safety Officer.",
              actionsTaken: ["In-Cabin Voice Alert Issued"],
            }
          : i,
      ),
    );

    setSelectedIds(new Set());

    toast.success(`Bulk Review Successful`, {
      description: `${count} incident${count > 1 ? "s" : ""} marked as Reviewed by ${reviewer}`,
    });
  };


  // Reset demo data
  const handleResetDemoData = () => {
    setIncidents(INITIAL_MEDIA_INCIDENTS);
    setSelectedIds(new Set());
    toast.success("Media Gallery data reset to default demo state");
  };

  // Open Player Modal
  const openPlayer = (incident: MediaIncident) => {
    setActiveIncidentForPlayer(incident);
    setActiveChannel(incident.channelNumber || 1);
    setIsPlaying(true);
    setPlayProgress(0);
  };

  return (
    <div className="relative flex flex-1 min-h-0 flex-col overflow-hidden bg-slate-50/60 dark:bg-slate-950">
      {/* Top Filter & Control Bar */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3 select-none">
        {/* Left Section: Select All + Filter Chips */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Select All Checkbox */}
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer hover:text-blue-600 transition-colors">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAll}
              className="h-4 w-4 rounded border-slate-300 text-[#0089FF] focus:ring-[#0089FF]/30 cursor-pointer accent-[#0089FF]"
            />
            <span>Select All</span>
            {selectedIds.size > 0 && (
              <span className="ml-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                ({selectedIds.size} of {filteredIncidents.length})
              </span>
            )}
          </label>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer",
                statusFilter === "all"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
              )}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("unreviewed")}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer",
                statusFilter === "unreviewed"
                  ? "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Unreviewed ({unreviewedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("reviewed")}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer",
                statusFilter === "reviewed"
                  ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Reviewed ({reviewedCount})
            </button>
          </div>

          {/* Category Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <span>Category: {categoryFilter === "all" ? "All" : categoryFilter}</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem onClick={() => setCategoryFilter("all")}>All Categories</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("ADAS")}>ADAS</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("DMS")}>DMS</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("Security")}>Security</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Vehicle Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <Car className="h-3 w-3 text-slate-400" />
                <span>Vehicle: {vehicleFilter === "all" ? "All" : vehicleFilter}</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => setVehicleFilter("all")}>All Vehicles</DropdownMenuItem>
              <DropdownMenuSeparator />
              {uniqueVehicles.map((v) => (
                <DropdownMenuItem key={v} onClick={() => setVehicleFilter(v)}>
                  {v}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right Section: Search & Actions */}
        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative flex items-center h-8 w-56 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all">
            <Search className="h-3.5 w-3.5 text-slate-400 ml-2.5 pointer-events-none shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vehicle, driver, event..."
              className="w-full bg-transparent px-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Reset Demo Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleResetDemoData}
                className="flex items-center justify-center h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#0089FF] hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Reset Demo Incidents</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Main Grid Scroll Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        {filteredIncidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
              <FileVideo className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No media incidents found
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Try adjusting your search query, status filters, or category filters to find incidents.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setCategoryFilter("all");
                setVehicleFilter("all");
              }}
              className="mt-4 px-3 py-1.5 text-xs font-semibold text-[#0089FF] bg-blue-50 dark:bg-blue-950/40 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 pb-20">
            {filteredIncidents.map((incident) => {
              const isSelected = selectedIds.has(incident.id);
              const isReviewed = incident.status === "reviewed";

              return (
                <div
                  key={incident.id}
                  onClick={() => toggleSelectOne(incident.id)}
                  className={cn(
                    "group relative flex flex-col rounded-xl overflow-hidden border transition-all duration-200 bg-white dark:bg-slate-900 select-none shadow-2xs hover:shadow-md cursor-pointer",
                    isSelected
                      ? "border-[#0089FF] ring-2 ring-[#0089FF]/20"
                      : "border-[#DFE3EB] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700",
                  )}
                >
                  {/* Top: Video Thumbnail Container */}
                  <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                    <img
                      src={incident.thumbnail}
                      alt={incident.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />

                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />

                    {/* Top-Left: Card Selection Checkbox & Channel Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                      <div
                        onClick={(e) => toggleSelectOne(incident.id, e)}
                        className={cn(
                          "flex h-4.5 w-4.5 items-center justify-center rounded border transition-colors cursor-pointer",
                          isSelected
                            ? "border-[#0089FF] bg-[#0089FF] text-white"
                            : "border-white/60 bg-black/40 hover:border-white text-transparent",
                        )}
                      >
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-xs">
                        {incident.channel}
                      </span>
                    </div>

                    {/* Top-Right: Review Status Badge (Unreviewed red / Reviewed green) */}
                    <div className="absolute top-2.5 right-2.5 z-10">
                      {isReviewed ? (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-500/90 text-white px-2 py-0.5 text-[10px] font-bold shadow-xs backdrop-blur-xs">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                          Reviewed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-rose-500/95 text-white px-2 py-0.5 text-[10px] font-bold shadow-xs backdrop-blur-xs">
                          Unreviewed
                        </span>
                      )}
                    </div>

                    {/* Center: Play Button Overlay */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openPlayer(incident);
                      }}
                      title="Play Incident Video"
                      aria-label="Play Video"
                      className="absolute inset-0 m-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/20 hover:bg-[#0089FF] border border-white/40 text-white backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer z-10"
                    >
                      <Play className="h-5 w-5 fill-white text-white ml-0.5" />
                    </button>

                    {/* Bottom-Left: File Size */}
                    <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5 text-[10px] font-medium text-white/90 z-10">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                      <span>{incident.fileSize}</span>
                    </div>

                    {/* Bottom-Right: Codec */}
                    <div className="absolute bottom-2 right-2.5 text-[10px] font-mono font-medium text-white/80 z-10">
                      {incident.format}
                    </div>
                  </div>

                  {/* Bottom: Incident Card Information */}
                  <div className="flex flex-col p-3 bg-white dark:bg-slate-900 gap-1.5">
                    {/* Row 1: Title + Category Tag + Review Button */}
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-bold text-[13px] text-slate-900 dark:text-slate-100 truncate">
                          {incident.title}
                        </span>
                        <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                          {incident.category}
                        </span>
                      </div>

                      {/* Review Action Button -> Opens Review Modal */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={(e) => openReviewModal(incident, e)}
                            className={cn(
                              "flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold cursor-pointer shadow-2xs transition-colors shrink-0",
                              isReviewed
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "bg-[#0089FF] hover:bg-blue-600 text-white",
                            )}
                          >
                            {isReviewed ? (
                              <>
                                <Check className="h-3 w-3 stroke-[2.5]" />
                                <span>Reviewed</span>
                              </>
                            ) : (
                              <span>Review</span>
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isReviewed
                            ? `Reviewed by ${incident.reviewedBy} on ${incident.reviewedAt} · Click to edit`
                            : "Click to submit review and mark as reviewed"}
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    {/* Row 2: Vehicle Number + Driver */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        {incident.vehicleNo}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                        {incident.driver}
                      </span>
                    </div>

                    {/* Row 3: Date & Time Range + Action Icons */}
                    <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="truncate text-[10px]">
                        {incident.dateTimeRange}
                      </span>

                      {/* Action Icons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveIncidentForSnapshot(incident);
                              }}
                              className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <ImageIcon className="h-3.5 w-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>View Snapshot</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveIncidentForLocation(incident);
                              }}
                              className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <MapPin className="h-3.5 w-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>View Location</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast.success("Download Initiated", {
                                  description: `Evidence video file for ${incident.vehicleNo} (${incident.fileSize})`,
                                });
                              }}
                              className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Download Evidence</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FLOATING BULK ACTION TOOLBAR (Matches Screenshots 2 & 3) */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#0B1528] dark:bg-slate-900 text-white px-3.5 py-2 rounded-xl shadow-2xl border border-slate-700/80 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200">
          {/* Selected Count Pill */}
          <div className="flex items-center gap-1.5 bg-[#0089FF] text-white px-3 py-1 rounded-lg text-xs font-bold tracking-wide shadow-xs">
            <span>{selectedIds.size} Selected</span>
          </div>

          <div className="h-4 w-px bg-slate-700" />

          {/* Mark as Reviewed Button */}
          <button
            type="button"
            onClick={() => handleBulkReview("VK (Safety Officer)")}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-all active:scale-95"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Mark as Reviewed</span>
          </button>

          {/* Download Selected */}
          <button
            type="button"
            onClick={() => {
              toast.success(`Exporting ${selectedIds.size} Evidence Files`, {
                description: "Preparing zip archive download...",
              });
            }}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white px-2 py-1 text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download All</span>
          </button>

          {/* Close / Deselect Button */}
          <button
            type="button"
            onClick={clearSelection}
            title="Deselect All"
            className="ml-1 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* DEDICATED REVIEW INCIDENT MODAL (TRIGGERED BY "REVIEW" BUTTON) */}
      <Dialog
        open={Boolean(activeIncidentForReviewModal)}
        onOpenChange={(open) => !open && setActiveIncidentForReviewModal(null)}
      >
        <DialogContent className="max-w-xl p-0 overflow-hidden bg-white dark:bg-slate-900 border-[#DFE3EB] dark:border-slate-800">
          {activeIncidentForReviewModal && (
            <div className="flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[#DFE3EB] dark:border-slate-800 px-5 py-3.5 bg-slate-50/90 dark:bg-slate-800/80 pr-12">
                <div className="flex items-center gap-2.5">
                  <DialogTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Review Incident Evidence
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    Review incident evidence and submit auditor observations
                  </DialogDescription>
                  {activeIncidentForReviewModal.status === "reviewed" ? (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold">
                      <Check className="h-3 w-3 stroke-[2.5]" /> Reviewed
                    </span>
                  ) : (
                    <span className="rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2.5 py-0.5 text-xs font-semibold">
                      Pending Review
                    </span>
                  )}
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex flex-col p-5 gap-4 max-h-[75vh] overflow-y-auto">
                {/* 1. Evidence Overview Card */}
                <div className="flex gap-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                  <div className="relative aspect-video w-32 rounded-lg overflow-hidden shrink-0 bg-slate-950 border border-slate-700">
                    <img
                      src={activeIncidentForReviewModal.thumbnail}
                      alt={activeIncidentForReviewModal.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/70 px-1 py-0.5 text-[9px] font-mono text-white rounded">
                      {activeIncidentForReviewModal.channel}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-1.5 text-xs min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {activeIncidentForReviewModal.title}
                      </span>
                      <span className="rounded bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        {activeIncidentForReviewModal.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                      <span>Vehicle: <strong className="font-mono text-foreground">{activeIncidentForReviewModal.vehicleNo}</strong></span>
                      <span>·</span>
                      <span>Speed: <strong className="text-foreground">{activeIncidentForReviewModal.speed}</strong></span>
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      📍 {activeIncidentForReviewModal.location}
                    </div>
                  </div>
                </div>

                {/* Already Reviewed Banner (if applicable) */}
                {activeIncidentForReviewModal.status === "reviewed" && activeIncidentForReviewModal.reviewedBy && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-semibold text-emerald-950 dark:text-emerald-100">
                          Reviewed by <strong>{activeIncidentForReviewModal.reviewedBy}</strong>
                        </div>
                        <div className="text-[10px] text-emerald-700 dark:text-emerald-400">
                          Timestamp: {activeIncidentForReviewModal.reviewedAt}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Review Notes / Observations */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Review Observations & Comments
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Enter review notes, observations, or comments..."
                    rows={4}
                    className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-background text-foreground focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF] focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-[#DFE3EB] dark:border-slate-800 px-5 py-3.5 bg-slate-50/80 dark:bg-slate-800/80">
                {activeIncidentForReviewModal.status === "reviewed" ? (
                  <button
                    type="button"
                    onClick={() => handleMarkUnreviewed(activeIncidentForReviewModal.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                  >
                    Mark as Unreviewed
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveIncidentForReviewModal(null)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveIncidentForReviewModal(null)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmReview}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer active:scale-95"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>
                      {activeIncidentForReviewModal.status === "reviewed"
                        ? "Update Review"
                        : "Mark as Reviewed"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* INTERACTIVE VIDEO PLAYER & INCIDENT AUDIT MODAL */}
      <Dialog
        open={Boolean(activeIncidentForPlayer)}
        onOpenChange={(open) => {
          if (!open) {
            setActiveIncidentForPlayer(null);
            setIsPlaying(false);
          }
        }}
      >
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white dark:bg-slate-900 border-[#DFE3EB] dark:border-slate-800">
          {activeIncidentForPlayer && (
            <div className="flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[#DFE3EB] dark:border-slate-800 px-5 py-3.5 bg-slate-50/80 dark:bg-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                    <Video className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {activeIncidentForPlayer.title}
                      </h2>
                      <span className="rounded bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        {activeIncidentForPlayer.category}
                      </span>
                      {activeIncidentForPlayer.status === "reviewed" ? (
                        <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                          <Check className="h-2.5 w-2.5" /> Reviewed
                        </span>
                      ) : (
                        <span className="rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2 py-0.5 text-[10px] font-bold">
                          Unreviewed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Vehicle: <span className="font-mono font-semibold text-foreground">{activeIncidentForPlayer.vehicleNo}</span> · Driver: {activeIncidentForPlayer.driver} · Time: {activeIncidentForPlayer.incidentTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      openReviewModal(activeIncidentForPlayer);
                    }}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors",
                      activeIncidentForPlayer.status === "reviewed"
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-[#0089FF] hover:bg-blue-600 text-white",
                    )}
                  >
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>
                      {activeIncidentForPlayer.status === "reviewed"
                        ? "Review Details"
                        : "Mark as Reviewed"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Video Player + Telemetry Split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 min-h-0 overflow-y-auto">
                {/* Left (2 cols): Video Canvas & Playback Bar */}
                <div className="lg:col-span-2 flex flex-col bg-black">
                  <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
                    <img
                      src={
                        activeIncidentForPlayer.alternateAngles?.find((a) => a.channelNumber === activeChannel)?.thumbnail ||
                        activeIncidentForPlayer.thumbnail
                      }
                      alt="Video playback frame"
                      className="h-full w-full object-contain"
                    />

                    {/* HUD Watermark & Speed Overlay */}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-1 rounded border border-white/20">
                      <div>GJ 15 AB 0001 · CAM-{activeChannel}</div>
                      <div className="text-emerald-400 font-bold">{activeIncidentForPlayer.speed} · GPS LOCKED</div>
                    </div>

                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-1 rounded border border-white/20">
                      5-12-2023 {activeIncidentForPlayer.incidentTime}
                    </div>

                    {/* Center Pause/Play Button Overlay */}
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md shadow-2xl transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6 fill-white" />
                      ) : (
                        <Play className="h-6 w-6 fill-white ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Playback Controls & Progress Bar */}
                  <div className="flex flex-col bg-slate-900 text-white p-3 gap-2">
                    {/* Scrubber Bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400">
                        {Math.floor((playProgress / 100) * activeIncidentForPlayer.durationSeconds)}s
                      </span>
                      <div
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const clickX = e.clientX - rect.left;
                          setPlayProgress((clickX / rect.width) * 100);
                        }}
                        className="relative flex-1 h-2 bg-slate-700 rounded-full cursor-pointer overflow-hidden group"
                      >
                        <div
                          style={{ width: `${playProgress}%` }}
                          className="h-full bg-[#0089FF] rounded-full transition-all duration-75 relative"
                        >
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100" />
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {activeIncidentForPlayer.duration}
                      </span>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="p-1 rounded text-white hover:text-[#0089FF] transition-colors cursor-pointer"
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setPlayProgress(0)}
                          className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Restart"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsMuted(!isMuted)}
                          className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </button>

                        <div className="h-3.5 w-px bg-slate-700 mx-1" />

                        {/* Speed Controls */}
                        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-300">
                          {[1, 1.5, 2].map((spd) => (
                            <button
                              key={spd}
                              type="button"
                              onClick={() => setPlaybackSpeed(spd)}
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] transition-colors cursor-pointer",
                                playbackSpeed === spd
                                  ? "bg-[#0089FF] text-white font-bold"
                                  : "hover:bg-slate-800 text-slate-400",
                              )}
                            >
                              {spd}x
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Multi-Channel Camera Switcher */}
                      <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                        {[1, 2, 3].map((ch) => (
                          <button
                            key={ch}
                            type="button"
                            onClick={() => setActiveChannel(ch)}
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer",
                              activeChannel === ch
                                ? "bg-[#0089FF] text-white"
                                : "text-slate-400 hover:text-white",
                            )}
                          >
                            Cam {ch}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right (1 col): Telemetry & Investigation Panel */}
                <div className="p-4 flex flex-col gap-3 bg-white dark:bg-slate-900 border-l border-[#DFE3EB] dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Incident Telemetry
                  </h4>

                  {/* AI Detection Metric */}
                  <div className="p-2.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-[#0089FF]" />
                        AI Detection Confidence
                      </span>
                      <span className="font-bold text-[#0089FF]">
                        {activeIncidentForPlayer.aiConfidence}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full bg-blue-200/60 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${activeIncidentForPlayer.aiConfidence}%` }}
                        className="h-full bg-[#0089FF] rounded-full"
                      />
                    </div>
                  </div>

                  {/* Speed & G-Force Cards */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Gauge className="h-3 w-3 text-slate-400" /> Speed
                      </div>
                      <div className="font-bold text-sm text-foreground mt-0.5">
                        {activeIncidentForPlayer.speed}
                      </div>
                      <div className="text-[10px] text-rose-500 font-medium">
                        Limit: {activeIncidentForPlayer.speedLimit}
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Compass className="h-3 w-3 text-slate-400" /> Max G-Force
                      </div>
                      <div className="font-bold text-sm text-foreground mt-0.5">
                        {activeIncidentForPlayer.gForce.z}g
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        X:{activeIncidentForPlayer.gForce.x} Y:{activeIncidentForPlayer.gForce.y}
                      </div>
                    </div>
                  </div>

                  {/* Location Info */}
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs">
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1 mb-1">
                      <MapPin className="h-3 w-3 text-rose-500" /> Incident Location
                    </div>
                    <div className="font-medium text-slate-900 dark:text-slate-100 text-xs">
                      {activeIncidentForPlayer.location}
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                      {activeIncidentForPlayer.coordinates.lat.toFixed(4)}° N, {activeIncidentForPlayer.coordinates.lng.toFixed(4)}° E
                    </div>
                  </div>

                  {/* Auditor Review Details If Reviewed */}
                  {activeIncidentForPlayer.status === "reviewed" ? (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span className="font-bold text-emerald-900 dark:text-emerald-100">
                          Reviewed by {activeIncidentForPlayer.reviewedBy}
                        </span>
                      </div>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400">
                        {activeIncidentForPlayer.reviewedAt}
                      </div>
                      {activeIncidentForPlayer.reviewNotes && (
                        <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1 italic">
                          "{activeIncidentForPlayer.reviewNotes}"
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-1">
                      <button
                        type="button"
                        onClick={() => openReviewModal(activeIncidentForPlayer)}
                        className="w-full py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        <span>Submit Incident Review</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* INCIDENT LOCATION MODAL */}
      <Dialog
        open={Boolean(activeIncidentForLocation)}
        onOpenChange={(open) => !open && setActiveIncidentForLocation(null)}
      >
        <DialogContent className="max-w-6xl w-[1160px] max-w-[96vw] h-[85vh] max-h-[740px] p-0 overflow-hidden bg-white dark:bg-slate-900 border-[#DFE3EB] dark:border-slate-800 flex flex-col">
          {activeIncidentForLocation && (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Modern Clean Header Bar with Separator */}
              <div className="flex h-14 items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0 pr-12 select-none">
                <div className="flex items-center gap-2.5">
                  <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Incident Location Pinpoint
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    View incident location on map, save address or configure geofence
                  </DialogDescription>
                </div>

                {/* Header Summary Badges */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-[#DFE3EB] dark:border-slate-700">
                    {activeIncidentForLocation.vehicleNo}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-[#DFE3EB] dark:border-slate-700">
                    {activeIncidentForLocation.speed}
                  </span>
                </div>
              </div>

              {/* Sub-Header Tabs & Actions Bar */}
              <div className="flex items-center justify-between px-6 border-b border-[#DFE3EB] dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 h-11 shrink-0 select-none">
                {/* Mode Tabs */}
                <div className="flex items-center gap-1.5 h-full">
                  {[
                    { id: "info", label: "Location Details", icon: Info },
                    { id: "address", label: "Add Address", icon: MapPin },
                    { id: "geofence", label: "Add Geofence", icon: ShieldAlert },
                  ].map((tab) => {
                    const isActive = locationTab === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setLocationTab(tab.id as any)}
                        className={cn(
                          "relative h-full px-3.5 flex items-center gap-1.5 text-xs transition-colors cursor-pointer",
                          isActive
                            ? "text-[#0089FF] font-bold"
                            : "text-slate-600 dark:text-slate-400 hover:text-[#0089FF] font-semibold"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{tab.label}</span>
                        {isActive && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0089FF] rounded-t-full shadow-xs" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right hint */}
                <div className="text-[11px] text-muted-foreground hidden sm:block">
                  Driver: <span className="font-semibold text-foreground">{activeIncidentForLocation.driver}</span> · {activeIncidentForLocation.category}
                </div>
              </div>

              {/* Modal Body: Left Panel (when address or geofence) + Map Canvas */}
              <div className="flex-1 flex min-h-0 relative overflow-hidden">
                {/* 1. Add Address Form Panel (Rendered inside same modal when locationTab === 'address') */}
                {locationTab === "address" && (
                  <div className="w-full md:w-[360px] lg:w-[380px] shrink-0 bg-slate-50/70 dark:bg-slate-950/60 border-r border-[#DFE3EB] dark:border-slate-800 flex flex-col h-full min-h-0 select-none animate-in slide-in-from-left-2 duration-150 z-10">
                    <form
                      onSubmit={handleSaveAddressFromTab}
                      className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar"
                    >
                      {/* Company Dropdown */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Company / Branch
                        </label>
                        <Select value={addressCompany} onValueChange={setAddressCompany}>
                          <SelectTrigger className="w-full h-9 rounded-xl border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:border-[#0089FF]">
                            <SelectValue placeholder="Select company" />
                          </SelectTrigger>
                          <SelectContent className="z-[150]">
                            <SelectItem value="All">All Companies</SelectItem>
                            <SelectItem value="Ha Company">Ha Company</SelectItem>
                            <SelectItem value="Surat Branch">Surat Branch</SelectItem>
                            <SelectItem value="Valsad Hub">Valsad Hub</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Address Name */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                          <span>Address Name <span className="text-rose-500">*</span></span>
                          <span className="text-[10px] text-slate-400 font-normal">Required</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={addressName}
                          onChange={(e) => setAddressName(e.target.value)}
                          placeholder="e.g. Surat Terminal Central Hub"
                          className="w-full h-9 px-3 rounded-xl border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF]"
                        />
                      </div>

                      {/* Address Type */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Address Type <span className="text-rose-500">*</span>
                        </label>
                        <Select value={addressType} onValueChange={setAddressType}>
                          <SelectTrigger className="w-full h-9 rounded-xl border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:border-[#0089FF]">
                            <SelectValue placeholder="Select address type" />
                          </SelectTrigger>
                          <SelectContent className="z-[150]">
                            <SelectItem value="Financial / Bank">Financial / Bank</SelectItem>
                            <SelectItem value="Tech Hub">Tech Hub</SelectItem>
                            <SelectItem value="Logistics Hub">Logistics Hub</SelectItem>
                            <SelectItem value="Customer Location">Customer Location</SelectItem>
                            <SelectItem value="Warehouse / Plant">Warehouse / Plant</SelectItem>
                            <SelectItem value="Safety Zone">Safety Zone</SelectItem>
                            <SelectItem value="Emergency Area">Emergency Area</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Tolerance Radius Slider & Meter Readout */}
                      <div className="space-y-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-[#DFE3EB] dark:border-slate-800">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            Tolerance Radius
                          </span>
                          <span className="text-xs font-bold font-mono text-[#0089FF] bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-2 py-0.5 rounded-lg">
                            {addressTolerance} metres
                          </span>
                        </div>
                        <input
                          type="range"
                          min={50}
                          max={2000}
                          step={25}
                          value={addressTolerance}
                          onChange={(e) => setAddressTolerance(Number(e.target.value))}
                          className="w-full accent-[#0089FF] cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                          <span>50m</span>
                          <span>500m</span>
                          <span>1000m</span>
                          <span>2000m</span>
                        </div>
                      </div>

                      {/* Description Notes */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Description / Notes
                        </label>
                        <textarea
                          rows={2}
                          value={addressDescription}
                          onChange={(e) => setAddressDescription(e.target.value)}
                          placeholder="Enter address details or landmark notes..."
                          className="w-full p-2.5 rounded-xl border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF] resize-none"
                        />
                      </div>

                      {/* Coordinates Readout */}
                      <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                        <span>Coordinates:</span>
                        <span className="font-mono font-semibold text-[#0089FF]">
                          {incidentCoords.lat.toFixed(5)}, {incidentCoords.lng.toFixed(5)}
                        </span>
                      </div>
                    </form>

                    {/* Pinned Action Buttons */}
                    <div className="p-3 bg-white dark:bg-slate-900 border-t border-[#DFE3EB] dark:border-slate-800 flex items-center justify-end gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setLocationTab("info")}
                        className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-all cursor-pointer active:scale-95"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveAddressFromTab}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-[#0089FF] hover:bg-[#0070d6] rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Add Geofence Form Panel (Rendered inside same modal when locationTab === 'geofence') */}
                {locationTab === "geofence" && (
                  <div className="w-full md:w-[360px] lg:w-[380px] shrink-0 bg-slate-50/70 dark:bg-slate-950/60 border-r border-[#DFE3EB] dark:border-slate-800 flex flex-col h-full min-h-0 select-none animate-in slide-in-from-left-2 duration-150 z-10">
                    {/* Geofence Mode Sub-tabs (Custom | KML/KMZ | Excel/XLS) */}
                    <div className="flex h-10 items-center px-4 border-b border-[#DFE3EB] dark:border-slate-800 bg-[#FAFBFC] dark:bg-slate-950/80 shrink-0 gap-5">
                      {[
                        { id: "Custom", label: "Custom" },
                        { id: "KML/KMZ", label: "KML / KMZ" },
                        { id: "Excel/XLS", label: "Excel / XLS" },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setGeofenceTab(tab.id as any)}
                          className={cn(
                            "h-full flex items-center text-xs transition-all cursor-pointer border-b-2 relative -mb-px",
                            geofenceTab === tab.id
                              ? "border-[#0089FF] text-[#0089FF] font-bold"
                              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 font-semibold"
                          )}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {geofenceTab === "Custom" ? (
                      <form
                        onSubmit={handleSaveGeofenceFromTab}
                        className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
                      >
                        {/* Company */}
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Company <span className="text-rose-500">*</span>
                          </label>
                          <Select value={geofenceCompany} onValueChange={setGeofenceCompany}>
                            <SelectTrigger className="w-full h-8.5 rounded-xl border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
                              <SelectValue placeholder="Select Company" />
                            </SelectTrigger>
                            <SelectContent className="z-[150]">
                              <SelectItem value="Ha Company">Ha Company</SelectItem>
                              <SelectItem value="HP Company">HP Company</SelectItem>
                              <SelectItem value="Surya Travels">Surya Travels</SelectItem>
                              <SelectItem value="Agrawal Industries">Agrawal Industries</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Geofence Name */}
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Geofence Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={geofenceName}
                            onChange={(e) => setGeofenceName(e.target.value)}
                            placeholder="e.g. Danger Zone Surat"
                            className="w-full h-8.5 px-3 rounded-xl border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF]"
                          />
                        </div>

                        {/* Category */}
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Category <span className="text-rose-500">*</span>
                          </label>
                          <Select value={geofenceCategory} onValueChange={setGeofenceCategory}>
                            <SelectTrigger className="w-full h-8.5 rounded-xl border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent className="z-[150]">
                              <SelectItem value="Area">Area</SelectItem>
                              <SelectItem value="Warehouse / Plant">Warehouse / Plant</SelectItem>
                              <SelectItem value="Security Area">Security Area</SelectItem>
                              <SelectItem value="Emergency Response">Emergency Response</SelectItem>
                              <SelectItem value="Hazard Zone">Hazard Zone</SelectItem>
                              <SelectItem value="Tech Hub">Tech Hub</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Geofence Access (Public / Private) */}
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Geofence Access <span className="text-rose-500">*</span>
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <div
                              onClick={() => setGeofenceAccess("Public")}
                              className={cn(
                                "h-8 px-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all",
                                geofenceAccess === "Public"
                                  ? "bg-[#0089FF]/10 border-[#0089FF] text-[#0089FF] font-bold"
                                  : "bg-white dark:bg-slate-900 border-[#DFE3EB] dark:border-slate-800 text-slate-700 dark:text-slate-300"
                              )}
                            >
                              <div className={cn("h-3.5 w-3.5 rounded-full border flex items-center justify-center", geofenceAccess === "Public" ? "border-[#0089FF]" : "border-slate-300")}>
                                {geofenceAccess === "Public" && <div className="h-1.5 w-1.5 rounded-full bg-[#0089FF]" />}
                              </div>
                              <span className="text-xs">Public</span>
                            </div>
                            <div
                              onClick={() => setGeofenceAccess("Private")}
                              className={cn(
                                "h-8 px-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all",
                                geofenceAccess === "Private"
                                  ? "bg-[#0089FF]/10 border-[#0089FF] text-[#0089FF] font-bold"
                                  : "bg-white dark:bg-slate-900 border-[#DFE3EB] dark:border-slate-800 text-slate-700 dark:text-slate-300"
                              )}
                            >
                              <div className={cn("h-3.5 w-3.5 rounded-full border flex items-center justify-center", geofenceAccess === "Private" ? "border-[#0089FF]" : "border-slate-300")}>
                                {geofenceAccess === "Private" && <div className="h-1.5 w-1.5 rounded-full bg-[#0089FF]" />}
                              </div>
                              <span className="text-xs">Private</span>
                            </div>
                          </div>
                        </div>

                        {/* Geofence Group & Type Row */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              Geofence Group
                            </label>
                            <Select value={geofenceGroup} onValueChange={setGeofenceGroup}>
                              <SelectTrigger className="w-full h-8.5 rounded-xl border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
                                <SelectValue placeholder="Group" />
                              </SelectTrigger>
                              <SelectContent className="z-[150]">
                                <SelectItem value="Ha Company Geofences">Ha Company Geofences</SelectItem>
                                <SelectItem value="Plant Operations">Plant Operations</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              Geofence Type
                            </label>
                            <Select value={geofenceType} onValueChange={(val: any) => setGeofenceType(val)}>
                              <SelectTrigger className="w-full h-8.5 rounded-xl border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
                                <SelectValue placeholder="Type" />
                              </SelectTrigger>
                              <SelectContent className="z-[150]">
                                <SelectItem value="Polygon Zone">Polygon</SelectItem>
                                <SelectItem value="Circular Zone">Circle</SelectItem>
                                <SelectItem value="Rectangle Zone">Rectangle</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Contact No */}
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Contact No
                          </label>
                          <input
                            type="text"
                            value={geofenceContactNo}
                            onChange={(e) => setGeofenceContactNo(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full h-8.5 px-3 rounded-xl border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF]"
                          />
                        </div>

                        {/* Color Picker (matching reference Image media_1793619634803_2e796f02.png) */}
                        <div className="space-y-1 relative" ref={geofenceColorPickerRef}>
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Color Picker:
                          </label>

                          {/* Trigger Box: Color Swatch + Hex Input */}
                          <div className="flex items-center gap-2">
                            <div
                              onClick={() => setIsGeofenceColorPickerOpen((prev) => !prev)}
                              className="h-9 w-9 rounded-lg border border-slate-300 dark:border-slate-700 shadow-xs cursor-pointer overflow-hidden shrink-0 flex items-center justify-center p-0.5 bg-white dark:bg-slate-900 hover:border-[#0089FF] transition-colors"
                              title="Click to open Color Palette"
                            >
                              <div
                                className="w-full h-full rounded-md shadow-inner"
                                style={{ backgroundColor: geofenceColor }}
                              />
                            </div>

                            <input
                              type="text"
                              value={geofenceColor}
                              onChange={(e) => setGeofenceColor(e.target.value)}
                              onClick={() => setIsGeofenceColorPickerOpen(true)}
                              placeholder="#0089FF"
                              className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold uppercase focus:outline-none focus:border-[#0089FF]"
                            />
                          </div>

                          {/* Color Palette Popover Container */}
                          {isGeofenceColorPickerOpen && (
                            <div className="absolute top-full left-0 z-50 mt-1 w-full max-w-[280px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 flex flex-col space-y-3 animate-in fade-in duration-150">
                              {/* Saturation/Value Gradient Canvas */}
                              <div
                                onClick={handleGeofenceSpectrumClick}
                                className="w-full h-32 rounded-xl relative cursor-crosshair overflow-hidden shadow-inner select-none"
                                style={{
                                  backgroundColor: `hsl(${geofenceHue}, 100%, 50%)`,
                                  backgroundImage:
                                    "linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent)",
                                }}
                              >
                                {/* Selector handle marker */}
                                <div
                                  className="absolute h-4 w-4 rounded-full border-2 border-white shadow-md pointer-events-none -translate-x-1/2 -translate-y-full"
                                  style={{
                                    left: `${geofenceSat * 100}%`,
                                    top: `${(1 - geofenceVal) * 100}%`,
                                    backgroundColor: geofenceColor,
                                  }}
                                />
                              </div>

                              {/* Eyedropper Tool + Color Preview Circle + Rainbow Hue Slider Bar */}
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={handleGeofenceEyedropper}
                                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors shrink-0 cursor-pointer"
                                  title="Eyedropper tool"
                                >
                                  <Pipette className="h-4 w-4" />
                                </button>

                                <div
                                  className="h-7 w-7 rounded-full border border-slate-300 dark:border-slate-700 shrink-0 shadow-xs"
                                  style={{ backgroundColor: geofenceColor }}
                                />

                                {/* Rainbow Hue Slider */}
                                <input
                                  type="range"
                                  min={0}
                                  max={360}
                                  value={geofenceHue}
                                  onChange={handleGeofenceHueSliderChange}
                                  className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-white"
                                  style={{
                                    background:
                                      "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
                                  }}
                                />
                              </div>

                              {/* RGB Number Input Fields */}
                              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex flex-col items-center">
                                  <input
                                    type="number"
                                    min={0}
                                    max={255}
                                    value={geofenceRgb.r}
                                    onChange={(e) => handleGeofenceRgbInputChange("r", e.target.value)}
                                    className="w-full h-8 px-1 text-center text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                  />
                                  <span className="text-[10px] font-bold text-slate-400 mt-0.5">R</span>
                                </div>

                                <div className="flex flex-col items-center">
                                  <input
                                    type="number"
                                    min={0}
                                    max={255}
                                    value={geofenceRgb.g}
                                    onChange={(e) => handleGeofenceRgbInputChange("g", e.target.value)}
                                    className="w-full h-8 px-1 text-center text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                  />
                                  <span className="text-[10px] font-bold text-slate-400 mt-0.5">G</span>
                                </div>

                                <div className="flex flex-col items-center">
                                  <input
                                    type="number"
                                    min={0}
                                    max={255}
                                    value={geofenceRgb.b}
                                    onChange={(e) => handleGeofenceRgbInputChange("b", e.target.value)}
                                    className="w-full h-8 px-1 text-center text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                  />
                                  <span className="text-[10px] font-bold text-slate-400 mt-0.5">B</span>
                                </div>
                              </div>

                              {/* Preset Swatches Gallery */}
                              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100 dark:border-slate-800">
                                {PRESET_COLORS.map((c) => (
                                  <button
                                    key={c}
                                    type="button"
                                    onClick={() => setGeofenceColor(c)}
                                    style={{ backgroundColor: c }}
                                    className={cn(
                                      "h-5 w-5 rounded-full transition-transform cursor-pointer shrink-0 active:scale-90 shadow-2xs border border-white/40",
                                      geofenceColor.toLowerCase() === c.toLowerCase()
                                        ? "ring-2 ring-offset-1 ring-[#0089FF] scale-110"
                                        : "opacity-85 hover:opacity-100"
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Tolerance (metres) Slider (Exact match with reference Image media_1793619634803_2e796f02.png) */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              Tolerance (metres)
                            </label>
                            <span className="text-xs font-bold font-mono text-[#0089FF]">
                              {geofenceTolerance} m
                            </span>
                          </div>
                          <input
                            type="range"
                            min={1}
                            max={500}
                            value={geofenceTolerance}
                            onChange={(e) => setGeofenceTolerance(Number(e.target.value))}
                            className="w-full accent-[#0089FF] cursor-pointer"
                          />
                        </div>

                        {/* Address */}
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Address
                          </label>
                          <input
                            type="text"
                            value={geofenceAddress}
                            onChange={(e) => setGeofenceAddress(e.target.value)}
                            placeholder="Location address or landmark info"
                            className="w-full h-8.5 px-3 rounded-xl border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF]"
                          />
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Description</label>
                          <textarea
                            rows={2}
                            value={geofenceDescription}
                            onChange={(e) => setGeofenceDescription(e.target.value)}
                            placeholder="Optional description or security notes..."
                            className="w-full p-2.5 rounded-xl border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF] resize-none"
                          />
                        </div>
                      </form>
                    ) : (
                      /* File Upload View for KML / Excel */
                      <div className="flex-1 flex flex-col p-4 justify-between">
                        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center space-y-2.5 bg-white dark:bg-slate-900">
                          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#0089FF] flex items-center justify-center mx-auto">
                            <Upload className="h-5 w-5" />
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            Upload {geofenceTab} File
                          </h4>
                          <p className="text-[11px] text-muted-foreground">
                            Drag & drop file here or click to browse
                          </p>
                          <button
                            type="button"
                            onClick={() => toast.success("Template downloaded")}
                            className="text-[11px] font-semibold text-[#0089FF] hover:underline cursor-pointer"
                          >
                            Download Sample Template
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Pinned Action Buttons */}
                    <div className="p-3 bg-white dark:bg-slate-900 border-t border-[#DFE3EB] dark:border-slate-800 flex items-center justify-end gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setLocationTab("info")}
                        className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-all cursor-pointer active:scale-95"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveGeofenceFromTab}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-[#0089FF] hover:bg-[#0070d6] rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
                      >
                        Save Geofence
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. The Map Canvas Area (Full Width when 'info', takes remaining space when 'address' or 'geofence') */}
                <div className="flex-1 min-h-0 relative w-full h-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
                  {/* Floating Location Search on Top-Left */}
                  <div className="absolute top-4 left-4 z-[400] w-80 max-w-[calc(100%-120px)]">
                    <form
                      onSubmit={handleLocationSearch}
                      className="relative flex items-center shadow-lg rounded-xl overflow-hidden"
                    >
                      <input
                        type="text"
                        value={locationSearchInput}
                        onChange={(e) => setLocationSearchInput(e.target.value)}
                        placeholder="Search Location OR Lat, Lng..."
                        className="w-full text-xs pl-8 pr-16 py-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0089FF]"
                      />
                      <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                      <button
                        type="submit"
                        className="absolute right-1.5 px-2.5 py-1 text-[11px] font-bold bg-[#0089FF] hover:bg-blue-600 text-white rounded-lg transition-colors cursor-pointer"
                      >
                        Search
                      </button>
                    </form>
                  </div>

                  {/* Floating Right Controls: Change Map above Zoom In / Out */}
                  <div className="absolute top-4 right-4 z-[500] flex flex-col items-center gap-2 select-none">
                    {/* Change Map Button + Theme Overlay Menu */}
                    <div className="relative" ref={mapMenuRef}>
                      <button
                        type="button"
                        onClick={() => setIsMapMenuOpen((prev) => !prev)}
                        title="Change Map Layer"
                        className={cn(
                          "w-10 h-10 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-center transition-all cursor-pointer",
                          isMapMenuOpen
                            ? "bg-[#0089FF] text-white shadow-sky-500/25 ring-2 ring-[#0089FF]/30"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF]"
                        )}
                      >
                        <Layers className="h-4.5 w-4.5 stroke-[2]" />
                      </button>

                      {/* Theme Overlay Menu for Map Selection (opens to the left of the button) */}
                      {isMapMenuOpen && (
                        <div className="absolute right-[calc(100%+10px)] top-0 z-50 w-56 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl shadow-slate-900/20 overflow-hidden p-1.5 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
                          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-slate-100 dark:border-slate-800">
                            Select Map Layer
                          </div>
                          {MAP_TILE_OPTIONS.map((layer) => {
                            const isActive = selectedMapLayer === layer.id;
                            return (
                              <button
                                key={layer.id}
                                type="button"
                                onClick={() => {
                                  setSelectedMapLayer(layer.id);
                                  setIsMapMenuOpen(false);
                                  toast.success(`Switched map layer to ${layer.label}`);
                                }}
                                className={cn(
                                  "w-full h-8 px-2.5 rounded-xl text-xs font-medium text-left flex items-center justify-between transition-colors cursor-pointer",
                                  isActive
                                    ? "bg-[#0089FF]/12 text-[#0089FF] font-semibold"
                                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF]"
                                )}
                              >
                                <span className="truncate">{layer.label}</span>
                                {isActive && (
                                  <Check className="h-3.5 w-3.5 text-[#0089FF] shrink-0 ml-1.5 stroke-[2.5]" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Zoom In & Zoom Out Controls */}
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-1 shadow-lg flex flex-col items-center shrink-0 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => locationMapInstanceRef.current?.zoomIn()}
                        title="Zoom in"
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF] transition-all cursor-pointer"
                      >
                        <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
                      </button>
                      <div className="w-6 h-[1px] bg-slate-200 dark:bg-slate-800 my-0.5" />
                      <button
                        type="button"
                        onClick={() => locationMapInstanceRef.current?.zoomOut()}
                        title="Zoom out"
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF] transition-all cursor-pointer"
                      >
                        <Minus className="h-4.5 w-4.5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>

                  {/* Floating Location Info Chip on Bottom-Left */}
                  <div className="absolute bottom-4 left-4 z-[400] max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 shadow-lg text-xs">
                    <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#0089FF] shrink-0" />
                      <span className="truncate">{activeIncidentForLocation.location}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-3">
                      <span>GPS: <strong className="font-mono text-foreground">{incidentCoords.lat.toFixed(5)}, {incidentCoords.lng.toFixed(5)}</strong></span>
                      <span>·</span>
                      <span>Speed: <strong className="text-[#0089FF]">{activeIncidentForLocation.speed}</strong></span>
                      <span>·</span>
                      <span>Driver: <strong className="text-foreground">{activeIncidentForLocation.driver}</strong></span>
                    </div>
                  </div>

                  {/* Leaflet Map DOM Canvas */}
                  <div ref={locationMapRef} className="w-full h-full relative" />

                  {/* Map Scale Indicator */}
                  <div className="absolute bottom-4 right-4 z-[400] bg-white/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 px-2.5 py-1 rounded-md text-[10.5px] font-mono text-slate-700 dark:text-slate-300 shadow-sm flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>0.05 km</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* FULL-SIZE SNAPSHOT VIEWER MODAL */}
      <Dialog
        open={Boolean(activeIncidentForSnapshot)}
        onOpenChange={(open) => !open && setActiveIncidentForSnapshot(null)}
      >
        <DialogContent className="max-w-2xl border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 p-0 overflow-hidden">
          {activeIncidentForSnapshot && (
            <div className="flex flex-col">
              <div className="flex items-center justify-between border-b border-[#DFE3EB] dark:border-slate-800 px-4 py-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Snapshot Evidence · {activeIncidentForSnapshot.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    {activeIncidentForSnapshot.vehicleNo} · {activeIncidentForSnapshot.dateTimeRange}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Snapshot Downloaded");
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/40 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </button>
              </div>

              <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                <img
                  src={activeIncidentForSnapshot.thumbnail}
                  alt="Incident Snapshot"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
