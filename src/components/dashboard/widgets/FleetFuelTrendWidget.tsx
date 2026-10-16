import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Fuel } from "lucide-react";
import { WidgetCard } from "@/components/dashboard/WidgetCard";

// 28 days of fuel logs matching reference image
const DAYS_FUEL = [
  { day: "1", ltr: 35 }, { day: "2", ltr: 48 }, { day: "3", ltr: 52 }, { day: "4", ltr: 42 },
  { day: "5", ltr: 60 }, { day: "6", ltr: 44 }, { day: "7", ltr: 58 }, { day: "8", ltr: 64 },
  { day: "9", ltr: 32 }, { day: "10", ltr: 45 }, { day: "11", ltr: 51 }, { day: "12", ltr: 55 },
  { day: "13", ltr: 38 }, { day: "14", ltr: 44 }, { day: "15", ltr: 40 }, { day: "16", ltr: 36 },
  { day: "17", ltr: 39 }, { day: "18", ltr: 42 }, { day: "19", ltr: 46 }, { day: "20", ltr: 38 },
  { day: "21", ltr: 32 }, { day: "22", ltr: 35 }, { day: "23", ltr: 34 }, { day: "24", ltr: 36 },
  { day: "25", ltr: 38 }, { day: "26", ltr: 35 }, { day: "27", ltr: 32 }, { day: "28", ltr: 34 },
];

export function FleetFuelTrendWidget() {
  return (
    <WidgetCard
      id="fleet-fuel"
      info="Daily fuel consumption volume across 28-day operating cycle."
    >
      <div className="flex flex-col h-full min-h-0 justify-between select-none py-0.5">
        <div className="flex items-center justify-between border-b border-border/50 pb-2 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <Fuel className="h-4 w-4 text-[#0089FF]" />
            <span>Daily Fuel Log (28 Days)</span>
          </div>
          <span className="font-mono text-muted-foreground text-xs">Total: 1,180 Ltr</span>
        </div>

        <div className="flex-1 w-full min-h-[200px] pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DAYS_FUEL} margin={{ top: 6, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} interval={1} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                formatter={(val: number) => [`${val} Ltr`, "Fuel"]}
                contentStyle={{
                  backgroundColor: "var(--color-surface, #fff)",
                  borderColor: "var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="ltr" fill="#155dfc" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </WidgetCard>
  );
}
