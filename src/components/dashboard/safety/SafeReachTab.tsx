import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Car,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Cpu,
  Phone,
  Search,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_SAFE_REACH_EMPLOYEES,
  SAFE_REACH_SUMMARY,
  type SafeReachEmployee,
  type SafeReachChannel,
} from "@/data/safetyDashboardData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { TablePaginationBar } from "@/components/common/TablePaginationBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// ─── Filter State Interface ──────────────────────────────────────────────────
export interface SafeReachFilterState {
  office: string;
  channel: string;
  status: string;
}

// ─── Search Fields Definition Matching ReportPage.tsx ──────────────────────────
const SEARCH_FIELDS = [
  { id: "ALL", label: "All fields" },
  { id: "name", label: "Employee" },
  { id: "employeeNo", label: "Employee No" },
  { id: "businessUnitId", label: "Business Unit ID" },
  { id: "office", label: "Office" },
  { id: "shift", label: "Shift" },
];

// ─── Extended Employee & Trip Mock Data Matching Reference media_1795085616871_3eec3a29.png ───
interface EmployeeTripDetails {
  gender: "MALE" | "FEMALE";
  plannedSignIn: string;
  actualSignIn: string;
  plannedDrop: string;
  actualDrop: string;
  phoneNumber: string;
  office: string;
  dropAddress: string;
  cabIdReg: string;
  tripId: string;
  marshallName: string;
  marshallPhone: string;
  driverPhone: string;
}

const EMPLOYEE_DETAILS_MAP: Record<string, EmployeeTripDetails> = {
  e1: {
    gender: "FEMALE",
    plannedSignIn: "12:00, Thu Nov 19",
    actualSignIn: "12:45, Thu Nov 19",
    plannedDrop: "13:03, Thu Nov 19",
    actualDrop: "12:48, Thu Nov 19",
    phoneNumber: "9409447093",
    office: "MIS Hyd",
    dropAddress: "Parade Ground Metro",
    cabIdReg: "TS 04 HR 8696",
    tripId: "1220",
    marshallName: "NA",
    marshallPhone: "-",
    driverPhone: "9502202895",
  },
  e2: {
    gender: "MALE",
    plannedSignIn: "12:00, Thu Nov 19",
    actualSignIn: "12:30, Thu Nov 19",
    plannedDrop: "13:00, Thu Nov 19",
    actualDrop: "12:55, Thu Nov 19",
    phoneNumber: "9876543212",
    office: "ABC company",
    dropAddress: "Baner Road, Pune",
    cabIdReg: "MH 15 KL 6455",
    tripId: "1221",
    marshallName: "Suresh",
    marshallPhone: "+91 98765 00001",
    driverPhone: "9876543210",
  },
  e3: {
    gender: "MALE",
    plannedSignIn: "12:00, Thu Nov 19",
    actualSignIn: "12:40, Thu Nov 19",
    plannedDrop: "13:10, Thu Nov 19",
    actualDrop: "13:05, Thu Nov 19",
    phoneNumber: "9876543213",
    office: "ABC company",
    dropAddress: "Hinjewadi Phase 1, Pune",
    cabIdReg: "MH 15 KL 6455",
    tripId: "1221",
    marshallName: "Suresh",
    marshallPhone: "+91 98765 00001",
    driverPhone: "9876543210",
  },
  e4: {
    gender: "FEMALE",
    plannedSignIn: "12:15, Thu Nov 19",
    actualSignIn: "12:50, Thu Nov 19",
    plannedDrop: "13:15, Thu Nov 19",
    actualDrop: "13:08, Thu Nov 19",
    phoneNumber: "9876543214",
    office: "ABC company",
    dropAddress: "Kothrud, Pune",
    cabIdReg: "MH 14 CD 2201",
    tripId: "1222",
    marshallName: "NA",
    marshallPhone: "-",
    driverPhone: "9876543211",
  },
  e5: {
    gender: "MALE",
    plannedSignIn: "12:10, Thu Nov 19",
    actualSignIn: "12:48, Thu Nov 19",
    plannedDrop: "13:10, Thu Nov 19",
    actualDrop: "13:02, Thu Nov 19",
    phoneNumber: "9876543215",
    office: "XYZ company",
    dropAddress: "Powai, Mumbai",
    cabIdReg: "MH 12 EF 3209",
    tripId: "1223",
    marshallName: "NA",
    marshallPhone: "-",
    driverPhone: "9876543212",
  },
};

// ─── Rich Attractive KPI Summary Card Matching Design System ───────────────────
interface SummaryCardProps {
  id: string;
  label: string;
  count: number;
  outerRingClass: string;
  badgeBgClass: string;
  badgeTextColor: string;
  cardBgClass: string;
  cardBorderClass: string;
  countColorClass: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

function SummaryCard({
  label,
  count,
  outerRingClass,
  badgeBgClass,
  cardBgClass,
  cardBorderClass,
  countColorClass,
  icon,
  isActive,
  onClick,
}: SummaryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3.5 flex-1 min-w-[170px] rounded-xl border p-3 sm:p-3.5 text-left transition-all cursor-pointer select-none",
        cardBgClass,
        cardBorderClass,
        isActive
          ? "ring-2 ring-[#0089FF] shadow-sm"
          : "shadow-2xs hover:shadow-xs hover:border-[#0089FF]/40"
      )}
    >
      {/* Circular Badge with Soft Glowing Outer Ring */}
      <div className={cn("h-11 w-11 rounded-full p-1 flex items-center justify-center shrink-0 shadow-2xs", outerRingClass)}>
        <div className={cn("h-8.5 w-8.5 rounded-full flex items-center justify-center text-white shadow-xs", badgeBgClass)}>
          {icon}
        </div>
      </div>

      {/* Label in center */}
      <div className="min-w-0">
        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
          {label}
        </p>
      </div>

      {/* Big Bold Counter on far right */}
      <div className="ml-auto pl-2 shrink-0">
        <span className={cn("text-xl sm:text-2xl font-black tabular-nums tracking-tight", countColorClass)}>
          {String(count).padStart(2, "0")}
        </span>
      </div>
    </button>
  );
}

// ─── Channel Icon Badge ──────────────────────────────────────────────────────────
function ChannelIcon({ channel }: { channel: SafeReachChannel }) {
  const baseClass = "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border select-none transition-all";
  if (channel === "mobile_app") {
    return (
      <span className={cn(baseClass, "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-400 group-hover:scale-105")}>
        <Phone className="h-2.5 w-2.5" />
        <span>App</span>
      </span>
    );
  }
  if (channel === "geofence") {
    return (
      <span className={cn(baseClass, "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-400 group-hover:scale-105")}>
        <span>GEO</span>
      </span>
    );
  }
  return (
    <span className={cn(baseClass, "bg-violet-50 border-violet-200 text-violet-600 dark:bg-violet-950/40 dark:border-violet-900 dark:text-violet-400 group-hover:scale-105")}>
      <span>IVR</span>
    </span>
  );
}

// ─── Status Badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: SafeReachEmployee["status"] }) {
  if (status === "confirmed") {
    return (
      <span
        title="Confirmed"
        className="inline-flex h-5.5 w-5.5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xs group-hover:scale-105 transition-all"
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span
        title="Failed"
        className="inline-flex h-5.5 w-5.5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-black shadow-2xs group-hover:scale-105 transition-all"
      >
        F
      </span>
    );
  }
  return (
    <span
      title="Not on trip"
      className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 group-hover:scale-105 transition-all"
    >
      NT
    </span>
  );
}

interface SafeReachTabProps {
  refreshTrigger?: number;
  filters?: SafeReachFilterState;
  onFilterChange?: (filters: SafeReachFilterState) => void;
}

export function SafeReachTab({
  refreshTrigger = 0,
  filters = { office: "ALL", channel: "ALL", status: "ALL" },
}: SafeReachTabProps) {
  // Date Range State matching reference media_1795085575394_cef11725.png
  const [dateRangeLabel, setDateRangeLabel] = useState("04/12/2024 12:00 AM - 10/12/2024 11:59 PM");
  const [dateOpen, setDateOpen] = useState(false);

  // Search Field Dropdown & Query State (Matching ReportPage.tsx format)
  const [selectedSearchField, setSelectedSearchField] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Quick KPI Card Filter State
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string | null>(null);

  // Right Side Slide-out Panel State for Employee Details matching reference media_1795085616871_3eec3a29.png
  const [selectedEmployee, setSelectedEmployee] = useState<SafeReachEmployee | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sync external refresh trigger
  useEffect(() => {
    if (refreshTrigger > 0) {
      // Refresh triggered from parent toolbar
    }
  }, [refreshTrigger]);

  const handleViewContact = (name: string, phone: string, role: string) => {
    toast.info(`${role} contact for ${name}: ${phone}`);
  };

  // Selected search field label
  const selectedSearchFieldLabel = useMemo(() => {
    const f = SEARCH_FIELDS.find((field) => field.id === selectedSearchField);
    return f ? f.label : "All fields";
  }, [selectedSearchField]);

  // Filtered employees list
  const filteredEmployees = useMemo(() => {
    let list = MOCK_SAFE_REACH_EMPLOYEES;

    // 1. KPI summary card filter
    if (selectedStatusFilter) {
      if (selectedStatusFilter === "failed") {
        list = list.filter((e) => e.status === "failed");
      } else if (selectedStatusFilter === "not_on_trip") {
        list = list.filter((e) => e.status === "nt");
      } else if (selectedStatusFilter === "inprogress") {
        list = list.filter((e) => e.status !== "confirmed" && e.status !== "failed");
      } else if (selectedStatusFilter === "manual") {
        list = list.filter((e) => e.channel === "ivr");
      } else if (selectedStatusFilter === "automated") {
        list = list.filter((e) => e.channel === "mobile_app" || e.channel === "geofence");
      }
    }

    // 2. Toolbar filters
    if (filters.office !== "ALL") {
      list = list.filter((e) => e.office.toLowerCase().includes(filters.office.toLowerCase()));
    }
    if (filters.channel !== "ALL") {
      list = list.filter((e) => e.channel === filters.channel);
    }
    if (filters.status !== "ALL") {
      list = list.filter((e) => e.status === filters.status);
    }

    // 3. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (selectedSearchField === "ALL") {
        list = list.filter(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            e.employeeNo.includes(q) ||
            e.businessUnitId.toLowerCase().includes(q) ||
            e.office.toLowerCase().includes(q) ||
            e.shift.includes(q)
        );
      } else if (selectedSearchField === "name") {
        list = list.filter((e) => e.name.toLowerCase().includes(q));
      } else if (selectedSearchField === "employeeNo") {
        list = list.filter((e) => e.employeeNo.includes(q));
      } else if (selectedSearchField === "businessUnitId") {
        list = list.filter((e) => e.businessUnitId.toLowerCase().includes(q));
      } else if (selectedSearchField === "office") {
        list = list.filter((e) => e.office.toLowerCase().includes(q));
      } else if (selectedSearchField === "shift") {
        list = list.filter((e) => e.shift.includes(q));
      }
    }

    return list;
  }, [
    selectedStatusFilter,
    filters,
    searchQuery,
    selectedSearchField,
  ]);

  // Current selected employee details
  const currentDetails: EmployeeTripDetails = useMemo(() => {
    if (!selectedEmployee) {
      return EMPLOYEE_DETAILS_MAP["e1"];
    }
    return (
      EMPLOYEE_DETAILS_MAP[selectedEmployee.id] || {
        gender: "MALE",
        plannedSignIn: "12:00, Thu Nov 19",
        actualSignIn: "12:45, Thu Nov 19",
        plannedDrop: "13:03, Thu Nov 19",
        actualDrop: "12:48, Thu Nov 19",
        phoneNumber: selectedEmployee.employeeContact,
        office: selectedEmployee.office,
        dropAddress: "Parade Ground Metro",
        cabIdReg: "TS 04 HR 8696",
        tripId: "1220",
        marshallName: "NA",
        marshallPhone: "-",
        driverPhone: selectedEmployee.driverContact,
      }
    );
  }, [selectedEmployee]);

  return (
    <div className="flex-1 min-h-0 flex flex-col space-y-[10px] relative">
      {/* ─── 1. TOP TOOLBAR: Date Range on Left, Segmented Search on Right (Exact match to media_1795085575394_cef11725.png) ─── */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 shrink-0 select-none">
        {/* Left Side: Date Range Picker matching reference format */}
        <div className="flex items-center">
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "inline-flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors hover:text-[#0089FF] cursor-pointer select-none py-1 px-1 rounded-md hover:bg-slate-100/60 dark:hover:bg-slate-800/60",
                  dateOpen && "text-[#0089FF]"
                )}
              >
                <CalendarIcon className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                  {dateRangeLabel}
                </span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-200",
                    dateOpen && "rotate-180"
                  )}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-3 z-50 space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                <span className="font-bold text-xs text-foreground">Select Date Range</span>
                <button
                  type="button"
                  onClick={() => setDateOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  "Today",
                  "Yesterday",
                  "Last 7 Days",
                  "04/12/2024 - 10/12/2024",
                ].map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => {
                      if (range === "04/12/2024 - 10/12/2024") {
                        setDateRangeLabel("04/12/2024 12:00 AM - 10/12/2024 11:59 PM");
                      } else {
                        setDateRangeLabel(`${range} (Full Day)`);
                      }
                      setDateOpen(false);
                      toast.success(`Date set to ${range}`);
                    }}
                    className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left font-medium cursor-pointer"
                  >
                    {range}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Right Side: Segmented Search Component Matching Reference media_1795085575394_cef11725.png */}
        <div className="flex items-center">
          <div className="relative flex h-8 items-center rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all overflow-hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  title="Select specific field to search"
                  className="flex h-full items-center gap-1 border-r border-[#DFE3EB] dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0 select-none"
                >
                  <span className="max-w-[76px] truncate">
                    {selectedSearchField === "ALL" ? "All fields" : selectedSearchFieldLabel}
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="max-h-64 w-52 overflow-y-auto text-xs p-1 rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md shadow-lg z-50 select-none"
              >
                <DropdownMenuItem
                  onClick={() => setSelectedSearchField("ALL")}
                  className={cn(
                    "cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors select-none",
                    selectedSearchField === "ALL"
                      ? "bg-muted font-semibold text-foreground"
                      : "text-foreground hover:bg-muted/80 hover:text-foreground font-medium"
                  )}
                >
                  <span>All fields</span>
                  {selectedSearchField === "ALL" && (
                    <Check className="h-3.5 w-3.5 text-[#0089FF]" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 -mx-1" />
                {SEARCH_FIELDS.filter((f) => f.id !== "ALL").map((f) => {
                  const isSelected = selectedSearchField === f.id;
                  return (
                    <DropdownMenuItem
                      key={f.id}
                      onClick={() => setSelectedSearchField(f.id)}
                      className={cn(
                        "cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors select-none",
                        isSelected
                          ? "bg-muted font-semibold text-foreground"
                          : "text-foreground hover:bg-muted/80 hover:text-foreground font-medium"
                      )}
                    >
                      <span className="truncate">{f.label}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-[#0089FF]" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Search className="ml-2.5 h-3.5 w-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                selectedSearchField === "ALL"
                  ? "Search in all fields..."
                  : `Search ${selectedSearchFieldLabel}...`
              }
              className="h-full w-44 sm:w-60 bg-transparent px-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="mr-1.5 rounded-full p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── 2. KPI SUMMARY CARDS (Placed BELOW Date & Search Bar) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 shrink-0">
        {/* Failed Card */}
        <SummaryCard
          id="failed"
          label="Failed"
          count={SAFE_REACH_SUMMARY.failed}
          outerRingClass="bg-red-100 dark:bg-red-950/60"
          badgeBgClass="bg-[#EF4444]"
          badgeTextColor="text-white"
          cardBgClass="bg-[#FFF5F5] dark:bg-red-950/25"
          cardBorderClass="border-red-200/90 dark:border-red-900/50"
          countColorClass="text-[#EF4444] dark:text-red-400"
          icon={<X className="h-4 w-4 stroke-[2.8]" />}
          isActive={selectedStatusFilter === "failed"}
          onClick={() =>
            setSelectedStatusFilter((prev) => (prev === "failed" ? null : "failed"))
          }
        />

        {/* In Progress Card */}
        <SummaryCard
          id="inprogress"
          label="In progress"
          count={SAFE_REACH_SUMMARY.inprogress}
          outerRingClass="bg-amber-100 dark:bg-amber-950/60"
          badgeBgClass="bg-[#F59E0B]"
          badgeTextColor="text-white"
          cardBgClass="bg-[#FFFDF5] dark:bg-amber-950/25"
          cardBorderClass="border-amber-200/90 dark:border-amber-900/50"
          countColorClass="text-[#F59E0B] dark:text-amber-400"
          icon={<Clock className="h-4 w-4 stroke-[2.6]" />}
          isActive={selectedStatusFilter === "inprogress"}
          onClick={() =>
            setSelectedStatusFilter((prev) => (prev === "inprogress" ? null : "inprogress"))
          }
        />

        {/* Manual Card */}
        <SummaryCard
          id="manual"
          label="Manual"
          count={SAFE_REACH_SUMMARY.manual}
          outerRingClass="bg-sky-100 dark:bg-sky-950/60"
          badgeBgClass="bg-[#0089FF]"
          badgeTextColor="text-white"
          cardBgClass="bg-[#F0F9FF] dark:bg-sky-950/25"
          cardBorderClass="border-sky-200/90 dark:border-sky-900/50"
          countColorClass="text-[#0089FF] dark:text-sky-400"
          icon={<Phone className="h-4 w-4 stroke-[2.4]" />}
          isActive={selectedStatusFilter === "manual"}
          onClick={() =>
            setSelectedStatusFilter((prev) => (prev === "manual" ? null : "manual"))
          }
        />

        {/* Automated Card */}
        <SummaryCard
          id="automated"
          label="Automated"
          count={SAFE_REACH_SUMMARY.automated}
          outerRingClass="bg-purple-100 dark:bg-purple-950/60"
          badgeBgClass="bg-[#8B5CF6]"
          badgeTextColor="text-white"
          cardBgClass="bg-[#FAF5FF] dark:bg-purple-950/25"
          cardBorderClass="border-purple-200/90 dark:border-purple-900/50"
          countColorClass="text-[#8B5CF6] dark:text-purple-400"
          icon={<Cpu className="h-4 w-4 stroke-[2.4]" />}
          isActive={selectedStatusFilter === "automated"}
          onClick={() =>
            setSelectedStatusFilter((prev) => (prev === "automated" ? null : "automated"))
          }
        />

        {/* Not on Trip Card */}
        <SummaryCard
          id="not_on_trip"
          label="Not on trip"
          count={SAFE_REACH_SUMMARY.not_on_trip}
          outerRingClass="bg-yellow-100 dark:bg-yellow-950/60"
          badgeBgClass="bg-[#EAB308]"
          badgeTextColor="text-white"
          cardBgClass="bg-[#FEFCE8] dark:bg-yellow-950/25"
          cardBorderClass="border-yellow-200/90 dark:border-yellow-900/50"
          countColorClass="text-[#EAB308] dark:text-yellow-500"
          icon={<Car className="h-4 w-4 stroke-[2.4]" />}
          isActive={selectedStatusFilter === "not_on_trip"}
          onClick={() =>
            setSelectedStatusFilter((prev) => (prev === "not_on_trip" ? null : "not_on_trip"))
          }
        />
      </div>

      {/* ─── 3. EMPLOYEES TABLE ─────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-auto rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Table>
          <TableHeader className="bg-slate-50/90 dark:bg-slate-800/60 sticky top-0 z-10 select-none">
            <TableRow className="border-b border-slate-200 dark:border-slate-700">
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                EMPLOYEE
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                NO
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                BUSINESS UNIT ID
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                OFFICE
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                EMPLOYEE CONTACT
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                DRIVER CONTACT
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                SHIFT
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                VISITED
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                DEBOARDED
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 text-center">
                CHANNEL
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 text-center">
                STATUS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="h-32 text-center text-xs text-slate-400">
                  No records match current filter.
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((emp) => (
                <TableRow
                  key={emp.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 text-xs border-b border-slate-100 dark:border-slate-800"
                >
                  <TableCell className="font-semibold text-slate-900 dark:text-slate-100 py-3">
                    {emp.name}
                  </TableCell>
                  <TableCell className="text-slate-500 font-mono text-[11px]">
                    {emp.employeeNo}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                    {emp.businessUnitId}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {emp.office}
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => handleViewContact(emp.name, emp.employeeContact, "Employee")}
                      className="text-xs font-semibold text-[#0089FF] hover:underline cursor-pointer"
                    >
                      View
                    </button>
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => handleViewContact(emp.name, emp.driverContact, "Driver")}
                      className="text-xs font-semibold text-[#0089FF] hover:underline cursor-pointer"
                    >
                      View
                    </button>
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                    {emp.shift}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                    {emp.visited}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                    {emp.deboarded}
                  </TableCell>

                  {/* Channel Column: Click to Open Right Side Slide-out Panel */}
                  <TableCell className="text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedEmployee(emp)}
                      title="Click to view employee & trip details"
                      className="group inline-flex items-center justify-center cursor-pointer focus:outline-none"
                    >
                      <ChannelIcon channel={emp.channel} />
                    </button>
                  </TableCell>

                  {/* Status Column: Click to Open Right Side Slide-out Panel */}
                  <TableCell className="text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedEmployee(emp)}
                      title="Click to view employee & trip details"
                      className="group inline-flex items-center justify-center cursor-pointer focus:outline-none"
                    >
                      <StatusBadge status={emp.status} />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ─── 4. BOTTOM PAGINATION & DOWNLOAD BAR ─────────────────────────────────── */}
      <TablePaginationBar
        page={page}
        pageSize={pageSize}
        totalRows={filteredEmployees.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        showReset={false}
        showExport={true}
        downloadLabel="Download"
        onExport={(fmt) => toast.success(`Exporting safe reach records as ${fmt}`)}
      />

      {/* ─── 5. RIGHT SIDE SLIDE-OUT PANEL (Matching Reference media_1795085616871_3eec3a29.png) ─── */}
      {selectedEmployee && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/25 dark:bg-black/50 backdrop-blur-[1px] z-[1100] animate-in fade-in duration-200"
            onClick={() => setSelectedEmployee(null)}
          />

          {/* Drawer Panel */}
          <aside
            aria-label="Employee & Trip Details"
            className="fixed top-0 right-0 bottom-0 w-[420px] max-w-[92vw] bg-background border-l border-border shadow-2xl z-[1101] flex flex-col animate-in slide-in-from-right duration-200 select-none"
          >
            {/* Header: Employee Name & Close Button (Standardized 56px drawer header) */}
            <header className="flex h-[56px] items-center justify-between border-b border-border px-5 bg-background select-none shrink-0">
              <h2 className="text-[16px] font-semibold tracking-tight text-foreground">
                {selectedEmployee.name}
              </h2>
              <button
                type="button"
                aria-label="Close details"
                onClick={() => setSelectedEmployee(null)}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {/* Scrollable Content Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4 custom-scrollbar">
              {/* Section 1: Employee Information */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-foreground/80 tracking-wide uppercase">
                    Employee Information
                  </h3>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border select-none",
                      currentDetails.gender === "FEMALE"
                        ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400"
                        : "bg-blue-50 text-[#0089FF] border-blue-200 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-400"
                    )}
                  >
                    {currentDetails.gender}
                  </span>
                </div>

                {/* Card Container with Two-Column Key-Value Grid */}
                <div className="p-3.5 rounded-lg border border-border/80 bg-card shadow-2xs space-y-2.5">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[11px] font-medium text-muted-foreground">Planned Sign In Time</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5">
                        {currentDetails.plannedSignIn}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-muted-foreground">Actual Sign In Time</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5">
                        {currentDetails.actualSignIn}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-border/60">
                    <div>
                      <p className="text-[11px] font-medium text-muted-foreground">Planned Drop Time</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5">
                        {currentDetails.plannedDrop}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-muted-foreground">Actual Drop Time</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5">
                        {currentDetails.actualDrop}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-border/60">
                    <div>
                      <p className="text-[11px] font-medium text-muted-foreground">Phone Number</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5 font-mono">
                        {currentDetails.phoneNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-muted-foreground">Office</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5">
                        {currentDetails.office}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/60 text-xs">
                    <p className="text-[11px] font-medium text-muted-foreground">Drop Address</p>
                    <p className="text-xs font-semibold text-foreground mt-0.5">
                      {currentDetails.dropAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: Trip Information */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-foreground/80 tracking-wide uppercase">
                  Trip Information
                </h3>

                {/* Card Container */}
                <div className="p-3.5 rounded-lg border border-border/80 bg-card shadow-2xs space-y-2.5">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[11px] font-medium text-muted-foreground">Cab ID, Registration</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5 font-mono">
                        {currentDetails.cabIdReg}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-muted-foreground">Trip ID</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5 font-mono">
                        {currentDetails.tripId}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-border/60">
                    <div>
                      <p className="text-[11px] font-medium text-muted-foreground">Marshall Name</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5">
                        {currentDetails.marshallName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-muted-foreground">Marshall Phone</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5 font-mono">
                        {currentDetails.marshallPhone}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/60 text-xs">
                    <p className="text-[11px] font-medium text-muted-foreground">Driver Phone</p>
                    <p className="text-xs font-semibold text-foreground mt-0.5 font-mono">
                      {currentDetails.driverPhone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Standardized Drawer Footer matching ADS Side Panel Design System (56px) */}
            <footer className="flex h-[56px] items-center justify-between border-t border-border bg-background px-5 gap-2.5 shrink-0 select-none">
              <button
                type="button"
                onClick={() => toast.success(`Safe reach verified for ${selectedEmployee.name}`)}
                className="flex-1 h-8 px-3 text-xs font-semibold rounded-md bg-[#0089FF] text-white shadow-xs hover:bg-[#0070d6] transition-all cursor-pointer active:scale-98 flex items-center justify-center"
              >
                Verify
              </button>
              <button
                type="button"
                onClick={() => toast.info(`Viewing audit log for ${selectedEmployee.name}`)}
                className="flex-1 h-8 px-3 text-xs font-medium rounded-md border border-input/80 bg-background text-foreground hover:bg-muted hover:border-slate-400/60 shadow-2xs transition-all cursor-pointer active:scale-98 flex items-center justify-center"
              >
                Audit
              </button>
              <button
                type="button"
                onClick={() => toast.info(`Viewing co-passengers for cab ${currentDetails.cabIdReg}`)}
                className="flex-1 h-8 px-3 text-xs font-medium rounded-md border border-input/80 bg-background text-foreground hover:bg-muted hover:border-slate-400/60 shadow-2xs transition-all cursor-pointer active:scale-98 flex items-center justify-center"
              >
                Co Passenger
              </button>
            </footer>
          </aside>
        </>
      )}
    </div>
  );
}
