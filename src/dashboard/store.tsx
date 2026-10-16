import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Range } from "@/data/fleet";
import { WIDGET_CATALOG, type WidgetId, type WidgetSize } from "./widgets";

export type DashboardTab = {
  id: string;
  name: string;
  pinned: boolean;
  hidden: boolean;
  widgets: WidgetId[];
  widgetSizes?: Record<string, WidgetSize>;
  range: Range;
};

export type DashboardSettings = {
  density: "comfortable" | "compact";
  refreshSeconds: 0 | 30 | 60 | 300;
  showNotes: boolean;
  autoExpandNewTabs: boolean;
};

type State = {
  tabs: DashboardTab[];
  activeTabId: string;
  settings: DashboardSettings;
  pinnedMoreItems: string[];
  favorites: string[];
};

export const ALL_REFERENCE_WIDGETS: WidgetId[] = [
  // Row 1 (1 + 1 + 1 = 3)
  "fleet-status",
  "battery-status",
  "remote-lock-status",
  // Row 2 (1 + 2 = 3)
  "alerts-breakdown",
  "alert-heat-map",
  // Row 3 (1 + 1 + 1 = 3)
  "fleet-health",
  "component-failure",
  "fleet-stress-index",
  // Row 4 (1 + 1 + 1 = 3)
  "vehicle-status-alerts",
  "gsm-signal-quality",
  "geo-calibration-alerts",
  // Row 5 (1 + 1 + 1 = 3)
  "engine-efficiency",
  "battery-degradation",
  "fuel-loss-opportunity",
  // Row 6 (1 + 2 = 3)
  "job-status",
  "fleet-fuel",
  // Row 7 (6 Individual Mini Alarm Indicator Widgets)
  "overspeed-alarm",
  "harsh-cornering-alarm",
  "ac-freeze-alarm",
  "high-temp-alarm",
  "panic-sos-alarm",
  "collision-alarm",
  // Row 8 (Fleet Usage + 4 Individual 0.5x0.5 Operational Metric Widgets)
  "fleet-usage",
  "fleet-efficiency",
  "toll-expense",
  "carbon-emission",
  "active-alerts",
  // Row 9 (1 + 1 + 1 = 3)
  "vehicle-type-wise",
  "sos-alerts",
  "alerts-day-time",
  // Row 10 (1 + 2 = 3)
  "alerts-object-type",
  "risky-drivers",
  // Row 11 (1 + 1 + 1 = 3 - matching production screenshot)
  "fleet-score",
  "score-distribution",
  "camera-status",
  // Row 12 (2 + 1 = 3 - matching production screenshot)
  "event-heatmap",
  "shift-compliance",
];

export const DEFAULT_WIDGET_SIZES: Record<string, WidgetSize> = {
  // Row 1
  "fleet-status": "small",
  "battery-status": "small",
  "remote-lock-status": "small",
  // Row 2
  "alerts-breakdown": "small",
  "alert-heat-map": "medium",
  // Row 3
  "fleet-health": "small",
  "component-failure": "small",
  "fleet-stress-index": "small",
  // Row 4
  "vehicle-status-alerts": "small",
  "gsm-signal-quality": "small",
  "geo-calibration-alerts": "small",
  // Row 5
  "engine-efficiency": "small",
  "battery-degradation": "small",
  "fuel-loss-opportunity": "small",
  // Row 6
  "job-status": "small",
  "fleet-fuel": "medium",
  // Row 7 (Mini size)
  "overspeed-alarm": "mini",
  "harsh-cornering-alarm": "mini",
  "ac-freeze-alarm": "mini",
  "high-temp-alarm": "mini",
  "panic-sos-alarm": "mini",
  "collision-alarm": "mini",
  "alarm-status-tiles": "full",
  // Row 8
  "fleet-usage": "medium",
  "fleet-efficiency": "mini",
  "toll-expense": "mini",
  "carbon-emission": "mini",
  "active-alerts": "mini",
  "fleet-metrics-summary": "small",
  // Row 9
  "vehicle-type-wise": "small",
  "sos-alerts": "small",
  "alerts-day-time": "small",
  // Row 10
  "alerts-object-type": "small",
  "risky-drivers": "medium",
  // Row 11
  "fleet-score": "small",
  "score-distribution": "small",
  "camera-status": "small",
  // Row 12
  "event-heatmap": "medium",
  "shift-compliance": "small",
};

const DEFAULT_STATE: State = {
  tabs: [
    {
      id: "overview",
      name: "Overview",
      pinned: true,
      hidden: false,
      widgets: ALL_REFERENCE_WIDGETS,
      widgetSizes: DEFAULT_WIDGET_SIZES,
      range: "7d",
    },
    {
      id: "hardware",
      name: "Hardware & Diagnostics",
      pinned: true,
      hidden: false,
      widgets: [
        "fleet-health",
        "component-failure",
        "battery-status",
        "vehicle-status-alerts",
        "gsm-signal-quality",
        "geo-calibration-alerts",
        "battery-degradation",
        "engine-efficiency",
        "camera-status",
      ],
      widgetSizes: DEFAULT_WIDGET_SIZES,
      range: "7d",
    },
    {
      id: "safety",
      name: "Safety & Alerts",
      pinned: true,
      hidden: false,
      widgets: [
        "overspeed-alarm",
        "harsh-cornering-alarm",
        "ac-freeze-alarm",
        "high-temp-alarm",
        "panic-sos-alarm",
        "collision-alarm",
        "alerts-breakdown",
        "alert-heat-map",
        "geo-calibration-alerts",
        "sos-alerts",
        "alerts-day-time",
        "alerts-object-type",
        "risky-drivers",
      ],
      widgetSizes: DEFAULT_WIDGET_SIZES,
      range: "today",
    },
    {
      id: "drivers",
      name: "Driver & Compliance",
      pinned: false,
      hidden: false,
      widgets: [
        "fleet-score",
        "score-distribution",
        "fleet-stress-index",
        "risky-drivers",
        "shift-compliance",
      ],
      widgetSizes: DEFAULT_WIDGET_SIZES,
      range: "7d",
    },
    {
      id: "operations",
      name: "Fuel & Operations",
      pinned: false,
      hidden: false,
      widgets: [
        "job-status",
        "fleet-fuel",
        "fleet-usage",
        "fuel-loss-opportunity",
        "vehicle-type-wise",
        "fleet-efficiency",
        "toll-expense",
        "carbon-emission",
        "active-alerts",
        "fleet-status",
      ],
      widgetSizes: DEFAULT_WIDGET_SIZES,
      range: "7d",
    },
  ],
  activeTabId: "overview",
  settings: {
    density: "comfortable",
    refreshSeconds: 60,
    showNotes: true,
    autoExpandNewTabs: true,
  },
  pinnedMoreItems: [],
  favorites: ["today-activity"],
};

const STORAGE_KEY = "fleet-dashboard-state-v9";

type Ctx = State & {
  visibleTabs: DashboardTab[];
  hiddenTabs: DashboardTab[];
  activeTab: DashboardTab;
  canHide: (id: string) => boolean;
  canDelete: () => boolean;
  setActiveTab: (id: string) => void;
  addTab: (name?: string) => string;
  renameTab: (id: string, name: string) => void;
  togglePin: (id: string) => void;
  hideTab: (id: string) => boolean;
  showTab: (id: string) => void;
  deleteTab: (id: string) => DashboardTab | null;
  restoreTab: (tab: DashboardTab, index: number) => void;
  indexOfTab: (id: string) => number;
  moveTab: (id: string, direction: -1 | 1) => void;
  reorderTabs: (dragId: string, overId: string) => void;
  setTabRange: (id: string, range: Range) => void;
  toggleWidget: (tabId: string, widget: WidgetId) => void;
  setTabWidgets: (tabId: string, widgets: WidgetId[]) => void;
  moveWidget: (tabId: string, widget: WidgetId, direction: -1 | 1) => void;
  reorderWidgets: (
    tabId: string,
    dragWidget: WidgetId,
    overWidget: WidgetId,
  ) => void;
  setWidgetSize: (tabId: string, widgetId: WidgetId, size: WidgetSize) => void;
  updateSettings: (patch: Partial<DashboardSettings>) => void;
  toggleMorePin: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  resetAll: () => void;
};

const DashboardContext = createContext<Ctx | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>;
        if (parsed?.tabs?.length) {
          const validIds = new Set(WIDGET_CATALOG.map((w) => w.id));
          const mergedTabs = parsed.tabs.map((t) => {
            const expandedWidgets: WidgetId[] = [];
            for (const id of t.widgets || []) {
              if (id === ("alarm-status-tiles" as any)) {
                expandedWidgets.push(
                  "overspeed-alarm",
                  "harsh-cornering-alarm",
                  "ac-freeze-alarm",
                  "high-temp-alarm",
                  "panic-sos-alarm",
                  "collision-alarm",
                );
              } else if (id === ("fleet-metrics-summary" as any)) {
                expandedWidgets.push(
                  "fleet-efficiency",
                  "toll-expense",
                  "carbon-emission",
                  "active-alerts",
                );
              } else if (validIds.has(id)) {
                expandedWidgets.push(id);
              }
            }
            return {
              ...t,
              widgets: expandedWidgets,
              widgetSizes: {
                ...DEFAULT_WIDGET_SIZES,
                ...(t.widgetSizes || {}),
              },
            };
          });
          setState((prev) => ({
            ...DEFAULT_STATE,
            ...parsed,
            tabs: mergedTabs,
            favorites:
              Array.isArray(parsed.favorites) && parsed.favorites.length > 0
                ? parsed.favorites
                : DEFAULT_STATE.favorites,
            pinnedMoreItems: Array.isArray(parsed.pinnedMoreItems)
              ? parsed.pinnedMoreItems
              : [],
          }));
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable */
    }
  }, [state, hydrated]);

  const visibleTabs = useMemo(() => {
    const shown = state.tabs.filter((t) => !t.hidden);
    return [
      ...shown.filter((t) => t.pinned),
      ...shown.filter((t) => !t.pinned),
    ];
  }, [state.tabs]);

  const hiddenTabs = useMemo(
    () => state.tabs.filter((t) => t.hidden),
    [state.tabs],
  );

  const activeTab = useMemo(
    () =>
      (visibleTabs.find((t) => t.id === state.activeTabId) ??
        visibleTabs[0] ??
        state.tabs[0]) as DashboardTab,

    [visibleTabs, state.activeTabId, state.tabs],
  );

  const patchTab = useCallback((id: string, patch: Partial<DashboardTab>) => {
    setState((s) => ({
      ...s,
      tabs: s.tabs.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  }, []);

  const canHide = useCallback(
    (id: string) => {
      const tab = state.tabs.find((t) => t.id === id);
      if (!tab || tab.hidden) return false;
      return state.tabs.filter((t) => !t.hidden).length > 1;
    },
    [state.tabs],
  );

  const canDelete = useCallback(() => state.tabs.length > 1, [state.tabs]);

  const value: Ctx = {
    ...state,
    visibleTabs,
    hiddenTabs,
    activeTab,
    canHide,
    canDelete,
    setActiveTab: (id) => setState((s) => ({ ...s, activeTabId: id })),
    addTab: (name) => {
      const id = "tab-" + Date.now();
      setState((s) => {
        const count = s.tabs.filter((t) =>
          t.name.startsWith("New Group"),
        ).length;
        const tab: DashboardTab = {
          id,
          name: name?.trim() || "New Group " + (count + 1),
          pinned: false,
          hidden: false,
          widgets: s.settings.autoExpandNewTabs
            ? ["fleet-score", "events-highlights"]
            : [],
          range: "7d",
        };
        return { ...s, tabs: [...s.tabs, tab], activeTabId: id };
      });
      return id;
    },
    renameTab: (id, name) => {
      const clean = name.trim();
      if (clean) patchTab(id, { name: clean });
    },
    togglePin: (id) =>
      setState((s) => ({
        ...s,
        tabs: s.tabs.map((t) =>
          t.id === id ? { ...t, pinned: !t.pinned } : t,
        ),
      })),
    hideTab: (id) => {
      if (!canHide(id)) return false;
      setState((s) => {
        const tabs = s.tabs.map((t) =>
          t.id === id ? { ...t, hidden: true } : t,
        );
        const nextActive =
          s.activeTabId === id
            ? (tabs.find((t) => !t.hidden)?.id ?? s.activeTabId)
            : s.activeTabId;
        return { ...s, tabs, activeTabId: nextActive };
      });
      return true;
    },
    showTab: (id) => patchTab(id, { hidden: false }),
    deleteTab: (id) => {
      if (!canDelete()) return null;
      const removed = state.tabs.find((t) => t.id === id) ?? null;
      setState((s) => {
        const tabs = s.tabs.filter((t) => t.id !== id);
        const nextActive =
          s.activeTabId === id
            ? (tabs.find((t) => !t.hidden)?.id ?? tabs[0]!.id)
            : s.activeTabId;
        return { ...s, tabs, activeTabId: nextActive };
      });
      return removed;
    },
    restoreTab: (tab, index) =>
      setState((s) => {
        const tabs = [...s.tabs];
        tabs.splice(Math.min(index, tabs.length), 0, tab);
        return { ...s, tabs, activeTabId: tab.hidden ? s.activeTabId : tab.id };
      }),
    indexOfTab: (id) => state.tabs.findIndex((t) => t.id === id),
    moveTab: (id, direction) =>
      setState((s) => {
        const tabs = [...s.tabs];
        const from = tabs.findIndex((t) => t.id === id);
        const to = from + direction;
        if (from < 0 || to < 0 || to >= tabs.length) return s;
        [tabs[from], tabs[to]] = [tabs[to]!, tabs[from]!];
        return { ...s, tabs };
      }),
    reorderTabs: (dragId, overId) =>
      setState((s) => {
        if (dragId === overId) return s;
        const tabs = [...s.tabs];
        const from = tabs.findIndex((t) => t.id === dragId);
        const to = tabs.findIndex((t) => t.id === overId);
        if (from < 0 || to < 0) return s;
        const [moved] = tabs.splice(from, 1);
        tabs.splice(to, 0, moved!);
        return { ...s, tabs };
      }),
    setTabRange: (id, range) => patchTab(id, { range }),
    toggleWidget: (tabId, widget) =>
      setState((s) => ({
        ...s,
        tabs: s.tabs.map((t) =>
          t.id === tabId
            ? {
                ...t,
                widgets: t.widgets.includes(widget)
                  ? t.widgets.filter((w) => w !== widget)
                  : [...t.widgets, widget],
              }
            : t,
        ),
      })),
    setTabWidgets: (tabId, widgets) => patchTab(tabId, { widgets }),
    moveWidget: (tabId, widget, direction) =>
      setState((s) => ({
        ...s,
        tabs: s.tabs.map((t) => {
          if (t.id !== tabId) return t;
          const widgets = [...t.widgets];
          const from = widgets.indexOf(widget);
          const to = from + direction;
          if (from < 0 || to < 0 || to >= widgets.length) return t;
          [widgets[from], widgets[to]] = [widgets[to]!, widgets[from]!];
          return { ...t, widgets };
        }),
      })),
    reorderWidgets: (tabId, dragWidget, overWidget) =>
      setState((s) => ({
        ...s,
        tabs: s.tabs.map((t) => {
          if (t.id !== tabId) return t;
          if (dragWidget === overWidget) return t;
          const widgets = [...t.widgets];
          const from = widgets.indexOf(dragWidget);
          const to = widgets.indexOf(overWidget);
          if (from < 0 || to < 0) return t;
          const [moved] = widgets.splice(from, 1);
          if (moved) {
            widgets.splice(to, 0, moved);
          }
          return { ...t, widgets };
        }),
      })),
    setWidgetSize: (tabId, widgetId, size) =>
      setState((s) => ({
        ...s,
        tabs: s.tabs.map((t) =>
          t.id === tabId
            ? {
                ...t,
                widgetSizes: {
                  ...(t.widgetSizes || {}),
                  [widgetId]: size,
                },
              }
            : t,
        ),
      })),
    updateSettings: (patch) =>
      setState((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
    toggleFavorite: (id) =>
      setState((s) => {
        const currentFavs = Array.isArray(s.favorites) ? s.favorites : [];
        const next = currentFavs.includes(id)
          ? currentFavs.filter((i) => i !== id)
          : [...currentFavs, id];
        return { ...s, favorites: next };
      }),
    isFavorite: (id) =>
      Array.isArray(state.favorites) ? state.favorites.includes(id) : false,
    toggleMorePin: (id) =>
      setState((s) => ({
        ...s,
        pinnedMoreItems: s.pinnedMoreItems.includes(id)
          ? s.pinnedMoreItems.filter((i) => i !== id)
          : [...s.pinnedMoreItems, id],
      })),
    resetAll: () => setState(DEFAULT_STATE),
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx)
    throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
