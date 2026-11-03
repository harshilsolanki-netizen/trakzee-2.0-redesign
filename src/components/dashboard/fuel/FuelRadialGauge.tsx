import React, { useMemo, useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { getFuelStatus } from "@/data/fuelDashboardData";

interface FuelRadialGaugeProps {
  currentFuel: number; // in Liters
  capacity: number; // in Liters
  fuelType?: "Diesel" | "Petrol";
  className?: string;
  onCalibrateClick?: () => void;
}

export function FuelRadialGauge({
  currentFuel,
  capacity,
  fuelType = "Petrol",
  className,
  onCalibrateClick,
}: FuelRadialGaugeProps) {
  // SVG Geometry - scaled up proportionally to match Temperature gauge presence & card size
  const width = 340;
  const height = 185;
  const cx = 170;
  const cy = 104;
  const radius = 94;
  const strokeWidth = 10;

  const startAngle = 140; // Bottom-left (in degrees)
  const totalSweep = 260; // Sweeps clockwise 260° to 400° (bottom-right)

  // 1. Smooth animated value from 0 to currentFuel
  const [animatedFuel, setAnimatedFuel] = useState(0);
  const startRef = useRef(0);
  const targetRef = useRef(currentFuel);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = animatedFuel;
    targetRef.current = currentFuel;
    startTimeRef.current = null;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const duration = 1000; // ms

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(progress);

      const nextVal =
        startRef.current + (targetRef.current - startRef.current) * eased;
      setAnimatedFuel(nextVal);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setAnimatedFuel(targetRef.current);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [currentFuel]);

  const currentStatus = getFuelStatus(animatedFuel, capacity);
  const percentage = Math.min(100, Math.max(0, (animatedFuel / capacity) * 100));
  const progressRatio = Math.min(1, Math.max(0, animatedFuel / capacity));

  // Current needle rotation angle around (cx, cy)
  const currentNeedleAngle = startAngle + progressRatio * totalSweep;

  // Arc path: static path spanning 260° from 140° to 400°
  const fullArcPath = useMemo(() => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = ((startAngle + totalSweep) * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 1 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  }, [cx, cy, radius, startAngle, totalSweep]);

  // Total perimeter length of the 260° arc
  const arcLength = useMemo(() => {
    return 2 * Math.PI * radius * (totalSweep / 360);
  }, [radius, totalSweep]);

  // Bug-free strokeDashoffset animation: smoothly fills the arc without geometric clipping
  const strokeDashoffset = arcLength * (1 - progressRatio);

  // Ticks along the arc: 6 major ticks with scale numbers, plus minor tick marks
  const { majorTicks, minorTicks } = useMemo(() => {
    const majors: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      labelX: number;
      labelY: number;
      val: number;
    }[] = [];
    const minors: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }[] = [];

    const segments = 5;
    const subSegments = 4;
    const totalDivisions = segments * subSegments;

    const rOuter = radius - strokeWidth / 2 - 2;
    const rMajorInner = rOuter - 9;
    const rMinorInner = rOuter - 5;
    const rLabel = rOuter - 20;

    for (let i = 0; i <= totalDivisions; i++) {
      const frac = i / totalDivisions;
      const deg = startAngle + frac * totalSweep;
      const rad = (deg * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);

      const isMajor = i % subSegments === 0;

      if (isMajor) {
        const majorFrac = i / totalDivisions;
        const val = Math.round(capacity * majorFrac);
        majors.push({
          x1: cx + rMajorInner * cos,
          y1: cy + rMajorInner * sin,
          x2: cx + rOuter * cos,
          y2: cy + rOuter * sin,
          labelX: cx + rLabel * cos,
          labelY: cy + rLabel * sin + 4.2,
          val,
        });
      } else {
        minors.push({
          x1: cx + rMinorInner * cos,
          y1: cy + rMinorInner * sin,
          x2: cx + rOuter * cos,
          y2: cy + rOuter * sin,
        });
      }
    }
    return { majorTicks: majors, minorTicks: minors };
  }, [cx, cy, radius, strokeWidth, startAngle, totalSweep, capacity]);

  // Needle drawn pointing along angle 0 (rightwards), then rotated around (cx, cy)
  const needleLength = radius - 5;
  const needlePath = `M ${cx + needleLength} ${cy} L ${cx + 6} ${cy - 4} L ${cx - 9} ${cy} L ${cx + 6} ${cy + 4} Z`;

  const gradientId = useMemo(
    () => `fuel-grad-${Math.random().toString(36).substring(2, 9)}`,
    []
  );

  return (
    <div
      className={cn(
        "relative flex flex-col items-center select-none w-full",
        className
      )}
      onClick={onCalibrateClick}
    >
      {/* 1. Self-contained Dial SVG */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-[270px] xl:max-w-[310px] max-h-[145px] overflow-visible"
        aria-label={`Fuel level: ${Math.round(animatedFuel)} of ${capacity} L`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00B4D8" />
            <stop offset="60%" stopColor="#0089FF" />
            <stop offset="100%" stopColor="#0066CC" />
          </linearGradient>
        </defs>

        {/* Background Track */}
        <path
          d={fullArcPath}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="text-slate-100 dark:text-slate-800"
        />

        {/* Smooth Animated Progress Arc via strokeDasharray */}
        <path
          d={fullArcPath}
          fill="none"
          stroke={
            currentStatus.status === "critical"
              ? "#EF4444"
              : currentStatus.status === "warning"
              ? "#F59E0B"
              : `url(#${gradientId})`
          }
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={strokeDashoffset}
        />

        {/* Minor Graduation Ticks */}
        {minorTicks.map((tick, i) => (
          <line
            key={`min-${i}`}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke="currentColor"
            strokeWidth={1}
            className="text-slate-200 dark:text-slate-700"
          />
        ))}

        {/* Major Ticks & Scale Numbers (Positioned Safely Inside the Arc) */}
        {majorTicks.map((tick, i) => (
          <g key={`maj-${i}`}>
            <line
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke="currentColor"
              strokeWidth={1.6}
              className="text-slate-400 dark:text-slate-500"
            />
            <text
              x={tick.labelX}
              y={tick.labelY}
              fontSize="11.5"
              fontWeight="600"
              textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-400 font-sans select-none"
            >
              {tick.val}
            </text>
          </g>
        ))}

        {/* Center Fuel Type Label (Petrol / Diesel) */}
        <text
          x={cx}
          y={cy + 28}
          fontSize="12"
          fontWeight="700"
          textAnchor="middle"
          className="fill-slate-600 dark:fill-slate-300 uppercase tracking-widest font-sans select-none"
        >
          {fuelType}
        </text>

        {/* Animated Needle Pointer Rotating Smoothly Around (cx, cy) */}
        <g transform={`rotate(${currentNeedleAngle}, ${cx}, ${cy})`}>
          <path
            d={needlePath}
            fill={currentStatus.color}
            stroke="#ffffff"
            strokeWidth={0.8}
            className="drop-shadow-xs"
          />
        </g>

        {/* Center Hub & Pin */}
        <circle
          cx={cx}
          cy={cy}
          r={7}
          fill={currentStatus.color}
          stroke="#ffffff"
          strokeWidth={1.5}
          className="drop-shadow-xs"
        />
        <circle cx={cx} cy={cy} r={2.5} fill="#ffffff" />
      </svg>

      {/* 2. Fuel Readout Section: Positioned Below Dial, matching Temperature Readout */}
      <div className="flex flex-col items-center mt-1 select-none">
        <div className="flex items-baseline gap-1">
          <span
            className="text-[30px] sm:text-[34px] xl:text-[38px] font-black tracking-tight font-sans transition-colors duration-200"
            style={{ color: currentStatus.color }}
          >
            {Math.round(animatedFuel)}
          </span>
          <span className="text-sm sm:text-base font-bold text-slate-400 dark:text-slate-500 font-sans">
            /{capacity}L
          </span>
        </div>
      </div>
    </div>
  );
}
