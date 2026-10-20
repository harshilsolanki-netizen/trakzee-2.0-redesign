export type WidgetCategory =
  | "HARDWARE & SENSORS"
  | "SAFETY & ALERTS"
  | "OPERATIONS & FLEET"
  | "DRIVER PERFORMANCE"
  | "FUEL & EFFICIENCY";

export type WidgetSize = "small" | "medium" | "large" | "full" | "compact" | "mini";

export const WIDGET_SIZE_META: Record<
  WidgetSize,
  {
    label: string;
    dim: string;
    colSpanClass: string;
    heightClass: string;
    colSpan: number;
    rowSpan: number;
  }
> = {
  mini: {
    label: "0.5×0.5",
    dim: "0.5 Col × 0.5 Row",
    colSpanClass: "col-span-1 md:col-span-1 lg:col-span-1 row-span-1",
    heightClass: "h-[192.75px]",
    colSpan: 0.5,
    rowSpan: 0.5,
  },
  compact: {
    label: "1×0.5",
    dim: "1 Col × 0.5 Row",
    colSpanClass: "col-span-1 md:col-span-1 lg:col-span-2 row-span-1",
    heightClass: "h-[192.75px]",
    colSpan: 1,
    rowSpan: 0.5,
  },
  small: {
    label: "1×1",
    dim: "1 Col × 1 Row",
    colSpanClass: "col-span-1 md:col-span-1 lg:col-span-2 row-span-2",
    heightClass: "h-[395.5px]",
    colSpan: 1,
    rowSpan: 1,
  },
  medium: {
    label: "2×1",
    dim: "2 Col × 1 Row",
    colSpanClass: "col-span-1 md:col-span-2 lg:col-span-4 row-span-2",
    heightClass: "h-[395.5px]",
    colSpan: 2,
    rowSpan: 1,
  },
  large: {
    label: "2×2",
    dim: "2 Col × 2 Row",
    colSpanClass: "col-span-1 md:col-span-2 lg:col-span-4 row-span-4",
    heightClass: "h-[801px]",
    colSpan: 2,
    rowSpan: 2,
  },
  full: {
    label: "3×1",
    dim: "Full Row",
    colSpanClass: "col-span-1 md:col-span-2 lg:col-span-6 row-span-1",
    heightClass: "h-[220px]",
    colSpan: 3,
    rowSpan: 1,
  },
};

export type WidgetId =
  // Row 1
  | "fleet-status"
  | "battery-status"
  | "remote-lock-status"
  // Row 2
  | "alerts-breakdown"
  // Row 3
  | "fleet-health"
  | "component-failure"
  | "fleet-stress-index"
  // Row 4
  | "vehicle-status-alerts"
  | "gsm-signal-quality"
  | "geo-calibration-alerts"
  // Row 5
  | "engine-efficiency"
  | "battery-degradation"
  | "fuel-loss-opportunity"
  // Row 6
  | "job-status"
  | "fleet-usage"
  | "fleet-fuel"
  // Row 7 (6 Individual Mini Alarm Indicators)
  | "alarm-status-tiles"
  | "overspeed-alarm"
  | "harsh-cornering-alarm"
  | "ac-freeze-alarm"
  | "high-temp-alarm"
  | "panic-sos-alarm"
  | "collision-alarm"
  // Row 8 (Individual 0.5x0.5 Operational Metric Widgets)
  | "fleet-efficiency"
  | "toll-expense"
  | "carbon-emission"
  | "active-alerts"
  | "vehicle-type-wise"
  | "fleet-metrics-summary"
  | "sos-alerts"
  // Row 9
  | "alerts-day-time"
  | "alerts-object-type"
  | "risky-drivers"
  // Row 10
  | "fleet-score"
  | "score-distribution"
  | "camera-status"
  // Row 11
  | "event-heatmap"
  | "shift-compliance"
  // Row 12
  | "tariff";

export type WidgetDefinition = {
  id: WidgetId;
  title: string;
  category: WidgetCategory;
  description: string;
  hasRange: boolean;
  defaultSize: WidgetSize;
};

export const WIDGET_CATALOG: WidgetDefinition[] = [
  // Row 1
  {
    id: "fleet-status",
    title: "Fleet Status",
    category: "OPERATIONS & FLEET",
    description: "Objects breakdown: Running, Idle, Stopped, Inactive, No Data",
    hasRange: false,
    defaultSize: "small",
  },
  {
    id: "battery-status",
    title: "Battery Status",
    category: "HARDWARE & SENSORS",
    description: "Battery charge levels split across 5 capacity tiers",
    hasRange: false,
    defaultSize: "small",
  },
  {
    id: "remote-lock-status",
    title: "Remotely Lock Status",
    category: "HARDWARE & SENSORS",
    description: "Immobilizer & remote lock operational ratio",
    hasRange: false,
    defaultSize: "small",
  },

  // Row 2
  {
    id: "alerts-breakdown",
    title: "Alerts Breakdown",
    category: "SAFETY & ALERTS",
    description: "Volume breakdown of primary driving & system alarms",
    hasRange: false,
    defaultSize: "small",
  },

  // Row 3
  {
    id: "fleet-health",
    title: "Fleet Health Overview",
    category: "HARDWARE & SENSORS",
    description: "Overall health rating and subsystem diagnostics",
    hasRange: false,
    defaultSize: "small",
  },
  {
    id: "component-failure",
    title: "Component Failure Breakdown",
    category: "HARDWARE & SENSORS",
    description: "Failure alerts sorted by vehicle components",
    hasRange: false,
    defaultSize: "small",
  },
  {
    id: "fleet-stress-index",
    title: "Fleet Stress Index",
    category: "DRIVER PERFORMANCE",
    description: "Fleet mechanical stress meter and weekly trends",
    hasRange: false,
    defaultSize: "small",
  },

  // Row 4
  {
    id: "vehicle-status-alerts",
    title: "Vehicle Status by Alerts",
    category: "HARDWARE & SENSORS",
    description: "Subsystem health percentage matrix per active vehicle",
    hasRange: false,
    defaultSize: "small",
  },
  {
    id: "gsm-signal-quality",
    title: "Cell Signal Quality",
    category: "HARDWARE & SENSORS",
    description: "Packet transmission ratio across 4G/5G, 3G, and 2G signals",
    hasRange: false,
    defaultSize: "small",
  },
  {
    id: "geo-calibration-alerts",
    title: "Geo-Caliberation Alerts",
    category: "SAFETY & ALERTS",
    description: "Geofence perimeter intrusion and departure alarms",
    hasRange: false,
    defaultSize: "small",
  },

  // Row 5
  {
    id: "engine-efficiency",
    title: "Engine Efficiency Average",
    category: "FUEL & EFFICIENCY",
    description: "Fleet combustion efficiency and RPM duty performance",
    hasRange: false,
    defaultSize: "small",
  },
  {
    id: "battery-degradation",
    title: "Battery Degradation Forecast",
    category: "HARDWARE & SENSORS",
    description: "Predictive lifespan warnings for vehicle batteries",
    hasRange: false,
    defaultSize: "small",
  },
  {
    id: "fuel-loss-opportunity",
    title: "Fuel Loss & Cost Opportunity",
    category: "FUEL & EFFICIENCY",
    description: "Preventable fuel drain volume and financial loss",
    hasRange: false,
    defaultSize: "small",
  },

  // Row 6
  {
    id: "job-status",
    title: "Job / Delivery Status",
    category: "OPERATIONS & FLEET",
    description: "Fulfillment status: Completed, Pending, Delayed, Cancelled",
    hasRange: false,
    defaultSize: "small",
  },
  {
    id: "fleet-usage",
    title: "Fleet Usage",
    category: "OPERATIONS & FLEET",
    description: "Distance wave trend and fleet mileage distribution",
    hasRange: true,
    defaultSize: "medium",
  },
  {
    id: "fleet-fuel",
    title: "Fleet Fuel Trend",
    category: "FUEL & EFFICIENCY",
    description: "28-day daily fuel consumption bar distribution",
    hasRange: false,
    defaultSize: "medium",
  },

  // Row 7 (6 Individual Mini Alarm Indicators)
  {
    id: "overspeed-alarm",
    title: "Overspeed",
    category: "SAFETY & ALERTS",
    description: "Real-time overspeed threshold alarms and violation volume",
    hasRange: false,
    defaultSize: "mini",
  },
  {
    id: "harsh-cornering-alarm",
    title: "Harsh Cornering",
    category: "SAFETY & ALERTS",
    description: "Centrifugal force and aggressive cornering violation volume",
    hasRange: false,
    defaultSize: "mini",
  },
  {
    id: "ac-freeze-alarm",
    title: "AC / Freeze",
    category: "SAFETY & ALERTS",
    description: "Reefer temperature compliance and cabin climate freeze alarms",
    hasRange: false,
    defaultSize: "mini",
  },
  {
    id: "high-temp-alarm",
    title: "High Temperature",
    category: "SAFETY & ALERTS",
    description: "Engine coolant overheating and thermal threshold warnings",
    hasRange: false,
    defaultSize: "mini",
  },
  {
    id: "panic-sos-alarm",
    title: "Panic SOS",
    category: "SAFETY & ALERTS",
    description: "Driver emergency panic button SOS alert triggers",
    hasRange: false,
    defaultSize: "mini",
  },
  {
    id: "collision-alarm",
    title: "Collision Warning",
    category: "SAFETY & ALERTS",
    description: "Impact sensor triggers and collision proximity warnings",
    hasRange: false,
    defaultSize: "mini",
  },
  {
    id: "alarm-status-tiles",
    title: "Quick Alarm Indicators",
    category: "SAFETY & ALERTS",
    description: "Color-coded alarm status cards across 6 primary triggers",
    hasRange: false,
    defaultSize: "full",
  },

  // Row 8
  {
    id: "vehicle-type-wise",
    title: "Vehicle Type Wise",
    category: "OPERATIONS & FLEET",
    description: "Asset distribution across trucks, buses, trailers, and vans",
    hasRange: false,
    defaultSize: "small",
  },
  // Row 8 (Individual 0.5x0.5 Operational Metric Widgets)
  {
    id: "fleet-efficiency",
    title: "Fleet Efficiency",
    category: "OPERATIONS & FLEET",
    description: "Overall fleet operational and dispatch performance efficiency score",
    hasRange: false,
    defaultSize: "mini",
  },
  {
    id: "toll-expense",
    title: "Toll",
    category: "OPERATIONS & FLEET",
    description: "Daily accumulated highway FASTag and toll gate expenses",
    hasRange: false,
    defaultSize: "mini",
  },
  {
    id: "carbon-emission",
    title: "Carbon Emission",
    category: "OPERATIONS & FLEET",
    description: "Fleet environmental carbon offset and emissions saved",
    hasRange: false,
    defaultSize: "mini",
  },
  {
    id: "active-alerts",
    title: "Alerts",
    category: "OPERATIONS & FLEET",
    description: "Total real-time active system alarms and trigger notifications",
    hasRange: false,
    defaultSize: "mini",
  },
  {
    id: "sos-alerts",
    title: "SOS Alerts Feed",
    category: "SAFETY & ALERTS",
    description: "Real-time emergency triggers and vehicle telemetry feed",
    hasRange: false,
    defaultSize: "small",
  },

  // Row 9
  {
    id: "alerts-day-time",
    title: "Alerts by Day / Time",
    category: "SAFETY & ALERTS",
    description: "Weekly alarm volume and incident severity trend",
    hasRange: false,
    defaultSize: "small",
  },
  {
    id: "alerts-object-type",
    title: "Alerts by Object Type",
    category: "SAFETY & ALERTS",
    description: "Alarm volume and risk severity categorized by vehicle class",
    hasRange: false,
    defaultSize: "small",
  },
  {
    id: "risky-drivers",
    title: "Top 5 Risky Drivers",
    category: "DRIVER PERFORMANCE",
    description: "Drivers with highest telematics violations and risk scores",
    hasRange: true,
    defaultSize: "medium",
  },

  // Row 10
  {
    id: "fleet-score",
    title: "Fleet Average Score",
    category: "DRIVER PERFORMANCE",
    description: "Overall fleet safety rating gauge with benchmark delta",
    hasRange: true,
    defaultSize: "small",
  },
  {
    id: "score-distribution",
    title: "Driver Score Distribution",
    category: "DRIVER PERFORMANCE",
    description: "Drivers categorized per score bracket (0-10 up to 91-100)",
    hasRange: true,
    defaultSize: "small",
  },
  {
    id: "camera-status",
    title: "Real-time Camera Status",
    category: "HARDWARE & SENSORS",
    description: "Online, offline, and video loss camera sensor telemetry",
    hasRange: false,
    defaultSize: "small",
  },

  // Row 11
  {
    id: "event-heatmap",
    title: "Event Heatmap",
    category: "SAFETY & ALERTS",
    description: "7 days × 24 hours hotspot density grid matrix",
    hasRange: true,
    defaultSize: "medium",
  },
  {
    id: "shift-compliance",
    title: "Service / Shift Compliance",
    category: "DRIVER PERFORMANCE",
    description: "Duty hours compliance, overtime violations, and daily curve",
    hasRange: false,
    defaultSize: "small",
  },

  // Row 12
  {
    id: "tariff",
    title: "Tariff",
    category: "OPERATIONS & FLEET",
    description: "SIM tariff expiry status: Expired and Expiring Soon counts with quick recharge",
    hasRange: false,
    defaultSize: "mini",
  },
];

export const widgetMeta = (id: WidgetId): WidgetDefinition =>
  WIDGET_CATALOG.find((w) => w.id === id) ?? WIDGET_CATALOG[0]!;
