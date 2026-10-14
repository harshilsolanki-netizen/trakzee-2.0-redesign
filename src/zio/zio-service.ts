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

let travelReportMode: "summary" | "history" = "summary";

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

  // ── COMPANY WALKTHROUGH & GUIDANCE ──
  const isCompanyQuery =
    q.includes("company") &&
    (q.includes("create") ||
      q.includes("add") ||
      q.includes("how") ||
      q.includes("new") ||
      q.includes("account") ||
      q.includes("walkthrough"));

  if (isCompanyQuery) {
    appScreenType = "company-walkthrough";
    fullResponse =
      "### 🏢 Create a Company Account\n\n" +
      "A company account is created under a reseller and is managed by a Reseller or Admin:\n\n" +
      "1. Log in and open **Settings → General → Company**.\n" +
      "2. Click the **+ Company** button.\n" +
      "3. On **My Account**, pick the reseller.\n" +
      "4. Select the country, state, district and RTO division, then add the short name.\n" +
      "5. Enter the username (email address) and choose credential delivery (Email or SMS).\n" +
      "6. Set password meeting security compliance.\n" +
      "7. Add contact details and data storage period (90 days).\n" +
      "8. Review Rule and User Settings tabs.\n" +
      "9. Click **Save** to commit the new company account.\n\n" +
      "💡 *Follow the interactive step-by-step walkthrough above to view the animated guidance!*";
  }
  // ── ADD OBJECT / VEHICLE WALKTHROUGH & GUIDANCE ──
  else if (
    (q.includes("add") &&
      (q.includes("vehicle") ||
        q.includes("object") ||
        q.includes("car") ||
        q.includes("truck") ||
        q.includes("asset") ||
        q.includes("fleet") ||
        q.includes("device") ||
        q.includes("how"))) ||
    (q.includes("create") &&
      (q.includes("vehicle") ||
        q.includes("object") ||
        q.includes("asset"))) ||
    (q.includes("new") &&
      (q.includes("vehicle") ||
        q.includes("object") ||
        q.includes("asset"))) ||
    q.includes("how to add") ||
    q.includes("how do i add") ||
    q.includes("how can i add") ||
    q.includes("i want to add") ||
    q.includes("want to add") ||
    q.includes("walkthrough") ||
    q.includes("guidence") ||
    q.includes("guidance") ||
    q.includes("tour") ||
    (q.includes("how") && (q.includes("vehicle") || q.includes("object")))
  ) {
    appScreenType = "add-object-walkthrough";
    fullResponse =
      "### 🚗 How to Add an Object / Vehicle in Trakzee 2.0\n\n" +
      "There are **two ways** to add and configure an object in your fleet:\n\n" +
      "1. **From Live Tracking (Fleet Explorer Panel)**:\n" +
      "   - Open **Live Tracking** from the left navigation bar.\n" +
      "   - In the Fleet Explorer toolbar, click the **+ Object** button.\n" +
      "   - An enrollment overlay modal opens directly over the map. Enter the **Vehicle Registration No.**, **Device IMEI**, and select the **Vehicle Type**.\n" +
      "   - Click **Save Object** to immediately track the vehicle on the live map.\n\n" +
      "2. **From Settings Console**:\n" +
      "   - Click **Settings** in the main sidebar.\n" +
      "   - Select **General → Object** configuration.\n" +
      "   - Click the blue **+ Object** button in the table header.\n" +
      "   - Enter detailed specifications (IMEI, Device Model, Group/Branch, Driver assignment, and Fuel sensor calibration).\n" +
      "   - Click **Save Object** to finalize enterprise onboarding.\n\n" +
      "✨ *Follow the interactive step-by-step walkthrough above to view the animated cursor guidance and modal overlay!*";
  }
  // ── TRAVEL REPORT CONVERSATIONAL PLAYBOOK ──
  // PRIORITY 0a-Travel: Step 3 Answered or Skip -> Generate Final Travel Report (Summary or History)
  else if (
    q.includes("today [13-10-2026") ||
    q.includes("yesterday (full 24 hours)") ||
    q.includes("last 7 days weekly overview") ||
    q.includes("show travel summary") ||
    q.includes("show travel history") ||
    q.includes("generate travel summary") ||
    q.includes("generate travel history") ||
    (q.includes("skip questions") && q.includes("travel"))
  ) {
    if (q.includes("history") || travelReportMode === "history") {
      appScreenType = "travel-history";
      fullResponse =
        "### 🗺️ Travel History Report [13-10-2026 12:00 AM – 09:48 AM]\n\n" +
        "Generated the interactive **Travel History Report** showing segment-by-segment vehicle trip logs:\n\n" +
        "- **Total Fleet Duration**: **146:59:21** aggregated across 690 trip legs.\n" +
        "- **Running Time**: **25:47:11** in transit with normal highway speed profiles.\n" +
        "- **Idle Duration**: **00:14:25** at traffic signals and depot turnarounds.\n" +
        "- **Stoppage Duration**: **120:57:45** at designated parking yards and delivery bays.\n" +
        "- **Safety Alerts**: **29.0 total alerts** captured across all trip segments.\n\n" +
        "*Tip: Click the ⚡ lightning bolt icon in any row to inspect the interactive route map for that specific trip leg.*";
    } else {
      appScreenType = "travel-summary";
      fullResponse =
        "### 🚗 Travel Summary Report [13-10-2026 12:00 AM – 09:44 AM]\n\n" +
        "Generated the interactive **Travel Summary Report** across **13 operational fleet vehicles**:\n\n" +
        "- **Total Fleet Distance**: **3,617.61 km** covered across Thailand, Valsad, and Indonesia branches.\n" +
        "- **Top Mileage Asset**: **SOC - 130002** (**527.76 km**, 09h 43m running, Thailand Branch).\n" +
        "- **Time Utilization**: **80% Running (116:06:00)** vs **20% Stopped (29:16:00)**.\n" +
        "- **Engine Idling**: **00:37:00** total idling time across 317 recorded idle events.\n" +
        "- **Active Alerts**: **29 total alerts** logged during shift operations.\n\n" +
        "*You can filter by company or branch, review route playbacks using ▶ buttons, or export to XLS/PDF/CSV using the controls above.*";
    }
  }
  // PRIORITY 0b-Travel: Step 2 Answered -> Question 3 of 3 (Which time range should I analyze?)
  else if (
    q.includes("all 13 vehicles") ||
    q.includes("thailand branch (4 vehicles)") ||
    q.includes("valsad branch (2 vehicles)") ||
    q.includes("indonesia branch (3 vehicles)") ||
    (q.includes("13 vehicles") && !q.includes("fuel"))
  ) {
    appScreenType = "travel-question-3";
    fullResponse = "";
  }
  // PRIORITY 0c-Travel: Step 1 Answered -> Question 2 of 3 (Which vehicles should I include?)
  else if (
    q.includes("travel summary report") ||
    q.includes("travel history report") ||
    q.includes("driver activity & work hours")
  ) {
    if (q.includes("history")) {
      travelReportMode = "history";
    } else {
      travelReportMode = "summary";
    }
    appScreenType = "travel-question-2";
    fullResponse = "";
  }
  // PRIORITY 0d-Travel: Initial Travel Query -> Question 1 of 3 (Which travel report do you need?)
  else if (
    q.includes("travel report") ||
    q.includes("travel summary") ||
    q.includes("travel history") ||
    q.includes("travel")
  ) {
    if (q.includes("history")) {
      travelReportMode = "history";
    } else {
      travelReportMode = "summary";
    }
    appScreenType = "travel-question-1";
    fullResponse = "";
  }
  // ── FUEL REPORT CONVERSATIONAL PLAYBOOK ──
  // PRIORITY 0a-Fuel: Step 3 Answered -> Generate Final Fuel Report
  else if (
    q.includes("today included") ||
    q.includes("full days only") ||
    q.includes("this month so far") ||
    q.includes("28 sep to 12 oct") ||
    q.includes("27 sep to 11 oct") ||
    q.includes("1 oct to 12 oct") ||
    (q.includes("skip questions") && !q.includes("travel")) ||
    (q.includes("recommended answers") && !q.includes("travel")) ||
    q.includes("generate report") ||
    q.includes("generate fill-drain")
  ) {
    appScreenType = "fuel-report";
    fullResponse =
      "### ⛽ Fill-Drain Fuel Telemetry Report (Last 15 Days)\n\n" +
      "Generated the interactive **Fill-Drain Fuel Report** covering **Sep 30 – Oct 14, 2026** (15 completed days) for your fleet:\n\n" +
      "- **Total Distance Covered**: **5,744.38 km** across 9 logged commercial assets.\n" +
      "- **Total Fuel Consumed**: **4,409.85 L** (Running: 4,408.87 L | Idling: 2.64 L).\n" +
      "- **Refills Detected (Fills)**: **2 refill events** totaling **4,385.90 L** (Bulk refuels detected on asset `Fuel - 12393` in Valsad Branch).\n" +
      "- **Theft / Drain Anomaly**: **0.00 L** — No sudden fuel level drops while ignition OFF detected across all sensors.\n\n" +
      "*You can filter by branch, toggle refill events, or export to Excel/PDF using the controls in the report above.*";
  }
  // PRIORITY 0b-Fuel: Step 2 Answered -> Question 3 of 3 (Should today be included?)
  else if (
    q.includes("all 9 vehicles") ||
    q.includes("all vehicles") ||
    q.includes("indonesia branch") ||
    q.includes("thailand branch") ||
    q.includes("valsad branch") ||
    q.includes("every vehicle")
  ) {
    appScreenType = "fuel-question-3";
    fullResponse = "";
  }
  // PRIORITY 0c-Fuel: Step 1 Answered -> Question 2 of 3 (Which vehicles should I include?)
  else if (
    q.includes("fill-drain report") ||
    q.includes("fuel consumption report") ||
    q.includes("fuel cost report") ||
    q.includes("fill-drain") ||
    q.includes("fill drain")
  ) {
    appScreenType = "fuel-question-2";
    fullResponse = "";
  }
  // PRIORITY 0d-Fuel: Initial Fuel Report Query -> Question 1 of 3 (Which fuel report do you need?)
  else if (
    q.includes("fuel report") ||
    q.includes("fuel") ||
    q.includes("refill") ||
    q.includes("drain") ||
    q.includes("diesel") ||
    q.includes("petrol") ||
    (q.includes("15 days") && (q.includes("report") || q.includes("fuel")))
  ) {
    appScreenType = "fuel-question-1";
    fullResponse = "";
  }
  // PRIORITY 1: Trip Summary / Trip Report / Mileage / Distance
  else if (
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
