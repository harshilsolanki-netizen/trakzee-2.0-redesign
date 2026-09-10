import { Download, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  label?: string;
  className?: string;
}

export function ExportPopover({
  onSelect,
  label = "Download",
  className,
}: ExportPopoverProps) {
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<ExportScope>("summary");

  const handleExport = (format: ExportFormat) => {
    setOpen(false);
    onSelect(format, scope);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Download options"
          className={cn(
            "inline-flex h-7 items-center gap-1.5 rounded-md border border-border/80 bg-background px-2.5 text-xs font-semibold text-foreground transition-all hover:bg-muted cursor-pointer select-none shadow-2xs active:scale-98",
            open && "bg-muted border-[#0089FF]/50 ring-2 ring-[#0089FF]/20",
            className,
          )}
        >
          <Download className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{label}</span>
          <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-[280px] rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md p-3.5 text-foreground shadow-lg animate-in fade-in-0 zoom-in-95 select-none space-y-3"
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
