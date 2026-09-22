import {
  AlertTriangle,
  Battery,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Download,
  FileText,
  Flame,
  Gauge,
  HelpCircle,
  Info,
  Layers,
  Lock,
  Maximize2,
  Phone,
  Play,
  Radio,
  RefreshCw,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  Thermometer,
  Truck,
  User,
  Wifi,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { STATUS_META, type FleetObject } from "@/data/fleet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function VehicleTelemetryDrawer({
  vehicle,
  onClose,
  onSelectVehicle,
  allVehicles,
  onOpenPlayback,
  className,
}: {
  vehicle: FleetObject;
  onClose: () => void;
  onSelectVehicle: (id: string) => void;
  allVehicles: FleetObject[];
  onOpenPlayback?: () => void;
  className?: string;
}) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    activity: true,
    fuel: true,
    consumption: true,
    sensors: true,
    alerts: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Fuel calculation & gauge rotation
  const fuelVal = vehicle.fuel ?? 6;
  const tankCap = vehicle.tankCapacity ?? 120;
  const fuelPercent = Math.min(
    100,
    Math.max(0, Math.round((fuelVal / tankCap) * 100)),
  );
  // Dial gauge angle (-90deg for 0% to +90deg for 100%)
  const needleAngle = -90 + (fuelPercent / 100) * 180;

  // Format mechanical odometer digits (e.g. 0 0 7 4 8 3 4)
  const odoDigits = String(vehicle.odometer ?? 74834)
    .padStart(7, "0")
    .split("");

  const currentIndex = allVehicles.findIndex((v) => v.id === vehicle.id);
  const handlePrev = () => {
    if (currentIndex > 0 && allVehicles[currentIndex - 1]) {
      onSelectVehicle(allVehicles[currentIndex - 1]!.id);
    }
  };
  const handleNext = () => {
    if (
      currentIndex < allVehicles.length - 1 &&
      allVehicles[currentIndex + 1]
    ) {
      onSelectVehicle(allVehicles[currentIndex + 1]!.id);
    }
  };

  const handleShare = () => {
    toast.success("Live tracking share link copied to clipboard!");
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-200 w-full sm:w-[350px] text-xs select-none",
        className,
      )}
    >
      {/* 1. Modern Header */}
      <div className="flex h-11 items-center justify-between border-b border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 px-3 select-none">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <span className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
            {vehicle.name}
          </span>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-0.5 shrink-0 text-slate-600 dark:text-slate-400">
          <button
            type="button"
            title="Previous Vehicle"
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5 stroke-[2.2]" />
          </button>
          <button
            type="button"
            title="Next Vehicle"
            onClick={handleNext}
            disabled={currentIndex >= allVehicles.length - 1}
            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight className="h-3.5 w-3.5 stroke-[2.2]" />
          </button>
          <button
            type="button"
            title="Close Panel"
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white cursor-pointer ml-0.5"
          >
            <X className="h-4 w-4 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* 2. Scrollable Telemetry Cards Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[calc(100vh-210px)]">
        {/* Top Vehicle Showcase Card */}
        <div className="rounded-lg border border-[#DFE3EB] dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-3 space-y-2.5">
          {/* Vehicle Image & Live Status Pill */}
          <div className="flex items-center justify-between">
            {/* Vehicle render image */}
            <div className="relative flex items-center justify-center h-16 w-32 bg-white dark:bg-slate-900 rounded-md p-1 border border-[#DFE3EB] dark:border-slate-800 overflow-hidden shadow-2xs">
              <img
                src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80"
                alt="Vehicle Preview"
                className="h-full w-full object-contain filter drop-shadow-sm"
              />
            </div>

            {/* Status Badge & Trip Data */}
            <div className="text-right space-y-1">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-bold text-[10px] uppercase shadow-2xs",
                  vehicle.status === "running"
                    ? "bg-emerald-500 text-white"
                    : vehicle.status === "idle"
                      ? "bg-amber-500 text-white"
                      : "bg-rose-500 text-white",
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                {STATUS_META[vehicle.status].label} {vehicle.duration || "116:20"}
              </span>

              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                  Current Trip
                </span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                  {vehicle.currentTrip ?? "331.40"} km
                </span>
              </div>
            </div>
          </div>

          {/* Odometer & Work Hour Box */}
          <div className="flex items-center justify-between border-t border-[#DFE3EB] dark:border-slate-800 pt-2 text-[11px]">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
                Odometer
              </span>
              {/* 7-digit mechanical odometer box */}
              <div className="flex gap-0.5 bg-slate-900 dark:bg-black p-0.5 rounded border border-slate-700 shadow-inner">
                {odoDigits.map((digit, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center justify-center h-4 w-3 bg-zinc-800 text-white font-mono text-[10px] font-bold rounded-xs border-r border-zinc-700 last:border-0"
                  >
                    {digit}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                Work Hour
              </span>
              <span className="font-mono font-extrabold text-slate-900 dark:text-slate-100 tabular-nums text-xs">
                {vehicle.workHour || "2014 hrs"}
              </span>
            </div>
          </div>

          {/* Driver Information */}
          <div className="flex items-center justify-between border-t border-[#DFE3EB] dark:border-slate-800 pt-2 text-[11px] text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                Driver:{" "}
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                  {vehicle.driver || "Shivam Patel"}
                </strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => toast.info("Driver phone: " + (vehicle.driverPhone || "+91 98765 43210"))}
              className="text-[10px] text-[#0089FF] font-semibold hover:underline cursor-pointer"
            >
              More Details &gt;
            </button>
          </div>

          {/* Quick Icon Action Toolbar Strip */}
          <div className="flex items-center justify-between border-t border-[#DFE3EB] dark:border-slate-800 pt-2 px-1 text-slate-600 dark:text-slate-400">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-black dark:hover:text-white cursor-pointer disabled:opacity-30"
              title="Previous"
            >
              <ChevronLeft className="h-3.5 w-3.5 stroke-[2.2]" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex >= allVehicles.length - 1}
              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-black dark:hover:text-white cursor-pointer disabled:opacity-30"
              title="Next"
            >
              <ChevronRight className="h-3.5 w-3.5 stroke-[2.2]" />
            </button>
            <button
              type="button"
              onClick={() => toast.info("Vehicle specifications & tracker info")}
              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-[#0089FF] cursor-pointer"
              title="Vehicle Details"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-[#0089FF] cursor-pointer"
              title="Share Live Link"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
            {onOpenPlayback && (
              <button
                type="button"
                onClick={onOpenPlayback}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-emerald-600 cursor-pointer"
                title="Route Playback"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
              </button>
            )}
          </div>
        </div>

        {/* 3. Accordion 1: Today Activity (Matching Screenshot 2) */}
        <div className="rounded-lg border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection("activity")}
            className="flex w-full items-center justify-between p-2.5 font-semibold text-xs text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-[#0089FF]" />
              <span>Today Activity</span>
            </div>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-slate-400 transition-transform duration-150",
                !openSections.activity && "-rotate-90",
              )}
            />
          </button>

          {openSections.activity && (
            <div className="p-3 pt-0 border-t border-[#DFE3EB]/60 dark:border-slate-800/60 space-y-2.5">
              {/* Distance big stat */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Total Distance
                </span>
                <span className="text-base font-extrabold text-[#0089FF] tabular-nums">
                  331 km
                </span>
              </div>

              {/* Time breakdown grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#DFE3EB]/40 dark:border-slate-800/40">
                <div className="flex justify-between">
                  <span className="text-slate-500">Running</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {vehicle.runningTime || "11:26 hrs"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Idle</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
                    {vehicle.idleTime || "00:00 hrs"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Stop</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">
                    {vehicle.stopTime || "00:00 hrs"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Inactive</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    {vehicle.inactiveTime || "00:00 hrs"}
                  </span>
                </div>
              </div>

              {/* Start & Stop info */}
              <div className="space-y-1 pt-1 text-[11px] border-t border-[#DFE3EB]/40 dark:border-slate-800/40">
                <div className="flex justify-between">
                  <span className="text-slate-500">Working Start:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {vehicle.workingStart || "12:00 AM"}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">
                  <span>Last Stop: </span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {vehicle.lastStop || "Rantepao, Tana Toraja Regency, South Sulawesi, Indonesia (NW)"}
                  </span>
                </div>
              </div>

              {/* Show Log link */}
              <div className="pt-1 text-right">
                <button
                  type="button"
                  onClick={() => toast.info("Opening full trip activity log")}
                  className="text-xs font-semibold text-[#0089FF] hover:underline cursor-pointer"
                >
                  Show Log
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. Accordion 2: Fuel Dial Gauge (Matching Screenshot 2) */}
        <div className="rounded-lg border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection("fuel")}
            className="flex w-full items-center justify-between p-2.5 font-semibold text-xs text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-amber-500" />
              <span># Fuel</span>
            </div>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-slate-400 transition-transform duration-150",
                !openSections.fuel && "-rotate-90",
              )}
            />
          </button>

          {openSections.fuel && (
            <div className="p-3 pt-0 border-t border-[#DFE3EB]/60 dark:border-slate-800/60 space-y-3">
              {/* Semicircle Fuel Dial Gauge */}
              <div className="flex flex-col items-center justify-center pt-2">
                <div className="relative w-44 h-24 flex items-end justify-center">
                  <svg className="w-44 h-24" viewBox="0 0 160 90">
                    <defs>
                      <linearGradient id="fuelArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#EF4444" />
                        <stop offset="25%" stopColor="#F59E0B" />
                        <stop offset="60%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#0089FF" />
                      </linearGradient>
                    </defs>
                    {/* Background Arc */}
                    <path
                      d="M 20,80 A 60,60 0 0,1 140,80"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    {/* Colored Gradient Arc */}
                    <path
                      d="M 20,80 A 60,60 0 0,1 140,80"
                      fill="none"
                      stroke="url(#fuelArcGrad)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray="188.4"
                      strokeDashoffset={188.4 - (188.4 * fuelPercent) / 100}
                    />
                    {/* Tick labels: E, 1/2, F */}
                    <text x="18" y="88" fill="#94A3B8" fontSize="8" fontWeight="bold">E</text>
                    <text x="76" y="24" fill="#94A3B8" fontSize="8" fontWeight="bold">1/2</text>
                    <text x="138" y="88" fill="#94A3B8" fontSize="8" fontWeight="bold">F</text>
                    {/* Gauge Needle */}
                    <g transform={`translate(80, 80) rotate(${needleAngle})`}>
                      <line x1="0" y1="0" x2="0" y2="-52" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="0" cy="0" r="5" fill="#1E293B" />
                      <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
                    </g>
                  </svg>

                  {/* Fuel Liter Value Badge */}
                  <div className="absolute -bottom-1 text-center">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                      {fuelVal} liter
                    </span>
                  </div>
                </div>
              </div>

              {/* Tank Breakdown Details */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-[#DFE3EB]/40 dark:border-slate-800/40">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tank:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Refill:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">NA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Drain:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tank Capacity:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{tankCap}.0 ltr</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. Accordion 3: Consumption */}
        <div className="rounded-lg border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection("consumption")}
            className="flex w-full items-center justify-between p-2.5 font-semibold text-xs text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-emerald-500" />
              <span># Consumption</span>
            </div>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-slate-400 transition-transform duration-150",
                !openSections.consumption && "-rotate-90",
              )}
            />
          </button>

          {openSections.consumption && (
            <div className="p-3 pt-0 border-t border-[#DFE3EB]/60 dark:border-slate-800/60 space-y-2 text-[11px]">
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">Fuel Economy:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">8.4 L/100km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Fuel Used:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">27.8 L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Idle Fuel:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300 font-mono">0.4 L</span>
              </div>
            </div>
          )}
        </div>

        {/* 6. Accordion 4: Temperature & Sensors */}
        <div className="rounded-lg border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection("sensors")}
            className="flex w-full items-center justify-between p-2.5 font-semibold text-xs text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <Thermometer className="h-4 w-4 text-rose-500" />
              <span># Temperature & Sensors</span>
            </div>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-slate-400 transition-transform duration-150",
                !openSections.sensors && "-rotate-90",
              )}
            />
          </button>

          {openSections.sensors && (
            <div className="p-3 pt-0 border-t border-[#DFE3EB]/60 dark:border-slate-800/60 space-y-2 text-[11px]">
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">Engine Temp:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">88 °C (Normal)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Chamber Temp:</span>
                <span className="font-bold text-[#0089FF] font-mono">18.2 °C (Chilled)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Battery Voltage:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">24.2 V (Healthy)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ignition Status:</span>
                <span className="font-bold text-emerald-600 font-mono">ON</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
