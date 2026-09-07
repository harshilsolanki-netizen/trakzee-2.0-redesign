import { fleetObjects, type FleetObject } from "@/data/fleet";
import { type ApplicationScreenType } from "@/components/zio/ApplicationScreenPreview";

export type VehicleScoreContext = {
  id: string;
  name: string;
  driver: string;
  branch: string;
  speed: number;
  overallScore: number;
  safetyScore: number;
  efficiencyScore: number;
  riskScore: number;
  disciplineScore: number;
  confidenceScore: number;
  drivingEvents: {
    overspeedCount: number;
    harshAccelCount: number;
    harshBrakeCount: number;
    dmsViolations: number;
    adasAlerts: number;
  };
};

export type ZioResponseResult = {
  content: string;
  appScreenType?: ApplicationScreenType | null | undefined;
  scoreData?: VehicleScoreContext | null | undefined;
};

export function getVehicleScoreData(v: FleetObject): VehicleScoreContext {
  const hash = (s: string) =>
    [...s].reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 7);
  const h = Math.abs(hash(v.id + v.name));

  const safety = 70 + (h % 28);
  const efficiency = 75 + ((h * 3) % 23);
  const risk = Math.max(5, 35 - (safety % 25));
  const discipline = 65 + ((h * 7) % 32);
  const confidence = 80 + ((h * 11) % 18);
  const overall = Math.round(
    safety * 0.35 + efficiency * 0.25 + discipline * 0.25 + (100 - risk) * 0.15,
  );

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
      overspeedCount: (v.speed > 80 ? 3 : 0) + (h % 3),
      harshAccelCount: h % 4,
      harshBrakeCount: h % 3,
      dmsViolations: v.alerts > 0 ? v.alerts : h % 2,
      adasAlerts: h % 3,
    },
  };
}

export function isScoreRelatedQuery(query: string): boolean {
  return true;
}

/** Dynamically parse question and attach matching Trakzee 2.0 application visual */
export async function streamZioResponse(
  query: string,
  vehicle: VehicleScoreContext,
  onChunk: (
    text: string,
    appScreen?: ApplicationScreenType | null,
    scoreData?: VehicleScoreContext | null,
  ) => void,
): Promise<ZioResponseResult> {
  const q = query.toLowerCase().trim();
  let fullResponse = "";
  let appScreenType: ApplicationScreenType | null = null;
  let scoreData: VehicleScoreContext | null = null;

  // Check if query specifically targets any known vehicle in fleet
  const foundVehicle = fleetObjects.find(
    (v) =>
      q.includes(v.name.toLowerCase()) ||
      q.includes(v.id.toLowerCase()) ||
      (v.driver && q.includes(v.driver.toLowerCase())),
  );
  const activeVehicle = foundVehicle
    ? getVehicleScoreData(foundVehicle)
    : vehicle;
  const grade =
    activeVehicle.overallScore >= 85
      ? "A"
      : activeVehicle.overallScore >= 70
        ? "B"
        : "C";

  // PRIORITY 1: Trip Summary / Trip Report / Mileage / Distance
  if (
    q.includes("trip summary") ||
    q.includes("trip report") ||
    q.includes("top vehicle") ||
    q.includes("odometer") ||
    q.includes("mileage") ||
    q.includes("trip details") ||
    (q.includes("trip") &&
      (q.includes("dashboard") || q.includes("summary") || q.includes("show")))
  ) {
    appScreenType = "trip-summary";
    fullResponse =
      "### 🚗 Trip Summary Report\n\n" +
      "Your fleet completed **5,084.36 km** total running distance today across 133 active vehicle logs:\n\n" +
      "- **Total Fleet Distance**: **5,084.36 km**.\n" +
      "- **Fleet Average Distance**: **38.23 km** per vehicle.\n" +
      "- **Top Distance Performer**: **HP Object 38** (Driver: *Suresh Patel*) with **181.90 km** (03h 42m running time).\n" +
      "- **Runners Up**: **HP Object 31** (181.89 km) and **HP Object 45** (181.79 km).\n\n" +
      "*You can click on any vehicle row in the table above to inspect its specific scorecard and telemetry.*";
  }
  // PRIORITY 2: Driver Safety Distribution across Fleet
  else if (
    q.includes("driver safety distribution") ||
    q.includes("safety distribution") ||
    q.includes("score distribution") ||
    (q.includes("distribution") && q.includes("fleet")) ||
    q.includes("safety bands")
  ) {
    appScreenType = "safety-distribution";
    fullResponse =
      "### 👥 Driver Safety Distribution Across Fleet\n\n" +
      "Analysis of **137 active fleet drivers** categorized across safety performance tiers:\n\n" +
      "- 🟢 **Excellent Safety Band (91–100)**: **54 drivers (39.4%)** — zero harsh events, full DMS compliance.\n" +
      "- 🔵 **Standard / Good Band (71–90)**: **62 drivers (45.3%)** — minor highway overspeeds, good pedal discipline.\n" +
      "- 🔴 **Review Required (Below 70)**: **21 drivers (15.3%)** — flagged for corrective training on harsh braking and cabin fatigue alerts.\n\n" +
      "*Safety Coaching Recommendation*: Prioritize 1-on-1 coaching for the 21 drivers in the review band to elevate overall fleet score above 90.";
  }
  // PRIORITY 3: Live Map / Where are vehicles / Tracking
  else if (
    q.includes("where are my vehicles") ||
    q.includes("where are") ||
    q.includes("live tracking") ||
    q.includes("map") ||
    q.includes("live gps") ||
    q.includes("locations") ||
    q.includes("fleet status") ||
    q.includes("gps")
  ) {
    appScreenType = "fleet-map";
    fullResponse =
      "### 🗺️ Live GPS Fleet Tracking\n\n" +
      "Here is the **Live Tracking Map** showing your fleet distribution across active operational hubs:\n\n" +
      "- 🟢 **Running**: **44 vehicles** actively in transit with average cruising speed of 46 km/h.\n" +
      "- 🔵 **Inactive**: **39 vehicles** with ignition OFF at designated depots and client yards.\n" +
      "- 🟣 **No Data**: **50 vehicles** in offline/standby state.\n\n" +
      "Primary active hubs: **Bengaluru (South Hub), Salem Highway, Pune Depot, Panipat Refinery, and Haldia Petrochem**.\n\n" +
      "*Click any marker on the map to view driver details and click 'Analyze Vehicle ↗' for in-depth scorecard telemetry.*";
  }
  // PRIORITY 4: Today Activity / Working Hours / Idling / Stoppage
  else if (
    q.includes("today activity") ||
    q.includes("activity timeline") ||
    q.includes("activity") ||
    q.includes("idle") ||
    q.includes("stoppage") ||
    q.includes("working hours")
  ) {
    appScreenType = "today-activity";
    fullResponse =
      "### ⏱️ Today's Activity Timeline\n\n" +
      "Daily operational activity breakdown across all active fleet assets:\n\n" +
      "- 🟢 **Running Time**: **62%** (Avg 5h 20m per active vehicle).\n" +
      "- 🟡 **Idle Duration**: **14%** (Avg 1h 12m engine idling at logistics checkpoints).\n" +
      "- 🔴 **Stopped / Parked**: **24%** (Avg 2h 04m at loading bays and parking).\n\n" +
      "Idle reduction recommendations have been generated for 4 high-idling routes to improve fleet fuel economy.";
  }
  // PRIORITY 5: Critical Telemetry (Overspeeding, Harsh Braking, DMS Fatigue)
  else if (q.includes("overspeed") || q.includes("speed")) {
    appScreenType = "dashboard";
    fullResponse =
      "### ⚠️ Overspeeding Analysis\n\n" +
      "Today, **7 overspeeding events** were captured across 5 vehicles:\n\n" +
      "- Peak recorded speed: **88 km/h** on Suburban Delivery Zone (Speed Limit: 60 km/h).\n" +
      "- Highest frequency vehicle: **MH12OP1616** (3 events).\n" +
      "- Speeding duration accounted for only 1.8% of total drive time.\n\n" +
      "Automated audio speed alerts were dispatched to the affected vehicle in-cabin units.";
  } else if (q.includes("harsh") || q.includes("brak") || q.includes("decel")) {
    appScreenType = "dashboard";
    fullResponse =
      "### ⚠️ Harsh Deceleration Analysis\n\n" +
      "Today, **12 harsh deceleration events** (>0.4g force) were logged across urban routes:\n\n" +
      "- Primary cause: Sudden braking near signal intersections and unmapped speed bumps.\n" +
      "- Top affected vehicle: **HP Object 38** (3 deceleration events).\n" +
      "- Corrective action: Driver pedal modulation feedback has been scheduled.";
  } else if (
    q.includes("fatigue") ||
    q.includes("dms") ||
    q.includes("distraction")
  ) {
    appScreenType = "dashboard";
    fullResponse =
      "### 👁️ DMS Driver Fatigue & Distraction\n\n" +
      "The in-cabin AI Driver Monitoring System logged **3 fatigue/distraction events** today:\n\n" +
      "- **2 Inattention Events**: Driver gaze diversion detected while vehicle in motion (>3 seconds).\n" +
      "- **1 Yawn/Micro-sleep Event**: Driver rested at next service station for 20 minutes.\n" +
      "- All vehicles returned to active safe operating status.";
  }
  // PRIORITY 6: Executive Dashboard / Fleet Overview / KPIs
  else if (
    q.includes("fleet dashboard") ||
    q.includes("dashboard") ||
    q.includes("executive") ||
    q.includes("overview") ||
    q.includes("kpi")
  ) {
    appScreenType = "dashboard";
    fullResponse =
      "### 📊 Trakzee 2.0 Fleet Dashboard\n\n" +
      "Here is your real-time **Executive Telematics Dashboard** for the entire fleet:\n\n" +
      "- **Overall Fleet Score**: **86/100 (Grade A)** with **+1.2% positive trend** today.\n" +
      "- **Fleet Operations**: **137 vehicles** registered (**44 Running**, **39 Inactive**, **50 No Data**).\n" +
      "- **Driver Safety Distribution**: **54 drivers** in Excellent band (91-100), **62** in Good band (71-90), and **21** flagged for safety coaching.\n" +
      "- **Active Telematics Alerts**: **24 total alerts** today (12 Harsh Deceleration, 7 Overspeeding, 3 DMS Driver Fatigue, 2 ADAS).\n\n" +
      "*Tip: Click any metric card in the dashboard above to drill down into vehicle-specific logs.*";
  }
  // PRIORITY 7: Vehicle Scorecard / Safety / Rating / Specific Vehicle
  else if (
    q.includes("safety") ||
    q.includes("score") ||
    q.includes("rating") ||
    q.includes("risk") ||
    q.includes("discipline") ||
    q.includes("issue") ||
    q.includes("improve") ||
    foundVehicle !== undefined
  ) {
    appScreenType = "vehicle-score";
    scoreData = activeVehicle;

    if (
      q.includes("why is the safety low") ||
      (q.includes("safety") && q.includes("low"))
    ) {
      fullResponse =
        "### 🛡️ Safety Analysis for **" +
        activeVehicle.name +
        "**\n\n" +
        "**Overall Rating**: **" +
        activeVehicle.overallScore +
        "/100** (Grade " +
        grade +
        ")\n" +
        "- **Safety Rating**: **" +
        activeVehicle.safetyScore +
        "%**\n" +
        "- **Efficiency Rating**: **" +
        activeVehicle.efficiencyScore +
        "%**\n" +
        "- **Risk Index**: **" +
        activeVehicle.riskScore +
        "%**\n" +
        "- **Discipline Index**: **" +
        activeVehicle.disciplineScore +
        "%**\n" +
        "- **Confidence Metric**: **" +
        activeVehicle.confidenceScore +
        "%**\n\n" +
        "**Contributing Factors**:\n" +
        "1. **" +
        activeVehicle.drivingEvents.harshBrakeCount +
        " Harsh Deceleration Events**: Sudden braking spikes (>0.4g deceleration).\n" +
        "2. **" +
        activeVehicle.drivingEvents.overspeedCount +
        " Speed Exceedances**: Traveled above 80 km/h threshold.\n" +
        "3. **" +
        activeVehicle.drivingEvents.dmsViolations +
        " DMS Distraction Alerts**: In-cabin AI camera alerts.\n\n" +
        "Assigned Driver: **" +
        activeVehicle.driver +
        "** · Branch: **" +
        activeVehicle.branch +
        "**";
    } else if (q.includes("issue") || q.includes("biggest")) {
      const mainIssue =
        activeVehicle.drivingEvents.harshBrakeCount >=
        activeVehicle.drivingEvents.overspeedCount
          ? "**Harsh Deceleration Spikes** (" +
            activeVehicle.drivingEvents.harshBrakeCount +
            " incidents), contributing to ~" +
            activeVehicle.riskScore +
            "% risk index."
          : "**Speed Threshold Violations** (" +
            activeVehicle.drivingEvents.overspeedCount +
            " incidents), contributing to " +
            activeVehicle.riskScore +
            "% risk index.";

      fullResponse =
        "### ⚠️ Primary Issue for **" +
        activeVehicle.name +
        "**\n\n" +
        "**Overall Rating**: **" +
        activeVehicle.overallScore +
        "/100** (Grade " +
        grade +
        ")\n" +
        "- **Safety Rating**: **" +
        activeVehicle.safetyScore +
        "%**\n" +
        "- **Efficiency Rating**: **" +
        activeVehicle.efficiencyScore +
        "%**\n" +
        "- **Risk Index**: **" +
        activeVehicle.riskScore +
        "%**\n" +
        "- **Discipline Index**: **" +
        activeVehicle.disciplineScore +
        "%**\n\n" +
        "The primary contributing factor is " +
        mainIssue +
        "\n\n" +
        "Implementing progressive deceleration will raise the safety score from **" +
        activeVehicle.overallScore +
        "** to **" +
        Math.min(98, activeVehicle.overallScore + 10) +
        "/100**.";
    } else if (q.includes("improve") || q.includes("how to")) {
      fullResponse =
        "### 📈 Score Improvement Roadmap for **" +
        activeVehicle.name +
        "**\n\n" +
        "**Current Rating**: **" +
        activeVehicle.overallScore +
        "/100** (Grade " +
        grade +
        ")\n" +
        "- **Safety Rating**: **" +
        activeVehicle.safetyScore +
        "%**\n" +
        "- **Efficiency Rating**: **" +
        activeVehicle.efficiencyScore +
        "%**\n" +
        "- **Risk Index**: **" +
        activeVehicle.riskScore +
        "%**\n" +
        "- **Discipline Index**: **" +
        activeVehicle.disciplineScore +
        "%**\n\n" +
        "**Recommendations to reach 95+ (Grade A+)**:\n" +
        "- **Pedal Modulation**: Progressive braking to eliminate harsh decel spikes.\n" +
        "- **Highway Speed Cap**: Maintain cruise speed under 80 km/h in suburban zones.\n" +
        "- **DMS Compliance**: Continuous forward road focus during deliveries.";
    } else {
      fullResponse =
        "### 📊 Scorecard for **" +
        activeVehicle.name +
        "**\n\n" +
        "**Overall Rating**: **" +
        activeVehicle.overallScore +
        "/100** (Grade " +
        grade +
        ")\n" +
        "- **Safety Rating**: **" +
        activeVehicle.safetyScore +
        "%**\n" +
        "- **Efficiency Rating**: **" +
        activeVehicle.efficiencyScore +
        "%**\n" +
        "- **Risk Index**: **" +
        activeVehicle.riskScore +
        "%**\n" +
        "- **Discipline Index**: **" +
        activeVehicle.disciplineScore +
        "%**\n" +
        "- **Confidence Metric**: **" +
        activeVehicle.confidenceScore +
        "%**\n\n" +
        "Assigned Driver: **" +
        activeVehicle.driver +
        "** · Branch: **" +
        activeVehicle.branch +
        "**";
    }
  }
  // PRIORITY 8: Fallback Question
  else {
    fullResponse =
      "### ⚡ Trakzee 2.0 Telematics Copilot\n\n" +
      "Connected to **137 live fleet assets** with system health at **99.2%**.\n\n" +
      "- **Live Operations**: 44 Running · 39 Inactive · 50 Offline\n" +
      "- **Active Vehicle**: **" +
      vehicle.name +
      "** (*" +
      vehicle.driver +
      "*)\n\n" +
      "You can ask me to:\n" +
      "- *'Show me the fleet dashboard'* to view executive KPI cards\n" +
      "- *'Where are my vehicles right now?'* to view the live GPS map\n" +
      "- *'Show me the trip summary with dashboard'* to inspect distance and route logs\n" +
      "- *'Explain driver safety distribution across the fleet'* for driver tiers\n" +
      "- *'Why is the Safety low?'* for driver score breakdown";
  }

  // 1. Brief initial thinking pause
  await new Promise((r) => setTimeout(r, 260));

  // 2. Reveal application screen first if present
  if (appScreenType) {
    onChunk("", appScreenType, scoreData);
    await new Promise((r) => setTimeout(r, 180));
  }

  // 3. Smooth word-by-word & token typewriter streaming
  const tokens = fullResponse.match(/(\r?\n|[^\s\r\n]+|\s+)/g) || [
    fullResponse,
  ];
  let accumulated = "";

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!;
    accumulated += token;
    onChunk(accumulated, appScreenType, scoreData);

    // Natural typing cadence
    let delay = 18;
    if (token.includes("\n")) {
      delay = 45;
    } else if (/[.!?]$/.test(token)) {
      delay = 60;
    } else if (/[,;:]$/.test(token)) {
      delay = 35;
    } else if (token.length > 8) {
      delay = 24;
    }
    await new Promise((r) => setTimeout(r, delay));
  }

  onChunk(fullResponse, appScreenType, scoreData);

  return {
    content: fullResponse,
    appScreenType,
    scoreData,
  };
}
