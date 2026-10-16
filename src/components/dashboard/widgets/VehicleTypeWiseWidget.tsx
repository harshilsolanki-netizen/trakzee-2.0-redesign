import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { VEHICLE_TYPE_DATA } from "@/data/oldAppFleet";

export function VehicleTypeWiseWidget() {
  return (
    <WidgetCard
      id="vehicle-type-wise"
      info="Asset distribution by vehicle chassis and body type."
    >
      <div className="flex items-center justify-between h-full min-h-0 select-none gap-3">
        {/* Donut Chart */}
        <div className="relative h-[225px] w-[225px] shrink-0 my-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={VEHICLE_TYPE_DATA.types}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={72}
                outerRadius={108}
                paddingAngle={2}
                stroke="none"
              >
                {VEHICLE_TYPE_DATA.types.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black font-mono text-foreground leading-tight">
              {VEHICLE_TYPE_DATA.total}
            </span>
            <span className="text-[12px] text-muted-foreground uppercase font-bold tracking-wider mt-0.5">
              Total
            </span>
          </div>
        </div>

        {/* 2-Column Type Legend */}
        <div className="flex-1 min-w-0 grid grid-cols-2 gap-1.5 my-auto pr-1">
          {VEHICLE_TYPE_DATA.types.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-medium text-foreground truncate">{item.name}</span>
              </div>
              <span className="font-mono text-xs font-semibold text-foreground shrink-0 ml-1.5">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </WidgetCard>
  );
}

