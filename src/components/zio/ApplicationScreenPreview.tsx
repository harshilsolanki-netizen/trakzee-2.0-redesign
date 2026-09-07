import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  Eye,
  Fuel,
  Gauge,
  Layers,
  LayoutDashboard,
  MapPin,
  Maximize2,
  Minus,
  Navigation,
  PieChart as PieIcon,
  Plus,
  RotateCw,
  Search,
  Shield,
  Sliders,
  TrendingDown,
  TrendingUp,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import { useZio } from "@/zio/ZioContext";
import { type VehicleScoreContext } from "@/zio/zio-service";
import { cn } from "@/lib/utils";

export type ApplicationScreenType =
  | "dashboard"
  | "fleet-map"
  | "trip-summary"
  | "safety-distribution"
  | "today-activity"
  | "vehicle-score";

interface ApplicationScreenPreviewProps {
  type: ApplicationScreenType;
  title?: string;
  data?: VehicleScoreContext | any;
}

export function ApplicationScreenPreview({
  type,
  title,
  data,
}: ApplicationScreenPreviewProps) {
  const { sendMessage } = useZio();
  const [zoom, setZoom] = useState(1);
  const [mapFilter, setMapFilter] = useState<string | null>(null);
  const [selectedPin, setSelectedPin] = useState<{
    name: string;
    driver: string;
    speed: string;
    loc: string;
    status: string;
  } | null>(null);

  // 1. Trakzee 2.0 Executive Dashboard Visual
  if (type === "dashboard") {
    return (
      <div className="my-3 overflow-hidden rounded-xl border border-slate-200/90 bg-white text-slate-900 shadow-md transition-all hover:shadow-lg">
        {/* App Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#111c38] px-3.5 py-2 text-white select-none">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4 text-violet-400" />
            <span className="text-xs font-bold tracking-tight text-white">
              Trakzee 2.0 · Executive Fleet Dashboard
            </span>
          </div>
          <span className="rounded bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-200">
            Live Telematics
          </span>
        </div>

        {/* Dashboard Grid View */}
        <div className="p-3 space-y-3 bg-slate-50/50">
          {/* Top 3 Interactive KPI Summary Cards */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => sendMessage("Why is the Safety low?")}
              title="Click to analyze Fleet Safety Score"
              className="rounded-lg border border-slate-200/80 bg-white p-2.5 shadow-2xs text-left transition-all hover:border-violet-400 hover:bg-violet-50/30 hover:shadow-xs active:scale-[0.98] cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500 uppercase group-hover:text-violet-700">
                  Fleet Score
                </span>
                <span className="flex items-center text-[10px] font-bold text-emerald-600">
                  <TrendingUp className="h-3 w-3 mr-0.5" /> +1.2%
                </span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 group-hover:text-violet-900">
                86
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </div>
              <span className="inline-block rounded-full bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-700 mt-1">
                Excellent Grade
              </span>
            </button>

            <button
              type="button"
              onClick={() => sendMessage("Where are my vehicles right now?")}
              title="Click to view live fleet map"
              className="rounded-lg border border-slate-200/80 bg-white p-2.5 shadow-2xs text-left transition-all hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-xs active:scale-[0.98] cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500 uppercase group-hover:text-blue-700">
                  Active Vehicles
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 group-hover:text-blue-900">
                137
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                44 Running · 39 Inactive
              </div>
            </button>

            <button
              type="button"
              onClick={() => sendMessage("What’s my biggest issue?")}
              title="Click to analyze critical safety alerts"
              className="rounded-lg border border-slate-200/80 bg-white p-2.5 shadow-2xs text-left transition-all hover:border-amber-400 hover:bg-amber-50/30 hover:shadow-xs active:scale-[0.98] cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500 uppercase group-hover:text-amber-700">
                  Safety Alerts
                </span>
                <AlertTriangle className="h-3 w-3 text-amber-500" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-amber-600 mt-0.5 group-hover:text-amber-700">
                24
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                12 Harsh Braking
              </div>
            </button>
          </div>

          {/* Middle Row: Score Distribution & Violation Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Score Band Distribution */}
            <button
              type="button"
              onClick={() =>
                sendMessage(
                  "Explain driver safety distribution across the fleet",
                )
              }
              title="Click to drill down into driver safety bands"
              className="rounded-lg border border-slate-200/80 bg-white p-2.5 shadow-2xs text-left transition-all hover:border-violet-400 hover:bg-violet-50/20 active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-900 mb-2">
                <span>Driver Safety Distribution</span>
                <span className="text-[10px] text-violet-600 font-semibold">
                  137 Drivers ↗
                </span>
              </div>
              <div className="space-y-1.5">
                <div>
                  <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                    <span>91-100 (Excellent)</span>
                    <span className="font-semibold text-emerald-600">
                      54 drivers (39%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[39%] bg-emerald-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                    <span>71-90 (Good / Fair)</span>
                    <span className="font-semibold text-blue-600">
                      62 drivers (45%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[45%] bg-blue-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                    <span>Below 70 (Requires Review)</span>
                    <span className="font-semibold text-rose-600">
                      21 drivers (16%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[16%] bg-rose-500 rounded-full" />
                  </div>
                </div>
              </div>
            </button>

            {/* ADAS / DMS Telemetry Highlights */}
            <div className="rounded-lg border border-slate-200/80 bg-white p-2.5 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-900 mb-2">
                <span>Today's Critical Telemetry</span>
                <span className="text-[10px] text-violet-600 font-medium">
                  Click to drill down
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() =>
                    sendMessage(
                      "Why are there overspeeding instances in the fleet?",
                    )
                  }
                  title="Analyze overspeeding events"
                  className="flex items-center gap-1.5 rounded bg-slate-50 p-1.5 border border-slate-100 text-left transition-colors hover:border-rose-300 hover:bg-rose-50/40 cursor-pointer"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                  <div className="truncate">
                    <div className="text-[9px] text-slate-500">
                      Overspeeding
                    </div>
                    <div className="font-bold text-slate-900">7 Events ↗</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    sendMessage("Why are there harsh braking events?")
                  }
                  title="Analyze harsh deceleration events"
                  className="flex items-center gap-1.5 rounded bg-slate-50 p-1.5 border border-slate-100 text-left transition-colors hover:border-amber-300 hover:bg-amber-50/40 cursor-pointer"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                  <div className="truncate">
                    <div className="text-[9px] text-slate-500">Harsh Decel</div>
                    <div className="font-bold text-slate-900">12 Events ↗</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    sendMessage("Explain DMS driver fatigue alerts")
                  }
                  title="Analyze driver distraction & fatigue"
                  className="flex items-center gap-1.5 rounded bg-slate-50 p-1.5 border border-slate-100 text-left transition-colors hover:border-purple-300 hover:bg-purple-50/40 cursor-pointer"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
                  <div className="truncate">
                    <div className="text-[9px] text-slate-500">DMS Fatigue</div>
                    <div className="font-bold text-slate-900">3 Events ↗</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => sendMessage("How to improve vehicle score?")}
                  title="Analyze eco compliance & score roadmap"
                  className="flex items-center gap-1.5 rounded bg-slate-50 p-1.5 border border-slate-100 text-left transition-colors hover:border-emerald-300 hover:bg-emerald-50/40 cursor-pointer"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <div className="truncate">
                    <div className="text-[9px] text-slate-500">
                      Eco Compliance
                    </div>
                    <div className="font-bold text-slate-900">94.2% ↗</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Trakzee Live Tracking Map Screen Preview
  if (type === "fleet-map") {
    const pins = [
      {
        id: "1",
        name: "MH12OP1616",
        driver: "Arjun Singh",
        speed: "42 km/h",
        loc: "Pune Depot",
        status: "running",
        x: 230,
        y: 110,
      },
      {
        id: "2",
        name: "KA51QQ9999",
        driver: "Ramesh Nair",
        speed: "58 km/h",
        loc: "Bengaluru South",
        status: "running",
        x: 260,
        y: 170,
      },
      {
        id: "3",
        name: "TN01AB4412",
        driver: "Karthik Raja",
        speed: "64 km/h",
        loc: "Salem Highway",
        status: "running",
        x: 280,
        y: 195,
      },
      {
        id: "4",
        name: "HR26DK5566",
        driver: "Vikas Verma",
        speed: "0 km/h",
        loc: "Panipat Refinery",
        status: "inactive",
        x: 210,
        y: 50,
      },
      {
        id: "5",
        name: "WB04AA1212",
        driver: "Bikas Ghosh",
        speed: "--",
        loc: "Haldia Petrochem",
        status: "nodata",
        x: 340,
        y: 100,
      },
      {
        id: "6",
        name: "MH03DD3003",
        driver: "Sunil Joshi",
        speed: "0 km/h",
        loc: "Chembur Yard",
        status: "inactive",
        x: 200,
        y: 120,
      },
    ];

    const displayedPins = mapFilter
      ? pins.filter((p) => p.status === mapFilter)
      : pins;

    return (
      <div className="my-3 overflow-hidden rounded-xl border border-slate-200/90 bg-white text-slate-900 shadow-md transition-all hover:shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#111c38] px-3.5 py-2 text-white select-none">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-bold tracking-tight text-white">
              Trakzee 2.0 · Live GPS Fleet Map
            </span>
          </div>
          <span className="text-[10px] text-slate-300 font-medium">
            137 Vehicles
          </span>
        </div>

        {/* Live Filterable Status Counters */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 border-b border-slate-100 text-xs">
          <button
            type="button"
            onClick={() =>
              setMapFilter(mapFilter === "running" ? null : "running")
            }
            className={cn(
              "flex items-center gap-2 rounded-lg bg-white p-1.5 px-2.5 border transition-all cursor-pointer shadow-2xs text-left",
              mapFilter === "running"
                ? "border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/20"
                : "border-slate-200/80 hover:border-emerald-400",
            )}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[11px] text-slate-600 truncate">
              Running: <strong className="text-slate-900">44</strong>
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              setMapFilter(mapFilter === "inactive" ? null : "inactive")
            }
            className={cn(
              "flex items-center gap-2 rounded-lg bg-white p-1.5 px-2.5 border transition-all cursor-pointer shadow-2xs text-left",
              mapFilter === "inactive"
                ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50/20"
                : "border-slate-200/80 hover:border-blue-400",
            )}
          >
            <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
            <span className="text-[11px] text-slate-600 truncate">
              Inactive: <strong className="text-slate-900">39</strong>
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              setMapFilter(mapFilter === "nodata" ? null : "nodata")
            }
            className={cn(
              "flex items-center gap-2 rounded-lg bg-white p-1.5 px-2.5 border transition-all cursor-pointer shadow-2xs text-left",
              mapFilter === "nodata"
                ? "border-purple-500 ring-1 ring-purple-500 bg-purple-50/20"
                : "border-slate-200/80 hover:border-purple-400",
            )}
          >
            <span className="h-2 w-2 rounded-full bg-purple-500 shrink-0" />
            <span className="text-[11px] text-slate-600 truncate">
              No Data: <strong className="text-slate-900">50</strong>
            </span>
          </button>
        </div>

        {/* Interactive Map View */}
        <div className="relative h-48 sm:h-52 w-full bg-[#e8ecf1] overflow-hidden select-none">
          <svg
            className="h-full w-full opacity-90 transition-transform duration-300 ease-out"
            style={{ transform: `scale(${zoom})` }}
            viewBox="0 0 450 240"
          >
            <pattern
              id="app-map-grid-theme"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 30 0 L 0 0 0 30"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="0.5"
              />
            </pattern>
            <rect width="450" height="240" fill="url(#app-map-grid-theme)" />

            {/* Geographical Boundaries */}
            <path
              d="M100 40 Q150 20 200 50 T300 40 T380 60 L400 110 Q340 160 280 140 T180 200 T100 160 Z"
              fill="#cbd5e1"
              stroke="#94a3b8"
              strokeWidth="0.8"
            />
            <path
              d="M190 90 Q230 70 270 100 T310 160 T270 210 T190 170 Z"
              fill="#94a3b8"
              stroke="#64748b"
              strokeWidth="1"
            />

            {/* Pins */}
            {displayedPins.map((pin) => (
              <g
                key={pin.id}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => setSelectedPin(pin)}
              >
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r="6.5"
                  fill={
                    pin.status === "running"
                      ? "#10b981"
                      : pin.status === "inactive"
                        ? "#3b82f6"
                        : "#a855f7"
                  }
                  opacity="0.3"
                  className="animate-ping"
                />
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r="4"
                  fill={
                    pin.status === "running"
                      ? "#10b981"
                      : pin.status === "inactive"
                        ? "#3b82f6"
                        : "#a855f7"
                  }
                  stroke="#ffffff"
                  strokeWidth="1.2"
                />
              </g>
            ))}
          </svg>

          {/* Zoom controls */}
          <div className="absolute top-2 left-2 flex flex-col rounded-md border border-slate-200 bg-white/95 shadow-xs">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.6, z + 0.2))}
              aria-label="Zoom in"
              className="p-1 hover:bg-slate-100 text-slate-700 cursor-pointer border-b border-slate-200"
            >
              <Plus className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.8, z - 0.2))}
              aria-label="Zoom out"
              className="p-1 hover:bg-slate-100 text-slate-700 cursor-pointer"
            >
              <Minus className="h-3 w-3" />
            </button>
          </div>

          {/* Tooltip Overlay with Interactive Drilldown */}
          {selectedPin && (
            <div className="absolute bottom-2 left-2 right-2 rounded-lg border border-slate-200 bg-white/95 p-2 text-xs text-slate-900 shadow-lg flex items-center justify-between animate-in fade-in-50">
              <div>
                <div className="font-bold flex items-center gap-1.5">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      selectedPin.status === "running"
                        ? "bg-emerald-500"
                        : selectedPin.status === "inactive"
                          ? "bg-blue-500"
                          : "bg-purple-500",
                    )}
                  />
                  {selectedPin.name} ({selectedPin.driver})
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Location: {selectedPin.loc} · Speed: {selectedPin.speed}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    sendMessage(`Explain safety score for ${selectedPin.name}`)
                  }
                  className="rounded bg-violet-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-violet-700 transition-colors cursor-pointer shadow-2xs"
                >
                  Analyze Vehicle ↗
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPin(null)}
                  className="text-slate-400 hover:text-slate-800 text-xs px-1"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. Trakzee Trip Summary Report Screen Preview
  if (type === "trip-summary") {
    const rows = [
      {
        name: "HP Object 38",
        driver: "Suresh Patel",
        dist: "181.90 km",
        time: "03:42:10",
      },
      {
        name: "HP Object 31",
        driver: "Ramesh Nair",
        dist: "181.89 km",
        time: "03:40:00",
      },
      {
        name: "HP Object 45",
        driver: "Deepak Rao",
        dist: "181.79 km",
        time: "03:35:45",
      },
      {
        name: "HP Object 10",
        driver: "Arjun Singh",
        dist: "181.68 km",
        time: "03:28:10",
      },
    ];

    return (
      <div className="my-3 overflow-hidden rounded-xl border border-slate-200/90 bg-white text-slate-900 shadow-md transition-all hover:shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#111c38] px-3.5 py-2 text-white select-none">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-rose-400" />
            <span className="text-xs font-bold tracking-tight text-white">
              Trakzee 2.0 · Trip Summary Report
            </span>
          </div>
          <span className="text-[10px] text-slate-300 font-medium">
            133 Records
          </span>
        </div>

        {/* 3 KPI Summary Cards */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 border-b border-slate-100">
          <button
            type="button"
            onClick={() =>
              sendMessage("Show me the trip summary with dashboard")
            }
            title="Drill down into total distance"
            className="rounded-lg bg-white p-2 border border-slate-200/80 shadow-2xs text-left hover:border-violet-400 hover:bg-violet-50/20 transition-all cursor-pointer"
          >
            <div className="text-[9px] font-semibold text-slate-500 uppercase">
              Total Distance
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
              5,084.36 km ↗
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              sendMessage("Explain fleet average distance and route efficiency")
            }
            title="Drill down into average distance"
            className="rounded-lg bg-white p-2 border border-slate-200/80 shadow-2xs text-left hover:border-violet-400 hover:bg-violet-50/20 transition-all cursor-pointer"
          >
            <div className="text-[9px] font-semibold text-slate-500 uppercase">
              Fleet Avg
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
              38.23 km ↗
            </div>
          </button>

          <button
            type="button"
            onClick={() => sendMessage("Explain safety score for HP Object 38")}
            title="Drill down into top vehicle"
            className="rounded-lg bg-white p-2 border border-slate-200/80 shadow-2xs text-left hover:border-violet-400 hover:bg-violet-50/20 transition-all cursor-pointer"
          >
            <div className="text-[9px] font-semibold text-slate-500 uppercase">
              Top Vehicle
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 truncate">
              HP Object 38 ↗
            </div>
          </button>
        </div>

        {/* Table with Clickable Drilldown Rows */}
        <div className="p-2.5">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-900 uppercase mb-1.5">
            <span>Top Vehicle Trips</span>
            <span className="text-violet-600 font-semibold lowercase text-[10px]">
              click row to inspect
            </span>
          </div>
          <div className="overflow-hidden rounded-lg border border-slate-200 text-[11px]">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-1 px-2">Vehicle</th>
                  <th className="py-1 px-2">Driver</th>
                  <th className="py-1 px-2 text-right">Distance</th>
                  <th className="py-1 px-2 text-right">Running</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {rows.map((r, i) => (
                  <tr
                    key={i}
                    onClick={() =>
                      sendMessage(`Explain safety score for ${r.name}`)
                    }
                    title={`Click to inspect ${r.name} logs`}
                    className="hover:bg-violet-50/60 transition-colors cursor-pointer"
                  >
                    <td className="py-1 px-2 font-semibold text-violet-900">
                      {r.name} ↗
                    </td>
                    <td className="py-1 px-2 text-slate-600">{r.driver}</td>
                    <td className="py-1 px-2 text-right font-semibold text-blue-600">
                      {r.dist}
                    </td>
                    <td className="py-1 px-2 text-right text-emerald-600 font-mono text-[10px]">
                      {r.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 4. Trakzee Driver Safety Distribution Visual
  if (type === "safety-distribution") {
    return (
      <div className="my-3 overflow-hidden rounded-xl border border-slate-200/90 bg-white text-slate-900 shadow-md transition-all hover:shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#111c38] px-3.5 py-2 text-white select-none">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-violet-400" />
            <span className="text-xs font-bold tracking-tight text-white">
              Trakzee 2.0 · Driver Safety Distribution
            </span>
          </div>
          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
            137 Fleet Drivers
          </span>
        </div>

        <div className="p-3.5 space-y-3 bg-slate-50/50">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-white p-2 border border-slate-200 shadow-2xs">
              <div className="text-[9px] text-slate-500 font-medium uppercase">
                Band 91-100
              </div>
              <div className="text-sm font-bold text-emerald-600 mt-0.5">
                54 Drivers
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold">
                39.4% (Grade A)
              </div>
            </div>
            <div className="rounded-lg bg-white p-2 border border-slate-200 shadow-2xs">
              <div className="text-[9px] text-slate-500 font-medium uppercase">
                Band 71-90
              </div>
              <div className="text-sm font-bold text-blue-600 mt-0.5">
                62 Drivers
              </div>
              <div className="text-[10px] text-blue-700 font-semibold">
                45.3% (Good)
              </div>
            </div>
            <div className="rounded-lg bg-white p-2 border border-slate-200 shadow-2xs">
              <div className="text-[9px] text-slate-500 font-medium uppercase">
                Below 70
              </div>
              <div className="text-sm font-bold text-rose-600 mt-0.5">
                21 Drivers
              </div>
              <div className="text-[10px] text-rose-700 font-semibold">
                15.3% (Review)
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div>
              <div className="flex justify-between text-[11px] font-medium text-slate-700 mb-1">
                <span>Excellent Safety Performers (91-100)</span>
                <span className="font-bold text-emerald-600">54 / 137</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-[39.4%] bg-emerald-500 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-medium text-slate-700 mb-1">
                <span>Standard Safe Drivers (71-90)</span>
                <span className="font-bold text-blue-600">62 / 137</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-[45.3%] bg-blue-500 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-medium text-slate-700 mb-1">
                <span>Coaching Required (Below 70)</span>
                <span className="font-bold text-rose-600">21 / 137</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-[15.3%] bg-rose-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. Trakzee Today Activity Report Visual
  if (type === "today-activity") {
    return (
      <div className="my-3 overflow-hidden rounded-xl border border-slate-200/90 bg-white text-slate-900 shadow-md transition-all hover:shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#111c38] px-3.5 py-2 text-white select-none">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold tracking-tight text-white">
              Trakzee 2.0 · Today's Activity Timeline
            </span>
          </div>
          <span className="text-[10px] text-slate-300 font-medium">
            Daily Log
          </span>
        </div>

        <div className="p-3 space-y-2.5 bg-slate-50">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
            <span>Activity Breakdown</span>
            <span className="text-emerald-600 font-bold">62% Running Time</span>
          </div>

          <div className="flex h-3 w-full rounded-full overflow-hidden shadow-2xs">
            <div
              className="h-full w-[62%] bg-emerald-500"
              title="Running (62%)"
            />
            <div className="h-full w-[14%] bg-amber-400" title="Idle (14%)" />
            <div className="h-full w-[24%] bg-rose-500" title="Stopped (24%)" />
          </div>

          <div className="grid grid-cols-3 gap-1 text-[10px] pt-1">
            <button
              type="button"
              onClick={() => sendMessage("Where are my vehicles right now?")}
              className="flex items-center gap-1 text-slate-700 bg-white p-1 rounded border border-slate-200 hover:border-emerald-400 transition-colors cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate">Running: 5h 20m ↗</span>
            </button>
            <button
              type="button"
              onClick={() => sendMessage("Why are vehicles idling today?")}
              className="flex items-center gap-1 text-slate-700 bg-white p-1 rounded border border-slate-200 hover:border-amber-400 transition-colors cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
              <span className="truncate">Idle: 1h 12m ↗</span>
            </button>
            <button
              type="button"
              onClick={() => sendMessage("Show me vehicle stoppage locations")}
              className="flex items-center gap-1 text-slate-700 bg-white p-1 rounded border border-slate-200 hover:border-rose-400 transition-colors cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
              <span className="truncate">Stopped: 2h 04m ↗</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 6. Dynamic Driver & Vehicle Scorecard (Matched 100% with exact data)
  const vehicleName = data?.name || "HP Object 38";
  const overall = data?.overallScore ?? 86;
  const safety = data?.safetyScore ?? 82;
  const efficiency = data?.efficiencyScore ?? 88;
  const risk = data?.riskScore ?? 14;
  const discipline = data?.disciplineScore ?? 91;
  const grade = overall >= 85 ? "A" : overall >= 70 ? "B" : "C";

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-slate-200/90 bg-white text-slate-900 shadow-md transition-all hover:shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-100 bg-[#111c38] px-3.5 py-2 text-white select-none">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-bold tracking-tight text-white truncate">
            Trakzee 2.0 · Scorecard: {vehicleName}
          </span>
        </div>
        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300 shrink-0">
          Grade {grade} ({overall}/100)
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2.5 border-b border-slate-100 text-center">
        <button
          type="button"
          onClick={() =>
            sendMessage(`Why is the Safety low for ${vehicleName}?`)
          }
          title="Drill down into safety rating"
          className="rounded-lg bg-white p-2 border border-slate-200 shadow-2xs hover:border-emerald-400 hover:bg-emerald-50/20 transition-all cursor-pointer"
        >
          <div className="text-[9px] text-slate-500 font-medium uppercase">
            Safety
          </div>
          <div className="text-xs sm:text-sm font-bold text-emerald-600 mt-0.5">
            {safety}% ↗
          </div>
        </button>

        <button
          type="button"
          onClick={() =>
            sendMessage(`How to improve score for ${vehicleName}?`)
          }
          title="Drill down into efficiency rating"
          className="rounded-lg bg-white p-2 border border-slate-200 shadow-2xs hover:border-blue-400 hover:bg-blue-50/20 transition-all cursor-pointer"
        >
          <div className="text-[9px] text-slate-500 font-medium uppercase">
            Efficiency
          </div>
          <div className="text-xs sm:text-sm font-bold text-blue-600 mt-0.5">
            {efficiency}% ↗
          </div>
        </button>

        <button
          type="button"
          onClick={() =>
            sendMessage(`What is the biggest issue for ${vehicleName}?`)
          }
          title="Drill down into risk index"
          className="rounded-lg bg-white p-2 border border-slate-200 shadow-2xs hover:border-amber-400 hover:bg-amber-50/20 transition-all cursor-pointer"
        >
          <div className="text-[9px] text-slate-500 font-medium uppercase">
            Risk
          </div>
          <div className="text-xs sm:text-sm font-bold text-amber-600 mt-0.5">
            {risk}% ↗
          </div>
        </button>

        <button
          type="button"
          onClick={() =>
            sendMessage(`Explain driver discipline for ${vehicleName}`)
          }
          title="Drill down into driver discipline"
          className="rounded-lg bg-white p-2 border border-slate-200 shadow-2xs hover:border-purple-400 hover:bg-purple-50/20 transition-all cursor-pointer"
        >
          <div className="text-[9px] text-slate-500 font-medium uppercase">
            Discipline
          </div>
          <div className="text-xs sm:text-sm font-bold text-purple-600 mt-0.5">
            {discipline}% ↗
          </div>
        </button>
      </div>
    </div>
  );
}
