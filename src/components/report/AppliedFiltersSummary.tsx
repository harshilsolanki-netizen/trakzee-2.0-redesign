import { ChevronDown, Pencil } from "lucide-react";
import { type VehicleAttributeFilters } from "@/components/ui/VehicleAttributeFilterOverlay";
import { cn } from "@/lib/utils";

export function AppliedFiltersSummary({
  filters,
  selectedVehicleCount,
  onEditFilter,
  className,
}: {
  filters: VehicleAttributeFilters;
  selectedVehicleCount: number;
  onEditFilter: () => void;
  className?: string;
}) {
  // Count active non-default secondary filters
  const secondaryFiltersCount = [
    filters.vehicleGroup !== "All" ? `Group: ${filters.vehicleGroup}` : null,
    filters.vehicleType !== "All" ? `Type: ${filters.vehicleType}` : null,
    filters.vehicleBrand !== "All" ? `Brand: ${filters.vehicleBrand}` : null,
    filters.vehicleModel !== "All" ? `Model: ${filters.vehicleModel}` : null,
  ].filter(Boolean);

  const moreCount = secondaryFiltersCount.length;

  return (
    <div
      className={cn(
        "rounded-md border border-border/80 bg-surface-muted/40 p-2 shadow-2xs space-y-1.5",
        className,
      )}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs font-semibold text-foreground select-none">
          <span>Applied Filters</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </div>

        {/* Quick Edit Action Button on right */}
        <button
          type="button"
          onClick={onEditFilter}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0089FF] hover:underline shrink-0 cursor-pointer"
        >
          <Pencil className="h-3 w-3" />
          <span>Edit</span>
        </button>
      </div>

      {/* Primary Summary Tags / Chips */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground min-w-0">
        {/* Company Tag */}
        <span className="inline-flex items-center rounded-md bg-background px-2 py-0.5 font-medium text-foreground border border-border/60 shadow-2xs">
          {filters.company || "All Companies"}
        </span>

        <span className="text-border">|</span>

        {/* Branch Tag */}
        <span className="inline-flex items-center rounded-md bg-background px-2 py-0.5 font-medium text-foreground border border-border/60 shadow-2xs">
          {filters.branch || "All Branches"}
        </span>

        <span className="text-border">|</span>

        {/* Selected Vehicles Count */}
        <span className="inline-flex items-center rounded-md bg-[#0089FF]/10 text-[#0089FF] border border-[#0089FF]/20 px-2 py-0.5 font-semibold text-[11px]">
          {selectedVehicleCount} Vehicles Selected
        </span>

        {/* More chips badge if additional filters active */}
        {moreCount > 0 && (
          <>
            <span className="text-border">|</span>
            <span className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 font-medium text-[10px] text-muted-foreground">
              +{moreCount} More
            </span>
          </>
        )}
      </div>
    </div>
  );
}
