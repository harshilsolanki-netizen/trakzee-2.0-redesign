import { FileDown, GripHorizontal, Info, Maximize2, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDashboard } from "@/dashboard/store";
import { RANGE_LABEL, type Range } from "@/data/fleet";
import { widgetMeta, type WidgetId } from "@/dashboard/widgets";
import { cn } from "@/lib/utils";

const RANGES: Range[] = ["today", "7d", "30d"];

export function WidgetCard({
  id,
  info,
  className,
  children,
  range,
  onRangeChange,
  extraControls,
}: {
  id: WidgetId;
  info?: string;
  className?: string;
  children: ReactNode;
  range?: Range;
  onRangeChange?: (r: Range) => void;
  extraControls?: ReactNode;
}) {
  const meta = widgetMeta(id);
  const { activeTab, toggleWidget, settings } = useDashboard();
  const [expanded, setExpanded] = useState(false);

  const header = (
    <div className="flex items-center justify-between gap-2 border-b border-border/60 bg-card px-4 py-2 select-none shrink-0 min-h-[42px] cursor-grab active:cursor-grabbing">
      <div className="flex items-center gap-2 min-w-0">
        <GripHorizontal className="h-3.5 w-3.5 text-muted-foreground/40 hover:text-muted-foreground transition-colors shrink-0" />
        <h2 className="text-[13px] font-semibold text-foreground tracking-tight whitespace-nowrap">
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
                <Info className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-64 text-xs">{info}</TooltipContent>
          </Tooltip>
        ) : null}
      </div>
      <div
        className="flex items-center gap-1.5 shrink-0"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {extraControls}
        {meta.hasRange && range && onRangeChange ? (
          <select
            aria-label={`${meta.title} range`}
            value={range}
            onChange={(e) => onRangeChange(e.target.value as Range)}
            className="h-6.5 rounded-md border border-border/80 bg-background px-1.5 text-[11px] font-medium text-foreground cursor-pointer shadow-2xs hover:border-border focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
          >
            {RANGES.map((r) => (
              <option key={r} value={r}>
                {RANGE_LABEL[r]}
              </option>
            ))}
          </select>
        ) : null}
        <div className="flex items-center gap-0.5 text-muted-foreground">
          <IconBtn
            label="Export widget"
            onClick={() => toast.success(`${meta.title} exported as CSV`)}
          >
            <FileDown className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn label="Expand widget" onClick={() => setExpanded(true)}>
            <Maximize2 className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn
            label="Remove widget"
            onClick={() => {
              toggleWidget(activeTab.id, id);
              toast("Widget removed", {
                description: meta.title,
                action: {
                  label: "Undo",
                  onClick: () => toggleWidget(activeTab.id, id),
                },
              });
            }}
          >
            <X className="h-3.5 w-3.5" />
          </IconBtn>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <section
        className={cn(
          "flex min-w-0 flex-col rounded-xl border border-border/80 bg-card text-card-foreground shadow-xs hover:shadow-sm transition-all overflow-hidden",
          className,
        )}
      >
        {header}
        <div
          className={cn(
            "min-w-0 flex-1 bg-card",
            settings.density === "compact" ? "p-3" : "p-4",
          )}
        >
          {children}
        </div>
      </section>

      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent className="max-w-[min(1200px,95vw)] rounded-2xl border border-border/80 bg-background shadow-2xl p-6">
          <DialogHeader className="border-b border-border/70 pb-3">
            <DialogTitle className="text-[16px] font-semibold text-foreground">
              {meta.title}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[75vh] overflow-auto pt-4">{children}</div>
        </DialogContent>
      </Dialog>
    </>
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
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer active:scale-95"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent className="text-xs">{label}</TooltipContent>
    </Tooltip>
  );
}
