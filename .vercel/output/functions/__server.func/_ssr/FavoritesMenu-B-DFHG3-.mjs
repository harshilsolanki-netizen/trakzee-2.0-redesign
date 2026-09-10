import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { v as findReport } from "./reports-wyEenlZF.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { C as Star, F as Search, n as X, qt as ChevronRight, y as Trash2 } from "../_libs/lucide-react.mjs";
import { l as useLocation, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as PopoverTrigger, n as Popover, o as useDashboard, r as PopoverContent } from "./store-Butx-LES.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/FavoritesMenu-B-DFHG3-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FavoritesMenu() {
	const { favorites = [], toggleFavorite } = useDashboard();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [openCategory, setOpenCategory] = (0, import_react.useState)(null);
	const [query, setQuery] = (0, import_react.useState)("");
	const navigate = useNavigate();
	useLocation();
	const safeFavorites = Array.isArray(favorites) ? favorites : [];
	const allFavoriteItems = (0, import_react.useMemo)(() => {
		return safeFavorites.map(findReport).filter(Boolean);
	}, [safeFavorites]);
	const filteredItems = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		if (!q) return allFavoriteItems;
		return allFavoriteItems.filter((i) => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q) || i.id.toLowerCase().includes(q));
	}, [allFavoriteItems, query]);
	const categorized = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const item of filteredItems) {
			const cat = item.category || "General";
			map.set(cat, [...map.get(cat) ?? [], item]);
		}
		return [...map.entries()];
	}, [filteredItems]);
	const handleSelectFavorite = (item) => {
		setOpen(false);
		if (item.to.startsWith("/charts")) navigate({
			to: "/charts",
			search: { chart: item.id }
		});
		else navigate({
			to: "/report",
			search: { type: item.id }
		});
	};
	const hasFavorites = safeFavorites.length > 0 || allFavoriteItems.length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"aria-label": "Favourites",
				className: "group flex w-full flex-col items-center gap-1 py-1 cursor-pointer select-none relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 relative", open ? "bg-[#0089FF] text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/40" : "text-slate-400 group-hover:bg-white/10 group-hover:text-white"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("h-5 w-5 transition-transform duration-200 group-hover:scale-110", hasFavorites ? "fill-amber-400 text-amber-400" : "text-slate-400") })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("text-[10px] leading-tight tracking-tight transition-colors", open ? "font-semibold text-white" : "font-medium text-slate-400 group-hover:text-white"),
					children: "Favourites"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
			side: "right",
			align: "start",
			sideOffset: 8,
			className: "w-[300px] sm:w-[320px] overflow-hidden rounded-xl border border-slate-700/70 bg-[#0c1424]/98 p-0 text-slate-100 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-150",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-slate-800/80 bg-slate-950/60 p-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex items-center rounded-lg border border-slate-700/60 bg-slate-900/80 px-2.5 py-1.5 focus-within:border-blue-500 transition-all",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 text-slate-400 mr-2 shrink-0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "Search favourites...",
							className: "h-full flex-1 bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
						}),
						query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setQuery(""),
							className: "text-slate-400 hover:text-slate-200 cursor-pointer p-0.5 rounded",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
						})
					]
				})
			}), !hasFavorites ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center p-6 text-center bg-[#0c1424]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-bold text-slate-100",
						children: "No Favourites Added"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[11px] text-slate-400 leading-relaxed max-w-[220px]",
						children: "Click the star icon in any report header to add it here."
					})
				]
			}) : filteredItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-6 text-center text-xs text-slate-400",
				children: [
					"No favourites matching “",
					query,
					"”"
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[360px] overflow-y-auto overscroll-contain p-2 space-y-2.5 scrollbar-thin scrollbar-thumb-slate-800",
				children: categorized.map(([category, items]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: category })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-0.5",
						children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "group flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-all bg-slate-900/40 hover:bg-slate-800/80 border border-slate-800/40 hover:border-slate-700/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => handleSelectFavorite(item),
								className: "flex flex-1 items-center gap-2.5 min-w-0 text-left cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-slate-200 group-hover:text-white truncate",
									children: item.name
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									title: `Remove ${item.name} from favourites`,
									onClick: (e) => {
										e.stopPropagation();
										toggleFavorite(item.id);
										toast.success(`${item.name} removed from favourites`);
									},
									className: "opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => handleSelectFavorite(item),
									className: "p-1 text-blue-400 hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer",
									title: "Open report",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })
								})]
							})]
						}, item.id))
					})]
				}, category))
			})]
		})]
	});
}
/** Star toggle used in report/page headers to bookmark a screen. */
function FavoriteToggle({ reportId, className }) {
	const { isFavorite, toggleFavorite } = useDashboard();
	const item = findReport(reportId);
	const active = isFavorite(reportId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": active,
		"aria-label": active ? "Remove from favourites" : "Add to favourites",
		title: active ? "Remove from favourites" : "Add to favourites",
		onClick: (e) => {
			e.stopPropagation();
			toggleFavorite(reportId);
			toast.success(active ? `${item?.name ?? "Report"} removed from favourites` : `★ ${item?.name ?? "Report"} added to Favourites`, { description: active ? void 0 : `Access directly anytime from the sidebar Favourites menu.` });
		},
		className: cn("rounded-md p-1.5 transition-all duration-150 hover:bg-amber-500/10 hover:scale-110 active:scale-95 cursor-pointer", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("h-4 w-4 transition-all duration-150", active ? "fill-amber-400 text-amber-400 drop-shadow-xs" : "text-muted-foreground hover:text-amber-400") })
	});
}
//#endregion
export { FavoritesMenu as n, FavoriteToggle as t };
