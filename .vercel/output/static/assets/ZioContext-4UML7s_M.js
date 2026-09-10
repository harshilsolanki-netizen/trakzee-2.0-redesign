import{a as e,c as t,r as n}from"./utils-BDRr8poQ.js";import{n as r}from"./x-B4JrkUkn.js";import{o as i}from"./fleet-BtsWLabf.js";var a=r(`map-pin`,[[`path`,{d:`M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0`,key:`1r0f0z`}],[`circle`,{cx:`12`,cy:`10`,r:`3`,key:`ilqhr7`}]]),o=t(e(),1);function s(e){let t=Math.abs((e=>[...e].reduce((e,t)=>e*31+t.charCodeAt(0)|0,7))(e.id+e.name)),n=70+t%28,r=75+t*3%23,i=Math.max(5,35-n%25),a=65+t*7%32,o=80+t*11%18,s=Math.round(n*.35+r*.25+a*.25+(100-i)*.15);return{id:e.id,name:e.name,driver:e.driver??`Assigned Fleet Driver`,branch:e.branch,speed:e.speed,overallScore:s,safetyScore:n,efficiencyScore:r,riskScore:i,disciplineScore:a,confidenceScore:o,drivingEvents:{overspeedCount:(e.speed>80?3:0)+t%3,harshAccelCount:t%4,harshBrakeCount:t%3,dmsViolations:e.alerts>0?e.alerts:t%2,adasAlerts:t%3}}}async function c(e,t,n){let r=e.toLowerCase().trim(),a=``,o=null,c=null,l=i.find(e=>r.includes(e.name.toLowerCase())||r.includes(e.id.toLowerCase())||e.driver&&r.includes(e.driver.toLowerCase())),u=l?s(l):t,d=u.overallScore>=85?`A`:u.overallScore>=70?`B`:`C`;if(r.includes(`trip summary`)||r.includes(`trip report`)||r.includes(`top vehicle`)||r.includes(`odometer`)||r.includes(`mileage`)||r.includes(`trip details`)||r.includes(`trip`)&&(r.includes(`dashboard`)||r.includes(`summary`)||r.includes(`show`)))o=`trip-summary`,a=`### 🚗 Trip Summary Report

Your fleet completed **5,084.36 km** total running distance today across 133 active vehicle logs:

- **Total Fleet Distance**: **5,084.36 km**.
- **Fleet Average Distance**: **38.23 km** per vehicle.
- **Top Distance Performer**: **HP Object 38** (Driver: *Suresh Patel*) with **181.90 km** (03h 42m running time).
- **Runners Up**: **HP Object 31** (181.89 km) and **HP Object 45** (181.79 km).

*You can click on any vehicle row in the table above to inspect its specific scorecard and telemetry.*`;else if(r.includes(`driver safety distribution`)||r.includes(`safety distribution`)||r.includes(`score distribution`)||r.includes(`distribution`)&&r.includes(`fleet`)||r.includes(`safety bands`))o=`safety-distribution`,a=`### 👥 Driver Safety Distribution Across Fleet

Analysis of **137 active fleet drivers** categorized across safety performance tiers:

- 🟢 **Excellent Safety Band (91–100)**: **54 drivers (39.4%)** — zero harsh events, full DMS compliance.
- 🔵 **Standard / Good Band (71–90)**: **62 drivers (45.3%)** — minor highway overspeeds, good pedal discipline.
- 🔴 **Review Required (Below 70)**: **21 drivers (15.3%)** — flagged for corrective training on harsh braking and cabin fatigue alerts.

*Safety Coaching Recommendation*: Prioritize 1-on-1 coaching for the 21 drivers in the review band to elevate overall fleet score above 90.`;else if(r.includes(`where are my vehicles`)||r.includes(`where are`)||r.includes(`live tracking`)||r.includes(`map`)||r.includes(`live gps`)||r.includes(`locations`)||r.includes(`fleet status`)||r.includes(`gps`))o=`fleet-map`,a=`### 🗺️ Live GPS Fleet Tracking

Here is the **Live Tracking Map** showing your fleet distribution across active operational hubs:

- 🟢 **Running**: **44 vehicles** actively in transit with average cruising speed of 46 km/h.
- 🔵 **Inactive**: **39 vehicles** with ignition OFF at designated depots and client yards.
- 🟣 **No Data**: **50 vehicles** in offline/standby state.

Primary active hubs: **Bengaluru (South Hub), Salem Highway, Pune Depot, Panipat Refinery, and Haldia Petrochem**.

*Click any marker on the map to view driver details and click 'Analyze Vehicle ↗' for in-depth scorecard telemetry.*`;else if(r.includes(`today activity`)||r.includes(`activity timeline`)||r.includes(`activity`)||r.includes(`idle`)||r.includes(`stoppage`)||r.includes(`working hours`))o=`today-activity`,a=`### ⏱️ Today's Activity Timeline

Daily operational activity breakdown across all active fleet assets:

- 🟢 **Running Time**: **62%** (Avg 5h 20m per active vehicle).
- 🟡 **Idle Duration**: **14%** (Avg 1h 12m engine idling at logistics checkpoints).
- 🔴 **Stopped / Parked**: **24%** (Avg 2h 04m at loading bays and parking).

Idle reduction recommendations have been generated for 4 high-idling routes to improve fleet fuel economy.`;else if(r.includes(`overspeed`)||r.includes(`speed`))o=`dashboard`,a=`### ⚠️ Overspeeding Analysis

Today, **7 overspeeding events** were captured across 5 vehicles:

- Peak recorded speed: **88 km/h** on Suburban Delivery Zone (Speed Limit: 60 km/h).
- Highest frequency vehicle: **MH12OP1616** (3 events).
- Speeding duration accounted for only 1.8% of total drive time.

Automated audio speed alerts were dispatched to the affected vehicle in-cabin units.`;else if(r.includes(`harsh`)||r.includes(`brak`)||r.includes(`decel`))o=`dashboard`,a=`### ⚠️ Harsh Deceleration Analysis

Today, **12 harsh deceleration events** (>0.4g force) were logged across urban routes:

- Primary cause: Sudden braking near signal intersections and unmapped speed bumps.
- Top affected vehicle: **HP Object 38** (3 deceleration events).
- Corrective action: Driver pedal modulation feedback has been scheduled.`;else if(r.includes(`fatigue`)||r.includes(`dms`)||r.includes(`distraction`))o=`dashboard`,a=`### 👁️ DMS Driver Fatigue & Distraction

The in-cabin AI Driver Monitoring System logged **3 fatigue/distraction events** today:

- **2 Inattention Events**: Driver gaze diversion detected while vehicle in motion (>3 seconds).
- **1 Yawn/Micro-sleep Event**: Driver rested at next service station for 20 minutes.
- All vehicles returned to active safe operating status.`;else if(r.includes(`fleet dashboard`)||r.includes(`dashboard`)||r.includes(`executive`)||r.includes(`overview`)||r.includes(`kpi`))o=`dashboard`,a=`### 📊 Trakzee 2.0 Fleet Dashboard

Here is your real-time **Executive Telematics Dashboard** for the entire fleet:

- **Overall Fleet Score**: **86/100 (Grade A)** with **+1.2% positive trend** today.
- **Fleet Operations**: **137 vehicles** registered (**44 Running**, **39 Inactive**, **50 No Data**).
- **Driver Safety Distribution**: **54 drivers** in Excellent band (91-100), **62** in Good band (71-90), and **21** flagged for safety coaching.
- **Active Telematics Alerts**: **24 total alerts** today (12 Harsh Deceleration, 7 Overspeeding, 3 DMS Driver Fatigue, 2 ADAS).

*Tip: Click any metric card in the dashboard above to drill down into vehicle-specific logs.*`;else if(r.includes(`safety`)||r.includes(`score`)||r.includes(`rating`)||r.includes(`risk`)||r.includes(`discipline`)||r.includes(`issue`)||r.includes(`improve`)||l!==void 0)if(o=`vehicle-score`,c=u,r.includes(`why is the safety low`)||r.includes(`safety`)&&r.includes(`low`))a=`### 🛡️ Safety Analysis for **`+u.name+`**

**Overall Rating**: **`+u.overallScore+`/100** (Grade `+d+`)
- **Safety Rating**: **`+u.safetyScore+`%**
- **Efficiency Rating**: **`+u.efficiencyScore+`%**
- **Risk Index**: **`+u.riskScore+`%**
- **Discipline Index**: **`+u.disciplineScore+`%**
- **Confidence Metric**: **`+u.confidenceScore+`%**

**Contributing Factors**:
1. **`+u.drivingEvents.harshBrakeCount+` Harsh Deceleration Events**: Sudden braking spikes (>0.4g deceleration).
2. **`+u.drivingEvents.overspeedCount+` Speed Exceedances**: Traveled above 80 km/h threshold.
3. **`+u.drivingEvents.dmsViolations+` DMS Distraction Alerts**: In-cabin AI camera alerts.

Assigned Driver: **`+u.driver+`** · Branch: **`+u.branch+`**`;else if(r.includes(`issue`)||r.includes(`biggest`)){let e=u.drivingEvents.harshBrakeCount>=u.drivingEvents.overspeedCount?`**Harsh Deceleration Spikes** (`+u.drivingEvents.harshBrakeCount+` incidents), contributing to ~`+u.riskScore+`% risk index.`:`**Speed Threshold Violations** (`+u.drivingEvents.overspeedCount+` incidents), contributing to `+u.riskScore+`% risk index.`;a=`### ⚠️ Primary Issue for **`+u.name+`**

**Overall Rating**: **`+u.overallScore+`/100** (Grade `+d+`)
- **Safety Rating**: **`+u.safetyScore+`%**
- **Efficiency Rating**: **`+u.efficiencyScore+`%**
- **Risk Index**: **`+u.riskScore+`%**
- **Discipline Index**: **`+u.disciplineScore+`%**

The primary contributing factor is `+e+`

Implementing progressive deceleration will raise the safety score from **`+u.overallScore+`** to **`+Math.min(98,u.overallScore+10)+`/100**.`}else a=r.includes(`improve`)||r.includes(`how to`)?`### 📈 Score Improvement Roadmap for **`+u.name+`**

**Current Rating**: **`+u.overallScore+`/100** (Grade `+d+`)
- **Safety Rating**: **`+u.safetyScore+`%**
- **Efficiency Rating**: **`+u.efficiencyScore+`%**
- **Risk Index**: **`+u.riskScore+`%**
- **Discipline Index**: **`+u.disciplineScore+`%**

**Recommendations to reach 95+ (Grade A+)**:
- **Pedal Modulation**: Progressive braking to eliminate harsh decel spikes.
- **Highway Speed Cap**: Maintain cruise speed under 80 km/h in suburban zones.
- **DMS Compliance**: Continuous forward road focus during deliveries.`:`### 📊 Scorecard for **`+u.name+`**

**Overall Rating**: **`+u.overallScore+`/100** (Grade `+d+`)
- **Safety Rating**: **`+u.safetyScore+`%**
- **Efficiency Rating**: **`+u.efficiencyScore+`%**
- **Risk Index**: **`+u.riskScore+`%**
- **Discipline Index**: **`+u.disciplineScore+`%**
- **Confidence Metric**: **`+u.confidenceScore+`%**

Assigned Driver: **`+u.driver+`** · Branch: **`+u.branch+`**`;else a=`### ⚡ Trakzee 2.0 Telematics Copilot

Connected to **137 live fleet assets** with system health at **99.2%**.

- **Live Operations**: 44 Running · 39 Inactive · 50 Offline
- **Active Vehicle**: **`+t.name+`** (*`+t.driver+`*)

You can ask me to:
- *'Show me the fleet dashboard'* to view executive KPI cards
- *'Where are my vehicles right now?'* to view the live GPS map
- *'Show me the trip summary with dashboard'* to inspect distance and route logs
- *'Explain driver safety distribution across the fleet'* for driver tiers
- *'Why is the Safety low?'* for driver score breakdown`;await new Promise(e=>setTimeout(e,260)),o&&(n(``,o,c),await new Promise(e=>setTimeout(e,180)));let f=a.match(/(\r?\n|[^\s\r\n]+|\s+)/g)||[a],p=``;for(let e=0;e<f.length;e++){let t=f[e];p+=t,n(p,o,c);let r=18;t.includes(`
`)?r=45:/[.!?]$/.test(t)?r=60:/[,;:]$/.test(t)?r=35:t.length>8&&(r=24),await new Promise(e=>setTimeout(e,r))}return n(a,o,c),{content:a,appScreenType:o,scoreData:c}}var l=n(),u=[{id:`session-sample-1`,title:`Fleet Safety & Harsh Braking Analysis`,createdAt:Date.now()-72e5,updatedAt:Date.now()-72e5,messages:[{id:`msg-s1-1`,role:`user`,content:`Why is the Safety score low for Volvo FH16?`,timestamp:new Date(Date.now()-72e5)},{id:`msg-s1-2`,role:`assistant`,content:`### ⚠️ Fleet Safety Analysis — Volvo FH16 (GJ-01-AB-1234)

The Safety Score for **Volvo FH16** is currently **68/100** (Needs Attention). Here is the breakdown:

1. **Harsh Braking Incidents**: 6 events logged in the last 24h on the NH48 Highway corridor.
2. **Night Driving**: 3.5 hours recorded past 11:00 PM.
3. **Cornering G-Force**: Minor spike on hairpin turns near expressway exit.

### 💡 Recommended Actions
- Schedule a driver coaching review for harsh deceleration.
- Inspect front brake caliper sensors during the upcoming 45,000 km maintenance service.`,timestamp:new Date(Date.now()-72e5+3e3)}]},{id:`session-sample-2`,title:`Trip Summary & Dashboard Diagnostics`,createdAt:Date.now()-864e5,updatedAt:Date.now()-864e5,messages:[{id:`msg-s2-1`,role:`user`,content:`Show me the trip summary with dashboard`,timestamp:new Date(Date.now()-864e5)},{id:`msg-s2-2`,role:`assistant`,content:`Here is the interactive **Fleet Operations Summary** and real-time dashboard analytics for your active vehicles.`,appScreenType:`trip_summary`,timestamp:new Date(Date.now()-864e5+3e3)}]},{id:`session-sample-3`,title:`Vehicle Live Telemetry & Locations`,createdAt:Date.now()-1728e5,updatedAt:Date.now()-1728e5,messages:[{id:`msg-s3-1`,role:`user`,content:`Where are my vehicles right now?`,timestamp:new Date(Date.now()-1728e5)},{id:`msg-s3-2`,role:`assistant`,content:`All 12 fleet units are connected to GPS tracking. 8 are currently **En Route**, 3 are **Idling** at logistics hubs, and 1 is **Parked** in maintenance bay.`,appScreenType:`live_tracking`,timestamp:new Date(Date.now()-1728e5+3e3)}]}],d=(0,o.createContext)(null);function f({children:e}){let[t,n]=(0,o.useState)(!1),[r,a]=(0,o.useState)(!1),[f,p]=(0,o.useState)(()=>{if(typeof window<`u`)try{let e=localStorage.getItem(`zio-preferred-mode-v4`);if(e===`floating`||e===`sidebar`||e===`fullscreen`)return e}catch{}return`floating`}),[m,h]=(0,o.useState)(`sidebar`),[g,_]=(0,o.useState)(i[0]?.id||`o1`),[v,y]=(0,o.useState)([]),[b,x]=(0,o.useState)(null),[S,C]=(0,o.useState)(!1),[w,T]=(0,o.useState)(()=>{if(typeof window<`u`)try{let e=localStorage.getItem(`zio-chat-sessions-v6`);if(e){let t=JSON.parse(e);if(Array.isArray(t)&&t.length>0)return t.map(e=>({...e,messages:e.messages.map(e=>({...e,timestamp:new Date(e.timestamp)}))}))}}catch{}return u});(0,o.useEffect)(()=>{try{localStorage.setItem(`zio-chat-sessions-v6`,JSON.stringify(w))}catch{}},[w]);let E=(0,o.useMemo)(()=>s(i.find(e=>e.id===g)||i[0]),[g]),D=(0,o.useCallback)(e=>{p(t=>(t!==`fullscreen`&&e===`fullscreen`&&h(t),e)),n(!0);try{localStorage.setItem(`zio-preferred-mode-v4`,e)}catch{}},[]),O=(0,o.useCallback)(()=>{p(e=>{if(e===`fullscreen`){let e=m||`sidebar`;try{localStorage.setItem(`zio-preferred-mode-v4`,e)}catch{}return e}h(e);try{localStorage.setItem(`zio-preferred-mode-v4`,`fullscreen`)}catch{}return`fullscreen`}),n(!0)},[m]),k=(0,o.useCallback)(e=>{if(e){p(t=>(t!==`fullscreen`&&e===`fullscreen`&&h(t),e));try{localStorage.setItem(`zio-preferred-mode-v4`,e)}catch{}}n(!0)},[]),A=(0,o.useCallback)(()=>{n(!1)},[]),j=(0,o.useCallback)(()=>{a(e=>!e)},[]),M=(0,o.useCallback)(()=>{x(null),y([]),a(!1)},[]),N=(0,o.useCallback)(e=>{let t=w.find(t=>t.id===e);t&&(x(t.id),y(t.messages),a(!1))},[w]),P=(0,o.useCallback)(e=>{T(t=>t.filter(t=>t.id!==e)),b===e&&(x(null),y([]))},[b]),F=(0,o.useCallback)(()=>{T([]),x(null),y([])},[]),I=(0,o.useCallback)(()=>{y([]),b&&T(e=>e.map(e=>e.id===b?{...e,messages:[],updatedAt:Date.now()}:e))},[b]),L=(0,o.useCallback)(async e=>{if(!e.trim()||S)return;let t={id:`user-`+Date.now(),role:`user`,content:e.trim(),timestamp:new Date},n=`assistant-`+Date.now(),r={id:n,role:`assistant`,content:``,timestamp:new Date,isStreaming:!0},i=[...v,t,r];y(i),C(!0);let a=b;if(!a){a=`session-`+Date.now(),x(a);let n=e.trim().replace(/^###?\s*/,``),i=n.length>38?n.slice(0,38)+`...`:n,o={id:a,title:i,createdAt:Date.now(),updatedAt:Date.now(),messages:[t,r]};T(e=>[o,...e])}try{let r=await c(e,E,(e,t,r)=>{y(i=>i.map(i=>i.id===n?{...i,content:e,appScreenType:t,scoreData:r,isStreaming:!0}:i))}),i={id:n,role:`assistant`,content:r.content,appScreenType:r.appScreenType,scoreData:r.scoreData,isStreaming:!1,timestamp:new Date};if(y(e=>e.map(e=>e.id===n?i:e)),a){let e=a;T(r=>r.map(r=>{if(r.id===e){let e=r.messages.filter(e=>e.id!==n&&e.id!==t.id);return{...r,updatedAt:Date.now(),messages:[...e,t,i]}}return r}))}}catch{let e={id:n,role:`assistant`,content:`Sorry, I encountered an issue retrieving the telemetry data. Please try again.`,isStreaming:!1,timestamp:new Date};if(y(t=>t.map(t=>t.id===n?e:t)),a){let r=a;T(i=>i.map(i=>{if(i.id===r){let r=i.messages.filter(e=>e.id!==n&&e.id!==t.id);return{...i,updatedAt:Date.now(),messages:[...r,t,e]}}return i}))}}finally{C(!1)}},[S,E,v,b]);return(0,l.jsx)(d.Provider,{value:{isOpen:t,mode:f,previousMode:m,messages:v,isStreaming:S,selectedVehicle:E,selectedVehicleId:g,setSelectedVehicleId:_,openZio:k,closeZio:A,setMode:D,toggleFullscreen:O,sendMessage:L,clearMessages:I,sessions:w,activeSessionId:b,isHistoryOpen:r,setIsHistoryOpen:a,toggleHistory:j,createNewChat:M,loadChatSession:N,deleteChatSession:P,clearAllHistory:F},children:e})}function p(){let e=(0,o.useContext)(d);if(!e)throw Error(`useZio must be used within a ZioProvider`);return e}export{p as n,a as r,f as t};