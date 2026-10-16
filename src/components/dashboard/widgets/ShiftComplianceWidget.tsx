import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { SHIFT_COMPLIANCE_DATA } from "@/data/oldAppFleet";

export function ShiftComplianceWidget() {
  return (
    <WidgetCard
      id="shift-compliance"
      info="Duty hours compliance, overtime violation duration, and daily trend curve."
    >
      <div className="flex flex-col h-full min-h-0 justify-between select-none py-1">
        {/* 4 KPI Metric Chips */}
        <div className="grid grid-cols-2 gap-2.5 pb-2 border-b border-border/50">
          <div className="p-2.5 rounded-lg bg-cyan-500/10">
            <span className="text-[11px] text-muted-foreground block font-medium">Total Driving Hours</span>
            <span className="text-sm font-bold font-mono text-cyan-600 dark:text-cyan-400">
              {SHIFT_COMPLIANCE_DATA.totalDrivingHours}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-500/10">
            <span className="text-[11px] text-muted-foreground block font-medium">Normal Travel Time</span>
            <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {SHIFT_COMPLIANCE_DATA.normalTravelTime}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-rose-500/10">
            <span className="text-[11px] text-muted-foreground block font-medium">Violation Over-hours</span>
            <span className="text-sm font-bold font-mono text-rose-600 dark:text-rose-400">
              {SHIFT_COMPLIANCE_DATA.overHours}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-blue-500/10">
            <span className="text-[11px] text-muted-foreground block font-medium">Compliance</span>
            <span className="text-sm font-bold font-mono text-blue-600 dark:text-blue-400">
              {SHIFT_COMPLIANCE_DATA.compliancePct}%
            </span>
          </div>
        </div>

        {/* Daily Compliance Trend Line Chart */}
        <div className="flex-1 w-full min-h-[140px] pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SHIFT_COMPLIANCE_DATA.dailyTrend} margin={{ top: 6, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 14]} />
              <Tooltip
                formatter={(val: number) => [`${val} hrs`, "Duty Hours"]}
                contentStyle={{
                  backgroundColor: "var(--color-surface, #fff)",
                  borderColor: "var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="natural"
                dataKey="hours"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: "#ef4444" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </WidgetCard>
  );
}
