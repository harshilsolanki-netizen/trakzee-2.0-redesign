import React, { useState } from "react";
import {
  Key,
  Fan,
  Snowflake,
  Droplets,
  TrendingUp,
  TrendingDown,
  Maximize2,
  LayoutGrid,
  Gauge,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type TemperatureVehicle,
  getTemperatureStatus,
} from "@/data/temperatureDashboardData";
import { TemperatureThermometer } from "./TemperatureThermometer";
import { MiniTemperatureThermometer } from "./MiniTemperatureThermometer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TemperatureVehicleCardProps {
  vehicle: TemperatureVehicle;
  onOpenChart: (vehicle: TemperatureVehicle) => void;
  onOpenDetail: (vehicle: TemperatureVehicle) => void;
}

/**
 * Automotive Vehicle Door Icon (Open / Closed)
 * Replaces generic room door with automotive top-down vehicle outline:
 * - Closed: streamlined car body outline with side doors flush / sealed (green)
 * - Open: vehicle body with side doors swung wide open (automotive door ajar warning, red)
 */
function VehicleDoorIcon({
  isOpen,
  className,
}: {
  isOpen: boolean;
  className?: string;
}) {
  if (!isOpen) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Vehicle Body Contour (Top View) */}
        <path d="M8.5 2.5h7c1.1 0 2 .9 2.2 2l.8 4.5v8c0 1.4-.8 2.5-2 3l-1.5.5h-6l-1.5-.5c-1.2-.5-2-1.6-2-3v-8l.8-4.5c.2-1.1 1.1-2 2.2-2z" />
        {/* Front Windshield Arc */}
        <path d="M7.5 8.5c2.5 1.2 6.5 1.2 9 0" />
        {/* Rear Window Arc */}
        <path d="M8 16.5c2.3-.9 5.7-.9 8 0" />
        {/* Left & Right Closed Door Panel Lines */}
        <line x1="8.5" y1="8.5" x2="8.5" y2="16.5" />
        <line x1="15.5" y1="8.5" x2="15.5" y2="16.5" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Front Hood & Fender */}
      <path d="M8.5 2.5h7c1.1 0 2 .9 2.2 2l.8 4" />
      <path d="M5.5 8.5l.8-4c.2-1.1 1.1-2 2.2-2" />
      {/* Front Windshield Arc */}
      <path d="M7.5 8.5c2.5 1.2 6.5 1.2 9 0" />
      {/* Rear Window Arc */}
      <path d="M8 16.5c2.3-.9 5.7-.9 8 0" />
      {/* Rear Trunk & Bumper */}
      <path d="M18.5 16.5c0 1.4-.8 2.5-2 3l-1.5.5h-6l-1.5-.5c-1.2-.5-2-1.6-2-3" />
      {/* Inner Cabin Frame */}
      <line x1="8.5" y1="8.5" x2="8.5" y2="16.5" strokeDasharray="1.5 2" />
      <line x1="15.5" y1="8.5" x2="15.5" y2="16.5" strokeDasharray="1.5 2" />
      {/* Left Open Door (swung outward) */}
      <path d="M7.5 8.5 L2.5 13.5" strokeWidth="2.3" />
      {/* Right Open Door (swung outward) */}
      <path d="M16.5 8.5 L21.5 13.5" strokeWidth="2.3" />
    </svg>
  );
}

export function TemperatureVehicleCard({
  vehicle,
  onOpenChart,
  onOpenDetail,
}: TemperatureVehicleCardProps) {
  // Active sensor index for Focus Dial mode
  const [activeSensorIdx, setActiveSensorIdx] = useState(0);

  // View mode: default to "focus" for all vehicles for uniform clean presentation
  const [viewMode, setViewMode] = useState<"focus" | "grid">("focus");

  const activeSensor =
    vehicle.sensors[activeSensorIdx] || vehicle.sensors[0];

  const handleCycleSensor = () => {
    if (vehicle.sensors.length > 1) {
      setActiveSensorIdx((prev) => (prev + 1) % vehicle.sensors.length);
    }
  };

  return (
    <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-[#DFE3EB]/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden select-none">
      {/* 1. Top Header Row: Status Dot + Vehicle Name + Action Buttons */}
      <div className="flex h-[38px] min-h-[38px] items-center justify-between border-b border-slate-100 dark:border-slate-800/80 px-3.5 shrink-0">
        {/* Left: Status Dot + Vehicle Name */}
        <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
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
          <h3
            className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate tracking-tight font-sans"
            title={vehicle.name}
          >
            {vehicle.name}
          </h3>
        </div>

        {/* Right Action Icons: Multi-Port Toggle + Chart + Expand */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Multi-Port Grid View Switcher (Visible if vehicle has 2, 4, or 6 ports) */}
          {vehicle.sensors.length > 1 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() =>
                    setViewMode((prev) => (prev === "focus" ? "grid" : "focus"))
                  }
                  aria-label={
                    viewMode === "focus"
                      ? "Switch to Multi-Port Grid View"
                      : "Switch to Single Dial View"
                  }
                  className={cn(
                    "flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10.5px] font-bold transition-all cursor-pointer",
                    viewMode === "grid"
                      ? "bg-blue-500/15 text-[#0089FF] border border-blue-500/30"
                      : "text-slate-500 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  {viewMode === "focus" ? (
                    <>
                      <LayoutGrid className="h-3 w-3 stroke-[2.2]" />
                      <span className="font-mono text-[9.5px]">
                        {vehicle.sensors.length}P
                      </span>
                    </>
                  ) : (
                    <>
                      <Gauge className="h-3 w-3 stroke-[2.2]" />
                      <span className="font-mono text-[9.5px]">Dial</span>
                    </>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {viewMode === "focus"
                  ? `Show all ${vehicle.sensors.length} ports together`
                  : "Switch to large single dial view"}
              </TooltipContent>
            </Tooltip>
          )}

          {/* 24h Trend Chart Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => onOpenChart(vehicle)}
                aria-label="View Temperature Analytics"
                className="p-1 rounded-md text-slate-400 hover:text-[#0089FF] hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <TrendingUp className="h-3.5 w-3.5 stroke-[2]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">24h Temperature Analytics</TooltipContent>
          </Tooltip>

          {/* Expand / Details Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => onOpenDetail(vehicle)}
                aria-label="Vehicle Details"
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Maximize2 className="h-3 w-3 stroke-[2]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Vehicle Sensor Details</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* 2. Dedicated Status Bar Row: Ignition, Chiller, Door, AC + Port Controls */}
      <div className="flex h-[30px] min-h-[30px] items-center justify-between px-3.5 pt-0.5 shrink-0">
        {/* Left: 4 Dedicated Vehicle Status Icons (Proper, Bigger, No Background) */}
        <div className="flex items-center gap-3">
          {/* 1. Ignition */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex items-center justify-center transition-transform hover:scale-110 cursor-pointer",
                  vehicle.ignition ? "text-emerald-500" : "text-rose-500"
                )}
                aria-label={`Ignition: ${vehicle.ignition ? "ON" : "OFF"}`}
              >
                <Key className="h-[18px] w-[18px] -rotate-45 stroke-[2.5]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              Ignition: {vehicle.ignition ? "ON" : "OFF"}
            </TooltipContent>
          </Tooltip>

          {/* 2. Chiller */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex items-center justify-center transition-transform hover:scale-110 cursor-pointer",
                  vehicle.chiller ? "text-emerald-500" : "text-rose-500"
                )}
                aria-label={`Chiller: ${vehicle.chiller ? "ON" : "OFF"}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[18px] w-[18px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2.5" y="2.5" width="19" height="19" rx="4" />
                  <circle cx="12" cy="12" r="2" />
                  <path d="M12 10a2 2 0 1 0-2-2v2" />
                  <path d="M14 12a2 2 0 1 0 2-2h-2" />
                  <path d="M12 14a2 2 0 1 0 2 2v-2" />
                  <path d="M10 12a2 2 0 1 0-2 2h2" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              Chiller: {vehicle.chiller ? "ON" : "OFF"}
            </TooltipContent>
          </Tooltip>

          {/* 3. Door */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex items-center justify-center transition-transform hover:scale-110 cursor-pointer",
                  vehicle.door === "closed" ? "text-emerald-500" : "text-rose-500"
                )}
                aria-label={`Door: ${vehicle.door === "closed" ? "Closed (Secure)" : "OPEN"}`}
              >
                <VehicleDoorIcon
                  isOpen={vehicle.door === "open"}
                  className="h-[18px] w-[18px] stroke-[2.2]"
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              Door: {vehicle.door === "closed" ? "Closed (Secure)" : "OPEN"}
            </TooltipContent>
          </Tooltip>

          {/* 4. AC */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex items-center justify-center transition-transform hover:scale-110 cursor-pointer",
                  vehicle.ac ? "text-emerald-500" : "text-rose-500"
                )}
                aria-label={`AC: ${vehicle.ac ? "ON" : "OFF"}`}
              >
                <Snowflake className="h-[18px] w-[18px] stroke-[2.2]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              AC: {vehicle.ac ? "ON" : "OFF"}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Right: Port controls based on view mode */}
        {viewMode === "grid" ? (
          /* Multi-Port Grid Mode: Sensor Count Indicator (All ports visible directly in single card) */
          <span className="text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500">
            All {vehicle.sensors.length} Ports
          </span>
        ) : (
          /* Focus Dial Mode: Port Switcher Tabs (e.g. P1, P2, P3, P4, P5, P6) */
          vehicle.sensors.length > 1 && (
            <div className="flex items-center gap-1">
              {vehicle.sensors.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSensorIdx(idx)}
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-all cursor-pointer",
                    idx === activeSensorIdx
                      ? "bg-[#0089FF] text-white shadow-2xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200"
                  )}
                  title={`${s.name} (${s.temperature}°C)`}
                >
                  P{idx + 1}
                </button>
              ))}
            </div>
          )
        )}
      </div>

      {/* 3. Main Body: Single Large Thermometer OR Multi-Port Grid */}
      {viewMode === "focus" ? (
        /* Single Focus Thermometer View (with Port Name & Value beside Gauge, and Humidity/Max/Min on the Right) */
        <div className="px-1.5 py-1 flex flex-1 min-h-0 flex-col items-center justify-center">
          <TemperatureThermometer
            temperature={activeSensor.temperature}
            sensorName={activeSensor.name}
            humidity={activeSensor.humidity ?? vehicle.humidity}
            maxTemp={activeSensor.maxTemp ?? vehicle.maxTemp}
            minTemp={activeSensor.minTemp ?? vehicle.minTemp}
            minScale={-20}
            maxScale={70}
            hasMultipleSensors={vehicle.sensors.length > 1}
            sensorIndex={activeSensorIdx}
            totalSensors={vehicle.sensors.length}
            onSensorClick={handleCycleSensor}
          />
        </div>
      ) : (
        /* Multi-Port Grid View: All 2, 4, or 6 ports managed in ONE card without scrolling */
        <div
          className={cn(
            "px-2 py-1 flex-1 min-h-0 grid gap-1.5 items-stretch overflow-hidden",
            vehicle.sensors.length <= 2
              ? "grid-cols-2 grid-rows-1"
              : vehicle.sensors.length <= 4
              ? "grid-cols-2 grid-rows-2"
              : "grid-cols-3 grid-rows-2"
          )}
        >
          {vehicle.sensors.slice(0, 6).map((sensor) => (
            <MiniTemperatureThermometer
              key={sensor.id}
              sensor={sensor}
              isTwoPort={vehicle.sensors.length <= 2}
              onClick={() => {
                const idx = vehicle.sensors.findIndex((s) => s.id === sensor.id);
                if (idx !== -1) setActiveSensorIdx(idx);
                setViewMode("focus");
              }}
            />
          ))}
        </div>
      )}

      {/* 5. Location Row */}
      <div className="flex h-[28px] min-h-[28px] items-center px-3.5 gap-2 text-slate-600 dark:text-slate-300 shrink-0">
        <MapPin className="h-3 w-3 text-slate-400 dark:text-slate-500 shrink-0" />
        <p
          className="text-[11px] truncate leading-normal"
          title={vehicle.address}
        >
          {vehicle.address}
        </p>
      </div>

      {/* 6. Footer: Last Updated (Following Live Tracking single-vehicle tooltip font-sans) */}
      <div className="flex h-[28px] min-h-[28px] items-center border-t border-slate-100 dark:border-slate-800/80 px-3.5 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-900/40 shrink-0 select-none">
        <span className="font-sans truncate">
          Last updated <span className="font-medium text-slate-700 dark:text-slate-300">{vehicle.lastUpdated}</span>
        </span>
      </div>
    </div>
  );
}
