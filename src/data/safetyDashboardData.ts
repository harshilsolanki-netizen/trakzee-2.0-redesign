// Safety Dashboard mock data

export type AlertSeverity = "critical" | "high" | "medium" | "exception";

export interface SafetyAlert {
  id: string;
  severity: AlertSeverity;
  vehicleId: string;
  vehiclePlate: string;
  cabId: string;
  driverContact: string;
  office: string;
  time: string;
  location: string;
  alertType: string;
  status: "open" | "acknowledged" | "closed";
  employees: number;
  lat: number;
  lng: number;
  speed?: number;
  lastUpdated: string;
  vendor?: string;
  boardedCount?: number;
  comment?: string;
}

export interface NearbyVehicle {
  id: string;
  plate: string;
  driver: string;
  contact: string;
  status: "running" | "idle" | "stopped";
  statusLabel: string;
  distance: number;
}

export const MOCK_ALERTS: SafetyAlert[] = [
  {
    id: "a1",
    severity: "medium",
    vehicleId: "v1",
    vehiclePlate: "MH 15 KL 6455",
    cabId: "CAB-334",
    driverContact: "+91 98765 43210",
    office: "Pune HQ",
    time: "18 Nov 2026 06:00 PM",
    location: "Baner Road, Pune",
    alertType: "Unauthorized stop point",
    status: "open",
    employees: 3,
    lat: 18.5595,
    lng: 73.7868,
    speed: 65,
    lastUpdated: "3 mins ago",
    vendor: "ABC Company",
    boardedCount: 3,
    comment: "",
  },
  {
    id: "a2",
    severity: "medium",
    vehicleId: "v1",
    vehiclePlate: "MH 15 KL 6455",
    cabId: "CAB-334",
    driverContact: "+91 98765 43210",
    office: "Pune HQ",
    time: "18 Nov 2026 05:58 PM",
    location: "Hinjewadi Road, Pune",
    alertType: "Out of geofence",
    status: "open",
    employees: 3,
    lat: 18.5912,
    lng: 73.7389,
    speed: 72,
    lastUpdated: "5 mins ago",
    vendor: "ABC Company",
    boardedCount: 2,
    comment: "Route deviation acknowledged",
  },
  {
    id: "a3",
    severity: "critical",
    vehicleId: "v2",
    vehiclePlate: "MH 03 KL 4544",
    cabId: "CAB-112",
    driverContact: "+91 98765 43211",
    office: "Mumbai Central",
    time: "18 Nov 2026 06:15 PM",
    location: "Andheri East, Mumbai",
    alertType: "SOS Alert",
    status: "open",
    employees: 5,
    lat: 19.0896,
    lng: 72.8656,
    speed: 0,
    lastUpdated: "1 min ago",
    vendor: "XYZ Logistics",
    boardedCount: 5,
    comment: "",
  },
  {
    id: "a4",
    severity: "high",
    vehicleId: "v3",
    vehiclePlate: "MH 12 AB 7812",
    cabId: "CAB-221",
    driverContact: "+91 98765 43212",
    office: "Nashik Depot",
    time: "18 Nov 2026 06:05 PM",
    location: "Gangapur Road, Nashik",
    alertType: "Speeding",
    status: "acknowledged",
    employees: 2,
    lat: 20.0059,
    lng: 73.7897,
    speed: 115,
    lastUpdated: "12 mins ago",
    vendor: "ABC Company",
    boardedCount: 2,
    comment: "Driver warned via call",
  },
  {
    id: "a5",
    severity: "exception",
    vehicleId: "v4",
    vehiclePlate: "MH 14 CD 2201",
    cabId: "CAB-456",
    driverContact: "+91 98765 43213",
    office: "Pune HQ",
    time: "18 Nov 2026 05:50 PM",
    location: "Kothrud, Pune",
    alertType: "Night driving violation",
    status: "open",
    employees: 1,
    lat: 18.5074,
    lng: 73.8077,
    speed: 48,
    lastUpdated: "20 mins ago",
    vendor: "ABC Company",
    boardedCount: 1,
    comment: "",
  },
  {
    id: "a6",
    severity: "medium",
    vehicleId: "v5",
    vehiclePlate: "MH 12 EF 3209",
    cabId: "CAB-789",
    driverContact: "+91 98765 43214",
    office: "Mumbai Central",
    time: "18 Nov 2026 06:10 PM",
    location: "Powai Lake Road, Mumbai",
    alertType: "Idle for too long",
    status: "closed",
    employees: 4,
    lat: 19.1234,
    lng: 72.9052,
    speed: 0,
    lastUpdated: "35 mins ago",
    vendor: "XYZ Logistics",
    boardedCount: 3,
    comment: "Resolved - driver break",
  },
];

export const MOCK_NEARBY_VEHICLES: NearbyVehicle[] = [
  {
    id: "nv1",
    plate: "MH 12 AB 7812",
    driver: "Vijay Shah",
    contact: "+91 98765 43211",
    status: "running",
    statusLabel: "Running 4hr",
    distance: 1.2,
  },
  {
    id: "nv2",
    plate: "MH 14 CD 2201",
    driver: "Amit Patel",
    contact: "+91 98765 43211",
    status: "idle",
    statusLabel: "Idle 2h",
    distance: 1.8,
  },
  {
    id: "nv3",
    plate: "MH 12 EF 3209",
    driver: "Suresh Kumar",
    contact: "+91 98765 43211",
    status: "stopped",
    statusLabel: "Stopped 3hr",
    distance: 1.9,
  },
];

// Safe Reach Confirmation Data
export type SafeReachStatus = "failed" | "inprogress" | "manual" | "automated" | "not_on_trip";
export type SafeReachChannel = "mobile_app" | "geofence" | "ivr";

export interface SafeReachEmployee {
  id: string;
  name: string;
  employeeNo: string;
  businessUnitId: string;
  office: string;
  employeeContact: string;
  driverContact: string;
  shift: string;
  visited: string;
  deboarded: string;
  channel: SafeReachChannel;
  status: "confirmed" | "nt" | "failed";
}

export const MOCK_SAFE_REACH_EMPLOYEES: SafeReachEmployee[] = [
  {
    id: "e1",
    name: "Kesha Shah",
    employeeNo: "96654852",
    businessUnitId: "hgo7778",
    office: "ABC company",
    employeeContact: "+91 9020011111",
    driverContact: "+91 9020022222",
    shift: "22:30",
    visited: "23:55",
    deboarded: "22:15",
    channel: "mobile_app",
    status: "confirmed",
  },
  {
    id: "e2",
    name: "Keyur Shah",
    employeeNo: "96654852",
    businessUnitId: "hgo7778",
    office: "ABC company",
    employeeContact: "+91 9020011112",
    driverContact: "+91 9020022223",
    shift: "22:30",
    visited: "23:55",
    deboarded: "22:15",
    channel: "geofence",
    status: "nt",
  },
  {
    id: "e3",
    name: "Keyur Shah",
    employeeNo: "96654852",
    businessUnitId: "hgo7778",
    office: "ABC company",
    employeeContact: "+91 9020011113",
    driverContact: "+91 9020022224",
    shift: "22:30",
    visited: "23:55",
    deboarded: "22:15",
    channel: "ivr",
    status: "nt",
  },
  {
    id: "e4",
    name: "Pooja Mehta",
    employeeNo: "96654853",
    businessUnitId: "hgo7778",
    office: "ABC company",
    employeeContact: "+91 9020011114",
    driverContact: "+91 9020022225",
    shift: "23:00",
    visited: "00:10",
    deboarded: "23:00",
    channel: "mobile_app",
    status: "failed",
  },
  {
    id: "e5",
    name: "Ravi Sharma",
    employeeNo: "96654854",
    businessUnitId: "hgo7779",
    office: "XYZ company",
    employeeContact: "+91 9020011115",
    driverContact: "+91 9020022226",
    shift: "22:30",
    visited: "23:55",
    deboarded: "22:20",
    channel: "geofence",
    status: "confirmed",
  },
];

export const SAFE_REACH_SUMMARY = {
  failed: 1,
  inprogress: 1,
  manual: 33,
  automated: 1,
  not_on_trip: 1,
};

export function getSeverityMeta(severity: AlertSeverity) {
  const map = {
    critical: {
      label: "Critical",
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950/40",
      border: "border-red-200 dark:border-red-800",
      badgeBg: "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400",
      dot: "bg-red-500",
    },
    high: {
      label: "High",
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-950/40",
      border: "border-orange-200 dark:border-orange-800",
      badgeBg: "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400",
      dot: "bg-orange-500",
    },
    medium: {
      label: "Medium",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-200 dark:border-amber-800",
      badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
      dot: "bg-amber-500",
    },
    exception: {
      label: "Exception",
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-950/40",
      border: "border-violet-200 dark:border-violet-800",
      badgeBg: "bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400",
      dot: "bg-violet-500",
    },
  };
  return map[severity];
}


export interface AlertTypeItem {
  id: string;
  name: string;
  iconName: string;
  count: number;
  color: string;
}

export const ALERT_TYPE_ITEMS: AlertTypeItem[] = [
  { id: "device_unreachable", name: "Device Unreachable", iconName: "Unplug", count: 0, color: "text-purple-500" },
  { id: "fixed_device_unreachable", name: "Fixed Device Unreachable", iconName: "Radio", count: 0, color: "text-emerald-500" },
  { id: "over_speeding", name: "Over Speeding", iconName: "Gauge", count: 0, color: "text-purple-500" },
  { id: "sos_device", name: "SOS - Device", iconName: "AlertOctagon", count: 0, color: "text-rose-500" },
  { id: "sos_mobile_app", name: "SOS - Mobile App", iconName: "Smartphone", count: 0, color: "text-blue-500" },
  { id: "tamper_alert", name: "Tamper Alert", iconName: "ShieldAlert", count: 0, color: "text-cyan-500" },
  { id: "unplanned_marshal_trip", name: "Unplanned Marshal Trip", iconName: "Bus", count: 0, color: "text-amber-500" },
  { id: "vehicle_stopped", name: "Vehicle Stopped", iconName: "Car", count: 0, color: "text-cyan-500" },
  { id: "violation_geofence", name: "Violation - Geo Fence", iconName: "MapPinOff", count: 0, color: "text-violet-500" },
  { id: "violation_sign_off_time", name: "Violation - Sign Off Time", iconName: "Clock", count: 0, color: "text-violet-500" },
  { id: "woman_only", name: "Woman Only", iconName: "User", count: 0, color: "text-sky-500" },
];
