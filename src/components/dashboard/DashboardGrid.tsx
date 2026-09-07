import { useState, type ReactElement } from "react";
import { toast } from "sonner";
import { useDashboard } from "@/dashboard/store";
import { CameraStatusWidget } from "./widgets/CameraStatusWidget";
import { EventsDistributionWidget } from "./widgets/EventsDistributionWidget";
import { EventsHighlightsWidget } from "./widgets/EventsHighlightsWidget";
import { FleetScoreWidget } from "./widgets/FleetScoreWidget";
import { RiskyDriversWidget } from "./widgets/RiskyDriversWidget";
import { ScoreDistributionWidget } from "./widgets/ScoreDistributionWidget";
import { WidgetCard } from "./WidgetCard";
import type { WidgetId } from "@/dashboard/widgets";
import { cn } from "@/lib/utils";

function EventTrendWidget() {
  return (
    <WidgetCard
      id="event-trend"
      info="Trend of DMS and ADAS safety events over time"
    >
      <div className="h-[260px] flex flex-col justify-center px-1 py-4 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              DMS Drowsiness & Distraction
            </span>
            <span className="font-bold text-rose-500">14 events (-12%)</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-rose-500 h-2 rounded-full w-[45%]" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              ADAS Forward Collision Warning
            </span>
            <span className="font-bold text-amber-500">8 events (-25%)</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-amber-500 h-2 rounded-full w-[28%]" />
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}

function FleetStatusWidget() {
  return (
    <WidgetCard
      id="fleet-status"
      info="Real-time vehicle operating status breakdown"
    >
      <div className="grid grid-cols-2 gap-2 p-3 text-xs">
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2.5">
          <span className="text-[10px] text-muted-foreground block font-medium">
            Running
          </span>
          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
            26
          </span>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2.5">
          <span className="text-[10px] text-muted-foreground block font-medium">
            Idle
          </span>
          <span className="text-base font-extrabold text-amber-600 dark:text-amber-400">
            2
          </span>
        </div>
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2.5">
          <span className="text-[10px] text-muted-foreground block font-medium">
            Stopped
          </span>
          <span className="text-base font-extrabold text-rose-600 dark:text-rose-400">
            15
          </span>
        </div>
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-2.5">
          <span className="text-[10px] text-muted-foreground block font-medium">
            Inactive
          </span>
          <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
            65
          </span>
        </div>
      </div>
    </WidgetCard>
  );
}

function GenericActivityWidget({ id, title }: { id: WidgetId; title: string }) {
  return (
    <WidgetCard id={id} info={title + " live telematics streaming"}>
      <div className="h-36 flex flex-col items-center justify-center text-center p-3 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{title}</span>
        <span className="text-[11px] mt-1">
          Live telemetry streaming across active fleet
        </span>
      </div>
    </WidgetCard>
  );
}

const MAP: Record<WidgetId, () => ReactElement> = {
  "event-trend": EventTrendWidget,
  "events-distribution": EventsDistributionWidget,
  "events-highlights": EventsHighlightsWidget,
  "fleet-score": FleetScoreWidget,
  "score-distribution": ScoreDistributionWidget,
  "risky-drivers": RiskyDriversWidget,
  "event-heatmap": () => (
    <GenericActivityWidget id="event-heatmap" title="Event Heatmap" />
  ),
  "fleet-status": FleetStatusWidget,
  "fleet-usage": () => (
    <GenericActivityWidget id="fleet-usage" title="Fleet Usage" />
  ),
  "fleet-idle": () => (
    <GenericActivityWidget id="fleet-idle" title="Fleet Idle" />
  ),
  "fleet-fuel": () => (
    <GenericActivityWidget id="fleet-fuel" title="Fleet Fuel" />
  ),
  "fleet-workload": () => (
    <GenericActivityWidget id="fleet-workload" title="Fleet Workload" />
  ),
  "driver-most-alerts": () => (
    <GenericActivityWidget
      id="driver-most-alerts"
      title="Driver With Most Alerts"
    />
  ),
  "object-most-alerts": () => (
    <GenericActivityWidget
      id="object-most-alerts"
      title="Object With Most Alerts"
    />
  ),
  "object-mode": () => (
    <GenericActivityWidget id="object-mode" title="Object Mode" />
  ),
  "camera-status": CameraStatusWidget,
};

export function DashboardGrid() {
  const { activeTab, reorderWidgets } = useDashboard();
  const [draggedWidgetId, setDraggedWidgetId] = useState<WidgetId | null>(null);
  const [overWidgetId, setOverWidgetId] = useState<WidgetId | null>(null);

  if (activeTab.widgets.length === 0) {
    return (
      <div className="m-4 rounded-xl border border-dashed border-border bg-card p-12 text-center text-xs">
        <p className="font-bold text-foreground text-sm">
          No widgets on this dashboard
        </p>
        <p className="mt-1 text-muted-foreground">
          Click the <strong>Configuration</strong> button on the top right to
          select widgets.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
      {activeTab.widgets.map((id) => {
        const Widget = MAP[id] ?? FleetScoreWidget;
        const isDragging = draggedWidgetId === id;
        const isOver = overWidgetId === id && draggedWidgetId !== id;

        return (
          <div
            key={id}
            draggable
            onDragStart={(e) => {
              setDraggedWidgetId(id);
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", id);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              if (draggedWidgetId && draggedWidgetId !== id) {
                setOverWidgetId(id);
              }
            }}
            onDragLeave={() => {
              setOverWidgetId((prev) => (prev === id ? null : prev));
            }}
            onDrop={(e) => {
              e.preventDefault();
              const fromId = (draggedWidgetId ??
                e.dataTransfer.getData("text/plain")) as WidgetId;
              if (fromId && fromId !== id) {
                reorderWidgets(activeTab.id, fromId, id);
                toast.success("Widget reordered");
              }
              setDraggedWidgetId(null);
              setOverWidgetId(null);
            }}
            onDragEnd={() => {
              setDraggedWidgetId(null);
              setOverWidgetId(null);
            }}
            className={cn(
              "transition-all duration-200 select-none rounded-xl relative",
              isDragging && "opacity-30 scale-[0.98] ring-2 ring-[#0089FF]/40",
              isOver && "ring-2 ring-[#0089FF] shadow-xl scale-[1.01] z-10",
            )}
          >
            <Widget />
          </div>
        );
      })}
    </div>
  );
}
