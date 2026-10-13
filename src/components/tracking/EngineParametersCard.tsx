import React, { useState } from "react";
import {
  ExternalLink,
  GripVertical,
  Search,
  X,
  Activity,
  AlertCircle,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { type FleetObject } from "@/data/fleet";
import { EngineIcon } from "./AutomotiveIcons";

interface EngineParamItem {
  id: string;
  label: string;
  value: string;
  type: "status" | "metric";
  isAlert?: boolean;
}

const DEFAULT_ENGINE_PARAMS: EngineParamItem[] = [
  { id: "ctrl_fault", label: "Controller Fault", value: "off", type: "status" },
  { id: "ctrl_overcurrent", label: "Controller Overcurrent", value: "off", type: "status" },
  { id: "curr_sensor_fault", label: "Current Sensor Fault", value: "on", type: "status", isAlert: true },
  { id: "precharge_failed", label: "Precharge Failed", value: "on", type: "status", isAlert: true },
  { id: "ctrl_sev_undervolt", label: "Controller Severe Undervoltage", value: "off", type: "status" },
  { id: "ctrl_sev_overvolt", label: "Controller Severe Overvoltage", value: "on", type: "status", isAlert: true },
  { id: "sev_b_undervolt", label: "Severe B+ Undervoltage", value: "on", type: "status", isAlert: true },
  { id: "sev_ksi_undervolt", label: "Severe KSI Undervoltage", value: "off", type: "status" },
  { id: "sev_b_overvolt", label: "Severe B+ Overvoltage", value: "on", type: "status", isAlert: true },
  { id: "sev_ksi_overvolt", label: "Severe KSI Overvoltage", value: "off", type: "status" },
  { id: "ctrl_overtemp", label: "Controller Overtemperature", value: "off", type: "status" },
  { id: "b_undervolt_cutback", label: "B+ Undervoltage Cutback", value: "off", type: "status" },
  { id: "b_overvolt_cutback", label: "B+ Overvoltage Cutback", value: "on", type: "status", isAlert: true },
  { id: "supply_failure_5v", label: "5V Supply Failure", value: "on", type: "status", isAlert: true },
  { id: "battery_health", label: "Battery Health", value: "100 %", type: "metric" },
  { id: "engine_load", label: "Engine Load", value: "52 %", type: "metric" },
  { id: "coolant_temp", label: "Engine coolant temperature", value: "117 °C", type: "metric", isAlert: true },
  { id: "fuel_pressure", label: "Fuel Pressure", value: "82 kPa", type: "metric" },
  { id: "intake_manifold", label: "Intake manifold absolute", value: "5 kPa", type: "metric" },
  { id: "engine_rpm", label: "Engine RPM", value: "1,850 RPM", type: "metric" },
  { id: "oil_temperature", label: "Engine Oil Temperature", value: "92 °C", type: "metric" },
  { id: "oil_pressure", label: "Oil Pressure", value: "345 kPa", type: "metric" },
  { id: "throttle_pos", label: "Throttle Position", value: "38 %", type: "metric" },
  { id: "operating_hours", label: "Engine Operating Hours", value: "1,428.5 hrs", type: "metric" },
];

export function EngineParametersCard({
  vehicle,
  onOpenDetails,
}: {
  vehicle: FleetObject;
  onOpenDetails?: () => void;
}) {
  const [params, setParams] = useState<EngineParamItem[]>(DEFAULT_ENGINE_PARAMS);
  const [search, setSearch] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const filteredParams = params.filter((p) =>
    p.label.toLowerCase().includes(search.toLowerCase().trim())
  );

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    setParams((prev) => {
      const copy = [...prev];
      const fromIndex = copy.findIndex((p) => p.id === draggedId);
      const toIndex = copy.findIndex((p) => p.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
    setDraggedId(null);
  };

  const handlePopout = () => {
    if (onOpenDetails) {
      onOpenDetails();
    } else {
      toast.info(`Engine Diagnostics for ${vehicle.name}`, {
        description: "Full OBD/CAN parameter matrix & DTC trouble codes viewer.",
      });
    }
  };

  const alertCount = params.filter((p) => p.isAlert && p.value === "on").length;

  return (
    <div className="w-[220px] h-full flex flex-col min-h-0 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md overflow-hidden text-xs select-none">
      {/* 1. Header Bar matching Screenshot */}
      <div className="flex h-[39px] items-center justify-between px-[10px] py-[8px] bg-white dark:bg-slate-900 border-b border-[#F1F5F9] dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-[6px] min-w-0">
          <EngineIcon className="h-4 w-4 text-[#0089FF] shrink-0" />
          <h3 className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 tracking-[-0.3px] truncate">
            Engine Parameters
          </h3>
        </div>

        <button
          type="button"
          onClick={handlePopout}
          title="Open Engine Diagnostics in Full Modal"
          className="p-1 rounded text-slate-400 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 2. Compact Search & Alert Summary Bar */}
      <div className="p-2 bg-[#FAFAFA]/70 dark:bg-slate-950/40 border-b border-[#F1F5F9] dark:border-slate-800 space-y-1.5 shrink-0">
        <div className="relative flex items-center">
          <Search className="h-3 w-3 text-slate-400 absolute left-2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search parameters..."
            className="w-full h-7 pl-6 pr-6 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px] text-[#0F172B] dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF] transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          )}
        </div>

        {alertCount > 0 && (
          <div className="flex items-center justify-between px-1 text-[11px]">
            <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              {alertCount} Active Faults
            </span>
            <span className="text-[#64748B] dark:text-slate-400 font-mono">
              {filteredParams.length} parameters
            </span>
          </div>
        )}
      </div>

      {/* 3. Parameter Rows List matching Screenshot 1:1 - Full Height with Internal Scrolling */}
      <div className="flex-1 min-h-0 divide-y divide-[#F1F5F9] dark:divide-slate-800 bg-white dark:bg-slate-900 overflow-y-auto custom-scrollbar">
        {filteredParams.length === 0 ? (
          <div className="py-8 px-3 text-center text-[11px] text-[#64748B] dark:text-slate-400">
            No parameters matching "{search}"
          </div>
        ) : (
          filteredParams.map((param) => {
            const isDragging = draggedId === param.id;

            return (
              <div
                key={param.id}
                draggable
                onDragStart={(e) => handleDragStart(e, param.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, param.id)}
                className={cn(
                  "flex items-center justify-between px-2.5 py-1.5 gap-1.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-default",
                  isDragging && "opacity-40 bg-sky-50 dark:bg-sky-950/40"
                )}
              >
                {/* Parameter Label (Left) - Exactly text-[11px] font-normal text-[#45556C] dark:text-slate-400 leading-[15px] */}
                <span className="text-[11px] font-normal text-[#45556C] dark:text-slate-400 leading-[15px] truncate flex-1 min-w-0 pr-1">
                  {param.label}
                </span>

                {/* Parameter Value (Right) - Exactly text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 leading-[16px] */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {param.type === "status" ? (
                    param.value === "on" ? (
                      <span className="text-[12px] font-semibold text-amber-600 dark:text-amber-400 leading-[16px]">
                        on
                      </span>
                    ) : (
                      <span className="text-[12px] font-normal text-[#64748B] dark:text-slate-400 leading-[16px]">
                        off
                      </span>
                    )
                  ) : (
                    <span
                      className={cn(
                        "text-[12px] font-semibold tabular-nums leading-[16px]",
                        param.isAlert
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-[#0F172B] dark:text-slate-100"
                      )}
                    >
                      {param.value}
                    </span>
                  )}

                  {/* Drag Handle 6-dots icon matching screenshot */}
                  <div
                    title="Drag to reorder parameter"
                    className="cursor-grab active:cursor-grabbing p-0.5 text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 transition-colors"
                  >
                    <GripVertical className="h-3 w-3 stroke-[2]" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
