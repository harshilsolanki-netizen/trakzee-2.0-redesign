import { Gauge, Navigation, Snowflake, Flame, Bell, ShieldAlert, type LucideIcon } from "lucide-react";
import { WidgetCard, useWidgetSize } from "@/components/dashboard/WidgetCard";
import { ALARM_TILES_DATA } from "@/data/oldAppFleet";
import type { WidgetId } from "@/dashboard/widgets";
import { cn } from "@/lib/utils";

interface AlarmWidgetConfig {
  id: WidgetId;
  dataId: string;
  title: string;
  icon: LucideIcon;
  info: string;
  theme: {
    cardBg: string;
    border: string;
    text: string;
    badgeBg: string;
    iconColor: string;
  };
}

const CONFIGS: Record<string, AlarmWidgetConfig> = {
  "overspeed-alarm": {
    id: "overspeed-alarm",
    dataId: "overspeed",
    title: "Overspeed",
    icon: Gauge,
    info: "Real-time overspeed threshold alarms and violation volume.",
    theme: {
      cardBg: "bg-rose-500/10 dark:bg-rose-950/25",
      border: "border-rose-500/30 dark:border-rose-500/20",
      text: "text-rose-600 dark:text-rose-400",
      badgeBg: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/25",
      iconColor: "text-rose-600 dark:text-rose-400",
    },
  },
  "harsh-cornering-alarm": {
    id: "harsh-cornering-alarm",
    dataId: "harsh-cornering",
    title: "Harsh Cornering",
    icon: Navigation,
    info: "Centrifugal force and aggressive cornering violation volume.",
    theme: {
      cardBg: "bg-blue-500/10 dark:bg-blue-950/25",
      border: "border-blue-500/30 dark:border-blue-500/20",
      text: "text-blue-600 dark:text-blue-400",
      badgeBg: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/25",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
  },
  "ac-freeze-alarm": {
    id: "ac-freeze-alarm",
    dataId: "ac-freeze",
    title: "AC / Freeze",
    icon: Snowflake,
    info: "Reefer temperature compliance and cabin climate freeze alarms.",
    theme: {
      cardBg: "bg-cyan-500/10 dark:bg-cyan-950/25",
      border: "border-cyan-500/30 dark:border-cyan-500/20",
      text: "text-cyan-600 dark:text-cyan-400",
      badgeBg: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/25",
      iconColor: "text-cyan-600 dark:text-cyan-400",
    },
  },
  "high-temp-alarm": {
    id: "high-temp-alarm",
    dataId: "high-temp",
    title: "High Temperature",
    icon: Flame,
    info: "Engine coolant overheating and thermal threshold warnings.",
    theme: {
      cardBg: "bg-amber-500/10 dark:bg-amber-950/25",
      border: "border-amber-500/30 dark:border-amber-500/20",
      text: "text-amber-600 dark:text-amber-400",
      badgeBg: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/25",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  },
  "panic-sos-alarm": {
    id: "panic-sos-alarm",
    dataId: "panic-sos",
    title: "Panic SOS",
    icon: Bell,
    info: "Driver emergency panic button SOS alert triggers.",
    theme: {
      cardBg: "bg-emerald-500/10 dark:bg-emerald-950/25",
      border: "border-emerald-500/30 dark:border-emerald-500/20",
      text: "text-emerald-600 dark:text-emerald-400",
      badgeBg: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
  },
  "collision-alarm": {
    id: "collision-alarm",
    dataId: "collision",
    title: "Collision Warning",
    icon: ShieldAlert,
    info: "Impact sensor triggers and collision proximity warnings.",
    theme: {
      cardBg: "bg-teal-500/10 dark:bg-teal-950/25",
      border: "border-teal-500/30 dark:border-teal-500/20",
      text: "text-teal-600 dark:text-teal-400",
      badgeBg: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/25",
      iconColor: "text-teal-600 dark:text-teal-400",
    },
  },
};

function MiniAlarmBase({ widgetKey }: { widgetKey: string }) {
  const cfg = CONFIGS[widgetKey];
  const size = useWidgetSize();
  const rawData = ALARM_TILES_DATA.find((t) => t.id === cfg?.dataId) ?? {
    count: 0,
    status: "On Status",
  };

  if (!cfg) return null;
  const { icon: Icon, theme } = cfg;
  const isMini = size === "mini";

  return (
    <WidgetCard
      id={cfg.id}
      info={cfg.info}
      className={cn(theme.cardBg, theme.border)}
    >
      <div className="flex flex-col justify-between h-full select-none">
        {/* Top Status Badge */}
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
              theme.badgeBg,
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                rawData.count > 0 ? "bg-rose-500 animate-pulse" : "bg-emerald-500",
              )}
            />
            {rawData.status}
          </span>
        </div>

        {/* Center / Bottom: Large Icon and Prominent Count */}
        <div className={cn("flex items-end justify-between mt-auto", isMini ? "pt-1" : "pt-4")}>
          <Icon className={cn(isMini ? "h-6 w-6" : "h-10 w-10", "opacity-85 shrink-0", theme.iconColor)} />
          <div className="flex flex-col items-end">
            <span className={cn("font-black font-mono leading-none tracking-tight text-[32px]", theme.text)}>
              {rawData.count}
            </span>
            {!isMini && (
              <span className="text-xs font-semibold text-muted-foreground mt-1">
                Active Triggers
              </span>
            )}
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}

export function OverspeedAlarmWidget() {
  return <MiniAlarmBase widgetKey="overspeed-alarm" />;
}

export function HarshCorneringAlarmWidget() {
  return <MiniAlarmBase widgetKey="harsh-cornering-alarm" />;
}

export function AcFreezeAlarmWidget() {
  return <MiniAlarmBase widgetKey="ac-freeze-alarm" />;
}

export function HighTempAlarmWidget() {
  return <MiniAlarmBase widgetKey="high-temp-alarm" />;
}

export function PanicSosAlarmWidget() {
  return <MiniAlarmBase widgetKey="panic-sos-alarm" />;
}

export function CollisionAlarmWidget() {
  return <MiniAlarmBase widgetKey="collision-alarm" />;
}
