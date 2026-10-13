import React, { useState, useMemo } from "react";
import {
  Calendar,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  HelpCircle,
  MapPin,
  Play,
  RotateCcw,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Star,
  Truck,
  Zap,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface TravelHistoryLeg {
  id: string;
  object: string;
  startTime: string;
  startLocation: string;
  endTime: string;
  endLocation: string;
  avgSpeed: number;
  maxSpeed: number;
  lastDistance: number;
  distance: number;
  duration: string;
  running: string;
  idle: string;
  stop: string;
  alert: number;
  status: "running" | "idle" | "stop";
}

export const TRAVEL_HISTORY_LEGS: TravelHistoryLeg[] = [
  {
    id: "th-1",
    object: "BUS - 130003",
    startTime: "13-10-2026 12:00:03 AM",
    startLocation:
      "6.1 km from Urankul Road, เทศบาลนครสกลนคร 1Ba, Sakon Nakhon, Sakon Nakhon Province, Thailand (SW)",
    endTime: "13-10-2026 03:06:48 AM",
    endLocation: "2.12 km from Ban Wang Mon, Kalasin, Thailand (SE)",
    avgSpeed: 39,
    maxSpeed: 140,
    lastDistance: 120.04,
    distance: 120.04,
    duration: "03:06:45",
    running: "03:06:45",
    idle: "00:00:00",
    stop: "00:00:00",
    alert: 0,
    status: "running",
  },
  {
    id: "th-2",
    object: "BUS - 130003",
    startTime: "13-10-2026 03:06:48 AM",
    startLocation: "2.12 km from Ban Wang Mon, Kalasin, Thailand (SE)",
    endTime: "13-10-2026 03:06:53 AM",
    endLocation: "2.12 km from Ban Wang Mon, Kalasin, Thailand (SE)",
    avgSpeed: 0,
    maxSpeed: 0,
    lastDistance: 0.0,
    distance: 120.04,
    duration: "00:00:05",
    running: "03:06:45",
    idle: "00:00:05",
    stop: "00:00:00",
    alert: 0,
    status: "idle",
  },
  {
    id: "th-3",
    object: "BUS - 130003",
    startTime: "13-10-2026 03:06:53 AM",
    startLocation: "2.12 km from Ban Wang Mon, Kalasin, Thailand (SE)",
    endTime: "13-10-2026 09:48:00 AM",
    endLocation:
      "3.27 km from เทศบาลนครสกลนคร, Sakon Nakhon Province, Thailand (SW)",
    avgSpeed: 45,
    maxSpeed: 150,
    lastDistance: 297.74,
    distance: 418.68,
    duration: "06:41:07",
    running: "09:47:52",
    idle: "00:00:05",
    stop: "00:00:00",
    alert: 0,
    status: "running",
  },
  {
    id: "th-4",
    object: "DB Richmor - DB Richmor",
    startTime: "13-10-2026 12:00:00 AM",
    startLocation: "At Uffizio - Head Office",
    endTime: "13-10-2026 09:48:00 AM",
    endLocation: "At Uffizio - Head Office",
    avgSpeed: 0,
    maxSpeed: 0,
    lastDistance: 0.0,
    distance: 0.0,
    duration: "09:48:00",
    running: "00:00:00",
    idle: "00:00:00",
    stop: "09:48:00",
    alert: 0,
    status: "stop",
  },
  {
    id: "th-5",
    object: "FTC927 - FTC927",
    startTime: "13-10-2026 12:00:00 AM",
    startLocation:
      "The Metropolis, Opp. S.T. Workshop, Valsad - Dharampur Rd, Abrama, Valsad, Gujarat (SE)",
    endTime: "13-10-2026 09:42:51 AM",
    endLocation:
      "The Metropolis, Opp. S.T. Workshop, Valsad - Dharampur Rd, Abrama, Valsad, Gujarat (SE)",
    avgSpeed: 0,
    maxSpeed: 0,
    lastDistance: 0.0,
    distance: 0.0,
    duration: "09:42:51",
    running: "00:00:00",
    idle: "00:00:00",
    stop: "09:42:51",
    alert: 0,
    status: "stop",
  },
  {
    id: "th-6",
    object: "FTC927 - FTC927",
    startTime: "13-10-2026 09:42:51 AM",
    startLocation:
      "The Metropolis, Opp. S.T. Workshop, Valsad - Dharampur Rd, Abrama, Valsad, Gujarat (SW)",
    endTime: "13-10-2026 09:43:06 AM",
    endLocation:
      "The Metropolis, Opp. S.T. Workshop, Valsad - Dharampur Rd, Abrama, Valsad, Gujarat (SW)",
    avgSpeed: 5,
    maxSpeed: 6,
    lastDistance: 0.02,
    distance: 0.02,
    duration: "00:00:15",
    running: "00:00:15",
    idle: "00:00:00",
    stop: "09:42:51",
    alert: 0,
    status: "running",
  },
  {
    id: "th-7",
    object: "FTC927 - FTC927",
    startTime: "13-10-2026 09:43:06 AM",
    startLocation:
      "The Metropolis, Opp. S.T. Workshop, Valsad - Dharampur Rd, Abrama, Valsad, Gujarat (SW)",
    endTime: "13-10-2026 09:48:00 AM",
    endLocation:
      "The Metropolis, Opp. S.T. Workshop, Valsad - Dharampur Rd, Abrama, Valsad, Gujarat (SW)",
    avgSpeed: 0,
    maxSpeed: 0,
    lastDistance: 0.0,
    distance: 0.02,
    duration: "00:04:54",
    running: "00:00:15",
    idle: "00:00:00",
    stop: "09:47:45",
    alert: 0,
    status: "stop",
  },
  {
    id: "th-8",
    object: "Fuel - 1001",
    startTime: "13-10-2026 12:00:01 AM",
    startLocation: "Amokuni, Southeast Sulawesi, Indonesia (NE)",
    endTime: "13-10-2026 09:48:00 AM",
    endLocation: "Labela, Southeast Sulawesi, Indonesia (NW)",
    avgSpeed: 24,
    maxSpeed: 150,
    lastDistance: 236.59,
    distance: 236.59,
    duration: "09:47:59",
    running: "09:47:59",
    idle: "00:00:00",
    stop: "00:00:00",
    alert: 0,
    status: "running",
  },
  {
    id: "th-9",
    object: "Fuel - 12393",
    startTime: "13-10-2026 12:00:03 AM",
    startLocation:
      "Koot Hanuman Mandir, Koot, Kalli Mati Rd, Kalli Paschim, Uttar Pradesh (SW)",
    endTime: "13-10-2026 12:03:53 AM",
    endLocation:
      "National Institute of Pharmaceutical Education and Research, Raebareli, Near CRPF Base Camp, Bijnor - Sarvndi Road, Sarojini Nagar, Lucknow, Uttar Pradesh (NE)",
    avgSpeed: 39,
    maxSpeed: 86,
    lastDistance: 2.46,
    distance: 2.46,
    duration: "00:03:50",
    running: "00:03:50",
    idle: "00:00:00",
    stop: "00:00:00",
    alert: 0,
    status: "running",
  },
  {
    id: "th-10",
    object: "Fuel - 12393",
    startTime: "13-10-2026 12:03:53 AM",
    startLocation:
      "National Institute of Pharmaceutical Education and Research, Raebareli, Near CRPF Base Camp, Bijnor - Sarvndi Road, Sarojini Nagar, Lucknow, Uttar Pradesh (NE)",
    endTime: "13-10-2026 12:03:58 AM",
    endLocation:
      "National Institute of Pharmaceutical Education and Research, Raebareli, Near CRPF Base Camp, Bijnor - Sarvndi Road, Sarojini Nagar, Lucknow, Uttar Pradesh (NE)",
    avgSpeed: 0,
    maxSpeed: 0,
    lastDistance: 0.0,
    distance: 2.46,
    duration: "00:00:05",
    running: "00:03:50",
    idle: "00:00:05",
    stop: "00:00:00",
    alert: 0,
    status: "idle",
  },
  {
    id: "th-11",
    object: "Fuel - 12393",
    startTime: "13-10-2026 12:03:58 AM",
    startLocation:
      "National Institute of Pharmaceutical Education and Research, Raebareli, Near CRPF Base Camp, Bijnor - Sarvndi Road, Sarojini Nagar, Lucknow, Uttar Pradesh (NE)",
    endTime: "13-10-2026 09:48:00 AM",
    endLocation:
      "National Institute of Pharmaceutical Education and Research, Raebareli, Near CRPF Base Camp, Bijnor - Sarvndi Road, Sarojini Nagar, Lucknow, Uttar Pradesh (NE)",
    avgSpeed: 0,
    maxSpeed: 0,
    lastDistance: 0.0,
    distance: 2.46,
    duration: "09:44:02",
    running: "00:03:50",
    idle: "00:00:05",
    stop: "09:44:02",
    alert: 27,
    status: "stop",
  },
  {
    id: "th-12",
    object: "Fuel - 130001",
    startTime: "13-10-2026 12:00:01 AM",
    startLocation: "Sakon Nakhon, Sakon Nakhon Province, Thailand",
    endTime: "13-10-2026 09:48:00 AM",
    endLocation: "Ban Wang Mon, Kalasin, Thailand",
    avgSpeed: 33,
    maxSpeed: 150,
    lastDistance: 314.9,
    distance: 314.9,
    duration: "09:47:59",
    running: "09:25:05",
    idle: "00:14:10",
    stop: "00:04:45",
    alert: 2,
    status: "running",
  },
];

export function TravelHistoryPreview() {
  const [isFavorite, setIsFavorite] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [activeLegMap, setActiveLegMap] = useState<TravelHistoryLeg | null>(null);

  const filteredLegs = useMemo(() => {
    return TRAVEL_HISTORY_LEGS.filter((leg) => {
      if (
        selectedStatusFilter !== "all" &&
        leg.status !== selectedStatusFilter
      ) {
        return false;
      }
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        return (
          leg.object.toLowerCase().includes(term) ||
          leg.startLocation.toLowerCase().includes(term) ||
          leg.endLocation.toLowerCase().includes(term) ||
          leg.startTime.toLowerCase().includes(term) ||
          leg.endTime.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [selectedStatusFilter, searchTerm]);

  const handleExport = (format: string) => {
    toast.success(`Exporting Travel History as ${format.toUpperCase()}`, {
      description: "Generating trip segments, GPS coordinates, and speed telemetry...",
    });
  };

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-[#DFE3EB]/90 bg-white text-slate-800 shadow-2xs dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 animate-in fade-in duration-200">
      {/* ── 1. Top Title & Filter Controls (Exact Match to Travel History Screenshot) ── */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
        {/* Title row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsFavorite((prev) => !prev)}
              className="text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
              title="Add to Favorites"
            >
              <Star
                className={cn(
                  "h-5 w-5",
                  isFavorite ? "fill-amber-400 text-amber-500" : "text-slate-400"
                )}
              />
            </button>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Travel History
            </h3>
          </div>

          {/* Right utility buttons: search & settings */}
          <div className="flex items-center gap-2">

            <div className="flex items-center h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs shadow-2xs dark:bg-slate-800 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-300 font-semibold mr-2 flex items-center gap-1 select-none">
                All fields <ChevronDown className="h-3 w-3 opacity-60" />
              </span>
              <div className="h-3.5 w-[1px] bg-slate-200 dark:bg-slate-700 mr-2" />
              <Search className="h-3.5 w-3.5 text-slate-400 mr-1.5 shrink-0" />
              <input
                type="text"
                placeholder="Search in all fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none w-28 sm:w-44 dark:text-slate-100"
              />
            </div>

            <button
              type="button"
              className="h-8 w-8 rounded-md border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-2xs dark:bg-slate-800 dark:border-slate-700"
              title="Schedule Report"
            >
              <CalendarClock className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="h-8 w-8 rounded-md border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-2xs dark:bg-slate-800 dark:border-slate-700"
              title="Column Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="h-8 w-8 rounded-md border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-2xs dark:bg-slate-800 dark:border-slate-700"
              title="Help & Documentation"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter bar row */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Date range picker pill */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 shadow-2xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
          >
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-mono text-[11px]">
              13/10/2026 12:00 AM - 13/10/2026 09:48 AM
            </span>
            <ChevronDown className="h-3 w-3 text-slate-400 ml-0.5" />
          </button>

          {/* Status quick toggle */}
          <div className="flex items-center rounded-md border border-slate-200 bg-white p-0.5 shadow-2xs dark:bg-slate-800 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setSelectedStatusFilter("all")}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer",
                selectedStatusFilter === "all"
                  ? "bg-[#0089FF] text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
              )}
            >
              All Legs
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatusFilter("running")}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer",
                selectedStatusFilter === "running"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Running
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatusFilter("idle")}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer",
                selectedStatusFilter === "idle"
                  ? "bg-amber-600 text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Idle
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatusFilter("stop")}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer",
                selectedStatusFilter === "stop"
                  ? "bg-rose-600 text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Stopped
            </button>
          </div>

          {/* Filter button */}
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 shadow-2xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 ml-auto"
          >
            <SlidersHorizontal className="h-3 w-3 text-slate-500" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* ── 2. Data Table with Summary Row Matching Screenshot ── */}
      <div className="overflow-x-auto max-h-[460px] custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
          {/* Table Header */}
          <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none shadow-xs">
            <tr>
              <th className="py-2.5 px-3">Object ▲</th>
              <th className="py-2.5 px-3">Start Time ▲</th>
              <th className="py-2.5 px-3 min-w-[260px]">Start Location</th>
              <th className="py-2.5 px-3">End Time</th>
              <th className="py-2.5 px-3 min-w-[260px]">End Location</th>
              <th className="py-2.5 px-2 text-right">AVG speed</th>
              <th className="py-2.5 px-2 text-right">MAX</th>
              <th className="py-2.5 px-2 text-right">Last Distance</th>
              <th className="py-2.5 px-3 text-right">Distance (km)</th>
              <th className="py-2.5 px-3 text-center">Duration</th>
              <th className="py-2.5 px-3 text-center text-emerald-600">Running</th>
              <th className="py-2.5 px-3 text-center text-amber-600">Idle</th>
              <th className="py-2.5 px-3 text-center text-rose-600">Stop</th>
              <th className="py-2.5 px-2 text-right text-rose-600">Alert</th>
              <th className="py-2.5 px-2 text-center">Map</th>
              <th className="py-2.5 px-2 text-center">Status</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-sans text-xs">
            {/* ── Summary Totals Row (Matching Screenshot: Duration: 146:59:21, Alert: 29.0) ── */}
            <tr className="bg-slate-50/90 dark:bg-slate-800/60 font-semibold border-b-2 border-slate-200 dark:border-slate-700">
              <td className="py-2.5 px-3 font-bold text-slate-700 dark:text-slate-200">
                Summary Totals
              </td>
              <td className="py-2.5 px-3 text-slate-400">-</td>
              <td className="py-2.5 px-3 text-slate-400">-</td>
              <td className="py-2.5 px-3 text-slate-400">-</td>
              <td className="py-2.5 px-3 text-slate-400">-</td>
              <td className="py-2.5 px-2 text-right text-slate-400">-</td>
              <td className="py-2.5 px-2 text-right text-slate-400">-</td>
              <td className="py-2.5 px-2 text-right text-slate-400">-</td>
              <td className="py-2.5 px-3 text-right font-bold text-[#0089FF]">
                1,080.36 km
              </td>
              <td className="py-2.5 px-3 text-center font-bold text-slate-900 dark:text-white font-mono">
                146:59:21
              </td>
              <td className="py-2.5 px-3 text-center text-emerald-600 font-mono">
                25:47:11
              </td>
              <td className="py-2.5 px-3 text-center text-amber-600 font-mono">
                00:14:25
              </td>
              <td className="py-2.5 px-3 text-center text-rose-600 font-mono">
                120:57:45
              </td>
              <td className="py-2.5 px-2 text-right font-bold text-rose-600">
                29.0
              </td>
              <td className="py-2.5 px-2 text-center text-slate-400">-</td>
              <td className="py-2.5 px-2 text-center text-slate-400">-</td>
            </tr>

            {/* ── Data Rows ── */}
            {filteredLegs.map((leg) => {
              const isRunning = leg.status === "running";
              const isIdle = leg.status === "idle";
              const isStop = leg.status === "stop";

              return (
                <tr
                  key={leg.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Object */}
                  <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">
                    {leg.object}
                  </td>

                  {/* Start Time */}
                  <td className="py-2 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    {leg.startTime}
                  </td>

                  {/* Start Location */}
                  <td
                    className="py-2 px-3 text-slate-600 dark:text-slate-300 truncate max-w-[280px]"
                    title={leg.startLocation}
                  >
                    {leg.startLocation}
                  </td>

                  {/* End Time */}
                  <td className="py-2 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    {leg.endTime}
                  </td>

                  {/* End Location */}
                  <td
                    className="py-2 px-3 text-slate-600 dark:text-slate-300 truncate max-w-[280px]"
                    title={leg.endLocation}
                  >
                    {leg.endLocation}
                  </td>

                  {/* AVG Speed */}
                  <td className="py-2 px-2 text-right font-mono font-medium">
                    {leg.avgSpeed}
                  </td>

                  {/* MAX Speed */}
                  <td className="py-2 px-2 text-right font-mono font-medium">
                    {leg.maxSpeed}
                  </td>

                  {/* Last Distance */}
                  <td className="py-2 px-2 text-right font-mono text-slate-600">
                    {leg.lastDistance.toFixed(2)}
                  </td>

                  {/* Distance */}
                  <td className="py-2 px-3 text-right font-mono font-bold text-[#0089FF]">
                    {leg.distance.toFixed(2)}
                  </td>

                  {/* Duration */}
                  <td className="py-2 px-3 text-center font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                    {leg.duration}
                  </td>

                  {/* Running */}
                  <td className="py-2 px-3 text-center font-mono text-[11px] text-emerald-600 font-medium">
                    {leg.running}
                  </td>

                  {/* Idle */}
                  <td className="py-2 px-3 text-center font-mono text-[11px] text-amber-600 font-medium">
                    {leg.idle}
                  </td>

                  {/* Stop */}
                  <td className="py-2 px-3 text-center font-mono text-[11px] text-rose-600 font-medium">
                    {leg.stop}
                  </td>

                  {/* Alert */}
                  <td
                    className={cn(
                      "py-2 px-2 text-right font-mono font-bold",
                      leg.alert > 0 ? "text-rose-600" : "text-slate-400"
                    )}
                  >
                    {leg.alert}
                  </td>

                  {/* Map Lightning Bolt */}
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => setActiveLegMap(leg)}
                      title={`Inspect leg map route for ${leg.object}`}
                      className="inline-flex items-center justify-center h-6 w-6 rounded hover:bg-emerald-50 text-emerald-600 transition-colors cursor-pointer"
                    >
                      <Zap className="h-3.5 w-3.5 fill-emerald-500 text-emerald-600" />
                    </button>
                  </td>

                  {/* Status Indicator Icon */}
                  <td className="py-2 px-2 text-center">
                    {isRunning && (
                      <span
                        className="inline-flex items-center justify-center h-5 w-5 rounded bg-emerald-100 text-emerald-700"
                        title="Vehicle in Motion (Running)"
                      >
                        <Truck className="h-3.5 w-3.5 text-emerald-700" />
                      </span>
                    )}
                    {isIdle && (
                      <span
                        className="inline-flex items-center justify-center h-5 w-5 rounded bg-amber-100 text-amber-700"
                        title="Engine Idle (Ignition ON, Speed 0)"
                      >
                        <Truck className="h-3.5 w-3.5 text-amber-700" />
                      </span>
                    )}
                    {isStop && (
                      <span
                        className="inline-flex items-center justify-center h-5 w-5 rounded bg-rose-100 text-rose-700"
                        title="Stopped (Ignition OFF)"
                      >
                        <MapPin className="h-3.5 w-3.5 text-rose-700 fill-rose-500" />
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── 3. Bottom Utility Bar: XLS, PDF, CSV, Search, and Pagination (Exact Match) ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 text-xs">
        {/* Left: Export Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleExport("xls")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition-colors shadow-2xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
            title="Export to XLS"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            <span>XLS</span>
          </button>
          <button
            type="button"
            onClick={() => handleExport("pdf")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-100 hover:text-rose-700 transition-colors shadow-2xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
            title="Export to PDF"
          >
            <FileText className="h-3.5 w-3.5 text-rose-600" />
            <span>PDF</span>
          </button>
          <button
            type="button"
            onClick={() => handleExport("csv")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-700 transition-colors shadow-2xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
            title="Export to CSV"
          >
            <Download className="h-3.5 w-3.5 text-blue-600" />
            <span>CSV</span>
          </button>
        </div>

        {/* Center: Search with "All" Select */}
        <div className="flex items-center h-8 rounded-md border border-slate-200 bg-white px-2.5 shadow-2xs dark:bg-slate-800 dark:border-slate-700">
          <span className="text-slate-500 font-semibold mr-2 flex items-center gap-1 select-none text-[11px]">
            All <ChevronDown className="h-3 w-3 opacity-60" />
          </span>
          <div className="h-3.5 w-[1px] bg-slate-200 dark:bg-slate-700 mr-2" />
          <input
            type="text"
            placeholder="Search trip legs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none w-28 sm:w-40 dark:text-slate-100"
          />
          <Search className="h-3.5 w-3.5 text-slate-400 ml-1 shrink-0" />
        </div>

        {/* Right: Page size and Pagination */}
        <div className="flex items-center gap-3 select-none">
          {/* Page size dropdown */}
          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span className="text-[11px]">Rows:</span>
            <button
              type="button"
              className="flex items-center gap-1 px-2 py-1 rounded border border-slate-200 bg-white font-semibold text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
            >
              <span>20</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="h-7 w-7 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-300 cursor-not-allowed dark:bg-slate-800 dark:border-slate-700"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="px-2 py-0.5 rounded font-semibold bg-sky-50 text-[#0089FF] border border-sky-200 text-xs dark:bg-sky-950 dark:border-sky-900">
              1
            </span>
            <button
              type="button"
              className="h-7 w-7 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Total Record counter */}
          <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">
            1-20 (690)
          </span>
        </div>
      </div>

      {/* ── 4. Interactive Map Modal for Selected Trip Leg ── */}
      {activeLegMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden dark:bg-slate-900 dark:border-slate-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-3 bg-slate-50 dark:bg-slate-800/60">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-600 fill-emerald-500" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Trip Route Telemetry · {activeLegMap.object}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveLegMap(null)}
                className="h-7 w-7 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body: Map Simulation */}
            <div className="p-4 space-y-3">
              <div className="relative h-48 w-full rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center">
                {/* SVG Route Visualization */}
                <svg className="w-full h-full opacity-85" viewBox="0 0 400 180">
                  <path
                    d="M 50 130 C 120 40, 260 160, 350 50"
                    fill="none"
                    stroke="#0089FF"
                    strokeWidth="3.5"
                    strokeDasharray="6,4"
                  />
                  {/* Start Point */}
                  <circle cx="50" cy="130" r="7" fill="#10B981" />
                  <circle cx="50" cy="130" r="14" fill="#10B981" opacity="0.25" />
                  <text x="50" y="160" fontSize="10" fill="#10B981" fontWeight="bold" textAnchor="middle">
                    Start
                  </text>
                  {/* End Point */}
                  <circle cx="350" cy="50" r="7" fill="#EF4444" />
                  <circle cx="350" cy="50" r="14" fill="#EF4444" opacity="0.25" />
                  <text x="350" y="80" fontSize="10" fill="#EF4444" fontWeight="bold" textAnchor="middle">
                    End
                  </text>
                </svg>
                <div className="absolute top-2 left-2 px-2 py-1 rounded bg-white/90 dark:bg-slate-900/90 text-[10px] font-bold text-slate-700 dark:text-slate-200 border border-slate-200 shadow-2xs">
                  Leg Distance: {activeLegMap.distance} km · Avg: {activeLegMap.avgSpeed} km/h
                </div>
              </div>

              {/* Waypoints */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 dark:bg-slate-800/40 dark:border-slate-700">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold mb-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Departure Point</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-500 mb-1">
                    {activeLegMap.startTime}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-snug">
                    {activeLegMap.startLocation}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 dark:bg-slate-800/40 dark:border-slate-700">
                  <div className="flex items-center gap-1.5 text-rose-600 font-bold mb-1">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    <span>Arrival Point</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-500 mb-1">
                    {activeLegMap.endTime}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-snug">
                    {activeLegMap.endLocation}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <button
                type="button"
                onClick={() => setActiveLegMap(null)}
                className="px-3.5 py-1.5 rounded-md bg-[#0089FF] text-white text-xs font-semibold hover:bg-sky-600 transition-colors cursor-pointer"
              >
                Close Route View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
