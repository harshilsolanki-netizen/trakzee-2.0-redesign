import { ChevronRight, RotateCcw, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppliedFiltersSummary } from "@/components/report/AppliedFiltersSummary";
import {
  VehicleAttributeFilterOverlay,
  type VehicleAttributeFilters,
} from "@/components/ui/VehicleAttributeFilterOverlay";
import { fleetObjects, type FleetObject } from "@/data/fleet";
import { cn } from "@/lib/utils";

export function DashboardFilterDrawer({
  open,
  onClose,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  onApply?: (filters: any) => void;
}) {
  const [query, setQuery] = useState("");
  const [openGroups, setOpenGroups] = useState<string[]>([
    "Indonesia",
    "Thailand",
    "Valsad",
    "Itriangle",
  ]);

  const [attributeOverlayOpen, setAttributeOverlayOpen] = useState(false);
  const [attributeFilters, setAttributeFilters] =
    useState<VehicleAttributeFilters>({
      company: "HP Company",
      branch: "HP Branch 1",
      vehicleGroup: "All",
      vehicleType: "All",
      vehicleBrand: "All",
      vehicleModel: "All",
    });

  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([
    "o1",
    "o2",
    "o3",
  ]);

  // Group vehicles by branch
  const branchGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const map = new Map<string, FleetObject[]>();

    for (const v of fleetObjects) {
      if (
        q === "" ||
        v.name.toLowerCase().includes(q) ||
        v.branch.toLowerCase().includes(q) ||
        v.imei.toLowerCase().includes(q)
      ) {
        const list = map.get(v.branch) ?? [];
        list.push(v);
        map.set(v.branch, list);
      }
    }

    return [...map.entries()].map(([group, vehicles]) => ({
      group,
      vehicles,
    }));
  }, [query]);

  const allVisibleVehicleIds = useMemo(
    () => branchGroups.flatMap((g) => g.vehicles.map((v) => v.id)),
    [branchGroups],
  );

  const allSelected =
    allVisibleVehicleIds.length > 0 &&
    allVisibleVehicleIds.every((id) => selectedVehicleIds.includes(id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedVehicleIds([]);
    } else {
      setSelectedVehicleIds(allVisibleVehicleIds);
    }
  };

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) =>
      prev.includes(groupName)
        ? prev.filter((g) => g !== groupName)
        : [...prev, groupName],
    );
  };

  const toggleGroupVehicles = (vehicles: FleetObject[]) => {
    const ids = vehicles.map((v) => v.id);
    const allIn = ids.every((id) => selectedVehicleIds.includes(id));
    if (allIn) {
      setSelectedVehicleIds((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedVehicleIds((prev) => [...new Set([...prev, ...ids])]);
    }
  };

  const toggleVehicle = (id: string) => {
    setSelectedVehicleIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleReset = () => {
    setAttributeFilters({
      company: "HP Company",
      branch: "HP Branch 1",
      vehicleGroup: "All",
      vehicleType: "All",
      vehicleBrand: "All",
      vehicleModel: "All",
    });
    setQuery("");
    setSelectedVehicleIds(fleetObjects.slice(0, 3).map((v) => v.id));
    toast.info("Filters reset to default");
  };

  const handleApply = () => {
    toast.success("Dashboard filter applied and loaded", {
      description:
        attributeFilters.company +
        " · " +
        attributeFilters.branch +
        " · " +
        selectedVehicleIds.length +
        " vehicles selected",
    });
    if (onApply) {
      onApply({
        filters: attributeFilters,
        selectedIds: selectedVehicleIds,
      });
    }
    onClose();
  };

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close filter"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/20"
        />
      ) : null}
      <aside
        aria-hidden={!open}
        aria-label="Dashboard filter"
        className={cn(
          "fixed right-0 top-0 z-50 flex h-screen w-full max-w-[430px] flex-col border-l border-border bg-surface shadow-xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
      >
        {/* 1. Top Header Banner (45px height) */}
        <header className="flex h-[45px] items-center justify-between bg-nav px-4 text-nav-foreground select-none shrink-0 border-b border-white/10">
          <h2 className="text-sm font-semibold">Dashboard Filter</h2>
          <button
            type="button"
            aria-label="Close filter"
            onClick={onClose}
            className="rounded-md p-1 text-nav-foreground/80 transition-colors duration-150 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* 2. Body Content (Flex container extending to bottom margin area) */}
        <div className="flex-1 min-h-0 flex flex-col p-3 space-y-2.5">
          {/* Compact Applied Filters Summary Bar with Edit overlay */}
          <div className="relative shrink-0">
            <AppliedFiltersSummary
              filters={attributeFilters}
              selectedVehicleCount={selectedVehicleIds.length}
              onEditFilter={() => setAttributeOverlayOpen(true)}
            />

            {/* Floating Edit Vehicle Filters Overlay */}
            <VehicleAttributeFilterOverlay
              open={attributeOverlayOpen}
              onClose={() => setAttributeOverlayOpen(false)}
              value={attributeFilters}
              onChange={(patch) =>
                setAttributeFilters((prev) => ({ ...prev, ...patch }))
              }
              onApply={() => setAttributeOverlayOpen(false)}
            />
          </div>

          {/* Search vehicles input */}
          <div className="relative shrink-0">
            <div className="flex h-8 items-center gap-1.5 rounded-md border border-input bg-background px-2 focus-within:ring-1 focus-within:ring-brand">
              <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search vehicles, drivers..."
                aria-label="Search vehicles or drivers"
                className="h-7 flex-1 bg-transparent text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Grouped Tree Box (Extends completely to the bottom margin) */}
          <div className="flex-1 min-h-0 flex flex-col rounded-md border border-border bg-card overflow-hidden">
            {/* Header: Select all on left, N selected on right */}
            <div className="flex items-center justify-between border-b border-border bg-surface-muted px-2.5 py-1.5 shrink-0">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-[11px] font-medium text-brand transition-colors duration-150 hover:underline cursor-pointer"
              >
                {allSelected ? "Clear all" : "Select all"}
              </button>
              <span className="text-[11px] tabular-nums text-muted-foreground">
                {selectedVehicleIds.length} selected
              </span>
            </div>

            {/* Tree List with Chevrons and Checkboxes */}
            <ul className="flex-1 min-h-0 overflow-y-auto py-1">
              {branchGroups.map(({ group, vehicles }) => {
                const expanded =
                  openGroups.includes(group) || query.trim() !== "";
                const groupIds = vehicles.map((v) => v.id);
                const selectedCount = vehicles.filter((v) =>
                  selectedVehicleIds.includes(v.id),
                ).length;
                const allGroupSelected =
                  selectedCount === vehicles.length && vehicles.length > 0;
                const someGroupSelected =
                  selectedCount > 0 && !allGroupSelected;

                return (
                  <li key={group}>
                    <div className="flex items-center gap-1.5 px-2 py-1.5">
                      <input
                        type="checkbox"
                        aria-label={"Select all in " + group}
                        checked={allGroupSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = someGroupSelected;
                        }}
                        onChange={() => toggleGroupVehicles(vehicles)}
                      />
                      <button
                        type="button"
                        onClick={() => toggleGroup(group)}
                        aria-expanded={expanded}
                        className="flex flex-1 items-center gap-1 text-left text-xs font-medium transition-colors duration-150 hover:text-brand cursor-pointer"
                      >
                        <ChevronRight
                          className={cn(
                            "h-3.5 w-3.5 transition-transform duration-150",
                            expanded && "rotate-90",
                          )}
                        />
                        {group}
                        <span className="text-[10px] tabular-nums text-muted-foreground">
                          {"[" + vehicles.length + "]"}
                        </span>
                      </button>
                    </div>
                    {expanded ? (
                      <ul>
                        {vehicles.map((v) => (
                          <li key={v.id}>
                            <label className="flex cursor-pointer items-center gap-2 py-1 pl-8 pr-2 text-xs transition-colors duration-150 hover:bg-muted">
                              <input
                                type="checkbox"
                                checked={selectedVehicleIds.includes(v.id)}
                                onChange={() => toggleVehicle(v.id)}
                              />
                              <span className="flex-1 truncate">
                                <span className="block font-medium leading-tight">
                                  {v.name}
                                </span>
                                <span className="block text-[10px] text-muted-foreground">
                                  {v.imei}
                                </span>
                              </span>
                              {v.speed !== undefined && (
                                <span className="text-[10px] tabular-nums text-muted-foreground">
                                  {v.speed + " km/h"}
                                </span>
                              )}
                            </label>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
              {branchGroups.length === 0 ? (
                <li className="px-2 py-4 text-center text-[11px] text-muted-foreground">
                  No vehicles match your search.
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        {/* 3. Footer Toolbar (Matching Report Filter Theme) */}
        <footer className="flex items-center justify-between border-t border-border bg-surface-muted/30 px-3 py-2.5 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors duration-150 hover:bg-muted cursor-pointer shadow-2xs"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="rounded-md bg-brand px-4 py-1.5 text-xs font-semibold text-brand-foreground shadow-sm transition-colors duration-150 hover:bg-[#124ecf] cursor-pointer"
          >
            Apply Filter
          </button>
        </footer>
      </aside>
    </>
  );
}
