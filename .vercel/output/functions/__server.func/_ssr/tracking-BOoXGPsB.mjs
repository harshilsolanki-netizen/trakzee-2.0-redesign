import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Minimize2, F as Search, H as Plus, Ht as CircleQuestionMark, J as Pause, Jt as ChevronLeft, Lt as Compass, M as Settings, Q as Minus, U as Play, Yt as ChevronDown, Z as Navigation, _ as TrendingUp, b as TrafficCone, cn as Bell, ft as Layers, g as TriangleAlert, ht as Info, j as Share2, n as X, qt as ChevronRight, rn as Camera, rt as MapPin, s as Video, tt as Maximize2, u as User, w as Square, wt as FileText, z as RotateCcw, zt as Clock } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as STATUS_META, o as fleetObjects } from "./fleet-DZTK5mNe.mjs";
import { n as useZio } from "./ZioContext-Cw_R09Nu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tracking-BOoXGPsB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FleetExplorerPanel({ vehicles, selectedVehicleId, onSelectVehicle, checkedVehicleIds, onToggleCheckVehicle, onToggleCheckGroup, onToggleCheckAll, onOpenDashcam, onOpenSettings, onOpenTelemetry, onTraceVehicle, className }) {
	const [activeTab, setActiveTab] = (0, import_react.useState)("object");
	const [query, setQuery] = (0, import_react.useState)("");
	const [activeStatus, setActiveStatus] = (0, import_react.useState)("all");
	const [collapsedGroups, setCollapsedGroups] = (0, import_react.useState)({
		Company: false,
		Indonesia: false,
		Thailand: false,
		Valsad: false,
		Itriangle: false
	});
	const [sortOrder, setSortOrder] = (0, import_react.useState)("name");
	const counts = (0, import_react.useMemo)(() => {
		return {
			running: 26,
			idle: 2,
			stopped: 15,
			inactive: 65,
			nodata: 14,
			total: 122
		};
	}, []);
	const filteredVehicles = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return vehicles.filter((v) => {
			const matchesStatus = activeStatus === "all" || v.status === activeStatus;
			const matchesQuery = q === "" || v.name.toLowerCase().includes(q) || v.branch.toLowerCase().includes(q) || v.imei.toLowerCase().includes(q) || v.driver && v.driver.toLowerCase().includes(q);
			return matchesStatus && matchesQuery;
		}).sort((a, b) => {
			if (sortOrder === "speed") return b.speed - a.speed;
			if (sortOrder === "battery") return (b.battery ?? 0) - (a.battery ?? 0);
			return a.name.localeCompare(b.name);
		});
	}, [
		vehicles,
		activeStatus,
		query,
		sortOrder
	]);
	const branchGroups = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const v of filteredVehicles) {
			const list = map.get(v.branch) ?? [];
			list.push(v);
			map.set(v.branch, list);
		}
		return [...map.entries()];
	}, [filteredVehicles]);
	const allChecked = vehicles.length > 0 && vehicles.every((v) => checkedVehicleIds.includes(v.id));
	const toggleCollapseAll = () => {
		const allCollapsed = Object.values(collapsedGroups).every(Boolean);
		const next = {};
		for (const key of Object.keys(collapsedGroups)) next[key] = !allCollapsed;
		setCollapsedGroups(next);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-xl overflow-hidden transition-all duration-200", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-[45px] items-center justify-between bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 px-2.5 text-white select-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActiveTab("object"),
							className: cn("flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer", activeTab === "object" ? "bg-white/20 text-white shadow-inner" : "text-white/80 hover:bg-white/10 hover:text-white"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "h-3.5 w-3.5 fill-current" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Object" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3 opacity-80" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							title: "Drivers",
							onClick: () => setActiveTab("driver"),
							className: cn("p-1.5 rounded-md transition-colors cursor-pointer", activeTab === "driver" ? "bg-white/20" : "hover:bg-white/10 text-white/80"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							title: "Geofences",
							onClick: () => setActiveTab("geofence"),
							className: cn("p-1.5 rounded-md transition-colors cursor-pointer", activeTab === "geofence" ? "bg-white/20" : "hover:bg-white/10 text-white/80"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-3.5 w-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							title: "Routes",
							onClick: () => setActiveTab("route"),
							className: cn("p-1.5 rounded-md transition-colors cursor-pointer", activeTab === "route" ? "bg-white/20" : "hover:bg-white/10 text-white/80"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							title: "Landmarks",
							onClick: () => setActiveTab("landmark"),
							className: cn("p-1.5 rounded-md transition-colors cursor-pointer", activeTab === "landmark" ? "bg-white/20" : "hover:bg-white/10 text-white/80"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							title: "Live Cameras",
							onClick: () => setActiveTab("camera"),
							className: cn("p-1.5 rounded-md transition-colors cursor-pointer", activeTab === "camera" ? "bg-white/20" : "hover:bg-white/10 text-white/80"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-3.5 w-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							title: "Live Alerts",
							onClick: () => setActiveTab("alerts"),
							className: cn("p-1.5 rounded-md transition-colors cursor-pointer", activeTab === "alerts" ? "bg-white/20" : "hover:bg-white/10 text-white/80"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-3.5 w-3.5" })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					title: "Object Columns & Display Settings",
					onClick: onOpenSettings,
					className: "p-1.5 rounded-md text-white/90 hover:text-white hover:bg-white/15 transition-colors cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-6 gap-0.5 border-b border-border bg-surface-muted/30 p-1 text-center select-none",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setActiveStatus(activeStatus === "running" ? "all" : "running"),
						className: cn("flex flex-col items-center justify-center py-1 px-0.5 rounded-md transition-all cursor-pointer border-t-2", activeStatus === "running" ? "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold" : "bg-emerald-500/5 border-emerald-400/30 text-muted-foreground hover:bg-emerald-500/10"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-extrabold tabular-nums leading-none",
							children: counts.running
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] font-medium leading-tight mt-0.5 opacity-80",
							children: "Running"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setActiveStatus(activeStatus === "idle" ? "all" : "idle"),
						className: cn("flex flex-col items-center justify-center py-1 px-0.5 rounded-md transition-all cursor-pointer border-t-2", activeStatus === "idle" ? "bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-bold" : "bg-amber-500/5 border-amber-400/30 text-muted-foreground hover:bg-amber-500/10"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-extrabold tabular-nums leading-none",
							children: counts.idle
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] font-medium leading-tight mt-0.5 opacity-80",
							children: "Idle"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setActiveStatus(activeStatus === "stopped" ? "all" : "stopped"),
						className: cn("flex flex-col items-center justify-center py-1 px-0.5 rounded-md transition-all cursor-pointer border-t-2", activeStatus === "stopped" ? "bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400 font-bold" : "bg-rose-500/5 border-rose-400/30 text-muted-foreground hover:bg-rose-500/10"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-extrabold tabular-nums leading-none",
							children: counts.stopped
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] font-medium leading-tight mt-0.5 opacity-80",
							children: "Stopped"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setActiveStatus(activeStatus === "inactive" ? "all" : "inactive"),
						className: cn("flex flex-col items-center justify-center py-1 px-0.5 rounded-md transition-all cursor-pointer border-t-2", activeStatus === "inactive" ? "bg-indigo-500/15 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold" : "bg-indigo-500/5 border-indigo-400/30 text-muted-foreground hover:bg-indigo-500/10"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-extrabold tabular-nums leading-none",
							children: counts.inactive
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] font-medium leading-tight mt-0.5 opacity-80",
							children: "Inactive"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setActiveStatus(activeStatus === "nodata" ? "all" : "nodata"),
						className: cn("flex flex-col items-center justify-center py-1 px-0.5 rounded-md transition-all cursor-pointer border-t-2", activeStatus === "nodata" ? "bg-slate-500/15 border-slate-500 text-slate-700 dark:text-slate-300 font-bold" : "bg-slate-500/5 border-slate-400/30 text-muted-foreground hover:bg-slate-500/10"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-extrabold tabular-nums leading-none",
							children: counts.nodata
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] font-medium leading-tight mt-0.5 opacity-80",
							children: "NoData"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setActiveStatus("all"),
						className: cn("flex flex-col items-center justify-center py-1 px-0.5 rounded-md transition-all cursor-pointer border-t-2", activeStatus === "all" ? "bg-blue-500/15 border-blue-500 text-blue-600 dark:text-blue-400 font-bold" : "bg-muted/40 border-border text-muted-foreground hover:bg-muted"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-extrabold tabular-nums leading-none",
							children: counts.total
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] font-medium leading-tight mt-0.5 opacity-80",
							children: "Total"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 border-b border-border p-2 bg-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: allChecked,
						onChange: onToggleCheckAll,
						title: "Select / Deselect all vehicles on map",
						className: "h-3.5 w-3.5 rounded border-input text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 flex items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "Search by IMEI, VIN, Registration, Object Model, SIM Number, etc.",
							className: "h-8 w-full rounded-md border border-input bg-background pl-2.5 pr-7 text-xs placeholder:text-muted-foreground focus:outline-none focus:border-blue-500 transition-colors"
						}), query ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setQuery(""),
							className: "absolute right-1.5 p-0.5 rounded-md text-muted-foreground hover:text-foreground cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute right-2.5 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 shrink-0 text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							title: "Toggle heading orientation",
							className: "p-1.5 rounded-md hover:bg-muted hover:text-foreground transition-colors cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "h-3.5 w-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							title: "Sort objects",
							onClick: () => {
								setSortOrder((curr) => curr === "name" ? "speed" : curr === "speed" ? "battery" : "name");
							},
							className: "p-1.5 rounded-md hover:bg-muted hover:text-foreground transition-colors cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold",
								children: "⇅"
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-2.5 py-1 bg-surface-muted/40 border-b border-border/60 text-[10px] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: toggleCollapseAll,
					className: "inline-flex items-center gap-1 hover:text-foreground cursor-pointer font-medium",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✕ Collapse" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "tabular-nums",
					children: [
						"Showing ",
						filteredVehicles.length,
						" of ",
						vehicles.length,
						" objects"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[350px] divide-y divide-border/40 text-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-2 py-1.5 bg-surface-muted/60 text-xs font-semibold text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: allChecked,
								onChange: onToggleCheckAll,
								className: "h-3.5 w-3.5 rounded border-input text-blue-600 focus:ring-blue-500 cursor-pointer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Company" })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-mono text-muted-foreground font-normal",
						children: "[12]"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border/30",
					children: branchGroups.map(([branch, branchVehicles]) => {
						const isGroupCollapsed = collapsedGroups[branch] ?? false;
						const groupIds = branchVehicles.map((v) => v.id);
						const isGroupAllChecked = groupIds.length > 0 && groupIds.every((id) => checkedVehicleIds.includes(id));
						const isGroupSomeChecked = groupIds.some((id) => checkedVehicleIds.includes(id)) && !isGroupAllChecked;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-3 py-1.5 bg-surface-muted/30 hover:bg-surface-muted/70 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: isGroupAllChecked,
									ref: (el) => {
										if (el) el.indeterminate = isGroupSomeChecked;
									},
									onChange: () => onToggleCheckGroup(groupIds),
									className: "h-3.5 w-3.5 rounded border-input text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setCollapsedGroups((prev) => ({
										...prev,
										[branch]: !prev[branch]
									})),
									className: "flex items-center gap-1 text-left text-xs font-medium text-foreground hover:text-blue-600 cursor-pointer flex-1 truncate",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-3 w-3 text-muted-foreground transition-transform duration-150", isGroupCollapsed && "-rotate-90") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: branch
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] font-mono text-muted-foreground shrink-0",
								children: [
									"[",
									branchVehicles.length,
									"]"
								]
							})]
						}), !isGroupCollapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-border/20",
							children: branchVehicles.map((v) => {
								const isSelected = v.id === selectedVehicleId;
								const isChecked = checkedVehicleIds.includes(v.id);
								const batteryVal = v.battery;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: () => onSelectVehicle(v.id),
									className: cn("flex items-center justify-between gap-1.5 px-2.5 py-1.5 pl-6 text-xs transition-colors cursor-pointer select-none", isSelected ? "bg-blue-500/10 border-l-2 border-blue-600 font-medium" : "hover:bg-muted/50"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 min-w-0 flex-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													checked: isChecked,
													onChange: (e) => {
														e.stopPropagation();
														onToggleCheckVehicle(v.id);
													},
													className: "h-3.5 w-3.5 rounded border-input text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "h-2 w-2 rounded-full shrink-0 shadow-2xs",
													style: { background: STATUS_META[v.status].color }
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: cn("truncate text-xs", isSelected ? "font-bold text-blue-600 dark:text-blue-400" : "text-foreground"),
													children: v.name
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 shrink-0 text-[11px]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono tabular-nums text-muted-foreground w-6 text-right",
													children: v.speed
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													title: "Ignition: " + (v.status === "running" || v.status === "idle" ? "ON" : "OFF"),
													className: cn("text-[10px]", v.status === "running" || v.status === "idle" ? "text-emerald-500" : "text-rose-500 opacity-60"),
													children: "🔑"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													title: "GPS Locked",
													className: cn("text-[10px]", v.status !== "nodata" ? "text-emerald-500" : "text-slate-400"),
													children: "📡"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													title: "Status: " + STATUS_META[v.status].label,
													className: cn("text-[10px]", v.status === "running" ? "text-emerald-500" : v.status === "idle" ? "text-amber-500" : "text-rose-500"),
													children: v.status === "running" ? "🟢" : v.status === "idle" ? "🟡" : "🔴"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: cn("inline-flex items-center px-1 py-0.2 rounded font-mono text-[10px] font-semibold", batteryVal !== null && batteryVal > 50 ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : batteryVal !== null && batteryVal > 20 ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20" : batteryVal !== null ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20" : "bg-muted text-muted-foreground border border-border"),
													children: batteryVal !== null ? batteryVal + "%" : "NA"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1 shrink-0 text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													title: "Live Video Stream",
													onClick: (e) => {
														e.stopPropagation();
														onOpenDashcam(v);
													},
													className: "p-1 rounded hover:bg-muted hover:text-blue-600 transition-colors cursor-pointer",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-3.5 w-3.5" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													title: "Capture Snapshot",
													onClick: (e) => {
														e.stopPropagation();
														onOpenDashcam(v);
													},
													className: "p-1 rounded hover:bg-muted hover:text-blue-600 transition-colors cursor-pointer",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-3.5 w-3.5" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													title: "Center & Trace on Map",
													onClick: (e) => {
														e.stopPropagation();
														onTraceVehicle(v);
													},
													className: "p-1 rounded hover:bg-muted hover:text-blue-600 transition-colors cursor-pointer",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													title: "View Telemetry & Sensor Diagnostics",
													onClick: (e) => {
														e.stopPropagation();
														onOpenTelemetry(v);
													},
													className: "p-1 rounded hover:bg-muted hover:text-blue-600 transition-colors cursor-pointer",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5" })
												})
											]
										})
									]
								}, v.id);
							})
						})] }, branch);
					})
				})] })
			})
		]
	});
}
function LiveTrackingMap({ selectedVehicle, checkedVehicles, onOpenPlayback, isTelemetryDrawerOpen, onToggleTelemetryDrawer, className }) {
	const [mapStyle, setMapStyle] = (0, import_react.useState)("terrain");
	const [showGeofences, setShowGeofences] = (0, import_react.useState)(true);
	const [showTraffic, setShowTraffic] = (0, import_react.useState)(false);
	const [showPOIs, setShowPOIs] = (0, import_react.useState)(true);
	const [zoomLevel, setZoomLevel] = (0, import_react.useState)(12);
	const [isFullscreen, setIsFullscreen] = (0, import_react.useState)(false);
	const mapContainerRef = (0, import_react.useRef)(null);
	const [truckPos, setTruckPos] = (0, import_react.useState)({
		x: 265,
		y: 310,
		heading: 45
	});
	const toggleFullscreen = () => {
		if (!document.fullscreenElement) {
			mapContainerRef.current?.requestFullscreen().catch(() => {});
			setIsFullscreen(true);
		} else {
			document.exitFullscreen().catch(() => {});
			setIsFullscreen(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: mapContainerRef,
		className: cn("relative flex-1 h-full w-full overflow-hidden rounded-xl border border-border bg-[#e8ece9] dark:bg-[#1a2332] shadow-inner select-none", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				className: "absolute inset-0 h-full w-full",
				viewBox: "0 0 1000 650",
				preserveAspectRatio: "xMidYMid slice",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
							id: "oceanGrad",
							x1: "0%",
							y1: "0%",
							x2: "100%",
							y2: "100%",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: mapStyle === "dark" ? "#0f172a" : "#cae4f8"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: mapStyle === "dark" ? "#090d16" : "#b2d8f5"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
							id: "landGrad",
							x1: "0%",
							y1: "0%",
							x2: "100%",
							y2: "100%",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: mapStyle === "dark" ? "#1e293b" : "#f1ebd9"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: mapStyle === "dark" ? "#151e2e" : "#e8e1cd"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
							id: "forestGrad",
							x1: "0%",
							y1: "0%",
							x2: "0%",
							y2: "100%",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: mapStyle === "dark" ? "#143a29" : "#c6e0b4"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: mapStyle === "dark" ? "#0e291c" : "#b0d49b"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("filter", {
							id: "shadow",
							x: "-20%",
							y: "-20%",
							width: "140%",
							height: "140%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("feDropShadow", {
								dx: "1",
								dy: "2",
								stdDeviation: "2",
								floodOpacity: "0.3"
							})
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						width: "100%",
						height: "100%",
						fill: "url(#oceanGrad)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						id: "landmass",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M 180,0 L 220,120 Q 240,220 230,320 L 210,480 Q 240,560 350,600 Q 420,620 480,650 L 900,650 Q 880,500 860,420 Q 820,380 780,340 Q 740,280 750,180 Q 720,80 640,0 Z",
								fill: "url(#landGrad)",
								stroke: mapStyle === "dark" ? "#334155" : "#d1c7b7",
								strokeWidth: "1.5"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M 520,10 Q 560,40 550,70 Q 530,90 550,140 Q 580,180 570,220 Q 530,240 520,280 Q 490,260 500,210 Q 480,180 500,120 Q 490,60 520,10 Z",
								fill: "url(#forestGrad)",
								opacity: "0.85"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M 500,320 Q 540,360 530,420 Q 560,480 540,560 Q 500,620 460,650 Q 420,620 440,560 Q 460,480 450,420 Q 440,360 500,320 Z",
								fill: "url(#forestGrad)",
								opacity: "0.85"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M 700,60 Q 715,50 720,70 Q 715,85 700,80 Q 690,70 700,60 Z",
								fill: "url(#forestGrad)",
								stroke: "#b0d49b"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: "730",
								y: "70",
								fontSize: "9",
								fill: mapStyle === "dark" ? "#94a3b8" : "#475569",
								fontWeight: "500",
								children: "Pulau Labengke"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M 680,120 Q 695,110 700,130 Q 690,145 675,140 Z",
								fill: "url(#forestGrad)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: "710",
								y: "130",
								fontSize: "9",
								fill: mapStyle === "dark" ? "#94a3b8" : "#475569",
								fontWeight: "500",
								children: "Pulau Lambasii"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M 650,180 Q 665,170 670,190 Q 660,200 645,195 Z",
								fill: "url(#forestGrad)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: "680",
								y: "190",
								fontSize: "9",
								fill: mapStyle === "dark" ? "#94a3b8" : "#475569",
								fontWeight: "500",
								children: "Pulau Keramat"
							})
						]
					}),
					showGeofences && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						id: "geofences",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
								points: "180,310 260,310 260,380 180,380",
								fill: "#22c55e",
								fillOpacity: "0.25",
								stroke: "#16a34a",
								strokeWidth: "1.5",
								strokeDasharray: "4 2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: "190",
								y: "345",
								fontSize: "10",
								fontWeight: "bold",
								fill: "#15803d",
								className: "select-none",
								children: "001,0221"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
								points: "270,260 300,260 300,290 270,290",
								fill: "#22c55e",
								fillOpacity: "0.5",
								stroke: "#16a34a",
								strokeWidth: "1"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						id: "route-polyline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M 265,310 Q 280,285 300,285 L 340,300 Q 370,290 400,320 L 450,310 Q 480,280 510,290 L 580,220 Q 610,210 660,240 L 720,260 Q 750,250 780,270 L 640,340 Q 580,360 520,320",
							fill: "none",
							stroke: "#0284c7",
							strokeWidth: "4",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							filter: "url(#shadow)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M 265,310 Q 280,285 300,285 L 340,300 Q 370,290 400,320 L 450,310 Q 480,280 510,290 L 580,220 Q 610,210 660,240 L 720,260 Q 750,250 780,270 L 640,340 Q 580,360 520,320",
							fill: "none",
							stroke: "#0ea5e9",
							strokeWidth: "2.5",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						id: "cities",
						className: "select-none font-semibold text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: "210",
								y: "325",
								fill: "#334155",
								fontSize: "11",
								fontWeight: "bold",
								children: "Kolaka"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: "310",
								y: "285",
								fill: "#334155",
								fontSize: "10",
								fontWeight: "bold",
								children: "Tiraweta"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: "560",
								y: "210",
								fill: "#0284c7",
								fontSize: "11",
								fontWeight: "bold",
								children: "Unaaha"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: "760",
								y: "260",
								fill: "#0284c7",
								fontSize: "12",
								fontWeight: "extrabold",
								children: "Kendari"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: "650",
								y: "470",
								fill: "#475569",
								fontSize: "10",
								children: "Andoolo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: "570",
								y: "60",
								fill: "#475569",
								fontSize: "10",
								children: "Wangoudu"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						id: "active-vehicle",
						transform: "translate(" + truckPos.x + ", " + truckPos.y + ")",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								r: "18",
								fill: "#22c55e",
								opacity: "0.25",
								className: "animate-ping"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								r: "10",
								fill: "#16a34a",
								opacity: "0.3"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
								transform: "rotate(" + truckPos.heading + ")",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										x: "-8",
										y: "-14",
										width: "16",
										height: "28",
										rx: "3",
										fill: "#15803d",
										stroke: "#ffffff",
										strokeWidth: "1.5"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										x: "-6",
										y: "-10",
										width: "12",
										height: "5",
										rx: "1",
										fill: "#86efac"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										x: "-7",
										y: "-2",
										width: "14",
										height: "14",
										rx: "1.5",
										fill: "#166534"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										x: "-9",
										y: "-12",
										width: "2",
										height: "5",
										rx: "0.5",
										fill: "#18181b"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										x: "7",
										y: "-12",
										width: "2",
										height: "5",
										rx: "0.5",
										fill: "#18181b"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										x: "-9",
										y: "5",
										width: "2",
										height: "5",
										rx: "0.5",
										fill: "#18181b"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										x: "7",
										y: "5",
										width: "2",
										height: "5",
										rx: "0.5",
										fill: "#18181b"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
								transform: "translate(-35, 18)",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									width: "70",
									height: "16",
									rx: "3",
									fill: "#16a34a",
									stroke: "#ffffff",
									strokeWidth: "1",
									filter: "url(#shadow)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: "35",
									y: "11.5",
									textAnchor: "middle",
									fill: "#ffffff",
									fontSize: "9",
									fontWeight: "bold",
									fontFamily: "ui-monospace, monospace",
									children: "1001 - 12 km/h"
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-3 left-1/2 -translate-x-1/2 z-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onOpenPlayback,
					className: "inline-flex items-center gap-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 font-bold text-xs shadow-lg transition-all transform hover:scale-105 cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3.5 w-3.5 fill-current" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Playback" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute right-3 top-3 z-20 flex flex-col gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						title: isTelemetryDrawerOpen ? "Collapse Telemetry Panel" : "Expand Telemetry Panel",
						onClick: onToggleTelemetryDrawer,
						className: "flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/95 backdrop-blur-md text-foreground shadow-md hover:bg-muted transition-colors cursor-pointer font-bold",
						children: isTelemetryDrawerOpen ? ">>" : "<<"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col rounded-lg border border-border bg-card/95 backdrop-blur-md shadow-md divide-y divide-border/60 overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								title: "Search on Map",
								className: "flex h-7 w-8 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								title: "Change Map Layer",
								onClick: () => setMapStyle((s) => s === "terrain" ? "satellite" : s === "satellite" ? "streets" : "terrain"),
								className: "flex h-7 w-8 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								title: "Toggle Geofences",
								onClick: () => setShowGeofences((v) => !v),
								className: cn("flex h-7 w-8 items-center justify-center transition-colors cursor-pointer", showGeofences ? "text-blue-600 font-bold bg-blue-500/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								title: "Toggle Landmarks & POIs",
								onClick: () => setShowPOIs((v) => !v),
								className: cn("flex h-7 w-8 items-center justify-center transition-colors cursor-pointer", showPOIs ? "text-blue-600 font-bold bg-blue-500/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								title: "Toggle Live Traffic",
								onClick: () => setShowTraffic((v) => !v),
								className: cn("flex h-7 w-8 items-center justify-center transition-colors cursor-pointer", showTraffic ? "text-rose-600 font-bold bg-rose-500/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrafficCone, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								title: "Toggle Fullscreen",
								onClick: toggleFullscreen,
								className: "flex h-7 w-8 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer",
								children: isFullscreen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize2, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "h-3.5 w-3.5" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col rounded-lg border border-border bg-card/95 backdrop-blur-md shadow-md divide-y divide-border/60 overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							title: "Zoom In",
							onClick: () => setZoomLevel((z) => Math.min(18, z + 1)),
							className: "flex h-7 w-8 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							title: "Zoom Out",
							onClick: () => setZoomLevel((z) => Math.max(4, z - 1)),
							className: "flex h-7 w-8 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3.5 w-3.5" })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-3 right-3 z-10 flex flex-col items-center select-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 bg-card/85 backdrop-blur-xs px-2 py-0.5 rounded border border-border/80 text-[10px] font-mono text-muted-foreground shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "10 km" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1.5 w-12 border-b-2 border-l-2 border-r-2 border-foreground" })]
				})
			})
		]
	});
}
function VehicleTelemetryDrawer({ vehicle, onClose, onSelectVehicle, allVehicles, className }) {
	const [activeTab, setActiveTab] = (0, import_react.useState)("fuel");
	const [objectInfoOpen, setObjectInfoOpen] = (0, import_react.useState)(true);
	const fuelVal = vehicle.fuel ?? 46;
	const tankCap = vehicle.tankCapacity ?? 300;
	const needleAngle = -90 + Math.min(100, Math.max(0, Math.round(fuelVal / tankCap * 100))) / 100 * 180;
	const odoDigits = String(vehicle.odometer ?? 66460).padStart(7, "0").split("");
	const currentIndex = allVehicles.findIndex((v) => v.id === vehicle.id);
	const handlePrev = () => {
		if (currentIndex > 0 && allVehicles[currentIndex - 1]) onSelectVehicle(allVehicles[currentIndex - 1].id);
	};
	const handleNext = () => {
		if (currentIndex < allVehicles.length - 1 && allVehicles[currentIndex + 1]) onSelectVehicle(allVehicles[currentIndex + 1].id);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-2xl overflow-hidden transition-all duration-200 w-full sm:w-[360px] text-xs", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-[56px] items-center justify-between border-b border-border bg-surface-muted/60 px-3 select-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-1.5 min-w-0 flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-semibold text-[16px] text-foreground truncate",
					children: [
						"Fuel -",
						" ",
						vehicle.name.replace(/^(Fuel - |BUS - |RPM - |SOC - |Temperature - )/, "")
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1 shrink-0 text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						title: "Previous Vehicle",
						onClick: handlePrev,
						disabled: currentIndex <= 0,
						className: "p-1.5 rounded-md hover:bg-muted hover:text-foreground disabled:opacity-30 cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						title: "Next Vehicle",
						onClick: handleNext,
						disabled: currentIndex >= allVehicles.length - 1,
						className: "p-1.5 rounded-md hover:bg-muted hover:text-foreground disabled:opacity-30 cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						title: "Share live vehicle tracking link",
						className: "p-1.5 rounded-md hover:bg-muted hover:text-foreground cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-3.5 w-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						title: "Close panel",
						onClick: onClose,
						className: "p-1.5 rounded-md hover:bg-muted hover:text-foreground cursor-pointer ml-0.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 overflow-y-auto p-3 space-y-3 max-h-[calc(100vh-220px)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border border-border bg-surface-muted/30 p-3 space-y-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative flex items-center justify-center h-20 w-36 bg-gradient-to-tr from-muted/50 to-transparent rounded-lg p-1 overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=400&q=80",
									alt: "Commercial Fleet Vehicle",
									className: "h-full w-full object-contain filter drop-shadow-md transform -scale-x-100"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold text-[10px] uppercase shadow-2xs",
									style: {
										background: STATUS_META[vehicle.status].tint,
										color: STATUS_META[vehicle.status].color
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "h-1.5 w-1.5 rounded-full animate-pulse",
											style: { background: STATUS_META[vehicle.status].color }
										}),
										STATUS_META[vehicle.status].label,
										" ",
										vehicle.duration ?? "11h:15"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground block",
									children: "Current Trip"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold text-foreground tabular-nums",
									children: [vehicle.currentTrip ?? "288.44", " km"]
								})] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-t border-border/60 pt-2 text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground block mb-0.5",
								children: "Odometer"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-0.5 bg-black/90 dark:bg-black p-0.5 rounded border border-slate-700 shadow-inner",
								children: odoDigits.map((digit, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-flex items-center justify-center h-4 w-3 bg-zinc-900 text-white font-mono text-[10px] font-bold rounded-xs border-r border-zinc-800 last:border-0",
									children: digit
								}, i))
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground block",
									children: "Work Hour"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-bold text-foreground tabular-nums text-xs",
									children: "2578 hrs"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-t border-border/60 pt-2 text-[11px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 truncate",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "truncate",
									children: [
										"Driver:",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground font-medium",
											children: vehicle.driver || "--"
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline",
								children: "More Details >"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex border-b border-border text-xs font-semibold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveTab("fuel"),
							className: cn("flex-1 pb-1.5 border-b-2 transition-colors cursor-pointer text-center", activeTab === "fuel" ? "border-blue-600 text-blue-600 dark:text-blue-400" : "border-transparent text-muted-foreground hover:text-foreground"),
							children: "# Fuel"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveTab("sensors"),
							className: cn("flex-1 pb-1.5 border-b-2 transition-colors cursor-pointer text-center", activeTab === "sensors" ? "border-blue-600 text-blue-600 dark:text-blue-400" : "border-transparent text-muted-foreground hover:text-foreground"),
							children: "Sensors & OBD"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveTab("alerts"),
							className: cn("flex-1 pb-1.5 border-b-2 transition-colors cursor-pointer text-center", activeTab === "alerts" ? "border-blue-600 text-blue-600 dark:text-blue-400" : "border-transparent text-muted-foreground hover:text-foreground"),
							children: "Live Alerts"
						})
					]
				}),
				activeTab === "fuel" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 animate-in fade-in duration-150",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col items-center justify-center p-2 rounded-md border border-border bg-surface-muted/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative h-28 w-44 flex items-center justify-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									className: "h-full w-full overflow-visible",
									viewBox: "0 0 160 90",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											d: "M 15 80 A 65 65 0 0 1 145 80",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "12",
											className: "text-muted/40",
											strokeLinecap: "round"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											d: "M 15 80 A 65 65 0 0 1 45 35",
											fill: "none",
											stroke: "#ef4444",
											strokeWidth: "12",
											strokeLinecap: "round"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											d: "M 45 35 A 65 65 0 0 1 100 16",
											fill: "none",
											stroke: "#f59e0b",
											strokeWidth: "12"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											d: "M 100 16 A 65 65 0 0 1 145 80",
											fill: "none",
											stroke: "#10b981",
											strokeWidth: "12",
											strokeLinecap: "round"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
											transform: "translate(80, 80) rotate(" + needleAngle + ")",
											className: "transition-transform duration-500 ease-out",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
												points: "-3,0 3,0 0,-60",
												fill: "#2563eb"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
												cx: "0",
												cy: "0",
												r: "5",
												fill: "#1e293b"
											})]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute bottom-0 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-sm font-extrabold text-foreground tabular-nums",
										children: [
											fuelVal,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-normal text-muted-foreground",
												children: "liter"
											})
										]
									})
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-2 text-[11px] rounded-md border border-border p-2.5 bg-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground block",
									children: "Tanks"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-foreground",
									children: "1"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground block",
									children: "Refill"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-foreground",
									children: "NA 0"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground block",
									children: "Drain"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-foreground",
									children: "NA 0"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-3 border-t border-border/40 pt-1.5 flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Tank Capacity"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-foreground",
										children: [tankCap, ".0 liter"]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 rounded-md border border-border p-2.5 bg-card text-[11px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Consumption"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium text-foreground",
										children: [
											"Sensor ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "5.80 L" }),
											" \xA0|\xA0 CAN",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "0.00 L" })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Carbon Emission"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium text-foreground",
										children: [
											"Sensor ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "0.00" }),
											" \xA0|\xA0 CAN",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "NA" })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground flex items-center gap-1",
										children: [
											"Waste",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3 w-3 text-muted-foreground/60" })
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium text-foreground",
										children: [
											"Pre-defined ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "0 L" }),
											" \xA0|\xA0 CAN",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "0.00 L" })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground text-right italic",
									children: "(Due to 0 hrs idling)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-t border-border/40 pt-1.5 flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Remaining Range"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-blue-600 dark:text-blue-400",
										children: "688 km"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-[10px] text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Updated" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: "27-08-2026 11:22 AM"
									})]
								})
							]
						})
					]
				}),
				activeTab === "sensors" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 text-[11px] animate-in fade-in duration-150",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border p-2.5 bg-card space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-foreground text-xs block mb-1",
								children: "Cold Chain Sensors"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Sensor 1 (Front)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-bold text-emerald-600 dark:text-emerald-400",
									children: "-18.4 °C"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Sensor 2 (Rear)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-bold text-emerald-600 dark:text-emerald-400",
									children: "-19.1 °C"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Door Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-foreground",
									children: "Closed"
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border p-2.5 bg-card space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-foreground text-xs block mb-1",
								children: "Engine & Electrical"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Engine RPM"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-bold text-foreground",
									children: "1,450 RPM"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Battery Voltage"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-bold text-foreground",
									children: "24.2 V"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Coolant Temp"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-bold text-foreground",
									children: "84 °C"
								})]
							})
						]
					})]
				}),
				activeTab === "alerts" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2 text-[11px] animate-in fade-in duration-150",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border p-2.5 bg-card space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-amber-600 font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Geofence Entry: Kendari Port" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground block",
							children: "Today at 10:45 AM · Speed: 12 km/h"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border border-border bg-card overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setObjectInfoOpen((prev) => !prev),
						className: "flex items-center justify-between w-full p-2.5 bg-surface-muted/40 font-bold text-xs text-foreground cursor-pointer hover:bg-surface-muted/80 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Object Information" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-150", !objectInfoOpen && "-rotate-90") })]
					}), objectInfoOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-2.5 space-y-1.5 text-[11px] border-t border-border/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Purchase Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: "--"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Purchase Amount"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: "0"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Insurance Expiry"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: "15-12-2026"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Fitness Expiry"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: "20-11-2026"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Pollution Expiry"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: "10-09-2026"
								})]
							})
						]
					})]
				})
			]
		})]
	});
}
function RoutePlaybackBar({ vehicle, onClose, className }) {
	const [isPlaying, setIsPlaying] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)(35);
	const [speedMultiplier, setSpeedMultiplier] = (0, import_react.useState)(1);
	(0, import_react.useEffect)(() => {
		let timer;
		if (isPlaying) timer = setInterval(() => {
			setProgress((prev) => prev >= 100 ? 0 : prev + 1 * speedMultiplier);
		}, 300);
		return () => clearInterval(timer);
	}, [isPlaying, speedMultiplier]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-2xl p-3 text-xs animate-in slide-in-from-bottom-4 duration-200 select-none", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border pb-2 mb-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "font-bold text-xs text-foreground",
							children: ["Route Playback · ", vehicle.name]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground font-mono",
							children: "Date: 27-08-2026 (08:00 AM → 11:30 AM)"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center bg-surface-muted rounded-md p-0.5 border border-border text-[10px] font-bold",
						children: [
							1,
							2,
							5,
							10
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSpeedMultiplier(s),
							className: cn("px-2 py-0.5 rounded transition-colors cursor-pointer", speedMultiplier === s ? "bg-blue-600 text-white shadow-xs" : "text-muted-foreground hover:text-foreground"),
							children: [s, "x"]
						}, s))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5 mb-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-[10px] text-muted-foreground font-mono",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "08:15 AM · Kolaka Depot (0 km)" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-bold text-blue-600 dark:text-blue-400",
							children: [
								"Speed: ",
								Math.round(12 + progress % 40),
								" km/h · Odo: 66,460 km"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "11:22 AM · Kendari Port (288.44 km)" })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative flex items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: "0",
						max: "100",
						value: progress,
						onChange: (e) => setProgress(Number(e.target.value)),
						className: "w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-600"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setProgress(0),
							title: "Restart playback",
							className: "p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setProgress((p) => Math.max(0, p - 10)),
							title: "Previous 10 mins",
							className: "p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setIsPlaying((p) => !p),
							className: "flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors cursor-pointer",
							children: isPlaying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "h-4 w-4 fill-current" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4 fill-current ml-0.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setProgress((p) => Math.min(100, p + 10)),
							title: "Next 10 mins",
							className: "p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-[11px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 bg-surface-muted px-2 py-0.5 rounded border border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono",
							children: [
								"Trip: ",
								(progress / 100 * 3.2).toFixed(1),
								" hrs"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 bg-surface-muted px-2 py-0.5 rounded border border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3 text-blue-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono",
							children: [(progress / 100 * 288.44).toFixed(1), " km"]
						})]
					})]
				})]
			})
		]
	});
}
function LiveDashcamModal({ vehicle, onClose }) {
	const [activeChannel, setActiveChannel] = (0, import_react.useState)(1);
	const [isRecording, setIsRecording] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Close Dashcam",
			onClick: onClose,
			className: "fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 w-full max-w-3xl rounded-lg border border-border bg-surface text-foreground shadow-xl overflow-hidden text-xs animate-in fade-in zoom-in-95 duration-150 select-none",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex h-[56px] items-center justify-between border-b border-border px-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shrink-0 select-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-[16px] font-semibold tracking-tight",
							children: ["Live Dashcam · ", vehicle.name]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Close Dashcam",
						onClick: onClose,
						className: "rounded-md p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative aspect-video bg-black flex items-center justify-center overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: activeChannel === 1 ? "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80" : activeChannel === 2 ? "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80" : "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
							alt: "Live Dashcam Stream",
							className: "h-full w-full object-cover opacity-90"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute top-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-mono text-white space-y-0.5 shadow-md",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									"CAM ",
									activeChannel,
									":",
									" ",
									activeChannel === 1 ? "Road Forward" : activeChannel === 2 ? "Driver Cabin" : "Cargo Rear"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									"SPEED: ",
									vehicle.speed,
									" km/h · GPS: 3.9745° S, 122.5872° E"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "TIME: 27-08-2026 11:26:40 AM UTC+8" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute bottom-3 left-3 flex gap-1 bg-black/60 backdrop-blur-xs p-1 rounded-md border border-white/20",
							children: [
								1,
								2,
								3
							].map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setActiveChannel(ch),
								className: cn("px-2.5 py-1 rounded-md font-bold text-[11px] transition-colors cursor-pointer", activeChannel === ch ? "bg-blue-600 text-white" : "text-white/80 hover:bg-white/10"),
								children: [
									"CH ",
									ch,
									" (",
									ch === 1 ? "Road" : ch === 2 ? "Cabin" : "Cargo",
									")"
								]
							}, ch))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute bottom-3 right-3 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setIsRecording((r) => !r),
								className: cn("inline-flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-bold shadow-md transition-colors cursor-pointer", isRecording ? "bg-rose-600 text-white animate-pulse" : "bg-black/60 text-white hover:bg-black/80"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 rounded-full bg-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isRecording ? "Recording..." : "Record" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								title: "Snapshot",
								className: "p-1.5 rounded-md bg-black/60 hover:bg-black/80 text-white shadow-md cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4" })
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-border bg-surface-muted/40 px-4 py-2.5 text-[11px] text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Vehicle: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: vehicle.name }),
						" · Driver:",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: vehicle.driver || "Unassigned" })
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-emerald-600 font-semibold",
						children: "Stream Latency: 180ms"
					})]
				})
			]
		})]
	});
}
var TRACKING_COLUMNS = [
	{
		id: "checkbox",
		label: "Map Selection Checkbox",
		default: true
	},
	{
		id: "status",
		label: "Status Dot & Motion",
		default: true
	},
	{
		id: "name",
		label: "Object Name / Registration",
		default: true
	},
	{
		id: "speed",
		label: "Current Speed (km/h)",
		default: true
	},
	{
		id: "ignition",
		label: "Ignition Key State",
		default: true
	},
	{
		id: "gps",
		label: "GPS Signal & Lock",
		default: true
	},
	{
		id: "battery",
		label: "Battery / Fuel % Badge",
		default: true
	},
	{
		id: "video",
		label: "Live Video Quick Action",
		default: true
	},
	{
		id: "camera",
		label: "Snapshot Quick Action",
		default: true
	},
	{
		id: "trace",
		label: "Trace on Map Quick Action",
		default: true
	},
	{
		id: "info",
		label: "Telemetry Drawer Quick Action",
		default: true
	},
	{
		id: "driver",
		label: "Assigned Driver Name",
		default: false
	},
	{
		id: "imei",
		label: "Device IMEI Number",
		default: false
	},
	{
		id: "odometer",
		label: "Total Odometer",
		default: false
	}
];
function ObjectColumnSettingsModal({ open, onClose }) {
	const [selectedColumns, setSelectedColumns] = (0, import_react.useState)(TRACKING_COLUMNS.filter((c) => c.default).map((c) => c.id));
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Close Settings",
			onClick: onClose,
			className: "fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 w-full max-w-md rounded-lg border border-border bg-white dark:bg-slate-900 text-foreground shadow-xl overflow-hidden text-xs animate-in fade-in zoom-in-95 duration-150 select-none",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex h-[56px] items-center justify-between border-b border-border px-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shrink-0 select-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[16px] font-semibold tracking-tight",
						children: "Object Display Settings"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Close Settings",
						onClick: onClose,
						className: "rounded-md p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-4 space-y-2 max-h-[60vh] overflow-y-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1",
						children: TRACKING_COLUMNS.map((col) => {
							const isChecked = selectedColumns.includes(col.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center justify-between p-2 rounded-md border border-border/60 hover:bg-muted/50 cursor-pointer transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground text-xs",
									children: col.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: isChecked,
									onChange: () => setSelectedColumns((prev) => prev.includes(col.id) ? prev.filter((id) => id !== col.id) : [...prev, col.id]),
									className: "h-4 w-4 rounded border-input text-blue-600 focus:ring-blue-500 cursor-pointer"
								})]
							}, col.id);
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-border bg-surface-muted/40 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSelectedColumns(TRACKING_COLUMNS.map((c) => c.id)),
						className: "text-xs font-semibold text-primary hover:underline cursor-pointer",
						children: "Select All"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "px-3 py-1.5 rounded-md border border-border text-xs font-medium hover:bg-muted cursor-pointer",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								toast.success("Object column settings updated");
								onClose();
							},
							className: "px-4 py-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-xs cursor-pointer",
							children: "Save Changes"
						})]
					})]
				})
			]
		})]
	});
}
function TrackingPage() {
	const [selectedVehicleId, setSelectedVehicleIdState] = (0, import_react.useState)(fleetObjects[0].id);
	const [checkedVehicleIds, setCheckedVehicleIds] = (0, import_react.useState)(fleetObjects.map((v) => v.id));
	const [isTelemetryDrawerOpen, setIsTelemetryDrawerOpen] = (0, import_react.useState)(true);
	const [playbackOpen, setPlaybackOpen] = (0, import_react.useState)(false);
	const [dashcamVehicle, setDashcamVehicle] = (0, import_react.useState)(null);
	const [settingsModalOpen, setSettingsModalOpen] = (0, import_react.useState)(false);
	const { setSelectedVehicleId } = useZio();
	(0, import_react.useEffect)(() => {
		setSelectedVehicleId(selectedVehicleId);
	}, [selectedVehicleId, setSelectedVehicleId]);
	const selectedVehicle = fleetObjects.find((v) => v.id === selectedVehicleId) ?? fleetObjects[0];
	const checkedVehicles = fleetObjects.filter((v) => checkedVehicleIds.includes(v.id));
	const handleToggleCheckVehicle = (id) => {
		setCheckedVehicleIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
	};
	const handleToggleCheckGroup = (ids) => {
		const allIn = ids.every((id) => checkedVehicleIds.includes(id));
		setCheckedVehicleIds((prev) => allIn ? prev.filter((id) => !ids.includes(id)) : [.../* @__PURE__ */ new Set([...prev, ...ids])]);
	};
	const handleToggleCheckAll = () => {
		const allIn = fleetObjects.every((v) => checkedVehicleIds.includes(v.id));
		setCheckedVehicleIds(allIn ? [] : fleetObjects.map((v) => v.id));
	};
	const handleTraceVehicle = (v) => {
		setSelectedVehicleIdState(v.id);
		toast.success("Centering map on " + v.name, { description: "Current Speed: " + v.speed + " km/h · Branch: " + v.branch });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex h-full w-full overflow-hidden p-2.5 gap-2.5 bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FleetExplorerPanel, {
				vehicles: fleetObjects,
				selectedVehicleId,
				onSelectVehicle: (id) => setSelectedVehicleIdState(id),
				checkedVehicleIds,
				onToggleCheckVehicle: handleToggleCheckVehicle,
				onToggleCheckGroup: handleToggleCheckGroup,
				onToggleCheckAll: handleToggleCheckAll,
				onOpenDashcam: (v) => setDashcamVehicle(v),
				onOpenSettings: () => setSettingsModalOpen(true),
				onOpenTelemetry: (v) => {
					setSelectedVehicleIdState(v.id);
					setIsTelemetryDrawerOpen(true);
				},
				onTraceVehicle: handleTraceVehicle,
				className: "w-full sm:w-[410px] shrink-0 z-10"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1 h-full min-w-0 flex flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveTrackingMap, {
					selectedVehicle,
					checkedVehicles,
					onOpenPlayback: () => setPlaybackOpen(true),
					isTelemetryDrawerOpen,
					onToggleTelemetryDrawer: () => setIsTelemetryDrawerOpen((prev) => !prev),
					className: "h-full w-full"
				}), playbackOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute bottom-3 left-4 right-4 z-30 max-w-2xl mx-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoutePlaybackBar, {
						vehicle: selectedVehicle,
						onClose: () => setPlaybackOpen(false)
					})
				})]
			}),
			isTelemetryDrawerOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VehicleTelemetryDrawer, {
				vehicle: selectedVehicle,
				onClose: () => setIsTelemetryDrawerOpen(false),
				onSelectVehicle: (id) => setSelectedVehicleIdState(id),
				allVehicles: fleetObjects,
				className: "shrink-0 z-10 animate-in slide-in-from-right-4 duration-200"
			}),
			dashcamVehicle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDashcamModal, {
				vehicle: dashcamVehicle,
				onClose: () => setDashcamVehicle(null)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObjectColumnSettingsModal, {
				open: settingsModalOpen,
				onClose: () => setSettingsModalOpen(false)
			})
		]
	});
}
var SplitComponent = TrackingPage;
//#endregion
export { SplitComponent as component };
