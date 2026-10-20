import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Settings, Check, RotateCcw } from "lucide-react";
import { widgetMeta, type WidgetId, type WidgetSize } from "@/dashboard/widgets";
import { useDashboard } from "@/dashboard/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WidgetSettingsModalProps {
  widgetId: WidgetId;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WidgetSettingsModal({
  widgetId,
  open,
  onOpenChange,
}: WidgetSettingsModalProps) {
  const meta = widgetMeta(widgetId);
  const { activeTab, setWidgetSize } = useDashboard();

  const currentSize: WidgetSize =
    activeTab?.widgetSizes?.[widgetId] || meta.defaultSize || "small";

  const [selectedSize, setSelectedSize] = useState<WidgetSize>(currentSize);
  const [refreshInterval, setRefreshInterval] = useState<string>("live");
  const [showPercentages, setShowPercentages] = useState(true);
  const [enableDrilldown, setEnableDrilldown] = useState(true);

  // Sync state when opened
  React.useEffect(() => {
    if (open) {
      const size = activeTab?.widgetSizes?.[widgetId] || meta.defaultSize || "small";
      setSelectedSize(size === "full" || size === "medium" || size === "large" ? "small" : size);
    }
  }, [open, activeTab, widgetId, meta.defaultSize]);

  const handleSave = () => {
    if (activeTab) {
      setWidgetSize(activeTab.id, widgetId, selectedSize);
    }
    toast.success(`Settings saved for ${meta.title}`);
    onOpenChange(false);
  };

  const handleReset = () => {
    const defaultSz = meta.defaultSize || "small";
    setSelectedSize(defaultSz);
    setRefreshInterval("live");
    setShowPercentages(true);
    setEnableDrilldown(true);
    if (activeTab) {
      setWidgetSize(activeTab.id, widgetId, defaultSz);
    }
    toast.info(`Reset ${meta.title} to default settings`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-xl border border-border/80 bg-background shadow-2xl">
        <DialogHeader className="p-4 border-b border-border/60 bg-muted/20 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Settings className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-foreground">
                {meta.title} Settings
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Customize layout dimensions and preferences
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Sizing options */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-2">
              Widget Layout Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { size: "mini" as WidgetSize, label: "0.5 × 0.5", desc: "Mini Box" },
                { size: "compact" as WidgetSize, label: "1 × 0.5", desc: "Half Height" },
                { size: "small" as WidgetSize, label: "1 × 1", desc: "Standard" },
              ].map((item) => (
                <button
                  key={item.size}
                  type="button"
                  onClick={() => setSelectedSize(item.size)}
                  className={cn(
                    "p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between",
                    selectedSize === item.size
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 ring-1 ring-blue-500"
                      : "border-border hover:bg-muted/40 text-foreground",
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold">{item.label}</span>
                    {selectedSize === item.size && (
                      <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Refresh Interval */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-2">
              Data Refresh Rate
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "live", label: "Real-time (Live stream)" },
                { key: "30s", label: "Every 30 seconds" },
                { key: "1m", label: "Every 1 minute" },
                { key: "5m", label: "Every 5 minutes" },
              ].map((rate) => (
                <button
                  key={rate.key}
                  type="button"
                  onClick={() => setRefreshInterval(rate.key)}
                  className={cn(
                    "px-3 py-2 text-xs rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between",
                    refreshInterval === rate.key
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 font-medium"
                      : "border-border hover:bg-muted/40 text-foreground",
                  )}
                >
                  <span>{rate.label}</span>
                  {refreshInterval === rate.key && (
                    <Check className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Display Toggles */}
          <div className="space-y-2.5 pt-2 border-t border-border/60">
            <label className="text-xs font-semibold text-foreground block">
              Preferences
            </label>
            <label className="flex items-center justify-between p-2 rounded-lg border border-border bg-card cursor-pointer hover:bg-muted/30">
              <span className="text-xs text-foreground font-medium">Show percentages & metrics</span>
              <input
                type="checkbox"
                checked={showPercentages}
                onChange={(e) => setShowPercentages(e.target.checked)}
                className="rounded border-border text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg border border-border bg-card cursor-pointer hover:bg-muted/30">
              <span className="text-xs text-foreground font-medium">Enable drill-down on click</span>
              <input
                type="checkbox"
                checked={enableDrilldown}
                onChange={(e) => setEnableDrilldown(e.target.checked)}
                className="rounded border-border text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border/60 bg-muted/10 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-3 py-1.5 text-xs rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              Apply Settings
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
