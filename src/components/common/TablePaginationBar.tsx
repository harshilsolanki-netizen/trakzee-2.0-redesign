import React, { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ExportPopover } from "@/components/report/ExportPopover";
import type {
  ExportFormat,
  ExportScope,
} from "@/components/report/ReportConfigPanel";
import { cn } from "@/lib/utils";

export interface TablePaginationBarProps {
  page: number;
  pageSize: number;
  totalRows: number;
  pageSizeOptions?: number[];
  itemLabel?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onReset?: () => void;
  onExport?: (
    format: ExportFormat,
    scope: ExportScope,
    excelMode?: "single" | "multiple",
  ) => void;
  showReset?: boolean;
  showExport?: boolean;
  resetLabel?: string;
  downloadLabel?: string;
  className?: string;
  disabled?: boolean;
}

export function TablePaginationBar({
  page,
  pageSize,
  totalRows,
  pageSizeOptions = [10, 20, 25, 50, 100],
  itemLabel = "records",
  onPageChange,
  onPageSizeChange,
  onReset,
  onExport,
  showReset = true,
  showExport = true,
  resetLabel = "Reset",
  downloadLabel = "Download",
  className,
  disabled = false,
}: TablePaginationBarProps) {
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

  // Compute pages to display (matches HubSpot ticket pagination)
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 11) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 5) {
      return [1, 2, 3, 4, 5, 6, "...", totalPages];
    }
    if (page >= totalPages - 4) {
      return [
        1,
        "...",
        totalPages - 5,
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [
      1,
      "...",
      page - 2,
      page - 1,
      page,
      page + 1,
      page + 2,
      "...",
      totalPages,
    ];
  };

  const pages = getPageNumbers();

  return (
    <footer
      className={cn(
        "flex h-11 items-center justify-between px-5 bg-white dark:bg-slate-900 shrink-0 select-none",
        className,
      )}
    >
      {/* 1. Left Section: Total count */}
      <div className="flex items-center min-w-[140px]">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 tabular-nums select-none">
          {totalRows.toLocaleString()} {itemLabel}
        </span>
      </div>

      {/* 2. Center Section: < Prev  1 2 3 ... Next >  25 per page ▾ */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Prev Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={disabled || page <= 1}
          className="inline-flex items-center gap-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors px-1.5 py-1 rounded"
        >
          <ChevronLeft className="h-3.5 w-3.5 stroke-[2.2]" />
          <span>Prev</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-1 text-xs text-slate-400 select-none"
                >
                  ...
                </span>
              );
            }
            const pageNum = Number(p);
            const isActive = pageNum === page;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                disabled={disabled}
                className={cn(
                  "h-6 min-w-[24px] px-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center justify-center",
                  isActive
                    ? "border border-slate-400 dark:border-slate-500 bg-transparent text-slate-900 dark:text-white font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",
                )}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={disabled || page >= totalPages}
          className="inline-flex items-center gap-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors px-1.5 py-1 rounded"
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5 stroke-[2.2]" />
        </button>

        {/* Page Size Selector - Clean transparent button without boxed background or border */}
        {onPageSizeChange && (
          <div className="ml-1 sm:ml-2">
            <Popover open={pageSizeOpen} onOpenChange={setPageSizeOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  disabled={disabled}
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white cursor-pointer select-none transition-colors px-1.5 py-1 rounded bg-transparent border-0 hover:bg-slate-100 dark:hover:bg-slate-800",
                    pageSizeOpen &&
                      "bg-slate-100 dark:bg-slate-800 text-black dark:text-white",
                  )}
                >
                  <span>{pageSize} per page</span>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 opacity-60 transition-transform",
                      pageSizeOpen && "rotate-180",
                    )}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="center"
                sideOffset={6}
                className="w-32 p-1 rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md shadow-lg select-none animate-in fade-in-0 zoom-in-95 z-50"
              >
                {pageSizeOptions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      onPageSizeChange(s);
                      setPageSizeOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-2.5 py-1.5 text-xs rounded-sm cursor-pointer transition-colors text-left select-none",
                      pageSize === s
                        ? "bg-muted font-semibold text-foreground"
                        : "text-foreground hover:bg-muted/80 hover:text-foreground font-medium",
                    )}
                  >
                    <span>{s} per page</span>
                    {pageSize === s && (
                      <Check className="h-3.5 w-3.5 text-[#0089FF]" />
                    )}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {/* 3. Right Section: Reset & Download Buttons */}
      <div className="flex items-center gap-2 min-w-[140px] justify-end">
        {showReset && onReset && (
          <button
            type="button"
            onClick={onReset}
            disabled={disabled}
            className="inline-flex h-7.5 items-center gap-1.5 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white transition-all cursor-pointer active:scale-98"
            title="Reset all filters and view"
          >
            <RotateCcw className="h-3.5 w-3.5 stroke-[2.2]" />
            <span>{resetLabel}</span>
          </button>
        )}

        {showExport && onExport && (
          <ExportPopover
            onSelect={onExport}
            variant="button"
            label={downloadLabel}
          />
        )}
      </div>
    </footer>
  );
}
