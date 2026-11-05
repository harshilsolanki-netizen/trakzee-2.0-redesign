import React, { useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
  Check,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const PRESET_OPTIONS = [
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

export function formatDateToISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateToDisplayDDMM(isoStr: string): string {
  if (!isoStr) return "";
  const parts = isoStr.split("-");
  if (parts.length !== 3) return isoStr;
  const [y, m, d] = parts;
  return `${d}/${m}/${y}`;
}

export function parseISOToDate(isoStr: string): Date {
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

export function formatTimeTo12Hour(timeStr?: string): string {
  if (!timeStr) return "12:00 AM";
  const [hStr, mStr] = timeStr.split(":");
  let h = parseInt(hStr || "0", 10);
  const m = mStr || "00";
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${String(h).padStart(2, "0")}:${m} ${ampm}`;
}

export function parseTimeToParts(timeStr?: string): {
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

export function composeTimeTo24Hour(
  hourStr: string,
  minuteStr: string,
  ampm: "AM" | "PM"
): string {
  let h = parseInt(hourStr || "12", 10);
  if (ampm === "PM" && h < 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${minuteStr.padStart(2, "0")}`;
}

export function getDateRangeFromPreset(preset: string): { from: string; to: string } {
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

export function ModernTimeSelector({
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
            "flex h-8.5 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground transition-all cursor-pointer shadow-2xs hover:bg-muted/40 hover:border-[#0089FF]/50",
            isOpen && "border-[#0089FF] ring-2 ring-[#0089FF]/20",
            className
          )}
        >
          <span>{displayTime}</span>
          <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-64 p-2.5 text-xs bg-popover/98 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-60 select-none animate-in fade-in zoom-in-95"
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
                    : "text-foreground hover:bg-muted"
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
                    : "text-foreground hover:bg-muted"
                )}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex flex-col space-y-1 pl-0.5">
            <span className="text-[10px] text-muted-foreground font-semibold px-1 mb-1">
              AM/PM
            </span>
            {(["AM", "PM"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onAmPmChange(p)}
                className={cn(
                  "py-2 text-xs rounded-md font-bold transition-all cursor-pointer",
                  ampm === p
                    ? "bg-[#0089FF] text-white shadow-xs"
                    : "bg-muted/50 text-foreground hover:bg-muted"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export interface CloudDateTimeRangeValue {
  preset: string;
  from: string; // ISO yyyy-mm-dd
  to: string; // ISO yyyy-mm-dd
  fromTime: string; // HH:mm
  toTime: string; // HH:mm
}

interface CloudDateTimeRangePickerProps {
  value: CloudDateTimeRangeValue;
  onChange: (val: CloudDateTimeRangeValue) => void;
  className?: string;
  triggerClassName?: string;
  align?: "start" | "end" | "center";
}

export function CloudDateTimeRangePicker({
  value,
  onChange,
  className,
  triggerClassName,
  align = "start",
}: CloudDateTimeRangePickerProps) {
  const [dateOpen, setDateOpen] = useState(false);
  const [presetMenuOpen, setPresetMenuOpen] = useState(false);

  // Draft state inside popover
  const [draftPreset, setDraftPreset] = useState(value.preset || "Today");
  const [draftFrom, setDraftFrom] = useState(value.from || "2026-11-04");
  const [draftTo, setDraftTo] = useState(value.to || "2026-11-04");
  const [selectionStep, setSelectionStep] = useState<"start" | "end">("start");
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  // Time Stepper Parts
  const initialFromParts = parseTimeToParts(value.fromTime || "00:00");
  const initialToParts = parseTimeToParts(value.toTime || "23:59");
  const [fromHour, setFromHour] = useState(initialFromParts.hour);
  const [fromMinute, setFromMinute] = useState(initialFromParts.minute);
  const [fromAmPm, setFromAmPm] = useState<"AM" | "PM">(initialFromParts.ampm);

  const [toHour, setToHour] = useState(initialToParts.hour);
  const [toMinute, setToMinute] = useState(initialToParts.minute);
  const [toAmPm, setToAmPm] = useState<"AM" | "PM">(initialToParts.ampm);

  // View Date for Dual Calendar
  const [viewDate, setViewDate] = useState(() => {
    const d = parseISOToDate(value.from || "2026-11-04");
    return new Date(d.getFullYear(), d.getMonth() - 1, 1);
  });

  // Sync draft state on popover open
  const handleOpenChange = (open: boolean) => {
    setDateOpen(open);
    if (open) {
      setDraftPreset(value.preset || "Today");
      setDraftFrom(value.from || "2026-11-04");
      setDraftTo(value.to || "2026-11-04");
      setPresetMenuOpen(false);
      setSelectionStep("start");

      const fp = parseTimeToParts(value.fromTime || "00:00");
      const tp = parseTimeToParts(value.toTime || "23:59");
      setFromHour(fp.hour);
      setFromMinute(fp.minute);
      setFromAmPm(fp.ampm);
      setToHour(tp.hour);
      setToMinute(tp.minute);
      setToAmPm(tp.ampm);

      const d = parseISOToDate(value.from || "2026-11-04");
      setViewDate(new Date(d.getFullYear(), d.getMonth() - 1, 1));
    }
  };

  // Dual Month Navigation
  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

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
    setViewDate(new Date(today.getFullYear(), today.getMonth() - 1, 1));
  };

  const handleApplyDateTime = () => {
    const fTime = composeTimeTo24Hour(fromHour, fromMinute, fromAmPm);
    const tTime = composeTimeTo24Hour(toHour, toMinute, toAmPm);
    onChange({
      preset: draftPreset,
      from: draftFrom,
      to: draftTo,
      fromTime: fTime,
      toTime: tTime,
    });
    setDateOpen(false);
  };

  // Formatted trigger label
  const displayLabel = useMemo(() => {
    const fDate = formatDateToDisplayDDMM(value.from || "2026-11-04");
    const tDate = formatDateToDisplayDDMM(value.to || "2026-11-04");
    const fTime = value.fromTime ? formatTimeTo12Hour(value.fromTime) : "12:00 AM";
    const tTime = value.toTime ? formatTimeTo12Hour(value.toTime) : "11:59 PM";
    return `${fDate} ${fTime} - ${tDate} ${tTime}`;
  }, [value.from, value.to, value.fromTime, value.toTime]);

  const renderDualMonth = (year: number, month: number, isFromMonth: boolean) => {
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
          <span className="font-bold text-xs text-foreground">{monthLabel}</span>
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
              draftFrom && effectiveEnd && dateStr > draftFrom && dateStr < effectiveEnd;
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
                  !isCurrentMonth && "text-muted-foreground/30 pointer-events-none",
                  isCurrentMonth && !isSelected && !inRange && "text-foreground hover:bg-muted",
                  inRange &&
                    "bg-[#0089FF]/15 text-[#0089FF] font-semibold rounded-none first:rounded-l-md last:rounded-r-md",
                  isSelected && "bg-[#0089FF] text-white font-bold shadow-xs z-10"
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

  return (
    <div className={cn("inline-flex items-center shrink-0", className)}>
      <Popover open={dateOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex h-7.5 items-center gap-1.5 rounded-md px-2.5 text-xs transition-colors cursor-pointer select-none hover:bg-muted/70 shrink-0",
              dateOpen && "bg-muted",
              triggerClassName
            )}
          >
            <CalendarIcon className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-900 dark:text-white truncate">
              {displayLabel}
            </span>
            <ChevronDown
              className={cn(
                "h-3 w-3 text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-200",
                dateOpen && "rotate-180"
              )}
            />
          </button>
        </PopoverTrigger>

        {/* Exactly matches Report Screen Popover in reference media_1793783456954_640383bf.png */}
        <PopoverContent
          align={align}
          sideOffset={4}
          className={cn(
            "p-0 text-xs bg-popover/98 backdrop-blur-md border border-border/80 shadow-xl rounded-lg z-60 select-none overflow-visible transition-all duration-200 space-y-0",
            draftPreset === "Custom Range" ? "w-[580px]" : "w-[360px]"
          )}
        >
          {/* Popover Form Body */}
          <div className="p-4 space-y-3">
            {/* 1. Header: Date Range with X button */}
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

              {/* 2. Preset Select Trigger */}
              <button
                type="button"
                onClick={() => setPresetMenuOpen((prev) => !prev)}
                className={cn(
                  "flex h-8.5 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground transition-all cursor-pointer shadow-2xs hover:bg-muted/40 hover:border-[#0089FF]/50",
                  presetMenuOpen && "border-[#0089FF] ring-2 ring-[#0089FF]/20"
                )}
              >
                <span>{draftPreset}</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                    presetMenuOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Preset Menu Card */}
              {presetMenuOpen && (
                <div className="absolute left-0 top-full mt-1 w-full rounded-lg border border-border/80 bg-popover/98 backdrop-blur-md shadow-lg p-1 z-70 animate-in fade-in zoom-in-95 space-y-0.5">
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
                            : "text-foreground hover:bg-muted font-medium"
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

            {/* 3. Time Range / Dual Month Body */}
            {draftPreset === "Custom Range" ? (
              <div className="pt-2 flex gap-4">
                {renderDualMonth(viewDate.getFullYear(), viewDate.getMonth(), true)}
                <div className="w-px bg-border/60 my-1" />
                {renderDualMonth(
                  new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1).getFullYear(),
                  new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1).getMonth(),
                  false
                )}
              </div>
            ) : (
              /* Standard Preset: Time Range Selectors with clock icons */
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

          {/* 4. Footer Actions matching reference: Clear on left, Cancel & Apply on right */}
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
    </div>
  );
}
