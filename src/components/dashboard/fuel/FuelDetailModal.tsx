import React from "react";
import { X, Droplet, Gauge, Wrench, ShieldCheck, MapPin } from "lucide-react";
import type { FuelVehicle } from "@/data/fuelDashboardData";
import { getFuelStatus } from "@/data/fuelDashboardData";

interface FuelDetailModalProps {
  vehicle: FuelVehicle;
  onClose: () => void;
}

export function FuelDetailModal({ vehicle, onClose }: FuelDetailModalProps) {
  const { color, label, badgeBg } = getFuelStatus(
    vehicle.currentFuel,
    vehicle.capacity
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden select-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#0089FF] border border-blue-200 dark:border-blue-900">
              <Droplet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {vehicle.name}
              </h2>
              <p className="text-xs text-slate-400">
                Fuel Tank Hardware Specifications & Calibration
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

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Main Status Row */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">
                Current Level
              </span>
              <span
                className="text-2xl font-black font-mono tracking-tight"
                style={{ color }}
              >
                {vehicle.currentFuel}
                <span className="text-sm font-normal text-slate-400">
                  {" "}
                  / {vehicle.capacity} Liters
                </span>
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeBg}`}
            >
              {label}
            </span>
          </div>

          {/* Tank Specifications Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Gauge className="h-4 w-4 text-[#0089FF]" />
              <span>Tank Specifications</span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                <span className="text-[10px] text-slate-400 block">Fuel Type</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                  {vehicle.fuelType} (Commercial Grade)
                </span>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                <span className="text-[10px] text-slate-400 block">
                  Total Capacity
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs font-mono">
                  {vehicle.capacity} Liters
                </span>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                <span className="text-[10px] text-slate-400 block">Tank Shape</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                  Horizontal Cylindrical (Baffled)
                </span>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                <span className="text-[10px] text-slate-400 block">
                  Sensor Protocol
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                  RS485 Capacitive Probe (0-5V)
                </span>
              </div>
            </div>
          </div>

          {/* Calibration & Sensor Health */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Wrench className="h-4 w-4 text-[#0089FF]" />
              <span>Sensor Health & Diagnostics</span>
            </h4>
            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Sensor Calibration</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Validated (99.2% Accuracy)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Battery & Signal</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {vehicle.batteryLevel}% · {vehicle.rssi} dBm
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Average Consumption</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                  {vehicle.consumptionRate} L/100km
                </span>
              </div>
            </div>
          </div>

          {/* Current Location */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {vehicle.address}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-100 dark:border-slate-800 px-6 py-3.5 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0089FF] hover:bg-blue-600 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
