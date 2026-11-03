import React from "react";
import {
  X,
  Radio,
  Battery,
  Wifi,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Clock,
  Car,
} from "lucide-react";
import {
  type TemperatureVehicle,
  getTemperatureStatus,
} from "@/data/temperatureDashboardData";
import { cn } from "@/lib/utils";

interface TemperatureDetailModalProps {
  vehicle: TemperatureVehicle | null;
  onClose: () => void;
}

export function TemperatureDetailModal({
  vehicle,
  onClose,
}: TemperatureDetailModalProps) {
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-[#0089FF]">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {vehicle.name} — Sensor Telemetry
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connected BLE beacons, threshold alarms & location
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Vehicle Metadata Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <div>
              <span className="text-[11px] font-medium text-slate-400">Plate Number</span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                {vehicle.plateNumber}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400">Device Model</span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {vehicle.model}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400">Equipment Status</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  title={`Ignition: ${vehicle.ignition ? "ON" : "OFF"}`}
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold font-mono",
                    vehicle.ignition ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                  )}
                >
                  IGN:{vehicle.ignition ? "ON" : "OFF"}
                </span>
                <span
                  title={`Chiller: ${vehicle.chiller ? "ON" : "OFF"}`}
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold font-mono",
                    vehicle.chiller ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                  )}
                >
                  CHILL:{vehicle.chiller ? "ON" : "OFF"}
                </span>
                <span
                  title={`Door: ${vehicle.door}`}
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold font-mono",
                    vehicle.door === "closed" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                  )}
                >
                  DOOR:{vehicle.door.toUpperCase()}
                </span>
                <span
                  title={`AC: ${vehicle.ac ? "ON" : "OFF"}`}
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold font-mono",
                    vehicle.ac ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                  )}
                >
                  AC:{vehicle.ac ? "ON" : "OFF"}
                </span>
              </div>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400">Recorded Limits</span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                Min: {vehicle.minTemp}°C | Max: {vehicle.maxTemp}°C
              </p>
            </div>
          </div>

          {/* Sensors List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Configured Temperature Sensors ({vehicle.sensors.length})
            </h3>
            <div className="space-y-3">
              {vehicle.sensors.map((sensor) => {
                const { color, label } = getTemperatureStatus(sensor.temperature);
                return (
                  <div
                    key={sensor.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                        <Radio className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                            {sensor.name}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                            style={{ backgroundColor: `${color}18`, color }}
                          >
                            {label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                          <span>Range: {sensor.minThreshold}°C — {sensor.maxThreshold}°C</span>
                          {sensor.humidity !== undefined && (
                            <span className="text-blue-500 font-mono">
                              Humidity: {sensor.humidity}%
                            </span>
                          )}
                          {sensor.minTemp !== undefined && (
                            <span className="text-emerald-500 font-mono">
                              Min: {sensor.minTemp}°C
                            </span>
                          )}
                          {sensor.maxTemp !== undefined && (
                            <span className="text-rose-500 font-mono">
                              Max: {sensor.maxTemp}°C
                            </span>
                          )}
                          {sensor.batteryLevel && (
                            <span className="flex items-center gap-1">
                              <Battery className="h-3 w-3" />
                              {sensor.batteryLevel}%
                            </span>
                          )}
                          {sensor.rssi && (
                            <span className="flex items-center gap-1">
                              <Wifi className="h-3 w-3" />
                              {sensor.rssi} dBm
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1 shrink-0 self-end sm:self-center">
                      <span
                        className="text-3xl font-extrabold font-mono"
                        style={{ color }}
                      >
                        {sensor.temperature}
                      </span>
                      <span className="text-base font-bold" style={{ color }}>
                        °C
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Location details */}
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <MapPin className="h-4 w-4 text-[#0089FF]" />
              <span>Current Address</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
              {vehicle.address}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 px-6 py-3.5 bg-slate-50/50 dark:bg-slate-950/50">
          <span className="text-xs text-slate-400">
            Last updated: {vehicle.lastUpdated}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0089FF] hover:bg-[#0070D0] text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
