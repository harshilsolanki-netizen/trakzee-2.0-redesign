import React, { useMemo } from "react";
import {
  X,
  Droplet,
  TrendingDown,
  TrendingUp,
  Download,
  AlertCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { FuelVehicle } from "@/data/fuelDashboardData";
import { getFuelStatus } from "@/data/fuelDashboardData";

interface FuelChartModalProps {
  vehicle: FuelVehicle;
  onClose: () => void;
}

export function FuelChartModal({ vehicle, onClose }: FuelChartModalProps) {
  // Generate 24 hours of simulated fuel telemetry data points
  const telemetryData = useMemo(() => {
    const points: {
      time: string;
      fuel: number;
      event?: "refuel" | "drain" | "normal";
    }[] = [];

    const now = new Date();
    let current = vehicle.currentFuel;

    for (let i = 24; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hours = d.getHours().toString().padStart(2, "0") + ":00";

      // Simulate a refuel event at 8 hours ago
      let event: "refuel" | "drain" | "normal" = "normal";
      let val = current - (24 - i) * 1.5;

      if (i === 8) {
        val += 60; // refueled
        event = "refuel";
      }

      val = Math.max(5, Math.min(vehicle.capacity, Math.round(val)));
      points.push({
        time: hours,
        fuel: val,
        event,
      });
    }
    return points;
  }, [vehicle]);

  const { color } = getFuelStatus(vehicle.currentFuel, vehicle.capacity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden select-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#0089FF] border border-blue-200 dark:border-blue-900">
              <Droplet className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {vehicle.name}
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {vehicle.fuelType}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                24-Hour Fuel Consumption & Refuel History
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

        {/* Metric summary badges */}
        <div className="grid grid-cols-4 gap-3 p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">
              Current Level
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold font-mono" style={{ color }}>
                {vehicle.currentFuel}
              </span>
              <span className="text-xs text-slate-400">/{vehicle.capacity}L</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">
              Fuel Percentage
            </span>
            <span className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100 mt-0.5 block">
              {((vehicle.currentFuel / vehicle.capacity) * 100).toFixed(1)}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" /> Refueled (24h)
            </span>
            <span className="text-xl font-bold font-mono text-emerald-600 mt-0.5 block">
              +60 L
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-blue-500" /> Consumed
            </span>
            <span className="text-xl font-bold font-mono text-blue-600 mt-0.5 block">
              ~38.5 L
            </span>
          </div>
        </div>

        {/* 24-Hour Area Chart */}
        <div className="p-6">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={telemetryData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="chartFuelGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0089FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0089FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, vehicle.capacity]}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickLine={false}
                  unit="L"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg text-xs">
                          <p className="font-semibold text-slate-700 dark:text-slate-200">
                            Time: {data.time}
                          </p>
                          <p className="font-mono font-bold text-sm text-[#0089FF] mt-0.5">
                            {data.fuel} L
                          </p>
                          {data.event === "refuel" && (
                            <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                              Refuel Event Detected
                            </span>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="fuel"
                  stroke="#0089FF"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#chartFuelGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-6 py-3.5 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <AlertCircle className="h-4 w-4 text-slate-400" />
            <span>Digital Fuel Sensor (RS485/Modbus Telemetry)</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
