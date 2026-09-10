import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/radix-ui__react-popover.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-Butx-LES.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Popover = Root2;
var PopoverTrigger = Trigger;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md p-3 text-popover-foreground shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = Content2.displayName;
var WIDGET_CATALOG = [
	{
		id: "event-trend",
		title: "Event Trend",
		category: "VIDEO TELEMATICS",
		description: "Trend of DMS & ADAS safety events over time",
		hasRange: true
	},
	{
		id: "events-distribution",
		title: "Event Distribution",
		category: "VIDEO TELEMATICS",
		description: "DMS vs ADAS event split",
		hasRange: true
	},
	{
		id: "events-highlights",
		title: "Event Highlights",
		category: "VIDEO TELEMATICS",
		description: "Latest violations and event captures feed",
		hasRange: true
	},
	{
		id: "fleet-score",
		title: "Fleet Average Score",
		category: "VIDEO TELEMATICS",
		description: "Overall fleet safety rating gauge",
		hasRange: true
	},
	{
		id: "score-distribution",
		title: "Driver Score Distribution",
		category: "VIDEO TELEMATICS",
		description: "Drivers categorized per score bracket",
		hasRange: true
	},
	{
		id: "risky-drivers",
		title: "Top 5 Risky Drivers",
		category: "VIDEO TELEMATICS",
		description: "Drivers with lowest safety scores",
		hasRange: true
	},
	{
		id: "event-heatmap",
		title: "Event Heatmap",
		category: "VIDEO TELEMATICS",
		description: "Geographic hot zones of critical safety alerts",
		hasRange: true
	},
	{
		id: "fleet-status",
		title: "Fleet Status",
		category: "ACTIVITY",
		description: "Running, Idle, Stopped, Inactive fleet breakdown",
		hasRange: true
	},
	{
		id: "fleet-usage",
		title: "Fleet Usage",
		category: "ACTIVITY",
		description: "Daily distance traveled and operating hours",
		hasRange: true
	},
	{
		id: "fleet-idle",
		title: "Fleet Idle",
		category: "ACTIVITY",
		description: "Vehicles with excessive engine idling time",
		hasRange: true
	},
	{
		id: "fleet-fuel",
		title: "Fleet Fuel",
		category: "ACTIVITY",
		description: "Total fuel consumption and refuel/drain events",
		hasRange: true
	},
	{
		id: "fleet-workload",
		title: "Fleet Workload",
		category: "ACTIVITY",
		description: "Asset utilization vs scheduled duty cycles",
		hasRange: true
	},
	{
		id: "driver-most-alerts",
		title: "Driver With Most Alerts",
		category: "ACTIVITY",
		description: "Drivers triggering highest alarm frequencies",
		hasRange: true
	},
	{
		id: "object-most-alerts",
		title: "Object With Most Alerts",
		category: "ACTIVITY",
		description: "Vehicles generating the most system alerts",
		hasRange: true
	},
	{
		id: "object-mode",
		title: "Object Mode",
		category: "ACTIVITY",
		description: "Operating mode distribution across fleet assets",
		hasRange: true
	},
	{
		id: "camera-status",
		title: "Camera Status",
		category: "VIDEO TELEMATICS",
		description: "Online / offline cameras",
		hasRange: false
	}
];
var widgetMeta = (id) => WIDGET_CATALOG.find((w) => w.id === id) ?? WIDGET_CATALOG[0];
var DEFAULT_STATE = {
	tabs: [
		{
			id: "overview",
			name: "Overview",
			pinned: true,
			hidden: false,
			widgets: WIDGET_CATALOG.map((w) => w.id),
			range: "7d"
		},
		{
			id: "fuel",
			name: "Fuel Dashboard",
			pinned: true,
			hidden: false,
			widgets: [
				"fleet-score",
				"events-distribution",
				"camera-status"
			],
			range: "7d"
		},
		{
			id: "temperature",
			name: "Temperature Dashboard",
			pinned: true,
			hidden: false,
			widgets: ["score-distribution", "events-highlights"],
			range: "today"
		},
		{
			id: "maintenance",
			name: "Maintenance Log",
			pinned: false,
			hidden: true,
			widgets: ["fleet-score"],
			range: "7d"
		},
		{
			id: "driver-behavior",
			name: "Driver Behavior",
			pinned: false,
			hidden: true,
			widgets: ["risky-drivers"],
			range: "7d"
		}
	],
	activeTabId: "overview",
	settings: {
		density: "comfortable",
		refreshSeconds: 60,
		showNotes: true,
		autoExpandNewTabs: true
	},
	pinnedMoreItems: [],
	favorites: ["today-activity"]
};
var STORAGE_KEY = "fleet-dashboard-state-v2";
var DashboardContext = (0, import_react.createContext)(null);
function DashboardProvider({ children }) {
	const [state, setState] = (0, import_react.useState)(DEFAULT_STATE);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (parsed?.tabs?.length) setState((prev) => ({
					...DEFAULT_STATE,
					...parsed,
					favorites: Array.isArray(parsed.favorites) && parsed.favorites.length > 0 ? parsed.favorites : DEFAULT_STATE.favorites,
					pinnedMoreItems: Array.isArray(parsed.pinnedMoreItems) ? parsed.pinnedMoreItems : []
				}));
			}
		} catch {}
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		} catch {}
	}, [state, hydrated]);
	const visibleTabs = (0, import_react.useMemo)(() => {
		const shown = state.tabs.filter((t) => !t.hidden);
		return [...shown.filter((t) => t.pinned), ...shown.filter((t) => !t.pinned)];
	}, [state.tabs]);
	const hiddenTabs = (0, import_react.useMemo)(() => state.tabs.filter((t) => t.hidden), [state.tabs]);
	const activeTab = (0, import_react.useMemo)(() => visibleTabs.find((t) => t.id === state.activeTabId) ?? visibleTabs[0] ?? state.tabs[0], [
		visibleTabs,
		state.activeTabId,
		state.tabs
	]);
	const patchTab = (0, import_react.useCallback)((id, patch) => {
		setState((s) => ({
			...s,
			tabs: s.tabs.map((t) => t.id === id ? {
				...t,
				...patch
			} : t)
		}));
	}, []);
	const canHide = (0, import_react.useCallback)((id) => {
		const tab = state.tabs.find((t) => t.id === id);
		if (!tab || tab.hidden) return false;
		return state.tabs.filter((t) => !t.hidden).length > 1;
	}, [state.tabs]);
	const canDelete = (0, import_react.useCallback)(() => state.tabs.length > 1, [state.tabs]);
	const value = {
		...state,
		visibleTabs,
		hiddenTabs,
		activeTab,
		canHide,
		canDelete,
		setActiveTab: (id) => setState((s) => ({
			...s,
			activeTabId: id
		})),
		addTab: (name) => {
			const id = "tab-" + Date.now();
			setState((s) => {
				const count = s.tabs.filter((t) => t.name.startsWith("New Group")).length;
				const tab = {
					id,
					name: name?.trim() || "New Group " + (count + 1),
					pinned: false,
					hidden: false,
					widgets: s.settings.autoExpandNewTabs ? ["fleet-score", "events-highlights"] : [],
					range: "7d"
				};
				return {
					...s,
					tabs: [...s.tabs, tab],
					activeTabId: id
				};
			});
			return id;
		},
		renameTab: (id, name) => {
			const clean = name.trim();
			if (clean) patchTab(id, { name: clean });
		},
		togglePin: (id) => setState((s) => ({
			...s,
			tabs: s.tabs.map((t) => t.id === id ? {
				...t,
				pinned: !t.pinned
			} : t)
		})),
		hideTab: (id) => {
			if (!canHide(id)) return false;
			setState((s) => {
				const tabs = s.tabs.map((t) => t.id === id ? {
					...t,
					hidden: true
				} : t);
				const nextActive = s.activeTabId === id ? tabs.find((t) => !t.hidden)?.id ?? s.activeTabId : s.activeTabId;
				return {
					...s,
					tabs,
					activeTabId: nextActive
				};
			});
			return true;
		},
		showTab: (id) => patchTab(id, { hidden: false }),
		deleteTab: (id) => {
			if (!canDelete()) return null;
			const removed = state.tabs.find((t) => t.id === id) ?? null;
			setState((s) => {
				const tabs = s.tabs.filter((t) => t.id !== id);
				const nextActive = s.activeTabId === id ? tabs.find((t) => !t.hidden)?.id ?? tabs[0].id : s.activeTabId;
				return {
					...s,
					tabs,
					activeTabId: nextActive
				};
			});
			return removed;
		},
		restoreTab: (tab, index) => setState((s) => {
			const tabs = [...s.tabs];
			tabs.splice(Math.min(index, tabs.length), 0, tab);
			return {
				...s,
				tabs,
				activeTabId: tab.hidden ? s.activeTabId : tab.id
			};
		}),
		indexOfTab: (id) => state.tabs.findIndex((t) => t.id === id),
		moveTab: (id, direction) => setState((s) => {
			const tabs = [...s.tabs];
			const from = tabs.findIndex((t) => t.id === id);
			const to = from + direction;
			if (from < 0 || to < 0 || to >= tabs.length) return s;
			[tabs[from], tabs[to]] = [tabs[to], tabs[from]];
			return {
				...s,
				tabs
			};
		}),
		reorderTabs: (dragId, overId) => setState((s) => {
			if (dragId === overId) return s;
			const tabs = [...s.tabs];
			const from = tabs.findIndex((t) => t.id === dragId);
			const to = tabs.findIndex((t) => t.id === overId);
			if (from < 0 || to < 0) return s;
			const [moved] = tabs.splice(from, 1);
			tabs.splice(to, 0, moved);
			return {
				...s,
				tabs
			};
		}),
		setTabRange: (id, range) => patchTab(id, { range }),
		toggleWidget: (tabId, widget) => setState((s) => ({
			...s,
			tabs: s.tabs.map((t) => t.id === tabId ? {
				...t,
				widgets: t.widgets.includes(widget) ? t.widgets.filter((w) => w !== widget) : [...t.widgets, widget]
			} : t)
		})),
		setTabWidgets: (tabId, widgets) => patchTab(tabId, { widgets }),
		moveWidget: (tabId, widget, direction) => setState((s) => ({
			...s,
			tabs: s.tabs.map((t) => {
				if (t.id !== tabId) return t;
				const widgets = [...t.widgets];
				const from = widgets.indexOf(widget);
				const to = from + direction;
				if (from < 0 || to < 0 || to >= widgets.length) return t;
				[widgets[from], widgets[to]] = [widgets[to], widgets[from]];
				return {
					...t,
					widgets
				};
			})
		})),
		reorderWidgets: (tabId, dragWidget, overWidget) => setState((s) => ({
			...s,
			tabs: s.tabs.map((t) => {
				if (t.id !== tabId) return t;
				if (dragWidget === overWidget) return t;
				const widgets = [...t.widgets];
				const from = widgets.indexOf(dragWidget);
				const to = widgets.indexOf(overWidget);
				if (from < 0 || to < 0) return t;
				const [moved] = widgets.splice(from, 1);
				if (moved) widgets.splice(to, 0, moved);
				return {
					...t,
					widgets
				};
			})
		})),
		updateSettings: (patch) => setState((s) => ({
			...s,
			settings: {
				...s.settings,
				...patch
			}
		})),
		toggleFavorite: (id) => setState((s) => {
			const currentFavs = Array.isArray(s.favorites) ? s.favorites : [];
			const next = currentFavs.includes(id) ? currentFavs.filter((i) => i !== id) : [...currentFavs, id];
			return {
				...s,
				favorites: next
			};
		}),
		isFavorite: (id) => Array.isArray(state.favorites) ? state.favorites.includes(id) : false,
		toggleMorePin: (id) => setState((s) => ({
			...s,
			pinnedMoreItems: s.pinnedMoreItems.includes(id) ? s.pinnedMoreItems.filter((i) => i !== id) : [...s.pinnedMoreItems, id]
		})),
		resetAll: () => setState(DEFAULT_STATE)
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardContext.Provider, {
		value,
		children
	});
}
function useDashboard() {
	const ctx = (0, import_react.useContext)(DashboardContext);
	if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
	return ctx;
}
//#endregion
export { WIDGET_CATALOG as a, PopoverTrigger as i, Popover as n, useDashboard as o, PopoverContent as r, widgetMeta as s, DashboardProvider as t };
