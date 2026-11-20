import React, { useState, useMemo, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  AlertOctagon,
  AlertTriangle,
  Bus,
  Car,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Edit3,
  Gauge,
  List,
  Map as MapIcon,
  MapPinOff,
  MessageSquare,
  Phone,
  Radio,
  RefreshCw,
  ShieldAlert,
  SlidersHorizontal,
  Smartphone,
  Unplug,
  User,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MOCK_ALERTS,
  MOCK_NEARBY_VEHICLES,
  ALERT_TYPE_ITEMS,
  getSeverityMeta,
  type AlertSeverity,
  type SafetyAlert,
} from "@/data/safetyDashboardData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { TablePaginationBar } from "@/components/common/TablePaginationBar";

type ViewMode = "map" | "table";
type ActivePanelType = "medium" | "exception" | "critical" | "high" | "alert_types";
type AlertTab = "open" | "acknowledged" | "closed";

interface SafetyDashboardTabProps {
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  resetMapTrigger?: number;
}

// 3 Employees Mock Data matching reference media_1795070908528_e696de0a.png
const VEHICLE_EMPLOYEES = [
  { name: "Keyur Shah", phone: "+91 98765 43212", pickup: "Pickup 05:10 PM" },
  { name: "Riya Patel", phone: "+91 98765 43213", pickup: "Pickup 05:15 PM" },
  { name: "Amit Desai", phone: "+91 98765 43214", pickup: "Pickup 05:20 PM" },
];

export function SafetyDashboardTab({
  viewMode = "map",
  onViewModeChange,
  resetMapTrigger,
}: SafetyDashboardTabProps) {
  const [activePanel, setActivePanel] = useState<ActivePanelType>("medium");
  const [panelOpen, setPanelOpen] = useState(true);
  const [nearbyPanelOpen, setNearbyPanelOpen] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("v1");
  const [activeAlertTab, setActiveAlertTab] = useState<AlertTab>("open");
  const [employeeOverlayOpen, setEmployeeOverlayOpen] = useState(false);
  const [expandedAlerts, setExpandedAlerts] = useState<Record<string, boolean>>({
    "alert-1": true,
    "alert-2": true,
  });

  const toggleAlertExpand = (id: string) => {
    setExpandedAlerts((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id],
    }));
  };

  const [commentTarget, setCommentTarget] = useState<SafetyAlert | null>(null);
  const [commentText, setCommentText] = useState("");
  const [alerts, setAlerts] = useState<SafetyAlert[]>(MOCK_ALERTS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tablePage, setTablePage] = useState(1);
  const [tablePageSize, setTablePageSize] = useState(10);

  // Leaflet Map Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Position vehicle in Maharashtra (matching reference ref_vehicle_1.png near MH 15 region)
  const vehiclePosition: [number, number] = [19.75, 75.85];
  const defaultCenter: [number, number] = [20.2, 77.2];

  // Listen for resetMapTrigger from top header button
  useEffect(() => {
    if (resetMapTrigger && mapInstanceRef.current) {
      mapInstanceRef.current.setView(defaultCenter, 6);
      toast.success("Map view reset");
    }
  }, [resetMapTrigger]);

  useEffect(() => {
    if (viewMode !== "map" || !mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 6,
      zoomControl: false,
      attributionControl: false,
    });

    // Clean OpenStreetMap tiles without any API key watermark
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      subdomains: "abc",
      maxZoom: 19,
    }).addTo(map);

    // Custom vehicle marker matching user-provided truck icon media_1795089195547_436ca879.png
    const iconHtml = `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; user-select: none;">
        <!-- User Provided Vehicle Icon -->
        <div style="transition: transform 0.15s ease;">
          <img
            src="/images/safety-truck-marker.png"
            alt="Vehicle"
            style="width: 80px; height: 76px; object-fit: contain; pointer-events: none; display: block;"
          />
        </div>

        <!-- Attached Green License Plate Badge -->
        <div style="margin-top: -12px; padding: 2.5px 8px; border-radius: 4px; background: #16A34A; color: #FFFFFF; font-size: 11px; font-weight: 700; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; white-space: nowrap; border: 1px solid rgba(255,255,255,0.7); box-shadow: 0 2px 6px rgba(0,0,0,0.35); text-align: center; letter-spacing: 0.5px; z-index: 10;">
          MH 15 KL 6455
        </div>
      </div>
    `;

    const customMarkerIcon = L.divIcon({
      html: iconHtml,
      className: "custom-safety-marker",
      iconSize: [96, 88],
      iconAnchor: [48, 44],
    });

    const popupHtml = `
      <div style="width: 240px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 2px;">
        <div style="margin-bottom: 8px;">
          <h4 style="margin: 0; font-size: 12px; font-weight: 700; color: #0F172A;">Vehicle details</h4>
        </div>
        <div style="font-size: 12px; line-height: 1.6; color: #475569;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #94A3B8;">Registered no.</span>
            <span style="font-weight: 600; color: #0F172A;">MH 15 KL 6455</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #94A3B8;">Cab id</span>
            <span style="font-weight: 500; color: #1E293B;">CAB-334</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #94A3B8;">Driver contact</span>
            <a href="tel:+919876543210" style="font-weight: 500; color: #0089FF; text-decoration: none;">+91 98765 43210</a>
          </div>
        </div>
        <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #F1F5F9;">
          <span style="font-size: 11px; font-weight: 600; color: #EF4444;">Unauthorized stop point +1 more</span>
        </div>
      </div>
    `;

    const marker = L.marker(vehiclePosition, { icon: customMarkerIcon }).addTo(map);
    marker.bindPopup(popupHtml, {
      className: "custom-safety-vehicle-popup",
      offset: [190, -20],
      closeButton: true,
      autoPan: false,
    });

    markerRef.current = marker;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [viewMode]);

  // Tab filtering for vehicle alerts card
  const alertsByTab = useMemo(() => {
    return {
      open: alerts.filter((a) => a.vehicleId === selectedVehicleId && a.status === "open"),
      acknowledged: alerts.filter(
        (a) => a.vehicleId === selectedVehicleId && a.status === "acknowledged"
      ),
      closed: alerts.filter((a) => a.vehicleId === selectedVehicleId && a.status === "closed"),
    };
  }, [alerts, selectedVehicleId]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Safety data refreshed");
    }, 600);
  };

  const handleSaveComment = () => {
    if (!commentTarget) return;
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === commentTarget.id
          ? { ...a, comment: commentText, status: "acknowledged" as const }
          : a
      )
    );
    toast.success(`Comment saved for ${commentTarget.vehiclePlate}`);
    setCommentTarget(null);
    setCommentText("");
  };

  // Helper to render alert type icons dynamically
  const renderAlertIcon = (iconName: string, colorClass: string) => {
    const props = { className: cn("h-4 w-4 shrink-0", colorClass) };
    switch (iconName) {
      case "Unplug":
        return <Unplug {...props} />;
      case "Radio":
        return <Radio {...props} />;
      case "Gauge":
        return <Gauge {...props} />;
      case "AlertOctagon":
        return <AlertOctagon {...props} />;
      case "Smartphone":
        return <Smartphone {...props} />;
      case "ShieldAlert":
        return <ShieldAlert {...props} />;
      case "Bus":
        return <Bus {...props} />;
      case "Car":
        return <Car {...props} />;
      case "MapPinOff":
        return <MapPinOff {...props} />;
      case "Clock":
        return <Clock {...props} />;
      case "User":
        return <User {...props} />;
      default:
        return <AlertTriangle {...props} />;
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
      {/* ─── MAP VIEW ──────────────────────────────────────────────────────────── */}
      {viewMode === "map" ? (
        <div className="relative flex-1 min-h-0 w-full h-full overflow-hidden rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          {/* Map canvas */}
          <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-[#e5e3df]" />

          {/* 1. Floating Severity Strip (Height 40px, top-[10px] left-[10px], exactly matching card width: w-[440px]) */}
          <div className="absolute top-[10px] left-[10px] z-[1000] w-[440px] max-w-[calc(100vw-30px)] h-[40px] flex items-center rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs p-1 shadow-md select-none overflow-hidden">
            {/* Left 4 Severity Badges */}
            <div className="flex items-center gap-1 min-w-0">
              {/* 0 Critical */}
              <button
                type="button"
                onClick={() => {
                  setActivePanel("critical");
                  setPanelOpen(true);
                }}
                className={cn(
                  "inline-flex items-center gap-1 h-[32px] px-2 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0",
                  activePanel === "critical" && panelOpen
                    ? "bg-rose-500 text-white shadow-2xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <span className={cn(activePanel === "critical" && panelOpen ? "text-white" : "font-bold text-slate-800 dark:text-slate-200")}>
                  0
                </span>
                <span className="whitespace-nowrap">Critical</span>
              </button>

              {/* 0 High */}
              <button
                type="button"
                onClick={() => {
                  setActivePanel("high");
                  setPanelOpen(true);
                }}
                className={cn(
                  "inline-flex items-center gap-1 h-[32px] px-2 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0",
                  activePanel === "high" && panelOpen
                    ? "bg-orange-500 text-white shadow-2xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <span className={cn(activePanel === "high" && panelOpen ? "text-white" : "font-bold text-slate-800 dark:text-slate-200")}>
                  0
                </span>
                <span className="whitespace-nowrap">High</span>
              </button>

              {/* 100 Medium */}
              <button
                type="button"
                onClick={() => {
                  setActivePanel("medium");
                  setPanelOpen(true);
                }}
                className={cn(
                  "inline-flex items-center gap-1 h-[32px] px-2 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0",
                  activePanel === "medium" && panelOpen
                    ? "bg-[#0089FF] text-white shadow-xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <span>100</span>
                <span className="whitespace-nowrap">Medium</span>
              </button>

              {/* 10 Exception */}
              <button
                type="button"
                onClick={() => {
                  setActivePanel("exception");
                  setPanelOpen(true);
                }}
                className={cn(
                  "inline-flex items-center gap-1 h-[32px] px-2 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0",
                  activePanel === "exception" && panelOpen
                    ? "bg-violet-600 text-white shadow-2xs font-bold"
                    : "text-violet-600 dark:text-violet-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <span className={cn(activePanel === "exception" && panelOpen ? "text-white" : "font-bold text-violet-600 dark:text-violet-400")}>
                  10
                </span>
                <span className="whitespace-nowrap">Exception</span>
              </button>
            </div>

            {/* Vertical Divider */}
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 my-auto shrink-0 mx-1.5" />

            {/* Alert types button (Pushed right with ml-auto, contained comfortably inside white box) */}
            <button
              type="button"
              onClick={() => {
                setActivePanel("alert_types");
                setPanelOpen(true);
              }}
              className={cn(
                "ml-auto inline-flex items-center gap-1.5 h-[32px] px-2.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0",
                activePanel === "alert_types" && panelOpen
                  ? "bg-[#0089FF] text-white shadow-xs font-bold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">Alert types</span>
            </button>
          </div>

          {/* 2. Floating Card Below Severity Bar (top-[58px], Exact Matching Width: w-[440px], overflow-visible for side overlay) */}
          {panelOpen && (
            <div className="absolute top-[58px] left-[10px] z-[1000] w-[440px] max-w-[calc(100vw-30px)] max-h-[calc(100vh-210px)] rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-visible flex flex-col animate-in fade-in slide-in-from-left-2 duration-150">
              {/* Header */}
              <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 capitalize">
                  {activePanel === "alert_types" ? "Alert types" : activePanel}
                </h3>
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  className="h-6 w-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* PANEL VARIANT A: 11 Alert Types List (Single Line Items) */}
              {activePanel === "alert_types" ? (
                <div className="flex-1 overflow-y-auto p-3 space-y-1.5 max-h-[calc(100vh-290px)]">
                  {ALERT_TYPE_ITEMS.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        toast.info(`Filtered by ${item.name}`);
                      }}
                      className="flex items-center justify-between p-2 rounded-lg border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:border-[#0089FF]/60 hover:bg-blue-50/30 dark:hover:bg-slate-700/50 transition-all cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {renderAlertIcon(item.iconName, item.color)}
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap truncate">
                          {item.name}
                        </span>
                      </div>
                      <span className="h-5 min-w-[22px] px-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                /* PANEL VARIANT B: Vehicle Alerts Card Matching reference media_1795070908528_e696de0a.png */
                <>
                  <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    {/* Vehicle Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8.5 w-8.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs p-1">
                          <img
                            src="/images/safety-truck-marker.png"
                            alt="Vehicle"
                            className="h-full w-full object-contain pointer-events-none"
                          />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            MH 15 KL 6455
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-rose-500">02 Alerts</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">3 mins ago</p>
                      </div>
                    </div>

                    {/* Compact Clean Employee Field: Clean White Background, Label on Left, Number 3 on Right without grey badge */}
                    <div className="mt-2.5 w-full">
                      <button
                        type="button"
                        onClick={() => setEmployeeOverlayOpen(!employeeOverlayOpen)}
                        className={cn(
                          "w-full h-8.5 px-3 rounded-lg border flex items-center justify-between transition-all cursor-pointer select-none group bg-white dark:bg-slate-900",
                          employeeOverlayOpen
                            ? "border-[#0089FF] ring-2 ring-[#0089FF]/20 shadow-xs"
                            : "border-slate-200/90 dark:border-slate-700 hover:border-[#0089FF]/60 shadow-2xs"
                        )}
                      >
                        {/* Left: Employee Label */}
                        <div className="flex items-center gap-2">
                          <Users
                            className={cn(
                              "h-3.5 w-3.5 transition-colors",
                              employeeOverlayOpen ? "text-[#0089FF]" : "text-slate-500 group-hover:text-[#0089FF]"
                            )}
                          />
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">
                            Employees
                          </span>
                        </div>

                        {/* Right: Clean Number Counter 3 (No grey pill/text behind 3) & Chevron */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-[#0089FF]">
                            {VEHICLE_EMPLOYEES.length}
                          </span>
                          <ChevronRight
                            className={cn(
                              "h-3.5 w-3.5 text-slate-400 group-hover:text-[#0089FF] transition-transform",
                              employeeOverlayOpen && "text-[#0089FF] translate-x-0.5"
                            )}
                          />
                        </div>
                      </button>
                    </div>

                    {/* Side Overlay for Assigned Employees (Positioned adjacent to card) */}
                    {employeeOverlayOpen && (
                      <div className="absolute top-0 left-[calc(100%+8px)] w-[320px] rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-3 z-[1002] flex flex-col animate-in fade-in slide-in-from-left-2 duration-150 select-none">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-md bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#0089FF]">
                              <Users className="h-3.5 w-3.5" />
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              Assigned Employees ({VEHICLE_EMPLOYEES.length})
                            </h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEmployeeOverlayOpen(false)}
                            className="h-6 w-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                            title="Close"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mt-1 max-h-[280px] overflow-y-auto">
                          {VEHICLE_EMPLOYEES.map((emp) => (
                            <div key={emp.name} className="py-2 flex items-center justify-between text-xs">
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-slate-100">
                                  {emp.name}
                                </p>
                                <span className="text-[11px] text-slate-500 font-medium">
                                  {emp.pickup}
                                </span>
                              </div>

                              {/* Call icon with CSS hover tooltip showing NUMBER ONLY */}
                              <div className="relative group/call flex items-center">
                                <a
                                  href={`tel:${emp.phone}`}
                                  onClick={(e) => {
                                    navigator.clipboard?.writeText(emp.phone);
                                    toast.success(`Copied: ${emp.phone}`);
                                  }}
                                  className="h-7 w-7 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800 text-[#0089FF] flex items-center justify-center hover:bg-[#0089FF] hover:text-white transition-all cursor-pointer shadow-2xs active:scale-95"
                                  aria-label={`Call ${emp.name} at ${emp.phone}`}
                                >
                                  <Phone className="h-3 w-3 fill-current/15" />
                                </a>

                                {/* Guaranteed Visible Hover Tooltip - ONLY the number, no extra text */}
                                <div className="pointer-events-none absolute bottom-full right-0 mb-2 hidden group-hover/call:flex flex-col items-center whitespace-nowrap z-[9999] animate-in fade-in zoom-in-95 duration-100">
                                  <div className="rounded-md bg-slate-900 dark:bg-slate-800 text-white px-2 py-0.5 text-xs font-mono font-semibold shadow-2xl border border-slate-700/80">
                                    <span>{emp.phone}</span>
                                  </div>
                                  <div className="w-2 h-2 bg-slate-900 dark:bg-slate-800 border-r border-b border-slate-700/80 transform rotate-45 -mt-1 mr-2.5" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Line & Tabs UI (Clean Proportional Tabs, Zero Negative Spacing) */}
                    <div className="relative mt-3 w-full border-b border-[#DFE3EB] dark:border-slate-800 select-none">
                      <div className="flex items-center w-full">
                        {(["open", "acknowledged", "closed"] as AlertTab[]).map((tab) => {
                          const isActive = activeAlertTab === tab;
                          const count =
                            tab === "open"
                              ? alertsByTab.open.length
                              : tab === "acknowledged"
                              ? alertsByTab.acknowledged.length
                              : alertsByTab.closed.length;
                          const label =
                            tab === "open"
                              ? `Open (${count})`
                              : tab === "acknowledged"
                              ? `Acknowledged (${count})`
                              : `Closed (${count})`;

                          return (
                            <button
                              key={tab}
                              type="button"
                              onClick={() => setActiveAlertTab(tab)}
                              className={cn(
                                "relative flex-1 pb-2.5 pt-1 text-center text-xs font-semibold transition-all cursor-pointer select-none",
                                isActive
                                  ? "text-[#0089FF] font-bold"
                                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                              )}
                            >
                              <span>{label}</span>
                              {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0089FF]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Clean Non-Bulky Alert Items List (Removed heavy grey border cards matching media_1795070908528_e696de0a.png) */}
                  <div className="flex-1 overflow-y-auto px-3.5 py-1 divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[calc(100vh-380px)]">
                    {alertsByTab[activeAlertTab].length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        No {activeAlertTab} alerts for this vehicle
                      </div>
                    ) : (
                      alertsByTab[activeAlertTab].map((alert) => {
                        const isExpanded = expandedAlerts[alert.id] !== false;
                        const hasComment = Boolean(alert.comment && alert.comment.trim().length > 0);
                        return (
                          <div
                            key={alert.id}
                            className="py-2.5 transition-all"
                          >
                            {/* Alert Header Row */}
                            <div
                              className="flex items-center justify-between cursor-pointer select-none group"
                              onClick={() => toggleAlertExpand(alert.id)}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#0089FF] transition-colors truncate">
                                  {alert.alertType}
                                </span>
                                <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold bg-sky-100 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 shrink-0">
                                  Medium
                                </span>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                {/* Comment icon: Red = no comment, Green = comment exists */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCommentTarget(alert);
                                    setCommentText(alert.comment || "");
                                  }}
                                  className={cn(
                                    "h-5.5 w-5.5 rounded flex items-center justify-center cursor-pointer transition-colors",
                                    hasComment
                                      ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400"
                                      : "text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:text-rose-400"
                                  )}
                                  title={hasComment ? `Comment: ${alert.comment}` : "No comment (Click to add)"}
                                >
                                  <MessageSquare
                                    className={cn(
                                      "h-3 w-3 transition-colors",
                                      hasComment
                                        ? "text-emerald-600 dark:text-emerald-400 fill-emerald-600/20"
                                        : "text-rose-500 dark:text-rose-400 fill-rose-500/15"
                                    )}
                                  />
                                </button>

                                <button
                                  type="button"
                                  className="h-5.5 w-5.5 rounded flex items-center justify-center text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 cursor-pointer transition-colors"
                                  aria-label={isExpanded ? "Collapse alert details" : "Expand alert details"}
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="h-3.5 w-3.5" />
                                  ) : (
                                    <ChevronDown className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Collapsible Details Body */}
                            {isExpanded && (
                              <div className="mt-2 space-y-1 text-xs text-slate-500 animate-in fade-in duration-150">
                                <div className="flex justify-between items-center text-[11px]">
                                  <span className="text-slate-400">Office</span>
                                  <span className="font-medium text-slate-800 dark:text-slate-200">
                                    {alert.office}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                  <span className="text-slate-400">Time</span>
                                  <span className="font-medium text-slate-800 dark:text-slate-200">
                                    {alert.time}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                  <span className="text-slate-400">Location</span>
                                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[220px] text-right">
                                    {alert.location}
                                  </span>
                                </div>
                                {alert.comment && (
                                  <div className="mt-1 p-1.5 rounded bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 text-[10px] text-amber-800 dark:text-amber-300">
                                    <span className="font-semibold">Note:</span> {alert.comment}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Card Footer: Driver Rajesh Patel with Contact Details matching reference media_1795070908528_e696de0a.png */}
                  <div className="px-3.5 py-2.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs shrink-0 rounded-b-xl">
                    <span className="text-slate-500 font-medium">Driver Rajesh Patel</span>
                    <div className="relative group/drivercall flex items-center">
                      <a
                        href="tel:+919876543210"
                        onClick={(e) => {
                          navigator.clipboard?.writeText("+91 98765 43210");
                          toast.success("Copied driver contact: +91 98765 43210");
                        }}
                        className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-[#0089FF] dark:hover:text-[#0089FF] font-semibold transition-colors cursor-pointer"
                        aria-label="Call Driver Rajesh Patel"
                      >
                        <Phone className="h-3 w-3 text-[#0089FF]" />
                        <span className="text-xs font-mono">+91 98765 43210</span>
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 3. Floating Nearby Vehicles Panel (Top-Right: top-[10px] right-[10px], w-[285px]) */}
          {nearbyPanelOpen && (
            <div className="absolute top-[10px] right-[10px] z-[1000] w-[285px] rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-right-2 duration-150">
              <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Nearby vehicles
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Within 2 km of MH 15 KL 6455
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNearbyPanelOpen(false)}
                  className="h-6 w-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {MOCK_NEARBY_VEHICLES.map((v) => (
                  <div key={v.id} className="p-3 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {v.plate}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                          v.status === "running" &&
                            "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-400",
                          v.status === "idle" &&
                            "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-400",
                          v.status === "stopped" &&
                            "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400"
                        )}
                      >
                        {v.statusLabel}
                      </span>
                    </div>
                    <div className="space-y-0.5 text-[11px] text-slate-500">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Driver</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {v.driver}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Contact</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {v.contact}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leaflet Custom Popup Styling */}
          <style>{`
            .custom-safety-vehicle-popup .leaflet-popup-content-wrapper {
              border-radius: 12px;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.18), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
              border: 1px solid rgba(226, 232, 240, 0.95);
              padding: 6px 10px;
              background: #ffffff;
            }
            .custom-safety-vehicle-popup .leaflet-popup-content {
              margin: 4px 6px;
              line-height: 1.5;
            }
            .custom-safety-vehicle-popup .leaflet-popup-tip-container {
              display: none;
            }
            .custom-safety-vehicle-popup .leaflet-popup-close-button {
              top: 8px !important;
              right: 10px !important;
              color: #94A3B8 !important;
              font-size: 16px !important;
            }
            .custom-safety-vehicle-popup .leaflet-popup-close-button:hover {
              color: #1E293B !important;
            }
          `}</style>
        </div>
      ) : (
        /* ─── TABLE VIEW ────────────────────────────────────────────────────────── */
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          {/* Top Bar for Table View matching theme (Height 45px for severity tabs) */}
          <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
            {/* Left: Severity Badges Strip (Height 45px) */}
            <div className="flex items-center gap-2 h-[45px]">
              <span className="inline-flex items-center gap-1.5 h-[37px] px-3.5 rounded-md text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap shrink-0">
                <span className="font-bold">0</span> Critical
              </span>
              <span className="inline-flex items-center gap-1.5 h-[37px] px-3.5 rounded-md text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap shrink-0">
                <span className="font-bold">0</span> High
              </span>
              <span className="inline-flex items-center gap-1.5 h-[37px] px-3.5 rounded-md text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap shrink-0">
                <span className="font-bold">0</span> Medium
              </span>
              <span className="inline-flex items-center gap-1.5 h-[37px] px-3.5 rounded-md text-xs font-semibold border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 whitespace-nowrap shrink-0">
                <span className="font-bold">03</span> Exception
              </span>
            </div>

            {/* Right: Theme-compliant Refresh Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                title="Refresh safety data"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:border-[#0089FF]/50 cursor-pointer select-none shadow-2xs active:scale-95"
              >
                <RefreshCw
                  className={cn(
                    "h-3.5 w-3.5",
                    isRefreshing && "animate-spin text-[#0089FF]"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 min-h-0 overflow-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 dark:bg-slate-800/60 sticky top-0 z-10">
                <TableRow className="border-b border-slate-200 dark:border-slate-700">
                  <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300">Date</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300">Vendor</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300 text-center">Alerts</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300">Object</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300 text-center">Boarded</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300">Location</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300 text-center">Speed</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300">Last Updated</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300 text-center">Comment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((row) => (
                  <TableRow key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 text-xs">
                    <TableCell className="font-medium text-slate-700 dark:text-slate-300 py-3">
                      {row.time}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400">
                      {row.vendor || "ABC Company"}
                    </TableCell>
                    <TableCell className="text-center font-bold text-slate-800 dark:text-slate-200">
                      2
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                      {row.vehiclePlate}
                    </TableCell>
                    <TableCell className="text-center text-slate-700 dark:text-slate-300">
                      {row.boardedCount || 3}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400 max-w-[280px] truncate">
                      {row.location}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-slate-700 dark:text-slate-300">
                      {row.speed || 65} km/h
                    </TableCell>
                    <TableCell className="text-slate-500">
                      01 min 39 sec ago
                    </TableCell>
                    <TableCell className="text-center">
                      {(() => {
                        const hasRowComment = Boolean(row.comment && row.comment.trim().length > 0);
                        return (
                          <button
                            type="button"
                            onClick={() => {
                              setCommentTarget(row);
                              setCommentText(row.comment || "");
                            }}
                            className={cn(
                              "inline-flex h-7 w-7 items-center justify-center rounded cursor-pointer transition-colors",
                              hasRowComment
                                ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
                                : "text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
                            )}
                            title={hasRowComment ? `Comment: ${row.comment}` : "No comment (Click to add)"}
                          >
                            <MessageSquare
                              className={cn(
                                "h-4 w-4 transition-colors",
                                hasRowComment
                                  ? "text-emerald-600 dark:text-emerald-400 fill-emerald-600/20"
                                  : "text-rose-500 dark:text-rose-400 fill-rose-500/15"
                              )}
                            />
                          </button>
                        );
                      })()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Bottom Table Pagination Bar */}
          <TablePaginationBar
            page={tablePage}
            pageSize={tablePageSize}
            totalRows={alerts.length}
            onPageChange={setTablePage}
            onPageSizeChange={setTablePageSize}
            showReset={false}
            showExport={true}
            onExport={(fmt) => toast.success(`Exporting as ${fmt}`)}
          />
        </div>
      )}

      {/* ─── COMMENT / ACKNOWLEDGE DIALOG ────────────────────────────────────────── */}
      <Dialog open={!!commentTarget} onOpenChange={(open) => !open && setCommentTarget(null)}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Add Comment / Acknowledge
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-3">
            <div className="text-xs text-slate-500 space-y-1">
              <p>
                <strong className="text-slate-700 dark:text-slate-300">Vehicle:</strong>{" "}
                {commentTarget?.vehiclePlate} ({commentTarget?.cabId})
              </p>
              <p>
                <strong className="text-slate-700 dark:text-slate-300">Alert:</strong>{" "}
                {commentTarget?.alertType}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Comment
              </label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Enter acknowledgment or resolution details..."
                rows={3}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-slate-100 shadow-2xs transition-all hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setCommentTarget(null)}
              className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveComment}
              className="h-8 px-4 rounded-lg bg-[#0089FF] hover:bg-[#0077e6] text-white text-xs font-semibold shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              Save & Acknowledge
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
