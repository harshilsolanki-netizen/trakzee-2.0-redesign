import {
  BarChart2,
  BarChart3,
  BarChartHorizontal,
  ChartLine,
  ChartPie,
  Pin,
  PinOff,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type ChartType =
  | "column"
  | "bar-horizontal"
  | "pie"
  | "line"
  | "stacked-column"
  | "stacked-bar"
  | "donut";

const TYPES: { id: ChartType; label: string; icon: typeof BarChart3 }[] = [
  { id: "column", label: "Column chart", icon: BarChart3 },
  { id: "bar-horizontal", label: "Horizontal bar", icon: BarChartHorizontal },
  { id: "pie", label: "Pie chart", icon: ChartPie },
  { id: "line", label: "Line chart", icon: ChartLine },
  { id: "stacked-column", label: "Stacked column", icon: BarChart2 },
  { id: "stacked-bar", label: "Stacked bar", icon: BarChartHorizontal },
  { id: "donut", label: "Donut chart", icon: ChartPie },
];

/**
 * Right-edge chart type toolbar using the spacer pattern:
 * pinned → a 44px spacer reserves space and the panel sits beside the chart;
 * unpinned → spacer collapses, panel slides off-canvas and re-opens on hover
 * of a 15px trigger zone at the right edge.
 */
export function ChartTypeToolbar({
  chartType,
  onChange,
}: {
  chartType: ChartType;
  onChange: (t: ChartType) => void;
}) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const shown = pinned || hovered;

  return (
    <>
      {/* spacer: physically pushes the chart only while pinned */}
      <div
        aria-hidden
        className={cn(
          "shrink-0 transition-[width] duration-300",
          pinned ? "w-11" : "w-0",
        )}
      />

      {!pinned ? (
        <div
          aria-hidden
          onMouseEnter={() => setHovered(true)}
          className="absolute inset-y-0 right-0 z-30 w-[15px]"
        />
      ) : null}

      <div
        role="toolbar"
        aria-label="Chart type"
        aria-orientation="vertical"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "absolute inset-y-0 right-0 z-40 flex w-11 flex-col items-center gap-1 border-l border-border bg-surface py-2 shadow-lg transition-transform duration-300 ease-out",
          shown ? "translate-x-0" : "translate-x-full",
        )}
      >
        <button
          type="button"
          aria-label={pinned ? "Unpin toolbar" : "Pin toolbar"}
          aria-pressed={pinned}
          onClick={() => setPinned((p) => !p)}
          className={cn(
            "rounded p-1.5 transition-colors duration-150",
            pinned
              ? "bg-brand text-brand-foreground"
              : "text-muted-foreground hover:bg-muted",
          )}
        >
          {pinned ? (
            <PinOff className="h-4 w-4" />
          ) : (
            <Pin className="h-4 w-4" />
          )}
        </button>
        <div className="my-0.5 h-px w-6 bg-border" />
        {TYPES.map((t) => {
          const Icon = t.icon;
          const active = chartType === t.id;
          return (
            <button
              key={t.id}
              type="button"
              aria-label={t.label}
              aria-pressed={active}
              title={t.label}
              onClick={() => onChange(t.id)}
              className={cn(
                "rounded p-1.5 transition-colors duration-150",
                active
                  ? "bg-brand text-brand-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon
                className={cn("h-4 w-4", t.id === "stacked-bar" && "rotate-90")}
              />
            </button>
          );
        })}
      </div>
    </>
  );
}
