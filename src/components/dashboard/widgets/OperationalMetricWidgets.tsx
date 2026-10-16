import { Gauge, Landmark, Cloud, ShieldAlert, type LucideIcon } from "lucide-react";
import { WidgetCard, useWidgetSize } from "@/components/dashboard/WidgetCard";
import { OPERATIONAL_METRICS_DATA } from "@/data/oldAppFleet";
import type { WidgetId } from "@/dashboard/widgets";
import { cn } from "@/lib/utils";

interface MetricWidgetConfig {
  id: WidgetId;
  title: string;
  icon: LucideIcon;
  info: string;
  badge: string;
  getValue: () => string | number;
  theme: {
    cardBg: string;
    border: string;
    text: string;
    badgeBg: string;
    iconColor: string;
  };
}

const METRIC_CONFIGS: Record<string, MetricWidgetConfig> = {
  "fleet-efficiency": {
    id: "fleet-efficiency",
    title: "Fleet Efficiency",
    icon: Gauge,
    info: "Overall fleet operational and dispatch performance efficiency score.",
    badge: "Performance Score",
    getValue: () => `${OPERATIONAL_METRICS_DATA.fleetEfficiencyPct}%`,
    theme: {
      cardBg: "bg-emerald-500/10 dark:bg-emerald-950/25",
      border: "border-emerald-500/30 dark:border-emerald-500/20",
      text: "text-emerald-600 dark:text-emerald-400",
      badgeBg: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
  },
  "toll-expense": {
    id: "toll-expense",
    title: "Toll",
    icon: Landmark,
    info: "Daily accumulated highway FASTag and toll gate expenses.",
    badge: "Paid Today",
    getValue: () => OPERATIONAL_METRICS_DATA.tollExpenseInr,
    theme: {
      cardBg: "bg-amber-500/10 dark:bg-amber-950/25",
      border: "border-amber-500/30 dark:border-amber-500/20",
      text: "text-amber-600 dark:text-amber-400",
      badgeBg: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/25",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  },
  "carbon-emission": {
    id: "carbon-emission",
    title: "Carbon Emission",
    icon: Cloud,
    info: "Fleet environmental carbon offset and emissions saved.",
    badge: "Carbon Offset",
    getValue: () => `${OPERATIONAL_METRICS_DATA.carbonEmissionSavedTons} Tons`,
    theme: {
      cardBg: "bg-teal-500/10 dark:bg-teal-950/25",
      border: "border-teal-500/30 dark:border-teal-500/20",
      text: "text-teal-600 dark:text-teal-400",
      badgeBg: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/25",
      iconColor: "text-teal-600 dark:text-teal-400",
    },
  },
  "active-alerts": {
    id: "active-alerts",
    title: "Alerts",
    icon: ShieldAlert,
    info: "Total real-time active system alarms and trigger notifications.",
    badge: "Active Triggers",
    getValue: () => OPERATIONAL_METRICS_DATA.activeAlertsCount,
    theme: {
      cardBg: "bg-rose-500/10 dark:bg-rose-950/25",
      border: "border-rose-500/30 dark:border-rose-500/20",
      text: "text-rose-600 dark:text-rose-400",
      badgeBg: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/25",
      iconColor: "text-rose-600 dark:text-rose-400",
    },
  },
};

function OperationalMetricBase({ widgetKey }: { widgetKey: string }) {
  const cfg = METRIC_CONFIGS[widgetKey];
  const size = useWidgetSize();

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
        {/* Top Status / Category Badge */}
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
              theme.badgeBg,
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
            {cfg.badge}
          </span>
        </div>

        {/* Center / Bottom: Large Icon and Prominent Count */}
        <div className={cn("flex items-end justify-between mt-auto", isMini ? "pt-1" : "pt-4")}>
          <Icon className={cn(isMini ? "h-6 w-6" : "h-10 w-10", "opacity-85 shrink-0", theme.iconColor)} />
          <div className="flex flex-col items-end">
            <span className={cn("font-black font-mono leading-none tracking-tight text-[32px]", theme.text)}>
              {cfg.getValue()}
            </span>
            {!isMini && (
              <span className="text-xs font-semibold text-muted-foreground mt-1">
                {cfg.badge}
              </span>
            )}
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}

export function FleetEfficiencyWidget() {
  return <OperationalMetricBase widgetKey="fleet-efficiency" />;
}

export function TollExpenseWidget() {
  return <OperationalMetricBase widgetKey="toll-expense" />;
}

export function CarbonEmissionWidget() {
  return <OperationalMetricBase widgetKey="carbon-emission" />;
}

export function ActiveAlertsWidget() {
  return <OperationalMetricBase widgetKey="active-alerts" />;
}
