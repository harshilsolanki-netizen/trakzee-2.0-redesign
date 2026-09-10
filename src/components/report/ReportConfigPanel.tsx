import {
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  BRANCHES,
  COMPANIES,
  COMPARATORS,
  DURATION_UNITS,
  VEHICLE_BRANDS,
  VEHICLE_MODELS,
  VEHICLE_TYPES,
  getBranchesForCompanies,
  getGroupsForBranches,
} from "@/data/reports";
import { fleetObjects } from "@/data/fleet";
import { cn } from "@/lib/utils";

export type ReportFilters = {
  durationStatus: string;
  durationCompare: string;
  durationUnit: string;
  durationValue: string;
  distanceCompare: string;
  distanceValue: string;
  durationFormat: "hhmm" | "decimal";
  datePreset: string;
  from: string;
  to: string;
  enableTimeRange?: boolean;
  fromTime?: string;
  toTime?: string;
  companies?: string[];
  branches?: string[];
  groups?: string[];
  types?: string[];
  brands?: string[];
  models?: string[];
  objects: string[];
};

export const DEFAULT_FILTERS: ReportFilters = {
  durationStatus: "All",
  durationCompare: "Greater Than",
  durationUnit: "Hour",
  durationValue: "",
  distanceCompare: "Greater Than",
  distanceValue: "",
  durationFormat: "hhmm",
  datePreset: "Today",
  from: "2026-09-02",
  to: "2026-09-02",
  enableTimeRange: true,
  fromTime: "00:00",
  toTime: "23:59",
  companies: [],
  branches: [],
  groups: [],
  types: [],
  brands: [],
  models: [],
  objects: [],
};

export type ExportFormat = "XLS" | "PDF" | "CSV";
export type ExportScope = "summary" | "detail";

/**
 * Single Select Dropdown visually matching the report design system:
 * - h-7.5 sleek trigger
 * - Clear placeholder
 * - Checkmark indicator on active item
 * - Floating popover with custom scrollbar
 */
function SelectDropdown({
  value,
  options,
  onChange,
  className,
  placeholder,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
}) {
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

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-7.5 w-full items-center justify-between rounded-md border border-input/80 bg-background px-2.5 text-xs shadow-2xs transition-all hover:border-[#0089FF]/60 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF] cursor-pointer select-none",
          open && "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-muted/40",
        )}
      >
        <span
          className={cn(
            "truncate",
            value
              ? "text-foreground font-medium"
              : "text-muted-foreground/60 font-medium italic",
          )}
        >
          {value || placeholder || "Select"}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70 transition-transform duration-200 ml-1",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-52 overflow-y-auto rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md p-1 shadow-xl animate-in fade-in-0 zoom-in-95 select-none custom-scrollbar">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs transition-colors cursor-pointer select-none",
                value === opt
                  ? "bg-muted font-semibold text-foreground"
                  : "text-foreground hover:bg-muted/80 font-medium",
              )}
            >
              <span className="truncate">{opt}</span>
              {value === opt && (
                <Check className="h-3.5 w-3.5 text-[#0089FF] shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Universal Multi-Select Dropdown matching the title frame styling visually:
 * - h-7.5 sleek trigger
 * - FirstItem +Count formatted display
 * - Real-time search box
 * - Select all checkbox
 * - Red warning message when 0 items selected
 * - Clear / Cancel / Apply footer
 */
function UniversalMultiSelectDropdown({
  label,
  selected,
  options,
  onChange,
  className,
  placeholder,
}: {
  label: string;
  selected: string[];
  options: string[];
  onChange: (next: string[]) => void;
  className?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<string[]>(selected);
  const ref = useRef<HTMLDivElement | null>(null);

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

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-7.5 w-full items-center justify-between rounded-md border border-input/80 bg-background px-2.5 text-xs shadow-2xs transition-all hover:border-[#0089FF]/60 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF] cursor-pointer select-none",
          open && "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-muted/40",
        )}
      >
        <div className="flex items-center min-w-0 flex-1 overflow-hidden">
          {!selected || selected.length === 0 ? (
            <span className="text-muted-foreground/60 font-medium italic truncate">
              {placeholder || `Select ${label}`}
            </span>
          ) : (
            <>
              <span className="text-foreground font-medium truncate">
                {selected[0]}
              </span>
              {selected.length > 1 && (
                <span className="ml-1.5 inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-[#0089FF]/10 text-[#0089FF] border border-[#0089FF]/20 shrink-0">
                  +{selected.length - 1}
                </span>
              )}
            </>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70 transition-transform duration-200 ml-1",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 w-full rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md shadow-2xl animate-in fade-in-0 zoom-in-95 select-none overflow-hidden flex flex-col">
          {/* Header Row */}
          <div className="p-2.5 pb-2 border-b border-border/60 bg-muted/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                Select {label}
              </span>
              <span className="text-[10px] font-semibold text-[#0089FF] bg-[#0089FF]/10 px-2 py-0.5 rounded-full">
                {draft.length} selected
              </span>
            </div>

            {/* Search Box */}
            <div className="flex h-7 items-center gap-1.5 rounded-md border border-input bg-background px-2 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all">
              <Search className="h-3 w-3 text-muted-foreground shrink-0" />
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
                  <X className="h-2.5 w-2.5" />
                </button>
              )}
            </div>
          </div>

          {/* Select All Checkbox */}
          <div className="px-3 py-1.5 border-b border-border/60 flex items-center justify-between bg-muted/10">
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

          {/* Warning Message when 0 items selected */}
          {draft.length === 0 && (
            <div className="mx-2.5 my-1.5 px-2 py-1.5 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200/70 dark:border-red-800/40 text-[10px] text-red-600 dark:text-red-400 font-medium leading-snug">
              Select at least one item, or all items will be selected by default.
            </div>
          )}

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto p-1 space-y-0.5 custom-scrollbar">
            {filteredOptions.map((opt) => {
              const isChecked = draft.includes(opt);
              return (
                <label
                  key={opt}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-foreground transition-colors cursor-pointer select-none hover:bg-muted/80 font-medium"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleDraft(opt)}
                    className="rounded border-input text-[#0089FF] cursor-pointer h-3.5 w-3.5 accent-[#0089FF]"
                  />
                  <span className={cn("truncate", isChecked && "font-semibold text-foreground")}>
                    {opt}
                  </span>
                </label>
              );
            })}

            {filteredOptions.length === 0 && (
              <div className="p-3 text-center text-xs text-muted-foreground italic">
                No {label.toLowerCase()} found
              </div>
            )}
          </div>

          {/* Footer Toolbar */}
          <div className="p-2 px-3 border-t border-border/70 flex items-center justify-between bg-muted/20">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer transition-colors"
            >
              Clear
            </button>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCancel}
                className="px-2.5 py-1 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-3.5 py-1 text-xs rounded-md font-semibold text-white bg-[#0089FF] hover:bg-[#0070d6] shadow-xs transition-all active:scale-98 cursor-pointer"
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

export function ReportConfigPanel({
  open,
  onClose,
  filters,
  onChange,
  objectOptions,
  onApply,
  onExport,
}: {
  open: boolean;
  onClose: () => void;
  filters: ReportFilters;
  onChange: (patch: Partial<ReportFilters>) => void;
  objectOptions: { id: string; label: string; imei: string; branch: string }[];
  onApply: () => void;
  onExport?: (format: ExportFormat, scope: ExportScope) => void;
}) {
  const selectedCompanies = filters.companies || [];
  const selectedBranches = filters.branches || [];
  const selectedGroups = filters.groups || [];
  const selectedTypes = filters.types || [];
  const selectedVehicleIds = filters.objects || [];

  // Filter Overlay Popover State
  const [filterOverlayOpen, setFilterOverlayOpen] = useState(false);

  // 1. Company Options
  const companyOptions = useMemo(() => {
    return COMPANIES.filter((c) => c !== "All");
  }, []);

  // 2. Branch Options dynamically filtered by selected companies
  const branchOptions = useMemo(() => {
    return getBranchesForCompanies(selectedCompanies);
  }, [selectedCompanies]);

  // 3. Group Options dynamically filtered by selected branches
  const availableGroups = useMemo(() => {
    return getGroupsForBranches(selectedBranches);
  }, [selectedBranches]);

  const groupOptions = useMemo(() => {
    return availableGroups.length > 0
      ? availableGroups
      : ["HP Group", "Trucks", "Buses", "Cars", "Cold Chain"];
  }, [availableGroups]);

  // 4. Type Options
  const typeOptions = useMemo(() => {
    return VEHICLE_TYPES.filter((t) => t !== "All");
  }, []);

  // 5. Brand Options
  const brandOptions = useMemo(() => {
    return [
      "Ashok Leyland",
      ...VEHICLE_BRANDS.filter((b) => b !== "All" && b !== "Ashok Leyland"),
    ];
  }, []);

  // 6. Model Options
  const modelOptions = useMemo(() => {
    return [
      "10 Wheel",
      ...VEHICLE_MODELS.filter((m) => m !== "All" && m !== "10 Wheel"),
    ];
  }, []);

  // 7. Base Vehicle List enriched with metadata from fleetObjects
  const allVehiclesList = useMemo(() => {
    return fleetObjects.map((f) => ({
      id: f.id,
      name: f.name,
      imei: f.imei,
      branch: f.branch || "Head Office",
      driver: f.driver || "Unassigned",
      type: f.type,
      company: f.company || "HP Company",
    }));
  }, []);

  // 8. Dynamically filter vehicles based on selected Company and Branch
  const allFilteredVehicles = useMemo(() => {
    return allVehiclesList.filter((v) => {
      if (
        selectedCompanies.length > 0 &&
        !selectedCompanies.includes("All") &&
        !selectedCompanies.includes(v.company)
      ) {
        return false;
      }
      if (
        selectedBranches.length > 0 &&
        !selectedBranches.includes("All") &&
        !selectedBranches.includes(v.branch)
      ) {
        return false;
      }
      return true;
    });
  }, [allVehiclesList, selectedCompanies, selectedBranches]);

  const allFilteredVehicleIds = useMemo(() => {
    return allFilteredVehicles.map((v) => v.id);
  }, [allFilteredVehicles]);

  // Active Secondary Filter Count for Badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCompanies.length > 0 && !selectedCompanies.includes("All"))
      count++;
    if (selectedBranches.length > 0 && !selectedBranches.includes("All"))
      count++;
    return count;
  }, [selectedCompanies, selectedBranches]);

  // Chips Text Formatting
  const companyChipText = useMemo(() => {
    if (
      !selectedCompanies ||
      selectedCompanies.length === 0 ||
      selectedCompanies.includes("All")
    )
      return "All";
    if (selectedCompanies.length === 1) return selectedCompanies[0];
    return `${selectedCompanies[0]} +${selectedCompanies.length - 1}`;
  }, [selectedCompanies]);

  const branchChipText = useMemo(() => {
    if (
      !selectedBranches ||
      selectedBranches.length === 0 ||
      selectedBranches.includes("All")
    )
      return "All";
    if (selectedBranches.length === 1) return selectedBranches[0];
    return `${selectedBranches[0]} +${selectedBranches.length - 1}`;
  }, [selectedBranches]);

  // Vehicle Search State
  const [vehicleSearch, setVehicleSearch] = useState("");

  // Branch Accordion Open/Collapsed State
  const [openBranchGroups, setOpenBranchGroups] = useState<string[]>(() => [
    "Indonesia",
    "Thailand",
    "Valsad",
    "Planet Eco AL Khabaisi",
    "Planet Eco AL Nakheel",
    "Pune",
    "Itriangle",
  ]);

  // Group vehicles by Branch for the tree view
  const groupedVehicles = useMemo(() => {
    const q = vehicleSearch.trim().toLowerCase();
    const filtered = allFilteredVehicles.filter((v) => {
      if (!q) return true;
      const matchName = v.name.toLowerCase().includes(q);
      const matchImei = v.imei.toLowerCase().includes(q);
      const matchBranch = v.branch.toLowerCase().includes(q);
      const matchDriver = v.driver.toLowerCase().includes(q);
      return matchName || matchImei || matchBranch || matchDriver;
    });

    const groupsMap: Record<string, typeof filtered> = {};
    filtered.forEach((v) => {
      if (!groupsMap[v.branch]) {
        groupsMap[v.branch] = [];
      }
      groupsMap[v.branch].push(v);
    });

    return Object.entries(groupsMap).map(([branch, vehicles]) => ({
      branch,
      vehicles,
    }));
  }, [allFilteredVehicles, vehicleSearch]);

  const allVehiclesSelected =
    allFilteredVehicleIds.length > 0 &&
    allFilteredVehicleIds.every((id) => selectedVehicleIds.includes(id));

  const someVehiclesSelected =
    selectedVehicleIds.length > 0 && !allVehiclesSelected;

  const toggleSelectAllVehicles = () => {
    if (allVehiclesSelected) {
      onChange({ objects: [] });
    } else {
      onChange({ objects: allFilteredVehicleIds });
    }
  };

  const toggleBranchVehicles = (branchVehicles: { id: string }[]) => {
    const branchIds = branchVehicles.map((v) => v.id);
    const allInBranchSelected = branchIds.every((id) =>
      selectedVehicleIds.includes(id),
    );

    if (allInBranchSelected) {
      onChange({
        objects: selectedVehicleIds.filter((id) => !branchIds.includes(id)),
      });
    } else {
      onChange({
        objects: Array.from(new Set([...selectedVehicleIds, ...branchIds])),
      });
    }
  };

  const toggleVehicle = (id: string) => {
    if (selectedVehicleIds.includes(id)) {
      onChange({ objects: selectedVehicleIds.filter((vId) => vId !== id) });
    } else {
      onChange({ objects: [...selectedVehicleIds, id] });
    }
  };

  const toggleBranchAccordion = (branch: string) => {
    setOpenBranchGroups((prev) =>
      prev.includes(branch)
        ? prev.filter((b) => b !== branch)
        : [...prev, branch],
    );
  };

  const toggleAllBranchAccordions = () => {
    if (openBranchGroups.length === groupedVehicles.length) {
      setOpenBranchGroups([]);
    } else {
      setOpenBranchGroups(groupedVehicles.map((g) => g.branch));
    }
  };

  const handleReset = () => {
    onChange({
      companies: [],
      branches: [],
      groups: [],
      types: [],
      brands: [],
      models: [],
      durationCompare: "Greater Than",
      durationUnit: "Hour",
      durationValue: "",
      distanceCompare: "Greater Than",
      distanceValue: "",
      objects: [],
    });
    setVehicleSearch("");
    toast.info("Report filter options reset to default");
  };

  const handleDrawerApply = () => {
    onApply();
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
        aria-label="Report filter options"
        className={cn(
          "fixed right-0 top-[45px] bottom-0 z-40 flex w-full max-w-[420px] xl:max-w-[430px] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
      >
        {/* Standardized 56px Header matching Side Panel Design System */}
        <header className="flex h-[56px] items-center justify-between border-b border-border px-5 bg-background select-none shrink-0">
          <h2 className="text-[16px] font-semibold tracking-tight text-foreground">
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

        {/* Main Body: Scrollable with top filter bar, chips, vehicle list box, and form dropdowns below */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
          {/* 1. Top Search Bar with Embedded Filter/Edit Button */}
          <div className="relative shrink-0">
            <div className="flex h-7.5 items-center gap-1.5 rounded-md border border-input/80 bg-background px-2.5 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] hover:border-[#0089FF]/60 transition-all">
              <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <input
                type="text"
                value={vehicleSearch}
                onChange={(e) => setVehicleSearch(e.target.value)}
                placeholder="Select vehicle"
                aria-label="Search vehicles"
                className="h-full flex-1 bg-transparent text-xs font-medium text-foreground placeholder:font-medium placeholder:italic placeholder:text-muted-foreground/60 focus:outline-none min-w-0"
              />

              {vehicleSearch && (
                <button
                  type="button"
                  onClick={() => setVehicleSearch("")}
                  className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded mr-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}

              {/* Filter Button */}
              <button
                type="button"
                onClick={() => setFilterOverlayOpen(!filterOverlayOpen)}
                className="flex items-center gap-1 px-1 py-0.5 text-xs font-semibold text-[#0089FF] hover:text-[#0070d6] transition-colors cursor-pointer select-none shrink-0 active:scale-95"
                title="Filter by Company and Branch"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-[#0089FF]" />
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold leading-tight bg-[#0089FF] text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Floating Filter Options Overlay Popover for Company and Branch */}
            {filterOverlayOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/10"
                  onClick={() => setFilterOverlayOpen(false)}
                />
                <div className="absolute top-full left-0 right-0 z-50 mt-1.5 rounded-xl border border-border/80 bg-card p-4 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 space-y-3 custom-scrollbar">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-xs font-bold text-foreground">
                      Filter Attributes
                    </span>
                    <button
                      type="button"
                      onClick={() => setFilterOverlayOpen(false)}
                      className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Company */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-foreground">
                      Company
                    </label>
                    <UniversalMultiSelectDropdown
                      label="Company"
                      selected={selectedCompanies}
                      options={companyOptions}
                      onChange={(companies) => onChange({ companies })}
                      placeholder="Select Company"
                    />
                  </div>

                  {/* Branch */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-foreground">
                      Branch
                    </label>
                    <UniversalMultiSelectDropdown
                      label="Branch"
                      selected={selectedBranches}
                      options={branchOptions}
                      onChange={(branches) => onChange({ branches })}
                      placeholder="Select Branch"
                    />
                  </div>

                  {/* Overlay Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/60">
                    <button
                      type="button"
                      onClick={() => {
                        onChange({
                          companies: [],
                          branches: [],
                        });
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterOverlayOpen(false)}
                      className="px-3.5 py-1 rounded-md bg-[#0089FF] text-white text-xs font-semibold hover:bg-[#0070d6] cursor-pointer shadow-xs"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 2. Applied Filter Tags / Chips */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0 select-none">
            {/* Company Tag */}
            <button
              type="button"
              onClick={() => setFilterOverlayOpen(true)}
              className="inline-flex items-center gap-1 rounded-md bg-muted/50 hover:bg-muted border border-border/70 px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors cursor-pointer shadow-2xs"
            >
              <span>Company:</span>
              <span className="font-semibold text-foreground">
                {companyChipText}
              </span>
            </button>

            {/* Branch Tag */}
            <button
              type="button"
              onClick={() => setFilterOverlayOpen(true)}
              className="inline-flex items-center gap-1 rounded-md bg-muted/50 hover:bg-muted border border-border/70 px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors cursor-pointer shadow-2xs"
            >
              <span>Branch:</span>
              <span className="font-semibold text-foreground">
                {branchChipText}
              </span>
            </button>
          </div>

          {/* 3. Vehicle Checklist Section */}
          <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
            {/* Master Select all toolbar */}
            <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-3 py-2 shrink-0 select-none">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground">
                <input
                  type="checkbox"
                  checked={allVehiclesSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someVehiclesSelected;
                  }}
                  onChange={toggleSelectAllVehicles}
                  className="rounded border-input text-[#0089FF] cursor-pointer h-3.5 w-3.5 accent-[#0089FF]"
                />
                <span>Select all</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-muted-foreground">
                  {selectedVehicleIds.length} selected
                </span>
                <button
                  type="button"
                  onClick={toggleAllBranchAccordions}
                  className="text-[10px] text-muted-foreground hover:text-[#0089FF] font-semibold flex items-center gap-0.5 cursor-pointer p-0.5 rounded hover:bg-muted"
                  title="Expand/Collapse All Branches"
                >
                  <ChevronsUpDown className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Red Warning Message when 0 vehicles selected */}
            {selectedVehicleIds.length === 0 && (
              <div className="mx-3 my-1.5 px-2.5 py-1.5 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200/70 dark:border-red-800/40 text-[10px] text-red-600 dark:text-red-400 font-medium leading-snug shrink-0">
                Select at least one vehicle, or all vehicles will be included.
              </div>
            )}

            {/* Scrollable Bounded Branch List with Chevrons and Badges */}
            <div className="max-h-[190px] overflow-y-auto p-1 divide-y divide-border/40 custom-scrollbar">
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
                          <span className="text-[10px] tabular-nums text-muted-foreground font-normal">
                            [{vehicles.length}]
                          </span>
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
                              className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs transition-colors cursor-pointer select-none hover:bg-muted/60 text-foreground font-medium"
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

          {/* 4. Filter Form Fields directly matching Reference Image (Group, Type, Brand, Model, Thresholds) */}
          <div className="space-y-3 pt-1">
            {/* Group */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-foreground">
                Group
              </label>
              <UniversalMultiSelectDropdown
                label="Group"
                selected={filters.groups || []}
                options={groupOptions}
                onChange={(groups) => onChange({ groups })}
                placeholder="Select Group"
              />
            </div>

            {/* Type */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-foreground">
                Type
              </label>
              <UniversalMultiSelectDropdown
                label="Type"
                selected={filters.types || []}
                options={typeOptions}
                onChange={(types) => onChange({ types })}
                placeholder="Select Type"
              />
            </div>

            {/* Brand */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-foreground">
                Brand
              </label>
              <SelectDropdown
                value={filters.brands?.[0] || ""}
                options={brandOptions}
                onChange={(b) => onChange({ brands: [b] })}
                placeholder="Select Brand"
              />
            </div>

            {/* Model */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-foreground">
                Model
              </label>
              <SelectDropdown
                value={filters.models?.[0] || ""}
                options={modelOptions}
                onChange={(m) => onChange({ models: [m] })}
                placeholder="Select Model"
              />
            </div>

            {/* Duration Threshold */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-foreground">
                Duration Threshold
              </label>
              <div className="grid grid-cols-12 gap-1.5">
                <div className="col-span-5">
                  <SelectDropdown
                    value={filters.durationCompare || "Greater Than"}
                    options={COMPARATORS}
                    onChange={(durationCompare) =>
                      onChange({ durationCompare })
                    }
                    placeholder="Comparator"
                  />
                </div>
                <div className="col-span-4">
                  <SelectDropdown
                    value={filters.durationUnit || "Hour"}
                    options={DURATION_UNITS}
                    onChange={(durationUnit) => onChange({ durationUnit })}
                    placeholder="Unit"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={filters.durationValue || ""}
                    onChange={(e) =>
                      onChange({ durationValue: e.target.value })
                    }
                    placeholder="e.g. 5"
                    className="h-7.5 w-full rounded-md border border-input/80 bg-background px-2 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 shadow-2xs transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Distance Threshold (km) */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-foreground">
                Group
              </label>
              <div className="grid grid-cols-12 gap-1.5">
                <div className="col-span-7">
                  <SelectDropdown
                    value={filters.distanceCompare || "Greater Than"}
                    options={COMPARATORS}
                    onChange={(distanceCompare) =>
                      onChange({ distanceCompare })
                    }
                    placeholder="Comparator"
                  />
                </div>
                <div className="col-span-5">
                  <input
                    type="text"
                    value={filters.distanceValue || ""}
                    onChange={(e) =>
                      onChange({ distanceValue: e.target.value })
                    }
                    placeholder="e.g. 5"
                    className="h-7.5 w-full rounded-md border border-input/80 bg-background px-2 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 shadow-2xs transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Standardized Drawer Footer matching Side Panel Design System (56px) */}
        <footer className="flex h-[56px] items-center justify-between border-t border-border bg-background px-5 shrink-0 select-none">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-md border border-input/80 bg-background px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-muted cursor-pointer shadow-2xs active:scale-98"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleDrawerApply}
            className="h-8 rounded-md bg-[#0089FF] px-5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#0070d6] cursor-pointer active:scale-98"
          >
            Apply Filters
          </button>
        </footer>
      </aside>
    </>
  );
}
