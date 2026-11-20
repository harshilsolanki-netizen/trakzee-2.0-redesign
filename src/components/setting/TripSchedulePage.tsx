import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  Plus,
  Trash2,
  ChevronUp,
  GripVertical,
  Maximize2,
  MapPin,
} from "lucide-react";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── TYPES ──────────────────────────────────────────────────────────────
export interface CheckpointItem {
  id: string;
  type: "start" | "stop" | "end";
  location: string;
  lat: number;
  lng: number;
  allocatedEmployees: number;
  returnPoint: boolean;
  estimatedReachTime: string;
  haltMinutes: number;
}

// ─── INITIAL MOCK CHECKPOINTS (Matching Reference Screenshots) ──────────
const INITIAL_CHECKPOINTS: CheckpointItem[] = [
  {
    id: "cp-1",
    type: "start",
    location: "Central Fleet Depot, Gate 1",
    lat: 19.076,
    lng: 72.8777,
    allocatedEmployees: 0,
    returnPoint: false,
    estimatedReachTime: "12:00 PM",
    haltMinutes: 0,
  },
  {
    id: "cp-2",
    type: "stop",
    location: "Metro Station Hub, East Exit",
    lat: 19.1136,
    lng: 72.8697,
    allocatedEmployees: 4,
    returnPoint: false,
    estimatedReachTime: "12:20 PM",
    haltMinutes: 5,
  },
  {
    id: "cp-3",
    type: "end",
    location: "Corporate Tech Park, Tower B",
    lat: 19.1663,
    lng: 72.9526,
    allocatedEmployees: 0,
    returnPoint: false,
    estimatedReachTime: "12:45 PM",
    haltMinutes: 0,
  },
];

const COMPANY_OPTIONS = ["ETSCompany", "CommuteX", "Acme Logistics", "MetroTransit"];
const BRANCH_OPTIONS = ["ETSCompany", "Corporate HQ", "North Hub", "South Branch"];
const VEHICLE_OPTIONS = [
  "Select",
  "MH 15 KL 6455 (14 Seater)",
  "KA 01 MJ 9921 (22 Seater)",
  "DL 04 AB 1234 (7 Seater)",
  "GJ 01 XY 8890 (32 Seater)",
];
const SCHEDULE_TYPES = ["Relative", "Fixed", "On-Demand"];

export function TripSchedulePage() {
  const navigate = useNavigate();

  // ─── FORM STATES (Matching Screenshot Media 1 & 2) ───────────────────
  const [company, setCompany] = useState("ETSCompany");
  const [branch, setBranch] = useState("ETSCompany");
  const [tripType, setTripType] = useState<"Pickup" | "Drop">("Pickup");
  const [tripName, setTripName] = useState("Morning Shift Pickup - Route 1");
  const [tripCreationType, setTripCreationType] = useState<"Manual" | "Bulk">("Manual");
  const [considerTripWithRoute, setConsiderTripWithRoute] = useState(false);
  const [vehicle, setVehicle] = useState("Select");
  const [scheduleType, setScheduleType] = useState("Relative");
  const [repeatSchedule, setRepeatSchedule] = useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const [validFrom, setValidFrom] = useState("2026-11-20");
  const [validTo, setValidTo] = useState("2026-11-20");
  const [pickupFromTime, setPickupFromTime] = useState("12:15 PM");
  const [pickupToTime, setPickupToTime] = useState("12:20 PM");
  const [startEndTime, setStartEndTime] = useState("20-11-2026 12:00PM - 20-11-2026 12:00PM");
  const [routeTolerance, setRouteTolerance] = useState("50");
  const [bufferTime, setBufferTime] = useState("5");
  const [forceCloseDuration, setForceCloseDuration] = useState("01:00");
  const [requireOtp, setRequireOtp] = useState(false);

  // ─── CHECKPOINTS & MAP STATE ──────────────────────────────────────────
  const [checkpoints, setCheckpoints] = useState<CheckpointItem[]>(INITIAL_CHECKPOINTS);
  const [selectedCheckpointId, setSelectedCheckpointId] = useState<string | null>(null);

  // ─── BOTTOM COLLAPSIBLE DRAWER STATE ─────────────────────────────────
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);
  const [tableHeight, setTableHeight] = useState<number>(240);
  const isResizingTableRef = useRef(false);
  const resizeStartYRef = useRef(0);
  const resizeStartHeightRef = useRef(240);

  const handleStartResizeTable = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingTableRef.current = true;
    resizeStartYRef.current = e.clientY;
    resizeStartHeightRef.current = tableHeight;
    setIsTableCollapsed(false);

    const handleMouseMove = (moveEvt: MouseEvent) => {
      if (!isResizingTableRef.current) return;
      // Resizing from top edge: moving mouse up (negative delta) increases height
      const deltaY = resizeStartYRef.current - moveEvt.clientY;
      const newHeight = Math.max(160, Math.min(window.innerHeight - 200, resizeStartHeightRef.current + deltaY));
      setTableHeight(newHeight);
    };

    const handleMouseUp = () => {
      isResizingTableRef.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Leaflet Map Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  // ─── INITIALIZE MAP ──────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [19.12, 72.9],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      subdomains: "abc",
      maxZoom: 19,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // ─── UPDATE MARKERS & ROUTE LINE ON MAP ──────────────────────────────
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    const latLngs: L.LatLngTuple[] = [];

    checkpoints.forEach((cp, idx) => {
      const isStart = cp.type === "start";
      const isEnd = cp.type === "end";
      const isSelected = cp.id === selectedCheckpointId;

      latLngs.push([cp.lat, cp.lng]);

      let badgeBg = "#0089FF";
      let badgeText = `${idx + 1}`;
      let labelText = cp.location;

      if (isStart) {
        badgeBg = "#16A34A";
        badgeText = "🚩";
      } else if (isEnd) {
        badgeBg = "#EF4444";
        badgeText = "🏁";
      }

      const markerHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: ${
          isSelected ? "scale(1.15)" : "scale(1)"
        }; transition: transform 0.15s ease;">
          <div style="background: ${badgeBg}; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; box-shadow: 0 3px 8px rgba(0,0,0,0.3); border: 2px solid white;">
            ${badgeText}
          </div>
          <div style="background: white; color: #0F172A; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.2); margin-top: 4px; border: 1px solid #DFE3EB;">
            ${labelText.length > 20 ? labelText.slice(0, 18) + "..." : labelText}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: "custom-trip-marker",
        iconSize: [36, 48],
        iconAnchor: [18, 24],
      });

      const marker = L.marker([cp.lat, cp.lng], { icon: customIcon }).addTo(markersLayer);

      marker.on("click", () => {
        setSelectedCheckpointId(cp.id);
        map.flyTo([cp.lat, cp.lng], 13, { duration: 0.8 });
      });
    });

    if (latLngs.length > 1) {
      polylineRef.current = L.polyline(latLngs, {
        color: "#0089FF",
        weight: 3.5,
        opacity: 0.85,
        dashArray: "6, 8",
        lineCap: "round",
      }).addTo(map);

      if (!selectedCheckpointId) {
        map.fitBounds(L.latLngBounds(latLngs), { padding: [50, 50] });
      }
    }
  }, [checkpoints, selectedCheckpointId]);

  // Handle map invalidate size on panel toggle or height change
  useEffect(() => {
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [isTableCollapsed, tableHeight]);

  // ─── ACTIONS ─────────────────────────────────────────────────────────
  const handleReset = () => {
    setCompany("ETSCompany");
    setBranch("ETSCompany");
    setTripType("Pickup");
    setTripName("Morning Shift Pickup - Route 1");
    setTripCreationType("Manual");
    setConsiderTripWithRoute(false);
    setVehicle("Select");
    setScheduleType("Relative");
    setRepeatSchedule("Daily");
    setValidFrom("2026-11-20");
    setValidTo("2026-11-20");
    setPickupFromTime("12:15 PM");
    setPickupToTime("12:20 PM");
    setStartEndTime("20-11-2026 12:00PM - 20-11-2026 12:00PM");
    setRouteTolerance("50");
    setBufferTime("5");
    setForceCloseDuration("01:00");
    setRequireOtp(false);
    setCheckpoints(INITIAL_CHECKPOINTS);
    setSelectedCheckpointId(null);
    toast.info("Form reset to default values");
  };

  const handleSave = () => {
    if (!tripName.trim()) {
      toast.error("Please enter a Trip Name");
      return;
    }
    toast.success("Trip Schedule saved successfully!");
  };

  const handleAddCheckpoint = () => {
    const newId = `cp-${Date.now()}`;
    const newCheckpoint: CheckpointItem = {
      id: newId,
      type: "stop",
      location: `New Stop Location #${checkpoints.length}`,
      lat: 19.14 + (Math.random() - 0.5) * 0.05,
      lng: 72.9 + (Math.random() - 0.5) * 0.05,
      allocatedEmployees: 0,
      returnPoint: false,
      estimatedReachTime: "12:30 PM",
      haltMinutes: 2,
    };

    const updated = [...checkpoints];
    if (updated.length > 1) {
      updated.splice(updated.length - 1, 0, newCheckpoint);
    } else {
      updated.push(newCheckpoint);
    }

    setCheckpoints(updated);
    setSelectedCheckpointId(newId);
    toast.success("Added new checkpoint stop");
  };

  const handleDeleteCheckpoint = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (checkpoints.length <= 2) {
      toast.error("Trip must have at least a start and an end checkpoint");
      return;
    }
    setCheckpoints(checkpoints.filter((cp) => cp.id !== id));
    toast.info("Checkpoint removed");
  };

  const handleFitBounds = () => {
    if (!mapInstanceRef.current || checkpoints.length === 0) return;
    const latLngs = checkpoints.map((cp) => [cp.lat, cp.lng] as L.LatLngTuple);
    mapInstanceRef.current.fitBounds(L.latLngBounds(latLngs), { padding: [50, 50] });
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#F0F0F0] dark:bg-slate-950 p-[10px]">
      <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white dark:bg-slate-900 rounded-xl border border-[#DFE3EB]/80 dark:border-slate-800 shadow-2xs select-none">
        {/* ─── 1. TOP TITLE HEADER (Matching Trakzee 2.0 Standard Across Settings) ─── */}
      <div className="relative z-20 flex items-center justify-between px-5 pt-4 pb-3 select-none shrink-0 bg-white dark:bg-slate-900 border-b border-[#DFE3EB] dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate({ to: "/setting" })}
            className="p-1 -ml-1 rounded text-slate-700 dark:text-slate-200 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title="Back to Settings"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
          </button>
          <h1 className="text-[24px] font-medium text-slate-900 dark:text-white tracking-tight">
            Trip Planning
          </h1>
        </div>
      </div>

      {/* ─── 2. MAIN WORKSPACE (Uncluttered 2-Column Left Form Panel + Right Map & Drawer) ─── */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* =================================================================
            COMPACT SINGLE-COLUMN LEFT SIDEBAR (Matching Application Theme)
           ================================================================= */}
        <aside className="w-[340px] xl:w-[350px] bg-white dark:bg-slate-900 border-r border-[#DFE3EB] dark:border-slate-800 flex flex-col shrink-0 select-none z-10 min-h-0">
          {/* Form Body: Single-column linear vertical stack with standard Trakzee 2.0 spacing */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 py-3.5 space-y-3.5 text-xs">
            {/* 1. Company */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Company <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <SelectDropdown
                value={company}
                options={COMPANY_OPTIONS}
                onChange={setCompany}
                placeholder="Select Company"
                triggerClassName="h-8 text-xs px-2.5"
              />
            </div>

            {/* 2. Branch */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Branch <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <SelectDropdown
                value={branch}
                options={BRANCH_OPTIONS}
                onChange={setBranch}
                placeholder="Select Branch"
                triggerClassName="h-8 text-xs px-2.5"
              />
            </div>

            {/* 3. Trip Type (Joined Button Group) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Trip Type
              </label>
              <div className="inline-flex w-full rounded-md shadow-2xs" role="group">
                <button
                  type="button"
                  onClick={() => setTripType("Pickup")}
                  className={cn(
                    "flex-1 h-7.5 px-3 text-xs font-semibold rounded-l-md border transition-all cursor-pointer flex items-center justify-center",
                    tripType === "Pickup"
                      ? "bg-[#0089FF] text-white border-[#0089FF] z-10 shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-[#DFE3EB] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 font-medium"
                  )}
                >
                  Pickup
                </button>
                <button
                  type="button"
                  onClick={() => setTripType("Drop")}
                  className={cn(
                    "flex-1 h-7.5 px-3 text-xs font-semibold rounded-r-md border -ml-px transition-all cursor-pointer flex items-center justify-center",
                    tripType === "Drop"
                      ? "bg-[#0089FF] text-white border-[#0089FF] z-10 shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-[#DFE3EB] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 font-medium"
                  )}
                >
                  Drop
                </button>
              </div>
            </div>

            {/* 4. Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Name <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <input
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="Enter trip name"
                className="h-8 w-full rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 text-xs text-foreground placeholder:text-slate-400 focus:border-[#0089FF] focus:outline-none shadow-2xs font-medium"
              />
            </div>

            {/* 5. Trip Creation Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Trip Creation Type
              </label>
              <SelectDropdown
                value={tripCreationType}
                options={["Manual", "Bulk Upload"]}
                onChange={(val) => setTripCreationType(val === "Bulk Upload" ? "Bulk" : "Manual")}
                triggerClassName="h-8 text-xs px-2.5"
              />
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal leading-tight">
                Add checkpoint or Employee details on screen or use bulk upload sheet
              </p>
              <div className="inline-flex w-full rounded-md shadow-2xs pt-0.5" role="group">
                <button
                  type="button"
                  onClick={() => setTripCreationType("Manual")}
                  className={cn(
                    "flex-1 h-7.5 px-3 text-xs font-semibold rounded-l-md border transition-all cursor-pointer flex items-center justify-center",
                    tripCreationType === "Manual"
                      ? "bg-[#0089FF] text-white border-[#0089FF] z-10 shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-[#DFE3EB] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 font-medium"
                  )}
                >
                  Manual
                </button>
                <button
                  type="button"
                  onClick={() => setTripCreationType("Bulk")}
                  className={cn(
                    "flex-1 h-7.5 px-3 text-xs font-semibold rounded-r-md border -ml-px transition-all cursor-pointer flex items-center justify-center",
                    tripCreationType === "Bulk"
                      ? "bg-[#0089FF] text-white border-[#0089FF] z-10 shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-[#DFE3EB] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 font-medium"
                  )}
                >
                  Bulk
                </button>
              </div>
            </div>

            {/* 6. Consider Trip with Route Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer py-0.5">
              <input
                type="checkbox"
                checked={considerTripWithRoute}
                onChange={(e) => setConsiderTripWithRoute(e.target.checked)}
                className="accent-[#0089FF] h-4 w-4 rounded border-[#DFE3EB] cursor-pointer"
              />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Consider Trip with Route
              </span>
            </label>

            {/* 7. Vehicle */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Vehicle
              </label>
              <SelectDropdown
                value={vehicle}
                options={VEHICLE_OPTIONS}
                onChange={setVehicle}
                placeholder="Select Vehicle"
                triggerClassName="h-8 text-xs px-2.5"
              />
              <p className="text-[10px] text-red-500 font-medium leading-tight">
                Only vehicles with available seat capacity are shown.
              </p>
            </div>

            {/* 8. Schedule Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Schedule Type
              </label>
              <SelectDropdown
                value={scheduleType}
                options={SCHEDULE_TYPES}
                onChange={setScheduleType}
                placeholder="Select Schedule Type"
                triggerClassName="h-8 text-xs px-2.5"
              />
            </div>

            {/* 9. Repeat Schedule */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Repeat Schedule
              </label>
              <div className="inline-flex w-full rounded-md shadow-2xs" role="group">
                {(["Daily", "Weekly", "Monthly"] as const).map((r, i) => {
                  const isActive = repeatSchedule === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRepeatSchedule(r)}
                      className={cn(
                        "flex-1 h-7.5 px-2 text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center",
                        i > 0 && "-ml-px",
                        i === 0 && "rounded-l-md",
                        i === 2 && "rounded-r-md",
                        isActive
                          ? "bg-[#0089FF] text-white border-[#0089FF] z-10 shadow-xs"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-[#DFE3EB] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 font-medium"
                      )}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 10. Valid From */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Valid From
              </label>
              <input
                type="date"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                className="h-8 w-full rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 text-xs text-foreground focus:border-[#0089FF] focus:outline-none shadow-2xs font-medium cursor-pointer"
              />
            </div>

            {/* 11. Valid To */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Valid To
              </label>
              <input
                type="date"
                value={validTo}
                onChange={(e) => setValidTo(e.target.value)}
                className="h-8 w-full rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 text-xs text-foreground focus:border-[#0089FF] focus:outline-none shadow-2xs font-medium cursor-pointer"
              />
            </div>

            {/* 12. Pickup Window (From - To) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Pickup
              </label>
              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  value={pickupFromTime}
                  onChange={(e) => setPickupFromTime(e.target.value)}
                  placeholder="12:15 PM"
                  className="h-8 flex-1 min-w-0 w-0 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 px-2 text-xs text-foreground text-center focus:border-[#0089FF] focus:outline-none shadow-2xs font-medium"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0 px-0.5">
                  To
                </span>
                <input
                  type="text"
                  value={pickupToTime}
                  onChange={(e) => setPickupToTime(e.target.value)}
                  placeholder="12:20 PM"
                  className="h-8 flex-1 min-w-0 w-0 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 px-2 text-xs text-foreground text-center focus:border-[#0089FF] focus:outline-none shadow-2xs font-medium"
                />
              </div>
            </div>

            {/* 13. Start - End Time */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Start - End Time
              </label>
              <input
                type="text"
                value={startEndTime}
                onChange={(e) => setStartEndTime(e.target.value)}
                placeholder="20-11-2026 12:00PM - 20-11-2026 12:00PM"
                className="h-8 w-full rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 text-xs text-foreground focus:border-[#0089FF] focus:outline-none shadow-2xs font-medium"
              />
            </div>

            {/* 14. Route Tolerance */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Route Tolerance (meter)
              </label>
              <input
                type="number"
                value={routeTolerance}
                onChange={(e) => setRouteTolerance(e.target.value)}
                className="h-8 w-full rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 text-xs text-foreground focus:border-[#0089FF] focus:outline-none shadow-2xs font-medium"
              />
            </div>

            {/* 15. Trip start buffer time */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Trip start buffer time(minutes)
              </label>
              <input
                type="number"
                value={bufferTime}
                onChange={(e) => setBufferTime(e.target.value)}
                className="h-8 w-full rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 text-xs text-foreground focus:border-[#0089FF] focus:outline-none shadow-2xs font-medium"
              />
            </div>

            {/* 16. Force Close Duration */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Force Close Duration
              </label>
              <input
                type="text"
                value={forceCloseDuration}
                onChange={(e) => setForceCloseDuration(e.target.value)}
                placeholder="01:00"
                className="h-8 w-full rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 text-xs text-foreground focus:border-[#0089FF] focus:outline-none shadow-2xs font-medium"
              />
            </div>

            {/* 17. Require OTP Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={requireOtp}
                onChange={(e) => setRequireOtp(e.target.checked)}
                className="accent-[#0089FF] h-4 w-4 rounded border-[#DFE3EB] cursor-pointer"
              />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Require OTP for Boarding
              </span>
            </label>
          </div>

          {/* ─── 3. BOTTOM FORM FOOTER (Matching Trakzee 2.0 Standard: Only Reset and Save) ─── */}
          <footer className="flex h-11 items-center justify-start gap-2.5 px-3.5 bg-white dark:bg-slate-900 border-t border-[#DFE3EB] dark:border-slate-800 shrink-0 select-none">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-7.5 items-center justify-center gap-1.5 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-background px-3.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-[#0089FF]/40 transition-all cursor-pointer shadow-2xs active:scale-98"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex h-7.5 items-center justify-center gap-1.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-4.5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer active:scale-98"
            >
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Save</span>
            </button>
          </footer>
        </aside>

        {/* =================================================================
            RIGHT MAIN AREA (Interactive Map + Bottom Collapsible Drawer)
           ================================================================= */}
        <main className="flex-1 min-w-0 flex flex-col relative overflow-hidden bg-slate-100 dark:bg-slate-950">
          {/* Leaflet Map Canvas */}
          <div className="flex-1 w-full h-full relative">
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Floating Map Controls on Top Right */}
            <div className="absolute top-3.5 right-3.5 z-10 flex flex-col gap-1.5">
              <div className="bg-white dark:bg-slate-900 rounded-md shadow-md border border-[#DFE3EB] dark:border-slate-800 flex flex-col overflow-hidden">
                <button
                  type="button"
                  onClick={() => mapInstanceRef.current?.zoomIn()}
                  className="w-7.5 h-7.5 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border-b border-[#DFE3EB] dark:border-slate-800 font-bold text-sm cursor-pointer"
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => mapInstanceRef.current?.zoomOut()}
                  className="w-7.5 h-7.5 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-sm cursor-pointer"
                  title="Zoom Out"
                >
                  −
                </button>
              </div>

              <button
                type="button"
                onClick={handleFitBounds}
                className="w-7.5 h-7.5 bg-white dark:bg-slate-900 rounded-md shadow-md border border-[#DFE3EB] dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title="Fit Route Bounds"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* ===============================================================
              4. BOTTOM COLLAPSIBLE DRAG UP/DOWN PANEL (Horizontal Drawer)
             =============================================================== */}
          <div
            style={{
              height: isTableCollapsed ? "42px" : `${tableHeight}px`,
            }}
            className="absolute bottom-2.5 left-2.5 right-2.5 z-40 pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-[#DFE3EB] dark:border-slate-800 rounded-2xl shadow-2xl transition-[height] duration-150 flex flex-col select-none overflow-hidden"
          >
            {/* Top Edge Drag Handle Line (Single Drag Handle as Requested) */}
            <div
              onMouseDown={handleStartResizeTable}
              className="absolute -top-1.5 left-0 right-0 h-3 cursor-ns-resize flex items-center justify-center group z-50"
              title="Drag up/down to adjust panel height"
            >
              <div className="w-12 h-1 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-[#0089FF] group-hover:w-20 transition-all shadow-xs" />
            </div>

            {/* Table Top Header Toolbar: Clean Minimalist Layout */}
            <div className="h-10 px-3 flex items-center justify-between border-b border-[#DFE3EB] dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shrink-0 gap-2">
              {/* Left Side: Checkpoints Label + Add Stop */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Checkpoints
                </span>

                <button
                  type="button"
                  onClick={handleAddCheckpoint}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-50 text-[#0089FF] hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer shadow-2xs"
                  title="Add Checkpoint Stop"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Stop</span>
                </button>
              </div>

              {/* Right Side: Boxed Chevron Toggle Button (Matching Playback Screen) */}
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setIsTableCollapsed((prev) => !prev)}
                  className="h-7 w-7 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-slate-100/90 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-[#0089FF] flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs"
                  title={isTableCollapsed ? "Expand Data Panel" : "Collapse to Tab Bar"}
                >
                  <ChevronUp
                    className={cn(
                      "h-4 w-4 transition-transform duration-200 stroke-[2.5]",
                      !isTableCollapsed && "rotate-180"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Checkpoints Data Table Content */}
            {!isTableCollapsed && (
              <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar p-2">
                  <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
                    <thead>
                      <tr className="border-b border-[#DFE3EB] dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/90 text-[11px] font-bold text-slate-600 dark:text-slate-300 select-none sticky top-0 z-10">
                        <th className="py-2.5 px-3.5 w-16">Index</th>
                        <th className="py-2.5 px-3.5">Location</th>
                        <th className="py-2.5 px-3.5 w-36 text-center">Allocated Employees</th>
                        <th className="py-2.5 px-3.5 w-28 text-center">Return Point</th>
                        <th className="py-2.5 px-3.5 w-36 text-center">Estimated Reach Time</th>
                        <th className="py-2.5 px-3.5 w-24 text-center">Halt</th>
                        <th className="py-2.5 px-3.5 w-20 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DFE3EB]/60 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
                      {checkpoints.map((cp, idx) => {
                        const isStart = cp.type === "start";
                        const isEnd = cp.type === "end";
                        const isSelected = cp.id === selectedCheckpointId;

                        return (
                          <tr
                            key={cp.id}
                            onClick={() => {
                              setSelectedCheckpointId(cp.id);
                              mapInstanceRef.current?.flyTo([cp.lat, cp.lng], 13, { duration: 0.6 });
                            }}
                            className={cn(
                              "cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50",
                              isSelected && "bg-blue-50/60 dark:bg-blue-900/20"
                            )}
                          >
                            {/* Index with Reorder Icon and Start/Stop/Finish Flag */}
                            <td className="py-2.5 px-3.5">
                              <div className="flex items-center gap-1.5">
                                <GripVertical className="h-3 w-3 text-slate-400 cursor-grab shrink-0" />
                                {isStart ? (
                                  <span className="text-xs shrink-0" title="Start Point">
                                    🚩
                                  </span>
                                ) : isEnd ? (
                                  <span className="text-xs shrink-0" title="End Point">
                                    🏁
                                  </span>
                                ) : (
                                  <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0089FF] dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                                    {idx + 1}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Location */}
                            <td className="py-2.5 px-3.5">
                              <span className="font-semibold text-slate-900 dark:text-white hover:text-[#0089FF] transition-colors">
                                {cp.location}
                              </span>
                            </td>

                            {/* Allocated Employees */}
                            <td className="py-2.5 px-3.5 text-center">
                              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                {cp.allocatedEmployees}
                              </span>
                            </td>

                            {/* Return Point Checkbox */}
                            <td className="py-2.5 px-3.5 text-center">
                              <input
                                type="checkbox"
                                checked={cp.returnPoint}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  setCheckpoints(
                                    checkpoints.map((item) =>
                                      item.id === cp.id
                                        ? { ...item, returnPoint: e.target.checked }
                                        : item
                                    )
                                  );
                                }}
                                className="accent-[#0089FF] h-4 w-4 rounded border-[#DFE3EB] cursor-pointer"
                              />
                            </td>

                            {/* Estimated Reach Time */}
                            <td className="py-2.5 px-3.5 text-center text-xs font-mono text-slate-600 dark:text-slate-300">
                              {cp.estimatedReachTime}
                            </td>

                            {/* Halt */}
                            <td className="py-2.5 px-3.5 text-center text-xs text-slate-600 dark:text-slate-300">
                              {cp.haltMinutes > 0 ? `${cp.haltMinutes} min` : "—"}
                            </td>

                            {/* Actions */}
                            <td className="py-2.5 px-3.5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {!isStart && !isEnd && (
                                  <button
                                    type="button"
                                    onClick={(e) => handleDeleteCheckpoint(cp.id, e)}
                                    className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                                    title="Delete stop"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
            )}
          </div>
        </main>
      </div>
      </div>
    </div>
  );
}
