import React, { useState, useEffect, useRef } from "react";
import {
  Activity,
  Clock,
  Compass,
  Layers,
  MapPin,
  Minus,
  Navigation,
  Plus,
  Target,
  X,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { toast } from "sonner";
import { type FleetObject, STATUS_META } from "@/data/fleet";
import { cn } from "@/lib/utils";

// ── Single Follow Vehicle Mini-Map Card ──
export function FollowVehicleMiniMap({
  vehicle,
  onRemove,
  onFocusMainMap,
}: {
  vehicle: FleetObject;
  onRemove: () => void;
  onFocusMainMap: () => void;
}) {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [mapStyle, setMapStyle] = useState<"streets" | "satellite">("streets");

  const lat = vehicle.lat ?? 20.5937;
  const lng = vehicle.lng ?? 78.9629;
  const statusMeta = STATUS_META[vehicle.status] || STATUS_META.running;

  // Initialize Leaflet mini-map
  useEffect(() => {
    if (!mapElementRef.current || !L) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(mapElementRef.current, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
      });

      const tileUrl =
        mapStyle === "satellite"
          ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}"
          : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

      L.tileLayer(tileUrl, {
        subdomains: mapStyle === "satellite" ? "a" : "abc",
        maxZoom: 19,
      }).addTo(map);

      // Custom pulse directional vehicle marker
      const customIcon = L.divIcon({
        className: "custom-follow-vehicle-marker",
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
            <div style="position: absolute; width: 30px; height: 30px; border-radius: 9999px; background-color: ${statusMeta.color}; opacity: 0.25; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 22px; height: 22px; border-radius: 9999px; background-color: ${statusMeta.color}; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.25);">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
              </svg>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      markerRef.current = marker;
      mapInstanceRef.current = map;

      // Handle resize observer so map never renders empty/grey when resized manually by cursor
      const resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      if (mapElementRef.current) {
        resizeObserver.observe(mapElementRef.current);
      }

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 150);

      return () => {
        resizeObserver.disconnect();
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    } catch (err) {
      console.warn("Failed to initialize mini-map:", err);
    }
  }, [lat, lng, mapStyle, statusMeta.color]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleRecenter = () => {
    mapInstanceRef.current?.setView([lat, lng], 15);
    toast.info(`Recentered on ${vehicle.name}`);
  };

  return (
    <div className="flex flex-col rounded-2xl border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full w-full group select-none">
      {/* ── 1. Card Top Bar: Object Name, Date & Time, Speed, Status & Actions ── */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-white dark:bg-slate-900 border-b border-[#DFE3EB]/80 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Status Dot */}
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: statusMeta.color }}
            />
            <span
              className="relative inline-flex rounded-full h-2.5 w-2.5"
              style={{ backgroundColor: statusMeta.color }}
            />
          </span>

          {/* Object Name & Timestamp */}
          <div className="truncate min-w-0">
            <div className="flex items-center gap-1.5">
              <h4
                className="font-bold text-slate-900 dark:text-white truncate text-xs leading-tight tracking-tight"
                title={vehicle.name}
              >
                {vehicle.name}
              </h4>
              <span
                className="px-1.5 py-0.2 rounded text-[9.5px] font-bold shrink-0 leading-none"
                style={{
                  backgroundColor: statusMeta.tint,
                  color: statusMeta.color,
                }}
              >
                {statusMeta.label}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1 mt-0.5 truncate">
              <Clock className="h-2.5 w-2.5 shrink-0 opacity-70" />
              <span>{vehicle.timestamp || "13-10-2026 11:52:00 AM"}</span>
            </div>
          </div>
        </div>

        {/* Header Right: Live Speed badge & Action Buttons */}
        <div className="flex items-center gap-1 shrink-0 ml-1.5">
          {/* Speed Badge */}
          <div
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md font-mono font-bold text-[10.5px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            title={`Speed: ${vehicle.speed ?? 0} km/h`}
          >
            <Activity className="h-3 w-3 text-[#0089FF]" />
            <span>{vehicle.speed ?? 0} km/h</span>
          </div>

          {/* Unfollow button */}
          <button
            type="button"
            onClick={onRemove}
            title="Unfollow this vehicle"
            className="h-6 w-6 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* ── 2. Live Interactive Mini-Map Canvas ── */}
      <div className="relative flex-1 min-h-[60px] w-full bg-[#E5E9EC] dark:bg-slate-950 overflow-hidden">
        <div ref={mapElementRef} className="h-full w-full z-0" />

        {/* Micro Zoom Controls */}
        <div className="absolute top-1.5 left-1.5 z-10 flex flex-col rounded-md border border-slate-200/90 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 shadow-xs overflow-hidden backdrop-blur-xs">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-b border-slate-200 dark:border-slate-700 cursor-pointer"
            title="Zoom In"
          >
            <Plus className="h-2.5 w-2.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-b border-slate-200 dark:border-slate-700 cursor-pointer"
            title="Zoom Out"
          >
            <Minus className="h-2.5 w-2.5" />
          </button>
          <button
            type="button"
            onClick={handleRecenter}
            className="p-1 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Recenter Map"
          >
            <Navigation className="h-2.5 w-2.5 text-[#0089FF]" />
          </button>
        </div>

        {/* Satellite / Map Toggle */}
        <div className="absolute top-1.5 right-1.5 z-10">
          <button
            type="button"
            onClick={() =>
              setMapStyle((prev) =>
                prev === "streets" ? "satellite" : "streets"
              )
            }
            className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:bg-white transition-colors cursor-pointer backdrop-blur-xs"
          >
            {mapStyle === "streets" ? "Sat" : "Map"}
          </button>
        </div>
      </div>

      {/* ── 3. Bottom Address Strip ── */}
      <div className="px-2.5 py-1 bg-slate-50/95 dark:bg-slate-800/80 border-t border-[#DFE3EB]/80 dark:border-slate-800 flex items-center gap-1.5 text-[11px] shrink-0">
        <MapPin className="h-3 w-3 text-[#0089FF] shrink-0" />
        <span
          className="truncate text-[10.5px] text-slate-600 dark:text-slate-300 font-sans flex-1"
          title={vehicle.address || "Live GPS Location"}
        >
          {vehicle.address || "Live GPS Location"}
        </span>
      </div>
    </div>
  );
}

// ── Main Follow Vehicles Dedicated Right Section ──
// Dynamically manages only active followed vehicles (1, 2, 3, or 4) with no pre-built empty slots,
// and supports manual cursor resizing horizontally and vertically.
export interface FollowVehiclesPanelProps {
  followedVehicleIds: string[];
  allVehicles: FleetObject[];
  onAddVehicle: (id: string) => void;
  onRemoveVehicle: (id: string) => void;
  onFocusMainMap: (id: string) => void;
  panelWidth: number;
  onWidthChange: (w: number) => void;
  onStartColResize: (e: React.MouseEvent) => void;
  isResizingCol?: boolean;
}

export function FollowVehiclesPanel({
  followedVehicleIds,
  allVehicles,
  onAddVehicle,
  onRemoveVehicle,
  onFocusMainMap,
  panelWidth,
  onWidthChange,
  onStartColResize,
  isResizingCol = false,
}: FollowVehiclesPanelProps) {
  const followedVehicles = followedVehicleIds
    .slice(0, 4)
    .map((id) => allVehicles.find((v) => v.id === id))
    .filter(Boolean) as FleetObject[];

  const count = followedVehicles.length;

  // Height distribution across active cards (percentages summing to 100)
  const [cardRatios, setCardRatios] = useState<number[]>(() =>
    new Array(count > 0 ? count : 1).fill(count > 0 ? 100 / count : 100)
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [resizingDividerIndex, setResizingDividerIndex] = useState<number | null>(
    null
  );
  const dragStartY = useRef<number>(0);
  const startRatios = useRef<number[]>([]);

  // When count of followed vehicles changes, distribute heights evenly among active cards
  useEffect(() => {
    if (count > 0) {
      setCardRatios(new Array(count).fill(100 / count));
    }
  }, [count]);

  // ── Vertical Card Height Drag Resizing ──
  const handleStartRowResize = (dividerIdx: number, e: React.MouseEvent) => {
    e.preventDefault();
    setResizingDividerIndex(dividerIdx);
    dragStartY.current = e.clientY;
    startRatios.current = [...cardRatios];
  };

  useEffect(() => {
    if (resizingDividerIndex === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const totalH = containerRef.current.clientHeight;
      if (totalH <= 0) return;

      const deltaY = e.clientY - dragStartY.current;
      const deltaRatio = (deltaY / totalH) * 100;

      const idx = resizingDividerIndex;
      const initialA = startRatios.current[idx];
      const initialB = startRatios.current[idx + 1];
      const combined = initialA + initialB;

      const minRatio = 12; // Minimum height proportion

      let newA = initialA + deltaRatio;
      let newB = initialB - deltaRatio;

      if (newA < minRatio) {
        newA = minRatio;
        newB = combined - minRatio;
      } else if (newB < minRatio) {
        newB = minRatio;
        newA = combined - minRatio;
      }

      setCardRatios((prev) => {
        const next = [...prev];
        next[idx] = Math.round(newA * 10) / 10;
        next[idx + 1] = Math.round(newB * 10) / 10;
        return next;
      });
    };

    const handleMouseUp = () => {
      setResizingDividerIndex(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingDividerIndex]);

  if (count === 0) {
    return null;
  }

  return (
    <aside
      style={{ width: `${panelWidth}px` }}
      className={cn(
        "relative h-full bg-[#F4F6F8] dark:bg-slate-950/80 border-l border-[#DFE3EB] dark:border-slate-800 flex flex-col shrink-0 select-none overflow-hidden z-20 transition-all duration-150",
        isResizingCol && "transition-none select-none"
      )}
    >
      {/* ── Left Edge Horizontal Resize Handle (Drag to change width of all cards) ── */}
      <div
        onMouseDown={onStartColResize}
        title="Drag with cursor to resize follow section width"
        className="absolute left-0 top-0 bottom-0 w-2.5 -ml-1 cursor-col-resize z-40 group flex items-center justify-center select-none"
      >
        <div className="w-[3px] h-full bg-transparent group-hover:bg-[#0089FF] group-active:bg-[#0089FF] transition-colors" />
        <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-10 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-[#0089FF] group-active:bg-[#0089FF] transition-colors shadow-xs" />
      </div>

      {/* ── Active Followed Cards Container (Dynamic: 1, 2, 3, or 4 cards filling 100% of the section) ── */}
      <div
        ref={containerRef}
        className="flex-1 flex flex-col h-full p-2.5 overflow-hidden"
      >
        {followedVehicles.map((vehicle, index) => {
          const ratio = cardRatios[index] ?? 100 / count;
          return (
            <React.Fragment key={vehicle.id}>
              {/* Card Block */}
              <div
                style={{
                  flex: `${ratio} 1 0%`,
                  minHeight: "75px",
                }}
                className="overflow-hidden flex flex-col"
              >
                <FollowVehicleMiniMap
                  vehicle={vehicle}
                  onRemove={() => onRemoveVehicle(vehicle.id)}
                  onFocusMainMap={() => onFocusMainMap(vehicle.id)}
                />
              </div>

              {/* Draggable Divider between cards (Drag with cursor to modify vertical card sizes) */}
              {index < count - 1 && (
                <div
                  onMouseDown={(e) => handleStartRowResize(index, e)}
                  title="Drag with cursor to adjust card heights"
                  className="h-2.5 -my-0.5 relative z-30 cursor-row-resize group flex items-center justify-center shrink-0 select-none py-0.5"
                >
                  <div className="h-[2px] w-full bg-transparent group-hover:bg-[#0089FF]/60 group-active:bg-[#0089FF] transition-colors rounded-full" />
                  <div className="absolute w-8 h-1 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-[#0089FF] group-active:bg-[#0089FF] transition-colors shadow-2xs opacity-0 group-hover:opacity-100" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </aside>
  );
}
