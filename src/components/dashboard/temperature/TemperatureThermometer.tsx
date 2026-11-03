import React, { useMemo, useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { getTemperatureStatus } from "@/data/temperatureDashboardData";
import { Droplets, TrendingUp, TrendingDown } from "lucide-react";

export interface TemperatureThermometerProps {
  temperature: number;
  sensorName?: string;
  humidity?: number;
  maxTemp?: number;
  minTemp?: number;
  minScale?: number;
  maxScale?: number;
  className?: string;
  onSensorClick?: () => void;
  hasMultipleSensors?: boolean;
  sensorIndex?: number;
  totalSensors?: number;
}

export function TemperatureThermometer({
  temperature,
  sensorName = "BLE Temperature 1",
  humidity,
  maxTemp,
  minTemp,
  minScale = -20,
  maxScale = 70,
  className,
  onSensorClick,
  hasMultipleSensors = false,
  sensorIndex = 0,
  totalSensors = 1,
}: TemperatureThermometerProps) {
  // 1. Smooth animated fluid rise physics
  const [animatedTemp, setAnimatedTemp] = useState(0);
  const startTempRef = useRef(0);
  const targetTempRef = useRef(temperature);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    startTempRef.current = animatedTemp;
    targetTempRef.current = temperature;
    startTimeRef.current = null;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const duration = 850;

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(progress);

      const nextVal =
        startTempRef.current +
        (targetTempRef.current - startTempRef.current) * eased;
      setAnimatedTemp(nextVal);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setAnimatedTemp(targetTempRef.current);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [temperature]);

  // Display temperature formatted string
  const displayTemperatureString = useMemo(() => {
    const hasDecimal = temperature % 1 !== 0;
    return hasDecimal
      ? animatedTemp.toFixed(1)
      : Math.round(animatedTemp).toString();
  }, [animatedTemp, temperature]);

  // Status computation for fluid & text colors (SOLID VIBRANT COLORS, NO GRADIENTS)
  const status = getTemperatureStatus(temperature);
  const statusTheme = useMemo(() => {
    if (status === "critical_high" || temperature > 40) {
      return {
        fluidColor: "#EF4444", // Solid Red
        textColor: "text-rose-600 dark:text-rose-400",
      };
    }
    if (status === "warning_high" || temperature > 25) {
      return {
        fluidColor: "#F59E0B", // Solid Amber
        textColor: "text-amber-600 dark:text-amber-400",
      };
    }
    if (temperature < 0) {
      return {
        fluidColor: "#0284C7", // Solid Sky Blue
        textColor: "text-sky-600 dark:text-sky-400",
      };
    }
    return {
      fluidColor: "#10B981", // Solid Emerald Green
      textColor: "text-emerald-600 dark:text-emerald-400",
    };
  }, [status, temperature]);

  // ── Thermometer Scale Geometry (Solid, Thick, No Gradients) ──
  // Scale range: -20°C (Y=108) to 60°C (Y=28) -> Span = 80px (1px per degree)
  // Max scale 70°C at Y=18
  const clampedTemp = Math.max(minScale, Math.min(maxScale, animatedTemp));
  const tempRatio = (clampedTemp - minScale) / (maxScale - minScale);
  const liquidTopY = 108 - tempRatio * 90;
  const liquidHeight = Math.max(4, 114 - liquidTopY);

  // Calibration ticks: 60°, 40°, 20°, 0°, -20°
  const ticks = [
    { temp: 60, y: 108 - ((60 - minScale) / (maxScale - minScale)) * 90, label: "60°" },
    { temp: 40, y: 108 - ((40 - minScale) / (maxScale - minScale)) * 90, label: "40°" },
    { temp: 20, y: 108 - ((20 - minScale) / (maxScale - minScale)) * 90, label: "20°" },
    { temp: 0, y: 108 - ((0 - minScale) / (maxScale - minScale)) * 90, label: "0°" },
    { temp: -20, y: 108 - ((-20 - minScale) / (maxScale - minScale)) * 90, label: "-20°" },
  ];

  // Minor ticks: 50°, 30°, 10°, -10°
  const minorTicks = [50, 30, 10, -10].map((t) => ({
    temp: t,
    y: 108 - ((t - minScale) / (maxScale - minScale)) * 90,
  }));

  return (
    <div
      className={cn(
        "flex w-full h-[154px] max-h-[154px] items-center justify-between px-3 sm:px-4 select-none",
        className
      )}
    >
      {/* ── 1. LEFT: Solid, Proper Thermometer Instrument (No Gradients) ── */}
      <div className="relative flex items-center justify-start shrink-0 w-[82px] h-[148px]">
        <svg
          viewBox="0 0 88 148"
          className="w-full h-full overflow-visible"
        >
          {/* Outer Glass Casing: Continuous Path */}
          <path
            d="
              M 20 20
              A 10 10 0 0 1 40 20
              L 40 109
              A 16 16 0 1 1 20 109
              Z
            "
            fill="#F1F5F9"
            stroke="#CBD5E1"
            strokeWidth="1.8"
            className="dark:fill-slate-800 dark:stroke-slate-600"
          />

          {/* Solid Liquid Stem: Width 11px (X=24.5 to X=35.5) with rounded top meniscus */}
          <rect
            x="24.5"
            y={liquidTopY}
            width="11"
            height={liquidHeight}
            rx="5.5"
            fill={statusTheme.fluidColor}
          />

          {/* Solid Liquid Bulb: Radius 12.5px at (30, 122) */}
          <circle
            cx="30"
            cy="122"
            r="12.5"
            fill={statusTheme.fluidColor}
          />

          {/* Clean Flat Accent Dot on Bulb */}
          <circle
            cx="26"
            cy="118"
            r="3"
            fill="#FFFFFF"
            opacity="0.4"
          />

          {/* Calibration Scale & Degree Markings on Right */}
          {ticks.map((t) => (
            <g key={t.temp}>
              <line
                x1="43"
                y1={t.y}
                x2="50"
                y2={t.y}
                stroke="#64748B"
                strokeWidth="1.6"
                strokeLinecap="round"
                className="dark:stroke-slate-400"
              />
              <text
                x="54"
                y={t.y + 3.2}
                fontSize="9"
                fontWeight="700"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                fill="#64748B"
                className="dark:fill-slate-300 select-none"
              >
                {t.label}
              </text>
            </g>
          ))}

          {/* Minor intermediate ticks */}
          {minorTicks.map((t) => (
            <line
              key={`minor-${t.temp}`}
              x1="43"
              y1={t.y}
              x2="47"
              y2={t.y}
              stroke="#94A3B8"
              strokeWidth="1.2"
              strokeLinecap="round"
              className="dark:stroke-slate-600"
            />
          ))}

          {/* Clean Solid Pointer Arrow at Liquid Meniscus */}
          <polygon
            points={`41,${liquidTopY} 47,${liquidTopY - 3.5} 47,${liquidTopY + 3.5}`}
            fill={statusTheme.fluidColor}
          />
        </svg>
      </div>

      {/* ── 2. BESIDE THE GAUGE ONLY: Port Name and its Temperature Value ── */}
      <div className="flex flex-col items-start justify-center pl-1 pr-2 min-w-0 flex-1">
        {/* Port Name: Clean Transparent, No Pill Background */}
        <button
          type="button"
          onClick={onSensorClick}
          disabled={!hasMultipleSensors}
          className={cn(
            "inline-flex items-center gap-1.5 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors select-none w-fit bg-transparent border-0 p-0",
            hasMultipleSensors && "hover:text-[#0089FF] cursor-pointer"
          )}
          title={hasMultipleSensors ? "Click to cycle sensors" : sensorName}
        >
          <span
            className="h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: statusTheme.fluidColor }}
          />
          <span className="truncate max-w-[140px] font-semibold">{sensorName}</span>
          {hasMultipleSensors && (
            <span className="text-[11px] text-[#0089FF] font-mono font-bold">
              ({sensorIndex + 1}/{totalSensors})
            </span>
          )}
        </button>

        {/* Temperature Value */}
        <div className="flex items-baseline gap-1 mt-0.5">
          <span
            className={cn(
              "text-[44px] sm:text-[48px] font-black tracking-tight leading-none font-mono drop-shadow-2xs",
              statusTheme.textColor
            )}
          >
            {displayTemperatureString}
          </span>
          <span className="text-2xl font-black text-slate-400 dark:text-slate-500 font-sans">
            °C
          </span>
        </div>
      </div>

      {/* ── 3. RIGHT SIDE: Placement of Humidity, Max, and Min (No Background Boxes) ── */}
      <div className="flex flex-col gap-3 justify-center shrink-0 min-w-[124px]">
        {/* Metric 1: Humidity */}
        <div className="flex items-center gap-2.5">
          <Droplets className="h-5 w-5 text-[#0089FF] shrink-0" />
          <div className="flex flex-col min-w-0 leading-tight">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Humidity
            </span>
            <span className="text-[16px] font-bold text-slate-800 dark:text-slate-100 font-mono">
              {humidity ?? 0} <span className="text-xs font-normal text-slate-400">%RHT</span>
            </span>
          </div>
        </div>

        {/* Metric 2: Max Temperature */}
        <div className="flex items-center gap-2.5">
          <TrendingUp className="h-5 w-5 text-rose-500 shrink-0" />
          <div className="flex flex-col min-w-0 leading-tight">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Max Temp
            </span>
            <span className="text-[16px] font-bold text-rose-600 dark:text-rose-400 font-mono">
              {maxTemp ?? 0} <span className="text-xs font-normal text-slate-400">°C</span>
            </span>
          </div>
        </div>

        {/* Metric 3: Min Temperature */}
        <div className="flex items-center gap-2.5">
          <TrendingDown className="h-5 w-5 text-emerald-500 shrink-0" />
          <div className="flex flex-col min-w-0 leading-tight">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Min Temp
            </span>
            <span className="text-[16px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {minTemp ?? 0} <span className="text-xs font-normal text-slate-400">°C</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
