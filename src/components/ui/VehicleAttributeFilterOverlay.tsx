import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import {
  BRANCHES,
  COMPANIES,
  VEHICLE_BRANDS,
  VEHICLE_GROUPS,
  VEHICLE_MODELS,
  VEHICLE_TYPES,
} from "@/data/reports";
import { SelectDropdown } from "@/components/ui/select-dropdown";
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
          <div className="space-y-1">
            <span className="text-xs font-semibold text-foreground">
              Company
            </span>
            <SelectDropdown
              value={value.company}
              onChange={(v) => onChange({ company: v })}
              options={COMPANIES}
              triggerClassName="h-7.5 text-xs"
            />
          </div>

          {/* Branch */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-foreground">
              Branch
            </span>
            <SelectDropdown
              value={value.branch}
              onChange={(v) => onChange({ branch: v })}
              options={BRANCHES}
              triggerClassName="h-7.5 text-xs"
            />
          </div>

          {/* Vehicle Group */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-foreground">
              Vehicle Group
            </span>
            <SelectDropdown
              value={value.vehicleGroup}
              onChange={(v) => onChange({ vehicleGroup: v })}
              options={VEHICLE_GROUPS}
              triggerClassName="h-7.5 text-xs"
            />
          </div>

          {/* Vehicle Type */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-foreground">
              Vehicle Type
            </span>
            <SelectDropdown
              value={value.vehicleType}
              onChange={(v) => onChange({ vehicleType: v })}
              options={VEHICLE_TYPES}
              triggerClassName="h-7.5 text-xs"
            />
          </div>

          {/* Vehicle Brand */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-foreground">
              Vehicle Brand
            </span>
            <SelectDropdown
              value={value.vehicleBrand}
              onChange={(v) => onChange({ vehicleBrand: v })}
              options={VEHICLE_BRANDS}
              triggerClassName="h-7.5 text-xs"
            />
          </div>

          {/* Vehicle Model */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-foreground">
              Vehicle Model
            </span>
            <SelectDropdown
              value={value.vehicleModel}
              onChange={(v) => onChange({ vehicleModel: v })}
              options={VEHICLE_MODELS}
              triggerClassName="h-7.5 text-xs"
            />
          </div>
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
            className="rounded-md bg-[#0089FF] px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition-opacity hover:bg-[#0070d6] cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
}
