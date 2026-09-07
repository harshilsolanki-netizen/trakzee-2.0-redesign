import type { TravelRow, Trip } from "@/data/fleet";

export type DailyRow = {
  id: string;
  date: string;
  day: string;
  driver: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  running: string;
  stop: string;
  idle: string;
  maxSpeed: number;
  alerts: number;
};

export type DetailRow = {
  id: string;
  date: string;
  time: string;
  ignition: "ON" | "OFF";
  location: string;
  speed: number;
  distance: number;
  latitude: string;
  longitude: string;
};

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const pad = (n: number) => String(n).padStart(2, "0");

/** One daily-summary row per trip block of a vehicle. */
export function dailyRowsFor(row: TravelRow): DailyRow[] {
  return row.trips.map((t: Trip, i) => ({
    id: `${row.id}-d${i}`,
    date: `${pad(25 + i)}-07-2026`,
    day: DAYS[i % DAYS.length]!,
    driver: row.driver,
    startLocation: t.startLocation,
    endLocation: t.endLocation,
    distance: t.distance,
    running: t.running,
    stop: t.stop,
    idle: t.idle,
    maxSpeed: Math.max(40, row.maxSpeed - i * 3),
    alerts: t.alerts,
  }));
}

/** Synthetic ignition/position log for a single day of one vehicle. */
export function detailRowsFor(row: TravelRow, daily: DailyRow): DetailRow[] {
  const points = 8;
  const perLeg = daily.distance / points;
  return Array.from({ length: points }, (_, i) => {
    const hour = 7 + i;
    const speed =
      i === 0 || i === points - 1
        ? 0
        : 30 + ((row.maxSpeed - 30) * ((i * 37) % 10)) / 10;
    return {
      id: `${daily.id}-p${i}`,
      date: daily.date,
      time: `${pad(hour)}:${pad((i * 17) % 60)}:00`,
      ignition: (i === points - 1 ? "OFF" : "ON") as "ON" | "OFF",
      location:
        i === 0
          ? daily.startLocation
          : i === points - 1
            ? daily.endLocation
            : `${daily.startLocation} → NH${48 + i}, KM ${12 * i}`,
      speed: Math.round(speed),
      distance: Number((perLeg * (i + 1)).toFixed(2)),
      latitude: (18.5204 + i * 0.0137).toFixed(6),
      longitude: (73.8567 + i * 0.0212).toFixed(6),
    };
  });
}
