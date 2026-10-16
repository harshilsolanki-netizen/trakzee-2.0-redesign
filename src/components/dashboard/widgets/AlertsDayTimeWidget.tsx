import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { ALERTS_DAY_TIME } from "@/data/oldAppFleet";

export function AlertsDayTimeWidget() {
  return (
    <WidgetCard
      id="alerts-day-time"
      info="Daily alarm distribution and peak incident severity index."
    >
      <div className="flex flex-col h-full min-h-0 justify-between select-none py-1">
        {/* Simple Legend at Top */}
        <div className="flex items-center justify-end gap-4 text-xs font-medium pb-1 text-slate-700 dark:text-slate-300">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-xs bg-[#7c3aed] shrink-0" /> Alerts
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" /> Severity
          </span>
        </div>

        {/* Tall Composed Chart */}
        <div className="flex-1 w-full min-h-[220px] pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={ALERTS_DAY_TIME} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                formatter={(val: number, name: string) => [
                  val,
                  name === "alerts" ? "Total Alerts" : "Severity Index",
                ]}
                contentStyle={{
                  backgroundColor: "var(--color-surface, #fff)",
                  borderColor: "var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="alerts" fill="#7c3aed" radius={[4, 4, 0, 0]} barSize={20} name="alerts" />
              <Line type="monotone" dataKey="severity" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3, fill: "#ef4444" }} name="severity" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </WidgetCard>
  );
}


