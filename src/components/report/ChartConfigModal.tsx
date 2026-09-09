import { Check, ChevronDown, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type ChartConfig = {
  header: string;
  xAxis: string;
  yAxis: string;
};

export const DEFAULT_CHART_CONFIG: ChartConfig = {
  header: "Running V/S Stop",
  xAxis: "Running",
  yAxis: "Stop",
};

export const CHART_AXIS_OPTIONS = [
  "Running",
  "Idle",
  "Stop",
  "Inactive",
  "Duration",
  "Distance",
  "Work Duration",
  "Max Speed",
];

interface ChartConfigModalProps {
  open: boolean;
  onClose: () => void;
  config: ChartConfig;
  onSave: (config: ChartConfig) => void;
}

export function ChartConfigModal({
  open,
  onClose,
  config,
  onSave,
}: ChartConfigModalProps) {
  const [header, setHeader] = useState(config.header);
  const [xAxis, setXAxis] = useState(config.xAxis);
  const [yAxis, setYAxis] = useState(config.yAxis);
  const [xAxisOpen, setXAxisOpen] = useState(false);
  const [yAxisOpen, setYAxisOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setHeader(config.header);
      setXAxis(config.xAxis);
      setYAxis(config.yAxis);
      setXAxisOpen(false);
      setYAxisOpen(false);
    }
  }, [open, config]);

  if (!open) return null;

  const handleXAxisChange = (newX: string) => {
    setXAxis(newX);
    setXAxisOpen(false);
    if (
      !header ||
      header === `${xAxis} V/S ${yAxis}` ||
      header === `${xAxis} V/S ${yAxis}`.trim()
    ) {
      setHeader(`${newX} V/S ${yAxis}`);
    }
  };

  const handleYAxisChange = (newY: string) => {
    setYAxis(newY);
    setYAxisOpen(false);
    if (
      !header ||
      header === `${xAxis} V/S ${yAxis}` ||
      header === `${xAxis} V/S ${yAxis}`.trim()
    ) {
      setHeader(`${xAxis} V/S ${newY}`);
    }
  };

  const handleSave = () => {
    if (!header.trim()) {
      toast.error("Please enter a header name");
      return;
    }
    onSave({
      header: header.trim(),
      xAxis,
      yAxis,
    });
    toast.success("Chart comparison configured successfully");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close Chart Settings"
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 overflow-hidden rounded-2xl border border-border/80 bg-background text-foreground shadow-2xl duration-150">
        {/* Modern Clean Header (45px) */}
        <header className="flex h-[45px] items-center justify-between border-b border-border/70 px-6 bg-card/60 select-none shrink-0">
          <h2 className="text-sm font-bold tracking-tight text-foreground">
            Chart Comparison
          </h2>
          <button
            type="button"
            aria-label="Close Chart"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Modal Form Fields */}
        <div className="p-6 space-y-4 text-xs">
          {/* Header Field */}
          <div className="grid grid-cols-3 items-center gap-3">
            <label
              htmlFor="chart-header"
              className="text-xs font-medium text-muted-foreground"
            >
              Header :
            </label>
            <div className="col-span-2">
              <input
                id="chart-header"
                type="text"
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                placeholder="e.g. Running V/S Stop"
                className="h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-bold text-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          {/* X-Axis Field */}
          <div className="grid grid-cols-3 items-center gap-3">
            <label
              htmlFor="chart-xaxis"
              className="text-xs font-medium text-muted-foreground"
            >
              X-Axis :
            </label>
            <div className="col-span-2 relative">
              <Popover open={xAxisOpen} onOpenChange={setXAxisOpen}>
                <PopoverTrigger asChild>
                  <button
                    id="chart-xaxis"
                    type="button"
                    className={cn(
                      "flex h-7.5 w-full items-center justify-between rounded-md border border-input/80 bg-background px-2.5 text-xs font-bold text-foreground transition-all cursor-pointer shadow-2xs select-none hover:border-[#0089FF]/60 hover:bg-muted/40 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none",
                      xAxisOpen &&
                        "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-muted/40",
                    )}
                  >
                    <span className="truncate text-foreground font-bold">
                      {xAxis}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 text-muted-foreground opacity-70 transition-transform duration-200 ml-1",
                        xAxisOpen && "rotate-180",
                      )}
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  side="bottom"
                  sideOffset={4}
                  className="w-[var(--radix-popover-trigger-width)] min-w-[220px] p-1 rounded-md border border-border bg-popover shadow-lg z-[100] select-none max-h-56 overflow-y-auto"
                >
                  {CHART_AXIS_OPTIONS.map((opt) => {
                    const isSelected = xAxis === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleXAxisChange(opt)}
                        className={cn(
                          "flex w-full items-center justify-between px-2.5 py-1.5 text-xs rounded-sm cursor-pointer transition-colors text-left select-none",
                          isSelected
                            ? "bg-[#0089FF]/10 text-[#0089FF] font-bold"
                            : "text-foreground hover:bg-muted/80 font-medium",
                        )}
                      >
                        <span>{opt}</span>
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-[#0089FF]" />
                        )}
                      </button>
                    );
                  })}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Y-Axis Field */}
          <div className="grid grid-cols-3 items-center gap-3">
            <label
              htmlFor="chart-yaxis"
              className="text-xs font-medium text-muted-foreground"
            >
              Y-Axis :
            </label>
            <div className="col-span-2 relative">
              <Popover open={yAxisOpen} onOpenChange={setYAxisOpen}>
                <PopoverTrigger asChild>
                  <button
                    id="chart-yaxis"
                    type="button"
                    className={cn(
                      "flex h-7.5 w-full items-center justify-between rounded-md border border-input/80 bg-background px-2.5 text-xs font-bold text-foreground transition-all cursor-pointer shadow-2xs select-none hover:border-[#0089FF]/60 hover:bg-muted/40 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none",
                      yAxisOpen &&
                        "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-muted/40",
                    )}
                  >
                    <span className="truncate text-foreground font-bold">
                      {yAxis}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 text-muted-foreground opacity-70 transition-transform duration-200 ml-1",
                        yAxisOpen && "rotate-180",
                      )}
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  side="bottom"
                  sideOffset={4}
                  className="w-[var(--radix-popover-trigger-width)] min-w-[220px] p-1 rounded-md border border-border bg-popover shadow-lg z-[100] select-none max-h-56 overflow-y-auto"
                >
                  {CHART_AXIS_OPTIONS.map((opt) => {
                    const isSelected = yAxis === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleYAxisChange(opt)}
                        className={cn(
                          "flex w-full items-center justify-between px-2.5 py-1.5 text-xs rounded-sm cursor-pointer transition-colors text-left select-none",
                          isSelected
                            ? "bg-[#0089FF]/10 text-[#0089FF] font-semibold"
                            : "text-foreground hover:bg-muted/80 font-normal",
                        )}
                      >
                        <span>{opt}</span>
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-[#0089FF]" />
                        )}
                      </button>
                    );
                  })}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <footer className="flex items-center justify-end gap-2.5 border-t border-border bg-background px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="h-8 min-w-[75px] rounded-md border border-input/80 bg-background px-3 text-xs font-medium text-foreground shadow-2xs transition-all hover:bg-muted cursor-pointer active:scale-98"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="h-8 min-w-[75px] rounded-md bg-[#155dfc] px-4 text-xs font-medium text-white shadow-xs transition-all hover:bg-[#124ecf] cursor-pointer active:scale-98"
          >
            Save
          </button>
        </footer>
      </div>
    </div>
  );
}
