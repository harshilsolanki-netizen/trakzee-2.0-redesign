import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  CHART_AXIS_OPTIONS,
  type ChartConfig,
} from "./ChartConfigModal";

interface ProgressComparisonOverlayProps {
  config: ChartConfig;
  onSave: (config: ChartConfig) => void;
  className?: string;
  triggerClassName?: string;
}

export function ProgressComparisonOverlay({
  config,
  onSave,
  className,
  triggerClassName,
}: ProgressComparisonOverlayProps) {
  const [open, setOpen] = useState(false);
  const [xAxis, setXAxis] = useState(config.xAxis);
  const [yAxis, setYAxis] = useState(config.yAxis);
  const [xAxisOpen, setXAxisOpen] = useState(false);
  const [yAxisOpen, setYAxisOpen] = useState(false);

  // Sync state whenever popover opens or config prop changes
  useEffect(() => {
    if (open) {
      setXAxis(config.xAxis);
      setYAxis(config.yAxis);
      setXAxisOpen(false);
      setYAxisOpen(false);
    }
  }, [open, config]);

  const isDuplicate = xAxis.toLowerCase() === yAxis.toLowerCase();

  const handleApply = () => {
    if (isDuplicate) {
      toast.error("Please choose two different metrics to compare");
      return;
    }

    const newHeader = `${xAxis.toUpperCase()} V/S ${yAxis.toUpperCase()}`;
    onSave({
      header: newHeader,
      xAxis,
      yAxis,
    });
    toast.success(`Updated comparison: ${xAxis} vs ${yAxis}`);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={cn(
            "p-1 rounded text-slate-700 hover:text-slate-900 hover:bg-black/10 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/15 transition-colors cursor-pointer shrink-0 outline-none",
            open && "text-slate-900 bg-black/10 dark:text-white dark:bg-white/20 ring-1 ring-blue-500/50",
            triggerClassName,
          )}
          title="Configure comparison metrics"
          aria-label="Configure comparison metrics"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={8}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-[265px] sm:w-[275px] p-3 rounded-xl border border-border/80 bg-popover text-popover-foreground shadow-2xl z-[120] select-none animate-in fade-in-0 zoom-in-95",
          className,
        )}
      >
        {/* Top Pointer Triangle Arrow */}
        <div className="absolute -top-1.5 right-4 h-3 w-3 rotate-45 border-t border-l border-border/80 bg-popover z-10" />

        <div className="relative z-20 space-y-2.5">
          {/* Header Title without icon */}
          <div className="text-xs font-semibold text-foreground">
            Compare Metrics
          </div>

          {/* Horizontal Side-by-Side Metric Selectors with VS in between */}
          <div className="flex items-center gap-1.5 pt-0.5">
            {/* Metric 1 Dropdown */}
            <div className="flex-1 min-w-0">
              <Popover open={xAxisOpen} onOpenChange={setXAxisOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "flex h-7 w-full items-center justify-between rounded-md border border-input/80 bg-background px-2 text-xs font-medium text-muted-foreground transition-all cursor-pointer shadow-2xs hover:border-[#0089FF]/60 hover:bg-muted/30 focus:border-[#0089FF] focus:ring-1.5 focus:ring-[#0089FF]/20 focus:outline-none",
                      xAxisOpen && "border-[#0089FF] ring-1.5 ring-[#0089FF]/20 bg-muted/30",
                    )}
                  >
                    <span className="truncate">{xAxis}</span>
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 text-muted-foreground transition-transform duration-200 ml-1 opacity-70 shrink-0",
                        xAxisOpen && "rotate-180",
                      )}
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  side="bottom"
                  sideOffset={4}
                  className="w-[125px] p-1 rounded-md border border-border bg-popover shadow-xl z-[130] max-h-48 overflow-y-auto"
                >
                  {CHART_AXIS_OPTIONS.map((opt) => {
                    const isSelected = xAxis === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setXAxis(opt);
                          setXAxisOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between px-2 py-1 text-xs rounded-sm cursor-pointer transition-colors text-left",
                          isSelected
                            ? "bg-muted font-semibold text-foreground"
                            : "text-foreground hover:bg-muted/80 font-medium",
                        )}
                      >
                        <span className="truncate">{opt}</span>
                        {isSelected && <Check className="h-3 w-3 text-[#0089FF] shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </PopoverContent>
              </Popover>
            </div>

            {/* VS Separator */}
            <span className="text-[11px] font-bold text-muted-foreground uppercase select-none shrink-0 px-0.5">
              VS
            </span>

            {/* Metric 2 Dropdown */}
            <div className="flex-1 min-w-0">
              <Popover open={yAxisOpen} onOpenChange={setYAxisOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "flex h-7 w-full items-center justify-between rounded-md border border-input/80 bg-background px-2 text-xs font-medium text-muted-foreground transition-all cursor-pointer shadow-2xs hover:border-[#0089FF]/60 hover:bg-muted/30 focus:border-[#0089FF] focus:ring-1.5 focus:ring-[#0089FF]/20 focus:outline-none",
                      yAxisOpen && "border-[#0089FF] ring-1.5 ring-[#0089FF]/20 bg-muted/30",
                      isDuplicate && "border-rose-500/70 text-rose-600 focus:border-rose-500",
                    )}
                  >
                    <span className="truncate">{yAxis}</span>
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 text-muted-foreground transition-transform duration-200 ml-1 opacity-70 shrink-0",
                        yAxisOpen && "rotate-180",
                      )}
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  side="bottom"
                  sideOffset={4}
                  className="w-[125px] p-1 rounded-md border border-border bg-popover shadow-xl z-[130] max-h-48 overflow-y-auto"
                >
                  {CHART_AXIS_OPTIONS.map((opt) => {
                    const isSelected = yAxis === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setYAxis(opt);
                          setYAxisOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between px-2 py-1 text-xs rounded-sm cursor-pointer transition-colors text-left",
                          isSelected
                            ? "bg-muted font-semibold text-foreground"
                            : "text-foreground hover:bg-muted/80 font-medium",
                        )}
                      >
                        <span className="truncate">{opt}</span>
                        {isSelected && <Check className="h-3 w-3 text-[#0089FF] shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Duplicate validation error */}
          {isDuplicate && (
            <p className="text-[11px] font-medium text-rose-500 pt-0.5 animate-in fade-in">
              Please choose two different metrics.
            </p>
          )}

          {/* Actions Footer */}
          <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-border/60">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-6.5 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={isDuplicate}
              className={cn(
                "h-6.5 px-3 text-xs font-medium rounded-md text-white shadow-xs transition-all cursor-pointer active:scale-98",
                isDuplicate
                  ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  : "bg-[#155dfc] hover:bg-[#124ecf]",
              )}
            >
              Apply
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
