import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Check,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

const WEEKDAY_NAMES = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

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
            "flex h-9 w-full items-center justify-between rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-[#0089FF]/50",
            isOpen && "border-[#0089FF] ring-2 ring-[#0089FF]/20",
            className
          )}
        >
          <span>{displayTime}</span>
          <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-64 p-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-lg z-[100] select-none"
      >
        {/* Quick Presets */}
        <div className="grid grid-cols-2 gap-1.5 mb-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              onHourChange("12");
              onMinuteChange("00");
              onAmPmChange("AM");
            }}
            className="flex flex-col items-center justify-center py-1.5 px-2 rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all cursor-pointer active:scale-98"
          >
            <span className="text-xs font-bold leading-tight">12:00 AM</span>
            <span className="text-[9px] text-slate-400 font-medium leading-tight mt-0.5">
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
            className="flex flex-col items-center justify-center py-1.5 px-2 rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all cursor-pointer active:scale-98"
          >
            <span className="text-xs font-bold leading-tight">11:59 PM</span>
            <span className="text-[9px] text-slate-400 font-medium leading-tight mt-0.5">
              (End)
            </span>
          </button>
        </div>

        {/* 3 Columns: Hours | Minutes | AM/PM */}
        <div className="grid grid-cols-3 gap-1.5 h-38">
          <div className="flex flex-col overflow-y-auto pr-0.5 space-y-0.5 custom-scrollbar">
            <span className="text-[10px] text-slate-400 font-semibold px-1 mb-1 sticky top-0 bg-white dark:bg-slate-900">
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
                    ? "bg-[#0089FF] text-white font-bold shadow-2xs"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                {h}
              </button>
            ))}
          </div>

          <div className="flex flex-col overflow-y-auto pr-0.5 space-y-0.5 custom-scrollbar border-x border-slate-100 dark:border-slate-800 px-1">
            <span className="text-[10px] text-slate-400 font-semibold px-1 mb-1 sticky top-0 bg-white dark:bg-slate-900">
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
                    ? "bg-[#0089FF] text-white font-bold shadow-2xs"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                  ? "bg-[#0089FF] text-white shadow-2xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
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
                  ? "bg-[#0089FF] text-white shadow-2xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
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
  // Use 2026-09-30 as relative anchor date matching system mock data
  const base = new Date(2026, 8, 30); // 30 September 2026

  if (preset === "Today") {
    const str = formatDateToISO(base);
    return { from: str, to: str };
  }
  if (preset === "Yesterday") {
    const y = new Date(base);
    y.setDate(y.getDate() - 1);
    const str = formatDateToISO(y);
    return { from: str, to: str };
  }
  if (preset === "This Week") {
    const start = new Date(base);
    start.setDate(start.getDate() - 6);
    return { from: formatDateToISO(start), to: formatDateToISO(base) };
  }
  if (preset === "Last Week") {
    const start = new Date(base);
    start.setDate(start.getDate() - 13);
    const end = new Date(base);
    end.setDate(end.getDate() - 7);
    return { from: formatDateToISO(start), to: formatDateToISO(end) };
  }
  if (preset === "Last 7 Days") {
    const start = new Date(base);
    start.setDate(base.getDate() - 6);
    return { from: formatDateToISO(start), to: formatDateToISO(base) };
  }
  if (preset === "This Month") {
    const start = new Date(base.getFullYear(), base.getMonth(), 1);
    return { from: formatDateToISO(start), to: formatDateToISO(base) };
  }
  if (preset === "Last Month") {
    const start = new Date(base.getFullYear(), base.getMonth() - 1, 1);
    const end = new Date(base.getFullYear(), base.getMonth(), 0);
    return { from: formatDateToISO(start), to: formatDateToISO(end) };
  }
  return { from: "2026-08-30", to: "2026-09-02" };
}

export interface CustomDateRangeResult {
  from: string;
  to: string;
  fromTime: string;
  toTime: string;
  formattedRange: string;
  timeframe: string;
}

interface CustomDateRangeModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (result: CustomDateRangeResult) => void;
  initialPreset?: string;
}

export function CustomDateRangeModal({
  open,
  onClose,
  onApply,
  initialPreset = "Custom Range",
}: CustomDateRangeModalProps) {
  // Preset selector
  const [draftPreset, setDraftPreset] = useState(initialPreset);
  const [presetMenuOpen, setPresetMenuOpen] = useState(false);

  // Date range draft
  const [draftFrom, setDraftFrom] = useState("2026-08-30");
  const [draftTo, setDraftTo] = useState("2026-09-02");
  const [selectionStep, setSelectionStep] = useState<"start" | "end">("start");
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  // Time draft
  const [fromHour, setFromHour] = useState("12");
  const [fromMinute, setFromMinute] = useState("00");
  const [fromAmPm, setFromAmPm] = useState<"AM" | "PM">("AM");

  const [toHour, setToHour] = useState("11");
  const [toMinute, setToMinute] = useState("59");
  const [toAmPm, setToAmPm] = useState<"AM" | "PM">("PM");

  // View months for left & right calendar
  const [leftMonthDate, setLeftMonthDate] = useState(new Date(2026, 7, 1)); // August 2026
  const [rightMonthDate, setRightMonthDate] = useState(new Date(2026, 8, 1)); // September 2026

  useEffect(() => {
    if (open) {
      setDraftPreset(initialPreset || "Custom Range");
      setPresetMenuOpen(false);
      setSelectionStep("start");
      setHoverDate(null);
    }
  }, [open, initialPreset]);

  // Handle Preset selection
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

    const fDate = parseISOToDate(range.from);
    setLeftMonthDate(new Date(fDate.getFullYear(), fDate.getMonth() - 1, 1));
    setRightMonthDate(new Date(fDate.getFullYear(), fDate.getMonth(), 1));
  };

  // Handle calendar day click
  const handleDayClick = (isoDate: string) => {
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

  // Clear / Reset
  const handleClear = () => {
    setDraftPreset("Custom Range");
    setDraftFrom("2026-08-30");
    setDraftTo("2026-09-02");
    setFromHour("12");
    setFromMinute("00");
    setFromAmPm("AM");
    setToHour("11");
    setToMinute("59");
    setToAmPm("PM");
    setSelectionStep("start");
    setHoverDate(null);
    setLeftMonthDate(new Date(2026, 7, 1));
    setRightMonthDate(new Date(2026, 8, 1));
  };

  // Apply
  const handleApply = () => {
    const fDateDisplay = formatDateToDisplayDDMM(draftFrom);
    const tDateDisplay = formatDateToDisplayDDMM(draftTo);
    const fTimeDisplay = `${fromHour}:${fromMinute} ${fromAmPm}`;
    const tTimeDisplay = `${toHour}:${toMinute} ${toAmPm}`;

    const formattedRange = `${fDateDisplay} ${fTimeDisplay} To ${tDateDisplay} ${tTimeDisplay}`;

    onApply({
      from: draftFrom,
      to: draftTo,
      fromTime: fTimeDisplay,
      toTime: tTimeDisplay,
      formattedRange,
      timeframe: draftPreset,
    });
    onClose();
  };

  // Render a Single Month Calendar
  const renderMonth = (
    currentMonthDate: Date,
    onPrevMonth: () => void,
    onNextMonth: () => void,
    isLeftMonth: boolean
  ) => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();

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

    // Next month leading days (fill to 35 or 42 slots)
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
      <div className="flex-1 min-w-[240px]">
        {/* Month Header with < > */}
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <span className="font-bold text-xs text-slate-800 dark:text-slate-100">
            {monthLabel}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onPrevMonth}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              title="Previous month"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onNextMonth}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              title="Next month"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Weekday Labels (SU MO TU WE TH FR SA) */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400 dark:text-slate-500 mb-1">
          {WEEKDAY_NAMES.map((w) => (
            <div key={w} className="h-5 flex items-center justify-center">
              {w}
            </div>
          ))}
        </div>

        {/* Day Numbers Grid */}
        <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
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
              <div
                key={idx}
                className={cn(
                  "h-7 flex items-center justify-center relative",
                  inRange && isCurrentMonth && "bg-[#0089FF]/15",
                  isStart && inRange && isCurrentMonth && "rounded-l-md bg-[#0089FF]/15",
                  isEnd && inRange && isCurrentMonth && "rounded-r-md bg-[#0089FF]/15"
                )}
              >
                <button
                  type="button"
                  onClick={() => handleDayClick(dateStr)}
                  onMouseEnter={() => {
                    if (selectionStep === "end") setHoverDate(dateStr);
                  }}
                  className={cn(
                    "h-7 w-7 flex items-center justify-center text-xs rounded-md transition-all cursor-pointer font-medium relative z-10",
                    !isCurrentMonth && "text-slate-300 dark:text-slate-600 pointer-events-none",
                    isCurrentMonth && !isSelected && !inRange && "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
                    inRange && isCurrentMonth && !isSelected && "text-[#0089FF] font-semibold",
                    isSelected && "bg-[#0089FF] text-white font-bold shadow-2xs"
                  )}
                >
                  {dayNum}
                </button>
              </div>
            );
          })}
        </div>

        {/* Time Selector below Month */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
          <span className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {isLeftMonth ? "From Time" : "To Time"}
          </span>
          {isLeftMonth ? (
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

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="p-0 gap-0 max-w-[560px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden [&>button:last-child]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-[#0089FF]" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Date Range
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Preset Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setPresetMenuOpen((prev) => !prev)}
              className={cn(
                "flex h-9 w-full items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-[#0089FF]/50",
                presetMenuOpen && "border-[#0089FF] ring-2 ring-[#0089FF]/20"
              )}
            >
              <span>{draftPreset}</span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-slate-400 transition-transform duration-200",
                  presetMenuOpen && "rotate-180"
                )}
              />
            </button>

            {/* Dropdown Menu Options */}
            {presetMenuOpen && (
              <div className="absolute left-0 top-full mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl p-1 z-50 space-y-0.5 animate-in fade-in zoom-in-95">
                {PRESET_OPTIONS.map((opt) => {
                  const isSelected = draftPreset === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handlePresetSelect(opt)}
                      className={cn(
                        "flex w-full items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer text-left",
                        isSelected
                          ? "bg-[#0089FF]/10 text-[#0089FF] font-semibold"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
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

          {/* Dual Month Calendar */}
          <div className="grid grid-cols-2 gap-5 pt-1">
            {renderMonth(
              leftMonthDate,
              () =>
                setLeftMonthDate(
                  new Date(
                    leftMonthDate.getFullYear(),
                    leftMonthDate.getMonth() - 1,
                    1
                  )
                ),
              () =>
                setLeftMonthDate(
                  new Date(
                    leftMonthDate.getFullYear(),
                    leftMonthDate.getMonth() + 1,
                    1
                  )
                ),
              true
            )}

            {renderMonth(
              rightMonthDate,
              () =>
                setRightMonthDate(
                  new Date(
                    rightMonthDate.getFullYear(),
                    rightMonthDate.getMonth() - 1,
                    1
                  )
                ),
              () =>
                setRightMonthDate(
                  new Date(
                    rightMonthDate.getFullYear(),
                    rightMonthDate.getMonth() + 1,
                    1
                  )
                ),
              false
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium cursor-pointer transition-colors"
          >
            Clear
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-200 cursor-pointer transition-all active:scale-98 shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-1.5 text-xs rounded-lg bg-[#0089FF] text-white font-semibold hover:bg-[#0070d6] shadow-xs cursor-pointer transition-all active:scale-98"
            >
              Apply
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
