import { i as __toESM } from "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { d as REPORT_CATEGORIES, i as CHART_CATEGORIES, t as ALL_REPORTS, y as findReport } from "./reports-D0j_491Z.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { A as Shield, C as Star, D as SlidersVertical, Dt as FileCode, E as Sparkles, F as Search, G as PinOff, L as Route, M as Settings, Mt as Download, Nt as CreditCard, Ot as Eye, Pt as Cpu, R as RotateCw, Rt as Cloud, St as Fuel, Ut as CircleGauge, V as Receipt, W as Pin, X as Palette, Xt as Check, Yt as ChevronDown, _ as TrendingUp, a as Waves, an as CalendarClock, at as LogOut, bt as Globe, cn as Bell, d as UserPlus, dt as LayoutDashboard, en as ChartColumn, f as UserCheck, fn as ArrowRight, g as TriangleAlert, hn as Activity, i as Weight, it as Mail, jt as Droplet, k as ShoppingCart, kt as EyeOff, l as Users, lt as LifeBuoy, n as X, nn as Car, o as Wallet, on as Briefcase, ot as Lock, pt as KeyRound, qt as ChevronRight, r as Wrench, rt as MapPin, t as Zap, u as User, un as Award, ut as LayoutGrid, wt as FileText, x as Thermometer, xt as Gauge, y as Trash2, yt as Grid2x2 } from "../_libs/lucide-react.mjs";
import { d as DialogContent, f as DialogDescription, h as DialogTitle, l as Dialog, m as DialogPortal, p as DialogOverlay, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { c as DropdownMenuSubContent, i as DropdownMenuItem, l as DropdownMenuSubTrigger, n as DropdownMenuContent, r as DropdownMenuGroup, s as DropdownMenuSub, t as DropdownMenu, u as DropdownMenuTrigger } from "./dropdown-menu-U4x0DS5F.mjs";
import { _ as Link, b as useRouter, c as HeadContent, f as createRouter, g as createRootRouteWithContext, h as createFileRoute, l as useLocation, m as lazyRouteComponent, p as Outlet, s as Scripts, u as useRouterState, v as useNavigate, y as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { i as TooltipTrigger, n as TooltipContent, r as TooltipProvider, t as Tooltip } from "./tooltip-yj1PAv0W.mjs";
import { n as objectType, r as stringType, t as booleanType } from "../_libs/zod.mjs";
import { i as PopoverTrigger, n as Popover, o as useDashboard, r as PopoverContent, t as DashboardProvider } from "./store-LVQlPua9.mjs";
import { n as FavoritesMenu } from "./FavoritesMenu-HgudenNA.mjs";
import { n as useZio, t as ZioProvider } from "./ZioContext-Cw_R09Nu.mjs";
import { t as ZioPanel } from "./ZioPanel-lLJH_t-F.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CSzU1WA7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORY_ICONS = {
	activity: Activity,
	alert: Bell,
	fuel: Fuel,
	adblue: Droplet,
	expense: Receipt,
	tire: CircleGauge,
	temperature: Thermometer,
	load: Weight,
	pressure_gauge: Gauge,
	rotation: RotateCw,
	bms: Cpu,
	rpm: Zap,
	depth: Waves,
	flow_meter: TrendingUp
};
var CHART_CATEGORY_GROUPS = [
	{
		groupLabel: "CORE TELEMATICS",
		categories: [
			"activity",
			"alert",
			"fuel",
			"adblue",
			"expense"
		]
	},
	{
		groupLabel: "SENSORS & GAUGES",
		categories: [
			"temperature",
			"tire",
			"load",
			"pressure_gauge",
			"rotation"
		]
	},
	{
		groupLabel: "ENGINE & METRICS",
		categories: [
			"rpm",
			"bms",
			"depth",
			"flow_meter"
		]
	}
];
var ALL_CHARTS = CHART_CATEGORIES.flatMap((c) => c.items);
function ChartsMenu() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [activeCategory, setActiveCategory] = (0, import_react.useState)("activity");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const navigate = useNavigate();
	const location = useLocation();
	const isChartsRoute = location.pathname.startsWith("/charts");
	const currentChartId = (0, import_react.useMemo)(() => {
		if (typeof window !== "undefined") return new URLSearchParams(window.location.search).get("chart") || "distance";
		return "distance";
	}, [location.search, open]);
	(0, import_react.useEffect)(() => {
		if (open) {
			setSearchQuery("");
			const currentChart = ALL_CHARTS.find((c) => c.id === currentChartId);
			if (currentChart) setActiveCategory(currentChart.category);
		}
	}, [open, currentChartId]);
	const selectedCategoryNode = (0, import_react.useMemo)(() => {
		return CHART_CATEGORIES.find((c) => c.category === activeCategory) ?? CHART_CATEGORIES[0];
	}, [activeCategory]);
	const searchResults = (0, import_react.useMemo)(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return [];
		return ALL_CHARTS.filter((c) => c.label.toLowerCase().includes(q) || c.categoryLabel.toLowerCase().includes(q) || c.metric.toLowerCase().includes(q));
	}, [searchQuery]);
	const handleSelectChart = (item) => {
		setOpen(false);
		navigate({
			to: "/charts",
			search: { chart: item.id }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"aria-label": "Charts",
				className: "group flex w-full flex-col items-center gap-1 py-1 cursor-pointer select-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200", open || isChartsRoute ? "bg-[#0089FF] text-white shadow-md shadow-blue-500/25" : "text-slate-400 group-hover:bg-white/10 group-hover:text-white"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("text-[10px] leading-tight tracking-tight transition-colors", open || isChartsRoute ? "font-semibold text-white" : "font-medium text-slate-400 group-hover:text-white"),
					children: "Charts"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
			side: "right",
			align: "start",
			sideOffset: 8,
			className: "w-auto min-w-[440px] max-w-[500px] overflow-hidden rounded-2xl border border-slate-700/60 bg-[#0c1424]/98 p-0 text-slate-100 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-150",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-slate-800/80 bg-slate-900/60 px-3 py-2.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex items-center rounded-lg border border-slate-700/60 bg-slate-950/60 px-2.5 py-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/30 transition-all",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 text-slate-400 shrink-0 mr-2" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value),
								placeholder: "Search 40+ charts & telemetry...",
								className: "h-full flex-1 bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
							}),
							searchQuery ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSearchQuery(""),
								className: "text-slate-400 hover:text-slate-200 cursor-pointer p-0.5 rounded",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-mono text-slate-500 bg-slate-800/60 border border-slate-700/50 px-1.5 py-0.5 rounded",
								children: "44 Charts"
							})
						]
					})
				}),
				searchQuery.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-[64vh] min-h-[200px] overflow-y-auto overscroll-contain p-2 space-y-1",
					children: searchResults.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-10 text-center text-xs text-slate-400",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mx-auto h-6 w-6 opacity-30 mb-2" }),
							"No charts found matching “",
							searchQuery,
							"”"
						]
					}) : searchResults.map((item) => {
						const isSelected = item.id === currentChartId && isChartsRoute;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => handleSelectChart(item),
							className: cn("flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-all cursor-pointer group", isSelected ? "bg-blue-600 text-white font-semibold shadow-md" : "text-slate-200 hover:bg-slate-800/80 hover:text-white"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium truncate",
								children: item.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60",
									children: item.categoryLabel
								}), isSelected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-white" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" })]
							})]
						}, item.id);
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex divide-x divide-slate-800/80 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex w-[190px] flex-col py-2 max-h-[68vh] overflow-y-auto overscroll-contain space-y-3 scrollbar-thin scrollbar-thumb-slate-800",
						children: CHART_CATEGORY_GROUPS.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-0.5 px-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400",
								children: group.groupLabel
							}), group.categories.map((catKey) => {
								const cat = CHART_CATEGORIES.find((c) => c.category === catKey);
								if (!cat) return null;
								const Icon = CATEGORY_ICONS[cat.category] || Activity;
								const isActive = cat.category === selectedCategoryNode.category;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onMouseEnter: () => setActiveCategory(cat.category),
									onClick: () => setActiveCategory(cat.category),
									className: cn("flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left transition-all duration-100 cursor-pointer group", isActive ? "bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30 shadow-xs" : "text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex min-w-0 items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-3.5 w-3.5 shrink-0 transition-colors", isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: cat.label
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("text-[10px] font-mono px-1.5 py-0.2 rounded transition-colors", isActive ? "bg-blue-500/30 text-blue-200" : "bg-slate-800/80 text-slate-400 group-hover:text-slate-300"),
											children: cat.items.length
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: cn("h-3 w-3 shrink-0 transition-transform", isActive ? "text-blue-400 translate-x-0.5" : "text-slate-600 opacity-40") })]
									})]
								}, cat.category);
							})]
						}, group.groupLabel))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-[225px] flex-col py-2 bg-slate-950/40 max-h-[68vh] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-3 pb-2 mb-1 border-b border-slate-800/60 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] font-bold text-slate-300",
								children: [selectedCategoryNode.label, " Charts"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] font-mono text-slate-400",
								children: [selectedCategoryNode.items.length, " metrics"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-0.5 px-1.5",
							children: selectedCategoryNode.items.map((item) => {
								const isSelected = item.id === currentChartId && isChartsRoute;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => handleSelectChart(item),
									className: cn("flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-all duration-100 cursor-pointer group", isSelected ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/25" : "text-slate-300 hover:bg-slate-800/80 hover:text-white"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: item.label
									}), isSelected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 shrink-0 text-white" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 shrink-0 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" })]
								}, item.id);
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-slate-800/80 bg-slate-950/80 px-3 py-1.5 text-[10px] text-slate-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-blue-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "14 Categories · 44 Telemetry Charts" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-slate-400 font-mono",
						children: "Click to open"
					})]
				})
			]
		})]
	});
}
var REPORT_CATEGORY_ICONS = {
	activity: Activity,
	geofence_address: MapPin,
	sensor: Cpu,
	alert: Bell,
	reminder: CalendarClock,
	expense: Receipt,
	fuel: Fuel,
	adblue: Droplet,
	rpm: Zap,
	temperature: Thermometer,
	job: Briefcase,
	elock: Lock,
	tire: CircleGauge,
	driver: UserCheck,
	obd: Gauge,
	trip_classification: Route,
	billing: CreditCard,
	load: Weight,
	customized: SlidersVertical,
	logs: FileCode,
	kpi: Award,
	hardware_maintenance: Wrench,
	employee: Users
};
var CATEGORY_GROUPS = [
	{
		groupLabel: "OPERATIONS",
		categoryKeys: [
			"activity",
			"geofence_address",
			"sensor",
			"alert",
			"reminder",
			"trip_classification"
		]
	},
	{
		groupLabel: "TELEMATICS & ASSETS",
		categoryKeys: [
			"fuel",
			"adblue",
			"rpm",
			"temperature",
			"job",
			"elock",
			"tire",
			"driver",
			"obd",
			"load"
		]
	},
	{
		groupLabel: "BUSINESS & SYSTEM",
		categoryKeys: [
			"expense",
			"billing",
			"customized",
			"logs",
			"kpi",
			"hardware_maintenance",
			"employee"
		]
	}
];
function ReportsMenu() {
	const { favorites = [], toggleFavorite, isFavorite } = useDashboard();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [activeCategory, setActiveCategory] = (0, import_react.useState)("activity");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const navigate = useNavigate();
	const location = useLocation();
	const search = useSearch({ strict: false });
	const isReportsRoute = location.pathname.startsWith("/report");
	const currentReportType = search?.type || "travel";
	const favoriteItems = (0, import_react.useMemo)(() => {
		return (favorites ?? []).map(findReport).filter(Boolean);
	}, [favorites]);
	(0, import_react.useEffect)(() => {
		if (open) {
			setSearchQuery("");
			const currentReport = ALL_REPORTS.find((r) => r.id === currentReportType);
			if (currentReport) {
				const matchingCat = REPORT_CATEGORIES.find((c) => c.items.some((item) => item.id === currentReport.id));
				if (matchingCat) setActiveCategory(matchingCat.category);
			}
		}
	}, [open, currentReportType]);
	const selectedCategoryNode = (0, import_react.useMemo)(() => {
		if (activeCategory === "favorites") return {
			category: "favorites",
			label: "Favourites",
			items: favoriteItems
		};
		return REPORT_CATEGORIES.find((c) => c.category === activeCategory) ?? REPORT_CATEGORIES[0];
	}, [activeCategory, favoriteItems]);
	const searchResults = (0, import_react.useMemo)(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return [];
		return ALL_REPORTS.filter((r) => r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || r.id.toLowerCase().includes(q));
	}, [searchQuery]);
	const handleSelectReport = (item) => {
		setOpen(false);
		navigate({
			to: "/report",
			search: { type: item.id }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"aria-label": "Report",
				className: "group flex w-full flex-col items-center gap-1 py-1 cursor-pointer select-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200", open || isReportsRoute ? "bg-[#0089FF] text-white shadow-md shadow-blue-500/25" : "text-slate-400 group-hover:bg-white/10 group-hover:text-white"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("text-[10px] leading-tight tracking-tight transition-colors", open || isReportsRoute ? "font-semibold text-white" : "font-medium text-slate-400 group-hover:text-white"),
					children: "Report"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
			side: "right",
			align: "start",
			sideOffset: 8,
			className: "w-auto min-w-[460px] max-w-[520px] overflow-hidden rounded-2xl border border-slate-700/60 bg-[#0c1424]/98 p-0 text-slate-100 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-150",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-slate-800/80 bg-slate-900/60 px-3 py-2.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex items-center rounded-lg border border-slate-700/60 bg-slate-950/60 px-2.5 py-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/30 transition-all",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 text-slate-400 shrink-0 mr-2" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value),
								placeholder: "Search 100+ fleet reports, metrics...",
								className: "h-full flex-1 bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
							}),
							searchQuery ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSearchQuery(""),
								className: "text-slate-400 hover:text-slate-200 cursor-pointer p-0.5 rounded",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-mono text-slate-500 bg-slate-800/60 border border-slate-700/50 px-1.5 py-0.5 rounded",
								children: "105 Reports"
							})
						]
					})
				}),
				searchQuery.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-[68vh] min-h-[220px] overflow-y-auto overscroll-contain p-2 space-y-1",
					children: searchResults.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-12 text-center text-xs text-slate-400",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mx-auto h-6 w-6 opacity-30 mb-2" }),
							"No reports found matching “",
							searchQuery,
							"”"
						]
					}) : searchResults.map((item) => {
						const isSelected = item.id === currentReportType && isReportsRoute;
						const fav = isFavorite(item.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs transition-all group", isSelected ? "bg-blue-600 text-white font-semibold shadow-md" : "text-slate-200 hover:bg-slate-800/80 hover:text-white"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => handleSelectReport(item),
								className: "flex flex-1 items-center gap-2 min-w-0 text-left cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium truncate",
									children: item.name
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 shrink-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60",
										children: item.category
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										title: fav ? "Remove from favourites" : "Add to favourites",
										onClick: (e) => {
											e.stopPropagation();
											toggleFavorite(item.id);
										},
										className: "p-1 text-slate-400 hover:text-amber-400 cursor-pointer rounded transition-all",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("h-3.5 w-3.5 transition-colors", fav ? "fill-amber-400 text-amber-400" : "opacity-0 group-hover:opacity-70 hover:opacity-100") })
									}),
									isSelected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-white ml-1" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 ml-1" })
								]
							})]
						}, item.id);
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex divide-x divide-slate-800/80 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-[205px] flex-col py-2 max-h-[72vh] overflow-y-auto overscroll-contain space-y-3 scrollbar-thin scrollbar-thumb-slate-800",
						children: [favoriteItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-0.5 px-1.5 pb-1 border-b border-slate-800/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400/80",
								children: "FAVOURITES"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onMouseEnter: () => setActiveCategory("favorites"),
								onClick: () => setActiveCategory("favorites"),
								className: cn("flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left transition-all duration-100 cursor-pointer group", activeCategory === "favorites" ? "bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40 shadow-xs" : "text-amber-400/90 hover:bg-amber-500/10 hover:text-amber-300 border border-transparent"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex min-w-0 items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate font-semibold",
										children: "Favourites"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold",
										children: favoriteItems.length
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3 shrink-0 text-amber-400/60" })]
								})]
							})]
						}), CATEGORY_GROUPS.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-0.5 px-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400",
								children: group.groupLabel
							}), group.categoryKeys.map((catKey) => {
								const cat = REPORT_CATEGORIES.find((c) => c.category === catKey);
								if (!cat) return null;
								const Icon = REPORT_CATEGORY_ICONS[cat.category] || Activity;
								const isActive = cat.category === selectedCategoryNode.category;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onMouseEnter: () => setActiveCategory(cat.category),
									onClick: () => setActiveCategory(cat.category),
									className: cn("flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left transition-all duration-100 cursor-pointer group", isActive ? "bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30 shadow-xs" : "text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex min-w-0 items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-3.5 w-3.5 shrink-0 transition-colors", isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: cat.label
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("text-[10px] font-mono px-1.5 py-0.2 rounded transition-colors", isActive ? "bg-blue-500/30 text-blue-200" : "bg-slate-800/80 text-slate-400 group-hover:text-slate-300"),
											children: cat.items.length
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: cn("h-3 w-3 shrink-0 transition-transform", isActive ? "text-blue-400 translate-x-0.5" : "text-slate-600 opacity-40") })]
									})]
								}, cat.category);
							})]
						}, group.groupLabel))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-[245px] flex-col py-2 bg-slate-950/40 max-h-[72vh] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-3 pb-2 mb-1 border-b border-slate-800/60 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] font-bold text-slate-300 flex items-center gap-1.5",
								children: [
									selectedCategoryNode.category === "favorites" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-amber-400 text-amber-400" }) : null,
									selectedCategoryNode.label,
									" Reports"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] font-mono text-slate-400",
								children: [selectedCategoryNode.items.length, " options"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-0.5 px-1.5",
							children: selectedCategoryNode.items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-8 text-center text-xs text-slate-400",
								children: "No favourite reports yet. Click the star on any report to save it here."
							}) : selectedCategoryNode.items.map((item) => {
								const isSelected = item.id === currentReportType && isReportsRoute;
								const fav = isFavorite(item.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cn("flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-all duration-100 group", isSelected ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/25" : "text-slate-300 hover:bg-slate-800/80 hover:text-white"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => handleSelectReport(item),
										className: "flex flex-1 items-center gap-1.5 min-w-0 text-left cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: item.name
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											title: fav ? "Remove from favourites" : "Add to favourites",
											onClick: (e) => {
												e.stopPropagation();
												toggleFavorite(item.id);
											},
											className: "p-1 text-slate-400 hover:text-amber-400 cursor-pointer rounded transition-all",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("h-3.5 w-3.5 transition-colors", fav ? "fill-amber-400 text-amber-400" : "opacity-0 group-hover:opacity-70 hover:opacity-100") })
										}), isSelected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 shrink-0 text-white ml-0.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 shrink-0 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" })]
									})]
								}, item.id);
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-slate-800/80 bg-slate-950/80 px-3 py-1.5 text-[10px] text-slate-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-blue-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "23 Categories · 105 Reports" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-slate-400 font-mono",
						children: "Click to open"
					})]
				})
			]
		})]
	});
}
var NAV_TOP = [{
	to: "/",
	label: "Dashboard",
	icon: LayoutDashboard,
	exact: true
}, {
	to: "/tracking",
	label: "Tracking",
	icon: MapPin,
	exact: false
}];
var NAV_BOTTOM = [{
	to: "/setting",
	label: "Setting",
	icon: Settings,
	exact: false
}];
var MORE_ITEMS = [
	{
		id: "setup",
		label: "Setup",
		icon: ShoppingCart,
		to: "/setting"
	},
	{
		id: "support",
		label: "Support",
		icon: LifeBuoy,
		action: "support"
	},
	{
		id: "cloud",
		label: "Cloud Download",
		icon: Cloud,
		action: "cloud"
	}
];
function SideItem({ label, icon: Icon, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick,
			className: "group flex w-full flex-col items-center gap-1 py-1 cursor-pointer select-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("flex h-9 w-9 items-center justify-center rounded-md transition-all duration-200", active ? "bg-[#0089FF] text-white shadow-md shadow-blue-500/25" : "text-slate-400 group-hover:bg-white/10 group-hover:text-white"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("text-[10px] leading-tight tracking-tight transition-colors", active ? "font-semibold text-white" : "font-medium text-slate-400 group-hover:text-white"),
				children: label
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
		side: "right",
		sideOffset: 8,
		className: "font-semibold text-xs",
		children: label
	})] });
}
function AppSidebar() {
	const { pinnedMoreItems, toggleMorePin } = useDashboard();
	const [moreOpen, setMoreOpen] = (0, import_react.useState)(false);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const navigate = useNavigate();
	const runItem = (item) => {
		setMoreOpen(false);
		if (item.to) {
			navigate({ to: item.to });
			return;
		}
		if (item.action === "support") toast.success("Support request opened", { description: "A specialist will reply in this window shortly." });
		if (item.action === "cloud") toast.success("Cloud download queued", { description: "Fleet snapshot will be ready in a moment." });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
		delayDuration: 150,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "flex w-[68px] shrink-0 flex-col items-center gap-1 bg-sidebar px-2 pt-2.5 pb-2 select-none z-30",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					"aria-label": "Home",
					className: "mb-1 flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white shadow-md shadow-black/20 hover:scale-105 transition-all duration-200",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-black italic tracking-tighter text-slate-900 lowercase font-serif",
						children: "uffizio"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FavoritesMenu, {}),
				NAV_TOP.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					activeOptions: { exact: item.exact },
					className: "w-full",
					"aria-label": item.label,
					children: ({ isActive }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideItem, {
						label: item.label,
						icon: item.icon,
						active: isActive
					})
				}, item.to)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportsMenu, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartsMenu, {}),
				NAV_BOTTOM.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					activeOptions: { exact: item.exact },
					className: "w-full",
					"aria-label": item.label,
					children: ({ isActive }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideItem, {
						label: item.label,
						icon: item.icon,
						active: isActive
					})
				}, item.to)),
				pinnedMoreItems.map((id) => {
					const item = MORE_ITEMS.find((m) => m.id === id);
					if (!item) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideItem, {
						label: item.label,
						icon: item.icon,
						onClick: () => runItem(item)
					}, id);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
						open: moreOpen,
						onOpenChange: setMoreOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-label": "More options",
								className: "group flex w-full flex-col items-center gap-1 py-1 cursor-pointer select-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200", moreOpen ? "bg-[#0089FF] text-white shadow-md shadow-blue-500/25" : "text-slate-400 group-hover:bg-white/10 group-hover:text-white"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid2x2, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("text-[10px] leading-tight tracking-tight transition-colors", moreOpen ? "font-semibold text-white" : "font-medium text-slate-400 group-hover:text-white"),
									children: "More"
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
							side: "right",
							align: "end",
							className: "w-64 p-3 bg-popover/95 backdrop-blur-xl border border-border shadow-2xl rounded-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2",
								children: MORE_ITEMS.map((item) => {
									const Icon = item.icon;
									const isSelected = selected === item.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setSelected(item.id),
										onDoubleClick: () => runItem(item),
										className: cn("flex flex-col items-center gap-2 rounded-md border p-2 text-center text-[11px] font-medium transition-all cursor-pointer", isSelected ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs" : "border-border/60 hover:bg-muted/60 text-muted-foreground hover:text-foreground"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-md border border-border bg-background p-2 shadow-2xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "leading-tight",
											children: item.label
										})]
									}, item.id);
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: !selected,
									onClick: () => {
										const item = MORE_ITEMS.find((m) => m.id === selected);
										if (item) runItem(item);
									},
									className: "flex-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-40 cursor-pointer shadow-xs",
									children: "Open"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: !selected,
									onClick: () => {
										if (!selected) return;
										const wasPinned = pinnedMoreItems.includes(selected);
										toggleMorePin(selected);
										toast.success(wasPinned ? "Removed from menu" : "Pinned to menu");
									},
									className: "flex flex-1 items-center justify-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium transition-all hover:bg-muted disabled:opacity-40 cursor-pointer shadow-2xs",
									children: selected && pinnedMoreItems.includes(selected) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinOff, { className: "h-3.5 w-3.5" }), " Unpin"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "h-3.5 w-3.5" }), " Pin"] })
								})]
							})]
						})]
					})
				})
			]
		})
	});
}
var Sheet = Dialog;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-[16px] font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
var ALERTS = [
	{
		id: "a1",
		vehicle: "HR55AC5305",
		driver: "Rajesh Shetty",
		type: "Location IOS",
		company: "Uffizio Pvt Ltd",
		branch: "Valsad",
		time: "09:27 AM",
		severity: "high"
	},
	{
		id: "a2",
		vehicle: "HR55AC5305",
		driver: "Rajesh Shetty",
		type: "Harsh Braking",
		company: "Uffizio Pvt Ltd",
		branch: "Valsad",
		time: "09:21 AM",
		severity: "high"
	},
	{
		id: "a3",
		vehicle: "GJ15BQ1180",
		driver: "Amit Patel",
		type: "Overspeed",
		company: "Uffizio Pvt Ltd",
		branch: "Surat",
		time: "08:52 AM",
		severity: "medium"
	},
	{
		id: "a4",
		vehicle: "MH12KL9921",
		driver: "Sunil Rao",
		type: "Idle too long",
		company: "Uffizio Pvt Ltd",
		branch: "Pune",
		time: "08:14 AM",
		severity: "low"
	}
];
var COUNTS = [
	{
		key: "high",
		label: "High",
		count: 26,
		className: "bg-danger/10 text-danger"
	},
	{
		key: "medium",
		label: "Medium",
		count: 7,
		className: "bg-warning/10 text-warning"
	},
	{
		key: "low",
		label: "Low",
		count: 21,
		className: "bg-success/10 text-success"
	}
];
var SEV_BAR = {
	high: "bg-danger",
	medium: "bg-warning",
	low: "bg-success"
};
function NotificationPanel({ open, onOpenChange }) {
	const [tab, setTab] = (0, import_react.useState)("notification");
	const [severity, setSeverity] = (0, import_react.useState)(null);
	const [cleared, setCleared] = (0, import_react.useState)(false);
	const rows = cleared ? [] : ALERTS.filter((a) => !severity || a.severity === severity);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			side: "right",
			className: "flex w-[380px] flex-col gap-0 p-0 sm:max-w-[380px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
				className: "space-y-0 border-b border-border p-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
					className: "sr-only",
					children: "Notifications"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1 px-3 pt-3",
					children: ["notification", "announcements"].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab(t),
						className: cn("rounded-t-md px-3 py-2 text-sm capitalize transition-colors duration-150", tab === t ? "border-b-2 border-primary font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"),
						children: t
					}, t))
				})]
			}), tab === "notification" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 border-b border-border",
					children: COUNTS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setSeverity((s) => s === c.key ? null : c.key),
						className: cn("py-3 text-center transition-opacity duration-150 hover:opacity-80", c.className, severity && severity !== c.key ? "opacity-40" : ""),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-lg font-semibold",
							children: c.count
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-[11px]",
							children: c.label
						})]
					}, c.key))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "01-04-2025"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setCleared(true);
							toast("Notifications cleared", { action: {
								label: "Undo",
								onClick: () => setCleared(false)
							} });
						},
						className: "rounded-md border border-input px-2 py-1 text-xs font-medium transition-colors hover:bg-muted",
						children: "Clear All"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-0 flex-1 space-y-2.5 overflow-y-auto p-3",
					children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-8 text-center text-xs text-muted-foreground",
						children: "No notifications to show."
					}) : rows.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "relative overflow-hidden rounded-md border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute top-0 right-0 h-2 w-8 rounded-bl", SEV_BAR[a.severity]) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between pr-9",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 text-sm font-medium text-primary",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Car, { className: "h-3.5 w-3.5" }),
										" ",
										a.vehicle
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: a.time
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 flex items-center gap-1.5 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5" }),
									" ",
									a.driver
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 flex items-center gap-1.5 text-xs text-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }),
									" ",
									a.type
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1.5 text-[11px] text-muted-foreground",
								children: [
									"Company",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: a.company
									}),
									" · Branch ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: a.branch
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2.5 grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => toast.success(`Tracking ${a.vehicle}`),
									className: "rounded-md border border-input py-1.5 text-xs font-medium transition-colors hover:bg-muted",
									children: "Track"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => toast.info(`${a.vehicle} · ${a.branch}`, { description: "Opening last known location." }),
									className: "flex items-center justify-center gap-1.5 rounded-md border border-input py-1.5 text-xs font-medium transition-colors hover:bg-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" }), " View Location"]
								})]
							})
						]
					}, a.id))
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 space-y-2.5 overflow-y-auto p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-md border border-border bg-surface p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-foreground",
						children: "Scheduled maintenance"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Reporting services will be briefly unavailable on Sunday 02:00–03:00 IST."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-md border border-border bg-surface p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-foreground",
						children: "New widget: Event Heatmap"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Add it to any dashboard tab from the tab configuration panel."
					})]
				})]
			})]
		})
	});
}
var LANGUAGES = [
	{
		code: "en",
		name: "English (US)",
		native: "English",
		flag: "🇺🇸"
	},
	{
		code: "es",
		name: "Spanish",
		native: "Español",
		flag: "🇪🇸"
	},
	{
		code: "fr",
		name: "French",
		native: "Français",
		flag: "🇫🇷"
	},
	{
		code: "de",
		name: "German",
		native: "Deutsch",
		flag: "🇩🇪"
	},
	{
		code: "ar",
		name: "Arabic",
		native: "العربية",
		flag: "🇸🇦"
	},
	{
		code: "hi",
		name: "Hindi",
		native: "हिंदी",
		flag: "🇮🇳"
	},
	{
		code: "pt",
		name: "Portuguese",
		native: "Português",
		flag: "🇵🇹"
	},
	{
		code: "ru",
		name: "Russian",
		native: "Русский",
		flag: "🇷🇺"
	}
];
var THEMES = [
	{
		id: "theme-navy-cobalt",
		name: "Navy Cobalt",
		nav: "#0f172a",
		sidebar: "#0f172a",
		sidebarAccent: "#1e293b",
		sidebarPrimary: "#2563eb",
		brand: "#2563eb",
		ring: "#2563eb",
		bgTint: "#f1f5f9"
	},
	{
		id: "theme-uffizio-blue",
		name: "Classic Blue",
		nav: "#111c38",
		sidebar: "#111c38",
		sidebarAccent: "#1a2a52",
		sidebarPrimary: "#155dfc",
		brand: "#155dfc",
		ring: "#155dfc",
		bgTint: "#f8faff"
	},
	{
		id: "theme-midnight-sky",
		name: "Midnight Sky",
		nav: "#172554",
		sidebar: "#172554",
		sidebarAccent: "#1e3a8a",
		sidebarPrimary: "#3b82f6",
		brand: "#3b82f6",
		ring: "#3b82f6",
		bgTint: "#eff6ff"
	},
	{
		id: "theme-indigo-slate",
		name: "Deep Indigo",
		nav: "#1e1b4b",
		sidebar: "#1e1b4b",
		sidebarAccent: "#312e81",
		sidebarPrimary: "#6366f1",
		brand: "#6366f1",
		ring: "#6366f1",
		bgTint: "#eef2ff"
	},
	{
		id: "theme-charcoal-dark",
		name: "Slate Carbon",
		nav: "#18181b",
		sidebar: "#18181b",
		sidebarAccent: "#27272a",
		sidebarPrimary: "#3b82f6",
		brand: "#2563eb",
		ring: "#2563eb",
		bgTint: "#f4f4f5"
	},
	{
		id: "theme-deep-teal",
		name: "Deep Teal",
		nav: "#042f2e",
		sidebar: "#042f2e",
		sidebarAccent: "#115e59",
		sidebarPrimary: "#0d9488",
		brand: "#0d9488",
		ring: "#0d9488",
		bgTint: "#f0fdfa"
	},
	{
		id: "theme-forest-green",
		name: "Forest Green",
		nav: "#052e16",
		sidebar: "#052e16",
		sidebarAccent: "#14532d",
		sidebarPrimary: "#16a34a",
		brand: "#16a34a",
		ring: "#16a34a",
		bgTint: "#f0fdf4"
	},
	{
		id: "theme-olive-moss",
		name: "Olive Lime",
		nav: "#1a2e05",
		sidebar: "#1a2e05",
		sidebarAccent: "#365314",
		sidebarPrimary: "#65a30d",
		brand: "#65a30d",
		ring: "#65a30d",
		bgTint: "#f7fee7"
	},
	{
		id: "theme-amber-gold",
		name: "Amber Gold",
		nav: "#1c1917",
		sidebar: "#1c1917",
		sidebarAccent: "#292524",
		sidebarPrimary: "#d97706",
		brand: "#d97706",
		ring: "#d97706",
		bgTint: "#fffbeb"
	},
	{
		id: "theme-warm-terracotta",
		name: "Warm Copper",
		nav: "#431407",
		sidebar: "#431407",
		sidebarAccent: "#7c2d12",
		sidebarPrimary: "#ea580c",
		brand: "#ea580c",
		ring: "#ea580c",
		bgTint: "#fff7ed"
	},
	{
		id: "theme-espresso-bronze",
		name: "Warm Bronze",
		nav: "#291509",
		sidebar: "#291509",
		sidebarAccent: "#451a03",
		sidebarPrimary: "#b45309",
		brand: "#b45309",
		ring: "#b45309",
		bgTint: "#fffbeb"
	},
	{
		id: "theme-crimson-rose",
		name: "Ruby Crimson",
		nav: "#4c0519",
		sidebar: "#4c0519",
		sidebarAccent: "#881337",
		sidebarPrimary: "#e11d48",
		brand: "#e11d48",
		ring: "#e11d48",
		bgTint: "#fff1f2"
	},
	{
		id: "theme-plum-berry",
		name: "Plum Berry",
		nav: "#500724",
		sidebar: "#500724",
		sidebarAccent: "#831843",
		sidebarPrimary: "#db2777",
		brand: "#db2777",
		ring: "#db2777",
		bgTint: "#fdf2f8"
	},
	{
		id: "theme-royal-violet",
		name: "Royal Violet",
		nav: "#4a044e",
		sidebar: "#4a044e",
		sidebarAccent: "#701a75",
		sidebarPrimary: "#c026d3",
		brand: "#c026d3",
		ring: "#c026d3",
		bgTint: "#fdf4ff"
	},
	{
		id: "theme-amethyst-purple",
		name: "Amethyst Purple",
		nav: "#3b0764",
		sidebar: "#3b0764",
		sidebarAccent: "#581c87",
		sidebarPrimary: "#9333ea",
		brand: "#9333ea",
		ring: "#9333ea",
		bgTint: "#faf5ff"
	}
];
function applyTheme(themeId) {
	const theme = THEMES.find((t) => t.id === themeId) || THEMES[1];
	if (!theme) return;
	const root = document.documentElement;
	root.style.setProperty("--nav", theme.nav);
	root.style.setProperty("--sidebar", theme.sidebar);
	root.style.setProperty("--sidebar-accent", theme.sidebarAccent);
	root.style.setProperty("--sidebar-primary", theme.sidebarPrimary);
	root.style.setProperty("--brand", theme.brand);
	root.style.setProperty("--ring", theme.ring);
	localStorage.setItem("trakzee-active-theme-id", theme.id);
}
var APPLICATIONS = [
	{
		id: "hp-trakzee-premium",
		name: "HP Trakzee Premium",
		isPrimary: true
	},
	{
		id: "trakzee-standard",
		name: "Trakzee Standard"
	},
	{
		id: "hp-trakzee-mini",
		name: "HP Trakzee Mini"
	},
	{
		id: "smart-bus",
		name: "Smart Bus"
	},
	{
		id: "smart-waste-management",
		name: "Smart Waste Management"
	},
	{
		id: "ais-140",
		name: "AIS 140"
	},
	{
		id: "elexee",
		name: "Elexee"
	},
	{
		id: "ems",
		name: "EMS"
	},
	{
		id: "gridzee",
		name: "Gridzee"
	},
	{
		id: "logytrak",
		name: "LogyTrak"
	},
	{
		id: "petzee",
		name: "Petzee"
	},
	{
		id: "roster-management",
		name: "Roster Management"
	},
	{
		id: "stealth-tracer",
		name: "Stealth Tracer"
	},
	{
		id: "taskeye",
		name: "TaskEye"
	},
	{
		id: "trakride",
		name: "TrakRide"
	},
	{
		id: "trakzee-gsm",
		name: "Trakzee GSM"
	},
	{
		id: "trakzee-lite",
		name: "Trakzee Lite"
	},
	{
		id: "public-transportation",
		name: "Public Transportation"
	}
];
var INITIAL_SUBUSERS = [
	{
		id: "sub-1",
		name: "Rajesh Sharma",
		email: "rajesh.ops@hpcompany.com",
		phone: "+91 98765 43210",
		role: "Dispatch Manager",
		status: "active",
		branch: "Valsad"
	},
	{
		id: "sub-2",
		name: "Suresh Patel",
		email: "suresh.safety@hpcompany.com",
		phone: "+91 98234 56789",
		role: "Safety Officer",
		status: "active",
		branch: "Surat"
	},
	{
		id: "sub-3",
		name: "Amit Desai",
		email: "amit.ops@hpcompany.com",
		phone: "+91 98111 22334",
		role: "Viewer",
		status: "active",
		branch: "Ahmedabad"
	}
];
/**
* Standard Modal Shell matching the Trakzee 2.0 Design System:
* - 45px header with card background and bottom border
* - Rounded 2xl container with shadow-2xl and backdrop blur overlay
* - Consistent p-5 padding for content body
* - Standardized footer toolbar with neutral Cancel button and #155dfc primary CTA
*/
function ModalShell({ title, onClose, children, maxWidth = "max-w-md" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[100] flex items-center justify-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Close " + title,
			onClick: onClose,
			className: "fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity cursor-pointer"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("relative z-10 w-full animate-in fade-in zoom-in-95 overflow-hidden rounded-2xl border border-border/80 bg-background text-foreground shadow-2xl duration-150 flex flex-col max-h-[90vh]", maxWidth),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-[56px] items-center justify-between border-b border-border/70 px-5 bg-card/60 select-none shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[16px] font-semibold tracking-tight text-foreground",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Close " + title,
					onClick: onClose,
					className: "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 min-h-0 overflow-y-auto p-5 text-xs text-foreground custom-scrollbar",
				children
			})]
		})]
	});
}
function UserProfileMenu() {
	const [activeModal, setActiveModal] = (0, import_react.useState)(null);
	const [selectedLanguage, setSelectedLanguage] = (0, import_react.useState)("en");
	const [langSearch, setLangSearch] = (0, import_react.useState)("");
	const [appSearch, setAppSearch] = (0, import_react.useState)("");
	const [activeThemeId, setActiveThemeId] = (0, import_react.useState)(() => {
		try {
			return localStorage.getItem("trakzee-active-theme-id") || "theme-uffizio-blue";
		} catch {
			return "theme-uffizio-blue";
		}
	});
	const [userEmail] = (0, import_react.useState)("hpcompany@yopmail.com");
	const [userName] = (0, import_react.useState)("VK");
	(0, import_react.useEffect)(() => {
		try {
			const saved = localStorage.getItem("trakzee-active-theme-id");
			if (saved) {
				applyTheme(saved);
				setActiveThemeId(saved);
			}
		} catch {}
	}, []);
	const [currentPassword, setCurrentPassword] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [showCurrentPass, setShowCurrentPass] = (0, import_react.useState)(false);
	const [showNewPass, setShowNewPass] = (0, import_react.useState)(false);
	const [showConfirmPass, setShowConfirmPass] = (0, import_react.useState)(false);
	const [subusers, setSubusers] = (0, import_react.useState)(INITIAL_SUBUSERS);
	const [subuserSearch, setSubuserSearch] = (0, import_react.useState)("");
	const [isAddingSubuser, setIsAddingSubuser] = (0, import_react.useState)(false);
	const [newSubuserName, setNewSubuserName] = (0, import_react.useState)("");
	const [newSubuserEmail, setNewSubuserEmail] = (0, import_react.useState)("");
	const [newSubuserPhone, setNewSubuserPhone] = (0, import_react.useState)("");
	const [newSubuserRole, setNewSubuserRole] = (0, import_react.useState)("Dispatch Manager");
	const [newSubuserBranch, setNewSubuserBranch] = (0, import_react.useState)("Valsad");
	const [walletBalance, setWalletBalance] = (0, import_react.useState)(4850);
	const [topupAmount, setTopupAmount] = (0, import_react.useState)(500);
	const handlePasswordSubmit = (e) => {
		e.preventDefault();
		if (!currentPassword || !newPassword) {
			toast.error("Please fill all required password fields");
			return;
		}
		if (newPassword.length < 8) {
			toast.error("New password must be at least 8 characters long");
			return;
		}
		if (newPassword !== confirmPassword) {
			toast.error("New passwords do not match");
			return;
		}
		toast.success("Password changed successfully");
		setActiveModal(null);
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
	};
	const handleLogout = () => {
		toast.info("Logged out successfully", { description: `Signed out of ${userEmail}` });
	};
	const handleSelectTheme = (themeId) => {
		setActiveThemeId(themeId);
		applyTheme(themeId);
		const theme = THEMES.find((t) => t.id === themeId);
		toast.success(`Applied "${theme?.name || "Theme"}" theme`);
	};
	const handleAddSubuser = (e) => {
		e.preventDefault();
		if (!newSubuserName.trim() || !newSubuserEmail.trim()) {
			toast.error("Please enter subuser name and email");
			return;
		}
		const created = {
			id: `sub-${Date.now()}`,
			name: newSubuserName.trim(),
			email: newSubuserEmail.trim(),
			phone: newSubuserPhone.trim() || "+91 90000 00000",
			role: newSubuserRole,
			status: "active",
			branch: newSubuserBranch
		};
		setSubusers([created, ...subusers]);
		setIsAddingSubuser(false);
		setNewSubuserName("");
		setNewSubuserEmail("");
		setNewSubuserPhone("");
		toast.success(`Subuser "${created.name}" created successfully`);
	};
	const handleDeleteSubuser = (id, name) => {
		setSubusers(subusers.filter((s) => s.id !== id));
		toast.info(`Subuser "${name}" removed`);
	};
	const handleTopup = () => {
		const num = Number(topupAmount);
		if (!num || num <= 0) {
			toast.error("Please enter a valid top-up amount");
			return;
		}
		setWalletBalance((prev) => prev + num);
		toast.success(`Wallet successfully recharged by $${num.toFixed(2)}`, { description: `New Available Balance: $${(walletBalance + num).toFixed(2)}` });
		setActiveModal(null);
	};
	const filteredLanguages = (0, import_react.useMemo)(() => {
		const q = langSearch.trim().toLowerCase();
		if (!q) return LANGUAGES;
		return LANGUAGES.filter((l) => l.name.toLowerCase().includes(q) || l.native.toLowerCase().includes(q) || l.code.toLowerCase().includes(q));
	}, [langSearch]);
	const filteredApps = (0, import_react.useMemo)(() => {
		const q = appSearch.trim().toLowerCase();
		if (!q) return APPLICATIONS;
		return APPLICATIONS.filter((a) => a.name.toLowerCase().includes(q));
	}, [appSearch]);
	const filteredSubusers = (0, import_react.useMemo)(() => {
		const q = subuserSearch.trim().toLowerCase();
		if (!q) return subusers;
		return subusers.filter((s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.role.toLowerCase().includes(q) || s.branch.toLowerCase().includes(q));
	}, [subusers, subuserSearch]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"aria-label": "User account menu",
				className: "flex items-center gap-1.5 rounded-full p-0.5 transition-transform duration-150 hover:opacity-90 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 cursor-pointer select-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex h-[30px] w-[30px] items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-foreground shadow-xs",
					children: userName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5 text-white/80 shrink-0" })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
			align: "end",
			sideOffset: 8,
			className: "w-64 rounded-xl border border-border/80 bg-popover/98 backdrop-blur-xl p-1.5 text-xs text-foreground shadow-2xl animate-in fade-in-0 zoom-in-95 z-[90]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-3 py-2.5 mb-1 rounded-lg bg-muted/40 border border-border/40 select-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white shadow-2xs",
							children: userName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1 truncate",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-bold text-foreground truncate",
								children: "HP Company Admin"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground truncate",
								children: userEmail
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuGroup, {
					className: "space-y-0.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => setActiveModal("password"),
							className: "flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground cursor-pointer hover:bg-muted/80 rounded-md transition-colors select-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Change Password" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => {
								setLangSearch("");
								setActiveModal("language");
							},
							className: "flex items-center justify-between px-3 py-2 text-xs font-medium text-foreground cursor-pointer hover:bg-muted/80 rounded-md transition-colors select-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-4 w-4 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Change Language" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase",
								children: selectedLanguage
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => setActiveModal("customisation"),
							className: "flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground cursor-pointer hover:bg-muted/80 rounded-md transition-colors select-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "h-4 w-4 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Customisation" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => {
								setIsAddingSubuser(false);
								setSubuserSearch("");
								setActiveModal("subuser");
							},
							className: "flex items-center justify-between px-3 py-2 text-xs font-medium text-foreground cursor-pointer hover:bg-muted/80 rounded-md transition-colors select-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Set Subuser" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full",
								children: subusers.length
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSub, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubTrigger, {
							className: "flex items-center justify-between px-3 py-2 text-xs font-medium text-foreground cursor-pointer hover:bg-muted/80 rounded-md transition-colors select-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-4 w-4 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Applications" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSubContent, {
							sideOffset: 6,
							alignOffset: -4,
							className: "w-64 max-h-[380px] p-1.5 text-xs rounded-xl border border-border/80 bg-popover/98 backdrop-blur-xl shadow-2xl z-[100] flex flex-col",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-1 pb-1.5 border-b border-border/60 mb-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex h-7 items-center gap-1.5 rounded-md border border-input/80 bg-background px-2 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3 w-3 text-muted-foreground shrink-0" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: appSearch,
											onChange: (e) => setAppSearch(e.target.value),
											placeholder: "Search applications...",
											className: "h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
										}),
										appSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setAppSearch(""),
											className: "rounded p-0.5 text-muted-foreground hover:text-foreground",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-2.5 w-2.5" })
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 overflow-y-auto space-y-0.5 pr-0.5 custom-scrollbar",
								children: [filteredApps.map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => toast.info(`Switching to ${app.name}`),
									className: cn("px-2.5 py-1.5 cursor-pointer text-xs transition-colors hover:bg-muted/80 rounded-md flex items-center justify-between select-none", app.isPrimary && "font-bold text-[#0089FF] bg-[#0089FF]/10 hover:bg-[#0089FF]/15"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: app.name
									}), app.isPrimary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-[#0089FF] shrink-0 ml-1.5" })]
								}, app.id)), filteredApps.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-3 text-center text-xs text-muted-foreground italic",
									children: "No applications found"
								})]
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => setActiveModal("payment"),
							className: "flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground cursor-pointer hover:bg-muted/80 rounded-md transition-colors select-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Payment" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => setActiveModal("wallet"),
							className: "flex items-center justify-between px-3 py-2 text-xs font-medium text-foreground cursor-pointer hover:bg-muted/80 rounded-md transition-colors select-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Wallet" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded",
								children: ["$", walletBalance.toFixed(0)]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-border/60 my-1 pt-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
						onClick: handleLogout,
						className: "flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-md transition-colors select-none font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Logout" })]
					})
				})
			]
		})] }),
		activeModal === "password" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModalShell, {
			title: "Change Password",
			maxWidth: "max-w-md",
			onClose: () => setActiveModal(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handlePasswordSubmit,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs font-bold text-foreground",
							children: ["Current Password ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-red-500",
								children: "*"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: showCurrentPass ? "text" : "password",
								required: true,
								value: currentPassword,
								onChange: (e) => setCurrentPassword(e.target.value),
								placeholder: "Enter current password",
								className: "h-9 w-full rounded-md border border-input/80 bg-background px-3 pr-9 text-xs font-semibold text-foreground shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] focus:outline-none transition-all placeholder:text-muted-foreground/60"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowCurrentPass(!showCurrentPass),
								className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded",
								children: showCurrentPass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs font-bold text-foreground",
							children: ["New Password ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-red-500",
								children: "*"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: showNewPass ? "text" : "password",
								required: true,
								value: newPassword,
								onChange: (e) => setNewPassword(e.target.value),
								placeholder: "Enter new password (min. 8 characters)",
								className: "h-9 w-full rounded-md border border-input/80 bg-background px-3 pr-9 text-xs font-semibold text-foreground shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] focus:outline-none transition-all placeholder:text-muted-foreground/60"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowNewPass(!showNewPass),
								className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded",
								children: showNewPass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs font-bold text-foreground",
							children: ["Confirm New Password ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-red-500",
								children: "*"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: showConfirmPass ? "text" : "password",
								required: true,
								value: confirmPassword,
								onChange: (e) => setConfirmPassword(e.target.value),
								placeholder: "Re-enter new password",
								className: "h-9 w-full rounded-md border border-input/80 bg-background px-3 pr-9 text-xs font-semibold text-foreground shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] focus:outline-none transition-all placeholder:text-muted-foreground/60"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowConfirmPass(!showConfirmPass),
								className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded",
								children: showConfirmPass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-lg border border-border/80 bg-muted/20 space-y-1 select-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-bold text-foreground block",
							children: "Password Guidelines"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "text-[10.5px] text-muted-foreground space-y-0.5 list-disc list-inside",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Minimum 8 characters with at least 1 number" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Include a mix of uppercase and lowercase letters" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Special characters (!@#$%^&*) are recommended" })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-2.5 pt-3 border-t border-border/70 mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveModal(null),
							className: "px-4 py-2 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "h-9 rounded-md bg-[#155dfc] px-6 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#124ecf] cursor-pointer active:scale-98",
							children: "Save Changes"
						})]
					})
				]
			})
		}),
		activeModal === "language" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModalShell, {
			title: "Change Language",
			maxWidth: "max-w-lg",
			onClose: () => setActiveModal(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground text-xs leading-relaxed",
						children: "Select your preferred interface language for the Trakzee 2.0 platform."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-8 items-center gap-1.5 rounded-md border border-input/80 bg-background px-2.5 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: langSearch,
								onChange: (e) => setLangSearch(e.target.value),
								placeholder: "Search languages...",
								className: "h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
							}),
							langSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setLangSearch(""),
								className: "rounded p-0.5 text-muted-foreground hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar",
						children: [filteredLanguages.map((lang) => {
							const isSelected = selectedLanguage === lang.code;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setSelectedLanguage(lang.code),
								className: cn("flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all select-none", isSelected ? "border-[#0089FF] bg-[#0089FF]/10 text-foreground ring-1 ring-[#0089FF] shadow-2xs" : "border-border/80 bg-card hover:bg-muted/60 text-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-base",
										children: lang.flag
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-bold text-xs truncate",
											children: lang.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground truncate",
											children: lang.native
										})]
									})]
								}), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-4 w-4 items-center justify-center rounded-full bg-[#0089FF] text-white shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-2.5 w-2.5 stroke-[3]" })
								})]
							}, lang.code);
						}), filteredLanguages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2 p-6 text-center text-xs text-muted-foreground italic",
							children: [
								"No languages found matching “",
								langSearch,
								"”"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-2.5 pt-3 border-t border-border/70 mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveModal(null),
							className: "px-4 py-2 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								const current = LANGUAGES.find((l) => l.code === selectedLanguage);
								toast.success(`Language updated to ${current?.name || "English"}`);
								setActiveModal(null);
							},
							className: "h-9 rounded-md bg-[#155dfc] px-6 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#124ecf] cursor-pointer active:scale-98",
							children: "Apply Language"
						})]
					})
				]
			})
		}),
		activeModal === "customisation" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModalShell, {
			title: "Customisation",
			maxWidth: "max-w-2xl",
			onClose: () => setActiveModal(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between mb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-xs text-foreground",
						children: "Select Color Theme"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground",
						children: "Choose a color palette to personalize your application chrome, navigation, and brand accents in real time."
					})] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto p-1 custom-scrollbar",
					children: THEMES.map((theme) => {
						const isSelected = activeThemeId === theme.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => handleSelectTheme(theme.id),
							className: cn("group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all duration-150 cursor-pointer bg-card shadow-2xs hover:shadow-md", isSelected ? "border-[#0089FF] ring-2 ring-[#0089FF]/30 shadow-sm" : "border-border/80 hover:border-border"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "h-20 w-full p-1.5 flex flex-col gap-1 border-b border-border/50 relative overflow-hidden",
								style: { backgroundColor: theme.bgTint },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "h-3.5 w-full rounded flex items-center justify-between px-1.5 shadow-2xs",
										style: { backgroundColor: theme.nav },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-6 rounded-full bg-white/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-1.5 w-1.5 rounded-full",
											style: { backgroundColor: theme.brand }
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 flex gap-1 min-h-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "w-4 h-full rounded flex flex-col items-center gap-0.5 py-0.5",
											style: { backgroundColor: theme.sidebar },
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-1 w-2.5 rounded-full",
													style: { backgroundColor: theme.sidebarPrimary }
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-2 rounded-full bg-white/30" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-2 rounded-full bg-white/30" })
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 bg-white dark:bg-slate-800 rounded p-1 flex flex-col justify-between shadow-2xs border border-black/5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-8 rounded-full bg-slate-300 dark:bg-slate-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-2 px-1 rounded text-[7px] font-bold text-white flex items-center",
													style: { backgroundColor: theme.brand },
													children: "CTA"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-0.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700" })]
											})]
										})]
									}),
									isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0089FF] text-white shadow-xs z-10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-2.5 w-2.5 stroke-[3]" })
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 flex items-center justify-between bg-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("font-bold text-xs", isSelected ? "text-[#0089FF]" : "text-foreground"),
									children: theme.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "h-2.5 w-2.5 rounded-full border border-black/10 shadow-2xs",
										style: { backgroundColor: theme.nav },
										title: "Top Navbar"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "h-2.5 w-2.5 rounded-full border border-black/10 shadow-2xs",
										style: { backgroundColor: theme.brand },
										title: "Brand Primary"
									})]
								})]
							})]
						}, theme.id);
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-end gap-2.5 pt-3 border-t border-border/70 mt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setActiveModal(null),
						className: "px-4 py-2 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs",
						children: "Close"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							const theme = THEMES.find((t) => t.id === activeThemeId);
							toast.success(`Saved "${theme?.name || "Theme"}" as active theme`);
							setActiveModal(null);
						},
						className: "h-9 rounded-md bg-[#155dfc] px-6 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#124ecf] cursor-pointer active:scale-98",
						children: "Save Theme"
					})]
				})]
			})
		}),
		activeModal === "subuser" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModalShell, {
			title: "Set Subuser",
			maxWidth: "max-w-2xl",
			onClose: () => setActiveModal(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-8 flex-1 max-w-sm items-center gap-1.5 rounded-md border border-input/80 bg-background px-2.5 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: subuserSearch,
									onChange: (e) => setSubuserSearch(e.target.value),
									placeholder: "Search subusers by name, email, branch...",
									className: "h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
								}),
								subuserSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setSubuserSearch(""),
									className: "rounded p-0.5 text-muted-foreground hover:text-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setIsAddingSubuser(!isAddingSubuser),
							className: "inline-flex h-8 items-center gap-1.5 rounded-md bg-[#155dfc] px-3.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#124ecf] cursor-pointer active:scale-98 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAddingSubuser ? "Cancel Form" : "Add Subuser" })]
						})]
					}),
					isAddingSubuser && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleAddSubuser,
						className: "p-4 rounded-xl border border-[#0089FF]/40 bg-[#0089FF]/5 space-y-3 animate-in fade-in-0 duration-200",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-between",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold text-foreground flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3.5 w-3.5 text-[#0089FF]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Create New Subuser" })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] font-bold text-foreground",
											children: "Full Name *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											required: true,
											value: newSubuserName,
											onChange: (e) => setNewSubuserName(e.target.value),
											placeholder: "e.g. Ramesh Verma",
											className: "h-8 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-semibold text-foreground focus-within:border-[#0089FF] focus:outline-none"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] font-bold text-foreground",
											children: "Email Address *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "email",
											required: true,
											value: newSubuserEmail,
											onChange: (e) => setNewSubuserEmail(e.target.value),
											placeholder: "e.g. ramesh@hpcompany.com",
											className: "h-8 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-semibold text-foreground focus-within:border-[#0089FF] focus:outline-none"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] font-bold text-foreground",
											children: "Role / Permission Level"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: newSubuserRole,
											onChange: (e) => setNewSubuserRole(e.target.value),
											className: "h-8 w-full rounded-md border border-input/80 bg-background px-2 text-xs font-semibold text-foreground focus-within:border-[#0089FF] focus:outline-none cursor-pointer",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Admin",
													children: "Admin (Full Access)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Dispatch Manager",
													children: "Dispatch Manager"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Safety Officer",
													children: "Safety Officer"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Viewer",
													children: "Viewer (Read-only)"
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] font-bold text-foreground",
											children: "Assigned Branch"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: newSubuserBranch,
											onChange: (e) => setNewSubuserBranch(e.target.value),
											className: "h-8 w-full rounded-md border border-input/80 bg-background px-2 text-xs font-semibold text-foreground focus-within:border-[#0089FF] focus:outline-none cursor-pointer",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Valsad",
													children: "Valsad"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Surat",
													children: "Surat"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Ahmedabad",
													children: "Ahmedabad"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Mumbai",
													children: "Mumbai"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "All Branches",
													children: "All Branches"
												})
											]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setIsAddingSubuser(false),
									className: "px-3 py-1 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium cursor-pointer",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "px-4 py-1 text-xs rounded-md bg-[#155dfc] hover:bg-[#124ecf] text-white font-semibold shadow-xs cursor-pointer",
									children: "Save Subuser"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs divide-y divide-border/60 max-h-[340px] overflow-y-auto custom-scrollbar",
						children: [filteredSubusers.map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between p-3 hover:bg-muted/40 transition-colors select-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted border border-border/60 font-bold text-xs text-foreground",
									children: sub.name.split(" ").map((n) => n[0]).join("")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-xs text-foreground truncate",
											children: sub.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.2 text-[9.5px]",
											children: sub.status
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted-foreground truncate flex items-center gap-1.5 mt-0.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: sub.email }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: sub.branch })
										]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-md border border-border/80 bg-background px-2.5 py-1 text-[11px] font-semibold text-foreground",
									children: sub.role
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => handleDeleteSubuser(sub.id, sub.name),
									"aria-label": `Delete ${sub.name}`,
									className: "p-1.5 rounded-md text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
								})]
							})]
						}, sub.id)), filteredSubusers.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-8 text-center text-xs text-muted-foreground italic",
							children: [
								"No subusers found matching “",
								subuserSearch,
								"”"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-end gap-2.5 pt-3 border-t border-border/70 mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveModal(null),
							className: "h-9 rounded-md bg-[#155dfc] px-6 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#124ecf] cursor-pointer active:scale-98",
							children: "Done"
						})
					})
				]
			})
		}),
		activeModal === "payment" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModalShell, {
			title: "Payment & Billing",
			maxWidth: "max-w-lg",
			onClose: () => setActiveModal(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2 select-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground",
									children: "Current Subscription"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-[#0089FF]/10 text-[#0089FF] font-bold text-[10px] px-2.5 py-0.5",
									children: "Active"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-base font-bold text-foreground",
									children: "Enterprise Fleet Pro"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-bold text-foreground",
									children: "$1,240.00 / month"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Next renewal on 15 Oct 2026 · Includes 65 Active Vehicles & Video Telematics"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-foreground block",
							children: "Recent Invoices"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border/80 bg-card overflow-hidden divide-y divide-border/60 select-none shadow-2xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between p-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-foreground",
									children: "INV-2026-0815"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-muted-foreground",
									children: "15 Aug 2026 · Credit Card (•••• 4242)"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-emerald-600 dark:text-emerald-400",
										children: "$1,240.00 Paid"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => toast.success("Downloading invoice INV-2026-0815.pdf"),
										className: "p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors",
										title: "Download PDF",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" })
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between p-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-foreground",
									children: "INV-2026-0715"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-muted-foreground",
									children: "15 Jul 2026 · Credit Card (•••• 4242)"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-emerald-600 dark:text-emerald-400",
										children: "$1,240.00 Paid"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => toast.success("Downloading invoice INV-2026-0715.pdf"),
										className: "p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors",
										title: "Download PDF",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" })
									})]
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-2.5 pt-3 border-t border-border/70 mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveModal(null),
							className: "px-4 py-2 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs",
							children: "Close"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								toast.success("Opening billing management portal");
								setActiveModal(null);
							},
							className: "h-9 rounded-md bg-[#155dfc] px-6 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#124ecf] cursor-pointer active:scale-98",
							children: "Manage Billing"
						})]
					})
				]
			})
		}),
		activeModal === "wallet" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModalShell, {
			title: "Wallet Balance",
			maxWidth: "max-w-md",
			onClose: () => setActiveModal(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-xl border border-border/80 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-card dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-card text-center space-y-1 select-none shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-bold text-muted-foreground uppercase tracking-wider",
								children: "Available Wallet Balance"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-3xl font-extrabold text-[#0089FF] tracking-tight",
								children: ["$", walletBalance.toFixed(2)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10.5px] text-muted-foreground",
								children: "Auto-debited for SMS alerts, FASTag tolls & Telematics APIs"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-foreground",
							children: "Quick Top-up"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-4 gap-2",
							children: [
								100,
								250,
								500,
								1e3
							].map((amt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setTopupAmount(amt),
								className: cn("py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer select-none", Number(topupAmount) === amt ? "border-[#0089FF] bg-[#0089FF]/10 text-[#0089FF] ring-1 ring-[#0089FF]" : "border-border/80 bg-background hover:bg-muted text-foreground"),
								children: ["+$", amt]
							}, amt))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-foreground",
							children: "Custom Top-up Amount ($)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 10,
								value: topupAmount,
								onChange: (e) => setTopupAmount(e.target.value),
								placeholder: "Enter amount...",
								className: "h-9 flex-1 rounded-md border border-input/80 bg-background px-3 text-xs font-semibold text-foreground shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] focus:outline-none transition-all"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-2.5 pt-3 border-t border-border/70 mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveModal(null),
							className: "px-4 py-2 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleTopup,
							className: "h-9 rounded-md bg-[#155dfc] px-6 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#124ecf] cursor-pointer active:scale-98",
							children: "Recharge Wallet"
						})]
					})
				]
			})
		})
	] });
}
/**
* Official Zio AI Assistant Logo — 4-pointed sparkle star with gradient stroke.
*/
function ZioLogo({ className, size = "md" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		className: cn({
			xs: "h-3.5 w-3.5",
			sm: "h-4 w-4",
			md: "h-4.5 w-4.5",
			lg: "h-6 w-6",
			xl: "h-8 w-8"
		}[size], "shrink-0", className),
		"aria-label": "Zio AI Assistant",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
			id: "zioStarGrad",
			x1: "0%",
			y1: "0%",
			x2: "100%",
			y2: "100%",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0%",
					stopColor: "#a855f7"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "50%",
					stopColor: "#ec4899"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "100%",
					stopColor: "#3b82f6"
				})
			]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M12 2C12 7.523 7.523 12 2 12C7.523 12 12 16.477 12 22C12 16.477 16.477 12 22 12C16.477 12 12 7.523 12 2Z",
			stroke: "url(#zioStarGrad)",
			strokeWidth: "2.4",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			fill: "none"
		})]
	});
}
/**
* Modern Top Navigation Bar Ask Zio CTA Button
* - Modern shimmering AI gradient pill
* - Smooth hover scale and micro-interactions
* - Clockwise logo spin on hover
*/
function AskZioTopBarButton({ className }) {
	const { openZio, isOpen } = useZio();
	const [isHovered, setIsHovered] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => openZio(),
		onMouseEnter: () => setIsHovered(true),
		onMouseLeave: () => setIsHovered(false),
		className: cn("group relative hidden h-[30px] items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-nav-foreground transition-colors duration-150 sm:flex cursor-pointer select-none", "bg-white/10 border border-white/15 hover:bg-white/15 hover:border-white/30 shadow-2xs", isOpen && "ring-1.5 ring-white/40 border-white/40 bg-white/20", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("shrink-0 transform-gpu transition-transform", isHovered && "spin-clockwise"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZioLogo, { size: "sm" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-semibold text-nav-foreground tracking-tight text-xs whitespace-nowrap",
			children: "Ask Zio"
		})]
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var styles_default = "/assets/styles-DoouJUSx.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$8 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Trakzee 2.0" },
			{
				name: "description",
				content: "Fleet & Telematics Intelligence Dashboard"
			},
			{
				name: "author",
				content: "Trakzee"
			},
			{
				property: "og:title",
				content: "Trakzee 2.0"
			},
			{
				property: "og:description",
				content: "Fleet & Telematics Intelligence Dashboard"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			href: "/favicon.ico",
			type: "image/x-icon"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$8.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
			delayDuration: 200,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ZioProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppLayout, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "bottom-right" })] }) })
		})
	});
}
function AppLayout() {
	(0, import_react.useEffect)(() => {
		try {
			const saved = localStorage.getItem("trakzee-active-theme-id");
			if (saved) applyTheme(saved);
		} catch {}
	}, []);
	const { isOpen, mode, openZio } = useZio();
	const isZioStandaloneRoute = useRouterState({ select: (s) => s.location }).pathname.startsWith("/zio");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen w-screen overflow-hidden bg-nav text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSidebar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-screen min-w-0 flex-1 flex-col overflow-hidden bg-nav",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-h-0 min-w-0 flex-1 overflow-hidden relative bg-nav",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
							className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background rounded-tl-2xl shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
						}),
						isOpen && mode === "sidebar" && !isZioStandaloneRoute && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
							className: "w-[390px] xl:w-[420px] py-3 pr-3 pl-0 flex flex-col shrink-0 min-h-0 transition-all duration-300 ease-out animate-in slide-in-from-right z-30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZioPanel, {
								mode: "sidebar",
								className: "h-full w-full flex-1"
							})
						}),
						isOpen && mode === "fullscreen" && !isZioStandaloneRoute && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "fixed top-[44px] bottom-0 left-0 sm:left-14 right-0 z-50 p-3 bg-background/60 backdrop-blur-xs animate-in fade-in zoom-in-[0.98] duration-300 ease-out flex flex-col",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZioPanel, {
								mode: "fullscreen",
								className: "h-full w-full flex-1"
							})
						})
					]
				})]
			}),
			isOpen && mode === "floating" && !isZioStandaloneRoute && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed bottom-6 right-6 z-50 animate-in fade-in zoom-in-95 duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZioPanel, { mode: "floating" })
			})
		]
	});
}
function TopBar() {
	const [notifOpen, setNotifOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex h-[45px] shrink-0 items-center gap-3 bg-nav px-3.5 text-nav-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative hidden max-w-xs flex-1 sm:block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-nav-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					"aria-label": "Search",
					placeholder: "Search",
					className: "h-[30px] w-full rounded-md border border-white/15 bg-white/10 pl-8 pr-2.5 text-xs text-nav-foreground placeholder:text-nav-muted focus:outline-none focus-visible:ring-1.5 focus-visible:ring-white/40"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ml-auto flex items-center gap-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"aria-label": "Notifications",
						onClick: () => setNotifOpen(true),
						className: "relative rounded-md p-1.5 text-nav-foreground/90 transition-colors duration-150 hover:bg-white/10 hover:text-white cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -top-0.5 -right-0.5 rounded-full bg-danger px-1 text-[8.5px] font-semibold text-white leading-tight",
							children: "16"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4.5 w-px bg-white/20" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AskZioTopBarButton, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4.5 w-px bg-white/20" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserProfileMenu, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationPanel, {
				open: notifOpen,
				onOpenChange: setNotifOpen
			})
		]
	});
}
var $$splitComponentImporter$6 = () => import("./routes-CUgovGR3.mjs");
var Route$7 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Fleet Safety Dashboard — Fleet Command" },
		{
			name: "description",
			content: "Fleet average score, driver score distribution, risky drivers, event highlights and live camera status in one dashboard."
		},
		{
			property: "og:title",
			content: "Fleet Safety Dashboard — Fleet Command"
		},
		{
			property: "og:description",
			content: "Driver scores, event distribution and camera health across your whole fleet."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./charts-4yAL48po.mjs");
var Route$6 = createFileRoute("/charts")({
	validateSearch: (search) => {
		const c = search["chart"];
		return { chart: typeof c === "string" ? c : void 0 };
	},
	head: () => ({ meta: [
		{ title: "Fleet Charts & Analytics — Trakzee" },
		{
			name: "description",
			content: "Compare fleet activity, fuel, alerts, temperature, and sensor analytics across vehicles."
		},
		{
			property: "og:title",
			content: "Fleet Charts & Analytics — Trakzee"
		},
		{
			property: "og:description",
			content: "Fleet activity, fuel, alerts, temperature, and sensor analytics."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./components-Zqm2uIJf.mjs");
var Route$5 = createFileRoute("/components")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
objectType({
	fullName: stringType().min(2, "Full name must be at least 2 characters"),
	email: stringType().email("Please provide a valid email address"),
	role: stringType().min(1, "Please select a developer role"),
	marketingUpdates: booleanType().default(false)
});
var $$splitComponentImporter$3 = () => import("./report-YJVAQWmW.mjs");
var Route$4 = createFileRoute("/report")({
	validateSearch: (search) => {
		const t = search["type"];
		return { type: typeof t === "string" ? t : void 0 };
	},
	head: () => ({ meta: [
		{ title: "Fleet Reports — Trakzee" },
		{
			name: "description",
			content: "Fleet activity, temperature, driver jobs, and vehicle reports."
		},
		{
			property: "og:title",
			content: "Fleet Reports — Trakzee"
		},
		{
			property: "og:description",
			content: "Fleet activity, temperature, driver jobs, and vehicle reports."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./setting-Hks4gBhc.mjs");
var Route$3 = createFileRoute("/setting")({
	head: () => ({ meta: [
		{ title: "Object Setup — Fleet Command" },
		{
			name: "description",
			content: "Configure an object: branch, GPS tracker, device type, IMEI, SIM numbers, timezone and distance counters."
		},
		{
			property: "og:title",
			content: "Object Setup — Fleet Command"
		},
		{
			property: "og:description",
			content: "Configure branch, tracker, device type, IMEI, SIM and distance settings."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./tracking-A2u_01wO.mjs");
var Route$2 = createFileRoute("/tracking")({
	head: () => ({ meta: [
		{ title: "Live Tracking — Fleet Command" },
		{
			name: "description",
			content: "Track every vehicle live: running, idle and stopped objects with fuel, battery and trip detail."
		},
		{
			property: "og:title",
			content: "Live Tracking — Fleet Command"
		},
		{
			property: "og:description",
			content: "Track every vehicle live with fuel, battery and trip detail."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./zio-7sAIluDZ.mjs");
var Route$1 = createFileRoute("/zio")({
	head: () => ({ meta: [{ title: "Zio AI Assistant — Fleet Safety & Telematics" }, {
		name: "description",
		content: "Ask Zio AI questions about fleet safety scores, efficiency ratings, risk indicators, and driving telemetry."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$7.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$8
	}),
	ChartsRoute: Route$6.update({
		id: "/charts",
		path: "/charts",
		getParentRoute: () => Route$8
	}),
	ComponentsRoute: Route$5.update({
		id: "/components",
		path: "/components",
		getParentRoute: () => Route$8
	}),
	ReportRoute: Route$4.update({
		id: "/report",
		path: "/report",
		getParentRoute: () => Route$8
	}),
	SettingRoute: Route$3.update({
		id: "/setting",
		path: "/setting",
		getParentRoute: () => Route$8
	}),
	TrackingRoute: Route$2.update({
		id: "/tracking",
		path: "/tracking",
		getParentRoute: () => Route$8
	}),
	ZioRoute: Route$1.update({
		id: "/zio",
		path: "/zio",
		getParentRoute: () => Route$8
	})
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
