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
  Play,
  RotateCcw,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface TravelSummaryRow {
  id: string;
  company: string;
  branch: string;
  object: string;
  objectBrand: string;
  objectModel: string;
  objectType: string;
  driver: string;
  employeeNo: string;
  imeiNo: string;
  startLocation: string;
  startOdometer: string;
  firstIgnitionOn: string;
  distanceKm: number;
  runningPct: number;
  stopPct: number;
  runningTime: string;
  idleTime: string;
  stopTime: string;
  inactiveTime: string;
  duration: string;
  workDuration: string;
  workingDays: number;
  maxStoppage: string;
  noOfIdle: number;
  avgSpeed: number;
  maxSpeed: number;
  costDistance: number;
  costDuration: number;
  overSpeed: number;
  alerts: number;
  approxTollCost: number;
  endOdometer: string;
  lastIgnitionOff: string;
  endLocation: string;
}

export const TRAVEL_SUMMARY_ROWS: TravelSummaryRow[] = [
  {
    id: "ts-1",
    company: "Company",
    branch: "Thailand",
    object: "SOC - 130002",
    objectBrand: "Ashok Leyland",
    objectModel: "Taxi",
    objectType: "Taxi",
    driver: "Chaicha Pantuml",
    employeeNo: "130002",
    imeiNo: "2.79183E+14",
    startLocation: "Ban Wang Mon",
    startOdometer: "337196.4",
    firstIgnitionOn: "13-10-2026 12:00 AM",
    distanceKm: 527.76,
    runningPct: 92,
    stopPct: 8,
    runningTime: "09:43:30",
    idleTime: "00:00:30",
    stopTime: "00:00:00",
    inactiveTime: "00:00:00",
    duration: "09:44:00",
    workDuration: "09:44:00",
    workingDays: 1,
    maxStoppage: "00:00:00",
    noOfIdle: 5,
    avgSpeed: 54,
    maxSpeed: 150,
    costDistance: 5277.6,
    costDuration: 405.3,
    overSpeed: 0,
    alerts: 0,
    approxTollCost: 0.0,
    endOdometer: "337724.1",
    lastIgnitionOff: "09:44 AM",
    endLocation: "Ban Wang Mon",
  },
  {
    id: "ts-2",
    company: "Company",
    branch: "Thailand",
    object: "BUS - 130003",
    objectBrand: "AMW",
    objectModel: "Tempo Traveller",
    objectType: "Bus",
    driver: "Shivam Patel",
    employeeNo: "130003",
    imeiNo: "6.12839E+14",
    startLocation: "Ban Wang Mon",
    startOdometer: "251795.3",
    firstIgnitionOn: "13-10-2026 12:00 AM",
    distanceKm: 416.9,
    runningPct: 95,
    stopPct: 5,
    runningTime: "09:43:55",
    idleTime: "00:00:05",
    stopTime: "00:00:00",
    inactiveTime: "00:00:00",
    duration: "09:44:00",
    workDuration: "09:44:00",
    workingDays: 1,
    maxStoppage: "00:00:00",
    noOfIdle: 1,
    avgSpeed: 43,
    maxSpeed: 150,
    costDistance: 0,
    costDuration: 0,
    overSpeed: 0,
    alerts: 0,
    approxTollCost: 0.0,
    endOdometer: "252212.2",
    lastIgnitionOff: "09:44 AM",
    endLocation: "Ban Wang Mon",
  },
  {
    id: "ts-3",
    company: "Company",
    branch: "Thailand",
    object: "RPM - 130004",
    objectBrand: "Ashok Leyland",
    objectModel: "UE2820/3R",
    objectType: "MixerTruck",
    driver: "Drashti Joshur",
    employeeNo: "130004",
    imeiNo: "2.19482E+14",
    startLocation: "Ban Wang Mon",
    startOdometer: "246769.3",
    firstIgnitionOn: "13-10-2026 12:00 AM",
    distanceKm: 382.87,
    runningPct: 90,
    stopPct: 10,
    runningTime: "09:43:45",
    idleTime: "00:00:15",
    stopTime: "00:00:00",
    inactiveTime: "00:00:00",
    duration: "09:44:00",
    workDuration: "09:44:00",
    workingDays: 1,
    maxStoppage: "00:00:00",
    noOfIdle: 3,
    avgSpeed: 39,
    maxSpeed: 150,
    costDistance: 0,
    costDuration: 0,
    overSpeed: 0,
    alerts: 0,
    approxTollCost: 0.0,
    endOdometer: "247152.2",
    lastIgnitionOff: "09:44 AM",
    endLocation: "Ban Wang Mon",
  },
  {
    id: "ts-4",
    company: "Company",
    branch: "Valsad",
    object: "Tire Management - 12394",
    objectBrand: "AMW",
    objectModel: "1618 TP",
    objectType: "Truck",
    driver: "Aqib Khan",
    employeeNo: "12394",
    imeiNo: "8.61812E+14",
    startLocation: "Valsad Yard",
    startOdometer: "321129.2",
    firstIgnitionOn: "13-10-2026 12:00 AM",
    distanceKm: 380.08,
    runningPct: 94,
    stopPct: 6,
    runningTime: "09:43:55",
    idleTime: "00:00:05",
    stopTime: "00:00:00",
    inactiveTime: "00:00:00",
    duration: "09:44:00",
    workDuration: "09:44:00",
    workingDays: 1,
    maxStoppage: "00:00:00",
    noOfIdle: 1,
    avgSpeed: 39,
    maxSpeed: 150,
    costDistance: 9682.0,
    costDuration: 851.6,
    overSpeed: 0,
    alerts: 0,
    approxTollCost: 0.0,
    endOdometer: "321509.3",
    lastIgnitionOff: "09:44 AM",
    endLocation: "Valsad Yard",
  },
  {
    id: "ts-5",
    company: "Company",
    branch: "Valsad",
    object: "Fuel - 12303",
    objectBrand: "AMW",
    objectModel: "1618 TP",
    objectType: "Truck",
    driver: "Anisha Dubey",
    employeeNo: "12303",
    imeiNo: "8.61812E+14",
    startLocation: "Valsad Workshop",
    startOdometer: "239887.4",
    firstIgnitionOn: "13-10-2026 12:00 AM",
    distanceKm: 370.2,
    runningPct: 86,
    stopPct: 14,
    runningTime: "09:22:30",
    idleTime: "00:20:30",
    stopTime: "00:01:00",
    inactiveTime: "00:00:00",
    duration: "09:44:00",
    workDuration: "09:43:00",
    workingDays: 1,
    maxStoppage: "00:01:00",
    noOfIdle: 207,
    avgSpeed: 40,
    maxSpeed: 150,
    costDistance: 5266.0,
    costDuration: 1019.0,
    overSpeed: 0,
    alerts: 27,
    approxTollCost: 0.0,
    endOdometer: "240263.6",
    lastIgnitionOff: "09:44 AM",
    endLocation: "Valsad Workshop",
  },
  {
    id: "ts-6",
    company: "Company",
    branch: "Thailand",
    object: "Fuel - 130001",
    objectBrand: "ACE",
    objectModel: "Dolly",
    objectType: "Minibus",
    driver: "Khushi Ojha",
    employeeNo: "130001",
    imeiNo: "4.98172E+14",
    startLocation: "Sakon Nakhon",
    startOdometer: "123072.1",
    firstIgnitionOn: "13-10-2026 12:00 AM",
    distanceKm: 314.9,
    runningPct: 88,
    stopPct: 12,
    runningTime: "09:25:05",
    idleTime: "00:14:10",
    stopTime: "00:04:45",
    inactiveTime: "00:00:00",
    duration: "09:44:00",
    workDuration: "09:39:15",
    workingDays: 1,
    maxStoppage: "00:01:55",
    noOfIdle: 102,
    avgSpeed: 33,
    maxSpeed: 150,
    costDistance: 6298.0,
    costDuration: 1608.0,
    overSpeed: 0,
    alerts: 0,
    approxTollCost: 0.0,
    endOdometer: "123387.0",
    lastIgnitionOff: "09:44 AM",
    endLocation: "Kalasin, Thailand",
  },
  {
    id: "ts-7",
    company: "Company",
    branch: "Indonesia",
    object: "Temperature - 1002",
    objectBrand: "AMW",
    objectModel: "Tempo Traveller",
    objectType: "Bus",
    driver: "No Driver Found",
    employeeNo: "1002",
    imeiNo: "8.61812E+14",
    startLocation: "Jakarta Terminal",
    startOdometer: "99470.4",
    firstIgnitionOn: "13-10-2026 12:00 AM",
    distanceKm: 266.34,
    runningPct: 92,
    stopPct: 8,
    runningTime: "09:44:00",
    idleTime: "00:00:00",
    stopTime: "00:00:00",
    inactiveTime: "00:00:00",
    duration: "09:44:00",
    workDuration: "09:44:00",
    workingDays: 1,
    maxStoppage: "00:00:00",
    noOfIdle: 0,
    avgSpeed: 27,
    maxSpeed: 150,
    costDistance: 2663.4,
    costDuration: 486.0,
    overSpeed: 0,
    alerts: 0,
    approxTollCost: 0.0,
    endOdometer: "99736.8",
    lastIgnitionOff: "09:44 AM",
    endLocation: "Jakarta Central",
  },
  {
    id: "ts-8",
    company: "Company",
    branch: "Indonesia",
    object: "Mercedes GLE 300d - 1003",
    objectBrand: "MERCEDES BENZ",
    objectModel: "GLE",
    objectType: "SUV",
    driver: "No Driver Found",
    employeeNo: "1003",
    imeiNo: "8.61812E+14",
    startLocation: "Amokuni Port",
    startOdometer: "83616.0",
    firstIgnitionOn: "13-10-2026 12:00 AM",
    distanceKm: 251.62,
    runningPct: 96,
    stopPct: 4,
    runningTime: "09:44:00",
    idleTime: "00:00:00",
    stopTime: "00:00:00",
    inactiveTime: "00:00:00",
    duration: "09:44:00",
    workDuration: "09:44:00",
    workingDays: 1,
    maxStoppage: "00:00:00",
    noOfIdle: 0,
    avgSpeed: 26,
    maxSpeed: 150,
    costDistance: 0,
    costDuration: 0,
    overSpeed: 0,
    alerts: 0,
    approxTollCost: 0.0,
    endOdometer: "83867.6",
    lastIgnitionOff: "09:44 AM",
    endLocation: "Labela Depot",
  },
  {
    id: "ts-9",
    company: "Company",
    branch: "Thailand",
    object: "Temperature - 130005",
    objectBrand: "General",
    objectModel: "General",
    objectType: "Default",
    driver: "Kuldeep Chaurasiya",
    employeeNo: "130005",
    imeiNo: "3.07182E+14",
    startLocation: "Urankul Hub",
    startOdometer: "156868.2",
    firstIgnitionOn: "13-10-2026 12:00 AM",
    distanceKm: 247.09,
    runningPct: 91,
    stopPct: 9,
    runningTime: "09:43:50",
    idleTime: "00:00:10",
    stopTime: "00:00:00",
    inactiveTime: "00:00:00",
    duration: "09:44:00",
    workDuration: "09:44:00",
    workingDays: 1,
    maxStoppage: "00:00:00",
    noOfIdle: 1,
    avgSpeed: 25,
    maxSpeed: 150,
    costDistance: 0,
    costDuration: 0,
    overSpeed: 0,
    alerts: 0,
    approxTollCost: 0.0,
    endOdometer: "157115.3",
    lastIgnitionOff: "09:44 AM",
    endLocation: "Urankul Hub",
  },
  {
    id: "ts-10",
    company: "Company",
    branch: "Indonesia",
    object: "Fuel - 1001",
    objectBrand: "AMW",
    objectModel: "1618 TP",
    objectType: "Truck",
    driver: "No Driver Found",
    employeeNo: "1001",
    imeiNo: "8.61812E+14",
    startLocation: "Amokuni",
    startOdometer: "87807.5",
    firstIgnitionOn: "13-10-2026 12:00 AM",
    distanceKm: 235.17,
    runningPct: 98,
    stopPct: 2,
    runningTime: "09:44:00",
    idleTime: "00:00:00",
    stopTime: "00:00:00",
    inactiveTime: "00:00:00",
    duration: "09:44:00",
    workDuration: "09:44:00",
    workingDays: 1,
    maxStoppage: "00:00:00",
    noOfIdle: 0,
    avgSpeed: 24,
    maxSpeed: 150,
    costDistance: 0,
    costDuration: 0,
    overSpeed: 0,
    alerts: 0,
    approxTollCost: 0.0,
    endOdometer: "88042.7",
    lastIgnitionOff: "09:44 AM",
    endLocation: "Labela, Indonesia",
  },
  {
    id: "ts-11",
    company: "Company",
    branch: "Indonesia",
    object: "Scania - 1004",
    objectBrand: "Ashok Leyland",
    objectModel: "1616",
    objectType: "DUMPER",
    driver: "No Driver Found",
    employeeNo: "1004",
    imeiNo: "8.61812E+14",
    startLocation: "Mining Pit 4",
    startOdometer: "78177.5",
    firstIgnitionOn: "13-10-2026 12:00 AM",
    distanceKm: 218.66,
    runningPct: 94,
    stopPct: 6,
    runningTime: "09:44:00",
    idleTime: "00:00:00",
    stopTime: "00:00:00",
    inactiveTime: "00:00:00",
    duration: "09:44:00",
    workDuration: "09:44:00",
    workingDays: 1,
    maxStoppage: "00:00:00",
    noOfIdle: 0,
    avgSpeed: 22,
    maxSpeed: 150,
    costDistance: 2186.6,
    costDuration: 1825.0,
    overSpeed: 0,
    alerts: 0,
    approxTollCost: 0.0,
    endOdometer: "78396.2",
    lastIgnitionOff: "09:44 AM",
    endLocation: "Port Stockpile",
  },
  {
    id: "ts-12",
    company: "Agrawal",
    branch: "Agrawal",
    object: "FTC927",
    objectBrand: "General",
    objectModel: "General",
    objectType: "Default",
    driver: "No Driver Found",
    employeeNo: "86400",
    imeiNo: "8.64002E+14",
    startLocation: "The Metropolis",
    startOdometer: "0.15",
    firstIgnitionOn: "13-10-2026 09:42 AM",
    distanceKm: 0.04,
    runningPct: 5,
    stopPct: 95,
    runningTime: "00:00:15",
    idleTime: "00:00:54",
    stopTime: "09:42:51",
    inactiveTime: "00:00:00",
    duration: "09:44:00",
    workDuration: "00:01:09",
    workingDays: 1,
    maxStoppage: "09:42:51",
    noOfIdle: 1,
    avgSpeed: 6,
    maxSpeed: 6,
    costDistance: 0,
    costDuration: 0,
    overSpeed: 0,
    alerts: 0,
    approxTollCost: 0.0,
    endOdometer: "0.19",
    lastIgnitionOff: "13-10-2026 09:43 AM",
    endLocation: "The Metropolis",
  },
  {
    id: "ts-13",
    company: "Bhavya",
    branch: "Bhavya",
    object: "4444 JHGH - VW Jetta",
    objectBrand: "Volkswagen",
    objectModel: "Jetta",
    objectType: "Car",
    driver: "No Driver Found",
    employeeNo: "89173",
    imeiNo: "8.91732E+14",
    startLocation: "-",
    startOdometer: "0.0",
    firstIgnitionOn: "-",
    distanceKm: 0.0,
    runningPct: 0,
    stopPct: 100,
    runningTime: "00:00:00",
    idleTime: "00:00:00",
    stopTime: "00:00:00",
    inactiveTime: "00:00:00",
    duration: "00:00:00",
    workDuration: "00:00:00",
    workingDays: 0,
    maxStoppage: "00:00:00",
    noOfIdle: 0,
    avgSpeed: 0,
    maxSpeed: 0,
    costDistance: 0,
    costDuration: 0,
    overSpeed: 0,
    alerts: 0,
    approxTollCost: 0.0,
    endOdometer: "0.0",
    lastIgnitionOff: "-",
    endLocation: "-",
  },
];

export function TravelSummaryPreview() {
  const [isFavorite, setIsFavorite] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activePlaybackId, setActivePlaybackId] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    return TRAVEL_SUMMARY_ROWS.filter((row) => {
      if (selectedBranch !== "all" && row.branch.toLowerCase() !== selectedBranch.toLowerCase()) {
        return false;
      }
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        return (
          row.object.toLowerCase().includes(term) ||
          row.branch.toLowerCase().includes(term) ||
          row.driver.toLowerCase().includes(term) ||
          row.objectBrand.toLowerCase().includes(term) ||
          row.startLocation.toLowerCase().includes(term) ||
          row.endLocation.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [selectedBranch, searchTerm]);

  // Totals matching the summary row
  const totals = useMemo(() => {
    return filteredRows.reduce(
      (acc, r) => ({
        distance: acc.distance + r.distanceKm,
        alerts: acc.alerts + r.alerts,
        idleCount: acc.idleCount + r.noOfIdle,
      }),
      { distance: 0, alerts: 0, idleCount: 0 }
    );
  }, [filteredRows]);

  const handleExport = (format: string) => {
    toast.success(`Exporting Travel Summary as ${format.toUpperCase()}`, {
      description: "Generating spreadsheet with vehicle routes, duration, and telemetry...",
    });
  };

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-[#DFE3EB]/90 bg-white text-slate-800 shadow-2xs dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 animate-in fade-in duration-200">
      {/* ── 1. Top Title & Filter Controls (Exact Match to Travel Summary Screenshot) ── */}
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
              Travel Summary
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
              13/10/2026 12:00 AM - 13/10/2026 09:44 AM
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
              if (selectedBranch === "all") setSelectedBranch("Thailand");
              else if (selectedBranch === "Thailand") setSelectedBranch("Valsad");
              else if (selectedBranch === "Valsad") setSelectedBranch("Indonesia");
              else setSelectedBranch("all");
            }}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1.5 rounded-md border bg-white font-medium hover:bg-slate-50 shadow-2xs transition-colors dark:bg-slate-800 dark:border-slate-700",
              selectedBranch !== "all"
                ? "border-[#0089FF] text-[#0089FF]"
                : "border-slate-200 text-slate-700 dark:text-slate-200"
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

      {/* ── 2. Data Table with Summary Σ Row ── */}
      <div className="overflow-x-auto max-h-[460px] custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
          {/* Sticky Table Header */}
          <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none shadow-xs">
            <tr>
              <th className="py-2.5 px-3 w-8 text-center text-slate-400">#</th>
              <th className="py-2.5 px-3">Company</th>
              <th className="py-2.5 px-3">Branch</th>
              <th className="py-2.5 px-3">Object</th>
              <th className="py-2.5 px-3">Object Brand</th>
              <th className="py-2.5 px-3">Object Model</th>
              <th className="py-2.5 px-3">Object Type</th>
              <th className="py-2.5 px-3">Driver</th>
              <th className="py-2.5 px-3">Start Location</th>
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
              <th className="py-2.5 px-3 text-center text-blue-600">
                Inactive (HH:MM:SS)
              </th>
              <th className="py-2.5 px-3 text-center">Duration</th>
              <th className="py-2.5 px-3 text-center">Max Stoppage</th>
              <th className="py-2.5 px-3 text-right">No of Idle</th>
              <th className="py-2.5 px-3 text-right">Speed (Avg / Max)</th>
              <th className="py-2.5 px-3 text-right text-rose-600">Alerts</th>
              <th className="py-2.5 px-3 text-center">End Location</th>
              <th className="py-2.5 px-2 text-center">Playback</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-sans text-xs">
            {/* ── Summary Σ Row (matching Travel Summary totals) ── */}
            <tr className="bg-slate-50/90 dark:bg-slate-800/60 font-semibold border-b-2 border-slate-200 dark:border-slate-700">
              <td className="py-2.5 px-3 text-center font-serif text-sm font-black text-slate-900 dark:text-white">
                Σ
              </td>
              <td className="py-2.5 px-3 text-slate-400">-</td>
              <td className="py-2.5 px-3 text-slate-400">-</td>
              <td className="py-2.5 px-3 text-slate-400 font-bold text-slate-700 dark:text-slate-200">
                13 Vehicles
              </td>
              <td className="py-2.5 px-3 text-slate-400">-</td>
              <td className="py-2.5 px-3 text-slate-400">-</td>
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
                    style={{ width: "80%" }}
                    title="Running: 80%"
                  />
                  <div
                    className="bg-[#F97316]"
                    style={{ width: "20%" }}
                    title="Stop: 20%"
                  />
                </div>
              </td>
              <td className="py-2.5 px-3 text-center text-emerald-600 font-mono font-bold">
                116:06:00
              </td>
              <td className="py-2.5 px-3 text-center text-amber-600 font-mono font-bold">
                00:37:21
              </td>
              <td className="py-2.5 px-3 text-center text-rose-600 font-mono font-bold">
                29:16:30
              </td>
              <td className="py-2.5 px-3 text-center text-blue-600 font-mono font-bold">
                48:40:00
              </td>
              <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                116:40:00
              </td>
              <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                29:13:40
              </td>
              <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-700">
                {totals.idleCount}
              </td>
              <td className="py-2.5 px-3 text-right text-slate-400">-</td>
              <td className="py-2.5 px-3 text-right font-bold text-rose-600">
                {totals.alerts.toFixed(1)}
              </td>
              <td className="py-2.5 px-3 text-slate-400">-</td>
              <td className="py-2.5 px-2 text-center text-slate-400">-</td>
            </tr>

            {/* ── Vehicle Data Rows ── */}
            {filteredRows.map((row) => {
              const isBusRow = row.object.includes("BUS - 130003");
              return (
                <tr
                  key={row.id}
                  className={cn(
                    "transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40",
                    isBusRow && "bg-amber-50/40 dark:bg-amber-950/20 font-medium"
                  )}
                >
                  <td className="py-2.5 px-3 text-center">
                    <span className="flex h-4 w-4 mx-auto items-center justify-center rounded text-[10px] font-bold bg-[#0089FF]/10 text-[#0089FF]">
                      +
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                    {row.company}
                  </td>

                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                    {row.branch}
                  </td>

                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                    {row.object}
                  </td>

                  <td className="py-2.5 px-3 text-slate-500">{row.objectBrand}</td>

                  <td className="py-2.5 px-3 text-slate-500">{row.objectModel}</td>

                  <td className="py-2.5 px-3 text-slate-600 font-medium">
                    {row.objectType}
                  </td>

                  <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200 font-medium">
                    {row.driver}
                  </td>

                  <td className="py-2.5 px-3 text-slate-600 truncate max-w-[140px]" title={row.startLocation}>
                    {row.startLocation}
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

                  <td className="py-2.5 px-3 text-center text-blue-600 font-mono font-medium">
                    {row.inactiveTime}
                  </td>

                  <td className="py-2.5 px-3 text-center font-mono font-medium text-slate-900 dark:text-white">
                    {row.duration}
                  </td>

                  <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                    {row.maxStoppage}
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                    {row.noOfIdle}
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                    {row.avgSpeed} / {row.maxSpeed}
                  </td>

                  <td className="py-2.5 px-3 text-right">
                    {row.alerts > 0 ? (
                      <span className="font-bold text-rose-600">{row.alerts}</span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>

                  <td className="py-2.5 px-3 text-slate-600 truncate max-w-[140px]" title={row.endLocation}>
                    {row.endLocation}
                  </td>

                  <td className="py-2.5 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setActivePlaybackId(row.id);
                        toast.info(`Opening Route Playback for ${row.object}`);
                      }}
                      className="rounded p-1 text-[#0089FF] hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Route Playback"
                    >
                      <Play className="h-3.5 w-3.5 fill-[#0089FF]" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── 3. Bottom Toolbar & Pagination Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 bg-white text-xs text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
        <div className="flex items-center gap-2">
          {/* Quick Export format buttons matching screenshot */}
          <button
            type="button"
            onClick={() => handleExport("xls")}
            className="flex items-center gap-1 px-2 py-1 rounded border border-slate-200 hover:bg-slate-50 font-semibold text-emerald-700 text-[11px] cursor-pointer"
            title="Download Excel"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>XLS</span>
          </button>
          <button
            type="button"
            onClick={() => handleExport("pdf")}
            className="flex items-center gap-1 px-2 py-1 rounded border border-slate-200 hover:bg-slate-50 font-semibold text-rose-700 text-[11px] cursor-pointer"
            title="Download PDF"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>PDF</span>
          </button>
          <button
            type="button"
            onClick={() => handleExport("csv")}
            className="flex items-center gap-1 px-2 py-1 rounded border border-slate-200 hover:bg-slate-50 font-semibold text-sky-700 text-[11px] cursor-pointer"
            title="Download CSV"
          >
            <Download className="h-3.5 w-3.5" />
            <span>CSV</span>
          </button>
        </div>

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

        {/* Right utility buttons: count */}
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <span>1-20 ({filteredRows.length})</span>
          <button
            type="button"
            onClick={() => {
              setSelectedBranch("all");
              setSearchTerm("");
              toast.info("Report reset to default view");
            }}
            className="h-7 w-7 rounded-md border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-2xs dark:bg-slate-800 dark:border-slate-700 cursor-pointer ml-1"
            title="Reset table"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
