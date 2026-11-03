import React, { useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Fuel,
  Key,
  MapPin,
  TrendingUp,
  Maximize2,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type FuelVehicle,
  getFuelStatus,
  getVehicleFuelTelemetry,
} from "@/data/fuelDashboardData";
import { FuelRadialGauge } from "./FuelRadialGauge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FuelVehicleCardProps {
  vehicle: FuelVehicle;
  onOpenChart: (vehicle: FuelVehicle) => void;
  onOpenDetail: (vehicle: FuelVehicle) => void;
}

export function FuelVehicleCard({
  vehicle,
  onOpenChart,
  onOpenDetail,
}: FuelVehicleCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { color } = getFuelStatus(vehicle.currentFuel, vehicle.capacity);
  const metrics = getVehicleFuelTelemetry(vehicle);

  return (
    <div className="group/card relative h-full w-full select-none flip-card-container">
      <div className={cn("flip-card-inner", isFlipped && "flip-card-flipped")}>
        {/* ========================================================= */}
        {/* FRONT FACE: Radial Gauge, Fuel Readout & Flip Trigger     */}
        {/* ========================================================= */}
        <div className="flip-card-front rounded-2xl border border-[#DFE3EB]/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col justify-between h-full w-full">
          {/* 1. Top Header Row */}
          <div className="flex h-[38px] min-h-[38px] items-center justify-between border-b border-slate-100 dark:border-slate-800/80 px-3 shrink-0">
            {/* Left: Status Dot + Key + Vehicle Name */}
            <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-1.5">
              {/* Status Dot */}
              <span
                className={cn(
                  "h-2 w-2 rounded-full shrink-0",
                  vehicle.status === "running"
                    ? "bg-emerald-500 ring-2 ring-emerald-500/20"
                    : vehicle.status === "idle"
                    ? "bg-amber-500 ring-2 ring-amber-500/20"
                    : "bg-rose-500"
                )}
                title={vehicle.status.toUpperCase()}
              />

              {/* Ignition Key Icon */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "flex items-center justify-center p-0.5 shrink-0",
                      vehicle.ignition ? "text-emerald-500" : "text-rose-500"
                    )}
                  >
                    <Key className="h-3 w-3 -rotate-45 stroke-[2.5]" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {vehicle.ignition ? "Ignition ON" : "Ignition OFF"}
                </TooltipContent>
              </Tooltip>

              {/* Vehicle Name */}
              <h3
                className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate tracking-tight font-sans"
                title={vehicle.name}
              >
                {vehicle.name}
              </h3>
            </div>

            {/* Right: Speed Badge + Action Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Speed Indicator */}
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                <Truck className="h-2.5 w-2.5" />
                <span>{vehicle.speed} kmph</span>
              </div>

              {/* 24h Fuel Trend Chart Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onOpenChart(vehicle)}
                    aria-label="Fuel Analytics & Trends"
                    className="p-1 rounded-md text-slate-400 hover:text-[#0089FF] hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <TrendingUp className="h-3.5 w-3.5 stroke-[2]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  24h Fuel Trends & Refuel Logs
                </TooltipContent>
              </Tooltip>

              {/* Expand Details Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onOpenDetail(vehicle)}
                    aria-label="Tank Details"
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Maximize2 className="h-3 w-3 stroke-[2]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Fuel Tank Calibration Specs
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* 2. Main Body: Radial Fuel Gauge & Flip Trigger */}
          <div className="px-2 pt-0 pb-0 flex flex-1 min-h-0 flex-col items-center justify-center">
            <FuelRadialGauge
              currentFuel={vehicle.currentFuel}
              capacity={vehicle.capacity}
              fuelType={vehicle.fuelType}
            />

            {/* 3D Flip Trigger: View Fuel Details with arrow */}
            <button
              type="button"
              onClick={() => setIsFlipped(true)}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0089FF] hover:text-[#0070d6] cursor-pointer transition-all py-0.5 px-2.5 rounded-full bg-blue-50/70 hover:bg-blue-100/90 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 border border-blue-200/50 dark:border-blue-900/40 shadow-2xs group/btn mt-1 mb-0.5 active:scale-95 select-none"
              title="Click to view Refill, Pilferage & Mileage breakdown"
            >
              <Fuel className="h-3 w-3 stroke-[2.2]" />
              <span>View Fuel Details</span>
              <ChevronRight className="h-3 w-3 stroke-[2.5] transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </button>
          </div>

          {/* 3. Location Row */}
          <div className="flex h-[26px] min-h-[26px] items-center px-3 gap-1.5 text-slate-600 dark:text-slate-300 shrink-0">
            <MapPin className="h-3 w-3 text-slate-400 dark:text-slate-500 shrink-0" />
            <p
              className="text-[10.5px] truncate leading-normal"
              title={vehicle.address}
            >
              {vehicle.address}
            </p>
          </div>

          {/* 4. Footer: Last Updated */}
          <div className="flex h-[26px] min-h-[26px] items-center border-t border-slate-100 dark:border-slate-800/80 px-3 text-[10.5px] text-slate-500 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-900/40 shrink-0 select-none">
            <span className="font-sans truncate">
              Last updated{" "}
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {vehicle.lastUpdated}
              </span>
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BACK FACE: Detailed Refill, Pilferage & Mileage Breakdown */}
        {/* ========================================================= */}
        <div className="flip-card-back rounded-2xl border border-[#DFE3EB]/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col justify-between h-full w-full">
          {/* 1. Back Header Row: Back Arrow + Vehicle Title */}
          <div className="flex h-[38px] min-h-[38px] items-center justify-between border-b border-slate-100 dark:border-slate-800 px-3.5 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => setIsFlipped(false)}
                className="p-1 -ml-1 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title="Back to Gauge"
                aria-label="Back to Gauge"
              >
                <ArrowLeft className="h-4 w-4 stroke-[2.4]" />
              </button>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                {vehicle.name}
              </h3>
            </div>

            {/* Subtly show status indicator badge on the top right */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                  vehicle.status === "running"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : vehicle.status === "idle"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                )}
              >
                {vehicle.status}
              </span>
            </div>
          </div>

          {/* 2. Main Metrics Body: Perfectly balanced, evenly spaced layout matching reference */}
          <div className="flex-1 min-h-0 flex flex-col justify-between px-4 sm:px-5 py-3 overflow-hidden">
            {/* Section 1: Core Metrics Grid (Re-fill, Pilferage, Distance, Duration) */}
            <div className="grid grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-3 shrink-0">
              {/* Re-fill */}
              <div className="flex items-center gap-2.5">
                <div className="w-[3.5px] h-[30px] rounded-full bg-[#10B981] shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block leading-tight">
                    Re-fill
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-[15px] font-bold text-[#10B981] leading-none font-sans">
                      {metrics.refillLiters}L
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 font-sans">
                      ({metrics.refillCount} times)
                    </span>
                  </div>
                </div>
              </div>

              {/* Pilferage */}
              <div className="flex items-center gap-2.5">
                <div className="w-[3.5px] h-[30px] rounded-full bg-[#F97316] shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block leading-tight">
                    Pilferage
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-[15px] font-bold text-[#F97316] leading-none font-sans">
                      {metrics.pilferageLiters}L
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 font-sans">
                      ({metrics.pilferageCount} time{metrics.pilferageCount > 1 ? "s" : ""})
                    </span>
                  </div>
                </div>
              </div>

              {/* Distance */}
              <div className="flex items-center gap-2.5">
                <div className="w-[3.5px] h-[30px] rounded-full bg-[#0089FF] shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block leading-tight">
                    Distance
                  </span>
                  <span className="text-[15px] font-bold text-[#0089FF] block leading-none mt-1 font-sans">
                    {metrics.distanceKm} km
                  </span>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-2.5">
                <div className="w-[3.5px] h-[30px] rounded-full bg-[#0089FF] shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block leading-tight">
                    Duration
                  </span>
                  <span className="text-[15px] font-bold text-[#0089FF] block leading-none mt-1 font-sans">
                    {metrics.durationHours}
                  </span>
                </div>
              </div>
            </div>

            {/* Subtle Divider Line */}
            <div className="border-t border-slate-200/80 dark:border-slate-800/80 shrink-0" />

            {/* Section 2: Fuel Consumption based on */}
            <div className="shrink-0 space-y-1.5">
              <h4 className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                Fuel consumption based on
              </h4>
              <div className="grid grid-cols-2 gap-x-6 sm:gap-x-8">
                {/* Distance */}
                <div className="flex items-center gap-2.5">
                  <div className="w-[3.5px] h-[30px] rounded-full bg-[#D97706] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block leading-tight">
                      Distance
                    </span>
                    <span className="text-[15px] font-bold text-[#D97706] block leading-none mt-1 font-sans">
                      {metrics.consumptionDistanceL}L
                    </span>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2.5">
                  <div className="w-[3.5px] h-[30px] rounded-full bg-[#D97706] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block leading-tight">
                      Duration
                    </span>
                    <span className="text-[15px] font-bold text-[#D97706] block leading-none mt-1 font-sans">
                      {metrics.consumptionDurationL}L
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Mileage based on */}
            <div className="shrink-0 space-y-1.5">
              <h4 className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                Mileage based on
              </h4>
              <div className="grid grid-cols-2 gap-x-6 sm:gap-x-8">
                {/* Distance */}
                <div className="flex items-center gap-2.5">
                  <div className="w-[3.5px] h-[30px] rounded-full bg-[#0089FF] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block leading-tight">
                      Distance
                    </span>
                    <span className="text-[15px] font-bold text-[#0089FF] block leading-none mt-1 font-sans">
                      {metrics.mileageDistance}
                    </span>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2.5">
                  <div className="w-[3.5px] h-[30px] rounded-full bg-[#0089FF] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 block leading-tight">
                      Duration
                    </span>
                    <span className="text-[15px] font-bold text-[#0089FF] block leading-none mt-1 font-sans">
                      {metrics.mileageDuration}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Back Footer: Last Updated (Matching Front Face) */}
          <div className="flex h-[26px] min-h-[26px] items-center border-t border-slate-100 dark:border-slate-800/80 px-3 text-[10.5px] text-slate-500 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-900/40 shrink-0 select-none">
            <span className="font-sans truncate">
              Last updated{" "}
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {vehicle.lastUpdated}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
