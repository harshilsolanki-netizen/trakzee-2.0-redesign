import {
  Activity,
  AlertTriangle,
  Boxes,
  Calculator,
  Check,
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
  Map as MapIcon,
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
import { GEOFENCES_DATA } from "@/data/geofences";
import { type NavigationRoute } from "./NavigationModeModal";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface MapSubOption {
  id: string;
  name: string;
  url: string;
  subdomains?: string;
  attribution: string;
  maxZoom?: number;
}

export interface MapProvider {
  id: string;
  name: string;
  subOptions: MapSubOption[];
}

export const MAP_PROVIDERS: MapProvider[] = [
  {
    id: "osm",
    name: "OSM",
    subOptions: [
      {
        id: "osm-standard",
        name: "OSM Standard",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        subdomains: "abc",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      },
      {
        id: "osm-humanitarian",
        name: "OSM Humanitarian",
        url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        subdomains: "abc",
        attribution: '&copy; OpenStreetMap contributors, Humanitarian OpenStreetMap Team',
        maxZoom: 19,
      },
      {
        id: "osm-topo",
        name: "OSM Topo",
        url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        subdomains: "abc",
        attribution: '&copy; OpenStreetMap, SRTM | &copy; OpenTopoMap',
        maxZoom: 17,
      },
      {
        id: "osm-voyager",
        name: "OSM Voyager",
        url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        subdomains: "abcd",
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 20,
      },
    ],
  },
  {
    id: "bing",
    name: "Bing",
    subOptions: [
      {
        id: "bing-road",
        name: "Bing Road",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{x}/{y}",
        subdomains: "a",
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS",
        maxZoom: 19,
      },
      {
        id: "bing-aerial",
        name: "Bing Aerial",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}",
        subdomains: "a",
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS",
        maxZoom: 19,
      },
      {
        id: "bing-hybrid",
        name: "Bing Hybrid",
        url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        attribution: "Bing / Hybrid Imagery",
        maxZoom: 20,
      },
    ],
  },
  {
    id: "google",
    name: "Google",
    subOptions: [
      {
        id: "google-roadmap",
        name: "Google Roadmap",
        url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
        attribution: "&copy; Google Maps",
        maxZoom: 20,
      },
      {
        id: "google-satellite",
        name: "Google Satellite",
        url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
        attribution: "&copy; Google Maps",
        maxZoom: 20,
      },
      {
        id: "google-hybrid",
        name: "Google Hybrid",
        url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        attribution: "&copy; Google Maps",
        maxZoom: 20,
      },
      {
        id: "google-terrain",
        name: "Google Terrain",
        url: "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
        attribution: "&copy; Google Maps",
        maxZoom: 20,
      },
    ],
  },
  {
    id: "here",
    name: "Here",
    subOptions: [
      {
        id: "here-normal",
        name: "Here Normal Day",
        url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        subdomains: "abcd",
        attribution: "&copy; HERE Maps &copy; OpenStreetMap",
        maxZoom: 20,
      },
      {
        id: "here-satellite",
        name: "Here Satellite",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}",
        subdomains: "a",
        attribution: "&copy; HERE Satellite &copy; Esri",
        maxZoom: 19,
      },
      {
        id: "here-hybrid",
        name: "Here Hybrid",
        url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        attribution: "&copy; HERE Hybrid",
        maxZoom: 20,
      },
      {
        id: "here-terrain",
        name: "Here Terrain",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{x}/{y}",
        subdomains: "a",
        attribution: "&copy; HERE Terrain &copy; Esri",
        maxZoom: 19,
      },
    ],
  },
  {
    id: "tomtom",
    name: "TomTom",
    subOptions: [
      {
        id: "tomtom-basic",
        name: "TomTom Basic",
        url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        subdomains: "abcd",
        attribution: "&copy; TomTom &copy; CARTO",
        maxZoom: 20,
      },
      {
        id: "tomtom-night",
        name: "TomTom Night",
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        subdomains: "abcd",
        attribution: "&copy; TomTom &copy; CARTO",
        maxZoom: 20,
      },
    ],
  },
  {
    id: "netstar",
    name: "NETSTAR",
    subOptions: [
      {
        id: "netstar-traffic",
        name: "NETSTAR Traffic",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        subdomains: "abc",
        attribution: "&copy; NETSTAR Telematics",
        maxZoom: 19,
      },
      {
        id: "netstar-hybrid",
        name: "NETSTAR Hybrid",
        url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        attribution: "&copy; NETSTAR Hybrid",
        maxZoom: 20,
      },
    ],
  },
];

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
      { stroke: "#C70036", dashArray: "33 71", dashOffset: 0 },
      { stroke: "#008446", dashArray: "52 52", dashOffset: -33 },
      { stroke: "#C46F37", dashArray: "21 83", dashOffset: -85 },
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
      { stroke: "#008446", dashArray: "62 42", dashOffset: 0 },
      { stroke: "#C70036", dashArray: "42 62", dashOffset: -62 },
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
      { stroke: "#008446", dashArray: "73 31", dashOffset: 0 },
      { stroke: "#C46F37", dashArray: "31 73", dashOffset: -73 },
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
      { stroke: "#008446", dashArray: "52 52", dashOffset: 0 },
      { stroke: "#372AAC", dashArray: "52 52", dashOffset: -52 },
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
      { stroke: "#008446", dashArray: "78 26", dashOffset: 0 },
      { stroke: "#C46F37", dashArray: "26 78", dashOffset: -78 },
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
  checkedGeofenceIds,
  selectedGeofenceId,
  onOpenPlayback,
  isLeftPanelOpen = true,
  leftPanelWidth = 630,
  isTelemetryDrawerOpen,
  isHealthTelemetryOnly = false,
  onToggleTelemetryDrawer,
  activeTab,
  onSelectVehicle,
  onToggleFollowPanel,
  isFollowPanelOpen = false,
  followedCount = 0,
  onOpenShare,
  onOpenFindNearBy,
  navigationRoute,
  className,
}: {
  selectedVehicle: FleetObject | null;
  checkedVehicles: FleetObject[];
  checkedGeofenceIds?: string[];
  selectedGeofenceId?: string | null;
  onOpenPlayback: (timeframe?: string) => void;
  isLeftPanelOpen?: boolean;
  leftPanelWidth?: number;
  isTelemetryDrawerOpen: boolean;
  isHealthTelemetryOnly?: boolean;
  onToggleTelemetryDrawer: () => void;
  activeTab?: string;
  onSelectVehicle?: (id: string) => void;
  onToggleFollowPanel?: () => void;
  isFollowed?: boolean;
  isFollowPanelOpen?: boolean;
  followedCount?: number;
  onOpenShare?: (vehicle?: FleetObject | null) => void;
  onOpenFindNearBy?: (vehicle?: FleetObject | null) => void;
  navigationRoute?: NavigationRoute | null;
  className?: string;
}) {
  const [mapStyle, setMapStyle] = useState<"streets" | "satellite" | "terrain" | "dark">("streets");
  const [activeMapLayer, setActiveMapLayer] = useState<MapSubOption>(
    MAP_PROVIDERS.find((p) => p.id === "google")?.subOptions[0] || MAP_PROVIDERS[0].subOptions[0]
  );
  const [isSelectMapOpen, setIsSelectMapOpen] = useState(false);
  const [hoveredProviderId, setHoveredProviderId] = useState<string>("google");
  const selectMapMenuRef = useRef<HTMLDivElement>(null);
  const hoveredIndex = MAP_PROVIDERS.findIndex((p) => p.id === hoveredProviderId);
  const hoveredProvider = MAP_PROVIDERS[hoveredIndex !== -1 ? hoveredIndex : 2];
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
  const isHealthScorePage = activeTab === "health" || isHealthTelemetryOnly;

  // Cluster hover and click popover state
  const [hoveredClusterId, setHoveredClusterId] = useState<string | null>(null);
  const [activeClusterId, setActiveClusterId] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const navigationLayerRef = useRef<{ polyline: L.Polyline; marker: L.Marker } | null>(null);

  const [clusterScreenCoords, setClusterScreenCoords] = useState<Record<string, { x: number; y: number }>>({});
  const [activeVehicleCoord, setActiveVehicleCoord] = useState<{ x: number; y: number } | null>(null);

  // Initialize Leaflet Map Instance
  useEffect(() => {
    if (typeof window === "undefined" || !mapElementRef.current || mapInstanceRef.current) return;

    const map = L.map(mapElementRef.current, {
      center: [45.0000, 71.0000],
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
      boxZoom: true,
      keyboard: true,
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

    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    if (mapElementRef.current) {
      resizeObserver.observe(mapElementRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      if (navigationLayerRef.current && mapInstanceRef.current) {
        try {
          mapInstanceRef.current.removeLayer(navigationLayerRef.current.polyline);
          mapInstanceRef.current.removeLayer(navigationLayerRef.current.marker);
        } catch (_) {}
        navigationLayerRef.current = null;
      }
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Listen for global map zoom and route fit events
  useEffect(() => {
    const handleZoomInEvent = () => mapInstanceRef.current?.zoomIn();
    const handleZoomOutEvent = () => mapInstanceRef.current?.zoomOut();
    const handleFitRouteEvent = () => {
      try {
        if (polylineRef.current && mapInstanceRef.current) {
          const bounds = polylineRef.current.getBounds();
          if (bounds && bounds.isValid()) {
            mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
          }
        }
      } catch (err) {
        console.warn("Safely caught map-fit-route error:", err);
      }
    };

    window.addEventListener("map-zoom-in", handleZoomInEvent);
    window.addEventListener("map-zoom-out", handleZoomOutEvent);
    window.addEventListener("map-fit-route", handleFitRouteEvent);

    return () => {
      window.removeEventListener("map-zoom-in", handleZoomInEvent);
      window.removeEventListener("map-zoom-out", handleZoomOutEvent);
      window.removeEventListener("map-fit-route", handleFitRouteEvent);
    };
  }, []);

  // Update Leaflet Tile Layer on activeMapLayer change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const layer = L.tileLayer(activeMapLayer.url, {
      attribution: activeMapLayer.attribution,
      subdomains: activeMapLayer.subdomains || "abc",
      maxZoom: activeMapLayer.maxZoom || 19,
    });
    layer.addTo(mapInstanceRef.current);
    tileLayerRef.current = layer;
  }, [activeMapLayer]);

  // Close Select Map flyout on click outside or escape key
  useEffect(() => {
    if (!isSelectMapOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (selectMapMenuRef.current && !selectMapMenuRef.current.contains(e.target as Node)) {
        setIsSelectMapOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSelectMapOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSelectMapOpen]);

  // Sync polyline active vehicle route path
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (polylineRef.current) {
      mapInstanceRef.current.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    if (showObjectPath) {
      const routePoints: [number, number][] = [
        [51.1693, 71.4491],
        [49.8019, 73.1021],
        [44.8528, 65.5092],
        [43.2389, 76.8897],
        [42.8746, 74.5698],
        [41.2995, 69.2401],
        [38.5598, 68.7870],
      ];
      const polyline = L.polyline(routePoints, {
        color: "#0089FF",
        weight: 5,
        opacity: 0.9,
      }).addTo(mapInstanceRef.current);
      polylineRef.current = polyline;

      try {
        const bounds = polyline.getBounds();
        if (bounds && bounds.isValid() && mapInstanceRef.current) {
          mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
        }
      } catch (err) {
        console.warn("Safely caught map fitBounds error:", err);
      }
    }
  }, [showObjectPath]);

  // Synchronize Navigation Mode route polyline and destination pin on the map
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Remove existing navigation layers
    if (navigationLayerRef.current) {
      try {
        map.removeLayer(navigationLayerRef.current.polyline);
        map.removeLayer(navigationLayerRef.current.marker);
      } catch (_) {}
      navigationLayerRef.current = null;
    }

    if (navigationRoute && navigationRoute.coordinates && navigationRoute.coordinates.length > 0) {
      // 1. Red route polyline (matching media_1791883357890_22ce34ef.png)
      const polyline = L.polyline(navigationRoute.coordinates, {
        color: "#EF4444",
        weight: 5.5,
        opacity: 0.95,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      // 2. Custom Destination Pin Marker with badge
      const destCoords =
        navigationRoute.destination ||
        navigationRoute.coordinates[navigationRoute.coordinates.length - 1];

      const destIcon = L.divIcon({
        className: "custom-nav-dest-marker",
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -100%);">
            <div style="width: 30px; height: 30px; border-radius: 9999px; background: #EF4444; border: 2.5px solid white; box-shadow: 0 4px 14px rgba(239,68,68,0.55); display: flex; align-items: center; justify-content: center; color: white;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div style="margin-top: 4px; padding: 2px 8px; border-radius: 6px; background: rgba(15,23,42,0.92); backdrop-filter: blur(4px); color: white; font-size: 11px; font-weight: 700; white-space: nowrap; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
              ${navigationRoute.destinationName || "Destination"}
            </div>
          </div>
        `,
        iconSize: [30, 48],
        iconAnchor: [15, 48],
      });

      const marker = L.marker(destCoords, { icon: destIcon }).addTo(map);

      navigationLayerRef.current = { polyline, marker };

      // 3. Smoothly fit map bounds to display the entire navigation route
      try {
        const bounds = polyline.getBounds();
        if (bounds && bounds.isValid()) {
          const leftPad = isLeftPanelOpen ? (leftPanelWidth || 630) + 40 : 60;
          const rightPad = isTelemetryDrawerOpen ? 460 : 80;
          map.fitBounds(bounds, {
            paddingTopLeft: [70, leftPad],
            paddingBottomRight: [70, rightPad],
            maxZoom: 13,
          });
        }
      } catch (err) {
        console.warn("Caught error fitting bounds to navigation route:", err);
      }
    }
  }, [navigationRoute, isLeftPanelOpen, leftPanelWidth, isTelemetryDrawerOpen]);

  const geofenceLayersRef = useRef<Map<string, L.Layer>>(new Map());

  // Render Leaflet Polygons / Circles dynamically for all checked geofence items
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear old layers
    geofenceLayersRef.current.forEach((layer) => {
      map.removeLayer(layer);
    });
    geofenceLayersRef.current.clear();

    if (!showGeofences || !checkedGeofenceIds || checkedGeofenceIds.length === 0) return;

    checkedGeofenceIds.forEach((id) => {
      const geo = GEOFENCES_DATA.find((g) => g.id === id);
      if (!geo) return;

      let layer: L.Layer;

      if (geo.type === "polygon" && geo.coordinates) {
        layer = L.polygon(geo.coordinates, {
          color: geo.color || "#0089FF",
          fillColor: geo.color || "#0089FF",
          fillOpacity: 0.25,
          weight: 2.5,
          dashArray: "4, 4",
        });
      } else if (geo.type === "circle" && geo.center && geo.radius) {
        layer = L.circle(geo.center, {
          radius: geo.radius,
          color: geo.color || "#8B5CF6",
          fillColor: geo.color || "#8B5CF6",
          fillOpacity: 0.25,
          weight: 2.5,
        });
      } else {
        return;
      }

      layer.bindTooltip(
        `<div style="font-weight: 700; font-size: 11px; color: ${geo.color}">${geo.name}</div><div style="font-size: 10px; opacity: 0.8; font-weight: 500">${geo.category}</div>`,
        { permanent: false, direction: "top" },
      );

      layer.addTo(map);
      geofenceLayersRef.current.set(id, layer);
    });

    // If a specific geofence was selected/focused via locate pin click, fly/fit map to focus on it
    if (selectedGeofenceId) {
      const targetLayer = geofenceLayersRef.current.get(selectedGeofenceId);
      if (targetLayer) {
        try {
          if ("getBounds" in targetLayer && typeof targetLayer.getBounds === "function") {
            const bounds = (targetLayer as L.Polygon).getBounds();
            if (bounds && bounds.isValid()) {
              map.fitBounds(bounds, { padding: [100, 100], maxZoom: 14 });
            }
          } else if ("getLatLng" in targetLayer && typeof targetLayer.getLatLng === "function") {
            const center = (targetLayer as L.Circle).getLatLng();
            map.flyTo(center, 13);
          }
        } catch (err) {
          console.warn("Safely caught geofence map focus error:", err);
        }
      } else {
        const targetGeo = GEOFENCES_DATA.find((g) => g.id === selectedGeofenceId);
        if (targetGeo) {
          if (targetGeo.type === "polygon" && targetGeo.coordinates) {
            const poly = L.polygon(targetGeo.coordinates);
            map.fitBounds(poly.getBounds(), { padding: [100, 100], maxZoom: 14 });
          } else if (targetGeo.type === "circle" && targetGeo.center) {
            map.flyTo(targetGeo.center, 13);
          }
        }
      }
    }
  }, [checkedGeofenceIds, selectedGeofenceId, showGeofences]);

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
                              style={{
                                backgroundColor:
                                  v.status === "running"
                                    ? "#008446"
                                    : v.status === "idle"
                                      ? "#C46F37"
                                      : v.status === "stopped"
                                        ? "#C70036"
                                        : v.status === "inactive"
                                          ? "#372AAC"
                                          : "#62748E",
                              }}
                              className="h-2 w-2 rounded-full shrink-0"
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
      {selectedVehicle && (
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
            <div className="absolute w-6 h-6 rounded-md bg-[#008446]/25 animate-ping" />
            <div
              style={{
                backgroundColor:
                  selectedVehicle.status === "running"
                    ? "#008446"
                    : selectedVehicle.status === "idle"
                      ? "#C46F37"
                      : selectedVehicle.status === "stopped"
                        ? "#C70036"
                        : selectedVehicle.status === "inactive"
                          ? "#372AAC"
                          : "#62748E",
              }}
              className="h-6 w-6 rounded-md border-2 border-white text-white flex items-center justify-center shadow-md"
            >
              <Navigation className="h-3 w-3 fill-current rotate-[35deg]" />
            </div>
          </div>

          {/* Ultra Minimal Compact Floating Vehicle Label */}
          {showLabels && (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 h-5 rounded-full bg-white/95 dark:bg-slate-900/95 border border-[#DFE3EB] dark:border-slate-800 shadow-xs backdrop-blur-xs select-none">
              <span
                style={{
                  backgroundColor:
                    selectedVehicle.status === "running"
                      ? "#008446"
                      : selectedVehicle.status === "idle"
                        ? "#C46F37"
                        : selectedVehicle.status === "stopped"
                          ? "#C70036"
                          : selectedVehicle.status === "inactive"
                            ? "#372AAC"
                            : "#62748E",
                }}
                className="h-1.5 w-1.5 rounded-full animate-pulse shrink-0"
              />
              <span className="text-[10px] font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap leading-none">
                {selectedVehicle.name}
              </span>
            </div>
          )}
        </div>
      )}



      {/* 3. Right Floating Map Controls Vertical Stack (Hidden on vehicle health score page) */}
      {!isHealthScorePage && (
        <div
          className={cn(
            "absolute top-2.5 z-20 flex flex-col items-center gap-2 transition-all duration-200 select-none",
            isTelemetryDrawerOpen ? "right-[244px]" : "right-2.5",
          )}
        >
          {/* 1. Top Card: Telemetry Drawer Toggle Chevron Button (Matching Reference Image 1:1: 44px Light Sky-Blue Card with Blue Chevron) */}
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onToggleTelemetryDrawer}
                className="w-[44px] h-[44px] rounded-2xl bg-[#EAF4FF] dark:bg-sky-950/80 border border-sky-100 dark:border-slate-800 shadow-md flex items-center justify-center text-[#0089FF] hover:bg-sky-100/80 dark:hover:bg-sky-900/80 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                {isTelemetryDrawerOpen ? (
                  <ChevronRight className="h-5 w-5 stroke-[2.5] text-[#0089FF]" />
                ) : (
                  <ChevronLeft className="h-5 w-5 stroke-[2.5] text-[#0089FF]" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">
              {isTelemetryDrawerOpen ? "Close Telemetry Panel" : "Open Telemetry Panel"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* 2. Middle Card: GIS Tools Toolbar (44px Width) */}
        <div className="w-[44px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-1 shadow-xl flex flex-col items-center gap-1 shrink-0 relative">
          <TooltipProvider delayDuration={150}>
            {/* 1. Select Map with Cascading Flyout Menu */}
            <div className="relative shrink-0" ref={selectMapMenuRef}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSelectMapOpen((prev) => !prev);
                      if (!isSelectMapOpen) {
                        const curProv = MAP_PROVIDERS.find((p) =>
                          p.subOptions.some((s) => s.id === activeMapLayer.id)
                        );
                        if (curProv) setHoveredProviderId(curProv.id);
                      }
                    }}
                    className={cn(
                      "w-[36px] h-[36px] rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0",
                      isSelectMapOpen
                        ? "bg-[#0089FF] text-white shadow-md shadow-sky-500/20"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF]",
                    )}
                  >
                    <Layers className="h-4.5 w-4.5 stroke-[2]" />
                  </button>
                </TooltipTrigger>
                {!isSelectMapOpen && (
                  <TooltipContent side="left">Select Map ({activeMapLayer.name})</TooltipContent>
                )}
              </Tooltip>

              {/* Select Map Cascading Menus */}
              {isSelectMapOpen && (
                <div className="absolute right-[calc(100%+10px)] top-0 z-50 select-none animate-in fade-in zoom-in-95 duration-150">
                  {/* Secondary Submenu (Floats to the left of the hovered provider) */}
                  {hoveredProvider && (
                    <div
                      style={{
                        top: `${Math.min(
                          4 + (hoveredIndex >= 0 ? hoveredIndex : 0) * 36,
                          Math.max(4, 224 - (hoveredProvider.subOptions.length * 36 + 8))
                        )}px`,
                      }}
                      className="absolute right-[calc(100%+6px)] w-[175px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl shadow-slate-900/15 overflow-hidden p-1 flex flex-col gap-0.5 shrink-0 animate-in fade-in-50 duration-100 before:absolute before:-right-2 before:top-0 before:bottom-0 before:w-3"
                    >
                      {hoveredProvider.subOptions.map((sub) => {
                        const isActive = activeMapLayer.id === sub.id;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => {
                              setActiveMapLayer(sub);
                              if (sub.id.includes("satellite")) setMapStyle("satellite");
                              else if (sub.id.includes("terrain")) setMapStyle("terrain");
                              else if (sub.id.includes("night") || sub.id.includes("dark")) setMapStyle("dark");
                              else setMapStyle("streets");
                              toast.success(`Switched map layer to ${sub.name}`);
                              setIsSelectMapOpen(false);
                            }}
                            className={cn(
                              "w-full h-[34px] px-2.5 rounded-xl text-xs font-medium text-left flex items-center justify-between transition-colors cursor-pointer",
                              isActive
                                ? "bg-[#0089FF]/12 text-[#0089FF] font-semibold"
                                : "text-slate-700 dark:text-slate-200 hover:bg-[#0089FF]/8 hover:text-[#0089FF]"
                            )}
                          >
                            <span className="truncate">{sub.name}</span>
                            {isActive && (
                              <Check className="h-3.5 w-3.5 text-[#0089FF] shrink-0 ml-1.5 stroke-[2.5]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Primary Menu (Providers List) */}
                  <div className="w-[145px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl shadow-slate-900/15 overflow-hidden p-1 flex flex-col gap-0.5 shrink-0">
                    {MAP_PROVIDERS.map((provider) => {
                      const isHovered = hoveredProviderId === provider.id;
                      const hasActiveLayer = provider.subOptions.some((s) => s.id === activeMapLayer.id);
                      return (
                        <div
                          key={provider.id}
                          onMouseEnter={() => setHoveredProviderId(provider.id)}
                          onClick={() => setHoveredProviderId(provider.id)}
                          className={cn(
                            "h-[34px] px-2.5 rounded-xl text-xs font-medium flex items-center justify-between cursor-pointer transition-all group",
                            isHovered
                              ? "bg-[#0089FF]/12 text-[#0089FF] font-semibold"
                              : hasActiveLayer
                              ? "text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800"
                              : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF]"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <ChevronLeft
                              className={cn(
                                "h-3.5 w-3.5 stroke-[2.5] transition-transform",
                                isHovered
                                  ? "text-[#0089FF] -translate-x-0.5"
                                  : "text-slate-400 group-hover:text-[#0089FF]"
                              )}
                            />
                            <span className="truncate">{provider.name}</span>
                          </div>
                          {hasActiveLayer && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0089FF] shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

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
                    "w-[36px] h-[36px] rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0",
                    !showClusters
                      ? "bg-[#0089FF]/12 text-[#0089FF] shadow-xs"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF]",
                  )}
                >
                  <CircleDot className="h-4.5 w-4.5 stroke-[2]" />
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
                    "w-[36px] h-[36px] rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0",
                    showObjectPath
                      ? "bg-[#0089FF]/12 text-[#0089FF] shadow-xs"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF]",
                  )}
                >
                  <Route className="h-4.5 w-4.5 stroke-[2]" />
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
                    "w-[36px] h-[36px] rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0",
                    showLabels
                      ? "bg-[#0089FF]/12 text-[#0089FF] shadow-xs"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF]",
                  )}
                >
                  <Tag className="h-4.5 w-4.5 stroke-[2]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">Show label</TooltipContent>
            </Tooltip>

            {/* 5. Share Live location */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenShare) {
                      onOpenShare(selectedVehicle);
                    } else {
                      toast.success("Live tracking link copied to clipboard!");
                    }
                  }}
                  className="w-[36px] h-[36px] rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF] transition-all cursor-pointer shrink-0"
                >
                  <Share2 className="h-4.5 w-4.5 stroke-[2]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">Share Live location</TooltipContent>
            </Tooltip>

            {/* 6. Find Near By */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenFindNearBy) {
                      onOpenFindNearBy(selectedVehicle);
                    } else {
                      toast.info("Searching nearby assets & places...");
                    }
                  }}
                  className="w-[36px] h-[36px] rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF] transition-all cursor-pointer shrink-0"
                >
                  <Compass className="h-4.5 w-4.5 stroke-[2]" />
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
                    "w-[36px] h-[36px] rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0",
                    singleObjectMode
                      ? "bg-[#0089FF]/12 text-[#0089FF] shadow-xs"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF]",
                  )}
                >
                  <Target className="h-4.5 w-4.5 stroke-[2]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">Single Object Mode</TooltipContent>
            </Tooltip>

            {/* 7.5. Follow Multiple Vehicles Mode */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onToggleFollowPanel}
                  className={cn(
                    "w-[36px] h-[36px] rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 relative",
                    isFollowPanelOpen
                      ? "bg-[#0089FF] text-white shadow-xs"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF]",
                  )}
                >
                  <Eye className="h-4.5 w-4.5 stroke-[2]" />
                  {followedCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-3.5 min-w-[14px] px-1 rounded-full bg-emerald-500 text-white font-mono text-[9px] font-bold flex items-center justify-center shadow-xs">
                      {followedCount}
                    </span>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">
                {isFollowPanelOpen ? "Close Follow Panel" : "Follow Vehicles (Multi-Track)"}
              </TooltipContent>
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
                    "w-[36px] h-[36px] rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0",
                    areaMeasurementActive
                      ? "bg-[#0089FF]/12 text-[#0089FF] shadow-xs"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF]",
                  )}
                >
                  <Ruler className="h-4.5 w-4.5 stroke-[2]" />
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
                  className="w-[36px] h-[36px] rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF] transition-all cursor-pointer shrink-0"
                >
                  <MapPinPlus className="h-4.5 w-4.5 stroke-[2]" />
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
                  className="w-[36px] h-[36px] rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF] transition-all cursor-pointer shrink-0"
                >
                  <LocateFixed className="h-4.5 w-4.5 stroke-[2]" />
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
                  className="w-[36px] h-[36px] rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF] transition-all cursor-pointer shrink-0"
                >
                  <GitCompare className="h-4.5 w-4.5 stroke-[2]" />
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
                    "w-[36px] h-[36px] rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0",
                    taxiMeterActive
                      ? "bg-[#0089FF]/12 text-[#0089FF] shadow-xs"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF]",
                  )}
                >
                  <Gauge className="h-4.5 w-4.5 stroke-[2]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">Taxi meter</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* 3. Bottom Card: Zoom In & Zoom Out Controls (44px Width) */}
        <div className="w-[44px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-1 shadow-xl flex flex-col items-center gap-1 shrink-0 overflow-hidden">
          <TooltipProvider delayDuration={150}>
            {/* Zoom in */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="w-[36px] h-[36px] rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF] transition-all cursor-pointer shrink-0"
                >
                  <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">Zoom in</TooltipContent>
            </Tooltip>

            {/* Zoom out */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="w-[36px] h-[36px] rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF] transition-all cursor-pointer shrink-0"
                >
                  <Minus className="h-4.5 w-4.5 stroke-[2.5]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">Zoom out</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      )}

      {/* 4. Bottom Map Scale & Coordinates */}
      <div
        style={{
          right: isTelemetryDrawerOpen
            ? isHealthTelemetryOnly
              ? "316px"
              : "248px"
            : "10px",
        }}
        className="absolute bottom-3 z-10 flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-3 py-1 rounded-xl border border-[#DFE3EB] dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 transition-all duration-300 shadow-sm"
      >
        <span>0.05 km</span>
        <div className="w-8 h-1 bg-slate-800 dark:bg-slate-200" />
      </div>

    </div>
  );
}
