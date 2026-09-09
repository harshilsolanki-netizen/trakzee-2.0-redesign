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

interface UniversalMultiSelectDropdownProps {
  label: string;
  selected: string[];
  options: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Universal Multi-Select Dropdown matching the exact design and behavior
 * from the reference screenshots (with search, select all, 0-selection warning banner,
 * Clear/Cancel/Apply footer, and "+N" closed state formatting e.g. "GJ21HS1609+100").
 */
function UniversalMultiSelectDropdown({
  label,
  selected,
  options,
  onChange,
  placeholder,
  className,
}: UniversalMultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<string[]>(selected);
  const ref = useRef<HTMLDivElement | null>(null);

  // Sync draft when opened or when parent selection changes
  useEffect(() => {
    if (open) {
      setDraft(selected);
      setSearch("");
    }
  }, [open, selected]);

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

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, search]);

  const isAllDraftSelected =
    filteredOptions.length > 0 &&
    filteredOptions.every((opt) => draft.includes(opt));

  const toggleDraft = (opt: string) => {
    if (draft.includes(opt)) {
      setDraft(draft.filter((s) => s !== opt));
    } else {
      setDraft([...draft, opt]);
    }
  };

  const toggleAllDraft = () => {
    if (isAllDraftSelected) {
      setDraft(draft.filter((s) => !filteredOptions.includes(s)));
    } else {
      setDraft([...new Set([...draft, ...filteredOptions])]);
    }
  };

  const handleApply = () => {
    onChange(draft);
    setOpen(false);
  };

  const handleCancel = () => {
    setDraft(selected);
    setOpen(false);
  };

  const handleClear = () => {
    setDraft([]);
  };

  // Closed trigger display text: e.g. "GJ21HS1609+100", "HP Group+7", "Dumper+2"
  const displayText = useMemo(() => {
    if (!selected || selected.length === 0) {
      return placeholder || `Select ${label}`;
    }
    if (selected.length === 1) return selected[0];
    return `${selected[0]}+${selected.length - 1}`;
  }, [selected, label, placeholder]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-7.5 w-full items-center justify-between rounded-md border border-input/80 bg-background px-2.5 text-xs text-foreground font-semibold shadow-2xs transition-all hover:border-[#0089FF]/60 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF] cursor-pointer select-none",
          open && "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-muted/40",
        )}
      >
        <span className="truncate flex items-center min-w-0">
          {!selected || selected.length === 0 ? (
            <span className="text-muted-foreground/60 font-normal italic truncate">
              {placeholder || `Select ${label}`}
            </span>
          ) : (
            <>
              <span className="truncate font-semibold text-foreground">
                {selected[0]}
              </span>
              {selected.length > 1 && (
                <span className="ml-1.5 inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#0089FF]/10 text-[#0089FF] border border-[#0089FF]/20 shrink-0">
                  +{selected.length - 1}
                </span>
              )}
            </>
          )}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70 transition-transform duration-200 ml-1",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 w-full rounded-xl border border-border/80 bg-popover/98 backdrop-blur-xl shadow-2xl animate-in fade-in-0 zoom-in-95 select-none overflow-hidden flex flex-col">
          {/* Header Row: Title on left, N selected on right */}
          <div className="p-3 pb-2 border-b border-border/60 bg-muted/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                Select {label}
              </span>
              <span className="text-[10px] font-semibold text-[#0089FF] bg-[#0089FF]/10 px-2 py-0.5 rounded-full">
                {draft.length} selected
              </span>
            </div>

            {/* Search Box */}
            <div className="flex h-8 items-center gap-1.5 rounded-md border border-input bg-background px-2.5 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all">
              <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="rounded-md p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Select All Checkbox */}
          <div className="px-3.5 py-1.5 border-b border-border/60 flex items-center justify-between bg-muted/10">
            <label className="flex items-center gap-2 cursor-pointer select-none w-full text-xs font-semibold text-foreground">
              <input
                type="checkbox"
                checked={isAllDraftSelected}
                onChange={toggleAllDraft}
                className="h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer"
              />
              <span>Select All</span>
            </label>
          </div>

          {/* Reference Warning Message when 0 items selected */}
          {draft.length === 0 && (
            <div className="mx-3 my-1.5 px-2.5 py-1.5 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200/70 dark:border-red-800/40 text-[10px] text-red-600 dark:text-red-400 font-medium leading-snug">
              Select at least one item, or all items will be selected by default.
            </div>
          )}

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
            {filteredOptions.map((opt) => {
              const isChecked = draft.includes(opt);
              return (
                <label
                  key={opt}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs text-foreground transition-colors cursor-pointer select-none",
                    isChecked
                      ? "bg-[#0089FF]/10 text-[#0089FF] font-semibold hover:bg-[#0089FF]/15"
                      : "hover:bg-muted/80 hover:text-foreground font-medium",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleDraft(opt)}
                    className="rounded border-input text-brand cursor-pointer h-3.5 w-3.5 accent-[#0089FF]"
                  />
                  <span className="truncate">{opt}</span>
                </label>
              );
            })}

            {filteredOptions.length === 0 && (
              <div className="p-4 text-center text-xs text-muted-foreground italic">
                No {label.toLowerCase()} found
              </div>
            )}
          </div>

          {/* Footer Toolbar: Clear, Cancel, Apply */}
          <div className="p-2.5 px-3.5 border-t border-border/70 flex items-center justify-between bg-muted/20">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer transition-colors"
            >
              Clear
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-4 py-1.5 text-xs rounded-md font-semibold text-white bg-[#155dfc] hover:bg-[#124ecf] shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
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
          className="fixed top-[45px] bottom-0 left-0 sm:left-[68px] right-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
        />
      ) : null}

      <aside
        aria-hidden={!open}
        aria-label="Dashboard Filter Options"
        className={cn(
          "fixed right-0 top-[45px] bottom-0 z-40 flex w-full max-w-[420px] xl:max-w-[430px] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
      >
        {/* 1. Header (Matching Reference Screenshot & 45px standard) */}
        <header className="flex h-[45px] items-center justify-between border-b border-border px-5 bg-background select-none shrink-0">
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

        {/* 2. Main Content Area (Stretches smoothly with side padding) */}
        <div className="min-h-0 flex-1 flex flex-col p-5 space-y-3.5 overflow-y-auto">
          {/* Top Dropdowns Container */}
          <div className="space-y-3 shrink-0">
            {/* Field 1: Company */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-muted-foreground">
                Company
              </label>
              <UniversalMultiSelectDropdown
                label="Company"
                selected={selectedCompanies}
                options={companyOptions}
                onChange={setSelectedCompanies}
                placeholder="Select Company"
              />
            </div>

            {/* Field 2: Branch */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-muted-foreground">
                Branch
              </label>
              <UniversalMultiSelectDropdown
                label="Branch"
                selected={selectedBranches}
                options={branchOptions}
                onChange={setSelectedBranches}
                placeholder="Select Branch"
              />
            </div>

            {/* Field 3: Group */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-muted-foreground">
                Group
              </label>
              <UniversalMultiSelectDropdown
                label="Group"
                selected={selectedGroups}
                options={groupOptions}
                onChange={setSelectedGroups}
                placeholder="Select Group"
              />
            </div>

            {/* Field 4: Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-muted-foreground">
                Type
              </label>
              <UniversalMultiSelectDropdown
                label="Type"
                selected={selectedTypes}
                options={typeOptions}
                onChange={setSelectedTypes}
                placeholder="Select Type"
              />
            </div>
          </div>

          {/* Field 5: Vehicle List Section (Stretches all the way down to the footer) */}
          <div className="space-y-2 pt-2 border-t border-border/60 flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between shrink-0">
              <label className="block text-xs font-medium text-muted-foreground">
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
                  className="h-full flex-1 bg-transparent text-xs font-semibold text-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 focus:outline-none"
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

            {/* Tree / Grouped Vehicle Checkbox Container (Extends to bottom) */}
            <div className="flex-1 min-h-[200px] flex flex-col rounded-lg border border-border/80 bg-card overflow-hidden shadow-2xs">
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

              {/* Reference Warning Message when 0 vehicles selected */}
              {selectedVehicleIds.length === 0 && (
                <div className="mx-3 my-1.5 px-2.5 py-1.5 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200/70 dark:border-red-800/40 text-[10px] text-red-600 dark:text-red-400 font-medium leading-snug shrink-0">
                  Select at least one item, or all items will be selected by default.
                </div>
              )}

              {/* Scrollable Vehicle List extending smoothly */}
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
                        <span className="text-[10px] font-semibold text-muted-foreground bg-muted/80 px-1.5 py-0.5 rounded-full">
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

        {/* 3. Sticky Drawer Footer Actions */}
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
