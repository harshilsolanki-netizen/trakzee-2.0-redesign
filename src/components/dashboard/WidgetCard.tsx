import {
  GripHorizontal,
  Info,
  FileText,
} from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDashboard } from "@/dashboard/store";
import { RANGE_LABEL, type Range } from "@/data/fleet";
import {
  widgetMeta,
  type WidgetId,
  type WidgetSize,
  WIDGET_SIZE_META,
} from "@/dashboard/widgets";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { WidgetTextualModal } from "./WidgetTextualModal";
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
  const { settings, activeTab, setWidgetSize } = useDashboard();
  const [textualViewOpen, setTextualViewOpen] = useState(false);

  const currentSize: WidgetSize =
    activeTab?.widgetSizes?.[id] || meta.defaultSize || "medium";
  const isMini = currentSize === "mini";

  const header = (
    <div
      className={cn(
        "flex items-center justify-between border-b border-border/60 bg-transparent rounded-t-xl select-none shrink-0 cursor-grab active:cursor-grabbing",
        isMini ? "px-2 py-1 min-h-[32px] gap-1" : "px-3 py-1.5 min-h-[38px] gap-1.5",
        headerClassName,
      )}
    >
      <div className="flex items-center gap-1 min-w-0">
        <GripHorizontal className={cn(isMini ? "h-3 w-3" : "h-3.5 w-3.5", "text-muted-foreground/40 hover:text-muted-foreground transition-colors shrink-0")} />
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
      <div
        className="flex items-center gap-1 shrink-0"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {extraControls}
        {meta.hasRange && range && onRangeChange ? (
          <div className="w-22">
            <SelectDropdown
              value={range}
              options={RANGES.map((r) => ({ label: RANGE_LABEL[r], value: r }))}
              onChange={(v) => onRangeChange(v as Range)}
              triggerClassName="h-6 px-1.5 text-[11px]"
              menuClassName="w-26 right-0 left-auto"
            />
          </div>
        ) : null}

        {/* Widget Size Selector (0.5x0.5, 1x0.5, 1x1, 2x1, 2x2) */}
        <div className={isMini ? "w-[56px]" : "w-[72px]"}>
          <SelectDropdown
            value={currentSize === "full" ? "medium" : currentSize}
            options={[
              { label: "0.5×0.5", value: "mini" },
              { label: "1×0.5", value: "compact" },
              { label: "1×1", value: "small" },
              { label: "2×1", value: "medium" },
              { label: "2×2", value: "large" },
            ]}
            onChange={(v) => setWidgetSize(activeTab.id, id, v as WidgetSize)}
            triggerClassName={isMini ? "h-6 px-1 text-[10px] font-mono" : "h-6 px-1.5 text-[11px] font-mono"}
            menuClassName="w-24 right-0 left-auto"
          />
        </div>

        <div className="flex items-center gap-0.5 text-muted-foreground">
          {/* Textual View Button (Opens Data Table Modal) */}
          <IconBtn
            label="Textual View"
            onClick={() => setTextualViewOpen(true)}
          >
            <FileText className={cn(isMini ? "h-3 w-3" : "h-3.5 w-3.5", "hover:text-foreground transition-colors")} />
          </IconBtn>
        </div>
      </div>
    </div>
  );

  return (
    <WidgetSizeContext.Provider value={currentSize}>
      <section
        className={cn(
          "flex h-full w-full min-w-0 flex-col rounded-xl border border-border/80 bg-card text-card-foreground shadow-xs hover:shadow-sm transition-all overflow-hidden",
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
