import {
  Check,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Search,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  COMPANIES,
  getBranchesForCompanies,
  getGroupsForBranches,
  getVehiclesForBranches,
  VEHICLE_TYPES,
} from "@/data/reports";
import { fleetObjects } from "@/data/fleet";
import { cn } from "@/lib/utils";

interface MultiSelectDropdownProps {
  label: string;
  selected: string[];
  options: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  className?: string;
}

function MultiSelectDropdown({
  label,
  selected,
  options,
  onChange,
  placeholder,
  className,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  const isAll = selected.length === options.length && options.length > 0;

  const displayText = useMemo(() => {
    if (!selected || selected.length === 0) {
      return placeholder || `Select ${label}`;
    }
    if (selected.length === 1) return selected[0];
    return `${selected[0]} +${selected.length - 1}`;
  }, [selected, label, placeholder]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input/80 bg-background px-3 text-xs text-foreground font-semibold shadow-2xs transition-all hover:border-[#0089FF]/60 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF] cursor-pointer select-none",
          open && "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-muted/40",
        )}
      >
        <span className="truncate">{displayText}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 max-h-56 overflow-y-auto rounded-lg border border-border/80 bg-popover/98 backdrop-blur-xl p-1 shadow-lg animate-in fade-in-0 zoom-in-95 select-none">
          <label className="flex items-center gap-2.5 rounded-sm px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/80 hover:text-foreground cursor-pointer transition-colors select-none">
            <input
              type="checkbox"
              checked={isAll}
              onChange={() => {
                if (isAll) onChange([]);
                else onChange([...options]);
              }}
              className="rounded-md border-input text-brand cursor-pointer h-4 w-4 accent-[#0089FF]"
            />
            <span>Select All</span>
          </label>

          <div className="my-1 border-t border-border/60" />
          {options.map((opt) => {
            const isChecked = selected.includes(opt);
            return (
              <label
                key={opt}
                className={cn(
                  "flex items-center gap-2.5 rounded-sm px-2.5 py-1.5 text-xs text-foreground transition-colors cursor-pointer select-none",
                  isChecked
                    ? "bg-[#0089FF]/10 text-[#0089FF] font-bold hover:bg-[#0089FF]/15"
                    : "hover:bg-muted/80 hover:text-foreground font-medium",
                )}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggle(opt)}
                  className="rounded-md border-input text-brand cursor-pointer h-4 w-4 accent-[#0089FF]"
                />
                <span className="truncate">{opt}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

export interface DashboardFilterState {
  companies: string[];
  branches: string[];
  groups: string[];
  types: string[];
  selectedVehicleIds: string[];
}

export function DashboardFilterDrawer({
  open,
  onClose,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  onApply?: (filters: DashboardFilterState) => void;
}) {
  // 1. Company Filter
  const companyOptions = useMemo(
    () => COMPANIES.filter((c) => c !== "All"),
    [],
  );
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([
    "HP Company",
  ]);

  // 2. Branch Filter (Derived from selected companies)
  const branchOptions = useMemo(() => {
    const branches = getBranchesForCompanies(selectedCompanies);
    return branches.length > 0
      ? branches
      : [
          "HP Branch 1",
          "HP Branch 2",
          "Valsad",
          "Surat",
          "Ahmedabad",
          "Mumbai",
        ];
  }, [selectedCompanies]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([
    "HP Branch 1",
  ]);

  // Auto-sync branches when companies change
  useEffect(() => {
    if (selectedBranches.length === 0 && branchOptions.length > 0) {
      setSelectedBranches([branchOptions[0]!]);
    }
  }, [branchOptions, selectedBranches]);

  // 3. Group Filter (Derived from selected branches)
  const groupOptions = useMemo(() => {
    const groups = getGroupsForBranches(selectedBranches);
    return groups.length > 0
      ? groups
      : ["HP Group", "Trucks", "Buses", "Cars", "Cold Chain"];
  }, [selectedBranches]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([
    "HP Group",
  ]);

  // 4. Type Filter
  const typeOptions = useMemo(
    () =>
      VEHICLE_TYPES.filter(
        (t) => t !== "All" && t !== "" && !t.includes("All"),
      )
        .concat(["Dumper", "Truck", "Bus", "SUV", "Taxi", "Trailer"])
        .filter((v, i, a) => a.indexOf(v) === i),
    [],
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "Dumper",
    "Truck",
  ]);

  // 5. Vehicle Search & Selection
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [openBranchGroups, setOpenBranchGroups] = useState<string[]>([
    "HP Branch 1",
    "HP Branch 2",
    "Valsad",
    "Surat",
  ]);

  // Combined vehicle pool based on branch selection and mock fleet
  const vehicleList = useMemo(() => {
    const fromReports = getVehiclesForBranches(selectedBranches);
    if (fromReports.length > 0) {
      return fromReports.map((v) => ({
        id: v.id,
        name: v.name,
        imei: v.imei,
        branch: v.branch,
        driver: v.driver || "Driver",
      }));
    }
    return fleetObjects.map((v) => ({
      id: v.id,
      name: v.name,
      imei: v.imei,
      branch: v.branch,
      driver: v.driverName || "Driver",
    }));
  }, [selectedBranches]);

  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([
    "o1",
    "o2",
    "o3",
    "v1",
    "v2",
  ]);

  // Group vehicles by branch for the accordion tree
  const groupedVehicles = useMemo(() => {
    const q = vehicleSearch.trim().toLowerCase();
    const map = new Map<
      string,
      {
        id: string;
        name: string;
        imei: string;
        branch: string;
        driver: string;
      }[]
    >();

    for (const v of vehicleList) {
      if (
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.imei.toLowerCase().includes(q) ||
        v.branch.toLowerCase().includes(q) ||
        v.driver.toLowerCase().includes(q)
      ) {
        const list = map.get(v.branch) ?? [];
        list.push(v);
        map.set(v.branch, list);
      }
    }

    return [...map.entries()].map(([branch, vehicles]) => ({
      branch,
      vehicles,
    }));
  }, [vehicleList, vehicleSearch]);

  const allFilteredVehicleIds = useMemo(
    () => groupedVehicles.flatMap((g) => g.vehicles.map((v) => v.id)),
    [groupedVehicles],
  );

  const allVehiclesSelected =
    allFilteredVehicleIds.length > 0 &&
    allFilteredVehicleIds.every((id) => selectedVehicleIds.includes(id));

  const toggleSelectAllVehicles = () => {
    if (allVehiclesSelected) {
      setSelectedVehicleIds([]);
    } else {
      setSelectedVehicleIds(allFilteredVehicleIds);
    }
  };

  const toggleBranchAccordion = (branch: string) => {
    setOpenBranchGroups((prev) =>
      prev.includes(branch)
        ? prev.filter((b) => b !== branch)
        : [...prev, branch],
    );
  };

  const toggleBranchVehicles = (
    vehicles: { id: string; name: string; imei: string; branch: string }[],
  ) => {
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
    setSelectedCompanies(["HP Company"]);
    setSelectedBranches(["HP Branch 1"]);
    setSelectedGroups(["HP Group"]);
    setSelectedTypes(["Dumper", "Truck"]);
    setVehicleSearch("");
    setSelectedVehicleIds(["o1", "o2", "o3"]);
    toast.info("Filter options reset to default");
  };

  const handleApply = () => {
    const filterState: DashboardFilterState = {
      companies: selectedCompanies,
      branches: selectedBranches,
      groups: selectedGroups,
      types: selectedTypes,
      selectedVehicleIds,
    };

    toast.success("Filters applied successfully", {
      description: `${selectedCompanies.join(", ")} · ${selectedBranches.length} branch(es) · ${selectedVehicleIds.length} vehicle(s) selected`,
    });

    if (onApply) {
      onApply(filterState);
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
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
        />
      ) : null}

      <aside
        aria-hidden={!open}
        aria-label="Dashboard Filter Options"
        className={cn(
          "fixed right-0 top-0 z-50 flex h-screen w-full max-w-[420px] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
      >
        {/* 1. Header (Matching Reference Screenshot & 45px standard) */}
        <header className="flex h-[45px] items-center justify-between border-b border-border/70 px-5 bg-card/60 select-none shrink-0">
          <h2 className="text-sm font-bold tracking-tight text-foreground">
            Filter Options
          </h2>
          <button
            type="button"
            aria-label="Close filter"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* 2. Main Scrollable Content */}
        <div className="min-h-0 flex-1 flex flex-col p-5 space-y-4 overflow-y-auto">
          {/* Field 1: Company */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-foreground">
              Company
            </label>
            <MultiSelectDropdown
              label="Company"
              selected={selectedCompanies}
              options={companyOptions}
              onChange={setSelectedCompanies}
              placeholder="Select Company"
            />
          </div>

          {/* Field 2: Branch */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-foreground">
              Branch
            </label>
            <MultiSelectDropdown
              label="Branch"
              selected={selectedBranches}
              options={branchOptions}
              onChange={setSelectedBranches}
              placeholder="Select Branch"
            />
          </div>

          {/* Field 3: Group */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-foreground">
              Group
            </label>
            <MultiSelectDropdown
              label="Group"
              selected={selectedGroups}
              options={groupOptions}
              onChange={setSelectedGroups}
              placeholder="Select Group"
            />
          </div>

          {/* Field 4: Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-foreground">
              Type
            </label>
            <MultiSelectDropdown
              label="Type"
              selected={selectedTypes}
              options={typeOptions}
              onChange={setSelectedTypes}
              placeholder="Select Type"
            />
          </div>

          {/* Field 5: Vehicle List Section */}
          <div className="space-y-2 pt-2 border-t border-border/60 flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-foreground">
                Vehicle List
              </label>
              <span className="text-[11px] font-semibold text-muted-foreground">
                {selectedVehicleIds.length} of {allFilteredVehicleIds.length} selected
              </span>
            </div>

            {/* Vehicle Search Box */}
            <div className="relative shrink-0">
              <div className="flex h-8 items-center gap-1.5 rounded-md border border-input/80 bg-background px-2.5 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all">
                <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  value={vehicleSearch}
                  onChange={(e) => setVehicleSearch(e.target.value)}
                  placeholder="Search vehicles, IMEI, branch..."
                  aria-label="Search vehicles"
                  className="h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
                />
                {vehicleSearch && (
                  <button
                    type="button"
                    onClick={() => setVehicleSearch("")}
                    className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Tree / Grouped Vehicle Checkbox Container */}
            <div className="min-h-[220px] max-h-[320px] flex-1 flex flex-col rounded-lg border border-border/80 bg-card overflow-hidden shadow-2xs">
              {/* Select all header toolbar */}
              <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-3 py-2 shrink-0 select-none">
                <button
                  type="button"
                  onClick={toggleSelectAllVehicles}
                  className="text-xs font-semibold text-[#0089FF] hover:underline cursor-pointer"
                >
                  {allVehiclesSelected ? "Clear all" : "Select all"}
                </button>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {groupedVehicles.length} branch group(s)
                </span>
              </div>

              {/* Scrollable Vehicle List */}
              <div className="flex-1 min-h-0 overflow-y-auto p-1 divide-y divide-border/40">
                {groupedVehicles.map(({ branch, vehicles }) => {
                  const isExpanded =
                    openBranchGroups.includes(branch) ||
                    vehicleSearch.trim() !== "";
                  const branchIds = vehicles.map((v) => v.id);
                  const selectedBranchCount = vehicles.filter((v) =>
                    selectedVehicleIds.includes(v.id),
                  ).length;
                  const isBranchAllSelected =
                    selectedBranchCount === vehicles.length &&
                    vehicles.length > 0;
                  const isBranchSomeSelected =
                    selectedBranchCount > 0 && !isBranchAllSelected;

                  return (
                    <div key={branch} className="py-1">
                      {/* Branch Accordion Header */}
                      <div className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted/50 transition-colors select-none">
                        <div className="flex items-center gap-2 min-w-0">
                          <input
                            type="checkbox"
                            aria-label={`Select all vehicles in ${branch}`}
                            checked={isBranchAllSelected}
                            ref={(el) => {
                              if (el) el.indeterminate = isBranchSomeSelected;
                            }}
                            onChange={() => toggleBranchVehicles(vehicles)}
                            className="rounded border-input text-[#0089FF] cursor-pointer h-3.5 w-3.5 accent-[#0089FF]"
                          />
                          <button
                            type="button"
                            onClick={() => toggleBranchAccordion(branch)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-[#0089FF] transition-colors cursor-pointer text-left truncate"
                          >
                            <ChevronRight
                              className={cn(
                                "h-3.5 w-3.5 text-muted-foreground transition-transform duration-150",
                                isExpanded && "rotate-90",
                              )}
                            />
                            <span className="truncate">{branch}</span>
                          </button>
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground bg-muted/80 px-1.5 py-0.5 rounded-full">
                          {selectedBranchCount}/{vehicles.length}
                        </span>
                      </div>

                      {/* Branch Vehicles Sub-List */}
                      {isExpanded && (
                        <div className="mt-1 pl-6 pr-2 space-y-0.5">
                          {vehicles.map((v) => {
                            const isChecked = selectedVehicleIds.includes(v.id);
                            return (
                              <label
                                key={v.id}
                                className={cn(
                                  "flex items-center justify-between rounded-md px-2 py-1.5 text-xs transition-colors cursor-pointer select-none",
                                  isChecked
                                    ? "bg-[#0089FF]/10 text-foreground font-semibold"
                                    : "hover:bg-muted/60 text-foreground font-medium",
                                )}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleVehicle(v.id)}
                                    className="rounded border-input text-[#0089FF] cursor-pointer h-3.5 w-3.5 accent-[#0089FF]"
                                  />
                                  <Truck className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                  <div className="min-w-0 truncate">
                                    <span className="block truncate leading-tight text-xs font-semibold">
                                      {v.name}
                                    </span>
                                    <span className="block text-[10px] text-muted-foreground truncate leading-tight font-normal">
                                      {v.imei} · {v.driver}
                                    </span>
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {groupedVehicles.length === 0 && (
                  <div className="p-6 text-center text-xs text-muted-foreground italic">
                    No vehicles found matching &ldquo;{vehicleSearch}&rdquo;
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Sticky Drawer Footer Actions (Matching Reference Screenshot) */}
        <footer className="flex items-center justify-between border-t border-border bg-card/60 px-5 py-3.5 shrink-0 select-none">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-md border border-input/80 bg-background px-3 py-2 text-xs font-semibold text-foreground transition-all hover:bg-muted cursor-pointer shadow-2xs active:scale-98"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="h-9 rounded-md bg-[#155dfc] px-6 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#124ecf] cursor-pointer active:scale-98"
          >
            Apply Filters
          </button>
        </footer>
      </aside>
    </>
  );
}
