import {
  Activity,
  AlertTriangle,
  Boxes,
  Calculator,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Compass,
  Eye,
  Gauge,
  GitCompare,
  Grid2x2,
  Layers,
  ListFilter,
  Locate,
  LocateFixed,
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
  ShieldCheck,
  SlidersHorizontal,
  Square,
  Tag,
  Target,
  ThumbsUp,
  Timer,
  TrafficCone,
  TrendingUp,
  Truck,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "sonner";
import { type FleetObject, STATUS_META } from "@/data/fleet";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const CLUSTERS_DATA = [
  {
    id: "cluster-1",
    label: "India Fleet",
    count: 15,
    lat: 20.5937,
    lng: 78.9629,
    left: "35%",
    top: "33.8%",
    svgCircles: [
      { stroke: "#EF4444", dashArray: "33 71", dashOffset: 0 },
      { stroke: "#10B981", dashArray: "52 52", dashOffset: -33 },
      { stroke: "#F59E0B", dashArray: "21 83", dashOffset: -85 },
    ],
    stats: { running: 8, idle: 3, stopped: 2, inactive: 1, nodata: 1 },
    vehicles: [
      { id: "veh-1", name: "1234 ABC", status: "running", speed: 45 },
      { id: "veh-2", name: "5678 DEF", status: "idle", speed: 0 },
      { id: "veh-3", name: "9101 GHI", status: "running", speed: 62 },
      { id: "veh-4", name: "1121 JKL", status: "running", speed: 50 },
      { id: "veh-5", name: "5141 MNO", status: "running", speed: 38 },
      { id: "veh-6", name: "5161 PQR", status: "running", speed: 41 },
      { id: "veh-7", name: "7181 STU", status: "stopped", speed: 0, alert: true },
      { id: "veh-8", name: "9202 VWX", status: "running", speed: 70 },
      { id: "veh-9", name: "2233 YZA", status: "stopped", speed: 0, alert: true },
      { id: "veh-10", name: "4455 BCD", status: "inactive", speed: 0 },
      { id: "veh-11", name: "6677 EFG", status: "running", speed: 55 },
      { id: "veh-12", name: "8899 HIJ", status: "running", speed: 48 },
      { id: "veh-13", name: "0001 KLM", status: "idle", speed: 0 },
      { id: "veh-14", name: "2345 NOP", status: "idle", speed: 0 },
      { id: "veh-15", name: "6789 QRS", status: "nodata", speed: 0 },
    ],
  },
  {
    id: "cluster-2",
    label: "Mumbai Region",
    count: 7,
    lat: 19.0760,
    lng: 72.8777,
    left: "32%",
    top: "44.6%",
    svgCircles: [
      { stroke: "#10B981", dashArray: "62 42", dashOffset: 0 },
      { stroke: "#EF4444", dashArray: "42 62", dashOffset: -62 },
    ],
    stats: { running: 4, idle: 2, stopped: 1, inactive: 0, nodata: 0 },
    vehicles: [
      { id: "veh-5", name: "MH04AB1234", status: "running", speed: 52 },
      { id: "veh-6", name: "MH45NO5678", status: "stopped", speed: 0, alert: true },
      { id: "veh-7", name: "Mercedes GLE 300d", status: "running", speed: 99 },
      { id: "veh-8", name: "Scania - 1004", status: "idle", speed: 0 },
      { id: "veh-9", name: "Temperature - 1005", status: "running", speed: 45 },
      { id: "veh-10", name: "RPM - 130004", status: "running", speed: 71 },
      { id: "veh-11", name: "SOC - 130002", status: "idle", speed: 0 },
    ],
  },
  {
    id: "cluster-3",
    label: "Thailand Fleet",
    count: 3,
    lat: 13.7563,
    lng: 100.5018,
    left: "48%",
    top: "43.1%",
    svgCircles: [
      { stroke: "#10B981", dashArray: "73 31", dashOffset: 0 },
      { stroke: "#F59E0B", dashArray: "31 73", dashOffset: -73 },
    ],
    stats: { running: 2, idle: 1, stopped: 0, inactive: 0, nodata: 0 },
    vehicles: [
      { id: "veh-12", name: "BUS - 130003", status: "running", speed: 135 },
      { id: "veh-13", name: "Fuel - 130001", status: "idle", speed: 0 },
      { id: "veh-14", name: "RPM - 130004", status: "running", speed: 71 },
    ],
  },
  {
    id: "cluster-4",
    label: "South East",
    count: 2,
    lat: 3.1390,
    lng: 101.6869,
    left: "53%",
    top: "45.4%",
    svgCircles: [
      { stroke: "#10B981", dashArray: "52 52", dashOffset: 0 },
      { stroke: "#0089FF", dashArray: "52 52", dashOffset: -52 },
    ],
    stats: { running: 1, idle: 0, stopped: 0, inactive: 1, nodata: 0 },
    vehicles: [
      { id: "veh-15", name: "SOC - 130002", status: "running", speed: 135 },
      { id: "veh-16", name: "Temperature - 12394", status: "inactive", speed: 0 },
    ],
  },
  {
    id: "cluster-5",
    label: "Indonesia Sulawesi",
    count: 4,
    lat: -5.1477,
    lng: 119.4327,
    left: "76%",
    top: "80%",
    svgCircles: [
      { stroke: "#10B981", dashArray: "78 26", dashOffset: 0 },
      { stroke: "#F59E0B", dashArray: "26 78", dashOffset: -78 },
    ],
    stats: { running: 3, idle: 1, stopped: 0, inactive: 0, nodata: 0 },
    vehicles: [
      { id: "veh-17", name: "Fuel - 1001", status: "running", speed: 107 },
      { id: "veh-18", name: "Mercedes GLE 300d", status: "running", speed: 99 },
      { id: "veh-19", name: "Scania - 1004", status: "running", speed: 102 },
      { id: "veh-20", name: "Temperature - 1005", status: "idle", speed: 0 },
    ],
  },
];

export function LiveTrackingMap({
  selectedVehicle,
  checkedVehicles,
  onOpenPlayback,
  isLeftPanelOpen = true,
  leftPanelWidth = 630,
  isTelemetryDrawerOpen,
  onToggleTelemetryDrawer,
  onSelectVehicle,
  className,
}: {
  selectedVehicle: FleetObject;
  checkedVehicles: FleetObject[];
  onOpenPlayback: () => void;
  isLeftPanelOpen?: boolean;
  leftPanelWidth?: number;
  isTelemetryDrawerOpen: boolean;
  onToggleTelemetryDrawer: () => void;
  onSelectVehicle?: (id: string) => void;
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
  const [activeHealthTab, setActiveHealthTab] = useState<"safety" | "efficiency" | "risk" | "discipline">("safety");

  // Cluster hover and click popover state
  const [hoveredClusterId, setHoveredClusterId] = useState<string | null>(null);
  const [activeClusterId, setActiveClusterId] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  const [clusterScreenCoords, setClusterScreenCoords] = useState<Record<string, { x: number; y: number }>>({});
  const [activeVehicleCoord, setActiveVehicleCoord] = useState<{ x: number; y: number } | null>(null);

  // Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapElementRef.current || mapInstanceRef.current) return;

    const map = L.map(mapElementRef.current, {
      center: [15.8700, 95.0000],
      zoom: 4,
      zoomControl: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    const syncPositions = () => {
      const coords: Record<string, { x: number; y: number }> = {};
      CLUSTERS_DATA.forEach((cluster) => {
        const pt = map.latLngToContainerPoint([cluster.lat, cluster.lng]);
        coords[cluster.id] = { x: pt.x, y: pt.y };
      });
      setClusterScreenCoords(coords);

      const vehPt = map.latLngToContainerPoint([19.0760, 72.8777]);
      setActiveVehicleCoord({ x: vehPt.x, y: vehPt.y });
    };

    map.on("move zoom viewreset resize", syncPositions);
    syncPositions();

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Leaflet Tile Layer on mapStyle change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const tileConfigs = {
      streets: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        subdomains: "abc",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
      satellite: {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}",
        subdomains: "a",
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS",
      },
      dark: {
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        subdomains: "abcd",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      },
      terrain: {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{x}/{y}",
        subdomains: "a",
        attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
      },
    };

    const cfg = tileConfigs[mapStyle];
    const layer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      subdomains: cfg.subdomains || "a",
      maxZoom: 19,
    });
    layer.addTo(mapInstanceRef.current);
    tileLayerRef.current = layer;
  }, [mapStyle]);

  // Sync polyline active vehicle route path
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (polylineRef.current) {
      mapInstanceRef.current.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    if (showObjectPath) {
      const routePoints: [number, number][] = [
        [19.0760, 72.8777],
        [19.0820, 72.8850],
        [19.0910, 72.8940],
        [19.1020, 72.9030],
        [19.1150, 72.9150],
      ];
      const polyline = L.polyline(routePoints, {
        color: "#0089FF",
        weight: 4,
        dashArray: "6, 8",
        opacity: 0.9,
      }).addTo(mapInstanceRef.current);
      polylineRef.current = polyline;
    }
  }, [showObjectPath]);

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

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleRecenter = () => {
    mapInstanceRef.current?.flyTo([19.0760, 72.8777], 13);
    toast.success("Map re-centered to selected vehicle");
  };



  const leftOffset = isLeftPanelOpen ? leftPanelWidth + 24 : 16;
  const rightOffset = isTelemetryDrawerOpen ? 255 : 16;
  const healthBarCenterShift = Math.round((leftOffset - rightOffset) / 2);

  return (
    <div
      ref={mapContainerRef}
      className={cn(
        "relative flex-1 h-full w-full overflow-hidden bg-[#E8ECE9] dark:bg-[#151D2A] select-none",
        className,
      )}
    >
      {/* 1. Real Interactive Leaflet Tile Map Engine */}
      <div
        ref={mapElementRef}
        className="absolute inset-0 h-full w-full z-0 cursor-grab active:cursor-grabbing"
      />

      {/* 2. Exact 40px Fixed Diameter Map Clusters with Hover Menu & Click Popover Overlay */}
      {showClusters && (
        <>
          {CLUSTERS_DATA.map((cluster) => {
            const isHovered = hoveredClusterId === cluster.id;
            const isActive = activeClusterId === cluster.id;
            const pos = clusterScreenCoords[cluster.id];

            const style = pos
              ? { left: `${pos.x}px`, top: `${pos.y}px` }
              : { left: cluster.left, top: cluster.top };

            return (
              <div
                key={cluster.id}
                style={style}
                onMouseEnter={() => setHoveredClusterId(cluster.id)}
                onMouseLeave={() => setHoveredClusterId(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-300 cursor-pointer"
              >
                {/* SVG Cluster Ring */}
                <div
                  onClick={() => {
                    setActiveClusterId((prev) => (prev === cluster.id ? null : cluster.id));
                  }}
                  className="relative flex items-center justify-center h-10 w-10 transition-transform duration-200 hover:scale-110 active:scale-95"
                >
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 40 40">
                    <circle
                      cx="20"
                      cy="20"
                      r="16.5"
                      fill="white"
                      className="dark:fill-slate-900 shadow-md"
                    />
                    {cluster.svgCircles.map((c, i) => (
                      <circle
                        key={i}
                        cx="20"
                        cy="20"
                        r="16.5"
                        fill="none"
                        stroke={c.stroke}
                        strokeWidth="3.5"
                        strokeDasharray={c.dashArray}
                        strokeDashoffset={c.dashOffset}
                      />
                    ))}
                  </svg>

                  <span className="absolute font-extrabold text-xs text-slate-900 dark:text-slate-100 font-mono">
                    {cluster.count}
                  </span>
                </div>

                {/* Hover Menu Badge Icon (Appears on Hover next to cluster ring) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveClusterId((prev) => (prev === cluster.id ? null : cluster.id));
                  }}
                  className={cn(
                    "absolute left-full top-1/2 -translate-y-1/2 ml-1.5 p-1 rounded-md bg-[#0089FF] text-white shadow-md transition-all duration-200 cursor-pointer flex items-center gap-1",
                    isHovered || isActive ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-75 -translate-x-2 pointer-events-none",
                  )}
                  title="Open Object List for this Cluster"
                >
                  <ListFilter className="h-3.5 w-3.5" />
                </button>

                {/* Click Popover Object List Overlay (Matching Screenshot media_1790059147228.png) */}
                {isActive && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-3 w-[260px] bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden select-none z-50 animate-in zoom-in-95 duration-200"
                  >
                    {/* Header matching reference */}
                    <div className="flex items-center justify-between px-3.5 py-2 bg-[#0F172A] text-white">
                      <div className="flex items-center gap-2">
                        <ListFilter className="h-4 w-4 text-[#0089FF]" />
                        <span className="text-xs font-bold tracking-wide">Object List</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveClusterId(null)}
                        className="p-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Status KPI Pills summary bar matching reference */}
                    <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800/80 border-b border-[#DFE3EB] dark:border-slate-700/60 text-[10px] font-bold">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                        {cluster.stats.running}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300">
                        {cluster.stats.idle}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-700 dark:text-rose-300">
                        {cluster.stats.stopped}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-700 dark:text-indigo-300">
                        {cluster.stats.inactive}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-500/15 text-slate-700 dark:text-slate-300">
                        {cluster.stats.nodata}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#0089FF]/15 text-[#0089FF] font-black">
                        {cluster.count}
                      </span>
                    </div>

                    {/* Vehicles list in cluster */}
                    <div className="max-h-[220px] overflow-y-auto custom-scrollbar divide-y divide-[#DFE3EB]/60 dark:divide-slate-800 text-xs">
                      {cluster.vehicles.map((v, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            if (onSelectVehicle) onSelectVehicle(v.id);
                            toast.info(`Selected vehicle ${v.name} from cluster`);
                            setActiveClusterId(null);
                          }}
                          className={cn(
                            "flex items-center justify-between px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer",
                            v.alert && "bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200",
                          )}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={cn(
                                "h-2 w-2 rounded-full shrink-0",
                                v.status === "running"
                                  ? "bg-emerald-500"
                                  : v.status === "idle"
                                    ? "bg-amber-500"
                                    : v.status === "stopped"
                                      ? "bg-rose-500"
                                      : "bg-indigo-500",
                              )}
                            />
                            <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate">
                              {v.name}
                            </span>
                          </div>
                          {v.alert && (
                            <AlertTriangle className="h-3.5 w-3.5 text-rose-500 shrink-0 fill-rose-500/20" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* 3. Selected Active Vehicle Marker Pin + Ultra Minimal Vehicle Label */}
      <div
        style={
          activeVehicleCoord
            ? { left: `${activeVehicleCoord.x}px`, top: `${activeVehicleCoord.y}px` }
            : { left: "58%", top: "52.3%" }
        }
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

      {/* 2. Top Center Floating Playback & Health Scores Dock Bar (Dynamic Map Canvas Fit) */}
      <div
        className="absolute top-2.5 z-20 flex items-center justify-center transition-all duration-300 pointer-events-none select-none"
        style={{
          left: isLeftPanelOpen ? `${leftPanelWidth + 16}px` : "16px",
          right: isTelemetryDrawerOpen ? "288px" : "46px",
        }}
      >
        <div className="pointer-events-auto flex items-center gap-2.5 max-w-full overflow-x-auto no-scrollbar py-0.5 px-1">
          {/* Standalone Playback Button Card */}
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onOpenPlayback}
                  className="h-11 w-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-center text-[#0089FF] hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer shrink-0 active:scale-95"
                >
                  <Play className="h-4 w-4 fill-[#0089FF] text-[#0089FF] ml-0.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Playback</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Health Score Dock Bar Container (Matching media_1790248530674.png) */}
          <div className="h-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md p-1 flex items-center gap-1 text-xs font-semibold shrink-0">
            {/* Safety */}
            <button
              type="button"
              onClick={() => {
                setActiveHealthTab("safety");
                toast.info("Safety Index: 85/100");
              }}
              className={cn(
                "px-3.5 py-1.5 rounded-xl flex items-center gap-2.5 transition-all duration-200 cursor-pointer shrink-0",
                activeHealthTab === "safety"
                  ? "bg-[#EBF9F0] dark:bg-emerald-950/50 text-slate-900 dark:text-slate-100 font-bold"
                  : "bg-transparent hover:bg-slate-100/70 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-medium",
              )}
            >
              <div className="h-5 w-5 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck className="h-3 w-3 stroke-[3]" />
              </div>
              <span className="text-xs">Safety</span>
              <span className="font-extrabold text-[#10B981] text-xs font-mono ml-0.5">85</span>
            </button>

            {/* Efficiency */}
            <button
              type="button"
              onClick={() => {
                setActiveHealthTab("efficiency");
                toast.info("Efficiency Index: 72/100");
              }}
              className={cn(
                "px-3.5 py-1.5 rounded-xl flex items-center gap-2.5 transition-all duration-200 cursor-pointer shrink-0",
                activeHealthTab === "efficiency"
                  ? "bg-[#FFFBEB] dark:bg-amber-950/50 text-slate-900 dark:text-slate-100 font-bold"
                  : "bg-transparent hover:bg-slate-100/70 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-medium",
              )}
            >
              <Timer className="h-4.5 w-4.5 text-[#D97706] shrink-0 stroke-[2.2]" />
              <span className="text-xs">Efficiency</span>
              <span className="font-extrabold text-[#D97706] text-xs font-mono ml-0.5">72</span>
            </button>

            {/* Risk */}
            <button
              type="button"
              onClick={() => {
                setActiveHealthTab("risk");
                toast.info("Risk Level: 15 (Low Risk)");
              }}
              className={cn(
                "px-3.5 py-1.5 rounded-xl flex items-center gap-2.5 transition-all duration-200 cursor-pointer shrink-0",
                activeHealthTab === "risk"
                  ? "bg-[#FEF2F2] dark:bg-rose-950/50 text-slate-900 dark:text-slate-100 font-bold"
                  : "bg-transparent hover:bg-slate-100/70 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-medium",
              )}
            >
              <AlertTriangle className="h-4.5 w-4.5 text-[#EF4444] fill-[#EF4444] stroke-white shrink-0" />
              <span className="text-xs">Risk</span>
              <span className="font-extrabold text-[#EF4444] text-xs font-mono ml-0.5">15</span>
            </button>

            {/* Discipline */}
            <button
              type="button"
              onClick={() => {
                setActiveHealthTab("discipline");
                toast.info("Route Discipline: 98/100");
              }}
              className={cn(
                "px-3.5 py-1.5 rounded-xl flex items-center gap-2.5 transition-all duration-200 cursor-pointer shrink-0",
                activeHealthTab === "discipline"
                  ? "bg-[#F0F9FF] dark:bg-sky-950/50 text-slate-900 dark:text-slate-100 font-bold"
                  : "bg-transparent hover:bg-slate-100/70 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-medium",
              )}
            >
              <ThumbsUp className="h-4.5 w-4.5 text-[#0089FF] fill-[#0089FF] shrink-0" />
              <span className="text-xs">Discipline</span>
              <span className="font-extrabold text-[#0089FF] text-xs font-mono ml-0.5">98</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Right Floating Map Controls Vertical Toolbar (14 GIS Tools in Exact Specified Order) */}
      <div
        className={cn(
          "w-[35px] absolute top-2.5 z-20 flex flex-col items-center gap-0.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-1 shadow-xl transition-all duration-200 overflow-hidden select-none",
          isTelemetryDrawerOpen ? "right-[246px]" : "right-2.5",
        )}
      >
        <TooltipProvider delayDuration={150}>
          {/* Telemetry Drawer Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onToggleTelemetryDrawer}
                className="w-[27px] h-[27px] rounded-xl flex items-center justify-center bg-[#0089FF] text-white shadow-xs hover:bg-[#0070d6] active:scale-95 transition-all cursor-pointer shrink-0"
              >
                {isTelemetryDrawerOpen ? (
                  <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                ) : (
                  <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">
              {isTelemetryDrawerOpen ? "Close Telemetry Panel" : "Open Telemetry Panel"}
            </TooltipContent>
          </Tooltip>

          <div className="w-4 my-0.5 border-t border-[#DFE3EB] dark:border-slate-800" />

          {/* 1. Select Map */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() =>
                  setMapStyle((s) => (s === "streets" ? "satellite" : s === "satellite" ? "dark" : "streets"))
                }
                className={cn(
                  "w-[27px] h-[27px] rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0",
                  mapStyle !== "streets"
                    ? "bg-[#0089FF]/12 text-[#0089FF] shadow-xs"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF]",
                )}
              >
                <Layers className="h-4 w-4 stroke-[2.2]" />
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
                  "w-[27px] h-[27px] rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0",
                  !showClusters
                    ? "bg-[#0089FF]/12 text-[#0089FF] shadow-xs"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF]",
                )}
              >
                <CircleDot className="h-4 w-4 stroke-[2.2]" />
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
                  "w-[27px] h-[27px] rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0",
                  showObjectPath
                    ? "bg-[#0089FF]/12 text-[#0089FF] shadow-xs"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF]",
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
                  "w-[27px] h-[27px] rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0",
                  showLabels
                    ? "bg-[#0089FF]/12 text-[#0089FF] shadow-xs"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF]",
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
                className="w-[27px] h-[27px] rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF] transition-all cursor-pointer shrink-0"
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
                className="w-[27px] h-[27px] rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF] transition-all cursor-pointer shrink-0"
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
                  "w-[27px] h-[27px] rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0",
                  singleObjectMode
                    ? "bg-[#0089FF]/12 text-[#0089FF] shadow-xs"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF]",
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
                  "w-[27px] h-[27px] rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0",
                  areaMeasurementActive
                    ? "bg-[#0089FF]/12 text-[#0089FF] shadow-xs"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF]",
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
                className="w-[27px] h-[27px] rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF] transition-all cursor-pointer shrink-0"
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
                onClick={handleRecenter}
                className="w-[27px] h-[27px] rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF] transition-all cursor-pointer shrink-0"
              >
                <LocateFixed className="h-4 w-4 stroke-[2.2]" />
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
                className="w-[27px] h-[27px] rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF] transition-all cursor-pointer shrink-0"
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
                  "w-[27px] h-[27px] rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0",
                  taxiMeterActive
                    ? "bg-[#0089FF]/12 text-[#0089FF] shadow-xs"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF]",
                )}
              >
                <Gauge className="h-4 w-4 stroke-[2.2]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Taxi meter</TooltipContent>
          </Tooltip>

          <div className="w-4 my-0.5 border-t border-[#DFE3EB] dark:border-slate-800" />

          {/* 13. Zoom in */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleZoomIn}
                className="w-[27px] h-[27px] rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF] transition-all cursor-pointer shrink-0"
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
                className="w-[27px] h-[27px] rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF] transition-all cursor-pointer shrink-0"
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
        style={{ right: isTelemetryDrawerOpen ? "246px" : "10px" }}
        className="absolute bottom-3 z-10 flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-3 py-1 rounded-xl border border-[#DFE3EB] dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 transition-all duration-300 shadow-sm"
      >
        <span>0.05 km</span>
        <div className="w-8 h-1 bg-slate-800 dark:bg-slate-200" />
      </div>

    </div>
  );
}
