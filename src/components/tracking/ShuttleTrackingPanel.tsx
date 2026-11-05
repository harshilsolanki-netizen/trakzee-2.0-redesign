import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Accessibility,
  Armchair,
  BusFront,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  User,
  Phone,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  X,
  ExternalLink,
  FileText,
  Filter,
  ArrowUpDown,
  RotateCcw,
  RotateCw,
  Key,
  BatteryCharging,
  Wifi,
  Radio,
  Search,
  Check,
  AlertCircle,
  Calendar,
  Navigation,
  Flag,
  Share2,
  TrendingUp,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export interface ShuttlePassenger {
  name: string;
  gender: "F" | "M";
  statusText: string;
  statusType: "boarded" | "noshow" | "notboarded" | "pending";
  phone: string;
  isSpecialNeeds?: boolean;
}

export interface ShuttleStop {
  id: string;
  stopNumber: string;
  totalStops: string;
  name: string;
  planned: string;
  actual?: string | null;
  eta?: string | null;
  delayBadge?: string;
  paxSummary: string;
  status: "completed" | "current" | "upcoming";
  color: string;
  passengers?: ShuttlePassenger[];
}

export interface ShuttleTrip {
  id: string;
  code: string;
  name: string;
  paxCount: string;
  shift: string;
  shiftType: "IN" | "OUT";
  eta: string;
  delay: string;
  isDelayed: boolean;
  status: "running" | "completed" | "upcoming" | "failed";
  dotColor: "red" | "green" | "amber";
  vehicles: {
    plate: string;
    time: string;
    driver: string;
    telematics: {
      key: boolean;
      battery: boolean;
      gps: boolean;
      network: boolean;
      alert: boolean;
    };
  }[];
  passengerStats: {
    totalEmployees: number;
    boarded: number;
    notBoarded: number;
    pendingPickup: number;
    women: number;
    noShow: number;
    cancelledGrey: number;
    cancelledCyan: number;
  };
  details: {
    shift: string;
    status: string;
    planned: string;
    actual: string;
    vendor: string;
  };
  driver: {
    name: string;
    rating: number;
    phone: string;
  };
  vehicle: {
    plate: string;
    fleet: string;
    seats: number;
    changedAlert?: string;
  };
  stops: ShuttleStop[];
  distanceAudit: {
    tripNumber: string;
    plannedDistance: string;
    actualDistance: string;
    variance: string;
    status: string;
  };
}

const MOCK_SHUTTLE_TRIPS: ShuttleTrip[] = [
  {
    id: "trip-1020059",
    code: "Trip-1020059",
    name: "Thane West - BKC Tech Park Line 4",
    paxCount: "2/17",
    shift: "07:00 IN",
    shiftType: "IN",
    eta: "ETA: 07:15 AM",
    delay: "~-24 mins",
    isDelayed: true,
    status: "running",
    dotColor: "red",
    vehicles: [
      {
        plate: "MH-04-MT-8985",
        time: "10-07-2026 07:47:36 PM",
        driver: "Jonathan Smith",
        telematics: { key: true, battery: true, gps: true, network: true, alert: false },
      },
      {
        plate: "MH-04-MT-8985",
        time: "10-07-2026 07:47:36 PM",
        driver: "Michele Goble",
        telematics: { key: true, battery: true, gps: true, network: true, alert: false },
      },
    ],
    passengerStats: {
      totalEmployees: 71,
      boarded: 2,
      notBoarded: 2,
      pendingPickup: 2,
      women: 1,
      noShow: 1,
      cancelledGrey: 1,
      cancelledCyan: 1,
    },
    details: {
      shift: "07:00 IN",
      status: "ONGOING",
      planned: "06:20 - 07:00",
      actual: "06:20 - --",
      vendor: "City Express Logistics",
    },
    driver: {
      name: "Jonathan Smith",
      rating: 4.2,
      phone: "+919000254155",
    },
    vehicle: {
      plate: "MH-04-MT-8985",
      fleet: "8993",
      seats: 17,
      changedAlert: "Vehicle Changed - Previous: MH-04-XX-1234",
    },
    stops: [
      {
        id: "stop-01",
        stopNumber: "01",
        totalStops: "06",
        name: "THANE STATION KOPRI",
        planned: "06:20 AM",
        actual: "07:00 AM",
        delayBadge: "+40 mins",
        paxSummary: "1/3",
        status: "completed",
        color: "#0089FF",
        passengers: [
          {
            name: "Rhea Sharma",
            gender: "F",
            statusText: "Boarded: 06:18",
            statusType: "boarded",
            phone: "+91 9820011223",
            isSpecialNeeds: true,
          },
          {
            name: "Amit Parekh",
            gender: "M",
            statusText: "No-show",
            statusType: "noshow",
            phone: "+91 9820011224",
          },
          {
            name: "Raj Pandit",
            gender: "M",
            statusText: "Not Boarded",
            statusType: "notboarded",
            phone: "+91 9820011225",
            isSpecialNeeds: true,
          },
        ],
      },
      {
        id: "stop-02",
        stopNumber: "02",
        totalStops: "06",
        name: "TEEN HATH NAKA",
        planned: "06:25 AM",
        actual: null,
        eta: "07:00 AM",
        delayBadge: "+40 mins",
        paxSummary: "1/3",
        status: "current",
        color: "#DC2626",
        passengers: [
          {
            name: "Pooja Mehta",
            gender: "F",
            statusText: "Pending Pickup",
            statusType: "pending",
            phone: "+91 9820011226",
          },
          {
            name: "Suresh Iyer",
            gender: "M",
            statusText: "Pending Pickup",
            statusType: "pending",
            phone: "+91 9820011227",
          },
          {
            name: "Kunal Shah",
            gender: "M",
            statusText: "Pending Pickup",
            statusType: "pending",
            phone: "+91 9820011228",
          },
        ],
      },
      {
        id: "stop-03",
        stopNumber: "03",
        totalStops: "06",
        name: "TEEN HATH NAKA",
        planned: "06:25 AM",
        actual: "--",
        paxSummary: "1/3",
        status: "upcoming",
        color: "#16A34A",
        passengers: [],
      },
      {
        id: "stop-04",
        stopNumber: "04",
        totalStops: "06",
        name: "TEEN HATH NAKA",
        planned: "06:25 AM",
        actual: "--",
        paxSummary: "1/3",
        status: "upcoming",
        color: "#EA580C",
        passengers: [],
      },
      {
        id: "stop-05",
        stopNumber: "05",
        totalStops: "06",
        name: "TEEN HATH NAKA",
        planned: "06:25 AM",
        actual: "--",
        paxSummary: "1/3",
        status: "upcoming",
        color: "#64748B",
        passengers: [],
      },
      {
        id: "stop-06",
        stopNumber: "06",
        totalStops: "06",
        name: "TEEN HATH NAKA",
        planned: "06:25 AM",
        actual: "--",
        paxSummary: "1/3",
        status: "upcoming",
        color: "#64748B",
        passengers: [],
      },
    ],
    distanceAudit: {
      tripNumber: "3211332",
      plannedDistance: "28.4 km",
      actualDistance: "29.5 km",
      variance: "+0.7 km",
      status: "Within Policy Limit",
    },
  },
  {
    id: "trip-1020058",
    code: "Trip-1020058",
    name: "Airoli Mindspace - Powai Express",
    paxCount: "2/17",
    shift: "17:30 OUT",
    shiftType: "OUT",
    eta: "ETA: 07:15 AM",
    delay: "On time",
    isDelayed: false,
    status: "running",
    dotColor: "green",
    vehicles: [
      {
        plate: "MH-04-MT-8985",
        time: "10-07-2026 07:47:36 PM",
        driver: "Jonathan Smith",
        telematics: { key: true, battery: true, gps: true, network: true, alert: false },
      },
    ],
    passengerStats: {
      totalEmployees: 54,
      boarded: 12,
      notBoarded: 3,
      pendingPickup: 15,
      women: 4,
      noShow: 1,
      cancelledGrey: 1,
      cancelledCyan: 1,
    },
    details: {
      shift: "17:30 OUT",
      status: "ONGOING",
      planned: "17:30 - 18:45",
      actual: "17:30 - --",
      vendor: "City Express Logistics",
    },
    driver: {
      name: "Jonathan Smith",
      rating: 4.5,
      phone: "+919000254155",
    },
    vehicle: {
      plate: "MH-04-MT-8985",
      fleet: "8993",
      seats: 17,
    },
    stops: [
      {
        id: "stop-01-t2",
        stopNumber: "01",
        totalStops: "05",
        name: "AIROLI MINDSPACE GATE 2",
        planned: "17:30 PM",
        actual: "17:30 PM",
        paxSummary: "8/10",
        status: "completed",
        color: "#0089FF",
        passengers: [
          { name: "Rahul Verma", gender: "M", statusText: "Boarded: 17:28", statusType: "boarded", phone: "+91 9820011230" },
          { name: "Sneha Patil", gender: "F", statusText: "Boarded: 17:29", statusType: "boarded", phone: "+91 9820011231" },
        ],
      },
      {
        id: "stop-02-t2",
        stopNumber: "02",
        totalStops: "05",
        name: "POWAI PLAZA",
        planned: "18:15 PM",
        actual: null,
        eta: "18:15 PM",
        paxSummary: "4/7",
        status: "current",
        color: "#16A34A",
      },
      {
        id: "stop-03-t2",
        stopNumber: "03",
        totalStops: "05",
        name: "HIRANANDANI GARDENS",
        planned: "18:30 PM",
        actual: "--",
        paxSummary: "0/5",
        status: "upcoming",
        color: "#64748B",
      },
    ],
    distanceAudit: {
      tripNumber: "3211333",
      plannedDistance: "22.1 km",
      actualDistance: "22.3 km",
      variance: "+0.2 km",
      status: "Within Policy Limit",
    },
  },
  {
    id: "trip-1020057",
    code: "Trip-1020057",
    name: "Thane West - BKC Tech Park Line 4",
    paxCount: "2/17",
    shift: "07:00 IN",
    shiftType: "IN",
    eta: "ETA: 07:15 AM",
    delay: "~-24 mins",
    isDelayed: true,
    status: "upcoming",
    dotColor: "amber",
    vehicles: [
      {
        plate: "MH-04-MT-8985",
        time: "10-07-2026 07:47:36 PM",
        driver: "Jonathan Smith",
        telematics: { key: true, battery: true, gps: true, network: true, alert: false },
      },
    ],
    passengerStats: {
      totalEmployees: 32,
      boarded: 0,
      notBoarded: 0,
      pendingPickup: 32,
      women: 6,
      noShow: 0,
      cancelledGrey: 0,
      cancelledCyan: 0,
    },
    details: {
      shift: "07:00 IN",
      status: "UPCOMING",
      planned: "07:00 - 08:15",
      actual: "--",
      vendor: "City Express Logistics",
    },
    driver: {
      name: "Jonathan Smith",
      rating: 4.2,
      phone: "+919000254155",
    },
    vehicle: {
      plate: "MH-04-MT-8985",
      fleet: "8993",
      seats: 17,
    },
    stops: [
      {
        id: "stop-01-t3",
        stopNumber: "01",
        totalStops: "04",
        name: "THANE WEST DEPOT",
        planned: "07:00 AM",
        actual: "--",
        paxSummary: "0/15",
        status: "upcoming",
        color: "#64748B",
      },
    ],
    distanceAudit: {
      tripNumber: "3211334",
      plannedDistance: "28.4 km",
      actualDistance: "--",
      variance: "0 km",
      status: "Within Policy Limit",
    },
  },
  {
    id: "trip-1020056",
    code: "Trip-1020056",
    name: "Thane West - BKC Tech Park Line 4",
    paxCount: "2/17",
    shift: "07:00 IN",
    shiftType: "IN",
    eta: "ETA: 07:15 AM",
    delay: "~-24 mins",
    isDelayed: true,
    status: "running",
    dotColor: "green",
    vehicles: [
      {
        plate: "MH-04-MT-8985",
        time: "10-07-2026 07:47:36 PM",
        driver: "Jonathan Smith",
        telematics: { key: true, battery: true, gps: true, network: true, alert: false },
      },
    ],
    passengerStats: { totalEmployees: 40, boarded: 10, notBoarded: 2, pendingPickup: 28, women: 5, noShow: 0, cancelledGrey: 0, cancelledCyan: 0 },
    details: { shift: "07:00 IN", status: "ONGOING", planned: "07:00 - 08:15", actual: "07:00 - --", vendor: "City Express Logistics" },
    driver: { name: "Jonathan Smith", rating: 4.2, phone: "+919000254155" },
    vehicle: { plate: "MH-04-MT-8985", fleet: "8993", seats: 17 },
    stops: [],
    distanceAudit: { tripNumber: "3211335", plannedDistance: "28.4 km", actualDistance: "14.2 km", variance: "+0.1 km", status: "Within Policy Limit" },
  },
  {
    id: "trip-1020055",
    code: "Trip-1020055",
    name: "Thane West - BKC Tech Park Line 4",
    paxCount: "2/17",
    shift: "07:00 IN",
    shiftType: "IN",
    eta: "ETA: 07:15 AM",
    delay: "~-24 mins",
    isDelayed: true,
    status: "running",
    dotColor: "green",
    vehicles: [
      {
        plate: "MH-04-MT-8985",
        time: "10-07-2026 07:47:36 PM",
        driver: "Jonathan Smith",
        telematics: { key: true, battery: true, gps: true, network: true, alert: false },
      },
    ],
    passengerStats: { totalEmployees: 35, boarded: 8, notBoarded: 1, pendingPickup: 26, women: 4, noShow: 0, cancelledGrey: 0, cancelledCyan: 0 },
    details: { shift: "07:00 IN", status: "ONGOING", planned: "07:00 - 08:15", actual: "07:00 - --", vendor: "City Express Logistics" },
    driver: { name: "Jonathan Smith", rating: 4.2, phone: "+919000254155" },
    vehicle: { plate: "MH-04-MT-8985", fleet: "8993", seats: 17 },
    stops: [],
    distanceAudit: { tripNumber: "3211336", plannedDistance: "28.4 km", actualDistance: "10.0 km", variance: "-0.2 km", status: "Within Policy Limit" },
  },
  {
    id: "trip-1020054",
    code: "Trip-1020054",
    name: "Thane West - BKC Tech Park Line 4",
    paxCount: "2/17",
    shift: "07:00 IN",
    shiftType: "IN",
    eta: "ETA: 07:15 AM",
    delay: "~-24 mins",
    isDelayed: true,
    status: "failed",
    dotColor: "green",
    vehicles: [
      {
        plate: "MH-04-MT-8985",
        time: "10-07-2026 07:47:36 PM",
        driver: "Jonathan Smith",
        telematics: { key: false, battery: true, gps: false, network: true, alert: true },
      },
    ],
    passengerStats: { totalEmployees: 20, boarded: 0, notBoarded: 18, pendingPickup: 0, women: 2, noShow: 1, cancelledGrey: 1, cancelledCyan: 1 },
    details: { shift: "07:00 IN", status: "FAILED", planned: "07:00 - 08:15", actual: "Cancelled", vendor: "City Express Logistics" },
    driver: { name: "Jonathan Smith", rating: 4.2, phone: "+919000254155" },
    vehicle: { plate: "MH-04-MT-8985", fleet: "8993", seats: 17 },
    stops: [],
    distanceAudit: { tripNumber: "3211337", plannedDistance: "28.4 km", actualDistance: "0.0 km", variance: "-28.4 km", status: "Route Incomplete" },
  },
];

// Custom Bus Seat Icon
function BusSeatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="8" y="2" width="6" height="3" rx="1.5" />
      <path d="M7 6h8a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a2 2 0 0 1 2-2z" />
      <path d="M4 15h14a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2z" />
      <path d="M7 19v2" />
      <path d="M15 19v2" />
    </svg>
  );
}

// Custom Female Icon with bold 2.5 stroke
function FemaleGenderIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="9" r="5" />
      <path d="M12 14v7" />
      <path d="M8.5 17.5h7" />
    </svg>
  );
}

// Custom Male Icon with bold 2.5 stroke
function MaleGenderIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="9.5" cy="14.5" r="5" />
      <path d="M19 5l-5.8 5.8" />
      <path d="M14 5h5v5" />
    </svg>
  );
}

interface ShuttleTrackingPanelProps {
  query?: string;
  selectedTrip?: ShuttleTrip | null;
  onSelectTrip?: (trip: ShuttleTrip | null) => void;
}

export function ShuttleTrackingPanel({
  query = "",
  selectedTrip: propSelectedTrip,
  onSelectTrip,
}: ShuttleTrackingPanelProps) {
  const [internalSelectedTrip, setInternalSelectedTrip] = useState<ShuttleTrip | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "running" | "completed" | "upcoming" | "failed">("all");
  const [activePassengerFilter, setActivePassengerFilter] = useState<string>("boarded");
  const [tripDetailsExpanded, setTripDetailsExpanded] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState(query);
  const [groupExpanded, setGroupExpanded] = useState(true);
  const [expandedTripIds, setExpandedTripIds] = useState<Record<string, boolean>>({
    "trip-1020059": true,
    "trip-1020058": true,
  });
  const [expandedStopIds, setExpandedStopIds] = useState<Record<string, boolean>>({
    "stop-01": true,
  });
  const [distanceAuditOpen, setDistanceAuditOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleReload = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Shuttle trips refreshed");
    }, 600);
  };

  const selectedTrip = propSelectedTrip !== undefined ? propSelectedTrip : internalSelectedTrip;

  const handleSelectTrip = (trip: ShuttleTrip) => {
    if (onSelectTrip) {
      onSelectTrip(trip);
    } else {
      setInternalSelectedTrip(trip);
    }
  };

  const handleBackToTrips = () => {
    if (onSelectTrip) {
      onSelectTrip(null);
    } else {
      setInternalSelectedTrip(null);
    }
  };

  const toggleTripExpand = (tripId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTripIds((prev) => ({ ...prev, [tripId]: !prev[tripId] }));
  };

  const toggleStopExpand = (stopId: string) => {
    setExpandedStopIds((prev) => ({ ...prev, [stopId]: !prev[stopId] }));
  };

  const filteredTrips = useMemo(() => {
    return MOCK_SHUTTLE_TRIPS.filter((trip) => {
      if (activeFilter !== "all" && trip.status !== activeFilter) {
        return false;
      }
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        trip.name.toLowerCase().includes(q) ||
        trip.code.toLowerCase().includes(q) ||
        trip.vehicles.some(
          (v) =>
            v.plate.toLowerCase().includes(q) ||
            v.driver.toLowerCase().includes(q)
        )
      );
    });
  }, [activeFilter, searchQuery]);

  // Exact 8 Status Tabs matching Reference Image 1 (media_1793876125474_e4bd59cb.jpg) & Reference media_1793875691925_b728b489.png
  const passengerStatusTabs = useMemo(() => {
    if (!selectedTrip) return [];
    const stats = selectedTrip.passengerStats;
    return [
      {
        key: "total",
        label: "Total",
        count: stats.totalEmployees,
        bgColor: "#F8FAFC",
        borderColor: "#E2E8F0",
        textColor: "#334155",
        dotColor: "#64748B",
        activeBgColor: "#223344",
        activeBorderColor: "#223344",
        activeTextColor: "#FFFFFF",
      },
      {
        key: "boarded",
        label: "Boarded",
        count: stats.boarded,
        bgColor: "#ECFDF3",
        borderColor: "#A6F4C5",
        textColor: "#008446",
        dotColor: "#008446",
        activeBgColor: "#008446",
        activeBorderColor: "#008446",
        activeTextColor: "#FFFFFF",
      },
      {
        key: "not_boarded",
        label: "Not Boarded",
        count: stats.notBoarded,
        bgColor: "#FFF1F3",
        borderColor: "#FCCEE8",
        textColor: "#DC2626",
        dotColor: "#DC2626",
        activeBgColor: "#DC2626",
        activeBorderColor: "#DC2626",
        activeTextColor: "#FFFFFF",
      },
      {
        key: "pending_pickup",
        label: "Pending Pickup",
        count: stats.pendingPickup,
        bgColor: "#FEF7E6",
        borderColor: "#FEDF89",
        textColor: "#C46F37",
        dotColor: "#C46F37",
        activeBgColor: "#C46F37",
        activeBorderColor: "#C46F37",
        activeTextColor: "#FFFFFF",
      },
      {
        key: "women",
        label: "Women",
        count: stats.women,
        bgColor: "#FDF2F8",
        borderColor: "#FBCFE8",
        textColor: "#BE185D",
        dotColor: "#BE185D",
        activeBgColor: "#BE185D",
        activeBorderColor: "#BE185D",
        activeTextColor: "#FFFFFF",
      },
      {
        key: "no_show",
        label: "No-Show",
        count: stats.noShow,
        bgColor: "#F5F3FF",
        borderColor: "#DDD6FE",
        textColor: "#6C50D8",
        dotColor: "#6C50D8",
        activeBgColor: "#6C50D8",
        activeBorderColor: "#6C50D8",
        activeTextColor: "#FFFFFF",
      },
      {
        key: "cancelled_grey",
        label: "Cancelled",
        count: stats.cancelledGrey,
        bgColor: "#F1F5F9",
        borderColor: "#CBD5E1",
        textColor: "#64748B",
        dotColor: "#64748B",
        activeBgColor: "#64748B",
        activeBorderColor: "#64748B",
        activeTextColor: "#FFFFFF",
      },
      {
        key: "cancelled_cyan",
        label: "Ad-hoc",
        count: stats.cancelledCyan,
        bgColor: "#ECFEFF",
        borderColor: "#A5F3FC",
        textColor: "#0891B2",
        dotColor: "#0891B2",
        activeBgColor: "#0891B2",
        activeBorderColor: "#0891B2",
        activeTextColor: "#FFFFFF",
      },
    ];
  }, [selectedTrip]);

  return (
    <div className="flex-1 min-h-0 relative [perspective:1200px] bg-white dark:bg-slate-900 overflow-hidden rounded-b-2xl select-none font-sans">
      <div
        className={cn(
          "w-full h-full relative transition-transform duration-700 ease-in-out [transform-style:preserve-3d]",
          selectedTrip ? "[transform:rotateY(-180deg)]" : "[transform:rotateY(0deg)]"
        )}
      >
        {/* ==================================================================================== */}
        {/* FRONT FACE: Shuttle Trips List View (1:1 with media_1793871163487_7dfbf3c3.jpg)      */}
        {/* ==================================================================================== */}
        <div className="absolute inset-0 flex flex-col min-h-0 bg-white dark:bg-slate-900 [backface-visibility:hidden]">
          {/* 1. Status KPI Pills Bar */}
          <div className="px-2 py-1.5 bg-slate-50/50 dark:bg-slate-950/40 select-none shrink-0 border-b border-slate-200/60 dark:border-slate-800/60">
            <div className="grid grid-cols-5 gap-1.5">
              {/* Running: 21 */}
              <button
                type="button"
                onClick={() => setActiveFilter(activeFilter === "running" ? "all" : "running")}
                style={{
                  backgroundColor: activeFilter === "running" ? "#008446" : "#ECFDF3",
                  borderColor: activeFilter === "running" ? "#008446" : "#A6F4C5",
                  color: activeFilter === "running" ? "#FFFFFF" : "#008446",
                }}
                className={cn(
                  "flex flex-col items-center justify-center h-[42px] px-0.5 rounded-xl transition-all duration-150 cursor-pointer select-none border font-sans",
                  activeFilter === "running" && "shadow-sm shadow-[#008446]/25 font-bold scale-[1.02]"
                )}
              >
                <div className="flex items-center gap-1.5 leading-none">
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: activeFilter === "running" ? "#FFFFFF" : "#008446",
                    }}
                  />
                  <span className="text-[13px] font-bold tabular-nums leading-none">21</span>
                </div>
                <span className="text-[10px] font-bold tracking-wide uppercase leading-tight mt-0.5">
                  RUNNING
                </span>
              </button>

              {/* Completed: 2 */}
              <button
                type="button"
                onClick={() => setActiveFilter(activeFilter === "completed" ? "all" : "completed")}
                style={{
                  backgroundColor: activeFilter === "completed" ? "#0089FF" : "#EFF6FF",
                  borderColor: activeFilter === "completed" ? "#0089FF" : "#BFDBFE",
                  color: activeFilter === "completed" ? "#FFFFFF" : "#0089FF",
                }}
                className={cn(
                  "flex flex-col items-center justify-center h-[42px] px-0.5 rounded-xl transition-all duration-150 cursor-pointer select-none border font-sans",
                  activeFilter === "completed" && "shadow-sm shadow-[#0089FF]/25 font-bold scale-[1.02]"
                )}
              >
                <div className="flex items-center gap-1.5 leading-none">
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: activeFilter === "completed" ? "#FFFFFF" : "#0089FF",
                    }}
                  />
                  <span className="text-[13px] font-bold tabular-nums leading-none">2</span>
                </div>
                <span className="text-[10px] font-bold tracking-wide uppercase leading-tight mt-0.5">
                  COMPLETED
                </span>
              </button>

              {/* Upcoming: 4 */}
              <button
                type="button"
                onClick={() => setActiveFilter(activeFilter === "upcoming" ? "all" : "upcoming")}
                style={{
                  backgroundColor: activeFilter === "upcoming" ? "#C46F37" : "#FEF7E6",
                  borderColor: activeFilter === "upcoming" ? "#C46F37" : "#FEDF89",
                  color: activeFilter === "upcoming" ? "#FFFFFF" : "#C46F37",
                }}
                className={cn(
                  "flex flex-col items-center justify-center h-[42px] px-0.5 rounded-xl transition-all duration-150 cursor-pointer select-none border font-sans",
                  activeFilter === "upcoming" && "shadow-sm shadow-[#C46F37]/25 font-bold scale-[1.02]"
                )}
              >
                <div className="flex items-center gap-1.5 leading-none">
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: activeFilter === "upcoming" ? "#FFFFFF" : "#C46F37",
                    }}
                  />
                  <span className="text-[13px] font-bold tabular-nums leading-none">4</span>
                </div>
                <span className="text-[10px] font-bold tracking-wide uppercase leading-tight mt-0.5">
                  UPCOMING
                </span>
              </button>

              {/* Failed: 19 */}
              <button
                type="button"
                onClick={() => setActiveFilter(activeFilter === "failed" ? "all" : "failed")}
                style={{
                  backgroundColor: activeFilter === "failed" ? "#C70036" : "#FFF1F3",
                  borderColor: activeFilter === "failed" ? "#C70036" : "#FCCEE8",
                  color: activeFilter === "failed" ? "#FFFFFF" : "#C70036",
                }}
                className={cn(
                  "flex flex-col items-center justify-center h-[42px] px-0.5 rounded-xl transition-all duration-150 cursor-pointer select-none border font-sans",
                  activeFilter === "failed" && "shadow-sm shadow-[#C70036]/25 font-bold scale-[1.02]"
                )}
              >
                <div className="flex items-center gap-1.5 leading-none">
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: activeFilter === "failed" ? "#FFFFFF" : "#C70036",
                    }}
                  />
                  <span className="text-[13px] font-bold tabular-nums leading-none">19</span>
                </div>
                <span className="text-[10px] font-bold tracking-wide uppercase leading-tight mt-0.5">
                  FAILED
                </span>
              </button>

              {/* Total: 48 */}
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                style={{
                  backgroundColor: activeFilter === "all" ? "#223344" : "#F8FAFC",
                  borderColor: activeFilter === "all" ? "#223344" : "#E2E8F0",
                  color: activeFilter === "all" ? "#FFFFFF" : "#223344",
                }}
                className={cn(
                  "flex flex-col items-center justify-center h-[42px] px-0.5 rounded-xl transition-all duration-150 cursor-pointer select-none border font-sans",
                  activeFilter === "all" && "shadow-sm shadow-[#223344]/25 font-bold scale-[1.02]"
                )}
              >
                <div className="flex items-center gap-1.5 leading-none">
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: activeFilter === "all" ? "#FFFFFF" : "#64748B",
                    }}
                  />
                  <span className="text-[13px] font-bold tabular-nums leading-none">48</span>
                </div>
                <span className="text-[10px] font-bold tracking-wide uppercase leading-tight mt-0.5">
                  TOTAL
                </span>
              </button>
            </div>
          </div>

          {/* 2. Search & Filter Bar (Boxed action buttons matching Object Panel 1:1) */}
          <div className="px-2 py-1.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex items-center gap-1.5 shrink-0">
            {/* Search input with clear button */}
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Shuttle, Trip, Driver, Vehicle, Route..."
                className="h-8 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950/40 pl-3 pr-8 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF] focus:bg-white dark:focus:bg-slate-900 transition-colors font-sans"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-1.5 p-0.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <Search className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              )}
            </div>

            {/* Action Toolbar Icons inside standard boxed buttons matching Object panel */}
            <div className="flex items-center gap-1.5 shrink-0 text-slate-600 dark:text-slate-400">
              {/* 1. Reload Button inside Box */}
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={handleReload}
                      className={cn(
                        "group relative h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:border-[#0089FF]/40 transition-all shadow-2xs cursor-pointer active:scale-95",
                        isRefreshing && "bg-sky-50 dark:bg-sky-950/70 text-[#0089FF] border-[#0089FF] shadow-[0_0_12px_rgba(0,137,255,0.35)]"
                      )}
                    >
                      <RotateCw
                        className={cn(
                          "h-3.5 w-3.5 stroke-[2.2] transition-transform duration-500 ease-out group-hover:rotate-180",
                          isRefreshing && "animate-spin text-[#0089FF] duration-700"
                        )}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="font-semibold text-xs bg-slate-900 text-white border-slate-800">
                    Refresh Shuttle Trips
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* 2. Filter Button inside Box */}
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => toast.info("Filter options")}
                      className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:border-[#0089FF]/40 transition-all shadow-2xs cursor-pointer active:scale-95"
                    >
                      <Filter className="h-3.5 w-3.5 stroke-[2.2]" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="font-semibold text-xs bg-slate-900 text-white border-slate-800">
                    Filter Options
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* 3. Sort Button inside Box */}
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => toast.info("Sorting options")}
                      className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:border-[#0089FF]/40 transition-all shadow-2xs cursor-pointer active:scale-95"
                    >
                      <ArrowUpDown className="h-3.5 w-3.5 stroke-[2.2]" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="font-semibold text-xs bg-slate-900 text-white border-slate-800">
                    Sorting / Order
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* 3. Group Header: Daimler Transport PVT. LTD. */}
          <div className="px-3 py-1.5 bg-slate-100/90 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0 select-none">
            <div className="flex items-center gap-1.5">
              <input
                type="checkbox"
                defaultChecked
                className="h-3.5 w-3.5 rounded border-slate-300 text-[#0089FF] focus:ring-[#0089FF] cursor-pointer shrink-0"
              />
              <button
                type="button"
                onClick={() => setGroupExpanded(!groupExpanded)}
                className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-slate-100 hover:text-[#0089FF] transition-colors cursor-pointer"
              >
                <span>Daimler Transport PVT. LTD.</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-slate-500 transition-transform duration-200 stroke-[2]",
                    !groupExpanded && "-rotate-90"
                  )}
                />
              </button>
            </div>
            <span className="text-[11px] font-mono font-medium text-slate-500">
              [{filteredTrips.length}]
            </span>
          </div>

          {/* 4. Trips List (Scrollable) */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar divide-y divide-slate-100 dark:divide-slate-800/60">
            {groupExpanded &&
              filteredTrips.map((trip) => {
                const isExpanded = !!expandedTripIds[trip.id];

                return (
                  <div
                    key={trip.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Main Trip Row - Clickable to Flip */}
                    <div
                      onClick={() => handleSelectTrip(trip)}
                      className="px-3 py-2 cursor-pointer transition-colors group flex items-start justify-between gap-2"
                    >
                      <div className="flex items-start gap-1.5 min-w-0 flex-1">
                        {/* Expand / Collapse chevron */}
                        <button
                          type="button"
                          onClick={(e) => toggleTripExpand(trip.id, e)}
                          className="mt-0.5 p-0.5 rounded hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors shrink-0"
                        >
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 stroke-[2] transition-transform duration-200",
                              !isExpanded && "-rotate-90"
                            )}
                          />
                        </button>

                        {/* Status colored dot */}
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full shrink-0 mt-1",
                            trip.dotColor === "red" && "bg-[#EF4444]",
                            trip.dotColor === "green" && "bg-[#10B981]",
                            trip.dotColor === "amber" && "bg-[#F59E0B]"
                          )}
                        />

                        {/* Trip Info */}
                        <div className="min-w-0 flex-1 pl-0.5">
                          <div className="text-xs font-bold leading-tight text-slate-900 dark:text-slate-100 truncate group-hover:text-[#0089FF] transition-colors">
                            {trip.name}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                            <span className="font-mono text-[#0089FF] font-semibold hover:underline">
                              {trip.code}
                            </span>
                            <span className="font-mono text-slate-400">[{trip.paxCount}]</span>
                            <Flag className="h-3 w-3 text-red-500 fill-red-500 shrink-0" />
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Shift & ETA (Application Theme) */}
                      <div className="flex flex-col items-end shrink-0 text-right">
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-2 py-0.5 rounded-md border leading-none shrink-0 tracking-wide",
                            trip.shiftType === "IN"
                              ? "bg-[#EFF6FF] text-[#0089FF] border-[#BFDBFE] dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800"
                              : "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A] dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                          )}
                        >
                          {trip.shift}
                        </span>
                        <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-1 flex items-center justify-end gap-1.5">
                          <span>{trip.eta}</span>
                          <span
                            className={cn(
                              "font-bold text-xs",
                              trip.isDelayed ? "text-[#EF4444]" : "text-[#10B981]"
                            )}
                          >
                            {trip.delay}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sub-rows: Assigned Vehicles & Drivers (BusFront icon aligned directly below the status dot) */}
                    {isExpanded && trip.vehicles && trip.vehicles.length > 0 && (
                      <div className="bg-slate-50/50 dark:bg-slate-950/30 border-t border-slate-100 dark:border-slate-800/40 divide-y divide-slate-100 dark:divide-slate-800/40">
                        {trip.vehicles.map((veh, vIdx) => (
                          <div
                            key={vIdx}
                            className="flex items-center justify-between text-xs py-2 pr-3 pl-[31px]"
                          >
                            {/* Left: BusFront icon directly under the status dot + Plate & Timestamp */}
                            <div className="flex items-center gap-2 min-w-0">
                              <BusFront className="h-3.5 w-3.5 text-[#10B981] stroke-[2.2] shrink-0" />
                              <div className="min-w-0">
                                <span className="font-bold text-xs text-[#0089FF] hover:underline cursor-pointer block leading-tight">
                                  {veh.plate}
                                </span>
                                <div className="text-[10px] text-slate-400 font-mono leading-none mt-1">
                                  {veh.time}
                                </div>
                              </div>
                            </div>

                            {/* Center & Right: Driver & Ports/Telematics Icons (Matching Object Screen h-3.5 w-3.5 stroke-[2.2]) */}
                            <div className="flex items-center gap-3 shrink-0 ml-2">
                              <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                                <User className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 stroke-[2] shrink-0" />
                                <span className="truncate max-w-[100px] font-medium">{veh.driver}</span>
                              </div>

                              {/* Ports / Telematics Icons matching Object Screen */}
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <span title="Ignition">
                                  <Key
                                    className={cn(
                                      "h-3.5 w-3.5 stroke-[2.2]",
                                      veh.telematics.key ? "text-[#10B981]" : "text-slate-300 dark:text-slate-600"
                                    )}
                                  />
                                </span>
                                <span title="Mobile">
                                  <Smartphone className="h-3.5 w-3.5 stroke-[2.2] text-slate-400 dark:text-slate-500" />
                                </span>
                                <span title="Network">
                                  <Radio
                                    className={cn(
                                      "h-3.5 w-3.5 stroke-[2.2]",
                                      veh.telematics.network ? "text-[#0089FF]" : "text-slate-300 dark:text-slate-600"
                                    )}
                                  />
                                </span>
                                <span title="GPS">
                                  <Wifi
                                    className={cn(
                                      "h-3.5 w-3.5 stroke-[2.2]",
                                      veh.telematics.gps ? "text-[#10B981]" : "text-slate-300 dark:text-slate-600"
                                    )}
                                  />
                                </span>
                                <span title="Alert">
                                  <AlertTriangle
                                    className={cn(
                                      "h-3.5 w-3.5 stroke-[2.2]",
                                      veh.telematics.alert ? "text-[#EF4444]" : "text-slate-300 dark:text-slate-600"
                                    )}
                                  />
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* ==================================================================================== */}
        {/* BACK FACE: Flipped Trip Details View (1:1 with media_1793871172259_8645e8a9.jpg)      */}
        {/* ==================================================================================== */}
        <div className="absolute inset-0 flex flex-col min-h-0 bg-white dark:bg-slate-900 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden font-sans">
          {selectedTrip && (
            <div className="flex flex-col h-full min-h-0">
              {/* Scrollable Detail Body */}
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar divide-y divide-slate-100 dark:divide-slate-800">
                {/* 1. Women Travelling Alert Banner */}
                <div className="px-3 py-2 bg-rose-50/90 dark:bg-rose-950/40 border-b border-rose-200/60 dark:border-rose-900/40 flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0 stroke-[2.2]" />
                  <span>Women Travelling Alone, First PickUp Women</span>
                </div>

                {/* 2. Passenger Status Pills Bar (1:1 with Reference Image 1 media_1793876125474_e4bd59cb.jpg & 8 tabs from media_1793875691925_b728b489.png - NO chevrons, individual rounded-xl cards with gaps and borders) */}
                <div className="px-2 py-1.5 bg-slate-50/50 dark:bg-slate-950/40 select-none shrink-0 border-b border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
                    {passengerStatusTabs.map((tab) => {
                      const isActive = activePassengerFilter === tab.key;

                      return (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setActivePassengerFilter(isActive ? "all" : tab.key)}
                          style={{
                            backgroundColor: isActive ? tab.activeBgColor : tab.bgColor,
                            borderColor: isActive ? tab.activeBorderColor : tab.borderColor,
                            color: isActive ? tab.activeTextColor : tab.textColor,
                          }}
                          className={cn(
                            "flex flex-col items-center justify-center h-[42px] px-2 rounded-xl transition-all duration-150 cursor-pointer select-none border font-sans shrink-0 min-w-[64px] flex-1",
                            isActive && "shadow-sm font-bold scale-[1.02]"
                          )}
                        >
                          <div className="flex items-center gap-1.5 leading-none">
                            <span
                              className="h-1.5 w-1.5 rounded-full shrink-0"
                              style={{
                                backgroundColor: isActive ? "#FFFFFF" : tab.dotColor,
                              }}
                            />
                            <span className="text-[13px] font-bold tabular-nums leading-none">
                              {tab.count}
                            </span>
                          </div>
                          <span className="text-[9px] font-bold tracking-tight uppercase leading-tight mt-0.5 whitespace-nowrap">
                            {tab.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Trip Details Section Card (Collapsible) + Distance Audits link */}
                <div className="p-3 bg-white dark:bg-slate-900">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setTripDetailsExpanded(!tripDetailsExpanded)}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100 hover:text-[#0089FF] transition-colors cursor-pointer group"
                    >
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 stroke-[2] transition-transform duration-200",
                          !tripDetailsExpanded && "-rotate-90"
                        )}
                      />
                      <Navigation className="h-3.5 w-3.5 text-[#0089FF] stroke-[2.2]" />
                      <span>Trip Details</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDistanceAuditOpen(true)}
                      className="text-xs font-bold text-[#0089FF] hover:underline cursor-pointer"
                    >
                      Distance Audits
                    </button>
                  </div>

                  {tripDetailsExpanded && (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-xs animate-in fade-in duration-150">
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium">Shift</div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                          {selectedTrip.details.shift}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium">Status</div>
                        <div className="font-bold text-[#10B981] mt-0.5">
                          {selectedTrip.details.status}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium">Planned</div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                          {selectedTrip.details.planned}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium">Actual</div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                          {selectedTrip.details.actual}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-[10px] text-slate-400 font-medium">Vendor</div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                          {selectedTrip.details.vendor}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Driver Card - No border on mobile number */}
                <div className="p-3 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs">
                      <User className="h-4 w-4 stroke-[2]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {selectedTrip.driver.name}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 leading-none">
                          ★ {selectedTrip.driver.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Clean mobile number without border box */}
                  <a
                    href={`tel:${selectedTrip.driver.phone}`}
                    className="flex items-center gap-1.5 text-[#0089FF] hover:underline text-xs font-semibold transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-[#0089FF] stroke-[2.2] shrink-0" />
                    <span>{selectedTrip.driver.phone}</span>
                  </a>
                </div>

                {/* 5. Vehicle Card - Clean text with NO yellow box behind vehicle change */}
                <div className="p-3 bg-white dark:bg-slate-900 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BusFront className="h-4 w-4 text-[#0089FF] stroke-[2.2]" />
                      <span className="text-xs font-bold text-[#0089FF] hover:underline cursor-pointer">
                        {selectedTrip.vehicle.plate}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Fleet: {selectedTrip.vehicle.fleet}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                      <Armchair className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 stroke-[2.2]" />
                      <span>{selectedTrip.vehicle.seats} seats</span>
                    </div>
                  </div>

                  {/* Clean Vehicle Changed warning text - NO yellow box background */}
                  {selectedTrip.vehicle.changedAlert && (
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-600 dark:text-amber-400 pt-0.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 stroke-[2.2]" />
                      <span>{selectedTrip.vehicle.changedAlert}</span>
                    </div>
                  )}
                </div>

                {/* 6. Stop Time Line Section with Chevron BEFORE point name and bold Gender Icons */}
                <div className="bg-white dark:bg-slate-900">
                  <div className="px-3 py-2 bg-slate-100/80 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>Stop Time Line ({selectedTrip.stops.length} Stops)</span>
                  </div>

                  <div className="p-3 space-y-3">
                    {selectedTrip.stops.map((stop) => {
                      const isStopExpanded = !!expandedStopIds[stop.id];

                      return (
                        <div
                          key={stop.id}
                          className="relative pl-6 pb-2 border-l-2 border-slate-200 dark:border-slate-800 last:border-l-transparent last:pb-0"
                        >
                          {/* Numbered Colored Circle Icon on Timeline with Total Stop Number */}
                          <div
                            style={{ backgroundColor: stop.color }}
                            className="absolute -left-[11px] top-0 h-5 w-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow-xs select-none"
                            title={`Stop ${stop.stopNumber} of ${stop.totalStops}`}
                          >
                            {stop.stopNumber}
                          </div>

                          {/* Stop Header Row: Chevron comes BEFORE the point name */}
                          <div
                            onClick={() => toggleStopExpand(stop.id)}
                            className="flex items-start justify-between gap-2 cursor-pointer group"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                {/* Chevron BEFORE the point name */}
                                {stop.passengers && stop.passengers.length > 0 && (
                                  <span className="p-0.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 shrink-0">
                                    <ChevronDown
                                      className={cn(
                                        "h-3.5 w-3.5 stroke-[2.5] transition-transform duration-200",
                                        isStopExpanded && "rotate-180"
                                      )}
                                    />
                                  </span>
                                )}

                                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#0089FF] transition-colors uppercase">
                                  {stop.name.replace(/^\d+\s+/, "")}
                                </span>
                              </div>

                              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap pl-5 font-mono">
                                <span>Planned: {stop.planned}</span>
                                {stop.actual && <span>Actual: {stop.actual}</span>}
                                {stop.eta && <span>ETA: {stop.eta}</span>}
                                {stop.delayBadge && (
                                  <span className="font-bold text-[#EF4444] bg-red-50 dark:bg-red-950/50 px-1 py-0.2 rounded border border-red-200 dark:border-red-800">
                                    {stop.delayBadge}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold shrink-0">
                              <Armchair className="h-3.5 w-3.5 text-slate-400 stroke-[2]" />
                              <span>({stop.paxSummary})</span>
                            </div>
                          </div>

                          {/* Expanded Passengers List for this Stop */}
                          {isStopExpanded && stop.passengers && stop.passengers.length > 0 && (
                            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 pl-2">
                              {stop.passengers.map((pax, pIdx) => (
                                <div
                                  key={pIdx}
                                  className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/80"
                                >
                                  {/* Male / Female Icons with proper stroke and high visibility */}
                                  <div className="flex items-center gap-2 min-w-0">
                                    {pax.gender === "F" ? (
                                      <div
                                        className="h-5 w-5 rounded-full bg-pink-100 dark:bg-pink-950/70 border border-pink-300 dark:border-pink-800 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0"
                                        title="Female Passenger"
                                      >
                                        <FemaleGenderIcon className="h-3 w-3" />
                                      </div>
                                    ) : (
                                      <div
                                        className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-950/70 border border-blue-300 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0"
                                        title="Male Passenger"
                                      >
                                        <MaleGenderIcon className="h-3 w-3" />
                                      </div>
                                    )}
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate text-xs">
                                      {pax.name}
                                    </span>
                                    {pax.isSpecialNeeds && (
                                      <div
                                        title="Special Needs / Accessible Passenger"
                                        className="h-5 w-5 rounded-full bg-sky-100 dark:bg-sky-950/70 border border-sky-300 dark:border-sky-800 flex items-center justify-center text-[#0089FF] dark:text-sky-300 shrink-0 shadow-2xs"
                                      >
                                        <Accessibility className="h-3.5 w-3.5 stroke-[2.2]" />
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <span
                                      className={cn(
                                        "text-[10px] font-semibold",
                                        pax.statusType === "boarded" && "text-[#10B981] font-bold",
                                        pax.statusType === "noshow" && "text-slate-400 line-through",
                                        pax.statusType === "notboarded" && "text-amber-600",
                                        pax.statusType === "pending" && "text-[#0089FF]"
                                      )}
                                    >
                                      {pax.statusText}
                                    </span>

                                    <a
                                      href={`tel:${pax.phone}`}
                                      className="p-1 text-slate-400 hover:text-[#0089FF] transition-colors"
                                      title={`Call ${pax.name}`}
                                    >
                                      <Phone className="h-3.5 w-3.5 stroke-[2]" />
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================================================== */}
      {/* 3. Distance Audit Log Modal (Using standard Dialog component from @/components/ui/dialog) */}
      {selectedTrip && (
        <Dialog open={distanceAuditOpen} onOpenChange={setDistanceAuditOpen}>
          <DialogContent className="max-w-md p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl">
            <DialogHeader className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800 text-left">
              <DialogTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Distance Audit Log: Trip#{selectedTrip.distanceAudit.tripNumber}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs font-sans divide-y divide-slate-100 dark:divide-slate-800/80">
              <div className="flex items-center justify-between pb-3">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Planned Map Distance</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-mono text-sm">
                  {selectedTrip.distanceAudit.plannedDistance}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Actual GPS Odometer distance
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-mono text-sm">
                  {selectedTrip.distanceAudit.actualDistance}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Variance / Deviation</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono text-sm">
                    {selectedTrip.distanceAudit.variance}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                    {selectedTrip.distanceAudit.status}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2 border-t border-slate-100 dark:border-slate-800 sm:justify-end">
              <button
                type="button"
                onClick={() => setDistanceAuditOpen(false)}
                className="px-5 py-2 text-xs font-bold text-white bg-[#0089FF] hover:bg-[#0070d6] rounded-xl shadow-md shadow-[#0089FF]/20 transition-all cursor-pointer active:scale-95"
              >
                Close
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
