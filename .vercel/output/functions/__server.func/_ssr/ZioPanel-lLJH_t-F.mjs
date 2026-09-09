import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { A as Shield, F as Search, H as Plus, It as Copy, P as Send, Q as Minus, Y as PanelRight, _ as TrendingUp, dt as LayoutDashboard, et as MessageSquare, g as TriangleAlert, gt as History, h as Truck, l as Users, n as X, rt as MapPin, tt as Maximize2, y as Trash2, zt as Clock } from "../_libs/lucide-react.mjs";
import { i as DropdownMenuItem, n as DropdownMenuContent, t as DropdownMenu, u as DropdownMenuTrigger } from "./dropdown-menu-U4x0DS5F.mjs";
import { n as useZio } from "./ZioContext-Cw_R09Nu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ZioPanel-lLJH_t-F.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ApplicationScreenPreview({ type, title, data }) {
	const { sendMessage } = useZio();
	const [zoom, setZoom] = (0, import_react.useState)(1);
	const [mapFilter, setMapFilter] = (0, import_react.useState)(null);
	const [selectedPin, setSelectedPin] = (0, import_react.useState)(null);
	if (type === "dashboard") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "my-3 overflow-hidden rounded-xl border border-slate-200/90 bg-white text-slate-900 shadow-md transition-all hover:shadow-lg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-slate-100 bg-[#111c38] px-3.5 py-2 text-white select-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-4 w-4 text-violet-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-bold tracking-tight text-white",
					children: "Trakzee 2.0 · Executive Fleet Dashboard"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-200",
				children: "Live Telematics"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-3 space-y-3 bg-slate-50/50",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => sendMessage("Why is the Safety low?"),
						title: "Click to analyze Fleet Safety Score",
						className: "rounded-lg border border-slate-200/80 bg-white p-2.5 shadow-2xs text-left transition-all hover:border-violet-400 hover:bg-violet-50/30 hover:shadow-xs active:scale-[0.98] cursor-pointer group",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-semibold text-slate-500 uppercase group-hover:text-violet-700",
									children: "Fleet Score"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center text-[10px] font-bold text-emerald-600",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3 mr-0.5" }), " +1.2%"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-lg sm:text-xl font-bold text-slate-900 mt-0.5 group-hover:text-violet-900",
								children: ["86", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-slate-400 font-normal",
									children: "/100"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-block rounded-full bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-700 mt-1",
								children: "Excellent Grade"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => sendMessage("Where are my vehicles right now?"),
						title: "Click to view live fleet map",
						className: "rounded-lg border border-slate-200/80 bg-white p-2.5 shadow-2xs text-left transition-all hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-xs active:scale-[0.98] cursor-pointer group",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-semibold text-slate-500 uppercase group-hover:text-blue-700",
									children: "Active Vehicles"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-500 animate-pulse" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-lg sm:text-xl font-bold text-slate-900 mt-0.5 group-hover:text-blue-900",
								children: "137"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-slate-500 mt-1",
								children: "44 Running · 39 Inactive"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => sendMessage("What’s my biggest issue?"),
						title: "Click to analyze critical safety alerts",
						className: "rounded-lg border border-slate-200/80 bg-white p-2.5 shadow-2xs text-left transition-all hover:border-amber-400 hover:bg-amber-50/30 hover:shadow-xs active:scale-[0.98] cursor-pointer group",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-semibold text-slate-500 uppercase group-hover:text-amber-700",
									children: "Safety Alerts"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3 text-amber-500" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-lg sm:text-xl font-bold text-amber-600 mt-0.5 group-hover:text-amber-700",
								children: "24"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-slate-500 mt-1",
								children: "12 Harsh Braking"
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => sendMessage("Explain driver safety distribution across the fleet"),
					title: "Click to drill down into driver safety bands",
					className: "rounded-lg border border-slate-200/80 bg-white p-2.5 shadow-2xs text-left transition-all hover:border-violet-400 hover:bg-violet-50/20 active:scale-[0.98] cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-[11px] font-bold text-slate-900 mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Driver Safety Distribution" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-violet-600 font-semibold",
							children: "137 Drivers ↗"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-[10px] text-slate-600 mb-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "91-100 (Excellent)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-emerald-600",
									children: "54 drivers (39%)"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1.5 w-full rounded-full bg-slate-100 overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-[39%] bg-emerald-500 rounded-full" })
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-[10px] text-slate-600 mb-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "71-90 (Good / Fair)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-blue-600",
									children: "62 drivers (45%)"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1.5 w-full rounded-full bg-slate-100 overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-[45%] bg-blue-500 rounded-full" })
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-[10px] text-slate-600 mb-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Below 70 (Requires Review)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-rose-600",
									children: "21 drivers (16%)"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1.5 w-full rounded-full bg-slate-100 overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-[16%] bg-rose-500 rounded-full" })
							})] })
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-slate-200/80 bg-white p-2.5 shadow-2xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-[11px] font-bold text-slate-900 mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Today's Critical Telemetry" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-violet-600 font-medium",
							children: "Click to drill down"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-1.5 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => sendMessage("Why are there overspeeding instances in the fleet?"),
								title: "Analyze overspeeding events",
								className: "flex items-center gap-1.5 rounded bg-slate-50 p-1.5 border border-slate-100 text-left transition-colors hover:border-rose-300 hover:bg-rose-50/40 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "truncate",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[9px] text-slate-500",
										children: "Overspeeding"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-slate-900",
										children: "7 Events ↗"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => sendMessage("Why are there harsh braking events?"),
								title: "Analyze harsh deceleration events",
								className: "flex items-center gap-1.5 rounded bg-slate-50 p-1.5 border border-slate-100 text-left transition-colors hover:border-amber-300 hover:bg-amber-50/40 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "truncate",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[9px] text-slate-500",
										children: "Harsh Decel"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-slate-900",
										children: "12 Events ↗"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => sendMessage("Explain DMS driver fatigue alerts"),
								title: "Analyze driver distraction & fatigue",
								className: "flex items-center gap-1.5 rounded bg-slate-50 p-1.5 border border-slate-100 text-left transition-colors hover:border-purple-300 hover:bg-purple-50/40 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "truncate",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[9px] text-slate-500",
										children: "DMS Fatigue"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-slate-900",
										children: "3 Events ↗"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => sendMessage("How to improve vehicle score?"),
								title: "Analyze eco compliance & score roadmap",
								className: "flex items-center gap-1.5 rounded bg-slate-50 p-1.5 border border-slate-100 text-left transition-colors hover:border-emerald-300 hover:bg-emerald-50/40 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "truncate",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[9px] text-slate-500",
										children: "Eco Compliance"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-slate-900",
										children: "94.2% ↗"
									})]
								})]
							})
						]
					})]
				})]
			})]
		})]
	});
	if (type === "fleet-map") {
		const pins = [
			{
				id: "1",
				name: "MH12OP1616",
				driver: "Arjun Singh",
				speed: "42 km/h",
				loc: "Pune Depot",
				status: "running",
				x: 230,
				y: 110
			},
			{
				id: "2",
				name: "KA51QQ9999",
				driver: "Ramesh Nair",
				speed: "58 km/h",
				loc: "Bengaluru South",
				status: "running",
				x: 260,
				y: 170
			},
			{
				id: "3",
				name: "TN01AB4412",
				driver: "Karthik Raja",
				speed: "64 km/h",
				loc: "Salem Highway",
				status: "running",
				x: 280,
				y: 195
			},
			{
				id: "4",
				name: "HR26DK5566",
				driver: "Vikas Verma",
				speed: "0 km/h",
				loc: "Panipat Refinery",
				status: "inactive",
				x: 210,
				y: 50
			},
			{
				id: "5",
				name: "WB04AA1212",
				driver: "Bikas Ghosh",
				speed: "--",
				loc: "Haldia Petrochem",
				status: "nodata",
				x: 340,
				y: 100
			},
			{
				id: "6",
				name: "MH03DD3003",
				driver: "Sunil Joshi",
				speed: "0 km/h",
				loc: "Chembur Yard",
				status: "inactive",
				x: 200,
				y: 120
			}
		];
		const displayedPins = mapFilter ? pins.filter((p) => p.status === mapFilter) : pins;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "my-3 overflow-hidden rounded-xl border border-slate-200/90 bg-white text-slate-900 shadow-md transition-all hover:shadow-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-slate-100 bg-[#111c38] px-3.5 py-2 text-white select-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold tracking-tight text-white",
							children: "Trakzee 2.0 · Live GPS Fleet Map"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-slate-300 font-medium",
						children: "137 Vehicles"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-2 bg-slate-50 p-2.5 border-b border-slate-100 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setMapFilter(mapFilter === "running" ? null : "running"),
							className: cn("flex items-center gap-2 rounded-lg bg-white p-1.5 px-2.5 border transition-all cursor-pointer shadow-2xs text-left", mapFilter === "running" ? "border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/20" : "border-slate-200/80 hover:border-emerald-400"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-slate-600 truncate",
								children: ["Running: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-slate-900",
									children: "44"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setMapFilter(mapFilter === "inactive" ? null : "inactive"),
							className: cn("flex items-center gap-2 rounded-lg bg-white p-1.5 px-2.5 border transition-all cursor-pointer shadow-2xs text-left", mapFilter === "inactive" ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50/20" : "border-slate-200/80 hover:border-blue-400"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-blue-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-slate-600 truncate",
								children: ["Inactive: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-slate-900",
									children: "39"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setMapFilter(mapFilter === "nodata" ? null : "nodata"),
							className: cn("flex items-center gap-2 rounded-lg bg-white p-1.5 px-2.5 border transition-all cursor-pointer shadow-2xs text-left", mapFilter === "nodata" ? "border-purple-500 ring-1 ring-purple-500 bg-purple-50/20" : "border-slate-200/80 hover:border-purple-400"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-purple-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-slate-600 truncate",
								children: ["No Data: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-slate-900",
									children: "50"
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-48 sm:h-52 w-full bg-[#e8ecf1] overflow-hidden select-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							className: "h-full w-full opacity-90 transition-transform duration-300 ease-out",
							style: { transform: `scale(${zoom})` },
							viewBox: "0 0 450 240",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
									id: "app-map-grid-theme",
									width: "30",
									height: "30",
									patternUnits: "userSpaceOnUse",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M 30 0 L 0 0 0 30",
										fill: "none",
										stroke: "#cbd5e1",
										strokeWidth: "0.5"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									width: "450",
									height: "240",
									fill: "url(#app-map-grid-theme)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: "M100 40 Q150 20 200 50 T300 40 T380 60 L400 110 Q340 160 280 140 T180 200 T100 160 Z",
									fill: "#cbd5e1",
									stroke: "#94a3b8",
									strokeWidth: "0.8"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: "M190 90 Q230 70 270 100 T310 160 T270 210 T190 170 Z",
									fill: "#94a3b8",
									stroke: "#64748b",
									strokeWidth: "1"
								}),
								displayedPins.map((pin) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
									className: "cursor-pointer transition-transform hover:scale-125",
									onClick: () => setSelectedPin(pin),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: pin.x,
										cy: pin.y,
										r: "6.5",
										fill: pin.status === "running" ? "#10b981" : pin.status === "inactive" ? "#3b82f6" : "#a855f7",
										opacity: "0.3",
										className: "animate-ping"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: pin.x,
										cy: pin.y,
										r: "4",
										fill: pin.status === "running" ? "#10b981" : pin.status === "inactive" ? "#3b82f6" : "#a855f7",
										stroke: "#ffffff",
										strokeWidth: "1.2"
									})]
								}, pin.id))
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute top-2 left-2 flex flex-col rounded-md border border-slate-200 bg-white/95 shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setZoom((z) => Math.min(1.6, z + .2)),
								"aria-label": "Zoom in",
								className: "p-1 hover:bg-slate-100 text-slate-700 cursor-pointer border-b border-slate-200",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setZoom((z) => Math.max(.8, z - .2)),
								"aria-label": "Zoom out",
								className: "p-1 hover:bg-slate-100 text-slate-700 cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3 w-3" })
							})]
						}),
						selectedPin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute bottom-2 left-2 right-2 rounded-lg border border-slate-200 bg-white/95 p-2 text-xs text-slate-900 shadow-lg flex items-center justify-between animate-in fade-in-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-bold flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-2 w-2 rounded-full", selectedPin.status === "running" ? "bg-emerald-500" : selectedPin.status === "inactive" ? "bg-blue-500" : "bg-purple-500") }),
									selectedPin.name,
									" (",
									selectedPin.driver,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] text-slate-500 mt-0.5",
								children: [
									"Location: ",
									selectedPin.loc,
									" · Speed: ",
									selectedPin.speed
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => sendMessage(`Explain safety score for ${selectedPin.name}`),
									className: "rounded bg-violet-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-violet-700 transition-colors cursor-pointer shadow-2xs",
									children: "Analyze Vehicle ↗"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setSelectedPin(null),
									className: "text-slate-400 hover:text-slate-800 text-xs px-1",
									children: "✕"
								})]
							})]
						})
					]
				})
			]
		});
	}
	if (type === "trip-summary") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "my-3 overflow-hidden rounded-xl border border-slate-200/90 bg-white text-slate-900 shadow-md transition-all hover:shadow-lg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-slate-100 bg-[#111c38] px-3.5 py-2 text-white select-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 text-rose-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold tracking-tight text-white",
						children: "Trakzee 2.0 · Trip Summary Report"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] text-slate-300 font-medium",
					children: "133 Records"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2 bg-slate-50 p-2.5 border-b border-slate-100",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => sendMessage("Show me the trip summary with dashboard"),
						title: "Drill down into total distance",
						className: "rounded-lg bg-white p-2 border border-slate-200/80 shadow-2xs text-left hover:border-violet-400 hover:bg-violet-50/20 transition-all cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[9px] font-semibold text-slate-500 uppercase",
							children: "Total Distance"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs sm:text-sm font-bold text-slate-900 mt-0.5",
							children: "5,084.36 km ↗"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => sendMessage("Explain fleet average distance and route efficiency"),
						title: "Drill down into average distance",
						className: "rounded-lg bg-white p-2 border border-slate-200/80 shadow-2xs text-left hover:border-violet-400 hover:bg-violet-50/20 transition-all cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[9px] font-semibold text-slate-500 uppercase",
							children: "Fleet Avg"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs sm:text-sm font-bold text-slate-900 mt-0.5",
							children: "38.23 km ↗"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => sendMessage("Explain safety score for HP Object 38"),
						title: "Drill down into top vehicle",
						className: "rounded-lg bg-white p-2 border border-slate-200/80 shadow-2xs text-left hover:border-violet-400 hover:bg-violet-50/20 transition-all cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[9px] font-semibold text-slate-500 uppercase",
							children: "Top Vehicle"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs sm:text-sm font-bold text-slate-900 mt-0.5 truncate",
							children: "HP Object 38 ↗"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-[10px] font-bold text-slate-900 uppercase mb-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Top Vehicle Trips" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-violet-600 font-semibold lowercase text-[10px]",
						children: "click row to inspect"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-lg border border-slate-200 text-[11px]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-slate-100 text-slate-600 font-semibold border-b border-slate-200",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-1 px-2",
									children: "Vehicle"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-1 px-2",
									children: "Driver"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-1 px-2 text-right",
									children: "Distance"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-1 px-2 text-right",
									children: "Running"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-slate-100 bg-white",
							children: [
								{
									name: "HP Object 38",
									driver: "Suresh Patel",
									dist: "181.90 km",
									time: "03:42:10"
								},
								{
									name: "HP Object 31",
									driver: "Ramesh Nair",
									dist: "181.89 km",
									time: "03:40:00"
								},
								{
									name: "HP Object 45",
									driver: "Deepak Rao",
									dist: "181.79 km",
									time: "03:35:45"
								},
								{
									name: "HP Object 10",
									driver: "Arjun Singh",
									dist: "181.68 km",
									time: "03:28:10"
								}
							].map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								onClick: () => sendMessage(`Explain safety score for ${r.name}`),
								title: `Click to inspect ${r.name} logs`,
								className: "hover:bg-violet-50/60 transition-colors cursor-pointer",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-1 px-2 font-semibold text-violet-900",
										children: [r.name, " ↗"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-1 px-2 text-slate-600",
										children: r.driver
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-1 px-2 text-right font-semibold text-blue-600",
										children: r.dist
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-1 px-2 text-right text-emerald-600 font-mono text-[10px]",
										children: r.time
									})
								]
							}, i))
						})]
					})
				})]
			})
		]
	});
	if (type === "safety-distribution") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "my-3 overflow-hidden rounded-xl border border-slate-200/90 bg-white text-slate-900 shadow-md transition-all hover:shadow-lg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-slate-100 bg-[#111c38] px-3.5 py-2 text-white select-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-violet-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-bold tracking-tight text-white",
					children: "Trakzee 2.0 · Driver Safety Distribution"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300",
				children: "137 Fleet Drivers"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-3.5 space-y-3 bg-slate-50/50",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg bg-white p-2 border border-slate-200 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[9px] text-slate-500 font-medium uppercase",
								children: "Band 91-100"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-bold text-emerald-600 mt-0.5",
								children: "54 Drivers"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-emerald-700 font-semibold",
								children: "39.4% (Grade A)"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg bg-white p-2 border border-slate-200 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[9px] text-slate-500 font-medium uppercase",
								children: "Band 71-90"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-bold text-blue-600 mt-0.5",
								children: "62 Drivers"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-blue-700 font-semibold",
								children: "45.3% (Good)"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg bg-white p-2 border border-slate-200 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[9px] text-slate-500 font-medium uppercase",
								children: "Below 70"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-bold text-rose-600 mt-0.5",
								children: "21 Drivers"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-rose-700 font-semibold",
								children: "15.3% (Review)"
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 pt-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-[11px] font-medium text-slate-700 mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Excellent Safety Performers (91-100)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-emerald-600",
							children: "54 / 137"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 w-full rounded-full bg-slate-100 overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-[39.4%] bg-emerald-500 rounded-full" })
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-[11px] font-medium text-slate-700 mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Standard Safe Drivers (71-90)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-blue-600",
							children: "62 / 137"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 w-full rounded-full bg-slate-100 overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-[45.3%] bg-blue-500 rounded-full" })
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-[11px] font-medium text-slate-700 mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Coaching Required (Below 70)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-rose-600",
							children: "21 / 137"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 w-full rounded-full bg-slate-100 overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-[15.3%] bg-rose-500 rounded-full" })
					})] })
				]
			})]
		})]
	});
	if (type === "today-activity") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "my-3 overflow-hidden rounded-xl border border-slate-200/90 bg-white text-slate-900 shadow-md transition-all hover:shadow-lg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-slate-100 bg-[#111c38] px-3.5 py-2 text-white select-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-bold tracking-tight text-white",
					children: "Trakzee 2.0 · Today's Activity Timeline"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] text-slate-300 font-medium",
				children: "Daily Log"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-3 space-y-2.5 bg-slate-50",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-xs font-semibold text-slate-900",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Activity Breakdown" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-emerald-600 font-bold",
						children: "62% Running Time"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-3 w-full rounded-full overflow-hidden shadow-2xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full w-[62%] bg-emerald-500",
							title: "Running (62%)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full w-[14%] bg-amber-400",
							title: "Idle (14%)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full w-[24%] bg-rose-500",
							title: "Stopped (24%)"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-1 text-[10px] pt-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => sendMessage("Where are my vehicles right now?"),
							className: "flex items-center gap-1 text-slate-700 bg-white p-1 rounded border border-slate-200 hover:border-emerald-400 transition-colors cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: "Running: 5h 20m ↗"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => sendMessage("Why are vehicles idling today?"),
							className: "flex items-center gap-1 text-slate-700 bg-white p-1 rounded border border-slate-200 hover:border-amber-400 transition-colors cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-amber-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: "Idle: 1h 12m ↗"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => sendMessage("Show me vehicle stoppage locations"),
							className: "flex items-center gap-1 text-slate-700 bg-white p-1 rounded border border-slate-200 hover:border-rose-400 transition-colors cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-rose-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: "Stopped: 2h 04m ↗"
							})]
						})
					]
				})
			]
		})]
	});
	const vehicleName = data?.name || "HP Object 38";
	const overall = data?.overallScore ?? 86;
	const safety = data?.safetyScore ?? 82;
	const efficiency = data?.efficiencyScore ?? 88;
	const risk = data?.riskScore ?? 14;
	const discipline = data?.disciplineScore ?? 91;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "my-3 overflow-hidden rounded-xl border border-slate-200/90 bg-white text-slate-900 shadow-md transition-all hover:shadow-lg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-slate-100 bg-[#111c38] px-3.5 py-2 text-white select-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-bold tracking-tight text-white truncate",
					children: ["Trakzee 2.0 · Scorecard: ", vehicleName]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "rounded bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300 shrink-0",
				children: [
					"Grade ",
					overall >= 85 ? "A" : overall >= 70 ? "B" : "C",
					" (",
					overall,
					"/100)"
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-4 gap-2 bg-slate-50 p-2.5 border-b border-slate-100 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => sendMessage(`Why is the Safety low for ${vehicleName}?`),
					title: "Drill down into safety rating",
					className: "rounded-lg bg-white p-2 border border-slate-200 shadow-2xs hover:border-emerald-400 hover:bg-emerald-50/20 transition-all cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[9px] text-slate-500 font-medium uppercase",
						children: "Safety"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs sm:text-sm font-bold text-emerald-600 mt-0.5",
						children: [safety, "% ↗"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => sendMessage(`How to improve score for ${vehicleName}?`),
					title: "Drill down into efficiency rating",
					className: "rounded-lg bg-white p-2 border border-slate-200 shadow-2xs hover:border-blue-400 hover:bg-blue-50/20 transition-all cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[9px] text-slate-500 font-medium uppercase",
						children: "Efficiency"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs sm:text-sm font-bold text-blue-600 mt-0.5",
						children: [efficiency, "% ↗"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => sendMessage(`What is the biggest issue for ${vehicleName}?`),
					title: "Drill down into risk index",
					className: "rounded-lg bg-white p-2 border border-slate-200 shadow-2xs hover:border-amber-400 hover:bg-amber-50/20 transition-all cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[9px] text-slate-500 font-medium uppercase",
						children: "Risk"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs sm:text-sm font-bold text-amber-600 mt-0.5",
						children: [risk, "% ↗"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => sendMessage(`Explain driver discipline for ${vehicleName}`),
					title: "Drill down into driver discipline",
					className: "rounded-lg bg-white p-2 border border-slate-200 shadow-2xs hover:border-purple-400 hover:bg-purple-50/20 transition-all cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[9px] text-slate-500 font-medium uppercase",
						children: "Discipline"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs sm:text-sm font-bold text-purple-600 mt-0.5",
						children: [discipline, "% ↗"]
					})]
				})
			]
		})]
	});
}
function renderInlineMarkdown(text) {
	if (!text) return null;
	return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
		if (part.startsWith("**") && part.endsWith("**")) {
			const inner = part.slice(2, -2);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
				className: "font-semibold text-slate-950",
				children: inner
			}, i);
		}
		return part;
	});
}
function FormattedZioMessage({ content, isFullscreen }) {
	const lines = content.split("\n");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("space-y-2.5 text-slate-800", isFullscreen ? "text-sm sm:text-base leading-relaxed" : "text-xs leading-relaxed"),
		children: lines.map((line, idx) => {
			if (!line.trim()) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1" }, idx);
			if (line.startsWith("### ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: cn("font-bold text-slate-950 mt-2 mb-1", isFullscreen ? "text-base sm:text-lg" : "text-xs sm:text-sm"),
				children: renderInlineMarkdown(line.slice(4))
			}, idx);
			const numMatch = line.match(/^(\d+\.)\s+(.*)$/);
			if (numMatch && numMatch[1] && numMatch[2]) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2 pl-0.5 py-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-violet-700 shrink-0",
					children: numMatch[1]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex-1 text-slate-800",
					children: renderInlineMarkdown(numMatch[2])
				})]
			}, idx);
			if (line.startsWith("- ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2.5 pl-1 py-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-violet-600 shrink-0 mt-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex-1 text-slate-800",
					children: renderInlineMarkdown(line.slice(2))
				})]
			}, idx);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "leading-relaxed",
				children: renderInlineMarkdown(line)
			}, idx);
		})
	});
}
function formatRelativeTime(timestamp) {
	if (!timestamp) return "Just now";
	const diffMs = Date.now() - timestamp;
	if (diffMs < 0) return "Just now";
	const diffSeconds = Math.floor(diffMs / 1e3);
	if (diffSeconds < 60) return "Just now";
	const diffMinutes = Math.floor(diffSeconds / 60);
	if (diffMinutes < 60) return `${diffMinutes}m ago`;
	const diffHours = Math.floor(diffMinutes / 60);
	if (diffHours < 24) return `${diffHours}h ago`;
	const diffDays = Math.floor(diffHours / 24);
	if (diffDays === 1) return "1 day ago";
	if (diffDays < 7) return `${diffDays} days ago`;
	const diffWeeks = Math.floor(diffDays / 7);
	if (diffWeeks === 1) return "1 week ago";
	if (diffWeeks < 4) return `${diffWeeks} weeks ago`;
	const diffMonths = Math.floor(diffDays / 30);
	if (diffMonths === 1) return "1 month ago";
	if (diffMonths < 12) return `${diffMonths} months ago`;
	const diffYears = Math.floor(diffDays / 365);
	return diffYears <= 1 ? "1 year ago" : `${diffYears} years ago`;
}
function ZioHistoryView({ isFullscreen }) {
	const { sessions, activeSessionId, loadChatSession, deleteChatSession, clearAllHistory, createNewChat, setIsHistoryOpen } = useZio();
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const filteredSessions = (0, import_react.useMemo)(() => {
		if (!searchQuery.trim()) return sessions;
		const q = searchQuery.toLowerCase();
		return sessions.filter((s) => {
			const matchTitle = s.title.toLowerCase().includes(q);
			const matchMessages = s.messages.some((m) => m.content.toLowerCase().includes(q));
			return matchTitle || matchMessages;
		});
	}, [sessions, searchQuery]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col h-full w-full font-sans animate-in fade-in duration-200", isFullscreen ? "max-w-3xl mx-auto py-2" : "max-w-full"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full pb-2 shrink-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: searchQuery,
						onChange: (e) => setSearchQuery(e.target.value),
						placeholder: "Search conversations...",
						className: "h-8 w-full rounded-md border border-input bg-white pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1.5 focus:ring-primary/40 font-sans"
					}),
					searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSearchQuery(""),
						className: "absolute right-2.5 top-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 min-h-0 overflow-y-auto py-1 divide-y divide-slate-100/80 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300",
				children: filteredSessions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center h-48 text-center p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-9 w-9 rounded-md bg-violet-50 flex items-center justify-center text-violet-600 mb-2 border border-violet-100",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-foreground",
							children: searchQuery ? "No matching conversations" : "No chat history yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground mt-0.5 max-w-xs font-normal",
							children: searchQuery ? "Try searching for a different keyword or prompt." : "Your conversations with Zio will appear here."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: createNewChat,
							className: "mt-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-2xs hover:bg-muted transition-colors cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Start new conversation" })]
						})
					]
				}) : filteredSessions.map((session) => {
					const isActive = session.id === activeSessionId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => {
							loadChatSession(session.id);
							setIsHistoryOpen(false);
						},
						className: cn("group relative flex items-center justify-between gap-3 px-1.5 py-2.5 rounded-md transition-colors cursor-pointer text-left select-none w-full", isActive ? "bg-violet-50/90 text-violet-950 font-semibold" : "bg-transparent hover:bg-slate-100/70 text-slate-800"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-violet-600" : "text-slate-400 group-hover:text-slate-600") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("text-xs truncate leading-none font-sans", isActive ? "text-violet-950 font-semibold" : "text-slate-800 font-medium group-hover:text-slate-950"),
								children: session.title
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 shrink-0 text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								title: "Delete chat",
								"aria-label": "Delete chat",
								onClick: (e) => {
									e.stopPropagation();
									deleteChatSession(session.id);
								},
								className: "opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:bg-red-50 hover:text-red-600 transition-opacity cursor-pointer shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-slate-400 font-normal shrink-0 font-sans",
								children: formatRelativeTime(session.updatedAt || session.createdAt)
							})]
						})]
					}, session.id);
				})
			}),
			sessions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-2.5 mt-auto border-t border-slate-100 flex items-center justify-between shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: clearAllHistory,
					className: "inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-red-600 transition-colors cursor-pointer px-1 py-1 rounded",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Clear all history" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setIsHistoryOpen(false),
					className: "inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Back to Chat" })
				})]
			})
		]
	});
}
function ZioPanel({ mode: forcedMode, className }) {
	const { isOpen, mode: contextMode, messages, isStreaming, closeZio, setMode, sendMessage, clearMessages, isHistoryOpen, setIsHistoryOpen, toggleHistory, createNewChat } = useZio();
	const mode = forcedMode || contextMode;
	const isFullscreen = mode === "fullscreen";
	const [input, setInput] = (0, import_react.useState)("");
	const messagesEndRef = (0, import_react.useRef)(null);
	const inputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!isHistoryOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [
		messages,
		isStreaming,
		isHistoryOpen
	]);
	(0, import_react.useEffect)(() => {
		if ((isOpen || mode === "fullscreen") && !isHistoryOpen) setTimeout(() => inputRef.current?.focus(), 150);
	}, [
		isOpen,
		mode,
		isHistoryOpen
	]);
	const handleSend = () => {
		if (!input.trim() || isStreaming) return;
		const text = input;
		setInput("");
		sendMessage(text);
	};
	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};
	if (!isOpen && mode !== "fullscreen") return null;
	const CurrentModeIcon = mode === "sidebar" ? PanelRight : mode === "fullscreen" ? Maximize2 : Copy;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			border: "1.5px solid transparent",
			background: "linear-gradient(to bottom, #ffffff 0%, #faf7ff 45%, #f4ebff 100%) padding-box, linear-gradient(to bottom, #7c3aed 0%, #a855f7 30%, #ec4899 70%, #f43f5e 100%) border-box",
			borderRadius: "0.75rem"
		},
		className: cn("flex flex-col text-foreground transition-all duration-300 ease-out overflow-hidden shadow-[0_16px_50px_-10px_rgba(139,92,246,0.18)] relative", isFullscreen && "w-full h-full flex-1", mode === "floating" && "w-[380px] sm:w-[410px] h-[580px] max-h-[85vh]", mode === "sidebar" && "w-full h-full flex-1", className),
		children: [
			isFullscreen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0 z-0 opacity-60 transition-opacity duration-500",
				style: { background: "radial-gradient(circle at 12% 75%, rgba(254, 205, 211, 0.45) 0%, transparent 45%), radial-gradient(circle at 88% 75%, rgba(219, 234, 254, 0.55) 0%, transparent 45%), radial-gradient(circle at 50% 90%, rgba(237, 233, 254, 0.45) 0%, transparent 50%)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: cn("flex items-center justify-between border-b border-violet-100/70 bg-white/80 px-4 py-2.5 backdrop-blur-xs transition-all duration-300 ease-out shrink-0 select-none z-10", isFullscreen && "px-6 py-3"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2 min-w-0",
					children: isHistoryOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-xs font-semibold text-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-3.5 w-3.5 text-violet-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Chat History" })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: createNewChat,
							title: "New chat",
							"aria-label": "New chat",
							className: "inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-violet-100 hover:text-slate-900 cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 text-slate-700" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: toggleHistory,
							title: isHistoryOpen ? "Back to chat" : "Chat history",
							"aria-label": "Chat history",
							className: cn("inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-violet-100 hover:text-slate-900 cursor-pointer", isHistoryOpen && "bg-violet-100 text-violet-900 ring-1 ring-violet-200"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-4 w-4 text-slate-700" })
						}),
						!isHistoryOpen && messages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: clearMessages,
							title: "Clear chat messages",
							"aria-label": "Clear chat messages",
							className: "inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-violet-100 hover:text-slate-900 cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-slate-700" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3.5 w-px bg-violet-200/70 mx-0.5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								title: `Layout mode: ${mode}`,
								"aria-label": `Switch layout mode (current: ${mode})`,
								className: "inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-violet-100 hover:text-slate-900 cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrentModeIcon, { className: "h-4 w-4 text-slate-700" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
							align: "end",
							className: "w-40 rounded-lg p-1.5 shadow-2xl border border-violet-100 text-xs z-50 bg-white",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground",
									children: "Switch to"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => setMode("floating"),
									className: cn("flex items-center gap-2 rounded-md px-2.5 py-2 cursor-pointer", mode === "floating" && "bg-violet-50 text-violet-900 font-semibold"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Floating" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => setMode("sidebar"),
									className: cn("flex items-center gap-2 rounded-md px-2.5 py-2 cursor-pointer", mode === "sidebar" && "bg-violet-50 text-violet-900 font-semibold"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelRight, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sidebar" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => setMode("fullscreen"),
									className: cn("flex items-center gap-2 rounded-md px-2.5 py-2 cursor-pointer", mode === "fullscreen" && "bg-violet-50 text-violet-900 font-semibold"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Full screen" })]
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: closeZio,
							"aria-label": "Close Zio",
							className: "inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-violet-100 hover:text-slate-900 cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 transition-all duration-300 ease-out z-10 flex flex-col", "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300", isFullscreen ? "p-6" : "space-y-4"),
				children: isHistoryOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZioHistoryView, { isFullscreen }) : messages.length === 0 ? isFullscreen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-end h-full py-6 w-full max-w-4xl mx-auto mt-auto animate-in fade-in duration-200",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 text-center space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-2xl font-bold text-foreground tracking-tight",
							children: "Hi, I’m Zio. How can I help?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "How can I help you analyze your fleet today?"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full flex flex-col items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-center gap-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => sendMessage("Show me the fleet dashboard"),
									className: "rounded-md border border-violet-100/80 bg-white/60 backdrop-blur-xs px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition-all hover:bg-white/90 hover:border-violet-200 hover:text-slate-950 cursor-pointer",
									children: "Show me the fleet dashboard"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => sendMessage("Where are my vehicles right now?"),
									className: "rounded-md border border-violet-100/80 bg-white/60 backdrop-blur-xs px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition-all hover:bg-white/90 hover:border-violet-200 hover:text-slate-950 cursor-pointer",
									children: "Where are my vehicles right now?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => sendMessage("Show me the trip summary with dashboard"),
									className: "rounded-md border border-violet-100/80 bg-white/60 backdrop-blur-xs px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition-all hover:bg-white/90 hover:border-violet-200 hover:text-slate-950 cursor-pointer",
									children: "Show me the trip summary with dashboard"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => sendMessage("Why is the Safety low?"),
									className: "rounded-md border border-violet-100/80 bg-white/60 backdrop-blur-xs px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition-all hover:bg-white/90 hover:border-violet-200 hover:text-slate-950 cursor-pointer",
									children: "Why is the Safety low?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => sendMessage("How to improve vehicle score?"),
									className: "rounded-md border border-violet-100/80 bg-white/60 backdrop-blur-xs px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition-all hover:bg-white/90 hover:border-violet-200 hover:text-slate-950 cursor-pointer",
									children: "How to improve vehicle score?"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full max-w-3xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 rounded-md border border-violet-100/80 bg-white/80 backdrop-blur-xs p-1.5 shadow-2xs focus-within:border-primary focus-within:bg-white focus-within:ring-1.5 focus-within:ring-primary/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: inputRef,
									type: "text",
									value: input,
									onChange: (e) => setInput(e.target.value),
									onKeyDown: handleKeyDown,
									disabled: isStreaming,
									placeholder: "Ask me ...",
									className: "flex-1 bg-transparent px-2.5 py-1 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: handleSend,
									disabled: !input.trim() || isStreaming,
									"aria-label": "Send message",
									className: cn("flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer shadow-2xs shrink-0", input.trim() ? "bg-[#111c38] text-white hover:bg-[#0c1429]" : "bg-[#111c38] text-white opacity-80 cursor-not-allowed"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4 fill-white text-white" })
								})]
							})
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto flex flex-col space-y-3 pb-2 text-left justify-end animate-in fade-in duration-200",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xl font-bold tracking-tight text-foreground leading-snug",
							children: "Hi, I’m Zio"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "How can I help you analyze your fleet today?"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 pt-1 w-full",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => sendMessage("Show me the fleet dashboard"),
								className: "flex items-center justify-between rounded-md border border-violet-100/80 bg-white/60 backdrop-blur-xs px-3.5 py-2.5 text-xs font-medium text-slate-700 shadow-2xs transition-all hover:bg-white/90 hover:border-violet-200 hover:text-slate-950 cursor-pointer w-full text-left",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Show me the fleet dashboard" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => sendMessage("Where are my vehicles right now?"),
								className: "flex items-center justify-between rounded-md border border-violet-100/80 bg-white/60 backdrop-blur-xs px-3.5 py-2.5 text-xs font-medium text-slate-700 shadow-2xs transition-all hover:bg-white/90 hover:border-violet-200 hover:text-slate-950 cursor-pointer w-full text-left",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Where are my vehicles right now?" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => sendMessage("Show me the trip summary with dashboard"),
								className: "flex items-center justify-between rounded-md border border-violet-100/80 bg-white/60 backdrop-blur-xs px-3.5 py-2.5 text-xs font-medium text-slate-700 shadow-2xs transition-all hover:bg-white/90 hover:border-violet-200 hover:text-slate-950 cursor-pointer w-full text-left",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Show me the trip summary with dashboard" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => sendMessage("Why is the Safety low?"),
								className: "flex items-center justify-between rounded-md border border-violet-100/80 bg-white/60 backdrop-blur-xs px-3.5 py-2.5 text-xs font-medium text-slate-700 shadow-2xs transition-all hover:bg-white/90 hover:border-violet-200 hover:text-slate-950 cursor-pointer w-full text-left",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Why is the Safety low?" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => sendMessage("How to improve vehicle score?"),
								className: "flex items-center justify-between rounded-md border border-violet-100/80 bg-white/60 backdrop-blur-xs px-3.5 py-2.5 text-xs font-medium text-slate-700 shadow-2xs transition-all hover:bg-white/90 hover:border-violet-200 hover:text-slate-950 cursor-pointer w-full text-left",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "How to improve vehicle score?" })
							})
						]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("w-full space-y-4", isFullscreen ? "max-w-4xl mx-auto py-2" : "max-w-full"),
					children: [messages.map((msg) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("flex flex-col space-y-1.5 transition-all duration-200", msg.role === "user" ? "items-end" : "items-start"),
						children: [msg.role === "user" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-w-[85%] rounded-2xl rounded-br-xs bg-[#111c38] px-4 py-2.5 text-xs sm:text-sm font-medium text-white shadow-sm leading-relaxed",
							children: msg.content
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full max-w-[96%] px-1 py-1 leading-relaxed text-slate-800 space-y-2",
							children: [
								msg.appScreenType && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "animate-in fade-in zoom-in-95 duration-300",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApplicationScreenPreview, {
										type: msg.appScreenType,
										data: msg.scoreData
									})
								}),
								msg.isStreaming && !msg.content && !msg.appScreenType && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 rounded-xl bg-white/80 p-3 border border-violet-100/80 shadow-2xs backdrop-blur-xs w-fit animate-in fade-in duration-200",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-violet-600 animate-bounce [animation-delay:-0.3s]" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-violet-400 animate-bounce [animation-delay:-0.15s]" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-pink-500 animate-bounce" })
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-medium text-slate-500",
										children: "Zio is analyzing fleet data..."
									})]
								}),
								msg.content && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormattedZioMessage, {
										content: msg.content,
										isFullscreen
									}), msg.isStreaming && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block w-1.5 h-4 ml-1 bg-gradient-to-b from-violet-600 to-pink-500 rounded-full animate-pulse align-middle" })]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] sm:text-xs text-muted-foreground px-1",
							children: [
								msg.role === "user" ? "You" : "Zio",
								" ·",
								" ",
								msg.timestamp.toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit"
								})
							]
						})]
					}, msg.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: messagesEndRef })]
				})
			}),
			!isHistoryOpen && (!isFullscreen || messages.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: cn("p-3 sm:p-4 pt-1 bg-transparent transition-all duration-300 ease-out shrink-0 z-10", isFullscreen && "p-6 pt-0 bg-transparent border-0"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("w-full mx-auto", isFullscreen ? "max-w-4xl" : "max-w-full"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("flex items-center gap-2 rounded-md bg-white/80 backdrop-blur-xs p-1.5 shadow-2xs border border-violet-100/80 focus-within:border-primary focus-within:bg-white focus-within:ring-1.5 focus-within:ring-primary/40"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: inputRef,
							type: "text",
							value: input,
							onChange: (e) => setInput(e.target.value),
							onKeyDown: handleKeyDown,
							disabled: isStreaming,
							placeholder: "Ask me ...",
							className: "flex-1 bg-transparent px-2.5 py-1 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleSend,
							disabled: !input.trim() || isStreaming,
							"aria-label": "Send message",
							className: cn("flex h-7.5 w-7.5 items-center justify-center rounded-md transition-colors cursor-pointer shadow-2xs shrink-0", input.trim() ? "bg-[#111c38] text-white hover:bg-[#0c1429]" : "bg-[#111c38] text-white opacity-80 cursor-not-allowed"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5 fill-white text-white" })
						})]
					})
				})
			})
		]
	});
}
//#endregion
export { ZioPanel as t };
