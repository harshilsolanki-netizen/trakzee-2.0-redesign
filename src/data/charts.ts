/* Deterministic mock data for the Advanced Fleet Charts dashboard. */

export type ChartCategory =
  | "activity"
  | "alert"
  | "fuel"
  | "adblue"
  | "expense"
  | "tire"
  | "temperature"
  | "load"
  | "pressure_gauge"
  | "rotation"
  | "bms"
  | "rpm"
  | "depth"
  | "flow_meter";

export type ChartTreeItem = {
  id: string;
  label: string;
  metric: string;
  unit: string;
  range: [number, number];
  category: ChartCategory;
  categoryLabel: string;
};

export type ChartCategoryNode = {
  category: ChartCategory;
  label: string;
  items: ChartTreeItem[];
};

export const CHART_CATEGORIES: ChartCategoryNode[] = [
  {
    category: "activity",
    label: "Activity",
    items: [
      {
        id: "distance",
        label: "Distance",
        metric: "distance",
        unit: "km",
        range: [40, 620],
        category: "activity",
        categoryLabel: "Activity",
      },
      {
        id: "duration",
        label: "Duration",
        metric: "duration",
        unit: "hrs",
        range: [2, 12],
        category: "activity",
        categoryLabel: "Activity",
      },
      {
        id: "speed",
        label: "Speed Vs Time",
        metric: "speed",
        unit: "km/h",
        range: [20, 110],
        category: "activity",
        categoryLabel: "Activity",
      },
      {
        id: "battery_voltage",
        label: "Battery Voltage",
        metric: "battery_voltage",
        unit: "V",
        range: [11.8, 14.4],
        category: "activity",
        categoryLabel: "Activity",
      },
      {
        id: "workhour",
        label: "Object Work Hour",
        metric: "workhour",
        unit: "hrs",
        range: [3, 10],
        category: "activity",
        categoryLabel: "Activity",
      },
      {
        id: "battery_percentage",
        label: "Battery Percentage",
        metric: "battery_percentage",
        unit: "%",
        range: [40, 100],
        category: "activity",
        categoryLabel: "Activity",
      },
      {
        id: "heatmap",
        label: "Heat Map",
        metric: "heatmap",
        unit: "pts",
        range: [10, 95],
        category: "activity",
        categoryLabel: "Activity",
      },
      {
        id: "object_workhour",
        label: "Object Wise Work Hour",
        metric: "object_workhour",
        unit: "hrs",
        range: [4, 11],
        category: "activity",
        categoryLabel: "Activity",
      },
    ],
  },
  {
    category: "alert",
    label: "Alert",
    items: [
      {
        id: "alerts",
        label: "Alert Summary",
        metric: "alerts",
        unit: "count",
        range: [1, 20],
        category: "alert",
        categoryLabel: "Alert",
      },
      {
        id: "overspeed_alert",
        label: "Over Speed Alert",
        metric: "overspeed_alert",
        unit: "count",
        range: [0, 15],
        category: "alert",
        categoryLabel: "Alert",
      },
      {
        id: "geofence_alert",
        label: "Geofence Alert",
        metric: "geofence_alert",
        unit: "count",
        range: [0, 8],
        category: "alert",
        categoryLabel: "Alert",
      },
      {
        id: "harsh_brake",
        label: "Harsh Braking",
        metric: "harsh_brake",
        unit: "count",
        range: [0, 12],
        category: "alert",
        categoryLabel: "Alert",
      },
      {
        id: "harsh_accel",
        label: "Harsh Acceleration",
        metric: "harsh_accel",
        unit: "count",
        range: [0, 9],
        category: "alert",
        categoryLabel: "Alert",
      },
      {
        id: "panic_alert",
        label: "Panic Alert",
        metric: "panic_alert",
        unit: "count",
        range: [0, 3],
        category: "alert",
        categoryLabel: "Alert",
      },
    ],
  },
  {
    category: "fuel",
    label: "Fuel",
    items: [
      {
        id: "fuel-fill-drain",
        label: "Fuel Fill-Drain",
        metric: "fuel-fill-drain",
        unit: "ltr",
        range: [20, 180],
        category: "fuel",
        categoryLabel: "Fuel",
      },
      {
        id: "fuel_consumption",
        label: "Fuel Consumption",
        metric: "fuel_consumption",
        unit: "ltr/100km",
        range: [18, 38],
        category: "fuel",
        categoryLabel: "Fuel",
      },
      {
        id: "fuel_theft",
        label: "Fuel Theft",
        metric: "fuel_theft",
        unit: "ltr",
        range: [0, 25],
        category: "fuel",
        categoryLabel: "Fuel",
      },
      {
        id: "fuel_daily",
        label: "Daily Fuel Summary",
        metric: "fuel_daily",
        unit: "ltr",
        range: [40, 220],
        category: "fuel",
        categoryLabel: "Fuel",
      },
    ],
  },
  {
    category: "adblue",
    label: "AdBlue",
    items: [
      {
        id: "adblue_level",
        label: "AdBlue Level",
        metric: "adblue_level",
        unit: "%",
        range: [15, 100],
        category: "adblue",
        categoryLabel: "AdBlue",
      },
      {
        id: "adblue_consumption",
        label: "AdBlue Consumption",
        metric: "adblue_consumption",
        unit: "ltr",
        range: [2, 18],
        category: "adblue",
        categoryLabel: "AdBlue",
      },
    ],
  },
  {
    category: "expense",
    label: "Expense",
    items: [
      {
        id: "fuel_expense",
        label: "Fuel Expense",
        metric: "fuel_expense",
        unit: "₹",
        range: [2500, 18000],
        category: "expense",
        categoryLabel: "Expense",
      },
      {
        id: "maintenance_expense",
        label: "Maintenance Expense",
        metric: "maintenance_expense",
        unit: "₹",
        range: [1200, 9500],
        category: "expense",
        categoryLabel: "Expense",
      },
      {
        id: "toll_expense",
        label: "Toll Expense",
        metric: "toll_expense",
        unit: "₹",
        range: [400, 3200],
        category: "expense",
        categoryLabel: "Expense",
      },
    ],
  },
  {
    category: "tire",
    label: "Tire",
    items: [
      {
        id: "tire_pressure",
        label: "Tire Pressure",
        metric: "tire_pressure",
        unit: "psi",
        range: [90, 130],
        category: "tire",
        categoryLabel: "Tire",
      },
      {
        id: "tire_temperature",
        label: "Tire Temperature",
        metric: "tire_temperature",
        unit: "°C",
        range: [35, 78],
        category: "tire",
        categoryLabel: "Tire",
      },
      {
        id: "axle_summary",
        label: "Axle Summary",
        metric: "axle_summary",
        unit: "psi",
        range: [95, 125],
        category: "tire",
        categoryLabel: "Tire",
      },
    ],
  },
  {
    category: "temperature",
    label: "Temperature",
    items: [
      {
        id: "temp_sensor_1",
        label: "Temperature Sensor 1",
        metric: "temp_sensor_1",
        unit: "°C",
        range: [-18, 8],
        category: "temperature",
        categoryLabel: "Temperature",
      },
      {
        id: "temp_sensor_2",
        label: "Temperature Sensor 2",
        metric: "temp_sensor_2",
        unit: "°C",
        range: [-22, 4],
        category: "temperature",
        categoryLabel: "Temperature",
      },
      {
        id: "multi_temp",
        label: "Multi-Sensor Trend",
        metric: "multi_temp",
        unit: "°C",
        range: [-20, 10],
        category: "temperature",
        categoryLabel: "Temperature",
      },
    ],
  },
  {
    category: "load",
    label: "Load",
    items: [
      {
        id: "axle_load",
        label: "Axle Load",
        metric: "axle_load",
        unit: "ton",
        range: [6, 28],
        category: "load",
        categoryLabel: "Load",
      },
      {
        id: "payload_trend",
        label: "Payload Trend",
        metric: "payload_trend",
        unit: "ton",
        range: [10, 35],
        category: "load",
        categoryLabel: "Load",
      },
      {
        id: "overload_summary",
        label: "Overload Summary",
        metric: "overload_summary",
        unit: "count",
        range: [0, 6],
        category: "load",
        categoryLabel: "Load",
      },
    ],
  },
  {
    category: "pressure_gauge",
    label: "Pressure Gauge",
    items: [
      {
        id: "oil_pressure",
        label: "Oil Pressure",
        metric: "oil_pressure",
        unit: "bar",
        range: [2.5, 6.8],
        category: "pressure_gauge",
        categoryLabel: "Pressure Gauge",
      },
      {
        id: "air_pressure",
        label: "Air Pressure",
        metric: "air_pressure",
        unit: "bar",
        range: [6.0, 9.5],
        category: "pressure_gauge",
        categoryLabel: "Pressure Gauge",
      },
    ],
  },
  {
    category: "rotation",
    label: "Rotation",
    items: [
      {
        id: "drum_rotation",
        label: "Drum Rotation",
        metric: "drum_rotation",
        unit: "RPM",
        range: [4, 22],
        category: "rotation",
        categoryLabel: "Rotation",
      },
      {
        id: "rotation_direction",
        label: "Rotation Direction",
        metric: "rotation_direction",
        unit: "RPM",
        range: [-16, 18],
        category: "rotation",
        categoryLabel: "Rotation",
      },
      {
        id: "rotation_work_hour",
        label: "Rotation Work Hours",
        metric: "rotation_work_hour",
        unit: "hrs",
        range: [2, 9],
        category: "rotation",
        categoryLabel: "Rotation",
      },
    ],
  },
  {
    category: "bms",
    label: "BMS",
    items: [
      {
        id: "bms_soc",
        label: "State of Charge (SOC)",
        metric: "bms_soc",
        unit: "%",
        range: [20, 100],
        category: "bms",
        categoryLabel: "BMS",
      },
      {
        id: "bms_soh",
        label: "State of Health (SOH)",
        metric: "bms_soh",
        unit: "%",
        range: [85, 100],
        category: "bms",
        categoryLabel: "BMS",
      },
      {
        id: "bms_cell_voltage",
        label: "Cell Voltage",
        metric: "bms_cell_voltage",
        unit: "V",
        range: [3.2, 4.2],
        category: "bms",
        categoryLabel: "BMS",
      },
      {
        id: "bms_cell_temp",
        label: "Cell Temperature",
        metric: "bms_cell_temp",
        unit: "°C",
        range: [24, 46],
        category: "bms",
        categoryLabel: "BMS",
      },
    ],
  },
  {
    category: "rpm",
    label: "RPM",
    items: [
      {
        id: "engine_rpm",
        label: "Engine RPM",
        metric: "engine_rpm",
        unit: "RPM",
        range: [650, 2600],
        category: "rpm",
        categoryLabel: "RPM",
      },
      {
        id: "idle_rpm",
        label: "Idle RPM",
        metric: "idle_rpm",
        unit: "RPM",
        range: [600, 950],
        category: "rpm",
        categoryLabel: "RPM",
      },
    ],
  },
  {
    category: "depth",
    label: "Depth",
    items: [
      {
        id: "depth_level",
        label: "Depth Level",
        metric: "depth_level",
        unit: "m",
        range: [0.5, 14],
        category: "depth",
        categoryLabel: "Depth",
      },
      {
        id: "water_level",
        label: "Water Level",
        metric: "water_level",
        unit: "%",
        range: [10, 98],
        category: "depth",
        categoryLabel: "Depth",
      },
    ],
  },
  {
    category: "flow_meter",
    label: "Flow Meter",
    items: [
      {
        id: "flow_rate",
        label: "Flow Rate",
        metric: "flow_rate",
        unit: "L/min",
        range: [12, 145],
        category: "flow_meter",
        categoryLabel: "Flow Meter",
      },
      {
        id: "total_flow",
        label: "Total Flow",
        metric: "total_flow",
        unit: "kL",
        range: [2.5, 48.0],
        category: "flow_meter",
        categoryLabel: "Flow Meter",
      },
    ],
  },
];

/* Helper to find item by id */
export function findChartItem(id: string): ChartTreeItem | undefined {
  for (const cat of CHART_CATEGORIES) {
    const found = cat.items.find((i) => i.id === id);
    if (found) return found;
  }
  return undefined;
}

export const CHART_VEHICLES = [
  "GJ15MM2654",
  "MH12AB1234",
  "MH11GH3456",
  "MH12CD5678",
  "MH14EF9012",
  "MH12JK1313",
];

/* Deterministic pseudo-random (mulberry32) so charts are stable across renders. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hash = (s: string) =>
  [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7);

const round2 = (n: number) => Math.round(n * 100) / 100;

export function getRangeForChart(chartId: string): [number, number] {
  const item = findChartItem(chartId);
  return item ? item.range : [10, 100];
}

/** Level 0 — one value per vehicle for any chart. */
export function objectLevelData(chartId: string) {
  const [min, max] = getRangeForChart(chartId);
  return CHART_VEHICLES.map((v, i) => {
    const r = rng(hash(v + chartId));
    return {
      name: v,
      value: round2(min + r() * (max - min)),
      sr: i + 1,
    };
  });
}

export const DAILY_DATES = [
  "04-12-2024",
  "05-12-2024",
  "06-12-2024",
  "07-12-2024",
  "08-12-2024",
  "09-12-2024",
  "10-12-2024",
];

/** Level 1 — one value per day for a vehicle. */
export function dailyLevelData(chartId: string, vehicle: string) {
  const [min, max] = getRangeForChart(chartId);
  return DAILY_DATES.map((d) => {
    const r = rng(hash(vehicle + d + chartId));
    return {
      name: d,
      value: round2(min + r() * (max - min)),
    };
  });
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Level 2 — one value per working hour for a vehicle+day. */
export function hourlyLevelData(
  chartId: string,
  vehicle: string,
  date: string,
) {
  const [min, max] = getRangeForChart(chartId);
  return Array.from({ length: 12 }, (_, i) => {
    const r = rng(hash(vehicle + date + chartId + i));
    const hour = 7 + i;
    return {
      name: `${pad(hour)}:00`,
      value: round2(min * 0.4 + r() * (max - min * 0.4)),
    };
  });
}

/* ---------------- Fuel Fill-Drain ---------------- */

export type FuelPoint = {
  time: string;
  fuel: number;
  fuelRaw: number;
  ignition: 0 | 1;
  speed: number;
  power: 0 | 1;
};

export type FuelEvent = {
  id: string;
  start: string;
  end: string;
  type: "Fill" | "Drain";
  volume: number;
  valid: boolean;
};

export function fuelSeries(vehicle: string): FuelPoint[] {
  const r = rng(hash(vehicle + "fuel"));
  let fuel = 62;
  return Array.from({ length: 48 }, (_, i) => {
    const hour = 6 + Math.floor(i / 2);
    const ignition: 0 | 1 = hour >= 22 || hour < 6 ? 0 : r() > 0.15 ? 1 : 0;
    if (ignition === 1) fuel = Math.max(8, fuel - r() * 1.4);
    if (i === 14 || i === 34) fuel = Math.min(90, fuel + 22 + r() * 8); // fills
    if (i === 26) fuel = Math.max(8, fuel - 14); // drain
    const speed = ignition === 1 ? Math.round(r() * 72) : 0;
    return {
      time: `${pad(hour)}:${i % 2 === 0 ? "00" : "30"}`,
      fuel: round2(fuel),
      fuelRaw: round2(fuel + (r() - 0.5) * 2.4),
      ignition,
      speed,
      power: 1,
    };
  });
}

export function fuelEvents(series: FuelPoint[]): FuelEvent[] {
  const events: FuelEvent[] = [];
  for (let i = 1; i < series.length; i++) {
    const diff = series[i]!.fuel - series[i - 1]!.fuel;
    if (diff > 5 || diff < -5) {
      events.push({
        id: `fe${i}`,
        start: series[i - 1]!.time,
        end: series[i]!.time,
        type: diff > 0 ? "Fill" : "Drain",
        volume: round2(Math.abs(diff)),
        valid:
          diff > 0
            ? series[i]!.ignition === 0 || true
            : series[i]!.ignition === 0,
      });
    }
  }
  return events;
}
