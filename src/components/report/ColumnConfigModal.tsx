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
  useLayoutEffect(() => {
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
          aria-label="Close Settings"
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity cursor-pointer"
        />
        <div className="relative z-10 flex h-[590px] max-h-[88vh] w-[780px] max-w-[92vw] flex-col rounded-2xl border border-border/80 bg-background text-foreground shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <header className="flex h-[56px] items-center justify-between border-b border-border/70 px-5 bg-card/60 select-none shrink-0">
            <h2 className="text-[16px] font-semibold tracking-tight text-foreground">
              Settings
            </h2>

            <button
              type="button"
              aria-label="Close Settings"
              onClick={onClose}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          {/* Dedicated Tab Bar for Summary, Detail and Preference */}
          <div className="border-b border-border/80 bg-muted/10 px-5 flex items-center justify-between gap-4 text-xs select-none shrink-0 h-11">
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
                    : "text-muted-foreground hover:text-[#0089FF]",
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
                    : "text-muted-foreground hover:text-[#0089FF]",
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
                    : "text-muted-foreground hover:text-[#0089FF]",
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
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 bg-surface select-none">
              <div className="max-w-xl space-y-6">
                {/* Download Layout */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-foreground block">
                    Download Layout
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      onClick={() => setDetailDownloadMode("multiple")}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer text-xs",
                        detailDownloadMode === "multiple"
                          ? "border-[#0089FF] bg-[#0089FF]/10 text-foreground font-semibold"
                          : "border-border/80 bg-background hover:bg-muted/40 text-muted-foreground",
                      )}
                    >
                      <input
                        type="radio"
                        name="modal-excel-mode"
                        checked={detailDownloadMode === "multiple"}
                        onChange={() => setDetailDownloadMode("multiple")}
                        className="h-3.5 w-3.5 accent-[#0089FF] cursor-pointer"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">
                          Multiple Sheets (By Branch)
                        </span>
                        <span className="text-[11px] text-muted-foreground font-normal">
                          Each branch in a separate Excel worksheet
                        </span>
                      </div>
                    </label>

                    <label
                      onClick={() => setDetailDownloadMode("single")}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer text-xs",
                        detailDownloadMode === "single"
                          ? "border-[#0089FF] bg-[#0089FF]/10 text-foreground font-semibold"
                          : "border-border/80 bg-background hover:bg-muted/40 text-muted-foreground",
                      )}
                    >
                      <input
                        type="radio"
                        name="modal-excel-mode"
                        checked={detailDownloadMode === "single"}
                        onChange={() => setDetailDownloadMode("single")}
                        className="h-3.5 w-3.5 accent-[#0089FF] cursor-pointer"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">
                          Single Sheet (Consolidated)
                        </span>
                        <span className="text-[11px] text-muted-foreground font-normal">
                          All branches on a single Excel worksheet
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 min-h-0 flex flex-col bg-surface overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto select-none">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="sticky top-0 z-20 bg-slate-200/90 dark:bg-slate-850 text-slate-800 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700 shadow-2xs select-none">
                    <tr>
                      <th className="w-10 px-2 py-2.5 text-center text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
                        #
                      </th>
                      <th className="px-3.5 py-2.5 font-bold text-slate-900 dark:text-slate-100 text-xs">
                        Column
                      </th>

                      <th className="w-20 px-2 py-2.5 text-center font-semibold text-slate-800 dark:text-slate-200 text-xs">
                        Showable
                      </th>

                      <th className="w-20 px-2 py-2.5 text-center font-semibold text-slate-800 dark:text-slate-200 text-xs">
                        Printable
                      </th>

                      <th className="w-20 px-2 py-2.5 text-center font-semibold text-slate-800 dark:text-slate-200 text-xs">
                        Sortable
                      </th>

                      <th className="w-24 px-2 py-2.5 text-center font-semibold text-slate-800 dark:text-slate-200 text-xs">
                        Sort Priority
                      </th>

                      <th className="w-24 px-2 py-2.5 text-center font-semibold text-slate-800 dark:text-slate-200 text-xs">
                        Sorting
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border/40">
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
                            className="bg-surface-muted/60 font-semibold text-foreground border-y border-border/60"
                          >
                            <td className="px-3 py-2 text-center text-muted-foreground/40">
                              <GripVertical className="h-3.5 w-3.5 mx-auto opacity-30" />
                            </td>
                            <td
                              colSpan={6}
                              className="px-4 py-2 tracking-wide text-xs font-bold text-foreground"
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
                              "group transition-colors duration-75 relative",
                              isDragging && "opacity-30 bg-brand/10",
                              isDragOver &&
                                "border-t-2 border-[#155dfc] bg-[#155dfc]/5",
                              isPinned
                                ? "bg-[#155dfc]/[0.05] hover:bg-[#155dfc]/[0.09] border-l-2 border-l-[#155dfc]"
                                : "hover:bg-muted/40",
                              col.group &&
                                (isPinned
                                  ? "bg-[#155dfc]/[0.03]"
                                  : "bg-background/40"),
                            )}
                          >
                            {/* Drag Handle */}
                            <td className="px-3 py-2 text-center">
                              <button
                                type="button"
                                title="Drag to reorder"
                                className="cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-foreground p-0.5 rounded transition-colors"
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
                                  <span className="text-[10px] text-muted-foreground/60 select-none">
                                    ↳
                                  </span>
                                )}

                                {/* Column Name */}
                                <span
                                  className={cn(
                                    "font-semibold text-xs",
                                    !col.showable && "text-muted-foreground/75",
                                    isPinned && "text-[#155dfc]",
                                  )}
                                >
                                  {col.label}
                                </span>

                                {/* Pinned Badge */}
                                {isPinned && (
                                  <span
                                    title="Column is pinned at the top and frozen on table"
                                    className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold bg-[#155dfc]/10 text-[#155dfc] border border-[#155dfc]/25 dark:bg-[#155dfc]/20 dark:text-blue-300 select-none"
                                  >
                                    Pinned
                                  </span>
                                )}

                                {/* Direct Pin / Unpin Action with Tooltip */}
                                <div className="ml-1 flex items-center">
                                  {isPinned ? (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          type="button"
                                          aria-label={`Unpin column ${col.label}`}
                                          onClick={() => handleUnpin(col.id)}
                                          className="p-1 rounded text-[#155dfc] hover:bg-[#155dfc]/15 hover:text-red-500 transition-all cursor-pointer active:scale-90"
                                        >
                                          <Pin className="h-3.5 w-3.5 fill-[#155dfc]" />
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
                                          className="p-1 rounded opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-muted-foreground/60 hover:text-[#155dfc] hover:bg-[#155dfc]/10 active:scale-90"
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
                                className="h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand cursor-pointer accent-[#155dfc]"
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
                                className="h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand cursor-pointer accent-[#155dfc]"
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
                                className="h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand cursor-pointer accent-[#155dfc]"
                              />
                            </td>

                            {/* Sort Priority */}
                            <td className="px-2.5 py-2 text-center">
                              {!col.sortable ? (
                                <div className="h-6.5 px-2 text-[11px] font-semibold text-muted-foreground/30 inline-flex items-center gap-1 border border-input/40 bg-muted/40 rounded-md cursor-not-allowed select-none">
                                  <span>--</span>
                                  <ChevronDown className="h-2.5 w-2.5 opacity-30" />
                                </div>
                              ) : (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button
                                      type="button"
                                      aria-label={`Sort priority for ${col.label}`}
                                      className="h-6.5 rounded-md border border-input/80 bg-background px-2 text-[11px] font-semibold text-foreground hover:border-[#155dfc]/60 hover:bg-muted/40 focus:border-[#155dfc] focus:ring-2 focus:ring-[#155dfc]/20 focus:outline-none cursor-pointer shadow-2xs inline-flex items-center gap-1 select-none transition-all active:scale-98"
                                    >
                                      <span>{col.sortPriority ?? "--"}</span>
                                      <ChevronDown className="h-2.5 w-2.5 text-muted-foreground opacity-70" />
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    align="center"
                                    sideOffset={4}
                                    className="w-20 p-1 rounded-lg border border-border/80 bg-popover/98 backdrop-blur-xl shadow-lg z-[95] select-none animate-in fade-in-0 zoom-in-95"
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
                                            "flex w-full items-center justify-between px-2 py-1 text-xs rounded-sm cursor-pointer transition-colors text-left select-none",
                                            isSelected
                                              ? "bg-[#155dfc]/10 text-[#155dfc] font-bold hover:bg-[#155dfc]/15"
                                              : "text-foreground hover:bg-muted/80 hover:text-foreground font-medium",
                                          )}
                                        >
                                          <span>{pVal ?? "--"}</span>
                                          {isSelected && (
                                            <Check className="h-3 w-3 text-[#155dfc]" />
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
                              <div className="inline-flex rounded-md border border-input/80 overflow-hidden shadow-2xs">
                                <button
                                  type="button"
                                  disabled={!col.sortable}
                                  onClick={() =>
                                    updateColumn(col.id, { sortDir: "asc" })
                                  }
                                  className={cn(
                                    "px-2 py-1 text-[10px] font-bold transition-all cursor-pointer",
                                    col.sortable && col.sortDir === "asc"
                                      ? "bg-[#155dfc] text-white shadow-2xs"
                                      : "bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground",
                                    !col.sortable &&
                                      "opacity-30 cursor-not-allowed",
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
                                    "px-2 py-1 text-[10px] font-bold transition-all border-l border-input cursor-pointer",
                                    col.sortable && col.sortDir === "desc"
                                      ? "bg-[#155dfc] text-white shadow-2xs"
                                      : "bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground",
                                    !col.sortable &&
                                      "opacity-30 cursor-not-allowed",
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
                              className="bg-slate-50/80 dark:bg-slate-900/50 select-none border-y border-border/60"
                            >
                              <td colSpan={7} className="px-4 py-1.5 text-center">
                                <div className="flex items-center justify-center gap-3">
                                  <span className="h-px flex-1 bg-border/70" />
                                  <span className="inline-flex items-center gap-1.5 font-bold text-[11px] text-[#155dfc] tracking-wide">
                                    <Pin className="h-3 w-3 fill-[#155dfc] text-[#155dfc]" />
                                    {pinnedCount}{" "}
                                    {pinnedCount === 1 ? "column" : "columns"}{" "}
                                    pinned
                                  </span>
                                  <span className="h-px flex-1 bg-border/70" />
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
          <footer className="flex h-14 items-center justify-between border-t border-border bg-muted/20 px-6 shrink-0 select-none">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                title="Undo all unsaved changes and return to the last saved configuration"
                onClick={handleReset}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border/80 bg-background px-3.5 text-xs font-semibold text-foreground shadow-2xs transition-all hover:bg-muted active:scale-98 cursor-pointer"
              >
                <Undo2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                title="Restore original system defaults"
                onClick={() => setShowRestoreConfirm(true)}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border/80 bg-background px-3.5 text-xs font-semibold text-foreground shadow-2xs transition-all hover:bg-muted active:scale-98 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Restore Default</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="h-9 rounded-md border border-border/80 bg-background px-4.5 text-xs font-medium text-foreground transition-all hover:bg-muted cursor-pointer shadow-2xs active:scale-98"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="h-9 rounded-md bg-[#155dfc] px-5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#124ecf] cursor-pointer active:scale-98"
              >
                Save Configuration
              </button>
            </div>
          </footer>
        </div>

        {showRestoreConfirm && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
              onClick={() => setShowRestoreConfirm(false)}
            />
            <div className="relative z-10 w-full max-w-sm rounded-2xl border border-border/80 bg-background p-6 text-foreground shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <h3 className="text-sm font-bold text-foreground">
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
                  className="h-9 rounded-md border border-border/80 bg-background px-4 text-xs font-medium text-foreground transition-all hover:bg-muted cursor-pointer shadow-2xs active:scale-98"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRestoreDefault}
                  className="h-9 rounded-md bg-[#155dfc] px-4.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#124ecf] cursor-pointer active:scale-98"
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

