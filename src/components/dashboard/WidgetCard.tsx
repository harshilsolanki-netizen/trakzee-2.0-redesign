import {
  GripVertical,
  Info,
  FileText,
  Filter,
  Settings,
  Check,
} from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useDashboard } from "@/dashboard/store";
import { RANGE_LABEL, type Range } from "@/data/fleet";
import {
  widgetMeta,
  type WidgetId,
  type WidgetSize,
  WIDGET_SIZE_META,
} from "@/dashboard/widgets";
import { WidgetTextualModal } from "./WidgetTextualModal";
import { WidgetSettingsModal } from "./WidgetSettingsModal";
import { ZioLogo } from "@/components/zio/ZioLogo";
import { useZio } from "@/zio/ZioContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const RANGES: Range[] = ["today", "7d", "30d"];

export const WidgetSizeContext = createContext<WidgetSize>("medium");
export const useWidgetSize = () => useContext(WidgetSizeContext);

export function WidgetCard({
  id,
  info,
  className,
  headerClassName,
  children,
  range,
  onRangeChange,
  extraControls,
}: {
  id: WidgetId;
  info?: string;
  className?: string;
  headerClassName?: string;
  children: ReactNode;
  range?: Range;
  onRangeChange?: (r: Range) => void;
  extraControls?: ReactNode;
}) {
  const meta = widgetMeta(id);
  const { settings, activeTab } = useDashboard();
  const { openZio, sendMessage } = useZio();

  const [textualViewOpen, setTextualViewOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState<string>(() => {
    if (range === "7d") return "This week";
    if (range === "30d") return "This month";
    return "Today";
  });

  const rawSize: WidgetSize =
    activeTab?.widgetSizes?.[id] || meta.defaultSize || "small";
  const currentSize: WidgetSize =
    id === "fleet-score" &&
    (rawSize === "medium" || rawSize === "large" || rawSize === "full")
      ? "small"
      : rawSize;
  const isMini = currentSize === "mini";

  const handleFilterSelect = (opt: string) => {
    setSelectedFilter(opt);
    if (onRangeChange) {
      if (opt === "Today" || opt === "Yesterday") {
        onRangeChange("today");
      } else if (opt === "This week" || opt === "Last week") {
        onRangeChange("7d");
      } else if (opt === "This month" || opt === "Last month") {
        onRangeChange("30d");
      }
    }
    toast.success(`Filter applied: ${opt}`);
    setMenuOpen(false);
  };

  const handleAskZio = () => {
    openZio("sidebar");
    setTimeout(() => {
      sendMessage(
        `Show me the insights of this widget: ${meta.title}`,
        "Show me the insights of this widget",
      );
    }, 120);
  };

  const header = (
    <div
      className={cn(
        "flex items-center justify-between bg-transparent rounded-t-xl select-none shrink-0",
        isMini ? "px-2 py-1 min-h-[36px] gap-1" : "px-3 py-1.5 min-h-[44px] gap-1.5",
        headerClassName,
      )}
    >
      <div className="flex flex-col min-w-0 justify-center">
        <div className="flex items-center gap-1 min-w-0">
          <h2
            title={meta.title}
            className={cn(
              "font-bold text-foreground tracking-tight truncate",
              isMini ? "text-[13px] max-w-[95px]" : "text-[14px] max-w-[200px] sm:max-w-[260px]",
            )}
          >
            {meta.title}
          </h2>
          {info ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={`About ${meta.title}`}
                  className="text-muted-foreground/70 hover:text-foreground cursor-pointer transition-colors"
                >
                  <Info className="h-3 w-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-64 text-xs">{info}</TooltipContent>
            </Tooltip>
          ) : null}
        </div>

        {/* Applied Filter Pill (matching reference image: [Today] / [Yesterday]) */}
        <div className="flex items-center gap-1 mt-0.5">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            title="Filter applied: click to change"
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <span>{selectedFilter}</span>
          </button>
        </div>
      </div>
      <div
        className="flex items-center gap-0.5 shrink-0"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {extraControls}

        {/* 4 Action Icons: Only visible on widget hover or when filter menu is open */}
        <div
          className={cn(
            "flex items-center gap-0.5 transition-opacity duration-150",
            menuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 group-hover:opacity-100 focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto focus-within:pointer-events-auto",
          )}
        >
          {/* 1. Zio AI Assistant Icon (Opens Slide Panel with Insights) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Ask Zio"
                onClick={handleAskZio}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors flex items-center justify-center"
              >
                <ZioLogo size="xs" className={cn(isMini ? "h-3.5 w-3.5" : "h-4 w-4")} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">Ask Zio</TooltipContent>
          </Tooltip>

          {/* 2. Filter Button (In place of three dots, opens Today/date filter overlay) */}
          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="Filter"
                className={cn(
                  "rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors",
                  menuOpen && "bg-muted text-foreground",
                )}
              >
                <Filter className={cn(isMini ? "h-3 w-3" : "h-3.5 w-3.5")} />
              </button>
            </PopoverTrigger>

            <PopoverContent
              align="end"
              sideOffset={4}
              className="w-40 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl text-slate-800 dark:text-slate-100 z-50 select-none animate-in fade-in-50 zoom-in-95 duration-100"
              onMouseDown={(e) => e.stopPropagation()}
            >
              {/* Today filter options list (Clean options, without top duplicate box) */}
              <div className="space-y-0.5">
                {[
                  "Today",
                  "Yesterday",
                  "This week",
                  "Last week",
                  "This month",
                  "Last month",
                  "Custom",
                ].map((opt) => {
                  const isSelected = selectedFilter === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleFilterSelect(opt)}
                      className={cn(
                        "w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors flex items-center justify-between cursor-pointer",
                        isSelected
                          ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60",
                      )}
                    >
                      <span>{opt}</span>
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          {/* 3. Textual View Icon (taken outside on the right of filter icon) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Textual View"
                onClick={() => setTextualViewOpen(true)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
              >
                <FileText className={cn(isMini ? "h-3 w-3" : "h-3.5 w-3.5")} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">Textual View</TooltipContent>
          </Tooltip>

          {/* 4. Setting Icon (taken outside on the right of filter icon) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Setting"
                onClick={() => setSettingsOpen(true)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
              >
                <Settings className={cn(isMini ? "h-3 w-3" : "h-3.5 w-3.5")} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">Setting</TooltipContent>
          </Tooltip>
        </div>

        {/* 5. Move / Drag Icon (kept in last beside setting) */}
        <div
          title="Drag to rearrange"
          className="p-1 rounded-md text-muted-foreground/30 hover:text-muted-foreground group-hover:text-muted-foreground transition-colors cursor-grab active:cursor-grabbing flex items-center justify-center shrink-0"
        >
          <GripVertical className={cn(isMini ? "h-3.5 w-3.5" : "h-4 w-4")} />
        </div>
      </div>
    </div>
  );

  return (
    <WidgetSizeContext.Provider value={currentSize}>
      <section
        className={cn(
          "group flex h-full w-full min-w-0 flex-col rounded-xl border border-border/80 bg-card text-card-foreground shadow-xs hover:shadow-sm transition-all overflow-hidden",
          className,
        )}
      >
        {header}
        <div
          className={cn(
            "min-w-0 flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:thin] rounded-b-xl",
            currentSize === "compact" || currentSize === "mini"
              ? "p-2.5"
              : settings.density === "compact"
              ? "p-3"
              : "p-4",
          )}
        >
          {children}
        </div>
      </section>

      {/* Textual View Modal */}
      <WidgetTextualModal
        widgetId={id}
        open={textualViewOpen}
        onOpenChange={setTextualViewOpen}
      />

      {/* Widget Settings Modal */}
      <WidgetSettingsModal
        widgetId={id}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </WidgetSizeContext.Provider>
  );
}

function IconBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          onClick={onClick}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent className="text-xs">{label}</TooltipContent>
    </Tooltip>
  );
}
