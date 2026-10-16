import { X } from "lucide-react";
import { useState } from "react";
import { WidgetCard, useWidgetSize } from "@/components/dashboard/WidgetCard";
import { useDashboard } from "@/dashboard/store";
import { highlightEvents } from "@/data/fleet";
import { cn } from "@/lib/utils";

const CHIPS = [
  "Highlights",
  "Distracted Driving",
  "Cellphone Distraction",
  "Eye closed",
];

export function EventsHighlightsWidget() {
  const { activeTab, setTabRange } = useDashboard();
  const size = useWidgetSize();
  const range = activeTab.range;
  const isLarge = size === "large";
  const [violationsOnly, setViolationsOnly] = useState(true);
  const [chips, setChips] = useState<string[]>(["Highlights"]);
  const [showAllChips, setShowAllChips] = useState(false);

  let rows = highlightEvents.filter((e) => e.range.includes(range));
  if (violationsOnly) rows = rows.filter((e) => e.violation);
  const nameChips = chips.filter((c) => c !== "Highlights");
  if (nameChips.length) {
    rows = rows.filter((e) =>
      nameChips.some((c) => e.label.toLowerCase().includes(c.toLowerCase())),
    );
  }
  rows = [...rows].sort((a, b) => b.count - a.count);
  if (!isLarge) {
    rows = rows.slice(0, 5);
  }

  const visibleChips = showAllChips ? CHIPS : CHIPS.slice(0, 3);

  return (
    <WidgetCard
      id="events-highlights"
      info="Most frequent events for the selected filters."
      range={range}
      onRangeChange={(r) => setTabRange(activeTab.id, r)}
      extraControls={
        <button
          type="button"
          onClick={() => setViolationsOnly((v) => !v)}
          className={cn(
            "mr-1 h-7 rounded-lg px-2.5 text-xs font-semibold transition-all cursor-pointer shadow-2xs border",
            violationsOnly
              ? "bg-[#155dfc] text-white border-[#155dfc]"
              : "bg-background text-muted-foreground border-border/80 hover:bg-muted hover:text-foreground",
          )}
        >
          {violationsOnly ? "Violations" : "All events"}
        </button>
      }
    >
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {visibleChips.map((c) => {
          const on = chips.includes(c);
          return (
            <button
              key={c}
              type="button"
              onClick={() =>
                setChips((s) => (on ? s.filter((i) => i !== c) : [...s, c]))
              }
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all shadow-2xs cursor-pointer",
                on
                  ? "border-[#155dfc] bg-[#155dfc]/10 text-[#155dfc] font-semibold"
                  : "border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {c}
              {on ? <X className="h-3 w-3" /> : null}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setShowAllChips((s) => !s)}
          className="text-xs font-semibold text-primary underline-offset-2 hover:underline cursor-pointer px-1"
        >
          {showAllChips ? "See less" : `See ${CHIPS.length - 3}+`}
        </button>
        {(chips.length > 0 || !violationsOnly) && (
          <button
            type="button"
            onClick={() => {
              setChips([]);
              setViolationsOnly(true);
            }}
            className="ml-auto text-xs font-medium text-muted-foreground hover:text-foreground underline-offset-2 hover:underline cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="py-10 text-center text-xs text-muted-foreground">
          No events match these filters.
        </p>
      ) : (
        <ul className="divide-y divide-border/50">
          {rows.map((e) => (
            <li
              key={e.id}
              className="flex items-center gap-3.5 py-2.5 px-1 transition-colors hover:bg-muted/30 cursor-pointer"
            >
              <span
                className="h-10 w-14 shrink-0 rounded bg-slate-700/80 dark:bg-slate-800"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.35 0.04 260), oklch(0.25 0.05 265))",
                }}
              />
              <span className="min-w-0 flex-1 truncate text-xs font-semibold text-foreground">
                {e.label}
              </span>
              <span className="pr-2 text-base font-bold tabular-nums text-foreground">
                {String(e.count).padStart(2, "0")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </WidgetCard>
  );
}
