import React, { useState } from "react";
import {
  Calendar,
  Check,
  ChevronRight,
  Database,
  FileSpreadsheet,
  FileText,
  Filter,
  Fuel,
  Info,
  Layers,
  Sparkles,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FuelReportPreview } from "./FuelReportPreview";

interface FuelReportQuestionnaireCardProps {
  initialBranch?: string;
  onGenerateReport?: (config: {
    reportType: string;
    vehicles: string;
    includeToday: boolean;
    detailLevel: "key" | "full";
    delivery: "table" | "export";
  }) => void;
}

export function FuelReportQuestionnaireCard({
  initialBranch = "all",
  onGenerateReport,
}: FuelReportQuestionnaireCardProps) {
  // Question 1: Which fuel report?
  const [reportType, setReportType] = useState<string>("fill-drain");

  // Question 2: Which vehicles?
  const [vehiclesScope, setVehiclesScope] = useState<string>(initialBranch);

  // Question 3: Should today be included in "last 15 days"?
  const [includeToday, setIncludeToday] = useState<boolean>(false);

  // Assumed Chip 1: Detail level (defaults to key columns)
  const [detailLevel, setDetailLevel] = useState<"key" | "full">("key");

  // Assumed Chip 2: Show, export or schedule? (defaults to interactive table)
  const [deliveryFormat, setDeliveryFormat] = useState<"table" | "export">(
    "table",
  );

  // State: whether the report has been generated inside the card
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  const handleGenerate = () => {
    setIsGenerated(true);
    if (onGenerateReport) {
      onGenerateReport({
        reportType,
        vehicles: vehiclesScope,
        includeToday,
        detailLevel,
        delivery: deliveryFormat,
      });
    }
  };

  if (isGenerated) {
    return (
      <div className="space-y-2 animate-in fade-in duration-300">
        {/* Compact configuration recap banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-lg bg-sky-50 border border-sky-100 text-xs text-sky-900 dark:bg-sky-950/40 dark:border-sky-900/60 dark:text-sky-200">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">
              Fill-Drain Report Generated ·{" "}
              {includeToday
                ? "Oct 1 – Oct 15 (Includes Today)"
                : "Sep 30 – Oct 14 (15 Completed Days)"}
            </span>
            <span className="text-slate-500 text-[11px]">
              (
              {vehiclesScope === "all"
                ? "All 9 Fleet Vehicles"
                : `${vehiclesScope} Branch`}
              )
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsGenerated(false)}
            className="text-[11px] font-medium text-[#0089FF] hover:underline cursor-pointer"
          >
            Adjust Filters ↺
          </button>
        </div>

        {/* The actual generated Fill-Drain Report component */}
        <FuelReportPreview />
      </div>
    );
  }

  return (
    <div className="my-3 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100">
      {/* ── Card Header ── */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-[#070D1E] px-4 py-3 text-white">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0089FF]/20 text-[#38BDF8]">
            <Fuel className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-tight text-white flex items-center gap-2">
              <span>Fuel Report Configuration</span>
              <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-semibold text-sky-300 border border-sky-400/30">
                Pre-Report Setup
              </span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5">
              Confirm these 3 details so Zio tailors the report to your exact
              needs
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 text-xs">
        {/* ── Question 1: Which fuel report? (Asked by default) ── */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 text-[10px] font-bold">
                1
              </span>
              Which fuel report?
            </label>
            <span className="text-[10px] text-slate-400">
              Several fuel reports exist with different fields
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              {
                id: "fill-drain",
                title: "Fill-Drain",
                desc: "Refills, drains & levels",
                recommended: true,
              },
              {
                id: "consumption",
                title: "Fuel Consumption",
                desc: "Running vs idle liters",
              },
              {
                id: "summary",
                title: "Fuel Summary",
                desc: "Totals by vehicle",
              },
              {
                id: "mileage",
                title: "Fuel Mileage",
                desc: "Distance / fuel (km/L)",
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setReportType(opt.id)}
                className={cn(
                  "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all cursor-pointer relative",
                  reportType === opt.id
                    ? "border-[#0089FF] bg-sky-50/60 dark:bg-sky-950/30 shadow-xs"
                    : "border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40",
                )}
              >
                {opt.recommended && (
                  <span className="absolute top-1.5 right-1.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 text-[9px] font-bold">
                    Default
                  </span>
                )}
                <span
                  className={cn(
                    "text-xs font-semibold leading-tight",
                    reportType === opt.id
                      ? "text-[#0089FF] dark:text-sky-300"
                      : "text-slate-800 dark:text-slate-200",
                  )}
                >
                  {opt.title}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Question 2: Which vehicles? (Asked by default) ── */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 text-[10px] font-bold">
                2
              </span>
              Which vehicles?
            </label>
            <span className="text-[10px] text-slate-400">
              Large fleets make the report slow and noisy
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "all", label: "All Active Fleet (9 vehicles)" },
              { id: "Valsad", label: "Valsad Branch (2)" },
              { id: "Indonesia", label: "Indonesia Branch (2)" },
              { id: "Thailand", label: "Thailand Branch (4)" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setVehiclesScope(opt.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-all cursor-pointer border flex items-center gap-1.5",
                  vehiclesScope === opt.id
                    ? "border-[#0089FF] bg-[#0089FF] text-white shadow-xs font-semibold"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
                )}
              >
                {vehiclesScope === opt.id && <Check className="h-3 w-3" />}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Question 3: Should today be included in "last 15 days"? (Asked by default) ── */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 text-[10px] font-bold">
                3
              </span>
              Should today be included in "last 15 days"?
            </label>
            <span className="text-[10px] text-slate-400">
              Today is a partial day and distorts totals
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIncludeToday(false)}
              className={cn(
                "flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                !includeToday
                  ? "border-[#0089FF] bg-sky-50/60 dark:bg-sky-950/30 shadow-xs"
                  : "border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/70 dark:border-slate-800 dark:bg-slate-800/40",
              )}
            >
              <div
                className={cn(
                  "mt-0.5 h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0",
                  !includeToday
                    ? "border-[#0089FF] bg-[#0089FF]"
                    : "border-slate-300",
                )}
              >
                {!includeToday && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 block">
                  Completed days only (Sep 30 – Oct 14)
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">
                  ★ Recommended · Consistent 24h totals & mileage
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIncludeToday(true)}
              className={cn(
                "flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                includeToday
                  ? "border-[#0089FF] bg-sky-50/60 dark:bg-sky-950/30 shadow-xs"
                  : "border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/70 dark:border-slate-800 dark:bg-slate-800/40",
              )}
            >
              <div
                className={cn(
                  "mt-0.5 h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0",
                  includeToday
                    ? "border-[#0089FF] bg-[#0089FF]"
                    : "border-slate-300",
                )}
              >
                {includeToday && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 block">
                  Include today (Oct 1 – Oct 15)
                </span>
                <span className="text-[10px] text-slate-400">
                  Live data up to 04:37 PM (partial ongoing day)
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* ── Assumed Defaults (Shown as editable chips) ── */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Info className="h-3 w-3 text-slate-400" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              Assumed Preferences (click to adjust):
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Detail chip */}
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <span className="text-slate-400">Detail:</span>
              <button
                type="button"
                onClick={() =>
                  setDetailLevel((prev) => (prev === "key" ? "full" : "key"))
                }
                className="font-semibold text-slate-800 hover:text-[#0089FF] dark:text-slate-200 underline decoration-dotted cursor-pointer"
              >
                {detailLevel === "key"
                  ? "Key Summary Columns (17)"
                  : "Full 24 Columns"}
              </button>
            </div>

            {/* Delivery chip */}
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <span className="text-slate-400">Output:</span>
              <button
                type="button"
                onClick={() =>
                  setDeliveryFormat((prev) =>
                    prev === "table" ? "export" : "table",
                  )
                }
                className="font-semibold text-slate-800 hover:text-[#0089FF] dark:text-slate-200 underline decoration-dotted cursor-pointer"
              >
                {deliveryFormat === "table"
                  ? "Interactive In-Chat Table"
                  : "Instant Excel Export"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Card Footer CTA ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-100 dark:bg-slate-900/60 dark:border-slate-800">
        <span className="text-[11px] text-slate-500">
          Ready to query 15 days of telematics logs
        </span>
        <button
          type="button"
          onClick={handleGenerate}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0089FF] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-[#0089FF]/25 hover:bg-[#007ae6] active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Generate Fill-Drain Report</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
