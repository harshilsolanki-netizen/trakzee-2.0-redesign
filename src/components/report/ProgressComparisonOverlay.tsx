import { Check, ChevronDown, BarChart2 } from "lucide-react";
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
            "group/btn inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold tracking-wide uppercase transition-all select-none cursor-pointer outline-none",
            "bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 shadow-2xs active:scale-98",
            open && "bg-white/25 border-blue-400 ring-2 ring-blue-400/30",
            triggerClassName,
          )}
          title="Click to change comparison metrics"
        >
          <span className="truncate max-w-[150px]">{config.header}</span>
          <ChevronDown
            className={cn(
              "h-3 w-3 text-white/70 transition-transform duration-200 shrink-0",
              open && "rotate-180 text-white",
            )}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="center"
        side="bottom"
        sideOffset={8}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-[280px] sm:w-[310px] p-4 rounded-xl border border-border/80 bg-popover text-popover-foreground shadow-2xl z-[120] select-none animate-in fade-in-0 zoom-in-95",
          className,
        )}
      >
        {/* Top Pointer Triangle Arrow matching reference */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 border-t border-l border-border/80 bg-popover z-10" />

        <div className="relative z-20 space-y-3">
          {/* Header Title */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <BarChart2 className="h-3.5 w-3.5 text-blue-500" />
            <span>Compare Metrics</span>
          </div>

          {/* Metric 1 Selection (Left Bar - Emerald) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block shadow-2xs" />
                <span>First Metric (Left)</span>
              </span>
            </div>

            <Popover open={xAxisOpen} onOpenChange={setXAxisOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex h-8.5 w-full items-center justify-between rounded-lg border border-input/80 bg-background px-3 text-xs font-semibold text-foreground transition-all cursor-pointer shadow-2xs hover:border-blue-500/60 hover:bg-muted/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                    xAxisOpen && "border-blue-500 ring-2 ring-blue-500/20 bg-muted/30",
                  )}
                >
                  <span className="truncate">{xAxis}</span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ml-1",
                      xAxisOpen && "rotate-180",
                    )}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                side="bottom"
                sideOffset={4}
                className="w-[240px] p-1 rounded-lg border border-border bg-popover shadow-xl z-[130] max-h-48 overflow-y-auto"
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
                        "flex w-full items-center justify-between px-2.5 py-1.5 text-xs rounded-md cursor-pointer transition-colors text-left",
                        isSelected
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                          : "text-foreground hover:bg-muted/80 font-medium",
                      )}
                    >
                      <span>{opt}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                    </button>
                  );
                })}
              </PopoverContent>
            </Popover>
          </div>

          {/* Metric 2 Selection (Right Bar - Amber) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500 inline-block shadow-2xs" />
                <span>Second Metric (Right)</span>
              </span>
            </div>

            <Popover open={yAxisOpen} onOpenChange={setYAxisOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex h-8.5 w-full items-center justify-between rounded-lg border border-input/80 bg-background px-3 text-xs font-semibold text-foreground transition-all cursor-pointer shadow-2xs hover:border-blue-500/60 hover:bg-muted/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                    yAxisOpen && "border-blue-500 ring-2 ring-blue-500/20 bg-muted/30",
                    isDuplicate && "border-rose-500/70 text-rose-600 focus:border-rose-500",
                  )}
                >
                  <span className="truncate">{yAxis}</span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ml-1",
                      yAxisOpen && "rotate-180",
                    )}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                side="bottom"
                sideOffset={4}
                className="w-[240px] p-1 rounded-lg border border-border bg-popover shadow-xl z-[130] max-h-48 overflow-y-auto"
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
                        "flex w-full items-center justify-between px-2.5 py-1.5 text-xs rounded-md cursor-pointer transition-colors text-left",
                        isSelected
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold"
                          : "text-foreground hover:bg-muted/80 font-medium",
                      )}
                    >
                      <span>{opt}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-amber-600" />}
                    </button>
                  );
                })}
              </PopoverContent>
            </Popover>
          </div>

          {/* Duplicate validation error matching reference image */}
          {isDuplicate && (
            <p className="text-[11px] font-medium text-rose-500 pt-0.5 animate-in fade-in">
              A different second value is required.
            </p>
          )}

          {/* Actions Footer */}
          <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-border/60">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-7 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={isDuplicate}
              className={cn(
                "h-7 px-3 text-xs font-semibold rounded-md text-white shadow-xs transition-all cursor-pointer active:scale-98",
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
