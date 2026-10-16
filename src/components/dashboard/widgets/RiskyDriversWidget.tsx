import { EyeOff, PhoneCall, Cigarette, Bed, ScanFace } from "lucide-react";
import { WidgetCard } from "@/components/dashboard/WidgetCard";

const DRIVERS = [
  { id: "1", name: "John Smith", vehicle: "V0001", score: 45, level: "High", tags: ["distraction"] },
  { id: "2", name: "Jane Doe", vehicle: "V0014", score: 30, level: "High", tags: ["phone"] },
  { id: "3", name: "Mike Johnson", vehicle: "V0031", score: 10, level: "Medium", tags: ["fatigue"] },
  { id: "4", name: "Rahul Mehta", vehicle: "V0032", score: 9, level: "Medium", tags: ["smoking"] },
  { id: "5", name: "Suresh Patil", vehicle: "V0040", score: 8, level: "Medium", tags: ["distraction", "phone", "fatigue", "smoking"] },
];

const TAG_ICON: Record<string, typeof EyeOff> = {
  fatigue: Bed,
  phone: PhoneCall,
  smoking: Cigarette,
  distraction: ScanFace,
  eye: EyeOff,
};

export function RiskyDriversWidget() {
  return (
    <WidgetCard
      id="risky-drivers"
      info="Drivers with highest telematics violations and low safety scores."
    >
      <div className="flex flex-col h-full min-h-0 select-none">
        <ul className="divide-y divide-border/50 overflow-y-auto">
          {DRIVERS.map((d) => (
            <li
              key={d.id}
              className="flex items-center gap-2 py-3 px-1.5 transition-colors hover:bg-muted/30"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">
                  {d.name}
                </p>
                <p className="text-[11px] font-mono text-muted-foreground">
                  {d.vehicle}
                </p>
              </div>

              <div className="flex items-center gap-1">
                {d.tags.map((t) => {
                  const Icon = TAG_ICON[t] ?? ScanFace;
                  return (
                    <span
                      key={t}
                      title={t}
                      className="rounded-full bg-muted/40 p-1 text-muted-foreground/80 hover:text-foreground"
                    >
                      <Icon className="h-3 w-3" />
                    </span>
                  );
                })}
              </div>

              <span className="w-7 text-right text-sm font-bold font-mono tabular-nums text-foreground">
                {String(d.score).padStart(2, "0")}
              </span>

              <span
                className={`w-14 rounded-full px-2 py-0.5 text-center text-[11px] font-bold ${
                  d.level === "High"
                    ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                    : d.level === "Medium"
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {d.level}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </WidgetCard>
  );
}
