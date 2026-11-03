import React, { useMemo } from "react";
import { Droplets, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type TemperatureSensorData,
  getTemperatureStatus,
} from "@/data/temperatureDashboardData";

interface MiniTemperatureThermometerProps {
  sensor: TemperatureSensorData;
  className?: string;
  onClick?: () => void;
  isTwoPort?: boolean;
}

export function MiniTemperatureThermometer({
  sensor,
  className,
  onClick,
  isTwoPort = false,
}: MiniTemperatureThermometerProps) {
  const currentStatus = getTemperatureStatus(sensor.temperature);

  const statusTheme = useMemo(() => {
    if (currentStatus === "critical_high" || sensor.temperature > 40) {
      return {
        fluidColor: "#EF4444",
        textColor: "text-rose-600 dark:text-rose-400",
      };
    }
    if (currentStatus === "warning_high" || sensor.temperature > 25) {
      return {
        fluidColor: "#F59E0B",
        textColor: "text-amber-600 dark:text-amber-400",
      };
    }
    if (sensor.temperature < 0) {
      return {
        fluidColor: "#0284C7",
        textColor: "text-sky-600 dark:text-sky-400",
      };
    }
    return {
      fluidColor: "#10B981",
      textColor: "text-emerald-600 dark:text-emerald-400",
    };
  }, [currentStatus, sensor.temperature]);

  // Mini Thermometer Scale: -20 to 70°C
  const minScale = -20;
  const maxScale = 70;
  const clampedTemp = Math.max(minScale, Math.min(maxScale, sensor.temperature));
  const tempRatio = (clampedTemp - minScale) / (maxScale - minScale);

  // Compact layout calculations (for 4-port and 6-port vehicles)
  const compactLiquidTopY = 38 - tempRatio * 30; // Range: y=38 down to y=8
  const compactLiquidHeight = Math.max(3, 42 - compactLiquidTopY);

  // Expanded layout calculations (for 2-port vehicles where full card height is available)
  const twoPortLiquidTopY = 72 - tempRatio * 60; // Range: y=72 down to y=12
  const twoPortLiquidHeight = Math.max(4, 76 - twoPortLiquidTopY);

  const twoPortTicks = [
    { temp: 60, y: 18.7, label: "60°" },
    { temp: 40, y: 32, label: "40°" },
    { temp: 20, y: 45.3, label: "20°" },
    { temp: 0, y: 58.7, label: "0°" },
    { temp: -20, y: 72, label: "-20°" },
  ];

  const twoPortMinorTicks = [25.3, 38.7, 52, 65.3];

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-2xs hover:border-[#0089FF]/50 transition-all cursor-pointer flex flex-col justify-between select-none overflow-hidden",
        isTwoPort ? "p-2.5 sm:p-3 h-full" : "p-1.5 sm:p-2",
        className
      )}
    >
      {/* 1. Header: Sensor name only with status dot (NO BADGE, NO BACKGROUND) */}
      <div className="flex items-center gap-1.5 min-w-0 leading-none">
        <span
          className={cn(
            "rounded-full shrink-0 shadow-2xs",
            isTwoPort ? "h-2.5 w-2.5" : "h-2 w-2"
          )}
          style={{ backgroundColor: statusTheme.fluidColor }}
        />
        <span
          className={cn(
            "font-bold text-slate-800 dark:text-slate-100 truncate",
            isTwoPort ? "text-xs" : "text-[11px]"
          )}
        >
          {sensor.name}
        </span>
      </div>

      {/* 2. Middle Row: Thermometer + Temperature Value + Right-side Humidity, Max, Min */}
      <div
        className={cn(
          "flex items-center justify-between flex-1 min-h-0",
          isTwoPort ? "gap-2 my-auto px-1" : "gap-1 mt-1"
        )}
      >
        {isTwoPort ? (
          /* ── 2-PORT LARGER THERMOMETER (Proportionate to available full card height) ── */
          <div className="w-[48px] h-[98px] shrink-0">
            <svg viewBox="0 0 54 100" className="w-full h-full overflow-visible">
              {/* Outer Casing */}
              <path
                d="
                  M 13 10
                  A 7 7 0 0 1 27 10
                  L 27 73
                  A 12 12 0 1 1 13 73
                  Z
                "
                fill="#F1F5F9"
                stroke="#CBD5E1"
                strokeWidth="1.6"
                className="dark:fill-slate-800 dark:stroke-slate-600"
              />
              {/* Solid Liquid Stem */}
              <rect
                x="16"
                y={twoPortLiquidTopY}
                width="8"
                height={twoPortLiquidHeight}
                rx="4"
                fill={statusTheme.fluidColor}
              />
              {/* Solid Liquid Bulb */}
              <circle
                cx="20"
                cy="83"
                r="9.5"
                fill={statusTheme.fluidColor}
              />
              {/* Flat Accent Dot on Bulb */}
              <circle
                cx="17"
                cy="80"
                r="2.2"
                fill="#FFFFFF"
                opacity="0.4"
              />
              {/* Calibration Scale Ticks */}
              {twoPortTicks.map((t) => (
                <line
                  key={t.temp}
                  x1="30"
                  y1={t.y}
                  x2="36"
                  y2={t.y}
                  stroke="#64748B"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  className="dark:stroke-slate-400"
                />
              ))}
              {/* Minor ticks */}
              {twoPortMinorTicks.map((yVal, i) => (
                <line
                  key={`minor-${i}`}
                  x1="30"
                  y1={yVal}
                  x2="33.5"
                  y2={yVal}
                  stroke="#94A3B8"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  className="dark:stroke-slate-600"
                />
              ))}
              {/* Meniscus Pointer Arrow */}
              <polygon
                points={`28,${twoPortLiquidTopY} 33,${twoPortLiquidTopY - 2.5} 33,${twoPortLiquidTopY + 2.5}`}
                fill={statusTheme.fluidColor}
              />
            </svg>
          </div>
        ) : (
          /* ── 4-PORT & 6-PORT COMPACT THERMOMETER ── */
          <div className="w-[24px] h-[48px] shrink-0">
            <svg viewBox="0 0 32 54" className="w-full h-full overflow-visible">
              {/* Outer Casing */}
              <path
                d="
                  M 8 7
                  A 4 4 0 0 1 16 7
                  L 16 38
                  A 6.5 6.5 0 1 1 8 38
                  Z
                "
                fill="#F1F5F9"
                stroke="#CBD5E1"
                strokeWidth="1.3"
                className="dark:fill-slate-800 dark:stroke-slate-600"
              />
              {/* Solid Liquid Stem */}
              <rect
                x="10"
                y={compactLiquidTopY}
                width="4"
                height={compactLiquidHeight}
                rx="2"
                fill={statusTheme.fluidColor}
              />
              {/* Solid Liquid Bulb */}
              <circle
                cx="12"
                cy="43"
                r="5"
                fill={statusTheme.fluidColor}
              />
              {/* Scale Ticks on Right */}
              <line x1="18" y1="8" x2="22" y2="8" stroke="#64748B" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="18" y1="23" x2="21" y2="23" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
              <line x1="18" y1="38" x2="22" y2="38" stroke="#64748B" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* Beside Thermometer: Temperature Readout */}
        <div
          className={cn(
            "flex items-baseline min-w-0 flex-1",
            isTwoPort ? "gap-1 pl-1" : "gap-0.5 pl-0.5"
          )}
        >
          <span
            className={cn(
              "font-black font-mono leading-none tracking-tight",
              isTwoPort ? "text-2xl sm:text-3xl" : "text-base sm:text-lg",
              statusTheme.textColor
            )}
          >
            {sensor.temperature}
          </span>
          <span
            className={cn(
              "font-bold text-slate-400",
              isTwoPort ? "text-xs sm:text-sm" : "text-[10px]"
            )}
          >
            °C
          </span>
        </div>

        {/* Right Side: Humidity, Max, Min Stack (13-14px font size across 2, 4, and 6 ports) */}
        <div
          className={cn(
            "flex flex-col justify-center shrink-0 border-l border-slate-100 dark:border-slate-800/80 leading-none",
            isTwoPort ? "gap-2 pl-2" : "gap-1 pl-1.5"
          )}
        >
          {/* Humidity */}
          <div
            className="flex items-center gap-1.5 font-mono font-bold text-[13px] sm:text-[13.5px] text-slate-700 dark:text-slate-200"
            title={`Humidity: ${sensor.humidity ?? 0}%`}
          >
            <Droplets className={cn("text-[#0089FF] shrink-0", isTwoPort ? "h-3.5 w-3.5" : "h-3 w-3")} />
            <span>{sensor.humidity ?? 0}%</span>
          </div>
          {/* Max Temp */}
          <div
            className="flex items-center gap-1.5 font-mono font-bold text-[13px] sm:text-[13.5px] text-rose-600 dark:text-rose-400"
            title={`Max Temp: ${sensor.maxTemp ?? 0}°C`}
          >
            <TrendingUp className={cn("text-rose-500 shrink-0", isTwoPort ? "h-3.5 w-3.5" : "h-3 w-3")} />
            <span>{sensor.maxTemp ?? 0}°</span>
          </div>
          {/* Min Temp */}
          <div
            className="flex items-center gap-1.5 font-mono font-bold text-[13px] sm:text-[13.5px] text-emerald-600 dark:text-emerald-400"
            title={`Min Temp: ${sensor.minTemp ?? 0}°C`}
          >
            <TrendingDown className={cn("text-emerald-500 shrink-0", isTwoPort ? "h-3.5 w-3.5" : "h-3 w-3")} />
            <span>{sensor.minTemp ?? 0}°</span>
          </div>
        </div>
      </div>
    </div>
  );
}
