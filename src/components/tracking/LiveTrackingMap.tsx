import {
  Boxes,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Compass,
  Eye,
  GitCompare,
  Layers,
  Locate,
  Map,
  MapPin,
  MapPinPlus,
  Maximize2,
  Minimize2,
  Minus,
  Navigation,
  Play,
  Plus,
  Route,
  Ruler,
  Share2,
  SlidersHorizontal,
  Square,
  Tag,
  Target,
  TrafficCone,
  TrendingUp,
  Truck,
  Volume2,
  Zap,
} from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { type FleetObject, STATUS_META } from "@/data/fleet";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function LiveTrackingMap({
  selectedVehicle,
  checkedVehicles,
  onOpenPlayback,
  isTelemetryDrawerOpen,
  onToggleTelemetryDrawer,
  className,
}: {
  selectedVehicle: FleetObject;
  checkedVehicles: FleetObject[];
  onOpenPlayback: () => void;
  isTelemetryDrawerOpen: boolean;
  onToggleTelemetryDrawer: () => void;
  className?: string;
}) {
  const [mapStyle, setMapStyle] = useState<"streets" | "satellite" | "terrain" | "dark">("streets");
  const [showClusters, setShowClusters] = useState(true);
  const [showObjectPath, setShowObjectPath] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [singleObjectMode, setSingleObjectMode] = useState(false);
  const [areaMeasurementActive, setAreaMeasurementActive] = useState(false);
  const [taxiMeterActive, setTaxiMeterActive] = useState(false);
  const [showGeofences, setShowGeofences] = useState(true);
  const [showTraffic, setShowTraffic] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(18, z + 1));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(2, z - 1));

  return (
    <div
      ref={mapContainerRef}
      className={cn(
        "relative flex-1 h-full w-full overflow-hidden bg-[#E8ECE9] dark:bg-[#151D2A] select-none",
        className,
      )}
    >
      {/* 1. Interactive SVG Map Canvas (Real Map Styling) */}
      <svg
        className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
        viewBox="0 0 1000 650"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Street Map Pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(200, 210, 220, 0.25)" strokeWidth="0.8" />
          </pattern>
          {/* Water Gradient */}
          <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={mapStyle === "dark" ? "#0F172A" : "#D4E6F1"} />
            <stop offset="100%" stopColor={mapStyle === "dark" ? "#090D16" : "#C2DCED"} />
          </linearGradient>
          {/* Landmass */}
          <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={mapStyle === "dark" ? "#1E293B" : "#F4EFE6"} />
            <stop offset="100%" stopColor={mapStyle === "dark" ? "#182234" : "#ECE5D8"} />
          </linearGradient>
          {/* Road Network Yellow Gradient */}
          <linearGradient id="primaryRoadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
        </defs>

        {/* Ocean Background */}
        <rect width="100%" height="100%" fill="url(#oceanGrad)" />

        {/* Realistic Landmass Map Contours */}
        <g id="landmass">
          {/* Asia / SE Asia Main Continent */}
          <path
            d="M 50,0 L 220,40 Q 300,120 320,240 L 260,380 Q 240,460 310,500 L 420,530 Q 520,540 600,480 L 700,420 Q 750,300 720,180 L 680,60 Q 640,0 550,0 Z"
            fill="url(#landGrad)"
            stroke={mapStyle === "dark" ? "#334155" : "#D8D0C2"}
            strokeWidth="1.2"
          />
          {/* Island 1 (Indonesia - Sulawesi / Java / Bali) */}
          <path
            d="M 680,480 Q 740,460 820,490 Q 860,540 840,600 Q 780,620 720,590 Q 660,540 680,480 Z"
            fill="url(#landGrad)"
            stroke={mapStyle === "dark" ? "#334155" : "#D8D0C2"}
            strokeWidth="1.2"
          />
          {/* Island 2 (Thailand / Malaysia Peninsula) */}
          <path
            d="M 440,280 Q 480,340 470,420 Q 450,480 430,520 Q 410,480 420,400 Q 400,320 440,280 Z"
            fill="url(#landGrad)"
            stroke={mapStyle === "dark" ? "#334155" : "#D8D0C2"}
            strokeWidth="1.2"
          />
        </g>

        {/* Grid pattern overlay */}
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Primary Highway & City Roads */}
        <g id="roads" strokeLinecap="round" strokeLinejoin="round">
          {/* Secondary Grey Roads */}
          <path
            d="M 280,180 L 360,260 L 450,290 L 520,270 L 600,340 L 680,380"
            fill="none"
            stroke={mapStyle === "dark" ? "#334155" : "#CBD5E1"}
            strokeWidth="4"
          />
          <path
            d="M 340,320 L 410,380 L 460,460 L 540,490"
            fill="none"
            stroke={mapStyle === "dark" ? "#334155" : "#CBD5E1"}
            strokeWidth="3.5"
          />
          {/* Major Yellow National Arterial Highway (Matching Screenshot) */}
          <path
            d="M 320,120 Q 420,240 480,320 T 580,420 L 760,520"
            fill="none"
            stroke="url(#primaryRoadGrad)"
            strokeWidth="7"
          />
          <path
            d="M 480,320 L 540,210 L 620,180"
            fill="none"
            stroke="url(#primaryRoadGrad)"
            strokeWidth="5"
          />
        </g>

        {/* Active Vehicle Route Path (Tail Trace) */}
        {showObjectPath && (
          <path
            d="M 500,450 L 540,390 L 580,350 L 580,340"
            fill="none"
            stroke="#0089FF"
            strokeWidth="4"
            strokeDasharray="6,4"
            strokeLinecap="round"
          />
        )}
      </svg>

      {/* 2. Exact 40px Fixed Diameter Map Clusters (Pixel Perfect on All Monitors & Resolutions) */}
      {showClusters && (
        <>
          {/* Cluster 1: India (4 vehicles) */}
          <div
            style={{ left: "35%", top: "33.8%" }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 shadow-md flex items-center justify-center cursor-pointer hover:scale-110 transition-transform select-none z-10"
          >
            <svg className="absolute inset-0 w-[40px] h-[40px] -rotate-90">
              <circle cx="20" cy="20" r="16.5" fill="none" stroke="#EF4444" strokeWidth="3" strokeDasharray="33 71" />
              <circle cx="20" cy="20" r="16.5" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="52 52" strokeDashoffset="-33" />
              <circle cx="20" cy="20" r="16.5" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="21 83" strokeDashoffset="-85" />
            </svg>
            <span className="text-xs font-black text-slate-900 dark:text-slate-100 z-10">4</span>
          </div>

          {/* Cluster 2: Mumbai / West (7 vehicles) */}
          <div
            style={{ left: "32%", top: "44.6%" }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 shadow-md flex items-center justify-center cursor-pointer hover:scale-110 transition-transform select-none z-10"
          >
            <svg className="absolute inset-0 w-[40px] h-[40px] -rotate-90">
              <circle cx="20" cy="20" r="16.5" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="62 42" />
              <circle cx="20" cy="20" r="16.5" fill="none" stroke="#EF4444" strokeWidth="3" strokeDasharray="42 62" strokeDashoffset="-62" />
            </svg>
            <span className="text-xs font-black text-slate-900 dark:text-slate-100 z-10">7</span>
          </div>

          {/* Cluster 3: Thailand (3 vehicles) */}
          <div
            style={{ left: "48%", top: "43.1%" }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 shadow-md flex items-center justify-center cursor-pointer hover:scale-110 transition-transform select-none z-10"
          >
            <svg className="absolute inset-0 w-[40px] h-[40px] -rotate-90">
              <circle cx="20" cy="20" r="16.5" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="73 31" />
              <circle cx="20" cy="20" r="16.5" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="31 73" strokeDashoffset="-73" />
            </svg>
            <span className="text-xs font-black text-slate-900 dark:text-slate-100 z-10">3</span>
          </div>

          {/* Cluster 4: South East (2 vehicles) */}
          <div
            style={{ left: "53%", top: "45.4%" }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 shadow-md flex items-center justify-center cursor-pointer hover:scale-110 transition-transform select-none z-10"
          >
            <svg className="absolute inset-0 w-[40px] h-[40px] -rotate-90">
              <circle cx="20" cy="20" r="16.5" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="52 52" />
              <circle cx="20" cy="20" r="16.5" fill="none" stroke="#0089FF" strokeWidth="3" strokeDasharray="52 52" strokeDashoffset="-52" />
            </svg>
            <span className="text-xs font-black text-slate-900 dark:text-slate-100 z-10">2</span>
          </div>

          {/* Cluster 5: Indonesia Sulawesi (4 vehicles) */}
          <div
            style={{ left: "76%", top: "80%" }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 shadow-md flex items-center justify-center cursor-pointer hover:scale-110 transition-transform select-none z-10"
          >
            <svg className="absolute inset-0 w-[40px] h-[40px] -rotate-90">
              <circle cx="20" cy="20" r="16.5" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="78 26" />
              <circle cx="20" cy="20" r="16.5" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="26 78" strokeDashoffset="-78" />
            </svg>
            <span className="text-xs font-black text-slate-900 dark:text-slate-100 z-10">4</span>
          </div>
        </>
      )}

      {/* 3. Selected Active Vehicle Marker Pin + Ultra Minimal Vehicle Label */}
      <div
        style={{ left: "58%", top: "52.3%" }}
        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-20 cursor-pointer animate-in zoom-in-50 duration-300"
      >
        {/* Minimal Vehicle Direction Pin */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-6 h-6 rounded-md bg-emerald-500/25 animate-ping" />
          <div className="h-6 w-6 rounded-md bg-[#10B981] border-2 border-white text-white flex items-center justify-center shadow-md">
            <Navigation className="h-3 w-3 fill-current rotate-[35deg]" />
          </div>
        </div>

        {/* Ultra Minimal Compact Floating Vehicle Label */}
        {showLabels && (
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 h-5 rounded-full bg-white/95 dark:bg-slate-900/95 border border-[#DFE3EB] dark:border-slate-800 shadow-xs backdrop-blur-xs select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-[10px] font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap leading-none">
              {selectedVehicle?.name || "Fuel - 1001"}
            </span>
          </div>
        )}
      </div>

      {/* 2. Top Center Floating Playback Pill Button */}
      <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-20">
        <button
          type="button"
          onClick={onOpenPlayback}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0089FF] hover:bg-[#0070d6] text-white text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>Playback</span>
        </button>
      </div>

      {/* 3. Right Floating Map Controls Vertical Toolbar (14 GIS Tools in Exact Specified Order) */}
      <div
        className={cn(
          "absolute top-3.5 z-20 flex flex-col items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-[#DFE3EB] dark:border-slate-800 rounded-2xl p-1.5 shadow-xl transition-all duration-200 overflow-y-auto max-h-[calc(100vh-80px)] select-none no-scrollbar",
          isTelemetryDrawerOpen ? "right-[374px]" : "right-3.5",
        )}
      >
        <TooltipProvider delayDuration={150}>
          {/* Telemetry Drawer Toggle (Top Placement with Chevron Icon) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onToggleTelemetryDrawer}
                className={cn(
                  "p-2 rounded-xl transition-colors cursor-pointer text-slate-700 dark:text-slate-300",
                  isTelemetryDrawerOpen
                    ? "bg-[#0089FF] text-white shadow-xs"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white",
                )}
              >
                {isTelemetryDrawerOpen ? (
                  <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                ) : (
                  <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">
              {isTelemetryDrawerOpen ? "Close Telemetry Drawer" : "Open Telemetry Drawer"}
            </TooltipContent>
          </Tooltip>

          <div className="w-full my-0.5 border-t border-[#DFE3EB] dark:border-slate-800" />

          {/* 1. Select Map */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() =>
                  setMapStyle((s) => (s === "streets" ? "satellite" : s === "satellite" ? "dark" : "streets"))
                }
                className={cn(
                  "p-2 rounded-xl transition-colors cursor-pointer text-slate-700 dark:text-slate-300",
                  mapStyle !== "streets"
                    ? "bg-[#0089FF]/10 text-[#0089FF]"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white",
                )}
              >
                <Map className="h-4 w-4 stroke-[2.2]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Select Map ({mapStyle.toUpperCase()})</TooltipContent>
          </Tooltip>

          {/* 2. Remove Cluster */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => {
                  setShowClusters((prev) => !prev);
                  toast.info(showClusters ? "Clusters hidden" : "Clusters visible");
                }}
                className={cn(
                  "p-2 rounded-xl transition-colors cursor-pointer text-slate-700 dark:text-slate-300",
                  !showClusters
                    ? "bg-[#0089FF]/10 text-[#0089FF]"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white",
                )}
              >
                <Boxes className="h-4 w-4 stroke-[2.2]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Remove Cluster</TooltipContent>
          </Tooltip>

          {/* 3. Object with path */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => {
                  setShowObjectPath((prev) => !prev);
                  toast.info(showObjectPath ? "Vehicle path hidden" : "Vehicle path visible");
                }}
                className={cn(
                  "p-2 rounded-xl transition-colors cursor-pointer text-slate-700 dark:text-slate-300",
                  showObjectPath
                    ? "bg-[#0089FF]/10 text-[#0089FF]"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white",
                )}
              >
                <Route className="h-4 w-4 stroke-[2.2]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Object with path</TooltipContent>
          </Tooltip>

          {/* 4. Show label */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => {
                  setShowLabels((prev) => !prev);
                  toast.info(showLabels ? "Labels hidden" : "Labels visible");
                }}
                className={cn(
                  "p-2 rounded-xl transition-colors cursor-pointer text-slate-700 dark:text-slate-300",
                  showLabels
                    ? "bg-[#0089FF]/10 text-[#0089FF]"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white",
                )}
              >
                <Tag className="h-4 w-4 stroke-[2.2]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Show label</TooltipContent>
          </Tooltip>

          {/* 5. Share Live location */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => toast.success("Live tracking link copied to clipboard!")}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <Share2 className="h-4 w-4 stroke-[2.2]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Share Live location</TooltipContent>
          </Tooltip>

          {/* 6. Find Near By */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => toast.info("Searching nearby assets & places...")}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <Compass className="h-4 w-4 stroke-[2.2]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Find Near By</TooltipContent>
          </Tooltip>

          {/* 7. Single Object Mode */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => {
                  setSingleObjectMode((prev) => !prev);
                  toast.info(singleObjectMode ? "Exited Single Object Mode" : "Entered Single Object Mode");
                }}
                className={cn(
                  "p-2 rounded-xl transition-colors cursor-pointer text-slate-700 dark:text-slate-300",
                  singleObjectMode
                    ? "bg-[#0089FF]/10 text-[#0089FF]"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white",
                )}
              >
                <Target className="h-4 w-4 stroke-[2.2]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Single Object Mode</TooltipContent>
          </Tooltip>

          {/* 8. Area Measurement */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => {
                  setAreaMeasurementActive((prev) => !prev);
                  toast.info(areaMeasurementActive ? "Area measurement closed" : "Click map points to measure area");
                }}
                className={cn(
                  "p-2 rounded-xl transition-colors cursor-pointer text-slate-700 dark:text-slate-300",
                  areaMeasurementActive
                    ? "bg-[#0089FF]/10 text-[#0089FF]"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white",
                )}
              >
                <Ruler className="h-4 w-4 stroke-[2.2]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Area Measurement</TooltipContent>
          </Tooltip>

          {/* 9. Add Address and Geofence */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => toast.info("Click map location to add Geofence or Custom Address")}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <MapPinPlus className="h-4 w-4 stroke-[2.2]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Add Address and Geofence</TooltipContent>
          </Tooltip>

          {/* 10. Re-center */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => toast.success("Map re-centered to selected vehicle")}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <Locate className="h-4 w-4 stroke-[2.2]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Re-center</TooltipContent>
          </Tooltip>

          {/* 11. Compare path */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => toast.info("Comparing historical vehicle paths...")}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <GitCompare className="h-4 w-4 stroke-[2.2]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Compare path</TooltipContent>
          </Tooltip>

          {/* 12. Taxi meter */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => {
                  setTaxiMeterActive((prev) => !prev);
                  toast.info(taxiMeterActive ? "Taxi meter stopped" : "Taxi meter activated");
                }}
                className={cn(
                  "p-2 rounded-xl transition-colors cursor-pointer text-slate-700 dark:text-slate-300",
                  taxiMeterActive
                    ? "bg-[#0089FF]/10 text-[#0089FF]"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white",
                )}
              >
                <Calculator className="h-4 w-4 stroke-[2.2]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Taxi meter</TooltipContent>
          </Tooltip>

          <div className="w-full my-0.5 border-t border-[#DFE3EB] dark:border-slate-800" />

          {/* 13. Zoom in */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Zoom in</TooltipContent>
          </Tooltip>

          {/* 14. Zoom out */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <Minus className="h-4 w-4 stroke-[2.5]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Zoom out</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* 4. Bottom Map Scale & Coordinates */}
      <div
        className={cn(
          "absolute bottom-3 z-10 flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-3 py-1 rounded-xl border border-[#DFE3EB] dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 transition-all duration-200 shadow-sm",
          isTelemetryDrawerOpen ? "right-[374px]" : "right-3.5",
        )}
      >
        <span>0.05 km</span>
        <div className="w-8 h-1 bg-slate-800 dark:bg-slate-200" />
      </div>
    </div>
  );
}
