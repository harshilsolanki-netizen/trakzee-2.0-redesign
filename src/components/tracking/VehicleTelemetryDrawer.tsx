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
  Download,
  Droplet,
  Eye,
  FileText,
  Flame,
  Gauge,
  GripVertical,
  HelpCircle,
  Info,
  Layers,
  Leaf,
  Locate,
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
  Search,
  Settings,
  Share2,
  SlidersHorizontal,
  Target,
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
  const [selectedDriverModal, setSelectedDriverModal] = useState<{
    name: string;
    phone: string;
    role: string;
    licenseNo?: string;
    licenseExp?: string;
    city?: string;
  } | null>(null);
  const [selectedTank, setSelectedTank] = useState<number>(0);

  const [cardsOrder, setCardsOrder] = useState<string[]>([
    "vehicle_main",
    "today_activity",
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
          "flex flex-col gap-2.5 w-full sm:w-[242px] text-xs select-none h-full bg-transparent pointer-events-none",
          className,
        )}
      >
        {/* 1. Header Card (Full-Width Floating Card Matching Tooltip Cards Width 1:1) */}
        <div className="flex h-11 w-full items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 select-none rounded-2xl shadow-md shrink-0 pointer-events-auto">
          <div className="flex items-center gap-1 min-w-0">
            {DRAWER_TABS.map((tab) => {
              const isActive = activeDrawerTab === tab.id;
              const IconComp = tab.icon;

              if (isActive) {
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveDrawerTab(tab.id as any)}
                    className="h-8 flex items-center gap-1.5 px-3 rounded-xl bg-[#0089FF] hover:bg-[#0070d6] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer shrink-0 active:scale-98"
                  >
                    <IconComp className="h-3.5 w-3.5 stroke-[2.2] fill-current shrink-0" />
                    <span>{tab.label}</span>
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
                        className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shrink-0"
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
                  className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF] dark:hover:text-[#0089FF] transition-colors cursor-pointer shrink-0"
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
        <div className="flex-1 min-h-0 overflow-y-auto space-y-2 custom-scrollbar pr-0.5 pointer-events-auto">
          {cardsOrder.map((cardId) => {
            const isDraggingThis = draggedCardId === cardId;
            const isRefreshingThis = refreshingCardId === cardId;
            const cardWrapperClass = cn(
              "group rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md overflow-hidden text-xs transition-all relative",
              isDraggingThis && "opacity-50 border-dashed border-[#0089FF]"
            );

            const dragProps = {
              draggable: true,
              onDragStart: (e: React.DragEvent) => handleDragStart(e, cardId),
              onDragOver: handleDragOver,
              onDrop: (e: React.DragEvent) => handleDrop(e, cardId),
            };

            switch (cardId) {
              case "vehicle_main":
                return (
                  <div key={cardId} {...dragProps} className={cardWrapperClass}>
                    {/* 1. Header Row */}
                    <div className="flex items-center justify-between px-2.5 py-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Truck className="h-4 w-4 text-slate-800 dark:text-slate-200 stroke-[1.8] shrink-0" />
                        <h3 className="text-[12px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                          {vehicle.name || "Vehicle Name"}
                        </h3>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleRefreshCard(vehicle.name || "Vehicle Card", cardId)}
                          className="p-1 rounded-md text-slate-400 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Refresh widget"
                        >
                          <RefreshCw className={cn("h-3.5 w-3.5 transition-transform", isRefreshingThis && "animate-spin text-[#0089FF]")} />
                        </button>
                        <button
                          type="button"
                          onClick={() => toast.info(`Vehicle Specs: ${vehicle.name} (${vehicle.imei || "IMEI 8610760861"})`)}
                          className="p-1 rounded-full text-slate-500 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Vehicle Info"
                        >
                          <Info className="h-3.5 w-3.5 stroke-[1.8]" />
                        </button>
                        <GripVertical className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-grab active:cursor-grabbing shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ml-0.5" />
                      </div>
                    </div>

                    {/* 2. Grey Banner Section (#F4F5F7) */}
                    <div className="bg-[#F4F5F7] dark:bg-slate-800/60 pl-0 pr-2.5 py-1 flex items-center justify-between min-h-[102px] overflow-hidden">
                      <div className="w-[140px] h-[98px] relative flex items-center justify-start shrink-0 -ml-9">
                        <img
                          src="/yellow_dump_truck.png"
                          alt="Vehicle Preview"
                          className="h-full w-full object-contain scale-[1.95] origin-left filter drop-shadow-sm"
                        />
                      </div>

                      <div className="flex flex-col items-end justify-center gap-1 shrink-0">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs tracking-tight font-sans whitespace-nowrap">
                          {formatDuration(vehicle.duration)}
                        </span>
                        <div className="p-0.5 rounded-lg bg-[#E6F4EA] dark:bg-emerald-950/50">
                          <span className="inline-flex items-center justify-center rounded-md bg-[#22AD00] px-2 py-0.5 text-white font-semibold text-[10.5px] leading-none whitespace-nowrap">
                            {STATUS_META[vehicle.status]?.label || "Running"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 3. Main Data Content Area */}
                    <div className="px-3 py-2 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-normal text-slate-600 dark:text-slate-400 shrink-0">Current Trip</span>
                        <span className="text-[12px] font-semibold text-slate-900 dark:text-slate-100 text-right truncate">
                          {vehicle.currentTrip ?? "331.4"}{" "}
                          <span className="font-normal text-slate-500 text-[11.5px]">km</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-normal text-slate-600 dark:text-slate-400 shrink-0">Work Hour</span>
                        <span className="text-[12px] font-semibold text-slate-900 dark:text-slate-100 text-right truncate">
                          {vehicle.workHour || "11:26"}{" "}
                          <span className="font-normal text-slate-500 text-[11.5px]">hrs</span>
                        </span>
                      </div>

                      {isEnabled("odometer") && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-normal text-slate-600 dark:text-slate-400 shrink-0">Odometer</span>
                          <div className="bg-[#F4F5F7] dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-md px-1.5 py-0.5 shadow-2xs flex items-center divide-x divide-slate-200/90 dark:divide-slate-700 shrink-0">
                            {odoDigits.map((digit, i) => (
                              <span
                                key={i}
                                className={cn(
                                  "px-1 text-[11px] font-semibold text-slate-800 dark:text-slate-200 font-sans",
                                  digit === "0" && i < 2 && "italic text-slate-500",
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
                            <span className="text-[11px] font-normal text-slate-600 dark:text-slate-400 shrink-0">Driver</span>
                            <span className="text-[12px] font-semibold text-slate-900 dark:text-slate-100 text-right truncate">
                              {vehicle.driver || "Venu Gopal Iyer"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-normal text-slate-600 dark:text-slate-400 shrink-0">Mobile</span>
                            <span className="text-[12px] font-semibold text-slate-900 dark:text-slate-100 text-right font-sans truncate">
                              {vehicle.driverPhone || "+62 812 3456 7890"}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* 4. Action Toolbar Row */}
                    <div className="bg-[#F4F5F7] dark:bg-slate-800/60 border-t border-slate-200/80 dark:border-slate-800 px-2 h-[34px] flex items-center justify-around text-slate-600 dark:text-slate-400 rounded-b-xl">
                      <TooltipProvider delayDuration={150}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() => toast.success(`Following ${vehicle.name} live on map`)}
                              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:shadow-2xs transition-all cursor-pointer"
                            >
                              <Target className="h-4 w-4 stroke-[1.8]" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            Follow
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider delayDuration={150}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() => toast.info(`Navigating to ${vehicle.name}`)}
                              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:shadow-2xs transition-all cursor-pointer"
                            >
                              <Navigation className="h-4 w-4 stroke-[1.8]" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            Navigate
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider delayDuration={150}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={handleShare}
                              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:shadow-2xs transition-all cursor-pointer"
                            >
                              <Share2 className="h-4 w-4 stroke-[1.8]" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            Share
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider delayDuration={150}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() => toast.info(`Searching points of interest near ${vehicle.name}`)}
                              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:shadow-2xs transition-all cursor-pointer"
                            >
                              <MapPin className="h-4 w-4 stroke-[1.8]" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            Find Near By
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider delayDuration={150}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() => toast.info(`Changing display mode for ${vehicle.name}`)}
                              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:shadow-2xs transition-all cursor-pointer"
                            >
                              <SlidersHorizontal className="h-4 w-4 stroke-[1.8]" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            Change Mode
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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
                    {/* 1. Header Row */}
                    <div className="flex items-center justify-between px-2.5 py-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Compass className="h-4 w-4 text-slate-800 dark:text-slate-200 stroke-[1.8] shrink-0" />
                        <h3 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                          Today's Activity
                        </h3>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleRefreshCard("Today's Activity", cardId)}
                          className="p-1 rounded-md text-slate-400 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Refresh widget"
                        >
                          <RefreshCw className={cn("h-3.5 w-3.5 transition-transform", isRefreshingThis && "animate-spin text-[#0089FF]")} />
                        </button>
                        <GripVertical className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-grab active:cursor-grabbing shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ml-0.5" />
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
                            <span className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-sans">
                              {vehicle.currentTrip ?? "331.4"}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">km</span>
                          </div>

                          <div className="relative z-10 h-6 w-6 rounded-full bg-[#E0F2FE] dark:bg-blue-950 flex items-center justify-center text-[#0089FF] shrink-0 shadow-2xs">
                            <Truck className="h-3 w-3 stroke-[2]" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3. Status Time Breakdown Rows */}
                    <div className="px-3 py-1 space-y-1">
                      {isEnabled("running") && (
                        <div className="flex items-center justify-between">
                          <span className="text-[11.5px] font-normal text-slate-600 dark:text-slate-400">Running</span>
                          <span className="text-[11.5px] font-bold text-[#16A34A] dark:text-emerald-400 font-sans">
                            {vehicle.runningTime || "09:16 hrs"}
                          </span>
                        </div>
                      )}

                      {isEnabled("stop") && (
                        <div className="flex items-center justify-between">
                          <span className="text-[11.5px] font-normal text-slate-600 dark:text-slate-400">Stop</span>
                          <span className="text-[11.5px] font-bold text-[#DC2626] dark:text-rose-400 font-sans">
                            {vehicle.stopTime || "01:30 hrs"}
                          </span>
                        </div>
                      )}

                      {isEnabled("idle") && (
                        <div className="flex items-center justify-between">
                          <span className="text-[11.5px] font-normal text-slate-600 dark:text-slate-400">Idle</span>
                          <span className="text-[11.5px] font-bold text-[#D97706] dark:text-amber-400 font-sans">
                            {vehicle.idleTime || "09:16 hrs"}
                          </span>
                        </div>
                      )}

                      {isEnabled("inactive") && (
                        <div className="flex items-center justify-between">
                          <span className="text-[11.5px] font-normal text-slate-600 dark:text-slate-400">Inactive</span>
                          <span className="text-[11.5px] font-bold text-[#2563EB] dark:text-blue-400 font-sans">
                            {vehicle.inactiveTime || "01:30 hrs"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 4. Journey Log Section (Timeline) */}
                    {(isEnabled("working_start") || isEnabled("last_stop")) && (
                      <div className="px-3 pt-2 pb-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                        <h4 className="text-[11.5px] font-semibold text-slate-600 dark:text-slate-400">
                          Journey Log
                        </h4>

                        <div className="relative pl-5 space-y-2">
                          <div className="absolute left-[5px] top-2 bottom-2 w-0 border-l-2 border-dashed border-slate-300 dark:border-slate-700" />

                          {isEnabled("working_start") && (
                            <div className="relative">
                              <div className="absolute -left-[19px] top-0.5 h-3 w-3 rounded-full bg-[#22AD00] ring-3 ring-emerald-100 dark:ring-emerald-950/70" />
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11.5px] font-bold text-slate-900 dark:text-slate-100">Start</span>
                                <span className="bg-[#E6F4EA] dark:bg-emerald-950/60 text-[#16A34A] dark:text-emerald-400 px-1.5 py-0.5 rounded-md text-[10.5px] font-bold font-sans">
                                  {vehicle.workingStart || "12:00 AM"}
                                </span>
                              </div>
                              <p className="text-[10.5px] font-normal text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                                Talodo, Southeast Sulawesi, Indonesia (SW)
                              </p>
                            </div>
                          )}

                          {isEnabled("last_stop") && (
                            <div className="relative">
                              <div className="absolute -left-[19px] top-0.5 h-3 w-3 rounded-full bg-[#DC2626] ring-3 ring-rose-100 dark:ring-rose-950/70" />
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11.5px] font-bold text-slate-900 dark:text-slate-100">Last Stop</span>
                                <span className="bg-[#FEE2E2] dark:bg-rose-950/60 text-[#DC2626] dark:text-rose-400 px-1.5 py-0.5 rounded-md text-[10.5px] font-bold font-sans">
                                  03:34 PM
                                </span>
                              </div>
                              <p className="text-[10.5px] font-normal text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
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
                    {/* 1. Header Row */}
                    <div className="flex items-center justify-between px-2.5 py-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Droplet className="h-4 w-4 text-slate-800 dark:text-slate-200 stroke-[1.8] shrink-0" />
                        <h3 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                          Fuel
                        </h3>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleRefreshCard("Fuel Widget", cardId)}
                          className="p-1 rounded-md text-slate-400 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Refresh widget"
                        >
                          <RefreshCw className={cn("h-3.5 w-3.5 transition-transform", isRefreshingThis && "animate-spin text-[#0089FF]")} />
                        </button>
                        <GripVertical className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-grab active:cursor-grabbing shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ml-0.5" />
                      </div>
                    </div>

                    <div>
                      <div>
                        {/* 2. Fuel Sensor Icon-Only Scrollable Tabs Strip */}
                        <div className="mx-2 my-1.5 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl flex items-center gap-1 overflow-x-auto custom-scrollbar no-scrollbar scroll-smooth text-xs select-none">
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
                              <TooltipProvider key={sNum} delayDuration={150}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
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
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="text-xs">
                                    Fuel Sensor {sNum}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
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

                            {/* Right Column: Key Metrics Readout Card (Formatting matched 1:1 with Today's Activity readout) */}
                            <div className="flex-1 flex flex-col justify-center gap-2 border-l border-slate-200 dark:border-slate-700/80 pl-3 min-w-0">
                              <div>
                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block leading-tight">
                                  Current Level
                                </span>
                                <div className="flex items-baseline gap-1 mt-0.5">
                                  <span className="text-base font-extrabold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
                                    300
                                  </span>
                                  <span className="text-xs font-semibold text-slate-500">ltr</span>
                                </div>
                              </div>

                              <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800">
                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block leading-tight">
                                  Max Capacity
                                </span>
                                <div className="flex items-baseline gap-1 mt-0.5">
                                  <span className="text-base font-extrabold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
                                    2000
                                  </span>
                                  <span className="text-xs font-semibold text-slate-500">ltr</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 4. Tanks Summary Section */}
                        <div className="px-3 py-2 space-y-1.5 border-t border-slate-100 dark:border-slate-800">
                          {isEnabled("number_of_tank") && (
                            <div className="flex items-center justify-between text-[11.5px]">
                              <span className="font-semibold text-[#0089FF]">Tanks</span>
                              <span className="font-bold text-[#0089FF] font-sans">5</span>
                            </div>
                          )}

                          {isEnabled("refill_and_drain") && (
                            <>
                              <div className="flex items-center justify-between text-[11.5px]">
                                <span className="text-slate-600 dark:text-slate-400">Refill</span>
                                <div className="flex items-center gap-2 font-sans">
                                  <span className="text-[10.5px] italic text-slate-500">5 times</span>
                                  <span className="font-bold text-[#16A34A] dark:text-emerald-400">50 ltr</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-[11.5px]">
                                <span className="text-slate-600 dark:text-slate-400">Drain</span>
                                <div className="flex items-center gap-2 font-sans">
                                  <span className="text-[10.5px] italic text-slate-500">2 times</span>
                                  <span className="font-bold text-[#D97706] dark:text-amber-400">2 ltr</span>
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* 5. Consumption Section */}
                        <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                          <span className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block">
                            Consumption
                          </span>
                          <div className="space-y-1 text-[11.5px] pl-0">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 dark:text-slate-400 font-normal">Sensor</span>
                              <span className="font-bold text-slate-900 dark:text-slate-100 font-sans">2 ltr.</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 dark:text-slate-400 font-normal">CAN</span>
                              <span className="font-bold text-slate-900 dark:text-slate-100 font-sans">4 ltr</span>
                            </div>
                          </div>
                        </div>

                        {/* 6. Carbon Emission Section */}
                        <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                          <span className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block">
                            Carbon emission
                          </span>
                          <div className="space-y-1 text-[11.5px] pl-0">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 dark:text-slate-400 font-normal">Sensor</span>
                              <span className="font-bold text-slate-900 dark:text-slate-100 font-sans">NA</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 dark:text-slate-400 font-normal">CAN</span>
                              <span className="font-bold text-slate-900 dark:text-slate-100 font-sans">NA</span>
                            </div>
                          </div>
                        </div>

                        {/* 7. Mileage Based On Section */}
                        <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                          <span className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block">
                            Mileage based on
                          </span>
                          <div className="space-y-1 text-[11.5px] pl-0">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 dark:text-slate-400 font-normal">Distance</span>
                              <span className="font-bold text-slate-900 dark:text-slate-100 font-sans">2.5 km/ltr</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 dark:text-slate-400 font-normal">Duration</span>
                              <span className="font-bold text-slate-900 dark:text-slate-100 font-sans">2.5 ltr/hr</span>
                            </div>
                          </div>
                        </div>

                        {/* 8. Waste Section */}
                        <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                          <div className="flex items-center gap-1">
                            <span className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">
                              Waste
                            </span>
                            <TooltipProvider delayDuration={150}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3 w-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs">
                                  Fuel wasted during idling
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <div className="space-y-1 text-[11.5px] pl-0">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 dark:text-slate-400 font-normal">Pre-defined</span>
                              <span className="font-bold text-[#DC2626] dark:text-rose-400 font-sans">2.5 ltr</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 dark:text-slate-400 font-normal">CAN</span>
                              <span className="font-bold text-[#DC2626] dark:text-rose-400 font-sans">2.5 ltr</span>
                            </div>
                            <p className="text-[10.5px] italic text-slate-500 dark:text-slate-400 pt-0.5">
                              Due to 1 hr 43min idling
                            </p>
                          </div>
                        </div>

                        {/* 9. Remaining & Updated Footer Section */}
                        <div className="px-3 py-2 border-t border-slate-200/80 dark:border-slate-800 space-y-1 bg-[#F4F5F7]/60 dark:bg-slate-800/30 rounded-b-xl">
                          <div className="flex items-center justify-between text-[11.5px]">
                            <span className="text-slate-600 dark:text-slate-400">Remaining</span>
                            <span className="font-bold text-slate-900 dark:text-slate-100 font-sans">06 km</span>
                          </div>
                          <div className="flex items-start justify-between text-[11.5px]">
                            <span className="text-slate-600 dark:text-slate-400">Updated</span>
                            <div className="text-right font-bold text-slate-900 dark:text-slate-100 font-sans text-[11px] leading-tight">
                              <div>06-07-2026</div>
                              <div>10:01 PM</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );

              case "consumption":
                if (!isEnabled("consumption")) return null;

                return (
                  <div key={cardId} {...dragProps} className={cn(cardWrapperClass, "p-3 space-y-1.5")}>
                    <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800/70 pb-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-slate-100 min-w-0">
                        <Zap className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span className="truncate"># Consumption</span>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleRefreshCard("Consumption Widget", cardId)}
                          className="p-1 rounded-md text-slate-400 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Refresh widget"
                        >
                          <RefreshCw className={cn("h-3.5 w-3.5 transition-transform", isRefreshingThis && "animate-spin text-[#0089FF]")} />
                        </button>
                        <GripVertical className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-grab active:cursor-grabbing shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ml-0.5" />
                      </div>
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
                );

              case "temperature":
                return (
                  <div key={cardId} {...dragProps} className={cn(cardWrapperClass, "p-3 space-y-1.5")}>
                    <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800/70 pb-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-slate-100 min-w-0">
                        <Thermometer className="h-4 w-4 text-rose-500 shrink-0" />
                        <span className="truncate"># Temperature & Sensors</span>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleRefreshCard("Temperature & Sensors", cardId)}
                          className="p-1 rounded-md text-slate-400 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Refresh widget"
                        >
                          <RefreshCw className={cn("h-3.5 w-3.5 transition-transform", isRefreshingThis && "animate-spin text-[#0089FF]")} />
                        </button>
                        <GripVertical className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-grab active:cursor-grabbing shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ml-0.5" />
                      </div>
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
