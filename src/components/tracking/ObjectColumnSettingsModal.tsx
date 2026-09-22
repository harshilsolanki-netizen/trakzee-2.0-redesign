import { GripVertical, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── Column Definitions (matching exact reference structure) ─────────────────────────
export const COLUMN_GROUPS = [
  {
    id: "sensors",
    label: "Sensors",
    columns: [
      { id: "ignition", label: "Ignition", default: true },
      { id: "power", label: "Power", default: false },
      { id: "gsm", label: "GSM", default: false },
      { id: "gps", label: "GPS", default: true },
      { id: "air_condition", label: "Air Condition", default: false },
      { id: "door", label: "Door", default: false },
      { id: "sos", label: "SOS", default: false },
      { id: "elock", label: "E-Lock", default: false },
      { id: "immobilize", label: "Immobilize", default: true },
      { id: "external_voltage", label: "External voltage", default: false },
      { id: "obd", label: "OBD", default: false },
      { id: "tamper", label: "Tamper", default: false },
      { id: "soc", label: "SOC", default: false },
      { id: "charging_status", label: "Charging Status", default: false },
      { id: "soh", label: "SOH", default: false },
      { id: "battery_temperature", label: "Battery Temperature", default: false },
      { id: "mixer_lifting", label: "Mixer Lifting", default: false },
      { id: "passenger_seat", label: "Passenger Seat", default: false },
      { id: "beacon", label: "Beacon", default: false },
      { id: "engine1", label: "Engine 1", default: false },
      { id: "taximeter", label: "Taximeter", default: false },
      { id: "ignition_lock", label: "Ignition Lock", default: false },
    ],
  },
  {
    id: "object_activity",
    label: "Object Activity",
    columns: [
      { id: "last_updated", label: "Last Updated", default: true },
      { id: "driver", label: "Driver", default: false },
      { id: "driver_mobile", label: "Driver Mobile Number", default: false },
      { id: "mode", label: "Mode", default: false },
      { id: "timeline_chart", label: "TimeLine Chart", default: false },
      { id: "passengers", label: "Number of passengers", default: false },
      { id: "max_load", label: "Max Load Capacity", default: false },
      { id: "reminder", label: "Reminder", default: false },
      { id: "sos_activity", label: "SOS", default: false },
      { id: "notes", label: "Notes", default: false },
      { id: "send_command", label: "Send Command", default: true },
      { id: "reports", label: "Reports", default: true },
      { id: "object_health", label: "Object Health", default: false },
      { id: "expiry_date", label: "Expiry Date", default: false },
      { id: "vin", label: "VIN", default: false },
    ],
  },
  {
    id: "address",
    label: "Address",
    columns: [{ id: "address", label: "Address", default: false }],
  },
  {
    id: "video_telematics",
    label: "Video Telematics",
    columns: [
      { id: "live_streaming", label: "Live Streaming", default: true },
      { id: "snapshot", label: "Snapshot", default: false },
      { id: "video_playback", label: "Video Playback", default: false },
      { id: "intercom_mic", label: "Intercom Mic", default: false },
    ],
  },
];

export const DEFAULT_COLUMNS = [
  "ignition",
  "gps",
  "speed",
  "last_updated",
  "driver",
  "address",
  "live_streaming",
  "immobilize",
];

const MAX_COLUMNS = 10;

export function ObjectColumnSettingsModal({
  open,
  onClose,
  selectedColumns = DEFAULT_COLUMNS,
  onSaveColumns,
}: {
  open: boolean;
  onClose: () => void;
  selectedColumns?: string[];
  onSaveColumns?: (cols: string[]) => void;
}) {
  const [showObjectNumber, setShowObjectNumber] = useState(true);
  const [showObjectName, setShowObjectName] = useState(true);
  const [localColumns, setLocalColumns] = useState<string[]>(selectedColumns);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (open) {
      setLocalColumns(selectedColumns);
    }
  }, [open, selectedColumns]);

  if (!open) return null;

  const toggleColumn = (id: string) => {
    setLocalColumns((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= MAX_COLUMNS) {
        toast.error(`Maximum ${MAX_COLUMNS} columns allowed`, {
          description: "Please uncheck a column before selecting new ones.",
        });
        return prev;
      }
      return [...prev, id];
    });
  };

  const toggleGroupAll = (groupId: string) => {
    const group = COLUMN_GROUPS.find((g) => g.id === groupId);
    if (!group) return;
    const groupIds = group.columns.map((c) => c.id);
    const someSelected = groupIds.some((id) => localColumns.includes(id));

    if (someSelected) {
      // Instantly deselect all items in this group
      setLocalColumns((prev) => prev.filter((id) => !groupIds.includes(id)));
    } else {
      // Select items from this group up to MAX_COLUMNS (10)
      const availableSlots = MAX_COLUMNS - localColumns.length;
      if (availableSlots <= 0) {
        toast.error(`Maximum ${MAX_COLUMNS} columns limit reached`, {
          description: "Please uncheck some columns before adding new ones.",
        });
        return;
      }
      const itemsToAdd = groupIds.slice(0, availableSlots);
      setLocalColumns((prev) => [...new Set([...prev, ...itemsToAdd])]);
      if (groupIds.length > availableSlots) {
        toast.info(`Added ${itemsToAdd.length} columns from ${group.label}`, {
          description: `Reached maximum limit of ${MAX_COLUMNS} active columns.`,
        });
      }
    }
  };

  const handleSave = () => {
    if (onSaveColumns) {
      onSaveColumns(localColumns);
    }
    toast.success("Object list display settings updated", {
      description: `${localColumns.length} columns active on object panel.`,
    });
    onClose();
  };

  return (
    <>
      {/* Side Panel Backdrop */}
      <button
        type="button"
        aria-label="Close settings panel"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      {/* Sleek Right-Side Drawer (340px width matching reference image) */}
      <div className="fixed inset-y-0 right-0 z-50 flex h-full w-[330px] sm:w-[350px] flex-col border-l border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-right duration-200 select-none text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex h-12 items-center justify-between border-b border-[#DFE3EB] dark:border-slate-800 px-4 shrink-0 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Object List
            </h2>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide",
                localColumns.length >= MAX_COLUMNS
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                  : "bg-[#0089FF]/10 text-[#0089FF]",
              )}
            >
              {localColumns.length} / {MAX_COLUMNS} Max
            </span>
          </div>
          <button
            type="button"
            aria-label="Close settings"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-col flex-1 min-h-0 p-4 space-y-3 custom-scrollbar text-xs">
          {/* 1. Search Box */}
          <div className="shrink-0">
            <div className="flex h-8 items-center gap-2 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 shadow-2xs focus-within:ring-1 focus-within:ring-[#0089FF] focus-within:border-[#0089FF] transition-all">
              <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="h-full flex-1 bg-transparent text-xs font-normal text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none min-w-0"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5 rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 italic mt-1.5 leading-tight">
              *Maximum 10 columns allowed. Select widgets to show on object panel.
            </p>
          </div>

          {/* 2. Group View / Object Name Checkboxes */}
          <div className="shrink-0">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Object Name
            </h3>
            <div className="space-y-1.5 pl-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showObjectNumber}
                  onChange={() => setShowObjectNumber((v) => !v)}
                  className="h-3.5 w-3.5 rounded border-[#DFE3EB] dark:border-slate-700 text-[#0089FF] accent-[#0089FF] cursor-pointer"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Object Number
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showObjectName}
                  onChange={() => setShowObjectName((v) => !v)}
                  className="h-3.5 w-3.5 rounded border-[#DFE3EB] dark:border-slate-700 text-[#0089FF] accent-[#0089FF] cursor-pointer"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Object Name
                </span>
              </label>
            </div>
          </div>

          {/* 3. Choose Columns Boxed Container (Flex-1 fills all remaining vertical space) */}
          <div className="flex-1 min-h-0 flex flex-col">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 shrink-0">
              Choose Columns
            </h3>

            {/* Unified Outer Boxed Container - Fills all space down to footer */}
            <div className="flex-1 min-h-0 rounded-md border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-950/40 p-3 space-y-4 overflow-y-auto custom-scrollbar">
              {COLUMN_GROUPS.map((group) => {
                const groupColumnIds = group.columns.map((c) => c.id);
                const filteredColumns = searchQuery.trim()
                  ? group.columns.filter((c) =>
                      c.label.toLowerCase().includes(searchQuery.trim().toLowerCase()),
                    )
                  : group.columns;

                if (searchQuery.trim() && filteredColumns.length === 0) {
                  return null;
                }

                const groupSomeChecked = groupColumnIds.some((id) =>
                  localColumns.includes(id),
                );
                const groupAllChecked = groupColumnIds.every((id) =>
                  localColumns.includes(id),
                );
                const groupIndeterminate = groupSomeChecked && !groupAllChecked;

                return (
                  <div key={group.id} className="space-y-2">
                    {/* Category Header Row */}
                    <div className="flex items-center justify-between py-0.5">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-800 dark:text-slate-100">
                        <input
                          type="checkbox"
                          checked={groupSomeChecked}
                          ref={(el) => {
                            if (el) el.indeterminate = groupIndeterminate;
                          }}
                          onChange={() => toggleGroupAll(group.id)}
                          className="h-3.5 w-3.5 rounded border-[#DFE3EB] dark:border-slate-700 text-[#0089FF] accent-[#0089FF] cursor-pointer"
                        />
                        <span>{group.label}</span>
                      </label>
                      <GripVertical className="h-3.5 w-3.5 text-slate-400 cursor-grab shrink-0" />
                    </div>

                    {/* Column Items Indented List */}
                    <div className="space-y-1.5 pl-5">
                      {filteredColumns.map((col) => (
                        <label
                          key={col.id}
                          className="flex items-center gap-2 cursor-pointer hover:text-[#0089FF] transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={localColumns.includes(col.id)}
                            onChange={() => toggleColumn(col.id)}
                            className="h-3.5 w-3.5 rounded border-[#DFE3EB] dark:border-slate-700 text-[#0089FF] accent-[#0089FF] cursor-pointer"
                          />
                          <span className="text-xs font-normal text-slate-700 dark:text-slate-200">
                            {col.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer with Blue Save & Cancel Buttons */}
        <div className="flex items-center gap-2 border-t border-[#DFE3EB] dark:border-slate-800 p-3 shrink-0 bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-1.5 rounded bg-[#0089FF] hover:bg-[#0070d6] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer active:scale-95 text-center"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-1.5 rounded bg-[#0089FF] hover:bg-[#0070d6] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer active:scale-95 text-center"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
