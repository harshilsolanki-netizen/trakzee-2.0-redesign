import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import {
  BRANCHES,
  COMPANIES,
  VEHICLE_BRANDS,
  VEHICLE_GROUPS,
  VEHICLE_MODELS,
  VEHICLE_TYPES,
} from "@/data/reports";
import { cn } from "@/lib/utils";

export type VehicleAttributeFilters = {
  company: string;
  branch: string;
  vehicleGroup: string;
  vehicleType: string;
  vehicleBrand: string;
  vehicleModel: string;
};

export const DEFAULT_VEHICLE_ATTRIBUTES: VehicleAttributeFilters = {
  company: "All",
  branch: "All",
  vehicleGroup: "All",
  vehicleType: "All",
  vehicleBrand: "All",
  vehicleModel: "All",
};

export function VehicleAttributeFilterOverlay({
  open,
  onClose,
  value,
  onChange,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  value: VehicleAttributeFilters;
  onChange: (patch: Partial<VehicleAttributeFilters>) => void;
  onApply: () => void;
}) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop to close when clicking outside */}
      <div
        className="fixed inset-0 z-30"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating Popover Card */}
      <div className="absolute top-full left-0 right-0 z-40 mt-1 rounded-xl border border-border bg-card p-3.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-2 mb-3 select-none">
          <h3 className="font-bold text-sm tracking-tight text-foreground">
            Edit Vehicle Filters
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 6 Dropdowns Grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
          {/* Company */}
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Company
            </span>
            <select
              value={value.company}
              onChange={(e) => onChange({ company: e.target.value })}
              className="mt-1 h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 cursor-pointer shadow-2xs"
            >
              {COMPANIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          {/* Branch */}
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Branch
            </span>
            <select
              value={value.branch}
              onChange={(e) => onChange({ branch: e.target.value })}
              className="mt-1 h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 cursor-pointer shadow-2xs"
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>

          {/* Vehicle Group */}
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Vehicle Group
            </span>
            <select
              value={value.vehicleGroup}
              onChange={(e) => onChange({ vehicleGroup: e.target.value })}
              className="mt-1 h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 cursor-pointer shadow-2xs"
            >
              {VEHICLE_GROUPS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>

          {/* Vehicle Type */}
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Vehicle Type
            </span>
            <select
              value={value.vehicleType}
              onChange={(e) => onChange({ vehicleType: e.target.value })}
              className="mt-1 h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 cursor-pointer shadow-2xs"
            >
              {VEHICLE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          {/* Vehicle Brand */}
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Vehicle Brand
            </span>
            <select
              value={value.vehicleBrand}
              onChange={(e) => onChange({ vehicleBrand: e.target.value })}
              className="mt-1 h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 cursor-pointer shadow-2xs"
            >
              {VEHICLE_BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>

          {/* Vehicle Model */}
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Vehicle Model
            </span>
            <select
              value={value.vehicleModel}
              onChange={(e) => onChange({ vehicleModel: e.target.value })}
              className="mt-1 h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 cursor-pointer shadow-2xs"
            >
              {VEHICLE_MODELS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Actions footer: "Reset" on left, "Apply" on right */}
        <div className="mt-3.5 flex items-center justify-between border-t border-border pt-2.5">
          <button
            type="button"
            onClick={() => {
              onChange(DEFAULT_VEHICLE_ATTRIBUTES);
            }}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={() => {
              onApply();
              onClose();
            }}
            className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition-opacity hover:bg-blue-700 cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
}
