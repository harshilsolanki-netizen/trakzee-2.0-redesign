import { ChevronRight, Eraser, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { AppliedFiltersSummary } from "@/components/report/AppliedFiltersSummary";
import {
  VehicleAttributeFilterOverlay,
  DEFAULT_VEHICLE_ATTRIBUTES,
  type VehicleAttributeFilters,
} from "@/components/ui/VehicleAttributeFilterOverlay";
import { DATE_PRESETS } from "@/data/reports";
import { cn } from "@/lib/utils";

const selectClass =
  "h-8 w-full rounded border border-input bg-background px-2 text-xs transition-colors duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-brand";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-[11px] font-medium text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

export type ChartQuickFilter = {
  datePreset: string;
  from: string;
  to: string;
  vehicles: string[];
};

export function ChartFilterDrawer({
  open,
  onClose,
  value,
  onChange,
  vehicleGroups,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  value: ChartQuickFilter;
  onChange: (patch: Partial<ChartQuickFilter>) => void;
  vehicleGroups: { group: string; vehicles: string[] }[];
  onApply: () => void;
}) {
  const [query, setQuery] = useState("");
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [attributeOverlayOpen, setAttributeOverlayOpen] = useState(false);
  const [attributeFilters, setAttributeFilters] =
    useState<VehicleAttributeFilters>(DEFAULT_VEHICLE_ATTRIBUTES);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vehicleGroups
      .map((g) => ({
        group: g.group,
        vehicles: g.vehicles.filter(
          (v) => q === "" || v.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.vehicles.length > 0);
  }, [vehicleGroups, query]);

  const allVehicles = vehicleGroups.flatMap((g) => g.vehicles);
  const allSelected =
    allVehicles.length > 0 &&
    allVehicles.every((v) => value.vehicles.includes(v));

  const toggleVehicle = (v: string) =>
    onChange({
      vehicles: value.vehicles.includes(v)
        ? value.vehicles.filter((x) => x !== v)
        : [...value.vehicles, v],
    });

  const toggleGroupVehicles = (vs: string[]) => {
    const allIn = vs.every((v) => value.vehicles.includes(v));
    onChange({
      vehicles: allIn
        ? value.vehicles.filter((x) => !vs.includes(x))
        : [...new Set([...value.vehicles, ...vs])],
    });
  };

  const toggleGroup = (g: string) =>
    setOpenGroups((gs) =>
      gs.includes(g) ? gs.filter((x) => x !== g) : [...gs, g],
    );

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close filter"
          onClick={onClose}
          className="fixed top-[45px] bottom-0 left-0 sm:left-[68px] right-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
        />
      ) : null}
      <aside
        aria-hidden={!open}
        aria-label="Chart filter panel"
        className={cn(
          "fixed right-0 top-[45px] bottom-0 z-40 flex w-full max-w-[420px] xl:max-w-[430px] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
      >
        {/* 1. Header Banner matching standardized 45px drawer theme */}
        <header className="flex h-[45px] items-center justify-between bg-nav px-4 text-nav-foreground select-none shrink-0 border-b border-white/10">
          <h2 className="text-sm font-semibold">Chart Filter</h2>
          <button
            type="button"
            aria-label="Close filter"
            onClick={onClose}
            className="rounded-md p-1 text-nav-foreground/80 transition-colors duration-150 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* 2. Body Content */}
        <div className="flex-1 min-h-0 flex flex-col p-3 space-y-2.5">
          {/* Date Selection */}
          <div className="shrink-0">
            <Field label="Date selection">
              <select
                className={selectClass}
                value={value.datePreset}
                onChange={(e) => onChange({ datePreset: e.target.value })}
              >
                {DATE_PRESETS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Date Pickers with FROM / TO Badges */}
          <div className="grid grid-cols-2 gap-2 shrink-0">
            <div className="flex items-center overflow-hidden rounded-md border border-input bg-background">
              <span className="bg-muted px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase border-r border-input">
                FROM
              </span>
              <input
                type="date"
                value={value.from}
                onChange={(e) =>
                  onChange({ from: e.target.value, datePreset: "Custom" })
                }
                className="h-8 w-full bg-transparent px-2 text-xs focus:outline-none"
              />
            </div>
            <div className="flex items-center overflow-hidden rounded-md border border-input bg-background">
              <span className="bg-muted px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase border-r border-input">
                TO
              </span>
              <input
                type="date"
                value={value.to}
                onChange={(e) =>
                  onChange({ to: e.target.value, datePreset: "Custom" })
                }
                className="h-8 w-full bg-transparent px-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Compact Applied Filters Summary Bar with Edit Overlay */}
          <div className="relative shrink-0">
            <AppliedFiltersSummary
              filters={attributeFilters}
              selectedVehicleCount={value.vehicles.length}
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

          {/* Search bar */}
          <div className="relative shrink-0">
            <div className="flex h-8 items-center gap-1.5 rounded-md border border-input bg-background px-2 focus-within:ring-1 focus-within:ring-brand">
              <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search vehicles, drivers..."
                aria-label="Search vehicles"
                className="h-7 flex-1 bg-transparent text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Vehicles List (Full height down to bottom margin area) */}
          <div className="flex-1 min-h-0 flex flex-col rounded-md border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border bg-surface-muted px-2.5 py-1.5 shrink-0">
              <button
                type="button"
                onClick={() =>
                  onChange({ vehicles: allSelected ? [] : allVehicles })
                }
                className="text-[11px] font-medium text-brand transition-colors duration-150 hover:underline cursor-pointer"
              >
                {allSelected ? "Clear all" : "Select all"}
              </button>
              <span className="text-[11px] tabular-nums text-muted-foreground">
                {value.vehicles.length === 0
                  ? "All vehicles"
                  : value.vehicles.length + " selected"}
              </span>
            </div>
            <ul className="flex-1 min-h-0 overflow-y-auto py-1">
              {groups.map((g) => {
                const expanded =
                  openGroups.includes(g.group) || query.trim() !== "";
                const sel = g.vehicles.filter((v) =>
                  value.vehicles.includes(v),
                ).length;
                return (
                  <li key={g.group}>
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5">
                      <input
                        type="checkbox"
                        aria-label={"Select all in " + g.group}
                        checked={
                          sel === g.vehicles.length && g.vehicles.length > 0
                        }
                        onChange={() => toggleGroupVehicles(g.vehicles)}
                        className="rounded border-input text-brand focus:ring-brand"
                      />
                      <button
                        type="button"
                        onClick={() => toggleGroup(g.group)}
                        aria-expanded={expanded}
                        className="flex flex-1 items-center gap-1 text-left text-xs font-medium transition-colors duration-150 hover:text-brand cursor-pointer"
                      >
                        <ChevronRight
                          className={cn(
                            "h-3.5 w-3.5 transition-transform duration-150",
                            expanded && "rotate-90",
                          )}
                        />
                        {g.group}
                        <span className="text-[10px] tabular-nums text-muted-foreground">
                          {"[" + g.vehicles.length + "]"}
                        </span>
                      </button>
                    </div>
                    {expanded ? (
                      <ul>
                        {g.vehicles.map((v) => (
                          <li key={v}>
                            <label className="flex cursor-pointer items-center gap-2 py-1.5 pl-8 pr-2.5 text-xs transition-colors duration-150 hover:bg-muted">
                              <input
                                type="checkbox"
                                checked={value.vehicles.includes(v)}
                                onChange={() => toggleVehicle(v)}
                                className="rounded border-input text-brand focus:ring-brand"
                              />
                              <span className="flex-1 truncate">{v}</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
              {groups.length === 0 ? (
                <li className="px-2 py-4 text-center text-[11px] text-muted-foreground">
                  No vehicles match your search.
                </li>
              ) : null}
            </ul>
            <p className="border-t border-border bg-surface-muted/30 px-2.5 py-1.5 text-[11px] tabular-nums text-muted-foreground shrink-0">
              {value.vehicles.length === 0
                ? "No vehicle selected — all vehicles will be included."
                : value.vehicles.length + " vehicles selected"}
            </p>
          </div>
        </div>

        {/* 3. Footer Toolbar */}
        <footer className="flex items-center justify-between border-t border-border bg-surface-muted/30 px-3 py-2.5 shrink-0">
          <button
            type="button"
            aria-label="Clear filter"
            onClick={() =>
              onChange({
                vehicles: [],
                datePreset: DATE_PRESETS[0]!,
                from: "",
                to: "",
              })
            }
            className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors duration-150 hover:bg-muted cursor-pointer shadow-2xs"
          >
            <Eraser className="h-3 w-3" />
            <span>Reset</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-8 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground transition-colors duration-150 hover:bg-muted cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onApply}
              className="h-8 rounded-md bg-brand px-4 text-xs font-semibold text-brand-foreground shadow-sm transition-colors duration-150 hover:bg-[#124ecf] cursor-pointer"
            >
              Apply Filter
            </button>
          </div>
        </footer>
      </aside>
    </>
  );
}
