// Exact data extracted faithfully from the reference dashboard image

export interface FleetStatusData {
  total: number;
  running: { count: number; pct: number };
  idle: { count: number; pct: number };
  stopped: { count: number; pct: number };
  inactive: { count: number; pct: number };
  noData: { count: number; pct: number };
}

export const FLEET_STATUS_DATA: FleetStatusData = {
  total: 11150,
  running: { count: 450, pct: 40.4 },
  idle: { count: 150, pct: 13.5 },
  stopped: { count: 350, pct: 31.4 },
  inactive: { count: 200, pct: 17.9 },
  noData: { count: 100, pct: 9.0 },
};

export const BATTERY_STATUS_DATA = [
  { level: "< 20%", count: 5, color: "#ef4444" },
  { level: "20% - 40%", count: 4, color: "#f59e0b" },
  { level: "40% - 60%", count: 2, color: "#06b6d4" },
  { level: "60% - 80%", count: 6, color: "#3b82f6" },
  { level: "> 80% / Charging", count: 7, color: "#10b981", isCharging: true },
];

export const REMOTE_LOCK_DATA = {
  total: 100,
  unlocked: { count: 98, pct: 98, color: "#10b981" },
  locked: { count: 2, pct: 2, color: "#ef4444" },
};

export const ALERTS_BREAKDOWN_DATA = [
  { name: "Harsh Acceleration", count: 14, max: 20 },
  { name: "Emergency SOS Alarm", count: 8, max: 20 },
  { name: "Overspeeding Warning", count: 6, max: 20 },
  { name: "Ignition / Idle Alert", count: 4, max: 20 },
  { name: "Power Cut", count: 2, max: 20 },
  { name: "Tow Alert", count: 1, max: 20 },
];

export const FLEET_HEALTH_DATA = {
  score: 90,
  engine: 92,
  battery: 78,
  coolant: 74,
  fuel: 88,
  healthy: 82,
  warning: 14,
  critical: 4,
};

export const COMPONENT_FAILURES = [
  { component: "Engine Trouble", alerts: 14, severity: "Critical", color: "#ef4444" },
  { component: "Brake Wear / Failure", alerts: 11, severity: "Critical", color: "#ef4444" },
  { component: "Cooling System", alerts: 9, severity: "Critical", color: "#ef4444" },
  { component: "Transmission Fluid", alerts: 5, severity: "Warning", color: "#f59e0b" },
  { component: "Tire Wear", alerts: 3, severity: "Warning", color: "#f59e0b" },
  { component: "Auxiliary Battery", alerts: 1, severity: "Healthy", color: "#10b981" },
  { component: "Exhaust System", alerts: 1, severity: "Healthy", color: "#10b981" },
];

export const FLEET_STRESS_INDEX = {
  currentScore: 72,
  level: "High",
  trend: "▲ 4.3% in last 7 days",
  minStress: "42% (Sun)",
  avgStress: "68% (Fleet)",
  maxStress: "92% (Mon)",
};

export const VEHICLE_STATUS_ALERTS = [
  { vehicle: "MH04AB1234", engine: "94%", battery: "78%", fuel: "88%", cooling: "91%" },
  { vehicle: "GJ21HS1609", engine: "42%", battery: "65%", fuel: "74%", cooling: "52%" },
  { vehicle: "DL01CD5678", engine: "96%", battery: "84%", fuel: "90%", cooling: "89%" },
  { vehicle: "KA03MG4411", engine: "88%", battery: "44%", fuel: "68%", cooling: "76%" },
  { vehicle: "RJ14AB3322", engine: "91%", battery: "89%", fuel: "94%", cooling: "95%" },
  { vehicle: "TN09XY9988", engine: "62%", battery: "58%", fuel: "48%", cooling: "60%" },
  { vehicle: "UP32EF1122", engine: "95%", battery: "92%", fuel: "89%", cooling: "93%" },
  { vehicle: "WB19JK5544", engine: "79%", battery: "81%", fuel: "84%", cooling: "82%" },
];

export const GSM_SIGNAL_DATA = {
  total: 142501,
  excellent: { label: "Excellent (4G/5G)", pct: 78, color: "#10b981" },
  fair: { label: "Fair (3G)", pct: 14, color: "#f59e0b" },
  poor: { label: "Poor (2G/No Signal)", pct: 8, color: "#ef4444" },
};

export const GEO_CALIBRATION_DATA = [
  { zone: "Zone 1", count: 14, max: 50 },
  { zone: "Zone 2", count: 28, max: 50 },
  { zone: "Zone 3", count: 42, max: 50 },
  { zone: "Zone 4", count: 36, max: 50 },
  { zone: "Zone 5", count: 19, max: 50 },
];

export const ENGINE_EFFICIENCY_DATA = {
  score: 89,
  status: "Good",
  optimalRpm: 74,
  overRevving: 15,
};

export const BATTERY_DEGRADATION_DATA = [
  { period: "> 30 Days", count: 320, color: "#ef4444" },
  { period: "60 Days", count: 80, color: "#f59e0b" },
  { period: "90 Days", count: 20, color: "#eab308" },
];

export const FUEL_LOSS_OPPORTUNITY = {
  fuelLostLtr: 68,
  costLostInr: "₹6,500",
  preventablePct: 82,
  operationalPct: 18,
};

export const JOB_DELIVERY_DATA = {
  total: 1000,
  completed: { count: 820, pct: 82, color: "#10b981" },
  pending: { count: 90, pct: 9, color: "#f59e0b" },
  delayed: { count: 50, pct: 5, color: "#06b6d4" },
  cancelled: { count: 40, pct: 4, color: "#ef4444" },
};

export const ALARM_TILES_DATA = [
  { id: "overspeed", label: "Overspeed", count: 220, bgClass: "bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400", status: "On Status" },
  { id: "harsh-cornering", label: "Harsh Cornering", count: 0, bgClass: "bg-blue-500/15 border-blue-500/30 text-blue-600 dark:text-blue-400", status: "On Status" },
  { id: "ac-freeze", label: "AC / Freeze", count: 0, bgClass: "bg-cyan-500/15 border-cyan-500/30 text-cyan-600 dark:text-cyan-400", status: "On Status" },
  { id: "high-temp", label: "High Temperature Alert", count: 0, bgClass: "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400", status: "On Status" },
  { id: "panic-sos", label: "Panic SOS Alert", count: 0, bgClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400", status: "On Status" },
  { id: "collision", label: "Collision Warning", count: 0, bgClass: "bg-teal-500/15 border-teal-500/30 text-teal-600 dark:text-teal-400", status: "On Status" },
];

export const VEHICLE_TYPE_DATA = {
  total: "2,01,800",
  types: [
    { name: "Truck", count: 62, color: "#ef4444" },
    { name: "Bus", count: 44, color: "#f97316" },
    { name: "Container", count: 38, color: "#eab308" },
    { name: "Trailer", count: 29, color: "#10b981" },
    { name: "Reefer", count: 21, color: "#06b6d4" },
    { name: "Van", count: 18, color: "#3b82f6" },
    { name: "Pickup", count: 14, color: "#8b5cf6" },
    { name: "Tanker", count: 9, color: "#ec4899" },
  ],
};

export const OPERATIONAL_METRICS_DATA = {
  fleetEfficiencyPct: 70,
  carbonEmissionSavedTons: 5,
  tollExpenseInr: "₹ 6,650",
  activeAlertsCount: 172,
};

export const SOS_ALERTS_FEED = [
  { id: "1", vehicle: "Vehicle-01", type: "Depot Logistics", status: "SOS Triggered", time: "Just now", severity: "Critical" },
  { id: "2", vehicle: "Vehicle-02", type: "Intercity Highway", status: "Impact Alert", time: "2m ago", severity: "Critical" },
  { id: "3", vehicle: "Vehicle-03", type: "City Route 4", status: "Door Breach", time: "14m ago", severity: "Warning" },
  { id: "4", vehicle: "Vehicle-04", type: "Toll Plaza South", status: "Panic Button", time: "22m ago", severity: "Critical" },
  { id: "5", vehicle: "Vehicle-05", type: "Ring Road North", status: "Power Disconnect", time: "38m ago", severity: "Warning" },
];

export const ALERTS_DAY_TIME = [
  { day: "Sun", alerts: 32, severity: 42 },
  { day: "Mon", alerts: 46, severity: 55 },
  { day: "Tue", alerts: 88, severity: 92 },
  { day: "Wed", alerts: 54, severity: 60 },
  { day: "Thu", alerts: 62, severity: 68 },
  { day: "Fri", alerts: 64, severity: 70 },
  { day: "Sat", alerts: 60, severity: 65 },
];

export const ALERTS_OBJECT_TYPE = [
  { type: "Heavy Cargo Truck", count: 74, severity: "High" },
  { type: "Intercity Bus", count: 52, severity: "High" },
  { type: "Delivery Van", count: 38, severity: "Medium" },
  { type: "Tipper (Construction)", count: 26, severity: "Medium" },
  { type: "Container Trailer", count: 18, severity: "Low" },
  { type: "Petroleum Tanker", count: 12, severity: "Low" },
];

export const SHIFT_COMPLIANCE_DATA = {
  totalDrivingHours: "11 hrs 00 min",
  normalTravelTime: "8 hrs 15 min",
  overHours: "2 hrs 45 min",
  compliancePct: 82,
  dailyTrend: [
    { day: "Mon", hours: 6.2 },
    { day: "Tue", hours: 7.8 },
    { day: "Wed", hours: 11.0 },
    { day: "Thu", hours: 7.9 },
    { day: "Fri", hours: 8.6 },
    { day: "Sat", hours: 8.4 },
    { day: "Sun", hours: 7.5 },
  ],
};
