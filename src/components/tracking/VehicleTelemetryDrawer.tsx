import {
  Activity,
  AlertTriangle,
  Battery,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Download,
  Eye,
  FileText,
  Flame,
  Gauge,
  HelpCircle,
  Info,
  Layers,
  Lock,
  MapPin,
  Maximize2,
  Navigation,
  Phone,
  Play,
  Radio,
  RefreshCw,
  RotateCcw,
  Scale,
  Settings,
  Share2,
  SlidersHorizontal,
  Thermometer,
  Truck,
  User,
  Users,
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
import {
  DEFAULT_ENABLED_WIDGETS,
  TooltipWidgetSettingsModal,
} from "./TooltipWidgetSettingsModal";

const DRAWER_TABS = [
  { id: "details", label: "Details", icon: MapPin },
  { id: "telemetry", label: "Telemetry", icon: Activity },
  { id: "settings", label: "Settings", icon: SlidersHorizontal },
] as const;

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
  const [activeDrawerTab, setActiveDrawerTab] = useState<"details" | "telemetry" | "settings">("details");
  const [showWidgetSettings, setShowWidgetSettings] = useState(false);
  const [enabledWidgets, setEnabledWidgets] = useState<string[]>(DEFAULT_ENABLED_WIDGETS);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    activity: true,
    fuel: true,
    consumption: true,
    sensors: true,
    reminder: true,
    flow_meter: true,
    load_prediction: true,
    adblue: true,
    elock: true,
    trailer: true,
    passenger_seat: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isEnabled = (id: string) => enabledWidgets.includes(id);

  // Fuel calculation & gauge rotation
  const fuelVal = vehicle.fuel ?? 68;
  const tankCap = vehicle.tankCapacity ?? 120;
  const fuelPercent = Math.min(
    100,
    Math.max(0, Math.round((fuelVal / tankCap) * 100)),
  );
  const needleAngle = -90 + (fuelPercent / 100) * 180;

  // Format mechanical odometer digits (0 0 7 4 8 3 4)
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
    <>
      <div
        className={cn(
          "flex flex-col gap-2.5 w-full sm:w-[280px] text-xs select-none h-full bg-transparent pointer-events-none",
          className,
        )}
      >
        {/* 1. Header Card (Floating white card matching reference 1:1) */}
        <div className="flex h-11 items-center justify-between bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 px-3 select-none rounded-2xl shadow-md shrink-0 pointer-events-auto">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth flex-1 min-w-0 pr-1">
            {DRAWER_TABS.map((tab) => {
              const isActive = activeDrawerTab === tab.id;
              const IconComp = tab.icon;

              if (isActive) {
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveDrawerTab(tab.id as any)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0089FF] hover:bg-[#0070d6] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer shrink-0 active:scale-98"
                  >
                    <IconComp className="h-3.5 w-3.5 stroke-[2.2] fill-current shrink-0" />
                    <span className="truncate max-w-[95px]">{tab.label}</span>
                  </button>
                );
              }

              return (
                <TooltipProvider key={tab.id} delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setActiveDrawerTab(tab.id as any)}
                        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shrink-0"
                      >
                        <IconComp className="h-4 w-4 stroke-[2]" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      {tab.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>

          {/* Header Settings Gear Icon Button */}
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  title="Tooltip Widget Settings"
                  onClick={() => setShowWidgetSettings(true)}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF] dark:hover:text-[#0089FF] transition-colors cursor-pointer shrink-0"
                >
                  <Settings className="h-4 w-4 stroke-[2.2]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Tooltip Widget Settings
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* 2. Scrollable Column of Floating Cards (Matching reference 1:1) */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-2.5 custom-scrollbar pr-0.5 pointer-events-auto">
          
          {/* ========================================================= */}
          {/* CARD 1: VEHICLE HERO & DETAILS FLOATING CARD (Google Maps Style) */}
          {/* ========================================================= */}
          <div className="rounded-2xl border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-md space-y-2.5">
            {/* Header Title & Info Icon */}
            {isEnabled("vehicle_name") && (
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 tracking-tight truncate">
                  {vehicle.name || "Fuel - 1001"}
                </h3>
                <button
                  type="button"
                  onClick={() => toast.info(`Vehicle Specs: ${vehicle.name} (${vehicle.imei || "IMEI 8610760861"})`)}
                  className="p-1 rounded-full text-slate-400 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Vehicle Info"
                >
                  <Info className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Google Maps Style Vehicle Image & Live Status Hero Block */}
            <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-slate-100/70 dark:from-slate-800/80 dark:to-slate-800/40 p-2 rounded-xl border border-slate-200/70 dark:border-slate-700/60 shadow-2xs">
              <div className="relative h-16 w-28 rounded-lg overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700/80 p-1 flex items-center justify-center shrink-0 shadow-2xs group">
                <img
                  src={
                    vehicle.type === "truck" || vehicle.name.toLowerCase().includes("fuel") || vehicle.name.toLowerCase().includes("bus")
                      ? "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=400&q=80"
                      : "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80"
                  }
                  alt="Vehicle Preview"
                  className="h-full w-full object-contain filter drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {isEnabled("status") && (
                <div className="flex flex-col justify-center gap-1.5 flex-1 min-w-0 text-right">
                  <div>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-bold text-[10px] text-white uppercase shadow-xs tracking-wider",
                        vehicle.status === "running"
                          ? "bg-emerald-600"
                          : vehicle.status === "idle"
                            ? "bg-amber-500"
                            : "bg-rose-600",
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      {STATUS_META[vehicle.status].label}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-1 text-slate-800 dark:text-slate-100 font-mono text-xs font-extrabold">
                    <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{vehicle.duration || "116:20"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Toolbar Row (5 icons matching Google Maps action buttons) */}
            <div className="grid grid-cols-5 gap-1 pt-1 border-t border-[#DFE3EB]/70 dark:border-slate-800/70 text-slate-600 dark:text-slate-300">
              <button
                type="button"
                onClick={() => toast.success(`Tracing ${vehicle.name} on live map`)}
                className="flex flex-col items-center gap-0.5 p-1 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-950/40 hover:text-[#0089FF] cursor-pointer transition-all active:scale-95 group"
                title="Trace on Map"
              >
                <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-[#0089FF] group-hover:text-white transition-colors">
                  <MapPin className="h-3.5 w-3.5 stroke-[2.2]" />
                </div>
                <span className="text-[9.5px] font-semibold tracking-tight">Trace</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="flex flex-col items-center gap-0.5 p-1 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-950/40 hover:text-[#0089FF] cursor-pointer transition-all active:scale-95 group"
                title="Share Location"
              >
                <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-[#0089FF] group-hover:text-white transition-colors">
                  <Share2 className="h-3.5 w-3.5 stroke-[2.2]" />
                </div>
                <span className="text-[9.5px] font-semibold tracking-tight">Share</span>
              </button>

              <button
                type="button"
                onClick={() => toast.info(`Sending navigation command to ${vehicle.name}`)}
                className="flex flex-col items-center gap-0.5 p-1 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-950/40 hover:text-[#0089FF] cursor-pointer transition-all active:scale-95 group"
                title="Navigate"
              >
                <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-[#0089FF] group-hover:text-white transition-colors">
                  <Navigation className="h-3.5 w-3.5 stroke-[2.2]" />
                </div>
                <span className="text-[9.5px] font-semibold tracking-tight">Navigate</span>
              </button>

              {onOpenPlayback && (
                <button
                  type="button"
                  onClick={onOpenPlayback}
                  className="flex flex-col items-center gap-0.5 p-1 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 cursor-pointer transition-all active:scale-95 group"
                  title="Playback"
                >
                  <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Play className="h-3.5 w-3.5 stroke-[2.2] fill-current" />
                  </div>
                  <span className="text-[9.5px] font-semibold tracking-tight">Playback</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => toast.info(`Opening vehicle tools for ${vehicle.name}`)}
                className="flex flex-col items-center gap-0.5 p-1 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-950/40 hover:text-[#0089FF] cursor-pointer transition-all active:scale-95 group"
                title="Tools"
              >
                <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-[#0089FF] group-hover:text-white transition-colors">
                  <Wrench className="h-3.5 w-3.5 stroke-[2.2]" />
                </div>
                <span className="text-[9.5px] font-semibold tracking-tight">Tools</span>
              </button>
            </div>

            {/* Vehicle Details Sub-Section */}
            <div className="pt-2 border-t border-[#DFE3EB]/70 dark:border-slate-800/70 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-slate-100 mb-1.5">
                <Truck className="h-4 w-4 text-[#0089FF]" />
                <span>Vehicle Details</span>
              </div>

              {/* Current Trip */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Current Trip</span>
                <span className="font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                  {vehicle.currentTrip ?? "331.4"} km
                </span>
              </div>

              {/* Odometer 7 Black Digit Boxes */}
              {isEnabled("odometer") && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Odometer</span>
                  <div className="flex gap-0.5 bg-black p-0.5 rounded-md shadow-inner border border-zinc-800">
                    {odoDigits.map((digit, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center justify-center h-4.5 w-3.5 bg-gradient-to-b from-zinc-800 to-zinc-950 text-white font-mono text-[10px] font-bold rounded-xs border-r border-zinc-700/60 last:border-0"
                      >
                        {digit}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Work Hour */}
              {isEnabled("work_hour") && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Work Hour</span>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                    {vehicle.workHour || "11:26 hrs"}
                  </span>
                </div>
              )}

              {/* Driver */}
              {isEnabled("driver") && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Driver</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {vehicle.driver || "Wamela (Jambouleano)"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Mobile</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                      {vehicle.driverPhone || "+62 812 3456 7890"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* CARD 2: TODAY ACTIVITY FLOATING CARD */}
          {/* ========================================================= */}
          {(isEnabled("distance") ||
            isEnabled("running") ||
            isEnabled("stop") ||
            isEnabled("inactive") ||
            isEnabled("idle") ||
            isEnabled("working_start") ||
            isEnabled("last_stop")) && (
            <div className="rounded-2xl border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-md space-y-2">
              <div className="flex items-center justify-between border-b border-[#DFE3EB]/70 dark:border-slate-800/70 pb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-slate-100">
                  <Compass className="h-4 w-4 text-[#0089FF]" />
                  <span>Today Activity</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSection("activity")}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", !openSections.activity && "-rotate-90")} />
                </button>
              </div>

              {openSections.activity && (
                <div className="space-y-2">
                  {isEnabled("distance") && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Total Distance</span>
                      <span className="text-sm font-extrabold text-[#0089FF] tabular-nums">331 km</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] pt-1 border-t border-[#DFE3EB]/50 dark:border-slate-800/50">
                    {isEnabled("running") && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Running</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                          {vehicle.runningTime || "11:26 hrs"}
                        </span>
                      </div>
                    )}
                    {isEnabled("idle") && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Idle</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
                          {vehicle.idleTime || "00:00 hrs"}
                        </span>
                      </div>
                    )}
                    {isEnabled("stop") && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Stop</span>
                        <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">
                          {vehicle.stopTime || "00:00 hrs"}
                        </span>
                      </div>
                    )}
                    {isEnabled("inactive") && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Inactive</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                          {vehicle.inactiveTime || "00:00 hrs"}
                        </span>
                      </div>
                    )}
                  </div>

                  {(isEnabled("working_start") || isEnabled("last_stop")) && (
                    <div className="space-y-1 pt-1 text-[11px] border-t border-[#DFE3EB]/50 dark:border-slate-800/50">
                      {isEnabled("working_start") && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Working Start:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {vehicle.workingStart || "12:00 AM"}
                          </span>
                        </div>
                      )}
                      {isEnabled("last_stop") && (
                        <div className="text-[10px] text-slate-500">
                          <span>Last Stop: </span>
                          <span className="text-slate-700 dark:text-slate-300 font-medium">
                            {vehicle.lastStop || "Rantepao, Toraja Regency, South Sulawesi, Indonesia (NW)"}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-0.5 text-right">
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
          )}

          {/* ========================================================= */}
          {/* CARD 3: # FUEL FLOATING CARD */}
          {/* ========================================================= */}
          {(isEnabled("fuel_level") ||
            isEnabled("refill_and_drain") ||
            isEnabled("tank_capacity") ||
            isEnabled("number_of_tank")) && (
            <div className="rounded-2xl border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-md space-y-2">
              <div className="flex items-center justify-between border-b border-[#DFE3EB]/70 dark:border-slate-800/70 pb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-slate-100">
                  <Flame className="h-4 w-4 text-amber-500" />
                  <span># Fuel</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSection("fuel")}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", !openSections.fuel && "-rotate-90")} />
                </button>
              </div>

              {openSections.fuel && (
                <div className="space-y-2">
                  {isEnabled("fuel_level") && (
                    <div className="flex flex-col items-center justify-center pt-1">
                      <div className="relative w-36 h-20 flex items-end justify-center">
                        <svg className="w-36 h-20" viewBox="0 0 160 90">
                          <defs>
                            <linearGradient id="fuelArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#EF4444" />
                              <stop offset="25%" stopColor="#F59E0B" />
                              <stop offset="60%" stopColor="#10B981" />
                              <stop offset="100%" stopColor="#0089FF" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M 20,80 A 60,60 0 0,1 140,80"
                            fill="none"
                            stroke="#E2E8F0"
                            strokeWidth="12"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 20,80 A 60,60 0 0,1 140,80"
                            fill="none"
                            stroke="url(#fuelArcGrad)"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray="188.4"
                            strokeDashoffset={188.4 - (188.4 * fuelPercent) / 100}
                          />
                          <text x="18" y="88" fill="#94A3B8" fontSize="8" fontWeight="bold">E</text>
                          <text x="76" y="24" fill="#94A3B8" fontSize="8" fontWeight="bold">1/2</text>
                          <text x="138" y="88" fill="#94A3B8" fontSize="8" fontWeight="bold">F</text>
                          <g transform={`translate(80, 80) rotate(${needleAngle})`}>
                            <line x1="0" y1="0" x2="0" y2="-52" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="0" cy="0" r="5" fill="#1E293B" />
                            <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
                          </g>
                        </svg>

                        <div className="absolute -bottom-1 text-center">
                          <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                            {fuelVal} liter
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1.5 border-t border-[#DFE3EB]/50 dark:border-slate-800/50">
                    {isEnabled("number_of_tank") && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tank:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">1</span>
                      </div>
                    )}
                    {isEnabled("refill_and_drain") && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Refill:</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">NA</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Drain:</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">0</span>
                        </div>
                      </>
                    )}
                    {isEnabled("tank_capacity") && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Capacity:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{tankCap}.0 ltr</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* CARD 4: # CONSUMPTION FLOATING CARD */}
          {/* ========================================================= */}
          {isEnabled("consumption") && (
            <div className="rounded-2xl border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-md space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-slate-100 border-b border-[#DFE3EB]/70 dark:border-slate-800/70 pb-1.5">
                <Zap className="h-4 w-4 text-emerald-500" />
                <span># Consumption</span>
              </div>
              <div className="space-y-1 text-[11px] pt-0.5">
                <div className="flex justify-between">
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
            </div>
          )}

          {/* ========================================================= */}
          {/* CARD 5: # TEMPERATURE & SENSORS FLOATING CARD */}
          {/* ========================================================= */}
          <div className="rounded-2xl border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-md space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-slate-100 border-b border-[#DFE3EB]/70 dark:border-slate-800/70 pb-1.5">
              <Thermometer className="h-4 w-4 text-rose-500" />
              <span># Temperature & Sensors</span>
            </div>
            <div className="space-y-1 text-[11px] pt-0.5">
              <div className="flex justify-between">
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
          </div>
        </div>
      </div>

      {/* Tooltip Widget Customization Settings Modal */}
      <TooltipWidgetSettingsModal
        open={showWidgetSettings}
        onClose={() => setShowWidgetSettings(false)}
        enabledWidgets={enabledWidgets}
        onApply={(updated) => setEnabledWidgets(updated)}
      />
    </>
  );
}
