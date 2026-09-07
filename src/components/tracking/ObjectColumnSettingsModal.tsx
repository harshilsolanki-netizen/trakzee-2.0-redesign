import { Check, Settings, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const TRACKING_COLUMNS = [
  { id: "checkbox", label: "Map Selection Checkbox", default: true },
  { id: "status", label: "Status Dot & Motion", default: true },
  { id: "name", label: "Object Name / Registration", default: true },
  { id: "speed", label: "Current Speed (km/h)", default: true },
  { id: "ignition", label: "Ignition Key State", default: true },
  { id: "gps", label: "GPS Signal & Lock", default: true },
  { id: "battery", label: "Battery / Fuel % Badge", default: true },
  { id: "video", label: "Live Video Quick Action", default: true },
  { id: "camera", label: "Snapshot Quick Action", default: true },
  { id: "trace", label: "Trace on Map Quick Action", default: true },
  { id: "info", label: "Telemetry Drawer Quick Action", default: true },
  { id: "driver", label: "Assigned Driver Name", default: false },
  { id: "imei", label: "Device IMEI Number", default: false },
  { id: "odometer", label: "Total Odometer", default: false },
];

export function ObjectColumnSettingsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    TRACKING_COLUMNS.filter((c) => c.default).map((c) => c.id),
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface text-foreground shadow-2xl overflow-hidden text-xs">
        {/* Header */}
        <header className="flex h-[45px] items-center justify-between bg-nav px-4 text-nav-foreground shrink-0 border-b border-white/10 select-none">
          <h2 className="text-sm font-semibold tracking-tight">
            Object Display Settings
          </h2>
          <button
            type="button"
            aria-label="Close Settings"
            onClick={onClose}
            className="rounded-md p-1 text-nav-foreground/80 transition-colors duration-150 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Columns Toggle List */}
        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          <div className="space-y-1">
            {TRACKING_COLUMNS.map((col) => {
              const isChecked = selectedColumns.includes(col.id);
              return (
                <label
                  key={col.id}
                  className="flex items-center justify-between p-2 rounded-md border border-border/60 hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <span className="font-medium text-foreground text-xs">
                    {col.label}
                  </span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() =>
                      setSelectedColumns((prev) =>
                        prev.includes(col.id)
                          ? prev.filter((id) => id !== col.id)
                          : [...prev, col.id],
                      )
                    }
                    className="h-4 w-4 rounded border-input text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-surface-muted/40 px-4 py-3">
          <button
            type="button"
            onClick={() =>
              setSelectedColumns(TRACKING_COLUMNS.map((c) => c.id))
            }
            className="text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            Select All
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md border border-border text-xs font-medium hover:bg-muted cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                toast.success("Object column settings updated");
                onClose();
              }}
              className="px-4 py-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-xs cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
