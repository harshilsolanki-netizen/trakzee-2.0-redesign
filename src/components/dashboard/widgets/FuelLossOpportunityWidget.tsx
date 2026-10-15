import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { FUEL_LOSS_OPPORTUNITY } from "@/data/oldAppFleet";

export function FuelLossOpportunityWidget() {
  return (
    <WidgetCard
      id="fuel-loss-opportunity"
      info="Unaccounted fuel drain, siphoning loss, and financial cost impact."
    >
      <div className="flex flex-col h-full min-h-0 justify-around select-none py-1">
        {/* Top 2 Primary Stats */}
        <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50">
          <div>
            <span className="text-3xl font-black font-mono text-orange-600 dark:text-orange-400 leading-none block">
              {FUEL_LOSS_OPPORTUNITY.fuelLostLtr} ltr
            </span>
            <span className="text-xs text-muted-foreground mt-1 block font-medium">
              Fuel Wasted
            </span>
          </div>

          <div className="text-right">
            <span className="text-3xl font-black font-mono text-rose-600 dark:text-rose-400 leading-none block">
              {FUEL_LOSS_OPPORTUNITY.costLostInr}
            </span>
            <span className="text-xs text-muted-foreground mt-1 block font-medium">
              Financial Loss
            </span>
          </div>
        </div>

        {/* Opportunity Split Bar */}
        <div className="space-y-2 py-2">
          <div className="h-3 w-full rounded-full bg-muted/60 overflow-hidden flex">
            <div
              className="h-full bg-orange-500 transition-all duration-300"
              style={{ width: `${FUEL_LOSS_OPPORTUNITY.preventablePct}%` }}
              title="Preventable Loss (82%)"
            />
            <div
              className="h-full bg-rose-600 transition-all duration-300 flex-1"
              title="Drain / Pilferage (18%)"
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          <span className="flex items-center gap-1.5 font-medium text-orange-600 dark:text-orange-400">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> Preventable ({FUEL_LOSS_OPPORTUNITY.preventablePct}%)
          </span>
          <span className="flex items-center gap-1.5 font-medium text-rose-600 dark:text-rose-400">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-600" /> Drain / Theft ({FUEL_LOSS_OPPORTUNITY.operationalPct}%)
          </span>
        </div>
      </div>
    </WidgetCard>
  );
}


