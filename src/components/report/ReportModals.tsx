import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ColumnConfigModal,
  type ColumnConfigItem,
  type ReportColumnSettings,
} from "./ColumnConfigModal";
import {
  ChartConfigModal,
  DEFAULT_CHART_CONFIG,
  type ChartConfig,
} from "./ChartConfigModal";

export type ModalKind = "columns" | "chart" | "help" | null;

function Shell({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={"Close " + title}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
      />
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 overflow-hidden rounded-lg border border-border bg-white dark:bg-slate-900 text-foreground shadow-xl duration-150">
        <header className="flex h-[56px] items-center justify-between border-b border-border px-6 bg-white dark:bg-slate-900 shrink-0 select-none">
          <h2 className="text-[16px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          <button
            type="button"
            aria-label={"Close " + title}
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="max-h-[60vh] overflow-y-auto p-6 text-xs space-y-4">
          {children}
        </div>
        <footer className="flex justify-end border-t border-border bg-slate-50/60 dark:bg-slate-900/60 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="h-8 rounded-md bg-[#0089FF] hover:bg-[#0077E6] px-5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer active:scale-98"
          >
            Done
          </button>
        </footer>
      </div>
    </div>
  );
}

export function ReportModals({
  kind,
  onClose,
  columns,
  hidden = [],
  onToggleColumn,
  columnSettings,
  onSaveColumnSettings,
  chartConfig,
  onSaveChartConfig,
  chartType,
  onChartType,
}: {
  kind: ModalKind;
  onClose: () => void;
  columns?: { key: string; label: string }[];
  hidden?: string[];
  onToggleColumn?: (key: string) => void;
  columnSettings?: ReportColumnSettings;
  onSaveColumnSettings?: (settings: ReportColumnSettings) => void;
  chartConfig?: ChartConfig;
  onSaveChartConfig?: (config: ChartConfig) => void;
  chartType?: string;
  onChartType?: (type: string) => void;
}) {
  if (kind === null) return null;

  if (kind === "columns") {
    if (columnSettings && onSaveColumnSettings) {
      return (
        <ColumnConfigModal
          open={true}
          onClose={onClose}
          settings={columnSettings}
          onSave={onSaveColumnSettings}
        />
      );
    }

    if (columns) {
      const fallbackSettings: ReportColumnSettings = {
        columns: columns.map((c, i) => ({
          id: c.key,
          label: c.label,
          showable: !hidden.includes(c.key),
          printable: true,
          sortable: true,
          sortPriority: i === 0 ? 1 : null,
          sortDir: "asc",
        })),
        frozenColumnsCount: 2,
        detailDownloadMode: "multiple",
        detailScreenSetting: "summary",
      };

      return (
        <ColumnConfigModal
          open={true}
          onClose={onClose}
          settings={fallbackSettings}
          onSave={(newSettings) => {
            if (onToggleColumn) {
              newSettings.columns.forEach((col) => {
                const wasHidden = hidden.includes(col.id);
                if (col.showable && wasHidden) {
                  onToggleColumn(col.id);
                } else if (!col.showable && !wasHidden) {
                  onToggleColumn(col.id);
                }
              });
            }
          }}
        />
      );
    }
  }

  if (kind === "chart") {
    if (chartConfig && onSaveChartConfig) {
      return (
        <ChartConfigModal
          open={true}
          onClose={onClose}
          config={chartConfig}
          onSave={onSaveChartConfig}
        />
      );
    }

    // Default fallback chart config
    return (
      <ChartConfigModal
        open={true}
        onClose={onClose}
        config={DEFAULT_CHART_CONFIG}
        onSave={(cfg) => {
          if (onSaveChartConfig) onSaveChartConfig(cfg);
        }}
      />
    );
  }

  return (
    <Shell title="Help & Guide" onClose={onClose}>
      <ul className="list-disc space-y-1.5 pl-4 text-muted-foreground">
        <li>
          Use Configuration to set filters, then Apply &amp; load to fetch
          records.
        </li>
        <li>
          Download exports the report as XLS, PDF or CSV — summary only or with
          details.
        </li>
        <li>
          Click the + button to expand a vehicle&apos;s trip breakdown inline.
        </li>
        <li>
          Double-click a row to drill down: Summary → Daily Summary → Travel
          Detail.
        </li>
        <li>
          Use the Back arrow in the action bar to return to the previous level.
        </li>
      </ul>
    </Shell>
  );
}
