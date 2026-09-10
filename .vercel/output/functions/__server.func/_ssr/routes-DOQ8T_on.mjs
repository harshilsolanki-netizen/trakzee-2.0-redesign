import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { C as getGroupsForBranches, S as getBranchesForCompanies, h as VEHICLE_TYPES, o as COMPANIES, w as getVehiclesForBranches } from "./reports-D0j_491Z.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { At as EllipsisVertical, Ct as FolderPlus, Et as FileDown, F as Search, G as PinOff, Gt as Cigarette, H as Plus, I as ScanFace, K as PhoneCall, M as Settings, O as SlidersHorizontal, Ot as Eye, T as SquarePen, W as Pin, Yt as ChevronDown, _ as TrendingUp, c as VideoOff, g as TriangleAlert, h as Truck, ht as Info, kt as EyeOff, ln as Bed, n as X, qt as ChevronRight, s as Video, tt as Maximize2, v as TrendingDown, vt as GripHorizontal, y as Trash2, z as RotateCcw } from "../_libs/lucide-react.mjs";
import { a as Overlay2, c as Title2, i as Description2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as DropdownMenuItem, n as DropdownMenuContent, o as DropdownMenuSeparator, t as DropdownMenu, u as DropdownMenuTrigger } from "./dropdown-menu-BFqXdjhf.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as Tooltip, d as Bar, f as RadialBar, g as ResponsiveContainer, h as Cell, i as BarChart, m as PolarAngleAxis, n as RadialBarChart, o as YAxis, p as Pie, r as PieChart, s as XAxis } from "../_libs/recharts+[...].mjs";
import { i as TooltipTrigger, n as TooltipContent, t as Tooltip$1 } from "./tooltip-yj1PAv0W.mjs";
import { l as buttonVariants, n as Dialog, o as DialogHeader, r as DialogContent, s as DialogTitle } from "./dialog-Bdeot34j.mjs";
import { a as WIDGET_CATALOG, i as PopoverTrigger, n as Popover, o as useDashboard, r as PopoverContent, s as widgetMeta } from "./store-Butx-LES.mjs";
import { a as eventTypes, c as highlightEvents, i as cameraStatus, l as riskyDrivers, o as fleetObjects, r as bucketColor, s as fleetScore, t as RANGE_LABEL, u as scoreDistribution } from "./fleet-DZTK5mNe.mjs";
import { a as Viewport, i as ScrollAreaThumb, n as Root, r as ScrollAreaScrollbar, t as Corner } from "../_libs/radix-ui__react-scroll-area.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DOQ8T_on.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RANGES = [
	"today",
	"7d",
	"30d"
];
function WidgetCard({ id, info, className, children, range, onRangeChange, extraControls }) {
	const meta = widgetMeta(id);
	const { activeTab, toggleWidget, settings } = useDashboard();
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	const header = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-2 border-b border-border/60 bg-card px-4 py-2 select-none shrink-0 min-h-[42px] cursor-grab active:cursor-grabbing",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripHorizontal, { className: "h-3.5 w-3.5 text-muted-foreground/40 hover:text-muted-foreground transition-colors shrink-0" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[13px] font-semibold text-foreground tracking-tight whitespace-nowrap",
					children: meta.title
				}),
				info ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip$1, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": `About ${meta.title}`,
						className: "text-muted-foreground/70 hover:text-foreground cursor-pointer transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5" })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
					className: "max-w-64 text-xs",
					children: info
				})] }) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1.5 shrink-0",
			onMouseDown: (e) => e.stopPropagation(),
			children: [
				extraControls,
				meta.hasRange && range && onRangeChange ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					"aria-label": `${meta.title} range`,
					value: range,
					onChange: (e) => onRangeChange(e.target.value),
					className: "h-6.5 rounded-md border border-border/80 bg-background px-1.5 text-[11px] font-medium text-foreground cursor-pointer shadow-2xs hover:border-border focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all",
					children: RANGES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: r,
						children: RANGE_LABEL[r]
					}, r))
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-0.5 text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
							label: "Export widget",
							onClick: () => toast.success(`${meta.title} exported as CSV`),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "h-3.5 w-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
							label: "Expand widget",
							onClick: () => setExpanded(true),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "h-3.5 w-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
							label: "Remove widget",
							onClick: () => {
								toggleWidget(activeTab.id, id);
								toast("Widget removed", {
									description: meta.title,
									action: {
										label: "Undo",
										onClick: () => toggleWidget(activeTab.id, id)
									}
								});
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
						})
					]
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("flex min-w-0 flex-col rounded-xl border border-border/80 bg-card text-card-foreground shadow-xs hover:shadow-sm transition-all overflow-hidden", className),
		children: [header, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("min-w-0 flex-1 bg-card", settings.density === "compact" ? "p-3" : "p-4"),
			children
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: expanded,
		onOpenChange: setExpanded,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-[min(1200px,95vw)] rounded-2xl border border-border/80 bg-background shadow-2xl p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
				className: "border-b border-border/70 pb-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-[16px] font-semibold text-foreground",
					children: meta.title
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[75vh] overflow-auto pt-4",
				children
			})]
		})
	})] });
}
function IconBtn({ label, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip$1, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": label,
			onClick,
			className: "p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer active:scale-95",
			children
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
		className: "text-xs",
		children: label
	})] });
}
var CARDS = [
	{
		key: "online",
		label: "Online",
		className: "bg-success/10 border-success/30 text-success"
	},
	{
		key: "offline",
		label: "Offline",
		className: "bg-danger/10 border-danger/30 text-danger"
	},
	{
		key: "videoLoss",
		label: "Video Loss",
		className: "bg-warning/20 border-warning/40 text-warning-foreground"
	},
	{
		key: "tampered",
		label: "Tampered",
		className: "bg-muted border-border text-muted-foreground"
	}
];
function CameraStatusWidget() {
	const [focus, setFocus] = (0, import_react.useState)("online");
	const total = Object.values(cameraStatus).reduce((a, b) => a + b, 0);
	const value = cameraStatus[focus];
	const pct = Math.round(value / total * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetCard, {
		id: "camera-status",
		info: "Live camera health across the fleet.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-[220px] min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PieChart, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pie, {
						data: [{
							name: focus,
							value
						}, {
							name: "rest",
							value: total - value
						}],
						dataKey: "value",
						innerRadius: "72%",
						outerRadius: "94%",
						startAngle: 90,
						endAngle: -270,
						stroke: "none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: "var(--color-success)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: "var(--color-border)" })]
					}) })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-4xl font-semibold tabular-nums text-foreground",
						children: [pct, "%"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground",
						children: [CARDS.find((c) => c.key === focus).label.toLowerCase(), " cameras"]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-[180px] shrink-0 space-y-2",
				children: CARDS.map((c) => {
					const Icon = c.key === "online" ? Video : c.key === "tampered" ? TriangleAlert : VideoOff;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setFocus(c.key),
						className: cn("flex w-full items-center justify-between rounded-xl border p-2.5 text-left transition-all cursor-pointer shadow-2xs active:scale-98", c.className, focus === c.key ? "ring-2 ring-primary/40 shadow-sm" : "opacity-85 hover:opacity-100"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs font-semibold",
							children: c.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-base font-bold tabular-nums font-mono",
							children: cameraStatus[c.key]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })]
					}, c.key);
				})
			})]
		})
	});
}
var ScrollArea = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
	ref,
	className: cn("relative overflow-hidden", className),
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollBar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Corner, {})
	]
}));
ScrollArea.displayName = Root.displayName;
var ScrollBar = import_react.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbar, {
	ref,
	orientation,
	className: cn("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
}));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
function EventsDistributionWidget() {
	const { activeTab, setTabRange } = useDashboard();
	const range = activeTab.range;
	const [category, setCategory] = (0, import_react.useState)("all");
	const [muted, setMuted] = (0, import_react.useState)([]);
	const rows = eventTypes.filter((e) => category === "all" || e.category === category);
	const active = rows.filter((e) => !muted.includes(e.id));
	const pieData = active.map((e) => ({
		name: e.label,
		value: e.count[range],
		color: e.color,
		category: e.category
	}));
	const totalValue = pieData.reduce((sum, item) => sum + item.value, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetCard, {
		id: "events-distribution",
		info: "Split of detected events between driver monitoring (DMS) and road-facing (ADAS) systems.",
		range,
		onRangeChange: (r) => setTabRange(activeTab.id, r),
		extraControls: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mr-1 flex items-center gap-1",
			children: [
				"all",
				"DMS",
				"ADAS"
			].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setCategory(c),
				className: cn("h-7 rounded-lg px-2.5 text-xs font-semibold transition-all cursor-pointer shadow-2xs border", category === c ? "bg-[#155dfc] text-white border-[#155dfc]" : "bg-background text-muted-foreground border-border/80 hover:bg-muted hover:text-foreground"),
				children: c === "all" ? "All" : c
			}, c))
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-[260px] min-w-0 flex-1",
				children: active.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "flex h-full items-center justify-center text-sm text-muted-foreground",
					children: "All series hidden — re-enable one from the legend."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
						data: pieData,
						dataKey: "value",
						nameKey: "name",
						cx: "50%",
						cy: "50%",
						outerRadius: 100,
						paddingAngle: 1,
						children: pieData.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
							fill: d.color,
							stroke: "var(--color-surface, #ffffff)",
							strokeWidth: 1.5
						}, d.name))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						formatter: (value, name) => [`${value} (${totalValue > 0 ? (value / totalValue * 100).toFixed(1) : 0}%)`, name],
						contentStyle: {
							borderRadius: 6,
							border: "1px solid var(--color-border)",
							backgroundColor: "var(--color-surface, #fff)",
							fontSize: 12
						}
					})] })
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
				className: "h-[260px] w-[210px] shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "pr-3",
					children: rows.map((e) => {
						const isMuted = muted.includes(e.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setMuted((m) => m.includes(e.id) ? m.filter((i) => i !== e.id) : [...m, e.id]),
							className: cn("flex w-full items-center gap-2 rounded px-1 py-1.5 text-left text-xs transition-colors hover:bg-muted", isMuted && "opacity-40"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-3 w-3 shrink-0 rounded-sm",
									style: { backgroundColor: e.color }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "min-w-0 flex-1 truncate text-foreground",
									children: e.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums text-muted-foreground",
									children: e.count[range]
								})
							]
						}) }, e.id);
					})
				})
			})]
		})
	});
}
var CHIPS = [
	"Highlights",
	"Distracted Driving",
	"Cellphone Distraction",
	"Eye closed"
];
function EventsHighlightsWidget() {
	const { activeTab, setTabRange } = useDashboard();
	const range = activeTab.range;
	const [violationsOnly, setViolationsOnly] = (0, import_react.useState)(true);
	const [chips, setChips] = (0, import_react.useState)(["Highlights"]);
	const [showAllChips, setShowAllChips] = (0, import_react.useState)(false);
	let rows = highlightEvents.filter((e) => e.range.includes(range));
	if (violationsOnly) rows = rows.filter((e) => e.violation);
	const nameChips = chips.filter((c) => c !== "Highlights");
	if (nameChips.length) rows = rows.filter((e) => nameChips.some((c) => e.label.toLowerCase().includes(c.toLowerCase())));
	rows = [...rows].sort((a, b) => b.count - a.count);
	const visibleChips = showAllChips ? CHIPS : CHIPS.slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WidgetCard, {
		id: "events-highlights",
		info: "Most frequent events for the selected filters.",
		range,
		onRangeChange: (r) => setTabRange(activeTab.id, r),
		extraControls: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setViolationsOnly((v) => !v),
			className: cn("mr-1 h-7 rounded-lg px-2.5 text-xs font-semibold transition-all cursor-pointer shadow-2xs border", violationsOnly ? "bg-[#155dfc] text-white border-[#155dfc]" : "bg-background text-muted-foreground border-border/80 hover:bg-muted hover:text-foreground"),
			children: violationsOnly ? "Violations" : "All events"
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-wrap items-center gap-1.5",
			children: [
				visibleChips.map((c) => {
					const on = chips.includes(c);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setChips((s) => on ? s.filter((i) => i !== c) : [...s, c]),
						className: cn("flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all shadow-2xs cursor-pointer", on ? "border-[#155dfc] bg-[#155dfc]/10 text-[#155dfc] font-semibold" : "border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground"),
						children: [c, on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" }) : null]
					}, c);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setShowAllChips((s) => !s),
					className: "text-xs font-semibold text-primary underline-offset-2 hover:underline cursor-pointer px-1",
					children: showAllChips ? "See less" : `See ${CHIPS.length - 3}+`
				}),
				(chips.length > 0 || !violationsOnly) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setChips([]);
						setViolationsOnly(true);
					},
					className: "ml-auto text-xs font-medium text-muted-foreground hover:text-foreground underline-offset-2 hover:underline cursor-pointer",
					children: "Reset filters"
				})
			]
		}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "py-10 text-center text-xs text-muted-foreground",
			children: "No events match these filters."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: rows.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center gap-3.5 rounded-lg bg-muted/40 p-2 transition-colors hover:bg-muted/70 cursor-pointer",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "h-10 w-14 shrink-0 rounded bg-slate-700/80 dark:bg-slate-800",
						style: { background: "linear-gradient(135deg, oklch(0.35 0.04 260), oklch(0.25 0.05 265))" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground",
						children: e.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "pr-2 text-base font-bold tabular-nums text-foreground",
						children: String(e.count).padStart(2, "0")
					})
				]
			}, e.id))
		})]
	});
}
var band = (score) => {
	if (score <= 50) return {
		label: "Poor",
		color: "var(--color-danger)"
	};
	if (score <= 89) return {
		label: "Fair",
		color: "var(--color-warning)"
	};
	return {
		label: "Excellent",
		color: "var(--color-success)"
	};
};
function FleetScoreWidget() {
	const { activeTab, setTabRange, settings } = useDashboard();
	const range = activeTab.range;
	const { score, delta } = fleetScore[range];
	const { color } = band(score);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetCard, {
		id: "fleet-score",
		info: "Overall safety rating of your drivers.",
		range,
		onRangeChange: (r) => setTabRange(activeTab.id, r),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-[190px] w-full max-w-[380px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadialBarChart, {
							data: [{
								name: "score",
								value: score,
								fill: color
							}],
							innerRadius: "76%",
							outerRadius: "100%",
							startAngle: 180,
							endAngle: 0,
							barSize: 22,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarAngleAxis, {
								type: "number",
								domain: [0, 100],
								tick: false
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadialBar, {
								background: true,
								dataKey: "value",
								cornerRadius: 12
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-5xl font-semibold tabular-nums text-foreground",
							children: score
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-1 flex items-center gap-1 text-sm font-medium",
							children: [
								delta >= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-4 w-4 text-danger" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: delta >= 0 ? "text-success" : "text-danger",
									children: [Math.abs(delta), " %"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: ["in ", RANGE_LABEL[range].toLowerCase()]
								})
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap justify-center gap-4 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend$1, {
							color: "var(--color-danger)",
							label: "Poor",
							hint: "(0-50)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend$1, {
							color: "var(--color-warning)",
							label: "Fair",
							hint: "(51-89)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend$1, {
							color: "var(--color-success)",
							label: "Excellent",
							hint: "(90-100)"
						})
					]
				}),
				settings.showNotes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-center text-[11px] leading-relaxed text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: "Note: "
					}), "Fleet Average Score represents the overall safety rating of your drivers, calculated from speeding, distraction, fatigue, and harsh driving events."]
				}) : null
			]
		})
	});
}
function Legend$1({ color, label, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex items-center gap-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "h-3 w-3 rounded-sm",
				style: { backgroundColor: color }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium text-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: hint
			})
		]
	});
}
var TAG_ICON = {
	fatigue: Bed,
	phone: PhoneCall,
	smoking: Cigarette,
	distraction: ScanFace,
	eye: EyeOff
};
function RiskyDriversWidget() {
	const { activeTab, setTabRange } = useDashboard();
	const range = activeTab.range;
	const rows = riskyDrivers.filter((d) => d.range.includes(range)).sort((a, b) => b.score - a.score).slice(0, 5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetCard, {
		id: "risky-drivers",
		info: "Drivers with the highest number of risk events in the selected period.",
		range,
		onRangeChange: (r) => setTabRange(activeTab.id, r),
		children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "py-10 text-center text-xs text-muted-foreground",
			children: "No risky drivers in this period."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-border/60",
			children: rows.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center gap-3 py-3 px-1 transition-colors hover:bg-muted/30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs font-semibold text-foreground",
							children: d.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-mono text-muted-foreground",
							children: d.vehicle
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1",
						children: d.tags.map((t) => {
							const Icon = TAG_ICON[t] ?? ScanFace;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								title: t,
								className: "rounded-full border border-border/70 p-1 text-muted-foreground/80",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3 w-3" })
							}, t);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-8 text-right text-base font-semibold tabular-nums text-foreground",
						children: String(d.score).padStart(2, "0")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("w-14 rounded-full px-2 py-0.5 text-center text-[10.5px] font-semibold", d.level === "High" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" : d.level === "Medium" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"),
						children: d.level
					})
				]
			}, d.id))
		})
	});
}
function ScoreDistributionWidget() {
	const { activeTab, setTabRange } = useDashboard();
	const range = activeTab.range;
	const data = scoreDistribution[range];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetCard, {
		id: "score-distribution",
		info: "Number of drivers falling into each score range.",
		range,
		onRangeChange: (r) => setTabRange(activeTab.id, r),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-[280px] w-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data,
					layout: "vertical",
					margin: {
						left: 8,
						right: 16,
						top: 4,
						bottom: 18
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							type: "number",
							tick: {
								fontSize: 11,
								fill: "var(--color-muted-foreground)"
							},
							label: {
								value: "Number of Drivers",
								position: "insideBottom",
								offset: -12,
								fontSize: 12,
								fill: "var(--color-foreground)"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							type: "category",
							dataKey: "bucket",
							width: 52,
							tick: {
								fontSize: 11,
								fill: "var(--color-muted-foreground)"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							contentStyle: {
								borderRadius: 6,
								border: "1px solid var(--color-border)",
								fontSize: 12
							},
							formatter: (v) => [`${v} drivers`, "Drivers"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "drivers",
							barSize: 16,
							radius: [
								0,
								3,
								3,
								0
							],
							children: data.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: bucketColor(d.bucket) }, d.bucket))
						})
					]
				})
			})
		})
	});
}
function EventTrendWidget() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetCard, {
		id: "event-trend",
		info: "Trend of DMS and ADAS safety events over time",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "h-[260px] flex flex-col justify-center px-1 py-4 space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: "DMS Drowsiness & Distraction"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-rose-500",
						children: "14 events (-12%)"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full bg-muted rounded-full h-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-rose-500 h-2 rounded-full w-[45%]" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: "ADAS Forward Collision Warning"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-amber-500",
						children: "8 events (-25%)"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full bg-muted rounded-full h-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-amber-500 h-2 rounded-full w-[28%]" })
				})]
			})]
		})
	});
}
function FleetStatusWidget() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetCard, {
		id: "fleet-status",
		info: "Real-time vehicle operating status breakdown",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-2 p-3 text-xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-muted-foreground block font-medium",
						children: "Running"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-base font-extrabold text-emerald-600 dark:text-emerald-400",
						children: "26"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-amber-500/20 bg-amber-500/10 p-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-muted-foreground block font-medium",
						children: "Idle"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-base font-extrabold text-amber-600 dark:text-amber-400",
						children: "2"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-rose-500/20 bg-rose-500/10 p-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-muted-foreground block font-medium",
						children: "Stopped"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-base font-extrabold text-rose-600 dark:text-rose-400",
						children: "15"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-muted-foreground block font-medium",
						children: "Inactive"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-base font-extrabold text-indigo-600 dark:text-indigo-400",
						children: "65"
					})]
				})
			]
		})
	});
}
function GenericActivityWidget({ id, title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetCard, {
		id,
		info: title + " live telematics streaming",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "h-36 flex flex-col items-center justify-center text-center p-3 text-xs text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold text-foreground",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px] mt-1",
				children: "Live telemetry streaming across active fleet"
			})]
		})
	});
}
var MAP = {
	"event-trend": EventTrendWidget,
	"events-distribution": EventsDistributionWidget,
	"events-highlights": EventsHighlightsWidget,
	"fleet-score": FleetScoreWidget,
	"score-distribution": ScoreDistributionWidget,
	"risky-drivers": RiskyDriversWidget,
	"event-heatmap": () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GenericActivityWidget, {
		id: "event-heatmap",
		title: "Event Heatmap"
	}),
	"fleet-status": FleetStatusWidget,
	"fleet-usage": () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GenericActivityWidget, {
		id: "fleet-usage",
		title: "Fleet Usage"
	}),
	"fleet-idle": () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GenericActivityWidget, {
		id: "fleet-idle",
		title: "Fleet Idle"
	}),
	"fleet-fuel": () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GenericActivityWidget, {
		id: "fleet-fuel",
		title: "Fleet Fuel"
	}),
	"fleet-workload": () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GenericActivityWidget, {
		id: "fleet-workload",
		title: "Fleet Workload"
	}),
	"driver-most-alerts": () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GenericActivityWidget, {
		id: "driver-most-alerts",
		title: "Driver With Most Alerts"
	}),
	"object-most-alerts": () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GenericActivityWidget, {
		id: "object-most-alerts",
		title: "Object With Most Alerts"
	}),
	"object-mode": () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GenericActivityWidget, {
		id: "object-mode",
		title: "Object Mode"
	}),
	"camera-status": CameraStatusWidget
};
function DashboardGrid() {
	const { activeTab, reorderWidgets } = useDashboard();
	const [draggedWidgetId, setDraggedWidgetId] = (0, import_react.useState)(null);
	const [overWidgetId, setOverWidgetId] = (0, import_react.useState)(null);
	if (activeTab.widgets.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "m-4 rounded-xl border border-dashed border-border bg-card p-12 text-center text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-bold text-foreground text-sm",
			children: "No widgets on this dashboard"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-1 text-muted-foreground",
			children: [
				"Click the ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Configuration" }),
				" button on the top right to select widgets."
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6",
		children: activeTab.widgets.map((id) => {
			const Widget = MAP[id] ?? FleetScoreWidget;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				draggable: true,
				onDragStart: (e) => {
					setDraggedWidgetId(id);
					e.dataTransfer.effectAllowed = "move";
					e.dataTransfer.setData("text/plain", id);
				},
				onDragOver: (e) => {
					e.preventDefault();
					if (draggedWidgetId && draggedWidgetId !== id) setOverWidgetId(id);
				},
				onDragLeave: () => {
					setOverWidgetId((prev) => prev === id ? null : prev);
				},
				onDrop: (e) => {
					e.preventDefault();
					const fromId = draggedWidgetId ?? e.dataTransfer.getData("text/plain");
					if (fromId && fromId !== id) {
						reorderWidgets(activeTab.id, fromId, id);
						toast.success("Widget reordered");
					}
					setDraggedWidgetId(null);
					setOverWidgetId(null);
				},
				onDragEnd: () => {
					setDraggedWidgetId(null);
					setOverWidgetId(null);
				},
				className: cn("transition-all duration-200 select-none rounded-xl relative", draggedWidgetId === id && "opacity-30 scale-[0.98] ring-2 ring-[#0089FF]/40", overWidgetId === id && draggedWidgetId !== id && "ring-2 ring-[#0089FF] shadow-xl scale-[1.01] z-10"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Widget, {})
			}, id);
		})
	});
}
var AlertDialog = Root2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-black/40 backdrop-blur-xs data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("text-[16px] font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
/**
* Universal Multi-Select Dropdown matching the exact design and behavior
* from the reference screenshots (with search, select all, 0-selection warning banner,
* Clear/Cancel/Apply footer, and "+N" closed state formatting e.g. "GJ21HS1609+100").
*/
function UniversalMultiSelectDropdown({ label, selected, options, onChange, placeholder, className }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [search, setSearch] = (0, import_react.useState)("");
	const [draft, setDraft] = (0, import_react.useState)(selected);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (open) {
			setDraft(selected);
			setSearch("");
		}
	}, [open, selected]);
	(0, import_react.useEffect)(() => {
		const handleClickOutside = (event) => {
			if (ref.current && !ref.current.contains(event.target)) setOpen(false);
		};
		if (open) document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [open]);
	const filteredOptions = (0, import_react.useMemo)(() => {
		const q = search.trim().toLowerCase();
		if (!q) return options;
		return options.filter((opt) => opt.toLowerCase().includes(q));
	}, [options, search]);
	const isAllDraftSelected = filteredOptions.length > 0 && filteredOptions.every((opt) => draft.includes(opt));
	const toggleDraft = (opt) => {
		if (draft.includes(opt)) setDraft(draft.filter((s) => s !== opt));
		else setDraft([...draft, opt]);
	};
	const toggleAllDraft = () => {
		if (isAllDraftSelected) setDraft(draft.filter((s) => !filteredOptions.includes(s)));
		else setDraft([.../* @__PURE__ */ new Set([...draft, ...filteredOptions])]);
	};
	const handleApply = () => {
		onChange(draft);
		setOpen(false);
	};
	const handleCancel = () => {
		setDraft(selected);
		setOpen(false);
	};
	const handleClear = () => {
		setDraft([]);
	};
	(0, import_react.useMemo)(() => {
		if (!selected || selected.length === 0) return placeholder || `Select ${label}`;
		if (selected.length === 1) return selected[0];
		return `${selected[0]}+${selected.length - 1}`;
	}, [
		selected,
		label,
		placeholder
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: cn("relative", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen(!open),
			className: cn("flex h-7.5 w-full items-center justify-between rounded-md border border-input/80 bg-background px-2.5 text-xs text-foreground font-semibold shadow-2xs transition-all hover:border-[#0089FF]/60 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF] cursor-pointer select-none", open && "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-muted/40"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate flex items-center min-w-0",
				children: !selected || selected.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground/60 font-medium italic truncate",
					children: placeholder || `Select ${label}`
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate font-medium text-muted-foreground",
					children: selected[0]
				}), selected.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "ml-1.5 inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-[#0089FF]/10 text-[#0089FF] border border-[#0089FF]/20 shrink-0",
					children: ["+", selected.length - 1]
				})] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70 transition-transform duration-200 ml-1", open && "rotate-180") })]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute top-full left-0 right-0 z-50 mt-1.5 w-full rounded-xl border border-border/80 bg-popover/98 backdrop-blur-xl shadow-2xl animate-in fade-in-0 zoom-in-95 select-none overflow-hidden flex flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 pb-2 border-b border-border/60 bg-muted/20 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-semibold text-foreground",
							children: ["Select ", label]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] font-semibold text-[#0089FF] bg-[#0089FF]/10 px-2 py-0.5 rounded-full",
							children: [draft.length, " selected"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-8 items-center gap-1.5 rounded-md border border-input bg-background px-2.5 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: search,
								onChange: (e) => setSearch(e.target.value),
								placeholder: `Search ${label.toLowerCase()}...`,
								className: "h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
							}),
							search && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSearch(""),
								className: "rounded-md p-0.5 text-muted-foreground hover:text-foreground cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-3.5 py-1.5 border-b border-border/60 flex items-center justify-between bg-muted/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 cursor-pointer select-none w-full text-xs font-semibold text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: isAllDraftSelected,
							onChange: toggleAllDraft,
							className: "h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Select All" })]
					})
				}),
				draft.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-3 my-1.5 px-2.5 py-1.5 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200/70 dark:border-red-800/40 text-[10px] text-red-600 dark:text-red-400 font-medium leading-snug",
					children: "Select at least one item, or all items will be selected by default."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-48 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar",
					children: [filteredOptions.map((opt) => {
						const isChecked = draft.includes(opt);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs text-foreground transition-colors cursor-pointer select-none hover:bg-muted/80 font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: isChecked,
								onChange: () => toggleDraft(opt),
								className: "rounded border-input text-[#0089FF] cursor-pointer h-3.5 w-3.5 accent-[#0089FF]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("truncate", isChecked && "font-semibold text-foreground"),
								children: opt
							})]
						}, opt);
					}), filteredOptions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 text-center text-xs text-muted-foreground italic",
						children: [
							"No ",
							label.toLowerCase(),
							" found"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-2.5 px-3.5 border-t border-border/70 flex items-center justify-between bg-muted/20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: handleClear,
						className: "text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer transition-colors",
						children: "Clear"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleCancel,
							className: "px-3 py-1.5 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleApply,
							className: "px-4 py-1.5 text-xs rounded-md font-semibold text-white bg-[#155dfc] hover:bg-[#124ecf] shadow-xs transition-all active:scale-98 cursor-pointer",
							children: "Apply"
						})]
					})]
				})
			]
		})]
	});
}
function DashboardFilterDrawer({ open, onClose, onApply }) {
	const companyOptions = (0, import_react.useMemo)(() => COMPANIES.filter((c) => c !== "All"), []);
	const [selectedCompanies, setSelectedCompanies] = (0, import_react.useState)(["HP Company"]);
	const branchOptions = (0, import_react.useMemo)(() => {
		const branches = getBranchesForCompanies(selectedCompanies);
		return branches.length > 0 ? branches : [
			"HP Branch 1",
			"HP Branch 2",
			"Valsad",
			"Surat",
			"Ahmedabad",
			"Mumbai"
		];
	}, [selectedCompanies]);
	const [selectedBranches, setSelectedBranches] = (0, import_react.useState)(["HP Branch 1"]);
	(0, import_react.useEffect)(() => {
		if (selectedBranches.length === 0 && branchOptions.length > 0) setSelectedBranches([branchOptions[0]]);
	}, [branchOptions, selectedBranches]);
	const groupOptions = (0, import_react.useMemo)(() => {
		const groups = getGroupsForBranches(selectedBranches);
		return groups.length > 0 ? groups : [
			"HP Group",
			"Trucks",
			"Buses",
			"Cars",
			"Cold Chain"
		];
	}, [selectedBranches]);
	const [selectedGroups, setSelectedGroups] = (0, import_react.useState)(["HP Group"]);
	const typeOptions = (0, import_react.useMemo)(() => VEHICLE_TYPES.filter((t) => t !== "All" && t !== "" && !t.includes("All")).concat([
		"Dumper",
		"Truck",
		"Bus",
		"SUV",
		"Taxi",
		"Trailer"
	]).filter((v, i, a) => a.indexOf(v) === i), []);
	const [selectedTypes, setSelectedTypes] = (0, import_react.useState)(["Dumper", "Truck"]);
	const [vehicleSearch, setVehicleSearch] = (0, import_react.useState)("");
	const [openBranchGroups, setOpenBranchGroups] = (0, import_react.useState)([
		"HP Branch 1",
		"HP Branch 2",
		"Valsad",
		"Surat"
	]);
	const vehicleList = (0, import_react.useMemo)(() => {
		const fromReports = getVehiclesForBranches(selectedBranches);
		if (fromReports.length > 0) return fromReports.map((v) => ({
			id: v.id,
			name: v.name,
			imei: v.imei,
			branch: v.branch,
			driver: v.driver || "Driver"
		}));
		return fleetObjects.map((v) => ({
			id: v.id,
			name: v.name,
			imei: v.imei,
			branch: v.branch,
			driver: v.driverName || "Driver"
		}));
	}, [selectedBranches]);
	const [selectedVehicleIds, setSelectedVehicleIds] = (0, import_react.useState)([
		"o1",
		"o2",
		"o3",
		"v1",
		"v2"
	]);
	const groupedVehicles = (0, import_react.useMemo)(() => {
		const q = vehicleSearch.trim().toLowerCase();
		const map = /* @__PURE__ */ new Map();
		for (const v of vehicleList) if (!q || v.name.toLowerCase().includes(q) || v.imei.toLowerCase().includes(q) || v.branch.toLowerCase().includes(q) || v.driver.toLowerCase().includes(q)) {
			const list = map.get(v.branch) ?? [];
			list.push(v);
			map.set(v.branch, list);
		}
		return [...map.entries()].map(([branch, vehicles]) => ({
			branch,
			vehicles
		}));
	}, [vehicleList, vehicleSearch]);
	const allFilteredVehicleIds = (0, import_react.useMemo)(() => groupedVehicles.flatMap((g) => g.vehicles.map((v) => v.id)), [groupedVehicles]);
	const allVehiclesSelected = allFilteredVehicleIds.length > 0 && allFilteredVehicleIds.every((id) => selectedVehicleIds.includes(id));
	const toggleSelectAllVehicles = () => {
		if (allVehiclesSelected) setSelectedVehicleIds([]);
		else setSelectedVehicleIds(allFilteredVehicleIds);
	};
	const toggleBranchAccordion = (branch) => {
		setOpenBranchGroups((prev) => prev.includes(branch) ? prev.filter((b) => b !== branch) : [...prev, branch]);
	};
	const toggleBranchVehicles = (vehicles) => {
		const ids = vehicles.map((v) => v.id);
		if (ids.every((id) => selectedVehicleIds.includes(id))) setSelectedVehicleIds((prev) => prev.filter((id) => !ids.includes(id)));
		else setSelectedVehicleIds((prev) => [.../* @__PURE__ */ new Set([...prev, ...ids])]);
	};
	const toggleVehicle = (id) => {
		setSelectedVehicleIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
	};
	const handleReset = () => {
		setSelectedCompanies(["HP Company"]);
		setSelectedBranches(["HP Branch 1"]);
		setSelectedGroups(["HP Group"]);
		setSelectedTypes(["Dumper", "Truck"]);
		setVehicleSearch("");
		setSelectedVehicleIds([
			"o1",
			"o2",
			"o3"
		]);
		toast.info("Filter options reset to default");
	};
	const handleApply = () => {
		const filterState = {
			companies: selectedCompanies,
			branches: selectedBranches,
			groups: selectedGroups,
			types: selectedTypes,
			selectedVehicleIds
		};
		toast.success("Filters applied successfully", { description: `${selectedCompanies.join(", ")} · ${selectedBranches.length} branch(es) · ${selectedVehicleIds.length} vehicle(s) selected` });
		if (onApply) onApply(filterState);
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": "Close filter",
		onClick: onClose,
		className: "fixed top-[45px] bottom-0 left-0 sm:left-[68px] right-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
	}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		"aria-hidden": !open,
		"aria-label": "Dashboard Filter Options",
		className: cn("fixed right-0 top-[45px] bottom-0 z-40 flex w-full max-w-[420px] xl:max-w-[430px] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out", open ? "translate-x-0" : "pointer-events-none translate-x-full"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-[56px] items-center justify-between border-b border-border px-5 bg-background select-none shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[16px] font-semibold tracking-tight text-foreground",
					children: "Filter Options"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Close filter",
					onClick: onClose,
					className: "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 flex flex-col p-5 space-y-3.5 overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 shrink-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-foreground",
								children: "Company"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UniversalMultiSelectDropdown, {
								label: "Company",
								selected: selectedCompanies,
								options: companyOptions,
								onChange: setSelectedCompanies,
								placeholder: "Select Company"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-foreground",
								children: "Branch"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UniversalMultiSelectDropdown, {
								label: "Branch",
								selected: selectedBranches,
								options: branchOptions,
								onChange: setSelectedBranches,
								placeholder: "Select Branch"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-foreground",
								children: "Group"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UniversalMultiSelectDropdown, {
								label: "Group",
								selected: selectedGroups,
								options: groupOptions,
								onChange: setSelectedGroups,
								placeholder: "Select Group"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-foreground",
								children: "Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UniversalMultiSelectDropdown, {
								label: "Type",
								selected: selectedTypes,
								options: typeOptions,
								onChange: setSelectedTypes,
								placeholder: "Select Type"
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 pt-2 border-t border-border/60 flex-1 min-h-0 flex flex-col",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-foreground",
								children: "Vehicle List"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] font-semibold text-muted-foreground",
								children: [
									selectedVehicleIds.length,
									" of ",
									allFilteredVehicleIds.length,
									" selected"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex h-8 items-center gap-1.5 rounded-md border border-input/80 bg-background px-2.5 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: vehicleSearch,
										onChange: (e) => setVehicleSearch(e.target.value),
										placeholder: "Search vehicles, IMEI, branch...",
										"aria-label": "Search vehicles",
										className: "h-full flex-1 bg-transparent text-xs font-semibold text-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 focus:outline-none"
									}),
									vehicleSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setVehicleSearch(""),
										className: "text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-h-[200px] flex flex-col rounded-lg border border-border/80 bg-card overflow-hidden shadow-2xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border/60 bg-muted/40 px-3 py-2 shrink-0 select-none",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: toggleSelectAllVehicles,
										className: "text-xs font-semibold text-[#0089FF] hover:underline cursor-pointer",
										children: allVehiclesSelected ? "Clear all" : "Select all"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] font-medium text-muted-foreground",
										children: [groupedVehicles.length, " branch group(s)"]
									})]
								}),
								selectedVehicleIds.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mx-3 my-1.5 px-2.5 py-1.5 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200/70 dark:border-red-800/40 text-[10px] text-red-600 dark:text-red-400 font-medium leading-snug shrink-0",
									children: "Select at least one item, or all items will be selected by default."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-h-0 overflow-y-auto p-1 divide-y divide-border/40",
									children: [groupedVehicles.map(({ branch, vehicles }) => {
										const isExpanded = openBranchGroups.includes(branch) || vehicleSearch.trim() !== "";
										vehicles.map((v) => v.id);
										const selectedBranchCount = vehicles.filter((v) => selectedVehicleIds.includes(v.id)).length;
										const isBranchAllSelected = selectedBranchCount === vehicles.length && vehicles.length > 0;
										const isBranchSomeSelected = selectedBranchCount > 0 && !isBranchAllSelected;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "py-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted/50 transition-colors select-none",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "checkbox",
														"aria-label": `Select all vehicles in ${branch}`,
														checked: isBranchAllSelected,
														ref: (el) => {
															if (el) el.indeterminate = isBranchSomeSelected;
														},
														onChange: () => toggleBranchVehicles(vehicles),
														className: "rounded border-input text-[#0089FF] cursor-pointer h-3.5 w-3.5 accent-[#0089FF]"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														onClick: () => toggleBranchAccordion(branch),
														className: "flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-[#0089FF] transition-colors cursor-pointer text-left truncate",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-150", isExpanded && "rotate-90") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "truncate",
															children: branch
														})]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] font-semibold text-muted-foreground bg-muted/80 px-1.5 py-0.5 rounded-full",
													children: [
														selectedBranchCount,
														"/",
														vehicles.length
													]
												})]
											}), isExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 pl-6 pr-2 space-y-0.5",
												children: vehicles.map((v) => {
													const isChecked = selectedVehicleIds.includes(v.id);
													return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "flex items-center justify-between rounded-md px-2 py-1.5 text-xs transition-colors cursor-pointer select-none hover:bg-muted/60 text-foreground font-medium",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-2 min-w-0",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																	type: "checkbox",
																	checked: isChecked,
																	onChange: () => toggleVehicle(v.id),
																	className: "rounded border-input text-[#0089FF] cursor-pointer h-3.5 w-3.5 accent-[#0089FF]"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "min-w-0 truncate",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "block truncate leading-tight text-xs font-semibold",
																		children: v.name
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																		className: "block text-[10px] text-muted-foreground truncate leading-tight font-normal",
																		children: [
																			v.imei,
																			" · ",
																			v.driver
																		]
																	})]
																})
															]
														})
													}, v.id);
												})
											})]
										}, branch);
									}), groupedVehicles.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-6 text-center text-xs text-muted-foreground italic",
										children: [
											"No vehicles found matching “",
											vehicleSearch,
											"”"
										]
									})]
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "flex h-[56px] items-center justify-between border-t border-border bg-background px-5 shrink-0 select-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handleReset,
					className: "inline-flex items-center gap-1.5 rounded-md border border-input/80 bg-background px-3 py-2 text-xs font-semibold text-foreground transition-all hover:bg-muted cursor-pointer shadow-2xs active:scale-98",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reset" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: handleApply,
					className: "h-9 rounded-md bg-[#0089FF] px-6 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#0070d6] cursor-pointer active:scale-98",
					children: "Apply Filters"
				})]
			})
		]
	})] });
}
function DashboardConfigDrawer({ target, onClose }) {
	const { tabs, activeTab, addTab, renameTab, setTabWidgets, setActiveTab } = useDashboard();
	const isCreateMode = target?.mode === "create";
	const editingTab = target && target.mode === "edit" ? tabs.find((t) => t.id === target.tabId) ?? activeTab : null;
	const [tabName, setTabName] = (0, import_react.useState)("");
	const [selectedWidgets, setSelectedWidgets] = (0, import_react.useState)([]);
	const [query, setQuery] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!target) return;
		setQuery("");
		if (target.mode === "create") {
			setTabName("");
			setSelectedWidgets([]);
		} else {
			const current = tabs.find((t) => t.id === target.tabId) ?? activeTab;
			setTabName(current?.name ?? "Overview");
			setSelectedWidgets(current?.widgets ?? []);
		}
	}, [
		target,
		tabs,
		activeTab
	]);
	const videoTelematicsWidgets = (0, import_react.useMemo)(() => WIDGET_CATALOG.filter((w) => w.category === "VIDEO TELEMATICS" && (query === "" || w.title.toLowerCase().includes(query.trim().toLowerCase()))), [query]);
	const activityWidgets = (0, import_react.useMemo)(() => WIDGET_CATALOG.filter((w) => w.category === "ACTIVITY" && (query === "" || w.title.toLowerCase().includes(query.trim().toLowerCase()))), [query]);
	const toggleWidget = (id) => {
		setSelectedWidgets((prev) => prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]);
	};
	const handleApply = () => {
		const cleanName = tabName.trim();
		if (!cleanName) {
			toast.error("Please enter a tab name");
			return;
		}
		if (isCreateMode) {
			const newId = addTab(cleanName);
			setTabWidgets(newId, selectedWidgets);
			setActiveTab(newId);
			toast.success("\"" + cleanName + "\" tab created and loaded", { description: selectedWidgets.length + " active widgets configured" });
		} else if (editingTab) {
			renameTab(editingTab.id, cleanName);
			setTabWidgets(editingTab.id, selectedWidgets);
			toast.success("\"" + cleanName + "\" updated and loaded", { description: selectedWidgets.length + " active widgets configured" });
		}
		onClose();
	};
	const open = !!target;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": "Close configuration",
		onClick: onClose,
		className: "fixed top-[45px] bottom-0 left-0 sm:left-[68px] right-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
	}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		"aria-hidden": !open,
		"aria-label": "Dashboard configuration",
		className: cn("fixed right-0 top-[45px] bottom-0 z-40 flex w-full max-w-[420px] xl:max-w-[430px] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out", open ? "translate-x-0" : "pointer-events-none translate-x-full"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-[56px] items-center justify-between border-b border-border px-5 bg-background select-none shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[16px] font-semibold tracking-tight text-foreground",
					children: isCreateMode ? "Create Dashboard Tab" : "Dashboard Configuration"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					"aria-label": "Close configuration",
					className: "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 flex flex-col p-5 space-y-4 overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold text-foreground",
						children: "Tab Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						autoFocus: isCreateMode,
						value: tabName,
						onChange: (e) => setTabName(e.target.value),
						placeholder: "Enter tab name...",
						className: "h-8 w-full rounded-md border border-input/80 bg-background px-3 text-xs font-medium text-muted-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] focus:outline-none focus:text-foreground transition-all"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 pt-3 border-t border-border/60 flex-1 min-h-0 flex flex-col",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-foreground",
								children: "Layout Configuration"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-[#0089FF]/10 text-[#0089FF] px-2.5 py-0.5 font-semibold text-[10px]",
								children: [selectedWidgets.length, " Active"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex h-8 items-center gap-1.5 rounded-md border border-input/80 bg-background px-2.5 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: query,
										onChange: (e) => setQuery(e.target.value),
										placeholder: "Search Widgets...",
										className: "h-full flex-1 bg-transparent text-xs font-medium text-muted-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 focus:outline-none focus:text-foreground"
									}),
									query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setQuery(""),
										className: "p-0.5 rounded-md text-muted-foreground hover:text-foreground cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs font-semibold text-foreground",
								children: "Video Telematics"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-0.5 rounded-lg border border-border/80 bg-card p-1.5 shadow-2xs",
								children: videoTelematicsWidgets.map((w) => {
									const isChecked = selectedWidgets.includes(w.id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2.5 py-1.5 px-2.5 rounded-md text-xs cursor-pointer select-none transition-colors text-foreground font-medium hover:bg-muted/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: isChecked,
											onChange: () => toggleWidget(w.id),
											className: "rounded border-input text-brand cursor-pointer h-3.5 w-3.5 accent-[#0089FF]"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("truncate flex-1", isChecked && "font-semibold"),
											children: w.title
										})]
									}, w.id);
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs font-semibold text-foreground",
								children: "Activity"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-0.5 rounded-lg border border-border/80 bg-card p-1.5 shadow-2xs",
								children: activityWidgets.map((w) => {
									const isChecked = selectedWidgets.includes(w.id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2.5 py-1.5 px-2.5 rounded-md text-xs cursor-pointer select-none transition-colors text-foreground font-medium hover:bg-muted/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: isChecked,
											onChange: () => toggleWidget(w.id),
											className: "rounded border-input text-brand cursor-pointer h-3.5 w-3.5 accent-[#0089FF]"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("truncate flex-1", isChecked && "font-semibold"),
											children: w.title
										})]
									}, w.id);
								})
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "flex h-[56px] items-center justify-between border-t border-border bg-background px-5 shrink-0 select-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						if (isCreateMode) {
							setTabName("");
							setSelectedWidgets([]);
						} else if (editingTab) {
							setTabName(editingTab.name);
							setSelectedWidgets(editingTab.widgets);
						}
					},
					className: "inline-flex items-center gap-1.5 rounded-md border border-input/80 bg-background px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-muted cursor-pointer shadow-2xs active:scale-98",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reset" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "h-8 rounded-md border border-input/80 bg-background px-3 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: handleApply,
						className: "h-8 rounded-md bg-[#0089FF] px-4 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#0070d6] cursor-pointer active:scale-98",
						children: "Apply & Load"
					})]
				})]
			})
		]
	})] });
}
function TabStrip() {
	const { visibleTabs, hiddenTabs, activeTab, setActiveTab, renameTab, togglePin, hideTab, showTab, deleteTab, restoreTab, indexOfTab, reorderTabs, canHide, canDelete } = useDashboard();
	const [renamingId, setRenamingId] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const [dragId, setDragId] = (0, import_react.useState)(null);
	const [overId, setOverId] = (0, import_react.useState)(null);
	const inputRef = (0, import_react.useRef)(null);
	const [newMenuOpen, setNewMenuOpen] = (0, import_react.useState)(false);
	const [stagedHiddenIds, setStagedHiddenIds] = (0, import_react.useState)([]);
	const [filterDrawerOpen, setFilterDrawerOpen] = (0, import_react.useState)(false);
	const [configTarget, setConfigTarget] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (renamingId) inputRef.current?.focus();
	}, [renamingId]);
	(0, import_react.useEffect)(() => {
		if (newMenuOpen) setStagedHiddenIds(hiddenTabs.map((t) => t.id));
	}, [newMenuOpen, hiddenTabs]);
	const startRename = (id, current) => {
		setRenamingId(id);
		setDraft(current);
	};
	const commitRename = () => {
		if (renamingId) renameTab(renamingId, draft);
		setRenamingId(null);
	};
	const doHide = (id, name) => {
		if (!hideTab(id)) {
			toast.error("At least one dashboard tab must stay visible");
			return;
		}
		toast("\"" + name + "\" hidden", { action: {
			label: "Undo",
			onClick: () => showTab(id)
		} });
	};
	const confirmDelete = () => {
		if (!pendingDelete) return;
		const index = indexOfTab(pendingDelete);
		const removed = deleteTab(pendingDelete);
		setPendingDelete(null);
		if (!removed) {
			toast.error("The last dashboard tab can't be deleted");
			return;
		}
		toast("\"" + removed.name + "\" deleted", { action: {
			label: "Undo",
			onClick: () => restoreTab(removed, index)
		} });
	};
	const toggleStageHidden = (id) => {
		setStagedHiddenIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
	};
	const handleSaveHidden = () => {
		const toUnhide = hiddenTabs.filter((t) => !stagedHiddenIds.includes(t.id));
		toUnhide.forEach((t) => showTab(t.id));
		if (toUnhide.length > 0) {
			setActiveTab(toUnhide[0].id);
			toast.success(toUnhide.map((t) => "\"" + t.name + "\"").join(", ") + " is now visible");
		}
		setNewMenuOpen(false);
	};
	const handleCancelHidden = () => {
		setNewMenuOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-end justify-between gap-3 bg-slate-100/90 dark:bg-slate-950 px-4 pt-2 pb-0 text-xs select-none shrink-0 relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 left-0 right-0 h-[1px] bg-slate-300 dark:bg-slate-700 pointer-events-none z-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex min-w-0 flex-1 items-end gap-1.5 px-1 overflow-x-auto overflow-y-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
				children: [
					visibleTabs.map((tab) => {
						const isActive = tab.id === activeTab.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							draggable: renamingId !== tab.id,
							onDragStart: (e) => {
								setDragId(tab.id);
								e.dataTransfer.effectAllowed = "move";
								e.dataTransfer.setData("text/plain", tab.id);
							},
							onDragOver: (e) => {
								e.preventDefault();
								if (dragId && dragId !== tab.id) setOverId(tab.id);
							},
							onDragLeave: () => setOverId((o) => o === tab.id ? null : o),
							onDrop: (e) => {
								e.preventDefault();
								const from = dragId ?? e.dataTransfer.getData("text/plain");
								if (from && from !== tab.id) reorderTabs(from, tab.id);
								setDragId(null);
								setOverId(null);
							},
							onDragEnd: () => {
								setDragId(null);
								setOverId(null);
							},
							className: cn("group relative flex shrink-0 cursor-pointer items-center gap-2 px-4 py-2 text-xs font-semibold transition-all duration-150 rounded-t-lg select-none", isActive ? "bg-card dark:bg-slate-900 border-t border-l border-r border-slate-300 dark:border-slate-700 -mb-[1px] z-10 shadow-xs text-[#1e40af] dark:text-blue-400 font-bold" : "bg-transparent hover:bg-slate-200/60 dark:hover:bg-slate-800/60 text-[#1e40af] dark:text-blue-400 mb-0", dragId === tab.id ? "opacity-40" : "", overId === tab.id ? "ring-2 ring-primary/40" : ""),
							children: [
								isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-[1px] left-0 right-0 h-[2px] bg-card dark:bg-slate-900 z-10 pointer-events-none" }),
								renamingId === tab.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: inputRef,
									value: draft,
									onChange: (e) => setDraft(e.target.value),
									onBlur: commitRename,
									onKeyDown: (e) => {
										if (e.key === "Enter") commitRename();
										if (e.key === "Escape") setRenamingId(null);
									},
									className: "w-36 rounded border border-input px-1.5 py-0.5 text-xs focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none bg-background font-semibold",
									"aria-label": "Tab name"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setActiveTab(tab.id),
									onDoubleClick: () => startRename(tab.id, tab.name),
									className: "whitespace-nowrap transition-colors cursor-pointer text-xs font-semibold text-[#1e40af] dark:text-blue-400",
									children: tab.name
								}),
								tab.pinned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "h-3.5 w-3.5 shrink-0 text-[#1e40af] fill-[#1e40af] dark:text-blue-400 dark:fill-blue-400" }) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": tab.name + " options",
										className: cn("rounded p-0.5 text-[#1e40af] dark:text-blue-400 transition-opacity cursor-pointer", isActive ? "opacity-100 hover:bg-slate-100 dark:hover:bg-muted" : "opacity-0 group-hover:opacity-100 hover:bg-slate-200/60"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "h-3.5 w-3.5" })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
									align: "start",
									sideOffset: 4,
									className: "w-40 rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md p-1 text-xs shadow-xl z-50 animate-in fade-in-0 zoom-in-95",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
											onClick: () => startRename(tab.id, tab.name),
											className: "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-muted/80 cursor-pointer font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Rename" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
											onClick: () => {
												setActiveTab(tab.id);
												setConfigTarget({
													mode: "edit",
													tabId: tab.id
												});
											},
											className: "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-muted/80 cursor-pointer font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Edit" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											onClick: () => togglePin(tab.id),
											className: "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-muted/80 cursor-pointer font-medium",
											children: tab.pinned ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinOff, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Unpin" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "h-3.5 w-3.5 text-[#0089FF]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pin" })] })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
											disabled: !canHide(tab.id),
											onClick: () => doHide(tab.id, tab.name),
											className: "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-muted/80 cursor-pointer font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: canHide(tab.id) ? "Hide" : "Hide (last visible)" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "my-1 border-t border-border/60" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
											disabled: !canDelete(),
											onClick: () => setPendingDelete(tab.id),
											className: "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10 cursor-pointer font-semibold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5 text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: canDelete() ? "Delete" : "Delete (last tab)" })]
										})
									]
								})] })
							]
						}, tab.id);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-px bg-slate-300 dark:bg-border mx-1 shrink-0 mb-1" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
						open: newMenuOpen,
						onOpenChange: setNewMenuOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: cn("inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#1e40af] dark:text-blue-400 hover:text-blue-800 transition-colors cursor-pointer rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-800/50 mb-0.5", newMenuOpen && "text-blue-800 font-bold bg-slate-200/70"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 stroke-[2.5]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "New" }),
									hiddenTabs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-[#1e40af] px-1.5 text-[9px] font-bold text-white",
										children: hiddenTabs.length
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
							align: "start",
							sideOffset: 6,
							className: "w-60 overflow-hidden rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-2xl animate-in fade-in-0 zoom-in-95 duration-100",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setNewMenuOpen(false);
										setConfigTarget({ mode: "create" });
									},
									className: "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-foreground hover:bg-muted/80 hover:text-primary transition-colors cursor-pointer text-left",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, { className: "h-4 w-4 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Create New Group" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1.5 pt-2 border-t border-border/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block px-2.5 pb-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase",
										children: "Hidden Tabs"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "max-h-48 overflow-y-auto space-y-0.5",
										children: hiddenTabs.length > 0 ? hiddenTabs.map((tab) => {
											const isStagedToBeHidden = stagedHiddenIds.includes(tab.id);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												onClick: () => toggleStageHidden(tab.id),
												className: "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted/70 transition-colors cursor-pointer select-none",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: cn("truncate", !isStagedToBeHidden && "font-semibold text-primary"),
													children: tab.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-label": "Toggle visibility of " + tab.name,
													className: "rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
													children: isStagedToBeHidden ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3.5 w-3.5 opacity-60" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5 text-primary" })
												})]
											}, tab.id);
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "px-2.5 py-2 text-[11px] text-muted-foreground italic",
											children: "No hidden tabs"
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2.5 pt-2 border-t border-border/60 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: handleSaveHidden,
										className: "flex-1 py-1.5 px-3 rounded-md bg-[#0f172a] hover:bg-[#1e293b] text-white dark:bg-[#155dfc] dark:hover:bg-[#124ecf] text-xs font-semibold shadow-xs transition-all cursor-pointer text-center",
										children: "Save"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: handleCancelHidden,
										className: "flex-1 py-1.5 px-3 rounded-md bg-muted/60 hover:bg-muted text-foreground text-xs font-medium border border-border/50 transition-all cursor-pointer text-center",
										children: "Cancel"
									})]
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex items-center gap-2 shrink-0 pb-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setFilterDrawerOpen(true),
					className: cn("inline-flex h-7 items-center gap-1.5 rounded-md border border-border/80 bg-background px-2.5 text-xs font-semibold text-foreground transition-all hover:bg-muted hover:border-[#0089FF]/50 cursor-pointer select-none shadow-2xs active:scale-98", filterDrawerOpen && "bg-muted border-[#0089FF]/50 ring-2 ring-[#0089FF]/20"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Filter" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setConfigTarget({
						mode: "edit",
						tabId: activeTab.id
					}),
					className: cn("inline-flex h-7 items-center gap-1.5 rounded-md border border-border/80 bg-background px-2.5 text-xs font-semibold text-foreground transition-all hover:bg-muted hover:border-[#0089FF]/50 cursor-pointer select-none shadow-2xs active:scale-98", configTarget !== null && "bg-muted border-[#0089FF]/50 ring-2 ring-[#0089FF]/20"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Configuration" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardFilterDrawer, {
				open: filterDrawerOpen,
				onClose: () => setFilterDrawerOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardConfigDrawer, {
				target: configTarget,
				onClose: () => setConfigTarget(null)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!pendingDelete,
				onOpenChange: (o) => !o && setPendingDelete(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
					className: "text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
						className: "text-sm",
						children: "Delete this dashboard tab?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, {
						className: "text-xs",
						children: "Its widget layout will be removed. You can undo right after deleting."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
						className: "text-xs cursor-pointer",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
						onClick: confirmDelete,
						className: "text-xs cursor-pointer",
						children: "Delete"
					})] })]
				})
			})
		]
	});
}
function DashboardPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 min-h-0 overflow-y-auto bg-card dark:bg-slate-900 flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabStrip, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 min-h-0 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardGrid, {})
		})]
	});
}
//#endregion
export { DashboardPage as component };
