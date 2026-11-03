import {
  ShieldAlert,
  Thermometer,
  Activity,
  Fuel,
  LayoutDashboard,
  Snowflake,
  Radio,
  Gauge,
  UserCheck,
  Camera,
  LineChart,
  TrendingUp,
  Wrench,
} from "lucide-react";
import type { ComponentType } from "react";

export interface DashboardTreeItem {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  to: string;
  description: string;
  badge?: string;
  icon?: ComponentType<{ className?: string }>;
}

export interface DashboardCategoryNode {
  category: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  description: string;
  items: DashboardTreeItem[];
}

export const DASHBOARD_CATEGORIES: DashboardCategoryNode[] = [
  {
    category: "fleet_safety",
    label: "Fleet Safety",
    icon: ShieldAlert,
    description:
      "Fleet scoring, driver rankings, risky events, violations, and camera AI analytics.",
    items: [
      {
        id: "fleet-overview",
        name: "Fleet Overview",
        category: "fleet_safety",
        categoryLabel: "Fleet Safety",
        to: "/",
        description: "Overall fleet safety index, score breakdown & active vehicles",
        icon: LayoutDashboard,
      },
      {
        id: "driver-safety",
        name: "Driver Safety Scorecard",
        category: "fleet_safety",
        categoryLabel: "Fleet Safety",
        to: "/?tab=driver-safety",
        description: "Rankings, driver scorecard & individual incident profiles",
        icon: UserCheck,
      },
      {
        id: "violations",
        name: "Driving Violations",
        category: "fleet_safety",
        categoryLabel: "Fleet Safety",
        to: "/?tab=violations",
        description: "Harsh acceleration, harsh braking & speeding events",
        icon: ShieldAlert,
      },
      {
        id: "camera-health",
        name: "Camera Health & DMS",
        category: "fleet_safety",
        categoryLabel: "Fleet Safety",
        to: "/?tab=camera-health",
        description: "Dashcam AI status, distraction & fatigue detection",
        icon: Camera,
      },
      {
        id: "safety-trends",
        name: "Safety Trends & Scoring",
        category: "fleet_safety",
        categoryLabel: "Fleet Safety",
        to: "/?tab=trends",
        description: "Historical safety score curves & risk distribution",
        icon: LineChart,
      },
    ],
  },
  {
    category: "fuel",
    label: "Fuel Dashboard",
    icon: Fuel,
    description:
      "Real-time fleet fuel level telemetry, capacitive probe radial gauges, and tank capacity monitoring.",
    items: [
      {
        id: "fuel-dashboard",
        name: "Fuel Dashboard",
        category: "fuel",
        categoryLabel: "Fuel Dashboard",
        to: "/fuel-dashboard",
        description: "Real-time 3-card grid with 270° interactive animated radial gauges",
        icon: Fuel,
      },
      {
        id: "fuel-levels",
        name: "Fuel Levels & Capacity",
        category: "fuel",
        categoryLabel: "Fuel Dashboard",
        to: "/fuel-dashboard",
        description: "Capacitive fuel probe telemetry & tank percentage monitoring",
        icon: Gauge,
      },
      {
        id: "fuel-refuels",
        name: "Refuel Events & Drainage",
        category: "fuel",
        categoryLabel: "Fuel Dashboard",
        to: "/fuel-dashboard",
        description: "Tank volume spike detection & fuel theft/drain alerts",
        icon: TrendingUp,
      },
      {
        id: "fuel-specs",
        name: "Tank Calibration & Specs",
        category: "fuel",
        categoryLabel: "Fuel Dashboard",
        to: "/fuel-dashboard",
        description: "Cylindrical and rectangular tank calibration tables",
        icon: Wrench,
      },
    ],
  },
  {
    category: "temperature",
    label: "Temperature",
    icon: Thermometer,
    description:
      "Real-time cold chain monitoring, multi-sensor radial gauges, humidity & deep freeze alerts.",
    items: [
      {
        id: "temperature-dashboard",
        name: "Temperature Dashboard",
        category: "temperature",
        categoryLabel: "Temperature",
        to: "/temperature-dashboard",
        description: "Real-time 3-card grid with interactive animated radial gauges",
        icon: Thermometer,
      },
      {
        id: "reefer-monitoring",
        name: "Cold Chain Reefer Monitoring",
        category: "temperature",
        categoryLabel: "Temperature",
        to: "/temperature-dashboard",
        description: "Fleet temperature ranges & deep freeze cargo telemetry",
        icon: Snowflake,
      },
      {
        id: "multi-sensor",
        name: "Multi-Sensor Telemetry",
        category: "temperature",
        categoryLabel: "Temperature",
        to: "/temperature-dashboard",
        description: "BLE Temperature 1 & 2 dual-probe sensor readings",
        icon: Radio,
      },
      {
        id: "thermal-alerts",
        name: "Thermal Thresholds & Alerts",
        category: "temperature",
        categoryLabel: "Temperature",
        to: "/temperature-dashboard",
        description: "In-range, warning, critical high & deep freeze triggers",
        icon: Gauge,
      },
    ],
  },
  {
    category: "telematics",
    label: "Live Telematics",
    icon: Activity,
    description:
      "Real-time vehicle ignition, moving status, battery health, and OBD-II diagnostics.",
    items: [
      {
        id: "live-matrix",
        name: "Live Fleet Matrix",
        category: "telematics",
        categoryLabel: "Live Telematics",
        to: "/tracking",
        description: "Live ignition, motion status, GPS signal & last-seen status",
        icon: Activity,
      },
      {
        id: "speed-distance",
        name: "Speed & Distance Tracking",
        category: "telematics",
        categoryLabel: "Live Telematics",
        to: "/charts?chart=distance",
        description: "Real-time odometer, trip distances & top speed telemetry",
        icon: Gauge,
      },
      {
        id: "battery-health",
        name: "Battery & Power Health",
        category: "telematics",
        categoryLabel: "Live Telematics",
        to: "/charts?chart=battery_percentage",
        description: "Voltage levels, auxiliary battery health & power disconnect alerts",
        icon: Activity,
      },
    ],
  },
  {
    category: "eco_driving",
    label: "Eco & Fuel Efficiency",
    icon: Fuel,
    description:
      "Fuel consumption curves, idling waste, RPM efficiency, and green fleet metrics.",
    items: [
      {
        id: "fuel-analytics",
        name: "Fuel Analytics & Drainage",
        category: "eco_driving",
        categoryLabel: "Eco & Fuel Efficiency",
        to: "/charts?chart=fuel_level",
        description: "Tank volume graphs, refueling events & abnormal drainage",
        icon: Fuel,
      },
      {
        id: "idling-waste",
        name: "Engine Idling & Waste",
        category: "eco_driving",
        categoryLabel: "Eco & Fuel Efficiency",
        to: "/report?type=idle",
        description: "Excessive idle duration, wasted fuel & carbon emissions",
        icon: Gauge,
      },
      {
        id: "rpm-telemetry",
        name: "RPM & Powertrain Telemetry",
        category: "eco_driving",
        categoryLabel: "Eco & Fuel Efficiency",
        to: "/charts?chart=rpm",
        description: "Engine RPM curves, over-revving & torque efficiency",
        icon: Activity,
      },
    ],
  },
];

export const DASHBOARD_CATEGORY_GROUPS = [
  {
    groupLabel: "OPERATIONS & SAFETY",
    categoryKeys: ["fleet_safety", "telematics"],
  },
  {
    groupLabel: "FUEL & SENSORS",
    categoryKeys: ["fuel", "temperature", "eco_driving"],
  },
];

export const ALL_DASHBOARD_ITEMS = DASHBOARD_CATEGORIES.flatMap((c) => c.items);

export function findDashboardItem(id: string): DashboardTreeItem | undefined {
  return ALL_DASHBOARD_ITEMS.find((item) => item.id === id);
}
