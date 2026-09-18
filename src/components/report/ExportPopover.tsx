import { Download, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  ExportFormat,
  ExportScope,
} from "@/components/report/ReportConfigPanel";
import { cn } from "@/lib/utils";

interface ExportPopoverProps {
  onSelect: (
    format: ExportFormat,
    scope: ExportScope,
    excelMode?: "single" | "multiple",
  ) => void;
  variant?: "icon" | "button";
  label?: string;
  className?: string;
}

export function ExportPopover({
  onSelect,
  variant = "icon",
  label = "Download",
  className,
}: ExportPopoverProps) {
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<ExportScope>("summary");

  const handleExport = (format: ExportFormat) => {
    setOpen(false);
    onSelect(format, scope);
  };

  if (variant === "button") {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Download options"
            className={cn(
              "inline-flex h-7.5 items-center gap-1.5 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white transition-all cursor-pointer active:scale-98",
              open && "bg-slate-100 dark:bg-slate-800 text-black dark:text-white ring-2 ring-[#0089FF]/20",
              className,
            )}
          >
            <Download className="h-3.5 w-3.5 stroke-[2.2]" />
            <span>{label}</span>
            <ChevronDown className={cn("h-3 w-3 opacity-60 ml-0.5 transition-transform", open && "rotate-180")} />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          sideOffset={6}
          className="w-[280px] rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md p-3.5 text-foreground shadow-lg animate-in fade-in-0 zoom-in-95 select-none space-y-3 z-50"
        >
          {/* Header Title */}
          <div className="text-xs font-semibold text-foreground">
            Download Options
          </div>

          {/* Scope Radio Options */}
          <div className="flex items-center gap-4 text-xs font-medium text-foreground py-0.5">
            <label
              onClick={() => setScope("summary")}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <input
                type="radio"
                name="download-scope-btn"
                checked={scope === "summary"}
                onChange={() => setScope("summary")}
                className="h-3.5 w-3.5 accent-[#0089FF] cursor-pointer"
              />
              <span
                className={cn(
                  scope === "summary" && "font-semibold text-foreground",
                )}
              >
                Summary only
              </span>
            </label>

            <label
              onClick={() => setScope("detail")}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <input
                type="radio"
                name="download-scope-btn"
                checked={scope === "detail"}
                onChange={() => setScope("detail")}
                className="h-3.5 w-3.5 accent-[#0089FF] cursor-pointer"
              />
              <span
                className={cn(
                  scope === "detail" && "font-semibold text-foreground",
                )}
              >
                Summary+details
              </span>
            </label>
          </div>

          {/* Format Buttons Row */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleExport("XLS")}
              className="flex items-center justify-center gap-1.5 h-8 rounded-md border border-border/80 bg-background hover:bg-muted font-semibold text-xs text-foreground cursor-pointer transition-all shadow-2xs active:scale-98"
            >
              <Download className="h-3.5 w-3.5 text-muted-foreground" />
              <span>XLS</span>
            </button>

            <button
              type="button"
              onClick={() => handleExport("PDF")}
              className="flex items-center justify-center gap-1.5 h-8 rounded-md border border-border/80 bg-background hover:bg-muted font-semibold text-xs text-foreground cursor-pointer transition-all shadow-2xs active:scale-98"
            >
              <Download className="h-3.5 w-3.5 text-muted-foreground" />
              <span>PDF</span>
            </button>

            <button
              type="button"
              onClick={() => handleExport("CSV")}
              className="flex items-center justify-center gap-1.5 h-8 rounded-md border border-border/80 bg-background hover:bg-muted font-semibold text-xs text-foreground cursor-pointer transition-all shadow-2xs active:scale-98"
            >
              <Download className="h-3.5 w-3.5 text-muted-foreground" />
              <span>CSV</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Download options"
              className={cn(
                "toolbar-icon-btn inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-95 group",
                open && "bg-slate-100 dark:bg-slate-800 text-black dark:text-white",
                className,
              )}
            >
              <Download className="h-[18px] w-[18px] text-slate-800 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white stroke-[2.2] transition-colors" />
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Download options</TooltipContent>
      </Tooltip>

      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-[280px] rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md p-3.5 text-foreground shadow-lg animate-in fade-in-0 zoom-in-95 select-none space-y-3 z-50"
      >
        {/* Header Title */}
        <div className="text-xs font-semibold text-foreground">
          Download Options
        </div>

        {/* Scope Radio Options */}
        <div className="flex items-center gap-4 text-xs font-medium text-foreground py-0.5">
          <label
            onClick={() => setScope("summary")}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <input
              type="radio"
              name="download-scope"
              checked={scope === "summary"}
              onChange={() => setScope("summary")}
              className="h-3.5 w-3.5 accent-[#0089FF] cursor-pointer"
            />
            <span
              className={cn(
                scope === "summary" && "font-semibold text-foreground",
              )}
            >
              Summary only
            </span>
          </label>

          <label
            onClick={() => setScope("detail")}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <input
              type="radio"
              name="download-scope"
              checked={scope === "detail"}
              onChange={() => setScope("detail")}
              className="h-3.5 w-3.5 accent-[#0089FF] cursor-pointer"
            />
            <span
              className={cn(
                scope === "detail" && "font-semibold text-foreground",
              )}
            >
              Summary+details
            </span>
          </label>
        </div>

        {/* Format Buttons Row */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleExport("XLS")}
            className="flex items-center justify-center gap-1.5 h-8 rounded-md border border-border/80 bg-background hover:bg-muted font-semibold text-xs text-foreground cursor-pointer transition-all shadow-2xs active:scale-98"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            <span>XLS</span>
          </button>

          <button
            type="button"
            onClick={() => handleExport("PDF")}
            className="flex items-center justify-center gap-1.5 h-8 rounded-md border border-border/80 bg-background hover:bg-muted font-semibold text-xs text-foreground cursor-pointer transition-all shadow-2xs active:scale-98"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            <span>PDF</span>
          </button>

          <button
            type="button"
            onClick={() => handleExport("CSV")}
            className="flex items-center justify-center gap-1.5 h-8 rounded-md border border-border/80 bg-background hover:bg-muted font-semibold text-xs text-foreground cursor-pointer transition-all shadow-2xs active:scale-98"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            <span>CSV</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
