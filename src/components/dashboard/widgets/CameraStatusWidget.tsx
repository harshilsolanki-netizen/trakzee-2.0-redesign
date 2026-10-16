import { AlertTriangle, ShieldAlert, Video, VideoOff } from "lucide-react";
import React, { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { WidgetDrilldownModal } from "@/components/dashboard/WidgetDrilldownModal";
import { CAMERA_STATUS_DRILLDOWN } from "@/data/widgetDrilldownData";
import { cn } from "@/lib/utils";

const CAMERA_DATA = {
  total: 150,
  pctOnline: 44,
  online: 66,
  offline: 35,
  videoLoss: 45,
  tampered: 4,
};

const CARDS = [
  { key: "online", label: "Online", count: CAMERA_DATA.online, color: "#10b981", className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400", icon: Video },
  { key: "offline", label: "Offline", count: CAMERA_DATA.offline, color: "#ef4444", className: "bg-rose-500/10 text-rose-700 dark:text-rose-400", icon: VideoOff },
  { key: "videoLoss", label: "Video Loss", count: CAMERA_DATA.videoLoss, color: "#f59e0b", className: "bg-amber-500/10 text-amber-700 dark:text-amber-400", icon: VideoOff },
  { key: "tampered", label: "Tampered", count: CAMERA_DATA.tampered, color: "#64748b", className: "bg-slate-500/10 text-slate-700 dark:text-slate-400", icon: AlertTriangle },
];

function CustomCameraTooltip({ active, payload, coordinate }: any) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0];
  const isLeft = (coordinate?.x ?? 0) > 112;

  return (
    <div className="relative z-50 rounded-xl border border-border/80 bg-popover px-3 py-2 text-popover-foreground shadow-2xl pointer-events-none min-w-[120px] animate-in fade-in-0 zoom-in-95">
      {/* Pointer arrow pointing directly at the hovered slice */}
      <span
        className={`absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-popover ${
          isLeft
            ? "-right-[6px] border-t border-r border-border/80"
            : "-left-[6px] border-b border-l border-border/80"
        }`}
      />
      <div className="relative z-10 flex items-center gap-2 mb-1">
        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: data.payload.fill }} />
        <span className="text-xs font-bold text-foreground">{data.name}</span>
      </div>
      <div className="relative z-10 font-mono text-base font-black text-foreground">
        {data.value} Cameras
      </div>
    </div>
  );
}

export function CameraStatusWidget() {
  const [focus, setFocus] = useState<string>("online");
  const [drilldownCategory, setDrilldownCategory] = useState<string | null>(null);

  const handleCardClick = (card: typeof CARDS[0]) => {
    setFocus(card.key);
    setDrilldownCategory(card.label);
  };

  const selectedCard = drilldownCategory
    ? CARDS.find((c) => c.label === drilldownCategory)
    : null;

  return (
    <>
      <WidgetCard id="camera-status" info="Real-time camera sensor connectivity and health. Click any status to inspect camera streams.">
        <div className="flex items-center justify-between h-full min-h-0 select-none gap-3">
          {/* Donut Chart */}
          <div className="relative h-[225px] w-[225px] shrink-0 my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  content={<CustomCameraTooltip />}
                  wrapperStyle={{ outline: "none", zIndex: 50, pointerEvents: "none" }}
                />
                <Pie
                  data={[
                    { name: "Online", value: CAMERA_DATA.online, fill: "#10b981" },
                    { name: "Offline / Rest", value: CAMERA_DATA.total - CAMERA_DATA.online, fill: "#94a3b830" },
                  ]}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={108}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                  onClick={(entry) => {
                    if (entry.name === "Online") setDrilldownCategory("Online");
                    else setDrilldownCategory("Offline");
                  }}
                  className="cursor-pointer outline-none"
                >
                  <Cell fill="#10b981" className="cursor-pointer" />
                  <Cell fill="#94a3b830" className="cursor-pointer" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black font-mono text-foreground leading-tight">
                {CAMERA_DATA.pctOnline}%
              </span>
              <span className="text-[12px] text-muted-foreground uppercase font-bold tracking-wider text-center leading-tight mt-0.5">
                Online Cameras
              </span>
            </div>
          </div>

          {/* Small Compact Status Cards on Right */}
          <div className="flex-1 min-w-0 max-w-[170px] space-y-1.5 my-auto pr-1">
            {CARDS.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => handleCardClick(c)}
                  title={`${c.label} (${c.count})`}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg py-1.5 px-2.5 text-left transition-all cursor-pointer",
                    c.className,
                    focus === c.key ? "ring-1 ring-primary/40 shadow-xs scale-[1.02]" : "opacity-90 hover:opacity-100 hover:scale-[1.01]",
                  )}
                >
                  <div className="min-w-0">
                    <span className="text-[12px] font-medium block truncate">{c.label}</span>
                    <span className="font-mono text-[14px] font-semibold block leading-tight">{c.count}</span>
                  </div>
                  <Icon className="h-4 w-4 shrink-0 opacity-70" />
                </button>
              );
            })}
          </div>
        </div>
      </WidgetCard>

      {/* Drilldown Modal */}
      {drilldownCategory && (
        <WidgetDrilldownModal
          open={!!drilldownCategory}
          onOpenChange={(open) => !open && setDrilldownCategory(null)}
          widgetTitle="Camera Status"
          category={drilldownCategory}
          color={selectedCard?.color ?? "#10b981"}
          count={selectedCard?.count ?? 0}
          vehicles={CAMERA_STATUS_DRILLDOWN[drilldownCategory] || []}
        />
      )}
    </>
  );
}

