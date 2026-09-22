import {
  Activity,
  ArrowUpDown,
  Bell,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  Eye,
  FileText,
  Filter,
  Flame,
  Info,
  Key,
  Layers,
  Lock,
  MapPin,
  Mic,
  MoreVertical,
  Navigation,
  Phone,
  Play,
  Plus,
  PlusCircle,
  Power,
  Radio,
  RotateCcw,
  RotateCw,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  SlidersHorizontal,
  Target,
  TrendingUp,
  Truck,
  User,
  Video,
  Wifi,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { STATUS_META, type FleetObject, type ObjectStatus } from "@/data/fleet";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type TrackingTab =
  | "object"
  | "driver"
  | "geofence"
  | "route"
  | "landmark"
  | "camera"
  | "alerts";

export function FleetExplorerPanel({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  checkedVehicleIds,
  onToggleCheckVehicle,
  onToggleCheckGroup,
  onToggleCheckAll,
  onOpenDashcam,
  onOpenSettings,
  onOpenTelemetry,
  onTraceVehicle,
  onOpenAddVehicle,
  onToggleCollapse,
  selectedColumns = [
    "ignition",
    "gps",
    "speed",
    "last_updated",
    "driver",
    "address",
    "live_streaming",
    "immobilize",
  ],
  onStartResize,
  onResetWidth,
  style,
  className,
}: {
  vehicles: FleetObject[];
  selectedVehicleId: string;
  onSelectVehicle: (id: string) => void;
  checkedVehicleIds: string[];
  onToggleCheckVehicle: (id: string) => void;
  onToggleCheckGroup: (ids: string[]) => void;
  onToggleCheckAll: () => void;
  onOpenDashcam: (vehicle: FleetObject) => void;
  onOpenSettings: () => void;
  onOpenTelemetry: (vehicle: FleetObject) => void;
  onTraceVehicle: (vehicle: FleetObject) => void;
  onOpenAddVehicle?: () => void;
  onToggleCollapse?: () => void;
  selectedColumns?: string[];
  onStartResize?: () => void;
  onResetWidth?: () => void;
  style?: React.CSSProperties;
  className?: string;
}) {
  const [activeTab, setActiveTab] = useState<TrackingTab>("object");
  const [query, setQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState<ObjectStatus | "all">("all");
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    Company: false,
    Indonesia: false,
    Thailand: false,
    Valsad: false,
    Itriangle: false,
    Ruptela: false,
    "Shivam Test": false,
  });

  // Local vehicles state
  const [localVehicles, setLocalVehicles] = useState<FleetObject[]>(vehicles);
  useEffect(() => {
    setLocalVehicles(vehicles);
  }, [vehicles]);

  // Reload Animation State
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Master Filter Options matching reference image
  const ALL_FILTER_COMPANIES = useMemo(
    () => [
      "Agrawal Industries",
      "BSJ",
      "Bhavya Test Account",
      "Company",
      "Indonesia",
      "Thailand",
      "Valsad",
      "Itriangle",
      "Ruptela",
      "Shivam Test",
    ],
    [],
  );

  // Filter Popover State (Report Overlay Style matching Image 3)
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>("Group(s)");
  const [selectedGroups, setSelectedGroups] = useState<string[]>(["All"]);
  const [tempSelectedGroups, setTempSelectedGroups] = useState<string[]>([]);

  // Sync draft filter when filter popover opens
  useEffect(() => {
    if (filterOpen) {
      setTempSelectedGroups(
        selectedGroups.includes("All") ? ALL_FILTER_COMPANIES : selectedGroups,
      );
      setFilterSearch("");
    }
  }, [filterOpen, selectedGroups, ALL_FILTER_COMPANIES]);

  // Sort Popover State (Report Overlay Style matching Image 3)
  const [sortOpen, setSortOpen] = useState(false);
  const [activeSortCategory, setActiveSortCategory] = useState<"Sorting" | "Order">("Sorting");
  const [sortField, setSortField] = useState<"number" | "name" | "status" | "last_updated" | "ignition" | "power" | "driver">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [tempSortField, setTempSortField] = useState<"number" | "name" | "status" | "last_updated" | "ignition" | "power" | "driver">("name");
  const [tempSortDirection, setTempSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (sortOpen) {
      setTempSortField(sortField);
      setTempSortDirection(sortDirection);
    }
  }, [sortOpen, sortField, sortDirection]);

  // Handler for Reloading Objects
  const handleReload = () => {
    setIsRefreshing(true);
    toast.success("Object status refreshed", {
      description: `Synchronized ${localVehicles.length} vehicles with live telemetry.`,
    });
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  // Handler for Adding New Object
  const handleAddObjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjectForm.name.trim()) {
      toast.error("Object Name is required");
      return;
    }
    const newId = `veh-${Date.now()}`;
    const newObj: FleetObject = {
      id: newId,
      name: newObjectForm.name.trim(),
      branch: newObjectForm.branch || "Company",
      imei: newObjectForm.imei.trim() || `864201${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: newObjectForm.status,
      speed: newObjectForm.status === "running" ? 48 : 0,
      address: "Central Logistics Hub, Gate 2",
      lastUpdated: "Just now",
      ignition: newObjectForm.status === "running" || newObjectForm.status === "idle",
      gps: true,
      driver: "Assigned Driver",
      plateNumber: newObjectForm.plateNumber.trim() || "GJ 01 XX 9999",
      battery: 98,
    };
    setLocalVehicles((prev) => [newObj, ...prev]);
    toast.success("New Object Added Successfully!", {
      description: `${newObj.name} has been added to ${newObj.branch}.`,
    });
    setNewObjectForm({
      name: "",
      imei: "",
      branch: "Company",
      model: "Teltonika FMB920",
      plateNumber: "",
      status: "running",
    });
    setAddObjectOpen(false);
  };

  // Summary counts
  const counts = useMemo(() => {
    return {
      running: localVehicles.filter((v) => v.status === "running").length || 21,
      idle: localVehicles.filter((v) => v.status === "idle").length || 1,
      stopped: localVehicles.filter((v) => v.status === "stopped").length || 21,
      inactive: localVehicles.filter((v) => v.status === "inactive").length || 67,
      nodata: localVehicles.filter((v) => v.status === "nodata").length || 14,
      total: localVehicles.length || 124,
    };
  }, [localVehicles]);

  // Filter & Sort vehicles
  const filteredVehicles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return localVehicles
      .filter((v) => {
        const matchesStatus =
          activeStatus === "all" || v.status === activeStatus;
        const matchesQuery =
          q === "" ||
          v.name.toLowerCase().includes(q) ||
          v.branch.toLowerCase().includes(q) ||
          v.imei.toLowerCase().includes(q) ||
          (v.driver && v.driver.toLowerCase().includes(q)) ||
          (v.address && v.address.toLowerCase().includes(q)) ||
          (v.plateNumber && v.plateNumber.toLowerCase().includes(q));
        const matchesGroup =
          selectedGroups.includes("All") ||
          selectedGroups.some(
            (g) =>
              v.branch.toLowerCase().includes(g.toLowerCase()) ||
              (g === "Trucks" && (v.name.toLowerCase().includes("truck") || v.name.toLowerCase().includes("volvo") || v.name.toLowerCase().includes("scania")))
          );
        return matchesStatus && matchesQuery && matchesGroup;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === "name") {
          cmp = a.name.localeCompare(b.name);
        } else if (sortField === "number") {
          cmp = a.imei.localeCompare(b.imei);
        } else if (sortField === "status") {
          cmp = a.status.localeCompare(b.status);
        } else if (sortField === "last_updated") {
          cmp = (a.lastUpdated || "").localeCompare(b.lastUpdated || "");
        } else if (sortField === "ignition") {
          cmp = (a.ignition ? 1 : 0) - (b.ignition ? 1 : 0);
        } else if (sortField === "power") {
          cmp = (a.battery ?? 0) - (b.battery ?? 0);
        } else if (sortField === "driver") {
          cmp = (a.driver || "").localeCompare(b.driver || "");
        }
        return sortDirection === "asc" ? cmp : -cmp;
      });
  }, [localVehicles, activeStatus, query, selectedGroups, sortField, sortDirection]);

  // Group by branch
  const branchGroups = useMemo(() => {
    const map = new Map<string, FleetObject[]>();
    for (const v of filteredVehicles) {
      const list = map.get(v.branch) ?? [];
      list.push(v);
      map.set(v.branch, list);
    }
    return [...map.entries()];
  }, [filteredVehicles]);

  const allChecked =
    vehicles.length > 0 &&
    vehicles.every((v) => checkedVehicleIds.includes(v.id));

  const toggleCollapseAll = () => {
    const allCollapsed = Object.values(collapsedGroups).every(Boolean);
    const next: Record<string, boolean> = {};
    for (const key of Object.keys(collapsedGroups)) {
      next[key] = !allCollapsed;
    }
    setCollapsedGroups(next);
  };

  return (
    <div
      style={style}
      className={cn(
        "flex flex-col bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-2xl shadow-lg select-none relative transition-all duration-75",
        className,
      )}
    >
      {/* 1. Top Modern Tab Bar Header (Trakzee 2.0 Style) */}
      <div className="flex h-11 items-center justify-between bg-white dark:bg-slate-900 border-b border-[#DFE3EB] dark:border-slate-800 px-3 select-none rounded-t-2xl">
        <div className="flex items-center gap-1">
          {[
            { id: "object", label: "Object", icon: Navigation },
            { id: "driver", label: "Drivers", icon: User },
            { id: "geofence", label: "Geofences", icon: Layers },
            { id: "route", label: "Routes", icon: TrendingUp },
            { id: "landmark", label: "Landmarks", icon: MapPin },
            { id: "camera", label: "Cameras", icon: Video },
            { id: "alerts", label: "Alerts", icon: Bell },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const IconComp = tab.icon;

            if (isActive) {
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TrackingTab)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0089FF] hover:bg-[#0070d6] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-98"
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
                      onClick={() => setActiveTab(tab.id as TrackingTab)}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                    >
                      <IconComp className="h-4 w-4 stroke-[2]" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{tab.label}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>

        {/* Right Action Buttons (Object & Column Settings) */}
        <div className="flex items-center gap-0.5">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF] transition-colors cursor-pointer"
                >
                  <Settings className="h-4 w-4 stroke-[2.2]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="end">
                Object & Column Settings
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Sleek Floating Right-Edge Collapse Handle (Google Maps Style Edge Toggle Tab) */}
      {onToggleCollapse && (
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onToggleCollapse}
                className="absolute left-full top-1/2 -translate-y-1/2 z-50 flex h-12 w-5 items-center justify-center rounded-r-xl border border-l-0 border-[#DFE3EB] dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-600 dark:text-slate-300 shadow-md hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-[#0089FF] dark:hover:text-[#0089FF] transition-all cursor-pointer active:scale-95 pointer-events-auto"
              >
                <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Collapse Fleet Explorer</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Interactive Cursor Drag-to-Resize Handle Bar */}
      {onStartResize && (
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            onStartResize();
          }}
          onDoubleClick={() => {
            if (onResetWidth) onResetWidth();
          }}
          title="Drag to resize panel (Double-click to reset to 630px default width)"
          className="absolute top-0 bottom-0 -right-2.5 w-5 z-40 flex items-center justify-center cursor-col-resize group select-none pointer-events-auto"
        >
          <div className="h-16 w-1 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-[#0089FF] group-active:bg-[#0089FF] group-hover:w-1.5 transition-all shadow-xs flex flex-col items-center justify-center gap-1">
            <div className="w-0.5 h-0.5 rounded-full bg-white dark:bg-slate-900" />
            <div className="w-0.5 h-0.5 rounded-full bg-white dark:bg-slate-900" />
            <div className="w-0.5 h-0.5 rounded-full bg-white dark:bg-slate-900" />
          </div>
        </div>
      )}

      {/* 2. Trendy Minimal Soft Tint Segmented KPI Status Counter Bar */}
      <div className="px-2 py-1.5 bg-slate-50/50 dark:bg-slate-950/40 select-none shrink-0">
        <div className="grid grid-cols-6 gap-1.5">
          {/* Running */}
          <button
            type="button"
            onClick={() =>
              setActiveStatus(activeStatus === "running" ? "all" : "running")
            }
            className={cn(
              "flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
              activeStatus === "running"
                ? "bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/25 font-bold scale-[1.02]"
                : "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50",
            )}
          >
            <div className="flex items-center gap-1">
              <span className={cn("h-1.5 w-1.5 rounded-full", activeStatus === "running" ? "bg-white animate-pulse" : "bg-emerald-500")} />
              <span className="text-xs font-black tabular-nums leading-none">
                {counts.running}
              </span>
            </div>
            <span className={cn("text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5", activeStatus === "running" ? "text-emerald-100" : "text-emerald-700/80 dark:text-emerald-400/80")}>
              Running
            </span>
          </button>

          {/* Idle */}
          <button
            type="button"
            onClick={() =>
              setActiveStatus(activeStatus === "idle" ? "all" : "idle")
            }
            className={cn(
              "flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
              activeStatus === "idle"
                ? "bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/25 font-bold scale-[1.02]"
                : "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100/80 dark:hover:bg-amber-900/50",
            )}
          >
            <div className="flex items-center gap-1">
              <span className={cn("h-1.5 w-1.5 rounded-full", activeStatus === "idle" ? "bg-white" : "bg-amber-500")} />
              <span className="text-xs font-black tabular-nums leading-none">
                {counts.idle}
              </span>
            </div>
            <span className={cn("text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5", activeStatus === "idle" ? "text-amber-100" : "text-amber-700/80 dark:text-amber-400/80")}>
              Idle
            </span>
          </button>

          {/* Stopped */}
          <button
            type="button"
            onClick={() =>
              setActiveStatus(activeStatus === "stopped" ? "all" : "stopped")
            }
            className={cn(
              "flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
              activeStatus === "stopped"
                ? "bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/25 font-bold scale-[1.02]"
                : "bg-rose-50/70 dark:bg-rose-950/30 border-rose-200/60 dark:border-rose-800/40 text-rose-800 dark:text-rose-300 hover:bg-rose-100/80 dark:hover:bg-rose-900/50",
            )}
          >
            <div className="flex items-center gap-1">
              <span className={cn("h-1.5 w-1.5 rounded-full", activeStatus === "stopped" ? "bg-white" : "bg-rose-500")} />
              <span className="text-xs font-black tabular-nums leading-none">
                {counts.stopped}
              </span>
            </div>
            <span className={cn("text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5", activeStatus === "stopped" ? "text-rose-100" : "text-rose-700/80 dark:text-rose-400/80")}>
              Stopped
            </span>
          </button>

          {/* Inactive */}
          <button
            type="button"
            onClick={() =>
              setActiveStatus(activeStatus === "inactive" ? "all" : "inactive")
            }
            className={cn(
              "flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
              activeStatus === "inactive"
                ? "bg-indigo-500 text-white border-indigo-600 shadow-md shadow-indigo-500/25 font-bold scale-[1.02]"
                : "bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200/60 dark:border-indigo-800/40 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/50",
            )}
          >
            <div className="flex items-center gap-1">
              <span className={cn("h-1.5 w-1.5 rounded-full", activeStatus === "inactive" ? "bg-white" : "bg-indigo-500")} />
              <span className="text-xs font-black tabular-nums leading-none">
                {counts.inactive}
              </span>
            </div>
            <span className={cn("text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5", activeStatus === "inactive" ? "text-indigo-100" : "text-indigo-700/80 dark:text-indigo-400/80")}>
              Inactive
            </span>
          </button>

          {/* NoData */}
          <button
            type="button"
            onClick={() =>
              setActiveStatus(activeStatus === "nodata" ? "all" : "nodata")
            }
            className={cn(
              "flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
              activeStatus === "nodata"
                ? "bg-slate-600 text-white border-slate-700 shadow-md shadow-slate-600/25 font-bold scale-[1.02]"
                : "bg-slate-100/80 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-700/40 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/50",
            )}
          >
            <div className="flex items-center gap-1">
              <span className={cn("h-1.5 w-1.5 rounded-full", activeStatus === "nodata" ? "bg-white" : "bg-slate-400")} />
              <span className="text-xs font-black tabular-nums leading-none">
                {counts.nodata}
              </span>
            </div>
            <span className={cn("text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5", activeStatus === "nodata" ? "text-slate-200" : "text-slate-500 dark:text-slate-400")}>
              No Data
            </span>
          </button>

          {/* Total */}
          <button
            type="button"
            onClick={() => setActiveStatus("all")}
            className={cn(
              "flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
              activeStatus === "all"
                ? "bg-[#0089FF] text-white border-[#0070d6] shadow-md shadow-[#0089FF]/25 font-bold scale-[1.02]"
                : "bg-sky-50/70 dark:bg-sky-950/30 border-sky-200/60 dark:border-sky-800/40 text-[#0089FF] dark:text-sky-300 hover:bg-sky-100/80 dark:hover:bg-sky-900/50",
            )}
          >
            <div className="flex items-center gap-1">
              <span className="text-xs font-black tabular-nums leading-none">
                {counts.total}
              </span>
            </div>
            <span className={cn("text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5", activeStatus === "all" ? "text-sky-100" : "text-[#0089FF]")}>
              Total
            </span>
          </button>
        </div>
      </div>

      {/* 3. Search & Action Toolbar */}
      <div className="flex items-center gap-1.5 border-b border-[#DFE3EB] dark:border-slate-800 p-2 bg-white dark:bg-slate-900 shrink-0">
        {/* Select All Checkbox */}
        <input
          type="checkbox"
          checked={allChecked}
          onChange={onToggleCheckAll}
          title="Select / Deselect all vehicles on map"
          className="h-[12px] w-[12px] rounded border-[#DFE3EB] dark:border-slate-700 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0 ml-0.5"
        />

        {/* Search input */}
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by IMEI, VIN, Registration, Object Model, SIM Number, etc."
            className="h-8 w-full rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950/40 pl-3 pr-8 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF] focus:bg-white dark:focus:bg-slate-900 transition-colors"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-1.5 p-0.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <Search className="absolute right-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          )}
        </div>

        {/* Action Toolbar Icons (Dynamically adapts to User Setting: Compact vs Rounded) */}
        <div className="flex items-center gap-1.5 shrink-0 text-slate-600 dark:text-slate-400">
          {/* 1. Reload Button */}
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleReload}
                  className={cn(
                    "h-7 w-7 flex items-center justify-center rounded-lg border border-[#DFE3EB] dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:border-[#0089FF]/40 transition-all shadow-2xs cursor-pointer active:scale-95 toolbar-action-btn",
                    isRefreshing && "bg-sky-50 text-[#0089FF] border-[#0089FF]/40 shadow-xs",
                  )}
                >
                  <RotateCw
                    className={cn(
                      "h-3.5 w-3.5 stroke-[2.2] transition-transform",
                      isRefreshing && "animate-spin text-[#0089FF]",
                    )}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>Reload / Refresh Status</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* 2. Add Object Button */}
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenAddVehicle) onOpenAddVehicle();
                  }}
                  className="h-7 w-7 flex items-center justify-center rounded-lg border border-[#DFE3EB] dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:border-[#0089FF]/40 transition-all shadow-2xs cursor-pointer active:scale-95 toolbar-action-btn"
                >
                  <PlusCircle className="h-3.5 w-3.5 stroke-[2.2]" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Add New Object Page</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* 3. Filter Popover (2-Tier Cascading Flyout Menu matching media_1789991076156.png & Report Overlay media_1789989587865.png) */}
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "h-7 w-7 flex items-center justify-center rounded-lg border transition-all shadow-2xs cursor-pointer active:scale-95 toolbar-action-btn",
                  filterOpen
                    ? "bg-sky-50 dark:bg-sky-950/60 text-[#0089FF] border-[#0089FF]/50 shadow-xs"
                    : "border-[#DFE3EB] dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:border-[#0089FF]/40",
                )}
              >
                <Filter className="h-3.5 w-3.5 stroke-[2.2]" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={6}
              className="w-auto p-0 bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 shadow-2xl rounded-2xl text-xs z-50 select-none overflow-hidden"
            >
              <div className="flex divide-x divide-[#DFE3EB] dark:divide-slate-800">
                {/* Primary Category List (Left Panel) */}
                <div className="w-48 p-2 space-y-0.5 bg-slate-50/70 dark:bg-slate-950/60 shrink-0">
                  {[
                    { label: "Company - Branch", hasSub: false },
                    { label: "Device Type", hasSub: false },
                    { label: "Mode", hasSub: false },
                    { label: "Group(s)", hasSub: true },
                    { label: "Reminder", hasSub: true },
                    { label: "Type(s)", hasSub: true },
                    { label: "Validity", hasSub: true },
                    { label: "SoC", hasSub: true },
                    { label: "Soil", hasSub: true },
                    { label: "Charging State", hasSub: true },
                  ].map((item) => {
                    const isActive = activeFilterCategory === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setActiveFilterCategory(item.label)}
                        onMouseEnter={() => setActiveFilterCategory(item.label)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer",
                          isActive
                            ? "bg-white dark:bg-slate-800 text-[#0089FF] font-bold shadow-xs border border-[#DFE3EB]/80 dark:border-slate-700/80"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60",
                        )}
                      >
                        <span>{item.label}</span>
                        {item.hasSub && (
                          <ChevronRight
                            className={cn(
                              "h-3.5 w-3.5 shrink-0 transition-transform",
                              isActive ? "text-[#0089FF] translate-x-0.5" : "text-slate-400",
                            )}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Secondary Submenu Panel matching Report Overlay media_1789989587865.png */}
                <div className="w-72 p-3 flex flex-col justify-between bg-white dark:bg-slate-900 shrink-0">
                  <div>
                    {/* Header with Title and Selected Count Badge */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#DFE3EB]/70 dark:border-slate-800">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                        Select {activeFilterCategory.replace(/\(s\)/g, "")}
                      </span>
                      <span className="text-[10px] font-bold text-[#0089FF] bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-2 py-0.5 rounded-full">
                        {tempSelectedGroups.length} selected
                      </span>
                    </div>

                    {/* Search Input Box */}
                    <div className="relative flex items-center mb-2.5">
                      <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                      <input
                        value={filterSearch}
                        onChange={(e) => setFilterSearch(e.target.value)}
                        placeholder={`Search ${activeFilterCategory.toLowerCase()}...`}
                        className="w-full h-8 pl-8 pr-3 text-xs bg-slate-50 dark:bg-slate-950 border border-[#DFE3EB] dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF] transition-colors"
                      />
                      {filterSearch && (
                        <button
                          type="button"
                          onClick={() => setFilterSearch("")}
                          className="absolute right-2 p-0.5 text-slate-400 hover:text-slate-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {/* Checkbox Options List */}
                    <div className="space-y-0.5 max-h-52 overflow-y-auto custom-scrollbar pr-1">
                      {/* Select All Row */}
                      <label className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer text-slate-800 dark:text-slate-200 text-xs font-semibold select-none">
                        <input
                          type="checkbox"
                          checked={
                            activeFilterCategory === "Group(s)"
                              ? tempSelectedGroups.length === 4
                              : tempSelectedGroups.length >= 8
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              if (activeFilterCategory === "Group(s)") {
                                setTempSelectedGroups(["All", "Trucks", "Camera device", "abc"]);
                              } else {
                                setTempSelectedGroups(ALL_FILTER_COMPANIES);
                              }
                            } else {
                              setTempSelectedGroups([]);
                            }
                          }}
                          className="h-[12px] w-[12px] rounded border-[#DFE3EB] dark:border-slate-700 text-[#0089FF] accent-[#0089FF]"
                        />
                        <span>Select All</span>
                      </label>

                      <div className="border-t border-[#DFE3EB]/50 dark:border-slate-800/80 my-1" />

                      {/* Items */}
                      {(activeFilterCategory === "Group(s)"
                        ? ["Trucks", "Camera device", "abc"]
                        : activeFilterCategory === "Company - Branch"
                        ? ALL_FILTER_COMPANIES
                        : ["Default Option 1", "Default Option 2", "Default Option 3"]
                      )
                        .filter((item) =>
                          item.toLowerCase().includes(filterSearch.toLowerCase()),
                        )
                        .map((item) => {
                          const isChecked = tempSelectedGroups.includes(item);
                          return (
                            <label
                              key={item}
                              className={cn(
                                "flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer text-xs select-none transition-colors",
                                isChecked
                                  ? "text-[#0089FF] font-semibold bg-sky-50/50 dark:bg-sky-950/30"
                                  : "text-slate-700 dark:text-slate-300",
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  setTempSelectedGroups((prev) =>
                                    prev.includes(item)
                                      ? prev.filter((x) => x !== item)
                                      : [...prev, item],
                                  );
                                }}
                                className="h-[12px] w-[12px] rounded border-[#DFE3EB] dark:border-slate-700 text-[#0089FF] accent-[#0089FF]"
                              />
                              <span className="truncate">{item}</span>
                            </label>
                          );
                        })}
                    </div>
                  </div>

                  {/* Action Buttons Bar matching Report Overlay Footer */}
                  <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-[#DFE3EB] dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setTempSelectedGroups([])}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer px-1"
                    >
                      Clear
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFilterOpen(false)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-98"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGroups(
                            tempSelectedGroups.length === 0 ? ["All"] : tempSelectedGroups,
                          );
                          setFilterOpen(false);
                          toast.success("Filter Applied!");
                        }}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0089FF] hover:bg-[#0070d6] rounded-lg shadow-xs transition-all cursor-pointer active:scale-98"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* 4. Sorting Popover (2-Tier Cascading Flyout Menu matching media_1789988763799.png) */}
          <Popover open={sortOpen} onOpenChange={setSortOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "h-7 w-7 flex items-center justify-center rounded-lg border transition-all shadow-2xs cursor-pointer active:scale-95 toolbar-action-btn",
                  sortOpen
                    ? "bg-sky-50 dark:bg-sky-950/60 text-[#0089FF] border-[#0089FF]/50 shadow-xs"
                    : "border-[#DFE3EB] dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:border-[#0089FF]/40",
                )}
              >
                <ArrowUpDown className="h-3.5 w-3.5 stroke-[2.2]" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={6}
              className="w-auto p-0 bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 shadow-2xl rounded-2xl text-xs z-50 overflow-hidden select-none"
            >
              <div className="flex divide-x divide-[#DFE3EB] dark:divide-slate-800">
                {/* Left Category Menu (Sorting / Order) */}
                <div className="w-36 p-2 space-y-0.5 bg-slate-50/70 dark:bg-slate-950/60 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveSortCategory("Sorting")}
                    onMouseEnter={() => setActiveSortCategory("Sorting")}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer",
                      activeSortCategory === "Sorting"
                        ? "bg-white dark:bg-slate-800 text-[#0089FF] font-bold shadow-xs border border-[#DFE3EB]/80 dark:border-slate-700/80"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60",
                    )}
                  >
                    <span>Sorting</span>
                    <ChevronRight
                      className={cn(
                        "h-3.5 w-3.5 shrink-0 transition-transform",
                        activeSortCategory === "Sorting" ? "text-[#0089FF] translate-x-0.5" : "text-slate-400",
                      )}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSortCategory("Order")}
                    onMouseEnter={() => setActiveSortCategory("Order")}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer",
                      activeSortCategory === "Order"
                        ? "bg-white dark:bg-slate-800 text-[#0089FF] font-bold shadow-xs border border-[#DFE3EB]/80 dark:border-slate-700/80"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60",
                    )}
                  >
                    <span>Order</span>
                    <ChevronRight
                      className={cn(
                        "h-3.5 w-3.5 shrink-0 transition-transform",
                        activeSortCategory === "Order" ? "text-[#0089FF] translate-x-0.5" : "text-slate-400",
                      )}
                    />
                  </button>
                </div>

                {/* Right Options Flyout Panel */}
                <div className="w-56 p-3 flex flex-col justify-between bg-white dark:bg-slate-900 shrink-0">
                  <div className="space-y-1">
                    {activeSortCategory === "Sorting" ? (
                      [
                        { label: "Object Number", key: "number" },
                        { label: "Object Name", key: "name" },
                        { label: "Status", key: "status" },
                        { label: "Last Updated Date Time", key: "last_updated" },
                        { label: "Ignition", key: "ignition" },
                        { label: "Power", key: "power" },
                        { label: "Driver", key: "driver" },
                      ].map((item) => {
                        const isSelected = tempSortField === item.key;
                        return (
                          <label
                            key={item.key}
                            onClick={() => setTempSortField(item.key as any)}
                            className={cn(
                              "flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors text-xs select-none",
                              isSelected && "bg-sky-50/70 dark:bg-sky-950/40 text-[#0089FF] font-bold",
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="h-[12px] w-[12px] rounded border-[#DFE3EB] dark:border-slate-700 text-[#0089FF] accent-[#0089FF]"
                            />
                            <span>{item.label}</span>
                          </label>
                        );
                      })
                    ) : (
                      [
                        { label: "Ascending", key: "asc" },
                        { label: "Descending", key: "desc" },
                      ].map((item) => {
                        const isSelected = tempSortDirection === item.key;
                        return (
                          <label
                            key={item.key}
                            onClick={() => setTempSortDirection(item.key as any)}
                            className={cn(
                              "flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors text-xs select-none",
                              isSelected && "bg-sky-50/70 dark:bg-sky-950/40 text-[#0089FF] font-bold",
                            )}
                          >
                            <input
                              type="radio"
                              name="sortDirRadioFlyout"
                              checked={isSelected}
                              onChange={() => {}}
                              className="h-3.5 w-3.5 text-[#0089FF] accent-[#0089FF]"
                            />
                            <span>{item.label}</span>
                          </label>
                        );
                      })
                    )}
                  </div>

                  {/* Footer Bar */}
                  <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-[#DFE3EB] dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setTempSortField("name");
                        setTempSortDirection("asc");
                      }}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer px-1"
                    >
                      Reset
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSortOpen(false)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-98"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSortField(tempSortField);
                          setSortDirection(tempSortDirection);
                          setSortOpen(false);
                          toast.success(`Sorted by ${tempSortField} (${tempSortDirection})`);
                        }}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0089FF] hover:bg-[#0070d6] rounded-lg shadow-xs transition-all cursor-pointer active:scale-98"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Structured Table Column Header Bar */}
      {activeTab === "object" && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/90 dark:bg-slate-800/70 border-b border-[#DFE3EB] dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none shrink-0 overflow-x-hidden">
          <div className="w-[210px] shrink-0 truncate flex items-center gap-1 pl-1">
            <button
              type="button"
              onClick={toggleCollapseAll}
              title="Collapse / Expand All Groups"
              className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <span>Object / Name</span>
          </div>
          {selectedColumns.includes("speed") && (
            <div className="w-[50px] shrink-0 text-right">Speed</div>
          )}
          {(selectedColumns.includes("ignition") || selectedColumns.includes("gps")) && (
            <div className="w-[48px] shrink-0 text-center">Status</div>
          )}
          {(selectedColumns.includes("driver") || selectedColumns.includes("driver_mobile")) && (
            <div
              className={cn(
                "shrink-0 truncate",
                selectedColumns.includes("driver") && selectedColumns.includes("driver_mobile")
                  ? "w-[140px]"
                  : "w-[125px]"
              )}
            >
              Driver Info
            </div>
          )}
          {selectedColumns.includes("address") && (
            <div className="flex-1 min-w-[140px] truncate">Location / Address</div>
          )}
          <div className="w-[75px] shrink-0 text-right pr-1">Actions</div>
        </div>
      )}

      {/* 5. Hierarchical Object Tree & Custom Tab Views */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-280px)] min-h-[350px] divide-y divide-[#DFE3EB]/60 dark:divide-slate-800/60 text-xs rounded-b-2xl">
        {activeTab === "object" && (
          <div>
            {/* Branches Groups */}
            <div className="divide-y divide-[#DFE3EB]/40 dark:divide-slate-800/40">
              {branchGroups.map(([branch, branchVehicles]) => {
                const isGroupCollapsed = collapsedGroups[branch] ?? false;
                const groupIds = branchVehicles.map((v) => v.id);
                const isGroupAllChecked =
                  groupIds.length > 0 &&
                  groupIds.every((id) => checkedVehicleIds.includes(id));
                const isGroupSomeChecked =
                  groupIds.some((id) => checkedVehicleIds.includes(id)) &&
                  !isGroupAllChecked;

                return (
                  <div key={branch}>
                    {/* Top Level Branch Header */}
                    <div className="flex items-center justify-between pl-2.5 pr-3 py-1.5 bg-slate-50/80 dark:bg-slate-900/60 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={isGroupAllChecked}
                          ref={(el) => {
                            if (el) el.indeterminate = isGroupSomeChecked;
                          }}
                          onChange={() => onToggleCheckGroup(groupIds)}
                          className="h-[12px] w-[12px] rounded border-[#DFE3EB] dark:border-slate-700 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setCollapsedGroups((prev) => ({
                              ...prev,
                              [branch]: !prev[branch],
                            }))
                          }
                          className="flex items-center gap-1 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-[#0089FF] cursor-pointer flex-1 truncate"
                        >
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 text-slate-500 transition-transform duration-150",
                              isGroupCollapsed && "-rotate-90",
                            )}
                          />
                          <span className="truncate">{branch}</span>
                        </button>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0 font-semibold">
                        [{branchVehicles.length}]
                      </span>
                    </div>

                    {/* Level 2: Vehicle Rows in this Branch */}
                    {!isGroupCollapsed && (
                      <div className="divide-y divide-[#DFE3EB]/40 dark:divide-slate-800/40">
                        {branchVehicles.map((v) => {
                          const isSelected = v.id === selectedVehicleId;
                          const isChecked = checkedVehicleIds.includes(v.id);

                          return (
                            <div
                              key={v.id}
                              onClick={() => {
                                onSelectVehicle(v.id);
                                onOpenTelemetry(v);
                              }}
                              className={cn(
                                "flex items-center gap-2 px-3 py-2 text-xs transition-colors cursor-pointer select-none min-h-[46px] overflow-hidden",
                                isSelected
                                  ? "bg-sky-50/90 dark:bg-sky-950/50 border-l-3 border-[#0089FF]"
                                  : "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                              )}
                            >
                              {/* Col 1: Checkbox + Sleek Status Dot + Name & Timestamp */}
                              <div className="flex items-center gap-1.5 shrink-0 w-[210px] pl-4">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    onToggleCheckVehicle(v.id);
                                  }}
                                  className="h-[12px] w-[12px] rounded border-[#DFE3EB] dark:border-slate-700 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                                />

                                {/* Sleek Status Dot Indicator */}
                                <span
                                  title={`Status: ${v.status.toUpperCase()}`}
                                  className={cn(
                                    "h-2 w-2 rounded-full shrink-0 shadow-2xs",
                                    v.status === "running"
                                      ? "bg-emerald-500 ring-2 ring-emerald-500/20"
                                      : v.status === "idle"
                                        ? "bg-amber-500 ring-2 ring-amber-500/20"
                                        : v.status === "stopped"
                                          ? "bg-rose-500 ring-2 ring-rose-500/20"
                                          : "bg-indigo-500 ring-2 ring-indigo-500/20",
                                  )}
                                />

                                {/* Name & Timestamp */}
                                <div className="flex flex-col min-w-0 truncate">
                                  <span
                                    className={cn(
                                      "truncate text-xs font-semibold leading-tight",
                                      isSelected
                                        ? "text-[#0089FF]"
                                        : "text-slate-900 dark:text-slate-100",
                                    )}
                                  >
                                    {v.name}
                                  </span>
                                  {selectedColumns.includes("last_updated") && (
                                    <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 truncate leading-none mt-0.5">
                                      {v.timestamp || "21-09-2026 03:03:09 PM"}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Col 2: Speed */}
                              {selectedColumns.includes("speed") && (
                                <div className="shrink-0 w-[50px] text-right font-mono font-bold text-xs text-slate-700 dark:text-slate-300 tabular-nums">
                                  <span className={v.speed > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}>
                                    {v.speed}
                                  </span>
                                </div>
                              )}

                              {/* Col 3: Ignition & GPS Status Icons */}
                              {(selectedColumns.includes("ignition") || selectedColumns.includes("gps")) && (
                                <div className="flex items-center gap-1.5 shrink-0 w-[48px] justify-center">
                                  {selectedColumns.includes("ignition") && (
                                    <span title={"Ignition: " + (v.ignition !== false ? "ON" : "OFF")}>
                                      <Key
                                        className={cn(
                                          "h-3.5 w-3.5 stroke-[2.2]",
                                          v.ignition !== false
                                            ? "text-emerald-600 dark:text-emerald-400"
                                            : "text-slate-400 dark:text-slate-500",
                                        )}
                                      />
                                    </span>
                                  )}
                                  {selectedColumns.includes("gps") && (
                                    <span title="GPS Signal Strong">
                                      <Wifi className="h-3.5 w-3.5 text-[#0089FF] dark:text-sky-400 stroke-[2.2]" />
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Col 4: Driver Name & Mobile Column */}
                              {(selectedColumns.includes("driver") || selectedColumns.includes("driver_mobile")) && (
                                <div
                                  className={cn(
                                    "shrink-0 truncate text-xs flex flex-col justify-center",
                                    selectedColumns.includes("driver") && selectedColumns.includes("driver_mobile")
                                      ? "w-[140px]"
                                      : "w-[125px]"
                                  )}
                                  title={`${v.driver || "No Driver"}${v.driverPhone ? ` (${v.driverPhone})` : ""}`}
                                >
                                  {selectedColumns.includes("driver") && selectedColumns.includes("driver_mobile") ? (
                                    <>
                                      <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate leading-tight">
                                        <User className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 stroke-[2.2] shrink-0" />
                                        <span className="truncate">{v.driver || "Unassigned"}</span>
                                      </div>
                                      <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500 dark:text-slate-400 truncate leading-none mt-0.5">
                                        <Phone className="h-3 w-3 text-emerald-600 dark:text-emerald-400 stroke-[2.2] shrink-0" />
                                        <span className="truncate">{v.driverPhone || "+91 98765 43210"}</span>
                                      </div>
                                    </>
                                  ) : selectedColumns.includes("driver_mobile") ? (
                                    <div className="flex items-center gap-1 font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate">
                                      <Phone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.2] shrink-0" />
                                      <span className="truncate">{v.driverPhone || "+91 98765 43210"}</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">
                                      <User className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 stroke-[2.2] shrink-0" />
                                      <span className="truncate">{v.driver || "—"}</span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Col 5: Address / Location Column (2 Lines Layout) */}
                              {selectedColumns.includes("address") && (
                                <div
                                  className="flex-1 min-w-[140px] line-clamp-2 break-words leading-tight text-[10.5px] text-slate-600 dark:text-slate-400"
                                  title={v.address || v.branch}
                                >
                                  {v.address || `At ${v.branch} Location`}
                                </div>
                              )}

                              {/* Col 6: Action Ports */}
                              <div className="flex items-center gap-1.5 shrink-0 w-[75px] justify-end pr-1">
                                {selectedColumns.includes("live_streaming") && (
                                  <button
                                    type="button"
                                    title="Live Video Camera"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onOpenDashcam(v);
                                    }}
                                    className="p-0.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors cursor-pointer"
                                  >
                                    <Video className="h-3.5 w-3.5 stroke-[2.2]" />
                                  </button>
                                )}
                                {(selectedColumns.includes("immobilize") || selectedColumns.includes("elock")) && (
                                  <button
                                    type="button"
                                    title="Engine Lock / Immobilizer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onOpenTelemetry(v);
                                    }}
                                    className="p-0.5 text-rose-500 dark:text-rose-400 hover:text-rose-600 transition-colors cursor-pointer"
                                  >
                                    <Lock className="h-3.5 w-3.5 stroke-[2.2]" />
                                  </button>
                                )}
                                {(selectedColumns.includes("reports") || selectedColumns.includes("timeline_chart")) && (
                                  <button
                                    type="button"
                                    title="Trace on Map"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onTraceVehicle(v);
                                    }}
                                    className="p-0.5 text-[#0089FF] dark:text-sky-400 hover:text-[#0070d6] transition-colors cursor-pointer"
                                  >
                                    <Eye className="h-3.5 w-3.5 stroke-[2.2]" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  title="Telemetry Details"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenTelemetry(v);
                                  }}
                                  className="p-0.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                                >
                                  <Info className="h-3.5 w-3.5 stroke-[2.2]" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Drivers Tab View */}
        {activeTab === "driver" && (
          <div className="p-3 space-y-2">
            <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-[#DFE3EB] dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>All Active Drivers ({filteredVehicles.filter((v) => v.driver).length})</span>
              <span className="text-[10px] text-[#0089FF] font-mono">Duty Roster</span>
            </div>
            <div className="divide-y divide-[#DFE3EB]/60 dark:divide-slate-800/60">
              {filteredVehicles
                .filter((v) => v.driver)
                .map((v) => (
                  <div
                    key={v.id}
                    onClick={() => {
                      onSelectVehicle(v.id);
                      onOpenTelemetry(v);
                    }}
                    className="p-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#0089FF]/10 text-[#0089FF] flex items-center justify-center font-bold text-xs shrink-0 border border-[#0089FF]/20">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                          {v.driver}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <Phone className="h-2.5 w-2.5" />
                            {v.driverPhone || "+91 98765 43210"}
                          </span>
                          <span>•</span>
                          <span>{v.name}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-500/20">
                      On Duty
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Geofences Tab View */}
        {activeTab === "geofence" && (
          <div className="p-3 space-y-2">
            <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-[#DFE3EB] dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Geofences & Zones (4)</span>
              <span className="text-[10px] text-[#0089FF]">GIS Layer</span>
            </div>
            {[
              { name: "Valsad Industrial Hub", type: "Polygon Zone", count: 12, speedLimit: "40 km/h" },
              { name: "Jakarta Main Logistics Depot", type: "Circular Zone (2 km)", count: 8, speedLimit: "30 km/h" },
              { name: "Bangkok Terminal 2", type: "Polygon Zone", count: 5, speedLimit: "50 km/h" },
              { name: "Surat Port Yard", type: "Circular Zone (5 km)", count: 18, speedLimit: "25 km/h" },
            ].map((g, i) => (
              <div key={i} className="p-3 rounded-lg border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between hover:border-[#0089FF] cursor-pointer transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-md bg-sky-50 text-[#0089FF] dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{g.name}</div>
                    <div className="text-[10px] text-slate-500">{g.type} · Max {g.speedLimit}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  {g.count} Vehicles
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Routes Tab View */}
        {activeTab === "route" && (
          <div className="p-3 space-y-2">
            <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-[#DFE3EB] dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Active Freight Routes (3)</span>
              <span className="text-[10px] text-[#0089FF]">Live Dispatch</span>
            </div>
            {[
              { name: "Express Corridor A-1", origin: "Valsad", dest: "Surat", dist: "92 km", status: "Optimal" },
              { name: "Java Highway 1", origin: "Jakarta", dest: "Bandung", dist: "154 km", status: "Heavy Traffic" },
              { name: "Thai Inter-City 4", origin: "Bangkok", dest: "Chonburi", dist: "88 km", status: "Clear" },
            ].map((r, i) => (
              <div key={i} className="p-3 rounded-lg border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between hover:border-[#0089FF] cursor-pointer transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{r.name}</div>
                    <div className="text-[10px] text-slate-500">{r.origin} ➔ {r.dest} ({r.dist})</div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-500/20">
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Landmarks Tab View */}
        {activeTab === "landmark" && (
          <div className="p-3 space-y-2">
            <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-[#DFE3EB] dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Landmarks & POIs (4)</span>
              <span className="text-[10px] text-[#0089FF]">Custom POI</span>
            </div>
            {[
              { name: "Valsad Refueling Station #2", category: "Fuel Station", city: "Valsad" },
              { name: "Central Service Center", category: "Maintenance Depot", city: "Jakarta" },
              { name: "Bangkok Cargo Terminal", category: "Warehouse", city: "Bangkok" },
              { name: "Highway Rest Stop 14", category: "Rest Area", city: "Surat" },
            ].map((p, i) => (
              <div key={i} className="p-3 rounded-lg border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between hover:border-[#0089FF] cursor-pointer transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-md bg-amber-50 text-amber-600 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{p.name}</div>
                    <div className="text-[10px] text-slate-500">{p.category} · {p.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Cameras Tab View */}
        {activeTab === "camera" && (
          <div className="p-3 space-y-2">
            <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-[#DFE3EB] dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Live Video Telematics Cameras</span>
              <span className="text-[10px] text-emerald-600 font-mono font-bold">● LIVE</span>
            </div>
            {filteredVehicles.slice(0, 6).map((v) => (
              <div
                key={v.id}
                onClick={() => onOpenDashcam(v)}
                className="p-3 rounded-lg border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between hover:border-[#0089FF] cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                    <Video className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{v.name}</div>
                    <div className="text-[10px] text-slate-500">Dual AI Camera (DMS + ADAS)</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded bg-[#0089FF] text-white text-[10px] font-bold hover:bg-[#0070d6] transition-colors cursor-pointer"
                >
                  Stream Live
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Live Alerts Tab View */}
        {activeTab === "alerts" && (
          <div className="p-3 space-y-2">
            <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-[#DFE3EB] dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Recent Live Fleet Alerts</span>
              <span className="text-[10px] text-rose-500 font-mono font-bold">Real-Time</span>
            </div>
            {[
              { type: "Overspeeding Warning", vehicle: "Fuel - 1001", speed: "107 km/h", time: "2 mins ago", sev: "high" },
              { type: "Harsh Braking Event", vehicle: "BUS - 130003", speed: "135 km/h", time: "8 mins ago", sev: "high" },
              { type: "Geofence Exit", vehicle: "Temperature - 12394", speed: "150 km/h", time: "14 mins ago", sev: "med" },
              { type: "Low Battery Level", vehicle: "Scania - 1004", speed: "102 km/h", time: "22 mins ago", sev: "low" },
            ].map((a, i) => (
              <div key={i} className="p-3 rounded-lg border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between hover:border-rose-500 cursor-pointer transition-all">
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    "p-2 rounded-md border",
                    a.sev === "high" ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800" : "bg-amber-50 text-amber-600 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800"
                  )}>
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{a.type}</div>
                    <div className="text-[10px] text-slate-500">{a.vehicle} · {a.speed}</div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{a.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
