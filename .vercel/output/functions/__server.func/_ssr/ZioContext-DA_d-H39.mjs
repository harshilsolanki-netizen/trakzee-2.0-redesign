import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { o as fleetObjects } from "./fleet-D1U--QMf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ZioContext-DA_d-H39.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function getVehicleScoreData(v) {
	const hash = (s) => [...s].reduce((acc, c) => acc * 31 + c.charCodeAt(0) | 0, 7);
	const h = Math.abs(hash(v.id + v.name));
	const safety = 70 + h % 28;
	const efficiency = 75 + h * 3 % 23;
	const risk = Math.max(5, 35 - safety % 25);
	const discipline = 65 + h * 7 % 32;
	const confidence = 80 + h * 11 % 18;
	const overall = Math.round(safety * .35 + efficiency * .25 + discipline * .25 + (100 - risk) * .15);
	return {
		id: v.id,
		name: v.name,
		driver: v.driver ?? "Assigned Fleet Driver",
		branch: v.branch,
		speed: v.speed,
		overallScore: overall,
		safetyScore: safety,
		efficiencyScore: efficiency,
		riskScore: risk,
		disciplineScore: discipline,
		confidenceScore: confidence,
		drivingEvents: {
			overspeedCount: (v.speed > 80 ? 3 : 0) + h % 3,
			harshAccelCount: h % 4,
			harshBrakeCount: h % 3,
			dmsViolations: v.alerts > 0 ? v.alerts : h % 2,
			adasAlerts: h % 3
		}
	};
}
/** Dynamically parse question and attach matching Trakzee 2.0 application visual */
async function streamZioResponse(query, vehicle, onChunk) {
	const q = query.toLowerCase().trim();
	let fullResponse = "";
	let appScreenType = null;
	let scoreData = null;
	const foundVehicle = fleetObjects.find((v) => q.includes(v.name.toLowerCase()) || q.includes(v.id.toLowerCase()) || v.driver && q.includes(v.driver.toLowerCase()));
	const activeVehicle = foundVehicle ? getVehicleScoreData(foundVehicle) : vehicle;
	const grade = activeVehicle.overallScore >= 85 ? "A" : activeVehicle.overallScore >= 70 ? "B" : "C";
	if (q.includes("trip summary") || q.includes("trip report") || q.includes("top vehicle") || q.includes("odometer") || q.includes("mileage") || q.includes("trip details") || q.includes("trip") && (q.includes("dashboard") || q.includes("summary") || q.includes("show"))) {
		appScreenType = "trip-summary";
		fullResponse = "### 🚗 Trip Summary Report\n\nYour fleet completed **5,084.36 km** total running distance today across 133 active vehicle logs:\n\n- **Total Fleet Distance**: **5,084.36 km**.\n- **Fleet Average Distance**: **38.23 km** per vehicle.\n- **Top Distance Performer**: **HP Object 38** (Driver: *Suresh Patel*) with **181.90 km** (03h 42m running time).\n- **Runners Up**: **HP Object 31** (181.89 km) and **HP Object 45** (181.79 km).\n\n*You can click on any vehicle row in the table above to inspect its specific scorecard and telemetry.*";
	} else if (q.includes("driver safety distribution") || q.includes("safety distribution") || q.includes("score distribution") || q.includes("distribution") && q.includes("fleet") || q.includes("safety bands")) {
		appScreenType = "safety-distribution";
		fullResponse = "### 👥 Driver Safety Distribution Across Fleet\n\nAnalysis of **137 active fleet drivers** categorized across safety performance tiers:\n\n- 🟢 **Excellent Safety Band (91–100)**: **54 drivers (39.4%)** — zero harsh events, full DMS compliance.\n- 🔵 **Standard / Good Band (71–90)**: **62 drivers (45.3%)** — minor highway overspeeds, good pedal discipline.\n- 🔴 **Review Required (Below 70)**: **21 drivers (15.3%)** — flagged for corrective training on harsh braking and cabin fatigue alerts.\n\n*Safety Coaching Recommendation*: Prioritize 1-on-1 coaching for the 21 drivers in the review band to elevate overall fleet score above 90.";
	} else if (q.includes("where are my vehicles") || q.includes("where are") || q.includes("live tracking") || q.includes("map") || q.includes("live gps") || q.includes("locations") || q.includes("fleet status") || q.includes("gps")) {
		appScreenType = "fleet-map";
		fullResponse = "### 🗺️ Live GPS Fleet Tracking\n\nHere is the **Live Tracking Map** showing your fleet distribution across active operational hubs:\n\n- 🟢 **Running**: **44 vehicles** actively in transit with average cruising speed of 46 km/h.\n- 🔵 **Inactive**: **39 vehicles** with ignition OFF at designated depots and client yards.\n- 🟣 **No Data**: **50 vehicles** in offline/standby state.\n\nPrimary active hubs: **Bengaluru (South Hub), Salem Highway, Pune Depot, Panipat Refinery, and Haldia Petrochem**.\n\n*Click any marker on the map to view driver details and click 'Analyze Vehicle ↗' for in-depth scorecard telemetry.*";
	} else if (q.includes("today activity") || q.includes("activity timeline") || q.includes("activity") || q.includes("idle") || q.includes("stoppage") || q.includes("working hours")) {
		appScreenType = "today-activity";
		fullResponse = "### ⏱️ Today's Activity Timeline\n\nDaily operational activity breakdown across all active fleet assets:\n\n- 🟢 **Running Time**: **62%** (Avg 5h 20m per active vehicle).\n- 🟡 **Idle Duration**: **14%** (Avg 1h 12m engine idling at logistics checkpoints).\n- 🔴 **Stopped / Parked**: **24%** (Avg 2h 04m at loading bays and parking).\n\nIdle reduction recommendations have been generated for 4 high-idling routes to improve fleet fuel economy.";
	} else if (q.includes("overspeed") || q.includes("speed")) {
		appScreenType = "dashboard";
		fullResponse = "### ⚠️ Overspeeding Analysis\n\nToday, **7 overspeeding events** were captured across 5 vehicles:\n\n- Peak recorded speed: **88 km/h** on Suburban Delivery Zone (Speed Limit: 60 km/h).\n- Highest frequency vehicle: **MH12OP1616** (3 events).\n- Speeding duration accounted for only 1.8% of total drive time.\n\nAutomated audio speed alerts were dispatched to the affected vehicle in-cabin units.";
	} else if (q.includes("harsh") || q.includes("brak") || q.includes("decel")) {
		appScreenType = "dashboard";
		fullResponse = "### ⚠️ Harsh Deceleration Analysis\n\nToday, **12 harsh deceleration events** (>0.4g force) were logged across urban routes:\n\n- Primary cause: Sudden braking near signal intersections and unmapped speed bumps.\n- Top affected vehicle: **HP Object 38** (3 deceleration events).\n- Corrective action: Driver pedal modulation feedback has been scheduled.";
	} else if (q.includes("fatigue") || q.includes("dms") || q.includes("distraction")) {
		appScreenType = "dashboard";
		fullResponse = "### 👁️ DMS Driver Fatigue & Distraction\n\nThe in-cabin AI Driver Monitoring System logged **3 fatigue/distraction events** today:\n\n- **2 Inattention Events**: Driver gaze diversion detected while vehicle in motion (>3 seconds).\n- **1 Yawn/Micro-sleep Event**: Driver rested at next service station for 20 minutes.\n- All vehicles returned to active safe operating status.";
	} else if (q.includes("fleet dashboard") || q.includes("dashboard") || q.includes("executive") || q.includes("overview") || q.includes("kpi")) {
		appScreenType = "dashboard";
		fullResponse = "### 📊 Trakzee 2.0 Fleet Dashboard\n\nHere is your real-time **Executive Telematics Dashboard** for the entire fleet:\n\n- **Overall Fleet Score**: **86/100 (Grade A)** with **+1.2% positive trend** today.\n- **Fleet Operations**: **137 vehicles** registered (**44 Running**, **39 Inactive**, **50 No Data**).\n- **Driver Safety Distribution**: **54 drivers** in Excellent band (91-100), **62** in Good band (71-90), and **21** flagged for safety coaching.\n- **Active Telematics Alerts**: **24 total alerts** today (12 Harsh Deceleration, 7 Overspeeding, 3 DMS Driver Fatigue, 2 ADAS).\n\n*Tip: Click any metric card in the dashboard above to drill down into vehicle-specific logs.*";
	} else if (q.includes("safety") || q.includes("score") || q.includes("rating") || q.includes("risk") || q.includes("discipline") || q.includes("issue") || q.includes("improve") || foundVehicle !== void 0) {
		appScreenType = "vehicle-score";
		scoreData = activeVehicle;
		if (q.includes("why is the safety low") || q.includes("safety") && q.includes("low")) fullResponse = "### 🛡️ Safety Analysis for **" + activeVehicle.name + "**\n\n**Overall Rating**: **" + activeVehicle.overallScore + "/100** (Grade " + grade + ")\n- **Safety Rating**: **" + activeVehicle.safetyScore + "%**\n- **Efficiency Rating**: **" + activeVehicle.efficiencyScore + "%**\n- **Risk Index**: **" + activeVehicle.riskScore + "%**\n- **Discipline Index**: **" + activeVehicle.disciplineScore + "%**\n- **Confidence Metric**: **" + activeVehicle.confidenceScore + "%**\n\n**Contributing Factors**:\n1. **" + activeVehicle.drivingEvents.harshBrakeCount + " Harsh Deceleration Events**: Sudden braking spikes (>0.4g deceleration).\n2. **" + activeVehicle.drivingEvents.overspeedCount + " Speed Exceedances**: Traveled above 80 km/h threshold.\n3. **" + activeVehicle.drivingEvents.dmsViolations + " DMS Distraction Alerts**: In-cabin AI camera alerts.\n\nAssigned Driver: **" + activeVehicle.driver + "** · Branch: **" + activeVehicle.branch + "**";
		else if (q.includes("issue") || q.includes("biggest")) {
			const mainIssue = activeVehicle.drivingEvents.harshBrakeCount >= activeVehicle.drivingEvents.overspeedCount ? "**Harsh Deceleration Spikes** (" + activeVehicle.drivingEvents.harshBrakeCount + " incidents), contributing to ~" + activeVehicle.riskScore + "% risk index." : "**Speed Threshold Violations** (" + activeVehicle.drivingEvents.overspeedCount + " incidents), contributing to " + activeVehicle.riskScore + "% risk index.";
			fullResponse = "### ⚠️ Primary Issue for **" + activeVehicle.name + "**\n\n**Overall Rating**: **" + activeVehicle.overallScore + "/100** (Grade " + grade + ")\n- **Safety Rating**: **" + activeVehicle.safetyScore + "%**\n- **Efficiency Rating**: **" + activeVehicle.efficiencyScore + "%**\n- **Risk Index**: **" + activeVehicle.riskScore + "%**\n- **Discipline Index**: **" + activeVehicle.disciplineScore + "%**\n\nThe primary contributing factor is " + mainIssue + "\n\nImplementing progressive deceleration will raise the safety score from **" + activeVehicle.overallScore + "** to **" + Math.min(98, activeVehicle.overallScore + 10) + "/100**.";
		} else if (q.includes("improve") || q.includes("how to")) fullResponse = "### 📈 Score Improvement Roadmap for **" + activeVehicle.name + "**\n\n**Current Rating**: **" + activeVehicle.overallScore + "/100** (Grade " + grade + ")\n- **Safety Rating**: **" + activeVehicle.safetyScore + "%**\n- **Efficiency Rating**: **" + activeVehicle.efficiencyScore + "%**\n- **Risk Index**: **" + activeVehicle.riskScore + "%**\n- **Discipline Index**: **" + activeVehicle.disciplineScore + "%**\n\n**Recommendations to reach 95+ (Grade A+)**:\n- **Pedal Modulation**: Progressive braking to eliminate harsh decel spikes.\n- **Highway Speed Cap**: Maintain cruise speed under 80 km/h in suburban zones.\n- **DMS Compliance**: Continuous forward road focus during deliveries.";
		else fullResponse = "### 📊 Scorecard for **" + activeVehicle.name + "**\n\n**Overall Rating**: **" + activeVehicle.overallScore + "/100** (Grade " + grade + ")\n- **Safety Rating**: **" + activeVehicle.safetyScore + "%**\n- **Efficiency Rating**: **" + activeVehicle.efficiencyScore + "%**\n- **Risk Index**: **" + activeVehicle.riskScore + "%**\n- **Discipline Index**: **" + activeVehicle.disciplineScore + "%**\n- **Confidence Metric**: **" + activeVehicle.confidenceScore + "%**\n\nAssigned Driver: **" + activeVehicle.driver + "** · Branch: **" + activeVehicle.branch + "**";
	} else fullResponse = "### ⚡ Trakzee 2.0 Telematics Copilot\n\nConnected to **137 live fleet assets** with system health at **99.2%**.\n\n- **Live Operations**: 44 Running · 39 Inactive · 50 Offline\n- **Active Vehicle**: **" + vehicle.name + "** (*" + vehicle.driver + "*)\n\nYou can ask me to:\n- *'Show me the fleet dashboard'* to view executive KPI cards\n- *'Where are my vehicles right now?'* to view the live GPS map\n- *'Show me the trip summary with dashboard'* to inspect distance and route logs\n- *'Explain driver safety distribution across the fleet'* for driver tiers\n- *'Why is the Safety low?'* for driver score breakdown";
	await new Promise((r) => setTimeout(r, 260));
	if (appScreenType) {
		onChunk("", appScreenType, scoreData);
		await new Promise((r) => setTimeout(r, 180));
	}
	const tokens = fullResponse.match(/(\r?\n|[^\s\r\n]+|\s+)/g) || [fullResponse];
	let accumulated = "";
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		accumulated += token;
		onChunk(accumulated, appScreenType, scoreData);
		let delay = 18;
		if (token.includes("\n")) delay = 45;
		else if (/[.!?]$/.test(token)) delay = 60;
		else if (/[,;:]$/.test(token)) delay = 35;
		else if (token.length > 8) delay = 24;
		await new Promise((r) => setTimeout(r, delay));
	}
	onChunk(fullResponse, appScreenType, scoreData);
	return {
		content: fullResponse,
		appScreenType,
		scoreData
	};
}
var INITIAL_DEMO_SESSIONS = [
	{
		id: "session-sample-1",
		title: "Fleet Safety & Harsh Braking Analysis",
		createdAt: Date.now() - 72e5,
		updatedAt: Date.now() - 72e5,
		messages: [{
			id: "msg-s1-1",
			role: "user",
			content: "Why is the Safety score low for Volvo FH16?",
			timestamp: /* @__PURE__ */ new Date(Date.now() - 72e5)
		}, {
			id: "msg-s1-2",
			role: "assistant",
			content: "### ⚠️ Fleet Safety Analysis — Volvo FH16 (GJ-01-AB-1234)\n\nThe Safety Score for **Volvo FH16** is currently **68/100** (Needs Attention). Here is the breakdown:\n\n1. **Harsh Braking Incidents**: 6 events logged in the last 24h on the NH48 Highway corridor.\n2. **Night Driving**: 3.5 hours recorded past 11:00 PM.\n3. **Cornering G-Force**: Minor spike on hairpin turns near expressway exit.\n\n### 💡 Recommended Actions\n- Schedule a driver coaching review for harsh deceleration.\n- Inspect front brake caliper sensors during the upcoming 45,000 km maintenance service.",
			timestamp: /* @__PURE__ */ new Date(Date.now() - 72e5 + 3e3)
		}]
	},
	{
		id: "session-sample-2",
		title: "Trip Summary & Dashboard Diagnostics",
		createdAt: Date.now() - 864e5,
		updatedAt: Date.now() - 864e5,
		messages: [{
			id: "msg-s2-1",
			role: "user",
			content: "Show me the trip summary with dashboard",
			timestamp: /* @__PURE__ */ new Date(Date.now() - 864e5)
		}, {
			id: "msg-s2-2",
			role: "assistant",
			content: "Here is the interactive **Fleet Operations Summary** and real-time dashboard analytics for your active vehicles.",
			appScreenType: "trip_summary",
			timestamp: /* @__PURE__ */ new Date(Date.now() - 864e5 + 3e3)
		}]
	},
	{
		id: "session-sample-3",
		title: "Vehicle Live Telemetry & Locations",
		createdAt: Date.now() - 1728e5,
		updatedAt: Date.now() - 1728e5,
		messages: [{
			id: "msg-s3-1",
			role: "user",
			content: "Where are my vehicles right now?",
			timestamp: /* @__PURE__ */ new Date(Date.now() - 1728e5)
		}, {
			id: "msg-s3-2",
			role: "assistant",
			content: "All 12 fleet units are connected to GPS tracking. 8 are currently **En Route**, 3 are **Idling** at logistics hubs, and 1 is **Parked** in maintenance bay.",
			appScreenType: "live_tracking",
			timestamp: /* @__PURE__ */ new Date(Date.now() - 1728e5 + 3e3)
		}]
	}
];
var ZioContext = (0, import_react.createContext)(null);
function ZioProvider({ children }) {
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [isHistoryOpen, setIsHistoryOpen] = (0, import_react.useState)(false);
	const [mode, setModeState] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") try {
			const saved = localStorage.getItem("zio-preferred-mode-v4");
			if (saved === "floating" || saved === "sidebar" || saved === "fullscreen") return saved;
		} catch {}
		return "floating";
	});
	const [previousMode, setPreviousMode] = (0, import_react.useState)("sidebar");
	const [selectedVehicleId, setSelectedVehicleId] = (0, import_react.useState)(fleetObjects[0]?.id || "o1");
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [activeSessionId, setActiveSessionId] = (0, import_react.useState)(null);
	const [isStreaming, setIsStreaming] = (0, import_react.useState)(false);
	const [sessions, setSessions] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") try {
			const saved = localStorage.getItem("zio-chat-sessions-v6");
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed) && parsed.length > 0) return parsed.map((s) => ({
					...s,
					messages: s.messages.map((m) => ({
						...m,
						timestamp: new Date(m.timestamp)
					}))
				}));
			}
		} catch {}
		return INITIAL_DEMO_SESSIONS;
	});
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem("zio-chat-sessions-v6", JSON.stringify(sessions));
		} catch {}
	}, [sessions]);
	const selectedVehicle = (0, import_react.useMemo)(() => {
		return getVehicleScoreData(fleetObjects.find((o) => o.id === selectedVehicleId) || fleetObjects[0]);
	}, [selectedVehicleId]);
	const setMode = (0, import_react.useCallback)((newMode) => {
		setModeState((current) => {
			if (current !== "fullscreen" && newMode === "fullscreen") setPreviousMode(current);
			return newMode;
		});
		setIsOpen(true);
		try {
			localStorage.setItem("zio-preferred-mode-v4", newMode);
		} catch {}
	}, []);
	const toggleFullscreen = (0, import_react.useCallback)(() => {
		setModeState((current) => {
			if (current === "fullscreen") {
				const target = previousMode || "sidebar";
				try {
					localStorage.setItem("zio-preferred-mode-v4", target);
				} catch {}
				return target;
			} else {
				setPreviousMode(current);
				try {
					localStorage.setItem("zio-preferred-mode-v4", "fullscreen");
				} catch {}
				return "fullscreen";
			}
		});
		setIsOpen(true);
	}, [previousMode]);
	const openZio = (0, import_react.useCallback)((requestedMode) => {
		if (requestedMode) {
			setModeState((current) => {
				if (current !== "fullscreen" && requestedMode === "fullscreen") setPreviousMode(current);
				return requestedMode;
			});
			try {
				localStorage.setItem("zio-preferred-mode-v4", requestedMode);
			} catch {}
		}
		setIsOpen(true);
	}, []);
	const closeZio = (0, import_react.useCallback)(() => {
		setIsOpen(false);
	}, []);
	const toggleHistory = (0, import_react.useCallback)(() => {
		setIsHistoryOpen((prev) => !prev);
	}, []);
	const createNewChat = (0, import_react.useCallback)(() => {
		setActiveSessionId(null);
		setMessages([]);
		setIsHistoryOpen(false);
	}, []);
	const loadChatSession = (0, import_react.useCallback)((sessionId) => {
		const target = sessions.find((s) => s.id === sessionId);
		if (target) {
			setActiveSessionId(target.id);
			setMessages(target.messages);
			setIsHistoryOpen(false);
		}
	}, [sessions]);
	const deleteChatSession = (0, import_react.useCallback)((sessionId) => {
		setSessions((prev) => prev.filter((s) => s.id !== sessionId));
		if (activeSessionId === sessionId) {
			setActiveSessionId(null);
			setMessages([]);
		}
	}, [activeSessionId]);
	const clearAllHistory = (0, import_react.useCallback)(() => {
		setSessions([]);
		setActiveSessionId(null);
		setMessages([]);
	}, []);
	const clearMessages = (0, import_react.useCallback)(() => {
		setMessages([]);
		if (activeSessionId) setSessions((prev) => prev.map((s) => s.id === activeSessionId ? {
			...s,
			messages: [],
			updatedAt: Date.now()
		} : s));
	}, [activeSessionId]);
	const sendMessage = (0, import_react.useCallback)(async (text) => {
		if (!text.trim() || isStreaming) return;
		const userMsg = {
			id: "user-" + Date.now(),
			role: "user",
			content: text.trim(),
			timestamp: /* @__PURE__ */ new Date()
		};
		const assistantMsgId = "assistant-" + Date.now();
		const placeholderAssistantMsg = {
			id: assistantMsgId,
			role: "assistant",
			content: "",
			timestamp: /* @__PURE__ */ new Date(),
			isStreaming: true
		};
		const newMsgList = [
			...messages,
			userMsg,
			placeholderAssistantMsg
		];
		setMessages(newMsgList);
		setIsStreaming(true);
		let currentSessionId = activeSessionId;
		if (!currentSessionId) {
			currentSessionId = "session-" + Date.now();
			setActiveSessionId(currentSessionId);
			const rawTitle = text.trim().replace(/^###?\s*/, "");
			const formattedTitle = rawTitle.length > 38 ? rawTitle.slice(0, 38) + "..." : rawTitle;
			const newSession = {
				id: currentSessionId,
				title: formattedTitle,
				createdAt: Date.now(),
				updatedAt: Date.now(),
				messages: [userMsg, placeholderAssistantMsg]
			};
			setSessions((prev) => [newSession, ...prev]);
		}
		try {
			const result = await streamZioResponse(text, selectedVehicle, (chunk, appScreen, scoreData) => {
				setMessages((prev) => prev.map((m) => m.id === assistantMsgId ? {
					...m,
					content: chunk,
					appScreenType: appScreen,
					scoreData,
					isStreaming: true
				} : m));
			});
			const finalAssistantMsg = {
				id: assistantMsgId,
				role: "assistant",
				content: result.content,
				appScreenType: result.appScreenType,
				scoreData: result.scoreData,
				isStreaming: false,
				timestamp: /* @__PURE__ */ new Date()
			};
			setMessages((prev) => prev.map((m) => m.id === assistantMsgId ? finalAssistantMsg : m));
			if (currentSessionId) {
				const sid = currentSessionId;
				setSessions((prev) => prev.map((s) => {
					if (s.id === sid) {
						const existingWithoutStreaming = s.messages.filter((m) => m.id !== assistantMsgId && m.id !== userMsg.id);
						return {
							...s,
							updatedAt: Date.now(),
							messages: [
								...existingWithoutStreaming,
								userMsg,
								finalAssistantMsg
							]
						};
					}
					return s;
				}));
			}
		} catch (err) {
			const errorMsg = {
				id: assistantMsgId,
				role: "assistant",
				content: "Sorry, I encountered an issue retrieving the telemetry data. Please try again.",
				isStreaming: false,
				timestamp: /* @__PURE__ */ new Date()
			};
			setMessages((prev) => prev.map((m) => m.id === assistantMsgId ? errorMsg : m));
			if (currentSessionId) {
				const sid = currentSessionId;
				setSessions((prev) => prev.map((s) => {
					if (s.id === sid) {
						const existing = s.messages.filter((m) => m.id !== assistantMsgId && m.id !== userMsg.id);
						return {
							...s,
							updatedAt: Date.now(),
							messages: [
								...existing,
								userMsg,
								errorMsg
							]
						};
					}
					return s;
				}));
			}
		} finally {
			setIsStreaming(false);
		}
	}, [
		isStreaming,
		selectedVehicle,
		messages,
		activeSessionId
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZioContext.Provider, {
		value: {
			isOpen,
			mode,
			previousMode,
			messages,
			isStreaming,
			selectedVehicle,
			selectedVehicleId,
			setSelectedVehicleId,
			openZio,
			closeZio,
			setMode,
			toggleFullscreen,
			sendMessage,
			clearMessages,
			sessions,
			activeSessionId,
			isHistoryOpen,
			setIsHistoryOpen,
			toggleHistory,
			createNewChat,
			loadChatSession,
			deleteChatSession,
			clearAllHistory
		},
		children
	});
}
function useZio() {
	const ctx = (0, import_react.useContext)(ZioContext);
	if (!ctx) throw new Error("useZio must be used within a ZioProvider");
	return ctx;
}
//#endregion
export { useZio as n, ZioProvider as t };
