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
  Fuel,
  LineChart,
  RotateCcw,
  Search,
  Settings,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useZio } from "@/zio/ZioContext";

export interface FuelReportRow {
  id: string;
  company: string;
  branch: string;
  object: string;
  objectBrand: string;
  objectModel: string;
  runningTime: string;
  idleTime: string;
  inactiveTime: string;
  stopTime: string;
  distanceKm: number;
  fuelRunningL: number;
  fuelIdleL: number;
  fuelTotalL: number;
  avgConsumptionPer100: number;
  mileageKmPerL: number;
  fillCount: number;
  fillLiters: number;
  drainCount: number;
  drainLiters: number;
  startFuelLevelL: number;
  lastFuelLevelL: number;
  runningPct: number;
  stopPct: number;
}

export const FUEL_REPORT_ROWS: FuelReportRow[] = [
  {
    id: "v-1",
    company: "Bhavya Test Account",
    branch: "Bhavya Test Account",
    object: "4444 JHGH - VW Jetta",
    objectBrand: "Volkswagen",
    objectModel: "Jetta",
    runningTime: "00:00:00",
    idleTime: "00:00:00",
    inactiveTime: "16:37:00",
    stopTime: "00:00:00",
    distanceKm: 0.0,
    fuelRunningL: 0.0,
    fuelIdleL: 0.0,
    fuelTotalL: 0.0,
    avgConsumptionPer100: 0.0,
    mileageKmPerL: 0.0,
    fillCount: 0,
    fillLiters: 0.0,
    drainCount: 0,
    drainLiters: 0.0,
    startFuelLevelL: 0.0,
    lastFuelLevelL: 0.0,
    runningPct: 0,
    stopPct: 100,
  },
  {
    id: "v-2",
    company: "Company",
    branch: "Indonesia",
    object: "Fuel - 1001",
    objectBrand: "AMW",
    objectModel: "1618 TP",
    runningTime: "16:37:00",
    idleTime: "00:00:00",
    inactiveTime: "00:00:00",
    stopTime: "00:00:00",
    distanceKm: 470.81,
    fuelRunningL: 3.1,
    fuelIdleL: 0.0,
    fuelTotalL: 3.1,
    avgConsumptionPer100: 0.66,
    mileageKmPerL: 151.87,
    fillCount: 0,
    fillLiters: 0.0,
    drainCount: 0,
    drainLiters: 0.0,
    startFuelLevelL: 51.13,
    lastFuelLevelL: 48.03,
    runningPct: 100,
    stopPct: 0,
  },
  {
    id: "v-3",
    company: "Company",
    branch: "Indonesia",
    object: "Mercedes GLE 300d - 1003",
    objectBrand: "MERCEDES BENZ",
    objectModel: "GLE",
    runningTime: "16:37:00",
    idleTime: "00:00:00",
    inactiveTime: "00:00:00",
    stopTime: "00:00:00",
    distanceKm: 399.25,
    fuelRunningL: 0.67,
    fuelIdleL: 0.38,
    fuelTotalL: 1.05,
    avgConsumptionPer100: 0.26,
    mileageKmPerL: 380.24,
    fillCount: 0,
    fillLiters: 0.0,
    drainCount: 0,
    drainLiters: 0.0,
    startFuelLevelL: 4.95,
    lastFuelLevelL: 3.9,
    runningPct: 95,
    stopPct: 5,
  },
  {
    id: "v-4",
    company: "Company",
    branch: "Thailand",
    object: "Fuel - 130001",
    objectBrand: "ACE",
    objectModel: "Dolly",
    runningTime: "15:54:00",
    idleTime: "00:38:00",
    inactiveTime: "00:00:00",
    stopTime: "00:05:00",
    distanceKm: 525.89,
    fuelRunningL: 0.0,
    fuelIdleL: 0.0,
    fuelTotalL: 0.0,
    avgConsumptionPer100: 0.0,
    mileageKmPerL: 0.0,
    fillCount: 0,
    fillLiters: 0.0,
    drainCount: 0,
    drainLiters: 0.0,
    startFuelLevelL: 55.36,
    lastFuelLevelL: 61.34,
    runningPct: 92,
    stopPct: 8,
  },
  {
    id: "v-5",
    company: "Company",
    branch: "Thailand",
    object: "BUS - 130003",
    objectBrand: "AMW",
    objectModel: "Tempo Traveller",
    runningTime: "16:37:00",
    idleTime: "00:00:00",
    inactiveTime: "00:00:00",
    stopTime: "00:00:00",
    distanceKm: 781.84,
    fuelRunningL: 0.0,
    fuelIdleL: 2.21,
    fuelTotalL: 0.0,
    avgConsumptionPer100: 0.0,
    mileageKmPerL: 0.0,
    fillCount: 0,
    fillLiters: 0.0,
    drainCount: 0,
    drainLiters: 0.0,
    startFuelLevelL: 49.11,
    lastFuelLevelL: 52.89,
    runningPct: 88,
    stopPct: 12,
  },
  {
    id: "v-6",
    company: "Company",
    branch: "Thailand",
    object: "SOC - 130002",
    objectBrand: "Ashok Leyland",
    objectModel: "Taxi",
    runningTime: "16:37:00",
    idleTime: "00:00:00",
    inactiveTime: "00:00:00",
    stopTime: "00:00:00",
    distanceKm: 935.01,
    fuelRunningL: 0.0,
    fuelIdleL: 0.0,
    fuelTotalL: 0.0,
    avgConsumptionPer100: 0.0,
    mileageKmPerL: 0.0,
    fillCount: 0,
    fillLiters: 0.0,
    drainCount: 0,
    drainLiters: 0.0,
    startFuelLevelL: 47.59,
    lastFuelLevelL: 62.59,
    runningPct: 94,
    stopPct: 6,
  },
  {
    id: "v-7",
    company: "Company",
    branch: "Thailand",
    object: "RPM - 130004",
    objectBrand: "Ashok Leyland",
    objectModel: "UE2820/3R",
    runningTime: "16:37:00",
    idleTime: "00:00:00",
    inactiveTime: "00:00:00",
    stopTime: "00:00:00",
    distanceKm: 707.44,
    fuelRunningL: 0.0,
    fuelIdleL: 0.05,
    fuelTotalL: 0.0,
    avgConsumptionPer100: 0.0,
    mileageKmPerL: 0.0,
    fillCount: 0,
    fillLiters: 0.0,
    drainCount: 0,
    drainLiters: 0.0,
    startFuelLevelL: 5.12,
    lastFuelLevelL: 6.27,
    runningPct: 90,
    stopPct: 10,
  },
  {
    id: "v-8",
    company: "Company",
    branch: "Valsad",
    object: "Fuel - 12393",
    objectBrand: "AMW",
    objectModel: "1618 TP",
    runningTime: "15:43:00",
    idleTime: "00:45:00",
    inactiveTime: "00:00:00",
    stopTime: "00:09:00",
    distanceKm: 735.38,
    fuelRunningL: 4405.1,
    fuelIdleL: 0.0,
    fuelTotalL: 4405.1,
    avgConsumptionPer100: 599.02,
    mileageKmPerL: 0.17,
    fillCount: 2,
    fillLiters: 4385.9,
    drainCount: 0,
    drainLiters: 0.0,
    startFuelLevelL: 118.85,
    lastFuelLevelL: 99.65,
    runningPct: 84,
    stopPct: 16,
  },
  {
    id: "v-9",
    company: "Company",
    branch: "Valsad",
    object: "Tire Management - 12394",
    objectBrand: "AMW",
    objectModel: "1618 TP",
    runningTime: "16:37:00",
    idleTime: "00:00:00",
    inactiveTime: "00:00:00",
    stopTime: "00:00:00",
    distanceKm: 754.65,
    fuelRunningL: 0.0,
    fuelIdleL: 0.0,
    fuelTotalL: 0.0,
    avgConsumptionPer100: 0.0,
    mileageKmPerL: 0.0,
    fillCount: 0,
    fillLiters: 0.0,
    drainCount: 0,
    drainLiters: 0.0,
    startFuelLevelL: 780.0,
    lastFuelLevelL: 780.0,
    runningPct: 100,
    stopPct: 0,
  },
];

export function FuelReportPreview() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedChartVehicle, setSelectedChartVehicle] =
    useState<FuelReportRow | null>(null);

  // Filtered rows
  const filteredRows = useMemo(() => {
    return FUEL_REPORT_ROWS.filter((row) => {
      if (selectedBranch !== "all" && row.branch !== selectedBranch)
        return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        return (
          row.object.toLowerCase().includes(term) ||
          row.branch.toLowerCase().includes(term) ||
          row.objectBrand.toLowerCase().includes(term) ||
          row.objectModel.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [selectedBranch, searchTerm]);

  // Aggregate summary totals (the Σ row)
  const totals = useMemo(() => {
    return filteredRows.reduce(
      (acc, r) => ({
        distance: acc.distance + r.distanceKm,
        fuelTotal: acc.fuelTotal + r.fuelTotalL,
        fills: acc.fills + r.fillLiters,
        fillCount: acc.fillCount + r.fillCount,
        drains: acc.drains + r.drainLiters,
      }),
      { distance: 0, fuelTotal: 0, fills: 0, fillCount: 0, drains: 0 },
    );
  }, [filteredRows]);

  const handleExport = (format: string) => {
    toast.success(`Exporting Fill-Drain Report as ${format.toUpperCase()}`, {
      description: "Generating file with all vehicle telematics records...",
    });
  };

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-[#DFE3EB]/90 bg-white text-slate-800 shadow-2xs dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 animate-in fade-in duration-200">
      {/* ── 1. Top Title & Filter Controls (Exact Match to Trakzee Theme Image 2) ── */}
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
                  isFavorite
                    ? "fill-amber-400 text-amber-500"
                    : "text-slate-400",
                )}
              />
            </button>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Fill-Drain Report
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
              28/09/2026 12:00 AM - 12/10/2026 04:37 PM
            </span>
            <ChevronDown className="h-3 w-3 text-slate-400 ml-0.5" />
          </button>

          {/* Company filter */}
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 shadow-2xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
          >
            <span className="text-slate-500">Company:</span>
            <span className="font-semibold">All</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {/* Branch filter */}
          <button
            type="button"
            onClick={() => {
              if (selectedBranch === "all") setSelectedBranch("Valsad");
              else if (selectedBranch === "Valsad")
                setSelectedBranch("Indonesia");
              else if (selectedBranch === "Indonesia")
                setSelectedBranch("Thailand");
              else setSelectedBranch("all");
            }}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1.5 rounded-md border bg-white font-medium hover:bg-slate-50 shadow-2xs transition-colors dark:bg-slate-800 dark:border-slate-700",
              selectedBranch !== "all"
                ? "border-[#0089FF] text-[#0089FF]"
                : "border-slate-200 text-slate-700 dark:text-slate-200",
            )}
          >
            <span className="text-slate-500">Branch:</span>
            <span className="font-semibold">
              {selectedBranch === "all" ? "All" : selectedBranch}
            </span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </button>

          {/* Vehicle filter */}
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 shadow-2xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
          >
            <span className="text-slate-500">Vehicle:</span>
            <span className="font-semibold">All</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {/* Filter button */}
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 shadow-2xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
          >
            <SlidersHorizontal className="h-3 w-3 text-slate-500" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* ── 2. The Data Table with Summary Σ Row (matching Trakzee Theme Image 2) ── */}
      <div className="overflow-x-auto max-h-[420px] custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
          {/* Table Header */}
          <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none shadow-xs">
            <tr>
              <th className="py-2.5 px-3 w-8 text-center text-slate-400">#</th>
              <th className="py-2.5 px-3">Vehicle No</th>
              <th className="py-2.5 px-3">Branch</th>
              <th className="py-2.5 px-3">Object Brand</th>
              <th className="py-2.5 px-3 text-right">Distance (km)</th>
              <th className="py-2.5 px-3 text-center">Running v/s Stop</th>
              <th className="py-2.5 px-3 text-center text-emerald-600">
                Running (HH:MM:SS)
              </th>
              <th className="py-2.5 px-3 text-center text-amber-600">
                Idle (HH:MM:SS)
              </th>
              <th className="py-2.5 px-3 text-center text-rose-600">
                Stop (HH:MM:SS)
              </th>
              <th className="py-2.5 px-3 text-right text-slate-800 dark:text-white">
                Fuel Consumed (L)
              </th>
              <th className="py-2.5 px-3 text-right">Mileage</th>
              <th className="py-2.5 px-3 text-right text-emerald-600">
                Fill (L)
              </th>
              <th className="py-2.5 px-3 text-right text-rose-600">Drain (L)</th>
              <th className="py-2.5 px-3 text-right">Start Fuel</th>
              <th className="py-2.5 px-3 text-right">Last Fuel</th>
              <th className="py-2.5 px-2 text-center">Chart</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-sans text-xs">
            {/* ── Summary Σ Row (matching reference row 1) ── */}
            <tr className="bg-slate-50/90 dark:bg-slate-800/60 font-semibold border-b-2 border-slate-200 dark:border-slate-700">
              <td className="py-2.5 px-3 text-center font-serif text-sm font-black text-slate-900 dark:text-white">
                Σ
              </td>
              <td className="py-2.5 px-3 text-slate-400">-</td>
              <td className="py-2.5 px-3 text-slate-400">-</td>
              <td className="py-2.5 px-3 text-slate-400">-</td>
              <td className="py-2.5 px-3 text-right font-bold text-[#0089FF]">
                {totals.distance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="py-2.5 px-3 text-center">
                <div className="flex h-1.5 w-20 mx-auto overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="bg-[#0089FF]"
                    style={{ width: "78%" }}
                    title="Running: 78%"
                  />
                  <div
                    className="bg-[#F97316]"
                    style={{ width: "22%" }}
                    title="Stop: 22%"
                  />
                </div>
              </td>
              <td className="py-2.5 px-3 text-center text-emerald-600 font-mono font-bold">
                125:40:00
              </td>
              <td className="py-2.5 px-3 text-center text-amber-600 font-mono font-bold">
                01:23:00
              </td>
              <td className="py-2.5 px-3 text-center text-rose-600 font-mono font-bold">
                00:14:00
              </td>
              <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                {totals.fuelTotal.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="py-2.5 px-3 text-right font-semibold text-slate-700 dark:text-slate-200">
                15.20
              </td>
              <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                {totals.fills.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                ({totals.fillCount})
              </td>
              <td className="py-2.5 px-3 text-right font-semibold text-slate-400">
                0.00(0)
              </td>
              <td className="py-2.5 px-3 text-right text-slate-400">-</td>
              <td className="py-2.5 px-3 text-right text-slate-400">-</td>
              <td className="py-2.5 px-2 text-center text-slate-400">-</td>
            </tr>

            {/* ── Vehicle Data Rows (with expandable chevrons) ── */}
            {filteredRows.map((row) => {
              const isExpanded = expandedRow === row.id;
              return (
                <React.Fragment key={row.id}>
                  <tr
                    className={cn(
                      "transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40",
                      row.fillCount > 0 &&
                        "bg-emerald-50/20 dark:bg-emerald-950/10",
                    )}
                  >
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedRow(isExpanded ? null : row.id)
                        }
                        className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      >
                        <ChevronRight
                          className={cn(
                            "h-3.5 w-3.5 transition-transform duration-150",
                            isExpanded && "rotate-90 text-[#0089FF]",
                          )}
                        />
                      </button>
                    </td>

                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                      {row.object}
                    </td>

                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                      {row.branch}
                    </td>

                    <td className="py-2.5 px-3 text-slate-500">
                      {row.objectBrand} · {row.objectModel}
                    </td>

                    <td className="py-2.5 px-3 text-right font-semibold text-[#0089FF]">
                      {row.distanceKm.toFixed(2)}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <div className="flex h-1.5 w-16 mx-auto overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="bg-[#0089FF]"
                          style={{ width: `${row.runningPct}%` }}
                        />
                        <div
                          className="bg-[#F97316]"
                          style={{ width: `${row.stopPct}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-center text-emerald-600 font-mono font-medium">
                      {row.runningTime}
                    </td>

                    <td className="py-2.5 px-3 text-center text-amber-600 font-mono font-medium">
                      {row.idleTime}
                    </td>

                    <td className="py-2.5 px-3 text-center text-rose-600 font-mono font-medium">
                      {row.stopTime}
                    </td>

                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                      {row.fuelTotalL.toFixed(2)}
                    </td>

                    <td className="py-2.5 px-3 text-right text-slate-600 font-medium">
                      {row.mileageKmPerL.toFixed(2)}
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      {row.fillCount > 0 ? (
                        <span className="font-bold text-emerald-600">
                          {row.fillLiters.toFixed(2)} ({row.fillCount})
                        </span>
                      ) : (
                        <span className="text-slate-400">0.00(0)</span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 text-right text-slate-400">
                      0.00(0)
                    </td>

                    <td className="py-2.5 px-3 text-right text-slate-600">
                      {row.startFuelLevelL.toFixed(2)}
                    </td>

                    <td className="py-2.5 px-3 text-right text-slate-600">
                      {row.lastFuelLevelL.toFixed(2)}
                    </td>

                    <td className="py-2.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedChartVehicle(row)}
                        className="rounded p-1 text-[#0089FF] hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="View Fill-Drain Telemetry Chart"
                      >
                        <LineChart className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>

                  {/* Expanded detail row */}
                  {isExpanded && (
                    <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                      <td colSpan={16} className="py-2 px-8">
                        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 py-1">
                          <span>
                            Company: <strong>{row.company}</strong> · Inactive
                            Duration: <strong>{row.inactiveTime}</strong> ·
                            Average Consumption:{" "}
                            <strong>{row.avgConsumptionPer100} L / 100km</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedChartVehicle(row)}
                            className="text-[#0089FF] hover:underline font-semibold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <LineChart className="h-3 w-3" />
                            <span>View Sensor Telemetry</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── 3. Bottom Pagination Bar (Exact Match to Trakzee Theme Image 2) ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 bg-white text-xs text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
        <span className="text-slate-500 font-medium">
          {filteredRows.length} records
        </span>

        {/* Center pagination */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="px-2 py-1 text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-40 cursor-pointer"
          >
            ‹ Prev
          </button>
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0089FF] text-white font-bold text-xs shadow-2xs">
            1
          </span>
          <button
            type="button"
            className="px-2 py-1 text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-40 cursor-pointer"
          >
            Next ›
          </button>

          <span className="text-slate-300 mx-2">|</span>

          <span className="text-slate-500">20 per page</span>
          <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
        </div>

        {/* Right utility buttons: reset & download */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedBranch("all");
              setSearchTerm("");
              toast.info("Report reset to default view");
            }}
            className="h-7 w-7 rounded-md border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-2xs dark:bg-slate-800 dark:border-slate-700"
            title="Reset table"
          >
            <RotateCcw className="h-3 w-3" />
          </button>

          <div className="flex items-center rounded-md border border-slate-200 bg-white shadow-2xs overflow-hidden dark:bg-slate-800 dark:border-slate-700">
            <button
              type="button"
              onClick={() => handleExport("xlsx")}
              className="flex items-center gap-1.5 px-3 py-1 font-semibold text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer dark:text-slate-200"
            >
              <Download className="h-3 w-3 text-slate-500" />
              <span>Download</span>
            </button>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700" />
            <button
              type="button"
              onClick={() => handleExport("pdf")}
              className="px-1.5 py-1 text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Download Options"
            >
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. Interactive Telemetry Sensor Curve Modal ── */}
      {selectedChartVehicle && (
        <div className="p-4 bg-slate-900 text-white border-t border-slate-800 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <LineChart className="h-4 w-4 text-sky-400" />
              <span className="font-semibold text-xs text-white">
                Fill-Drain Sensor Telemetry · {selectedChartVehicle.object}
              </span>
              <span className="text-[10px] text-slate-400">
                (28 Sep – 12 Oct 2026)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedChartVehicle(null)}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 text-center">
            <div className="h-28 flex items-end justify-between gap-1 px-2 pt-2 pb-1 border-b border-slate-800">
              {[
                { day: "Oct 1", level: 118, fill: false },
                { day: "Oct 3", level: 90, fill: false },
                { day: "Oct 5", level: 72, fill: false },
                { day: "Oct 7", level: 55, fill: false },
                {
                  day: "Oct 8",
                  level: 2200,
                  fill: true,
                  note: "Fill 1: +2,150 L",
                },
                { day: "Oct 10", level: 1980, fill: false },
                {
                  day: "Oct 12",
                  level: 4385,
                  fill: true,
                  note: "Fill 2: +2,235 L",
                },
                { day: "Oct 14", level: 4120, fill: false },
                { day: "Oct 15", level: 3950, fill: false },
              ].map((pt, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center flex-1 h-full justify-end group relative"
                >
                  <div
                    className={cn(
                      "w-full rounded-t transition-all",
                      pt.fill
                        ? "bg-emerald-500 shadow-sm shadow-emerald-500/50"
                        : "bg-sky-500/60 hover:bg-sky-400",
                    )}
                    style={{
                      height: `${Math.min(95, Math.max(15, (pt.level / 4400) * 90))}%`,
                    }}
                  />
                  <span className="text-[9px] text-slate-400 mt-1">
                    {pt.day}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                Detected Refill (+4,385.90 L on Oct 8 & 12)
              </span>
              <span>Tank Capacity: 4,500 L · Ultrasonic Dual Sensor</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
