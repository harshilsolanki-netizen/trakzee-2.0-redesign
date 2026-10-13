import React, { useState } from "react";
import {
  Disc,
  Gauge,
  Thermometer,
  Zap,
  Plus,
  Wrench,
  AlertTriangle,
  RotateCw,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { type FleetObject } from "@/data/fleet";
import { TpmsIcon } from "./AutomotiveIcons";

interface TireData {
  id: string; // e.g. "FL0", "1L1"
  label: string;
  psi: number;
  tempC: number;
  voltage: number;
  distanceKm: number;
  wearPercent: number;
  status: "normal" | "warning" | "alert";
}

interface AxleGroup {
  id: string;
  title: string;
  tires: TireData[];
}

const DEFAULT_AXLES: AxleGroup[] = [
  {
    id: "front",
    title: "Front Axle",
    tires: [
      {
        id: "FL0",
        label: "Front Left",
        psi: 108,
        tempC: 30,
        voltage: 3.272,
        distanceKm: 42350,
        wearPercent: 94,
        status: "normal",
      },
      {
        id: "FR0",
        label: "Front Right",
        psi: 115,
        tempC: 31,
        voltage: 3.269,
        distanceKm: 42350,
        wearPercent: 92,
        status: "normal",
      },
    ],
  },
  {
    id: "axle1",
    title: "Axle 1",
    tires: [
      {
        id: "1L1",
        label: "Axle 1 Outer Left",
        psi: 114,
        tempC: 42,
        voltage: 3.296,
        distanceKm: 58120,
        wearPercent: 88,
        status: "normal",
      },
      {
        id: "1L0",
        label: "Axle 1 Inner Left",
        psi: 102,
        tempC: 38,
        voltage: 3.3,
        distanceKm: 58120,
        wearPercent: 89,
        status: "normal",
      },
      {
        id: "1R0",
        label: "Axle 1 Inner Right",
        psi: 118,
        tempC: 33,
        voltage: 3.288,
        distanceKm: 58120,
        wearPercent: 86,
        status: "normal",
      },
      {
        id: "1R1",
        label: "Axle 1 Outer Right",
        psi: 116,
        tempC: 38,
        voltage: 3.29,
        distanceKm: 58120,
        wearPercent: 87,
        status: "normal",
      },
    ],
  },
  {
    id: "axle2",
    title: "Axle 2",
    tires: [
      {
        id: "2L1",
        label: "Axle 2 Outer Left",
        psi: 112,
        tempC: 40,
        voltage: 3.29,
        distanceKm: 31400,
        wearPercent: 95,
        status: "normal",
      },
      {
        id: "2L0",
        label: "Axle 2 Inner Left",
        psi: 104,
        tempC: 37,
        voltage: 3.295,
        distanceKm: 31400,
        wearPercent: 94,
        status: "normal",
      },
      {
        id: "2R0",
        label: "Axle 2 Inner Right",
        psi: 115,
        tempC: 35,
        voltage: 3.285,
        distanceKm: 31400,
        wearPercent: 93,
        status: "normal",
      },
      {
        id: "2R1",
        label: "Axle 2 Outer Right",
        psi: 113,
        tempC: 39,
        voltage: 3.292,
        distanceKm: 31400,
        wearPercent: 94,
        status: "normal",
      },
    ],
  },
  {
    id: "axle3",
    title: "Axle 3",
    tires: [
      {
        id: "3L1",
        label: "Axle 3 Outer Left",
        psi: 110,
        tempC: 39,
        voltage: 3.288,
        distanceKm: 24180,
        wearPercent: 97,
        status: "normal",
      },
      {
        id: "3L0",
        label: "Axle 3 Inner Left",
        psi: 105,
        tempC: 36,
        voltage: 3.291,
        distanceKm: 24180,
        wearPercent: 96,
        status: "normal",
      },
      {
        id: "3R0",
        label: "Axle 3 Inner Right",
        psi: 116,
        tempC: 34,
        voltage: 3.286,
        distanceKm: 24180,
        wearPercent: 95,
        status: "normal",
      },
      {
        id: "3R1",
        label: "Axle 3 Outer Right",
        psi: 112,
        tempC: 38,
        voltage: 3.289,
        distanceKm: 24180,
        wearPercent: 96,
        status: "normal",
      },
    ],
  },
];

export function TpmsDrawerCards({
  vehicle,
  onClose,
}: {
  vehicle: FleetObject;
  onClose?: () => void;
}) {
  const [activeMode, setActiveMode] = useState<"tpms" | "distance">("tpms");
  const [selectedTireId, setSelectedTireId] = useState<string | null>(null);

  // Helper to render realistic truck tire with chevron treads
  const renderTireSvg = (
    tireId: string,
    x: number,
    y: number,
    width = 11,
    height = 25
  ) => {
    const isSelected = selectedTireId === tireId;
    const tire = DEFAULT_AXLES.flatMap((a) => a.tires).find((t) => t.id === tireId);
    const isAlert = tire?.status === "alert";
    const isWarning = tire?.status === "warning";

    const treadColor = isAlert ? "#EF4444" : isWarning ? "#F59E0B" : "#10B981";

    return (
      <g
        key={tireId}
        className="cursor-pointer transition-all duration-150"
        onClick={() => setSelectedTireId((prev) => (prev === tireId ? null : tireId))}
      >
        {/* Tire Body */}
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={2.5}
          fill={isSelected ? "#0089FF" : "#1E293B"}
          stroke={isSelected ? "#0089FF" : "#0F172A"}
          strokeWidth={isSelected ? 1.5 : 1}
        />
        {/* Left Side Tread Marks */}
        <line x1={x + 1} y1={y + 4} x2={x + 4} y2={y + 6} stroke={treadColor} strokeWidth={1.2} />
        <line x1={x + 1} y1={y + 9} x2={x + 4} y2={y + 11} stroke={treadColor} strokeWidth={1.2} />
        <line x1={x + 1} y1={y + 14} x2={x + 4} y2={y + 16} stroke={treadColor} strokeWidth={1.2} />
        <line x1={x + 1} y1={y + 19} x2={x + 4} y2={y + 21} stroke={treadColor} strokeWidth={1.2} />
        {/* Right Side Tread Marks */}
        <line x1={x + width - 1} y1={y + 4} x2={x + width - 4} y2={y + 6} stroke={treadColor} strokeWidth={1.2} />
        <line x1={x + width - 1} y1={y + 9} x2={x + width - 4} y2={y + 11} stroke={treadColor} strokeWidth={1.2} />
        <line x1={x + width - 1} y1={y + 14} x2={x + width - 4} y2={y + 16} stroke={treadColor} strokeWidth={1.2} />
        <line x1={x + width - 1} y1={y + 19} x2={x + width - 4} y2={y + 21} stroke={treadColor} strokeWidth={1.2} />
      </g>
    );
  };

  const handleOperationClick = () => {
    toast.info("Tire Calibration & Rotation Operations", {
      description: "TPMS sensor pairing and threshold adjustments active.",
    });
  };

  return (
    <div className="space-y-2 select-none">
      {/* ── CARD 1: TPMS Chassis Visualizer Card ── */}
      <div className="w-[220px] shrink-0 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md overflow-hidden text-xs">
        {/* Card Header */}
        <div className="flex h-[39px] items-center justify-between px-[10px] py-[8px] bg-white dark:bg-slate-900 border-b border-[#F1F5F9] dark:border-slate-800">
          <div className="flex items-center gap-[6px] min-w-0">
            <TpmsIcon className="h-4 w-4 text-[#0089FF] shrink-0" />
            <h3 className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 tracking-[-0.3px] truncate">
              TPMS
            </h3>
          </div>
        </div>

        {/* Chassis Axles Graphic View matching Reference Screenshot 1:1 */}
        <div className="p-3 bg-white dark:bg-slate-900 flex flex-col items-center">
          <div className="relative w-full h-[148px] flex items-center justify-center">
            <svg
              viewBox="0 0 170 148"
              className="w-full h-full max-w-[170px]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Central Chassis Frame Beam */}
              <rect x="82.5" y="6" width="5" height="136" rx="2.5" fill="#94A3B8" />

              {/* Front Axle (Single Tires: FL0, FR0) */}
              <rect x="42" y="19" width="86" height="3" rx="1.5" fill="#CBD5E1" />
              <circle cx="85" cy="20.5" r="4.5" fill="#64748B" stroke="#94A3B8" strokeWidth="1" />
              {renderTireSvg("FL0", 31, 8)}
              {renderTireSvg("FR0", 128, 8)}

              {/* Axle 1 (Dual Tires: 1L1, 1L0, 1R0, 1R1) */}
              <rect x="24" y="55" width="122" height="3" rx="1.5" fill="#CBD5E1" />
              <circle cx="85" cy="56.5" r="4.5" fill="#64748B" stroke="#94A3B8" strokeWidth="1" />
              {renderTireSvg("1L1", 13, 44)}
              {renderTireSvg("1L0", 26, 44)}
              {renderTireSvg("1R0", 133, 44)}
              {renderTireSvg("1R1", 146, 44)}

              {/* Axle 2 (Dual Tires: 2L1, 2L0, 2R0, 2R1) */}
              <rect x="24" y="91" width="122" height="3" rx="1.5" fill="#CBD5E1" />
              <circle cx="85" cy="92.5" r="4.5" fill="#64748B" stroke="#94A3B8" strokeWidth="1" />
              {renderTireSvg("2L1", 13, 80)}
              {renderTireSvg("2L0", 26, 80)}
              {renderTireSvg("2R0", 133, 80)}
              {renderTireSvg("2R1", 146, 80)}

              {/* Axle 3 (Dual Tires: 3L1, 3L0, 3R0, 3R1) */}
              <rect x="24" y="127" width="122" height="3" rx="1.5" fill="#CBD5E1" />
              <circle cx="85" cy="128.5" r="4.5" fill="#64748B" stroke="#94A3B8" strokeWidth="1" />
              {renderTireSvg("3L1", 13, 116)}
              {renderTireSvg("3L0", 26, 116)}
              {renderTireSvg("3R0", 133, 116)}
              {renderTireSvg("3R1", 146, 116)}
            </svg>
          </div>
        </div>

        {/* Bottom Action CTA Bar (#F4F5F7) matching reference image media_1791890550287_73733398.png 1:1 */}
        <div className="bg-[#F4F5F7] dark:bg-slate-800/60 border-t border-slate-200/80 dark:border-slate-800 px-1.5 h-[34px] flex items-center justify-center rounded-b-xl">
          <button
            type="button"
            onClick={handleOperationClick}
            className="w-full h-[26px] rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1.5 font-bold text-xs"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.2]" />
            <span>Operation</span>
          </button>
        </div>
      </div>

      {/* ── STANDALONE MODE SELECTOR TABS: TPMS vs Distance ── */}
      <div className="w-[220px] shrink-0 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 grid grid-cols-2 gap-1 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveMode("tpms")}
          className={cn(
            "h-7 rounded-lg text-[12px] font-semibold transition-all cursor-pointer flex items-center justify-center",
            activeMode === "tpms"
              ? "bg-[#0089FF] text-white shadow-xs font-bold"
              : "bg-white dark:bg-slate-900 text-[#45556C] dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-slate-700 shadow-2xs"
          )}
        >
          TPMS
        </button>
        <button
          type="button"
          onClick={() => setActiveMode("distance")}
          className={cn(
            "h-7 rounded-lg text-[12px] font-semibold transition-all cursor-pointer flex items-center justify-center",
            activeMode === "distance"
              ? "bg-[#0089FF] text-white shadow-xs font-bold"
              : "bg-white dark:bg-slate-900 text-[#45556C] dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-slate-700 shadow-2xs"
          )}
        >
          Distance
        </button>
      </div>

      {/* ── CARDS 2..5: Front Axle & Axles 1..3 Cards ── */}
      {DEFAULT_AXLES.map((axle) => (
        <div
          key={axle.id}
          className="w-[220px] shrink-0 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md overflow-hidden text-xs transition-all"
        >
          {/* Axle Title Header (without tire count) */}
          <div className="flex h-[36px] items-center justify-between px-3 bg-white dark:bg-slate-900 border-b border-[#F1F5F9] dark:border-slate-800">
            <h4 className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100">
              {axle.title}
            </h4>
          </div>

          {/* Metric Column Header Row with the 4 Icons matching Screenshot */}
          <div className="grid grid-cols-4 px-2 py-1.5 bg-[#FAFAFA]/70 dark:bg-slate-950/60 border-b border-[#F1F5F9] dark:border-slate-800 text-[#64748B] text-center items-center">
            {/* Column 1: Wheel icon */}
            <div className="flex items-center justify-center" title="Tire ID">
              <Disc className="h-3.5 w-3.5 text-[#64748B]" />
            </div>
            {/* Column 2: Pressure Gauge or Distance */}
            <div className="flex items-center justify-center" title={activeMode === "tpms" ? "Pressure (psi)" : "Distance (km)"}>
              <Gauge className="h-3.5 w-3.5 text-[#64748B]" />
            </div>
            {/* Column 3: Thermometer or Wear */}
            <div className="flex items-center justify-center" title={activeMode === "tpms" ? "Temperature (°C)" : "Wear (%)"}>
              <Thermometer className="h-3.5 w-3.5 text-[#64748B]" />
            </div>
            {/* Column 4: Battery Voltage */}
            <div className="flex items-center justify-center" title="Sensor Voltage (V)">
              <Zap className="h-3.5 w-3.5 text-[#64748B]" />
            </div>
          </div>

          {/* Tires List in this Axle */}
          <div className="divide-y divide-[#F1F5F9] dark:divide-slate-800 bg-white dark:bg-slate-900">
            {axle.tires.map((tire) => {
              const isSelected = selectedTireId === tire.id;

              return (
                <div
                  key={tire.id}
                  onClick={() =>
                    setSelectedTireId((prev) => (prev === tire.id ? null : tire.id))
                  }
                  className={cn(
                    "grid grid-cols-4 px-2 py-1.5 items-center text-center transition-colors cursor-pointer",
                    isSelected
                      ? "bg-sky-50/80 dark:bg-sky-950/40 text-[#0089FF]"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  )}
                >
                  {/* Tire Position Code (Label: 11px font-normal) */}
                  <span
                    className={cn(
                      "text-[11px] leading-[15px] font-mono",
                      isSelected
                        ? "text-[#0089FF] font-semibold"
                        : "text-[#45556C] dark:text-slate-400 font-normal"
                    )}
                  >
                    {tire.id}
                  </span>

                  {/* Pressure (psi) or Distance (Value: 12px font-semibold) */}
                  <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 tabular-nums leading-[16px]">
                    {activeMode === "tpms"
                      ? `${tire.psi} psi`
                      : `${(tire.distanceKm / 1000).toFixed(1)}k km`}
                  </span>

                  {/* Temperature (°C) or Wear (Value: 12px font-semibold) */}
                  <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 tabular-nums leading-[16px]">
                    {activeMode === "tpms" ? `${tire.tempC} °C` : `${tire.wearPercent}%`}
                  </span>

                  {/* Sensor Battery Voltage (V) (Value: 12px font-semibold) */}
                  <span className="text-[12px] font-semibold text-[#0F172B] dark:text-slate-100 tabular-nums leading-[16px]">
                    {tire.voltage} V
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
