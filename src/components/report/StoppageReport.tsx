import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Clock,
  Maximize2,
  Minimize2,
  RotateCcw,
  Search,
  Settings,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { TablePaginationBar } from "@/components/common/TablePaginationBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  STOPPAGE_SUMMARY_ROWS,
  type StoppageSummaryRow,
} from "@/data/stoppageData";
import { cn } from "@/lib/utils";

const PRESET_OPTIONS = [
  "Today",
  "Yesterday",
  "This Week",
  "Last Week",
  "Last 7 Days",
  "This Month",
  "Last Month",
  "Custom Range",
];

const HOUR_OPTIONS = [
  "12", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11",
];

const MINUTE_OPTIONS = [
  "00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "59",
];

const VEHICLE_GROUP_OPTIONS = [
  "All",
  "Emergency Response",
  "Heavy Commercial",
  "Light Commercial",
  "Passenger",
  "Fleet 1",
  "Logistics",
  "Delivery",
];

const VEHICLE_TYPE_OPTIONS = [
  "All",
  "Truck",
  "Bus",
  "Van",
  "Car",
  "Trailer",
  "Tanker",
  "Dumper",
];

const VEHICLE_BRAND_OPTIONS = [
  "All",
  "Tata Motors",
  "Mahindra",
  "Ashok Leyland",
  "BharatBenz",
  "Volvo",
  "Eicher",
  "Force Motors",
];

const VEHICLE_MODEL_OPTIONS = [
  "All",
  "Signa 4825",
  "Bolero Maxi Truck",
  "Captain 2518",
  "1617R",
  "Pro 3015",
  "FH16",
  "Trax Cruiser",
];

const CALCULATION_FOR_OPTIONS = [
  "All",
  "Stoppage",
  "Idle",
  "Movement",
  "Trip",
  "Ignition",
];

const DURATION_COMPARATOR_OPTIONS = [
  "Greater Than",
  "Less Than",
  "Equal To",
  "Greater Than or Equal",
  "Less Than or Equal",
];

function FilterSelectDropdown({
  value,
  options,
  onChange,
  placeholder,
}: {
  value: string;
  options: string[];
  onChange: (val: string) => void;
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
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-8.5 w-full items-center justify-between rounded-md border border-input/80 bg-background px-3 text-xs shadow-2xs transition-all hover:border-[#0089FF]/60 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF] cursor-pointer select-none",
          open && "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-muted/40"
        )}
      >
        <span className={cn("truncate", value ? "text-foreground font-medium" : "text-muted-foreground font-medium")}>
          {value || placeholder || "All"}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70 transition-transform duration-200 ml-1",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-60 mt-1 max-h-52 overflow-y-auto rounded-md border border-border/80 bg-popover/95 backdrop-blur-md p-1 shadow-xl animate-in fade-in-0 zoom-in-95 select-none custom-scrollbar">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-sm px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer select-none",
                value === opt
                  ? "bg-[#0089FF]/10 text-[#0089FF] font-semibold"
                  : "text-foreground hover:bg-muted font-medium"
              )}
            >
              <span className="truncate">{opt}</span>
              {value === opt && <Check className="h-3.5 w-3.5 text-[#0089FF] shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function StoppageReport({ hideTitle = false }: { hideTitle?: boolean } = {}) {
  const [level, setLevel] = useState<0 | 1>(0); // 0 = Summary, 1 = Detailed
  const [selectedVehicle, setSelectedVehicle] = useState<StoppageSummaryRow | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedSearchField, setSelectedSearchField] = useState<"all" | "company" | "vehicle" | "driver" | "imei">("all");
  const allCompaniesList = useMemo(() => {
    const set = new Set<string>();
    STOPPAGE_SUMMARY_ROWS.forEach((r) => {
      if (r.company) set.add(r.company);
    });
    return Array.from(set);
  }, []);

  // Multi-Company Selection State
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [draftCompanies, setDraftCompanies] = useState<string[]>([]);
  const [companySearch, setCompanySearch] = useState("");

  // All available vehicles based on selected companies
  const availableVehicles = useMemo(() => {
    const isFiltered =
      selectedCompanies.length > 0 &&
      selectedCompanies.length < allCompaniesList.length &&
      !selectedCompanies.includes("All");

    if (!isFiltered) {
      return STOPPAGE_SUMMARY_ROWS.map((r) => ({
        id: r.id,
        name: r.vehicle,
        imei: r.imei,
        company: r.company,
      }));
    }
    return STOPPAGE_SUMMARY_ROWS.filter((r) =>
      selectedCompanies.includes(r.company)
    ).map((r) => ({
      id: r.id,
      name: r.vehicle,
      imei: r.imei,
      company: r.company,
    }));
  }, [selectedCompanies, allCompaniesList.length]);

  const availableVehicleIds = useMemo(() => {
    return availableVehicles.map((v) => v.id);
  }, [availableVehicles]);

  // Multi-Vehicle Selection State
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [draftVehicles, setDraftVehicles] = useState<string[]>([]);
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);

  const [pageSize, setPageSize] = useState<number>(20);
  const [detailedPageSize, setDetailedPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<"vehicle" | "distance">("vehicle");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Popover States matching existing report UI
  const [dateOpen, setDateOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [presetMenuOpen, setPresetMenuOpen] = useState(false);
  const [draftPreset, setDraftPreset] = useState("Today");

  // Sync draft companies on popover open
  useEffect(() => {
    if (companyOpen) {
      setDraftCompanies(
        selectedCompanies.length === 0 || selectedCompanies.includes("All")
          ? [...allCompaniesList]
          : [...selectedCompanies]
      );
      setCompanySearch("");
    }
  }, [companyOpen, selectedCompanies, allCompaniesList]);

  // Sync draft vehicles on popover open
  useEffect(() => {
    if (vehicleOpen) {
      const valid =
        selectedVehicles.length > 0 && !selectedVehicles.includes("All")
          ? selectedVehicles.filter((id) => availableVehicleIds.includes(id))
          : [];
      setDraftVehicles(valid.length > 0 ? valid : [...availableVehicleIds]);
      setVehicleSearch("");
    }
  }, [vehicleOpen, selectedVehicles, availableVehicleIds]);

  const isAllCompaniesDraftSelected =
    draftCompanies.length === allCompaniesList.length && allCompaniesList.length > 0;

  const toggleAllDraftCompanies = () => {
    if (isAllCompaniesDraftSelected) {
      setDraftCompanies([]);
    } else {
      setDraftCompanies([...allCompaniesList]);
    }
  };

  const toggleDraftCompany = (comp: string) => {
    if (draftCompanies.includes(comp)) {
      setDraftCompanies(draftCompanies.filter((x) => x !== comp));
    } else {
      setDraftCompanies([...draftCompanies, comp]);
    }
  };

  const handleApplyCompanies = () => {
    setSelectedCompanies(draftCompanies);
    setCompanyOpen(false);
    setCurrentPage(1);
  };

  const filteredCompanyList = useMemo(() => {
    const q = companySearch.trim().toLowerCase();
    if (!q) return allCompaniesList;
    return allCompaniesList.filter((c) => c.toLowerCase().includes(q));
  }, [allCompaniesList, companySearch]);

  const companyLabel = useMemo(() => {
    if (
      selectedCompanies.length === 0 ||
      selectedCompanies.length === allCompaniesList.length ||
      selectedCompanies.includes("All")
    ) {
      return "All";
    }
    if (selectedCompanies.length === 1) return selectedCompanies[0];
    return `${selectedCompanies[0]} +${selectedCompanies.length - 1}`;
  }, [selectedCompanies, allCompaniesList.length]);

  const isAllVehiclesDraftSelected =
    draftVehicles.length === availableVehicleIds.length &&
    availableVehicleIds.length > 0;

  const toggleAllDraftVehicles = () => {
    if (isAllVehiclesDraftSelected) {
      setDraftVehicles([]);
    } else {
      setDraftVehicles([...availableVehicleIds]);
    }
  };

  const toggleDraftVehicle = (id: string) => {
    if (draftVehicles.includes(id)) {
      setDraftVehicles(draftVehicles.filter((x) => x !== id));
    } else {
      setDraftVehicles([...draftVehicles, id]);
    }
  };

  const toggleGroupVehicles = (groupName: string, groupVehicleIds: string[]) => {
    const allIn = groupVehicleIds.every((id) => draftVehicles.includes(id));
    if (allIn) {
      setDraftVehicles(draftVehicles.filter((id) => !groupVehicleIds.includes(id)));
    } else {
      setDraftVehicles([...new Set([...draftVehicles, ...groupVehicleIds])]);
    }
  };

  const toggleCollapseGroup = (groupName: string) => {
    setCollapsedGroups((prev) =>
      prev.includes(groupName)
        ? prev.filter((g) => g !== groupName)
        : [...prev, groupName]
    );
  };

  const handleApplyVehicles = () => {
    setSelectedVehicles(draftVehicles);
    setVehicleOpen(false);
    setCurrentPage(1);
  };

  const groupedFilteredVehicles = useMemo(() => {
    const q = vehicleSearch.trim().toLowerCase();
    const map = new Map<string, { id: string; name: string; imei: string; company: string }[]>();

    for (const v of availableVehicles) {
      const matches =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.imei.toLowerCase().includes(q) ||
        v.company.toLowerCase().includes(q);
      if (matches) {
        const list = map.get(v.company) || [];
        list.push(v);
        map.set(v.company, list);
      }
    }
    return Array.from(map.entries());
  }, [availableVehicles, vehicleSearch]);

  const vehicleLabel = useMemo(() => {
    const list =
      selectedVehicles.length > 0 && !selectedVehicles.includes("All")
        ? selectedVehicles.filter((id) => availableVehicleIds.includes(id))
        : [];
    if (list.length === 0 || list.length === availableVehicleIds.length) {
      return "All";
    }
    if (list.length === 1) {
      const v = availableVehicles.find((item) => item.id === list[0]);
      return v ? v.name : list[0];
    }
    return `${list.length} selected`;
  }, [selectedVehicles, availableVehicleIds, availableVehicles]);

  // Filter Options Drawer State (Matches media_1795501364213_f8dc9897.png)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [drawerVehicleSearch, setDrawerVehicleSearch] = useState("");
  const [drawerSelectedVehicleIds, setDrawerSelectedVehicleIds] = useState<string[]>([]);
  const [drawerOpenGroups, setDrawerOpenGroups] = useState<string[]>(["11059-OC Communications"]);
  const [drawerVehicleListHeight, setDrawerVehicleListHeight] = useState(190);
  const [isResizingDrawerVehicleList, setIsResizingDrawerVehicleList] = useState(false);

  // Applied Filter Options
  const [filterVehicleGroup, setFilterVehicleGroup] = useState("All");
  const [filterVehicleType, setFilterVehicleType] = useState("All");
  const [filterVehicleBrand, setFilterVehicleBrand] = useState("All");
  const [filterVehicleModel, setFilterVehicleModel] = useState("All");
  const [filterCalculationFor, setFilterCalculationFor] = useState("All");
  const [filterDurationCompare, setFilterDurationCompare] = useState("Greater Than");
  const [filterDurationValue, setFilterDurationValue] = useState("");

  // Draft values inside Drawer
  const [draftVehicleGroup, setDraftVehicleGroup] = useState("All");
  const [draftVehicleType, setDraftVehicleType] = useState("All");
  const [draftVehicleBrand, setDraftVehicleBrand] = useState("All");
  const [draftVehicleModel, setDraftVehicleModel] = useState("All");
  const [draftCalculationFor, setDraftCalculationFor] = useState("All");
  const [draftDurationCompare, setDraftDurationCompare] = useState("Greater Than");
  const [draftDurationValue, setDraftDurationValue] = useState("");

  const allDrawerVehicleIds = useMemo(() => {
    return availableVehicles.map((v) => v.id);
  }, [availableVehicles]);

  // Synchronize drawer draft state when drawer opens
  useEffect(() => {
    if (filterDrawerOpen) {
      setDrawerSelectedVehicleIds(
        selectedVehicles.length > 0 && !selectedVehicles.includes("All")
          ? [...selectedVehicles]
          : availableVehicles.map((v) => v.id)
      );
      setDraftVehicleGroup(filterVehicleGroup);
      setDraftVehicleType(filterVehicleType);
      setDraftVehicleBrand(filterVehicleBrand);
      setDraftVehicleModel(filterVehicleModel);
      setDraftCalculationFor(filterCalculationFor);
      setDraftDurationCompare(filterDurationCompare);
      setDraftDurationValue(filterDurationValue);
      setDrawerVehicleSearch("");
    }
  }, [
    filterDrawerOpen,
    selectedVehicles,
    availableVehicles,
    filterVehicleGroup,
    filterVehicleType,
    filterVehicleBrand,
    filterVehicleModel,
    filterCalculationFor,
    filterDurationCompare,
    filterDurationValue,
  ]);

  const isAllDrawerVehiclesSelected =
    drawerSelectedVehicleIds.length === allDrawerVehicleIds.length && allDrawerVehicleIds.length > 0;
  const isSomeDrawerVehiclesSelected =
    drawerSelectedVehicleIds.length > 0 && !isAllDrawerVehiclesSelected;

  const toggleAllDrawerVehicles = () => {
    if (isAllDrawerVehiclesSelected) {
      setDrawerSelectedVehicleIds([]);
    } else {
      setDrawerSelectedVehicleIds([...allDrawerVehicleIds]);
    }
  };

  const toggleDrawerVehicle = (id: string) => {
    if (drawerSelectedVehicleIds.includes(id)) {
      setDrawerSelectedVehicleIds(drawerSelectedVehicleIds.filter((x) => x !== id));
    } else {
      setDrawerSelectedVehicleIds([...drawerSelectedVehicleIds, id]);
    }
  };

  const toggleDrawerGroupVehicles = (groupVehicleIds: string[]) => {
    const allIn = groupVehicleIds.every((id) => drawerSelectedVehicleIds.includes(id));
    if (allIn) {
      setDrawerSelectedVehicleIds(drawerSelectedVehicleIds.filter((id) => !groupVehicleIds.includes(id)));
    } else {
      setDrawerSelectedVehicleIds([...new Set([...drawerSelectedVehicleIds, ...groupVehicleIds])]);
    }
  };

  const toggleDrawerGroupAccordion = (groupName: string) => {
    setDrawerOpenGroups((prev) =>
      prev.includes(groupName) ? prev.filter((g) => g !== groupName) : [...prev, groupName]
    );
  };

  const toggleAllDrawerGroups = () => {
    const allGroupNames = Array.from(new Set(availableVehicles.map((v) => v.company)));
    if (drawerOpenGroups.length === allGroupNames.length) {
      setDrawerOpenGroups([]);
    } else {
      setDrawerOpenGroups(allGroupNames);
    }
  };

  const drawerGroupedVehicles = useMemo(() => {
    const q = drawerVehicleSearch.trim().toLowerCase();
    const map = new Map<string, { id: string; name: string; imei: string; company: string }[]>();

    for (const v of availableVehicles) {
      const matches =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.imei.toLowerCase().includes(q) ||
        v.company.toLowerCase().includes(q);
      if (matches) {
        const list = map.get(v.company) || [];
        list.push(v);
        map.set(v.company, list);
      }
    }
    return Array.from(map.entries());
  }, [availableVehicles, drawerVehicleSearch]);

  const startResizeDrawerVehicleList = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingDrawerVehicleList(true);
    const startY = e.clientY;
    const startH = drawerVehicleListHeight;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const nextH = Math.min(380, Math.max(120, startH + (moveEvent.clientY - startY)));
      setDrawerVehicleListHeight(nextH);
    };

    const onMouseUp = () => {
      setIsResizingDrawerVehicleList(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleApplyFilterDrawer = () => {
    setSelectedVehicles(drawerSelectedVehicleIds);
    setFilterVehicleGroup(draftVehicleGroup);
    setFilterVehicleType(draftVehicleType);
    setFilterVehicleBrand(draftVehicleBrand);
    setFilterVehicleModel(draftVehicleModel);
    setFilterCalculationFor(draftCalculationFor);
    setFilterDurationCompare(draftDurationCompare);
    setFilterDurationValue(draftDurationValue);
    setFilterDrawerOpen(false);
    setCurrentPage(1);
    toast.success("Filter options applied successfully");
  };

  const handleResetFilterDrawer = () => {
    setDrawerSelectedVehicleIds([...allDrawerVehicleIds]);
    setDraftVehicleGroup("All");
    setDraftVehicleType("All");
    setDraftVehicleBrand("All");
    setDraftVehicleModel("All");
    setDraftCalculationFor("All");
    setDraftDurationCompare("Greater Than");
    setDraftDurationValue("");
    setFilterVehicleGroup("All");
    setFilterVehicleType("All");
    setFilterVehicleBrand("All");
    setFilterVehicleModel("All");
    setFilterCalculationFor("All");
    setFilterDurationCompare("Greater Than");
    setFilterDurationValue("");
    setSelectedVehicles([]);
    toast.info("Filter options reset to default");
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedVehicles.length > 0 && selectedVehicles.length < allDrawerVehicleIds.length) count++;
    if (filterVehicleGroup !== "All") count++;
    if (filterVehicleType !== "All") count++;
    if (filterVehicleBrand !== "All") count++;
    if (filterVehicleModel !== "All") count++;
    if (filterCalculationFor !== "All") count++;
    if (filterDurationValue.trim() !== "") count++;
    return count;
  }, [
    selectedVehicles.length,
    allDrawerVehicleIds.length,
    filterVehicleGroup,
    filterVehicleType,
    filterVehicleBrand,
    filterVehicleModel,
    filterCalculationFor,
    filterDurationValue,
  ]);

  // Date and Time picker state
  const [dateRangeText, setDateRangeText] = useState("24/11/2026 12:00 AM - 24/11/2026 09:50 AM");
  const [fromHour, setFromHour] = useState("12");
  const [fromMinute, setFromMinute] = useState("00");
  const [fromAmPm, setFromAmPm] = useState<"AM" | "PM">("AM");
  const [toHour, setToHour] = useState("09");
  const [toMinute, setToMinute] = useState("50");
  const [toAmPm, setToAmPm] = useState<"AM" | "PM">("AM");

  // Filtered rows calculation
  const filteredRows = useMemo(() => {
    let rows = [...STOPPAGE_SUMMARY_ROWS];

    // Company filter
    if (
      selectedCompanies.length > 0 &&
      selectedCompanies.length < allCompaniesList.length &&
      !selectedCompanies.includes("All")
    ) {
      rows = rows.filter((r) => selectedCompanies.includes(r.company));
    }

    // Vehicle filter
    if (
      selectedVehicles.length > 0 &&
      selectedVehicles.length < availableVehicleIds.length &&
      !selectedVehicles.includes("All")
    ) {
      rows = rows.filter((r) => selectedVehicles.includes(r.id));
    }

    // Filter by Brand if not All
    if (filterVehicleBrand !== "All") {
      rows = rows.filter((r) => r.vehicleBrand.toLowerCase().includes(filterVehicleBrand.toLowerCase()));
    }

    // Filter by Model if not All
    if (filterVehicleModel !== "All") {
      rows = rows.filter((r) => r.vehicleModel.toLowerCase().includes(filterVehicleModel.toLowerCase()));
    }

    // Filter by Duration Value if provided
    if (filterDurationValue.trim()) {
      const val = parseFloat(filterDurationValue.trim());
      if (!isNaN(val)) {
        rows = rows.filter((r) => {
          const parts = (r.stop || "00:00:00").split(":").map(Number);
          const totalMinutes = (parts[0] || 0) * 60 + (parts[1] || 0) + (parts[2] || 0) / 60;
          if (filterDurationCompare === "Greater Than") return totalMinutes > val;
          if (filterDurationCompare === "Less Than") return totalMinutes < val;
          if (filterDurationCompare === "Equal To") return Math.abs(totalMinutes - val) < 0.1;
          if (filterDurationCompare === "Greater Than or Equal") return totalMinutes >= val;
          if (filterDurationCompare === "Less Than or Equal") return totalMinutes <= val;
          return true;
        });
      }
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      rows = rows.filter((r) => {
        if (selectedSearchField === "company") return r.company.toLowerCase().includes(q);
        if (selectedSearchField === "vehicle") return r.vehicle.toLowerCase().includes(q);
        if (selectedSearchField === "driver") return r.driver.toLowerCase().includes(q);
        if (selectedSearchField === "imei") return r.imei.toLowerCase().includes(q);
        return (
          r.company.toLowerCase().includes(q) ||
          r.vehicle.toLowerCase().includes(q) ||
          r.driver.toLowerCase().includes(q) ||
          r.imei.toLowerCase().includes(q)
        );
      });
    }

    rows.sort((a, b) => {
      if (sortField === "vehicle") {
        return sortDirection === "asc"
          ? a.vehicle.localeCompare(b.vehicle)
          : b.vehicle.localeCompare(a.vehicle);
      }
      if (sortField === "distance") {
        const distA = parseFloat(a.distance) || 0;
        const distB = parseFloat(b.distance) || 0;
        return sortDirection === "asc" ? distA - distB : distB - distA;
      }
      return 0;
    });

    return rows;
  }, [
    query,
    selectedSearchField,
    selectedCompanies,
    selectedVehicles,
    availableVehicleIds.length,
    allCompaniesList.length,
    sortField,
    sortDirection,
  ]);

  // Paginated rows for display
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  const handleOpenDetailed = (row: StoppageSummaryRow) => {
    setSelectedVehicle(row);
    setLevel(1);
  };

  const handleBackToSummary = () => {
    setLevel(0);
  };

  const toggleSort = (field: "vehicle" | "distance") => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleApplyDateTime = () => {
    setDateRangeText(`24/11/2026 ${fromHour}:${fromMinute} ${fromAmPm} - 24/11/2026 ${toHour}:${toMinute} ${toAmPm}`);
    setDateOpen(false);
    toast.success("Date filter updated");
  };

  const handleReset = () => {
    setQuery("");
    setSelectedCompany("All");
    setSelectedSearchField("all");
    setDateRangeText("24/11/2026 12:00 AM - 24/11/2026 09:50 AM");
    setCurrentPage(1);
    toast.success("Filters and view reset");
  };

  const handleExport = (format?: string) => {
    toast.success(`Exporting Stoppage Report (${format || "Excel"})...`);
  };

  const selectedSearchFieldLabel =
    selectedSearchField === "all"
      ? "All"
      : selectedSearchField === "company"
      ? "Company"
      : selectedSearchField === "vehicle"
      ? "Vehicle"
      : selectedSearchField === "driver"
      ? "Driver"
      : "IMEI No";

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white dark:bg-slate-900 select-none font-sans">
      {/* ── 1. HEADER TITLE ROW (Matches ReportPage.tsx single view: text-[24px] font-medium tracking-tight px-5 pt-5 pb-2.5) ── */}
      {(!hideTitle || level === 1) && (
        <div className="flex items-center justify-between px-5 pt-5 pb-2.5 select-none shrink-0 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            {level === 1 ? (
              <button
                type="button"
                onClick={handleBackToSummary}
                className="p-1 -ml-1 rounded text-slate-700 dark:text-slate-200 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title="Go Back"
              >
                <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsFavorite(!isFavorite);
                  toast.success(isFavorite ? "Removed from Favorites" : "Added to Favorites");
                }}
                className="p-1 -ml-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Star
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isFavorite ? "fill-amber-400 text-amber-400" : "text-slate-400 stroke-[2]"
                  )}
                />
              </button>
            )}

            <h1 className="text-[24px] font-medium text-slate-900 dark:text-white tracking-tight">
              {level === 0 ? "Stoppage Summary" : "Stoppage Detailed Report"}
            </h1>
          </div>
        </div>
      )}

      {/* ── 2. QUICK FILTER TOOLBAR ROW (Matches ReportPage.tsx: px-5 pt-3.5 pb-3.5 with exact pill styles) ── */}
      <div className="relative z-10 flex min-h-[48px] items-center justify-between gap-4 bg-white dark:bg-slate-900 px-5 pt-3.5 pb-3.5 shrink-0 select-none">
        {/* Left: Quick Filters */}
        <div className="flex items-center min-w-0 flex-1 overflow-x-auto scrollbar-none gap-2 text-xs text-muted-foreground shrink-0 whitespace-nowrap">
          {/* Date Range Dropdown Popover */}
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "inline-flex h-7.5 items-center gap-1.5 rounded-md px-2.5 text-xs transition-colors cursor-pointer select-none hover:bg-muted/70 whitespace-nowrap shrink-0",
                  dateOpen && "bg-muted",
                )}
              >
                <CalendarIcon className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                  {dateRangeText}
                </span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-200",
                    dateOpen && "rotate-180",
                  )}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={4}
              className="p-0 text-xs bg-popover/95 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-50 select-none w-[360px]"
            >
              <div className="p-4 space-y-3">
                <div className="space-y-1.5 relative">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="h-3.5 w-3.5 text-[#0089FF]" />
                      <span className="text-xs font-semibold text-foreground block">
                        Date Range
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDateOpen(false)}
                      className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPresetMenuOpen((prev) => !prev)}
                    className={cn(
                      "flex h-8.5 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-xs font-medium text-muted-foreground transition-all cursor-pointer shadow-2xs hover:bg-muted/40 hover:border-[#0089FF]/50",
                      presetMenuOpen && "border-[#0089FF] ring-2 ring-[#0089FF]/20",
                    )}
                  >
                    <span>{draftPreset}</span>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                        presetMenuOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {presetMenuOpen && (
                    <div className="absolute left-0 top-full mt-1 w-full rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md shadow-lg p-1 z-60 space-y-0.5">
                      {PRESET_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setDraftPreset(opt);
                            setPresetMenuOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center justify-between px-2.5 py-1.5 rounded-sm text-xs transition-all cursor-pointer select-none text-left",
                            draftPreset === opt
                              ? "bg-[#0089FF]/10 text-[#0089FF] font-bold"
                              : "text-foreground hover:bg-muted font-medium",
                          )}
                        >
                          <span>{opt}</span>
                          {draftPreset === opt && (
                            <Check className="h-3.5 w-3.5 text-[#0089FF] shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className="h-3.5 w-3.5 text-[#0089FF]" />
                    <span className="text-xs font-semibold text-foreground block">
                      Time Range
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="flex items-center gap-1 border border-input rounded-md px-2 py-1 bg-background text-xs">
                      <select
                        value={fromHour}
                        onChange={(e) => setFromHour(e.target.value)}
                        className="bg-transparent font-semibold focus:outline-none cursor-pointer"
                      >
                        {HOUR_OPTIONS.map((h) => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                      <span>:</span>
                      <select
                        value={fromMinute}
                        onChange={(e) => setFromMinute(e.target.value)}
                        className="bg-transparent font-semibold focus:outline-none cursor-pointer"
                      >
                        {MINUTE_OPTIONS.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setFromAmPm((prev) => (prev === "AM" ? "PM" : "AM"))}
                        className="ml-auto font-bold text-[#0089FF] cursor-pointer"
                      >
                        {fromAmPm}
                      </button>
                    </div>

                    <div className="flex items-center gap-1 border border-input rounded-md px-2 py-1 bg-background text-xs">
                      <select
                        value={toHour}
                        onChange={(e) => setToHour(e.target.value)}
                        className="bg-transparent font-semibold focus:outline-none cursor-pointer"
                      >
                        {HOUR_OPTIONS.map((h) => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                      <span>:</span>
                      <select
                        value={toMinute}
                        onChange={(e) => setToMinute(e.target.value)}
                        className="bg-transparent font-semibold focus:outline-none cursor-pointer"
                      >
                        {MINUTE_OPTIONS.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setToAmPm((prev) => (prev === "AM" ? "PM" : "AM"))}
                        className="ml-auto font-bold text-[#0089FF] cursor-pointer"
                      >
                        {toAmPm}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2.5 px-4 border-t border-border/70 flex items-center justify-between bg-muted/20 rounded-b-lg">
                <button
                  type="button"
                  onClick={() => {
                    setDraftPreset("Today");
                    setFromHour("12");
                    setFromMinute("00");
                    setFromAmPm("AM");
                    setToHour("09");
                    setToMinute("50");
                    setToAmPm("AM");
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer transition-colors"
                >
                  Clear
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDateOpen(false)}
                    className="px-3 py-1.5 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyDateTime}
                    className="px-4 py-1.5 text-xs rounded-md bg-[#0089FF] text-white font-semibold hover:bg-[#0070d6] shadow-xs cursor-pointer transition-all active:scale-98"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Divider */}
          <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 shrink-0 mx-0.5" />

          {/* Company Quick Filter */}
          <Popover open={companyOpen} onOpenChange={setCompanyOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "inline-flex h-7.5 items-center gap-1.5 rounded-md px-2.5 text-xs transition-colors cursor-pointer select-none hover:bg-muted/70 whitespace-nowrap shrink-0",
                  companyOpen && "bg-muted",
                )}
              >
                <span className="font-normal text-slate-500 dark:text-slate-400 whitespace-nowrap">Company:</span>
                <span className="font-semibold text-slate-900 dark:text-white whitespace-nowrap">{companyLabel}</span>
                <ChevronDown className="h-3 w-3 text-slate-500 dark:text-slate-400 shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={4}
              className="w-68 p-0 text-xs bg-popover/95 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-50 overflow-hidden select-none"
            >
              <div className="p-3 px-4 border-b border-border/70 space-y-2 bg-muted/20">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span>Select Company</span>
                  <span className="text-[10px] font-semibold text-[#0089FF] bg-[#0089FF]/10 px-2 py-0.5 rounded-full">
                    {draftCompanies.length} selected
                  </span>
                </div>
                <div className="flex h-8 items-center gap-2 rounded-md border border-input bg-background px-2.5 focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all">
                  <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <input
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    placeholder="Search company..."
                    className="h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
                  />
                  {companySearch && (
                    <button
                      type="button"
                      onClick={() => setCompanySearch("")}
                      className="rounded-md p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              <div className="px-4 py-1.5 border-b border-border/60 flex items-center justify-between bg-muted/10">
                <label className="flex items-center gap-2 cursor-pointer select-none w-full text-xs font-semibold text-foreground">
                  <input
                    type="checkbox"
                    checked={isAllCompaniesDraftSelected}
                    onChange={toggleAllDraftCompanies}
                    className="h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer"
                  />
                  <span>Select All</span>
                </label>
              </div>

              <div className="max-h-52 overflow-y-auto p-1 space-y-0.5 custom-scrollbar">
                {filteredCompanyList.map((comp) => {
                  const checked = draftCompanies.includes(comp);
                  return (
                    <label
                      key={comp}
                      className={cn(
                        "flex items-center gap-2 px-2.5 py-1.5 rounded-sm hover:bg-muted cursor-pointer transition-colors text-xs select-none",
                        checked && "bg-muted/40",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleDraftCompany(comp)}
                        className="h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer"
                      />
                      <span
                        className={cn(
                          "text-foreground font-medium",
                          checked && "font-semibold text-foreground",
                        )}
                      >
                        {comp}
                      </span>
                    </label>
                  );
                })}
                {filteredCompanyList.length === 0 && (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                    No company found
                  </div>
                )}
              </div>

              <div className="p-2.5 px-4 border-t border-border/70 flex items-center justify-between bg-muted/20">
                <button
                  type="button"
                  onClick={() => setDraftCompanies([])}
                  className="text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer transition-colors"
                >
                  Clear
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCompanyOpen(false)}
                    className="px-3 py-1.5 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyCompanies}
                    className="px-4 py-1.5 text-xs rounded-md bg-[#0089FF] text-white hover:bg-[#0070d6] cursor-pointer font-semibold shadow-xs transition-all active:scale-98"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Divider */}
          <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 shrink-0 mx-0.5" />

          {/* Vehicle Quick Filter */}
          <Popover open={vehicleOpen} onOpenChange={setVehicleOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "inline-flex h-7.5 items-center gap-1.5 rounded-md px-2.5 text-xs transition-colors cursor-pointer select-none hover:bg-muted/70 whitespace-nowrap shrink-0",
                  vehicleOpen && "bg-muted",
                )}
              >
                <span className="font-normal text-slate-500 dark:text-slate-400 whitespace-nowrap">Vehicle:</span>
                <span className="font-semibold text-slate-900 dark:text-white whitespace-nowrap">{vehicleLabel}</span>
                <ChevronDown className="h-3 w-3 text-slate-500 dark:text-slate-400 shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={4}
              className="w-84 p-0 text-xs bg-popover/95 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-50 overflow-hidden select-none"
            >
              {/* Header with Search */}
              <div className="p-3 px-4 border-b border-border/70 space-y-2 bg-muted/20">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span>Select Vehicles</span>
                  <span className="text-[10px] font-semibold text-[#0089FF] bg-[#0089FF]/10 px-2 py-0.5 rounded-full">
                    {draftVehicles.length} / {availableVehicleIds.length} selected
                  </span>
                </div>
                <div className="flex h-8 items-center gap-2 rounded-md border border-input bg-background px-2.5 focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all">
                  <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <input
                    value={vehicleSearch}
                    onChange={(e) => setVehicleSearch(e.target.value)}
                    placeholder="Search vehicle or IMEI..."
                    className="h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                  />
                  {vehicleSearch && (
                    <button
                      type="button"
                      onClick={() => setVehicleSearch("")}
                      className="rounded-md p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Select All Option */}
              <div className="px-4 py-1.5 border-b border-border/60 flex items-center justify-between bg-muted/10">
                <label className="flex items-center gap-2 cursor-pointer select-none w-full text-xs font-semibold text-foreground">
                  <input
                    type="checkbox"
                    checked={isAllVehiclesDraftSelected}
                    onChange={toggleAllDraftVehicles}
                    className="h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer"
                  />
                  <span>Select All Vehicles</span>
                </label>
              </div>

              {/* Grouped Tree List by Company */}
              <div className="max-h-64 overflow-y-auto p-1.5 space-y-1.5 custom-scrollbar">
                {groupedFilteredVehicles.map(([groupName, vList]) => {
                  const isCollapsed = collapsedGroups.includes(groupName) && !vehicleSearch;
                  const groupVehicleIds = vList.map((v) => v.id);
                  const groupSelectedCount = groupVehicleIds.filter((id) =>
                    draftVehicles.includes(id)
                  ).length;
                  const allGroupIn =
                    groupSelectedCount === groupVehicleIds.length && groupVehicleIds.length > 0;
                  const someGroupIn = groupSelectedCount > 0 && !allGroupIn;

                  return (
                    <div
                      key={groupName}
                      className="rounded-md border border-border/70 bg-card/60 overflow-hidden"
                    >
                      {/* Group Row Header */}
                      <div className="flex items-center justify-between px-2.5 py-1.5 bg-muted/30 border-b border-border/50 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer select-none font-semibold text-foreground">
                          <input
                            type="checkbox"
                            checked={allGroupIn}
                            ref={(el) => {
                              if (el) el.indeterminate = someGroupIn;
                            }}
                            onChange={() => toggleGroupVehicles(groupName, groupVehicleIds)}
                            className="h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer"
                          />
                          <span>{groupName}</span>
                        </label>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-muted-foreground font-semibold bg-background px-1.5 py-0.5 rounded-sm border border-border/60">
                            {groupSelectedCount}/{groupVehicleIds.length}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleCollapseGroup(groupName)}
                            className="p-0.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
                          >
                            {isCollapsed ? (
                              <ChevronRight className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Indented Vehicle List */}
                      {!isCollapsed && (
                        <div className="p-1 space-y-0.5 pl-2.5">
                          {vList.map((v) => {
                            const checked = draftVehicles.includes(v.id);
                            return (
                              <label
                                key={v.id}
                                className={cn(
                                  "flex items-center gap-2 px-2 py-1 rounded-sm hover:bg-muted cursor-pointer transition-colors text-xs select-none",
                                  checked && "bg-muted/40"
                                )}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleDraftVehicle(v.id)}
                                  className="h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer shrink-0"
                                />
                                <div className="flex flex-col min-w-0">
                                  <span
                                    className={cn(
                                      "text-xs leading-tight text-foreground",
                                      checked && "font-semibold text-foreground"
                                    )}
                                  >
                                    {v.name}
                                  </span>
                                  <span className="text-[10px] leading-tight text-muted-foreground/80 font-mono">
                                    {v.imei}
                                  </span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {groupedFilteredVehicles.length === 0 && (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                    No vehicles found
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-2.5 px-4 border-t border-border/70 flex items-center justify-between bg-muted/20">
                <button
                  type="button"
                  onClick={() => setDraftVehicles([])}
                  className="text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer transition-colors"
                >
                  Clear
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVehicleOpen(false)}
                    className="px-3 py-1.5 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyVehicles}
                    className="px-4 py-1.5 text-xs rounded-md bg-[#0089FF] text-white hover:bg-[#0070d6] cursor-pointer font-semibold shadow-xs transition-all active:scale-98"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Divider */}
          <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 shrink-0 mx-0.5" />

          {/* 5. Filter Button (Matching ReportQuickFilterBar.tsx and Today Activity 1:1) */}
          <button
            type="button"
            onClick={() => setFilterDrawerOpen(true)}
            aria-label="Open Filter Drawer"
            className="inline-flex h-7.5 items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white transition-all cursor-pointer select-none shadow-2xs active:scale-98 shrink-0 whitespace-nowrap"
          >
            <SlidersHorizontal className="h-3 w-3 text-slate-500 dark:text-slate-400" />
            <span className="font-medium text-slate-700 dark:text-slate-300">Filter</span>
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold leading-tight bg-[#0089FF] text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Right: Search + Utilities */}
        <div className="flex items-center gap-2.5 shrink-0 ml-auto">
          {/* Field Selector + Search Input */}
          <div className="relative flex h-7.5 items-center rounded-md border border-border/80 bg-background shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all overflow-hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  title="Select specific column to search"
                  className="flex h-full items-center gap-1 border-r border-border/60 bg-muted/30 px-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0 select-none"
                >
                  <span className="max-w-[76px] truncate">
                    {selectedSearchField === "all" ? "All" : selectedSearchFieldLabel}
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-48 text-xs p-1 rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md shadow-lg z-50 select-none"
              >
                <DropdownMenuItem
                  onClick={() => setSelectedSearchField("all")}
                  className={cn(
                    "cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors",
                    selectedSearchField === "all" ? "bg-muted font-semibold text-foreground" : "hover:bg-muted/80 font-medium"
                  )}
                >
                  <span>All Fields</span>
                  {selectedSearchField === "all" && <Check className="h-3.5 w-3.5 text-[#0089FF]" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedSearchField("company")}
                  className={cn(
                    "cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors",
                    selectedSearchField === "company" ? "bg-muted font-semibold text-foreground" : "hover:bg-muted/80 font-medium"
                  )}
                >
                  <span>Company</span>
                  {selectedSearchField === "company" && <Check className="h-3.5 w-3.5 text-[#0089FF]" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedSearchField("vehicle")}
                  className={cn(
                    "cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors",
                    selectedSearchField === "vehicle" ? "bg-muted font-semibold text-foreground" : "hover:bg-muted/80 font-medium"
                  )}
                >
                  <span>Vehicle</span>
                  {selectedSearchField === "vehicle" && <Check className="h-3.5 w-3.5 text-[#0089FF]" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedSearchField("driver")}
                  className={cn(
                    "cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors",
                    selectedSearchField === "driver" ? "bg-muted font-semibold text-foreground" : "hover:bg-muted/80 font-medium"
                  )}
                >
                  <span>Driver</span>
                  {selectedSearchField === "driver" && <Check className="h-3.5 w-3.5 text-[#0089FF]" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedSearchField("imei")}
                  className={cn(
                    "cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors",
                    selectedSearchField === "imei" ? "bg-muted font-semibold text-foreground" : "hover:bg-muted/80 font-medium"
                  )}
                >
                  <span>IMEI No</span>
                  {selectedSearchField === "imei" && <Check className="h-3.5 w-3.5 text-[#0089FF]" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Search className="ml-2.5 h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search in all fields..."
              className="h-full w-40 sm:w-48 bg-transparent px-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mr-1.5 rounded-full p-0.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Column Settings Button */}
          <button
            type="button"
            onClick={() => toast.info("Opening column configuration...")}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-95"
            title="Column Settings"
          >
            <Settings className="h-[18px] w-[18px] stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* ── 3. HORIZONTAL DIVIDER WITH 20px (mx-5) MARGIN ── */}
      <div className="mx-5 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0" />

      {/* ── 4. TABLE SCROLL AREA (Matches ReportPage.tsx: pt-1 mx-5 bg-white dark:bg-slate-900) ── */}
      <div className="relative min-h-0 flex-1 overflow-auto overscroll-contain scroll-smooth pt-1 mx-5 bg-white dark:bg-slate-900">
        {level === 0 ? (
          /* ========================================================================= */
          /* STOPPAGE SUMMARY TABLE (Exact typography, row heights, and borders)      */
          /* ========================================================================= */
          <table className="w-full min-w-[1700px] text-xs border-collapse">
            <thead className="sticky top-0 z-20 shadow-xs">
              <tr className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold tracking-wider text-[11px] uppercase border-b border-[#DFE3EB] dark:border-slate-700 select-none">
                <th
                  scope="col"
                  className="sticky left-0 z-30 w-10 min-w-[40px] max-w-[40px] bg-white dark:bg-slate-900 px-3 py-2 text-center text-slate-500 font-bold border-b border-[#DFE3EB] dark:border-slate-700 align-middle"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="sticky left-[40px] z-30 w-[180px] min-w-[180px] max-w-[180px] bg-white dark:bg-slate-900 px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle"
                >
                  COMPANY
                </th>
                <th
                  scope="col"
                  onClick={() => toggleSort("vehicle")}
                  className="sticky left-[220px] z-30 w-[160px] min-w-[160px] max-w-[160px] bg-white dark:bg-slate-900 px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 shadow-[2px_0_4px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex items-center gap-1 overflow-hidden justify-start">
                    <span className="truncate">VEHICLE</span>
                    {sortField === "vehicle" && sortDirection === "asc" ? (
                      <ArrowDown className="h-3 w-3 text-blue-600 dark:text-blue-400 shrink-0" />
                    ) : (
                      <ArrowUp className="h-3 w-3 text-blue-600 dark:text-blue-400 shrink-0" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">
                  VEHICLE BRAND
                </th>
                <th scope="col" className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">
                  VEHICLE MODEL
                </th>
                <th scope="col" className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">
                  DRIVER
                </th>
                <th scope="col" className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">
                  EMPLOYEE NO
                </th>
                <th scope="col" className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">
                  IMEI NO
                </th>
                <th
                  scope="col"
                  onClick={() => toggleSort("distance")}
                  className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-1 overflow-hidden justify-start">
                    <span className="truncate">DISTANCE</span>
                    {sortField === "distance" && sortDirection === "asc" ? (
                      <ArrowDown className="h-3 w-3 text-blue-600 dark:text-blue-400 shrink-0" />
                    ) : (
                      <ArrowUp className="h-3 w-3 text-blue-600 dark:text-blue-400 shrink-0" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">
                  RUNNING (HH:MM:SS)
                </th>
                <th scope="col" className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">
                  IDLE (HH:MM:SS)
                </th>
                <th scope="col" className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">
                  STOP (HH:MM:SS)
                </th>
                <th scope="col" className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">
                  MAX STOPPAGE (HH:MM:SS)
                </th>
                <th scope="col" className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">
                  NO OF STOP
                </th>
                <th scope="col" className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">
                  AVG
                </th>
                <th scope="col" className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">
                  MAX
                </th>
                <th scope="col" className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">
                  OVERSTAY
                </th>
                <th scope="col" className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">
                  ALERT(S)
                </th>
                <th scope="col" className="px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">
                  PLAYBACK
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row, idx) => (
                <tr
                  key={row.id}
                  onDoubleClick={() => handleOpenDetailed(row)}
                  className="border-b border-[#DFE3EB]/70 dark:border-slate-800/70 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors h-[40px] group cursor-pointer"
                  title="Double-click a row to open Stoppage Detailed Report"
                >
                  <td className="sticky left-0 z-10 w-10 min-w-[40px] max-w-[40px] px-3 py-2 text-center text-slate-400 group-hover:text-slate-600 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800">
                    <ChevronRight className="h-3.5 w-3.5 mx-auto" />
                  </td>
                  <td className="sticky left-[40px] z-10 w-[180px] min-w-[180px] max-w-[180px] px-2.5 py-1.5 font-medium text-foreground truncate bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800">
                    {row.company}
                  </td>
                  <td className="sticky left-[220px] z-10 w-[160px] min-w-[160px] max-w-[160px] px-2.5 py-1.5 font-mono text-xs font-semibold text-foreground truncate bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 shadow-[2px_0_4px_rgba(0,0,0,0.08)]">
                    {row.vehicle}
                  </td>
                  <td className="px-2.5 py-1.5 text-muted-foreground/60 font-mono text-xs truncate">--</td>
                  <td className="px-2.5 py-1.5 text-muted-foreground/60 font-mono text-xs truncate">--</td>
                  <td className="px-2.5 py-1.5 font-medium text-foreground truncate">{row.driver}</td>
                  <td className="px-2.5 py-1.5 text-muted-foreground/60 font-mono text-xs truncate">{row.employeeNo}</td>
                  <td className="px-2.5 py-1.5 text-muted-foreground font-mono text-[11px] tracking-wide truncate">{row.imei}</td>
                  <td className="px-2.5 py-1.5 text-right font-mono text-xs tabular-nums text-foreground truncate">{row.distance}</td>
                  <td className="px-2.5 py-1.5 font-mono text-[11px] tabular-nums text-foreground truncate">{row.running}</td>
                  <td className="px-2.5 py-1.5 font-mono text-[11px] tabular-nums text-foreground truncate">{row.idle}</td>
                  <td className="px-2.5 py-1.5 font-mono text-[11px] tabular-nums text-foreground truncate">{row.stop}</td>
                  <td className="px-2.5 py-1.5 font-mono text-[11px] tabular-nums text-foreground truncate">{row.maxStoppage}</td>
                  <td className="px-2.5 py-1.5 text-right tabular-nums text-foreground truncate">{row.noOfStop}</td>
                  <td className="px-2.5 py-1.5 text-right font-mono text-xs tabular-nums text-foreground truncate">{row.avgSpeed}</td>
                  <td className="px-2.5 py-1.5 text-right font-mono text-xs tabular-nums text-foreground truncate">{row.maxSpeed}</td>
                  <td className="px-2.5 py-1.5 text-right tabular-nums text-foreground truncate">{row.overstay}</td>
                  <td className="px-2.5 py-1.5 text-right tabular-nums text-foreground truncate">{row.alerts}</td>
                  <td className="px-2.5 py-1.5 text-center text-muted-foreground/40 font-mono text-xs truncate">--</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          /* ========================================================================= */
          /* STOPPAGE DETAILED REPORT TABLE (With grouped SPEED and TEMPERATURE)      */
          /* ========================================================================= */
          <table className="w-full min-w-[1900px] text-xs border-collapse">
            <thead className="sticky top-0 z-20 shadow-xs">
              <tr className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold tracking-wider text-[11px] uppercase border-b border-[#DFE3EB] dark:border-slate-700 select-none">
                <th rowSpan={2} className="sticky left-0 z-30 w-[110px] min-w-[110px] max-w-[110px] bg-white dark:bg-slate-900 px-2.5 py-2 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">
                  <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                    <span>STOP NO</span>
                    <ArrowDown className="h-3 w-3" />
                  </div>
                </th>
                <th rowSpan={2} className="sticky left-[110px] z-30 w-[130px] min-w-[130px] max-w-[130px] bg-white dark:bg-slate-900 px-2.5 py-2 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle shadow-[2px_0_4px_rgba(0,0,0,0.08)]">
                  <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                    <span>ARRIVAL</span>
                    <ArrowDown className="h-3 w-3" />
                  </div>
                </th>
                <th rowSpan={2} className="px-2.5 py-2 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">LOCATION</th>
                <th rowSpan={2} className="px-2.5 py-2 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">LAST DISTANCE</th>
                <th rowSpan={2} className="px-2.5 py-2 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">LAST RUNNING (HH:MM:SS)</th>
                <th rowSpan={2} className="px-2.5 py-2 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">LAST IDLE (HH:MM:SS)</th>
                <th rowSpan={2} className="px-2.5 py-2 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">LAST STOP (HH:MM:SS)</th>
                <th rowSpan={2} className="px-2.5 py-2 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">APPROX DISTANCE</th>
                <th rowSpan={2} className="px-2.5 py-2 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">RUNNING (HH:MM:SS)</th>
                <th rowSpan={2} className="px-2.5 py-2 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">IDLE (HH:MM:SS)</th>
                <th rowSpan={2} className="px-2.5 py-2 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">STOP (HH:MM:SS)</th>

                {/* Group Category 1: SPEED (Styled 1:1 like Today Activity in ReportPage.tsx) */}
                <th
                  colSpan={2}
                  scope="colgroup"
                  className="text-center font-bold text-[11px] uppercase tracking-wider select-none bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-b border-l border-r border-[#DFE3EB] dark:border-slate-700 py-1.5 px-2"
                >
                  <div className="flex items-center justify-center gap-1.5 py-0.5">
                    <span className="font-bold tracking-wider">SPEED</span>
                  </div>
                </th>

                <th rowSpan={2} scope="col" className="px-2.5 py-2 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">
                  FUEL
                </th>

                {/* Group Category 2: TEMPERATURE (Styled 1:1 like Today Activity in ReportPage.tsx) */}
                <th
                  colSpan={3}
                  scope="colgroup"
                  className="text-center font-bold text-[11px] uppercase tracking-wider select-none bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-b border-l border-r border-[#DFE3EB] dark:border-slate-700 py-1.5 px-2"
                >
                  <div className="flex items-center justify-center gap-1.5 py-0.5">
                    <span className="font-bold tracking-wider">TEMPERATURE</span>
                  </div>
                </th>

                <th rowSpan={2} scope="col" className="px-2.5 py-2 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">DEPARTURE</th>
                <th rowSpan={2} scope="col" className="px-2.5 py-2 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">OVERSTAY</th>
                <th rowSpan={2} scope="col" className="px-2.5 py-2 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">ALERT(S)</th>
                <th rowSpan={2} scope="col" className="px-2.5 py-2 text-left whitespace-nowrap border-b border-[#DFE3EB] dark:border-slate-700 align-middle">MAP</th>
              </tr>

              {/* Row 2: Sub-column titles matching Today Activity */}
              <tr className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold tracking-wider text-[11px] uppercase border-b border-[#DFE3EB] dark:border-slate-700 select-none">
                <th scope="col" className="group relative px-2.5 py-1.5 font-bold text-slate-900 dark:text-slate-100 overflow-hidden text-ellipsis whitespace-nowrap select-none bg-white dark:bg-slate-800 border-b border-l border-r border-[#DFE3EB] dark:border-slate-700 text-[10.5px] cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/60 text-left">
                  <div className="flex items-center gap-1 overflow-hidden justify-start">
                    <ArrowDown className="h-3 w-3 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="truncate">AVG</span>
                  </div>
                </th>
                <th scope="col" className="group relative px-2.5 py-1.5 font-bold text-slate-900 dark:text-slate-100 overflow-hidden text-ellipsis whitespace-nowrap select-none bg-white dark:bg-slate-800 border-b border-r border-[#DFE3EB] dark:border-slate-700 text-[10.5px] cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/60 text-left">
                  <div className="flex items-center gap-1 overflow-hidden justify-start">
                    <ArrowDown className="h-3 w-3 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="truncate">MAX</span>
                  </div>
                </th>

                <th scope="col" className="group relative px-2.5 py-1.5 font-bold text-slate-900 dark:text-slate-100 overflow-hidden text-ellipsis whitespace-nowrap select-none bg-white dark:bg-slate-800 border-b border-l border-r border-[#DFE3EB] dark:border-slate-700 text-[10.5px] cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/60 text-left">
                  <div className="flex items-center gap-1 overflow-hidden justify-start">
                    <ArrowDown className="h-3 w-3 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="truncate">MIN</span>
                  </div>
                </th>
                <th scope="col" className="group relative px-2.5 py-1.5 font-bold text-slate-900 dark:text-slate-100 overflow-hidden text-ellipsis whitespace-nowrap select-none bg-white dark:bg-slate-800 border-b border-r border-[#DFE3EB] dark:border-slate-700 text-[10.5px] cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/60 text-left">
                  <div className="flex items-center gap-1 overflow-hidden justify-start">
                    <ArrowDown className="h-3 w-3 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="truncate">MAX</span>
                  </div>
                </th>
                <th scope="col" className="group relative px-2.5 py-1.5 font-bold text-slate-900 dark:text-slate-100 overflow-hidden text-ellipsis whitespace-nowrap select-none bg-white dark:bg-slate-800 border-b border-r border-[#DFE3EB] dark:border-slate-700 text-[10.5px] cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/60 text-left">
                  <div className="flex items-center gap-1 overflow-hidden justify-start">
                    <ArrowDown className="h-3 w-3 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="truncate">AVG</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={21} className="px-3 py-24 text-center text-xs text-muted-foreground font-medium">
                  No Records Found
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* ── 5. HORIZONTAL DIVIDER WITH 20px (mx-5) MARGIN ── */}
      <div className="mx-5 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0" />

      {/* ── 6. TABLE PAGINATION BAR (Exact component from TablePaginationBar.tsx) ── */}
      <TablePaginationBar
        page={currentPage}
        pageSize={level === 0 ? pageSize : detailedPageSize}
        totalRows={level === 0 ? filteredRows.length : 0}
        pageSizeOptions={[10, 20, 25, 50, 100]}
        itemLabel="records"
        showRange={level === 0}
        onPageChange={(p) => setCurrentPage(p)}
        onPageSizeChange={(s) => {
          if (level === 0) setPageSize(s);
          else setDetailedPageSize(s);
          setCurrentPage(1);
        }}
        onReset={handleReset}
        onExport={handleExport}
      />

      {/* ── 7. FILTER OPTIONS SIDE PANEL DRAWER (Matching media_1795501364213_f8dc9897.png 1:1) ── */}
      {filterDrawerOpen && (
        <>
          {/* Backdrop Blur Overlay: Confined to workspace area below topbar (45px) and right of sidebar (60px) */}
          <div
            aria-hidden="true"
            onClick={() => setFilterDrawerOpen(false)}
            className="fixed top-[45px] bottom-0 right-0 left-0 sm:left-[60px] z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-200 cursor-pointer animate-in fade-in"
          />

          {/* Side Panel Drawer: Starts at top-[45px] below topbar and runs to bottom-0 */}
          <aside
            aria-label="Filter Options"
            className="fixed right-0 top-[45px] bottom-0 z-50 flex w-full max-w-[440px] md:max-w-[460px] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out select-none"
          >
            {/* Header: Title and Close button */}
            <header className="flex h-[56px] items-center justify-between border-b border-border px-5 bg-background select-none shrink-0">
              <h2 className="text-[15px] font-bold text-foreground">
                Filter Options
              </h2>
              <button
                type="button"
                aria-label="Close filter options"
                onClick={() => setFilterDrawerOpen(false)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {/* Scrollable Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
              {/* 1. Vehicle Selection Box */}
              <div className="space-y-2">
                {/* Search Bar with Filter button */}
                <div className="flex h-8.5 items-center gap-2 rounded-md border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all">
                  <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <input
                    value={drawerVehicleSearch}
                    onChange={(e) => setDrawerVehicleSearch(e.target.value)}
                    placeholder="Select vehicle"
                    className="h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
                  />
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[#0089FF] hover:text-[#0070d6] px-1.5 py-0.5 rounded cursor-pointer transition-colors select-none">
                    <SlidersHorizontal className="h-3 w-3" />
                    <span>Filter</span>
                  </div>
                </div>

                {/* Checklist Container */}
                <div className="rounded-md border border-border/80 bg-card overflow-hidden shadow-2xs">
                  {/* Select All Toolbar */}
                  <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-3 py-2 shrink-0 select-none">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground">
                      <input
                        type="checkbox"
                        checked={isAllDrawerVehiclesSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = isSomeDrawerVehiclesSelected;
                        }}
                        onChange={toggleAllDrawerVehicles}
                        className="rounded border-input text-[#0089FF] cursor-pointer h-3.5 w-3.5 accent-[#0089FF]"
                      />
                      <span>Select all</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {drawerSelectedVehicleIds.length} / {allDrawerVehicleIds.length} selected
                      </span>
                      <button
                        type="button"
                        onClick={toggleAllDrawerGroups}
                        className="text-muted-foreground hover:text-[#0089FF] cursor-pointer p-0.5 rounded hover:bg-muted"
                        title="Expand/Collapse All"
                      >
                        <ChevronsUpDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDrawerVehicleListHeight((prev) => (prev > 220 ? 190 : 320))
                        }
                        className="text-muted-foreground hover:text-[#0089FF] cursor-pointer p-0.5 rounded hover:bg-muted"
                        title={drawerVehicleListHeight > 220 ? "Compact height" : "Expand height"}
                      >
                        {drawerVehicleListHeight > 220 ? (
                          <Minimize2 className="h-3.5 w-3.5" />
                        ) : (
                          <Maximize2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Grouped Vehicle List */}
                  <div
                    style={{
                      height: `${drawerVehicleListHeight}px`,
                      maxHeight: `${drawerVehicleListHeight}px`,
                    }}
                    className="overflow-y-auto p-1 divide-y divide-border/40 custom-scrollbar transition-[height] duration-75 ease-out"
                  >
                    {drawerGroupedVehicles.map(([groupName, vList]) => {
                      const isExpanded =
                        drawerOpenGroups.includes(groupName) ||
                        drawerVehicleSearch.trim() !== "";
                      const groupVehicleIds = vList.map((v) => v.id);
                      const selectedGroupCount = groupVehicleIds.filter((id) =>
                        drawerSelectedVehicleIds.includes(id)
                      ).length;
                      const isGroupAllSelected =
                        selectedGroupCount === groupVehicleIds.length &&
                        groupVehicleIds.length > 0;
                      const isGroupSomeSelected =
                        selectedGroupCount > 0 && !isGroupAllSelected;

                      return (
                        <div key={groupName} className="py-1">
                          {/* Group Accordion Header */}
                          <div className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted/50 transition-colors select-none">
                            <div className="flex items-center gap-2 min-w-0">
                              <input
                                type="checkbox"
                                checked={isGroupAllSelected}
                                ref={(el) => {
                                  if (el) el.indeterminate = isGroupSomeSelected;
                                }}
                                onChange={() => toggleDrawerGroupVehicles(groupVehicleIds)}
                                className="rounded border-input text-[#0089FF] cursor-pointer h-3.5 w-3.5 accent-[#0089FF]"
                              />
                              <button
                                type="button"
                                onClick={() => toggleDrawerGroupAccordion(groupName)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-[#0089FF] transition-colors cursor-pointer text-left truncate"
                              >
                                <span>{groupName}</span>
                                <span className="text-[10px] text-muted-foreground font-normal">
                                  ({vList.length})
                                </span>
                              </button>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-muted-foreground font-semibold bg-muted px-1.5 py-0.5 rounded border border-border/50">
                                {selectedGroupCount}/{groupVehicleIds.length}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleDrawerGroupAccordion(groupName)}
                                className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-3.5 w-3.5" />
                                ) : (
                                  <ChevronRight className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Indented Vehicle Checklist */}
                          {isExpanded && (
                            <div className="mt-0.5 space-y-0.5 pl-6 pr-2">
                              {vList.map((v) => {
                                const checked = drawerSelectedVehicleIds.includes(v.id);
                                return (
                                  <label
                                    key={v.id}
                                    className={cn(
                                      "flex items-center gap-2 px-2 py-1 rounded hover:bg-muted/70 cursor-pointer text-xs select-none transition-colors",
                                      checked && "bg-muted/30"
                                    )}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => toggleDrawerVehicle(v.id)}
                                      className="rounded border-input text-[#0089FF] cursor-pointer h-3.5 w-3.5 accent-[#0089FF] shrink-0"
                                    />
                                    <div className="flex flex-col min-w-0">
                                      <span
                                        className={cn(
                                          "text-xs leading-tight text-foreground",
                                          checked && "font-semibold"
                                        )}
                                      >
                                        {v.name}
                                      </span>
                                      <span className="text-[10px] leading-tight text-muted-foreground/80 font-mono">
                                        {v.imei}
                                      </span>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {drawerGroupedVehicles.length === 0 && (
                      <div className="p-6 text-center text-xs text-muted-foreground italic">
                        No vehicles found matching &ldquo;{drawerVehicleSearch}&rdquo;
                      </div>
                    )}
                  </div>

                  {/* Resizer Handle */}
                  <div
                    onMouseDown={startResizeDrawerVehicleList}
                    onDoubleClick={() =>
                      setDrawerVehicleListHeight((prev) => (prev > 220 ? 190 : 320))
                    }
                    className="relative flex h-3.5 w-full cursor-ns-resize items-center justify-center border-t border-border/60 bg-muted/20 hover:bg-muted/60 transition-colors select-none group"
                    title="Drag to resize height (Double-click to toggle)"
                  >
                    <div className="h-1 w-8 rounded-full bg-muted-foreground/30 group-hover:bg-[#0089FF] transition-colors" />
                  </div>
                </div>
              </div>

              {/* 2. Filter Form Fields */}
              <div className="space-y-3 pt-1">
                {/* Vehicle Group */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-foreground">
                    Vehicle Group
                  </label>
                  <FilterSelectDropdown
                    value={draftVehicleGroup}
                    options={VEHICLE_GROUP_OPTIONS}
                    onChange={setDraftVehicleGroup}
                    placeholder="All"
                  />
                </div>

                {/* Vehicle Type */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-foreground">
                    Vehicle Type
                  </label>
                  <FilterSelectDropdown
                    value={draftVehicleType}
                    options={VEHICLE_TYPE_OPTIONS}
                    onChange={setDraftVehicleType}
                    placeholder="All"
                  />
                </div>

                {/* Vehicle Brand */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-foreground">
                    Vehicle Brand
                  </label>
                  <FilterSelectDropdown
                    value={draftVehicleBrand}
                    options={VEHICLE_BRAND_OPTIONS}
                    onChange={setDraftVehicleBrand}
                    placeholder="All"
                  />
                </div>

                {/* Vehicle Model */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-foreground">
                    Vehicle Model
                  </label>
                  <FilterSelectDropdown
                    value={draftVehicleModel}
                    options={VEHICLE_MODEL_OPTIONS}
                    onChange={setDraftVehicleModel}
                    placeholder="All"
                  />
                </div>

                {/* Calculation for */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-foreground">
                    Calculation for
                  </label>
                  <FilterSelectDropdown
                    value={draftCalculationFor}
                    options={CALCULATION_FOR_OPTIONS}
                    onChange={setDraftCalculationFor}
                    placeholder="All"
                  />
                </div>

                {/* Duration */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-foreground">
                    Duration
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <FilterSelectDropdown
                      value={draftDurationCompare}
                      options={DURATION_COMPARATOR_OPTIONS}
                      onChange={setDraftDurationCompare}
                      placeholder="Greater Than"
                    />
                    <input
                      type="text"
                      value={draftDurationValue}
                      onChange={(e) => setDraftDurationValue(e.target.value)}
                      placeholder="Duration Value in Minute"
                      className="h-8.5 w-full rounded-md border border-input/80 bg-background px-3 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 shadow-2xs transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: Reset and Apply */}
            <footer className="flex h-[56px] items-center justify-between border-t border-border px-5 bg-background select-none shrink-0">
              <button
                type="button"
                onClick={handleResetFilterDrawer}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md border border-border bg-background hover:bg-muted text-foreground transition-all shadow-2xs cursor-pointer active:scale-98"
              >
                <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={handleApplyFilterDrawer}
                className="px-5 py-1.5 text-xs font-semibold rounded-md bg-[#0089FF] text-white hover:bg-[#0070d6] transition-all shadow-xs cursor-pointer active:scale-98"
              >
                Apply Filters
              </button>
            </footer>
          </aside>
        </>
      )}
    </div>
  );
}
