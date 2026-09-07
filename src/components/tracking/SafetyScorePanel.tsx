import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Gauge,
  HelpCircle,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useMemo } from "react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { AskZioCTA } from "@/components/zio/AskZioCTA";
import { type FleetObject } from "@/data/fleet";
import { getVehicleScoreData } from "@/zio/zio-service";
import { cn } from "@/lib/utils";

export function SafetyScorePanel({
  vehicle,
  className,
}: {
  vehicle: FleetObject;
  className?: string;
}) {
  const scoreData = useMemo(() => getVehicleScoreData(vehicle), [vehicle]);

  const scoreColor =
    scoreData.overallScore >= 85
      ? "#10b981"
      : scoreData.overallScore >= 70
        ? "#f59e0b"
        : "#ef4444";

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-border bg-surface p-3.5 shadow-xs space-y-3.5",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
        <div>
          <h2 className="text-xs font-bold text-foreground">Safety Score</h2>
          <p className="text-[11px] text-muted-foreground truncate max-w-[200px]">
            {vehicle.name} · {scoreData.driver}
          </p>
        </div>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{
            backgroundColor: `${scoreColor}15`,
            color: scoreColor,
          }}
        >
          {scoreData.overallScore >= 85
            ? "Excellent"
            : scoreData.overallScore >= 70
              ? "Good"
              : "High Risk"}
        </span>
      </div>

      {/* Radial Gauge Meter */}
      <div className="relative flex h-[130px] w-full items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={[
              {
                name: "Score",
                value: scoreData.overallScore,
                fill: scoreColor,
              },
            ]}
            innerRadius="75%"
            outerRadius="100%"
            startAngle={180}
            endAngle={0}
            barSize={14}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar background dataKey="value" cornerRadius={10} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute bottom-4 flex flex-col items-center">
          <span className="text-3xl font-extrabold text-foreground tabular-nums">
            {scoreData.overallScore}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground">
            Overall Rating
          </span>
        </div>
      </div>

      {/* Embedded Minimal Ask Zio CTA as requested */}
      <AskZioCTA />

      {/* Score Pillars Breakdown */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Score Breakdown
        </span>

        <div className="space-y-2 text-xs">
          <ScoreBar
            label="Safety"
            value={scoreData.safetyScore}
            color="#3b82f6"
            icon={Shield}
          />
          <ScoreBar
            label="Efficiency"
            value={scoreData.efficiencyScore}
            color="#10b981"
            icon={Zap}
          />
          <ScoreBar
            label="Risk Index"
            value={scoreData.riskScore}
            color="#ef4444"
            icon={AlertTriangle}
            inverse
          />
          <ScoreBar
            label="Discipline"
            value={scoreData.disciplineScore}
            color="#8b5cf6"
            icon={CheckCircle2}
          />
          <ScoreBar
            label="Confidence"
            value={scoreData.confidenceScore}
            color="#06b6d4"
            icon={Award}
          />
        </div>
      </div>

      {/* Driving Events Snapshot */}
      <div className="rounded-lg border border-border/80 bg-surface-muted/40 p-2.5 space-y-1.5 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Driving Events (24h)
        </span>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Overspeeding:</span>
            <span className="font-semibold text-foreground">
              {scoreData.drivingEvents.overspeedCount}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Harsh Brake:</span>
            <span className="font-semibold text-foreground">
              {scoreData.drivingEvents.harshBrakeCount}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Harsh Accel:</span>
            <span className="font-semibold text-foreground">
              {scoreData.drivingEvents.harshAccelCount}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">DMS Alerts:</span>
            <span className="font-semibold text-foreground">
              {scoreData.drivingEvents.dmsViolations}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({
  label,
  value,
  color,
  icon: Icon,
  inverse = false,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  inverse?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Icon className="h-3 w-3" style={{ color }} />
          {label}
        </span>
        <span className="font-semibold text-foreground tabular-nums">
          {value}%{" "}
          {inverse && (
            <span className="text-[9px] text-muted-foreground font-normal">
              (lower is better)
            </span>
          )}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
