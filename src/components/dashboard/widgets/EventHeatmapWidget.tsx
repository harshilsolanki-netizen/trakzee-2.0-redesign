import { useState } from "react";
import { Flame, MapPin, AlertTriangle, ShieldCheck } from "lucide-react";
import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { useDashboard } from "@/dashboard/store";
import { cn } from "@/lib/utils";

// Time of day columns x Days of week rows for heatmap
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_SLOTS = ["00-06", "06-12", "12-18", "18-24"];

// Alert density matrix (simulated realistic telematics density)
const HEAT_DATA: Record<string, Record<string, number>> = {
  Mon: { "00-06": 2, "06-12": 14, "12-18": 26, "18-24": 11 },
  Tue: { "00-06": 4, "06-12": 18, "12-18": 32, "18-24": 15 },
  Wed: { "00-06": 3, "06-12": 21, "12-18": 38, "18-24": 19 },
  Thu: { "00-06": 5, "06-12": 24, "12-18": 42, "18-24": 22 },
  Fri: { "00-06": 6, "06-12": 29, "12-18": 48, "18-24": 31 },
  Sat: { "00-06": 8, "06-12": 16, "12-18": 22, "18-24": 18 },
  Sun: { "00-06": 3, "06-12": 8, "12-18": 12, "18-24": 9 },
};

const HOTSPOTS = [
  { name: "NH-48 Port Express Bypass", alerts: 48, risk: "Critical", icon: Flame },
  { name: "Outer Ring Road Exit 9", alerts: 34, risk: "High", icon: AlertTriangle },
  { name: "Central Depot Logistics Gate", alerts: 19, risk: "Medium", icon: MapPin },
];

function getHeatColor(val: number) {
  if (val >= 35) return "bg-rose-500 text-white font-bold";
  if (val >= 25) return "bg-amber-500 text-white font-bold";
  if (val >= 15) return "bg-amber-500/40 text-foreground font-medium";
  if (val >= 5) return "bg-blue-500/25 text-foreground";
  return "bg-muted text-muted-foreground";
}

export function EventHeatmapWidget() {
  const { activeTab, setTabRange } = useDashboard();
  const range = activeTab.range;
  const [selectedCell, setSelectedCell] = useState<{ day: string; slot: string; val: number } | null>(null);

  return (
    <WidgetCard
      id="event-heatmap"
      info="Geographic and temporal hot zones of critical safety alerts across the active fleet."
      range={range}
      onRangeChange={(r) => setTabRange(activeTab.id, r)}
    >
      <div className="flex flex-col h-full min-h-0 justify-between gap-1 select-none">
        {/* Top Summary Banner */}
        <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-muted/40 border border-border/60 text-xs">
          <div className="flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-rose-500" />
            <span className="font-semibold text-foreground">Peak Danger Window:</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold">Fri, 12:00 - 18:00</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
            <span>Total Hotspots:</span>
            <strong className="text-foreground font-bold">18 Zones</strong>
          </div>
        </div>

        {/* Temporal Heatmap Matrix Grid */}
        <div className="pt-2">
          <div className="grid grid-cols-5 gap-1 text-[11px] text-center font-semibold text-muted-foreground mb-1">
            <span className="text-left pl-1">Day</span>
            {TIME_SLOTS.map((slot) => (
              <span key={slot}>{slot}h</span>
            ))}
          </div>

          <div className="space-y-1">
            {DAYS.map((day) => (
              <div key={day} className="grid grid-cols-5 gap-1 items-center">
                <span className="text-[11px] font-bold text-muted-foreground pl-1 text-left">
                  {day}
                </span>
                {TIME_SLOTS.map((slot) => {
                  const val = HEAT_DATA[day]?.[slot] ?? 0;
                  const isSelected = selectedCell?.day === day && selectedCell?.slot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedCell({ day, slot, val })}
                      className={cn(
                        "h-5 rounded text-[11px] flex items-center justify-center transition-all cursor-pointer hover:ring-1 hover:ring-[#0089FF]",
                        getHeatColor(val),
                        isSelected && "ring-2 ring-primary scale-105 z-10",
                      )}
                      title={`${day} ${slot}h: ${val} events`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Top Hotspots Bar */}
        <div className="pt-2 border-t border-border/60">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-semibold text-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3 text-[#0089FF]" />
              Top Incident Corridors
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">Real-time GPS correlation</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {HOTSPOTS.map((h, idx) => (
              <div
                key={idx}
                className="rounded-md border border-border/70 bg-card p-1.5 flex flex-col justify-between hover:border-primary/50 transition-colors"
              >
                <span className="text-[11px] font-semibold text-foreground truncate" title={h.name}>
                  {h.name}
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] text-muted-foreground font-mono">{h.alerts} alerts</span>
                  <span
                    className={cn(
                      "text-[11px] font-bold px-1 rounded",
                      h.risk === "Critical"
                        ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                        : h.risk === "High"
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          : "bg-blue-500/15 text-blue-600 dark:text-blue-400",
                    )}
                  >
                    {h.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}
