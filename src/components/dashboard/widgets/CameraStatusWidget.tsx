import { AlertTriangle, Video, VideoOff } from "lucide-react";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { cameraStatus } from "@/data/fleet";
import { cn } from "@/lib/utils";

type Key = "online" | "offline" | "videoLoss" | "tampered";

const CARDS: { key: Key; label: string; className: string }[] = [
  {
    key: "online",
    label: "Online",
    className: "bg-success/10 border-success/30 text-success",
  },
  {
    key: "offline",
    label: "Offline",
    className: "bg-danger/10 border-danger/30 text-danger",
  },
  {
    key: "videoLoss",
    label: "Video Loss",
    className: "bg-warning/20 border-warning/40 text-warning-foreground",
  },
  {
    key: "tampered",
    label: "Tampered",
    className: "bg-muted border-border text-muted-foreground",
  },
];

export function CameraStatusWidget() {
  const [focus, setFocus] = useState<Key>("online");
  const total = Object.values(cameraStatus).reduce((a, b) => a + b, 0);
  const value = cameraStatus[focus];
  const pct = Math.round((value / total) * 100);

  return (
    <WidgetCard id="camera-status" info="Live camera health across the fleet.">
      <div className="flex min-w-0 items-center gap-4">
        <div className="relative h-[220px] min-w-0 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: focus, value },
                  { name: "rest", value: total - value },
                ]}
                dataKey="value"
                innerRadius="72%"
                outerRadius="94%"
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                <Cell fill="var(--color-success)" />
                <Cell fill="var(--color-border)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-semibold tabular-nums text-foreground">
              {pct}%
            </span>
            <span className="text-xs text-muted-foreground">
              {CARDS.find((c) => c.key === focus)!.label.toLowerCase()} cameras
            </span>
          </div>
        </div>

        <div className="w-[180px] shrink-0 space-y-2">
          {CARDS.map((c) => {
            const Icon =
              c.key === "online"
                ? Video
                : c.key === "tampered"
                  ? AlertTriangle
                  : VideoOff;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setFocus(c.key)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border p-2.5 text-left transition-all cursor-pointer shadow-2xs active:scale-98",
                  c.className,
                  focus === c.key
                    ? "ring-2 ring-primary/40 shadow-sm"
                    : "opacity-85 hover:opacity-100",
                )}
              >
                <span>
                  <span className="block text-xs font-semibold">{c.label}</span>
                  <span className="block text-base font-bold tabular-nums font-mono">
                    {cameraStatus[c.key]}
                  </span>
                </span>
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </div>
    </WidgetCard>
  );
}
