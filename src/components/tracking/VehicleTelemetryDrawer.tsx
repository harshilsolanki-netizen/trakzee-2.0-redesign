import {
  Activity,
  AlertTriangle,
  Battery,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cloud,
  Compass,
  Copy,
  Download,
  Droplet,
  Eye,
  FileText,
  Flame,
  Gauge,
  Globe,
  GripVertical,
  HelpCircle,
  Info,
  Layers,
  Leaf,
  Locate,
  Lock,
  MapPin,
  MapPinPlus,
  Maximize2,
  Navigation,
  Phone,
  Play,
  Plus,
  Radio,
  RefreshCw,
  RotateCcw,
  Scale,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  SquarePen,
  Target,
  Thermometer,
  ThumbsUp,
  Timer,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DEFAULT_ENABLED_WIDGETS,
  TooltipWidgetSettingsModal,
} from "./TooltipWidgetSettingsModal";

const DRAWER_TABS = [
  { id: "details", label: "Details", icon: MapPin },
  { id: "telemetry", label: "Telemetry", icon: Activity },
  { id: "settings", label: "Settings", icon: SlidersHorizontal },
] as const;

function formatDuration(raw?: string): string {
  if (!raw) return "31d 23h 15m";
  if (/[dhm]/.test(raw)) return raw;
  if (raw.includes(":")) {
    const [hStr, mStr] = raw.split(":");
    const totalHours = parseInt(hStr || "0", 10);
    const mins = parseInt(mStr || "0", 10);
    if (isNaN(totalHours) || isNaN(mins)) return raw;
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    if (days > 0) {
      return `${days}d ${hours}h ${mins}m`;
    }
    return `${hours}h ${mins}m`;
  }
  return raw;
}

function WidgetActionButton({
  isRefreshing,
  onClick,
  cardName,
}: {
  isRefreshing: boolean;
  onClick: () => void;
  cardName: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group/btn relative w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-sky-950/50 transition-all duration-200 cursor-pointer active:scale-90 shrink-0"
      title={`Refresh ${cardName}`}
    >
      {isRefreshing && (
        <span className="absolute inset-0 rounded-md bg-[#0089FF]/30 animate-ping pointer-events-none" />
      )}
      <div className="relative w-3.5 h-3.5 flex items-center justify-center">
        {isRefreshing ? (
          <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#0089FF]" />
        ) : (
          <>
            <GripVertical className="h-3.5 w-3.5 text-slate-400 dark:text-slate-400 group-hover/btn:opacity-0 group-hover/btn:scale-75 transition-all duration-200 absolute" />
            <RefreshCw className="h-3.5 w-3.5 text-[#0089FF] opacity-0 scale-75 group-hover/btn:opacity-100 group-hover/btn:scale-100 group-hover/btn:rotate-180 transition-all duration-300 absolute" />
          </>
        )}
      </div>
    </button>
  );
}

export function VehicleTelemetryDrawer({
  vehicle,
  onClose,
  onSelectVehicle,
  allVehicles,
  onOpenPlayback,
  isHealthOnly = false,
  className,
}: {
  vehicle: FleetObject;
  onClose: () => void;
  onSelectVehicle: (id: string) => void;
  allVehicles: FleetObject[];
  onOpenPlayback?: () => void;
  isHealthOnly?: boolean;
  className?: string;
}) {
  const [activeDrawerTab, setActiveDrawerTab] = useState<"details" | "telemetry" | "settings">("details");
  const [showWidgetSettings, setShowWidgetSettings] = useState(false);
  const [enabledWidgets, setEnabledWidgets] = useState<string[]>(DEFAULT_ENABLED_WIDGETS);
  const [selectedDriverModal, setSelectedDriverModal] = useState<{
    name: string;
    phone: string;
    role: string;
    licenseNo?: string;
    licenseExp?: string;
    city?: string;
  } | null>(null);
  const [selectedTank, setSelectedTank] = useState<number>(0);
  const [activeHealthCategory, setActiveHealthCategory] = useState<
    "safety" | "efficiency" | "risk" | "discipline"
  >("safety");

  const [cardsOrder, setCardsOrder] = useState<string[]>([
    "health_score",
    "vehicle_main",
    "driver_info",
    "today_activity",
    "location",
    "documents",
    "fuel",
    "consumption",
    "temperature",
  ]);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [refreshingCardId, setRefreshingCardId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedCardId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedCardId || draggedCardId === targetId) return;

    const newOrder = [...cardsOrder];
    const sourceIndex = newOrder.indexOf(draggedCardId);
    const targetIndex = newOrder.indexOf(targetId);

    if (sourceIndex !== -1 && targetIndex !== -1) {
      newOrder.splice(sourceIndex, 1);
      newOrder.splice(targetIndex, 0, draggedCardId);
      setCardsOrder(newOrder);
      toast.success("Widget reordered");
    }
    setDraggedCardId(null);
  };

  const handleRefreshCard = (cardName: string, id: string) => {
    setRefreshingCardId(id);
    setTimeout(() => {
      setRefreshingCardId(null);
      toast.success(`${cardName} updated`);
    }, 600);
  };

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
          "flex flex-col gap-2 w-full text-xs select-none h-full bg-transparent pointer-events-none",
          className,
        )}
      >
        {/* 1. Header Card (Hidden when isHealthOnly is true) */}
        {!isHealthOnly && (
          <div className="flex h-11 w-full items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 select-none rounded-2xl shadow-md shrink-0 pointer-events-auto">
            <div className="flex items-center gap-1 min-w-0">
              {DRAWER_TABS.map((tab) => {
                const isActive = activeDrawerTab === tab.id;
                const IconComp = tab.icon;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    title={tab.label}
                    onClick={() => setActiveDrawerTab(tab.id as any)}
                    className={cn(
                      "h-8 w-8 flex items-center justify-center rounded-xl transition-all cursor-pointer shrink-0 active:scale-95",
                      isActive
                        ? "bg-[#0089FF] text-white shadow-2xs"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white",
                    )}
                  >
                    <IconComp className={cn("h-4 w-4 stroke-[2]", isActive && "fill-current")} />
                  </button>
                );
              })}
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                title="Tooltip Widget Settings"
                onClick={() => setShowWidgetSettings(true)}
                className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF] dark:hover:text-[#0089FF] transition-colors cursor-pointer shrink-0"
              >
                <Settings className="h-4 w-4 stroke-[2.2]" />
              </button>
            </div>
          </div>
        )}

        {/* 2. Scrollable Column of Floating Cards */}
        <div className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden space-y-2 custom-scrollbar py-0.5 pr-1 pointer-events-auto">
          {(isHealthOnly
            ? ["health_score"]
            : cardsOrder.filter((id) => id !== "health_score")
          ).map((cardId) => {
            const isDraggingThis = draggedCardId === cardId;
            const isRefreshingThis = refreshingCardId === cardId;
            const cardWrapperClass = cn(
              "w-full shrink-0 group rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md overflow-hidden text-xs transition-all relative",
              isDraggingThis && "opacity-50 border-dashed border-[#0089FF]"
            );

            const dragProps = {
              draggable: true,
              onDragStart: (e: React.DragEvent) => handleDragStart(e, cardId),
              onDragOver: handleDragOver,
              onDrop: (e: React.DragEvent) => handleDrop(e, cardId),
            };

            switch (cardId) {
              case "health_score":
                return (
                  <div key={cardId} {...dragProps} className={cardWrapperClass}>
                    {/* 1. Header Row (Figma: 218px x 39px, padding 8px 10px) */}
                    <div className="flex h-[39px] items-center justify-between px-[10px] py-[8px] bg-white dark:bg-slate-900 border-b border-[#F1F5F9] dark:border-slate-800">
                      <div className="flex items-center gap-[6px] min-w-0">
                        <ShieldCheck className="h-4 w-4 text-[#0089FF] stroke-[1.8] shrink-0" />
                        <h3 className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 tracking-[-0.3px] truncate">
                          Health Score Details
                        </h3>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <WidgetActionButton
                          isRefreshing={isRefreshingThis}
                          onClick={() => handleRefreshCard("Health Score Details", cardId)}
                          cardName="Health Score Details"
                        />
                      </div>
                    </div>

                    {/* 2. Category Filter Switcher Pills */}
                    <div className="p-1.5 bg-slate-50 dark:bg-slate-950/50 border-b border-[#F1F5F9] dark:border-slate-800 grid grid-cols-4 gap-1">
                      <button
                        type="button"
                        onClick={() => setActiveHealthCategory("safety")}
                        className={cn(
                          "py-1 px-1 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center transition-all cursor-pointer border select-none",
                          activeHealthCategory === "safety"
                            ? "bg-[#10B981] text-white border-emerald-600 shadow-2xs"
                            : "bg-[#EBF9F0] dark:bg-emerald-950/40 border-emerald-200/60 text-slate-800 dark:text-slate-200 hover:bg-emerald-100/70"
                        )}
                      >
                        <span>Safety</span>
                        <span className="font-mono text-[11px] font-extrabold" style={{ color: activeHealthCategory === "safety" ? "#ffffff" : "#10B981" }}>85</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveHealthCategory("efficiency")}
                        className={cn(
                          "py-1 px-1 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center transition-all cursor-pointer border select-none",
                          activeHealthCategory === "efficiency"
                            ? "bg-[#D97706] text-white border-amber-600 shadow-2xs"
                            : "bg-[#FFFBEB] dark:bg-amber-950/40 border-amber-200/60 text-slate-800 dark:text-slate-200 hover:bg-amber-100/70"
                        )}
                      >
                        <span>Effic.</span>
                        <span className="font-mono text-[11px] font-extrabold" style={{ color: activeHealthCategory === "efficiency" ? "#ffffff" : "#D97706" }}>72</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveHealthCategory("risk")}
                        className={cn(
                          "py-1 px-1 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center transition-all cursor-pointer border select-none",
                          activeHealthCategory === "risk"
                            ? "bg-[#EF4444] text-white border-rose-600 shadow-2xs"
                            : "bg-[#FEF2F2] dark:bg-rose-950/40 border-rose-200/60 text-slate-800 dark:text-slate-200 hover:bg-rose-100/70"
                        )}
                      >
                        <span>Risk</span>
                        <span className="font-mono text-[11px] font-extrabold" style={{ color: activeHealthCategory === "risk" ? "#ffffff" : "#EF4444" }}>15</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveHealthCategory("discipline")}
                        className={cn(
                          "py-1 px-1 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center transition-all cursor-pointer border select-none",
                          activeHealthCategory === "discipline"
                            ? "bg-[#0089FF] text-white border-sky-600 shadow-2xs"
                            : "bg-[#F0F9FF] dark:bg-sky-950/40 border-sky-200/60 text-slate-800 dark:text-slate-200 hover:bg-sky-100/70"
                        )}
                      >
                        <span>Discip.</span>
                        <span className="font-mono text-[11px] font-extrabold" style={{ color: activeHealthCategory === "discipline" ? "#ffffff" : "#0089FF" }}>98</span>
                      </button>
                    </div>

                    {/* 3. Details Content Section (Matching reference images 1 to 5) */}
                    <div className="p-2 space-y-2">
                      {/* Top Header Card */}
                      {activeHealthCategory === "safety" && (
                        <div className="px-2.5 py-2 rounded-xl border border-[#10B981] bg-[#EBF9F0] dark:bg-emerald-950/40 flex items-center justify-between shadow-2xs">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-[#065F46] dark:text-emerald-300">
                            <ShieldCheck className="h-4 w-4 text-[#10B981] stroke-[2.5]" />
                            <span>Safety Score</span>
                          </div>
                          <span className="text-base font-extrabold font-mono text-[#10B981]">85</span>
                        </div>
                      )}

                      {activeHealthCategory === "efficiency" && (
                        <div className="px-2.5 py-2 rounded-xl border border-[#D97706] bg-[#FFFBEB] dark:bg-amber-950/40 flex items-center justify-between shadow-2xs">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-[#92400E] dark:text-amber-300">
                            <Timer className="h-4 w-4 text-[#D97706] stroke-[2.2]" />
                            <span>Efficiency Score</span>
                          </div>
                          <span className="text-base font-extrabold font-mono text-[#D97706]">72</span>
                        </div>
                      )}

                      {activeHealthCategory === "risk" && (
                        <div className="px-2.5 py-2 rounded-xl border border-[#EF4444] bg-[#FEF2F2] dark:bg-rose-950/40 flex items-center justify-between shadow-2xs">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-[#991B1B] dark:text-rose-300">
                            <AlertTriangle className="h-4 w-4 text-[#EF4444] stroke-[2.2]" />
                            <span>Risk Score</span>
                          </div>
                          <span className="text-base font-extrabold font-mono text-[#EF4444]">15</span>
                        </div>
                      )}

                      {activeHealthCategory === "discipline" && (
                        <div className="px-2.5 py-2 rounded-xl border border-[#0089FF] bg-[#F0F9FF] dark:bg-sky-950/40 flex items-center justify-between shadow-2xs">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-[#075985] dark:text-sky-300">
                            <ThumbsUp className="h-4 w-4 text-[#0089FF] fill-current" />
                            <span>Discipline Score</span>
                          </div>
                          <span className="text-base font-extrabold font-mono text-[#0089FF]">98</span>
                        </div>
                      )}

                      {/* Distance Driven & Confidence Level Row Cards */}
                      {activeHealthCategory !== "efficiency" && (
                        <div className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                            <Activity className="h-3.5 w-3.5 text-[#0089FF] stroke-[2]" />
                            <span>Confidence Level</span>
                          </div>
                          <span className={cn(
                            "font-bold font-mono text-[11px]",
                            activeHealthCategory === "risk" ? "text-[#10B981]" :
                            activeHealthCategory === "efficiency" ? "text-[#D97706]" :
                            "text-[#EF4444]"
                          )}>
                            {activeHealthCategory === "risk" ? "75% (High)" : activeHealthCategory === "efficiency" ? "74% (Medium)" : "39% (Low)"}
                          </span>
                        </div>
                      )}

                      <div className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                          <MapPin className="h-3.5 w-3.5 text-[#0089FF] stroke-[2]" />
                          <span>Distance Driven</span>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 font-sans text-[11px]">
                          1250 km
                        </span>
                      </div>

                      {activeHealthCategory === "efficiency" && (
                        <div className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                            <Activity className="h-3.5 w-3.5 text-[#0089FF] stroke-[2]" />
                            <span>Confidence Level</span>
                          </div>
                          <span className="font-bold font-mono text-[11px] text-[#D97706]">
                            74% (Medium)
                          </span>
                        </div>
                      )}

                      {/* Events Table */}
                      <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 overflow-hidden text-[10.5px]">
                        {/* Header */}
                        <div className="grid grid-cols-[1fr_auto_auto] gap-3 bg-slate-100/90 dark:bg-slate-800/90 px-2 py-1 font-bold text-slate-600 dark:text-slate-300 border-b border-slate-200/90 dark:border-slate-800">
                          <span>Events</span>
                          <span className="text-center whitespace-nowrap min-w-[65px]">Current</span>
                          <span className="text-right whitespace-nowrap min-w-[55px]">Average</span>
                        </div>

                        {/* Body Rows */}
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                          {activeHealthCategory === "safety" && [
                            { name: "Speed", cur: "12/100 mi", avg: "8/100 mi", curAlert: true },
                            { name: "Harsh Acceleration", cur: "3/100 mi", avg: "6/100 mi" },
                            { name: "Harsh Braking", cur: "3/100 mi", avg: "6/100 mi" },
                            { name: "DMS Events", cur: "2/100 mi", avg: "2/100 mi" },
                            { name: "ADAS Events", cur: "1/100 mi", avg: "1/100 mi" },
                          ].map((r, idx) => (
                            <div key={idx} className="grid grid-cols-[1fr_auto_auto] gap-3 px-2 py-1 text-slate-700 dark:text-slate-300 items-center">
                              <span className="truncate font-medium">{r.name}</span>
                              <span className={cn("text-center font-mono font-semibold whitespace-nowrap min-w-[65px]", r.curAlert ? "text-[#EF4444]" : "text-slate-800 dark:text-slate-200")}>{r.cur}</span>
                              <span className="text-right font-mono text-slate-400 whitespace-nowrap min-w-[55px]">{r.avg}</span>
                            </div>
                          ))}

                          {activeHealthCategory === "efficiency" && [
                            { name: "Idling", cur: "4%", avg: "8%", curAlert: true },
                          ].map((r, idx) => (
                            <div key={idx} className="grid grid-cols-[1fr_auto_auto] gap-3 px-2 py-1 text-slate-700 dark:text-slate-300 items-center">
                              <span className="truncate font-medium">{r.name}</span>
                              <span className={cn("text-center font-mono font-semibold whitespace-nowrap min-w-[65px]", r.curAlert ? "text-[#EF4444]" : "text-slate-800 dark:text-slate-200")}>{r.cur}</span>
                              <span className="text-right font-mono text-slate-400 whitespace-nowrap min-w-[55px]">{r.avg}</span>
                            </div>
                          ))}

                          {activeHealthCategory === "risk" && [
                            { name: "Collision", cur: "4/100 km", avg: "84/100 km" },
                            { name: "Forward Collision Warning", cur: "4/100 km", avg: "84/100 km" },
                            { name: "Fatigue", cur: "4/100 km", avg: "84/100 km" },
                            { name: "Eye Closed", cur: "4/100 km", avg: "84/100 km" },
                            { name: "Fuel Drop", cur: "4/100 km", avg: "84/100 km" },
                            { name: "Lane Departure", cur: "4/100 km", avg: "84/100 km" },
                            { name: "HMW", cur: "4/100 km", avg: "84/100 km" },
                            { name: "Seatbelt", cur: "4/100 km", avg: "84/100 km" },
                            { name: "Phone", cur: "4/100 km", avg: "84/100 km" },
                            { name: "Device Inactive", cur: "4 %", avg: "8 %" },
                          ].map((r, idx) => (
                            <div key={idx} className="grid grid-cols-[1fr_auto_auto] gap-3 px-2 py-1 text-slate-700 dark:text-slate-300 items-center">
                              <span className="truncate font-medium">{r.name}</span>
                              <span className="text-center font-mono font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap min-w-[65px]">{r.cur}</span>
                              <span className="text-right font-mono text-slate-400 whitespace-nowrap min-w-[55px]">{r.avg}</span>
                            </div>
                          ))}

                          {activeHealthCategory === "discipline" && [
                            { name: "Route Deviation", cur: "4 %", avg: "80 %" },
                            { name: "Late Start", cur: "4 min", avg: "80 min" },
                            { name: "Unauthorized Stop", cur: "4 %", avg: "80 %" },
                            { name: "Late End", cur: "4 min", avg: "80 min" },
                            { name: "Off-Hour Movement", cur: "4 %", avg: "80 %" },
                            { name: "Stay Away Zone", cur: "4 %", avg: "80 %" },
                            { name: "Risk zone", cur: "4 %", avg: "80 %" },
                            { name: "Stop Rate", cur: "4 %", avg: "80 %" },
                            { name: "Running Rate", cur: "4 %", avg: "80 %" },
                            { name: "Late Work Start", cur: "4 min", avg: "80 min" },
                          ].map((r, idx) => (
                            <div key={idx} className="grid grid-cols-[1fr_auto_auto] gap-3 px-2 py-1 text-slate-700 dark:text-slate-300 items-center">
                              <span className="truncate font-medium">{r.name}</span>
                              <span className="text-center font-mono font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap min-w-[65px]">{r.cur}</span>
                              <span className="text-right font-mono text-slate-400 whitespace-nowrap min-w-[55px]">{r.avg}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer Calculation Note */}
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 pt-0.5">
                        <Clock className="h-3 w-3 stroke-[2] shrink-0" />
                        <span>Score calculation runs every 30 minutes</span>
                      </div>
                    </div>
                  </div>
                );

              case "vehicle_main":
                return (
                  <div key={cardId} {...dragProps} className={cardWrapperClass}>
                    {/* 1. Header Row (Figma: 218px x 39px, padding 8px 10px) */}
                    <div className="flex h-[39px] items-center justify-between px-[10px] py-[8px] bg-white dark:bg-slate-900 border-b border-[#F1F5F9] dark:border-slate-800">
                      <div className="flex items-center gap-[6px] min-w-0">
                        <Truck className="h-4 w-4 text-[#1D293D] dark:text-slate-200 stroke-[1.8] shrink-0" />
                        <h3 className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 tracking-[-0.3px] truncate">
                          {vehicle.name || "Fuel - 1001"}
                        </h3>
                      </div>
                      <div className="flex items-center gap-[2px] shrink-0">
                        <button
                          type="button"
                          onClick={() => toast.info(`Vehicle Specs: ${vehicle.name} (${vehicle.imei || "IMEI 8610760861"})`)}
                          className="w-[22px] h-[22px] p-1 flex items-center justify-center rounded-full text-[#62748E] hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Vehicle Info"
                        >
                          <Info className="h-[14px] w-[14px] stroke-[1.8]" />
                        </button>
                        <WidgetActionButton
                          isRefreshing={isRefreshingThis}
                          onClick={() => handleRefreshCard(vehicle.name || "Vehicle Card", cardId)}
                          cardName={vehicle.name || "Vehicle Card"}
                        />
                      </div>
                    </div>

                    {/* 2. Grey Banner Section */}
                    <div className="bg-[#FAFAFA] dark:bg-slate-800/60 border-b border-[#F1F5F9] dark:border-slate-800 pl-0 pr-3 py-2 flex items-center justify-between h-[114px] min-h-[114px] overflow-hidden">
                      {/* Left: Prominent Large Vehicle Image (Scaled up & pushed left to eliminate transparent image margins) */}
                      <div className="w-[134px] h-[104px] relative overflow-hidden isolate shrink-0 pointer-events-none -ml-2.5">
                        <img
                          src="/yellow_dump_truck.png"
                          alt="Vehicle Preview"
                          className="absolute w-[245px] max-w-none h-[162px] -left-[40px] -top-[24px] object-contain filter drop-shadow-[0px_2px_6px_rgba(0,0,0,0.12)]"
                        />
                      </div>

                      {/* Right: Duration & Status Badge (Right aligned with exact spacing from right card border) */}
                      <div className="w-[76px] flex flex-col items-end justify-center gap-2 shrink-0">
                        <span className="w-full font-bold text-[#1D293D] dark:text-slate-100 text-[13px] leading-[17px] tracking-[-0.3px] font-sans whitespace-nowrap text-right">
                          {formatDuration(vehicle.duration)}
                        </span>
                        <div className="w-[71px] h-[22px] px-3 py-1 bg-[#22C55E] rounded-[6px] shadow-[0px_1px_2px_rgba(0,0,0,0.08)] flex items-center justify-center">
                          <span className="font-bold text-white text-[11.5px] leading-[12px] font-sans whitespace-nowrap">
                            {STATUS_META[vehicle.status]?.label || "Running"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 3. Main Data Content Area (Figma: padding 8px 12px) */}
                    <div className="px-[12px] py-[8px] space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Current Trip</span>
                        <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 text-right leading-[16px] truncate">
                          {vehicle.currentTrip ?? "331.4"}{" "}
                          <span className="font-normal text-[#45556C] text-[11px]">km</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Work Hour</span>
                        <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 text-right leading-[16px] truncate">
                          {vehicle.workHour || "11:26"}{" "}
                          <span className="font-normal text-[#45556C] text-[11px]">hrs</span>
                        </span>
                      </div>

                      {isEnabled("odometer") && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Odometer</span>
                          <div className="bg-[#F4F5F7] dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-[6px] px-[6px] py-[2px] h-[21px] shadow-[0px_1px_0px_rgba(0,0,0,0.05)] flex items-center divide-x divide-slate-200/90 dark:divide-slate-700 shrink-0">
                            {odoDigits.map((digit, i) => (
                              <span
                                key={i}
                                className={cn(
                                  "px-1 text-[11px] font-semibold text-[#1D293D] dark:text-slate-200 font-sans leading-[15px]",
                                  digit === "0" && i < 2 && "italic text-[#62748E]",
                                )}
                              >
                                {digit}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {isEnabled("driver") && (
                        <>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Driver</span>
                            <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 text-right leading-[16px] truncate">
                              {vehicle.driver || "Wamela (Jambouleano)"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Mobile</span>
                            <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 text-right font-sans leading-[16px] truncate">
                              {vehicle.driverPhone || "+62 812 3456 7890"}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* 4. Action Toolbar Row (Figma: 218px x 34px, padding 0px 8px, background #F4F5F7) */}
                    <div className="bg-[#F4F5F7] dark:bg-slate-800/60 border-t border-slate-200/80 dark:border-slate-800 px-[8px] h-[34px] flex items-center justify-around text-[#45556C] dark:text-slate-400 rounded-b-[10px]">
                      <button
                        type="button"
                        title="Follow"
                        onClick={() => toast.success(`Following ${vehicle.name} live on map`)}
                        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:shadow-2xs transition-all cursor-pointer"
                      >
                        <Target className="h-4 w-4 stroke-[1.8]" />
                      </button>

                      <button
                        type="button"
                        title="Navigate"
                        onClick={() => toast.info(`Navigating to ${vehicle.name}`)}
                        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:shadow-2xs transition-all cursor-pointer"
                      >
                        <Navigation className="h-4 w-4 stroke-[1.8]" />
                      </button>

                      <button
                        type="button"
                        title="Share"
                        onClick={handleShare}
                        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:shadow-2xs transition-all cursor-pointer"
                      >
                        <Share2 className="h-4 w-4 stroke-[1.8]" />
                      </button>

                      <button
                        type="button"
                        title="Find Near By"
                        onClick={() => toast.info(`Searching points of interest near ${vehicle.name}`)}
                        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:shadow-2xs transition-all cursor-pointer"
                      >
                        <MapPin className="h-4 w-4 stroke-[1.8]" />
                      </button>

                      <button
                        type="button"
                        title="Change Mode"
                        onClick={() => toast.info(`Changing display mode for ${vehicle.name}`)}
                        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:shadow-2xs transition-all cursor-pointer"
                      >
                        <SlidersHorizontal className="h-4 w-4 stroke-[1.8]" />
                      </button>
                    </div>
                  </div>
                );

              case "driver_info":
                return (
                  <div key={cardId} {...dragProps} className={cardWrapperClass}>
                    {/* 1. Header Row (Figma: 218px x 39px, padding 8px 10px) */}
                    <div className="flex h-[39px] items-center justify-between px-[10px] py-[8px] bg-white dark:bg-slate-900 border-b border-[#F1F5F9] dark:border-slate-800">
                      <div className="flex items-center gap-[6px] min-w-0">
                        <User className="h-4 w-4 text-[#1D293D] dark:text-slate-200 stroke-[1.8] shrink-0" />
                        <h3 className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 tracking-[-0.3px] truncate">
                          Driver Information
                        </h3>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <WidgetActionButton
                          isRefreshing={isRefreshingThis}
                          onClick={() => handleRefreshCard("Driver Information", cardId)}
                          cardName="Driver Information"
                        />
                      </div>
                    </div>

                    {/* 2. Main Data Content Area (Theme Key-Value Rows) */}
                    <div className="px-[12px] py-[8px] space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Driver Number</span>
                        <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 text-right leading-[16px] truncate font-sans">
                          21
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Age</span>
                        <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 text-right leading-[16px] truncate font-sans">
                          34
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Driving Experience</span>
                        <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 text-right leading-[16px] truncate font-sans">
                          2
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">License Available</span>
                        <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 text-right leading-[16px] truncate">
                          Yes
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">License To Drive</span>
                        <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 text-right leading-[16px] truncate">
                          Yes
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">License Expiry</span>
                        <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 text-right leading-[16px] truncate font-sans">
                          2032
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Life Ins. Expiry</span>
                        <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 text-right leading-[16px] truncate font-sans">
                          2035
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Mediclaim Expiry</span>
                        <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 text-right leading-[16px] truncate">
                          NA
                        </span>
                      </div>
                    </div>

                    {/* 3. Action Toolbar Footer Row (#F4F5F7) */}
                    <div className="bg-[#F4F5F7] dark:bg-slate-800/60 border-t border-slate-200/80 dark:border-slate-800 px-[8px] h-[34px] flex items-center justify-center rounded-b-[10px]">
                      <button
                        type="button"
                        onClick={() => toast.info("Edit Driver Information modal opened")}
                        className="w-full h-[26px] rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1.5 font-semibold text-xs text-[#0089FF]"
                      >
                        <SquarePen className="h-3.5 w-3.5 stroke-[1.8]" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                );

              case "documents":
                return (
                  <div key={cardId} {...dragProps} className={cardWrapperClass}>
                    {/* 1. Header Row (Figma: 218px x 39px, padding 8px 10px) */}
                    <div className="flex h-[39px] items-center justify-between px-[10px] py-[8px] bg-white dark:bg-slate-900 border-b border-[#F1F5F9] dark:border-slate-800">
                      <div className="flex items-center gap-[6px] min-w-0">
                        <FileText className="h-4 w-4 text-[#1D293D] dark:text-slate-200 stroke-[1.8] shrink-0" />
                        <h3 className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 tracking-[-0.3px] truncate">
                          Documents
                        </h3>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <WidgetActionButton
                          isRefreshing={isRefreshingThis}
                          onClick={() => handleRefreshCard("Documents", cardId)}
                          cardName="Documents"
                        />
                      </div>
                    </div>

                    {/* 2. Main Data Content Area (PDF Badges & File details) */}
                    <div className="px-[12px] py-[8px] space-y-2">
                      {/* Document Item 1: Insurance */}
                      <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-[#FAFAFA] dark:bg-slate-800/40 border border-[#F1F5F9] dark:border-slate-800">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Red PDF Icon Badge */}
                          <div className="w-8 h-9 rounded bg-[#EF4444] text-white flex flex-col items-center justify-center shrink-0 shadow-2xs font-bold leading-none">
                            <FileText className="h-3.5 w-3.5 stroke-[2]" />
                            <span className="text-[7.5px] uppercase tracking-tighter mt-0.5 font-sans">PDF</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 leading-[16px] truncate">
                              Insurance
                            </h4>
                            <p className="text-[11px] font-normal text-[#62748E] dark:text-slate-400 font-sans leading-[14px]">
                              Exp. 11/11/2027
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toast.success("Downloading Insurance document...")}
                          className="p-1 rounded text-slate-400 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                          title="Download document"
                        >
                          <Download className="h-3.5 w-3.5 stroke-[1.8]" />
                        </button>
                      </div>

                      {/* Document Item 2: Permit & Fitness */}
                      <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-[#FAFAFA] dark:bg-slate-800/40 border border-[#F1F5F9] dark:border-slate-800">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Red PDF Icon Badge */}
                          <div className="w-8 h-9 rounded bg-[#EF4444] text-white flex flex-col items-center justify-center shrink-0 shadow-2xs font-bold leading-none">
                            <FileText className="h-3.5 w-3.5 stroke-[2]" />
                            <span className="text-[7.5px] uppercase tracking-tighter mt-0.5 font-sans">PDF</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 leading-[16px] truncate">
                              Permit & Fitness
                            </h4>
                            <p className="text-[11px] font-normal text-[#62748E] dark:text-slate-400 font-sans leading-[14px]">
                              Exp. 24/05/2028
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toast.success("Downloading Permit document...")}
                          className="p-1 rounded text-slate-400 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                          title="Download document"
                        >
                          <Download className="h-3.5 w-3.5 stroke-[1.8]" />
                        </button>
                      </div>
                    </div>

                    {/* 3. Action Toolbar Footer Row (#F4F5F7) */}
                    <div className="bg-[#F4F5F7] dark:bg-slate-800/60 border-t border-slate-200/80 dark:border-slate-800 px-[8px] h-[34px] flex items-center justify-center rounded-b-[10px]">
                      <button
                        type="button"
                        onClick={() => toast.info("Upload Document modal opened")}
                        className="w-full h-[26px] rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1.5 font-bold text-xs"
                      >
                        <Plus className="h-4 w-4 stroke-[1.8]" />
                        <span>Documents</span>
                      </button>
                    </div>
                  </div>
                );

              case "today_activity":
                if (
                  !isEnabled("distance") &&
                  !isEnabled("running") &&
                  !isEnabled("stop") &&
                  !isEnabled("inactive") &&
                  !isEnabled("idle") &&
                  !isEnabled("working_start") &&
                  !isEnabled("last_stop")
                )
                  return null;

                return (
                  <div key={cardId} {...dragProps} className={cardWrapperClass}>
                    {/* 1. Header Row (Figma: 218px x 39px, padding 8px 10px) */}
                    <div className="flex h-[39px] items-center justify-between px-[10px] py-[8px] bg-white dark:bg-slate-900 border-b border-[#F1F5F9] dark:border-slate-800">
                      <div className="flex items-center gap-[6px] min-w-0">
                        <Compass className="h-4 w-4 text-[#1D293D] dark:text-slate-200 stroke-[1.8] shrink-0" />
                        <h3 className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 tracking-[-0.3px] truncate">
                          Today's Activity
                        </h3>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <WidgetActionButton
                          isRefreshing={isRefreshingThis}
                          onClick={() => handleRefreshCard("Today's Activity", cardId)}
                          cardName="Today's Activity"
                        />
                      </div>
                    </div>

                    {/* 2. Distance Route Graphic Section */}
                    {isEnabled("distance") && (
                      <div className="px-3 py-1.5">
                        <div className="relative flex items-center justify-between my-1">
                          <div className="absolute inset-x-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t-2 border-dashed border-slate-300 dark:border-slate-700" />
                          </div>

                          <div className="relative z-10 h-3.5 w-3.5 rounded-full bg-[#22AD00] flex items-center justify-center ring-3 ring-emerald-100 dark:ring-emerald-950/70 shrink-0">
                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                          </div>

                          <div className="relative z-10 bg-white dark:bg-slate-900 px-2 flex items-baseline gap-1">
                            <span className="text-[13px] font-semibold text-[#0F172B] dark:text-slate-100 tracking-tight font-sans">
                              {vehicle.currentTrip ?? "331.4"}
                            </span>
                            <span className="text-[11px] font-normal text-[#45556C]">km</span>
                          </div>

                          <div className="relative z-10 h-6 w-6 rounded-full bg-[#E0F2FE] dark:bg-blue-950 flex items-center justify-center text-[#0089FF] shrink-0 shadow-2xs">
                            <Truck className="h-3 w-3 stroke-[2]" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3. Status Time Breakdown Rows */}
                    <div className="px-[12px] py-[8px] space-y-1.5">
                      {isEnabled("running") && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Running</span>
                          <span className="text-[12px] font-semibold text-[#16A34A] dark:text-emerald-400 text-right leading-[16px] truncate">
                            {(vehicle.runningTime || "09:16").replace(/\s*hrs$/i, "").trim()}{" "}
                            <span className="font-normal text-[11px]">hrs</span>
                          </span>
                        </div>
                      )}

                      {isEnabled("stop") && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Stop</span>
                          <span className="text-[12px] font-semibold text-[#DC2626] dark:text-rose-400 text-right leading-[16px] truncate">
                            {(vehicle.stopTime || "01:30").replace(/\s*hrs$/i, "").trim()}{" "}
                            <span className="font-normal text-[11px]">hrs</span>
                          </span>
                        </div>
                      )}

                      {isEnabled("idle") && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Idle</span>
                          <span className="text-[12px] font-semibold text-[#D97706] dark:text-amber-400 text-right leading-[16px] truncate">
                            {(vehicle.idleTime || "09:16").replace(/\s*hrs$/i, "").trim()}{" "}
                            <span className="font-normal text-[11px]">hrs</span>
                          </span>
                        </div>
                      )}

                      {isEnabled("inactive") && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Inactive</span>
                          <span className="text-[12px] font-semibold text-[#2563EB] dark:text-blue-400 text-right leading-[16px] truncate">
                            {(vehicle.inactiveTime || "01:30").replace(/\s*hrs$/i, "").trim()}{" "}
                            <span className="font-normal text-[11px]">hrs</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 4. Journey Log Section (Timeline) */}
                    {(isEnabled("working_start") || isEnabled("last_stop")) && (
                      <div className="px-[12px] pt-2 pb-2 border-t border-[#F1F5F9] dark:border-slate-800 space-y-1.5">
                        <h4 className="text-[11px] font-semibold text-[#0F172B] dark:text-slate-200 leading-[15px]">
                          Journey Log
                        </h4>

                        <div className="relative pl-5 space-y-2">
                          <div className="absolute left-[5px] top-2 bottom-2 w-0 border-l-2 border-dashed border-slate-300 dark:border-slate-700" />

                          {isEnabled("working_start") && (
                            <div className="relative">
                              <div className="absolute -left-[19px] top-0.5 h-3 w-3 rounded-full bg-[#22AD00] ring-3 ring-emerald-100 dark:ring-emerald-950/70" />
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-semibold text-[#0F172B] dark:text-slate-100">Start</span>
                                <span className="bg-[#E6F4EA] dark:bg-emerald-950/60 text-[#16A34A] dark:text-emerald-400 px-1.5 py-0.5 rounded-md text-[10.5px] font-bold font-sans">
                                  {vehicle.workingStart || "12:00 AM"}
                                </span>
                              </div>
                              <p className="text-[10.5px] font-normal text-[#62748E] dark:text-slate-400 leading-tight mt-0.5">
                                Talodo, Southeast Sulawesi, Indonesia (SW)
                              </p>
                            </div>
                          )}

                          {isEnabled("last_stop") && (
                            <div className="relative">
                              <div className="absolute -left-[19px] top-0.5 h-3 w-3 rounded-full bg-[#DC2626] ring-3 ring-rose-100 dark:ring-rose-950/70" />
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-semibold text-[#0F172B] dark:text-slate-100">Last Stop</span>
                                <span className="bg-[#FEE2E2] dark:bg-rose-950/60 text-[#DC2626] dark:text-rose-400 px-1.5 py-0.5 rounded-md text-[10.5px] font-bold font-sans">
                                  03:34 PM
                                </span>
                              </div>
                              <p className="text-[10.5px] font-normal text-[#62748E] dark:text-slate-400 leading-tight mt-0.5">
                                3.22km from Tongampadaaha, Southeast Sulawesi, Indonesia (SW)
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 5. Bottom Action CTA Bar (#F4F5F7) */}
                    <div className="bg-[#F4F5F7] dark:bg-slate-800/60 border-t border-slate-200/80 dark:border-slate-800 px-1.5 h-[34px] flex items-center justify-center rounded-b-xl">
                      <button
                        type="button"
                        onClick={() => toast.info("Opening full trip activity log")}
                        className="w-full h-[26px] rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2 font-bold text-xs"
                      >
                        <FileText className="h-4 w-4 stroke-[1.8]" />
                        <span>Show Log</span>
                      </button>
                    </div>
                  </div>
                );

              case "location":
                return (
                  <div key={cardId} {...dragProps} className={cardWrapperClass}>
                    {/* 1. Header Row (Figma: 218px x 39px, padding 8px 10px) */}
                    <div className="flex h-[39px] items-center justify-between px-[10px] py-[8px] bg-white dark:bg-slate-900 border-b border-[#F1F5F9] dark:border-slate-800">
                      <div className="flex items-center gap-[6px] min-w-0">
                        <MapPin className="h-4 w-4 text-[#1D293D] dark:text-slate-200 stroke-[1.8] shrink-0" />
                        <h3 className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 tracking-[-0.3px] truncate">
                          Location
                        </h3>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <WidgetActionButton
                          isRefreshing={isRefreshingThis}
                          onClick={() => handleRefreshCard("Location", cardId)}
                          cardName="Location"
                        />
                      </div>
                    </div>

                    {/* 2. Main Data Content Area (Figma: padding 8px 12px) */}
                    <div className="px-[12px] py-[8px] space-y-2">
                      {/* Address & Coordinates Combined Block */}
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 leading-[16px] text-left select-text">
                            {vehicle.address || "Towamelewe, Southeast Sulawesi, Indonesia (NE)"}
                          </p>
                          <p className="text-[11px] font-normal text-[#62748E] dark:text-slate-400 leading-[15px] font-sans select-text text-left">
                            ({vehicle.lat && vehicle.lng ? `${vehicle.lat.toFixed(6)}, ${vehicle.lng.toFixed(6)}` : "-3.970000, 122.580000"})
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const addr = vehicle.address || "Towamelewe, Southeast Sulawesi, Indonesia (NE)";
                            const coords = vehicle.lat && vehicle.lng ? `${vehicle.lat.toFixed(6)}, ${vehicle.lng.toFixed(6)}` : "-3.970000, 122.580000";
                            navigator.clipboard.writeText(`${addr} (${coords})`);
                            toast.success("Location & coordinates copied to clipboard!");
                          }}
                          className="p-1 rounded text-slate-400 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 mt-0.5"
                          title="Copy location and coordinates"
                        >
                          <Copy className="h-3.5 w-3.5 stroke-[1.8]" />
                        </button>
                      </div>

                      {/* Geofence Row */}
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                        <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Geofence</span>
                        <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 text-right leading-[16px] truncate">
                          HP Geofence 17
                        </span>
                      </div>
                    </div>

                    {/* 3. Action Toolbar Footer Row (Identical to vehicle_main action bar) */}
                    <div className="bg-[#F4F5F7] dark:bg-slate-800/60 border-t border-slate-200/80 dark:border-slate-800 px-[8px] h-[34px] flex items-center justify-around text-[#45556C] dark:text-slate-400 rounded-b-[10px]">
                      <button
                        type="button"
                        title="Add POI"
                        onClick={() => toast.success("POI creation tool opened")}
                        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:shadow-2xs transition-all cursor-pointer"
                      >
                        <MapPinPlus className="h-4 w-4 stroke-[1.8]" />
                      </button>

                      <button
                        type="button"
                        title="Add Geofence"
                        onClick={() => toast.success("Geofence creation tool opened")}
                        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:shadow-2xs transition-all cursor-pointer"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-[1.8] fill-none stroke-current" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" strokeDasharray="2.5 2" />
                          <path d="M12 9v6M9 12h6" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        title="Download KML"
                        onClick={() => toast.success("Downloading Location KML file...")}
                        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:shadow-2xs transition-all cursor-pointer"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-[1.8] fill-none stroke-current" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18l-6 3V6l6-3 6 3 6-3v7.5" />
                          <path d="M9 3v15" />
                          <path d="M15 6v6.5" />
                          <path d="M19 13v7M16 17l3 3 3-3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );

              case "fuel":
                if (
                  !isEnabled("fuel_level") &&
                  !isEnabled("refill_and_drain") &&
                  !isEnabled("tank_capacity") &&
                  !isEnabled("number_of_tank")
                )
                  return null;

                return (
                  <div key={cardId} {...dragProps} className={cardWrapperClass}>
                    {/* 1. Header Row (Figma: 218px x 39px, padding 8px 10px) */}
                    <div className="flex h-[39px] items-center justify-between px-[10px] py-[8px] bg-white dark:bg-slate-900 border-b border-[#F1F5F9] dark:border-slate-800">
                      <div className="flex items-center gap-[6px] min-w-0">
                        <Droplet className="h-4 w-4 text-[#1D293D] dark:text-slate-200 stroke-[1.8] shrink-0" />
                        <h3 className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 tracking-[-0.3px] truncate">
                          Fuel
                        </h3>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <WidgetActionButton
                          isRefreshing={isRefreshingThis}
                          onClick={() => handleRefreshCard("Fuel Widget", cardId)}
                          cardName="Fuel Widget"
                        />
                      </div>
                    </div>

                    <div>
                      <div>
                        {/* 2. Fuel Sensor Icon-Only Scrollable Tabs Strip */}
                        <div className="mx-2 my-1.5 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth text-xs select-none">
                          <button
                            type="button"
                            onClick={() => setSelectedTank(0)}
                            className={cn(
                              "py-1 px-2 rounded-lg font-semibold text-[11px] flex items-center gap-1 transition-all cursor-pointer shrink-0 whitespace-nowrap",
                              selectedTank === 0
                                ? "bg-[#0089FF] text-white shadow-2xs font-bold"
                                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200/60 dark:border-slate-800"
                            )}
                          >
                            <Truck className="h-3.5 w-3.5 stroke-[2] shrink-0" />
                            <span>All</span>
                          </button>

                          {Array.from({ length: 12 }, (_, i) => i + 1).map((sNum) => {
                            const isSelected = selectedTank === sNum;
                            return (
                              <button
                                key={sNum}
                                type="button"
                                title={`Fuel Sensor ${sNum}`}
                                onClick={() => setSelectedTank(sNum)}
                                className={cn(
                                  "p-1.5 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95",
                                  isSelected
                                    ? "bg-[#0089FF] text-white shadow-2xs font-bold ring-1 ring-sky-300 dark:ring-sky-800"
                                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200/60 dark:border-slate-800"
                                )}
                              >
                                <Radio className="h-3.5 w-3.5 stroke-[2] shrink-0" />
                              </button>
                            );
                          })}
                        </div>

                        {/* 3. Ultra-Sharp High-Tech Vertical Fuel Gauge */}
                        {isEnabled("fuel_level") && (
                          <div className="px-3 py-2 flex items-center justify-between gap-2.5 bg-white dark:bg-slate-900">
                            {/* Left Column: Vertical Bar Meter with F/E Labels, Pump Icon, and Pointer Arrow */}
                            <div className="relative flex items-center gap-1.5 shrink-0">
                              {/* F / E Labels and Fuel Icon */}
                              <div className="flex flex-col justify-between items-center h-[120px] text-xs py-0.5 shrink-0">
                                <span className="font-extrabold text-[#10B981] text-[13px] leading-none">F</span>
                                <div className="p-1 rounded-md bg-sky-100 dark:bg-sky-950/70 text-[#0089FF] shadow-2xs">
                                  <Droplet className="h-3.5 w-3.5 stroke-[2.2] fill-[#0089FF]/20" />
                                </div>
                                <span className="font-extrabold text-[#EF4444] text-[13px] leading-none">E</span>
                              </div>

                              {/* SVG Vertical Meter Bar Stack & Pointer Arrow */}
                              <div className="relative w-[48px] h-[125px] flex items-center justify-center shrink-0">
                                <svg className="w-[48px] h-[125px]" viewBox="0 0 48 125">
                                  {/* Vertical axis guide line */}
                                  <line x1="36" y1="12" x2="36" y2="112" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" className="dark:stroke-slate-700" />

                                  {/* 14 Stacked Tapered Horizontal Bar Ticks (Bottom y=110 to Top y=14) */}
                                  {Array.from({ length: 14 }).map((_, i) => {
                                    const tickPercent = (i / 13) * 100;
                                    const isFilled = fuelPercent >= tickPercent;
                                    const yPos = 110 - (i / 13) * 96;

                                    let fillColor = "#E2E8F0";
                                    if (isFilled) {
                                      if (i < 3) fillColor = "#EF4444";
                                      else if (i < 6) fillColor = "#F59E0B";
                                      else if (i < 10) fillColor = "#0089FF";
                                      else fillColor = "#10B981";
                                    }

                                    const width = 15 + (i / 13) * 12;
                                    const xPos = 32 - width;

                                    return (
                                      <rect
                                        key={i}
                                        x={xPos}
                                        y={yPos}
                                        width={width}
                                        height="4.5"
                                        rx="1.5"
                                        fill={fillColor}
                                        opacity={isFilled ? 1 : 0.4}
                                        className="transition-colors duration-300"
                                      />
                                    );
                                  })}

                                  {/* Pointer Arrow Indicator on Axis Line */}
                                  {(() => {
                                    const arrowY = 112 - (fuelPercent / 100) * 100;
                                    return (
                                      <g transform={`translate(37, ${arrowY})`}>
                                        <polygon points="0,0 7,-4 7,4" fill="#0089FF" />
                                      </g>
                                    );
                                  })()}
                                </svg>
                              </div>
                            </div>

                            {/* Right Column: Key Metrics Readout Card */}
                            <div className="flex-1 flex flex-col justify-center gap-2 border-l border-[#F1F5F9] dark:border-slate-800 pl-3 min-w-0">
                              <div>
                                <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 block leading-tight">
                                  CURRENT LEVEL
                                </span>
                                <div className="flex items-baseline gap-1 mt-0.5">
                                  <span className="text-[13px] font-semibold text-[#0F172B] dark:text-slate-100 font-sans tracking-tight">
                                    300
                                  </span>
                                  <span className="text-[11px] font-normal text-[#45556C]">ltr</span>
                                </div>
                              </div>

                              <div className="pt-2 border-t border-[#F1F5F9] dark:border-slate-800">
                                <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 block leading-tight">
                                  MAX CAPACITY
                                </span>
                                <div className="flex items-baseline gap-1 mt-0.5">
                                  <span className="text-[13px] font-semibold text-[#0F172B] dark:text-slate-100 font-sans tracking-tight">
                                    2000
                                  </span>
                                  <span className="text-[11px] font-normal text-[#45556C]">ltr</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 4. Tanks Summary Section */}
                        <div className="px-[12px] py-[8px] space-y-1.5 border-t border-[#F1F5F9] dark:border-slate-800">
                          {isEnabled("number_of_tank") && (
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-semibold text-[#0089FF]">Tanks</span>
                              <span className="text-[12px] font-semibold text-[#0089FF] font-sans">5</span>
                            </div>
                          )}

                          {isEnabled("refill_and_drain") && (
                            <>
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Refill</span>
                                <div className="flex items-center gap-2 text-right">
                                  <span className="text-[10.5px] italic text-[#62748E]">5 times</span>
                                  <span className="text-[12px] font-semibold text-[#16A34A] dark:text-emerald-400">
                                    50 <span className="font-normal text-[#45556C] text-[11px]">ltr</span>
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Drain</span>
                                <div className="flex items-center gap-2 text-right">
                                  <span className="text-[10.5px] italic text-[#62748E]">2 times</span>
                                  <span className="text-[12px] font-semibold text-[#D97706] dark:text-amber-400">
                                    2 <span className="font-normal text-[#45556C] text-[11px]">ltr</span>
                                  </span>
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* 5. Consumption Section */}
                        <div className="px-[12px] py-[8px] border-t border-[#F1F5F9] dark:border-slate-800 space-y-1.5">
                          <span className="text-[11px] font-semibold text-[#0F172B] dark:text-slate-200 leading-[15px] block">
                            Consumption
                          </span>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Sensor</span>
                              <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 text-right leading-[16px] truncate">
                                2 <span className="font-normal text-[#45556C] text-[11px]">ltr.</span>
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">CAN</span>
                              <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 text-right leading-[16px] truncate">
                                4 <span className="font-normal text-[#45556C] text-[11px]">ltr</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 6. Carbon Emission Section */}
                        <div className="px-[12px] py-[8px] border-t border-[#F1F5F9] dark:border-slate-800 space-y-1.5">
                          <span className="text-[11px] font-semibold text-[#0F172B] dark:text-slate-200 leading-[15px] block">
                            Carbon emission
                          </span>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Sensor</span>
                              <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 text-right leading-[16px] truncate">NA</span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">CAN</span>
                              <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 text-right leading-[16px] truncate">NA</span>
                            </div>
                          </div>
                        </div>

                        {/* 7. Mileage Based On Section */}
                        <div className="px-[12px] py-[8px] border-t border-[#F1F5F9] dark:border-slate-800 space-y-1.5">
                          <span className="text-[11px] font-semibold text-[#0F172B] dark:text-slate-200 leading-[15px] block">
                            Mileage based on
                          </span>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Distance</span>
                              <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 text-right leading-[16px] truncate">
                                2.5 <span className="font-normal text-[#45556C] text-[11px]">km/ltr</span>
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Duration</span>
                              <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 text-right leading-[16px] truncate">
                                2.5 <span className="font-normal text-[#45556C] text-[11px]">ltr/hr</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 8. Waste Section */}
                        <div className="px-[12px] py-[8px] border-t border-[#F1F5F9] dark:border-slate-800 space-y-1.5">
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] font-semibold text-[#0F172B] dark:text-slate-200 leading-[15px]">
                              Waste
                            </span>
                            <Info title="Fuel wasted during idling" className="h-3 w-3 text-[#62748E] cursor-pointer hover:text-[#0F172B]" />
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Pre-defined</span>
                              <span className="text-[12px] font-semibold text-[#DC2626] dark:text-rose-400 text-right leading-[16px] truncate">
                                2.5 <span className="font-normal text-[#45556C] text-[11px]">ltr</span>
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">CAN</span>
                              <span className="text-[12px] font-semibold text-[#DC2626] dark:text-rose-400 text-right leading-[16px] truncate">
                                2.5 <span className="font-normal text-[#45556C] text-[11px]">ltr</span>
                              </span>
                            </div>
                            <p className="text-[10.5px] italic text-[#62748E] dark:text-slate-400 pt-0.5 leading-tight">
                              Due to 1 hr 43min idling
                            </p>
                          </div>
                        </div>

                        {/* 9. Remaining & Updated Footer Section */}
                        <div className="px-[12px] py-[8px] border-t border-[#F1F5F9] dark:border-slate-800 space-y-1 bg-[#F4F5F7]/60 dark:bg-slate-800/30 rounded-b-xl">
                          <div className="flex items-center justify-between gap-2 text-[11px]">
                            <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400">Remaining</span>
                            <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100">
                              06 <span className="font-normal text-[#45556C] text-[11px]">km</span>
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2 text-[11px]">
                            <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0">Updated</span>
                            <span className="text-[11.5px] font-semibold text-[#0F172B] dark:text-slate-100 text-right leading-[16px] truncate font-sans">
                              06-07-2026 10:01 PM
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );

              case "consumption":
                if (!isEnabled("consumption")) return null;

                return (
                  <div key={cardId} {...dragProps} className={cardWrapperClass}>
                    {/* 1. Header Row (Figma: 218px x 39px, padding 8px 10px) */}
                    <div className="flex h-[39px] items-center justify-between px-[10px] py-[8px] bg-white dark:bg-slate-900 border-b border-[#F1F5F9] dark:border-slate-800">
                      <div className="flex items-center gap-[6px] min-w-0">
                        <Droplet className="h-4 w-4 text-[#1D293D] dark:text-slate-200 stroke-[1.8] shrink-0" />
                        <h3 className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 tracking-[-0.3px] truncate">
                          Fuel Consumption
                        </h3>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <WidgetActionButton
                          isRefreshing={isRefreshingThis}
                          onClick={() => handleRefreshCard("Fuel Consumption", cardId)}
                          cardName="Fuel Consumption"
                        />
                      </div>
                    </div>

                    {/* 2. Main Data Content Area (Figma: padding 8px 12px) */}
                    <div className="px-[12px] py-[8px] space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Distance</span>
                        <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 text-right leading-[16px] truncate">
                          10 <span className="font-normal text-[#45556C] text-[11px]">ltr</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Duration</span>
                        <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 text-right leading-[16px] truncate">
                          10 <span className="font-normal text-[#45556C] text-[11px]">ltr</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">CO₂ Emission</span>
                        <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 text-right leading-[16px] truncate">
                          10 <span className="font-normal text-[#45556C] text-[11px]">kg</span>
                        </span>
                      </div>

                      <div className="border-t border-[#F1F5F9] dark:border-slate-800 pt-1.5 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold text-[#0F172B] dark:text-slate-200 shrink-0 leading-[15px]">Waste</span>
                          <span className="text-[12px] font-semibold text-[#DC2626] dark:text-rose-400 text-right leading-[16px] truncate">
                            05 <span className="font-normal text-[#45556C] text-[11px]">ltr</span>
                          </span>
                        </div>
                        <p className="text-[10.5px] italic text-[#62748E] dark:text-slate-400 leading-tight">
                          Due to 2 hrs idling
                        </p>
                      </div>
                    </div>
                  </div>
                );

              case "temperature":
                return (
                  <div key={cardId} {...dragProps} className={cardWrapperClass}>
                    {/* 1. Header Row (Figma: 218px x 39px, padding 8px 10px) */}
                    <div className="flex h-[39px] items-center justify-between px-[10px] py-[8px] bg-white dark:bg-slate-900 border-b border-[#F1F5F9] dark:border-slate-800">
                      <div className="flex items-center gap-[6px] min-w-0">
                        <Thermometer className="h-4 w-4 text-[#1D293D] dark:text-slate-200 stroke-[1.8] shrink-0" />
                        <h3 className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 tracking-[-0.3px] truncate">
                          Temperature & Sensors
                        </h3>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <WidgetActionButton
                          isRefreshing={isRefreshingThis}
                          onClick={() => handleRefreshCard("Temperature & Sensors", cardId)}
                          cardName="Temperature & Sensors"
                        />
                      </div>
                    </div>

                    {/* 2. Main Data Content Area */}
                    <div className="px-[12px] py-[8px] space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Engine Temp</span>
                        <span className="text-[12px] font-semibold text-[#16A34A] dark:text-emerald-400 text-right leading-[16px] truncate">
                          88 <span className="font-normal text-[#45556C] text-[11px]">°C (Normal)</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Chamber Temp</span>
                        <span className="text-[12px] font-semibold text-[#0089FF] dark:text-blue-400 text-right leading-[16px] truncate">
                          18.2 <span className="font-normal text-[#45556C] text-[11px]">°C (Chilled)</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Battery Voltage</span>
                        <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 text-right leading-[16px] truncate">
                          24.2 <span className="font-normal text-[#45556C] text-[11px]">V (Healthy)</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 shrink-0 leading-[15px]">Ignition Status</span>
                        <span className="text-[12px] font-semibold text-[#16A34A] dark:text-emerald-400 text-right leading-[16px] truncate">
                          ON
                        </span>
                      </div>
                    </div>
                  </div>
                );

              default:
                return null;
            }
          })}
        </div>
      </div>

      {/* Tooltip Widget Customization Settings Modal */}
      <TooltipWidgetSettingsModal
        open={showWidgetSettings}
        onClose={() => setShowWidgetSettings(false)}
        enabledWidgets={enabledWidgets}
        onApply={(updated) => setEnabledWidgets(updated)}
      />

      {/* Driver Details Modal (Matching Image 2 Reference 1:1) */}
      {selectedDriverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200 pointer-events-auto">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
            {/* Dark Blue Header Bar matching reference image 2 */}
            <div className="flex items-center justify-between bg-[#1E3A8A] text-white px-4 py-3">
              <h3 className="font-bold text-sm">Details</h3>
              <button
                type="button"
                onClick={() => setSelectedDriverModal(null)}
                className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex gap-4 items-start">
              {/* Left Profile Avatar */}
              <div className="h-24 w-24 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 text-slate-400">
                <User className="h-12 w-12 stroke-[1.5]" />
              </div>

              {/* Right Key-Value Information */}
              <div className="space-y-2 text-xs flex-1 min-w-0">
                <div className="grid grid-cols-[130px_1fr] items-center gap-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">Name :</span>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100 truncate text-xs">
                    {selectedDriverModal.name}
                  </span>
                </div>

                <div className="grid grid-cols-[130px_1fr] items-center gap-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">Contact No :</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {selectedDriverModal.phone}
                  </span>
                </div>

                <div className="grid grid-cols-[130px_1fr] items-center gap-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">License number :</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {selectedDriverModal.licenseNo || "NA"}
                  </span>
                </div>

                <div className="grid grid-cols-[130px_1fr] items-center gap-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">License expiration date :</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {selectedDriverModal.licenseExp || "NA"}
                  </span>
                </div>

                <div className="grid grid-cols-[130px_1fr] items-center gap-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">City :</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {selectedDriverModal.city || "NA"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
