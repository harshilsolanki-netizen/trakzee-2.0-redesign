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
import { WIDGET_CATALOG, type WidgetId } from "./widgets";

export type DashboardTab = {
  id: string;
  name: string;
  pinned: boolean;
  hidden: boolean;
  widgets: WidgetId[];
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

const allWidgets = WIDGET_CATALOG.map((w) => w.id);

const DEFAULT_STATE: State = {
  tabs: [
    {
      id: "overview",
      name: "Overview",
      pinned: true,
      hidden: false,
      widgets: allWidgets,
      range: "7d",
    },
    {
      id: "fuel",
      name: "Fuel Dashboard",
      pinned: true,
      hidden: false,
      widgets: ["fleet-score", "events-distribution", "camera-status"],
      range: "7d",
    },
    {
      id: "temperature",
      name: "Temperature Dashboard",
      pinned: true,
      hidden: false,
      widgets: ["score-distribution", "events-highlights"],
      range: "today",
    },
    {
      id: "maintenance",
      name: "Maintenance Log",
      pinned: false,
      hidden: true,
      widgets: ["fleet-score"],
      range: "7d",
    },
    {
      id: "driver-behavior",
      name: "Driver Behavior",
      pinned: false,
      hidden: true,
      widgets: ["risky-drivers"],
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

const STORAGE_KEY = "fleet-dashboard-state-v2";

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
          setState((prev) => ({
            ...DEFAULT_STATE,
            ...parsed,
            favorites: Array.isArray(parsed.favorites)
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
