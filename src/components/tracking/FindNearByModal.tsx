import React, { useState, useEffect, useRef, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  X,
  MapPin,
  Truck,
  Building,
  Landmark,
  Navigation,
  ChevronRight,
  Sliders,
} from "lucide-react";
import { type FleetObject } from "@/data/fleet";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Helper: Calculate Haversine air distance between two points in kilometers
function getAirDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Preset Addresses / Geofences across regions
interface NearByAddressItem {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
}

const PRESET_ADDRESSES: NearByAddressItem[] = [
  // Southeast Sulawesi / Indonesia region (matching reference screenshot)
  { id: "a-1", name: "Kendari Central Port Depot", category: "Port Logistics", lat: -3.99, lng: 122.53 },
  { id: "a-2", name: "Batu Mandi Logistics Terminal", category: "Terminal", lat: -4.10, lng: 122.65 },
  { id: "a-3", name: "Kolaka Mining Distribution Yard", category: "Warehouse", lat: -4.05, lng: 121.60 },
  { id: "a-4", name: "South Sulawesi Freight Depot", category: "Depot", lat: -4.85, lng: 120.10 },
  { id: "a-5", name: "Makassar Container Terminal", category: "Port", lat: -5.12, lng: 119.42 },
  // India regions
  { id: "a-6", name: "Uffizio Head Office, Phase 2, GIDC, Vapi", category: "Head Office", lat: 20.375, lng: 72.905 },
  { id: "a-7", name: "Katargam Delivery Hub, Surat", category: "Distribution Hub", lat: 21.218, lng: 72.825 },
  { id: "a-8", name: "Mumbai Port Logistics Complex", category: "Maritime Hub", lat: 18.950, lng: 72.840 },
  { id: "a-9", name: "Hinjawadi IT Park Logistics Gate, Pune", category: "Industrial Park", lat: 18.595, lng: 73.740 },
  { id: "a-10", name: "SG Highway Transit Terminal, Ahmedabad", category: "Transit Terminal", lat: 23.025, lng: 72.570 },
];

// Preset Points of Interest (POIs) with categories
interface NearByPoiItem {
  id: string;
  name: string;
  type: string; // "Toll Station" | "Fuel Station" | "Service Center" | "Rest Stop" | "Hospital"
  lat: number;
  lng: number;
}

const PRESET_POIS: NearByPoiItem[] = [
  // Indonesia region (matching reference screenshot)
  { id: "p-1", name: "Kendari Gateway Toll Plaza", type: "Toll Station", lat: -3.92, lng: 122.45 },
  { id: "p-2", name: "Kolaka Expressway Toll Gate", type: "Toll Station", lat: -4.02, lng: 122.35 },
  { id: "p-3", name: "Pertamina SPBU 74.931 Kendari", type: "Fuel Station", lat: -3.98, lng: 122.55 },
  { id: "p-4", name: "Pertamina Pompa Bensin Kolaka", type: "Fuel Station", lat: -4.04, lng: 121.62 },
  { id: "p-5", name: "Heavy Truck Workshop Kendari", type: "Service Center", lat: -3.96, lng: 122.59 },
  { id: "p-6", name: "Trans-Sulawesi Highway Rest Stop", type: "Rest Stop", lat: -4.15, lng: 122.20 },
  { id: "p-7", name: "RSUD Kendari Hospital", type: "Hospital", lat: -3.99, lng: 122.51 },
  // India regions
  { id: "p-8", name: "Charoti Toll Plaza, NH48", type: "Toll Station", lat: 19.955, lng: 72.895 },
  { id: "p-9", name: "Boriach Toll Plaza, Navsari", type: "Toll Station", lat: 20.930, lng: 72.920 },
  { id: "p-10", name: "Vapi Checkpost Toll Plaza", type: "Toll Station", lat: 20.365, lng: 72.915 },
  { id: "p-11", name: "Khalapur Toll Plaza, Mumbai-Pune Exp", type: "Toll Station", lat: 18.830, lng: 73.285 },
  { id: "p-12", name: "Indian Oil Swagat Highway Oasis, NH48", type: "Fuel Station", lat: 19.820, lng: 72.905 },
  { id: "p-13", name: "Bharat Petroleum Fuel Station, Vapi", type: "Fuel Station", lat: 20.450, lng: 72.930 },
  { id: "p-14", name: "Tata & Eicher Heavy Fleet Workshop", type: "Service Center", lat: 20.380, lng: 72.910 },
  { id: "p-15", name: "Golden Palms Rest Stop & Food Court", type: "Rest Stop", lat: 20.150, lng: 72.910 },
  { id: "p-16", name: "Rainbow Multi-Specialty Hospital, Vapi", type: "Hospital", lat: 20.370, lng: 72.900 },
];

const POI_TYPES = [
  "Toll Station",
  "Fuel Station",
  "Service Center",
  "Rest Stop",
  "Hospital",
] as const;

export interface FindNearByModalProps {
  open: boolean;
  onClose: () => void;
  vehicle: FleetObject | null;
  allVehicles?: FleetObject[];
}

export function FindNearByModal({
  open,
  onClose,
  vehicle,
  allVehicles = [],
}: FindNearByModalProps) {
  if (!open || !vehicle) return null;

  // Active Tab: "object" | "address" | "poi"
  const [activeTab, setActiveTab] = useState<"object" | "address" | "poi">("object");

  // Radius state (default 394 km as in reference screenshot media_1791885614000_141a9579.png)
  const [radiusKm, setRadiusKm] = useState<number>(394);

  // Unit: "km" | "mi"
  const [unit, setUnit] = useState<"km" | "mi">("km");

  // Selected POI Type when POI tab is active (default "Toll Station" as in reference media_1791885741030_2a9c907f.png)
  const [selectedPoiType, setSelectedPoiType] = useState<string>("Toll Station");

  // Active highlighted item ID (for click in sidebar to focus on map)
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);

  // Vehicle coordinates (fallback to Indonesia or Mumbai coordinates if missing)
  const originLat = vehicle.lat ?? -3.97;
  const originLng = vehicle.lng ?? 122.58;

  // Convert radius value based on unit
  const displayRadius =
    unit === "km" ? radiusKm : Math.round(radiusKm * 0.621371);

  // Map elements ref
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const circleLayerRef = useRef<L.Circle | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // 1. Calculate nearby objects (other vehicles)
  const nearbyObjects = useMemo(() => {
    return allVehicles
      .filter((v) => v.id !== vehicle.id)
      .map((v) => {
        const vLat = v.lat ?? originLat + 0.1;
        const vLng = v.lng ?? originLng + 0.1;
        const distKm = getAirDistanceKm(originLat, originLng, vLat, vLng);
        return {
          id: v.id,
          name: v.name,
          category: v.model || "Commercial Vehicle",
          status: v.status,
          lat: vLat,
          lng: vLng,
          distanceKm: distKm,
          distanceDisplay:
            unit === "km"
              ? `${distKm.toFixed(2)} km`
              : `${(distKm * 0.621371).toFixed(2)} mi`,
        };
      })
      .filter((v) => v.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [allVehicles, vehicle.id, originLat, originLng, radiusKm, unit]);

  // 2. Calculate nearby addresses
  const nearbyAddresses = useMemo(() => {
    return PRESET_ADDRESSES.map((addr) => {
      const distKm = getAirDistanceKm(originLat, originLng, addr.lat, addr.lng);
      return {
        id: addr.id,
        name: addr.name,
        category: addr.category,
        lat: addr.lat,
        lng: addr.lng,
        distanceKm: distKm,
        distanceDisplay:
          unit === "km"
            ? `${distKm.toFixed(2)} km`
            : `${(distKm * 0.621371).toFixed(2)} mi`,
      };
    })
      .filter((addr) => addr.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [originLat, originLng, radiusKm, unit]);

  // 3. Calculate nearby POIs matching selected type
  const nearbyPois = useMemo(() => {
    return PRESET_POIS.filter((poi) => poi.type === selectedPoiType)
      .map((poi) => {
        const distKm = getAirDistanceKm(originLat, originLng, poi.lat, poi.lng);
        return {
          id: poi.id,
          name: poi.name,
          category: poi.type,
          lat: poi.lat,
          lng: poi.lng,
          distanceKm: distKm,
          distanceDisplay:
            unit === "km"
              ? `${distKm.toFixed(2)} km`
              : `${(distKm * 0.621371).toFixed(2)} mi`,
        };
      })
      .filter((poi) => poi.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [originLat, originLng, radiusKm, unit, selectedPoiType]);

  // Current active list
  const currentList =
    activeTab === "object"
      ? nearbyObjects
      : activeTab === "address"
      ? nearbyAddresses
      : nearbyPois;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapElementRef.current) return;

    // Destroy previous instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapElementRef.current, {
      center: [originLat, originLng],
      zoom: 7,
      zoomControl: true,
      attributionControl: false,
    });

    // OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Center Origin Vehicle Marker (Blue pin with pulse)
    const originIcon = L.divIcon({
      className: "origin-center-pin",
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -100%);">
          <div style="width: 32px; height: 32px; border-radius: 9999px; background: #0089FF; border: 2.5px solid white; box-shadow: 0 4px 14px rgba(0,137,255,0.6); display: flex; align-items: center; justify-content: center; color: white;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div style="margin-top: 3px; padding: 2px 7px; border-radius: 6px; background: rgba(15,23,42,0.92); color: white; font-size: 10px; font-weight: 700; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
            ${vehicle.name}
          </div>
        </div>
      `,
      iconSize: [32, 48],
      iconAnchor: [16, 48],
    });

    L.marker([originLat, originLng], { icon: originIcon }).addTo(map);

    // Radius Circle (Red circle matching reference screenshots media_1791885614000_141a9579.png)
    const circle = L.circle([originLat, originLng], {
      radius: radiusKm * 1000,
      color: "#EF4444",
      fillColor: "#EF4444",
      fillOpacity: 0.16,
      weight: 2,
    }).addTo(map);

    circleLayerRef.current = circle;
    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Invalidate size after modal rendering transition
    const timer = setTimeout(() => {
      map.invalidateSize();
      try {
        map.fitBounds(circle.getBounds(), { padding: [25, 25] });
      } catch (_) {}
    }, 150);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [open, originLat, originLng, vehicle.name]);

  // Synchronize Circle Radius & Map Bounds when radius changes
  useEffect(() => {
    if (!mapInstanceRef.current || !circleLayerRef.current) return;
    const circle = circleLayerRef.current;
    circle.setRadius(radiusKm * 1000);

    try {
      mapInstanceRef.current.fitBounds(circle.getBounds(), { padding: [30, 30] });
    } catch (_) {}
  }, [radiusKm]);

  // Synchronize Markers on Map based on active tab and filtered items
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const markersGroup = markersLayerRef.current;
    markersGroup.clearLayers();

    currentList.forEach((item) => {
      const isFocused = focusedItemId === item.id;

      // Custom marker icon based on tab type
      const markerHtml =
        activeTab === "object"
          ? `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -100%);">
              <div style="width: 26px; height: 26px; border-radius: 7px; background: #008446; border: 2px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10 17h4V5H2v12h3m15 0h2v-3.34a4 4 0 0 0-1.17-2.83L19 8h-5v9h2"/>
                  <circle cx="7.5" cy="17.5" r="2.5"/>
                  <circle cx="17.5" cy="17.5" r="2.5"/>
                </svg>
              </div>
              <div style="margin-top: 2px; padding: 1px 6px; border-radius: 4px; background: rgba(15,23,42,0.85); color: white; font-size: 9.5px; font-weight: 600; white-space: nowrap;">
                ${item.name}
              </div>
            </div>
          `
          : activeTab === "address"
          ? `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -100%);">
              <div style="width: 26px; height: 26px; border-radius: 9999px; background: #8B5CF6; border: 2px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div style="margin-top: 2px; padding: 1px 6px; border-radius: 4px; background: rgba(15,23,42,0.85); color: white; font-size: 9.5px; font-weight: 600; white-space: nowrap;">
                ${item.name}
              </div>
            </div>
          `
          : `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -100%);">
              <div style="width: 26px; height: 26px; border-radius: 9999px; background: #F59E0B; border: 2px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div style="margin-top: 2px; padding: 1px 6px; border-radius: 4px; background: rgba(15,23,42,0.85); color: white; font-size: 9.5px; font-weight: 600; white-space: nowrap;">
                ${item.name}
              </div>
            </div>
          `;

      const icon = L.divIcon({
        className: `nearby-marker-${item.id}`,
        html: markerHtml,
        iconSize: [26, 42],
        iconAnchor: [13, 42],
      });

      const marker = L.marker([item.lat, item.lng], { icon });
      marker.bindTooltip(
        `<div style="font-weight: 700; font-size: 11px;">${item.name}</div><div style="font-size: 10px; color: #64748B;">Air Distance: ${item.distanceDisplay}</div>`,
        { direction: "top", offset: [0, -38] }
      );

      marker.on("click", () => {
        setFocusedItemId(item.id);
      });

      markersGroup.addLayer(marker);
    });
  }, [currentList, activeTab, focusedItemId]);

  // Handle clicking an item in the sidebar list to fly map to it
  const handleItemClick = (item: { id: string; lat: number; lng: number }) => {
    setFocusedItemId(item.id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([item.lat, item.lng], 10, { duration: 0.8 });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 select-none">
      <div className="relative w-full max-w-[1140px] h-[86vh] max-h-[760px] bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* ── 1. Top Header Bar (Matching Theme) ── */}
        <div className="flex h-11 items-center justify-between px-4 bg-white dark:bg-slate-900 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0">
          <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100">
            {vehicle.name}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="h-4 w-4 stroke-[2]" />
          </button>
        </div>

        {/* ── 2. Sub-header Navigation Tabs & Radius Toolbar (Trakzee 2.0 Theme) ── */}
        <div className="flex h-11 items-center justify-between px-5 border-b border-[#DFE3EB] dark:border-slate-800 bg-[#FAFBFC] dark:bg-slate-900/80 shrink-0 gap-4 select-none">
          {/* Left: Trakzee 2.0 Underline Tabs */}
          <div className="flex items-center gap-6 h-full">
            {[
              { id: "object", label: "Object" },
              { id: "address", label: "Address" },
              { id: "poi", label: "POI" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "h-full flex items-center text-xs font-bold transition-all cursor-pointer border-b-2 relative -mb-px",
                    isActive
                      ? "border-[#0089FF] text-[#0089FF]"
                      : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 font-semibold"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}

            {/* When POI is active: Type Dropdown */}
            {activeTab === "poi" && (
              <div className="flex items-center gap-2 pl-3 border-l border-[#DFE3EB] dark:border-slate-800 animate-in fade-in duration-150">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Type :
                </span>
                <Select value={selectedPoiType} onValueChange={setSelectedPoiType}>
                  <SelectTrigger className="h-7.5 w-32 text-xs bg-white dark:bg-slate-800 border-[#DFE3EB] dark:border-slate-700 rounded-lg">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="z-[70] bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 shadow-xl rounded-xl">
                    {POI_TYPES.map((t) => (
                      <SelectItem key={t} value={t} className="text-xs">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Right: In Radius Slider & Unit Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              In Radius{" "}
              <strong className="text-slate-900 dark:text-white font-semibold">
                {displayRadius} {unit}
              </strong>
            </span>

            {/* Range Slider */}
            <input
              type="range"
              min="10"
              max="1000"
              step="5"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-32 sm:w-40 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0089FF]"
            />

            {/* Unit Dropdown: Km / Mi */}
            <Select value={unit} onValueChange={(val: "km" | "mi") => setUnit(val)}>
              <SelectTrigger className="h-7.5 w-20 text-xs bg-white dark:bg-slate-800 border-[#DFE3EB] dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent className="z-[70] bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 shadow-xl rounded-xl">
                <SelectItem value="km" className="text-xs">
                  Km
                </SelectItem>
                <SelectItem value="mi" className="text-xs">
                  Mi
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── 3. Main Content: Map (Left) + Sidebar (Right) ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Map Section */}
          <div className="flex-1 relative h-full bg-[#E8ECE9] dark:bg-[#151D2A]">
            <div ref={mapElementRef} className="absolute inset-0 h-full w-full z-0" />
          </div>

          {/* Right Sidebar List */}
          <div className="w-[250px] sm:w-[280px] flex flex-col bg-white dark:bg-slate-900 border-l border-[#DFE3EB] dark:border-slate-800 shrink-0">
            {/* Sidebar Title */}
            <div className="p-3 border-b border-[#DFE3EB] dark:border-slate-800 flex items-center justify-between shrink-0">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {activeTab === "object"
                  ? "Near By Object"
                  : activeTab === "address"
                  ? "Near By Address"
                  : "Near By POI"}
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                {currentList.length}
              </span>
            </div>

            {/* Scrollable List or No Record Found */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#DFE3EB]/50 dark:divide-slate-800/80 custom-scrollbar">
              {currentList.length > 0 ? (
                currentList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "p-3 transition-colors cursor-pointer flex flex-col gap-0.5 group",
                      focusedItemId === item.id
                        ? "bg-sky-50 dark:bg-slate-800/90"
                        : "hover:bg-slate-50 dark:hover:bg-slate-850"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#0089FF] transition-colors truncate">
                        {item.name}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#0089FF] shrink-0" />
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Air Distance : {item.distanceDisplay}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 flex flex-col items-center justify-center h-full">
                  <div className="w-full p-2.5 rounded-lg border border-[#DFE3EB] dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 text-center">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      No Record Found
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
