import React, { useState } from "react";
import {
  X,
  TrendingUp,
  Download,
  Calendar,
  Thermometer,
  Droplets,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Maximize2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { toast } from "sonner";
import {
  type TemperatureVehicle,
  getTemperatureStatus,
} from "@/data/temperatureDashboardData";
import { cn } from "@/lib/utils";

interface TemperatureChartModalProps {
  vehicle: TemperatureVehicle | null;
  onClose: () => void;
}

export function TemperatureChartModal({
  vehicle,
  onClose,
}: TemperatureChartModalProps) {
  const [timeRange, setTimeRange] = useState<"4h" | "12h" | "24h" | "7d">("24h");
  const [selectedSensorIdx, setSelectedSensorIdx] = useState(0);

  if (!vehicle) return null;

  const activeSensor = vehicle.sensors[selectedSensorIdx] || vehicle.sensors[0];
  const { color, label } = getTemperatureStatus(activeSensor.temperature);

  const temperatures = vehicle.history.map((h) => h.temperature);
  const minTemp = Math.min(...temperatures);
  const maxTemp = Math.max(...temperatures);
  const avgTemp =
    Math.round(
      (temperatures.reduce((a, b) => a + b, 0) / temperatures.length) * 10
    ) / 10;

  const handleExport = () => {
    toast.success("Telemetry Log Exported", {
      description: `${vehicle.name} temperature & humidity data downloaded as CSV.`,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-4xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-[#0089FF]">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {vehicle.name}
                </h2>
                <span
                  className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                  style={{
                    backgroundColor: `${color}18`,
                    color,
                  }}
                >
                  {label}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live sensor telemetry, thermal fluctuations & humidity trend
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-3.5 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Current Temperature
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span
                  className="text-2xl font-extrabold font-mono"
                  style={{ color }}
                >
                  {activeSensor.temperature}
                </span>
                <span className="text-sm font-bold text-slate-400">°C</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-3.5 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Min Temperature (24h)
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
                  {minTemp}
                </span>
                <span className="text-sm font-bold text-slate-400">°C</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-3.5 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Max Temperature (24h)
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-rose-500 font-mono">
                  {maxTemp}
                </span>
                <span className="text-sm font-bold text-slate-400">°C</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-3.5 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Average Temp (24h)
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-slate-700 dark:text-slate-200 font-mono">
                  {avgTemp}
                </span>
                <span className="text-sm font-bold text-slate-400">°C</span>
              </div>
            </div>
          </div>

          {/* Time Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mr-1">
                Sensor:
              </span>
              {vehicle.sensors.map((sensor, idx) => (
                <button
                  key={sensor.id}
                  type="button"
                  onClick={() => setSelectedSensorIdx(idx)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                    idx === selectedSensorIdx
                      ? "bg-[#0089FF] text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  )}
                >
                  {sensor.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700">
              {(["4h", "12h", "24h", "7d"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTimeRange(r)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer",
                    timeRange === r
                      ? "bg-white dark:bg-slate-700 text-[#0089FF] shadow-xs"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Temperature & Humidity Recharts Graph */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30 p-4">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={vehicle.history}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="tempModalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={color} stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="humModalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0089FF" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0089FF" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-slate-200/60 dark:stroke-slate-800/60"
                  />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={{ stroke: "#cbd5e1" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    unit="°C"
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    formatter={(val: any, name: string) => [
                      `${val} ${name === "temperature" ? "°C" : "%RH"}`,
                      name === "temperature" ? "Temperature" : "Humidity",
                    ]}
                  />

                  {/* High Alert Threshold Line */}
                  <ReferenceLine
                    y={activeSensor.maxThreshold}
                    stroke="#EF4444"
                    strokeDasharray="4 4"
                    label={{
                      value: `Max Limit: ${activeSensor.maxThreshold}°C`,
                      position: "insideTopRight",
                      fill: "#EF4444",
                      fontSize: 10,
                    }}
                  />

                  {/* Temperature Curve */}
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke={color}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#tempModalGrad)"
                    name="temperature"
                  />

                  {/* Humidity Curve */}
                  <Area
                    type="monotone"
                    dataKey="humidity"
                    stroke="#0089FF"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#humModalGrad)"
                    name="humidity"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span>Temperature (°C)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#0089FF]" />
                <span>Relative Humidity (%RH)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-4 bg-rose-500 border-t border-dashed border-rose-500" />
                <span>Threshold Limit ({activeSensor.maxThreshold}°C)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 px-6 py-3 bg-slate-50/50 dark:bg-slate-950/50">
          <span className="text-xs text-slate-500">
            Last reading received at {vehicle.lastUpdated}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
