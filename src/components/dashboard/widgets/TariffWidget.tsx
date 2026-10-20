import { WidgetCard, useWidgetSize } from "@/components/dashboard/WidgetCard";
import { cn } from "@/lib/utils";
import { ShieldAlert, Clock, ExternalLink } from "lucide-react";

// Mock tariff data matching the reference screenshot
const TARIFF_DATA = {
  expired: 0,
  expiringSoon: 0,
};

export function TariffWidget() {
  const size = useWidgetSize();
  const isMini = size === "mini";

  return (
    <WidgetCard
      id="tariff"
      info="SIM tariff expiry status: Expired and Expiring Soon counts with quick recharge."
    >
      <div className="flex flex-col justify-between h-full select-none">
        {/* Tariff Rows */}
        <div className={cn("flex flex-col", isMini ? "gap-2.5" : "gap-3.5")}>
          {/* Row 1: Expired */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/12 dark:bg-rose-500/15 shrink-0">
                <ShieldAlert className="h-4 w-4 text-rose-500 dark:text-rose-400" />
              </div>
              <span className="text-xs font-semibold text-foreground">Expired</span>
            </div>
            <span
              className={cn(
                "font-black font-mono leading-none tracking-tight",
                isMini ? "text-[22px]" : "text-[26px]",
                TARIFF_DATA.expired > 0
                  ? "text-rose-500 dark:text-rose-400"
                  : "text-slate-400 dark:text-slate-500",
              )}
            >
              {TARIFF_DATA.expired}
            </span>
          </div>

          {/* Row 2: Expiring Soon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/12 dark:bg-amber-500/15 shrink-0">
                <Clock className="h-4 w-4 text-amber-500 dark:text-amber-400" />
              </div>
              <span className="text-xs font-semibold text-foreground">Expiring soon</span>
            </div>
            <span
              className={cn(
                "font-black font-mono leading-none tracking-tight",
                isMini ? "text-[22px]" : "text-[26px]",
                TARIFF_DATA.expiringSoon > 0
                  ? "text-amber-500 dark:text-amber-400"
                  : "text-slate-400 dark:text-slate-500",
              )}
            >
              {TARIFF_DATA.expiringSoon}
            </span>
          </div>
        </div>

        {/* Recharge CTA Button */}
        <div className="flex justify-end mt-auto pt-2">
          <button
            type="button"
            onClick={() => window.open("/recharge", "_blank")}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-3 py-1.5 text-[11px] font-bold text-white transition-all cursor-pointer shadow-xs active:scale-98"
          >
            Recharge
            <ExternalLink className="h-3 w-3 opacity-70" />
          </button>
        </div>
      </div>
    </WidgetCard>
  );
}
