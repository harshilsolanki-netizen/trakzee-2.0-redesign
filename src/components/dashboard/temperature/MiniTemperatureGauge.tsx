import React, { useMemo } from "react";
import { Droplets, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type TemperatureSensorData,
  getTemperatureStatus,
} from "@/data/temperatureDashboardData";

interface MiniTemperatureGaugeProps {
  sensor: TemperatureSensorData;
  className?: string;
  onClick?: () => void;
}

export function MiniTemperatureGauge({
  sensor,
  className,
  onClick,
}: MiniTemperatureGaugeProps) {
  const currentStatus = getTemperatureStatus(sensor.temperature);

  // SVG Geometry for crisp, proportional mini dial
  const width = 160;
  const height = 80;
  const cx = 80;
  const cy = 72;
  const radius = 54;
  const strokeWidth = 6;

  const minScale = -20;
  const maxScale = 70;
  const clampedTemp = Math.max(minScale, Math.min(maxScale, sensor.temperature));
  const progressRatio = (clampedTemp - minScale) / (maxScale - minScale);

  // Semicircle arc: 180° to 360°
  const arcPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;
  const arcLength = Math.PI * radius;
  const strokeDashoffset = arcLength * (1 - progressRatio);

  // Needle angle: 180° (Low) to 360° (High)
  const needleAngle = 180 + progressRatio * 180;

  // 16 Division ticks
  const ticks = useMemo(() => {
    const list: { x1: number; y1: number; x2: number; y2: number; isMajor: boolean }[] = [];
    const count = 16;
    for (let i = 0; i <= count; i++) {
      const frac = i / count;
      const deg = 180 + frac * 180;
      const rad = (deg * Math.PI) / 180;
      const isMajor = i % 4 === 0;
      const rOuter = radius - 5;
      const rInner = rOuter - (isMajor ? 5 : 2.5);
      list.push({
        x1: cx + rInner * Math.cos(rad),
        y1: cy + rInner * Math.sin(rad),
        x2: cx + rOuter * Math.cos(rad),
        y2: cy + rOuter * Math.sin(rad),
        isMajor,
      });
    }
    return list;
  }, [cx, cy, radius]);

  const gradientId = useMemo(
    () => `mini-grad-${Math.random().toString(36).substring(2, 9)}`,
    []
  );

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col justify-between rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-2 transition-all hover:border-[#0089FF]/60 hover:shadow-xs cursor-pointer select-none",
        className
      )}
    >
      {/* 1. Header: Status Dot + Sensor Name (matching Image 1 right card) */}
      <div className="flex items-center gap-1.5 px-0.5">
        <span
          className="h-2 w-2 rounded-full shrink-0"
          style={{ backgroundColor: currentStatus.color }}
        />
        <span className="text-[11.5px] font-bold text-slate-800 dark:text-slate-100 truncate font-sans tracking-tight">
          {sensor.name}
        </span>
      </div>

      {/* 2. Mini Semicircle Gauge with Crisp Centered Readout */}
      <div className="relative flex flex-col items-center justify-center my-0.5">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[145px] h-[64px] overflow-visible"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00B4D8" />
              <stop offset="35%" stopColor="#10B981" />
              <stop offset="70%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>

          {/* Background Arc Track */}
          <path
            d={arcPath}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="text-slate-100 dark:text-slate-800"
          />

          {/* Active Gradient Arc */}
          <path
            d={arcPath}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
          />

          {/* Precision Ticks */}
          {ticks.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="currentColor"
              strokeWidth={t.isMajor ? 1 : 0.6}
              className={t.isMajor ? "text-slate-400 dark:text-slate-500" : "text-slate-200 dark:text-slate-700"}
            />
          ))}

          {/* Mini Pointer Needle */}
          <g transform={`rotate(${needleAngle}, ${cx}, ${cy})`}>
            {/* Tapered needle blade */}
            <path
              d={`M ${cx + 32} ${cy - 1.8} L ${cx + radius + 1} ${cy} L ${cx + 32} ${cy + 1.8} Z`}
              fill={currentStatus.color}
              stroke="#ffffff"
              strokeWidth={0.6}
            />
            {/* Pivot pin */}
            <circle cx={cx + 32} cy={cy} r={3} fill={currentStatus.color} stroke="#ffffff" strokeWidth={1} />
          </g>

          {/* Low / High Labels */}
          <text
            x={cx - radius + 3}
            y={cy + 7}
            fontSize="8"
            fontWeight="700"
            fill="#00B4D8"
            textAnchor="middle"
          >
            Low
          </text>
          <text
            x={cx + radius - 3}
            y={cy + 7}
            fontSize="8"
            fontWeight="700"
            fill="#EF4444"
            textAnchor="middle"
          >
            High
          </text>
        </svg>

        {/* Center Temperature Counter (Cleanly Floating Inside Arc) */}
        <div className="-mt-7 flex items-baseline gap-0.5 z-10 select-none">
          <span
            className="text-[20px] font-black font-sans leading-none tracking-tight"
            style={{ color: currentStatus.color }}
          >
            {sensor.temperature}
          </span>
          <span
            className="text-[11px] font-bold font-sans"
            style={{ color: currentStatus.color }}
          >
            °C
          </span>
        </div>
      </div>

      {/* 3. Metrics Footer: Humidity | Max | Min (Proportional, Clean Typography) */}
      <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-slate-100 dark:border-slate-800 text-center">
        {/* Humidity */}
        <div className="flex flex-col items-center leading-none">
          <div className="flex items-center gap-0.5 text-slate-800 dark:text-slate-200 font-mono font-bold text-[10px]">
            <Droplets className="h-2.5 w-2.5 text-blue-500 shrink-0" />
            <span>{sensor.humidity ?? -2}%</span>
          </div>
          <span className="text-[8px] font-semibold text-slate-400 mt-0.5">
            Humidity
          </span>
        </div>

        {/* Max */}
        <div className="flex flex-col items-center leading-none border-x border-slate-100 dark:border-slate-800 px-0.5">
          <div className="flex items-center gap-0.5 text-rose-600 dark:text-rose-400 font-mono font-bold text-[10px]">
            <TrendingUp className="h-2.5 w-2.5 text-rose-500 shrink-0" />
            <span>{sensor.maxTemp ?? 88}°</span>
          </div>
          <span className="text-[8px] font-semibold text-slate-400 mt-0.5">
            Max
          </span>
        </div>

        {/* Min */}
        <div className="flex flex-col items-center leading-none">
          <div className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[10px]">
            <TrendingDown className="h-2.5 w-2.5 text-emerald-500 shrink-0" />
            <span>{sensor.minTemp ?? 12}°</span>
          </div>
          <span className="text-[8px] font-semibold text-slate-400 mt-0.5">
            Min
          </span>
        </div>
      </div>
    </div>
  );
}
