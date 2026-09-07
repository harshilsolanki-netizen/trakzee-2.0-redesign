export type WidgetCategory = "VIDEO TELEMATICS" | "ACTIVITY";

export type WidgetId =
  | "event-trend"
  | "events-distribution"
  | "events-highlights"
  | "fleet-score"
  | "score-distribution"
  | "risky-drivers"
  | "event-heatmap"
  | "fleet-status"
  | "fleet-usage"
  | "fleet-idle"
  | "fleet-fuel"
  | "fleet-workload"
  | "driver-most-alerts"
  | "object-most-alerts"
  | "object-mode"
  | "camera-status";

export type WidgetDefinition = {
  id: WidgetId;
  title: string;
  category: WidgetCategory;
  description: string;
  hasRange: boolean;
};

export const WIDGET_CATALOG: WidgetDefinition[] = [
  // 1. VIDEO TELEMATICS
  {
    id: "event-trend",
    title: "Event Trend",
    category: "VIDEO TELEMATICS",
    description: "Trend of DMS & ADAS safety events over time",
    hasRange: true,
  },
  {
    id: "events-distribution",
    title: "Event Distribution",
    category: "VIDEO TELEMATICS",
    description: "DMS vs ADAS event split",
    hasRange: true,
  },
  {
    id: "events-highlights",
    title: "Event Highlights",
    category: "VIDEO TELEMATICS",
    description: "Latest violations and event captures feed",
    hasRange: true,
  },
  {
    id: "fleet-score",
    title: "Fleet Average Score",
    category: "VIDEO TELEMATICS",
    description: "Overall fleet safety rating gauge",
    hasRange: true,
  },
  {
    id: "score-distribution",
    title: "Driver Score Distribution",
    category: "VIDEO TELEMATICS",
    description: "Drivers categorized per score bracket",
    hasRange: true,
  },
  {
    id: "risky-drivers",
    title: "Top 5 Risky Drivers",
    category: "VIDEO TELEMATICS",
    description: "Drivers with lowest safety scores",
    hasRange: true,
  },
  {
    id: "event-heatmap",
    title: "Event Heatmap",
    category: "VIDEO TELEMATICS",
    description: "Geographic hot zones of critical safety alerts",
    hasRange: true,
  },

  // 2. ACTIVITY
  {
    id: "fleet-status",
    title: "Fleet Status",
    category: "ACTIVITY",
    description: "Running, Idle, Stopped, Inactive fleet breakdown",
    hasRange: true,
  },
  {
    id: "fleet-usage",
    title: "Fleet Usage",
    category: "ACTIVITY",
    description: "Daily distance traveled and operating hours",
    hasRange: true,
  },
  {
    id: "fleet-idle",
    title: "Fleet Idle",
    category: "ACTIVITY",
    description: "Vehicles with excessive engine idling time",
    hasRange: true,
  },
  {
    id: "fleet-fuel",
    title: "Fleet Fuel",
    category: "ACTIVITY",
    description: "Total fuel consumption and refuel/drain events",
    hasRange: true,
  },
  {
    id: "fleet-workload",
    title: "Fleet Workload",
    category: "ACTIVITY",
    description: "Asset utilization vs scheduled duty cycles",
    hasRange: true,
  },
  {
    id: "driver-most-alerts",
    title: "Driver With Most Alerts",
    category: "ACTIVITY",
    description: "Drivers triggering highest alarm frequencies",
    hasRange: true,
  },
  {
    id: "object-most-alerts",
    title: "Object With Most Alerts",
    category: "ACTIVITY",
    description: "Vehicles generating the most system alerts",
    hasRange: true,
  },
  {
    id: "object-mode",
    title: "Object Mode",
    category: "ACTIVITY",
    description: "Operating mode distribution across fleet assets",
    hasRange: true,
  },
  {
    id: "camera-status",
    title: "Camera Status",
    category: "VIDEO TELEMATICS",
    description: "Online / offline cameras",
    hasRange: false,
  },
];

export const widgetMeta = (id: WidgetId) =>
  WIDGET_CATALOG.find((w) => w.id === id) ?? WIDGET_CATALOG[0]!;
