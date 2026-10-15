import { useState } from "react";
import { Flame } from "lucide-react";
import { WidgetCard } from "@/components/dashboard/WidgetCard";
import type { WidgetId } from "@/dashboard/widgets";
import { cn } from "@/lib/utils";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));

// Generate simulated matrix matching the red intensity grid in reference image
const SEED_HEAT: Record<string, number[]> = {
  Sun: [2, 0, 1, 4, 2, 0, 1, 3, 6, 8, 12, 10, 8, 6, 4, 8, 11, 14, 18, 12, 8, 6, 4, 1],
  Mon: [1, 2, 0, 2, 4, 1, 3, 8, 14, 18, 22, 16, 12, 14, 16, 18, 20, 24, 22, 16, 10, 6, 2, 1],
  Tue: [3, 1, 0, 1, 3, 2, 4, 12, 20, 26, 28, 22, 18, 20, 24, 26, 28, 30, 24, 18, 12, 8, 4, 2],
  Wed: [2, 0, 1, 2, 4, 1, 6, 14, 22, 24, 26, 20, 16, 18, 22, 24, 26, 28, 22, 16, 10, 6, 3, 1],
  Thu: [1, 2, 1, 3, 5, 2, 8, 16, 24, 28, 30, 24, 20, 22, 26, 28, 32, 34, 26, 18, 12, 7, 4, 2],
  Fri: [4, 2, 1, 24, 6, 3, 10, 18, 28, 34, 38, 28, 24, 26, 30, 32, 36, 42, 30, 22, 14, 9, 5, 3],
  Sat: [3, 1, 2, 5, 3, 1, 4, 8, 12, 16, 18, 14, 10, 12, 14, 16, 20, 22, 18, 14, 8, 5, 3, 1],
};

function getHeatColor(val: number) {
  if (val >= 28) return "bg-rose-600 text-white font-bold";
  if (val >= 20) return "bg-rose-500 text-white font-bold";
  if (val >= 12) return "bg-rose-400 text-white";
  if (val >= 6) return "bg-rose-300 dark:bg-rose-800 text-foreground";
  if (val >= 2) return "bg-rose-100 dark:bg-rose-950/60 text-foreground";
  return "bg-muted/40 text-transparent";
}

export function AlertHeatmapWidget({ id = "alert-heat-map" }: { id?: WidgetId }) {
  const [hovered, setHovered] = useState<{ day: string; hour: string; val: number } | null>(null);

  return (
    <WidgetCard
      id={id}
      info="7 days × 24 hours temporal alert heat map showing peak danger windows."
    >
      <div className="flex flex-col h-full min-h-0 justify-between select-none py-1">
        {/* Hour Header Numbers */}
        <div className="grid grid-cols-25 gap-1 text-center text-[14px] font-mono text-muted-foreground pb-1.5 border-b border-border/40">
          <span className="text-left font-bold text-foreground text-[14px]">Day</span>
          {HOURS.map((h) => (
            <span key={h} className="leading-tight text-[14px]">{h}</span>
          ))}
        </div>

        {/* 7 Days Matrix Rows */}
        <div className="space-y-1.5 pt-1.5 flex-1 flex flex-col justify-around">
          {DAYS.map((day) => {
            const row = SEED_HEAT[day] || [];
            return (
              <div key={day} className="grid grid-cols-25 gap-1 items-center">
                <span className="text-[14px] font-mono font-bold text-foreground text-left leading-none">
                  {day}
                </span>
                {HOURS.map((hour, idx) => {
                  const val = row[idx] ?? 0;
                  return (
                    <div
                      key={hour}
                      onMouseEnter={() => setHovered({ day, hour, val })}
                      className={cn(
                        "h-6 rounded-[3px] transition-all cursor-pointer flex items-center justify-center text-[11px]",
                        getHeatColor(val),
                        hovered?.day === day && hovered?.hour === hour && "ring-2 ring-primary scale-110 z-10 shadow-sm",
                      )}
                      title={`${day} ${hour}:00 - ${val} alerts`}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </WidgetCard>
  );
}
