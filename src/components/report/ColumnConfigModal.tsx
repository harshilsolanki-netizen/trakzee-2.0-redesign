import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  GripVertical,
  Pin,
  RotateCcw,
  Undo2,
  X,
} from "lucide-react";
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type ColumnConfigItem = {
  id: string;
  label: string;
  group?: string;
  isGroupHeader?: boolean;
  showable: boolean;
  printable: boolean;
  sortable: boolean;
  sortPriority: number | null; // 1, 2, 3... or null for "--"
  sortDir: "asc" | "desc";
  numeric?: boolean;
  pinned?: boolean;
  originalIndex?: number;
};

export type ReportColumnSettings = {
  columns: ColumnConfigItem[];
  detailColumns?: ColumnConfigItem[];
  frozenColumnsCount: number;
  detailFrozenColumnsCount?: number;
  detailDownloadMode?: "multiple" | "single";
  detailScreenSetting?: "summary" | "detail" | "preference";
  exportDataScope?: "summary" | "detail";
};

export const DEFAULT_REPORT_COLUMNS: ColumnConfigItem[] = [
  {
    id: "vehicleNo",
    label: "Vehicle No",
    showable: true,
    printable: true,
    sortable: true,
    sortPriority: 1,
    sortDir: "asc",
    pinned: true,
    originalIndex: 0,
  },
  {
    id: "employeeNo",
    label: "Employee No",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: true,
    originalIndex: 1,
  },
  {
    id: "imei",
    label: "IMEI No",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 2,
  },
  {
    id: "startLocation",
    label: "Start Location",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 3,
  },
  {
    id: "startOdometer",
    label: "Start Odometer",
    showable: true,
    printable: true,
    sortable: true,
    sortPriority: null,
    sortDir: "asc",
    numeric: true,
    pinned: false,
    originalIndex: 4,
  },
  {
    id: "firstIgnitionOn",
    label: "First Ignition ON",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 5,
  },
  {
    id: "distance",
    label: "Distance",
    showable: true,
    printable: true,
    sortable: true,
    sortPriority: null,
    sortDir: "desc",
    numeric: true,
    pinned: false,
    originalIndex: 6,
  },
  {
    id: "idleVsInactive",
    label: "Idle V/S Inactive",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 7,
  },
  {
    id: "running",
    label: "Running (HH:MM:SS)",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 8,
  },
  {
    id: "idle",
    label: "Idle (HH:MM:SS)",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 9,
  },
  {
    id: "stop",
    label: "Stop (HH:MM:SS)",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 10,
  },
  {
    id: "inactive",
    label: "Inactive (HH:MM:SS)",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 11,
  },
  {
    id: "duration",
    label: "Duration (HH:MM:SS)",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 12,
  },
  {
    id: "workDuration",
    label: "Work Duration",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 13,
  },
  {
    id: "workingDays",
    label: "Working Days",
    showable: true,
    printable: false,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 14,
  },
  {
    id: "maxStoppage",
    label: "Max Stoppage",
    showable: true,
    printable: false,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 15,
  },
  {
    id: "noOfIdle",
    label: "No of Idle",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    numeric: true,
    pinned: false,
    originalIndex: 16,
  },
  {
    id: "speed_group",
    label: "Speed",
    isGroupHeader: true,
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 17,
  },
  {
    id: "avgSpeed",
    label: "AVG",
    group: "Speed",
    showable: true,
    printable: true,
    sortable: true,
    sortPriority: null,
    sortDir: "desc",
    numeric: true,
    pinned: false,
    originalIndex: 18,
  },
  {
    id: "maxSpeed",
    label: "MAX",
    group: "Speed",
    showable: true,
    printable: true,
    sortable: true,
    sortPriority: null,
    sortDir: "desc",
    numeric: true,
    pinned: false,
    originalIndex: 19,
  },
  {
    id: "cost_group",
    label: "Cost based on",
    isGroupHeader: true,
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 20,
  },
  {
    id: "costDistance",
    label: "Distance",
    group: "Cost based on",
    showable: true,
    printable: true,
    sortable: true,
    sortPriority: null,
    sortDir: "desc",
    numeric: true,
    pinned: false,
    originalIndex: 21,
  },
  {
    id: "costDuration",
    label: "Duration",
    group: "Cost based on",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "desc",
    numeric: true,
    pinned: false,
    originalIndex: 22,
  },
  {
    id: "overSpeed",
    label: "Over speed",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 23,
  },
  {
    id: "alerts",
    label: "Alert(s)",
    showable: true,
    printable: false,
    sortable: true,
    sortPriority: null,
    sortDir: "desc",
    numeric: true,
    pinned: false,
    originalIndex: 24,
  },
  {
    id: "endOdometer",
    label: "End Odometer",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    numeric: true,
    pinned: false,
    originalIndex: 25,
  },
  {
    id: "lastIgnitionOff",
    label: "Last Ignition OFF",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 26,
  },
  {
    id: "endLocation",
    label: "End Location",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 27,
  },
  {
    id: "playback",
    label: "Playback",
    showable: true,
    printable: false,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 28,
  },
  {
    id: "distanceUnit",
    label: "Distance Unit",
    showable: false,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 29,
  },
  {
    id: "company",
    label: "Company / Logo",
    showable: false,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 30,
  },
];

export const DEFAULT_DETAIL_COLUMNS: ColumnConfigItem[] = [
  {
    id: "tripNo",
    label: "Trip / Serial No",
    showable: true,
    printable: true,
    sortable: true,
    sortPriority: 1,
    sortDir: "asc",
    pinned: true,
    originalIndex: 0,
  },
  {
    id: "date",
    label: "Date",
    showable: true,
    printable: true,
    sortable: true,
    sortPriority: null,
    sortDir: "desc",
    pinned: false,
    originalIndex: 1,
  },
  {
    id: "firstIgnitionOn",
    label: "First Ignition ON",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 2,
  },
  {
    id: "startLocation",
    label: "Start Location",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 3,
  },
  {
    id: "distance",
    label: "Distance (km)",
    showable: true,
    printable: true,
    sortable: true,
    sortPriority: null,
    sortDir: "desc",
    numeric: true,
    pinned: false,
    originalIndex: 4,
  },
  {
    id: "running",
    label: "Running Time",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 5,
  },
  {
    id: "idle",
    label: "Idle Time",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 6,
  },
  {
    id: "stop",
    label: "Stop Time",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 7,
  },
  {
    id: "alerts",
    label: "Alerts & Violations",
    showable: true,
    printable: true,
    sortable: true,
    sortPriority: null,
    sortDir: "desc",
    numeric: true,
    pinned: false,
    originalIndex: 8,
  },
  {
    id: "lastIgnitionOn",
    label: "Last Ignition OFF",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 9,
  },
  {
    id: "endLocation",
    label: "End Location",
    showable: true,
    printable: true,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 10,
  },
  {
    id: "playback",
    label: "Playback Route",
    showable: true,
    printable: false,
    sortable: false,
    sortPriority: null,
    sortDir: "asc",
    pinned: false,
    originalIndex: 11,
  },
];

export const DEFAULT_COLUMN_SETTINGS: ReportColumnSettings = {
  columns: DEFAULT_REPORT_COLUMNS,
  detailColumns: DEFAULT_DETAIL_COLUMNS,
  frozenColumnsCount: 2,
  detailFrozenColumnsCount: 1,
  detailDownloadMode: "multiple",
  detailScreenSetting: "summary",
  exportDataScope: "summary",
};

/**
 * Normalizes columns to ensure `pinned` and `originalIndex` exist.
 * Keeps pinned columns at the top in order.
 */
function normalizeColumnList(
  cols: ColumnConfigItem[],
  frozenCount = 2,
): ColumnConfigItem[] {
  const initialized = cols.map((c, idx) => ({
    ...c,
    pinned:
      c.pinned !== undefined
        ? c.pinned
        : c.showable && idx < frozenCount && !c.isGroupHeader,
    originalIndex: c.originalIndex !== undefined ? c.originalIndex : idx,
  }));

  const pinned = initialized.filter((c) => c.pinned);
  const unpinned = initialized.filter((c) => !c.pinned);
  return [...pinned, ...unpinned];
}

interface ColumnConfigModalProps {
  open: boolean;
  onClose: () => void;
  settings: ReportColumnSettings;
  onSave: (settings: ReportColumnSettings) => void;
}

export function ColumnConfigModal({
  open,
  onClose,
  settings,
  onSave,
}: ColumnConfigModalProps) {
  const [activeTab, setActiveTab] = useState<
    "summary" | "detail" | "preference"
  >("summary");

  const [summaryColumns, setSummaryColumns] = useState<ColumnConfigItem[]>(() =>
    normalizeColumnList(
      settings.columns || DEFAULT_REPORT_COLUMNS,
      settings.frozenColumnsCount ?? 2,
    ),
  );

  const [detailColumns, setDetailColumns] = useState<ColumnConfigItem[]>(() =>
    normalizeColumnList(
      settings.detailColumns || DEFAULT_DETAIL_COLUMNS,
      settings.detailFrozenColumnsCount ?? 1,
    ),
  );

  const [detailDownloadMode, setDetailDownloadMode] = useState<
    "multiple" | "single"
  >(settings.detailDownloadMode || "multiple");
  const [exportDataScope, setExportDataScope] = useState<"summary" | "detail">(
    settings.exportDataScope || "summary",
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  // FLIP Animation References
  const rowRefs = useRef<Map<string, HTMLTableRowElement>>(new Map());
  const prevRects = useRef<Map<string, number>>(new Map());
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setSummaryColumns(
        normalizeColumnList(
          settings.columns || DEFAULT_REPORT_COLUMNS,
          settings.frozenColumnsCount ?? 2,
        ),
      );
      setDetailColumns(
        normalizeColumnList(
          settings.detailColumns || DEFAULT_DETAIL_COLUMNS,
          settings.detailFrozenColumnsCount ?? 1,
        ),
      );
      setActiveTab(settings.detailScreenSetting || "summary");
      setDetailDownloadMode(settings.detailDownloadMode || "multiple");
      setExportDataScope(settings.exportDataScope || "summary");
      setSearchQuery("");
      setDragIndex(null);
      setDragOverIndex(null);
      setShowRestoreConfirm(false);
      setAnimatingId(null);
      prevRects.current.clear();
    }
  }, [open, settings]);

  const currentColumns =
    activeTab === "summary" ? summaryColumns : detailColumns;

  const setCurrentColumns = (
    updater: (prev: ColumnConfigItem[]) => ColumnConfigItem[],
  ) => {
    if (activeTab === "summary") {
      setSummaryColumns(updater);
    } else {
      setDetailColumns(updater);
    }
  };

  const pinnedCount = useMemo(() => {
    return currentColumns.filter((c) => c.pinned && !c.isGroupHeader).length;
  }, [currentColumns]);

  // Capture position of visible rows before state updates for FLIP animation
  const capturePositions = () => {
    const rects = new Map<string, number>();
    rowRefs.current.forEach((el, id) => {
      if (el) {
        rects.set(id, el.getBoundingClientRect().top);
      }
    });
    prevRects.current = rects;
  };

  // Perform smooth physical FLIP animation after layout updates
  React.useEffect(() => {
    if (prevRects.current.size === 0) return;

    rowRefs.current.forEach((el, id) => {
      if (!el) return;
      const prevTop = prevRects.current.get(id);
      if (prevTop === undefined) return;
      const currentTop = el.getBoundingClientRect().top;
      const deltaY = prevTop - currentTop;

      if (deltaY !== 0) {
        el.style.transform = `translate3d(0, ${deltaY}px, 0)`;
        el.style.transition = "none";
        if (id === animatingId) {
          el.classList.add(
            "z-30",
            "shadow-md",
            "ring-1",
            "ring-[#155dfc]/40",
            "bg-[#155dfc]/10",
          );
        }

        requestAnimationFrame(() => {
          // Force reflow
          el.getBoundingClientRect();
          el.style.transition =
            "transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease";
          el.style.transform = "translate3d(0, 0, 0)";
        });
      }
    });

    const timer = setTimeout(() => {
      rowRefs.current.forEach((el) => {
        if (el) {
          el.style.transform = "";
          el.style.transition = "";
          el.classList.remove(
            "z-30",
            "shadow-md",
            "ring-1",
            "ring-[#155dfc]/40",
            "bg-[#155dfc]/10",
          );
        }
      });
      prevRects.current.clear();
      setAnimatingId(null);
    }, 320);

    return () => clearTimeout(timer);
  }, [currentColumns, animatingId]);

  const handlePin = (colId: string) => {
    capturePositions();
    setAnimatingId(colId);

    setCurrentColumns((prev) => {
      const col = prev.find((c) => c.id === colId);
      if (!col) return prev;

      const pinnedList = prev.filter((c) => c.pinned && c.id !== colId);
      const unpinnedList = prev.filter((c) => !c.pinned && c.id !== colId);

      // Append newly pinned column to the end of pinned list
      const updatedCol: ColumnConfigItem = {
        ...col,
        pinned: true,
      };

      return [...pinnedList, updatedCol, ...unpinnedList];
    });

    const colItem = currentColumns.find((c) => c.id === colId);
    toast.success(`Pinned "${colItem?.label || colId}"`, {
      description: "Moved to top pinned columns area",
    });
  };

  const handleUnpin = (colId: string) => {
    capturePositions();
    setAnimatingId(colId);

    setCurrentColumns((prev) => {
      const col = prev.find((c) => c.id === colId);
      if (!col) return prev;

      const pinnedList = prev.filter((c) => c.pinned && c.id !== colId);
      const unpinnedList = prev.filter((c) => !c.pinned && c.id !== colId);

      const updatedCol: ColumnConfigItem = {
        ...col,
        pinned: false,
      };

      // Find original relative slot in unpinned list based on originalIndex
      const targetOrigIdx = col.originalIndex ?? 999;
      let insertIdx = unpinnedList.findIndex(
        (c) => (c.originalIndex ?? 999) > targetOrigIdx,
      );
      if (insertIdx === -1) {
        insertIdx = unpinnedList.length;
      }

      const nextUnpinned = [...unpinnedList];
      nextUnpinned.splice(insertIdx, 0, updatedCol);

      return [...pinnedList, ...nextUnpinned];
    });

    const colItem = currentColumns.find((c) => c.id === colId);
    toast.info(`Unpinned "${colItem?.label || colId}"`, {
      description: "Returned to standard column list",
    });
  };

  const filteredColumns = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return currentColumns;

    return currentColumns.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        (c.group && c.group.toLowerCase().includes(q)),
    );
  }, [currentColumns, searchQuery]);

  const updateColumn = (id: string, patch: Partial<ColumnConfigItem>) => {
    setCurrentColumns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );
  };

  const moveColumn = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= currentColumns.length) return;
    const fromCol = currentColumns[fromIdx];
    const toCol = currentColumns[toIdx];
    if (!fromCol || !toCol) return;

    // Disallow cross-boundary drag without changing pinned status
    if (fromCol.pinned !== toCol.pinned) {
      return;
    }

    capturePositions();
    setCurrentColumns((prev) => {
      const next = [...prev];
      const [item] = next.splice(fromIdx, 1);
      if (item) {
        next.splice(toIdx, 0, item);
      }
      return next;
    });
  };

  const handleReset = () => {
    setSummaryColumns(
      normalizeColumnList(
        settings.columns || DEFAULT_REPORT_COLUMNS,
        settings.frozenColumnsCount ?? 2,
      ),
    );
    setDetailColumns(
      normalizeColumnList(
        settings.detailColumns || DEFAULT_DETAIL_COLUMNS,
        settings.detailFrozenColumnsCount ?? 1,
      ),
    );
    setDetailDownloadMode(settings.detailDownloadMode || "multiple");
    setExportDataScope(settings.exportDataScope || "summary");
    setAnimatingId(null);
    prevRects.current.clear();
    toast.info("Unsaved changes discarded — returned to saved configuration");
  };

  const handleRestoreDefault = () => {
    setSummaryColumns(
      normalizeColumnList(
        DEFAULT_REPORT_COLUMNS,
        DEFAULT_COLUMN_SETTINGS.frozenColumnsCount,
      ),
    );
    setDetailColumns(
      normalizeColumnList(
        DEFAULT_DETAIL_COLUMNS,
        DEFAULT_COLUMN_SETTINGS.detailFrozenColumnsCount ?? 1,
      ),
    );
    setDetailDownloadMode("multiple");
    setExportDataScope("summary");
    setShowRestoreConfirm(false);
    setAnimatingId(null);
    prevRects.current.clear();
    toast.success("Default column configuration restored");
  };

  const handleSave = () => {
    const summaryPinnedCount = summaryColumns.filter(
      (c) => c.pinned && !c.isGroupHeader,
    ).length;
    const detailPinnedCount = detailColumns.filter(
      (c) => c.pinned && !c.isGroupHeader,
    ).length;

    onSave({
      columns: summaryColumns,
      detailColumns: detailColumns,
      frozenColumnsCount: summaryPinnedCount,
      detailFrozenColumnsCount: detailPinnedCount,
      detailDownloadMode: detailDownloadMode,
      detailScreenSetting: activeTab,
      exportDataScope: exportDataScope,
    });
    toast.success("Column configuration saved permanently");
    onClose();
  };

  if (!open) return null;

  return (
    <TooltipProvider delayDuration={150}>
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
        <button
          type="button"
          aria-label="Close Column Setting"
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
        />
        <div className="relative z-10 flex h-[600px] max-h-[88vh] w-[820px] max-w-[94vw] flex-col rounded-lg border border-border bg-white dark:bg-slate-900 text-foreground shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header (56px) */}
          <header className="flex h-[56px] items-center justify-between border-b border-border px-6 bg-white dark:bg-slate-900 select-none shrink-0">
            <h2 className="text-[16px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Column Setting
            </h2>

            <button
              type="button"
              aria-label="Close Column Setting"
              onClick={onClose}
              className="rounded-md p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          {/* Dedicated Tab Bar for Summary, Detail and Preference */}
          <div className="border-b border-[#DFE3EB] dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 px-6 flex items-center justify-between gap-4 text-xs select-none shrink-0 h-11">
            <div className="flex items-center gap-6 h-full">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("summary");
                  setSearchQuery("");
                }}
                className={cn(
                  "relative h-full font-semibold transition-all cursor-pointer flex items-center gap-2 text-xs",
                  activeTab === "summary"
                    ? "text-[#0089FF] font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-[#0089FF]",
                )}
              >
                <span>Summary Report</span>
                {activeTab === "summary" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0089FF] rounded-t-full shadow-xs" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("detail");
                  setSearchQuery("");
                }}
                className={cn(
                  "relative h-full font-semibold transition-all cursor-pointer flex items-center gap-2 text-xs",
                  activeTab === "detail"
                    ? "text-[#0089FF] font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-[#0089FF]",
                )}
              >
                <span>Detail Report</span>
                {activeTab === "detail" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0089FF] rounded-t-full shadow-xs" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("preference");
                  setSearchQuery("");
                }}
                className={cn(
                  "relative h-full font-semibold transition-all cursor-pointer flex items-center gap-2 text-xs",
                  activeTab === "preference"
                    ? "text-[#0089FF] font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-[#0089FF]",
                )}
              >
                <span>Preference</span>
                {activeTab === "preference" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0089FF] rounded-t-full shadow-xs" />
                )}
              </button>
            </div>
          </div>

          {activeTab === "preference" ? (
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 bg-white dark:bg-slate-900 select-none">
              <div className="max-w-xl space-y-6">
                {/* Download Layout */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                    Download Layout
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-1">
                    <label
                      onClick={() => setDetailDownloadMode("multiple")}
                      className="flex items-start gap-2.5 cursor-pointer text-xs select-none"
                    >
                      <input
                        type="radio"
                        name="modal-excel-mode"
                        checked={detailDownloadMode === "multiple"}
                        onChange={() => setDetailDownloadMode("multiple")}
                        className="mt-0.5 h-4 w-4 accent-[#0089FF] text-[#0089FF] cursor-pointer"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          Multiple Sheets (By Branch)
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                          Each branch in a separate Excel worksheet
                        </span>
                      </div>
                    </label>

                    <label
                      onClick={() => setDetailDownloadMode("single")}
                      className="flex items-start gap-2.5 cursor-pointer text-xs select-none"
                    >
                      <input
                        type="radio"
                        name="modal-excel-mode"
                        checked={detailDownloadMode === "single"}
                        onChange={() => setDetailDownloadMode("single")}
                        className="mt-0.5 h-4 w-4 accent-[#0089FF] text-[#0089FF] cursor-pointer"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          Single Sheet (Consolidated)
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                          All branches on a single Excel worksheet
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-slate-900 overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto select-none">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="sticky top-0 z-20 bg-[#EAF0F6] dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-b border-[#DFE3EB] dark:border-slate-700 select-none">
                    <tr>
                      <th className="w-10 px-2 py-2.5 text-center text-slate-600 dark:text-slate-400 font-bold text-[11px]">
                        #
                      </th>
                      <th className="px-3.5 py-2.5 font-bold text-slate-900 dark:text-slate-100 text-xs">
                        Column
                      </th>

                      <th className="w-20 px-2 py-2.5 text-center font-bold text-slate-900 dark:text-slate-100 text-xs">
                        Showable
                      </th>

                      <th className="w-20 px-2 py-2.5 text-center font-bold text-slate-900 dark:text-slate-100 text-xs">
                        Printable
                      </th>

                      <th className="w-20 px-2 py-2.5 text-center font-bold text-slate-900 dark:text-slate-100 text-xs">
                        Sortable
                      </th>

                      <th className="w-24 px-2 py-2.5 text-center font-bold text-slate-900 dark:text-slate-100 text-xs">
                        Sort Priority
                      </th>

                      <th className="w-24 px-2 py-2.5 text-center font-bold text-slate-900 dark:text-slate-100 text-xs">
                        Sorting
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#DFE3EB] dark:divide-slate-800">
                    {filteredColumns.map((col, idx) => {
                      const actualIndex = currentColumns.findIndex(
                        (c) => c.id === col.id,
                      );

                      if (col.isGroupHeader) {
                        return (
                          <tr
                            key={col.id}
                            ref={(el) => {
                              if (el) rowRefs.current.set(col.id, el);
                              else rowRefs.current.delete(col.id);
                            }}
                            className="bg-slate-100/70 dark:bg-slate-800/70 font-semibold text-slate-900 dark:text-slate-100 border-y border-[#DFE3EB] dark:border-slate-700"
                          >
                            <td className="px-3 py-2 text-center text-slate-400">
                              <GripVertical className="h-3.5 w-3.5 mx-auto opacity-40" />
                            </td>
                            <td
                              colSpan={6}
                              className="px-4 py-2 tracking-wide text-xs font-bold text-slate-900 dark:text-slate-100"
                            >
                              {col.label}
                            </td>
                          </tr>
                        );
                      }

                      const isPinned = !!col.pinned;
                      const isLastPinned =
                        isPinned &&
                        (idx === filteredColumns.length - 1 ||
                          !filteredColumns[idx + 1]?.pinned);

                      const isDragging = dragIndex === actualIndex;
                      const isDragOver = dragOverIndex === actualIndex;

                      return (
                        <React.Fragment key={col.id}>
                          <tr
                            ref={(el) => {
                              if (el) rowRefs.current.set(col.id, el);
                              else rowRefs.current.delete(col.id);
                            }}
                            draggable
                            onDragStart={(e) => {
                              setDragIndex(actualIndex);
                              e.dataTransfer.effectAllowed = "move";
                              e.dataTransfer.setData("text/plain", col.id);
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              if (
                                dragIndex !== null &&
                                dragIndex !== actualIndex
                              ) {
                                setDragOverIndex(actualIndex);
                              }
                            }}
                            onDragLeave={() => setDragOverIndex(null)}
                            onDrop={(e) => {
                              e.preventDefault();
                              if (
                                dragIndex !== null &&
                                dragIndex !== actualIndex
                              ) {
                                moveColumn(dragIndex, actualIndex);
                              }
                              setDragIndex(null);
                              setDragOverIndex(null);
                            }}
                            onDragEnd={() => {
                              setDragIndex(null);
                              setDragOverIndex(null);
                            }}
                            className={cn(
                              "group transition-colors duration-75 relative border-b border-[#DFE3EB] dark:border-slate-800/80",
                              isDragging && "opacity-30 bg-[#0089FF]/10",
                              isDragOver &&
                                "border-t-2 border-[#0089FF] bg-[#0089FF]/5",
                              isPinned
                                ? "bg-[#0089FF]/[0.04] hover:bg-[#0089FF]/[0.08]"
                                : "hover:bg-slate-50 dark:hover:bg-slate-800/40",
                            )}
                          >
                            {/* Drag Handle */}
                            <td className="px-3 py-2 text-center">
                              <button
                                type="button"
                                title="Drag to reorder"
                                className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 rounded transition-colors"
                              >
                                <GripVertical className="h-3.5 w-3.5" />
                              </button>
                            </td>

                            {/* Column Name + Pin Action + Pinned Badge */}
                            <td className="px-4 py-2 font-medium text-foreground">
                              <div
                                className={cn(
                                  "flex items-center gap-2",
                                  col.group && "pl-4",
                                )}
                              >
                                {col.group && (
                                  <span className="text-[10px] text-slate-400 select-none">
                                    ↳
                                  </span>
                                )}

                                {/* Column Name */}
                                <span
                                  className={cn(
                                    "font-semibold text-xs text-slate-900 dark:text-slate-100",
                                    !col.showable && "text-slate-400 dark:text-slate-500",
                                    isPinned && "text-[#0089FF] dark:text-blue-400",
                                  )}
                                >
                                  {col.label}
                                </span>

                                {/* Direct Pin / Unpin Action with Tooltip */}
                                <div className="ml-1 flex items-center">
                                  {isPinned ? (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          type="button"
                                          aria-label={`Unpin column ${col.label}`}
                                          onClick={() => handleUnpin(col.id)}
                                          className="p-1 rounded text-[#0089FF] hover:bg-[#0089FF]/15 hover:text-red-500 transition-all cursor-pointer active:scale-90"
                                        >
                                          <Pin className="h-3.5 w-3.5 fill-[#0089FF]" />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent side="top">
                                        Unpin column
                                      </TooltipContent>
                                    </Tooltip>
                                  ) : (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          type="button"
                                          aria-label={`Pin column ${col.label}`}
                                          onClick={() => handlePin(col.id)}
                                          className="p-1 rounded opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-slate-400 hover:text-[#0089FF] hover:bg-[#0089FF]/10 active:scale-90"
                                        >
                                          <Pin className="h-3.5 w-3.5" />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent side="top">
                                        Pin column
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Showable */}
                            <td className="px-2.5 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={col.showable}
                                onChange={(e) =>
                                  updateColumn(col.id, {
                                    showable: e.target.checked,
                                  })
                                }
                                aria-label={`Toggle showable for ${col.label}`}
                                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 accent-[#0089FF] text-[#0089FF] focus:ring-[#0089FF]/30 cursor-pointer"
                              />
                            </td>

                            {/* Printable */}
                            <td className="px-2.5 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={col.printable}
                                onChange={(e) =>
                                  updateColumn(col.id, {
                                    printable: e.target.checked,
                                  })
                                }
                                aria-label={`Toggle printable for ${col.label}`}
                                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 accent-[#0089FF] text-[#0089FF] focus:ring-[#0089FF]/30 cursor-pointer"
                              />
                            </td>

                            {/* Sortable */}
                            <td className="px-2.5 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={col.sortable}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  updateColumn(col.id, {
                                    sortable: checked,
                                    sortPriority: checked
                                      ? col.sortPriority
                                      : null,
                                  });
                                }}
                                aria-label={`Toggle sortable for ${col.label}`}
                                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 accent-[#0089FF] text-[#0089FF] focus:ring-[#0089FF]/30 cursor-pointer"
                              />
                            </td>

                            {/* Sort Priority */}
                            <td className="px-2.5 py-2 text-center">
                              {!col.sortable ? (
                                <div className="h-6.5 px-2 text-[11px] font-medium text-slate-300 dark:text-slate-600 inline-flex items-center gap-1 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded cursor-not-allowed select-none">
                                  <span>--</span>
                                  <ChevronDown className="h-2.5 w-2.5 opacity-30" />
                                </div>
                              ) : (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button
                                      type="button"
                                      aria-label={`Sort priority for ${col.label}`}
                                      className="h-6.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 text-[11px] font-medium text-slate-800 dark:text-slate-200 hover:border-[#0089FF] focus:border-[#0089FF] focus:ring-1 focus:ring-[#0089FF] focus:outline-none cursor-pointer shadow-2xs inline-flex items-center gap-1 select-none transition-all active:scale-98"
                                    >
                                      <span>{col.sortPriority ?? "--"}</span>
                                      <ChevronDown className="h-2.5 w-2.5 text-slate-500 opacity-70" />
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    align="center"
                                    sideOffset={4}
                                    className="w-20 p-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md z-[95] select-none"
                                  >
                                    {[null, 1, 2, 3].map((pVal) => {
                                      const isSelected =
                                        col.sortPriority === pVal;
                                      return (
                                        <button
                                          key={pVal ?? "none"}
                                          type="button"
                                          onClick={() =>
                                            updateColumn(col.id, {
                                              sortPriority: pVal,
                                            })
                                          }
                                          className={cn(
                                            "flex w-full items-center justify-between px-2 py-1 text-xs rounded cursor-pointer transition-colors text-left select-none",
                                            isSelected
                                              ? "bg-slate-100 dark:bg-slate-700 font-semibold text-foreground"
                                              : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium",
                                          )}
                                        >
                                          <span>{pVal ?? "--"}</span>
                                          {isSelected && (
                                            <Check className="h-3 w-3 text-[#0089FF]" />
                                          )}
                                        </button>
                                      );
                                    })}
                                  </PopoverContent>
                                </Popover>
                              )}
                            </td>

                            {/* Sorting Asc / Des */}
                            <td className="px-2.5 py-2 text-center">
                              <div className="inline-flex rounded border border-slate-300 dark:border-slate-700 overflow-hidden shadow-2xs">
                                <button
                                  type="button"
                                  disabled={!col.sortable}
                                  onClick={() =>
                                    updateColumn(col.id, { sortDir: "asc" })
                                  }
                                  className={cn(
                                    "px-2 py-0.5 text-[10px] font-semibold transition-all cursor-pointer",
                                    col.sortable && col.sortDir === "asc"
                                      ? "bg-[#0089FF] text-white shadow-2xs"
                                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50",
                                    !col.sortable &&
                                      "opacity-40 cursor-not-allowed",
                                  )}
                                >
                                  Asc
                                </button>
                                <button
                                  type="button"
                                  disabled={!col.sortable}
                                  onClick={() =>
                                    updateColumn(col.id, { sortDir: "desc" })
                                  }
                                  className={cn(
                                    "px-2 py-0.5 text-[10px] font-semibold transition-all border-l border-slate-300 dark:border-slate-700 cursor-pointer",
                                    col.sortable && col.sortDir === "desc"
                                      ? "bg-[#0089FF] text-white shadow-2xs"
                                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50",
                                    !col.sortable &&
                                      "opacity-40 cursor-not-allowed",
                                  )}
                                >
                                  Des
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Subtle Inline Separator after last pinned column */}
                          {isLastPinned && pinnedCount > 0 && (
                            <tr
                              key="__pinned_separator__"
                              className="bg-slate-50/80 dark:bg-slate-900/50 select-none border-y border-[#DFE3EB] dark:border-slate-700"
                            >
                              <td colSpan={7} className="px-4 py-1.5 text-center">
                                <div className="flex items-center justify-center gap-3">
                                  <span className="h-px flex-1 bg-[#DFE3EB] dark:bg-slate-700" />
                                  <span className="inline-flex items-center gap-1.5 font-semibold text-[11px] text-[#0089FF] tracking-wide">
                                    <Pin className="h-3 w-3 fill-[#0089FF] text-[#0089FF]" />
                                    {pinnedCount}{" "}
                                    {pinnedCount === 1 ? "column" : "columns"}{" "}
                                    pinned
                                  </span>
                                  <span className="h-px flex-1 bg-[#DFE3EB] dark:bg-slate-700" />
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}

                    {filteredColumns.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-16 text-center text-xs text-muted-foreground"
                        >
                          No columns match &quot;{searchQuery}&quot;.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <footer className="flex h-14 items-center justify-between border-t border-border bg-slate-50/60 dark:bg-slate-900/60 px-6 shrink-0 select-none">
            <div className="flex items-center gap-2">
              <button
                type="button"
                title="Undo all unsaved changes and return to the last saved configuration"
                onClick={handleReset}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-2xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-98 cursor-pointer"
              >
                <Undo2 className="h-3.5 w-3.5 text-slate-500" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                title="Restore original system defaults"
                onClick={() => setShowRestoreConfirm(true)}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-2xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-98 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                <span>Restore Default</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-8 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer shadow-2xs active:scale-98"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="h-8 rounded-md bg-[#0089FF] hover:bg-[#0077E6] px-5 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer active:scale-98"
              >
                Save
              </button>
            </div>
          </footer>
        </div>

        {showRestoreConfirm && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
              onClick={() => setShowRestoreConfirm(false)}
            />
            <div className="relative z-10 w-full max-w-sm rounded-lg border border-border bg-white dark:bg-slate-900 p-6 text-foreground shadow-xl animate-in fade-in zoom-in-95 duration-150">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Restore Default Configuration?
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Are you sure you want to restore the default configuration? This
                will reset all column visibility, sorting, and pinned column
                settings to system defaults.
              </p>
              <div className="mt-5 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowRestoreConfirm(false)}
                  className="h-8 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 cursor-pointer shadow-2xs active:scale-98"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRestoreDefault}
                  className="h-8 rounded-md bg-[#0089FF] hover:bg-[#0077E6] px-4.5 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer active:scale-98"
                >
                  Restore Default
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

