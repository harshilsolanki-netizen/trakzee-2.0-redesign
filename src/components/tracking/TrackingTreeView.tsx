import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
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
  SlidersHorizontal,
  Paperclip,
  Share2,
  Package,
  Weight,
  ShieldAlert,
  UserCheck,
  Route,
  Box,
  MoreVertical,
  Pencil,
  Trash2,
  Link2,
  Edit3,
  RotateCw,
  Clock,
  Camera,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
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
  activeJobStatus?: string;
  activeDriverStatus?: string;
  activeTrailerStatus?: "all" | "attached" | "notAttached";
  activeBeaconStatus?: "all" | "connected" | "disconnected";
  activeVideoStatus?: string;
  onUpdateDriverStatus?: (driverId: string, newStatus: string) => void;
  onUpdateAddressData?: React.Dispatch<React.SetStateAction<any[]>> | ((updater: any) => void);
  onUpdateBeaconData?: React.Dispatch<React.SetStateAction<any[]>> | ((updater: any) => void);
  onUpdateVideoTelematicsData?: React.Dispatch<React.SetStateAction<any[]>> | ((updater: any) => void);
  onOpenVideoChannel?: (feed: any) => void;
  onOpenPlayback?: (playback: any) => void;
  onEditTrailer?: (trailer: any, groupName?: string, subName?: string) => void;
  onAllocateVehicle?: (trailer: any, groupName?: string, subName?: string) => void;
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
  activeJobStatus = "all",
  activeDriverStatus = "all",
  activeTrailerStatus = "all",
  activeBeaconStatus = "all",
  activeVideoStatus = "all",
  onUpdateDriverStatus,
  onUpdateAddressData,
  onUpdateBeaconData,
  onUpdateVideoTelematicsData,
  onOpenVideoChannel,
  onOpenPlayback,
  onEditTrailer,
  onAllocateVehicle,
}: TrackingTreeViewProps) {
  // Collapsed state tracking
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});
  const [selectedJobIdState, setSelectedJobIdState] = useState<string>("j-50284");
  const [selectedEntityType, setSelectedEntityType] = useState<"job" | "vehicle">("job");
  const [selectedVehicleObjId, setSelectedVehicleObjId] = useState<string>("");
  const [openDriverMenuId, setOpenDriverMenuId] = useState<string | null>(null);
  const [openStatusSubmenuId, setOpenStatusSubmenuId] = useState<string | null>(null);

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
  // RENDER: Object Tab Tree (100% matched to media_1791552730969.png)
  // ==========================================
  if (activeTab === "object" || activeTab === "health") {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar select-none bg-white dark:bg-slate-900 py-1 font-sans rounded-b-2xl">
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
              <div key={branch} className="relative mb-0.5">
                {/* Branch Header Row */}
                <div className="relative flex items-center justify-between px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors select-none">
                  {/* Top connector stub running from bottom of chevron down to the bottom of the header row */}
                  {!isBranchCollapsed && branchVehicles.length > 0 && (
                    <div className="absolute left-[40px] top-[22px] bottom-0 w-px bg-[#BDC5CF] pointer-events-none" />
                  )}
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
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

                    {/* Expand/Collapse Chevron */}
                    <button
                      type="button"
                      onClick={() => toggleNode(branchKey)}
                      className="w-4 h-4 flex items-center justify-center rounded hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 stroke-[2] transition-transform duration-200",
                          isBranchCollapsed && "-rotate-90"
                        )}
                      />
                    </button>

                    {/* Branch Title */}
                    <span
                      onClick={() => toggleNode(branchKey)}
                      className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate cursor-pointer hover:text-[#0089FF]"
                    >
                      {branch}
                    </span>
                  </div>

                  {/* Count badge on the right [N] */}
                  <span className="text-[11px] font-mono font-medium text-slate-500 shrink-0">
                    [{branchVehicles.length}]
                  </span>
                </div>

                {/* Branch Vehicles (Leaves) with Tree Guide Lines */}
                {!isBranchCollapsed && (
                  <div className="relative">
                    {branchVehicles.map((v, idx) => {
                      const isSelected = v.id === selectedVehicleId;
                      const isChecked = checkedVehicleIds.includes(v.id);
                      const isLast = idx === branchVehicles.length - 1;

                      return (
                        <div
                          key={v.id}
                          onClick={() => {
                            onSelectVehicle(v.id);
                            if (onOpenTelemetry) onOpenTelemetry(v);
                          }}
                          className={cn(
                            "relative flex items-center gap-2 pr-3 py-1.5 text-xs transition-colors cursor-pointer select-none min-h-[46px]",
                            isSelected
                              ? "bg-sky-50/90 dark:bg-sky-950/50"
                              : "hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                          )}
                        >
                          {/* Tree Guide Lines in elegant thin #BDC5CF */}
                          {!isLast ? (
                            <>
                              {/* Continuous vertical trunk line */}
                              <div className="absolute left-[40px] top-0 bottom-0 w-px bg-[#BDC5CF] pointer-events-none" />
                              {/* Horizontal branch line reaching directly to child checkbox */}
                              <div className="absolute left-[40px] top-1/2 -translate-y-1/2 w-[16px] h-px bg-[#BDC5CF] pointer-events-none" />
                            </>
                          ) : (
                            /* Last child: vertical trunk down to center, turning right with curved corner */
                            <div className="absolute left-[40px] top-0 h-1/2 w-[16px] border-l border-b border-[#BDC5CF] rounded-bl-[4px] pointer-events-none" />
                          )}

                          {/* Col 1: Indented Checkbox + Name & Timestamp */}
                          <div className="flex items-center gap-2 shrink-0 w-[210px] pl-[56px]">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onClick={(e) => e.stopPropagation()}
                              onChange={() => onToggleCheckVehicle(v.id)}
                              className="h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-600 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                            />

                            {/* Name & Timestamp */}
                            <div className="flex flex-col min-w-0 truncate">
                              <span className="truncate text-xs font-bold leading-tight text-slate-900 dark:text-slate-100">
                                {v.name}
                              </span>
                              {selectedColumns.includes("last_updated") && (
                                <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 truncate leading-none mt-1">
                                  {v.timestamp || "21-09-2026 11:25:40 AM"}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Col 2: Speed */}
                          {selectedColumns.includes("speed") && (
                            <div className="shrink-0 w-[48px] text-center font-mono font-bold text-xs tabular-nums">
                              <span
                                className={
                                  v.speed > 0
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-slate-400 dark:text-slate-500"
                                }
                              >
                                {v.speed}
                              </span>
                            </div>
                          )}

                          {/* Col 3: Ignition & GPS Status Icons */}
                          {(selectedColumns.includes("ignition") ||
                            selectedColumns.includes("gps")) && (
                            <div className="flex items-center gap-1.5 shrink-0 w-[54px] justify-center">
                              {selectedColumns.includes("ignition") && (
                                <span title={"Ignition: " + (v.ignition !== false ? "ON" : "OFF")}>
                                  <Key
                                    className={cn(
                                      "h-3.5 w-3.5 stroke-[2.2]",
                                      v.speed > 0 || (v.ignition !== false && v.status !== "stopped")
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

                          {/* Col 4: Driver Name (Single Clean Line) */}
                          {(selectedColumns.includes("driver") ||
                            selectedColumns.includes("driver_mobile")) && (
                            <div
                              className="shrink-0 truncate w-[130px] flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300"
                              title={v.driver || "No Driver"}
                            >
                              <User className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 stroke-[2] shrink-0" />
                              <span className="truncate">{v.driver || "—"}</span>
                            </div>
                          )}

                          {/* Col 5: Address / Location Column */}
                          {selectedColumns.includes("address") && (
                            <div
                              className="flex-1 min-w-[140px] line-clamp-2 break-words leading-tight text-[11px] text-slate-600 dark:text-slate-400 pr-2"
                              title={v.address || v.branch}
                            >
                              {v.address || `At ${v.branch} Location`}
                            </div>
                          )}
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
  // RENDER: Jobs Tab Tree View (100% matched to media_1791552743382.png)
  // ==========================================
  if (activeTab === "jobs") {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar select-none bg-white dark:bg-slate-900 py-1 font-sans rounded-b-2xl">
        {jobData.map((group) => {
          const bKey = "job-branch-" + group.branch;
          const isBranchCollapsed = isCollapsed(bKey);

          const filteredSubgroups = (group.subgroups || [])
            .map((sub: any) => {
              const filteredJobs = (sub.jobs || []).filter((j: any) => {
                let matchesStatus = true;
                if (activeJobStatus === "running") matchesStatus = j.statusType === "running" || j.status.toLowerCase() === "running";
                else if (activeJobStatus === "completed") matchesStatus = j.statusType === "completed" || j.status.toLowerCase().includes("completed");
                else if (activeJobStatus === "upcoming") matchesStatus = j.statusType === "upcoming" || j.status.toLowerCase() === "upcoming";
                else if (activeJobStatus === "fail") matchesStatus = j.statusType === "fail" || j.status.toLowerCase() === "failed" || j.status.toLowerCase() === "fail";

                const q = query.trim().toLowerCase();
                const matchesQuery =
                  q === "" ||
                  j.code.toLowerCase().includes(q) ||
                  j.title.toLowerCase().includes(q) ||
                  j.object.toLowerCase().includes(q) ||
                  (j.rep && j.rep.toLowerCase().includes(q));

                return matchesStatus && matchesQuery;
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
            <div key={group.branch} className="mb-1">
              {/* Company Level Header (e.g. HP Company [8]) */}
              <div
                onClick={() => toggleNode(bKey)}
                className="flex items-center justify-between px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer border-b border-slate-200 dark:border-slate-800"
              >
                <div className="flex items-center gap-1.5">
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-500 transition-transform duration-200",
                      isBranchCollapsed && "-rotate-90"
                    )}
                  />
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {group.branch}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-medium text-slate-500">
                  [{branchTotalCount}]
                </span>
              </div>

              {/* Subgroups & Jobs */}
              {!isBranchCollapsed &&
                filteredSubgroups.map((sub: any) => {
                  const subKey = "job-sub-" + group.branch + "-" + sub.name;
                  const isSubCollapsed = isCollapsed(subKey);

                  return (
                    <div key={sub.name}>
                      {/* Branch Level Header (e.g. HP Branch 1 [8]) */}
                      <div
                        onClick={() => toggleNode(subKey)}
                        className="flex items-center justify-between px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer border-b border-slate-200 dark:border-slate-800"
                      >
                        <div className="flex items-center gap-1.5">
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 text-slate-500 transition-transform duration-200",
                              isSubCollapsed && "-rotate-90"
                            )}
                          />
                          <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                            {sub.name}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-medium text-slate-500">
                          [{sub.jobs.length}]
                        </span>
                      </div>

                      {/* Job Cards with Hierarchy Connector */}
                      {!isSubCollapsed && (
                        <div className="flex flex-col">
                          {sub.jobs.map((job: any) => {
                            const matchedVehicle =
                              vehicles.find(
                                (v) =>
                                  v.name.toLowerCase() === job.object.toLowerCase() ||
                                  v.name.toLowerCase().includes(job.object.toLowerCase()) ||
                                  job.object.toLowerCase().includes(v.name.toLowerCase())
                              ) || vehicles[0];

                            const isJobSelected =
                              selectedJobIdState === job.id && selectedEntityType === "job";
                            const isVehicleSelected =
                              (selectedJobIdState === job.id && selectedEntityType === "vehicle") ||
                              (selectedVehicleId === matchedVehicle?.id && selectedEntityType === "vehicle");

                            const handleJobClick = (e: React.MouseEvent) => {
                              e.stopPropagation();
                              setSelectedJobIdState(job.id);
                              setSelectedEntityType("job");
                              if (onOpenTelemetry && matchedVehicle) {
                                onOpenTelemetry(matchedVehicle, false, {
                                  id: job.id,
                                  code: job.code,
                                  title: job.title,
                                  status: job.status,
                                  shipmentNo: `SHP-${job.code ? job.code.replace("#", "") : ""}-A`,
                                  invoiceNo: "INV-99201",
                                  consigneeNo: "CNS-10482",
                                  quantity: `${job.quantity || 120} Units`,
                                  product: "Test SCM Material",
                                  isObjectHalt: false,
                                });
                              }
                            };

                            const handleVehicleClick = (e: React.MouseEvent) => {
                              e.stopPropagation();
                              setSelectedJobIdState(job.id);
                              setSelectedEntityType("vehicle");
                              setSelectedVehicleObjId(matchedVehicle?.id || "");
                              if (onSelectJob) {
                                onSelectJob({
                                  id: job.id,
                                  code: job.code,
                                  title: job.title,
                                  object: job.object,
                                  status: job.status,
                                  vehicleId: matchedVehicle?.id,
                                  ...job,
                                });
                              }
                              if (onOpenTelemetry && matchedVehicle) {
                                onOpenTelemetry(matchedVehicle, false, {
                                  id: job.id,
                                  code: job.code,
                                  title: job.title || "TEST SCM",
                                  object: job.object,
                                  isObjectHalt: true,
                                  qrCode: "QR-8849201",
                                  itemQuantity: `${job.quantity || 120} Pcs`,
                                  weight: job.weight ? `${job.weight} Ton` : "2.4 Ton",
                                  load: job.load || "92% Capacity",
                                  permissibleHalt: "02:00:00",
                                  actualHalt: "03:45:12",
                                  ...job,
                                });
                              }
                            };

                            return (
                              <div
                                key={job.id}
                                className="relative border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 select-none flex flex-col"
                              >
                                {/* ROW 1: THE JOB (Individual Click Area & Information) */}
                                <div
                                  onClick={handleJobClick}
                                  title="Click to view Job Details & Halt information"
                                  className={cn(
                                    "relative px-4 py-3 flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 cursor-pointer transition-colors",
                                    isJobSelected
                                      ? "bg-sky-50/70 dark:bg-sky-950/40"
                                      : "hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                                  )}
                                >
                                  {/* Left: # code title [status] */}
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <div className="w-[18px] flex justify-center shrink-0">
                                      <span className="font-mono text-xs font-semibold text-slate-400 dark:text-slate-500">
                                        #
                                      </span>
                                    </div>
                                    <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0">
                                      {job.code ? job.code.replace("#", "") : ""}
                                    </span>
                                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                                      {job.title}
                                    </span>
                                    <span
                                      className={cn(
                                        "text-[10px] font-semibold px-2 py-0.5 rounded-md leading-none shrink-0 border",
                                        job.status.toLowerCase().includes("completed")
                                          ? "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800"
                                          : job.statusType === "running" || job.status.toLowerCase() === "running"
                                          ? "bg-[#ECFDF5] text-[#10B981] border-[#A7F3D0] dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                                          : job.statusType === "fail" || job.status.toLowerCase() === "failed" || job.status.toLowerCase() === "fail"
                                          ? "bg-[#FEF2F2] text-[#EF4444] border-[#FECACA] dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                                          : "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A] dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                                      )}
                                    >
                                      {job.status}
                                    </span>
                                  </div>

                                  {/* Right: Assigned Rep (NO PILL) + Vertical Separator + Route, Attach, Share */}
                                  <div className="flex items-center gap-2 shrink-0">
                                    <div
                                      className={cn(
                                        "flex items-center gap-1 shrink-0 text-xs",
                                        job.statusType === "fail" || job.status.toLowerCase() === "failed" || job.status.toLowerCase() === "fail"
                                          ? "text-[#EF4444]"
                                          : "text-[#10B981]"
                                      )}
                                      title="Assigned Representative"
                                    >
                                      <UserCheck className="h-4 w-4 stroke-[2] shrink-0" />
                                      <span className="text-slate-800 dark:text-slate-200 font-bold font-mono text-xs">
                                        {job.representatives?.length || job.repCount || 1}
                                      </span>
                                    </div>

                                    <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-0.5" />

                                    <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                                      <button
                                        type="button"
                                        title="Job Route & Configuration"
                                        onClick={(e) => e.stopPropagation()}
                                        className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                                      >
                                        <Route className="h-4 w-4 stroke-[1.8]" />
                                      </button>
                                      <button
                                        type="button"
                                        title="Download Attachment Document"
                                        onClick={(e) => e.stopPropagation()}
                                        className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                                      >
                                        <Paperclip className="h-4 w-4 stroke-[1.8]" />
                                      </button>
                                      <button
                                        type="button"
                                        title="Share Job"
                                        onClick={(e) => e.stopPropagation()}
                                        className="hover:text-[#0089FF] dark:hover:text-[#0089FF] transition-colors cursor-pointer"
                                      >
                                        <Share2 className="h-4 w-4 stroke-[1.8]" />
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* ROW 2: THE VEHICLE / OBJECT (Individual Click Area & Information) */}
                                <div
                                  onClick={handleVehicleClick}
                                  title={`Click to view object checkpoints and halt details for ${job.object}`}
                                  className={cn(
                                    "relative px-4 py-3 flex items-center justify-between gap-2 cursor-pointer transition-colors",
                                    isVehicleSelected
                                      ? "bg-sky-50/70 dark:bg-sky-950/40"
                                      : "hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                                  )}
                                >
                                  {/* Left: Tree Connector + Green Dot + Object Name + State Badge */}
                                  <div className="flex items-center min-w-0 flex-1">
                                    <div className="relative w-[34px] h-[16px] flex items-center shrink-0">
                                      {/* Integrated SVG hierarchy connector: drops under '#' and turns seamlessly into green dot with 0 gap */}
                                      <svg
                                        className="absolute -top-[25px] left-0 w-[34px] h-[41px] pointer-events-none overflow-visible"
                                        viewBox="0 0 34 41"
                                        fill="none"
                                      >
                                        <path
                                          d="M 9,0 L 9,25 Q 9,33 17,33 L 24,33"
                                          stroke="#BDC5CF"
                                          strokeWidth="1"
                                          fill="none"
                                        />
                                        {/* Green Dot Outer Soft Halo */}
                                        <circle cx="28.5" cy="33" r="5" fill="#10B981" fillOpacity="0.2" />
                                        {/* Green Dot Solid Center */}
                                        <circle cx="28.5" cy="33" r="3.2" fill="#10B981" />
                                      </svg>
                                    </div>

                                    {/* Object information starts immediately where the line and dot end */}
                                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate ml-1.5">
                                      {job.object}
                                    </span>
                                    <span
                                      className={cn(
                                        "text-[10px] font-semibold px-2 py-0.5 rounded-md leading-none shrink-0 border ml-2",
                                        job.objectState === "Loaded"
                                          ? "text-[#059669] bg-[#ECFDF5] border-[#D1FAE5] dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60"
                                          : job.objectState === "In Transit" || job.objectState === "transit"
                                          ? "text-[#2563EB] bg-[#EFF6FF] border-[#DBEAFE] dark:bg-sky-950/60 dark:text-sky-400 dark:border-sky-800/60"
                                          : "text-[#B45309] bg-[#FFFBEB] border-[#FDE68A] dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/60"
                                      )}
                                    >
                                      {job.objectState || "Unloaded"}
                                    </span>
                                  </div>

                                  {/* Right: Quantity, Weight, Violation, Convoy (NO PILL CONTAINER) */}
                                  <div className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-slate-300 shrink-0">
                                    <div className="flex items-center gap-1" title="Quantity">
                                      <Box className="h-3.5 w-3.5 text-slate-500 stroke-[1.8]" />
                                      <span className="font-semibold text-slate-800 dark:text-slate-200">{job.quantity || 0}</span>
                                    </div>
                                    <div className="h-3 w-[1px] bg-slate-200 dark:bg-slate-700 mx-0.5" />
                                    <div className="flex items-center gap-1" title="Weight">
                                      <Weight className="h-3.5 w-3.5 text-slate-500 stroke-[1.8]" />
                                      <span className="font-semibold text-slate-800 dark:text-slate-200">{job.weight || 0}</span>
                                    </div>
                                    <div className="h-3 w-[1px] bg-slate-200 dark:bg-slate-700 mx-0.5" />
                                    <div className="flex items-center gap-1" title="Violations & Alerts">
                                      <ShieldAlert
                                        className="h-3.5 w-3.5 stroke-[1.8] text-rose-500"
                                      />
                                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                                        {job.violation || 0}
                                      </span>
                                    </div>
                                    <div className="h-3 w-[1px] bg-slate-200 dark:bg-slate-700 mx-0.5" />
                                    <div className="flex items-center gap-1" title="Convoy Group">
                                      <Caravan className="h-3.5 w-3.5 text-slate-500 stroke-[1.8]" />
                                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                                        {job.convoy || "--"}
                                      </span>
                                    </div>
                                  </div>
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
          );
        })}
      </div>
    );
  }

  // ==========================================
  // RENDER: Driver Tab Tree View (100% matched to media_1791552755188.png)
  // ==========================================
  if (activeTab === "driver") {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar select-none bg-white dark:bg-slate-900 py-1 font-sans rounded-b-2xl">
        {driverData.map((group) => {
          const bKey = "drv-branch-" + group.branch;
          const isBranchCollapsed = isCollapsed(bKey);

          const filteredSubgroups = (group.subgroups || [])
            .map((sub: any) => {
              const filteredDrivers = (sub.drivers || []).filter((drv: any) => {
                let matchesStatus = true;
                if (activeDriverStatus === "available") matchesStatus = drv.driverStatus === "Available";
                else if (activeDriverStatus === "not_available") matchesStatus = drv.driverStatus === "Not available" || drv.driverStatus === "Not Avail";
                else if (activeDriverStatus === "on_leave") matchesStatus = drv.driverStatus === "On Leave";
                else if (activeDriverStatus === "allocated") matchesStatus = drv.allocated;
                else if (activeDriverStatus === "not_allocated") matchesStatus = !drv.allocated;

                const q = query.trim().toLowerCase();
                const matchesQuery =
                  q === "" ||
                  drv.name.toLowerCase().includes(q) ||
                  (drv.vehicle && drv.vehicle.toLowerCase().includes(q)) ||
                  group.branch.toLowerCase().includes(q) ||
                  sub.name.toLowerCase().includes(q);

                return matchesStatus && matchesQuery;
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
            <div key={group.branch} className="mb-1">
              {/* Company Level Header (e.g. Surya Travels Company [5]) */}
              <div
                onClick={() => toggleNode(bKey)}
                className="flex items-center justify-between px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer border-b border-slate-100 dark:border-slate-800/60"
              >
                <div className="flex items-center gap-1.5">
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-500 transition-transform duration-200",
                      isBranchCollapsed && "-rotate-90"
                    )}
                  />
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {group.branch}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-medium text-slate-500">
                  [{branchTotalCount}]
                </span>
              </div>

              {/* Subgroups & Drivers */}
              {!isBranchCollapsed &&
                filteredSubgroups.map((sub: any) => {
                  const subKey = "drv-sub-" + group.branch + "-" + sub.name;
                  const isSubCollapsed = isCollapsed(subKey);

                  return (
                    <div key={sub.name}>
                      {/* Branch Level Header (e.g. Surya Branch 1 [5]) */}
                      <div
                        onClick={() => toggleNode(subKey)}
                        className="flex items-center justify-between px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer border-b border-slate-100 dark:border-slate-800/60"
                      >
                        <div className="flex items-center gap-1.5">
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 text-slate-500 transition-transform duration-200",
                              isSubCollapsed && "-rotate-90"
                            )}
                          />
                          <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                            {sub.name}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-medium text-slate-500">
                          [{sub.drivers.length}]
                        </span>
                      </div>

                      {/* Driver rows with vertical guide trunk and elbows */}
                      {!isSubCollapsed && (
                        <div className="relative">
                          {sub.drivers.map((drv: any, idx: number) => {
                            const isLast = idx === sub.drivers.length - 1;
                            const isAllocated = Boolean(
                              drv.allocated &&
                              drv.vehicle &&
                              drv.vehicle !== "Unassigned" &&
                              drv.vehicle !== "Unallocated"
                            );

                            // Color matching reference image (media_1792497531775_9b2353f4.png) 1:1
                            let dotColor = "#008446";
                            let nameColor = "text-[#008446] dark:text-emerald-400";

                            if (drv.driverStatus === "On Leave") {
                              dotColor = "#372AAC";
                              nameColor = "text-[#372AAC] dark:text-purple-400";
                            } else if (
                              drv.driverStatus === "Not available" ||
                              drv.driverStatus === "Not Avail" ||
                              !isAllocated
                            ) {
                              dotColor = "#C46F37";
                              nameColor = "text-[#C46F37] dark:text-amber-500";
                            } else {
                              dotColor = "#008446";
                              nameColor = "text-[#008446] dark:text-emerald-400";
                            }

                            return (
                              <div
                                key={drv.id}
                                onClick={() => {
                                  if (onSelectDriver) onSelectDriver(drv);
                                  if (onOpenTelemetry) {
                                    const matched = vehicles.find(
                                      (v) =>
                                        v.plateNumber?.toLowerCase() === drv.vehicle?.toLowerCase() ||
                                        v.name?.toLowerCase() === drv.vehicle?.toLowerCase() ||
                                        (drv.name && v.driver?.toLowerCase().includes(drv.name.toLowerCase()))
                                    ) || vehicles[0];
                                    if (matched) onOpenTelemetry(matched);
                                  }
                                }}
                                className="relative flex items-center justify-between pl-[36px] pr-3 h-9 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer select-none"
                              >
                                {/* Tree guide line: trunk & branch */}
                                {!isLast ? (
                                  <>
                                    <div className="absolute left-[19px] top-0 bottom-0 w-px bg-slate-300 dark:bg-slate-700 pointer-events-none" />
                                    <div className="absolute left-[19px] top-1/2 -translate-y-1/2 w-[15px] h-px bg-slate-300 dark:bg-slate-700 pointer-events-none" />
                                  </>
                                ) : (
                                  <div className="absolute left-[19px] top-0 h-1/2 w-[15px] border-l border-b border-slate-300 dark:border-slate-700 rounded-bl-[4px] pointer-events-none" />
                                )}

                                {/* Col 1: Status Dot + Driver Name + Vehicle Registration */}
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <span
                                    className="h-2 w-2 rounded-full shrink-0"
                                    style={{ backgroundColor: dotColor }}
                                  />
                                  <span className={cn("font-bold text-xs truncate", nameColor)}>
                                    {drv.name}
                                  </span>
                                  <span
                                    className={cn(
                                      "shrink-0",
                                      isAllocated
                                        ? "font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase"
                                        : "text-[11px] font-sans font-normal text-slate-400 dark:text-slate-500"
                                    )}
                                  >
                                    {drv.vehicle || "Unassigned"}
                                  </span>
                                </div>

                                {/* Right Side Columns */}
                                <div className="flex items-center gap-3 shrink-0">
                                  {/* Col 2: Allocated Status */}
                                  <span className="w-[100px] text-xs text-slate-700 dark:text-slate-300 font-normal">
                                    {isAllocated ? "Allocated Via" : "Not Allocated"}
                                  </span>

                                  {/* Col 3: Default */}
                                  <span className="w-[60px] text-xs text-slate-700 dark:text-slate-300 font-normal">
                                    Default
                                  </span>

                                  {/* Col 4: Action More menu with Popover */}
                                  <div className="w-[24px] flex justify-end shrink-0 relative">
                                    <Popover
                                      open={openDriverMenuId === drv.id}
                                      onOpenChange={(open) => {
                                        if (!open) {
                                          setOpenDriverMenuId(null);
                                          setOpenStatusSubmenuId(null);
                                        } else {
                                          setOpenDriverMenuId(drv.id);
                                        }
                                      }}
                                    >
                                      <PopoverTrigger asChild>
                                        <button
                                          type="button"
                                          onClick={(e) => e.stopPropagation()}
                                          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                        >
                                          <MoreVertical className="h-3.5 w-3.5" />
                                        </button>
                                      </PopoverTrigger>
                                      <PopoverContent
                                        align="end"
                                        sideOffset={4}
                                        className="w-40 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl text-xs z-50 select-none"
                                      >
                                        {/* Allocate Option */}
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenDriverMenuId(null);
                                            toast.success(`Allocating ${drv.name}...`, {
                                              description: `Vehicle: ${drv.vehicle}`,
                                            });
                                          }}
                                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-[#0089FF] font-medium transition-colors cursor-pointer"
                                        >
                                          <span>Allocate</span>
                                        </button>

                                        {/* Change Status Option with Submenu */}
                                        <div className="relative">
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setOpenStatusSubmenuId(
                                                openStatusSubmenuId === drv.id ? null : drv.id
                                              );
                                            }}
                                            onMouseEnter={() => setOpenStatusSubmenuId(drv.id)}
                                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-[#0089FF] font-medium transition-colors cursor-pointer"
                                          >
                                            <span>Change Status</span>
                                            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                                          </button>

                                          {/* Submenu Popover Flyout */}
                                          {openStatusSubmenuId === drv.id && (
                                            <div className="absolute left-full top-0 ml-1 w-36 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl text-xs z-50 space-y-0.5">
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  if (onUpdateDriverStatus) onUpdateDriverStatus(drv.id, "Available");
                                                  setOpenDriverMenuId(null);
                                                  setOpenStatusSubmenuId(null);
                                                  toast.success(`${drv.name} status updated to Available`);
                                                }}
                                                className={cn(
                                                  "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-[#0089FF] font-medium transition-colors cursor-pointer",
                                                  drv.driverStatus === "Available" && "bg-sky-50 dark:bg-slate-800 text-[#0089FF] font-bold"
                                                )}
                                              >
                                                <span className="h-2 w-2 rounded-full bg-[#0089FF] shrink-0" />
                                                <span>Available</span>
                                              </button>

                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  if (onUpdateDriverStatus) onUpdateDriverStatus(drv.id, "Not available");
                                                  setOpenDriverMenuId(null);
                                                  setOpenStatusSubmenuId(null);
                                                  toast.success(`${drv.name} status updated to Not available`);
                                                }}
                                                className={cn(
                                                  "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-800 hover:text-amber-600 font-medium transition-colors cursor-pointer",
                                                  (drv.driverStatus === "Not available" || drv.driverStatus === "Not Avail") &&
                                                    "bg-amber-50 dark:bg-slate-800 text-amber-600 font-bold"
                                                )}
                                              >
                                                <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                                                <span>Not available</span>
                                              </button>

                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  if (onUpdateDriverStatus) onUpdateDriverStatus(drv.id, "On Leave");
                                                  setOpenDriverMenuId(null);
                                                  setOpenStatusSubmenuId(null);
                                                  toast.success(`${drv.name} status updated to On Leave`);
                                                }}
                                                className={cn(
                                                  "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-800 hover:text-purple-600 font-medium transition-colors cursor-pointer",
                                                  drv.driverStatus === "On Leave" && "bg-purple-50 dark:bg-slate-800 text-purple-600 font-bold"
                                                )}
                                              >
                                                <span className="h-2 w-2 rounded-full bg-purple-600 shrink-0" />
                                                <span>On Leave</span>
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
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
          );
        })}
      </div>
    );
  }

  // ==========================================
  // RENDER: Address Tab Tree View (100% matched to media_1792499205461_690f6679.png)
  // ==========================================
  if (activeTab === "address") {
    const toggleGroupAddressCheck = (groupName: string, checked: boolean) => {
      if (onUpdateAddressData) {
        onUpdateAddressData((prev: any[]) =>
          prev.map((g) =>
            g.group === groupName
              ? {
                  ...g,
                  checked,
                  subgroups: (g.subgroups || []).map((sub: any) => ({
                    ...sub,
                    checked,
                    addresses: (sub.addresses || []).map((a: any) => ({ ...a, checked })),
                  })),
                }
              : g
          )
        );
      }
    };

    const toggleSubgroupAddressCheck = (groupName: string, subName: string, checked: boolean) => {
      if (onUpdateAddressData) {
        onUpdateAddressData((prev: any[]) =>
          prev.map((g) =>
            g.group === groupName
              ? {
                  ...g,
                  subgroups: (g.subgroups || []).map((sub: any) =>
                    sub.name === subName
                      ? {
                          ...sub,
                          checked,
                          addresses: (sub.addresses || []).map((a: any) => ({ ...a, checked })),
                        }
                      : sub
                  ),
                }
              : g
          )
        );
      }
    };

    const toggleSingleAddressCheck = (
      groupName: string,
      subName: string,
      addrId: string,
      checked: boolean
    ) => {
      if (onUpdateAddressData) {
        onUpdateAddressData((prev: any[]) =>
          prev.map((g) =>
            g.group === groupName
              ? {
                  ...g,
                  subgroups: (g.subgroups || []).map((sub: any) =>
                    sub.name === subName
                      ? {
                          ...sub,
                          addresses: (sub.addresses || []).map((a: any) =>
                            a.id === addrId ? { ...a, checked } : a
                          ),
                        }
                      : sub
                  ),
                }
              : g
          )
        );
      }
    };

    return (
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar select-none bg-white dark:bg-slate-900 py-1 font-sans rounded-b-2xl">
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
                  (addr.category && addr.category.toLowerCase().includes(q)) ||
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
            <div key={group.group} className="mb-1">
              {/* Company Level Header (e.g. Ha Company [21]) */}
              <div
                onClick={() => toggleNode(gKey)}
                className="flex items-center justify-between px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer border-b border-slate-100 dark:border-slate-800/60"
              >
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={Boolean(group.checked)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleGroupAddressCheck(group.group, e.target.checked);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-600 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                  />
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-500 transition-transform duration-200",
                      isGroupCollapsed && "-rotate-90"
                    )}
                  />
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {group.group}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-medium text-slate-500">
                    [{groupTotalCount}]
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-400 transition-transform duration-200",
                      !isGroupCollapsed && "rotate-180"
                    )}
                  />
                </div>
              </div>

              {/* Subgroups (e.g. HS - Bank) with child items and tree connectors */}
              {!isGroupCollapsed &&
                filteredSubgroups.map((sub: any) => {
                  const subKey = "addr-sub-" + group.group + "-" + sub.name;
                  const isSubCollapsed = isCollapsed(subKey);

                  return (
                    <div key={sub.name}>
                      {/* Subgroup Header (e.g. checkbox + blue dot + HS - Bank + actions) */}
                      <div
                        onClick={() => toggleNode(subKey)}
                        className="flex items-center justify-between px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={Boolean(sub.checked)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleSubgroupAddressCheck(group.group, sub.name, e.target.checked);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-600 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                          />
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 text-slate-500 transition-transform duration-200",
                              isSubCollapsed && "-rotate-90"
                            )}
                          />
                          <span className="h-2 w-2 rounded-full bg-[#0089FF] shrink-0" />
                          <span className="font-bold text-xs text-[#0089FF]">
                            {sub.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info(`Showing ${sub.name} on map...`);
                            }}
                            className="p-0.5 hover:text-[#0089FF] transition-colors cursor-pointer"
                          >
                            <MapPin className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info(`Editing ${sub.name}...`);
                            }}
                            className="p-0.5 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.success(`${sub.name} removed`);
                            }}
                            className="p-0.5 hover:text-rose-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Address Items with Tree Connector Lines */}
                      {!isSubCollapsed && (
                        <div className="relative">
                          {sub.addresses.map((addr: any, idx: number) => {
                            const isLast = idx === sub.addresses.length - 1;

                            return (
                              <div
                                key={addr.id}
                                onClick={() => onSelectAddress && onSelectAddress(addr)}
                                className="relative flex items-center justify-between pl-[55px] pr-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer select-none"
                              >
                                {/* Tree guide line: vertical trunk & horizontal elbow directly below expand/collapse icon */}
                                {!isLast ? (
                                  <>
                                    <div className="absolute left-[39px] top-0 bottom-0 w-px bg-slate-300 dark:bg-slate-700 pointer-events-none" />
                                    <div className="absolute left-[39px] top-1/2 -translate-y-1/2 w-[16px] h-px bg-slate-300 dark:bg-slate-700 pointer-events-none" />
                                  </>
                                ) : (
                                  <div className="absolute left-[39px] top-0 h-1/2 w-[16px] border-l border-b border-slate-300 dark:border-slate-700 rounded-bl-[4px] pointer-events-none" />
                                )}

                                {/* Left: Checkbox + Status Dot + Address Name */}
                                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                  <input
                                    type="checkbox"
                                    checked={Boolean(addr.checked)}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      toggleSingleAddressCheck(
                                        group.group,
                                        sub.name,
                                        addr.id,
                                        e.target.checked
                                      );
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-600 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                                  />
                                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                                  <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                                    {addr.name}
                                  </span>
                                </div>

                                {/* Right: Action Icons (MapPin, Pencil, Trash) */}
                                <div className="flex items-center gap-2 text-slate-400 shrink-0">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toast.info(`Locating ${addr.name}...`);
                                    }}
                                    className="p-0.5 hover:text-[#0089FF] transition-colors cursor-pointer"
                                  >
                                    <MapPin className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toast.info(`Editing ${addr.name}...`);
                                    }}
                                    className="p-0.5 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toast.success(`${addr.name} deleted`);
                                    }}
                                    className="p-0.5 hover:text-rose-500 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
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
          );
        })}
      </div>
    );
  }

  // ==========================================
  // RENDER: Geofence Tab Tree View (100% matched to media_1791552778582.png)
  // ==========================================
  if (activeTab === "geofence") {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar select-none bg-white dark:bg-slate-900 py-1 font-sans rounded-b-2xl">
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

          // Flatten geofences if single group or list directly under group as shown in media_1791552778582.png
          const allGeofences = filteredSubgroups.flatMap((s: any) => s.geofences);

          return (
            <div key={groupData.group} className="mb-1">
              {/* Company Level Header (e.g. Ha Company [21]) */}
              <div
                onClick={() => toggleNode(gKey)}
                className="flex items-center justify-between px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer border-b border-slate-100 dark:border-slate-800/60"
              >
                <div className="flex items-center gap-1.5">
                  <span className="h-3.5 w-3.5 rounded bg-[#0089FF] text-white flex items-center justify-center font-bold text-[10px] leading-none shrink-0">
                    -
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-500 transition-transform duration-200",
                      isGroupCollapsed && "-rotate-90"
                    )}
                  />
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {groupData.group}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-medium text-slate-500">
                  [{groupTotalCount}]
                </span>
              </div>

              {/* Geofence items under company with tree connector line directly below expand/collapse chevron */}
              {!isGroupCollapsed && (
                <div className="relative">
                  {allGeofences.map((gf: any, idx: number) => {
                    const isLast = idx === allGeofences.length - 1;
                    const isChecked = idx < 5; // Top 5 checked in reference image

                    return (
                      <div
                        key={gf.id}
                        onClick={() => onSelectGeofence && onSelectGeofence(gf)}
                        className="relative flex items-center justify-between pl-[55px] pr-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer select-none"
                      >
                        {/* Tree guide line: vertical trunk & horizontal elbow directly below expand/collapse icon */}
                        {!isLast ? (
                          <>
                            <div className="absolute left-[39px] top-0 bottom-0 w-px bg-slate-300 dark:bg-slate-700 pointer-events-none" />
                            <div className="absolute left-[39px] top-1/2 -translate-y-1/2 w-[16px] h-px bg-slate-300 dark:bg-slate-700 pointer-events-none" />
                          </>
                        ) : (
                          <div className="absolute left-[39px] top-0 h-1/2 w-[16px] border-l border-b border-slate-300 dark:border-slate-700 rounded-bl-[4px] pointer-events-none" />
                        )}

                        {/* Left: Checkbox + Status Dot / Ring + Name */}
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => {}}
                            className="h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-600 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                          />
                          {isChecked ? (
                            <span className="h-2 w-2 rounded-full bg-[#0089FF] shrink-0" />
                          ) : (
                            <span className="h-2 w-2 rounded-full border border-slate-400 bg-transparent shrink-0" />
                          )}
                          <span
                            className={cn(
                              "text-xs truncate",
                              isChecked
                                ? "font-bold text-[#0089FF]"
                                : "font-medium text-slate-800 dark:text-slate-200"
                            )}
                          >
                            {gf.name}
                          </span>
                        </div>

                        {/* Right: Actions (MapPin, Pencil, Trash) */}
                        <div className="flex items-center gap-2 text-slate-400 shrink-0">
                          <button
                            type="button"
                            className="p-0.5 hover:text-[#0089FF] transition-colors"
                          >
                            <MapPin className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            className="p-0.5 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            className="p-0.5 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
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
    );
  }

  // ==========================================
  // RENDER: Trailer Tab Tree View (1:1 with media_1792553915747_5000603d.png)
  // ==========================================
  if (activeTab === "trailer") {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar select-none bg-white dark:bg-slate-900 py-0.5 font-sans divide-y divide-slate-100 dark:divide-slate-800/40 rounded-b-2xl">
        {trailerData.map((groupItem) => {
          const gKey = "tr-group-" + groupItem.group;
          const isGroupCollapsed = isCollapsed(gKey);

          const filteredSubgroups = (groupItem.subgroups || [])
            .map((sub: any) => ({
              ...sub,
              trailers: (sub.trailers || []).filter((tr: any) => {
                const q = query.trim().toLowerCase();
                const matchesQuery =
                  q === "" ||
                  tr.name.toLowerCase().includes(q) ||
                  tr.code.toLowerCase().includes(q) ||
                  (tr.vehicle && tr.vehicle.toLowerCase().includes(q)) ||
                  groupItem.group.toLowerCase().includes(q) ||
                  sub.name.toLowerCase().includes(q);

                const matchesStatus =
                  activeTrailerStatus === "all"
                    ? true
                    : activeTrailerStatus === "attached"
                    ? tr.isAttached
                    : !tr.isAttached;

                return matchesQuery && matchesStatus;
              }),
            }))
            .filter((sub: any) => sub.trailers.length > 0 || (query === "" && activeTrailerStatus === "all"));

          const groupTotalCount = filteredSubgroups.reduce(
            (acc: number, sub: any) => acc + sub.trailers.length,
            0
          );

          if ((query !== "" || activeTrailerStatus !== "all") && groupTotalCount === 0) return null;

          return (
            <div key={groupItem.group} className="bg-white dark:bg-slate-900">
              {/* 1. Company / Top Group Header Row */}
              <div
                onClick={() => toggleNode(gKey)}
                className="flex items-center justify-between px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-500 transition-transform duration-200 shrink-0",
                      isGroupCollapsed && "-rotate-90"
                    )}
                  />
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                    {groupItem.group}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-medium text-slate-500 shrink-0">
                  [{groupTotalCount}]
                </span>
              </div>

              {/* 2. Subgroups & Trailers */}
              {!isGroupCollapsed &&
                filteredSubgroups.map((sub: any) => {
                  const subKey = "tr-sub-" + groupItem.group + "-" + sub.name;
                  const isSubCollapsed = isCollapsed(subKey);

                  return (
                    <div key={sub.name}>
                      {/* Subgroup Header (e.g. Branch) - Flush directly under company header with zero extra indentation */}
                      <div
                        onClick={() => toggleNode(subKey)}
                        className="flex items-center justify-between px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 text-slate-500 transition-transform duration-200 shrink-0",
                              isSubCollapsed && "-rotate-90"
                            )}
                          />
                          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                            {sub.name}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-medium text-slate-500 shrink-0">
                          [{sub.trailers.length}]
                        </span>
                      </div>

                      {/* Tree Branch with 4-Column Aligned Items */}
                      {!isSubCollapsed && (
                        <div className="relative">
                          {sub.trailers.map((tr: any, idx: number) => {
                            const isLast = idx === sub.trailers.length - 1;

                            return (
                              <div
                                key={tr.id}
                                onClick={() => onSelectTrailer && onSelectTrailer(tr)}
                                className="relative flex items-center pl-[36px] pr-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer select-none group"
                              >
                                {/* Tree guide line: vertical trunk & horizontal elbow directly below Branch chevron */}
                                {!isLast ? (
                                  <>
                                    <div className="absolute left-[19px] top-0 bottom-0 w-px bg-slate-300 dark:bg-slate-700 pointer-events-none" />
                                    <div className="absolute left-[19px] top-1/2 -translate-y-1/2 w-[14px] h-px bg-slate-300 dark:bg-slate-700 pointer-events-none" />
                                  </>
                                ) : (
                                  <div className="absolute left-[19px] top-0 h-1/2 w-[14px] border-l border-b border-slate-300 dark:border-slate-700 rounded-bl-[4px] pointer-events-none" />
                                )}

                                {/* Col 1: Trailer Name */}
                                <div className="flex-1 min-w-0 pr-2">
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (onEditTrailer) onEditTrailer(tr, groupItem.group, sub.name);
                                    }}
                                    className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate hover:text-[#0089FF] cursor-pointer"
                                    title="Edit Trailer Details"
                                  >
                                    {tr.name}
                                  </div>
                                </div>

                                {/* Col 2: Vehicle */}
                                <div className="w-32 text-left pr-2 truncate">
                                  {tr.vehicle && tr.vehicle !== "Unassigned" ? (
                                    <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-800 dark:text-slate-200">
                                      <span className="h-2 w-2 rounded-full shrink-0 bg-[#008446] ring-2 ring-[#008446]/20" />
                                      <span className="truncate">{tr.vehicle}</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
                                      <span className="h-2 w-2 rounded-full shrink-0 bg-slate-300 dark:bg-slate-600 ring-2 ring-slate-300/30" />
                                      <span className="italic text-slate-400">Unassigned</span>
                                    </div>
                                  )}
                                </div>

                                {/* Col 3: Code */}
                                <div className="w-24 text-left font-mono text-xs text-slate-500 dark:text-slate-400 truncate">
                                  {tr.code}
                                </div>

                                {/* Col 4: Action Buttons (Link & Edit) */}
                                <div className="w-16 flex items-center justify-end gap-1.5 text-slate-400 pr-1">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (onAllocateVehicle) onAllocateVehicle(tr, groupItem.group, sub.name);
                                    }}
                                    className="p-1 hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                                    title="Allocate / Change Vehicle Object"
                                  >
                                    <Link2 className="h-3.5 w-3.5 stroke-[2]" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (onEditTrailer) onEditTrailer(tr, groupItem.group, sub.name);
                                    }}
                                    className="p-1 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                                    title="Edit Trailer Details"
                                  >
                                    <Edit3 className="h-3.5 w-3.5 stroke-[2]" />
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
          );
        })}
      </div>
    );
  }

  // ==========================================
  // RENDER: Beacon Tab Tree View (1:1 with media_1792555852256_8fbefc9d.png)
  // ==========================================
  if (activeTab === "beacon") {
    const toggleSingleBeaconCheck = (groupName: string, subName: string, beaconId: string, checked: boolean) => {
      if (onUpdateBeaconData) {
        onUpdateBeaconData((prev: any[]) =>
          prev.map((g) => {
            if (g.group === groupName) {
              return {
                ...g,
                subgroups: g.subgroups.map((sub: any) => {
                  if (sub.name === subName) {
                    return {
                      ...sub,
                      beacons: sub.beacons.map((b: any) => (b.id === beaconId ? { ...b, checked } : b)),
                    };
                  }
                  return sub;
                }),
              };
            }
            return g;
          })
        );
      }
    };

    const toggleSubgroupCheck = (groupName: string, subName: string, checked: boolean) => {
      if (onUpdateBeaconData) {
        onUpdateBeaconData((prev: any[]) =>
          prev.map((g) => {
            if (g.group === groupName) {
              return {
                ...g,
                subgroups: g.subgroups.map((sub: any) => {
                  if (sub.name === subName) {
                    return {
                      ...sub,
                      beacons: sub.beacons.map((b: any) => ({ ...b, checked })),
                    };
                  }
                  return sub;
                }),
              };
            }
            return g;
          })
        );
      }
    };

    const toggleGroupCheck = (groupName: string, checked: boolean) => {
      if (onUpdateBeaconData) {
        onUpdateBeaconData((prev: any[]) =>
          prev.map((g) => {
            if (g.group === groupName) {
              return {
                ...g,
                subgroups: g.subgroups.map((sub: any) => ({
                  ...sub,
                  beacons: sub.beacons.map((b: any) => ({ ...b, checked })),
                })),
              };
            }
            return g;
          })
        );
      }
    };

    return (
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar select-none bg-white dark:bg-slate-900 py-0.5 font-sans divide-y divide-slate-100 dark:divide-slate-800/40 rounded-b-2xl">
        {beaconData.map((groupItem) => {
          const gKey = "bcn-group-" + groupItem.group;
          const isGroupCollapsed = isCollapsed(gKey);

          const filteredSubgroups = (groupItem.subgroups || [])
            .map((subGroup: any) => ({
              ...subGroup,
              beacons: (subGroup.beacons || []).filter((b: any) => {
                const q = query.trim().toLowerCase();
                const matchesQuery =
                  q === "" ||
                  b.name.toLowerCase().includes(q) ||
                  b.object.toLowerCase().includes(q) ||
                  (b.location && b.location.toLowerCase().includes(q)) ||
                  groupItem.group.toLowerCase().includes(q) ||
                  subGroup.name.toLowerCase().includes(q);

                const matchesStatus =
                  activeBeaconStatus === "all" ||
                  (activeBeaconStatus === "connected" && b.isConnected) ||
                  (activeBeaconStatus === "disconnected" && !b.isConnected);

                return matchesQuery && matchesStatus;
              }),
            }))
            .filter((subGroup: any) => subGroup.beacons.length > 0 || (query === "" && activeBeaconStatus === "all"));

          const groupTotalCount = filteredSubgroups.reduce(
            (acc: number, sub: any) => acc + sub.beacons.length,
            0
          );

          if ((query !== "" || activeBeaconStatus !== "all") && groupTotalCount === 0) return null;

          const allBeaconsInGroup = (groupItem.subgroups || []).flatMap((s: any) => s.beacons || []);
          const isGroupAllChecked = allBeaconsInGroup.length > 0 && allBeaconsInGroup.every((b: any) => b.checked !== false);
          const isGroupSomeChecked = allBeaconsInGroup.some((b: any) => b.checked !== false) && !isGroupAllChecked;

          return (
            <div key={groupItem.group} className="bg-white dark:bg-slate-900">
              {/* 1. Company / Top Group Header Row */}
              <div
                onClick={() => toggleNode(gKey)}
                className="flex items-center justify-between px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <input
                    type="checkbox"
                    checked={isGroupAllChecked}
                    ref={(el) => {
                      if (el) el.indeterminate = isGroupSomeChecked;
                    }}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleGroupCheck(groupItem.group, e.target.checked);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-600 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                  />
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-500 transition-transform duration-200 shrink-0",
                      isGroupCollapsed && "-rotate-90"
                    )}
                  />
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                    {groupItem.group}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-medium text-slate-500 shrink-0">
                  [{groupTotalCount}]
                </span>
              </div>

              {/* 2. Subgroups & Beacon Rows */}
              {!isGroupCollapsed &&
                filteredSubgroups.map((subGroup: any) => {
                  const subKey = "bcn-sub-" + groupItem.group + "-" + subGroup.name;
                  const isSubCollapsed = isCollapsed(subKey);

                  const isSubAllChecked = subGroup.beacons.length > 0 && subGroup.beacons.every((b: any) => b.checked !== false);
                  const isSubSomeChecked = subGroup.beacons.some((b: any) => b.checked !== false) && !isSubAllChecked;

                  return (
                    <div key={subGroup.name}>
                      {/* Subgroup Header (e.g. HP Branch 1) - Flush directly under company header with zero extra indentation */}
                      <div
                        onClick={() => toggleNode(subKey)}
                        className="flex items-center justify-between px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSubAllChecked}
                            ref={(el) => {
                              if (el) el.indeterminate = isSubSomeChecked;
                            }}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleSubgroupCheck(groupItem.group, subGroup.name, e.target.checked);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-600 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                          />
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 text-slate-500 transition-transform duration-200 shrink-0",
                              isSubCollapsed && "-rotate-90"
                            )}
                          />
                          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                            {subGroup.name}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-medium text-slate-500 shrink-0">
                          [{subGroup.beacons.length}]
                        </span>
                      </div>

                      {/* Tree Branch with 5-Column Aligned Items */}
                      {!isSubCollapsed && (
                        <div className="relative">
                          {subGroup.beacons.map((bcn: any, idx: number) => {
                            const isLast = idx === subGroup.beacons.length - 1;

                            return (
                              <div
                                key={bcn.id}
                                onClick={() => onSelectBeacon && onSelectBeacon(bcn)}
                                className="relative flex items-center pl-[55px] pr-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer select-none group"
                              >
                                {/* Tree guide line: vertical trunk & horizontal elbow directly below Subgroup chevron */}
                                {!isLast ? (
                                  <>
                                    <div className="absolute left-[39px] top-0 bottom-0 w-px bg-slate-300 dark:bg-slate-700 pointer-events-none" />
                                    <div className="absolute left-[39px] top-1/2 -translate-y-1/2 w-[16px] h-px bg-slate-300 dark:bg-slate-700 pointer-events-none" />
                                  </>
                                ) : (
                                  <div className="absolute left-[39px] top-0 h-1/2 w-[16px] border-l border-b border-slate-300 dark:border-slate-700 rounded-bl-[4px] pointer-events-none" />
                                )}

                                {/* Col 1: Checkbox + Status Dot + Beacon Name & Timestamp */}
                                <div className="flex-1 min-w-0 pr-2 flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={bcn.checked !== false}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      toggleSingleBeaconCheck(groupItem.group, subGroup.name, bcn.id, e.target.checked);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-600 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                                  />
                                  <span
                                    className={cn(
                                      "h-2 w-2 rounded-full shrink-0",
                                      bcn.isConnected
                                        ? "bg-[#008446] ring-2 ring-[#008446]/20"
                                        : "bg-[#C70036] ring-2 ring-[#C70036]/20"
                                    )}
                                  />
                                  <div className="flex flex-col min-w-0 truncate">
                                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate leading-tight">
                                      {bcn.name}
                                    </span>
                                    <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 truncate leading-tight mt-0.5">
                                      {bcn.timestamp}
                                    </span>
                                  </div>
                                </div>

                                {/* Col 2: Object */}
                                <div className="w-28 text-left pr-2 truncate text-xs text-slate-700 dark:text-slate-300" title={bcn.object}>
                                  {bcn.object}
                                </div>

                                {/* Col 3: Location */}
                                <div className="w-36 text-left pr-2 truncate text-xs text-slate-600 dark:text-slate-400" title={bcn.location}>
                                  {bcn.location}
                                </div>

                                {/* Col 4: RSSI */}
                                <div className="w-14 text-right pr-2 truncate font-mono text-xs text-slate-600 dark:text-slate-400">
                                  {bcn.rssi}
                                </div>

                                {/* Col 5: Distance */}
                                <div className="w-16 text-right pr-3 truncate font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                                  {bcn.distance}
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
          );
        })}
      </div>
    );
  }

  // ==========================================
  // RENDER: Video Telematics Tab Tree View
  // ==========================================
  if (activeTab === "video_telematics") {
    const toggleGroupCheck = (groupName: string, checked: boolean) => {
      if (onUpdateVideoTelematicsData) {
        onUpdateVideoTelematicsData((prev: any[]) =>
          prev.map((g) => {
            if (g.group === groupName) {
              return {
                ...g,
                subgroups: (g.subgroups || []).map((sub: any) => ({
                  ...sub,
                  devices: (sub.devices || []).map((d: any) => ({ ...d, checked })),
                })),
              };
            }
            return g;
          })
        );
      }
    };

    const toggleSubgroupCheck = (groupName: string, subName: string, checked: boolean) => {
      if (onUpdateVideoTelematicsData) {
        onUpdateVideoTelematicsData((prev: any[]) =>
          prev.map((g) => {
            if (g.group === groupName) {
              return {
                ...g,
                subgroups: (g.subgroups || []).map((sub: any) => {
                  if (sub.name === subName) {
                    return {
                      ...sub,
                      devices: (sub.devices || []).map((d: any) => ({ ...d, checked })),
                    };
                  }
                  return sub;
                }),
              };
            }
            return g;
          })
        );
      }
    };

    const toggleSingleDeviceCheck = (groupName: string, subName: string, devId: string, checked: boolean) => {
      if (onUpdateVideoTelematicsData) {
        onUpdateVideoTelematicsData((prev: any[]) =>
          prev.map((g) => {
            if (g.group === groupName) {
              return {
                ...g,
                subgroups: (g.subgroups || []).map((sub: any) => {
                  if (sub.name === subName) {
                    return {
                      ...sub,
                      devices: (sub.devices || []).map((d: any) =>
                        d.id === devId ? { ...d, checked } : d
                      ),
                    };
                  }
                  return sub;
                }),
              };
            }
            return g;
          })
        );
      }
    };

    const getDeviceStatusDot = (status: string) => {
      switch (status) {
        case "running":
          return "bg-[#008446] ring-2 ring-[#008446]/20";
        case "idle":
          return "bg-[#C46F37] ring-2 ring-[#C46F37]/20";
        case "stopped":
          return "bg-[#C70036] ring-2 ring-[#C70036]/20";
        case "inactive":
          return "bg-[#372AAC] ring-2 ring-[#372AAC]/20";
        default:
          return "bg-slate-400 ring-2 ring-slate-400/20";
      }
    };

    return (
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar select-none bg-white dark:bg-slate-900 py-1 font-sans rounded-b-2xl">
        {videoTelematicsData.map((groupItem) => {
          const gKey = "vid-group-" + groupItem.group;
          const isGroupCollapsed = isCollapsed(gKey);

          const filteredSubgroups = (groupItem.subgroups || [])
            .map((subGroup: any) => ({
              ...subGroup,
              devices: (subGroup.devices || []).filter((d: any) => {
                const matchesStatus =
                  !activeVideoStatus || activeVideoStatus === "all" || d.status === activeVideoStatus;

                const q = query.trim().toLowerCase();
                const matchesQuery =
                  q === "" ||
                  d.name.toLowerCase().includes(q) ||
                  (d.channels && d.channels.some((c: any) => c.name.toLowerCase().includes(q)));

                return matchesStatus && matchesQuery;
              }),
            }))
            .filter((subGroup: any) => subGroup.devices.length > 0);

          if (filteredSubgroups.length === 0) return null;

          const groupTotalCount = filteredSubgroups.reduce(
            (acc: number, sub: any) => acc + sub.devices.length,
            0
          );

          const allDevices = filteredSubgroups.flatMap((s: any) => s.devices);
          const isGroupAllChecked = allDevices.length > 0 && allDevices.every((d: any) => d.checked !== false);
          const isGroupSomeChecked = allDevices.some((d: any) => d.checked !== false) && !isGroupAllChecked;

          return (
            <div key={groupItem.group} className="bg-white dark:bg-slate-900">
              {/* 1. Company / Top Group Header Row */}
              <div
                onClick={() => toggleNode(gKey)}
                className="flex items-center justify-between px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <input
                    type="checkbox"
                    checked={isGroupAllChecked}
                    ref={(el) => {
                      if (el) el.indeterminate = isGroupSomeChecked;
                    }}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleGroupCheck(groupItem.group, e.target.checked);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-600 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                  />
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-500 transition-transform duration-200 shrink-0",
                      isGroupCollapsed && "-rotate-90"
                    )}
                  />
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                    {groupItem.group}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-medium text-slate-500 shrink-0">
                  [{groupTotalCount}]
                </span>
              </div>

              {/* 2. Subgroups & Video Telematics Devices */}
              {!isGroupCollapsed &&
                filteredSubgroups.map((subGroup: any) => {
                  const subKey = "vid-sub-" + groupItem.group + "-" + subGroup.name;
                  const isSubCollapsed = isCollapsed(subKey);

                  const isSubAllChecked = subGroup.devices.length > 0 && subGroup.devices.every((d: any) => d.checked !== false);
                  const isSubSomeChecked = subGroup.devices.some((d: any) => d.checked !== false) && !isSubAllChecked;

                  return (
                    <div key={subGroup.name}>
                      {/* Subgroup Header (e.g. HP Branch 1) - Flush directly under company header with zero extra indentation */}
                      <div
                        onClick={() => toggleNode(subKey)}
                        className="flex items-center justify-between px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSubAllChecked}
                            ref={(el) => {
                              if (el) el.indeterminate = isSubSomeChecked;
                            }}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleSubgroupCheck(groupItem.group, subGroup.name, e.target.checked);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-600 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                          />
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 text-slate-500 transition-transform duration-200 shrink-0",
                              isSubCollapsed && "-rotate-90"
                            )}
                          />
                          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                            {subGroup.name}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-medium text-slate-500 shrink-0">
                          [{subGroup.devices.length}]
                        </span>
                      </div>

                      {/* Level 3: Device Rows & Nested Channels */}
                      {!isSubCollapsed && (
                        <div>
                          {subGroup.devices.map((dev: any) => {
                            const devKey = "vid-dev-" + dev.id;
                            const isDevCollapsed = isCollapsed(devKey, false);
                            const isDeviceActive = dev.status === "running" || dev.status === "idle";

                            return (
                              <div key={dev.id} className="relative">
                                {/* Device Item Row */}
                                <div
                                  onClick={() => onSelectVideoDevice && onSelectVideoDevice(dev)}
                                  className="flex items-center justify-between px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer select-none group"
                                >
                                  {/* Left: Checkbox + ChevronDown + Status Dot + Device Name & Timestamp */}
                                  <div className="flex items-center gap-1.5 min-w-0 flex-1 pr-2">
                                    <input
                                      type="checkbox"
                                      checked={dev.checked !== false}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        toggleSingleDeviceCheck(groupItem.group, subGroup.name, dev.id, e.target.checked);
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      className="h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-600 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                                    />

                                    {/* Expand / Collapse Chevron directly aligned above channel tree guide lines */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleNode(devKey);
                                      }}
                                      className="p-0.5 rounded text-slate-400 hover:text-[#0089FF] transition-colors cursor-pointer shrink-0"
                                      title={isDevCollapsed ? "Expand Channels" : "Collapse Channels"}
                                    >
                                      <ChevronDown
                                        className={cn(
                                          "h-3.5 w-3.5 text-slate-500 transition-transform duration-200 shrink-0",
                                          isDevCollapsed && "-rotate-90"
                                        )}
                                      />
                                    </button>

                                    {/* Status Dot */}
                                    <span
                                      title={`Status: ${dev.status.toUpperCase()}`}
                                      className={cn("h-2 w-2 rounded-full shrink-0 shadow-2xs", getDeviceStatusDot(dev.status))}
                                    />

                                    {/* Device Name & Timestamp */}
                                    <div className="flex flex-col min-w-0 truncate">
                                      <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate leading-tight">
                                        {dev.name}
                                      </span>
                                      <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 truncate leading-tight mt-0.5">
                                        {dev.timestamp}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Right: Live Intercom Broadcast Button ((•)) */}
                                  <div className="flex items-center shrink-0">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (onOpenIntercom) {
                                          onOpenIntercom({
                                            id: dev.id,
                                            name: dev.name,
                                            location: "At Uffizio - Head Office",
                                          });
                                        } else {
                                          toast.info(`Starting Intercom session with ${dev.name}...`);
                                        }
                                      }}
                                      className={cn(
                                        "p-1 rounded-md transition-colors cursor-pointer",
                                        isDeviceActive
                                          ? "text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                          : "text-rose-500 hover:text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                      )}
                                      title={`Live Intercom / Two-Way Audio - ${dev.name}`}
                                    >
                                      <Radio className="h-3.5 w-3.5 stroke-[2]" />
                                    </button>
                                  </div>
                                </div>

                                {/* Channel Sub-items with clean tree lines dropping from Chevron at left-[39px] */}
                                {!isDevCollapsed && dev.channels && dev.channels.length > 0 && (
                                  <div className="relative">
                                    {dev.channels.map((channel: any, cIdx: number) => {
                                      const isLast = cIdx === dev.channels.length - 1;

                                      return (
                                        <div
                                          key={channel.id}
                                          className="relative flex items-center justify-between pl-[58px] pr-3 py-1 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors select-none group"
                                        >
                                          {/* Tree guide line: vertical trunk & horizontal elbow directly below device chevron */}
                                          {!isLast ? (
                                            <>
                                              <div className="absolute left-[39px] top-0 bottom-0 w-px bg-slate-300 dark:bg-slate-700 pointer-events-none" />
                                              <div className="absolute left-[39px] top-1/2 -translate-y-1/2 w-[16px] h-px bg-slate-300 dark:bg-slate-700 pointer-events-none" />
                                            </>
                                          ) : (
                                            <div className="absolute left-[39px] top-0 h-1/2 w-[16px] border-l border-b border-slate-300 dark:border-slate-700 rounded-bl-[4px] pointer-events-none" />
                                          )}

                                          {/* Channel Name */}
                                          <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            {channel.name}
                                          </span>

                                          {/* 4 Action Icons matching reference screenshot: RotateCw, Video, Clock, Camera */}
                                          <div className="flex items-center gap-2 shrink-0">
                                            {/* 1. Reload Stream */}
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                toast.success(`Reloaded stream for ${dev.name} (${channel.name})`);
                                              }}
                                              className={cn(
                                                "p-0.5 rounded transition-colors cursor-pointer",
                                                isDeviceActive
                                                  ? "text-emerald-500 hover:text-emerald-600 dark:text-emerald-400"
                                                  : "text-rose-500 hover:text-rose-600 dark:text-rose-400"
                                              )}
                                              title={`Reload Stream - ${channel.name}`}
                                            >
                                              <RotateCw className="h-3.5 w-3.5 stroke-[2.2]" />
                                            </button>

                                            {/* 2. Live Camera Feed */}
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                const feed = {
                                                  id: `${dev.id}-${channel.id}`,
                                                  deviceName: dev.name,
                                                  channelName: channel.name,
                                                  location: "At Uffizio - Head Office",
                                                  status: "Active" as const,
                                                  fps: dev.status === "running" ? 25 : 15,
                                                  dataUsed: "3.39 MB",
                                                  bitrate: "1/40.34 kbps",
                                                  resolution: "704x576 px",
                                                  coordinates: "20.594105N 72.930708E",
                                                  speed: "0 km/h",
                                                };
                                                if (onOpenVideoChannel) {
                                                  onOpenVideoChannel(feed);
                                                } else {
                                                  toast.success(`Starting Live Stream on ${dev.name} (${channel.name})`);
                                                }
                                              }}
                                              className={cn(
                                                "p-0.5 rounded transition-colors cursor-pointer",
                                                isDeviceActive
                                                  ? "text-emerald-500 hover:text-emerald-600 dark:text-emerald-400"
                                                  : "text-rose-500 hover:text-rose-600 dark:text-rose-400"
                                              )}
                                              title={`Live Stream - ${channel.name}`}
                                            >
                                              <Video className="h-3.5 w-3.5 stroke-[2.2]" />
                                            </button>

                                            {/* 3. Playback / History */}
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (onOpenPlayback) {
                                                  onOpenPlayback({
                                                    deviceName: dev.name,
                                                    channelName: channel.name,
                                                    location: "At Uffizio - Head Office",
                                                    channels: dev.channels.map((c: any) => c.name),
                                                  });
                                                } else {
                                                  toast.info(`Opening Playback for ${dev.name} (${channel.name})`);
                                                }
                                              }}
                                              className={cn(
                                                "p-0.5 rounded transition-colors cursor-pointer",
                                                isDeviceActive
                                                  ? "text-emerald-500 hover:text-emerald-600 dark:text-emerald-400"
                                                  : "text-rose-500 hover:text-rose-600 dark:text-rose-400"
                                              )}
                                              title={`Playback - ${channel.name}`}
                                            >
                                              <Clock className="h-3.5 w-3.5 stroke-[2.2]" />
                                            </button>

                                            {/* 4. Snapshot */}
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                toast.success(`Snapshot captured for ${dev.name} (${channel.name})`);
                                              }}
                                              className={cn(
                                                "p-0.5 rounded transition-colors cursor-pointer",
                                                isDeviceActive
                                                  ? "text-emerald-500 hover:text-emerald-600 dark:text-emerald-400"
                                                  : "text-rose-500 hover:text-rose-600 dark:text-rose-400"
                                              )}
                                              title={`Take Snapshot - ${channel.name}`}
                                            >
                                              <Camera className="h-3.5 w-3.5 stroke-[2.2]" />
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
                      )}
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}
