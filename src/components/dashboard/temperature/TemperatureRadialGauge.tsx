import React, { useMemo, useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { getTemperatureStatus } from "@/data/temperatureDashboardData";

interface TemperatureRadialGaugeProps {
  temperature: number;
  sensorName?: string;
  minScale?: number;
  maxScale?: number;
  className?: string;
  onSensorClick?: () => void;
}

export function TemperatureRadialGauge({
  temperature,
  sensorName = "BLE Temperature 1",
  minScale = -20,
  maxScale = 70,
  className,
  onSensorClick,
}: TemperatureRadialGaugeProps) {
  // SVG Geometry - Large, prominent automotive-grade instrument dial
  const width = 380;
  const height = 192;
  const cx = 190;
  const cy = 168;
  const radius = 148;
  const strokeWidth = 12;

  // 1. Smooth animated temperature value from 0 to target temperature
  const [animatedTemp, setAnimatedTemp] = useState(0);
  const startTempRef = useRef(0);
  const targetTempRef = useRef(temperature);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    startTempRef.current = animatedTemp;
    targetTempRef.current = temperature;
    startTimeRef.current = null;

    // Smooth cubic ease-out for natural tachometer needle deceleration
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const duration = 950; // ms

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

  // Display temperature formatted string (counts up in sync with needle)
  const displayTemperatureString = useMemo(() => {
    const hasDecimal = temperature % 1 !== 0;
    return hasDecimal
      ? animatedTemp.toFixed(1)
      : Math.round(animatedTemp).toString();
  }, [animatedTemp, temperature]);

  // Status color based on current animated temperature
  const currentStatus = getTemperatureStatus(animatedTemp);

  // 2. Arc paths: strictly 180° to 360° (left to right upper semicircle)
  const arcPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;
  const outerRingPath = `M ${cx - radius - 7} ${cy} A ${radius + 7} ${radius + 7} 0 0 1 ${cx + radius + 7} ${cy}`;
  const innerTrackPath = `M ${cx - radius + 19} ${cy} A ${radius - 19} ${radius - 19} 0 0 1 ${cx + radius - 19} ${cy}`;

  // Clamped progress between 0 and 1
  const clampedTemp = Math.max(minScale, Math.min(maxScale, animatedTemp));
  const progressRatio = (clampedTemp - minScale) / (maxScale - minScale);

  // Dynamic progress arc path
  const progressArcLength = Math.PI * radius;
  const strokeDashoffset = progressArcLength * (1 - progressRatio);

  // 3. Mathematical needle rotation angle: smoothly sweeps 180° (Low) to 360° (High)
  const needleRotationAngle = 180 + progressRatio * 180;

  // 4. Tachometer Graduations: Major checkpoints with scale numbers + precision minor ticks
  const { ticks, scaleLabels } = useMemo(() => {
    const tickList: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      isMajor: boolean;
    }[] = [];

    const labelList: {
      x: number;
      y: number;
      val: string;
    }[] = [];

    const totalDivisions = 36; // Every 5° for high engineering precision
    const tickOuterRadius = radius - 11;

    for (let i = 0; i <= totalDivisions; i++) {
      const frac = i / totalDivisions;
      const deg = 180 + frac * 180;
      const rad = (deg * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);

      const isMajor = i % 9 === 0; // 0, 9, 18, 27, 36 (5 key checkpoints)
      const isSubMajor = i % 3 === 0 && !isMajor;
      const len = isMajor ? 11 : isSubMajor ? 7 : 4;

      tickList.push({
        x1: cx + (tickOuterRadius - len) * cos,
        y1: cy + (tickOuterRadius - len) * sin,
        x2: cx + tickOuterRadius * cos,
        y2: cy + tickOuterRadius * sin,
        isMajor: isMajor || isSubMajor,
      });

      // Scale value numbers on major checkpoints (-20, 0, 25, 50, 70)
      if (isMajor) {
        const valNum = Math.round(minScale + frac * (maxScale - minScale));
        const rText = tickOuterRadius - 20;
        labelList.push({
          x: cx + rText * cos,
          y: cy + rText * sin + 4,
          val: `${valNum}°`,
        });
      }
    }
    return { ticks: tickList, scaleLabels: labelList };
  }, [cx, cy, radius, minScale, maxScale]);

  // Unique gradient ID per gauge to avoid clash
  const gradientId = useMemo(
    () => `gauge-grad-${Math.random().toString(36).substring(2, 9)}`,
    []
  );

  return (
    <div
      className={cn(
        "relative flex flex-col items-center select-none w-full",
        className
      )}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-[390px] sm:max-w-[420px] h-[178px] sm:h-[188px] overflow-visible"
        aria-label={`Temperature gauge: ${displayTemperatureString} °C`}
      >
        <defs>
          {/* Vivid, high-contrast gradient arc stops */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00B4D8" />
            <stop offset="20%" stopColor="#06D6A0" />
            <stop offset="45%" stopColor="#10B981" />
            <stop offset="68%" stopColor="#F59E0B" />
            <stop offset="85%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>

          {/* Crisp needle drop shadow */}
          <filter id={`needle-shadow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* 1. Subtle Outer Dashed Haloring for Tachometer Depth */}
        <path
          d={outerRingPath}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeDasharray="2 4"
          className="text-slate-300/80 dark:text-slate-700/60"
        />

        {/* 2. Base Background Arc Track (Muted Dark/Light Bezel) */}
        <path
          d={arcPath}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="text-slate-100 dark:text-slate-800"
        />

        {/* 3. Full Vibrant Gradient Arc (Crisp & High-Contrast Zones) */}
        <path
          d={arcPath}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={0.35}
        />

        {/* 4. Dynamic Active Glow Arc filled up to current temperature */}
        <path
          d={arcPath}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={progressArcLength}
          strokeDashoffset={strokeDashoffset}
        />

        {/* 5. Inner Concentric Guide Track */}
        <path
          d={innerTrackPath}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          className="text-slate-200/90 dark:text-slate-800/80"
        />

        {/* 6. Precision Graduation Ticks */}
        {ticks.map((tick, i) => (
          <line
            key={i}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke="currentColor"
            strokeWidth={tick.isMajor ? 1.6 : 0.9}
            className={
              tick.isMajor
                ? "text-slate-400 dark:text-slate-500"
                : "text-slate-300/80 dark:text-slate-700/80"
            }
          />
        ))}

        {/* 7. Key Scale Temperature Numbers (-20°, 0°, 25°, 50°, 70°) */}
        {scaleLabels.map((lbl, i) => (
          <text
            key={i}
            x={lbl.x}
            y={lbl.y}
            fontSize="11"
            fontWeight="700"
            textAnchor="middle"
            className="fill-slate-500 dark:fill-slate-400 font-mono select-none"
          >
            {lbl.val}
          </text>
        ))}

        {/* 8. Authentic Instrument Gauge Needle with Pivot Hub & Counterweight */}
        <g
          transform={`rotate(${needleRotationAngle}, ${cx}, ${cy})`}
          filter={`url(#needle-shadow-${gradientId})`}
        >
          {/* Counterweight Tail */}
          <path
            d={`M ${cx + 78} ${cy - 2.2} L ${cx + 94} ${cy - 3.8} L ${cx + 94} ${cy + 3.8} L ${cx + 78} ${cy + 2.2} Z`}
            fill={currentStatus.color}
          />
          {/* Tapered Blade Lower Facet */}
          <path
            d={`M ${cx + 94} ${cy} L ${cx + 150} ${cy} L ${cx + 94} ${cy + 3.8} Z`}
            fill={currentStatus.color}
          />
          {/* Tapered Blade Upper Facet (Metallic Light Sheen) */}
          <path
            d={`M ${cx + 94} ${cy - 3.8} L ${cx + 150} ${cy} L ${cx + 94} ${cy} Z`}
            fill={currentStatus.color}
          />
          <path
            d={`M ${cx + 94} ${cy - 3.8} L ${cx + 150} ${cy} L ${cx + 94} ${cy} Z`}
            fill="#ffffff"
            opacity={0.35}
          />
          {/* Razor-Crisp White Needle Outline */}
          <path
            d={`M ${cx + 78} ${cy - 2.2} L ${cx + 94} ${cy - 3.8} L ${cx + 150} ${cy} L ${cx + 94} ${cy + 3.8} L ${cx + 78} ${cy + 2.2} Z`}
            fill="none"
            stroke="#ffffff"
            strokeWidth={0.8}
          />
          {/* Center Spine Highlight Line */}
          <line
            x1={cx + 94}
            y1={cy}
            x2={cx + 149}
            y2={cy}
            stroke="#ffffff"
            strokeWidth={1}
            strokeLinecap="round"
            opacity={0.9}
          />
          {/* Precision Pivot Hub & Center Jewel Pin */}
          <circle
            cx={cx + 94}
            cy={cy}
            r={6}
            fill={currentStatus.color}
            stroke="#ffffff"
            strokeWidth={1.5}
          />
          <circle cx={cx + 94} cy={cy} r={2.2} fill="#ffffff" />
        </g>

        {/* 9. Scale Boundary Labels (Low / High) */}
        <text
          x={cx - radius + 5}
          y={cy + 20}
          fontSize="13"
          fontWeight="800"
          fill="#00B4D8"
          textAnchor="middle"
          className="font-sans select-none tracking-wide"
        >
          Low
        </text>
        <text
          x={cx + radius - 5}
          y={cy + 20}
          fontSize="13"
          fontWeight="800"
          fill="#EF4444"
          textAnchor="middle"
          className="font-sans select-none tracking-wide"
        >
          High
        </text>
      </svg>

      {/* 10. Center Temperature Readout with Status Pulse (Positioned Safely Inside Arc) */}
      <div className="-mt-[88px] flex flex-col items-center z-10 select-none pb-2">
        <div className="flex items-baseline gap-1">
          <span
            className="text-[40px] sm:text-[44px] font-black tracking-tight font-sans transition-colors duration-200 leading-none"
            style={{ color: currentStatus.color }}
          >
            {displayTemperatureString}
          </span>
          <span
            className="text-lg sm:text-xl font-extrabold font-sans transition-colors duration-200"
            style={{ color: currentStatus.color }}
          >
            °C
          </span>
        </div>

        {/* Sensor Name Pill Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onSensorClick) onSensorClick();
          }}
          className={cn(
            "mt-1 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold tracking-tight transition-all",
            "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer shadow-2xs active:scale-95"
          )}
          title="Click to switch connected sensor"
        >
          <span
            className="h-2 w-2 rounded-full transition-colors duration-200"
            style={{ backgroundColor: currentStatus.color }}
          />
          <span>{sensorName}</span>
        </button>
      </div>
    </div>
  );
}
