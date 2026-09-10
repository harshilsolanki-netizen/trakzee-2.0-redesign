import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { C as getGroupsForBranches, D as temperatureSummaryRows, S as getBranchesForCompanies, _ as driverJobSummaryRows, f as VEHICLE_BRANDS, h as VEHICLE_TYPES, l as DURATION_STATUS, m as VEHICLE_MODELS, o as COMPANIES, r as BRANCH_VEHICLES_MAP, s as COMPARATORS, u as DURATION_UNITS, w as getVehiclesForBranches, y as findReport } from "./reports-D0j_491Z.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { B as RefreshCw, F as Search, Ft as CornerDownLeft, H as Plus, Ht as CircleQuestionMark, Jt as ChevronRight, Kt as ChevronsUpDown, M as Settings, Mt as Download, N as Settings2, O as SlidersHorizontal, Q as Minus, St as Fuel, Tt as FileSpreadsheet, U as Play, Vt as CircleX, W as Pin, Wt as CircleCheck, Xt as ChevronDown, Yt as ChevronLeft, Zt as Check, _t as GripVertical, an as Calendar, cn as Bold, ct as List, fn as ArrowUp, h as Truck, hn as ArrowDown, it as Mail, m as Underline, mn as ArrowLeft, mt as Italic, n as X, nt as Map$1, on as CalendarClock, p as Undo2, pn as ArrowRight, q as Pencil, st as LoaderCircle, tn as ChartColumn, wt as FileText, x as Thermometer, y as Trash2, z as RotateCcw, zt as Clock } from "../_libs/lucide-react.mjs";
import { a as DropdownMenuLabel, i as DropdownMenuItem, n as DropdownMenuContent, o as DropdownMenuSeparator, t as DropdownMenu, u as DropdownMenuTrigger } from "./dropdown-menu-BFqXdjhf.mjs";
import { y as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as TooltipTrigger, n as TooltipContent, r as TooltipProvider, t as Tooltip } from "./tooltip-yj1PAv0W.mjs";
import { i as PopoverTrigger, n as Popover, r as PopoverContent } from "./store-Butx-LES.mjs";
import { t as FavoriteToggle } from "./FavoritesMenu-5aAnLDi6.mjs";
import { d as travelRows, o as fleetObjects } from "./fleet-DZTK5mNe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/report-DSFT-2yz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ExportPopover({ onSelect, label = "Download", className }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [scope, setScope] = (0, import_react.useState)("summary");
	const handleExport = (format) => {
		setOpen(false);
		onSelect(format, scope);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"aria-label": "Download options",
				className: cn("inline-flex h-7 items-center gap-1.5 rounded-md border border-border/80 bg-background px-2.5 text-xs font-semibold text-foreground transition-all hover:bg-muted cursor-pointer select-none shadow-2xs active:scale-98", open && "bg-muted border-[#0089FF]/50 ring-2 ring-[#0089FF]/20", className),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3 opacity-60 ml-0.5" })
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
			align: "end",
			sideOffset: 6,
			className: "w-[280px] rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md p-3.5 text-foreground shadow-lg animate-in fade-in-0 zoom-in-95 select-none space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-semibold text-foreground",
					children: "Download Options"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4 text-xs font-medium text-foreground py-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						onClick: () => setScope("summary"),
						className: "flex items-center gap-2 cursor-pointer select-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "radio",
							name: "download-scope",
							checked: scope === "summary",
							onChange: () => setScope("summary"),
							className: "h-3.5 w-3.5 accent-[#0089FF] cursor-pointer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn(scope === "summary" && "font-semibold text-foreground"),
							children: "Summary only"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						onClick: () => setScope("detail"),
						className: "flex items-center gap-2 cursor-pointer select-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "radio",
							name: "download-scope",
							checked: scope === "detail",
							onChange: () => setScope("detail"),
							className: "h-3.5 w-3.5 accent-[#0089FF] cursor-pointer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn(scope === "detail" && "font-semibold text-foreground"),
							children: "Summary+details"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-2 pt-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => handleExport("XLS"),
							className: "flex items-center justify-center gap-1.5 h-8 rounded-md border border-border/80 bg-background hover:bg-muted font-semibold text-xs text-foreground cursor-pointer transition-all shadow-2xs active:scale-98",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "XLS" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => handleExport("PDF"),
							className: "flex items-center justify-center gap-1.5 h-8 rounded-md border border-border/80 bg-background hover:bg-muted font-semibold text-xs text-foreground cursor-pointer transition-all shadow-2xs active:scale-98",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PDF" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => handleExport("CSV"),
							className: "flex items-center justify-center gap-1.5 h-8 rounded-md border border-border/80 bg-background hover:bg-muted font-semibold text-xs text-foreground cursor-pointer transition-all shadow-2xs active:scale-98",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CSV" })]
						})
					]
				})
			]
		})]
	});
}
var DEFAULT_FILTERS = {
	durationStatus: "All",
	durationCompare: "Greater Than",
	durationUnit: "Hour",
	durationValue: "",
	distanceCompare: "Greater Than",
	distanceValue: "",
	durationFormat: "hhmm",
	datePreset: "Today",
	from: "2026-09-02",
	to: "2026-09-02",
	enableTimeRange: true,
	fromTime: "00:00",
	toTime: "23:59",
	companies: [],
	branches: [],
	groups: [],
	types: [],
	brands: [],
	models: [],
	objects: []
};
/**
* Single Select Dropdown visually matching the report design system:
* - h-7.5 sleek trigger
* - Clear placeholder
* - Checkmark indicator on active item
* - Floating popover with custom scrollbar
*/
function SelectDropdown$1({ value, options, onChange, className, placeholder }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const handleClickOutside = (event) => {
			if (ref.current && !ref.current.contains(event.target)) setOpen(false);
		};
		if (open) document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: cn("relative", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen(!open),
			className: cn("flex h-7.5 w-full items-center justify-between rounded-md border border-input/80 bg-background px-2.5 text-xs shadow-2xs transition-all hover:border-[#0089FF]/60 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF] cursor-pointer select-none", open && "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-muted/40"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("truncate", value ? "text-foreground font-medium" : "text-muted-foreground/60 font-medium italic"),
				children: value || placeholder || "Select"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70 transition-transform duration-200 ml-1", open && "rotate-180") })]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute top-full left-0 right-0 z-50 mt-1 max-h-52 overflow-y-auto rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md p-1 shadow-xl animate-in fade-in-0 zoom-in-95 select-none custom-scrollbar",
			children: options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => {
					onChange(opt);
					setOpen(false);
				},
				className: cn("flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs transition-colors cursor-pointer select-none", value === opt ? "bg-muted font-semibold text-foreground" : "text-foreground hover:bg-muted/80 font-medium"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: opt
				}), value === opt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-[#0089FF] shrink-0" })]
			}, opt))
		})]
	});
}
/**
* Universal Multi-Select Dropdown matching the title frame styling visually:
* - h-7.5 sleek trigger
* - FirstItem +Count formatted display
* - Real-time search box
* - Select all checkbox
* - Red warning message when 0 items selected
* - Clear / Cancel / Apply footer
*/
function UniversalMultiSelectDropdown({ label, selected, options, onChange, className, placeholder }) {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: cn("relative", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen(!open),
			className: cn("flex h-7.5 w-full items-center justify-between rounded-md border border-input/80 bg-background px-2.5 text-xs shadow-2xs transition-all hover:border-[#0089FF]/60 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF] cursor-pointer select-none", open && "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-muted/40"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center min-w-0 flex-1 overflow-hidden",
				children: !selected || selected.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground/60 font-medium italic truncate",
					children: placeholder || `Select ${label}`
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-foreground font-medium truncate",
					children: selected[0]
				}), selected.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "ml-1.5 inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-[#0089FF]/10 text-[#0089FF] border border-[#0089FF]/20 shrink-0",
					children: ["+", selected.length - 1]
				})] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70 transition-transform duration-200 ml-1", open && "rotate-180") })]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute top-full left-0 right-0 z-50 mt-1 w-full rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md shadow-2xl animate-in fade-in-0 zoom-in-95 select-none overflow-hidden flex flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-2.5 pb-2 border-b border-border/60 bg-muted/20 space-y-2",
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
						className: "flex h-7 items-center gap-1.5 rounded-md border border-input bg-background px-2 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3 w-3 text-muted-foreground shrink-0" }),
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
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-2.5 w-2.5" })
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-3 py-1.5 border-b border-border/60 flex items-center justify-between bg-muted/10",
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
					className: "mx-2.5 my-1.5 px-2 py-1.5 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200/70 dark:border-red-800/40 text-[10px] text-red-600 dark:text-red-400 font-medium leading-snug",
					children: "Select at least one item, or all items will be selected by default."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-48 overflow-y-auto p-1 space-y-0.5 custom-scrollbar",
					children: [filteredOptions.map((opt) => {
						const isChecked = draft.includes(opt);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-foreground transition-colors cursor-pointer select-none hover:bg-muted/80 font-medium",
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
						className: "p-3 text-center text-xs text-muted-foreground italic",
						children: [
							"No ",
							label.toLowerCase(),
							" found"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-2 px-3 border-t border-border/70 flex items-center justify-between bg-muted/20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: handleClear,
						className: "text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer transition-colors",
						children: "Clear"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleCancel,
							className: "px-2.5 py-1 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleApply,
							className: "px-3.5 py-1 text-xs rounded-md font-semibold text-white bg-[#0089FF] hover:bg-[#0070d6] shadow-xs transition-all active:scale-98 cursor-pointer",
							children: "Apply"
						})]
					})]
				})
			]
		})]
	});
}
function ReportConfigPanel({ open, onClose, filters, onChange, objectOptions, onApply, onExport }) {
	const selectedCompanies = filters.companies || [];
	const selectedBranches = filters.branches || [];
	filters.groups;
	filters.types;
	const selectedVehicleIds = filters.objects || [];
	const [filterOverlayOpen, setFilterOverlayOpen] = (0, import_react.useState)(false);
	const companyOptions = (0, import_react.useMemo)(() => {
		return COMPANIES.filter((c) => c !== "All");
	}, []);
	const branchOptions = (0, import_react.useMemo)(() => {
		return getBranchesForCompanies(selectedCompanies);
	}, [selectedCompanies]);
	const availableGroups = (0, import_react.useMemo)(() => {
		return getGroupsForBranches(selectedBranches);
	}, [selectedBranches]);
	const groupOptions = (0, import_react.useMemo)(() => {
		return availableGroups.length > 0 ? availableGroups : [
			"HP Group",
			"Trucks",
			"Buses",
			"Cars",
			"Cold Chain"
		];
	}, [availableGroups]);
	const typeOptions = (0, import_react.useMemo)(() => {
		return VEHICLE_TYPES.filter((t) => t !== "All");
	}, []);
	const brandOptions = (0, import_react.useMemo)(() => {
		return ["Ashok Leyland", ...VEHICLE_BRANDS.filter((b) => b !== "All" && b !== "Ashok Leyland")];
	}, []);
	const modelOptions = (0, import_react.useMemo)(() => {
		return ["10 Wheel", ...VEHICLE_MODELS.filter((m) => m !== "All" && m !== "10 Wheel")];
	}, []);
	const allVehiclesList = (0, import_react.useMemo)(() => {
		return fleetObjects.map((f) => ({
			id: f.id,
			name: f.name,
			imei: f.imei,
			branch: f.branch || "Head Office",
			driver: f.driver || "Unassigned",
			type: f.type,
			company: f.company || "HP Company"
		}));
	}, []);
	const allFilteredVehicles = (0, import_react.useMemo)(() => {
		return allVehiclesList.filter((v) => {
			if (selectedCompanies.length > 0 && !selectedCompanies.includes("All") && !selectedCompanies.includes(v.company)) return false;
			if (selectedBranches.length > 0 && !selectedBranches.includes("All") && !selectedBranches.includes(v.branch)) return false;
			return true;
		});
	}, [
		allVehiclesList,
		selectedCompanies,
		selectedBranches
	]);
	const allFilteredVehicleIds = (0, import_react.useMemo)(() => {
		return allFilteredVehicles.map((v) => v.id);
	}, [allFilteredVehicles]);
	const activeFilterCount = (0, import_react.useMemo)(() => {
		let count = 0;
		if (selectedCompanies.length > 0 && !selectedCompanies.includes("All")) count++;
		if (selectedBranches.length > 0 && !selectedBranches.includes("All")) count++;
		return count;
	}, [selectedCompanies, selectedBranches]);
	const companyChipText = (0, import_react.useMemo)(() => {
		if (!selectedCompanies || selectedCompanies.length === 0 || selectedCompanies.includes("All")) return "All";
		if (selectedCompanies.length === 1) return selectedCompanies[0];
		return `${selectedCompanies[0]} +${selectedCompanies.length - 1}`;
	}, [selectedCompanies]);
	const branchChipText = (0, import_react.useMemo)(() => {
		if (!selectedBranches || selectedBranches.length === 0 || selectedBranches.includes("All")) return "All";
		if (selectedBranches.length === 1) return selectedBranches[0];
		return `${selectedBranches[0]} +${selectedBranches.length - 1}`;
	}, [selectedBranches]);
	const [vehicleSearch, setVehicleSearch] = (0, import_react.useState)("");
	const [openBranchGroups, setOpenBranchGroups] = (0, import_react.useState)(() => [
		"Indonesia",
		"Thailand",
		"Valsad",
		"Planet Eco AL Khabaisi",
		"Planet Eco AL Nakheel",
		"Pune",
		"Itriangle"
	]);
	const groupedVehicles = (0, import_react.useMemo)(() => {
		const q = vehicleSearch.trim().toLowerCase();
		const filtered = allFilteredVehicles.filter((v) => {
			if (!q) return true;
			const matchName = v.name.toLowerCase().includes(q);
			const matchImei = v.imei.toLowerCase().includes(q);
			const matchBranch = v.branch.toLowerCase().includes(q);
			const matchDriver = v.driver.toLowerCase().includes(q);
			return matchName || matchImei || matchBranch || matchDriver;
		});
		const groupsMap = {};
		filtered.forEach((v) => {
			if (!groupsMap[v.branch]) groupsMap[v.branch] = [];
			groupsMap[v.branch].push(v);
		});
		return Object.entries(groupsMap).map(([branch, vehicles]) => ({
			branch,
			vehicles
		}));
	}, [allFilteredVehicles, vehicleSearch]);
	const allVehiclesSelected = allFilteredVehicleIds.length > 0 && allFilteredVehicleIds.every((id) => selectedVehicleIds.includes(id));
	const someVehiclesSelected = selectedVehicleIds.length > 0 && !allVehiclesSelected;
	const toggleSelectAllVehicles = () => {
		if (allVehiclesSelected) onChange({ objects: [] });
		else onChange({ objects: allFilteredVehicleIds });
	};
	const toggleBranchVehicles = (branchVehicles) => {
		const branchIds = branchVehicles.map((v) => v.id);
		if (branchIds.every((id) => selectedVehicleIds.includes(id))) onChange({ objects: selectedVehicleIds.filter((id) => !branchIds.includes(id)) });
		else onChange({ objects: Array.from(/* @__PURE__ */ new Set([...selectedVehicleIds, ...branchIds])) });
	};
	const toggleVehicle = (id) => {
		if (selectedVehicleIds.includes(id)) onChange({ objects: selectedVehicleIds.filter((vId) => vId !== id) });
		else onChange({ objects: [...selectedVehicleIds, id] });
	};
	const toggleBranchAccordion = (branch) => {
		setOpenBranchGroups((prev) => prev.includes(branch) ? prev.filter((b) => b !== branch) : [...prev, branch]);
	};
	const toggleAllBranchAccordions = () => {
		if (openBranchGroups.length === groupedVehicles.length) setOpenBranchGroups([]);
		else setOpenBranchGroups(groupedVehicles.map((g) => g.branch));
	};
	const handleReset = () => {
		onChange({
			companies: [],
			branches: [],
			groups: [],
			types: [],
			brands: [],
			models: [],
			durationCompare: "Greater Than",
			durationUnit: "Hour",
			durationValue: "",
			distanceCompare: "Greater Than",
			distanceValue: "",
			objects: []
		});
		setVehicleSearch("");
		toast.info("Report filter options reset to default");
	};
	const handleDrawerApply = () => {
		onApply();
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": "Close filter",
		onClick: onClose,
		className: "fixed top-[45px] bottom-0 left-0 sm:left-[68px] right-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
	}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		"aria-hidden": !open,
		"aria-label": "Report filter options",
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
				className: "flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5 custom-scrollbar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-7.5 items-center gap-1.5 rounded-md border border-input/80 bg-background px-2.5 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] hover:border-[#0089FF]/60 transition-all",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: vehicleSearch,
									onChange: (e) => setVehicleSearch(e.target.value),
									placeholder: "Select vehicle",
									"aria-label": "Search vehicles",
									className: "h-full flex-1 bg-transparent text-xs font-medium text-foreground placeholder:font-medium placeholder:italic placeholder:text-muted-foreground/60 focus:outline-none min-w-0"
								}),
								vehicleSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setVehicleSearch(""),
									className: "text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded mr-0.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setFilterOverlayOpen(!filterOverlayOpen),
									className: "flex items-center gap-1 px-1 py-0.5 text-xs font-semibold text-[#0089FF] hover:text-[#0070d6] transition-colors cursor-pointer select-none shrink-0 active:scale-95",
									title: "Filter by Company and Branch",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-3.5 w-3.5 text-[#0089FF]" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Filter" }),
										activeFilterCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-1.5 py-0.2 rounded-full text-[9px] font-bold leading-tight bg-[#0089FF] text-white",
											children: activeFilterCount
										})
									]
								})
							]
						}), filterOverlayOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "fixed inset-0 z-40 bg-black/10",
							onClick: () => setFilterOverlayOpen(false)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute top-full left-0 right-0 z-50 mt-1.5 rounded-xl border border-border/80 bg-card p-4 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 space-y-3 custom-scrollbar",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border/60 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-foreground",
										children: "Filter Attributes"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setFilterOverlayOpen(false),
										className: "p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[11px] font-semibold text-foreground",
										children: "Company"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UniversalMultiSelectDropdown, {
										label: "Company",
										selected: selectedCompanies,
										options: companyOptions,
										onChange: (companies) => onChange({ companies }),
										placeholder: "Select Company"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[11px] font-semibold text-foreground",
										children: "Branch"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UniversalMultiSelectDropdown, {
										label: "Branch",
										selected: selectedBranches,
										options: branchOptions,
										onChange: (branches) => onChange({ branches }),
										placeholder: "Select Branch"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pt-2 border-t border-border/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											onChange({
												companies: [],
												branches: []
											});
										},
										className: "text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer",
										children: "Reset"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setFilterOverlayOpen(false),
										className: "px-3.5 py-1 rounded-md bg-[#0089FF] text-white text-xs font-semibold hover:bg-[#0070d6] cursor-pointer shadow-xs",
										children: "Done"
									})]
								})
							]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1.5 shrink-0 select-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setFilterOverlayOpen(true),
							className: "inline-flex items-center gap-1 rounded-md bg-muted/50 hover:bg-muted border border-border/70 px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors cursor-pointer shadow-2xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Company:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: companyChipText
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setFilterOverlayOpen(true),
							className: "inline-flex items-center gap-1 rounded-md bg-muted/50 hover:bg-muted border border-border/70 px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors cursor-pointer shadow-2xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Branch:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: branchChipText
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border/60 bg-muted/40 px-3 py-2 shrink-0 select-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: allVehiclesSelected,
										ref: (el) => {
											if (el) el.indeterminate = someVehiclesSelected;
										},
										onChange: toggleSelectAllVehicles,
										className: "rounded border-input text-[#0089FF] cursor-pointer h-3.5 w-3.5 accent-[#0089FF]"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Select all" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] font-medium text-muted-foreground",
										children: [selectedVehicleIds.length, " selected"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: toggleAllBranchAccordions,
										className: "text-[10px] text-muted-foreground hover:text-[#0089FF] font-semibold flex items-center gap-0.5 cursor-pointer p-0.5 rounded hover:bg-muted",
										title: "Expand/Collapse All Branches",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsUpDown, { className: "h-3 w-3" })
									})]
								})]
							}),
							selectedVehicleIds.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-3 my-1.5 px-2.5 py-1.5 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200/70 dark:border-red-800/40 text-[10px] text-red-600 dark:text-red-400 font-medium leading-snug shrink-0",
								children: "Select at least one vehicle, or all vehicles will be included."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "max-h-[190px] overflow-y-auto p-1 divide-y divide-border/40 custom-scrollbar",
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
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-150", isExpanded && "rotate-90") }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "truncate",
															children: branch
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-[10px] tabular-nums text-muted-foreground font-normal",
															children: [
																"[",
																vehicles.length,
																"]"
															]
														})
													]
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
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 pt-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[11px] font-semibold text-foreground",
									children: "Group"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UniversalMultiSelectDropdown, {
									label: "Group",
									selected: filters.groups || [],
									options: groupOptions,
									onChange: (groups) => onChange({ groups }),
									placeholder: "Select Group"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[11px] font-semibold text-foreground",
									children: "Type"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UniversalMultiSelectDropdown, {
									label: "Type",
									selected: filters.types || [],
									options: typeOptions,
									onChange: (types) => onChange({ types }),
									placeholder: "Select Type"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[11px] font-semibold text-foreground",
									children: "Brand"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectDropdown$1, {
									value: filters.brands?.[0] || "",
									options: brandOptions,
									onChange: (b) => onChange({ brands: [b] }),
									placeholder: "Select Brand"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[11px] font-semibold text-foreground",
									children: "Model"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectDropdown$1, {
									value: filters.models?.[0] || "",
									options: modelOptions,
									onChange: (m) => onChange({ models: [m] }),
									placeholder: "Select Model"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[11px] font-semibold text-foreground",
									children: "Duration Threshold"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-12 gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "col-span-5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectDropdown$1, {
												value: filters.durationCompare || "Greater Than",
												options: COMPARATORS,
												onChange: (durationCompare) => onChange({ durationCompare }),
												placeholder: "Comparator"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "col-span-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectDropdown$1, {
												value: filters.durationUnit || "Hour",
												options: DURATION_UNITS,
												onChange: (durationUnit) => onChange({ durationUnit }),
												placeholder: "Unit"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "col-span-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												value: filters.durationValue || "",
												onChange: (e) => onChange({ durationValue: e.target.value }),
												placeholder: "e.g. 5",
												className: "h-7.5 w-full rounded-md border border-input/80 bg-background px-2 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 shadow-2xs transition-all"
											})
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[11px] font-semibold text-foreground",
									children: "Group"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-12 gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-span-7",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectDropdown$1, {
											value: filters.distanceCompare || "Greater Than",
											options: COMPARATORS,
											onChange: (distanceCompare) => onChange({ distanceCompare }),
											placeholder: "Comparator"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-span-5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: filters.distanceValue || "",
											onChange: (e) => onChange({ distanceValue: e.target.value }),
											placeholder: "e.g. 5",
											className: "h-7.5 w-full rounded-md border border-input/80 bg-background px-2 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 shadow-2xs transition-all"
										})
									})]
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "flex h-[56px] items-center justify-between border-t border-border bg-background px-5 shrink-0 select-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handleReset,
					className: "inline-flex items-center gap-1.5 rounded-md border border-input/80 bg-background px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-muted cursor-pointer shadow-2xs active:scale-98",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reset" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: handleDrawerApply,
					className: "h-8 rounded-md bg-[#0089FF] px-5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#0070d6] cursor-pointer active:scale-98",
					children: "Apply Filters"
				})]
			})
		]
	})] });
}
var DEFAULT_REPORT_COLUMNS = [
	{
		id: "vehicleNo",
		label: "Vehicle No",
		showable: true,
		printable: true,
		sortable: true,
		sortPriority: 1,
		sortDir: "asc",
		pinned: true,
		originalIndex: 0
	},
	{
		id: "employeeNo",
		label: "Employee No",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: true,
		originalIndex: 1
	},
	{
		id: "imei",
		label: "IMEI No",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 2
	},
	{
		id: "startLocation",
		label: "Start Location",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 3
	},
	{
		id: "startOdometer",
		label: "Start Odometer",
		showable: true,
		printable: true,
		sortable: true,
		sortPriority: null,
		sortDir: "asc",
		numeric: true,
		pinned: false,
		originalIndex: 4
	},
	{
		id: "firstIgnitionOn",
		label: "First Ignition ON",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 5
	},
	{
		id: "distance",
		label: "Distance",
		showable: true,
		printable: true,
		sortable: true,
		sortPriority: null,
		sortDir: "desc",
		numeric: true,
		pinned: false,
		originalIndex: 6
	},
	{
		id: "idleVsInactive",
		label: "Idle V/S Inactive",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 7
	},
	{
		id: "running",
		label: "Running (HH:MM:SS)",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 8
	},
	{
		id: "idle",
		label: "Idle (HH:MM:SS)",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 9
	},
	{
		id: "stop",
		label: "Stop (HH:MM:SS)",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 10
	},
	{
		id: "inactive",
		label: "Inactive (HH:MM:SS)",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 11
	},
	{
		id: "duration",
		label: "Duration (HH:MM:SS)",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 12
	},
	{
		id: "workDuration",
		label: "Work Duration",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 13
	},
	{
		id: "workingDays",
		label: "Working Days",
		showable: true,
		printable: false,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 14
	},
	{
		id: "maxStoppage",
		label: "Max Stoppage",
		showable: true,
		printable: false,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 15
	},
	{
		id: "noOfIdle",
		label: "No of Idle",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		numeric: true,
		pinned: false,
		originalIndex: 16
	},
	{
		id: "speed_group",
		label: "Speed",
		isGroupHeader: true,
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 17
	},
	{
		id: "avgSpeed",
		label: "AVG",
		group: "Speed",
		showable: true,
		printable: true,
		sortable: true,
		sortPriority: null,
		sortDir: "desc",
		numeric: true,
		pinned: false,
		originalIndex: 18
	},
	{
		id: "maxSpeed",
		label: "MAX",
		group: "Speed",
		showable: true,
		printable: true,
		sortable: true,
		sortPriority: null,
		sortDir: "desc",
		numeric: true,
		pinned: false,
		originalIndex: 19
	},
	{
		id: "cost_group",
		label: "Cost based on",
		isGroupHeader: true,
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 20
	},
	{
		id: "costDistance",
		label: "Distance",
		group: "Cost based on",
		showable: true,
		printable: true,
		sortable: true,
		sortPriority: null,
		sortDir: "desc",
		numeric: true,
		pinned: false,
		originalIndex: 21
	},
	{
		id: "costDuration",
		label: "Duration",
		group: "Cost based on",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "desc",
		numeric: true,
		pinned: false,
		originalIndex: 22
	},
	{
		id: "overSpeed",
		label: "Over speed",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 23
	},
	{
		id: "alerts",
		label: "Alert(s)",
		showable: true,
		printable: false,
		sortable: true,
		sortPriority: null,
		sortDir: "desc",
		numeric: true,
		pinned: false,
		originalIndex: 24
	},
	{
		id: "endOdometer",
		label: "End Odometer",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		numeric: true,
		pinned: false,
		originalIndex: 25
	},
	{
		id: "lastIgnitionOff",
		label: "Last Ignition OFF",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 26
	},
	{
		id: "endLocation",
		label: "End Location",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 27
	},
	{
		id: "playback",
		label: "Playback",
		showable: true,
		printable: false,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 28
	},
	{
		id: "distanceUnit",
		label: "Distance Unit",
		showable: false,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 29
	},
	{
		id: "company",
		label: "Company / Logo",
		showable: false,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 30
	}
];
var DEFAULT_DETAIL_COLUMNS = [
	{
		id: "tripNo",
		label: "Trip / Serial No",
		showable: true,
		printable: true,
		sortable: true,
		sortPriority: 1,
		sortDir: "asc",
		pinned: true,
		originalIndex: 0
	},
	{
		id: "date",
		label: "Date",
		showable: true,
		printable: true,
		sortable: true,
		sortPriority: null,
		sortDir: "desc",
		pinned: false,
		originalIndex: 1
	},
	{
		id: "firstIgnitionOn",
		label: "First Ignition ON",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 2
	},
	{
		id: "startLocation",
		label: "Start Location",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 3
	},
	{
		id: "distance",
		label: "Distance (km)",
		showable: true,
		printable: true,
		sortable: true,
		sortPriority: null,
		sortDir: "desc",
		numeric: true,
		pinned: false,
		originalIndex: 4
	},
	{
		id: "running",
		label: "Running Time",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 5
	},
	{
		id: "idle",
		label: "Idle Time",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 6
	},
	{
		id: "stop",
		label: "Stop Time",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 7
	},
	{
		id: "alerts",
		label: "Alerts & Violations",
		showable: true,
		printable: true,
		sortable: true,
		sortPriority: null,
		sortDir: "desc",
		numeric: true,
		pinned: false,
		originalIndex: 8
	},
	{
		id: "lastIgnitionOn",
		label: "Last Ignition OFF",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 9
	},
	{
		id: "endLocation",
		label: "End Location",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 10
	},
	{
		id: "playback",
		label: "Playback Route",
		showable: true,
		printable: false,
		sortable: false,
		sortPriority: null,
		sortDir: "asc",
		pinned: false,
		originalIndex: 11
	}
];
var DEFAULT_COLUMN_SETTINGS = {
	columns: DEFAULT_REPORT_COLUMNS,
	detailColumns: DEFAULT_DETAIL_COLUMNS,
	frozenColumnsCount: 2,
	detailFrozenColumnsCount: 1,
	detailDownloadMode: "multiple",
	detailScreenSetting: "summary",
	exportDataScope: "summary"
};
/**
* Normalizes columns to ensure `pinned` and `originalIndex` exist.
* Keeps pinned columns at the top in order.
*/
function normalizeColumnList(cols, frozenCount = 2) {
	const initialized = cols.map((c, idx) => ({
		...c,
		pinned: c.pinned !== void 0 ? c.pinned : c.showable && idx < frozenCount && !c.isGroupHeader,
		originalIndex: c.originalIndex !== void 0 ? c.originalIndex : idx
	}));
	const pinned = initialized.filter((c) => c.pinned);
	const unpinned = initialized.filter((c) => !c.pinned);
	return [...pinned, ...unpinned];
}
function ColumnConfigModal({ open, onClose, settings, onSave }) {
	const [activeTab, setActiveTab] = (0, import_react.useState)("summary");
	const [summaryColumns, setSummaryColumns] = (0, import_react.useState)(() => normalizeColumnList(settings.columns || DEFAULT_REPORT_COLUMNS, settings.frozenColumnsCount ?? 2));
	const [detailColumns, setDetailColumns] = (0, import_react.useState)(() => normalizeColumnList(settings.detailColumns || DEFAULT_DETAIL_COLUMNS, settings.detailFrozenColumnsCount ?? 1));
	const [detailDownloadMode, setDetailDownloadMode] = (0, import_react.useState)(settings.detailDownloadMode || "multiple");
	const [exportDataScope, setExportDataScope] = (0, import_react.useState)(settings.exportDataScope || "summary");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [dragIndex, setDragIndex] = (0, import_react.useState)(null);
	const [dragOverIndex, setDragOverIndex] = (0, import_react.useState)(null);
	const [showRestoreConfirm, setShowRestoreConfirm] = (0, import_react.useState)(false);
	const rowRefs = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const prevRects = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const [animatingId, setAnimatingId] = (0, import_react.useState)(null);
	import_react.useEffect(() => {
		if (open) {
			setSummaryColumns(normalizeColumnList(settings.columns || DEFAULT_REPORT_COLUMNS, settings.frozenColumnsCount ?? 2));
			setDetailColumns(normalizeColumnList(settings.detailColumns || DEFAULT_DETAIL_COLUMNS, settings.detailFrozenColumnsCount ?? 1));
			setActiveTab(settings.detailScreenSetting || "summary");
			setDetailDownloadMode(settings.detailDownloadMode || "multiple");
			setExportDataScope(settings.exportDataScope || "summary");
			setSearchQuery("");
			setDragIndex(null);
			setDragOverIndex(null);
			setShowRestoreConfirm(false);
			setAnimatingId(null);
			prevRects.current.clear();
		}
	}, [open, settings]);
	const currentColumns = activeTab === "summary" ? summaryColumns : detailColumns;
	const setCurrentColumns = (updater) => {
		if (activeTab === "summary") setSummaryColumns(updater);
		else setDetailColumns(updater);
	};
	const pinnedCount = (0, import_react.useMemo)(() => {
		return currentColumns.filter((c) => c.pinned && !c.isGroupHeader).length;
	}, [currentColumns]);
	const capturePositions = () => {
		const rects = /* @__PURE__ */ new Map();
		rowRefs.current.forEach((el, id) => {
			if (el) rects.set(id, el.getBoundingClientRect().top);
		});
		prevRects.current = rects;
	};
	(0, import_react.useLayoutEffect)(() => {
		if (prevRects.current.size === 0) return;
		rowRefs.current.forEach((el, id) => {
			if (!el) return;
			const prevTop = prevRects.current.get(id);
			if (prevTop === void 0) return;
			const deltaY = prevTop - el.getBoundingClientRect().top;
			if (deltaY !== 0) {
				el.style.transform = `translate3d(0, ${deltaY}px, 0)`;
				el.style.transition = "none";
				if (id === animatingId) el.classList.add("z-30", "shadow-md", "ring-1", "ring-[#155dfc]/40", "bg-[#155dfc]/10");
				requestAnimationFrame(() => {
					el.getBoundingClientRect();
					el.style.transition = "transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease";
					el.style.transform = "translate3d(0, 0, 0)";
				});
			}
		});
		const timer = setTimeout(() => {
			rowRefs.current.forEach((el) => {
				if (el) {
					el.style.transform = "";
					el.style.transition = "";
					el.classList.remove("z-30", "shadow-md", "ring-1", "ring-[#155dfc]/40", "bg-[#155dfc]/10");
				}
			});
			prevRects.current.clear();
			setAnimatingId(null);
		}, 320);
		return () => clearTimeout(timer);
	}, [currentColumns, animatingId]);
	const handlePin = (colId) => {
		capturePositions();
		setAnimatingId(colId);
		setCurrentColumns((prev) => {
			const col = prev.find((c) => c.id === colId);
			if (!col) return prev;
			const pinnedList = prev.filter((c) => c.pinned && c.id !== colId);
			const unpinnedList = prev.filter((c) => !c.pinned && c.id !== colId);
			const updatedCol = {
				...col,
				pinned: true
			};
			return [
				...pinnedList,
				updatedCol,
				...unpinnedList
			];
		});
		const colItem = currentColumns.find((c) => c.id === colId);
		toast.success(`Pinned "${colItem?.label || colId}"`, { description: "Moved to top pinned columns area" });
	};
	const handleUnpin = (colId) => {
		capturePositions();
		setAnimatingId(colId);
		setCurrentColumns((prev) => {
			const col = prev.find((c) => c.id === colId);
			if (!col) return prev;
			const pinnedList = prev.filter((c) => c.pinned && c.id !== colId);
			const unpinnedList = prev.filter((c) => !c.pinned && c.id !== colId);
			const updatedCol = {
				...col,
				pinned: false
			};
			const targetOrigIdx = col.originalIndex ?? 999;
			let insertIdx = unpinnedList.findIndex((c) => (c.originalIndex ?? 999) > targetOrigIdx);
			if (insertIdx === -1) insertIdx = unpinnedList.length;
			const nextUnpinned = [...unpinnedList];
			nextUnpinned.splice(insertIdx, 0, updatedCol);
			return [...pinnedList, ...nextUnpinned];
		});
		const colItem = currentColumns.find((c) => c.id === colId);
		toast.info(`Unpinned "${colItem?.label || colId}"`, { description: "Returned to standard column list" });
	};
	const filteredColumns = (0, import_react.useMemo)(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return currentColumns;
		return currentColumns.filter((c) => c.label.toLowerCase().includes(q) || c.group && c.group.toLowerCase().includes(q));
	}, [currentColumns, searchQuery]);
	const updateColumn = (id, patch) => {
		setCurrentColumns((prev) => prev.map((c) => c.id === id ? {
			...c,
			...patch
		} : c));
	};
	const moveColumn = (fromIdx, toIdx) => {
		if (toIdx < 0 || toIdx >= currentColumns.length) return;
		const fromCol = currentColumns[fromIdx];
		const toCol = currentColumns[toIdx];
		if (!fromCol || !toCol) return;
		if (fromCol.pinned !== toCol.pinned) return;
		capturePositions();
		setCurrentColumns((prev) => {
			const next = [...prev];
			const [item] = next.splice(fromIdx, 1);
			if (item) next.splice(toIdx, 0, item);
			return next;
		});
	};
	const handleReset = () => {
		setSummaryColumns(normalizeColumnList(settings.columns || DEFAULT_REPORT_COLUMNS, settings.frozenColumnsCount ?? 2));
		setDetailColumns(normalizeColumnList(settings.detailColumns || DEFAULT_DETAIL_COLUMNS, settings.detailFrozenColumnsCount ?? 1));
		setDetailDownloadMode(settings.detailDownloadMode || "multiple");
		setExportDataScope(settings.exportDataScope || "summary");
		setAnimatingId(null);
		prevRects.current.clear();
		toast.info("Unsaved changes discarded — returned to saved configuration");
	};
	const handleRestoreDefault = () => {
		setSummaryColumns(normalizeColumnList(DEFAULT_REPORT_COLUMNS, DEFAULT_COLUMN_SETTINGS.frozenColumnsCount));
		setDetailColumns(normalizeColumnList(DEFAULT_DETAIL_COLUMNS, DEFAULT_COLUMN_SETTINGS.detailFrozenColumnsCount ?? 1));
		setDetailDownloadMode("multiple");
		setExportDataScope("summary");
		setShowRestoreConfirm(false);
		setAnimatingId(null);
		prevRects.current.clear();
		toast.success("Default column configuration restored");
	};
	const handleSave = () => {
		const summaryPinnedCount = summaryColumns.filter((c) => c.pinned && !c.isGroupHeader).length;
		const detailPinnedCount = detailColumns.filter((c) => c.pinned && !c.isGroupHeader).length;
		onSave({
			columns: summaryColumns,
			detailColumns,
			frozenColumnsCount: summaryPinnedCount,
			detailFrozenColumnsCount: detailPinnedCount,
			detailDownloadMode,
			detailScreenSetting: activeTab,
			exportDataScope
		});
		toast.success("Column configuration saved permanently");
		onClose();
	};
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
		delayDuration: 150,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-[80] flex items-center justify-center p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Close Column Setting",
					onClick: onClose,
					className: "fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 flex h-[600px] max-h-[88vh] w-[820px] max-w-[94vw] flex-col rounded-lg border border-border bg-white dark:bg-slate-900 text-foreground shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "flex h-[56px] items-center justify-between border-b border-border px-6 bg-white dark:bg-slate-900 select-none shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-[16px] font-semibold tracking-tight text-slate-900 dark:text-slate-100",
								children: "Column Setting"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Close Column Setting",
								onClick: onClose,
								className: "rounded-md p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-b border-[#DFE3EB] dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 px-6 flex items-center justify-between gap-4 text-xs select-none shrink-0 h-11",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-6 h-full",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											setActiveTab("summary");
											setSearchQuery("");
										},
										className: cn("relative h-full font-semibold transition-all cursor-pointer flex items-center gap-2 text-xs", activeTab === "summary" ? "text-[#0089FF] font-bold" : "text-slate-600 dark:text-slate-400 hover:text-[#0089FF]"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Summary Report" }), activeTab === "summary" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-[#0089FF] rounded-t-full shadow-xs" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											setActiveTab("detail");
											setSearchQuery("");
										},
										className: cn("relative h-full font-semibold transition-all cursor-pointer flex items-center gap-2 text-xs", activeTab === "detail" ? "text-[#0089FF] font-bold" : "text-slate-600 dark:text-slate-400 hover:text-[#0089FF]"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Detail Report" }), activeTab === "detail" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-[#0089FF] rounded-t-full shadow-xs" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											setActiveTab("preference");
											setSearchQuery("");
										},
										className: cn("relative h-full font-semibold transition-all cursor-pointer flex items-center gap-2 text-xs", activeTab === "preference" ? "text-[#0089FF] font-bold" : "text-slate-600 dark:text-slate-400 hover:text-[#0089FF]"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Preference" }), activeTab === "preference" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-[#0089FF] rounded-t-full shadow-xs" })]
									})
								]
							})
						}),
						activeTab === "preference" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 min-h-0 overflow-y-auto px-6 py-5 bg-white dark:bg-slate-900 select-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "max-w-xl space-y-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-semibold text-slate-900 dark:text-slate-100 block",
										children: "Download Layout"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col sm:flex-row sm:items-center gap-6 pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											onClick: () => setDetailDownloadMode("multiple"),
											className: "flex items-start gap-2.5 cursor-pointer text-xs select-none",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "radio",
												name: "modal-excel-mode",
												checked: detailDownloadMode === "multiple",
												onChange: () => setDetailDownloadMode("multiple"),
												className: "mt-0.5 h-4 w-4 accent-[#0089FF] text-[#0089FF] cursor-pointer"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-semibold text-slate-900 dark:text-slate-100",
													children: "Multiple Sheets (By Branch)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-slate-500 dark:text-slate-400 font-normal",
													children: "Each branch in a separate Excel worksheet"
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											onClick: () => setDetailDownloadMode("single"),
											className: "flex items-start gap-2.5 cursor-pointer text-xs select-none",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "radio",
												name: "modal-excel-mode",
												checked: detailDownloadMode === "single",
												onChange: () => setDetailDownloadMode("single"),
												className: "mt-0.5 h-4 w-4 accent-[#0089FF] text-[#0089FF] cursor-pointer"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-semibold text-slate-900 dark:text-slate-100",
													children: "Single Sheet (Consolidated)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-slate-500 dark:text-slate-400 font-normal",
													children: "All branches on a single Excel worksheet"
												})]
											})]
										})]
									})]
								})
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 min-h-0 flex flex-col bg-white dark:bg-slate-900 overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1 min-h-0 overflow-y-auto select-none",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full border-collapse text-left text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "sticky top-0 z-20 bg-[#EAF0F6] dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-b border-[#DFE3EB] dark:border-slate-700 select-none",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "w-10 px-2 py-2.5 text-center text-slate-600 dark:text-slate-400 font-bold text-[11px]",
												children: "#"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3.5 py-2.5 font-bold text-slate-900 dark:text-slate-100 text-xs",
												children: "Column"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "w-20 px-2 py-2.5 text-center font-bold text-slate-900 dark:text-slate-100 text-xs",
												children: "Showable"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "w-20 px-2 py-2.5 text-center font-bold text-slate-900 dark:text-slate-100 text-xs",
												children: "Printable"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "w-20 px-2 py-2.5 text-center font-bold text-slate-900 dark:text-slate-100 text-xs",
												children: "Sortable"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "w-24 px-2 py-2.5 text-center font-bold text-slate-900 dark:text-slate-100 text-xs",
												children: "Sort Priority"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "w-24 px-2 py-2.5 text-center font-bold text-slate-900 dark:text-slate-100 text-xs",
												children: "Sorting"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
										className: "divide-y divide-[#DFE3EB] dark:divide-slate-800",
										children: [filteredColumns.map((col, idx) => {
											const actualIndex = currentColumns.findIndex((c) => c.id === col.id);
											if (col.isGroupHeader) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												ref: (el) => {
													if (el) rowRefs.current.set(col.id, el);
													else rowRefs.current.delete(col.id);
												},
												className: "bg-slate-100/70 dark:bg-slate-800/70 font-semibold text-slate-900 dark:text-slate-100 border-y border-[#DFE3EB] dark:border-slate-700",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-3 py-2 text-center text-slate-400",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "h-3.5 w-3.5 mx-auto opacity-40" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													colSpan: 6,
													className: "px-4 py-2 tracking-wide text-xs font-bold text-slate-900 dark:text-slate-100",
													children: col.label
												})]
											}, col.id);
											const isPinned = !!col.pinned;
											const isLastPinned = isPinned && (idx === filteredColumns.length - 1 || !filteredColumns[idx + 1]?.pinned);
											const isDragging = dragIndex === actualIndex;
											const isDragOver = dragOverIndex === actualIndex;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												ref: (el) => {
													if (el) rowRefs.current.set(col.id, el);
													else rowRefs.current.delete(col.id);
												},
												draggable: true,
												onDragStart: (e) => {
													setDragIndex(actualIndex);
													e.dataTransfer.effectAllowed = "move";
													e.dataTransfer.setData("text/plain", col.id);
												},
												onDragOver: (e) => {
													e.preventDefault();
													if (dragIndex !== null && dragIndex !== actualIndex) setDragOverIndex(actualIndex);
												},
												onDragLeave: () => setDragOverIndex(null),
												onDrop: (e) => {
													e.preventDefault();
													if (dragIndex !== null && dragIndex !== actualIndex) moveColumn(dragIndex, actualIndex);
													setDragIndex(null);
													setDragOverIndex(null);
												},
												onDragEnd: () => {
													setDragIndex(null);
													setDragOverIndex(null);
												},
												className: cn("group transition-colors duration-75 relative border-b border-[#DFE3EB] dark:border-slate-800/80", isDragging && "opacity-30 bg-[#0089FF]/10", isDragOver && "border-t-2 border-[#0089FF] bg-[#0089FF]/5", isPinned ? "bg-[#0089FF]/[0.04] hover:bg-[#0089FF]/[0.08]" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-3 py-2 text-center",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															title: "Drag to reorder",
															className: "cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 rounded transition-colors",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "h-3.5 w-3.5" })
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-2 font-medium text-foreground",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: cn("flex items-center gap-2", col.group && "pl-4"),
															children: [
																col.group && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-[10px] text-slate-400 select-none",
																	children: "↳"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: cn("font-semibold text-xs text-slate-900 dark:text-slate-100", !col.showable && "text-slate-400 dark:text-slate-500", isPinned && "text-[#0089FF] dark:text-blue-400"),
																	children: col.label
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "ml-1 flex items-center",
																	children: isPinned ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
																		asChild: true,
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																			type: "button",
																			"aria-label": `Unpin column ${col.label}`,
																			onClick: () => handleUnpin(col.id),
																			className: "p-1 rounded text-[#0089FF] hover:bg-[#0089FF]/15 hover:text-red-500 transition-all cursor-pointer active:scale-90",
																			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "h-3.5 w-3.5 fill-[#0089FF]" })
																		})
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
																		side: "top",
																		children: "Unpin column"
																	})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
																		asChild: true,
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																			type: "button",
																			"aria-label": `Pin column ${col.label}`,
																			onClick: () => handlePin(col.id),
																			className: "p-1 rounded opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-slate-400 hover:text-[#0089FF] hover:bg-[#0089FF]/10 active:scale-90",
																			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "h-3.5 w-3.5" })
																		})
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
																		side: "top",
																		children: "Pin column"
																	})] })
																})
															]
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-2.5 py-2 text-center",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "checkbox",
															checked: col.showable,
															onChange: (e) => updateColumn(col.id, { showable: e.target.checked }),
															"aria-label": `Toggle showable for ${col.label}`,
															className: "h-4 w-4 rounded border-slate-300 dark:border-slate-600 accent-[#0089FF] text-[#0089FF] focus:ring-[#0089FF]/30 cursor-pointer"
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-2.5 py-2 text-center",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "checkbox",
															checked: col.printable,
															onChange: (e) => updateColumn(col.id, { printable: e.target.checked }),
															"aria-label": `Toggle printable for ${col.label}`,
															className: "h-4 w-4 rounded border-slate-300 dark:border-slate-600 accent-[#0089FF] text-[#0089FF] focus:ring-[#0089FF]/30 cursor-pointer"
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-2.5 py-2 text-center",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "checkbox",
															checked: col.sortable,
															onChange: (e) => {
																const checked = e.target.checked;
																updateColumn(col.id, {
																	sortable: checked,
																	sortPriority: checked ? col.sortPriority : null
																});
															},
															"aria-label": `Toggle sortable for ${col.label}`,
															className: "h-4 w-4 rounded border-slate-300 dark:border-slate-600 accent-[#0089FF] text-[#0089FF] focus:ring-[#0089FF]/30 cursor-pointer"
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-2.5 py-2 text-center",
														children: !col.sortable ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "h-6.5 px-2 text-[11px] font-medium text-slate-300 dark:text-slate-600 inline-flex items-center gap-1 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded cursor-not-allowed select-none",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "--" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-2.5 w-2.5 opacity-30" })]
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
															asChild: true,
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																type: "button",
																"aria-label": `Sort priority for ${col.label}`,
																className: "h-6.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 text-[11px] font-medium text-slate-800 dark:text-slate-200 hover:border-[#0089FF] focus:border-[#0089FF] focus:ring-1 focus:ring-[#0089FF] focus:outline-none cursor-pointer shadow-2xs inline-flex items-center gap-1 select-none transition-all active:scale-98",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: col.sortPriority ?? "--" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-2.5 w-2.5 text-slate-500 opacity-70" })]
															})
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
															align: "center",
															sideOffset: 4,
															className: "w-20 p-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md z-[95] select-none",
															children: [
																null,
																1,
																2,
																3
															].map((pVal) => {
																const isSelected = col.sortPriority === pVal;
																return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																	type: "button",
																	onClick: () => updateColumn(col.id, { sortPriority: pVal }),
																	className: cn("flex w-full items-center justify-between px-2 py-1 text-xs rounded cursor-pointer transition-colors text-left select-none", isSelected ? "bg-slate-100 dark:bg-slate-700 font-semibold text-foreground" : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium"),
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: pVal ?? "--" }), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-[#0089FF]" })]
																}, pVal ?? "none");
															})
														})] })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-2.5 py-2 text-center",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "inline-flex rounded border border-slate-300 dark:border-slate-700 overflow-hidden shadow-2xs",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																disabled: !col.sortable,
																onClick: () => updateColumn(col.id, { sortDir: "asc" }),
																className: cn("px-2 py-0.5 text-[10px] font-semibold transition-all cursor-pointer", col.sortable && col.sortDir === "asc" ? "bg-[#0089FF] text-white shadow-2xs" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50", !col.sortable && "opacity-40 cursor-not-allowed"),
																children: "Asc"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																disabled: !col.sortable,
																onClick: () => updateColumn(col.id, { sortDir: "desc" }),
																className: cn("px-2 py-0.5 text-[10px] font-semibold transition-all border-l border-slate-300 dark:border-slate-700 cursor-pointer", col.sortable && col.sortDir === "desc" ? "bg-[#0089FF] text-white shadow-2xs" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50", !col.sortable && "opacity-40 cursor-not-allowed"),
																children: "Des"
															})]
														})
													})
												]
											}), isLastPinned && pinnedCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
												className: "bg-slate-50/80 dark:bg-slate-900/50 select-none border-y border-[#DFE3EB] dark:border-slate-700",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													colSpan: 7,
													className: "px-4 py-1.5 text-center",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-center gap-3",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-[#DFE3EB] dark:bg-slate-700" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "inline-flex items-center gap-1.5 font-semibold text-[11px] text-[#0089FF] tracking-wide",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "h-3 w-3 fill-[#0089FF] text-[#0089FF]" }),
																	pinnedCount,
																	" ",
																	pinnedCount === 1 ? "column" : "columns",
																	" ",
																	"pinned"
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-[#DFE3EB] dark:bg-slate-700" })
														]
													})
												})
											}, "__pinned_separator__")] }, col.id);
										}), filteredColumns.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											colSpan: 7,
											className: "px-4 py-16 text-center text-xs text-muted-foreground",
											children: [
												"No columns match \"",
												searchQuery,
												"\"."
											]
										}) })]
									})]
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
							className: "flex h-14 items-center justify-between border-t border-border bg-slate-50/60 dark:bg-slate-900/60 px-6 shrink-0 select-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									title: "Undo all unsaved changes and return to the last saved configuration",
									onClick: handleReset,
									className: "inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-2xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-98 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "h-3.5 w-3.5 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reset" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									title: "Restore original system defaults",
									onClick: () => setShowRestoreConfirm(true),
									className: "inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-2xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-98 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Restore Default" })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: onClose,
									className: "h-8 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer shadow-2xs active:scale-98",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: handleSave,
									className: "h-8 rounded-md bg-[#0089FF] hover:bg-[#0077E6] px-5 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer active:scale-98",
									children: "Save"
								})]
							})]
						})
					]
				}),
				showRestoreConfirm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "fixed inset-0 z-[90] flex items-center justify-center p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer",
						onClick: () => setShowRestoreConfirm(false)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 w-full max-w-sm rounded-lg border border-border bg-white dark:bg-slate-900 p-6 text-foreground shadow-xl animate-in fade-in zoom-in-95 duration-150",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-bold text-slate-900 dark:text-slate-100",
								children: "Restore Default Configuration?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground leading-relaxed",
								children: "Are you sure you want to restore the default configuration? This will reset all column visibility, sorting, and pinned column settings to system defaults."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex items-center justify-end gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowRestoreConfirm(false),
									className: "h-8 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 cursor-pointer shadow-2xs active:scale-98",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: handleRestoreDefault,
									className: "h-8 rounded-md bg-[#0089FF] hover:bg-[#0077E6] px-4.5 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer active:scale-98",
									children: "Restore Default"
								})]
							})
						]
					})]
				})
			]
		})
	});
}
var DEFAULT_CHART_CONFIG = {
	header: "Running V/S Stop",
	xAxis: "Running",
	yAxis: "Stop"
};
var CHART_AXIS_OPTIONS = [
	"Running",
	"Stop",
	"Idle",
	"Inactive"
];
function ChartConfigModal({ open, onClose, config, onSave }) {
	const [header, setHeader] = (0, import_react.useState)(config.header);
	const [xAxis, setXAxis] = (0, import_react.useState)(config.xAxis);
	const [yAxis, setYAxis] = (0, import_react.useState)(config.yAxis);
	const [xAxisOpen, setXAxisOpen] = (0, import_react.useState)(false);
	const [yAxisOpen, setYAxisOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (open) {
			setHeader(config.header);
			setXAxis(config.xAxis);
			setYAxis(config.yAxis);
			setXAxisOpen(false);
			setYAxisOpen(false);
		}
	}, [open, config]);
	if (!open) return null;
	const handleXAxisChange = (newX) => {
		setXAxis(newX);
		setXAxisOpen(false);
		if (!header || header === `${xAxis} V/S ${yAxis}` || header === `${xAxis} V/S ${yAxis}`.trim()) setHeader(`${newX} V/S ${yAxis}`);
	};
	const handleYAxisChange = (newY) => {
		setYAxis(newY);
		setYAxisOpen(false);
		if (!header || header === `${xAxis} V/S ${yAxis}` || header === `${xAxis} V/S ${yAxis}`.trim()) setHeader(`${xAxis} V/S ${newY}`);
	};
	const handleSave = () => {
		if (!header.trim()) {
			toast.error("Please enter a header name");
			return;
		}
		onSave({
			header: header.trim(),
			xAxis,
			yAxis
		});
		toast.success("Chart comparison configured successfully");
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[80] flex items-center justify-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Close Chart Settings",
			onClick: onClose,
			className: "fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 overflow-hidden rounded-lg border border-border bg-white dark:bg-slate-900 text-foreground shadow-xl duration-150",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex h-[56px] items-center justify-between border-b border-border/70 px-6 bg-card/60 select-none shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[16px] font-semibold tracking-tight text-foreground",
						children: "Chart Comparison"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Close Chart",
						onClick: onClose,
						className: "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 space-y-4 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "chart-header",
								className: "text-xs font-semibold text-foreground",
								children: "Header :"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "chart-header",
									type: "text",
									value: header,
									onChange: (e) => setHeader(e.target.value),
									placeholder: "e.g. Running V/S Stop",
									className: "h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-muted-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "chart-xaxis",
								className: "text-xs font-semibold text-foreground",
								children: "X-Axis :"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-span-2 relative",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
									open: xAxisOpen,
									onOpenChange: setXAxisOpen,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											id: "chart-xaxis",
											type: "button",
											className: cn("flex h-7.5 w-full items-center justify-between rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-muted-foreground transition-all cursor-pointer shadow-2xs select-none hover:border-[#0089FF]/60 hover:bg-muted/40 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none", xAxisOpen && "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-muted/40"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate text-muted-foreground font-medium",
												children: xAxis
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-3.5 w-3.5 text-muted-foreground opacity-70 transition-transform duration-200 ml-1", xAxisOpen && "rotate-180") })]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
										align: "start",
										side: "bottom",
										sideOffset: 4,
										className: "w-[var(--radix-popover-trigger-width)] min-w-[220px] p-1 rounded-md border border-border bg-popover shadow-lg z-[100] select-none max-h-56 overflow-y-auto",
										children: CHART_AXIS_OPTIONS.map((opt) => {
											const isSelected = xAxis === opt;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => handleXAxisChange(opt),
												className: cn("flex w-full items-center justify-between px-2.5 py-1.5 text-xs rounded-sm cursor-pointer transition-colors text-left select-none", isSelected ? "bg-muted font-semibold text-foreground" : "text-foreground hover:bg-muted/80 font-medium"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: opt }), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-[#0089FF]" })]
											}, opt);
										})
									})]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "chart-yaxis",
								className: "text-xs font-semibold text-foreground",
								children: "Y-Axis :"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-span-2 relative",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
									open: yAxisOpen,
									onOpenChange: setYAxisOpen,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											id: "chart-yaxis",
											type: "button",
											className: cn("flex h-7.5 w-full items-center justify-between rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-muted-foreground transition-all cursor-pointer shadow-2xs select-none hover:border-[#0089FF]/60 hover:bg-muted/40 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none", yAxisOpen && "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-muted/40"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate text-muted-foreground font-medium",
												children: yAxis
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-3.5 w-3.5 text-muted-foreground opacity-70 transition-transform duration-200 ml-1", yAxisOpen && "rotate-180") })]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
										align: "start",
										side: "bottom",
										sideOffset: 4,
										className: "w-[var(--radix-popover-trigger-width)] min-w-[220px] p-1 rounded-md border border-border bg-popover shadow-lg z-[100] select-none max-h-56 overflow-y-auto",
										children: CHART_AXIS_OPTIONS.map((opt) => {
											const isSelected = yAxis === opt;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => handleYAxisChange(opt),
												className: cn("flex w-full items-center justify-between px-2.5 py-1.5 text-xs rounded-sm cursor-pointer transition-colors text-left select-none", isSelected ? "bg-muted font-semibold text-foreground" : "text-foreground hover:bg-muted/80 font-medium"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: opt }), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-[#0089FF]" })]
											}, opt);
										})
									})]
								})
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
					className: "flex items-center justify-end gap-2.5 border-t border-border bg-background px-6 py-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "h-8 min-w-[75px] rounded-md border border-input/80 bg-background px-3 text-xs font-medium text-foreground shadow-2xs transition-all hover:bg-muted cursor-pointer active:scale-98",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: handleSave,
						className: "h-8 min-w-[75px] rounded-md bg-[#0089FF] px-4 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#0077E6] cursor-pointer active:scale-98",
						children: "Save"
					})]
				})
			]
		})]
	});
}
function Shell({ title, subtitle, onClose, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[80] flex items-center justify-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Close " + title,
			onClick: onClose,
			className: "fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 overflow-hidden rounded-lg border border-border bg-white dark:bg-slate-900 text-foreground shadow-xl duration-150",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex h-[56px] items-center justify-between border-b border-border px-6 bg-white dark:bg-slate-900 shrink-0 select-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[16px] font-semibold tracking-tight text-slate-900 dark:text-slate-100",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Close " + title,
						onClick: onClose,
						className: "rounded-md p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-[60vh] overflow-y-auto p-6 text-xs space-y-4",
					children
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
					className: "flex justify-end border-t border-border bg-slate-50/60 dark:bg-slate-900/60 px-6 py-3.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "h-8 rounded-md bg-[#0089FF] hover:bg-[#0077E6] px-5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer active:scale-98",
						children: "Done"
					})
				})
			]
		})]
	});
}
function ReportModals({ kind, onClose, columns, hidden = [], onToggleColumn, columnSettings, onSaveColumnSettings, chartConfig, onSaveChartConfig, chartType, onChartType }) {
	if (kind === null) return null;
	if (kind === "columns") {
		if (columnSettings && onSaveColumnSettings) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColumnConfigModal, {
			open: true,
			onClose,
			settings: columnSettings,
			onSave: onSaveColumnSettings
		});
		if (columns) {
			const fallbackSettings = {
				columns: columns.map((c, i) => ({
					id: c.key,
					label: c.label,
					showable: !hidden.includes(c.key),
					printable: true,
					sortable: true,
					sortPriority: i === 0 ? 1 : null,
					sortDir: "asc"
				})),
				frozenColumnsCount: 2,
				detailDownloadMode: "multiple",
				detailScreenSetting: "summary"
			};
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColumnConfigModal, {
				open: true,
				onClose,
				settings: fallbackSettings,
				onSave: (newSettings) => {
					if (onToggleColumn) newSettings.columns.forEach((col) => {
						const wasHidden = hidden.includes(col.id);
						if (col.showable && wasHidden) onToggleColumn(col.id);
						else if (!col.showable && !wasHidden) onToggleColumn(col.id);
					});
				}
			});
		}
	}
	if (kind === "chart") {
		if (chartConfig && onSaveChartConfig) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartConfigModal, {
			open: true,
			onClose,
			config: chartConfig,
			onSave: onSaveChartConfig
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartConfigModal, {
			open: true,
			onClose,
			config: DEFAULT_CHART_CONFIG,
			onSave: (cfg) => {
				if (onSaveChartConfig) onSaveChartConfig(cfg);
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		title: "Help & Guide",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "list-disc space-y-1.5 pl-4 text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Use Configuration to set filters, then Apply & load to fetch records." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Download exports the report as XLS, PDF or CSV — summary only or with details." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Click the + button to expand a vehicle's trip breakdown inline." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Double-click a row to drill down: Summary → Daily Summary → Travel Detail." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Use the Back arrow in the action bar to return to the previous level." })
			]
		})
	});
}
var INITIAL_COLUMNS = [
	{
		id: "vehicleNo",
		label: "Vehicle Number",
		showable: true,
		printable: true,
		sortable: true,
		sortPriority: "1",
		sortDirection: "asc"
	},
	{
		id: "driver",
		label: "Driver Name",
		showable: true,
		printable: true,
		sortable: true,
		sortPriority: "2",
		sortDirection: "asc"
	},
	{
		id: "company",
		label: "Company",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: "-",
		sortDirection: "asc"
	},
	{
		id: "branch",
		label: "Branch",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: "-",
		sortDirection: "asc"
	},
	{
		id: "startLocation",
		label: "Start Location",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: "-",
		sortDirection: "asc"
	},
	{
		id: "endLocation",
		label: "End Location",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: "-",
		sortDirection: "asc"
	},
	{
		id: "distance",
		label: "Distance (km)",
		showable: true,
		printable: true,
		sortable: true,
		sortPriority: "3",
		sortDirection: "desc"
	},
	{
		id: "running",
		label: "Running Time",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: "-",
		sortDirection: "asc"
	},
	{
		id: "idle",
		label: "Idle Time",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: "-",
		sortDirection: "asc"
	},
	{
		id: "stop",
		label: "Stop Time",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: "-",
		sortDirection: "asc"
	},
	{
		id: "firstIgnitionOn",
		label: "First Ignition",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: "-",
		sortDirection: "asc"
	},
	{
		id: "lastIgnitionOff",
		label: "Last Ignition",
		showable: true,
		printable: true,
		sortable: false,
		sortPriority: "-",
		sortDirection: "asc"
	},
	{
		id: "endOdometer",
		label: "End Odometer",
		showable: true,
		printable: true,
		sortable: true,
		sortPriority: "-",
		sortDirection: "asc"
	}
];
var RELATIVE_TYPES = [
	"Today",
	"Yesterday",
	"This Week",
	"Last Week",
	"Last 7 Days",
	"This Month",
	"Last Month"
];
var TIMEZONES = [
	"Asia/Kolkata (UTC+05:30)",
	"UTC (UTC+00:00)",
	"America/New_York (UTC-05:00)",
	"Europe/London (UTC+00:00)",
	"Asia/Dubai (UTC+04:00)",
	"Asia/Singapore (UTC+08:00)"
];
var WEEK_DAYS = [
	{
		id: "Su",
		label: "Su"
	},
	{
		id: "Mo",
		label: "Mo"
	},
	{
		id: "Tu",
		label: "Tu"
	},
	{
		id: "We",
		label: "We"
	},
	{
		id: "Th",
		label: "Th"
	},
	{
		id: "Fr",
		label: "Fr"
	},
	{
		id: "Sa",
		label: "Sa"
	}
];
var GENERATION_TIMES = [
	"00:00",
	"03:00",
	"06:00",
	"09:00",
	"12:00",
	"15:00",
	"18:00",
	"21:00"
];
var SFTP_PLATFORMS = [
	"Amazon S3",
	"Google Cloud Storage",
	"Azure Blob Storage",
	"Custom SFTP Server"
];
var MEDIA_GATEWAYS = [
	"WhatsApp",
	"Telegram",
	"SMS Gateway",
	"Slack Webhook"
];
var DEFAULT_DRAFT = {
	name: "",
	status: "ACTIVE",
	nextRun: "03/09/2026 09:00 AM",
	relativeType: "This Week",
	timezone: "Asia/Kolkata (UTC+05:30)",
	scheduleType: "Weekly",
	selectedDays: ["Mo"],
	selectedDates: [1],
	hasTimeRange: true,
	timeRangeStart: "12:00 AM",
	timeRangeEnd: "11:59 PM",
	generationTime: "09:00",
	reportType: "Summary",
	format: "XLS",
	actionType: "Email",
	toAddress: "",
	emailRetryWindow: "15",
	subject: "Scheduled Travel Report",
	message: "Please find attached the scheduled report.",
	selectedVehicles: [],
	ftpHost: "",
	ftpPort: "21",
	ftpUsername: "",
	ftpPassword: "",
	ftpFolder: "/reports",
	sftpPlatform: "Amazon S3",
	sftpAccessKey: "",
	sftpSecretKey: "",
	sftpRegion: "ap-south-1",
	sftpBucketName: "",
	mediaGateway: "WhatsApp",
	mediaRecipientNumber: ""
};
function SelectDropdown({ value, options, onChange, className, placeholder }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const handleClickOutside = (event) => {
			if (ref.current && !ref.current.contains(event.target)) setOpen(false);
		};
		if (open) document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: cn("relative w-full", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen(!open),
			className: cn("flex h-7.5 w-full items-center justify-between rounded-md border border-input/80 bg-background px-2.5 text-xs text-muted-foreground font-medium shadow-2xs transition-all hover:border-[#0089FF]/60 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF] cursor-pointer select-none", open && "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-muted/40"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("truncate", value ? "text-muted-foreground font-medium" : "text-muted-foreground/60 font-normal italic"),
				children: value || placeholder || "Select"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70 transition-transform duration-200 ml-1", open && "rotate-180") })]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute top-full left-0 right-0 z-[100] mt-1 max-h-56 overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-lg animate-in fade-in-80 select-none",
			children: options.map((opt) => {
				const isSelected = value === opt;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						onChange(opt);
						setOpen(false);
					},
					className: cn("flex w-full items-center justify-between rounded-sm px-2.5 py-1.5 text-left text-xs cursor-pointer transition-colors", isSelected ? "bg-muted font-semibold text-foreground" : "text-foreground hover:bg-muted/80 font-medium"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: opt }), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-[#0089FF]" })]
				}, opt);
			})
		})]
	});
}
function VehicleMultiSelectDropdown({ selectedVehicles, onToggleVehicle, onToggleRegion, regionGroups, allVisibleVehicleIds, isAllSelected, onToggleSelectAll }) {
	const [isExpanded, setIsExpanded] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const filteredGroups = (0, import_react.useMemo)(() => {
		const q = search.trim().toLowerCase();
		if (!q) return regionGroups;
		return regionGroups.map((g) => ({
			region: g.region,
			vehicles: g.vehicles.filter((v) => v.name.toLowerCase().includes(q) || v.imei.toLowerCase().includes(q) || v.branch.toLowerCase().includes(q))
		})).filter((g) => g.vehicles.length > 0);
	}, [regionGroups, search]);
	const collapsedSummary = (0, import_react.useMemo)(() => {
		if (selectedVehicles.length === 0) return null;
		const vehicleMap = /* @__PURE__ */ new Map();
		for (const g of regionGroups) for (const v of g.vehicles) vehicleMap.set(v.id, v);
		const firstVehicle = vehicleMap.get(selectedVehicles[0]) || fleetObjects.find((f) => f.id === selectedVehicles[0]);
		return {
			firstName: firstVehicle ? firstVehicle.name : selectedVehicles[0],
			extraCount: selectedVehicles.length - 1
		};
	}, [regionGroups, selectedVehicles]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border/80 bg-background overflow-hidden shadow-2xs transition-all",
		children: [isExpanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-8 items-center px-2.5 gap-2 bg-background border-b border-border/60 transition-colors",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					placeholder: "Search vehicles...",
					className: "h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium",
					autoFocus: true
				}),
				search && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setSearch(""),
					className: "p-0.5 text-muted-foreground hover:text-foreground cursor-pointer rounded-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setIsExpanded(false),
					className: "p-0.5 text-muted-foreground hover:text-foreground cursor-pointer rounded-xs",
					"aria-label": "Collapse vehicle list",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5 text-muted-foreground rotate-180 transition-transform duration-200" })
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: () => setIsExpanded(true),
			className: "flex h-7.5 items-center px-2.5 gap-2 bg-background cursor-pointer hover:bg-muted/30 transition-colors select-none group",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }),
				collapsedSummary ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0 flex items-center gap-1.5 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold text-foreground truncate",
						children: collapsedSummary.firstName
					}), collapsedSummary.extraCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center px-1.5 py-0.2 rounded-md text-[10px] font-semibold bg-[#0089FF]/10 text-[#0089FF] border border-[#0089FF]/20 shrink-0",
						children: ["+", collapsedSummary.extraCount]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex-1 text-xs text-muted-foreground/60 font-normal italic truncate",
					children: "Search vehicles..."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: (e) => {
						e.stopPropagation();
						setIsExpanded(true);
					},
					className: "p-0.5 text-muted-foreground hover:text-foreground cursor-pointer rounded-xs",
					"aria-label": "Expand vehicle list",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200" })
				})
			]
		}), isExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-h-52 overflow-y-auto p-3 space-y-3.5 custom-scrollbar bg-background",
			children: [filteredGroups.map(({ region, vehicles }) => {
				const groupIds = vehicles.map((v) => v.id);
				const allChecked = groupIds.length > 0 && groupIds.every((id) => selectedVehicles.includes(id));
				const someChecked = groupIds.some((id) => selectedVehicles.includes(id)) && !allChecked;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: allChecked,
								ref: (el) => {
									if (el) el.indeterminate = someChecked;
								},
								onChange: () => onToggleRegion(vehicles),
								className: "h-4 w-4 rounded border-border/80 text-[#0089FF] focus:ring-[#0089FF] accent-[#0089FF] cursor-pointer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-foreground",
								children: region
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground font-normal",
								children: [
									"[",
									vehicles.length,
									"]"
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pl-6 space-y-2.5",
						children: vehicles.map((v) => {
							const isChecked = selectedVehicles.includes(v.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-start gap-2.5 cursor-pointer select-none group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: isChecked,
									onChange: () => onToggleVehicle(v.id),
									className: "h-4 w-4 mt-0.5 rounded border-border/80 text-[#0089FF] focus:ring-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("text-xs leading-tight transition-colors truncate text-foreground", isChecked ? "font-semibold text-foreground" : "font-medium text-foreground group-hover:text-foreground"),
										children: v.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground leading-tight mt-0.5 font-mono",
										children: v.imei
									})]
								})]
							}, v.id);
						})
					})]
				}, region);
			}), filteredGroups.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-6 text-center text-xs text-muted-foreground",
				children: [
					"No vehicles found matching \"",
					search,
					"\"."
				]
			})]
		})]
	});
}
function formatRecurrence(item) {
	if (item.scheduleType === "Weekly") {
		const dayMap = {
			Mo: "Mon",
			Tu: "Tue",
			We: "Wed",
			Th: "Thu",
			Fr: "Fri",
			Sa: "Sat",
			Su: "Sun"
		};
		const days = (item.selectedDays || []).map((d) => dayMap[d] || d);
		return `Every week (${days.length > 0 ? days.join(", ") : "Mon"})`;
	}
	if (item.scheduleType === "Monthly") return `Every month (${(item.selectedDates || [1]).join(", ")})`;
	return "Every day";
}
function getScheduleIconScheme(item) {
	const nameLower = (item.name || "").toLowerCase();
	if (nameLower.includes("fuel") || nameLower.includes("distance") || nameLower.includes("audit")) return {
		badgeBg: "bg-emerald-500/10",
		borderColor: "border-emerald-500/20",
		iconColor: "text-emerald-600 dark:text-emerald-400",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fuel, { className: "h-5 w-5" })
	};
	if (nameLower.includes("idle") || nameLower.includes("location") || nameLower.includes("map") || nameLower.includes("route")) return {
		badgeBg: "bg-purple-500/10",
		borderColor: "border-purple-500/20",
		iconColor: "text-purple-600 dark:text-purple-400",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map$1, { className: "h-5 w-5" })
	};
	return {
		badgeBg: "bg-blue-500/10",
		borderColor: "border-blue-500/20",
		iconColor: "text-[#0089FF]",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5" })
	};
}
function RowDeletePopover({ itemName, onDelete }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				title: "Delete schedule",
				"aria-label": `Delete schedule ${itemName}`,
				className: "h-[30px] w-[30px] rounded-md border border-border/80 bg-background flex items-center justify-center text-muted-foreground hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer shadow-2xs active:scale-95",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
			align: "end",
			side: "bottom",
			sideOffset: 6,
			avoidCollisions: true,
			collisionPadding: 8,
			className: "w-64 p-3 rounded-lg border border-border bg-popover text-foreground shadow-lg z-[90] text-xs select-none animate-in fade-in-0 zoom-in-95",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold text-foreground text-xs leading-tight",
					children: "Delete scheduled report?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] text-muted-foreground leading-normal",
					children: [
						"Are you sure you want to delete ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
							className: "text-foreground font-medium",
							children: [
								"\"",
								itemName,
								"\""
							]
						}),
						"?"
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setOpen(false),
					className: "h-7 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-all active:scale-98",
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setOpen(false);
						onDelete();
					},
					className: "h-7 rounded-md bg-rose-600 px-3 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 active:scale-98 cursor-pointer transition-all",
					children: "Delete"
				})]
			})]
		})]
	});
}
function ScheduleModal({ open, onClose }) {
	const [schedules, setSchedules] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") try {
			const saved = localStorage.getItem("trakzee_scheduled_reports");
			if (saved !== null) return JSON.parse(saved);
		} catch (e) {
			console.error("Failed to load schedules", e);
		}
		return [];
	});
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") try {
			localStorage.setItem("trakzee_scheduled_reports", JSON.stringify(schedules));
		} catch (e) {
			console.error("Failed to save schedules", e);
		}
	}, [schedules]);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [view, setView] = (0, import_react.useState)("list");
	const [step, setStep] = (0, import_react.useState)(1);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)(DEFAULT_DRAFT);
	const [copyFrom, setCopyFrom] = (0, import_react.useState)("None");
	const [errors, setErrors] = (0, import_react.useState)({});
	const [emailVerificationStatus, setEmailVerificationStatus] = (0, import_react.useState)("idle");
	const handleVerifyEmail = () => {
		const email = (draft.toAddress || "").trim();
		if (!email) {
			setEmailVerificationStatus("failed");
			setErrors((prev) => ({
				...prev,
				toAddress: "Please enter recipient email address"
			}));
			toast.error("Please enter a recipient email address first");
			return;
		}
		setEmailVerificationStatus("verifying");
		setTimeout(() => {
			const isInvalidFormat = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
			const hasFailKeyword = email.toLowerCase().includes("fail") || email.toLowerCase().includes("error") || email.toLowerCase().includes("invalid") || email.toLowerCase().includes("bad") || email.toLowerCase().includes("test-fail");
			if (isInvalidFormat || hasFailKeyword) {
				setEmailVerificationStatus("failed");
				setErrors((prev) => ({
					...prev,
					toAddress: "Verification failed: Invalid email Id"
				}));
				toast.error(`Verification failed: Invalid email Id`);
			} else {
				setEmailVerificationStatus("success");
				setErrors((prev) => ({
					...prev,
					toAddress: void 0
				}));
				toast.success(`Recipient email "${email}" verified successfully. Mailbox is active!`);
			}
		}, 450);
	};
	const filteredSchedules = (0, import_react.useMemo)(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return schedules;
		return schedules.filter((s) => s.name.toLowerCase().includes(q) || s.actionType.toLowerCase().includes(q) || s.format.toLowerCase().includes(q) || s.toAddress && s.toAddress.toLowerCase().includes(q) || s.relativeType.toLowerCase().includes(q));
	}, [schedules, searchQuery]);
	const [advanceModalOpen, setAdvanceModalOpen] = (0, import_react.useState)(false);
	const [columnsConfig, setColumnsConfig] = (0, import_react.useState)(INITIAL_COLUMNS);
	const [detailDownloadMode, setDetailDownloadMode] = (0, import_react.useState)("multiple");
	const [criteriaCompany, setCriteriaCompany] = (0, import_react.useState)("All");
	const [criteriaBranch, setCriteriaBranch] = (0, import_react.useState)("All");
	const [criteriaGroup, setCriteriaGroup] = (0, import_react.useState)("All");
	const [criteriaType, setCriteriaType] = (0, import_react.useState)("All");
	const [criteriaBrand, setCriteriaBrand] = (0, import_react.useState)("All");
	const [criteriaModel, setCriteriaModel] = (0, import_react.useState)("All");
	const [criteriaDurationStatus, setCriteriaDurationStatus] = (0, import_react.useState)("All");
	const [criteriaDurationCompare, setCriteriaDurationCompare] = (0, import_react.useState)("Greater Than");
	const [criteriaDurationUnit, setCriteriaDurationUnit] = (0, import_react.useState)("Hour");
	const [criteriaDurationValue, setCriteriaDurationValue] = (0, import_react.useState)("");
	const [criteriaDistanceCompare, setCriteriaDistanceCompare] = (0, import_react.useState)("Greater Than");
	const [criteriaDistanceValue, setCriteriaDistanceValue] = (0, import_react.useState)("");
	const [criteriaDurationFormat, setCriteriaDurationFormat] = (0, import_react.useState)("hhmm");
	const regionGroups = (0, import_react.useMemo)(() => {
		let list = fleetObjects;
		if (criteriaBranch !== "All") list = list.filter((o) => o.branch.toLowerCase().includes(criteriaBranch.toLowerCase()));
		if (criteriaCompany !== "All") list = list.filter((o) => o.company.toLowerCase().includes(criteriaCompany.toLowerCase()));
		const map = /* @__PURE__ */ new Map();
		for (const v of list) {
			const g = map.get(v.branch) ?? [];
			g.push(v);
			map.set(v.branch, g);
		}
		return [...map.entries()].map(([region, vehicles]) => ({
			region,
			vehicles
		}));
	}, [criteriaBranch, criteriaCompany]);
	const allVisibleVehicleIds = (0, import_react.useMemo)(() => regionGroups.flatMap((g) => g.vehicles.map((v) => v.id)), [regionGroups]);
	const isAllVehiclesSelected = allVisibleVehicleIds.length > 0 && allVisibleVehicleIds.every((id) => draft.selectedVehicles.includes(id));
	const toggleSelectAllVehicles = () => {
		if (isAllVehiclesSelected) setDraft((d) => ({
			...d,
			selectedVehicles: d.selectedVehicles.filter((id) => !allVisibleVehicleIds.includes(id))
		}));
		else setDraft((d) => ({
			...d,
			selectedVehicles: Array.from(/* @__PURE__ */ new Set([...d.selectedVehicles, ...allVisibleVehicleIds]))
		}));
	};
	const toggleRegionVehicles = (vehicles) => {
		const ids = vehicles.map((v) => v.id);
		const allIn = ids.every((id) => draft.selectedVehicles.includes(id));
		setDraft((d) => {
			if (allIn) return {
				...d,
				selectedVehicles: d.selectedVehicles.filter((id) => !ids.includes(id))
			};
			else return {
				...d,
				selectedVehicles: Array.from(/* @__PURE__ */ new Set([...d.selectedVehicles, ...ids]))
			};
		});
	};
	const toggleSingleVehicle = (vehicleId) => {
		setDraft((d) => {
			const current = d.selectedVehicles;
			const next = current.includes(vehicleId) ? current.filter((id) => id !== vehicleId) : [...current, vehicleId];
			return {
				...d,
				selectedVehicles: next
			};
		});
	};
	const handleRelativeTypeChange = (newType) => {
		let schedType = "Daily";
		if (newType.includes("Week") || newType.includes("7 Days")) schedType = "Weekly";
		else if (newType.includes("Month")) schedType = "Monthly";
		setDraft((d) => ({
			...d,
			relativeType: newType,
			scheduleType: schedType
		}));
	};
	const toggleDay = (dayId) => {
		setDraft((d) => {
			const current = d.selectedDays || [];
			const next = current.includes(dayId) ? current.filter((x) => x !== dayId) : [...current, dayId];
			return {
				...d,
				selectedDays: next.length > 0 ? next : [dayId]
			};
		});
	};
	const toggleDate = (dateNum) => {
		setDraft((d) => {
			const current = d.selectedDates || [];
			const next = current.includes(dateNum) ? current.filter((x) => x !== dateNum) : [...current, dateNum];
			return {
				...d,
				selectedDates: next.length > 0 ? next : [dateNum]
			};
		});
	};
	const handleCopySettings = (schedName) => {
		setCopyFrom(schedName);
		if (schedName === "None") return;
		const found = schedules.find((s) => s.name === schedName);
		if (found) {
			setDraft({
				...found,
				name: draft.name || `${found.name} (Copy)`
			});
			setErrors((prev) => ({
				...prev,
				name: void 0
			}));
			toast.info(`Copied settings from "${found.name}"`);
		}
	};
	const startCreate = () => {
		setEditingId(null);
		setDraft({
			...DEFAULT_DRAFT,
			selectedVehicles: []
		});
		setErrors({});
		setStep(1);
		setView("form");
	};
	const startEdit = (item) => {
		setEditingId(item.id);
		setDraft({ ...item });
		setErrors({});
		setStep(1);
		setView("form");
	};
	const handleSave = () => {
		const newErrors = {};
		if (!draft.name.trim()) newErrors.name = "Please enter report name";
		if (draft.actionType === "Email" && !draft.toAddress.trim()) newErrors.toAddress = "Please enter recipient email address";
		if (draft.actionType === "FTP") {
			if (!draft.ftpHost?.trim()) newErrors.ftpHost = "Please enter host address";
			if (!draft.ftpPort?.trim()) newErrors.ftpPort = "Please enter port";
			if (!draft.ftpUsername?.trim()) newErrors.ftpUsername = "Please enter username";
			if (!draft.ftpPassword?.trim()) newErrors.ftpPassword = "Please enter password";
			if (!draft.ftpFolder?.trim()) newErrors.ftpFolder = "Please enter folder name";
		}
		if (draft.actionType === "SFTP") {
			if (!draft.sftpAccessKey?.trim()) newErrors.sftpAccessKey = "Please enter Access key ID";
			if (!draft.sftpSecretKey?.trim()) newErrors.sftpSecretKey = "Please enter Secret Access Key";
			if (!draft.sftpRegion?.trim()) newErrors.sftpRegion = "Please enter region";
			if (!draft.sftpBucketName?.trim()) newErrors.sftpBucketName = "Please enter bucket name";
		}
		if (draft.actionType === "Media API") {
			if (!draft.mediaRecipientNumber?.trim()) newErrors.mediaRecipientNumber = "Please enter recipient number(s)";
		}
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}
		if (editingId) {
			setSchedules((prev) => prev.map((s) => s.id === editingId ? {
				...draft,
				id: editingId
			} : s));
			toast.success("Schedule updated successfully");
		} else {
			const newSchedule = {
				...draft,
				id: `sched-${Date.now()}`
			};
			setSchedules((prev) => [...prev, newSchedule]);
			toast.success("Schedule created successfully");
		}
		setView("list");
	};
	const handleDelete = (id) => {
		setSchedules((prev) => prev.filter((s) => s.id !== id));
		toast.success("Schedule removed");
		setView("list");
	};
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[80] flex items-center justify-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Close schedule modal",
			onClick: onClose,
			className: "fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("relative z-10 flex flex-col rounded-lg border border-border bg-white dark:bg-slate-900 text-foreground shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150", view === "list" ? schedules.length === 0 ? "w-[500px] max-w-[94vw]" : "w-[680px] max-w-[94vw] max-h-[85vh]" : "w-[820px] max-w-[94vw] h-[640px] max-h-[88vh]"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex h-[56px] items-center justify-between border-b border-border px-6 bg-white dark:bg-slate-900 select-none shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[16px] font-semibold tracking-tight text-slate-900 dark:text-slate-100",
						children: view === "list" ? "Scheduled Reports" : editingId ? "Edit Schedule Report" : "Create Schedule Report"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Close schedule modal",
						onClick: onClose,
						className: "rounded-md p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				view === "form" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border bg-slate-50/70 dark:bg-slate-900/70 px-6 py-2.5 text-xs select-none shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setStep(1),
								className: cn("flex items-center gap-2 font-semibold transition-colors cursor-pointer", step === 1 ? "text-[#0089FF]" : "text-muted-foreground hover:text-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("flex h-5 w-5 items-center justify-center rounded-md text-xs font-bold", step === 1 ? "bg-[#0089FF] text-white shadow-xs" : "bg-muted text-muted-foreground"),
									children: "1"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Select Vehicles" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 text-muted-foreground/50" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setStep(2),
								className: cn("flex items-center gap-2 font-semibold transition-colors cursor-pointer", step === 2 ? "text-[#0089FF]" : "text-muted-foreground hover:text-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("flex h-5 w-5 items-center justify-center rounded-md text-xs font-bold", step === 2 ? "bg-[#0089FF] text-white shadow-xs" : "bg-muted text-muted-foreground"),
									children: "2"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Configure Settings" })]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground font-semibold bg-muted/60 px-2.5 py-1 rounded-md",
						children: [
							"Step ",
							step,
							" of 2"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 min-h-0 flex flex-col overflow-hidden",
					children: view === "list" ? schedules.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center py-12 px-8 text-center animate-in fade-in-50 duration-200 select-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-4 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "h-16 w-16 text-[#0089FF] stroke-[1.5]" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-bold text-foreground tracking-tight",
								children: "No scheduled reports yet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed",
								children: "Create a schedule to receive reports automatically at your preferred time and frequency."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: startCreate,
								className: "mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0089FF] px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-[#0077e6] hover:shadow-lg hover:shadow-blue-500/25 active:scale-98 cursor-pointer transition-all",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Create New Schedule" })]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-h-0 flex flex-col overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2.5 px-6 pt-5 pb-3 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/70 pointer-events-none" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: searchQuery,
										onChange: (e) => setSearchQuery(e.target.value),
										placeholder: "Search scheduled reports...",
										className: "h-[30px] w-full rounded-lg border border-input bg-background pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground/70 transition-all hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-1 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs font-medium"
									}),
									searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setSearchQuery(""),
										className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-md cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: startCreate,
								title: "Create New Schedule",
								"aria-label": "Create New Schedule",
								className: "inline-flex items-center justify-center rounded-lg bg-[#0089FF] h-[30px] w-[30px] text-white shadow-2xs hover:bg-[#0077e6] active:scale-95 cursor-pointer transition-all shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-h-0 overflow-y-auto px-6 pb-4 divide-y divide-border/60 custom-scrollbar",
							children: [filteredSchedules.map((item) => {
								const iconScheme = getScheduleIconScheme(item);
								const recurrenceText = formatRecurrence(item);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "py-3 px-1 flex items-center justify-between gap-4 transition-colors group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3.5 min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105", iconScheme.badgeBg, iconScheme.iconColor),
											children: iconScheme.icon
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1 space-y-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "text-sm font-bold text-foreground truncate",
													children: item.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "inline-flex items-center gap-1.5 font-medium",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-muted-foreground/70 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Next run: ", item.nextRun] })]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-muted-foreground/40",
															children: "•"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "inline-flex items-center gap-1.5 font-medium",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5 text-muted-foreground/70 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: recurrenceText })]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "inline-flex items-center gap-1.5 font-medium",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5 text-muted-foreground/70 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.actionType })]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-muted-foreground/40",
															children: "•"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "inline-flex items-center gap-1.5 font-medium",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-3.5 w-3.5 text-muted-foreground/70 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.format })]
														})
													]
												})
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => startEdit(item),
											className: "inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-background px-3 h-[30px] text-xs font-semibold text-foreground hover:bg-muted/60 hover:border-[#0089FF]/40 cursor-pointer transition-all shadow-2xs active:scale-98",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Edit" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowDeletePopover, {
											itemName: item.name,
											onDelete: () => handleDelete(item.id)
										})]
									})]
								}, item.id);
							}), filteredSchedules.length === 0 && schedules.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-12 text-center text-xs text-muted-foreground",
								children: [
									"No scheduled reports found matching \"",
									searchQuery,
									"\"."
								]
							})]
						})]
					}) : step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-h-0 overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar w-full select-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-foreground",
										children: "Company"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectDropdown, {
										value: criteriaCompany,
										options: COMPANIES,
										onChange: setCriteriaCompany
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-foreground",
										children: "Branch"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectDropdown, {
										value: criteriaBranch,
										options: ["All", ...getBranchesForCompanies(criteriaCompany === "All" ? ["ABC Logistic"] : [criteriaCompany])],
										onChange: setCriteriaBranch
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-foreground",
										children: "Vehicle Group"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectDropdown, {
										value: criteriaGroup,
										options: [
											"All",
											"HP Group",
											"Trucks",
											"Buses",
											"Cars",
											"Cold Chain"
										],
										onChange: setCriteriaGroup
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-foreground",
										children: "Vehicle Type"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectDropdown, {
										value: criteriaType,
										options: [
											"All",
											"Dumper",
											"Truck",
											"Bus",
											"SUV",
											"Taxi"
										],
										onChange: setCriteriaType
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-foreground",
										children: "Vehicle Brand"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectDropdown, {
										value: criteriaBrand,
										options: [
											"All",
											"Ashok Leyland",
											"Tata Motors",
											"BharatBenz",
											"Volvo"
										],
										onChange: setCriteriaBrand
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-foreground",
										children: "Vehicle Model"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectDropdown, {
										value: criteriaModel,
										options: [
											"All",
											"10 Wheel",
											"12 Wheel",
											"6 Wheel",
											"4 Wheel"
										],
										onChange: setCriteriaModel
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-3 space-y-1.5 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-foreground",
											children: "Select Vehicle"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[11px] font-medium text-muted-foreground",
											children: [
												draft.selectedVehicles.length,
												" of ",
												allVisibleVehicleIds.length,
												" Selected"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VehicleMultiSelectDropdown, {
										selectedVehicles: draft.selectedVehicles,
										onToggleVehicle: toggleSingleVehicle,
										onToggleRegion: toggleRegionVehicles,
										regionGroups,
										allVisibleVehicleIds,
										isAllSelected: isAllVehiclesSelected,
										onToggleSelectAll: toggleSelectAllVehicles
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-x-6 gap-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-foreground",
											children: "Duration Status"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectDropdown, {
											value: criteriaDurationStatus,
											options: DURATION_STATUS,
											onChange: setCriteriaDurationStatus
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-foreground",
											children: "Duration Format"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-6 h-7.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex items-center gap-2 text-xs text-foreground cursor-pointer select-none font-semibold",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "radio",
													name: "durationFormat",
													checked: criteriaDurationFormat === "hhmm",
													onChange: () => setCriteriaDurationFormat("hhmm"),
													className: "h-3.5 w-3.5 accent-[#0089FF] cursor-pointer"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "HH:MM" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex items-center gap-2 text-xs text-foreground cursor-pointer select-none font-semibold",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "radio",
													name: "durationFormat",
													checked: criteriaDurationFormat === "decimal",
													onChange: () => setCriteriaDurationFormat("decimal"),
													className: "h-3.5 w-3.5 accent-[#0089FF] cursor-pointer"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Decimal" })]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-foreground",
											children: "Duration Filter"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-12 gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "col-span-5",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectDropdown, {
														value: criteriaDurationCompare,
														options: COMPARATORS,
														onChange: setCriteriaDurationCompare
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "col-span-4",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectDropdown, {
														value: criteriaDurationUnit,
														options: DURATION_UNITS,
														onChange: setCriteriaDurationUnit
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "col-span-3",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														value: criteriaDurationValue,
														onChange: (e) => setCriteriaDurationValue(e.target.value),
														placeholder: "e.g. 5",
														className: "h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-muted-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs"
													})
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-foreground",
											children: "Distance Filter"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-12 gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "col-span-7",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectDropdown, {
													value: criteriaDistanceCompare,
													options: COMPARATORS,
													onChange: setCriteriaDistanceCompare
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "col-span-5",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: criteriaDistanceValue,
													onChange: (e) => setCriteriaDistanceValue(e.target.value),
													placeholder: "e.g. 100",
													className: "h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-muted-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs"
												})
											})]
										})]
									})
								]
							})
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-h-0 overflow-y-auto px-8 py-6 space-y-5 custom-scrollbar w-full select-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "block text-xs font-semibold text-foreground",
											children: ["Report Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-500 font-bold ml-0.5",
												children: "*"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: draft.name,
											onChange: (e) => {
												setDraft((d) => ({
													...d,
													name: e.target.value
												}));
												if (e.target.value.trim()) setErrors((prev) => ({
													...prev,
													name: void 0
												}));
											},
											placeholder: "e.g. Weekly Operations Summary",
											className: cn("h-7.5 w-full rounded-md border bg-background px-2.5 text-xs font-medium text-muted-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none", errors.name ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-input/80 hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20")
										}),
										errors.name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium animate-in fade-in duration-150",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3.5 w-3.5 shrink-0 text-red-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.name })]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-foreground",
										children: "Copy From"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectDropdown, {
										value: copyFrom,
										options: ["None", ...schedules.map((s) => s.name)],
										onChange: handleCopySettings
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-3 gap-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-xs font-semibold text-foreground",
													children: "Relative Type"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectDropdown, {
													value: draft.relativeType,
													options: RELATIVE_TYPES,
													onChange: handleRelativeTypeChange
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-xs font-semibold text-foreground",
													children: "Timezone"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectDropdown, {
													value: draft.timezone,
													options: TIMEZONES,
													onChange: (timezone) => setDraft((d) => ({
														...d,
														timezone
													}))
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-xs font-semibold text-foreground",
													children: "Generation Time"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectDropdown, {
													value: draft.generationTime,
													options: GENERATION_TIMES,
													onChange: (generationTime) => setDraft((d) => ({
														...d,
														generationTime
													}))
												})]
											})
										]
									}),
									(draft.scheduleType === "Weekly" || draft.scheduleType === "Monthly") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-1 space-y-3",
										children: [draft.scheduleType === "Weekly" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-xs font-semibold text-foreground",
												children: "Select execution days:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center gap-2",
												children: WEEK_DAYS.map(({ id, label }) => {
													const isSelected = (draft.selectedDays || []).includes(id);
													return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => toggleDay(id),
														className: cn("h-8 w-8 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center justify-center shadow-2xs hover:border-[#0089FF]/60 active:scale-95", isSelected ? "bg-[#0089FF] text-white shadow-xs border border-[#0089FF]" : "bg-background border border-input/80 text-foreground hover:bg-muted/40"),
														children: label
													}, id);
												})
											})]
										}), draft.scheduleType === "Monthly" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-xs font-semibold text-foreground",
												children: "Select execution day of month:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid grid-cols-7 sm:grid-cols-10 gap-1.5",
												children: Array.from({ length: 31 }, (_, i) => i + 1).map((dateNum) => {
													const isSelected = (draft.selectedDates || []).includes(dateNum);
													return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => toggleDate(dateNum),
														className: cn("h-7.5 w-7.5 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center justify-center shadow-2xs hover:border-[#0089FF]/60 active:scale-95", isSelected ? "bg-[#0089FF] text-white shadow-xs border border-[#0089FF]" : "bg-background border border-input/80 text-foreground hover:bg-muted/40"),
														children: dateNum
													}, dateNum);
												})
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2 space-y-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2.5 cursor-pointer select-none text-xs font-semibold text-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: draft.hasTimeRange,
												onChange: (e) => setDraft((d) => ({
													...d,
													hasTimeRange: e.target.checked
												})),
												className: "h-3.5 w-3.5 rounded border-border text-[#0089FF] focus:ring-[#0089FF] accent-[#0089FF] cursor-pointer"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold",
												children: "Time Range"
											})]
										}), draft.hasTimeRange && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-xs font-semibold text-foreground",
													children: "Start Time"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative flex items-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														value: draft.timeRangeStart,
														onChange: (e) => setDraft((d) => ({
															...d,
															timeRangeStart: e.target.value
														})),
														className: "h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 pr-8 text-xs font-medium text-muted-foreground transition-all hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "absolute right-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" })]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-xs font-semibold text-foreground",
													children: "End Time"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative flex items-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														value: draft.timeRangeEnd,
														onChange: (e) => setDraft((d) => ({
															...d,
															timeRangeEnd: e.target.value
														})),
														className: "h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 pr-8 text-xs font-medium text-muted-foreground transition-all hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "absolute right-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" })]
												})]
											})]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-foreground",
											children: "Report Type"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center gap-6 h-7.5",
											children: [
												"Summary",
												"Daily",
												"Detail"
											].map((level) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex items-center gap-2 cursor-pointer text-xs text-foreground select-none",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "radio",
													name: "reportType",
													checked: draft.reportType === level,
													onChange: () => setDraft((d) => ({
														...d,
														reportType: level
													})),
													className: "h-3.5 w-3.5 accent-[#0089FF] cursor-pointer"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold",
													children: level
												})]
											}, level))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-foreground",
											children: "Delivery Method"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center gap-6 h-7.5",
											children: [
												"Email",
												"FTP",
												"SFTP",
												"Media API"
											].map((method) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex items-center gap-2 cursor-pointer text-xs text-foreground select-none",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "radio",
													name: "actionType",
													checked: draft.actionType === method,
													onChange: () => setDraft((d) => ({
														...d,
														actionType: method
													})),
													className: "h-3.5 w-3.5 accent-[#0089FF] cursor-pointer"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold",
													children: method
												})]
											}, method))
										})]
									}),
									draft.actionType === "Email" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-1 space-y-4 animate-in fade-in-50 duration-150",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-3 gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "col-span-2 space-y-1.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
															className: "block text-xs font-semibold text-foreground",
															children: ["To Address ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-red-500 font-bold ml-0.5",
																children: "*"
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																type: "email",
																value: draft.toAddress,
																onChange: (e) => {
																	setEmailVerificationStatus("idle");
																	setDraft((d) => ({
																		...d,
																		toAddress: e.target.value
																	}));
																	if (e.target.value.trim()) setErrors((prev) => ({
																		...prev,
																		toAddress: void 0
																	}));
																},
																placeholder: "manager@company.com",
																className: cn("h-7.5 flex-1 rounded-md border bg-background px-2.5 text-xs font-medium text-muted-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none", emailVerificationStatus === "success" ? "border-emerald-500/80 bg-emerald-500/[0.04] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" : emailVerificationStatus === "failed" || errors.toAddress ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-input/80 hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20")
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																type: "button",
																disabled: emailVerificationStatus === "verifying",
																onClick: handleVerifyEmail,
																className: cn("px-3.5 h-7.5 text-xs rounded-md border font-semibold cursor-pointer transition-all shadow-2xs active:scale-98 inline-flex items-center gap-1.5", emailVerificationStatus === "verifying" && "opacity-75 cursor-wait border-input/80 bg-muted/40 text-muted-foreground", emailVerificationStatus === "success" && "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20", emailVerificationStatus === "failed" && "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20", emailVerificationStatus === "idle" && "border-input/80 bg-background hover:bg-muted/40 hover:border-[#0089FF]/60 text-foreground"),
																children: [
																	emailVerificationStatus === "verifying" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-[#0089FF]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verifying..." })] }),
																	emailVerificationStatus === "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verified" })] }),
																	emailVerificationStatus === "failed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3.5 w-3.5 text-red-600 dark:text-red-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Failed" })] }),
																	emailVerificationStatus === "idle" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verify" })
																]
															})]
														}),
														emailVerificationStatus === "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium animate-in fade-in duration-150",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 shrink-0 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recipient email verified & active." })]
														}),
														(emailVerificationStatus === "failed" || errors.toAddress) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium animate-in fade-in duration-150",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3.5 w-3.5 shrink-0 text-red-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.toAddress || "Verification failed: Invalid email Id" })]
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "block text-xs font-semibold text-foreground",
														children: "Retry Window (Mins)"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														value: draft.emailRetryWindow,
														onChange: (e) => setDraft((d) => ({
															...d,
															emailRetryWindow: e.target.value
														})),
														placeholder: "15",
														className: "h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-muted-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-xs font-semibold text-foreground",
													children: "Subject"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: draft.subject,
													onChange: (e) => setDraft((d) => ({
														...d,
														subject: e.target.value
													})),
													placeholder: "Weekly Travel Summary Report",
													className: "h-7.5 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-medium text-muted-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "block text-xs font-semibold text-foreground",
														children: "Message"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-1 border border-border rounded-md bg-muted/40 px-1.5 py-0.5",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																className: "p-1 rounded-xs hover:bg-muted text-muted-foreground hover:text-foreground",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bold, { className: "h-3 w-3" })
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																className: "p-1 rounded-xs hover:bg-muted text-muted-foreground hover:text-foreground",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Italic, { className: "h-3 w-3" })
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																className: "p-1 rounded-xs hover:bg-muted text-muted-foreground hover:text-foreground",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Underline, { className: "h-3 w-3" })
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-px bg-border my-auto mx-0.5" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																className: "p-1 rounded-xs hover:bg-muted text-muted-foreground hover:text-foreground",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "h-3 w-3" })
															})
														]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
													rows: 3,
													value: draft.message,
													onChange: (e) => setDraft((d) => ({
														...d,
														message: e.target.value
													})),
													placeholder: "Write your email body message here...",
													className: "w-full rounded-md border border-input bg-background p-3 text-xs font-medium text-muted-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all hover:border-[#0089FF] focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none shadow-2xs custom-scrollbar"
												})]
											})
										]
									}),
									draft.actionType === "FTP" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-1 space-y-4 animate-in fade-in-50 duration-150",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
															className: "block text-xs font-semibold text-foreground",
															children: ["Host Address ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-red-500 font-bold ml-0.5",
																children: "*"
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "text",
															value: draft.ftpHost || "",
															onChange: (e) => {
																setDraft((d) => ({
																	...d,
																	ftpHost: e.target.value
																}));
																if (e.target.value.trim()) setErrors((prev) => ({
																	...prev,
																	ftpHost: void 0
																}));
															},
															placeholder: "e.g. ftp.example.com",
															className: cn("h-7.5 w-full rounded-md border bg-background px-2.5 text-xs font-medium text-muted-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none", errors.ftpHost ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-input/80 hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20")
														}),
														errors.ftpHost && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3.5 w-3.5 shrink-0 text-red-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.ftpHost })]
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
															className: "block text-xs font-semibold text-foreground",
															children: ["Port ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-red-500 font-bold ml-0.5",
																children: "*"
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "text",
															value: draft.ftpPort || "21",
															onChange: (e) => {
																setDraft((d) => ({
																	...d,
																	ftpPort: e.target.value
																}));
																if (e.target.value.trim()) setErrors((prev) => ({
																	...prev,
																	ftpPort: void 0
																}));
															},
															placeholder: "21",
															className: cn("h-7.5 w-full rounded-md border bg-background px-2.5 text-xs font-medium text-muted-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none", errors.ftpPort ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-input/80 hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20")
														}),
														errors.ftpPort && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3.5 w-3.5 shrink-0 text-red-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.ftpPort })]
														})
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
															className: "block text-xs font-semibold text-foreground",
															children: ["Username ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-red-500 font-bold ml-0.5",
																children: "*"
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "text",
															value: draft.ftpUsername || "",
															onChange: (e) => {
																setDraft((d) => ({
																	...d,
																	ftpUsername: e.target.value
																}));
																if (e.target.value.trim()) setErrors((prev) => ({
																	...prev,
																	ftpUsername: void 0
																}));
															},
															placeholder: "e.g. ftp_user",
															className: cn("h-7.5 w-full rounded-md border bg-background px-2.5 text-xs font-medium text-muted-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none", errors.ftpUsername ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-input/80 hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20")
														}),
														errors.ftpUsername && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3.5 w-3.5 shrink-0 text-red-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.ftpUsername })]
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
															className: "block text-xs font-semibold text-foreground",
															children: ["Password ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-red-500 font-bold ml-0.5",
																children: "*"
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "password",
															value: draft.ftpPassword || "",
															onChange: (e) => {
																setDraft((d) => ({
																	...d,
																	ftpPassword: e.target.value
																}));
																if (e.target.value.trim()) setErrors((prev) => ({
																	...prev,
																	ftpPassword: void 0
																}));
															},
															placeholder: "••••••••",
															className: cn("h-7.5 w-full rounded-md border bg-background px-2.5 text-xs font-medium text-muted-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none", errors.ftpPassword ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-input/80 hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20")
														}),
														errors.ftpPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3.5 w-3.5 shrink-0 text-red-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.ftpPassword })]
														})
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														className: "block text-xs font-semibold text-foreground",
														children: ["Folder Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-red-500 font-bold ml-0.5",
															children: "*"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														value: draft.ftpFolder || "",
														onChange: (e) => {
															setDraft((d) => ({
																...d,
																ftpFolder: e.target.value
															}));
															if (e.target.value.trim()) setErrors((prev) => ({
																...prev,
																ftpFolder: void 0
															}));
														},
														placeholder: "e.g. /reports/daily",
														className: cn("h-7.5 w-full rounded-md border bg-background px-2.5 text-xs font-medium text-muted-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none", errors.ftpFolder ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-input/80 hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20")
													}),
													errors.ftpFolder && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3.5 w-3.5 shrink-0 text-red-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.ftpFolder })]
													})
												]
											})
										]
									}),
									draft.actionType === "SFTP" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-1 space-y-4 animate-in fade-in-50 duration-150",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "block text-xs font-semibold text-foreground",
													children: ["Platform ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-red-500 font-bold ml-0.5",
														children: "*"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectDropdown, {
													value: draft.sftpPlatform || "Amazon S3",
													options: SFTP_PLATFORMS,
													onChange: (sftpPlatform) => setDraft((d) => ({
														...d,
														sftpPlatform
													}))
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
															className: "block text-xs font-semibold text-foreground",
															children: ["Access key ID ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-red-500 font-bold ml-0.5",
																children: "*"
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "text",
															value: draft.sftpAccessKey || "",
															onChange: (e) => {
																setDraft((d) => ({
																	...d,
																	sftpAccessKey: e.target.value
																}));
																if (e.target.value.trim()) setErrors((prev) => ({
																	...prev,
																	sftpAccessKey: void 0
																}));
															},
															placeholder: "e.g. AKIAIOSFODNN7EXAMPLE",
															className: cn("h-7.5 w-full rounded-md border bg-background px-2.5 text-xs font-medium text-muted-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none", errors.sftpAccessKey ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-input/80 hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20")
														}),
														errors.sftpAccessKey && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3.5 w-3.5 shrink-0 text-red-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.sftpAccessKey })]
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
															className: "block text-xs font-semibold text-foreground",
															children: ["Secret Access Key ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-red-500 font-bold ml-0.5",
																children: "*"
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "password",
															value: draft.sftpSecretKey || "",
															onChange: (e) => {
																setDraft((d) => ({
																	...d,
																	sftpSecretKey: e.target.value
																}));
																if (e.target.value.trim()) setErrors((prev) => ({
																	...prev,
																	sftpSecretKey: void 0
																}));
															},
															placeholder: "••••••••••••••••••••••••",
															className: cn("h-7.5 w-full rounded-md border bg-background px-2.5 text-xs font-medium text-muted-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none", errors.sftpSecretKey ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-input/80 hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20")
														}),
														errors.sftpSecretKey && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3.5 w-3.5 shrink-0 text-red-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.sftpSecretKey })]
														})
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
															className: "block text-xs font-semibold text-foreground",
															children: ["Region ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-red-500 font-bold ml-0.5",
																children: "*"
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "text",
															value: draft.sftpRegion || "",
															onChange: (e) => {
																setDraft((d) => ({
																	...d,
																	sftpRegion: e.target.value
																}));
																if (e.target.value.trim()) setErrors((prev) => ({
																	...prev,
																	sftpRegion: void 0
																}));
															},
															placeholder: "e.g. ap-south-1",
															className: cn("h-7.5 w-full rounded-md border bg-background px-2.5 text-xs font-medium text-muted-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none", errors.sftpRegion ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-input/80 hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20")
														}),
														errors.sftpRegion && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3.5 w-3.5 shrink-0 text-red-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.sftpRegion })]
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
															className: "block text-xs font-semibold text-foreground",
															children: ["Bucket Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-red-500 font-bold ml-0.5",
																children: "*"
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "text",
															value: draft.sftpBucketName || "",
															onChange: (e) => {
																setDraft((d) => ({
																	...d,
																	sftpBucketName: e.target.value
																}));
																if (e.target.value.trim()) setErrors((prev) => ({
																	...prev,
																	sftpBucketName: void 0
																}));
															},
															placeholder: "e.g. company-fleet-reports",
															className: cn("h-7.5 w-full rounded-md border bg-background px-2.5 text-xs font-medium text-muted-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs focus:outline-none", errors.sftpBucketName ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-input/80 hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20")
														}),
														errors.sftpBucketName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3.5 w-3.5 shrink-0 text-red-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.sftpBucketName })]
														})
													]
												})]
											})
										]
									}),
									draft.actionType === "Media API" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-1 space-y-4 animate-in fade-in-50 duration-150",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block text-xs font-semibold text-foreground",
												children: ["Gateway ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-red-500 font-bold ml-0.5",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectDropdown, {
												value: draft.mediaGateway || "WhatsApp",
												options: MEDIA_GATEWAYS,
												onChange: (mediaGateway) => setDraft((d) => ({
													...d,
													mediaGateway
												}))
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														className: "block text-xs font-semibold text-foreground",
														children: ["Recipient Number ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-red-500 font-bold ml-0.5",
															children: "*"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[11px] text-muted-foreground font-medium",
														children: "Comma (,) for multiple recipient numbers"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
													rows: 3,
													value: draft.mediaRecipientNumber || "",
													onChange: (e) => {
														setDraft((d) => ({
															...d,
															mediaRecipientNumber: e.target.value
														}));
														if (e.target.value.trim()) setErrors((prev) => ({
															...prev,
															mediaRecipientNumber: void 0
														}));
													},
													placeholder: "+91 9876543210, +1 5550192834",
													className: cn("w-full rounded-md border bg-background p-2.5 text-xs font-medium text-muted-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 transition-all shadow-2xs custom-scrollbar focus:outline-none", errors.mediaRecipientNumber ? "border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-input/80 hover:border-[#0089FF]/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20")
												}),
												errors.mediaRecipientNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3.5 w-3.5 shrink-0 text-red-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.mediaRecipientNumber })]
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5 pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-foreground",
											children: "File Format"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center gap-6 h-7.5",
											children: [
												"XLS",
												"PDF",
												"CSV"
											].map((fmt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex items-center gap-2 cursor-pointer text-xs text-foreground select-none font-semibold",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "radio",
													name: "format",
													checked: draft.format === fmt,
													onChange: () => setDraft((d) => ({
														...d,
														format: fmt
													})),
													className: "h-3.5 w-3.5 accent-[#0089FF] cursor-pointer"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmt })]
											}, fmt))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "pt-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setAdvanceModalOpen(true),
											className: "inline-flex items-center gap-2 rounded-md border border-input/80 bg-background px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/40 hover:border-[#0089FF]/60 transition-all cursor-pointer shadow-2xs active:scale-98",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "h-3.5 w-3.5 text-[#0089FF]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Advance Configuration" })]
										})
									})
								]
							})
						]
					})
				}),
				view === "form" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
					className: "flex items-center justify-between border-t border-border bg-slate-50/70 dark:bg-slate-900/70 px-6 py-3.5 select-none shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								if (step === 1) setView("list");
								else setStep(1);
							},
							className: "flex items-center gap-2 px-4 h-8 text-xs rounded-md border border-input/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all shadow-2xs active:scale-98",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Back" })]
						}), editingId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowDeletePopover, {
							itemName: draft.name || "this report",
							onDelete: () => {
								handleDelete(editingId);
								setView("list");
							}
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-medium text-muted-foreground tabular-nums",
							children: [draft.selectedVehicles.length, " Vehicles Selected"]
						}), step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setStep(2),
							className: "flex items-center gap-2 rounded-md bg-[#0089FF] px-5 h-8 text-xs font-semibold text-white shadow-xs hover:bg-[#0077e6] cursor-pointer transition-all active:scale-98",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Next" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleSave,
							className: "rounded-md bg-[#0089FF] px-5 h-8 text-xs font-semibold text-white shadow-xs hover:bg-[#0077e6] cursor-pointer transition-all active:scale-98",
							children: "Save Schedule"
						})]
					})]
				})
			]
		})]
	}), advanceModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[100] flex items-center justify-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Close Advance Configuration",
			onClick: () => setAdvanceModalOpen(false),
			className: "fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 w-full max-w-3xl max-h-[85vh] flex flex-col bg-white dark:bg-slate-900 border border-border text-foreground shadow-xl rounded-lg overflow-hidden animate-in zoom-in-95",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex h-[56px] items-center justify-between border-b border-border px-6 bg-white dark:bg-slate-900 select-none shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "h-4 w-4 text-[#0089FF]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-[16px] font-semibold tracking-tight text-slate-900 dark:text-slate-100",
							children: "Advance Configuration"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Close Advance Configuration",
						onClick: () => setAdvanceModalOpen(false),
						className: "rounded-md p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-h-0 overflow-y-auto p-6 space-y-5 custom-scrollbar text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg border border-border overflow-hidden bg-card shadow-2xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-[#EAF0F6] text-slate-900 dark:bg-slate-800 dark:text-slate-100 text-[11px] font-bold uppercase tracking-wider border-b border-[#DFE3EB] dark:border-slate-700",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "py-2.5 px-3 w-8" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-3",
										children: "Column Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-2 text-center",
										children: "Showable"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-2 text-center",
										children: "Printable"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-2 text-center",
										children: "Sortable"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-2 text-center",
										children: "Sort Priority"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-3 text-center",
										children: "Sorting"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-[#DFE3EB] dark:divide-slate-800",
								children: columnsConfig.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-muted/40 transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-3 text-muted-foreground cursor-grab",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "h-3.5 w-3.5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-3 font-semibold text-foreground",
											children: col.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-2 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: col.showable,
												onChange: (e) => {
													const checked = e.target.checked;
													setColumnsConfig((prev) => prev.map((c) => c.id === col.id ? {
														...c,
														showable: checked
													} : c));
												},
												className: "h-4 w-4 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-2 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: col.printable,
												onChange: (e) => {
													const checked = e.target.checked;
													setColumnsConfig((prev) => prev.map((c) => c.id === col.id ? {
														...c,
														printable: checked
													} : c));
												},
												className: "h-4 w-4 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-2 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: col.sortable,
												onChange: (e) => {
													const checked = e.target.checked;
													setColumnsConfig((prev) => prev.map((c) => c.id === col.id ? {
														...c,
														sortable: checked
													} : c));
												},
												className: "h-4 w-4 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-2 text-center flex justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectDropdown, {
												value: col.sortPriority,
												options: [
													"-",
													"1",
													"2",
													"3",
													"4",
													"5"
												],
												onChange: (val) => {
													setColumnsConfig((prev) => prev.map((c) => c.id === col.id ? {
														...c,
														sortPriority: val
													} : c));
												},
												className: "w-16"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-3 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													setColumnsConfig((prev) => prev.map((c) => c.id === col.id ? {
														...c,
														sortDirection: c.sortDirection === "asc" ? "desc" : "asc"
													} : c));
												},
												className: "px-2.5 py-1 text-[11px] font-semibold rounded-md border border-border bg-background hover:bg-muted cursor-pointer transition-colors shadow-2xs",
												children: col.sortDirection === "asc" ? "↑ Asc" : "↓ Desc"
											})
										})
									]
								}, col.id))
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-lg border border-border bg-card space-y-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-foreground",
							children: "Detail Report Download Mode"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-6 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 cursor-pointer text-foreground select-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "radio",
									name: "detailDownloadMode",
									checked: detailDownloadMode === "multiple",
									onChange: () => setDetailDownloadMode("multiple"),
									className: "h-4 w-4 text-[#0089FF] accent-[#0089FF] cursor-pointer"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: "Multiple Sheet"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 cursor-pointer text-foreground select-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "radio",
									name: "detailDownloadMode",
									checked: detailDownloadMode === "single",
									onChange: () => setDetailDownloadMode("single"),
									className: "h-4 w-4 text-[#0089FF] accent-[#0089FF] cursor-pointer"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: "Single Sheet"
								})]
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
					className: "flex items-center justify-between border-t border-border bg-slate-50/70 dark:bg-slate-900/70 px-6 py-3.5 shrink-0 select-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setColumnsConfig(INITIAL_COLUMNS),
							className: "flex items-center gap-1.5 px-3.5 h-8 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-semibold text-foreground cursor-pointer transition-all shadow-2xs active:scale-98",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reset" })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setAdvanceModalOpen(false),
							className: "px-4.5 h-8 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all shadow-2xs active:scale-98",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								toast.success("Advance configurations applied");
								setAdvanceModalOpen(false);
							},
							className: "rounded-md bg-[#0089FF] px-5 h-8 text-xs font-semibold text-white shadow-xs hover:bg-[#0077e6] cursor-pointer transition-all active:scale-98",
							children: "Save & Apply"
						})]
					})]
				})
			]
		})]
	})] });
}
var ScheduleDrawer = ScheduleModal;
function IconButton$2({ label, children, onClick, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": label,
			onClick,
			disabled,
			className: "inline-flex h-7 w-7 items-center justify-center rounded border border-input bg-background text-muted-foreground transition-all duration-150 hover:bg-muted hover:text-foreground hover:border-border disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs",
			children
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
		side: "bottom",
		children: label
	})] });
}
var SEARCHABLE_COLUMNS$1 = [
	{
		id: "company",
		label: "Company"
	},
	{
		id: "branch",
		label: "Branch"
	},
	{
		id: "driver",
		label: "Driver"
	}
];
function DriverJobSummaryReport() {
	const [filters, setFilters] = (0, import_react.useState)({
		...DEFAULT_FILTERS,
		from: "01-12-2024",
		to: "31-12-2024"
	});
	const [configOpen, setConfigOpen] = (0, import_react.useState)(false);
	const [configTab, setConfigTab] = (0, import_react.useState)("quick");
	const [scheduleOpen, setScheduleOpen] = (0, import_react.useState)(false);
	const [modal, setModal] = (0, import_react.useState)(null);
	const [expandedId, setExpandedId] = (0, import_react.useState)("job-2");
	const [query, setQuery] = (0, import_react.useState)("");
	const [selectedSearchField, setSelectedSearchField] = (0, import_react.useState)("all");
	const filteredRows = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		if (!q) return driverJobSummaryRows;
		return driverJobSummaryRows.filter((r) => {
			if (selectedSearchField === "company") return r.company.toLowerCase().includes(q);
			if (selectedSearchField === "branch") return r.branch.toLowerCase().includes(q);
			if (selectedSearchField === "driver") return r.driver.toLowerCase().includes(q);
			return r.company.toLowerCase().includes(q) || r.branch.toLowerCase().includes(q) || r.driver.toLowerCase().includes(q);
		});
	}, [query, selectedSearchField]);
	const toggleExpand = (id) => {
		setExpandedId((prev) => prev === id ? null : id);
	};
	const handleExport = (format) => {
		toast.success(`Exporting Driver Job Summary as ${format}`, { description: `${filteredRows.length} records exported.` });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-1 flex-col gap-2 p-2.5 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-[76px] min-h-[76px] max-h-[76px] shrink-0 items-center justify-between gap-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 px-4 shadow-2xs backdrop-blur-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col justify-center gap-0.5 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FavoriteToggle, {
							reportId: "job",
							className: "text-muted-foreground hover:text-amber-500"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-[18px] font-medium text-foreground leading-tight tracking-tight whitespace-nowrap",
							children: "Driver Job Summary"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setConfigTab("quick");
									setConfigOpen(true);
								},
								className: "inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground cursor-pointer font-normal",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									filters.from,
									" 12:00 AM → ",
									filters.to,
									" 11:59 PM"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-2.5 w-2.5 opacity-60" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground/40 font-mono",
								children: "|"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setConfigTab("quick");
									setConfigOpen(true);
								},
								className: "inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground cursor-pointer font-normal",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Planet Eco Building Materials LLC +6 more" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-2.5 w-2.5 opacity-60" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground/40 font-mono",
								children: "|"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setConfigTab("quick");
									setConfigOpen(true);
								},
								className: "inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Quick Filter" })]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex h-7 items-center rounded border border-input bg-background shadow-2xs focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									title: "Select specific field to search",
									className: "flex h-full items-center gap-1 border-r border-input bg-surface-muted/60 px-2 text-[11px] font-medium text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0 rounded-l",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "max-w-[76px] truncate",
										children: SEARCHABLE_COLUMNS$1.find((c) => c.id === selectedSearchField)?.label || "All"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-2.5 w-2.5 text-muted-foreground" })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "start",
								className: "w-44 p-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
										className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground px-2 py-1",
										children: "Search Column"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => setSelectedSearchField("all"),
										className: cn("flex items-center justify-between cursor-pointer text-xs rounded px-2 py-1", selectedSearchField === "all" && "bg-primary/10 font-bold text-primary"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "All Columns" }), selectedSearchField === "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "my-1" }),
									SEARCHABLE_COLUMNS$1.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => setSelectedSearchField(col.id),
										className: cn("flex items-center justify-between cursor-pointer text-xs rounded px-2 py-1", selectedSearchField === col.id && "bg-primary/10 font-bold text-primary"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: col.label }), selectedSearchField === col.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" })]
									}, col.id))
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex items-center flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "ml-2 h-3 w-3 text-muted-foreground shrink-0 pointer-events-none" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: query,
										onChange: (e) => setQuery(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												if (query.trim()) toast.success(`Showing ${filteredRows.length} matching records`, { description: `Search: "${query.trim()}" in ${selectedSearchField === "all" ? "all fields" : SEARCHABLE_COLUMNS$1.find((c) => c.id === selectedSearchField)?.label}` });
											}
										},
										placeholder: selectedSearchField === "all" ? "Search in all fields..." : `Search in ${SEARCHABLE_COLUMNS$1.find((c) => c.id === selectedSearchField)?.label || "field"}...`,
										"aria-label": "Search records",
										className: "h-6.5 w-32 sm:w-44 bg-transparent px-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
									}),
									query && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 mr-1.5 shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setQuery(""),
											"aria-label": "Clear search",
											className: "rounded p-0.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("kbd", {
											title: "Press Enter to search",
											className: "inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[9px] font-mono font-medium text-muted-foreground bg-muted/80 border border-border/80 shadow-2xs select-none",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerDownLeft, { className: "h-2.5 w-2.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Enter" })]
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportPopover, { onSelect: (f, s) => handleExport(`${f} (${s})`) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton$2, {
									label: "Schedule report",
									onClick: () => setScheduleOpen(true),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "h-3.5 w-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton$2, {
									label: "Column visibility",
									onClick: () => setModal("columns"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-3.5 w-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton$2, {
									label: "Chart view",
									onClick: () => setModal("chart"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-3.5 w-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton$2, {
									label: "Help & guide",
									onClick: () => setModal("help"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3.5 w-3.5" })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] font-medium text-foreground/80",
								children: [
									"1–",
									filteredRows.length,
									" of ",
									filteredRows.length
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton$2, {
										label: "Previous page",
										disabled: true,
										onClick: () => {},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton$2, {
										label: "Next page",
										disabled: true,
										onClick: () => {},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton$2, {
										label: "Refresh",
										onClick: () => toast.success("Driver job data refreshed"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" })
									})
								]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-border bg-surface shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-0 flex-1 overflow-auto overscroll-contain scroll-smooth",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full border-collapse text-left text-xs whitespace-nowrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "sticky top-0 z-10 bg-nav text-nav-foreground text-[11px] select-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border/40 divide-x divide-white/10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "w-10 px-2 py-2.5 text-center font-semibold" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2.5 font-semibold",
										children: "Company"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2.5 font-semibold",
										children: "Branch"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2.5 font-semibold",
										children: "Driver"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2.5 text-right font-semibold",
										children: "Distance"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2.5 text-right font-semibold",
										children: "Total Job Cost"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2.5 text-right font-semibold",
										children: "Allocated Job"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2.5 text-right font-semibold text-emerald-300",
										children: "Completed Without Issue"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2.5 text-right font-semibold text-amber-300",
										children: "Completed With Issue"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2.5 text-right font-semibold text-rose-300",
										children: "Failed"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2.5 text-right font-semibold text-rose-300",
										children: "Total Alert"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border text-foreground",
							children: filteredRows.map((row) => {
								const isExpanded = expandedId === row.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
									className: "divide-y divide-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										onClick: () => toggleExpand(row.id),
										className: cn("transition-colors duration-75 cursor-pointer divide-x divide-border/50", isExpanded ? "bg-amber-100/50 dark:bg-amber-950/40 font-medium" : "hover:bg-muted/50"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-2 py-2.5 text-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: (e) => {
														e.stopPropagation();
														toggleExpand(row.id);
													},
													className: cn("flex h-4.5 w-4.5 items-center justify-center rounded text-[11px] font-bold transition-transform cursor-pointer", isExpanded ? "bg-sky-500 text-white" : "bg-sky-500/15 text-sky-600 hover:bg-sky-500 hover:text-white"),
													children: isExpanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 font-medium text-foreground",
												children: row.company
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-muted-foreground",
												children: row.branch
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 font-semibold text-foreground",
												children: row.driver
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-right font-medium text-foreground",
												children: row.distance.toFixed(1)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-right text-muted-foreground",
												children: row.totalJobCost
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-right font-medium text-foreground",
												children: row.allocatedJob
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400",
												children: row.completedWithoutIssue
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-right font-bold text-amber-600 dark:text-amber-400",
												children: row.completedWithIssue
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-right font-bold text-rose-600 dark:text-rose-400",
												children: row.failed
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-right font-bold text-rose-600 dark:text-rose-400",
												children: row.totalAlert
											})
										]
									}), isExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
										className: "bg-muted/20",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											colSpan: 11,
											className: "p-3 pl-6",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "overflow-hidden rounded border border-border/80 bg-surface shadow-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "bg-muted/80 px-3 py-1.5 text-center text-xs font-bold text-foreground border-b border-border",
													children: [
														row.company,
														" - ",
														row.branch,
														" - ",
														row.driver,
														" From : 2024-12-01 00:00:00 To 2024-12-31 23:59:00"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
													className: "w-full border-collapse text-left text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
														className: "bg-muted/60 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
															className: "divide-x divide-border/60",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-2.5 py-2",
																	children: "Job Name"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-2.5 py-2",
																	children: "Job ID"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-2.5 py-2",
																	children: "Invoice Number"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-2.5 py-2",
																	children: "Shipment Number"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-2.5 py-2",
																	children: "Product"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-2 py-2 text-right",
																	children: "Quantity"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-2.5 py-2",
																	children: "Consign Name"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-2.5 py-2",
																	children: "Status"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-2.5 py-2",
																	children: "Planned Start"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-2.5 py-2",
																	children: "Actual Start"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-2 py-2 text-center text-rose-600",
																	children: "Difference"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-2.5 py-2 text-right",
																	children: "Start Odo"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-2.5 py-2",
																	children: "Planned End"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-2.5 py-2",
																	children: "Work End"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-2.5 py-2",
																	children: "Actual End"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-2 py-2 text-center text-emerald-600",
																	children: "Difference"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-2.5 py-2 text-right",
																	children: "End Odo"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-2 py-2 text-right",
																	children: "Job Dist"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-2.5 py-2 text-right",
																	children: "Job Dur"
																})
															]
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
														className: "divide-y divide-border text-[11px]",
														children: row.jobs.map((job, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
															className: "hover:bg-muted/40 divide-x divide-border/40",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-2.5 py-1.5 font-medium text-foreground truncate max-w-[140px]",
																	title: job.jobName,
																	children: job.jobName
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-2.5 py-1.5 text-muted-foreground",
																	children: job.jobId
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-2.5 py-1.5 text-muted-foreground",
																	children: job.invoiceNumber
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-2.5 py-1.5 text-muted-foreground",
																	children: job.shipmentNumber
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-2.5 py-1.5 text-muted-foreground",
																	children: job.product
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-2 py-1.5 text-right",
																	children: job.quantity
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-2.5 py-1.5 text-muted-foreground",
																	children: job.consignName
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: cn("px-2.5 py-1.5 font-medium", job.status.includes("Error") ? "text-emerald-600 font-semibold" : "text-amber-600 font-semibold"),
																	children: job.status
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-2.5 py-1.5 text-muted-foreground text-[10px]",
																	children: job.plannedStartTime
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-2.5 py-1.5 text-muted-foreground text-[10px]",
																	children: job.actualStartTime
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-2 py-1.5 text-center font-bold text-rose-600",
																	children: job.diffStart
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-2.5 py-1.5 text-right font-medium",
																	children: job.startOdometer.toFixed(1)
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-2.5 py-1.5 text-muted-foreground text-[10px]",
																	children: job.plannedEndTime
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-2.5 py-1.5 text-muted-foreground text-[10px]",
																	children: job.workEndTime
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-2.5 py-1.5 text-muted-foreground text-[10px]",
																	children: job.actualEndTime
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-2 py-1.5 text-center font-bold text-emerald-600",
																	children: job.diffEnd
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-2.5 py-1.5 text-right font-medium",
																	children: job.endOdometer.toFixed(1)
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-2 py-1.5 text-right font-semibold",
																	children: job.jobDistance.toFixed(1)
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-2.5 py-1.5 text-right font-medium text-foreground",
																	children: job.jobDuration
																})
															]
														}, idx))
													})]
												})]
											})
										})
									})]
								}, row.id);
							})
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportConfigPanel, {
				open: configOpen,
				onClose: () => setConfigOpen(false),
				filters,
				onChange: (patch) => setFilters((f) => ({
					...f,
					...patch
				})),
				objectOptions: driverJobSummaryRows.map((r) => ({
					id: r.id,
					label: r.driver,
					imei: "861234567890123",
					branch: r.branch
				})),
				onApply: () => {
					setConfigOpen(false);
					toast.success("Filters applied — driver job data updated");
				},
				onExport: (format, scope) => handleExport(`${format} (${scope})`)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScheduleDrawer, {
				open: scheduleOpen,
				onClose: () => setScheduleOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportModals, {
				kind: modal,
				onClose: () => setModal(null),
				columns: [
					{
						key: "company",
						label: "Company"
					},
					{
						key: "branch",
						label: "Branch"
					},
					{
						key: "driver",
						label: "Driver"
					},
					{
						key: "distance",
						label: "Distance"
					},
					{
						key: "allocatedJob",
						label: "Allocated Job"
					},
					{
						key: "completedWithoutIssue",
						label: "Completed Without Issue"
					},
					{
						key: "completedWithIssue",
						label: "Completed With Issue"
					},
					{
						key: "failed",
						label: "Failed"
					},
					{
						key: "totalAlert",
						label: "Total Alert"
					}
				],
				hidden: [],
				onToggleColumn: () => {},
				chartType: "Bar",
				onChartType: (t) => toast.success(`${t} chart selected`)
			})
		]
	});
}
var PRESET_OPTIONS = [
	"Today",
	"Yesterday",
	"This Week",
	"Last Week",
	"Last 7 Days",
	"This Month",
	"Last Month",
	"Custom Range"
];
var MONTH_FULL_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
var WEEKDAY_NAMES = [
	"Su",
	"Mo",
	"Tu",
	"We",
	"Th",
	"Fr",
	"Sa"
];
var HOUR_OPTIONS = [
	"12",
	"01",
	"02",
	"03",
	"04",
	"05",
	"06",
	"07",
	"08",
	"09",
	"10",
	"11"
];
var MINUTE_OPTIONS = [
	"00",
	"05",
	"10",
	"15",
	"20",
	"25",
	"30",
	"35",
	"40",
	"45",
	"50",
	"55",
	"59"
];
function formatDateToISO(d) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function formatDateToDisplayDDMM(isoStr) {
	if (!isoStr) return "";
	const parts = isoStr.split("-");
	if (parts.length !== 3) return isoStr;
	const [y, m, d] = parts;
	return `${d}/${m}/${y}`;
}
function parseISOToDate(isoStr) {
	if (!isoStr) return /* @__PURE__ */ new Date();
	const parts = isoStr.split("-");
	if (parts.length === 3) {
		const y = parseInt(parts[0] || "2026", 10);
		const m = parseInt(parts[1] || "1", 10) - 1;
		const d = parseInt(parts[2] || "1", 10);
		return new Date(y, m, d);
	}
	return /* @__PURE__ */ new Date();
}
function formatTimeTo12Hour(timeStr) {
	if (!timeStr) return "12:00 AM";
	const [hStr, mStr] = timeStr.split(":");
	let h = parseInt(hStr || "0", 10);
	const m = mStr || "00";
	const ampm = h >= 12 ? "PM" : "AM";
	h = h % 12;
	if (h === 0) h = 12;
	return `${String(h).padStart(2, "0")}:${m} ${ampm}`;
}
function parseTimeToParts(timeStr) {
	if (!timeStr) return {
		hour: "12",
		minute: "00",
		ampm: "AM"
	};
	const [hStr, mStr] = timeStr.split(":");
	let h = parseInt(hStr || "0", 10);
	const m = mStr || "00";
	const ampm = h >= 12 ? "PM" : "AM";
	h = h % 12;
	if (h === 0) h = 12;
	return {
		hour: String(h).padStart(2, "0"),
		minute: m,
		ampm
	};
}
function composeTimeTo24Hour(hourStr, minuteStr, ampm) {
	let h = parseInt(hourStr || "12", 10);
	if (ampm === "PM" && h < 12) h += 12;
	if (ampm === "AM" && h === 12) h = 0;
	return `${String(h).padStart(2, "0")}:${minuteStr.padStart(2, "0")}`;
}
function ModernTimeSelector({ hour, minute, ampm, onHourChange, onMinuteChange, onAmPmChange, className }) {
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const displayTime = `${hour}:${minute} ${ampm}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
		open: isOpen,
		onOpenChange: setIsOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: cn("flex h-8.5 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-xs font-medium text-muted-foreground transition-all cursor-pointer shadow-2xs hover:bg-muted/40 hover:border-[#0089FF]/50", isOpen && "border-[#0089FF] ring-2 ring-[#0089FF]/20", className),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: displayTime }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
			align: "start",
			sideOffset: 4,
			className: "w-64 p-2.5 text-xs bg-popover/95 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-60 select-none animate-in fade-in zoom-in-95",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-1.5 mb-2.5 pb-2 border-b border-border/70",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						onHourChange("12");
						onMinuteChange("00");
						onAmPmChange("AM");
					},
					className: "flex flex-col items-center justify-center py-1.5 px-2 rounded-md bg-muted/60 hover:bg-muted text-foreground transition-all cursor-pointer active:scale-98",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold leading-tight",
						children: "12:00 AM"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[9px] text-muted-foreground font-medium leading-tight mt-0.5",
						children: "(Start)"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						onHourChange("11");
						onMinuteChange("59");
						onAmPmChange("PM");
					},
					className: "flex flex-col items-center justify-center py-1.5 px-2 rounded-md bg-muted/60 hover:bg-muted text-foreground transition-all cursor-pointer active:scale-98",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold leading-tight",
						children: "11:59 PM"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[9px] text-muted-foreground font-medium leading-tight mt-0.5",
						children: "(End)"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-1.5 h-38",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col overflow-y-auto pr-0.5 space-y-0.5 custom-scrollbar",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground font-semibold px-1 mb-1 sticky top-0 bg-popover",
							children: "Hr"
						}), HOUR_OPTIONS.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onHourChange(h),
							className: cn("px-1 py-1 text-xs rounded-sm text-center font-medium transition-colors cursor-pointer", hour === h ? "bg-[#0089FF] text-white font-bold shadow-xs" : "text-foreground hover:bg-muted"),
							children: h
						}, h))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col overflow-y-auto pr-0.5 space-y-0.5 custom-scrollbar border-x border-border/60 px-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground font-semibold px-1 mb-1 sticky top-0 bg-popover",
							children: "Min"
						}), MINUTE_OPTIONS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onMinuteChange(m),
							className: cn("px-1 py-1 text-xs rounded-sm text-center font-medium transition-colors cursor-pointer", minute === m ? "bg-[#0089FF] text-white font-bold shadow-xs" : "text-foreground hover:bg-muted"),
							children: m
						}, m))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col justify-start space-y-1.5 pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onAmPmChange("AM"),
							className: cn("py-1.5 text-xs rounded-md text-center font-semibold transition-all cursor-pointer active:scale-98", ampm === "AM" ? "bg-[#0089FF] text-white shadow-xs" : "text-foreground hover:bg-muted bg-background border border-border/80"),
							children: "AM"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onAmPmChange("PM"),
							className: cn("py-1.5 text-xs rounded-md text-center font-semibold transition-all cursor-pointer active:scale-98", ampm === "PM" ? "bg-[#0089FF] text-white shadow-xs" : "text-foreground hover:bg-muted bg-background border border-border/80"),
							children: "PM"
						})]
					})
				]
			})]
		})]
	});
}
function getDateRangeFromPreset(preset) {
	const now = /* @__PURE__ */ new Date();
	if (preset === "Today") {
		const str = formatDateToISO(now);
		return {
			from: str,
			to: str
		};
	}
	if (preset === "Yesterday") {
		const y = new Date(now);
		y.setDate(y.getDate() - 1);
		const str = formatDateToISO(y);
		return {
			from: str,
			to: str
		};
	}
	if (preset === "This Week") {
		const start = new Date(now);
		const day = start.getDay();
		const diff = start.getDate() - day + (day === 0 ? -6 : 1);
		start.setDate(diff);
		return {
			from: formatDateToISO(start),
			to: formatDateToISO(now)
		};
	}
	if (preset === "Last Week") {
		const start = new Date(now);
		const day = start.getDay();
		const diff = start.getDate() - day - 6 + (day === 0 ? -6 : 1);
		start.setDate(diff);
		const end = new Date(start);
		end.setDate(start.getDate() + 6);
		return {
			from: formatDateToISO(start),
			to: formatDateToISO(end)
		};
	}
	if (preset === "Last 7 Days") {
		const start = new Date(now);
		start.setDate(now.getDate() - 6);
		return {
			from: formatDateToISO(start),
			to: formatDateToISO(now)
		};
	}
	if (preset === "Last 30 Days") {
		const start = new Date(now);
		start.setDate(now.getDate() - 29);
		return {
			from: formatDateToISO(start),
			to: formatDateToISO(now)
		};
	}
	if (preset === "This Month") return {
		from: formatDateToISO(new Date(now.getFullYear(), now.getMonth(), 1)),
		to: formatDateToISO(now)
	};
	if (preset === "Last Month") {
		const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
		const end = new Date(now.getFullYear(), now.getMonth(), 0);
		return {
			from: formatDateToISO(start),
			to: formatDateToISO(end)
		};
	}
	return {
		from: formatDateToISO(now),
		to: formatDateToISO(now)
	};
}
function ReportQuickFilterBar({ filters, onChange, onOpenFilterDrawer, className }) {
	const [dateOpen, setDateOpen] = (0, import_react.useState)(false);
	const [companyOpen, setCompanyOpen] = (0, import_react.useState)(false);
	const [branchOpen, setBranchOpen] = (0, import_react.useState)(false);
	const [vehicleOpen, setVehicleOpen] = (0, import_react.useState)(false);
	const [companySearch, setCompanySearch] = (0, import_react.useState)("");
	const [branchSearch, setBranchSearch] = (0, import_react.useState)("");
	const [vehicleSearch, setVehicleSearch] = (0, import_react.useState)("");
	const [presetMenuOpen, setPresetMenuOpen] = (0, import_react.useState)(false);
	const [draftPreset, setDraftPreset] = (0, import_react.useState)(filters.datePreset || "Today");
	const [draftFrom, setDraftFrom] = (0, import_react.useState)(filters.from || "2026-09-02");
	const [draftTo, setDraftTo] = (0, import_react.useState)(filters.to || "2026-09-02");
	const [selectionStep, setSelectionStep] = (0, import_react.useState)("start");
	const [hoverDate, setHoverDate] = (0, import_react.useState)(null);
	const initialFromParts = parseTimeToParts(filters.fromTime || "00:00");
	const initialToParts = parseTimeToParts(filters.toTime || "23:59");
	const [fromHour, setFromHour] = (0, import_react.useState)(initialFromParts.hour);
	const [fromMinute, setFromMinute] = (0, import_react.useState)(initialFromParts.minute);
	const [fromAmPm, setFromAmPm] = (0, import_react.useState)(initialFromParts.ampm);
	const [toHour, setToHour] = (0, import_react.useState)(initialToParts.hour);
	const [toMinute, setToMinute] = (0, import_react.useState)(initialToParts.minute);
	const [toAmPm, setToAmPm] = (0, import_react.useState)(initialToParts.ampm);
	const [viewDate, setViewDate] = (0, import_react.useState)(() => {
		const d = parseISOToDate(filters.from || "2026-09-02");
		return new Date(d.getFullYear(), d.getMonth() - 1, 1);
	});
	(0, import_react.useEffect)(() => {
		if (dateOpen) {
			const preset = filters.datePreset || "Today";
			setDraftPreset(preset);
			setDraftFrom(filters.from || "2026-09-02");
			setDraftTo(filters.to || "2026-09-02");
			setPresetMenuOpen(false);
			setSelectionStep("start");
			const fp = parseTimeToParts(filters.fromTime || "00:00");
			const tp = parseTimeToParts(filters.toTime || "23:59");
			setFromHour(fp.hour);
			setFromMinute(fp.minute);
			setFromAmPm(fp.ampm);
			setToHour(tp.hour);
			setToMinute(tp.minute);
			setToAmPm(tp.ampm);
			const d = parseISOToDate(filters.from || "2026-09-02");
			setViewDate(new Date(d.getFullYear(), d.getMonth() - 1, 1));
		}
	}, [dateOpen, filters]);
	const prevMonth = () => {
		setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
	};
	const nextMonth = () => {
		setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
	};
	const handlePresetSelect = (preset) => {
		setDraftPreset(preset);
		setPresetMenuOpen(false);
		if (preset === "Custom Range") {
			setSelectionStep("start");
			return;
		}
		const range = getDateRangeFromPreset(preset);
		setDraftFrom(range.from);
		setDraftTo(range.to);
		const d = parseISOToDate(range.from);
		setViewDate(new Date(d.getFullYear(), d.getMonth() - 1, 1));
	};
	const handleDualCalendarDayClick = (isoDate) => {
		setDraftPreset("Custom Range");
		if (selectionStep === "start") {
			setDraftFrom(isoDate);
			setDraftTo(isoDate);
			setSelectionStep("end");
		} else {
			if (isoDate < draftFrom) {
				setDraftFrom(isoDate);
				setDraftTo(draftFrom);
			} else setDraftTo(isoDate);
			setSelectionStep("start");
		}
	};
	const handleApplyDateTime = () => {
		const fTime = composeTimeTo24Hour(fromHour, fromMinute, fromAmPm);
		const tTime = composeTimeTo24Hour(toHour, toMinute, toAmPm);
		onChange({
			datePreset: draftPreset,
			from: draftFrom,
			to: draftTo,
			fromTime: fTime,
			toTime: tTime,
			enableTimeRange: true,
			date: draftFrom
		});
		setDateOpen(false);
	};
	const handleResetDate = () => {
		const today = /* @__PURE__ */ new Date();
		const todayStr = formatDateToISO(today);
		setDraftPreset("Today");
		setDraftFrom(todayStr);
		setDraftTo(todayStr);
		setFromHour("12");
		setFromMinute("00");
		setFromAmPm("AM");
		setToHour("11");
		setToMinute("59");
		setToAmPm("PM");
		setPresetMenuOpen(false);
		setViewDate(new Date(today.getFullYear(), today.getMonth() - 1, 1));
	};
	const dateTimeRangeTriggerLabel = (0, import_react.useMemo)(() => {
		const fDate = formatDateToDisplayDDMM(filters.from || "2026-09-02");
		const tDate = formatDateToDisplayDDMM(filters.to || "2026-09-02");
		return `${fDate} ${filters.fromTime ? formatTimeTo12Hour(filters.fromTime) : "12:00 AM"} - ${tDate} ${filters.toTime ? formatTimeTo12Hour(filters.toTime) : "11:59 PM"}`;
	}, [
		filters.from,
		filters.to,
		filters.fromTime,
		filters.toTime
	]);
	const renderDualMonth = (year, month, isFromMonth) => {
		const firstDayIndex = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const daysInPrevMonth = new Date(year, month, 0).getDate();
		const cells = [];
		for (let i = firstDayIndex - 1; i >= 0; i--) {
			const d = daysInPrevMonth - i;
			const prevM = month === 0 ? 11 : month - 1;
			const prevY = month === 0 ? year - 1 : year;
			const dateStr = formatDateToISO(new Date(prevY, prevM, d));
			cells.push({
				dateStr,
				dayNum: d,
				isCurrentMonth: false
			});
		}
		for (let d = 1; d <= daysInMonth; d++) {
			const dateStr = formatDateToISO(new Date(year, month, d));
			cells.push({
				dateStr,
				dayNum: d,
				isCurrentMonth: true
			});
		}
		const remaining = (cells.length > 35 ? 42 : 35) - cells.length;
		for (let d = 1; d <= remaining; d++) {
			const nextM = month === 11 ? 0 : month + 1;
			const nextY = month === 11 ? year + 1 : year;
			const dateStr = formatDateToISO(new Date(nextY, nextM, d));
			cells.push({
				dateStr,
				dayNum: d,
				isCurrentMonth: false
			});
		}
		const monthLabel = `${MONTH_FULL_NAMES[month]} ${year}`;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 select-none",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-2 px-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-xs text-foreground",
						children: monthLabel
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: prevMonth,
							className: "p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors",
							title: "Previous month",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: nextMonth,
							className: "p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors",
							title: "Next month",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7 gap-0.5 text-center text-[10px] font-bold text-muted-foreground uppercase mb-1",
					children: WEEKDAY_NAMES.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-4 flex items-center justify-center",
						children: w
					}, w))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7 gap-0.5 text-center text-xs mb-3",
					children: cells.map(({ dateStr, dayNum, isCurrentMonth }, idx) => {
						const isStart = dateStr === draftFrom;
						const isEnd = dateStr === draftTo;
						const effectiveEnd = selectionStep === "end" && hoverDate && hoverDate >= draftFrom ? hoverDate : draftTo;
						const inRange = draftFrom && effectiveEnd && dateStr > draftFrom && dateStr < effectiveEnd;
						const isSelected = isStart || isEnd;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => handleDualCalendarDayClick(dateStr),
							onMouseEnter: () => {
								if (selectionStep === "end") setHoverDate(dateStr);
							},
							className: cn("h-7 w-full flex items-center justify-center text-xs rounded-md transition-all cursor-pointer relative font-medium", !isCurrentMonth && "text-muted-foreground/30 pointer-events-none", isCurrentMonth && !isSelected && !inRange && "text-foreground hover:bg-muted", inRange && "bg-[#0089FF]/15 text-[#0089FF] font-semibold rounded-none first:rounded-l-md last:rounded-r-md", isSelected && "bg-[#0089FF] text-white font-bold shadow-xs z-10"),
							children: dayNum
						}, idx);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pt-2 border-t border-border/70",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-[11px] font-semibold text-foreground mb-1",
						children: isFromMonth ? "From Time" : "To Time"
					}), isFromMonth ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModernTimeSelector, {
						hour: fromHour,
						minute: fromMinute,
						ampm: fromAmPm,
						onHourChange: setFromHour,
						onMinuteChange: setFromMinute,
						onAmPmChange: setFromAmPm
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModernTimeSelector, {
						hour: toHour,
						minute: toMinute,
						ampm: toAmPm,
						onHourChange: setToHour,
						onMinuteChange: setToMinute,
						onAmPmChange: setToAmPm
					})]
				})
			]
		});
	};
	const allCompanies = (0, import_react.useMemo)(() => {
		return COMPANIES.filter((c) => c !== "All");
	}, []);
	const [draftCompanies, setDraftCompanies] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (companyOpen) {
			const valid = filters.companies && filters.companies.length > 0 && !filters.companies.includes("All") ? (filters.companies || []).filter((c) => allCompanies.includes(c)) : [];
			setDraftCompanies(valid.length > 0 ? valid : allCompanies);
			setCompanySearch("");
		}
	}, [
		companyOpen,
		filters.companies,
		allCompanies
	]);
	const isAllCompaniesDraftSelected = draftCompanies.length === allCompanies.length && allCompanies.length > 0;
	const toggleAllDraftCompanies = () => {
		if (isAllCompaniesDraftSelected) setDraftCompanies([]);
		else setDraftCompanies([...allCompanies]);
	};
	const toggleDraftCompany = (comp) => {
		if (draftCompanies.includes(comp)) setDraftCompanies(draftCompanies.filter((x) => x !== comp));
		else setDraftCompanies([...draftCompanies, comp]);
	};
	const availableBranches = (0, import_react.useMemo)(() => {
		const currentCompanies = filters.companies && filters.companies.length > 0 && !filters.companies.includes("All") ? filters.companies : allCompanies;
		return getBranchesForCompanies(currentCompanies);
	}, [filters.companies, allCompanies]);
	const [draftBranches, setDraftBranches] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (branchOpen) {
			const valid = filters.branches && filters.branches.length > 0 && !filters.branches.includes("All") ? (filters.branches || []).filter((b) => availableBranches.includes(b)) : [];
			setDraftBranches(valid.length > 0 ? valid : availableBranches);
			setBranchSearch("");
		}
	}, [
		branchOpen,
		filters.branches,
		availableBranches
	]);
	const isAllBranchesDraftSelected = draftBranches.length === availableBranches.length && availableBranches.length > 0;
	const toggleAllDraftBranches = () => {
		if (isAllBranchesDraftSelected) setDraftBranches([]);
		else setDraftBranches([...availableBranches]);
	};
	const toggleDraftBranch = (b) => {
		if (draftBranches.includes(b)) setDraftBranches(draftBranches.filter((x) => x !== b));
		else setDraftBranches([...draftBranches, b]);
	};
	const activeSelectedBranches = (0, import_react.useMemo)(() => {
		const valid = (filters.branches && filters.branches.length > 0 && !filters.branches.includes("All") ? filters.branches : availableBranches).filter((branch) => availableBranches.includes(branch));
		return valid.length > 0 ? valid : availableBranches;
	}, [filters.branches, availableBranches]);
	const availableVehicles = (0, import_react.useMemo)(() => {
		return getVehiclesForBranches(activeSelectedBranches);
	}, [activeSelectedBranches]);
	const availableVehicleIds = (0, import_react.useMemo)(() => {
		return availableVehicles.map((v) => v.id);
	}, [availableVehicles]);
	const [draftObjects, setDraftObjects] = (0, import_react.useState)([]);
	const [collapsedBranchGroups, setCollapsedBranchGroups] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (vehicleOpen) {
			const valid = filters.objects && filters.objects.length > 0 && !filters.objects.includes("All") ? (filters.objects || []).filter((id) => availableVehicleIds.includes(id)) : [];
			setDraftObjects(valid.length > 0 ? valid : availableVehicleIds);
			setVehicleSearch("");
		}
	}, [
		vehicleOpen,
		filters.objects,
		availableVehicleIds
	]);
	const isAllVehiclesDraftSelected = draftObjects.length === availableVehicleIds.length && availableVehicleIds.length > 0;
	const toggleAllDraftVehicles = () => {
		if (isAllVehiclesDraftSelected) setDraftObjects([]);
		else setDraftObjects([...availableVehicleIds]);
	};
	const toggleDraftObject = (id) => {
		if (draftObjects.includes(id)) setDraftObjects(draftObjects.filter((x) => x !== id));
		else setDraftObjects([...draftObjects, id]);
	};
	const toggleDraftBranchVehicles = (branchName) => {
		const branchVehicleIds = (BRANCH_VEHICLES_MAP[branchName] || []).map((v) => v.id);
		if (branchVehicleIds.every((id) => draftObjects.includes(id))) setDraftObjects(draftObjects.filter((id) => !branchVehicleIds.includes(id)));
		else setDraftObjects([.../* @__PURE__ */ new Set([...draftObjects, ...branchVehicleIds])]);
	};
	const toggleCollapseBranchGroup = (branchName) => {
		setCollapsedBranchGroups((prev) => prev.includes(branchName) ? prev.filter((b) => b !== branchName) : [...prev, branchName]);
	};
	const filteredCompanyList = (0, import_react.useMemo)(() => {
		const q = companySearch.trim().toLowerCase();
		if (!q) return allCompanies;
		return allCompanies.filter((c) => c.toLowerCase().includes(q));
	}, [allCompanies, companySearch]);
	const filteredBranchList = (0, import_react.useMemo)(() => {
		const q = branchSearch.trim().toLowerCase();
		if (!q) return availableBranches;
		return availableBranches.filter((b) => b.toLowerCase().includes(q));
	}, [availableBranches, branchSearch]);
	const groupedFilteredVehicles = (0, import_react.useMemo)(() => {
		const q = vehicleSearch.trim().toLowerCase();
		const map = /* @__PURE__ */ new Map();
		for (const branch of activeSelectedBranches) {
			const matched = (BRANCH_VEHICLES_MAP[branch] || []).filter((v) => !q || v.name.toLowerCase().includes(q) || v.imei.toLowerCase().includes(q) || v.driver && v.driver.toLowerCase().includes(q) || branch.toLowerCase().includes(q));
			if (matched.length > 0) map.set(branch, matched);
		}
		return Array.from(map.entries());
	}, [activeSelectedBranches, vehicleSearch]);
	const companyLabel = (0, import_react.useMemo)(() => {
		const list = filters.companies || [];
		if (list.length === 0 || list.length === allCompanies.length || list.includes("All")) return "All";
		if (list.length === 1) return list[0];
		return `${list[0]} +${list.length - 1}`;
	}, [filters.companies, allCompanies.length]);
	const branchLabel = (0, import_react.useMemo)(() => {
		const list = (filters.branches || []).filter((b) => availableBranches.includes(b));
		if (list.length === 0 || list.length === availableBranches.length || list.includes("All")) return "All";
		if (list.length === 1) return list[0];
		return `${list[0]} +${list.length - 1}`;
	}, [filters.branches, availableBranches]);
	const vehicleLabel = (0, import_react.useMemo)(() => {
		const selected = (filters.objects || []).filter((id) => availableVehicleIds.includes(id));
		if (selected.length === 0 || selected.length === availableVehicleIds.length || selected.includes("All")) return "All";
		if (selected.length === 1) return selected[0];
		return `${selected[0]} +${selected.length - 1}`;
	}, [filters.objects, availableVehicleIds]);
	const handleApplyCompanies = () => {
		if (draftCompanies.length === 0) return;
		const isAll = draftCompanies.length === allCompanies.length;
		const appliedCompanies = isAll ? [] : draftCompanies;
		const newAvailBranches = getBranchesForCompanies(isAll ? allCompanies : draftCompanies);
		const validBranches = (filters.branches || []).filter((b) => newAvailBranches.includes(b));
		const nextBranches = validBranches.length > 0 && validBranches.length < newAvailBranches.length ? validBranches : [];
		const newAvailVehicleIds = getVehiclesForBranches(nextBranches.length > 0 ? nextBranches : newAvailBranches).map((v) => v.id);
		const validVehicles = (filters.objects || []).filter((id) => newAvailVehicleIds.includes(id));
		onChange({
			companies: appliedCompanies,
			branches: nextBranches,
			objects: validVehicles.length > 0 && validVehicles.length < newAvailVehicleIds.length ? validVehicles : []
		});
		setCompanyOpen(false);
	};
	const handleApplyBranches = () => {
		if (draftBranches.length === 0) return;
		const isAll = draftBranches.length === availableBranches.length;
		const appliedBranches = isAll ? [] : draftBranches;
		const newAvailVehicleIds = getVehiclesForBranches(isAll ? availableBranches : draftBranches).map((v) => v.id);
		const validVehicles = (filters.objects || []).filter((id) => newAvailVehicleIds.includes(id));
		onChange({
			branches: appliedBranches,
			objects: validVehicles.length > 0 && validVehicles.length < newAvailVehicleIds.length ? validVehicles : []
		});
		setBranchOpen(false);
	};
	const handleApplyVehicles = () => {
		if (draftObjects.length === 0) return;
		onChange({ objects: draftObjects.length === availableVehicleIds.length ? [] : draftObjects });
		setVehicleOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-wrap items-center gap-2 text-xs text-muted-foreground", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
				open: dateOpen,
				onOpenChange: setDateOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: cn("inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer select-none hover:bg-muted/70", dateOpen ? "bg-[#0089FF]/10 text-[#0089FF] ring-1 ring-[#0089FF]/30" : "text-[#0089FF] hover:text-[#0089FF]"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-[#0089FF] shrink-0" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-[#0089FF]",
								children: dateTimeRangeTriggerLabel
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-3 w-3 text-[#0089FF]/70 shrink-0 transition-transform duration-200", dateOpen && "rotate-180") })
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
					align: "start",
					sideOffset: 4,
					className: cn("p-0 text-xs bg-popover/95 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-50 select-none overflow-visible transition-all duration-200 space-y-0", draftPreset === "Custom Range" ? "w-[580px]" : "w-[360px]"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-[#0089FF]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold text-foreground block",
											children: "Date Range"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setDateOpen(false),
										className: "rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setPresetMenuOpen((prev) => !prev),
									className: cn("flex h-8.5 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-xs font-medium text-muted-foreground transition-all cursor-pointer shadow-2xs hover:bg-muted/40 hover:border-[#0089FF]/50", presetMenuOpen && "border-[#0089FF] ring-2 ring-[#0089FF]/20"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: draftPreset }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200", presetMenuOpen && "rotate-180") })]
								}),
								presetMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute left-0 top-full mt-1 w-full rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md shadow-lg p-1 z-60 animate-in fade-in zoom-in-95 space-y-0.5",
									children: PRESET_OPTIONS.map((opt) => {
										const isSelected = draftPreset === opt;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => handlePresetSelect(opt),
											className: cn("flex w-full items-center justify-between px-2.5 py-1.5 rounded-sm text-xs transition-all cursor-pointer select-none text-left", isSelected ? "bg-[#0089FF]/10 text-[#0089FF] font-bold" : "text-foreground hover:bg-muted font-medium"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: opt }), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-[#0089FF] shrink-0" })]
										}, opt);
									})
								})
							]
						}), draftPreset === "Custom Range" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 flex gap-4",
							children: [
								renderDualMonth(viewDate.getFullYear(), viewDate.getMonth(), true),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-px bg-border/60 my-1" }),
								renderDualMonth(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1).getFullYear(), new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1).getMonth(), false)
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5 text-[#0089FF]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-foreground block",
									children: "Time Range"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModernTimeSelector, {
									hour: fromHour,
									minute: fromMinute,
									ampm: fromAmPm,
									onHourChange: setFromHour,
									onMinuteChange: setFromMinute,
									onAmPmChange: setFromAmPm
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModernTimeSelector, {
									hour: toHour,
									minute: toMinute,
									ampm: toAmPm,
									onHourChange: setToHour,
									onMinuteChange: setToMinute,
									onAmPmChange: setToAmPm
								})]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-2.5 px-4 border-t border-border/70 flex items-center justify-between bg-muted/20 rounded-b-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleResetDate,
							className: "text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer transition-colors",
							children: "Clear"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDateOpen(false),
								className: "px-3 py-1.5 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleApplyDateTime,
								className: "px-4 py-1.5 text-xs rounded-md bg-[#0089FF] text-white font-semibold hover:bg-[#0070d6] shadow-xs cursor-pointer transition-all active:scale-98",
								children: "Apply"
							})]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
				open: companyOpen,
				onOpenChange: setCompanyOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: cn("inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors cursor-pointer select-none hover:bg-muted/70", companyOpen && "bg-muted font-semibold"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: "Company:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-muted-foreground",
								children: companyLabel
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3 opacity-60 shrink-0" })
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
					align: "start",
					sideOffset: 4,
					className: "w-68 p-0 text-xs bg-popover/95 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-50 overflow-hidden select-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 px-4 border-b border-border/70 space-y-2 bg-muted/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs font-semibold text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Select Company" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-semibold text-[#0089FF] bg-[#0089FF]/10 px-2 py-0.5 rounded-full",
									children: [draftCompanies.length, " selected"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex h-8 items-center gap-2 rounded-md border border-input bg-background px-2.5 focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: companySearch,
										onChange: (e) => setCompanySearch(e.target.value),
										placeholder: "Search company...",
										className: "h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
									}),
									companySearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setCompanySearch(""),
										className: "rounded-md p-0.5 text-muted-foreground hover:text-foreground cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-4 py-1.5 border-b border-border/60 flex items-center justify-between bg-muted/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 cursor-pointer select-none w-full text-xs font-semibold text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: isAllCompaniesDraftSelected,
									onChange: toggleAllDraftCompanies,
									className: "h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Select All" })]
							})
						}),
						draftCompanies.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-3 my-1.5 px-2.5 py-1.5 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200/70 dark:border-red-800/40 text-[10px] text-red-600 dark:text-red-400 font-medium leading-snug",
							children: "Select at least one item, or all items will be selected by default."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-h-52 overflow-y-auto p-1 space-y-0.5 custom-scrollbar",
							children: [filteredCompanyList.map((comp) => {
								const checked = draftCompanies.includes(comp);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: cn("flex items-center gap-2 px-2.5 py-1.5 rounded-sm hover:bg-muted cursor-pointer transition-colors text-xs select-none", checked && "bg-muted/40"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked,
										onChange: () => toggleDraftCompany(comp),
										className: "h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("text-foreground font-medium", checked && "font-semibold text-foreground"),
										children: comp
									})]
								}, comp);
							}), filteredCompanyList.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-4 text-center text-xs text-muted-foreground",
								children: "No company found"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2.5 px-4 border-t border-border/70 flex items-center justify-between bg-muted/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDraftCompanies([]),
								className: "text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer transition-colors",
								children: "Clear"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setCompanyOpen(false),
									className: "px-3 py-1.5 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: draftCompanies.length === 0,
									onClick: handleApplyCompanies,
									className: cn("px-4 py-1.5 text-xs rounded-md font-semibold shadow-xs transition-all active:scale-98", draftCompanies.length === 0 ? "bg-[#0089FF]/40 text-white/70 cursor-not-allowed" : "bg-[#0089FF] text-white hover:bg-[#0070d6] cursor-pointer"),
									children: "Apply"
								})]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
				open: branchOpen,
				onOpenChange: setBranchOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: cn("inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors cursor-pointer select-none hover:bg-muted/70", branchOpen && "bg-muted font-semibold"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: "Branch:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-muted-foreground",
								children: branchLabel
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3 opacity-60 shrink-0" })
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
					align: "start",
					sideOffset: 4,
					className: "w-68 p-0 text-xs bg-popover/95 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-50 overflow-hidden select-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 px-4 border-b border-border/70 space-y-2 bg-muted/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs font-semibold text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Select Branches" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-semibold text-[#0089FF] bg-[#0089FF]/10 px-2 py-0.5 rounded-full",
									children: [draftBranches.length, " selected"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex h-8 items-center gap-2 rounded-md border border-input bg-background px-2.5 focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: branchSearch,
										onChange: (e) => setBranchSearch(e.target.value),
										placeholder: "Search branch...",
										className: "h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
									}),
									branchSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setBranchSearch(""),
										className: "rounded-md p-0.5 text-muted-foreground hover:text-foreground cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-4 py-1.5 border-b border-border/60 flex items-center justify-between bg-muted/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 cursor-pointer select-none w-full text-xs font-semibold text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: isAllBranchesDraftSelected,
									onChange: toggleAllDraftBranches,
									className: "h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Select All" })]
							})
						}),
						draftBranches.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-3 my-1.5 px-2.5 py-1.5 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200/70 dark:border-red-800/40 text-[10px] text-red-600 dark:text-red-400 font-medium leading-snug",
							children: "Select at least one item, or all items will be selected by default."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-h-52 overflow-y-auto p-1 space-y-0.5 custom-scrollbar",
							children: [filteredBranchList.map((b) => {
								const checked = draftBranches.includes(b);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: cn("flex items-center gap-2 px-2.5 py-1.5 rounded-sm hover:bg-muted cursor-pointer transition-colors text-xs select-none", checked && "bg-muted/40"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked,
										onChange: () => toggleDraftBranch(b),
										className: "h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("text-foreground font-medium", checked && "font-semibold text-foreground"),
										children: b
									})]
								}, b);
							}), filteredBranchList.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-4 text-center text-xs text-muted-foreground",
								children: "No branch found"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2.5 px-4 border-t border-border/70 flex items-center justify-between bg-muted/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDraftBranches([]),
								className: "text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer transition-colors",
								children: "Clear"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setBranchOpen(false),
									className: "px-3 py-1.5 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: draftBranches.length === 0,
									onClick: handleApplyBranches,
									className: cn("px-4 py-1.5 text-xs rounded-md font-semibold shadow-xs transition-all active:scale-98", draftBranches.length === 0 ? "bg-[#0089FF]/40 text-white/70 cursor-not-allowed" : "bg-[#0089FF] text-white hover:bg-[#0070d6] cursor-pointer"),
									children: "Apply"
								})]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
				open: vehicleOpen,
				onOpenChange: setVehicleOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: cn("inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors cursor-pointer select-none hover:bg-muted/70", vehicleOpen && "bg-muted font-semibold"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: "Vehicle:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-muted-foreground",
								children: vehicleLabel
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3 opacity-60 shrink-0" })
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
					align: "start",
					sideOffset: 4,
					className: "w-84 p-0 text-xs bg-popover/95 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-50 overflow-hidden select-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 px-4 border-b border-border/70 space-y-2 bg-muted/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs font-semibold text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Select Vehicles" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-semibold text-[#0089FF] bg-[#0089FF]/10 px-2 py-0.5 rounded-full",
									children: [
										draftObjects.length,
										" / ",
										availableVehicleIds.length,
										" selected"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex h-8 items-center gap-2 rounded-md border border-input bg-background px-2.5 focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: vehicleSearch,
										onChange: (e) => setVehicleSearch(e.target.value),
										placeholder: "Search vehicle or IMEI...",
										className: "h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
									}),
									vehicleSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setVehicleSearch(""),
										className: "rounded-md p-0.5 text-muted-foreground hover:text-foreground cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-4 py-1.5 border-b border-border/60 flex items-center justify-between bg-muted/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 cursor-pointer select-none w-full text-xs font-semibold text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: isAllVehiclesDraftSelected,
									onChange: toggleAllDraftVehicles,
									className: "h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Select All Vehicles" })]
							})
						}),
						draftObjects.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-3 my-1.5 px-2.5 py-1.5 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200/70 dark:border-red-800/40 text-[10px] text-red-600 dark:text-red-400 font-medium leading-snug",
							children: "Select at least one item, or all items will be selected by default."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-h-64 overflow-y-auto p-1.5 space-y-1.5 custom-scrollbar",
							children: [groupedFilteredVehicles.map(([branchName, vList]) => {
								const isCollapsed = collapsedBranchGroups.includes(branchName) && !vehicleSearch;
								const branchVehicleIds = vList.map((v) => v.id);
								const branchSelectedCount = branchVehicleIds.filter((id) => draftObjects.includes(id)).length;
								const allBranchIn = branchSelectedCount === branchVehicleIds.length && branchVehicleIds.length > 0;
								const someBranchIn = branchSelectedCount > 0 && !allBranchIn;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md border border-border/70 bg-card/60 overflow-hidden",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between px-2.5 py-1.5 bg-muted/30 border-b border-border/50 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 cursor-pointer select-none font-semibold text-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: allBranchIn,
												ref: (el) => {
													if (el) el.indeterminate = someBranchIn;
												},
												onChange: () => toggleDraftBranchVehicles(branchName),
												className: "h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: branchName })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] text-muted-foreground font-semibold bg-background px-1.5 py-0.5 rounded-sm border border-border/60",
												children: [
													branchSelectedCount,
													"/",
													branchVehicleIds.length
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => toggleCollapseBranchGroup(branchName),
												className: "p-0.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors",
												children: isCollapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5" })
											})]
										})]
									}), !isCollapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-1 space-y-0.5 pl-2.5",
										children: vList.map((v) => {
											const checked = draftObjects.includes(v.id);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: cn("flex items-center gap-2 px-2 py-1 rounded-sm hover:bg-muted cursor-pointer transition-colors text-xs select-none", checked && "bg-muted/40"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													checked,
													onChange: () => toggleDraftObject(v.id),
													className: "h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer shrink-0"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-col min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: cn("text-xs leading-tight text-foreground", checked && "font-semibold text-foreground"),
														children: v.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] leading-tight text-muted-foreground/80 font-mono",
														children: v.imei
													})]
												})]
											}, v.id);
										})
									})]
								}, branchName);
							}), groupedFilteredVehicles.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-4 text-center text-xs text-muted-foreground",
								children: "No vehicles available for selected branch filters"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2.5 px-4 border-t border-border/70 flex items-center justify-between bg-muted/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDraftObjects([]),
								className: "text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer transition-colors",
								children: "Clear"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setVehicleOpen(false),
									className: "px-3 py-1.5 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: draftObjects.length === 0,
									onClick: handleApplyVehicles,
									className: cn("px-4 py-1.5 text-xs rounded-md font-semibold shadow-xs transition-all active:scale-98", draftObjects.length === 0 ? "bg-[#0089FF]/40 text-white/70 cursor-not-allowed" : "bg-[#0089FF] text-white hover:bg-[#0070d6] cursor-pointer"),
									children: "Apply"
								})]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onOpenFilterDrawer,
				"aria-label": "Open Filter Drawer",
				className: "inline-flex items-center gap-1.5 rounded-md bg-[#0089FF]/10 border border-[#0089FF]/30 px-2.5 py-1 text-xs font-semibold text-[#0089FF] hover:bg-[#0089FF]/20 transition-all cursor-pointer select-none shadow-2xs active:scale-98",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-3 w-3 text-[#0089FF]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Filter" })]
			})
		]
	});
}
function ProgressComparisonOverlay({ config, onSave, className, triggerClassName }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [xAxis, setXAxis] = (0, import_react.useState)(config.xAxis);
	const [yAxis, setYAxis] = (0, import_react.useState)(config.yAxis);
	const [xAxisOpen, setXAxisOpen] = (0, import_react.useState)(false);
	const [yAxisOpen, setYAxisOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (open) {
			setXAxis(config.xAxis);
			setYAxis(config.yAxis);
			setXAxisOpen(false);
			setYAxisOpen(false);
		}
	}, [open, config]);
	const isDuplicate = xAxis.toLowerCase() === yAxis.toLowerCase();
	const handleApply = () => {
		if (isDuplicate) {
			toast.error("Please choose two different metrics to compare");
			return;
		}
		onSave({
			header: `${xAxis.toUpperCase()} V/S ${yAxis.toUpperCase()}`,
			xAxis,
			yAxis
		});
		toast.success(`Updated comparison: ${xAxis} vs ${yAxis}`);
		setOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: (e) => {
					e.stopPropagation();
				},
				className: cn("p-1 rounded text-slate-700 hover:text-slate-900 hover:bg-black/10 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/15 transition-colors cursor-pointer shrink-0 outline-none", open && "text-slate-900 bg-black/10 dark:text-white dark:bg-white/20 ring-1 ring-blue-500/50", triggerClassName),
				title: "Configure comparison metrics",
				"aria-label": "Configure comparison metrics",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-3.5 w-3.5" })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
			align: "end",
			side: "bottom",
			sideOffset: 8,
			onClick: (e) => e.stopPropagation(),
			className: cn("relative w-[265px] sm:w-[275px] p-3 rounded-xl border border-border/80 bg-popover text-popover-foreground shadow-2xl z-[120] select-none animate-in fade-in-0 zoom-in-95", className),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-1.5 right-4 h-3 w-3 rotate-45 border-t border-l border-border/80 bg-popover z-10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-20 space-y-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold text-foreground",
						children: "Compare Metrics"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 pt-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1 min-w-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
									open: xAxisOpen,
									onOpenChange: setXAxisOpen,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: cn("flex h-7 w-full items-center justify-between rounded-md border border-input/80 bg-background px-2 text-xs font-medium text-muted-foreground transition-all cursor-pointer shadow-2xs hover:border-[#0089FF]/60 hover:bg-muted/30 focus:border-[#0089FF] focus:ring-1.5 focus:ring-[#0089FF]/20 focus:outline-none", xAxisOpen && "border-[#0089FF] ring-1.5 ring-[#0089FF]/20 bg-muted/30"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: xAxis
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-3 w-3 text-muted-foreground transition-transform duration-200 ml-1 opacity-70 shrink-0", xAxisOpen && "rotate-180") })]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
										align: "start",
										side: "bottom",
										sideOffset: 4,
										className: "w-[125px] p-1 rounded-md border border-border bg-popover shadow-xl z-[130] max-h-48 overflow-y-auto",
										children: CHART_AXIS_OPTIONS.map((opt) => {
											const isSelected = xAxis === opt;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => {
													setXAxis(opt);
													setXAxisOpen(false);
												},
												className: cn("flex w-full items-center justify-between px-2 py-1 text-xs rounded-sm cursor-pointer transition-colors text-left", isSelected ? "bg-muted font-semibold text-foreground" : "text-foreground hover:bg-muted/80 font-medium"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate",
													children: opt
												}), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-[#0089FF] shrink-0 ml-1" })]
											}, opt);
										})
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-bold text-muted-foreground uppercase select-none shrink-0 px-0.5",
								children: "VS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1 min-w-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
									open: yAxisOpen,
									onOpenChange: setYAxisOpen,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: cn("flex h-7 w-full items-center justify-between rounded-md border border-input/80 bg-background px-2 text-xs font-medium text-muted-foreground transition-all cursor-pointer shadow-2xs hover:border-[#0089FF]/60 hover:bg-muted/30 focus:border-[#0089FF] focus:ring-1.5 focus:ring-[#0089FF]/20 focus:outline-none", yAxisOpen && "border-[#0089FF] ring-1.5 ring-[#0089FF]/20 bg-muted/30", isDuplicate && "border-rose-500/70 text-rose-600 focus:border-rose-500"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: yAxis
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-3 w-3 text-muted-foreground transition-transform duration-200 ml-1 opacity-70 shrink-0", yAxisOpen && "rotate-180") })]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
										align: "end",
										side: "bottom",
										sideOffset: 4,
										className: "w-[125px] p-1 rounded-md border border-border bg-popover shadow-xl z-[130] max-h-48 overflow-y-auto",
										children: CHART_AXIS_OPTIONS.map((opt) => {
											const isSelected = yAxis === opt;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => {
													setYAxis(opt);
													setYAxisOpen(false);
												},
												className: cn("flex w-full items-center justify-between px-2 py-1 text-xs rounded-sm cursor-pointer transition-colors text-left", isSelected ? "bg-muted font-semibold text-foreground" : "text-foreground hover:bg-muted/80 font-medium"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate",
													children: opt
												}), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-[#0089FF] shrink-0 ml-1" })]
											}, opt);
										})
									})]
								})
							})
						]
					}),
					isDuplicate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium text-rose-500 pt-0.5 animate-in fade-in",
						children: "Please choose two different metrics."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-1.5 pt-2 border-t border-border/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setOpen(false),
							className: "h-6.5 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleApply,
							disabled: isDuplicate,
							className: cn("h-6.5 px-3 text-xs font-medium rounded-md text-white shadow-xs transition-all cursor-pointer active:scale-98", isDuplicate ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" : "bg-[#155dfc] hover:bg-[#124ecf]"),
							children: "Apply"
						})]
					})
				]
			})]
		})]
	});
}
function IconButton$1({ label, children, onClick, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": label,
			onClick,
			disabled,
			className: "inline-flex h-7 w-7 items-center justify-center rounded border border-input bg-background text-muted-foreground transition-all duration-150 hover:bg-muted hover:text-foreground hover:border-border disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs",
			children
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
		side: "bottom",
		children: label
	})] });
}
var SEARCHABLE_COLUMNS = [
	{
		id: "object",
		label: "Vehicle No"
	},
	{
		id: "vehicleBrand",
		label: "Vehicle Brand"
	},
	{
		id: "vehicleModel",
		label: "Vehicle Model"
	},
	{
		id: "startLocation",
		label: "Start Location"
	},
	{
		id: "endLocation",
		label: "End Location"
	}
];
function TemperatureSummaryReport() {
	const [filters, setFilters] = (0, import_react.useState)({
		...DEFAULT_FILTERS,
		from: "27-11-2024",
		to: "30-11-2024"
	});
	const [configOpen, setConfigOpen] = (0, import_react.useState)(false);
	const [configTab, setConfigTab] = (0, import_react.useState)("quick");
	const [scheduleOpen, setScheduleOpen] = (0, import_react.useState)(false);
	const [modal, setModal] = (0, import_react.useState)(null);
	const [expandedId, setExpandedId] = (0, import_react.useState)("temp-5");
	const [query, setQuery] = (0, import_react.useState)("");
	const [selectedSearchField, setSelectedSearchField] = (0, import_react.useState)("all");
	const [page, setPage] = (0, import_react.useState)(1);
	const filteredRows = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		if (!q) return temperatureSummaryRows;
		return temperatureSummaryRows.filter((r) => {
			if (selectedSearchField === "object") return r.object.toLowerCase().includes(q);
			if (selectedSearchField === "vehicleBrand") return r.vehicleBrand.toLowerCase().includes(q);
			if (selectedSearchField === "vehicleModel") return r.vehicleModel.toLowerCase().includes(q);
			if (selectedSearchField === "startLocation") return r.startLocation.toLowerCase().includes(q);
			if (selectedSearchField === "endLocation") return r.endLocation.toLowerCase().includes(q);
			return r.object.toLowerCase().includes(q) || r.vehicleBrand.toLowerCase().includes(q) || r.vehicleModel.toLowerCase().includes(q) || r.startLocation.toLowerCase().includes(q) || r.endLocation.toLowerCase().includes(q);
		});
	}, [query, selectedSearchField]);
	const toggleExpand = (id) => {
		setExpandedId((prev) => prev === id ? null : id);
	};
	const handleExport = (format) => {
		toast.success(`Exporting Temperature Summary as ${format}`, { description: `${filteredRows.length} records exported.` });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-1 flex-col gap-2 p-2.5 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-[76px] min-h-[76px] max-h-[76px] shrink-0 items-center justify-between gap-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 px-4 shadow-2xs backdrop-blur-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col justify-center gap-0.5 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FavoriteToggle, {
							reportId: "temperature",
							className: "text-muted-foreground hover:text-amber-500"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-[18px] font-medium text-foreground leading-tight tracking-tight whitespace-nowrap",
							children: "Temperature Summary"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setConfigTab("quick");
									setConfigOpen(true);
								},
								className: "inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground cursor-pointer font-normal",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									filters.from,
									" 12:00 AM → ",
									filters.to,
									" 10:52 PM"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-2.5 w-2.5 opacity-60" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground/40 font-mono",
								children: "|"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setConfigTab("quick");
									setConfigOpen(true);
								},
								className: "inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground cursor-pointer font-normal",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "MH18CC2635 +7 more" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-2.5 w-2.5 opacity-60" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground/40 font-mono",
								children: "|"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setConfigTab("quick");
									setConfigOpen(true);
								},
								className: "inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Quick Filter" })]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex h-7 items-center rounded border border-input bg-background shadow-2xs focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									title: "Select specific field to search",
									className: "flex h-full items-center gap-1 border-r border-input bg-surface-muted/60 px-2 text-[11px] font-medium text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0 rounded-l",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "max-w-[76px] truncate",
										children: SEARCHABLE_COLUMNS.find((c) => c.id === selectedSearchField)?.label || "All"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-2.5 w-2.5 text-muted-foreground" })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "start",
								className: "w-44 p-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
										className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground px-2 py-1",
										children: "Search Column"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => setSelectedSearchField("all"),
										className: cn("flex items-center justify-between cursor-pointer text-xs rounded px-2 py-1", selectedSearchField === "all" && "bg-primary/10 font-bold text-primary"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "All Columns" }), selectedSearchField === "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "my-1" }),
									SEARCHABLE_COLUMNS.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => setSelectedSearchField(col.id),
										className: cn("flex items-center justify-between cursor-pointer text-xs rounded px-2 py-1", selectedSearchField === col.id && "bg-primary/10 font-bold text-primary"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: col.label }), selectedSearchField === col.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" })]
									}, col.id))
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex items-center flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "ml-2 h-3 w-3 text-muted-foreground shrink-0 pointer-events-none" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: query,
										onChange: (e) => setQuery(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												if (query.trim()) toast.success(`Showing ${filteredRows.length} matching records`, { description: `Search: "${query.trim()}" in ${selectedSearchField === "all" ? "all fields" : SEARCHABLE_COLUMNS.find((c) => c.id === selectedSearchField)?.label}` });
											}
										},
										placeholder: selectedSearchField === "all" ? "Search in all fields..." : `Search in ${SEARCHABLE_COLUMNS.find((c) => c.id === selectedSearchField)?.label || "field"}...`,
										"aria-label": "Search records",
										className: "h-6.5 w-32 sm:w-44 bg-transparent px-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
									}),
									query && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 mr-1.5 shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setQuery(""),
											"aria-label": "Clear search",
											className: "rounded p-0.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("kbd", {
											title: "Press Enter to search",
											className: "inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[9px] font-mono font-medium text-muted-foreground bg-muted/80 border border-border/80 shadow-2xs select-none",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerDownLeft, { className: "h-2.5 w-2.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Enter" })]
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportPopover, { onSelect: (f, s) => handleExport(`${f} (${s})`) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton$1, {
									label: "Schedule report",
									onClick: () => setScheduleOpen(true),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "h-3.5 w-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton$1, {
									label: "Column visibility",
									onClick: () => setModal("columns"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-3.5 w-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton$1, {
									label: "Chart view",
									onClick: () => setModal("chart"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-3.5 w-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton$1, {
									label: "Help & guide",
									onClick: () => setModal("help"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3.5 w-3.5" })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] font-medium text-foreground/80",
								children: [
									"1–",
									filteredRows.length,
									" of ",
									filteredRows.length
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton$1, {
										label: "Previous page",
										disabled: true,
										onClick: () => {},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton$1, {
										label: "Next page",
										disabled: true,
										onClick: () => {},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton$1, {
										label: "Refresh",
										onClick: () => toast.success("Temperature data refreshed"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" })
									})
								]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-border bg-surface shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-0 flex-1 overflow-auto overscroll-contain scroll-smooth",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full border-collapse text-left text-xs whitespace-nowrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("thead", {
							className: "sticky top-0 z-10 bg-nav text-nav-foreground text-[11px] select-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border/40 divide-x divide-white/10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										rowSpan: 2,
										className: "w-10 px-2 py-2 text-center font-semibold"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										rowSpan: 2,
										className: "px-3 py-2 font-semibold",
										children: "Object"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										rowSpan: 2,
										className: "px-3 py-2 font-semibold",
										children: "Vehicle Brand"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										rowSpan: 2,
										className: "px-3 py-2 font-semibold",
										children: "Vehicle Model"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										colSpan: 2,
										className: "px-3 py-1.5 text-center font-semibold bg-nav/90",
										children: "Port"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										rowSpan: 2,
										className: "px-3 py-2 font-semibold text-right",
										children: "Distance (km)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										rowSpan: 2,
										className: "px-3 py-2 font-semibold",
										children: "Start Location"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										colSpan: 3,
										className: "px-3 py-1.5 text-center font-semibold bg-nav/90",
										children: "Temperature"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										rowSpan: 2,
										className: "px-2 py-2 text-center font-semibold",
										children: "Unit"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										colSpan: 3,
										className: "px-3 py-1.5 text-center font-semibold bg-nav/90",
										children: "Humidity (%RH)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										rowSpan: 2,
										className: "px-3 py-2 font-semibold",
										children: "End Location"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										rowSpan: 2,
										className: "px-3 py-2 text-center font-semibold",
										children: "Temperature Chart"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border/60 divide-x divide-white/10 text-[10px] bg-nav/95",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2.5 py-1 text-center font-medium",
										children: "Temperature"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2.5 py-1 text-center font-medium",
										children: "Humidity"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2.5 py-1 text-right font-medium",
										children: "Average"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2.5 py-1 text-right font-medium",
										children: "Min"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2.5 py-1 text-right font-medium",
										children: "Max"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2.5 py-1 text-right font-medium",
										children: "Average"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2.5 py-1 text-right font-medium",
										children: "Min"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2.5 py-1 text-right font-medium",
										children: "Max"
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border text-foreground",
							children: filteredRows.map((row) => {
								const isExpanded = expandedId === row.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
									className: "divide-y divide-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										onClick: () => toggleExpand(row.id),
										className: cn("transition-colors duration-75 cursor-pointer divide-x divide-border/50", isExpanded ? "bg-amber-100/50 dark:bg-amber-950/40 font-medium" : "hover:bg-muted/50"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-2 py-2.5 text-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: (e) => {
														e.stopPropagation();
														toggleExpand(row.id);
													},
													className: cn("flex h-4.5 w-4.5 items-center justify-center rounded text-[11px] font-bold transition-transform cursor-pointer", isExpanded ? "bg-sky-500 text-white" : "bg-sky-500/15 text-sky-600 hover:bg-sky-500 hover:text-white"),
													children: isExpanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 font-bold text-foreground",
												children: row.object
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-muted-foreground",
												children: row.vehicleBrand
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-muted-foreground",
												children: row.vehicleModel
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-center text-xs text-foreground/90",
												children: row.portTemp
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-center text-muted-foreground",
												children: row.portHumidity
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-right font-semibold text-foreground",
												children: row.distance.toFixed(2)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-muted-foreground max-w-[200px] truncate",
												title: row.startLocation,
												children: row.startLocation
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: cn("px-3 py-2.5 text-right font-medium", row.tempAvg < 0 ? "text-cyan-600 dark:text-cyan-400" : "text-amber-600"),
												children: row.tempAvg.toFixed(2)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: cn("px-3 py-2.5 text-right", row.tempMin < 0 ? "text-cyan-600 dark:text-cyan-400" : ""),
												children: row.tempMin.toFixed(1)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-right",
												children: row.tempMax.toFixed(1)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-2 py-2.5 text-center text-muted-foreground",
												children: row.unit
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-right text-muted-foreground",
												children: row.humidityAvg.toFixed(1)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-right text-muted-foreground",
												children: row.humidityMin.toFixed(1)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-right text-muted-foreground",
												children: row.humidityMax.toFixed(1)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-muted-foreground max-w-[200px] truncate",
												title: row.endLocation,
												children: row.endLocation
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: (e) => {
														e.stopPropagation();
														toast.info(`Opening temperature graph for ${row.object}`);
														setModal("chart");
													},
													className: "inline-flex h-6 w-6 items-center justify-center rounded text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/40 cursor-pointer",
													title: "View Temperature Chart",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thermometer, { className: "h-4 w-4" })
												})
											})
										]
									}), isExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
										className: "bg-muted/20",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											colSpan: 17,
											className: "p-3 pl-8",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "overflow-hidden rounded border border-border/80 bg-surface shadow-xs",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
													className: "w-full border-collapse text-left text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
														className: "bg-muted/70 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
															className: "divide-x divide-border/60",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-3 py-2",
																	children: "Date"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-3 py-2 text-right",
																	children: "Distance (km)"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-3 py-2",
																	children: "Start Location"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-3 py-2 text-right",
																	children: "Temp (Avg)"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-3 py-2 text-right",
																	children: "Temp (Min)"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-3 py-2 text-right",
																	children: "Temp (Max)"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-2 py-2 text-center",
																	children: "Unit"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-3 py-2 text-right",
																	children: "Humidity (Avg)"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-3 py-2 text-right",
																	children: "Humidity (Min)"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-3 py-2 text-right",
																	children: "Humidity (Max)"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-3 py-2",
																	children: "End Location"
																})
															]
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
														className: "divide-y divide-border text-[11px]",
														children: row.daily.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
															className: "hover:bg-muted/40 divide-x divide-border/40",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-3 py-1.5 font-medium text-foreground",
																	children: d.date
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-3 py-1.5 text-right font-semibold",
																	children: d.distance.toFixed(2)
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-3 py-1.5 text-muted-foreground truncate max-w-[220px]",
																	title: d.startLocation,
																	children: d.startLocation
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: cn("px-3 py-1.5 text-right font-medium", d.tempAvg < 0 ? "text-cyan-600" : "text-amber-600"),
																	children: d.tempAvg.toFixed(2)
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-3 py-1.5 text-right",
																	children: d.tempMin.toFixed(1)
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-3 py-1.5 text-right",
																	children: d.tempMax.toFixed(1)
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-2 py-1.5 text-center text-muted-foreground",
																	children: d.unit
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-3 py-1.5 text-right text-muted-foreground",
																	children: d.humidityAvg.toFixed(1)
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-3 py-1.5 text-right text-muted-foreground",
																	children: d.humidityMin.toFixed(1)
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-3 py-1.5 text-right text-muted-foreground",
																	children: d.humidityMax.toFixed(1)
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																	className: "px-3 py-1.5 text-muted-foreground truncate max-w-[220px]",
																	title: d.endLocation,
																	children: d.endLocation
																})
															]
														}, i))
													})]
												})
											})
										})
									})]
								}, row.id);
							})
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportConfigPanel, {
				open: configOpen,
				onClose: () => setConfigOpen(false),
				filters,
				onChange: (patch) => setFilters((f) => ({
					...f,
					...patch
				})),
				objectOptions: temperatureSummaryRows.map((r) => ({
					id: r.id,
					label: r.object,
					imei: "861234567890123",
					branch: "Gujarat"
				})),
				onApply: () => {
					setConfigOpen(false);
					toast.success("Filters applied — temperature data updated");
				},
				onExport: (format, scope) => handleExport(`${format} (${scope})`)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScheduleDrawer, {
				open: scheduleOpen,
				onClose: () => setScheduleOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportModals, {
				kind: modal,
				onClose: () => setModal(null),
				columns: [
					{
						key: "object",
						label: "Object"
					},
					{
						key: "vehicleBrand",
						label: "Vehicle Brand"
					},
					{
						key: "vehicleModel",
						label: "Vehicle Model"
					},
					{
						key: "distance",
						label: "Distance"
					},
					{
						key: "startLocation",
						label: "Start Location"
					},
					{
						key: "tempAvg",
						label: "Temperature (Avg)"
					},
					{
						key: "tempMin",
						label: "Temperature (Min)"
					},
					{
						key: "tempMax",
						label: "Temperature (Max)"
					},
					{
						key: "endLocation",
						label: "End Location"
					}
				],
				hidden: [],
				onToggleColumn: () => {},
				chartType: "Line",
				onChartType: (t) => toast.success(`${t} chart selected`)
			})
		]
	});
}
var DAYS = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday"
];
var pad = (n) => String(n).padStart(2, "0");
/** One daily-summary row per trip block of a vehicle. */
function dailyRowsFor(row) {
	return row.trips.map((t, i) => ({
		id: `${row.id}-d${i}`,
		date: `${pad(25 + i)}-07-2026`,
		day: DAYS[i % DAYS.length],
		driver: row.driver,
		startLocation: t.startLocation,
		endLocation: t.endLocation,
		distance: t.distance,
		running: t.running,
		stop: t.stop,
		idle: t.idle,
		maxSpeed: Math.max(40, row.maxSpeed - i * 3),
		alerts: t.alerts
	}));
}
/** Synthetic ignition/position log for a single day of one vehicle. */
function detailRowsFor(row, daily) {
	const points = 8;
	const perLeg = daily.distance / points;
	return Array.from({ length: points }, (_, i) => {
		const hour = 7 + i;
		const speed = i === 0 || i === 7 ? 0 : 30 + (row.maxSpeed - 30) * (i * 37 % 10) / 10;
		return {
			id: `${daily.id}-p${i}`,
			date: daily.date,
			time: `${pad(hour)}:${pad(i * 17 % 60)}:00`,
			ignition: i === 7 ? "OFF" : "ON",
			location: i === 0 ? daily.startLocation : i === 7 ? daily.endLocation : `${daily.startLocation} → NH${48 + i}, KM ${12 * i}`,
			speed: Math.round(speed),
			distance: Number((perLeg * (i + 1)).toFixed(2)),
			latitude: (18.5204 + i * .0137).toFixed(6),
			longitude: (73.8567 + i * .0212).toFixed(6)
		};
	});
}
var SUMMARY_HEADERS = [
	"Company",
	"Vehicle No",
	"Driver",
	"Distance (km)",
	"Running",
	"Idle",
	"Stop",
	"Avg Speed",
	"Max Speed",
	"Toll Cost",
	"Alerts"
];
var DETAIL_HEADERS = [
	"Vehicle No",
	"Date",
	"First Ignition On",
	"Start Location",
	"Distance (km)",
	"Running",
	"Idle",
	"Stop",
	"Alerts",
	"Last Ignition On",
	"End Location"
];
var cell = (value) => {
	const text = String(value);
	return /[",\n]/.test(text) ? `"${text.replace(/"/g, "\"\"")}"` : text;
};
var toCsv = (rows) => rows.map((r) => r.map(cell).join(",")).join("\n");
function buildReportCsv(rows, scope) {
	const lines = [SUMMARY_HEADERS];
	for (const r of rows) lines.push([
		r.company,
		r.vehicleNo,
		r.driver,
		r.distance.toFixed(2),
		r.running,
		r.idle,
		r.stop,
		r.avgSpeed,
		r.maxSpeed,
		r.tollCost,
		r.alerts
	]);
	if (scope === "detail") {
		lines.push([]);
		lines.push(["Trip details"]);
		lines.push(DETAIL_HEADERS);
		for (const r of rows) for (const t of r.trips) lines.push([
			r.vehicleNo,
			t.date,
			t.firstIgnitionOn,
			t.startLocation,
			t.distance.toFixed(2),
			t.running,
			t.idle,
			t.stop,
			t.alerts,
			t.lastIgnitionOn,
			t.endLocation
		]);
	}
	return toCsv(lines);
}
/** Triggers a client-side file download for the generated report. */
function downloadReport(rows, format, scope) {
	const csv = buildReportCsv(rows, scope);
	const name = `travel-summary-${scope}.${format === "CSV" ? "csv" : format.toLowerCase()}`;
	const mime = format === "CSV" ? "text/csv;charset=utf-8" : format === "XLS" ? "application/vnd.ms-excel" : "text/plain;charset=utf-8";
	if (typeof window === "undefined") return name;
	const url = URL.createObjectURL(new Blob([csv], { type: mime }));
	const a = document.createElement("a");
	a.href = url;
	a.download = name;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
	return name;
}
var PAGE_SIZES = [
	10,
	20,
	50
];
var DEFAULT_COLUMN_WIDTHS = {
	vehicleNo: 145,
	employeeNo: 130,
	imei: 135,
	startLocation: 170,
	startOdometer: 135,
	firstIgnitionOn: 140,
	distance: 110,
	idleVsInactive: 160,
	running: 145,
	idle: 135,
	stop: 135,
	inactive: 145,
	duration: 135,
	workDuration: 130,
	workingDays: 115,
	maxStoppage: 125,
	noOfIdle: 105,
	endOdometer: 135,
	lastIgnitionOff: 140,
	overSpeedTimes: 140,
	costDistance: 115,
	costDuration: 115,
	driver: 140,
	company: 140,
	endLocation: 170,
	avgSpeed: 100,
	maxSpeed: 100,
	tollCost: 105,
	alerts: 90
};
var objectOptions = fleetObjects.map((o) => ({
	id: o.id,
	label: o.name,
	imei: o.imei,
	branch: o.branch
}));
function parseDurationToSeconds(timeStr) {
	if (!timeStr) return 0;
	const parts = timeStr.split(":").map(Number);
	if (parts.length === 3) return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
	if (parts.length === 2) return (parts[0] || 0) * 60 + (parts[1] || 0);
	return Number(timeStr) || 0;
}
function getMetricValue(row, metricName) {
	switch (metricName) {
		case "Running": return parseDurationToSeconds(row.running);
		case "Idle": return parseDurationToSeconds(row.idle);
		case "Stop": return parseDurationToSeconds(row.stop);
		case "Inactive": return parseDurationToSeconds("00:00:00");
		case "Duration": return parseDurationToSeconds("24:00:00");
		case "Work Duration": return parseDurationToSeconds("08:00:00");
		case "Distance": return row.distance;
		case "Max Speed": return row.maxSpeed;
		default: return parseDurationToSeconds(row.running);
	}
}
function formatMetricDisplay(row, metricName) {
	switch (metricName) {
		case "Running": return row.running;
		case "Idle": return row.idle;
		case "Stop": return row.stop;
		case "Inactive": return "00:00:00";
		case "Duration": return "24:00:00";
		case "Work Duration": return "08:00:00";
		case "Distance": return row.distance.toFixed(2) + " km";
		case "Max Speed": return row.maxSpeed + " km/h";
		default: return "-";
	}
}
function ReportPage() {
	const searchType = useSearch({ strict: false })?.type || "travel";
	if (searchType === "temperature" || searchType === "temperature-summary") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TemperatureSummaryReport, {});
	if (searchType === "job" || searchType === "driver-job-summary") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DriverJobSummaryReport, {});
	const [configOpen, setConfigOpen] = (0, import_react.useState)(false);
	const [configTab, setConfigTab] = (0, import_react.useState)("quick");
	const [scheduleOpen, setScheduleOpen] = (0, import_react.useState)(false);
	const [modal, setModal] = (0, import_react.useState)(null);
	const [filters, setFilters] = (0, import_react.useState)(DEFAULT_FILTERS);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [loaded, setLoaded] = (0, import_react.useState)(true);
	const [chartConfig, setChartConfig] = (0, import_react.useState)(() => {
		try {
			const saved = localStorage.getItem("fleet-report-chart-config-v2");
			if (saved) {
				const parsed = JSON.parse(saved);
				if (parsed?.header && parsed?.xAxis && parsed?.yAxis) return parsed;
			}
		} catch {}
		return DEFAULT_CHART_CONFIG;
	});
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem("fleet-report-chart-config-v2", JSON.stringify(chartConfig));
		} catch {}
	}, [chartConfig]);
	const [columnSettings, setColumnSettings] = (0, import_react.useState)(() => {
		try {
			const saved = localStorage.getItem("fleet-report-columns-v3");
			if (saved) {
				const parsed = JSON.parse(saved);
				if (parsed?.columns?.length) return parsed;
			}
		} catch {}
		return DEFAULT_COLUMN_SETTINGS;
	});
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem("fleet-report-columns-v3", JSON.stringify(columnSettings));
		} catch {}
	}, [columnSettings]);
	const visibleColumns = (0, import_react.useMemo)(() => {
		return columnSettings.columns.filter((c) => !c.isGroupHeader && c.showable).map((c) => {
			if (c.id === "idleVsInactive") return {
				...c,
				label: chartConfig.header
			};
			return c;
		});
	}, [columnSettings.columns, chartConfig.header]);
	const [colWidths, setColWidths] = (0, import_react.useState)(() => {
		try {
			const saved = localStorage.getItem("fleet-report-col-widths-v2");
			if (saved) return {
				...DEFAULT_COLUMN_WIDTHS,
				...JSON.parse(saved)
			};
		} catch {}
		return DEFAULT_COLUMN_WIDTHS;
	});
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem("fleet-report-col-widths-v2", JSON.stringify(colWidths));
		} catch {}
	}, [colWidths]);
	const [resizingCol, setResizingCol] = (0, import_react.useState)(null);
	const startXRef = (0, import_react.useRef)(0);
	const startWidthRef = (0, import_react.useRef)(0);
	const resizingColRef = (0, import_react.useRef)(null);
	const startResize = (0, import_react.useCallback)((colId, e) => {
		e.preventDefault();
		e.stopPropagation();
		resizingColRef.current = colId;
		setResizingCol(colId);
		startXRef.current = e.clientX;
		startWidthRef.current = colWidths[colId] || DEFAULT_COLUMN_WIDTHS[colId] || 110;
		const onMouseMove = (moveEvent) => {
			if (!resizingColRef.current) return;
			const delta = moveEvent.clientX - startXRef.current;
			const newWidth = Math.max(60, startWidthRef.current + delta);
			setColWidths((prev) => ({
				...prev,
				[resizingColRef.current]: newWidth
			}));
		};
		const onMouseUp = () => {
			resizingColRef.current = null;
			setResizingCol(null);
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		};
		document.body.style.cursor = "col-resize";
		document.body.style.userSelect = "none";
		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseup", onMouseUp);
	}, [colWidths]);
	const [sort, setSort] = (0, import_react.useState)({
		key: "distance",
		dir: "desc"
	});
	const toggleSort = (key) => {
		setSort((prev) => ({
			key,
			dir: prev.key === key && prev.dir === "asc" ? "desc" : "asc"
		}));
	};
	const [expanded, setExpanded] = (0, import_react.useState)([]);
	const [query, setQuery] = (0, import_react.useState)("");
	const [selectedSearchField, setSelectedSearchField] = (0, import_react.useState)("ALL");
	const [pageSize, setPageSize] = (0, import_react.useState)(10);
	const [pageSizeOpen, setPageSizeOpen] = (0, import_react.useState)(false);
	const [page, setPage] = (0, import_react.useState)(1);
	const selectedSearchFieldLabel = (0, import_react.useMemo)(() => {
		if (selectedSearchField === "ALL" || selectedSearchField === "all") return "All Fields";
		const found = visibleColumns.find((c) => c.id === selectedSearchField);
		return found ? found.label : "All Fields";
	}, [selectedSearchField, visibleColumns]);
	const [level, setLevel] = (0, import_react.useState)(0);
	const [drillVehicle, setDrillVehicle] = (0, import_react.useState)(null);
	const [drillDay, setDrillDay] = (0, import_react.useState)(null);
	const history = (0, import_react.useRef)([]);
	const timer = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => () => {
		if (timer.current) window.clearTimeout(timer.current);
	}, []);
	const patchFilters = (0, import_react.useCallback)((patch) => setFilters((f) => ({
		...f,
		...patch
	})), []);
	const load = (0, import_react.useCallback)((message) => {
		setLoading(true);
		if (timer.current) window.clearTimeout(timer.current);
		timer.current = window.setTimeout(() => {
			setLoading(false);
			setLoaded(true);
			toast.success(message);
		}, 550);
	}, []);
	const rows = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return [...travelRows.filter((r) => {
			if (filters.companies && filters.companies.length > 0 && !filters.companies.includes("All")) {
				if (!filters.companies.includes(r.company)) return false;
			}
			if (filters.branches && filters.branches.length > 0 && !filters.branches.includes("All")) {
				if (!getVehiclesForBranches(filters.branches).map((v) => v.name).includes(r.vehicleNo)) return false;
			}
			if (filters.objects && filters.objects.length > 0 && !filters.objects.includes("All")) {
				if (!filters.objects.includes(r.vehicleNo)) return false;
			}
			if (q === "") return true;
			if (selectedSearchField !== "ALL" && selectedSearchField !== "all") {
				const val = r[selectedSearchField];
				return val !== void 0 && val !== null && String(val).toLowerCase().includes(q);
			}
			return visibleColumns.some((col) => {
				const val = r[col.id];
				return val !== void 0 && val !== null && String(val).toLowerCase().includes(q);
			});
		})].sort((a, b) => {
			const activeSortKey = sort.key;
			const dir = sort.dir === "asc" ? 1 : -1;
			const av = a[activeSortKey] ?? 0;
			const bv = b[activeSortKey] ?? 0;
			if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
			return String(av).localeCompare(String(bv)) * dir;
		});
	}, [
		query,
		selectedSearchField,
		sort,
		filters.companies,
		filters.branches,
		filters.objects,
		visibleColumns
	]);
	const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
	const pageRows = (0, import_react.useMemo)(() => rows.slice((page - 1) * pageSize, page * pageSize), [
		rows,
		page,
		pageSize
	]);
	const summaryTotals = (0, import_react.useMemo)(() => {
		const totalDist = rows.reduce((acc, r) => acc + r.distance, 0);
		const totalRunningSec = rows.reduce((acc, r) => acc + parseDurationToSeconds(r.running), 0);
		const totalIdleSec = rows.reduce((acc, r) => acc + parseDurationToSeconds(r.idle), 0);
		const totalStopSec = rows.reduce((acc, r) => acc + parseDurationToSeconds(r.stop), 0);
		const totalInactiveSec = 286830;
		const totalAlerts = rows.reduce((acc, r) => acc + r.alerts, 0);
		const formatSec = (s) => {
			const h = Math.floor(s / 3600);
			const m = Math.floor(s % 3600 / 60);
			const sc = s % 60;
			return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0") + ":" + String(sc).padStart(2, "0");
		};
		return {
			distance: totalDist.toFixed(2),
			running: formatSec(totalRunningSec),
			idle: formatSec(totalIdleSec),
			stop: formatSec(totalStopSec),
			inactive: formatSec(totalInactiveSec),
			duration: "85:40",
			workingDays: "11.0",
			maxStoppage: "09:16:0",
			noOfIdle: "358.0",
			alerts: totalAlerts
		};
	}, [rows]);
	const drillToDaily = (r) => {
		history.current.push({ level });
		setDrillVehicle(r);
		setLevel(1);
		toast.info("Daily summary for " + r.vehicleNo, { description: r.driver + " · " + r.company });
	};
	const drillToDetail = (d) => {
		history.current.push({ level });
		setDrillDay(d);
		setLevel(2);
		toast.info("Travel detail for " + d.date, { description: (drillVehicle?.vehicleNo ?? "") + " · " + d.driver });
	};
	const goBack = () => {
		const prev = history.current.pop();
		if (!prev) {
			setLevel(0);
			setDrillVehicle(null);
			setDrillDay(null);
			return;
		}
		setLevel(prev.level);
		if (prev.level === 0) setDrillVehicle(null);
		if (prev.level <= 1) setDrillDay(null);
	};
	const resetToRoot = () => {
		history.current = [];
		setLevel(0);
		setDrillVehicle(null);
		setDrillDay(null);
	};
	const dailyRows = (0, import_react.useMemo)(() => drillVehicle ? dailyRowsFor(drillVehicle) : [], [drillVehicle]);
	const detailRows = (0, import_react.useMemo)(() => drillVehicle && drillDay ? detailRowsFor(drillVehicle, drillDay) : [], [drillVehicle, drillDay]);
	const reportMeta = findReport(searchType) || findReport("today-activity") || findReport("travel");
	const handleExport = (format, exportScope, excelMode = "multiple", extraMsg = "") => {
		const printableColNames = columnSettings.columns.filter((c) => !c.isGroupHeader && c.printable).map((c) => c.label);
		const currentTitle = level === 0 ? reportMeta?.name || "Today Activity" : level === 1 ? "Travel Daily Summary" : "Travel Detail";
		downloadReport(rows, format, exportScope);
		toast.success(currentTitle + " exported as " + format + " (" + (exportScope === "detail" ? "Detail Report" : "Summary Report") + ")" + (extraMsg ? " — " + extraMsg : ""), { description: printableColNames.length + " printable columns · " + (excelMode === "multiple" ? "Multiple Sheets" : "Single Sheet") });
	};
	const first = rows.length === 0 ? 0 : (page - 1) * pageSize + 1;
	const last = Math.min(page * pageSize, rows.length);
	const frozenCount = columnSettings.frozenColumnsCount ?? 0;
	const getStickyLeftOffset = (0, import_react.useCallback)((colIdx) => {
		let offset = 36;
		for (let i = 0; i < colIdx; i++) {
			const prevCol = visibleColumns[i];
			if (prevCol) offset += colWidths[prevCol.id] || DEFAULT_COLUMN_WIDTHS[prevCol.id] || 110;
		}
		return offset + "px";
	}, [visibleColumns, colWidths]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-1 flex-col gap-3 p-3 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "h-[76px] flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 px-4 py-2 shadow-2xs shrink-0 select-none backdrop-blur-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 min-w-0 h-7",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						"aria-label": "Breadcrumb",
						className: "flex items-center gap-1.5 text-xs shrink-0",
						children: [
							level > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: goBack,
								"aria-label": "Back to previous level",
								className: "inline-flex h-6 w-6 items-center justify-center rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer mr-0.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" })
							}) : null,
							level === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FavoriteToggle, {
								reportId: searchType || "today-activity",
								className: "-ml-1 mr-0.5"
							}),
							level === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[18px] font-medium text-foreground leading-tight tracking-tight",
								children: reportMeta?.name || "Today Activity"
							}) : level === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: resetToRoot,
								className: "text-[18px] font-medium text-foreground transition-colors hover:text-brand hover:underline cursor-pointer leading-tight tracking-tight",
								children: "Travel Daily Summary"
							}), drillVehicle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 text-muted-foreground/60 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-semibold text-foreground",
								children: [
									drillVehicle.vehicleNo,
									" (",
									drillVehicle.driver,
									")"
								]
							})] }) : null] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: resetToRoot,
									className: "text-[18px] font-medium text-foreground transition-colors hover:text-brand hover:underline cursor-pointer leading-tight tracking-tight",
									children: "Travel Detail"
								}),
								drillVehicle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 text-muted-foreground/60 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										history.current.push({ level: 1 });
										setLevel(1);
										setDrillDay(null);
									},
									className: "text-xs font-semibold text-foreground transition-colors hover:text-brand hover:underline cursor-pointer",
									children: drillVehicle.vehicleNo
								})] }) : null,
								drillDay ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 text-muted-foreground/60 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-foreground",
									children: drillDay.date
								})] }) : null
							] })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 ml-auto shrink-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex h-7 items-center rounded-md border border-border/80 bg-background shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all overflow-hidden",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											title: "Select specific column to search",
											className: "flex h-full items-center gap-1 border-r border-border/60 bg-muted/30 px-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0 select-none",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "max-w-[76px] truncate",
												children: selectedSearchField === "ALL" || selectedSearchField === "all" ? "All" : selectedSearchFieldLabel
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3 opacity-60" })]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
										align: "start",
										className: "max-h-64 w-52 overflow-y-auto text-xs p-1 rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md shadow-lg z-50 select-none",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
												onClick: () => setSelectedSearchField("ALL"),
												className: cn("cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors select-none", selectedSearchField === "ALL" || selectedSearchField === "all" ? "bg-muted font-semibold text-foreground" : "text-foreground hover:bg-muted/80 hover:text-foreground font-medium"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "All Fields" }), (selectedSearchField === "ALL" || selectedSearchField === "all") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-[#0089FF]" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "my-1 -mx-1" }),
											visibleColumns.map((c) => {
												const isSelected = selectedSearchField === c.id;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => setSelectedSearchField(c.id),
													className: cn("cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors select-none", isSelected ? "bg-muted font-semibold text-foreground" : "text-foreground hover:bg-muted/80 hover:text-foreground font-medium"),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "truncate",
														children: c.label
													}), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-[#0089FF] shrink-0" })]
												}, c.id);
											})
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "ml-2 h-3.5 w-3.5 text-muted-foreground shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: query,
										onChange: (e) => setQuery(e.target.value),
										placeholder: selectedSearchField === "ALL" || selectedSearchField === "all" ? "Search in all fields..." : `Search ${selectedSearchFieldLabel}...`,
										className: "h-full w-36 sm:w-44 bg-transparent px-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
									}),
									query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setQuery(""),
										"aria-label": "Clear search",
										className: "mr-1.5 rounded-full p-0.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportPopover, { onSelect: (f, s, m) => handleExport(f, s, m) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
									label: "Schedule report",
									onClick: () => setScheduleOpen(true),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "h-3.5 w-3.5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
									label: "Column Settings",
									onClick: () => setModal("columns"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-3.5 w-3.5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-px bg-border/80 mx-0.5 shrink-0" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
								open: pageSizeOpen,
								onOpenChange: setPageSizeOpen,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"aria-label": "Rows per page",
										className: cn("h-7 inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-background px-2 text-xs font-semibold text-foreground cursor-pointer shadow-2xs transition-all select-none hover:bg-muted hover:border-[#0089FF]/50 active:scale-98", pageSizeOpen && "bg-muted border-[#0089FF]/50 ring-2 ring-[#0089FF]/20"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [pageSize, " / page"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-3 w-3 opacity-60 ml-0.5 transition-transform", pageSizeOpen && "rotate-180") })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
									align: "end",
									sideOffset: 6,
									className: "w-28 p-1 rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md shadow-lg select-none animate-in fade-in-0 zoom-in-95",
									children: PAGE_SIZES.map((s) => {
										const isActive = pageSize === s;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												setPageSize(s);
												setPage(1);
												setPageSizeOpen(false);
											},
											className: cn("flex w-full items-center justify-between px-2.5 py-1.5 text-xs rounded-sm cursor-pointer transition-colors text-left select-none", isActive ? "bg-muted font-semibold text-foreground" : "text-foreground hover:bg-muted/80 hover:text-foreground font-medium"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [s, " / page"] }), isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-[#0089FF]" })]
										}, s);
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "px-1 text-xs font-semibold tabular-nums text-muted-foreground whitespace-nowrap",
										children: [
											first,
											"–",
											last,
											" of ",
											rows.length
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
										label: "Previous page",
										onClick: () => setPage((p) => Math.max(1, p - 1)),
										disabled: level !== 0 || page === 1,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
										label: "Next page",
										onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
										disabled: level !== 0 || page >= totalPages,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
										label: "Refresh data",
										onClick: () => load("Report refreshed"),
										disabled: loading,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("h-3.5 w-3.5", loading && "animate-spin") })
									})
								]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between gap-3 min-w-0 h-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center min-w-0 flex-1 overflow-x-auto scrollbar-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportQuickFilterBar, {
							filters,
							onChange: (patch) => {
								setFilters((prev) => ({
									...prev,
									...patch
								}));
								load("Filters updated");
							},
							onOpenFilterDrawer: () => setConfigOpen(true)
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#DFE3EB] dark:border-slate-700 bg-card shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-0 flex-1 overflow-auto overscroll-contain scroll-smooth",
					children: level === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[1000px] text-xs border-collapse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("thead", {
							className: "sticky top-0 z-20 shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "bg-[#EAF0F6] text-slate-900 dark:bg-slate-800 dark:text-slate-100 font-bold tracking-wider text-[11px] uppercase border-b border-[#DFE3EB] dark:border-slate-700",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									scope: "col",
									className: "sticky left-0 z-30 w-9 min-w-[36px] max-w-[36px] bg-[#EAF0F6] dark:bg-slate-800 border-r border-[#DFE3EB] dark:border-slate-700 px-2 py-2.5 text-center shadow-xs text-slate-900 dark:text-slate-200 font-bold rounded-tl-xl",
									children: "#"
								}), visibleColumns.map((c, colIdx) => {
									const isFrozen = colIdx < frozenCount;
									const leftOffset = isFrozen ? getStickyLeftOffset(colIdx) : void 0;
									const w = colWidths[c.id] || DEFAULT_COLUMN_WIDTHS[c.id] || 110;
									if (c.id === "idleVsInactive") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
										scope: "col",
										style: {
											width: w + "px",
											minWidth: w + "px",
											maxWidth: w + "px",
											left: leftOffset
										},
										title: c.label,
										className: cn("group relative border-r border-[#DFE3EB] dark:border-slate-700 px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 last:border-r-0 overflow-hidden text-ellipsis whitespace-nowrap select-none text-left bg-[#EAF0F6] dark:bg-slate-800", isFrozen && cn("sticky z-30 bg-[#EAF0F6] dark:bg-slate-800", colIdx === frozenCount - 1 && "shadow-[2px_0_4px_rgba(0,0,0,0.12)]")),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-1 overflow-hidden",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: c.label
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressComparisonOverlay, {
												config: chartConfig,
												onSave: setChartConfig
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											role: "separator",
											onMouseDown: (e) => startResize(c.id, e),
											onClick: (e) => e.stopPropagation(),
											className: cn("absolute right-0 top-0 bottom-0 w-2.5 cursor-col-resize z-40 transition-colors", "hover:bg-blue-400/80 active:bg-blue-500", resizingCol === c.id && "bg-blue-400"),
											title: "Drag to resize column"
										})]
									}, c.id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
										scope: "col",
										style: {
											width: w + "px",
											minWidth: w + "px",
											maxWidth: w + "px",
											left: leftOffset
										},
										onClick: () => {
											if (c.sortable) toggleSort(c.id);
										},
										title: c.label,
										className: cn("group relative border-r border-[#DFE3EB] dark:border-slate-700 px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 last:border-r-0 overflow-hidden text-ellipsis whitespace-nowrap select-none bg-[#EAF0F6] dark:bg-slate-800", c.numeric ? "text-right" : "text-left", c.sortable && "cursor-pointer hover:bg-[#DFE7F0] dark:hover:bg-slate-700/60", isFrozen && cn("sticky z-30 bg-[#EAF0F6] dark:bg-slate-800", colIdx === frozenCount - 1 && "shadow-[2px_0_4px_rgba(0,0,0,0.12)]")),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: cn("flex items-center gap-1 overflow-hidden", c.numeric ? "justify-end flex-row-reverse" : "justify-start"),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate",
													children: c.label
												}),
												isFrozen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, {
													className: "h-3 w-3 fill-blue-600 text-blue-600 shrink-0",
													title: "Pinned column on left"
												}),
												c.sortable && (sort.key === c.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "h-3 w-3 text-blue-600 dark:text-blue-400 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "h-3 w-3 text-blue-600 dark:text-blue-400 shrink-0" }))
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											role: "separator",
											onMouseDown: (e) => startResize(c.id, e),
											onClick: (e) => e.stopPropagation(),
											className: cn("absolute right-0 top-0 bottom-0 w-2.5 cursor-col-resize z-40 transition-colors", "hover:bg-blue-400/80 active:bg-blue-500", resizingCol === c.id && "bg-blue-400"),
											title: "Drag to resize column"
										})]
									}, c.id);
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "bg-card dark:bg-slate-900 text-[11px] font-bold text-foreground border-b border-[#DFE3EB] dark:border-slate-700 h-[38px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "sticky left-0 z-20 w-9 min-w-[36px] max-w-[36px] bg-card dark:bg-slate-900 border-r border-[#DFE3EB] dark:border-slate-700 px-2 py-2 text-center text-muted-foreground font-semibold shadow-xs",
									children: "∑"
								}), visibleColumns.map((col, colIdx) => {
									const isFrozen = colIdx < frozenCount;
									const leftOffset = isFrozen ? getStickyLeftOffset(colIdx) : void 0;
									const w = colWidths[col.id] || DEFAULT_COLUMN_WIDTHS[col.id] || 110;
									const frozenSummaryClass = isFrozen ? cn("sticky z-20 bg-card dark:bg-slate-900 shadow-xs", colIdx === frozenCount - 1 && "shadow-[2px_0_4px_rgba(0,0,0,0.08)]") : "";
									const commonProps = { style: {
										width: w + "px",
										minWidth: w + "px",
										maxWidth: w + "px",
										left: leftOffset
									} };
									switch (col.id) {
										case "distance": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											...commonProps,
											className: cn("px-2.5 py-2 text-right tabular-nums truncate text-blue-600 dark:text-blue-400", frozenSummaryClass),
											title: summaryTotals.distance,
											children: summaryTotals.distance
										}, col.id);
										case "idleVsInactive": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											...commonProps,
											className: cn("px-2.5 py-2 truncate", frozenSummaryClass),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center justify-center w-full min-w-[60px] max-w-[120px] mx-auto py-1",
												title: "Summary Overall Proportion",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "h-1.5 w-full bg-slate-300 dark:bg-slate-600 rounded-full overflow-hidden flex shadow-2xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														style: { width: "75%" },
														className: "bg-emerald-500 h-full"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														style: { width: "25%" },
														className: "bg-amber-500 h-full"
													})]
												})
											})
										}, col.id);
										case "running": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											...commonProps,
											className: cn("px-2.5 py-2 truncate text-emerald-600 dark:text-emerald-400", frozenSummaryClass),
											title: summaryTotals.running,
											children: summaryTotals.running
										}, col.id);
										case "idle": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											...commonProps,
											className: cn("px-2.5 py-2 truncate text-amber-600 dark:text-amber-400", frozenSummaryClass),
											title: summaryTotals.idle,
											children: summaryTotals.idle
										}, col.id);
										case "stop": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											...commonProps,
											className: cn("px-2.5 py-2 truncate text-rose-600 dark:text-rose-400", frozenSummaryClass),
											title: summaryTotals.stop,
											children: summaryTotals.stop
										}, col.id);
										case "inactive": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											...commonProps,
											className: cn("px-2.5 py-2 truncate text-muted-foreground", frozenSummaryClass),
											title: summaryTotals.inactive,
											children: summaryTotals.inactive
										}, col.id);
										case "duration": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											...commonProps,
											className: cn("px-2.5 py-2 truncate", frozenSummaryClass),
											title: summaryTotals.duration,
											children: summaryTotals.duration
										}, col.id);
										case "workingDays": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											...commonProps,
											className: cn("px-2.5 py-2 text-center truncate", frozenSummaryClass),
											title: summaryTotals.workingDays,
											children: summaryTotals.workingDays
										}, col.id);
										case "maxStoppage": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											...commonProps,
											className: cn("px-2.5 py-2 truncate", frozenSummaryClass),
											title: summaryTotals.maxStoppage,
											children: summaryTotals.maxStoppage
										}, col.id);
										case "noOfIdle": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											...commonProps,
											className: cn("px-2.5 py-2 text-right tabular-nums truncate", frozenSummaryClass),
											title: summaryTotals.noOfIdle,
											children: summaryTotals.noOfIdle
										}, col.id);
										case "alerts": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											...commonProps,
											className: cn("px-2.5 py-2 text-right tabular-nums truncate", frozenSummaryClass),
											title: String(summaryTotals.alerts),
											children: summaryTotals.alerts
										}, col.id);
										default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											...commonProps,
											className: cn("px-2.5 py-2 text-muted-foreground/40 truncate", frozenSummaryClass),
											children: "-"
										}, col.id);
									}
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [!loaded && !loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: visibleColumns.length + 1,
							className: "px-3 py-16 text-center text-xs text-muted-foreground",
							children: "No records loaded. Open the Filter panel and press “Apply Filter”."
						}) }) : pageRows.map((r, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportRow, {
							row: r,
							rowIndex: (page - 1) * pageSize + index + 1,
							columns: visibleColumns,
							colSpan: visibleColumns.length + 1,
							frozenCount,
							chartConfig,
							colWidths,
							getStickyLeftOffset,
							open: expanded.includes(r.id),
							onToggle: () => setExpanded((e) => e.includes(r.id) ? e.filter((x) => x !== r.id) : [...e, r.id]),
							onDrill: () => drillToDaily(r)
						}, r.id)), loaded && !loading && rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: visibleColumns.length + 1,
							className: "px-3 py-12 text-center text-muted-foreground",
							children: "No vehicles match your search."
						}) }) : null] })]
					}) : level === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleTable, {
						headers: [
							"Date",
							"Day",
							"Driver",
							"Start Location",
							"Distance",
							"Running",
							"Stop",
							"Idle",
							"Max Speed",
							"Alerts"
						],
						numeric: [
							4,
							8,
							9
						],
						rows: dailyRows.map((d) => ({
							key: d.id,
							onDoubleClick: () => drillToDetail(d),
							cells: [
								d.date,
								d.day,
								d.driver,
								d.startLocation,
								d.distance.toFixed(2),
								d.running,
								d.stop,
								d.idle,
								d.maxSpeed,
								d.alerts
							]
						})),
						hint: "Double-click a day to open Travel Detail"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleTable, {
						headers: [
							"Date",
							"Time",
							"IGN",
							"Location",
							"Speed",
							"Distance",
							"Latitude",
							"Longitude"
						],
						numeric: [
							4,
							5,
							6,
							7
						],
						rows: detailRows.map((p) => ({
							key: p.id,
							cells: [
								p.date,
								p.time,
								p.ignition,
								p.location,
								p.speed,
								p.distance.toFixed(2),
								p.latitude,
								p.longitude
							]
						}))
					})
				}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 z-20 flex items-center justify-center bg-surface/75 backdrop-blur-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Loading report…"]
					})
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportConfigPanel, {
				open: configOpen,
				onClose: () => setConfigOpen(false),
				filters,
				onChange: patchFilters,
				objectOptions,
				onApply: () => {
					setConfigOpen(false);
					setPage(1);
					resetToRoot();
					load("Filters applied — report loaded");
				},
				onExport: (format, exportScope) => handleExport(format, exportScope, "downloaded without loading")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScheduleModal, {
				open: scheduleOpen,
				onClose: () => setScheduleOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportModals, {
				kind: modal,
				onClose: () => setModal(null),
				columnSettings,
				onSaveColumnSettings: setColumnSettings,
				chartConfig,
				onSaveChartConfig: setChartConfig
			})
		]
	});
}
function SimpleTable({ headers, rows, numeric = [], hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
		className: "w-full min-w-[900px] text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
			className: "sticky top-0 z-10 shadow-xs",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
				className: "bg-[#EAF0F6] text-slate-900 dark:bg-slate-800 dark:text-slate-100 font-bold tracking-wider text-[11px] uppercase border-b border-[#DFE3EB] dark:border-slate-700",
				children: headers.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					scope: "col",
					className: cn("border-r border-[#DFE3EB] dark:border-slate-700 px-2.5 py-2 font-bold text-slate-900 dark:text-slate-100 last:border-r-0", i === 0 && "rounded-tl-xl", numeric.includes(i) ? "text-right" : "text-left"),
					children: h
				}, h))
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
			onDoubleClick: r.onDoubleClick,
			className: cn("border-b border-border transition-colors duration-150 hover:bg-muted", r.onDoubleClick && "cursor-pointer"),
			children: r.cells.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: cn("px-2.5 py-1.5", numeric.includes(i) && "text-right tabular-nums"),
				children: c
			}, r.key + "-" + i))
		}, r.key)), hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			colSpan: headers.length,
			className: "px-2.5 py-2 text-[11px] text-muted-foreground",
			children: hint
		}) }) : null] })]
	});
}
function IconButton({ label, onClick, disabled, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": label,
			onClick,
			disabled,
			className: "inline-flex h-7 w-7 items-center justify-center rounded-md border border-border/80 bg-background text-muted-foreground transition-all duration-150 hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer shadow-2xs active:scale-95",
			children
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: label })] });
}
function ReportRow({ row, rowIndex, open, onToggle, onDrill, columns, colSpan, frozenCount = 0, chartConfig, colWidths, getStickyLeftOffset }) {
	const rowIdNum = parseInt(String(row.id).replace(/\D/g, "") || String(rowIndex), 10) || rowIndex || 1;
	const employeeNo = "EMP-" + (1e3 + rowIdNum);
	const imeiNo = "8610" + String(1e7 + rowIdNum * 987654).slice(0, 8);
	const startOdometer = (124e3 + rowIdNum * 520).toLocaleString();
	const endOdometer = (124e3 + rowIdNum * 520 + Math.round(row.distance)).toLocaleString();
	const firstIgnitionOn = row.trips[0]?.firstIgnitionOn || "07:15 AM";
	const lastIgnitionOff = row.trips[row.trips.length - 1]?.lastIgnitionOn || "08:45 PM";
	const noOfIdle = Math.max(1, Math.round(row.alerts * 1.5));
	const overSpeedTimes = row.alerts > 3 ? "2 times" : "0 times";
	const costDistance = "₹" + (row.tollCost * 3).toLocaleString();
	const costDuration = "₹" + (row.tollCost * 2).toLocaleString();
	const cellFor = (col, colIdx) => {
		const isFrozen = colIdx < frozenCount;
		const leftOffset = isFrozen ? getStickyLeftOffset(colIdx) : void 0;
		const w = colWidths[col.id] || DEFAULT_COLUMN_WIDTHS[col.id] || 110;
		const frozenClass = isFrozen ? cn("sticky z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/90 shadow-xs", colIdx === frozenCount - 1 && "shadow-[2px_0_4px_rgba(0,0,0,0.08)]") : "";
		const cellStyle = {
			width: w + "px",
			minWidth: w + "px",
			maxWidth: w + "px",
			left: leftOffset
		};
		switch (col.id) {
			case "vehicleNo": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 font-mono text-xs font-semibold text-foreground truncate", frozenClass),
				title: row.vehicleNo,
				children: row.vehicleNo
			}, col.id);
			case "employeeNo": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 text-muted-foreground font-mono text-xs truncate", frozenClass),
				title: employeeNo,
				children: employeeNo
			}, col.id);
			case "imei": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 text-muted-foreground font-mono text-[11px] tracking-wide truncate", frozenClass),
				title: imeiNo,
				children: imeiNo
			}, col.id);
			case "startLocation": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 font-medium text-foreground truncate", frozenClass),
				title: row.startLocation,
				children: row.startLocation
			}, col.id);
			case "startOdometer": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 text-right font-mono text-xs tabular-nums text-foreground truncate", frozenClass),
				title: startOdometer,
				children: startOdometer
			}, col.id);
			case "firstIgnitionOn": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 text-muted-foreground font-mono text-[11px] truncate", frozenClass),
				title: firstIgnitionOn,
				children: firstIgnitionOn
			}, col.id);
			case "distance": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 text-right font-mono text-xs font-bold text-blue-600 dark:text-blue-400 tabular-nums truncate", frozenClass),
				title: row.distance.toFixed(2),
				children: row.distance.toFixed(2)
			}, col.id);
			case "idleVsInactive": {
				const xVal = getMetricValue(row, chartConfig.xAxis);
				const yVal = getMetricValue(row, chartConfig.yAxis);
				const total = xVal + yVal;
				const xPct = total > 0 ? xVal / total * 100 : 50;
				const yPct = total > 0 ? yVal / total * 100 : 50;
				const xDisp = formatMetricDisplay(row, chartConfig.xAxis);
				const yDisp = formatMetricDisplay(row, chartConfig.yAxis);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					style: cellStyle,
					className: cn("px-2.5 py-1.5 truncate", frozenClass),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-center w-full min-w-[60px] max-w-[120px] mx-auto py-1",
						title: chartConfig.xAxis + ": " + xDisp + " (" + xPct.toFixed(0) + "%) | " + chartConfig.yAxis + ": " + yDisp + " (" + yPct.toFixed(0) + "%)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex shadow-2xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: { width: xPct + "%" },
								className: "bg-emerald-500 h-full transition-all duration-300"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: { width: yPct + "%" },
								className: "bg-amber-500 h-full transition-all duration-300"
							})]
						})
					})
				}, col.id);
			}
			case "running": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 truncate", frozenClass),
				title: row.running,
				children: row.running
			}, col.id);
			case "idle": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 font-mono text-xs font-medium text-amber-600 dark:text-amber-400 truncate", frozenClass),
				title: row.idle,
				children: row.idle
			}, col.id);
			case "stop": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 font-mono text-xs font-medium text-rose-600 dark:text-rose-400 truncate", frozenClass),
				title: row.stop,
				children: row.stop
			}, col.id);
			case "inactive": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 truncate text-muted-foreground", frozenClass),
				title: "00:00:00",
				children: "00:00:00"
			}, col.id);
			case "duration": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 truncate text-muted-foreground", frozenClass),
				title: "24:00:00",
				children: "24:00:00"
			}, col.id);
			case "workDuration": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 truncate text-muted-foreground", frozenClass),
				title: "08:00:00",
				children: "08:00:00"
			}, col.id);
			case "workingDays": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 text-center truncate", frozenClass),
				title: "1",
				children: "1"
			}, col.id);
			case "maxStoppage": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 truncate text-muted-foreground", frozenClass),
				title: "04:15:00",
				children: "04:15:00"
			}, col.id);
			case "noOfIdle": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 text-right tabular-nums truncate", frozenClass),
				title: String(noOfIdle),
				children: noOfIdle
			}, col.id);
			case "avgSpeed": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 text-right tabular-nums truncate", frozenClass),
				title: row.avgSpeed + " km/h",
				children: row.avgSpeed
			}, col.id);
			case "maxSpeed": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 text-right tabular-nums font-medium truncate", frozenClass),
				title: row.maxSpeed + " km/h",
				children: row.maxSpeed
			}, col.id);
			case "costDistance": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 text-right tabular-nums truncate font-medium", frozenClass),
				title: costDistance,
				children: costDistance
			}, col.id);
			case "costDuration": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 text-right tabular-nums truncate font-medium", frozenClass),
				title: costDuration,
				children: costDuration
			}, col.id);
			case "overSpeed": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 text-center truncate text-muted-foreground", frozenClass),
				title: overSpeedTimes,
				children: overSpeedTimes
			}, col.id);
			case "alerts": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 text-right tabular-nums truncate", frozenClass),
				title: String(row.alerts),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("rounded px-1.5 py-0.5 font-medium", row.alerts > 4 ? "bg-danger/10 text-danger" : "bg-muted text-muted-foreground"),
					children: String(row.alerts).padStart(2, "0")
				})
			}, col.id);
			case "endOdometer": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 text-right tabular-nums truncate", frozenClass),
				title: endOdometer,
				children: endOdometer
			}, col.id);
			case "lastIgnitionOff": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 text-muted-foreground truncate", frozenClass),
				title: lastIgnitionOff,
				children: lastIgnitionOff
			}, col.id);
			case "endLocation": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 truncate", frozenClass),
				title: row.endLocation,
				children: row.endLocation
			}, col.id);
			case "playback": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 text-center", frozenClass),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Play trip playback for " + row.vehicleNo,
					onClick: () => toast.success("Playback started", { description: row.vehicleNo + " · " + row.startLocation + " → " + row.endLocation }),
					className: "inline-flex h-5 w-5 items-center justify-center rounded border border-input bg-background text-muted-foreground transition-colors duration-150 hover:bg-brand hover:text-brand-foreground cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3 w-3" })
				})
			}, col.id);
			case "distanceUnit": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 text-center text-muted-foreground truncate", frozenClass),
				children: "km"
			}, col.id);
			case "company": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 truncate", frozenClass),
				title: row.company,
				children: row.company
			}, col.id);
			case "driver": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 truncate text-muted-foreground", frozenClass),
				title: row.driver,
				children: row.driver
			}, col.id);
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: cellStyle,
				className: cn("px-2.5 py-1.5 text-muted-foreground truncate", frozenClass),
				children: "-"
			}, col.id);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		onDoubleClick: onDrill,
		title: "Double-click to open daily summary",
		className: cn("group cursor-pointer border-b border-border/40 transition-colors duration-150 text-xs", open ? "bg-blue-50/50 dark:bg-blue-950/30 font-medium" : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			className: "sticky left-0 z-10 w-9 min-w-[36px] max-w-[36px] bg-surface group-hover:bg-muted/80 border-r border-border/60 px-2 py-2 text-center shadow-xs",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onToggle,
				"aria-expanded": open,
				"aria-label": (open ? "Collapse" : "Expand") + " trips for " + row.vehicleNo,
				className: "inline-flex h-5 w-5 items-center justify-center rounded-md border border-input/80 bg-background text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-90 text-blue-500") })
			})
		}), columns.map((col, idx) => cellFor(col, idx))]
	}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
		className: "border-b border-border bg-surface-muted",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			colSpan,
			className: "px-6 py-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-[11px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "text-left text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-1 font-medium",
							children: "Date"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-1 font-medium",
							children: "First ignition"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-1 font-medium",
							children: "Start location"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-1 text-right font-medium",
							children: "Distance"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-1 font-medium",
							children: "Running"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-1 font-medium",
							children: "Idle"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-1 font-medium",
							children: "Stop"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-1 text-right font-medium",
							children: "Alerts"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-1 font-medium",
							children: "Last ignition"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-1 font-medium",
							children: "End location"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-1 font-medium text-center",
							children: "Playback"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: row.trips.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border/60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1",
							children: t.date
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1",
							children: t.firstIgnitionOn
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1",
							children: t.startLocation
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1 text-right tabular-nums",
							children: t.distance.toFixed(2)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1",
							children: t.running
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1",
							children: t.idle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1",
							children: t.stop
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1 text-right tabular-nums",
							children: t.alerts
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1",
							children: t.lastIgnitionOn
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1",
							children: t.endLocation
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Play trip " + (i + 1) + " for " + row.vehicleNo,
								onClick: () => toast.success("Playback started", { description: row.vehicleNo + " · " + t.startLocation + " → " + t.endLocation }),
								className: "inline-flex h-5 w-5 items-center justify-center rounded border border-input bg-background text-muted-foreground transition-colors duration-150 hover:bg-brand hover:text-brand-foreground cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3 w-3" })
							})
						})
					]
				}, row.id + "-" + i)) })]
			})
		})
	}) : null] });
}
var SplitComponent = ReportPage;
//#endregion
export { SplitComponent as component };
