import {
  Compass,
  Eye,
  Layers,
  MapPin,
  Maximize2,
  Minimize2,
  Navigation,
  Play,
  Plus,
  Minus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Square,
  TrafficCone,
  TrendingUp,
  Volume2,
  Zap,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { type FleetObject, STATUS_META } from "@/data/fleet";
import { cn } from "@/lib/utils";

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
  const [mapStyle, setMapStyle] = useState<
    "streets" | "satellite" | "terrain" | "dark"
  >("terrain");
  const [showGeofences, setShowGeofences] = useState(true);
  const [showTraffic, setShowTraffic] = useState(false);
  const [showPOIs, setShowPOIs] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Animated truck position
  const [truckPos, setTruckPos] = useState({ x: 265, y: 310, heading: 45 });

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

  return (
    <div
      ref={mapContainerRef}
      className={cn(
        "relative flex-1 h-full w-full overflow-hidden rounded-xl border border-border bg-[#e8ece9] dark:bg-[#1a2332] shadow-inner select-none",
        className,
      )}
    >
      {/* 1. Vector / GIS Map Canvas Simulation (Matching Sulawesi / Indonesia Island Topography in Reference) */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 650"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Water Pattern / Gradient */}
          <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              stopColor={mapStyle === "dark" ? "#0f172a" : "#cae4f8"}
            />
            <stop
              offset="100%"
              stopColor={mapStyle === "dark" ? "#090d16" : "#b2d8f5"}
            />
          </linearGradient>

          {/* Landmass Texture / Colors */}
          <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              stopColor={mapStyle === "dark" ? "#1e293b" : "#f1ebd9"}
            />
            <stop
              offset="100%"
              stopColor={mapStyle === "dark" ? "#151e2e" : "#e8e1cd"}
            />
          </linearGradient>

          {/* Forest / Green Mountain Zones */}
          <linearGradient id="forestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              stopColor={mapStyle === "dark" ? "#143a29" : "#c6e0b4"}
            />
            <stop
              offset="100%"
              stopColor={mapStyle === "dark" ? "#0e291c" : "#b0d49b"}
            />
          </linearGradient>

          {/* Drop shadow for vehicles */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Ocean Background */}
        <rect width="100%" height="100%" fill="url(#oceanGrad)" />

        {/* Realistic Sulawesi Landmass Shape */}
        <g id="landmass">
          {/* Main Island Peninsula */}
          <path
            d="M 180,0 L 220,120 Q 240,220 230,320 L 210,480 Q 240,560 350,600 Q 420,620 480,650 L 900,650 Q 880,500 860,420 Q 820,380 780,340 Q 740,280 750,180 Q 720,80 640,0 Z"
            fill="url(#landGrad)"
            stroke={mapStyle === "dark" ? "#334155" : "#d1c7b7"}
            strokeWidth="1.5"
          />

          {/* Forest & Protected Green Zones */}
          {/* North Forest */}
          <path
            d="M 520,10 Q 560,40 550,70 Q 530,90 550,140 Q 580,180 570,220 Q 530,240 520,280 Q 490,260 500,210 Q 480,180 500,120 Q 490,60 520,10 Z"
            fill="url(#forestGrad)"
            opacity="0.85"
          />
          {/* South Central Green Forest */}
          <path
            d="M 500,320 Q 540,360 530,420 Q 560,480 540,560 Q 500,620 460,650 Q 420,620 440,560 Q 460,480 450,420 Q 440,360 500,320 Z"
            fill="url(#forestGrad)"
            opacity="0.85"
          />

          {/* Off-shore Islands */}
          {/* Pulau Labengke */}
          <path
            d="M 700,60 Q 715,50 720,70 Q 715,85 700,80 Q 690,70 700,60 Z"
            fill="url(#forestGrad)"
            stroke="#b0d49b"
          />
          <text
            x="730"
            y="70"
            fontSize="9"
            fill={mapStyle === "dark" ? "#94a3b8" : "#475569"}
            fontWeight="500"
          >
            Pulau Labengke
          </text>

          {/* Pulau Lambasii */}
          <path
            d="M 680,120 Q 695,110 700,130 Q 690,145 675,140 Z"
            fill="url(#forestGrad)"
          />
          <text
            x="710"
            y="130"
            fontSize="9"
            fill={mapStyle === "dark" ? "#94a3b8" : "#475569"}
            fontWeight="500"
          >
            Pulau Lambasii
          </text>

          {/* Pulau Keramat */}
          <path
            d="M 650,180 Q 665,170 670,190 Q 660,200 645,195 Z"
            fill="url(#forestGrad)"
          />
          <text
            x="680"
            y="190"
            fontSize="9"
            fill={mapStyle === "dark" ? "#94a3b8" : "#475569"}
            fontWeight="500"
          >
            Pulau Keramat
          </text>
        </g>

        {/* Geofence Polygon Overlay (Matching reference: 001,0221) */}
        {showGeofences && (
          <g id="geofences">
            {/* Green Geofence Polygon 1 near Kolaka */}
            <polygon
              points="180,310 260,310 260,380 180,380"
              fill="#22c55e"
              fillOpacity="0.25"
              stroke="#16a34a"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <text
              x="190"
              y="345"
              fontSize="10"
              fontWeight="bold"
              fill="#15803d"
              className="select-none"
            >
              001,0221
            </text>

            {/* Geofence 2: Tiraweta Zone */}
            <polygon
              points="270,260 300,260 300,290 270,290"
              fill="#22c55e"
              fillOpacity="0.5"
              stroke="#16a34a"
              strokeWidth="1"
            />
          </g>
        )}

        {/* Traveled Route Polyline */}
        <g id="route-polyline">
          {/* Glow backdrop */}
          <path
            d="M 265,310 Q 280,285 300,285 L 340,300 Q 370,290 400,320 L 450,310 Q 480,280 510,290 L 580,220 Q 610,210 660,240 L 720,260 Q 750,250 780,270 L 640,340 Q 580,360 520,320"
            fill="none"
            stroke="#0284c7"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#shadow)"
          />
          {/* Main route stroke */}
          <path
            d="M 265,310 Q 280,285 300,285 L 340,300 Q 370,290 400,320 L 450,310 Q 480,280 510,290 L 580,220 Q 610,210 660,240 L 720,260 Q 750,250 780,270 L 640,340 Q 580,360 520,320"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* City & Place Labels */}
        <g id="cities" className="select-none font-semibold text-xs">
          <text x="210" y="325" fill="#334155" fontSize="11" fontWeight="bold">
            Kolaka
          </text>
          <text x="310" y="285" fill="#334155" fontSize="10" fontWeight="bold">
            Tiraweta
          </text>
          <text x="560" y="210" fill="#0284c7" fontSize="11" fontWeight="bold">
            Unaaha
          </text>
          <text
            x="760"
            y="260"
            fill="#0284c7"
            fontSize="12"
            fontWeight="extrabold"
          >
            Kendari
          </text>
          <text x="650" y="470" fill="#475569" fontSize="10">
            Andoolo
          </text>
          <text x="570" y="60" fill="#475569" fontSize="10">
            Wangoudu
          </text>
        </g>

        {/* Live Active Moving Vehicle Marker */}
        <g
          id="active-vehicle"
          transform={"translate(" + truckPos.x + ", " + truckPos.y + ")"}
        >
          {/* Pulse Ripple */}
          <circle
            r="18"
            fill="#22c55e"
            opacity="0.25"
            className="animate-ping"
          />
          <circle r="10" fill="#16a34a" opacity="0.3" />

          {/* Top-down Truck Marker SVG */}
          <g transform={"rotate(" + truckPos.heading + ")"}>
            <rect
              x="-8"
              y="-14"
              width="16"
              height="28"
              rx="3"
              fill="#15803d"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            <rect x="-6" y="-10" width="12" height="5" rx="1" fill="#86efac" />
            <rect
              x="-7"
              y="-2"
              width="14"
              height="14"
              rx="1.5"
              fill="#166534"
            />
            <rect x="-9" y="-12" width="2" height="5" rx="0.5" fill="#18181b" />
            <rect x="7" y="-12" width="2" height="5" rx="0.5" fill="#18181b" />
            <rect x="-9" y="5" width="2" height="5" rx="0.5" fill="#18181b" />
            <rect x="7" y="5" width="2" height="5" rx="0.5" fill="#18181b" />
          </g>

          {/* Floating Speed & Name Badge */}
          <g transform="translate(-35, 18)">
            <rect
              width="70"
              height="16"
              rx="3"
              fill="#16a34a"
              stroke="#ffffff"
              strokeWidth="1"
              filter="url(#shadow)"
            />
            <text
              x="35"
              y="11.5"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="9"
              fontWeight="bold"
              fontFamily="ui-monospace, monospace"
            >
              1001 - 12 km/h
            </text>
          </g>
        </g>
      </svg>

      {/* 2. Top Center Floating Playback Action Button */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
        <button
          type="button"
          onClick={onOpenPlayback}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 font-bold text-xs shadow-lg transition-all transform hover:scale-105 cursor-pointer"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>Playback</span>
        </button>
      </div>

      {/* 3. Floating Right Map Toolbars */}
      <div className="absolute right-3 top-3 z-20 flex flex-col gap-1.5">
        {/* Toggle Right Telemetry Sidecar Drawer Button */}
        <button
          type="button"
          title={
            isTelemetryDrawerOpen
              ? "Collapse Telemetry Panel"
              : "Expand Telemetry Panel"
          }
          onClick={onToggleTelemetryDrawer}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/95 backdrop-blur-md text-foreground shadow-md hover:bg-muted transition-colors cursor-pointer font-bold"
        >
          {isTelemetryDrawerOpen ? ">>" : "<<"}
        </button>

        {/* Map Tool Actions Stack */}
        <div className="flex flex-col rounded-lg border border-border bg-card/95 backdrop-blur-md shadow-md divide-y divide-border/60 overflow-hidden">
          {/* Search POI */}
          <button
            type="button"
            title="Search on Map"
            className="flex h-7 w-8 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <Search className="h-3.5 w-3.5" />
          </button>

          {/* Map Layer Switch */}
          <button
            type="button"
            title="Change Map Layer"
            onClick={() =>
              setMapStyle((s) =>
                s === "terrain"
                  ? "satellite"
                  : s === "satellite"
                    ? "streets"
                    : "terrain",
              )
            }
            className="flex h-7 w-8 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <Layers className="h-3.5 w-3.5" />
          </button>

          {/* Geofences Toggle */}
          <button
            type="button"
            title="Toggle Geofences"
            onClick={() => setShowGeofences((v) => !v)}
            className={cn(
              "flex h-7 w-8 items-center justify-center transition-colors cursor-pointer",
              showGeofences
                ? "text-blue-600 font-bold bg-blue-500/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            <Square className="h-3.5 w-3.5" />
          </button>

          {/* POIs Toggle */}
          <button
            type="button"
            title="Toggle Landmarks & POIs"
            onClick={() => setShowPOIs((v) => !v)}
            className={cn(
              "flex h-7 w-8 items-center justify-center transition-colors cursor-pointer",
              showPOIs
                ? "text-blue-600 font-bold bg-blue-500/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            <MapPin className="h-3.5 w-3.5" />
          </button>

          {/* Traffic Layer Toggle */}
          <button
            type="button"
            title="Toggle Live Traffic"
            onClick={() => setShowTraffic((v) => !v)}
            className={cn(
              "flex h-7 w-8 items-center justify-center transition-colors cursor-pointer",
              showTraffic
                ? "text-rose-600 font-bold bg-rose-500/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            <TrafficCone className="h-3.5 w-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            title="Toggle Fullscreen"
            onClick={toggleFullscreen}
            className="flex h-7 w-8 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex flex-col rounded-lg border border-border bg-card/95 backdrop-blur-md shadow-md divide-y divide-border/60 overflow-hidden">
          <button
            type="button"
            title="Zoom In"
            onClick={() => setZoomLevel((z) => Math.min(18, z + 1))}
            className="flex h-7 w-8 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Zoom Out"
            onClick={() => setZoomLevel((z) => Math.max(4, z - 1))}
            className="flex h-7 w-8 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Bottom Right Map Scale Bar */}
      <div className="absolute bottom-3 right-3 z-10 flex flex-col items-center select-none">
        <div className="flex items-center gap-1 bg-card/85 backdrop-blur-xs px-2 py-0.5 rounded border border-border/80 text-[10px] font-mono text-muted-foreground shadow-xs">
          <span>10 km</span>
          <div className="h-1.5 w-12 border-b-2 border-l-2 border-r-2 border-foreground" />
        </div>
      </div>
    </div>
  );
}
