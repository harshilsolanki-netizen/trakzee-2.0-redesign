import {
  Bell,
  Camera,
  ChevronDown,
  ChevronRight,
  Compass,
  Eye,
  Flame,
  Info,
  Key,
  Layers,
  MapPin,
  MoreVertical,
  Navigation,
  Radio,
  RotateCcw,
  Search,
  Settings,
  SlidersHorizontal,
  TrendingUp,
  User,
  Video,
  Wifi,
  Wrench,
  X,
} from "lucide-react";
import { useState, useMemo } from "react";
import { STATUS_META, type FleetObject, type ObjectStatus } from "@/data/fleet";
import { cn } from "@/lib/utils";

export type TrackingTab =
  "object" | "driver" | "geofence" | "route" | "landmark" | "camera" | "alerts";

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
  className?: string;
}) {
  const [activeTab, setActiveTab] = useState<TrackingTab>("object");
  const [query, setQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState<ObjectStatus | "all">("all");
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({
    Company: false,
    Indonesia: false,
    Thailand: false,
    Valsad: false,
    Itriangle: false,
  });
  const [sortOrder, setSortOrder] = useState<"name" | "speed" | "battery">(
    "name",
  );

  // Summary counts matching reference image (26 Running, 2 Idle, 15 Stopped, 65 Inactive, 14 NoData, 122 Total)
  const counts = useMemo(() => {
    return {
      running: 26,
      idle: 2,
      stopped: 15,
      inactive: 65,
      nodata: 14,
      total: 122,
    };
  }, []);

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vehicles
      .filter((v) => {
        const matchesStatus =
          activeStatus === "all" || v.status === activeStatus;
        const matchesQuery =
          q === "" ||
          v.name.toLowerCase().includes(q) ||
          v.branch.toLowerCase().includes(q) ||
          v.imei.toLowerCase().includes(q) ||
          (v.driver && v.driver.toLowerCase().includes(q));
        return matchesStatus && matchesQuery;
      })
      .sort((a, b) => {
        if (sortOrder === "speed") return b.speed - a.speed;
        if (sortOrder === "battery") return (b.battery ?? 0) - (a.battery ?? 0);
        return a.name.localeCompare(b.name);
      });
  }, [vehicles, activeStatus, query, sortOrder]);

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
      className={cn(
        "flex flex-col bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-xl overflow-hidden transition-all duration-200",
        className,
      )}
    >
      {/* 1. Top Blue Navigation Tabs Header */}
      <div className="flex h-[45px] items-center justify-between bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 px-2.5 text-white select-none">
        <div className="flex items-center gap-1">
          {/* Object Main Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("object")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer",
              activeTab === "object"
                ? "bg-white/20 text-white shadow-inner"
                : "text-white/80 hover:bg-white/10 hover:text-white",
            )}
          >
            <Navigation className="h-3.5 w-3.5 fill-current" />
            <span>Object</span>
            <ChevronDown className="h-3 w-3 opacity-80" />
          </button>

          {/* User/Driver Tab */}
          <button
            type="button"
            title="Drivers"
            onClick={() => setActiveTab("driver")}
            className={cn(
              "p-1.5 rounded-md transition-colors cursor-pointer",
              activeTab === "driver"
                ? "bg-white/20"
                : "hover:bg-white/10 text-white/80",
            )}
          >
            <User className="h-3.5 w-3.5" />
          </button>

          {/* Geofences Tab */}
          <button
            type="button"
            title="Geofences"
            onClick={() => setActiveTab("geofence")}
            className={cn(
              "p-1.5 rounded-md transition-colors cursor-pointer",
              activeTab === "geofence"
                ? "bg-white/20"
                : "hover:bg-white/10 text-white/80",
            )}
          >
            <Layers className="h-3.5 w-3.5" />
          </button>

          {/* Routes Tab */}
          <button
            type="button"
            title="Routes"
            onClick={() => setActiveTab("route")}
            className={cn(
              "p-1.5 rounded-md transition-colors cursor-pointer",
              activeTab === "route"
                ? "bg-white/20"
                : "hover:bg-white/10 text-white/80",
            )}
          >
            <TrendingUp className="h-3.5 w-3.5" />
          </button>

          {/* Landmarks / POI Tab */}
          <button
            type="button"
            title="Landmarks"
            onClick={() => setActiveTab("landmark")}
            className={cn(
              "p-1.5 rounded-md transition-colors cursor-pointer",
              activeTab === "landmark"
                ? "bg-white/20"
                : "hover:bg-white/10 text-white/80",
            )}
          >
            <MapPin className="h-3.5 w-3.5" />
          </button>

          {/* Video Stream Tab */}
          <button
            type="button"
            title="Live Cameras"
            onClick={() => setActiveTab("camera")}
            className={cn(
              "p-1.5 rounded-md transition-colors cursor-pointer",
              activeTab === "camera"
                ? "bg-white/20"
                : "hover:bg-white/10 text-white/80",
            )}
          >
            <Video className="h-3.5 w-3.5" />
          </button>

          {/* Alerts Tab */}
          <button
            type="button"
            title="Live Alerts"
            onClick={() => setActiveTab("alerts")}
            className={cn(
              "p-1.5 rounded-md transition-colors cursor-pointer",
              activeTab === "alerts"
                ? "bg-white/20"
                : "hover:bg-white/10 text-white/80",
            )}
          >
            <Bell className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Right Settings Gear */}
        <button
          type="button"
          title="Object Columns & Display Settings"
          onClick={onOpenSettings}
          className="p-1.5 rounded-md text-white/90 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {/* 2. KPI Status Counters Bar */}
      <div className="grid grid-cols-6 gap-0.5 border-b border-border bg-surface-muted/30 p-1 text-center select-none">
        {/* Running */}
        <button
          type="button"
          onClick={() =>
            setActiveStatus(activeStatus === "running" ? "all" : "running")
          }
          className={cn(
            "flex flex-col items-center justify-center py-1 px-0.5 rounded-md transition-all cursor-pointer border-t-2",
            activeStatus === "running"
              ? "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold"
              : "bg-emerald-500/5 border-emerald-400/30 text-muted-foreground hover:bg-emerald-500/10",
          )}
        >
          <span className="text-xs font-extrabold tabular-nums leading-none">
            {counts.running}
          </span>
          <span className="text-[9px] font-medium leading-tight mt-0.5 opacity-80">
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
            "flex flex-col items-center justify-center py-1 px-0.5 rounded-md transition-all cursor-pointer border-t-2",
            activeStatus === "idle"
              ? "bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-bold"
              : "bg-amber-500/5 border-amber-400/30 text-muted-foreground hover:bg-amber-500/10",
          )}
        >
          <span className="text-xs font-extrabold tabular-nums leading-none">
            {counts.idle}
          </span>
          <span className="text-[9px] font-medium leading-tight mt-0.5 opacity-80">
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
            "flex flex-col items-center justify-center py-1 px-0.5 rounded-md transition-all cursor-pointer border-t-2",
            activeStatus === "stopped"
              ? "bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400 font-bold"
              : "bg-rose-500/5 border-rose-400/30 text-muted-foreground hover:bg-rose-500/10",
          )}
        >
          <span className="text-xs font-extrabold tabular-nums leading-none">
            {counts.stopped}
          </span>
          <span className="text-[9px] font-medium leading-tight mt-0.5 opacity-80">
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
            "flex flex-col items-center justify-center py-1 px-0.5 rounded-md transition-all cursor-pointer border-t-2",
            activeStatus === "inactive"
              ? "bg-indigo-500/15 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold"
              : "bg-indigo-500/5 border-indigo-400/30 text-muted-foreground hover:bg-indigo-500/10",
          )}
        >
          <span className="text-xs font-extrabold tabular-nums leading-none">
            {counts.inactive}
          </span>
          <span className="text-[9px] font-medium leading-tight mt-0.5 opacity-80">
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
            "flex flex-col items-center justify-center py-1 px-0.5 rounded-md transition-all cursor-pointer border-t-2",
            activeStatus === "nodata"
              ? "bg-slate-500/15 border-slate-500 text-slate-700 dark:text-slate-300 font-bold"
              : "bg-slate-500/5 border-slate-400/30 text-muted-foreground hover:bg-slate-500/10",
          )}
        >
          <span className="text-xs font-extrabold tabular-nums leading-none">
            {counts.nodata}
          </span>
          <span className="text-[9px] font-medium leading-tight mt-0.5 opacity-80">
            NoData
          </span>
        </button>

        {/* Total */}
        <button
          type="button"
          onClick={() => setActiveStatus("all")}
          className={cn(
            "flex flex-col items-center justify-center py-1 px-0.5 rounded-md transition-all cursor-pointer border-t-2",
            activeStatus === "all"
              ? "bg-blue-500/15 border-blue-500 text-blue-600 dark:text-blue-400 font-bold"
              : "bg-muted/40 border-border text-muted-foreground hover:bg-muted",
          )}
        >
          <span className="text-xs font-extrabold tabular-nums leading-none">
            {counts.total}
          </span>
          <span className="text-[9px] font-medium leading-tight mt-0.5 opacity-80">
            Total
          </span>
        </button>
      </div>

      {/* 3. Search & Action Toolbar */}
      <div className="flex items-center gap-1.5 border-b border-border p-2 bg-card">
        {/* Select All Checkbox */}
        <input
          type="checkbox"
          checked={allChecked}
          onChange={onToggleCheckAll}
          title="Select / Deselect all vehicles on map"
          className="h-3.5 w-3.5 rounded border-input text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
        />

        {/* Search input with placeholder */}
        <div className="relative flex-1 flex items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by IMEI, VIN, Registration, Object Model, SIM Number, etc."
            className="h-8 w-full rounded-md border border-input bg-background pl-2.5 pr-7 text-xs placeholder:text-muted-foreground focus:outline-none focus:border-blue-500 transition-colors"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-1.5 p-0.5 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <Search className="absolute right-2.5 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none" />
          )}
        </div>

        {/* Toolbar Icons */}
        <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
          <button
            type="button"
            title="Toggle heading orientation"
            className="p-1.5 rounded-md hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <Compass className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Sort objects"
            onClick={() => {
              setSortOrder((curr) =>
                curr === "name"
                  ? "speed"
                  : curr === "speed"
                    ? "battery"
                    : "name",
              );
            }}
            className="p-1.5 rounded-md hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <span className="text-[10px] font-bold">⇅</span>
          </button>
        </div>
      </div>

      {/* 4. Collapse Header Toggle */}
      <div className="flex items-center justify-between px-2.5 py-1 bg-surface-muted/40 border-b border-border/60 text-[10px] text-muted-foreground">
        <button
          type="button"
          onClick={toggleCollapseAll}
          className="inline-flex items-center gap-1 hover:text-foreground cursor-pointer font-medium"
        >
          <span>✕ Collapse</span>
        </button>
        <span className="tabular-nums">
          Showing {filteredVehicles.length} of {vehicles.length} objects
        </span>
      </div>

      {/* 5. Hierarchical Object Tree */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[350px] divide-y divide-border/40 text-xs">
        {/* Top Company Accordion Header */}
        <div>
          <div className="flex items-center justify-between px-2 py-1.5 bg-surface-muted/60 text-xs font-semibold text-foreground">
            <div className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={onToggleCheckAll}
                className="h-3.5 w-3.5 rounded border-input text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Company</span>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground font-normal">
              [12]
            </span>
          </div>

          {/* Branches Groups */}
          <div className="divide-y divide-border/30">
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
                  {/* Branch Accordion Header */}
                  <div className="flex items-center justify-between px-3 py-1.5 bg-surface-muted/30 hover:bg-surface-muted/70 transition-colors">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={isGroupAllChecked}
                        ref={(el) => {
                          if (el) el.indeterminate = isGroupSomeChecked;
                        }}
                        onChange={() => onToggleCheckGroup(groupIds)}
                        className="h-3.5 w-3.5 rounded border-input text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setCollapsedGroups((prev) => ({
                            ...prev,
                            [branch]: !prev[branch],
                          }))
                        }
                        className="flex items-center gap-1 text-left text-xs font-medium text-foreground hover:text-blue-600 cursor-pointer flex-1 truncate"
                      >
                        <ChevronDown
                          className={cn(
                            "h-3 w-3 text-muted-foreground transition-transform duration-150",
                            isGroupCollapsed && "-rotate-90",
                          )}
                        />
                        <span className="truncate">{branch}</span>
                      </button>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                      [{branchVehicles.length}]
                    </span>
                  </div>

                  {/* Vehicle Rows in this Branch */}
                  {!isGroupCollapsed && (
                    <div className="divide-y divide-border/20">
                      {branchVehicles.map((v) => {
                        const isSelected = v.id === selectedVehicleId;
                        const isChecked = checkedVehicleIds.includes(v.id);
                        const batteryVal = v.battery;

                        return (
                          <div
                            key={v.id}
                            onClick={() => onSelectVehicle(v.id)}
                            className={cn(
                              "flex items-center justify-between gap-1.5 px-2.5 py-1.5 pl-6 text-xs transition-colors cursor-pointer select-none",
                              isSelected
                                ? "bg-blue-500/10 border-l-2 border-blue-600 font-medium"
                                : "hover:bg-muted/50",
                            )}
                          >
                            {/* Left: Checkbox + Status Dot + Vehicle Name */}
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  onToggleCheckVehicle(v.id);
                                }}
                                className="h-3.5 w-3.5 rounded border-input text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                              />

                              {/* Status indicator dot */}
                              <span
                                className="h-2 w-2 rounded-full shrink-0 shadow-2xs"
                                style={{
                                  background: STATUS_META[v.status].color,
                                }}
                              />

                              {/* Vehicle Name / ID */}
                              <span
                                className={cn(
                                  "truncate text-xs",
                                  isSelected
                                    ? "font-bold text-blue-600 dark:text-blue-400"
                                    : "text-foreground",
                                )}
                              >
                                {v.name}
                              </span>
                            </div>

                            {/* Center Metrics: Speed + Ignition + GPS + Battery */}
                            <div className="flex items-center gap-1.5 shrink-0 text-[11px]">
                              {/* Speed metric badge */}
                              <span className="font-mono tabular-nums text-muted-foreground w-6 text-right">
                                {v.speed}
                              </span>

                              {/* Ignition / Wrench Key Icon */}
                              <span
                                title={
                                  "Ignition: " +
                                  (v.status === "running" || v.status === "idle"
                                    ? "ON"
                                    : "OFF")
                                }
                                className={cn(
                                  "text-[10px]",
                                  v.status === "running" || v.status === "idle"
                                    ? "text-emerald-500"
                                    : "text-rose-500 opacity-60",
                                )}
                              >
                                🔑
                              </span>

                              {/* GPS / Tower Signal Icon */}
                              <span
                                title="GPS Locked"
                                className={cn(
                                  "text-[10px]",
                                  v.status !== "nodata"
                                    ? "text-emerald-500"
                                    : "text-slate-400",
                                )}
                              >
                                📡
                              </span>

                              {/* Motion status icon */}
                              <span
                                title={"Status: " + STATUS_META[v.status].label}
                                className={cn(
                                  "text-[10px]",
                                  v.status === "running"
                                    ? "text-emerald-500"
                                    : v.status === "idle"
                                      ? "text-amber-500"
                                      : "text-rose-500",
                                )}
                              >
                                {v.status === "running"
                                  ? "🟢"
                                  : v.status === "idle"
                                    ? "🟡"
                                    : "🔴"}
                              </span>

                              {/* Battery % Chip */}
                              <span
                                className={cn(
                                  "inline-flex items-center px-1 py-0.2 rounded font-mono text-[10px] font-semibold",
                                  batteryVal !== null && batteryVal > 50
                                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                    : batteryVal !== null && batteryVal > 20
                                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                      : batteryVal !== null
                                        ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                        : "bg-muted text-muted-foreground border border-border",
                                )}
                              >
                                {batteryVal !== null ? batteryVal + "%" : "NA"}
                              </span>
                            </div>

                            {/* Right Quick Actions (Video, Camera, Trace, Info) */}
                            <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
                              {/* Live Video Camera */}
                              <button
                                type="button"
                                title="Live Video Stream"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenDashcam(v);
                                }}
                                className="p-1 rounded hover:bg-muted hover:text-blue-600 transition-colors cursor-pointer"
                              >
                                <Video className="h-3.5 w-3.5" />
                              </button>

                              {/* Snapshot Camera */}
                              <button
                                type="button"
                                title="Capture Snapshot"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenDashcam(v);
                                }}
                                className="p-1 rounded hover:bg-muted hover:text-blue-600 transition-colors cursor-pointer"
                              >
                                <Camera className="h-3.5 w-3.5" />
                              </button>

                              {/* Trace on Map */}
                              <button
                                type="button"
                                title="Center & Trace on Map"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onTraceVehicle(v);
                                }}
                                className="p-1 rounded hover:bg-muted hover:text-blue-600 transition-colors cursor-pointer"
                              >
                                <MapPin className="h-3.5 w-3.5" />
                              </button>

                              {/* Telemetry Info Drawer */}
                              <button
                                type="button"
                                title="View Telemetry & Sensor Diagnostics"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenTelemetry(v);
                                }}
                                className="p-1 rounded hover:bg-muted hover:text-blue-600 transition-colors cursor-pointer"
                              >
                                <Info className="h-3.5 w-3.5" />
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
      </div>
    </div>
  );
}
