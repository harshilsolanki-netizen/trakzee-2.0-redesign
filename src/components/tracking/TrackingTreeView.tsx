import React, { useState } from "react";
import {
  ChevronDown,
  Folder,
  FolderOpen,
  Key,
  Wifi,
  Video,
  MapPin,
  Layers,
  Caravan,
  User,
  Phone,
  Eye,
  Info,
  Lock,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { FleetObject, ObjectStatus } from "@/data/fleet";
import type { TrackingTab } from "./FleetExplorerPanel";

export interface TrackingTreeViewProps {
  activeTab: TrackingTab;
  vehicles: FleetObject[];
  selectedVehicleId: string;
  checkedVehicleIds: string[];
  onSelectVehicle: (id: string) => void;
  onToggleCheckVehicle: (id: string) => void;
  onToggleCheckAll?: () => void;
  onOpenTelemetry?: (vehicle: FleetObject, isHealthOnly?: boolean, selectedJob?: any) => void;
  query?: string;
  activeStatus?: ObjectStatus | "all";
  selectedColumns?: string[];
  branchGroups?: [string, FleetObject[]][];
  onToggleCheckGroup?: (ids: string[]) => void;
  onTraceVehicle?: (vehicle: FleetObject) => void;
  onOpenDashcam?: (vehicle: FleetObject) => void;
  // Tab-specific handlers & data
  onSelectJob?: (job: any) => void;
  onSelectDriver?: (driver: any) => void;
  onSelectAddress?: (address: any) => void;
  onSelectGeofence?: (geofence: any) => void;
  onSelectTrailer?: (trailer: any) => void;
  onSelectBeacon?: (beacon: any) => void;
  onSelectVideoDevice?: (device: any) => void;
  onOpenIntercom?: (driver: any) => void;
  jobData?: any[];
  driverData?: any[];
  addressData?: any[];
  geofenceData?: any[];
  trailerData?: any[];
  beaconData?: any[];
  videoTelematicsData?: any[];
}

export function TrackingTreeView({
  activeTab,
  vehicles,
  selectedVehicleId,
  checkedVehicleIds,
  onSelectVehicle,
  onToggleCheckVehicle,
  onOpenTelemetry,
  query = "",
  activeStatus = "all",
  selectedColumns = ["speed", "ignition", "gps", "driver", "driver_mobile", "address", "live_streaming", "reports", "last_updated"],
  branchGroups,
  onToggleCheckGroup,
  onTraceVehicle,
  onOpenDashcam,
  onSelectJob,
  onSelectDriver,
  onSelectAddress,
  onSelectGeofence,
  onSelectTrailer,
  onSelectBeacon,
  onSelectVideoDevice,
  onOpenIntercom,
  jobData = [],
  driverData = [],
  addressData = [],
  geofenceData = [],
  trailerData = [],
  beaconData = [],
  videoTelematicsData = [],
}: TrackingTreeViewProps) {
  // Collapsed state tracking
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  const toggleNode = (nodeId: string) => {
    setCollapsedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const isCollapsed = (nodeId: string, defaultCollapsed = false) => {
    return collapsedNodes[nodeId] ?? defaultCollapsed;
  };

  // Status Color Palette mappings
  const getStatusColor = (status: ObjectStatus | string) => {
    switch (status) {
      case "running":
        return "#008446";
      case "idle":
        return "#C46F37";
      case "stopped":
        return "#C70036";
      case "inactive":
        return "#372AAC";
      case "no_data":
      case "nodata":
        return "#62748E";
      case "total":
      default:
        return "#223344";
    }
  };

  // Filter vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchesStatus = activeStatus === "all" || v.status === activeStatus;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      v.name.toLowerCase().includes(q) ||
      v.plate.toLowerCase().includes(q) ||
      v.imei.toLowerCase().includes(q) ||
      (v.branch && v.branch.toLowerCase().includes(q)) ||
      (v.driverName && v.driverName.toLowerCase().includes(q));
    return matchesStatus && matchesQuery;
  });

  // Effective branch groups: either passed from FleetExplorerPanel or computed from filteredVehicles
  const effectiveBranchGroups = React.useMemo(() => {
    if (branchGroups && branchGroups.length > 0) {
      return branchGroups;
    }
    const map = new Map<string, FleetObject[]>();
    filteredVehicles.forEach((v) => {
      const b = v.branch || "General";
      if (!map.has(b)) map.set(b, []);
      map.get(b)!.push(v);
    });
    return Array.from(map.entries());
  }, [branchGroups, filteredVehicles]);

  // ==========================================
  // RENDER: Object Tab Tree (100% same data, columns, indicators, & actions)
  // ==========================================
  if (activeTab === "object" || activeTab === "health") {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar select-none bg-white dark:bg-slate-900 py-1.5 px-2 font-sans">
        {effectiveBranchGroups.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No matching objects found</div>
        ) : (
          effectiveBranchGroups.map(([branch, branchVehicles]) => {
            const branchKey = "branch-" + branch;
            const isBranchCollapsed = isCollapsed(branchKey);
            const groupIds = branchVehicles.map((v) => v.id);
            const isGroupAllChecked =
              groupIds.length > 0 && groupIds.every((id) => checkedVehicleIds.includes(id));
            const isGroupSomeChecked =
              groupIds.some((id) => checkedVehicleIds.includes(id)) && !isGroupAllChecked;

            return (
              <div
                key={branch}
                className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs overflow-hidden mb-2"
              >
                {/* Branch Node Header */}
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors border-b border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {/* Expand/Collapse Chevron */}
                    <button
                      type="button"
                      onClick={() => toggleNode(branchKey)}
                      className="p-1 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 stroke-[2] transition-transform duration-200",
                          isBranchCollapsed && "-rotate-90"
                        )}
                      />
                    </button>

                    {/* Branch Checkbox */}
                    <input
                      type="checkbox"
                      checked={isGroupAllChecked}
                      ref={(el) => {
                        if (el) el.indeterminate = isGroupSomeChecked;
                      }}
                      onChange={() => {
                        if (onToggleCheckGroup) {
                          onToggleCheckGroup(groupIds);
                        } else {
                          groupIds.forEach((id) => onToggleCheckVehicle(id));
                        }
                      }}
                      className="h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-600 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                    />

                    {/* Folder Icon */}
                    <div className="h-6 w-6 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                      {isBranchCollapsed ? (
                        <Folder className="h-3.5 w-3.5 stroke-[2]" />
                      ) : (
                        <FolderOpen className="h-3.5 w-3.5 stroke-[2]" />
                      )}
                    </div>

                    {/* Branch Name */}
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                      {branch}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-500 shrink-0">
                      [{branchVehicles.length}]
                    </span>
                  </div>
                </div>

                {/* Branch Vehicles (Leaves) with Tree Guide Line */}
                {!isBranchCollapsed && (
                  <div className="ml-5 pl-2.5 border-l-2 border-slate-200 dark:border-slate-800 divide-y divide-[#DFE3EB]/40 dark:divide-slate-800/40 my-1">
                    {branchVehicles.map((v) => {
                      const isSelected = v.id === selectedVehicleId;
                      const isChecked = checkedVehicleIds.includes(v.id);

                      return (
                        <div
                          key={v.id}
                          onClick={() => {
                            onSelectVehicle(v.id);
                            if (onOpenTelemetry) onOpenTelemetry(v);
                          }}
                          className={cn(
                            "flex items-center gap-2 px-2.5 py-1.5 text-xs transition-colors cursor-pointer select-none min-h-[46px] overflow-hidden rounded-r-lg",
                            isSelected
                              ? "bg-sky-50/90 dark:bg-sky-950/50"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          )}
                        >
                          {/* Col 1: Checkbox + Status Dot + Name & Timestamp */}
                          <div className="flex items-center gap-1.5 shrink-0 w-[210px] pl-1">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onClick={(e) => e.stopPropagation()}
                              onChange={() => onToggleCheckVehicle(v.id)}
                              className="h-[12px] w-[12px] rounded border-slate-200 dark:border-slate-700 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                            />

                            {/* Status Dot */}
                            <span
                              title={Boolean(v.status) ? `Status: ${v.status.toUpperCase()}` : "Status: UNKNOWN"}
                              style={{ backgroundColor: getStatusColor(v.status) }}
                              className="h-2 w-2 rounded-full shrink-0 shadow-2xs"
                            />

                            {/* Name & Timestamp */}
                            <div className="flex flex-col min-w-0 truncate">
                              <span className="truncate text-xs font-semibold leading-tight text-slate-900 dark:text-slate-100">
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
                              <span
                                className={
                                  v.speed > 0
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-slate-400"
                                }
                              >
                                {v.speed}
                              </span>
                            </div>
                          )}

                          {/* Col 3: Ignition & GPS Status Icons */}
                          {(selectedColumns.includes("ignition") ||
                            selectedColumns.includes("gps")) && (
                            <div className="flex items-center gap-1.5 shrink-0 w-[48px] justify-center">
                              {selectedColumns.includes("ignition") && (
                                <span title={"Ignition: " + (v.ignition !== false ? "ON" : "OFF")}>
                                  <Key
                                    className={cn(
                                      "h-3.5 w-3.5 stroke-[2.2]",
                                      v.ignition !== false
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-slate-400 dark:text-slate-500"
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
                          {(selectedColumns.includes("driver") ||
                            selectedColumns.includes("driver_mobile")) && (
                            <div
                              className={cn(
                                "shrink-0 truncate text-xs flex flex-col justify-center",
                                selectedColumns.includes("driver") &&
                                  selectedColumns.includes("driver_mobile")
                                  ? "w-[140px]"
                                  : "w-[125px]"
                              )}
                              title={`${v.driver || "No Driver"}${v.driverPhone ? ` (${v.driverPhone})` : ""}`}
                            >
                              {selectedColumns.includes("driver") &&
                              selectedColumns.includes("driver_mobile") ? (
                                <>
                                  <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate leading-tight">
                                    <User className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 stroke-[2.2] shrink-0" />
                                    <span className="truncate">{v.driver || "Unassigned"}</span>
                                  </div>
                                  <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500 dark:text-slate-400 truncate leading-none mt-0.5">
                                    <Phone className="h-3 w-3 text-emerald-600 dark:text-emerald-400 stroke-[2.2] shrink-0" />
                                    <span className="truncate">
                                      {v.driverPhone || "+91 98765 43210"}
                                    </span>
                                  </div>
                                </>
                              ) : selectedColumns.includes("driver_mobile") ? (
                                <div className="flex items-center gap-1 font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate">
                                  <Phone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.2] shrink-0" />
                                  <span className="truncate">
                                    {v.driverPhone || "+91 98765 43210"}
                                  </span>
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

                          {/* Col 6: Action Buttons */}
                          <div className="flex items-center gap-1.5 shrink-0 w-[75px] justify-end pr-1">
                            {selectedColumns.includes("live_streaming") && (
                              <button
                                type="button"
                                title="Live Video Camera"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onOpenDashcam) onOpenDashcam(v);
                                }}
                                className="p-0.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors cursor-pointer"
                              >
                                <Video className="h-3.5 w-3.5 stroke-[2.2]" />
                              </button>
                            )}
                            {(selectedColumns.includes("immobilize") ||
                              selectedColumns.includes("elock")) && (
                              <button
                                type="button"
                                title="Engine Lock / Immobilizer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onOpenTelemetry) onOpenTelemetry(v);
                                }}
                                className="p-0.5 text-rose-500 dark:text-rose-400 hover:text-rose-600 transition-colors cursor-pointer"
                              >
                                <Lock className="h-3.5 w-3.5 stroke-[2.2]" />
                              </button>
                            )}
                            {(selectedColumns.includes("reports") ||
                              selectedColumns.includes("timeline_chart")) && (
                              <button
                                type="button"
                                title="Trace on Map"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onTraceVehicle) onTraceVehicle(v);
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
                                if (onOpenTelemetry) onOpenTelemetry(v);
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
          })
        )}
      </div>
    );
  }

  // ==========================================
  // RENDER: Jobs Tab Tree View (Using Real jobData)
  // ==========================================
  if (activeTab === "jobs") {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar select-none bg-white dark:bg-slate-900 py-1.5 px-2 font-sans">
        {jobData.map((group) => {
          const bKey = "job-branch-" + group.branch;
          const isBranchCollapsed = isCollapsed(bKey);

          const filteredSubgroups = (group.subgroups || [])
            .map((sub: any) => {
              const filteredJobs = (sub.jobs || []).filter((j: any) => {
                const q = query.trim().toLowerCase();
                return (
                  q === "" ||
                  j.code.toLowerCase().includes(q) ||
                  j.title.toLowerCase().includes(q) ||
                  j.object.toLowerCase().includes(q) ||
                  (j.rep && j.rep.toLowerCase().includes(q))
                );
              });
              return { ...sub, jobs: filteredJobs };
            })
            .filter((sub: any) => sub.jobs.length > 0);

          if (filteredSubgroups.length === 0) return null;

          const branchTotalCount = filteredSubgroups.reduce(
            (acc: number, sub: any) => acc + sub.jobs.length,
            0
          );

          return (
            <div
              key={group.branch}
              className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs overflow-hidden mb-2"
            >
              {/* Branch Node */}
              <div
                onClick={() => toggleNode(bKey)}
                className="flex items-center justify-between px-3 py-2 bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors border-b border-slate-200/60 dark:border-slate-800/60 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-500 transition-transform duration-200",
                      isBranchCollapsed && "-rotate-90"
                    )}
                  />
                  <div className="h-6 w-6 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    {isBranchCollapsed ? (
                      <Folder className="h-3.5 w-3.5 stroke-[2]" />
                    ) : (
                      <FolderOpen className="h-3.5 w-3.5 stroke-[2]" />
                    )}
                  </div>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    {group.branch}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    [{branchTotalCount}]
                  </span>
                </div>
              </div>

              {/* Subgroups & Jobs */}
              {!isBranchCollapsed && (
                <div className="ml-5 pl-2.5 border-l-2 border-slate-200 dark:border-slate-800 my-1">
                  {filteredSubgroups.map((sub: any) => {
                    const subKey = "job-sub-" + group.branch + "-" + sub.name;
                    const isSubCollapsed = isCollapsed(subKey);

                    return (
                      <div key={sub.name} className="mb-1">
                        <div
                          onClick={() => toggleNode(subKey)}
                          className="flex items-center justify-between px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5">
                            <ChevronDown
                              className={cn(
                                "h-3 w-3 text-slate-400 transition-transform duration-200",
                                isSubCollapsed && "-rotate-90"
                              )}
                            />
                            <Folder className="h-3 w-3 text-amber-500" />
                            <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                              {sub.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              [{sub.jobs.length}]
                            </span>
                          </div>
                        </div>

                        {!isSubCollapsed && (
                          <div className="ml-4 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-1 my-1">
                            {sub.jobs.map((job: any) => (
                              <div
                                key={job.id}
                                onClick={() => onSelectJob && onSelectJob(job)}
                                className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800/60 cursor-pointer shadow-2xs"
                              >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <span
                                    className={cn(
                                      "h-2 w-2 rounded-full shrink-0",
                                      job.statusType === "running"
                                        ? "bg-emerald-500"
                                        : job.statusType === "completed"
                                        ? "bg-sky-500"
                                        : "bg-amber-500"
                                    )}
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                                      {job.title}
                                    </div>
                                    <div className="text-[10px] font-mono text-slate-400 truncate">
                                      {job.code} • {job.object}
                                    </div>
                                  </div>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/60 text-[#0089FF] border border-sky-200 dark:border-sky-800 shrink-0">
                                  {job.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // ==========================================
  // RENDER: Driver Tab Tree View (Using Real driverData)
  // ==========================================
  if (activeTab === "driver") {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar select-none bg-white dark:bg-slate-900 py-1.5 px-2 font-sans">
        {driverData.map((group) => {
          const bKey = "drv-branch-" + group.branch;
          const isBranchCollapsed = isCollapsed(bKey);

          const filteredSubgroups = (group.subgroups || [])
            .map((sub: any) => {
              const filteredDrivers = (sub.drivers || []).filter((drv: any) => {
                const q = query.trim().toLowerCase();
                return (
                  q === "" ||
                  drv.name.toLowerCase().includes(q) ||
                  drv.vehicle.toLowerCase().includes(q) ||
                  group.branch.toLowerCase().includes(q) ||
                  sub.name.toLowerCase().includes(q)
                );
              });
              return { ...sub, drivers: filteredDrivers };
            })
            .filter((sub: any) => sub.drivers.length > 0);

          if (filteredSubgroups.length === 0) return null;

          const branchTotalCount = filteredSubgroups.reduce(
            (acc: number, sub: any) => acc + sub.drivers.length,
            0
          );

          return (
            <div
              key={group.branch}
              className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs overflow-hidden mb-2"
            >
              <div
                onClick={() => toggleNode(bKey)}
                className="flex items-center justify-between px-3 py-2 bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors border-b border-slate-200/60 dark:border-slate-800/60 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-500 transition-transform duration-200",
                      isBranchCollapsed && "-rotate-90"
                    )}
                  />
                  <div className="h-6 w-6 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    {isBranchCollapsed ? (
                      <Folder className="h-3.5 w-3.5 stroke-[2]" />
                    ) : (
                      <FolderOpen className="h-3.5 w-3.5 stroke-[2]" />
                    )}
                  </div>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    {group.branch}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    [{branchTotalCount}]
                  </span>
                </div>
              </div>

              {!isBranchCollapsed && (
                <div className="ml-5 pl-2.5 border-l-2 border-slate-200 dark:border-slate-800 my-1">
                  {filteredSubgroups.map((sub: any) => {
                    const subKey = "drv-sub-" + group.branch + "-" + sub.name;
                    const isSubCollapsed = isCollapsed(subKey);

                    return (
                      <div key={sub.name} className="mb-1">
                        <div
                          onClick={() => toggleNode(subKey)}
                          className="flex items-center justify-between px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5">
                            <ChevronDown
                              className={cn(
                                "h-3 w-3 text-slate-400 transition-transform duration-200",
                                isSubCollapsed && "-rotate-90"
                              )}
                            />
                            <Folder className="h-3 w-3 text-amber-500" />
                            <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                              {sub.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              [{sub.drivers.length}]
                            </span>
                          </div>
                        </div>

                        {!isSubCollapsed && (
                          <div className="ml-4 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-1 my-1">
                            {sub.drivers.map((drv: any) => (
                              <div
                                key={drv.id}
                                onClick={() => onSelectDriver && onSelectDriver(drv)}
                                className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800/60 cursor-pointer shadow-2xs"
                              >
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <span
                                    className="h-2.5 w-2.5 rounded-full shrink-0"
                                    style={{
                                      backgroundColor: drv.isRunning
                                        ? "#008446"
                                        : drv.driverStatus === "Available"
                                        ? "#0089FF"
                                        : "#C70036",
                                    }}
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                                      {drv.name}
                                    </div>
                                    <div className="text-[10px] font-medium text-slate-400 truncate">
                                      {drv.vehicle || "Unallocated"} • {drv.phone}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (onOpenIntercom) onOpenIntercom(drv);
                                    }}
                                    className="p-1 rounded-md bg-sky-50 dark:bg-sky-950/60 text-[#0089FF] hover:bg-sky-100 dark:hover:bg-sky-900 transition-colors cursor-pointer"
                                    title="Call Driver"
                                  >
                                    <Phone className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // ==========================================
  // RENDER: Address Tab Tree View (Using Real addressData)
  // ==========================================
  if (activeTab === "address") {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar select-none bg-white dark:bg-slate-900 py-1.5 px-2 font-sans">
        {addressData.map((group) => {
          const gKey = "addr-group-" + group.group;
          const isGroupCollapsed = isCollapsed(gKey);

          const filteredSubgroups = (group.subgroups || [])
            .map((sub: any) => {
              const filteredAddresses = (sub.addresses || []).filter((addr: any) => {
                const q = query.trim().toLowerCase();
                return (
                  q === "" ||
                  addr.name.toLowerCase().includes(q) ||
                  addr.address.toLowerCase().includes(q) ||
                  group.group.toLowerCase().includes(q) ||
                  sub.name.toLowerCase().includes(q)
                );
              });
              return { ...sub, addresses: filteredAddresses };
            })
            .filter((sub: any) => sub.addresses.length > 0);

          if (filteredSubgroups.length === 0) return null;

          const groupTotalCount = filteredSubgroups.reduce(
            (acc: number, sub: any) => acc + sub.addresses.length,
            0
          );

          return (
            <div
              key={group.group}
              className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs overflow-hidden mb-2"
            >
              <div
                onClick={() => toggleNode(gKey)}
                className="flex items-center justify-between px-3 py-2 bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors border-b border-slate-200/60 dark:border-slate-800/60 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-500 transition-transform duration-200",
                      isGroupCollapsed && "-rotate-90"
                    )}
                  />
                  <div className="h-6 w-6 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    {isGroupCollapsed ? (
                      <Folder className="h-3.5 w-3.5 stroke-[2]" />
                    ) : (
                      <FolderOpen className="h-3.5 w-3.5 stroke-[2]" />
                    )}
                  </div>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    {group.group}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    [{groupTotalCount}]
                  </span>
                </div>
              </div>

              {!isGroupCollapsed && (
                <div className="ml-5 pl-2.5 border-l-2 border-slate-200 dark:border-slate-800 my-1">
                  {filteredSubgroups.map((sub: any) => {
                    const subKey = "addr-sub-" + group.group + "-" + sub.name;
                    const isSubCollapsed = isCollapsed(subKey);

                    return (
                      <div key={sub.name} className="mb-1">
                        <div
                          onClick={() => toggleNode(subKey)}
                          className="flex items-center justify-between px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5">
                            <ChevronDown
                              className={cn(
                                "h-3 w-3 text-slate-400 transition-transform duration-200",
                                isSubCollapsed && "-rotate-90"
                              )}
                            />
                            <Folder className="h-3 w-3 text-amber-500" />
                            <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                              {sub.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              [{sub.addresses.length}]
                            </span>
                          </div>
                        </div>

                        {!isSubCollapsed && (
                          <div className="ml-4 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-1 my-1">
                            {sub.addresses.map((addr: any) => (
                              <div
                                key={addr.id}
                                onClick={() => onSelectAddress && onSelectAddress(addr)}
                                className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800/60 cursor-pointer shadow-2xs"
                              >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <MapPin className="h-3.5 w-3.5 text-[#0089FF] shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <div className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                                      {addr.name}
                                    </div>
                                    <div className="text-[10px] text-slate-400 truncate">
                                      {addr.address || addr.type}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // ==========================================
  // RENDER: Geofence Tab Tree View (Using Real geofenceData)
  // ==========================================
  if (activeTab === "geofence") {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar select-none bg-white dark:bg-slate-900 py-1.5 px-2 font-sans">
        {geofenceData.map((groupData) => {
          const gKey = "gf-group-" + groupData.group;
          const isGroupCollapsed = isCollapsed(gKey);

          const filteredSubgroups = (groupData.subgroups || [])
            .map((sub: any) => ({
              ...sub,
              geofences: (sub.geofences || []).filter((g: any) => {
                const q = query.trim().toLowerCase();
                return (
                  q === "" ||
                  g.name.toLowerCase().includes(q) ||
                  groupData.group.toLowerCase().includes(q) ||
                  sub.name.toLowerCase().includes(q)
                );
              }),
            }))
            .filter((sub: any) => sub.geofences.length > 0);

          if (filteredSubgroups.length === 0) return null;

          const groupTotalCount = filteredSubgroups.reduce(
            (acc: number, sub: any) => acc + sub.geofences.length,
            0
          );

          return (
            <div
              key={groupData.group}
              className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs overflow-hidden mb-2"
            >
              <div
                onClick={() => toggleNode(gKey)}
                className="flex items-center justify-between px-3 py-2 bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors border-b border-slate-200/60 dark:border-slate-800/60 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-500 transition-transform duration-200",
                      isGroupCollapsed && "-rotate-90"
                    )}
                  />
                  <div className="h-6 w-6 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    {isGroupCollapsed ? (
                      <Folder className="h-3.5 w-3.5 stroke-[2]" />
                    ) : (
                      <FolderOpen className="h-3.5 w-3.5 stroke-[2]" />
                    )}
                  </div>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    {groupData.group}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    [{groupTotalCount}]
                  </span>
                </div>
              </div>

              {!isGroupCollapsed && (
                <div className="ml-5 pl-2.5 border-l-2 border-slate-200 dark:border-slate-800 my-1">
                  {filteredSubgroups.map((sub: any) => {
                    const subKey = "gf-sub-" + groupData.group + "-" + sub.name;
                    const isSubCollapsed = isCollapsed(subKey);

                    return (
                      <div key={sub.name} className="mb-1">
                        <div
                          onClick={() => toggleNode(subKey)}
                          className="flex items-center justify-between px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5">
                            <ChevronDown
                              className={cn(
                                "h-3 w-3 text-slate-400 transition-transform duration-200",
                                isSubCollapsed && "-rotate-90"
                              )}
                            />
                            <Folder className="h-3 w-3 text-amber-500" />
                            <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                              {sub.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              [{sub.geofences.length}]
                            </span>
                          </div>
                        </div>

                        {!isSubCollapsed && (
                          <div className="ml-4 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-1 my-1">
                            {sub.geofences.map((gf: any) => (
                              <div
                                key={gf.id}
                                onClick={() => onSelectGeofence && onSelectGeofence(gf)}
                                className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800/60 cursor-pointer shadow-2xs"
                              >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <Layers className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <div className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                                      {gf.name}
                                    </div>
                                    <div className="text-[10px] text-slate-400 truncate">
                                      {gf.type || "Polygon"} • {gf.speedLimit || "No speed limit"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // ==========================================
  // RENDER: Trailer Tab Tree View (Using Real trailerData)
  // ==========================================
  if (activeTab === "trailer") {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar select-none bg-white dark:bg-slate-900 py-1.5 px-2 font-sans">
        {trailerData.map((groupItem) => {
          const gKey = "tr-group-" + groupItem.group;
          const isGroupCollapsed = isCollapsed(gKey);

          const filteredSubgroups = (groupItem.subgroups || [])
            .map((sub: any) => ({
              ...sub,
              trailers: (sub.trailers || []).filter((tr: any) => {
                const q = query.trim().toLowerCase();
                return (
                  q === "" ||
                  tr.name.toLowerCase().includes(q) ||
                  tr.code.toLowerCase().includes(q) ||
                  (tr.vehicle && tr.vehicle.toLowerCase().includes(q)) ||
                  groupItem.group.toLowerCase().includes(q) ||
                  sub.name.toLowerCase().includes(q)
                );
              }),
            }))
            .filter((sub: any) => sub.trailers.length > 0);

          if (filteredSubgroups.length === 0) return null;

          const groupTotalCount = filteredSubgroups.reduce(
            (acc: number, sub: any) => acc + sub.trailers.length,
            0
          );

          return (
            <div
              key={groupItem.group}
              className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs overflow-hidden mb-2"
            >
              <div
                onClick={() => toggleNode(gKey)}
                className="flex items-center justify-between px-3 py-2 bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors border-b border-slate-200/60 dark:border-slate-800/60 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-500 transition-transform duration-200",
                      isGroupCollapsed && "-rotate-90"
                    )}
                  />
                  <div className="h-6 w-6 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    {isGroupCollapsed ? (
                      <Folder className="h-3.5 w-3.5 stroke-[2]" />
                    ) : (
                      <FolderOpen className="h-3.5 w-3.5 stroke-[2]" />
                    )}
                  </div>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    {groupItem.group}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    [{groupTotalCount}]
                  </span>
                </div>
              </div>

              {!isGroupCollapsed && (
                <div className="ml-5 pl-2.5 border-l-2 border-slate-200 dark:border-slate-800 my-1">
                  {filteredSubgroups.map((sub: any) => {
                    const subKey = "tr-sub-" + groupItem.group + "-" + sub.name;
                    const isSubCollapsed = isCollapsed(subKey);

                    return (
                      <div key={sub.name} className="mb-1">
                        <div
                          onClick={() => toggleNode(subKey)}
                          className="flex items-center justify-between px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5">
                            <ChevronDown
                              className={cn(
                                "h-3 w-3 text-slate-400 transition-transform duration-200",
                                isSubCollapsed && "-rotate-90"
                              )}
                            />
                            <Folder className="h-3 w-3 text-amber-500" />
                            <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                              {sub.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              [{sub.trailers.length}]
                            </span>
                          </div>
                        </div>

                        {!isSubCollapsed && (
                          <div className="ml-4 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-1 my-1">
                            {sub.trailers.map((tr: any) => (
                              <div
                                key={tr.id}
                                onClick={() => onSelectTrailer && onSelectTrailer(tr)}
                                className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800/60 cursor-pointer shadow-2xs"
                              >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <Caravan className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <div className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                                      {tr.name}
                                    </div>
                                    <div className="text-[10px] text-slate-400 truncate">
                                      Code: {tr.code} • Vehicle: {tr.vehicle || "Unlinked"}
                                    </div>
                                  </div>
                                </div>
                                <span
                                  className={cn(
                                    "text-[10px] font-bold px-2 py-0.5 rounded border shrink-0",
                                    tr.isAttached
                                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                      : "bg-slate-50 text-slate-500 border-slate-200"
                                  )}
                                >
                                  {tr.isAttached ? "Attached" : "Detached"}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // ==========================================
  // RENDER: Beacon Tab Tree View (Using Real beaconData)
  // ==========================================
  if (activeTab === "beacon") {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar select-none bg-white dark:bg-slate-900 py-1.5 px-2 font-sans">
        {beaconData.map((groupItem) => {
          const gKey = "bcn-group-" + groupItem.group;
          const isGroupCollapsed = isCollapsed(gKey);

          const filteredSubgroups = (groupItem.subgroups || [])
            .map((subGroup: any) => ({
              ...subGroup,
              beacons: (subGroup.beacons || []).filter((b: any) => {
                const q = query.trim().toLowerCase();
                return (
                  q === "" ||
                  b.name.toLowerCase().includes(q) ||
                  b.object.toLowerCase().includes(q) ||
                  (b.location && b.location.toLowerCase().includes(q))
                );
              }),
            }))
            .filter((subGroup: any) => subGroup.beacons.length > 0);

          if (filteredSubgroups.length === 0) return null;

          const groupTotalCount = filteredSubgroups.reduce(
            (acc: number, sub: any) => acc + sub.beacons.length,
            0
          );

          return (
            <div
              key={groupItem.group}
              className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs overflow-hidden mb-2"
            >
              <div
                onClick={() => toggleNode(gKey)}
                className="flex items-center justify-between px-3 py-2 bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors border-b border-slate-200/60 dark:border-slate-800/60 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-500 transition-transform duration-200",
                      isGroupCollapsed && "-rotate-90"
                    )}
                  />
                  <div className="h-6 w-6 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    {isGroupCollapsed ? (
                      <Folder className="h-3.5 w-3.5 stroke-[2]" />
                    ) : (
                      <FolderOpen className="h-3.5 w-3.5 stroke-[2]" />
                    )}
                  </div>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    {groupItem.group}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    [{groupTotalCount}]
                  </span>
                </div>
              </div>

              {!isGroupCollapsed && (
                <div className="ml-5 pl-2.5 border-l-2 border-slate-200 dark:border-slate-800 my-1">
                  {filteredSubgroups.map((subGroup: any) => {
                    const subKey = "bcn-sub-" + groupItem.group + "-" + subGroup.name;
                    const isSubCollapsed = isCollapsed(subKey);

                    return (
                      <div key={subGroup.name} className="mb-1">
                        <div
                          onClick={() => toggleNode(subKey)}
                          className="flex items-center justify-between px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5">
                            <ChevronDown
                              className={cn(
                                "h-3 w-3 text-slate-400 transition-transform duration-200",
                                isSubCollapsed && "-rotate-90"
                              )}
                            />
                            <Folder className="h-3 w-3 text-amber-500" />
                            <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                              {subGroup.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              [{subGroup.beacons.length}]
                            </span>
                          </div>
                        </div>

                        {!isSubCollapsed && (
                          <div className="ml-4 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-1 my-1">
                            {subGroup.beacons.map((bcn: any) => (
                              <div
                                key={bcn.id}
                                onClick={() => onSelectBeacon && onSelectBeacon(bcn)}
                                className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800/60 cursor-pointer shadow-2xs"
                              >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <Radio className="h-3.5 w-3.5 text-[#0089FF] shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <div className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                                      {bcn.name}
                                    </div>
                                    <div className="text-[10px] font-mono text-slate-400 truncate">
                                      Target: {bcn.object} • RSSI: {bcn.rssi || "-60 dBm"}
                                    </div>
                                  </div>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">
                                  {bcn.battery || "95%"}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // ==========================================
  // RENDER: Video Telematics Tab Tree View (Using Real videoTelematicsData)
  // ==========================================
  if (activeTab === "video_telematics") {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar select-none bg-white dark:bg-slate-900 py-1.5 px-2 font-sans">
        {videoTelematicsData.map((groupItem) => {
          const gKey = "vid-group-" + groupItem.group;
          const isGroupCollapsed = isCollapsed(gKey);

          const filteredSubgroups = (groupItem.subgroups || [])
            .map((subGroup: any) => ({
              ...subGroup,
              devices: (subGroup.devices || []).filter((d: any) => {
                const q = query.trim().toLowerCase();
                return (
                  q === "" ||
                  d.name.toLowerCase().includes(q) ||
                  (d.channels && d.channels.some((c: any) => c.name.toLowerCase().includes(q)))
                );
              }),
            }))
            .filter((subGroup: any) => subGroup.devices.length > 0);

          if (filteredSubgroups.length === 0) return null;

          const groupTotalCount = filteredSubgroups.reduce(
            (acc: number, sub: any) => acc + sub.devices.length,
            0
          );

          return (
            <div
              key={groupItem.group}
              className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs overflow-hidden mb-2"
            >
              <div
                onClick={() => toggleNode(gKey)}
                className="flex items-center justify-between px-3 py-2 bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors border-b border-slate-200/60 dark:border-slate-800/60 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-500 transition-transform duration-200",
                      isGroupCollapsed && "-rotate-90"
                    )}
                  />
                  <div className="h-6 w-6 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    {isGroupCollapsed ? (
                      <Folder className="h-3.5 w-3.5 stroke-[2]" />
                    ) : (
                      <FolderOpen className="h-3.5 w-3.5 stroke-[2]" />
                    )}
                  </div>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    {groupItem.group}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    [{groupTotalCount}]
                  </span>
                </div>
              </div>

              {!isGroupCollapsed && (
                <div className="ml-5 pl-2.5 border-l-2 border-slate-200 dark:border-slate-800 my-1">
                  {filteredSubgroups.map((subGroup: any) => {
                    const subKey = "vid-sub-" + groupItem.group + "-" + subGroup.name;
                    const isSubCollapsed = isCollapsed(subKey);

                    return (
                      <div key={subGroup.name} className="mb-1">
                        <div
                          onClick={() => toggleNode(subKey)}
                          className="flex items-center justify-between px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5">
                            <ChevronDown
                              className={cn(
                                "h-3 w-3 text-slate-400 transition-transform duration-200",
                                isSubCollapsed && "-rotate-90"
                              )}
                            />
                            <Folder className="h-3 w-3 text-amber-500" />
                            <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                              {subGroup.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              [{subGroup.devices.length}]
                            </span>
                          </div>
                        </div>

                        {!isSubCollapsed && (
                          <div className="ml-4 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-1 my-1">
                            {subGroup.devices.map((dev: any) => (
                              <div
                                key={dev.id}
                                onClick={() => onSelectVideoDevice && onSelectVideoDevice(dev)}
                                className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800/60 cursor-pointer shadow-2xs"
                              >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <Video className="h-3.5 w-3.5 text-[#0089FF] shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <div className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                                      {dev.name}
                                    </div>
                                    <div className="text-[10px] font-mono text-slate-400 truncate">
                                      Model: {dev.model || "Dual Cam"} • Status: {dev.status}
                                    </div>
                                  </div>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">
                                  ● LIVE
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}
