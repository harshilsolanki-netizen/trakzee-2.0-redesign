import {
  Activity,
  Bluetooth,
  Check,
  ChevronDown,
  Disc,
  Gauge,
  GripVertical,
  MapPin,
  RotateCcw,
  Search,
  Settings,
  Thermometer,
  Video,
  X,
  Pin,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { TpmsIcon, EngineIcon } from "./AutomotiveIcons";

export interface TooltipWidgetCategory {
  id: string;
  label: string;
  items: {
    id: string;
    label: string;
    default: boolean;
  }[];
}

export const TOOLTIP_WIDGET_CATEGORIES: TooltipWidgetCategory[] = [
  {
    id: "vehicle_info",
    label: "Vehicle Info",
    items: [
      { id: "status", label: "Status", default: true },
      { id: "driver", label: "Driver Information", default: true },
      { id: "work_hour", label: "Work Hour", default: true },
      { id: "odometer", label: "Odometer", default: true },
      { id: "follow", label: "Follow", default: true },
      { id: "share_live_location", label: "Share Live Location", default: true },
      { id: "navigate", label: "Navigate", default: false },
      { id: "find_near_by", label: "Find Near By", default: false },
      { id: "mode", label: "Mode", default: false },
      { id: "street_view", label: "Street View", default: false },
      { id: "vehicle_name", label: "Vehicle Name", default: true },
    ],
  },
  {
    id: "today_activity",
    label: "Today Activity",
    items: [
      { id: "distance", label: "Distance", default: true },
      { id: "running", label: "Running", default: true },
      { id: "stop", label: "Stop", default: true },
      { id: "inactive", label: "Inactive", default: true },
      { id: "idle", label: "Idle", default: true },
      { id: "activity_work_hour", label: "Work Hour", default: false },
      { id: "working_start", label: "Working Start", default: true },
      { id: "last_stop", label: "Last Stop", default: true },
    ],
  },
  {
    id: "fuel",
    label: "Fuel",
    items: [
      { id: "fuel_level", label: "Level", default: true },
      { id: "refill_and_drain", label: "Refill and Drain", default: true },
      { id: "blind_area", label: "Blind Area", default: false },
      { id: "waste", label: "Waste", default: false },
      { id: "tank_capacity", label: "Tank Capacity", default: true },
      { id: "consumption", label: "Consumption", default: true },
      { id: "consumption_can", label: "Consumption ( CAN)", default: false },
      { id: "carbon_emission", label: "Carbon Emission", default: false },
      { id: "carbon_emission_can", label: "Carbon Emission (CAN)", default: false },
      { id: "number_of_tank", label: "Number of Tank", default: true },
      { id: "remaining", label: "Remaining", default: false },
      { id: "updated", label: "Updated", default: false },
      { id: "tank_wise_consumption", label: "Tank-Wise Consumption", default: false },
      { id: "fuel_distance", label: "Distance", default: false },
      { id: "fuel_duration", label: "Duration", default: false },
    ],
  },
  {
    id: "video_telematics",
    label: "Video Telematics",
    items: [
      { id: "live_streaming", label: "Live Dashcam Stream", default: false },
      { id: "snapshot", label: "Camera Snapshot", default: false },
      { id: "video_playback", label: "Video Playback", default: false },
      { id: "intercom_mic", label: "Intercom Mic Audio", default: false },
    ],
  },
  {
    id: "sensors",
    label: "Sensors & Diagnostics",
    items: [
      { id: "engine_temp", label: "Engine Temperature", default: true },
      { id: "chamber_temp", label: "Cold Chain Chamber Temp", default: true },
      { id: "battery_voltage", label: "Battery Voltage", default: true },
      { id: "ignition_status", label: "Ignition Sensor", default: true },
      { id: "door_sensor", label: "Door Sensor Status", default: false },
      { id: "ac_status", label: "Air Conditioner (AC)", default: false },
      { id: "sos_alarm", label: "SOS Panic Button", default: false },
      { id: "dtc_codes", label: "OBD DTC Fault Codes", default: false },
    ],
  },
  {
    id: "reminder",
    label: "Reminder",
    items: [{ id: "reminder", label: "Maintenance Reminder", default: false }],
  },
  {
    id: "flow_meter",
    label: "Flow Meter",
    items: [{ id: "flow_meter", label: "Flow Meter Counter", default: false }],
  },
  {
    id: "load_prediction",
    label: "Load Prediction",
    items: [{ id: "load_prediction", label: "Load & Payload Weight", default: false }],
  },
  {
    id: "adblue",
    label: "AdBlue",
    items: [{ id: "adblue", label: "AdBlue / DEF Tank Level", default: false }],
  },
  {
    id: "elock",
    label: "E-Lock",
    items: [{ id: "elock", label: "Electronic Cargo Lock", default: false }],
  },
  {
    id: "trailer",
    label: "Trailer",
    items: [{ id: "trailer", label: "Trailer Attachment", default: false }],
  },
  {
    id: "passenger_seat",
    label: "Passenger Seat",
    items: [{ id: "passenger_seat_info", label: "Passenger Seat Occupancy", default: false }],
  },
  {
    id: "tpms",
    label: "TPMS (Tire Pressure)",
    items: [{ id: "tpms", label: "Tire Pressure & Axle Status", default: true }],
  },
  {
    id: "engine_parameters",
    label: "Engine Parameters",
    items: [{ id: "engine", label: "Diagnostic Faults & CAN Metrics", default: true }],
  },
];

export const DEFAULT_ENABLED_WIDGETS = TOOLTIP_WIDGET_CATEGORIES.flatMap((cat) =>
  cat.items.filter((item) => item.default).map((item) => item.id),
);

const PIN_TABS = [
  { id: "live", label: "Live", icon: MapPin },
  { id: "engine", label: "Engine Parameters", icon: EngineIcon },
  { id: "ble", label: "BLE", icon: Bluetooth },
  { id: "tpms", label: "TPMS", icon: TpmsIcon },
];

export function TooltipWidgetSettingsModal({
  open,
  onClose,
  enabledWidgets = DEFAULT_ENABLED_WIDGETS,
  onApply,
  pinnedTab: propPinnedTab,
  onPinTabChange,
}: {
  open: boolean;
  onClose: () => void;
  enabledWidgets?: string[];
  onApply: (activeWidgetIds: string[]) => void;
  pinnedTab?: string | null;
  onPinTabChange?: (tabId: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [internalPinnedTab, setInternalPinnedTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("trakzee_pinned_tooltip_tab");
      if (saved && ["live", "engine", "ble", "tpms"].includes(saved)) {
        return saved;
      }
    }
    return "live";
  });

  const pinnedTab = propPinnedTab !== undefined && propPinnedTab !== null ? propPinnedTab : internalPinnedTab;
  const [activePinTab, setActivePinTab] = useState<string>(pinnedTab);

  useEffect(() => {
    if (open) {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("trakzee_pinned_tooltip_tab");
        if (saved && ["live", "engine", "ble", "tpms"].includes(saved)) {
          setInternalPinnedTab(saved);
          setActivePinTab(saved);
        }
      }
    }
  }, [open]);

  const handleTogglePinTab = (tabId: string) => {
    const nextPinned = pinnedTab === tabId ? "live" : tabId;
    setInternalPinnedTab(nextPinned);
    setActivePinTab(nextPinned);
    if (typeof window !== "undefined") {
      localStorage.setItem("trakzee_pinned_tooltip_tab", nextPinned);
    }
    const label = PIN_TABS.find((t) => t.id === nextPinned)?.label || nextPinned;
    toast.success(`${label} pinned as default tooltip view`);
    onPinTabChange?.(nextPinned);
  };

  const [localEnabled, setLocalEnabled] = useState<string[]>(enabledWidgets);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<TooltipWidgetCategory[]>(TOOLTIP_WIDGET_CATEGORIES);

  // Accordion Expand / Collapse State for categories (all true by default)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    vehicle_info: true,
    today_activity: true,
    fuel: true,
    video_telematics: true,
    sensors: true,
    reminder: true,
    flow_meter: true,
    load_prediction: true,
    adblue: true,
    elock: true,
    trailer: true,
    passenger_seat: true,
    tpms: true,
    engine_parameters: true,
  });

  // Drag State for Categories
  const [draggedCatIndex, setDraggedCatIndex] = useState<number | null>(null);
  const [dragOverCatIndex, setDragOverCatIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setLocalEnabled(enabledWidgets);
    }
  }, [open, enabledWidgets]);

  if (!open || !mounted) return null;

  const toggleWidget = (id: string) => {
    setLocalEnabled((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleCategoryAll = (catId: string) => {
    const category = categories.find((c) => c.id === catId);
    if (!category) return;
    const catItemIds = category.items.map((i) => i.id);
    const isAllChecked = catItemIds.every((id) => localEnabled.includes(id));

    if (isAllChecked) {
      setLocalEnabled((prev) => prev.filter((id) => !catItemIds.includes(id)));
    } else {
      setLocalEnabled((prev) => Array.from(new Set([...prev, ...catItemIds])));
    }
  };

  const toggleCategoryExpand = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: prev[catId] === undefined ? false : !prev[catId],
    }));
  };

  const handleApply = () => {
    onApply(localEnabled);
    toast.success("Tooltip widgets updated successfully!", {
      description: `${localEnabled.length} widgets active on telemetry drawer.`,
    });
    onClose();
  };

  const handleReset = () => {
    setLocalEnabled(DEFAULT_ENABLED_WIDGETS);
    setSearchQuery("");
    setCategories(TOOLTIP_WIDGET_CATEGORIES);
    toast.info("Reset to default tooltip widgets.");
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] pointer-events-auto select-none">
      {/* Backdrop (Full screen overlay with backdrop blur) */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer animate-in fade-in duration-200 pointer-events-auto"
      />

      {/* Right-Side Drawer Panel (Mounted at body root, guaranteed 100% interactive) */}
      <div className="fixed inset-y-0 right-0 z-[10000] flex h-screen max-h-screen w-[320px] sm:w-[350px] flex-col border-l border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200 text-slate-900 dark:text-slate-100 font-sans text-xs pointer-events-auto">
        
        {/* 1. Header (Fixed top bar) */}
        <div className="flex h-11 items-center justify-between border-b border-[#DFE3EB] dark:border-slate-800 px-3.5 bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#0089FF]/10 text-[#0089FF]">
              <Settings className="h-3.5 w-3.5" />
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Tooltip Widget
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0089FF]/10 text-[#0089FF]">
                {localEnabled.length} active
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4 stroke-[2.2]" />
          </button>
        </div>

        {/* 2. Pin Tab Header Strip */}
        <div className="border-b border-[#DFE3EB] dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 px-3 py-2 space-y-1.5 shrink-0">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              PIN TAB
            </span>
            <span className="text-[10px] text-slate-400">Select active tab</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {PIN_TABS.map((tab) => {
              const IconComp = tab.icon;
              const isActive = activePinTab === tab.id;
              const isPinned = pinnedTab === tab.id;

              return (
                <div
                  key={tab.id}
                  className={cn(
                    "flex items-center rounded-lg text-[11px] font-medium shadow-2xs transition-all shrink-0 border select-none",
                    isActive
                      ? "bg-[#0089FF] text-white border-[#0070d6] font-semibold pl-2.5 pr-1 py-1 gap-1.5"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-[#DFE3EB] dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 pl-2.5 pr-1 py-1 gap-1.5",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setActivePinTab(tab.id);
                      handleTogglePinTab(tab.id);
                    }}
                    className="flex items-center gap-1.5 cursor-pointer active:scale-98"
                    title={`Set ${tab.label} as default view`}
                  >
                    <IconComp className={cn("h-3.5 w-3.5 stroke-[2]", isActive ? "text-white" : "text-slate-500")} />
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePinTab(tab.id);
                    }}
                    title={
                      isPinned
                        ? `${tab.label} is pinned as default tooltip view (Click to change)`
                        : `Pin ${tab.label} as default tooltip view (opens automatically)`
                    }
                    aria-label={`Pin ${tab.label} as default tooltip view`}
                    className={cn(
                      "h-5 w-5 rounded-md flex items-center justify-center cursor-pointer transition-all ml-0.5",
                      isPinned
                        ? isActive
                          ? "bg-white/25 text-amber-300 hover:bg-white/35 shadow-2xs"
                          : "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300"
                        : isActive
                          ? "text-white/70 hover:text-white hover:bg-white/15"
                          : "text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700",
                    )}
                  >
                    <Pin
                      className={cn(
                        "h-2.5 w-2.5 transition-transform",
                        isPinned ? "fill-amber-400 text-amber-400 rotate-45" : "-rotate-12",
                      )}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Search Bar */}
        <div className="p-3 border-b border-[#DFE3EB]/70 dark:border-slate-800/70 space-y-1 shrink-0 bg-white dark:bg-slate-900">
          <div className="flex h-8 items-center gap-2 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 focus-within:ring-1 focus-within:ring-[#0089FF] focus-within:border-[#0089FF] transition-all">
            <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search widget..."
              className="h-full flex-1 bg-transparent text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none min-w-0"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReset}
                title="Reset Widgets"
                className="text-slate-400 hover:text-[#0089FF] p-0.5 rounded cursor-pointer transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 italic leading-tight">
            *If no space available, remove some widgets to add new ones.
          </p>
        </div>

        {/* 4. Scrollable Content Body */}
        <div className="flex-1 min-h-0 p-3 overflow-y-auto overscroll-contain custom-scrollbar bg-slate-50/50 dark:bg-slate-950/40 pointer-events-auto">
          <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100 mb-2">
            Select Tooltip Widget
          </div>

          <div className="space-y-2.5 pb-8">
            {categories.map((cat, catIndex) => {
              const catItemIds = cat.items.map((i) => i.id);
              const filteredItems = searchQuery.trim()
                ? cat.items.filter((item) =>
                    item.label.toLowerCase().includes(searchQuery.trim().toLowerCase()),
                  )
                : cat.items;

              if (searchQuery.trim() && filteredItems.length === 0) {
                return null;
              }

              const isAllChecked = catItemIds.every((id) => localEnabled.includes(id));
              const isSomeChecked = catItemIds.some((id) => localEnabled.includes(id));
              const isIndeterminate = isSomeChecked && !isAllChecked;

              const isExpanded = expandedCategories[cat.id] !== false;

              const isCatDragging = draggedCatIndex === catIndex;
              const isCatDragOver = dragOverCatIndex === catIndex && draggedCatIndex !== catIndex;

              return (
                <div
                  key={cat.id}
                  draggable
                  onDragStart={(e) => {
                    e.stopPropagation();
                    e.dataTransfer.setData("text/plain", String(catIndex));
                    e.dataTransfer.effectAllowed = "move";
                    setDraggedCatIndex(catIndex);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.dataTransfer.dropEffect = "move";
                    if (dragOverCatIndex !== catIndex) {
                      setDragOverCatIndex(catIndex);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const rawIndex = e.dataTransfer.getData("text/plain");
                    const sourceIdx = rawIndex !== "" ? parseInt(rawIndex, 10) : draggedCatIndex;
                    if (sourceIdx !== null && !isNaN(sourceIdx) && sourceIdx !== catIndex) {
                      const updated = [...categories];
                      const [moved] = updated.splice(sourceIdx, 1);
                      updated.splice(catIndex, 0, moved);
                      setCategories(updated);
                      toast.success(`Reordered: ${moved.label}`);
                    }
                    setDraggedCatIndex(null);
                    setDragOverCatIndex(null);
                  }}
                  onDragEnd={(e) => {
                    e.stopPropagation();
                    setDraggedCatIndex(null);
                    setDragOverCatIndex(null);
                  }}
                  className={cn(
                    "rounded-xl border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs overflow-hidden transition-all duration-150 pointer-events-auto",
                    isCatDragging && "opacity-40 border-dashed border-[#0089FF]",
                    isCatDragOver && "border-t-2 border-t-[#0089FF] bg-[#0089FF]/5",
                  )}
                >
                  {/* Category Card Header */}
                  <div
                    onClick={() => toggleCategoryExpand(cat.id)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800/60 select-none cursor-pointer transition-colors",
                      isExpanded && "border-b border-[#DFE3EB]/60 dark:border-slate-800/60",
                    )}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {/* 1. Parent Category Checkbox (Aligned vertically with child checkboxes) */}
                      <input
                        type="checkbox"
                        checked={isAllChecked}
                        ref={(el) => {
                          if (el) el.indeterminate = isIndeterminate;
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => toggleCategoryAll(cat.id)}
                        className="h-3.5 w-3.5 rounded border-[#DFE3EB] dark:border-slate-700 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                      />

                      {/* 2. Chevron Icon for Expand / Collapse (On the right of the checkbox) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategoryExpand(cat.id);
                        }}
                        title={isExpanded ? "Collapse section" : "Expand section"}
                        className="p-0.5 rounded hover:bg-slate-200/70 dark:hover:bg-slate-700/70 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer shrink-0"
                      >
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 transition-transform duration-150",
                            !isExpanded && "-rotate-90",
                          )}
                        />
                      </button>

                      {/* 3. Name of the widget (Beside the chevron icon) */}
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate flex-1 min-w-0">
                        {cat.label}
                      </span>
                    </div>

                    {/* Single Drag Handle Icon (6-dots handle matching reference) */}
                    <div
                      title="Drag to reorder"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded text-slate-400 hover:text-[#0089FF] cursor-grab active:cursor-grabbing shrink-0"
                    >
                      <GripVertical className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Widget Child Checkboxes */}
                  {isExpanded && (
                    <div className="px-3 py-1.5 space-y-0.5 bg-white dark:bg-slate-900 animate-in fade-in duration-150">
                      {filteredItems.map((item) => {
                        const isChecked = localEnabled.includes(item.id);
                        return (
                          <label
                            key={item.id}
                            className={cn(
                              "flex items-center gap-2 py-1 px-1 -mx-1 rounded-md cursor-pointer transition-colors text-xs select-none hover:bg-slate-50 dark:hover:bg-slate-800/40",
                              isChecked
                                ? "text-slate-900 dark:text-slate-100 font-medium"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200",
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleWidget(item.id)}
                              className="h-3.5 w-3.5 rounded border-[#DFE3EB] dark:border-slate-700 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                            />
                            <span className="truncate flex-1">{item.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Footer Action Buttons (Locked strictly at bottom) */}
        <div className="flex items-center gap-2 border-t border-[#DFE3EB] dark:border-slate-800 p-3 shrink-0 bg-white dark:bg-slate-900 shadow-xl z-20 pointer-events-auto">
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-2 rounded-lg bg-[#0089FF] hover:bg-[#0070d6] text-white text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-98 text-center flex items-center justify-center gap-1.5"
          >
            <Check className="h-4 w-4 stroke-[2.5]" />
            Apply
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold transition-all cursor-pointer active:scale-98 text-center"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
