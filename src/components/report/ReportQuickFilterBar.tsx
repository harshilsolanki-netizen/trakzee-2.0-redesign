import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar as CalendarIcon,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  COMPANIES,
  getBranchesForCompanies,
  getVehiclesForBranches,
  BRANCH_VEHICLES_MAP,
} from "@/data/reports";
import { type ReportFilters } from "@/components/report/ReportConfigPanel";
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

const MONTH_FULL_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const HOUR_OPTIONS = [
  "12",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
];

const MINUTE_OPTIONS = [
  "00",
  "05",
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
  "59",
];

function formatDateToISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Format to DD/MM/YYYY
function formatDateToDisplayDDMM(isoStr: string): string {
  if (!isoStr) return "";
  const parts = isoStr.split("-");
  if (parts.length !== 3) return isoStr;
  const [y, m, d] = parts;
  return `${d}/${m}/${y}`;
}

function parseISOToDate(isoStr: string): Date {
  if (!isoStr) return new Date();
  const parts = isoStr.split("-");
  if (parts.length === 3) {
    const y = parseInt(parts[0] || "2026", 10);
    const m = parseInt(parts[1] || "1", 10) - 1;
    const d = parseInt(parts[2] || "1", 10);
    return new Date(y, m, d);
  }
  return new Date();
}

function formatTimeTo12Hour(timeStr?: string): string {
  if (!timeStr) return "12:00 AM";
  const [hStr, mStr] = timeStr.split(":");
  let h = parseInt(hStr || "0", 10);
  const m = mStr || "00";
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${String(h).padStart(2, "0")}:${m} ${ampm}`;
}

function parseTimeToParts(timeStr?: string): {
  hour: string;
  minute: string;
  ampm: "AM" | "PM";
} {
  if (!timeStr) return { hour: "12", minute: "00", ampm: "AM" };
  const [hStr, mStr] = timeStr.split(":");
  let h = parseInt(hStr || "0", 10);
  const m = mStr || "00";
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return { hour: String(h).padStart(2, "0"), minute: m, ampm };
}

function composeTimeTo24Hour(
  hourStr: string,
  minuteStr: string,
  ampm: "AM" | "PM",
): string {
  let h = parseInt(hourStr || "12", 10);
  if (ampm === "PM" && h < 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${minuteStr.padStart(2, "0")}`;
}

function ModernTimeSelector({
  hour,
  minute,
  ampm,
  onHourChange,
  onMinuteChange,
  onAmPmChange,
  className,
}: {
  hour: string;
  minute: string;
  ampm: "AM" | "PM";
  onHourChange: (h: string) => void;
  onMinuteChange: (m: string) => void;
  onAmPmChange: (p: "AM" | "PM") => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const displayTime = `${hour}:${minute} ${ampm}`;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-8.5 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-xs font-medium text-muted-foreground transition-all cursor-pointer shadow-2xs hover:bg-muted/40 hover:border-[#0089FF]/50",
            isOpen && "border-[#0089FF] ring-2 ring-[#0089FF]/20",
            className,
          )}
        >
          <span>{displayTime}</span>
          <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-64 p-2.5 text-xs bg-popover/95 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-60 select-none animate-in fade-in zoom-in-95"
      >
        {/* Quick Presets */}
        <div className="grid grid-cols-2 gap-1.5 mb-2.5 pb-2 border-b border-border/70">
          <button
            type="button"
            onClick={() => {
              onHourChange("12");
              onMinuteChange("00");
              onAmPmChange("AM");
            }}
            className="flex flex-col items-center justify-center py-1.5 px-2 rounded-md bg-muted/60 hover:bg-muted text-foreground transition-all cursor-pointer active:scale-98"
          >
            <span className="text-xs font-bold leading-tight">12:00 AM</span>
            <span className="text-[9px] text-muted-foreground font-medium leading-tight mt-0.5">
              (Start)
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              onHourChange("11");
              onMinuteChange("59");
              onAmPmChange("PM");
            }}
            className="flex flex-col items-center justify-center py-1.5 px-2 rounded-md bg-muted/60 hover:bg-muted text-foreground transition-all cursor-pointer active:scale-98"
          >
            <span className="text-xs font-bold leading-tight">11:59 PM</span>
            <span className="text-[9px] text-muted-foreground font-medium leading-tight mt-0.5">
              (End)
            </span>
          </button>
        </div>

        {/* 3 Columns: Hours | Minutes | AM/PM */}
        <div className="grid grid-cols-3 gap-1.5 h-38">
          <div className="flex flex-col overflow-y-auto pr-0.5 space-y-0.5 custom-scrollbar">
            <span className="text-[10px] text-muted-foreground font-semibold px-1 mb-1 sticky top-0 bg-popover">
              Hr
            </span>
            {HOUR_OPTIONS.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => onHourChange(h)}
                className={cn(
                  "px-1 py-1 text-xs rounded-sm text-center font-medium transition-colors cursor-pointer",
                  hour === h
                    ? "bg-[#0089FF] text-white font-bold shadow-xs"
                    : "text-foreground hover:bg-muted",
                )}
              >
                {h}
              </button>
            ))}
          </div>

          <div className="flex flex-col overflow-y-auto pr-0.5 space-y-0.5 custom-scrollbar border-x border-border/60 px-1">
            <span className="text-[10px] text-muted-foreground font-semibold px-1 mb-1 sticky top-0 bg-popover">
              Min
            </span>
            {MINUTE_OPTIONS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onMinuteChange(m)}
                className={cn(
                  "px-1 py-1 text-xs rounded-sm text-center font-medium transition-colors cursor-pointer",
                  minute === m
                    ? "bg-[#0089FF] text-white font-bold shadow-xs"
                    : "text-foreground hover:bg-muted",
                )}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex flex-col justify-start space-y-1.5 pt-3">
            <button
              type="button"
              onClick={() => onAmPmChange("AM")}
              className={cn(
                "py-1.5 text-xs rounded-md text-center font-semibold transition-all cursor-pointer active:scale-98",
                ampm === "AM"
                  ? "bg-[#0089FF] text-white shadow-xs"
                  : "text-foreground hover:bg-muted bg-background border border-border/80",
              )}
            >
              AM
            </button>
            <button
              type="button"
              onClick={() => onAmPmChange("PM")}
              className={cn(
                "py-1.5 text-xs rounded-md text-center font-semibold transition-all cursor-pointer active:scale-98",
                ampm === "PM"
                  ? "bg-[#0089FF] text-white shadow-xs"
                  : "text-foreground hover:bg-muted bg-background border border-border/80",
              )}
            >
              PM
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function getDateRangeFromPreset(preset: string): { from: string; to: string } {
  const now = new Date();

  if (preset === "Today") {
    const str = formatDateToISO(now);
    return { from: str, to: str };
  }
  if (preset === "Yesterday") {
    const y = new Date(now);
    y.setDate(y.getDate() - 1);
    const str = formatDateToISO(y);
    return { from: str, to: str };
  }
  if (preset === "This Week") {
    const start = new Date(now);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    return { from: formatDateToISO(start), to: formatDateToISO(now) };
  }
  if (preset === "Last Week") {
    const start = new Date(now);
    const day = start.getDay();
    const diff = start.getDate() - day - 6 + (day === 0 ? -6 : 1);
    start.setDate(diff);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { from: formatDateToISO(start), to: formatDateToISO(end) };
  }
  if (preset === "Last 7 Days") {
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    return { from: formatDateToISO(start), to: formatDateToISO(now) };
  }
  if (preset === "Last 30 Days") {
    const start = new Date(now);
    start.setDate(now.getDate() - 29);
    return { from: formatDateToISO(start), to: formatDateToISO(now) };
  }
  if (preset === "This Month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { from: formatDateToISO(start), to: formatDateToISO(now) };
  }
  if (preset === "Last Month") {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    return { from: formatDateToISO(start), to: formatDateToISO(end) };
  }
  return { from: formatDateToISO(now), to: formatDateToISO(now) };
}

export function ReportQuickFilterBar({
  filters,
  onChange,
  onOpenFilterDrawer,
  className,
}: {
  filters: ReportFilters;
  onChange: (patch: Partial<ReportFilters>) => void;
  onOpenFilterDrawer: () => void;
  className?: string;
}) {
  // Popover open states
  const [dateOpen, setDateOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const [vehicleOpen, setVehicleOpen] = useState(false);

  // Search terms inside popovers
  const [companySearch, setCompanySearch] = useState("");
  const [branchSearch, setBranchSearch] = useState("");
  const [vehicleSearch, setVehicleSearch] = useState("");

  // Custom Preset Dropdown Menu open state
  const [presetMenuOpen, setPresetMenuOpen] = useState(false);

  // Date Range Popover Draft State
  const [draftPreset, setDraftPreset] = useState(filters.datePreset || "Today");
  const [draftFrom, setDraftFrom] = useState(filters.from || "2026-09-02");
  const [draftTo, setDraftTo] = useState(filters.to || "2026-09-02");
  const [selectionStep, setSelectionStep] = useState<"start" | "end">("start");
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  // Time Stepper Parts
  const initialFromParts = parseTimeToParts(filters.fromTime || "00:00");
  const initialToParts = parseTimeToParts(filters.toTime || "23:59");
  const [fromHour, setFromHour] = useState(initialFromParts.hour);
  const [fromMinute, setFromMinute] = useState(initialFromParts.minute);
  const [fromAmPm, setFromAmPm] = useState<"AM" | "PM">(initialFromParts.ampm);

  const [toHour, setToHour] = useState(initialToParts.hour);
  const [toMinute, setToMinute] = useState(initialToParts.minute);
  const [toAmPm, setToAmPm] = useState<"AM" | "PM">(initialToParts.ampm);

  // View Date for Dual Calendar
  const [viewDate, setViewDate] = useState(() => {
    const d = parseISOToDate(filters.from || "2026-09-02");
    return new Date(d.getFullYear(), d.getMonth() - 1, 1);
  });

  // Sync draft state on popover open
  useEffect(() => {
    if (dateOpen) {
      const preset = filters.datePreset || "Today";
      setDraftPreset(preset);
      setDraftFrom(filters.from || "2026-09-02");
      setDraftTo(filters.to || "2026-09-02");
      setPresetMenuOpen(false);
      setSelectionStep("start");

      const fp = parseTimeToParts(filters.fromTime || "00:00");
      const tp = parseTimeToParts(filters.toTime || "23:59");
      setFromHour(fp.hour);
      setFromMinute(fp.minute);
      setFromAmPm(fp.ampm);
      setToHour(tp.hour);
      setToMinute(tp.minute);
      setToAmPm(tp.ampm);

      const d = parseISOToDate(filters.from || "2026-09-02");
      setViewDate(new Date(d.getFullYear(), d.getMonth() - 1, 1));
    }
  }, [dateOpen, filters]);

  // Dual Month Navigation
  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  // Preset Selection Click Handler
  const handlePresetSelect = (preset: string) => {
    setDraftPreset(preset);
    setPresetMenuOpen(false);
    if (preset === "Custom Range") {
      setSelectionStep("start");
      return;
    }
    const range = getDateRangeFromPreset(preset);
    setDraftFrom(range.from);
    setDraftTo(range.to);
    const d = parseISOToDate(range.from);
    setViewDate(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };

  // Dual Calendar Day Selection Handler
  const handleDualCalendarDayClick = (isoDate: string) => {
    setDraftPreset("Custom Range");
    if (selectionStep === "start") {
      setDraftFrom(isoDate);
      setDraftTo(isoDate);
      setSelectionStep("end");
    } else {
      if (isoDate < draftFrom) {
        setDraftFrom(isoDate);
        setDraftTo(draftFrom);
      } else {
        setDraftTo(isoDate);
      }
      setSelectionStep("start");
    }
  };

  // Apply Date & Time
  const handleApplyDateTime = () => {
    const fTime = composeTimeTo24Hour(fromHour, fromMinute, fromAmPm);
    const tTime = composeTimeTo24Hour(toHour, toMinute, toAmPm);
    onChange({
      datePreset: draftPreset,
      from: draftFrom,
      to: draftTo,
      fromTime: fTime,
      toTime: tTime,
      enableTimeRange: true,
      date: draftFrom,
    });
    setDateOpen(false);
  };

  // Reset / Clear handler for Date Range
  const handleResetDate = () => {
    const today = new Date();
    const todayStr = formatDateToISO(today);
    setDraftPreset("Today");
    setDraftFrom(todayStr);
    setDraftTo(todayStr);
    setFromHour("12");
    setFromMinute("00");
    setFromAmPm("AM");
    setToHour("11");
    setToMinute("59");
    setToAmPm("PM");
    setPresetMenuOpen(false);
    setViewDate(new Date(today.getFullYear(), today.getMonth() - 1, 1));
  };

  // Trigger label showing Date Range and Time Range formatted
  const dateTimeRangeTriggerLabel = useMemo(() => {
    const fDate = formatDateToDisplayDDMM(filters.from || "2026-09-02");
    const tDate = formatDateToDisplayDDMM(filters.to || "2026-09-02");
    const fTime = filters.fromTime
      ? formatTimeTo12Hour(filters.fromTime)
      : "12:00 AM";
    const tTime = filters.toTime
      ? formatTimeTo12Hour(filters.toTime)
      : "11:59 PM";
    return `${fDate} ${fTime} - ${tDate} ${tTime}`;
  }, [filters.from, filters.to, filters.fromTime, filters.toTime]);

  // Dual Month Calendar Generator
  const renderDualMonth = (
    year: number,
    month: number,
    isFromMonth: boolean,
  ) => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: {
      dateStr: string;
      dayNum: number;
      isCurrentMonth: boolean;
    }[] = [];

    // Prev month trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevM = month === 0 ? 11 : month - 1;
      const prevY = month === 0 ? year - 1 : year;
      const dateStr = formatDateToISO(new Date(prevY, prevM, d));
      cells.push({ dateStr, dayNum: d, isCurrentMonth: false });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = formatDateToISO(new Date(year, month, d));
      cells.push({ dateStr, dayNum: d, isCurrentMonth: true });
    }

    // Next month leading days
    const totalSlots = cells.length > 35 ? 42 : 35;
    const remaining = totalSlots - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const nextM = month === 11 ? 0 : month + 1;
      const nextY = month === 11 ? year + 1 : year;
      const dateStr = formatDateToISO(new Date(nextY, nextM, d));
      cells.push({ dateStr, dayNum: d, isCurrentMonth: false });
    }

    const monthLabel = `${MONTH_FULL_NAMES[month]} ${year}`;

    return (
      <div className="flex-1 select-none">
        {/* Month Header with Navigation Arrows */}
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="font-bold text-xs text-foreground">
            {monthLabel}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
              title="Previous month"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
              title="Next month"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-bold text-muted-foreground uppercase mb-1">
          {WEEKDAY_NAMES.map((w) => (
            <div key={w} className="h-4 flex items-center justify-center">
              {w}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-0.5 text-center text-xs mb-3">
          {cells.map(({ dateStr, dayNum, isCurrentMonth }, idx) => {
            const isStart = dateStr === draftFrom;
            const isEnd = dateStr === draftTo;
            const effectiveEnd =
              selectionStep === "end" && hoverDate && hoverDate >= draftFrom
                ? hoverDate
                : draftTo;
            const inRange =
              draftFrom &&
              effectiveEnd &&
              dateStr > draftFrom &&
              dateStr < effectiveEnd;
            const isSelected = isStart || isEnd;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleDualCalendarDayClick(dateStr)}
                onMouseEnter={() => {
                  if (selectionStep === "end") setHoverDate(dateStr);
                }}
                className={cn(
                  "h-7 w-full flex items-center justify-center text-xs rounded-md transition-all cursor-pointer relative font-medium",
                  !isCurrentMonth &&
                    "text-muted-foreground/30 pointer-events-none",
                  isCurrentMonth &&
                    !isSelected &&
                    !inRange &&
                    "text-foreground hover:bg-muted",
                  inRange &&
                    "bg-[#0089FF]/15 text-[#0089FF] font-semibold rounded-none first:rounded-l-md last:rounded-r-md",
                  isSelected &&
                    "bg-[#0089FF] text-white font-bold shadow-xs z-10",
                )}
              >
                {dayNum}
              </button>
            );
          })}
        </div>

        {/* Time Selector below this Month */}
        <div className="pt-2 border-t border-border/70">
          <span className="block text-[11px] font-semibold text-foreground mb-1">
            {isFromMonth ? "From Time" : "To Time"}
          </span>
          {isFromMonth ? (
            <ModernTimeSelector
              hour={fromHour}
              minute={fromMinute}
              ampm={fromAmPm}
              onHourChange={setFromHour}
              onMinuteChange={setFromMinute}
              onAmPmChange={setFromAmPm}
            />
          ) : (
            <ModernTimeSelector
              hour={toHour}
              minute={toMinute}
              ampm={toAmPm}
              onHourChange={setToHour}
              onMinuteChange={setToMinute}
              onAmPmChange={setToAmPm}
            />
          )}
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // 1. Master List of Companies
  // -------------------------------------------------------------
  const allCompanies = useMemo(() => {
    return COMPANIES.filter((c) => c !== "All");
  }, []);

  // Multi-Company Selection Draft State (Defaults to all companies if none selected)
  const [draftCompanies, setDraftCompanies] = useState<string[]>([]);
  useEffect(() => {
    if (companyOpen) {
      const isFiltered =
        filters.companies &&
        filters.companies.length > 0 &&
        !filters.companies.includes("All");
      const valid = isFiltered
        ? (filters.companies || []).filter((c) => allCompanies.includes(c))
        : [];
      setDraftCompanies(valid.length > 0 ? valid : allCompanies);
      setCompanySearch("");
    }
  }, [companyOpen, filters.companies, allCompanies]);

  const isAllCompaniesDraftSelected =
    draftCompanies.length === allCompanies.length && allCompanies.length > 0;

  const toggleAllDraftCompanies = () => {
    if (isAllCompaniesDraftSelected) {
      setDraftCompanies([]);
    } else {
      setDraftCompanies([...allCompanies]);
    }
  };

  const toggleDraftCompany = (comp: string) => {
    if (draftCompanies.includes(comp)) {
      setDraftCompanies(draftCompanies.filter((x) => x !== comp));
    } else {
      setDraftCompanies([...draftCompanies, comp]);
    }
  };

  // -------------------------------------------------------------
  // 2. Cascading Branches (Dependent on selected companies, defaults to all if empty)
  // -------------------------------------------------------------
  const availableBranches = useMemo(() => {
    const isFiltered =
      filters.companies &&
      filters.companies.length > 0 &&
      !filters.companies.includes("All");
    const currentCompanies = isFiltered ? filters.companies! : allCompanies;
    return getBranchesForCompanies(currentCompanies);
  }, [filters.companies, allCompanies]);

  const [draftBranches, setDraftBranches] = useState<string[]>([]);
  useEffect(() => {
    if (branchOpen) {
      const isFiltered =
        filters.branches &&
        filters.branches.length > 0 &&
        !filters.branches.includes("All");
      const valid = isFiltered
        ? (filters.branches || []).filter((b) => availableBranches.includes(b))
        : [];
      setDraftBranches(valid.length > 0 ? valid : availableBranches);
      setBranchSearch("");
    }
  }, [branchOpen, filters.branches, availableBranches]);

  const isAllBranchesDraftSelected =
    draftBranches.length === availableBranches.length &&
    availableBranches.length > 0;

  const toggleAllDraftBranches = () => {
    if (isAllBranchesDraftSelected) {
      setDraftBranches([]);
    } else {
      setDraftBranches([...availableBranches]);
    }
  };

  const toggleDraftBranch = (b: string) => {
    if (draftBranches.includes(b)) {
      setDraftBranches(draftBranches.filter((x) => x !== b));
    } else {
      setDraftBranches([...draftBranches, b]);
    }
  };

  // -------------------------------------------------------------
  // 3. Cascading Vehicles (Dependent on selected branches, defaults to all if empty)
  // -------------------------------------------------------------
  const activeSelectedBranches = useMemo(() => {
    const isFiltered =
      filters.branches &&
      filters.branches.length > 0 &&
      !filters.branches.includes("All");
    const b = isFiltered ? filters.branches! : availableBranches;
    const valid = b.filter((branch) => availableBranches.includes(branch));
    return valid.length > 0 ? valid : availableBranches;
  }, [filters.branches, availableBranches]);

  const availableVehicles = useMemo(() => {
    return getVehiclesForBranches(activeSelectedBranches);
  }, [activeSelectedBranches]);

  const availableVehicleIds = useMemo(() => {
    return availableVehicles.map((v) => v.id);
  }, [availableVehicles]);

  const [draftObjects, setDraftObjects] = useState<string[]>([]);
  const [collapsedBranchGroups, setCollapsedBranchGroups] = useState<string[]>(
    [],
  );

  useEffect(() => {
    if (vehicleOpen) {
      const isFiltered =
        filters.objects &&
        filters.objects.length > 0 &&
        !filters.objects.includes("All");
      const valid = isFiltered
        ? (filters.objects || []).filter((id) =>
            availableVehicleIds.includes(id),
          )
        : [];
      setDraftObjects(valid.length > 0 ? valid : availableVehicleIds);
      setVehicleSearch("");
    }
  }, [vehicleOpen, filters.objects, availableVehicleIds]);

  const isAllVehiclesDraftSelected =
    draftObjects.length === availableVehicleIds.length &&
    availableVehicleIds.length > 0;

  const toggleAllDraftVehicles = () => {
    if (isAllVehiclesDraftSelected) {
      setDraftObjects([]);
    } else {
      setDraftObjects([...availableVehicleIds]);
    }
  };

  const toggleDraftObject = (id: string) => {
    if (draftObjects.includes(id)) {
      setDraftObjects(draftObjects.filter((x) => x !== id));
    } else {
      setDraftObjects([...draftObjects, id]);
    }
  };

  const toggleDraftBranchVehicles = (branchName: string) => {
    const branchVehicleIds = (BRANCH_VEHICLES_MAP[branchName] || []).map(
      (v) => v.id,
    );
    const allBranchIn = branchVehicleIds.every((id) =>
      draftObjects.includes(id),
    );
    if (allBranchIn) {
      setDraftObjects(
        draftObjects.filter((id) => !branchVehicleIds.includes(id)),
      );
    } else {
      setDraftObjects([...new Set([...draftObjects, ...branchVehicleIds])]);
    }
  };

  const toggleCollapseBranchGroup = (branchName: string) => {
    setCollapsedBranchGroups((prev) =>
      prev.includes(branchName)
        ? prev.filter((b) => b !== branchName)
        : [...prev, branchName],
    );
  };

  // -------------------------------------------------------------
  // Search Filtering
  // -------------------------------------------------------------
  const filteredCompanyList = useMemo(() => {
    const q = companySearch.trim().toLowerCase();
    if (!q) return allCompanies;
    return allCompanies.filter((c) => c.toLowerCase().includes(q));
  }, [allCompanies, companySearch]);

  const filteredBranchList = useMemo(() => {
    const q = branchSearch.trim().toLowerCase();
    if (!q) return availableBranches;
    return availableBranches.filter((b) => b.toLowerCase().includes(q));
  }, [availableBranches, branchSearch]);

  const groupedFilteredVehicles = useMemo(() => {
    const q = vehicleSearch.trim().toLowerCase();
    const map = new Map<
      string,
      { id: string; name: string; imei: string; driver?: string }[]
    >();

    for (const branch of activeSelectedBranches) {
      const vList = BRANCH_VEHICLES_MAP[branch] || [];
      const matched = vList.filter(
        (v) =>
          !q ||
          v.name.toLowerCase().includes(q) ||
          v.imei.toLowerCase().includes(q) ||
          (v.driver && v.driver.toLowerCase().includes(q)) ||
          branch.toLowerCase().includes(q),
      );
      if (matched.length > 0) {
        map.set(branch, matched);
      }
    }
    return Array.from(map.entries());
  }, [activeSelectedBranches, vehicleSearch]);

  // -------------------------------------------------------------
  // Dropdown Labels (Displays "All" when all or none are explicitly filtered)
  // -------------------------------------------------------------
  const companyLabel = useMemo(() => {
    const list = filters.companies || [];
    if (
      list.length === 0 ||
      list.length === allCompanies.length ||
      list.includes("All")
    )
      return "All";
    if (list.length === 1) return list[0];
    return `${list[0]} +${list.length - 1}`;
  }, [filters.companies, allCompanies.length]);

  const branchLabel = useMemo(() => {
    const list = (filters.branches || []).filter((b) =>
      availableBranches.includes(b),
    );
    if (
      list.length === 0 ||
      list.length === availableBranches.length ||
      list.includes("All")
    )
      return "All";
    if (list.length === 1) return list[0];
    return `${list[0]} +${list.length - 1}`;
  }, [filters.branches, availableBranches]);

  const vehicleLabel = useMemo(() => {
    const selected = (filters.objects || []).filter((id) =>
      availableVehicleIds.includes(id),
    );
    if (
      selected.length === 0 ||
      selected.length === availableVehicleIds.length ||
      selected.includes("All")
    ) {
      return "All";
    }
    if (selected.length === 1) return selected[0];
    return `${selected[0]} +${selected.length - 1}`;
  }, [filters.objects, availableVehicleIds]);

  // -------------------------------------------------------------
  // Apply Handlers with Automatic Child Pruning & Cascading
  // -------------------------------------------------------------
  const handleApplyCompanies = () => {
    const isAll =
      draftCompanies.length === 0 ||
      draftCompanies.length === allCompanies.length;
    const appliedCompanies = isAll ? [] : draftCompanies;

    const newAvailBranches = getBranchesForCompanies(
      isAll ? allCompanies : draftCompanies,
    );
    const validBranches = (filters.branches || []).filter((b) =>
      newAvailBranches.includes(b),
    );
    const nextBranches =
      validBranches.length > 0 && validBranches.length < newAvailBranches.length
        ? validBranches
        : [];

    const newAvailVehicles = getVehiclesForBranches(
      nextBranches.length > 0 ? nextBranches : newAvailBranches,
    );
    const newAvailVehicleIds = newAvailVehicles.map((v) => v.id);
    const validVehicles = (filters.objects || []).filter((id) =>
      newAvailVehicleIds.includes(id),
    );
    const nextVehicles =
      validVehicles.length > 0 &&
      validVehicles.length < newAvailVehicleIds.length
        ? validVehicles
        : [];

    onChange({
      companies: appliedCompanies,
      branches: nextBranches,
      objects: nextVehicles,
    });
    setCompanyOpen(false);
  };

  const handleApplyBranches = () => {
    const isAll =
      draftBranches.length === 0 ||
      draftBranches.length === availableBranches.length;
    const appliedBranches = isAll ? [] : draftBranches;

    const newAvailVehicles = getVehiclesForBranches(
      isAll ? availableBranches : draftBranches,
    );
    const newAvailVehicleIds = newAvailVehicles.map((v) => v.id);
    const validVehicles = (filters.objects || []).filter((id) =>
      newAvailVehicleIds.includes(id),
    );
    const nextVehicles =
      validVehicles.length > 0 &&
      validVehicles.length < newAvailVehicleIds.length
        ? validVehicles
        : [];

    onChange({
      branches: appliedBranches,
      objects: nextVehicles,
    });
    setBranchOpen(false);
  };

  const handleApplyVehicles = () => {
    const isAll =
      draftObjects.length === 0 ||
      draftObjects.length === availableVehicleIds.length;
    onChange({ objects: isAll ? [] : draftObjects });
    setVehicleOpen(false);
  };

  const activeSideFilterCount = useMemo(() => {
    let count = 0;
    if (
      filters.groups &&
      filters.groups.length > 0 &&
      !filters.groups.includes("All")
    )
      count++;
    if (
      filters.types &&
      filters.types.length > 0 &&
      !filters.types.includes("All")
    )
      count++;
    if (
      filters.brands &&
      filters.brands.length > 0 &&
      !filters.brands.includes("All") &&
      filters.brands[0] !== ""
    )
      count++;
    if (
      filters.models &&
      filters.models.length > 0 &&
      !filters.models.includes("All") &&
      filters.models[0] !== ""
    )
      count++;
    if (filters.durationValue && filters.durationValue.trim() !== "") count++;
    if (filters.distanceValue && filters.distanceValue.trim() !== "") count++;
    return count;
  }, [filters]);

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-xs text-muted-foreground shrink-0",
        className,
      )}
    >
      {/* 1. Date Range Dropdown Popover */}
      <Popover open={dateOpen} onOpenChange={setDateOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition-all cursor-pointer select-none hover:bg-muted/70",
              dateOpen
                ? "bg-[#0089FF]/10 text-[#0089FF] ring-1 ring-[#0089FF]/30"
                : "text-[#0089FF] hover:text-[#0089FF]",
            )}
          >
            <CalendarIcon className="h-3.5 w-3.5 text-[#0089FF] shrink-0" />
            <span className="font-semibold text-[#0089FF]">
              {dateTimeRangeTriggerLabel}
            </span>
            <ChevronDown
              className={cn(
                "h-3 w-3 text-[#0089FF]/70 shrink-0 transition-transform duration-200",
                dateOpen && "rotate-180",
              )}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={4}
          className={cn(
            "p-0 text-xs bg-popover/95 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-50 select-none overflow-visible transition-all duration-200 space-y-0",
            draftPreset === "Custom Range" ? "w-[580px]" : "w-[360px]",
          )}
        >
          {/* Form Body */}
          <div className="p-4 space-y-3">
            {/* Date Range Dropdown Trigger & Popover (Theme Styled) */}
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

              {/* Custom Preset Dropdown Menu matching application design system */}
              {presetMenuOpen && (
                <div className="absolute left-0 top-full mt-1 w-full rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md shadow-lg p-1 z-60 animate-in fade-in zoom-in-95 space-y-0.5">
                  {PRESET_OPTIONS.map((opt) => {
                    const isSelected = draftPreset === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handlePresetSelect(opt)}
                        className={cn(
                          "flex w-full items-center justify-between px-2.5 py-1.5 rounded-sm text-xs transition-all cursor-pointer select-none text-left",
                          isSelected
                            ? "bg-[#0089FF]/10 text-[#0089FF] font-bold"
                            : "text-foreground hover:bg-muted font-medium",
                        )}
                      >
                        <span>{opt}</span>
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-[#0089FF] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* If Custom Range: Render Dual Month Calendar */}
            {draftPreset === "Custom Range" ? (
              <div className="pt-2 flex gap-4">
                {renderDualMonth(
                  viewDate.getFullYear(),
                  viewDate.getMonth(),
                  true,
                )}
                <div className="w-px bg-border/60 my-1" />
                {renderDualMonth(
                  new Date(
                    viewDate.getFullYear(),
                    viewDate.getMonth() + 1,
                    1,
                  ).getFullYear(),
                  new Date(
                    viewDate.getFullYear(),
                    viewDate.getMonth() + 1,
                    1,
                  ).getMonth(),
                  false,
                )}
              </div>
            ) : (
              /* Standard Preset: Time Range Selectors */
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock className="h-3.5 w-3.5 text-[#0089FF]" />
                  <span className="text-xs font-semibold text-foreground block">
                    Time Range
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <ModernTimeSelector
                    hour={fromHour}
                    minute={fromMinute}
                    ampm={fromAmPm}
                    onHourChange={setFromHour}
                    onMinuteChange={setFromMinute}
                    onAmPmChange={setFromAmPm}
                  />
                  <ModernTimeSelector
                    hour={toHour}
                    minute={toMinute}
                    ampm={toAmPm}
                    onHourChange={setToHour}
                    onMinuteChange={setToMinute}
                    onAmPmChange={setToAmPm}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-2.5 px-4 border-t border-border/70 flex items-center justify-between bg-muted/20 rounded-b-lg">
            <button
              type="button"
              onClick={handleResetDate}
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

      {/* 2. Company Quick Filter */}
      <Popover open={companyOpen} onOpenChange={setCompanyOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs transition-colors cursor-pointer select-none hover:bg-muted/70",
              companyOpen && "bg-muted font-semibold",
            )}
          >
            <span className="font-semibold text-foreground">Company:</span>
            <span className="font-medium text-muted-foreground">{companyLabel}</span>
            <ChevronDown className="h-3 w-3 opacity-60 shrink-0" />
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

      {/* 3. Branch Quick Filter (Single functional filter, Cascades to Vehicles) */}
      <Popover open={branchOpen} onOpenChange={setBranchOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs transition-colors cursor-pointer select-none hover:bg-muted/70",
              branchOpen && "bg-muted font-semibold",
            )}
          >
            <span className="font-semibold text-foreground">Branch:</span>
            <span className="font-medium text-muted-foreground">{branchLabel}</span>
            <ChevronDown className="h-3 w-3 opacity-60 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={4}
          className="w-68 p-0 text-xs bg-popover/95 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-50 overflow-hidden select-none"
        >
          <div className="p-3 px-4 border-b border-border/70 space-y-2 bg-muted/20">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Select Branches</span>
              <span className="text-[10px] font-semibold text-[#0089FF] bg-[#0089FF]/10 px-2 py-0.5 rounded-full">
                {draftBranches.length} selected
              </span>
            </div>
            <div className="flex h-8 items-center gap-2 rounded-md border border-input bg-background px-2.5 focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all">
              <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <input
                value={branchSearch}
                onChange={(e) => setBranchSearch(e.target.value)}
                placeholder="Search branch..."
                className="h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
              />
              {branchSearch && (
                <button
                  type="button"
                  onClick={() => setBranchSearch("")}
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
                checked={isAllBranchesDraftSelected}
                onChange={toggleAllDraftBranches}
                className="h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer"
              />
              <span>Select All</span>
            </label>
          </div>

          <div className="max-h-52 overflow-y-auto p-1 space-y-0.5 custom-scrollbar">
            {filteredBranchList.map((b) => {
              const checked = draftBranches.includes(b);
              return (
                <label
                  key={b}
                  className={cn(
                    "flex items-center gap-2 px-2.5 py-1.5 rounded-sm hover:bg-muted cursor-pointer transition-colors text-xs select-none",
                    checked && "bg-muted/40",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleDraftBranch(b)}
                    className="h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer"
                  />
                  <span
                    className={cn(
                      "text-foreground font-medium",
                      checked && "font-semibold text-foreground",
                    )}
                  >
                    {b}
                  </span>
                </label>
              );
            })}
            {filteredBranchList.length === 0 && (
              <div className="p-4 text-center text-xs text-muted-foreground">
                No branch found
              </div>
            )}
          </div>

          <div className="p-2.5 px-4 border-t border-border/70 flex items-center justify-between bg-muted/20">
            <button
              type="button"
              onClick={() => setDraftBranches([])}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer transition-colors"
            >
              Clear
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBranchOpen(false)}
                className="px-3 py-1.5 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyBranches}
                className="px-4 py-1.5 text-xs rounded-md bg-[#0089FF] text-white hover:bg-[#0070d6] cursor-pointer font-semibold shadow-xs transition-all active:scale-98"
              >
                Apply
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* 4. Vehicle / Object Quick Filter */}
      <Popover open={vehicleOpen} onOpenChange={setVehicleOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs transition-colors cursor-pointer select-none hover:bg-muted/70",
              vehicleOpen && "bg-muted font-semibold",
            )}
          >
            <span className="font-semibold text-foreground">Vehicle:</span>
            <span className="font-medium text-muted-foreground">{vehicleLabel}</span>
            <ChevronDown className="h-3 w-3 opacity-60 shrink-0" />
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
                {draftObjects.length} / {availableVehicleIds.length} selected
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

          {/* Grouped Tree List by Branch */}
          <div className="max-h-64 overflow-y-auto p-1.5 space-y-1.5 custom-scrollbar">
            {groupedFilteredVehicles.map(([branchName, vList]) => {
              const isCollapsed =
                collapsedBranchGroups.includes(branchName) && !vehicleSearch;
              const branchVehicleIds = vList.map((v) => v.id);
              const branchSelectedCount = branchVehicleIds.filter((id) =>
                draftObjects.includes(id),
              ).length;
              const allBranchIn =
                branchSelectedCount === branchVehicleIds.length &&
                branchVehicleIds.length > 0;
              const someBranchIn = branchSelectedCount > 0 && !allBranchIn;

              return (
                <div
                  key={branchName}
                  className="rounded-md border border-border/70 bg-card/60 overflow-hidden"
                >
                  {/* Branch Row Header */}
                  <div className="flex items-center justify-between px-2.5 py-1.5 bg-muted/30 border-b border-border/50 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer select-none font-semibold text-foreground">
                      <input
                        type="checkbox"
                        checked={allBranchIn}
                        ref={(el) => {
                          if (el) el.indeterminate = someBranchIn;
                        }}
                        onChange={() => toggleDraftBranchVehicles(branchName)}
                        className="h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer"
                      />
                      <span>{branchName}</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground font-semibold bg-background px-1.5 py-0.5 rounded-sm border border-border/60">
                        {branchSelectedCount}/{branchVehicleIds.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleCollapseBranchGroup(branchName)}
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
                        const checked = draftObjects.includes(v.id);
                        return (
                          <label
                            key={v.id}
                            className={cn(
                              "flex items-center gap-2 px-2 py-1 rounded-sm hover:bg-muted cursor-pointer transition-colors text-xs select-none",
                              checked && "bg-muted/40",
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleDraftObject(v.id)}
                              className="h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer shrink-0"
                            />
                            <div className="flex flex-col min-w-0">
                              <span
                                className={cn(
                                  "text-xs leading-tight text-foreground",
                                  checked && "font-semibold text-foreground",
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
                No vehicles available for selected branch filters
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-2.5 px-4 border-t border-border/70 flex items-center justify-between bg-muted/20">
            <button
              type="button"
              onClick={() => setDraftObjects([])}
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

      {/* 5. Filter Button */}
      <button
        type="button"
        onClick={onOpenFilterDrawer}
        aria-label="Open Filter Drawer"
        className="inline-flex h-7 items-center gap-1.5 rounded-md bg-[#0089FF]/10 border border-[#0089FF]/30 px-2.5 text-xs font-semibold text-[#0089FF] hover:bg-[#0089FF]/20 transition-all cursor-pointer select-none shadow-2xs active:scale-98"
      >
        <SlidersHorizontal className="h-3 w-3 text-[#0089FF]" />
        <span>Filter</span>
        {activeSideFilterCount > 0 && (
          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold leading-tight bg-[#0089FF] text-white">
            {activeSideFilterCount}
          </span>
        )}
      </button>
    </div>
  );
}
