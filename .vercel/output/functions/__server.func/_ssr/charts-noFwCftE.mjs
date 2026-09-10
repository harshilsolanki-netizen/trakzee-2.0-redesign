import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { E as objectLevelData, T as hourlyLevelData, a as CHART_VEHICLES, b as fuelEvents, c as DATE_PRESETS, f as VEHICLE_BRANDS, g as dailyLevelData, h as VEHICLE_TYPES, m as VEHICLE_MODELS, n as BRANCHES, o as COMPANIES, p as VEHICLE_GROUPS$1, v as findChartItem, x as fuelSeries } from "./reports-D0j_491Z.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $t as ChartLine, F as Search, G as PinOff, O as SlidersHorizontal, Qt as ChartNoAxesColumn, W as Pin, Yt as ChevronDown, Zt as ChartPie, en as ChartColumn, jt as Download, n as X, q as Pencil, qt as ChevronRight, tn as ChartBar, z as RotateCcw } from "../_libs/lucide-react.mjs";
import { i as DropdownMenuItem, n as DropdownMenuContent, t as DropdownMenu, u as DropdownMenuTrigger } from "./dropdown-menu-BFqXdjhf.mjs";
import { l as useLocation, v as useNavigate, y as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as Tooltip, a as LineChart, c as Area, d as Bar, g as ResponsiveContainer, h as Cell, i as BarChart, l as Line, o as YAxis, p as Pie, r as PieChart, s as XAxis, t as ComposedChart, u as CartesianGrid, v as Legend } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/charts-noFwCftE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppliedFiltersSummary({ filters, selectedVehicleCount, onEditFilter, className }) {
	const moreCount = [
		filters.vehicleGroup !== "All" ? `Group: ${filters.vehicleGroup}` : null,
		filters.vehicleType !== "All" ? `Type: ${filters.vehicleType}` : null,
		filters.vehicleBrand !== "All" ? `Brand: ${filters.vehicleBrand}` : null,
		filters.vehicleModel !== "All" ? `Model: ${filters.vehicleModel}` : null
	].filter(Boolean).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-md border border-border/80 bg-surface-muted/40 p-2 shadow-2xs space-y-1.5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1 text-xs font-semibold text-foreground select-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Applied Filters" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3 text-muted-foreground" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onEditFilter,
				className: "inline-flex items-center gap-1 text-[11px] font-semibold text-[#0089FF] hover:underline shrink-0 cursor-pointer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Edit" })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-flex items-center rounded-md bg-background px-2 py-0.5 font-medium text-foreground border border-border/60 shadow-2xs",
					children: filters.company || "All Companies"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-border",
					children: "|"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-flex items-center rounded-md bg-background px-2 py-0.5 font-medium text-foreground border border-border/60 shadow-2xs",
					children: filters.branch || "All Branches"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-border",
					children: "|"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center rounded-md bg-[#0089FF]/10 text-[#0089FF] border border-[#0089FF]/20 px-2 py-0.5 font-semibold text-[11px]",
					children: [selectedVehicleCount, " Vehicles Selected"]
				}),
				moreCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-border",
					children: "|"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 font-medium text-[10px] text-muted-foreground",
					children: [
						"+",
						moreCount,
						" More"
					]
				})] })
			]
		})]
	});
}
var DEFAULT_VEHICLE_ATTRIBUTES = {
	company: "All",
	branch: "All",
	vehicleGroup: "All",
	vehicleType: "All",
	vehicleBrand: "All",
	vehicleModel: "All"
};
function VehicleAttributeFilterOverlay({ open, onClose, value, onChange, onApply }) {
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-30",
		onClick: onClose,
		"aria-hidden": "true"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute top-full left-0 right-0 z-40 mt-1 rounded-xl border border-border bg-card p-3.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border pb-2 mb-3 select-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-bold text-sm tracking-tight text-foreground",
					children: "Edit Vehicle Filters"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-x-3 gap-y-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-foreground",
							children: "Company"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: value.company,
							onChange: (e) => onChange({ company: e.target.value }),
							className: "mt-1 h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-muted-foreground focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 cursor-pointer shadow-2xs",
							children: COMPANIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c,
								children: c
							}, c))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-foreground",
							children: "Branch"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: value.branch,
							onChange: (e) => onChange({ branch: e.target.value }),
							className: "mt-1 h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-muted-foreground focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 cursor-pointer shadow-2xs",
							children: BRANCHES.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: b,
								children: b
							}, b))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-foreground",
							children: "Vehicle Group"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: value.vehicleGroup,
							onChange: (e) => onChange({ vehicleGroup: e.target.value }),
							className: "mt-1 h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-muted-foreground focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 cursor-pointer shadow-2xs",
							children: VEHICLE_GROUPS$1.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: g,
								children: g
							}, g))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-foreground",
							children: "Vehicle Type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: value.vehicleType,
							onChange: (e) => onChange({ vehicleType: e.target.value }),
							className: "mt-1 h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-muted-foreground focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 cursor-pointer shadow-2xs",
							children: VEHICLE_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: t,
								children: t
							}, t))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-foreground",
							children: "Vehicle Brand"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: value.vehicleBrand,
							onChange: (e) => onChange({ vehicleBrand: e.target.value }),
							className: "mt-1 h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-muted-foreground focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 cursor-pointer shadow-2xs",
							children: VEHICLE_BRANDS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: b,
								children: b
							}, b))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-foreground",
							children: "Vehicle Model"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: value.vehicleModel,
							onChange: (e) => onChange({ vehicleModel: e.target.value }),
							className: "mt-1 h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-muted-foreground focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 cursor-pointer shadow-2xs",
							children: VEHICLE_MODELS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: m,
								children: m
							}, m))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3.5 flex items-center justify-between border-t border-border pt-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						onChange(DEFAULT_VEHICLE_ATTRIBUTES);
					},
					className: "text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
					children: "Reset"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						onApply();
						onClose();
					},
					className: "rounded-md bg-[#0089FF] px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition-opacity hover:bg-[#0070d6] cursor-pointer",
					children: "Apply"
				})]
			})
		]
	})] });
}
var selectClass = "h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-muted-foreground shadow-2xs transition-all hover:border-[#0089FF]/60 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF] cursor-pointer";
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-semibold text-foreground",
			children: label
		}), children]
	});
}
function ChartFilterDrawer({ open, onClose, value, onChange, vehicleGroups, onApply }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const [openGroups, setOpenGroups] = (0, import_react.useState)([]);
	const [attributeOverlayOpen, setAttributeOverlayOpen] = (0, import_react.useState)(false);
	const [attributeFilters, setAttributeFilters] = (0, import_react.useState)(DEFAULT_VEHICLE_ATTRIBUTES);
	const groups = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return vehicleGroups.map((g) => ({
			group: g.group,
			vehicles: g.vehicles.filter((v) => q === "" || v.toLowerCase().includes(q))
		})).filter((g) => g.vehicles.length > 0);
	}, [vehicleGroups, query]);
	const allVehicles = vehicleGroups.flatMap((g) => g.vehicles);
	const allSelected = allVehicles.length > 0 && allVehicles.every((v) => value.vehicles.includes(v));
	const toggleVehicle = (v) => onChange({ vehicles: value.vehicles.includes(v) ? value.vehicles.filter((x) => x !== v) : [...value.vehicles, v] });
	const toggleGroupVehicles = (vs) => {
		onChange({ vehicles: vs.every((v) => value.vehicles.includes(v)) ? value.vehicles.filter((x) => !vs.includes(x)) : [.../* @__PURE__ */ new Set([...value.vehicles, ...vs])] });
	};
	const toggleGroup = (g) => setOpenGroups((gs) => gs.includes(g) ? gs.filter((x) => x !== g) : [...gs, g]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": "Close filter",
		onClick: onClose,
		className: "fixed top-[45px] bottom-0 left-0 sm:left-[68px] right-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
	}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		"aria-hidden": !open,
		"aria-label": "Chart filter panel",
		className: cn("fixed right-0 top-[45px] bottom-0 z-40 flex w-full max-w-[420px] xl:max-w-[430px] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out", open ? "translate-x-0" : "pointer-events-none translate-x-full"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-[56px] items-center justify-between border-b border-border px-5 bg-background select-none shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[16px] font-semibold tracking-tight text-foreground",
					children: "Chart Filter"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Close filter",
					onClick: onClose,
					className: "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-h-0 flex flex-col p-5 space-y-3.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Date selection",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: selectClass,
								value: value.datePreset,
								onChange: (e) => onChange({ datePreset: e.target.value }),
								children: DATE_PRESETS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: o,
									children: o
								}, o))
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center overflow-hidden rounded-md border border-input/80 bg-background shadow-2xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bg-muted px-2 py-1.5 text-[10px] font-semibold text-foreground border-r border-input/80",
								children: "From"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: value.from,
								onChange: (e) => onChange({
									from: e.target.value,
									datePreset: "Custom"
								}),
								className: "h-7.5 w-full bg-transparent px-2 text-xs font-medium text-muted-foreground focus:outline-none focus:text-foreground"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center overflow-hidden rounded-md border border-input/80 bg-background shadow-2xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bg-muted px-2 py-1.5 text-[10px] font-semibold text-foreground border-r border-input/80",
								children: "To"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: value.to,
								onChange: (e) => onChange({
									to: e.target.value,
									datePreset: "Custom"
								}),
								className: "h-7.5 w-full bg-transparent px-2 text-xs font-medium text-muted-foreground focus:outline-none focus:text-foreground"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppliedFiltersSummary, {
							filters: attributeFilters,
							selectedVehicleCount: value.vehicles.length,
							onEditFilter: () => setAttributeOverlayOpen(true)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VehicleAttributeFilterOverlay, {
							open: attributeOverlayOpen,
							onClose: () => setAttributeOverlayOpen(false),
							value: attributeFilters,
							onChange: (patch) => setAttributeFilters((prev) => ({
								...prev,
								...patch
							})),
							onApply: () => setAttributeOverlayOpen(false)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-8 items-center gap-1.5 rounded-md border border-input/80 bg-background px-2.5 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: query,
								onChange: (e) => setQuery(e.target.value),
								placeholder: "Search vehicles, drivers...",
								"aria-label": "Search vehicles",
								className: "h-7 flex-1 bg-transparent text-xs font-medium text-muted-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 focus:outline-none focus:text-foreground"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-h-0 flex flex-col rounded-md border border-border/80 bg-card overflow-hidden shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border/60 bg-muted/40 px-2.5 py-1.5 shrink-0 select-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => onChange({ vehicles: allSelected ? [] : allVehicles }),
									className: "text-[11px] font-semibold text-[#0089FF] transition-colors duration-150 hover:underline cursor-pointer",
									children: allSelected ? "Clear all" : "Select all"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] tabular-nums text-muted-foreground font-medium",
									children: value.vehicles.length === 0 ? "All vehicles" : value.vehicles.length + " selected"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "flex-1 min-h-0 overflow-y-auto py-1",
								children: [groups.map((g) => {
									const expanded = openGroups.includes(g.group) || query.trim() !== "";
									const sel = g.vehicles.filter((v) => value.vehicles.includes(v)).length;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 px-2.5 py-1.5 select-none",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											"aria-label": "Select all in " + g.group,
											checked: sel === g.vehicles.length && g.vehicles.length > 0,
											onChange: () => toggleGroupVehicles(g.vehicles),
											className: "rounded border-input text-[#0089FF] focus:ring-[#0089FF] accent-[#0089FF] cursor-pointer h-3.5 w-3.5"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => toggleGroup(g.group),
											"aria-expanded": expanded,
											className: "flex flex-1 items-center gap-1 text-left text-xs font-semibold text-foreground transition-colors duration-150 hover:text-[#0089FF] cursor-pointer truncate",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: cn("h-3.5 w-3.5 transition-transform duration-150 text-muted-foreground", expanded && "rotate-90") }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate",
													children: g.group
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] tabular-nums text-muted-foreground font-normal",
													children: "[" + g.vehicles.length + "]"
												})
											]
										})]
									}), expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: g.vehicles.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex cursor-pointer items-center gap-2 py-1.5 pl-8 pr-2.5 text-xs transition-colors duration-150 select-none hover:bg-muted text-foreground font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: value.vehicles.includes(v),
											onChange: () => toggleVehicle(v),
											className: "rounded border-input text-[#0089FF] focus:ring-[#0089FF] accent-[#0089FF] cursor-pointer h-3.5 w-3.5"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("flex-1 truncate", value.vehicles.includes(v) && "font-semibold"),
											children: v
										})]
									}) }, v)) }) : null] }, g.group);
								}), groups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "px-2 py-4 text-center text-[11px] text-muted-foreground",
									children: "No vehicles match your search."
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "border-t border-border bg-surface-muted/30 px-2.5 py-1.5 text-[11px] tabular-nums text-muted-foreground shrink-0",
								children: value.vehicles.length === 0 ? "No vehicle selected — all vehicles will be included." : value.vehicles.length + " vehicles selected"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "flex h-[56px] items-center justify-between border-t border-border bg-background px-5 shrink-0 select-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"aria-label": "Clear filter",
					onClick: () => onChange({
						vehicles: [],
						datePreset: DATE_PRESETS[0],
						from: "",
						to: ""
					}),
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
						onClick: onApply,
						className: "h-8 rounded-md bg-[#0089FF] px-4 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#0070d6] cursor-pointer active:scale-98",
						children: "Apply Filter"
					})]
				})]
			})
		]
	})] });
}
var TYPES = [
	{
		id: "column",
		label: "Column chart",
		icon: ChartColumn
	},
	{
		id: "bar-horizontal",
		label: "Horizontal bar",
		icon: ChartBar
	},
	{
		id: "pie",
		label: "Pie chart",
		icon: ChartPie
	},
	{
		id: "line",
		label: "Line chart",
		icon: ChartLine
	},
	{
		id: "stacked-column",
		label: "Stacked column",
		icon: ChartNoAxesColumn
	},
	{
		id: "stacked-bar",
		label: "Stacked bar",
		icon: ChartBar
	},
	{
		id: "donut",
		label: "Donut chart",
		icon: ChartPie
	}
];
/**
* Right-edge chart type toolbar using the spacer pattern:
* pinned → a 44px spacer reserves space and the panel sits beside the chart;
* unpinned → spacer collapses, panel slides off-canvas and re-opens on hover
* of a 15px trigger zone at the right edge.
*/
function ChartTypeToolbar({ chartType, onChange }) {
	const [pinned, setPinned] = (0, import_react.useState)(false);
	const [hovered, setHovered] = (0, import_react.useState)(false);
	const shown = pinned || hovered;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": true,
			className: cn("shrink-0 transition-[width] duration-300", pinned ? "w-11" : "w-0")
		}),
		!pinned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": true,
			onMouseEnter: () => setHovered(true),
			className: "absolute inset-y-0 right-0 z-30 w-[15px]"
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "toolbar",
			"aria-label": "Chart type",
			"aria-orientation": "vertical",
			onMouseEnter: () => setHovered(true),
			onMouseLeave: () => setHovered(false),
			className: cn("absolute inset-y-0 right-0 z-40 flex w-11 flex-col items-center gap-1 border-l border-border bg-surface py-2 shadow-lg transition-transform duration-300 ease-out", shown ? "translate-x-0" : "translate-x-full"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": pinned ? "Unpin toolbar" : "Pin toolbar",
					"aria-pressed": pinned,
					onClick: () => setPinned((p) => !p),
					className: cn("rounded p-1.5 transition-colors duration-150", pinned ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:bg-muted"),
					children: pinned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-0.5 h-px w-6 bg-border" }),
				TYPES.map((t) => {
					const Icon = t.icon;
					const active = chartType === t.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": t.label,
						"aria-pressed": active,
						title: t.label,
						onClick: () => onChange(t.id),
						className: cn("rounded p-1.5 transition-colors duration-150", active ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-4 w-4", t.id === "stacked-bar" && "rotate-90") })
					}, t.id);
				})
			]
		})
	] });
}
var PIE_COLORS = [
	"#155dfc",
	"#10b981",
	"#06b6d4",
	"#f59e0b",
	"#ef4444",
	"#6366f1",
	"#8b5cf6",
	"#ec4899"
];
var VEHICLE_GROUPS = [{
	group: "Agarwal Industries",
	vehicles: CHART_VEHICLES.slice(0, 3)
}, {
	group: "Balaji Logistics",
	vehicles: CHART_VEHICLES.slice(3)
}];
var SCROLL = "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent";
function ChartsPage() {
	const search = useSearch({ strict: false });
	useLocation();
	useNavigate();
	const urlChartId = search?.chart || "distance";
	const [chartId, setChartId] = (0, import_react.useState)(urlChartId);
	(0, import_react.useEffect)(() => {
		if (search?.chart && search.chart !== chartId) {
			setChartId(search.chart);
			setLevel(0);
			setDrillVehicle(null);
			setDrillDate(null);
			if (search.chart === "fuel-fill-drain") setChartType("line");
		}
	}, [search?.chart]);
	const currentChart = (0, import_react.useMemo)(() => {
		return findChartItem(chartId) ?? {
			id: "distance",
			label: "Distance",
			metric: "distance",
			unit: "km",
			range: [40, 620],
			category: "activity",
			categoryLabel: "Activity"
		};
	}, [chartId]);
	const isFuel = chartId === "fuel-fill-drain";
	currentChart.category;
	const [level, setLevel] = (0, import_react.useState)(0);
	const [drillVehicle, setDrillVehicle] = (0, import_react.useState)(null);
	const [drillDate, setDrillDate] = (0, import_react.useState)(null);
	const [chartType, setChartType] = (0, import_react.useState)(isFuel ? "line" : "column");
	const [filterOpen, setFilterOpen] = (0, import_react.useState)(false);
	const [filter, setFilter] = (0, import_react.useState)({
		datePreset: "Last 7 Days",
		from: "2024-12-04",
		to: "2024-12-10",
		vehicles: []
	});
	const [toggles, setToggles] = (0, import_react.useState)({
		fuel: true,
		fuelRaw: false,
		ignition: true,
		speed: false,
		power: false
	});
	const baseData = (0, import_react.useMemo)(() => {
		if (isFuel) return [];
		let rows;
		if (level === 0) rows = objectLevelData(chartId);
		else if (level === 1) rows = dailyLevelData(chartId, drillVehicle);
		else rows = hourlyLevelData(chartId, drillVehicle, drillDate);
		if (level === 0 && filter.vehicles.length > 0) rows = rows.filter((r) => filter.vehicles.includes(r.name));
		return rows.map((r, i) => ({
			...r,
			sr: i + 1,
			value2: Math.round(r.value * .35 * 100) / 100
		}));
	}, [
		isFuel,
		level,
		chartId,
		drillVehicle,
		drillDate,
		filter.vehicles
	]);
	const fuelData = (0, import_react.useMemo)(() => isFuel ? fuelSeries(drillVehicle ?? CHART_VEHICLES[0]) : [], [isFuel, drillVehicle]);
	const fuelEvts = (0, import_react.useMemo)(() => fuelEvents(fuelData), [fuelData]);
	const totalCorrection = (0, import_react.useMemo)(() => fuelEvts.reduce((s, e) => s + e.volume, 0).toFixed(1), [fuelEvts]);
	const handleBarClick = (entry) => {
		if (isFuel) return;
		if (level === 0) {
			setDrillVehicle(entry.name);
			setLevel(1);
		} else if (level === 1) {
			setDrillDate(entry.name);
			setLevel(2);
		}
	};
	const crumbs = [{ label: currentChart.categoryLabel }, {
		label: currentChart.label,
		...level > 0 ? { onClick: () => (setLevel(0), setDrillVehicle(null), setDrillDate(null)) } : {}
	}];
	if (drillVehicle) crumbs.push({
		label: drillVehicle,
		...level === 2 ? { onClick: () => (setLevel(1), setDrillDate(null)) } : {}
	});
	if (drillDate) crumbs.push({ label: drillDate });
	const chartTitle = isFuel ? `Fuel Fill-Drain · ${drillVehicle ?? CHART_VEHICLES[0]}` : `${currentChart.label} (${currentChart.unit})`;
	const handleDownload = (label) => toast.success(`Generating ${label} report…`, { description: `${chartTitle} · ${filter.from} → ${filter.to}` });
	const axisTickStyle = {
		fill: "#475569",
		fontSize: 11,
		fontWeight: 500
	};
	const axisStroke = "#cbd5e1";
	const xAxisTitle = level === 0 ? "Object (Vehicle)" : level === 1 ? "Date (DD-MM-YYYY)" : "Time (Hours)";
	const yAxisTitle = `${currentChart.label} (${currentChart.unit})`;
	const chartVehicleBadgeLabel = (0, import_react.useMemo)(() => {
		if (filter.vehicles.length === 1) return filter.vehicles[0];
		if (filter.vehicles.length > 1) return `${filter.vehicles[0]} +${filter.vehicles.length - 1} more`;
		return `${CHART_VEHICLES[0] || "GJ15MM2654"} +${CHART_VEHICLES.length - 1} more`;
	}, [filter.vehicles]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-1 flex-col gap-3 p-3 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex shrink-0 flex-wrap items-center justify-between gap-4 rounded-md border border-border bg-surface px-4 py-3 shadow-xs min-h-[64px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1.5 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						"aria-label": "Breadcrumb",
						className: "flex items-center gap-2",
						children: [
							level === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-base font-bold text-foreground leading-tight tracking-tight",
								children: currentChart.label
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setLevel(0);
									setDrillVehicle(null);
									setDrillDate(null);
								},
								className: "text-base font-bold text-foreground transition-colors hover:text-brand hover:underline cursor-pointer leading-tight tracking-tight",
								children: currentChart.label
							}),
							drillVehicle && level >= 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 text-muted-foreground/60 shrink-0" }), level === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium text-muted-foreground",
								children: drillVehicle
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setLevel(1);
									setDrillDate(null);
								},
								className: "text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline cursor-pointer",
								children: drillVehicle
							})] }),
							drillDate && level === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 text-muted-foreground/60 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium text-muted-foreground",
								children: drillDate
							})] })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							title: "Click to edit date range",
							onClick: () => {
								setFilterOpen(true);
							},
							className: "inline-flex h-6.5 items-center gap-1 rounded px-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer font-normal",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								filter.from,
								" 12:00 AM → ",
								filter.to,
								" 11:59 PM"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3 opacity-60" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							title: "Click to select vehicles",
							onClick: () => {
								setFilterOpen(true);
							},
							className: "inline-flex h-6.5 items-center gap-1 rounded px-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer font-normal",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: chartVehicleBadgeLabel }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3 opacity-60" })]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-label": "Download options",
							className: "flex h-7 items-center gap-1 rounded border border-input bg-background px-2 text-[11px] font-medium text-foreground transition-colors hover:bg-muted cursor-pointer select-none shadow-2xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3 w-3 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-2.5 w-2.5 opacity-60 ml-0.5" })
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
						align: "end",
						className: "w-44 p-1 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								onClick: () => handleDownload("PDF"),
								className: "cursor-pointer text-xs rounded px-2 py-1.5",
								children: "PDF"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								onClick: () => handleDownload("Excel (XLS)"),
								className: "cursor-pointer text-xs rounded px-2 py-1.5",
								children: "Excel (XLS)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								onClick: () => handleDownload("CSV"),
								className: "cursor-pointer text-xs rounded px-2 py-1.5",
								children: "CSV"
							})
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"aria-label": "Filter",
						onClick: () => {
							setFilterOpen(true);
						},
						className: "inline-flex h-7 items-center gap-1.5 rounded bg-brand px-2.5 text-[11px] font-semibold text-brand-foreground shadow-2xs transition-opacity duration-150 hover:opacity-90 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Filter" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid min-h-0 flex-1 gap-3 lg:grid-cols-[290px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-h-0 flex-col overflow-hidden rounded-md border border-border bg-surface shadow-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border bg-surface-muted/50 px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xs font-bold text-foreground",
								children: "Data"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand",
								children: currentChart.unit
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("min-h-0 flex-1 overflow-auto", SCROLL),
							children: isFuel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "sticky top-0 bg-surface-muted border-b border-border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-2.5 py-1.5 text-left font-semibold text-muted-foreground",
											children: "Start Time"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-2.5 py-1.5 text-left font-semibold text-muted-foreground",
											children: "End Time"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-2.5 py-1.5 text-right font-semibold text-muted-foreground",
											children: "Status"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: fuelEvts.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-border hover:bg-muted/60 transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2.5 py-1.5 tabular-nums font-medium",
											children: e.start
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2.5 py-1.5 tabular-nums text-muted-foreground",
											children: e.end
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2.5 py-1.5 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold", e.valid ? "bg-success/15 text-success" : "bg-danger/15 text-danger"),
												children: e.valid ? "Valid" : "Invalid"
											})
										})
									]
								}, e.id)) })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "sticky top-0 bg-surface-muted border-b border-border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: level === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-2.5 py-1.5 text-left font-semibold text-muted-foreground",
											children: "Sr No"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-2.5 py-1.5 text-left font-semibold text-muted-foreground",
											children: "Object"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
											className: "px-2.5 py-1.5 text-right font-semibold text-muted-foreground",
											children: [
												currentChart.label,
												" (",
												currentChart.unit,
												")"
											]
										})
									] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2.5 py-1.5 text-left font-semibold text-muted-foreground",
										children: level === 1 ? "Date" : "Time"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
										className: "px-2.5 py-1.5 text-right font-semibold text-muted-foreground",
										children: [
											currentChart.label,
											" (",
											currentChart.unit,
											")"
										]
									})] }) })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: baseData.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
									onClick: () => handleBarClick(r),
									className: cn("border-t border-border hover:bg-muted/70 transition-colors", level < 2 && "cursor-pointer"),
									children: level === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2.5 py-2 tabular-nums text-muted-foreground",
											children: r.sr
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2.5 py-2 font-medium text-foreground",
											children: r.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2.5 py-2 text-right tabular-nums font-semibold text-foreground",
											children: r.value.toFixed(2)
										})
									] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2.5 py-2 font-medium text-foreground",
										children: r.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2.5 py-2 text-right tabular-nums font-semibold text-foreground",
										children: r.value.toFixed(2)
									})] })
								}, r.name)) })]
							})
						}),
						!isFuel && level < 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "border-t border-border bg-surface-muted/30 px-2.5 py-1.5 text-[11px] text-muted-foreground",
							children: "💡 Click any vehicle or date row to drill down."
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex min-h-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-h-0 min-w-0 flex-1 flex-col rounded-md border border-border bg-surface p-3 shadow-xs",
						children: [isFuel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex flex-wrap items-center gap-2 border-b border-border pb-2.5",
							children: [[
								["fuel", "Fuel Algorithm"],
								["fuelRaw", "Fuel Raw Data"],
								["ignition", "Ignition"],
								["speed", "Speed"],
								["power", "Power"]
							].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-surface-muted px-2.5 py-1 text-[11px] font-medium transition-colors hover:bg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: toggles[key],
									onChange: () => setToggles((t) => ({
										...t,
										[key]: !t[key]
									}))
								}), label]
							}, key)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center rounded-full bg-brand/15 px-2.5 py-1 text-[11px] font-semibold text-brand",
								children: [
									"Total correction: ",
									totalCorrection,
									" ltr"
								]
							})]
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-h-0 flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: isFuel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
									data: fuelData,
									margin: {
										top: 20,
										right: 30,
										left: 20,
										bottom: 25
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											stroke: "#e2e8f0",
											strokeDasharray: "3 3",
											vertical: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "time",
											stroke: axisStroke,
											tick: axisTickStyle,
											tickLine: { stroke: axisStroke },
											height: 42,
											label: {
												value: "Time (HH:mm)",
												position: "insideBottom",
												offset: -6,
												fill: "#334155",
												fontSize: 12,
												fontWeight: 600
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											yAxisId: "fuel",
											domain: [0, 100],
											stroke: axisStroke,
											tick: axisTickStyle,
											tickLine: { stroke: axisStroke },
											width: 65,
											label: {
												value: "Fuel Level (ltr)",
												angle: -90,
												position: "insideLeft",
												offset: 12,
												fill: "#334155",
												fontSize: 12,
												fontWeight: 600,
												style: { textAnchor: "middle" }
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											yAxisId: "right",
											orientation: "right",
											domain: [0, 1],
											tickFormatter: (v) => v === 1 ? "ON" : "OFF",
											stroke: axisStroke,
											tick: axisTickStyle,
											tickLine: { stroke: axisStroke },
											width: 55,
											label: {
												value: "Status (ON / OFF)",
												angle: 90,
												position: "insideRight",
												offset: 12,
												fill: "#334155",
												fontSize: 12,
												fontWeight: 600,
												style: { textAnchor: "middle" }
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
											fontSize: 12,
											borderRadius: 8,
											border: "1px solid #cbd5e1",
											boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
										} }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: {
											fontSize: 12,
											paddingTop: 6
										} }),
										toggles.ignition ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
											yAxisId: "right",
											type: "stepAfter",
											dataKey: "ignition",
											name: "Ignition",
											stroke: "#f59e0b",
											fill: "#f59e0b",
											fillOpacity: .18
										}) : null,
										toggles.power ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
											yAxisId: "right",
											type: "stepAfter",
											dataKey: "power",
											name: "Power",
											stroke: "#06b6d4",
											fill: "#06b6d4",
											fillOpacity: .12
										}) : null,
										toggles.fuel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
											yAxisId: "fuel",
											type: "monotone",
											dataKey: "fuel",
											name: "Fuel Algorithm (ltr)",
											stroke: "#155dfc",
											strokeWidth: 2.5,
											dot: false
										}) : null,
										toggles.fuelRaw ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
											yAxisId: "fuel",
											type: "monotone",
											dataKey: "fuelRaw",
											name: "Fuel Raw Data (ltr)",
											stroke: "#10b981",
											strokeWidth: 1.5,
											strokeDasharray: "4 3",
											dot: false
										}) : null,
										toggles.speed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
											yAxisId: "fuel",
											type: "monotone",
											dataKey: "speed",
											name: "Speed (km/h)",
											stroke: "#6366f1",
											strokeWidth: 1.5,
											dot: false
										}) : null
									]
								}) : chartType === "pie" || chartType === "donut" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										fontSize: 12,
										borderRadius: 8,
										border: "1px solid #cbd5e1"
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
										data: baseData,
										dataKey: "value",
										nameKey: "name",
										innerRadius: chartType === "donut" ? "45%" : 0,
										outerRadius: "78%",
										label: ({ name, value }) => `${name}: ${value}`,
										children: baseData.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: PIE_COLORS[i % PIE_COLORS.length] }, i))
									})
								] }) : chartType === "line" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
									data: baseData,
									margin: {
										top: 20,
										right: 28,
										left: 16,
										bottom: 28
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											stroke: "#e2e8f0",
											strokeDasharray: "3 3",
											vertical: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "name",
											stroke: axisStroke,
											tick: axisTickStyle,
											tickLine: { stroke: axisStroke },
											height: 45,
											interval: 0,
											label: {
												value: xAxisTitle,
												position: "insideBottom",
												offset: -6,
												fill: "#334155",
												fontSize: 12,
												fontWeight: 600
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											stroke: axisStroke,
											tick: axisTickStyle,
											tickLine: { stroke: axisStroke },
											width: 65,
											label: {
												value: yAxisTitle,
												angle: -90,
												position: "insideLeft",
												offset: 12,
												fill: "#334155",
												fontSize: 12,
												fontWeight: 600,
												style: { textAnchor: "middle" }
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
											fontSize: 12,
											borderRadius: 8,
											border: "1px solid #cbd5e1",
											boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
										} }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: {
											fontSize: 12,
											paddingTop: 4
										} }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
											type: "monotone",
											dataKey: "value",
											name: chartTitle,
											stroke: "#155dfc",
											strokeWidth: 2.5,
											dot: {
												r: 4,
												fill: "#155dfc",
												strokeWidth: 2,
												stroke: "#fff"
											},
											activeDot: { r: 6 }
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: baseData,
									layout: chartType === "bar-horizontal" || chartType === "stacked-bar" ? "vertical" : "horizontal",
									margin: {
										top: 20,
										right: 28,
										left: 16,
										bottom: 28
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											stroke: "#e2e8f0",
											strokeDasharray: "3 3",
											vertical: false
										}),
										chartType === "bar-horizontal" || chartType === "stacked-bar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											type: "number",
											stroke: axisStroke,
											tick: axisTickStyle,
											tickLine: { stroke: axisStroke },
											height: 45,
											label: {
												value: yAxisTitle,
												position: "insideBottom",
												offset: -6,
												fill: "#334155",
												fontSize: 12,
												fontWeight: 600
											}
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											type: "category",
											dataKey: "name",
											width: 100,
											stroke: axisStroke,
											tick: axisTickStyle,
											tickLine: { stroke: axisStroke },
											label: {
												value: xAxisTitle,
												angle: -90,
												position: "insideLeft",
												offset: 12,
												fill: "#334155",
												fontSize: 12,
												fontWeight: 600,
												style: { textAnchor: "middle" }
											}
										})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "name",
											stroke: axisStroke,
											tick: axisTickStyle,
											tickLine: { stroke: axisStroke },
											height: 45,
											interval: 0,
											label: {
												value: xAxisTitle,
												position: "insideBottom",
												offset: -6,
												fill: "#334155",
												fontSize: 12,
												fontWeight: 600
											}
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											stroke: axisStroke,
											tick: axisTickStyle,
											tickLine: { stroke: axisStroke },
											width: 65,
											label: {
												value: yAxisTitle,
												angle: -90,
												position: "insideLeft",
												offset: 12,
												fill: "#334155",
												fontSize: 12,
												fontWeight: 600,
												style: { textAnchor: "middle" }
											}
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
											fontSize: 12,
											borderRadius: 8,
											border: "1px solid #cbd5e1",
											boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
										} }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: {
											fontSize: 12,
											paddingTop: 4
										} }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "value",
											name: chartTitle,
											fill: "#155dfc",
											radius: [
												4,
												4,
												0,
												0
											],
											barSize: 28,
											...chartType === "stacked-column" || chartType === "stacked-bar" ? { stackId: "s" } : {},
											...level < 2 ? {
												onClick: (d) => handleBarClick(d),
												cursor: "pointer"
											} : {}
										}),
										chartType === "stacked-column" || chartType === "stacked-bar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "value2",
											name: "Secondary",
											fill: "#10b981",
											radius: [
												4,
												4,
												0,
												0
											],
											barSize: 28,
											stackId: "s"
										}) : null
									]
								})
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTypeToolbar, {
						chartType,
						onChange: setChartType
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartFilterDrawer, {
				open: filterOpen,
				onClose: () => setFilterOpen(false),
				value: filter,
				onChange: (patch) => setFilter((f) => ({
					...f,
					...patch
				})),
				vehicleGroups: VEHICLE_GROUPS,
				onApply: () => {
					setFilterOpen(false);
					setLevel(0);
					setDrillVehicle(null);
					setDrillDate(null);
					toast.success("Filter applied", { description: `${filter.from} → ${filter.to} · ${filter.vehicles.length === 0 ? "all vehicles" : `${filter.vehicles.length} vehicles`}` });
				}
			})
		]
	});
}
var SplitComponent = ChartsPage;
//#endregion
export { SplitComponent as component };
