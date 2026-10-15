import type { DrilldownVehicle } from "@/components/dashboard/WidgetDrilldownModal";

export const FLEET_STATUS_DRILLDOWN: Record<string, DrilldownVehicle[]> = {
  Running: [
    { id: "v1", plate: "GJ01AZ9821", name: "Volvo FMX 440 Tipper", model: "Volvo FMX 440", driver: "Rajesh Sharma", driverPhone: "+91 98250 11223", status: "Running", speed: 64, location: "Ring Road, Surat, Gujarat", updatedAt: "Just now" },
    { id: "v2", plate: "MH04CD4412", name: "Tata Prima 4028.S", model: "Tata Prima", driver: "Sunil Verma", driverPhone: "+91 98920 33441", status: "Running", speed: 78, location: "NH 48, Vapi Highway, Gujarat", updatedAt: "1 min ago" },
    { id: "v3", plate: "DL01EB5678", name: "Eicher Pro 6028", model: "Eicher Pro", driver: "Amitabh Sen", driverPhone: "+91 98110 55662", status: "Running", speed: 52, location: "Western Express Hwy, Mumbai", updatedAt: "2 mins ago" },
    { id: "v4", plate: "KA05MN8899", name: "BharatBenz 3528C", model: "BharatBenz 3528C", driver: "Karthik Gowda", driverPhone: "+91 98450 77883", status: "Running", speed: 71, location: "Outer Ring Road, Bengaluru", updatedAt: "Just now" },
    { id: "v5", plate: "GJ05AB1234", name: "Ashok Leyland 4220", model: "Ashok Leyland 4220", driver: "Pravin Patel", driverPhone: "+91 98251 99004", status: "Running", speed: 58, location: "Hazira Port Rd, Surat", updatedAt: "1 min ago" },
    { id: "v6", plate: "MH12XY7890", name: "Scania G410 Heavy", model: "Scania G410", driver: "Ganesh Patil", driverPhone: "+91 98220 12345", status: "Running", speed: 82, location: "Pune-Solapur Highway, Pune", updatedAt: "3 mins ago" },
    { id: "v7", plate: "B 1001 FUL", name: "Fuel Tanker #1", model: "Volvo FMX 440", driver: "Wamela Jambouleano", driverPhone: "+62 812 3456 7890", status: "Running", speed: 107, location: "Towamelewe, SE Sulawesi, Indonesia", updatedAt: "Just now" },
    { id: "v8", plate: "B 1002 LUX", name: "Mercedes GLE 300d", model: "Mercedes GLE", driver: "Rudy Hartono", driverPhone: "+62 813 7788 9900", status: "Running", speed: 99, location: "Jakarta Outer Ring Rd, Indonesia", updatedAt: "Just now" },
    { id: "v9", plate: "GJ21HS1609", name: "Mahindra Bolero Maxi", model: "Mahindra Bolero", driver: "Chetan Desai", driverPhone: "+91 99090 44556", status: "Running", speed: 48, location: "Navsari Industrial Area, Gujarat", updatedAt: "2 mins ago" },
    { id: "v10", plate: "DL04JK9911", name: "Tata Ace Gold Mega", model: "Tata Ace Gold", driver: "Mohan Lal", driverPhone: "+91 98101 22334", status: "Running", speed: 42, location: "Connaught Place, New Delhi", updatedAt: "4 mins ago" },
  ],

  Idle: [
    { id: "i1", plate: "GJ03CD8891", name: "Tata Ultra T.7", model: "Tata Ultra", driver: "Dinesh Solanki", driverPhone: "+91 98250 88776", status: "Idle", speed: 0, location: "GIDC Industrial Estate, Rajkot", updatedAt: "3 mins ago" },
    { id: "i2", plate: "MH02PQ6655", name: "Eicher Pro 2049", model: "Eicher Pro", driver: "Sachin More", driverPhone: "+91 98200 44332", status: "Idle", speed: 0, location: "APMC Market, Navi Mumbai", updatedAt: "5 mins ago" },
    { id: "i3", plate: "KA01AB4432", name: "Ashok Leyland Dost+", model: "Ashok Leyland Dost", driver: "Venkatesh Babu", driverPhone: "+91 98440 66778", status: "Idle", speed: 0, location: "Electronics City Ph-1, Bengaluru", updatedAt: "6 mins ago" },
    { id: "i4", plate: "GJ06EF3322", name: "BharatBenz 1923C", model: "BharatBenz 1923C", driver: "Nilesh Parmar", driverPhone: "+91 98255 11998", status: "Idle", speed: 0, location: "Makarpura GIDC, Vadodara", updatedAt: "1 min ago" },
    { id: "i5", plate: "DL02TR1109", name: "Mahindra Blazo X 35", model: "Mahindra Blazo", driver: "Gurpreet Singh", driverPhone: "+91 98112 33445", status: "Idle", speed: 0, location: "Transport Nagar, Azadpur, Delhi", updatedAt: "4 mins ago" },
    { id: "i6", plate: "MH04KL5544", name: "Force Traveller 3700", model: "Force Traveller", driver: "Vijay Shinde", driverPhone: "+91 98921 55667", status: "Idle", speed: 0, location: "Thane West Depot, Maharashtra", updatedAt: "7 mins ago" },
  ],

  Stopped: [
    { id: "s1", plate: "GJ01GH2211", name: "Tata Signa 2823.K", model: "Tata Signa", driver: "Hasmukh Vaghela", driverPhone: "+91 98252 66778", status: "Stopped", speed: 0, location: "Changodar Logistics Park, Ahmedabad", updatedAt: "15 mins ago" },
    { id: "s2", plate: "MH46PQ9081", name: "Eicher Pro 3015", model: "Eicher Pro", driver: "Suresh Chavan", driverPhone: "+91 98205 33221", status: "Stopped", speed: 0, location: "JNPT Container Terminal, Nhava Sheva", updatedAt: "22 mins ago" },
    { id: "s3", plate: "DL01MN6789", name: "Ashok Leyland 3118", model: "Ashok Leyland", driver: "Balvinder Singh", driverPhone: "+91 98108 77665", status: "Stopped", speed: 0, location: "Okhla Phase 3 Warehouse, New Delhi", updatedAt: "35 mins ago" },
    { id: "s4", plate: "KA03CD1122", name: "Volvo FH 520 Heavy", model: "Volvo FH 520", driver: "Shivakumar", driverPhone: "+91 98455 22334", status: "Stopped", speed: 0, location: "Peenya Industrial Area, Bengaluru", updatedAt: "45 mins ago" },
    { id: "s5", plate: "GJ05JK4490", name: "BharatBenz 2823R", model: "BharatBenz", driver: "Ashok Rathod", driverPhone: "+91 98258 44332", status: "Stopped", speed: 0, location: "Sachin GIDC Fleet Yard, Surat", updatedAt: "1 hour ago" },
    { id: "s6", plate: "MH14QR8877", name: "Mahindra Bolero Pickup", model: "Mahindra Bolero", driver: "Kishor Kadam", driverPhone: "+91 98223 99887", status: "Stopped", speed: 0, location: "Chakan MIDC Phase 2, Pune", updatedAt: "1 hour ago" },
  ],

  Inactive: [
    { id: "ina1", plate: "GJ01ZZ9001", name: "Tata LPT 1109", model: "Tata LPT", driver: "Manish Joshi", driverPhone: "+91 98250 00112", status: "Inactive", speed: 0, location: "Sanand Plant Yard, Ahmedabad", updatedAt: "2 days ago" },
    { id: "ina2", plate: "MH03YY4411", name: "Ashok Leyland 1616", model: "Ashok Leyland", driver: "Deepak Gaikwad", driverPhone: "+91 98201 11223", status: "Inactive", speed: 0, location: "Bhiwandi Warehouse Zone, Maharashtra", updatedAt: "3 days ago" },
    { id: "ina3", plate: "DL03XX8877", name: "Eicher Pro 1049", model: "Eicher Pro", driver: "Rameshwar Dayal", driverPhone: "+91 98115 33441", status: "Inactive", speed: 0, location: "Kundli Industrial Area, Haryana", updatedAt: "5 days ago" },
    { id: "ina4", plate: "KA04WW6655", name: "BharatBenz 1214R", model: "BharatBenz", driver: "Manjunath Swamy", driverPhone: "+91 98451 99881", status: "Inactive", speed: 0, location: "Nelamangala Toll Yard, Bengaluru", updatedAt: "4 days ago" },
  ],

  "No Data": [
    { id: "nd1", plate: "GJ05ND1001", name: "Tata 407 Gold SFC", model: "Tata 407", driver: "Bhavesh Prajapati", driverPhone: "+91 98259 88112", status: "No Data", speed: 0, location: "Last Known: Surat-Kamrej Highway", updatedAt: "Offline > 7 days" },
    { id: "nd2", plate: "MH12ND2002", name: "Mahindra Furio 12", model: "Mahindra Furio", driver: "Dattatray Rane", driverPhone: "+91 98228 77665", status: "No Data", speed: 0, location: "Last Known: Shirwal Industrial Cluster", updatedAt: "Device Unreachable" },
    { id: "nd3", plate: "DL01ND3003", name: "Ashok Leyland Ecomet", model: "Ashok Leyland Ecomet", driver: "Harish Chandra", driverPhone: "+91 98109 44332", status: "No Data", speed: 0, location: "Last Known: GT Karnal Road, Delhi", updatedAt: "No GPS Signal" },
  ],
};

export const REMOTE_LOCK_DRILLDOWN: Record<string, DrilldownVehicle[]> = {
  Unlocked: [
    { id: "rl1", plate: "GJ01AZ9821", name: "Volvo FMX 440 Tipper", model: "Volvo FMX 440", driver: "Rajesh Sharma", driverPhone: "+91 98250 11223", status: "Unlocked", speed: 64, location: "Ring Road, Surat, Gujarat", updatedAt: "Normal Operation" },
    { id: "rl2", plate: "MH04CD4412", name: "Tata Prima 4028.S", model: "Tata Prima", driver: "Sunil Verma", driverPhone: "+91 98920 33441", status: "Unlocked", speed: 78, location: "NH 48, Vapi Highway, Gujarat", updatedAt: "Normal Operation" },
    { id: "rl3", plate: "DL01EB5678", name: "Eicher Pro 6028", model: "Eicher Pro", driver: "Amitabh Sen", driverPhone: "+91 98110 55662", status: "Unlocked", speed: 52, location: "Western Express Hwy, Mumbai", updatedAt: "Normal Operation" },
    { id: "rl4", plate: "KA05MN8899", name: "BharatBenz 3528C", model: "BharatBenz 3528C", driver: "Karthik Gowda", driverPhone: "+91 98450 77883", status: "Unlocked", speed: 71, location: "Outer Ring Road, Bengaluru", updatedAt: "Normal Operation" },
    { id: "rl5", plate: "GJ05AB1234", name: "Ashok Leyland 4220", model: "Ashok Leyland 4220", driver: "Pravin Patel", driverPhone: "+91 98251 99004", status: "Unlocked", speed: 58, location: "Hazira Port Rd, Surat", updatedAt: "Normal Operation" },
    { id: "rl6", plate: "MH12XY7890", name: "Scania G410 Heavy", model: "Scania G410", driver: "Ganesh Patil", driverPhone: "+91 98220 12345", status: "Unlocked", speed: 82, location: "Pune-Solapur Highway, Pune", updatedAt: "Normal Operation" },
    { id: "rl7", plate: "B 1001 FUL", name: "Fuel Tanker #1", model: "Volvo FMX 440", driver: "Wamela Jambouleano", driverPhone: "+62 812 3456 7890", status: "Unlocked", speed: 107, location: "Towamelewe, SE Sulawesi, Indonesia", updatedAt: "Normal Operation" },
    { id: "rl8", plate: "GJ21HS1609", name: "Mahindra Bolero Maxi", model: "Mahindra Bolero", driver: "Chetan Desai", driverPhone: "+91 99090 44556", status: "Unlocked", speed: 48, location: "Navsari Industrial Area, Gujarat", updatedAt: "Normal Operation" },
  ],
  Locked: [
    { id: "lk1", plate: "MH04LK1102", name: "Tata Signa 4825.TK", model: "Tata Signa", driver: "Immobilized by Dispatch", driverPhone: "+91 98200 99887", status: "Locked", speed: 0, location: "Kalyan Bypass Hub, Maharashtra", updatedAt: "Remotely Immobilized: 14-Oct 18:30" },
    { id: "lk2", plate: "GJ03LK9944", name: "Eicher Pro 3019", model: "Eicher Pro", driver: "Security Lock Triggered", driverPhone: "+91 98251 77665", status: "Locked", speed: 0, location: "Rajkot GIDC Yard Bay #4", updatedAt: "Remotely Immobilized: 15-Oct 04:15" },
  ],
};

export const BATTERY_TIER_DRILLDOWN: Record<string, DrilldownVehicle[]> = {
  "< 20%": [
    { id: "b1", plate: "GJ01CR1101", name: "Tata Ace 12V", model: "Tata Ace", driver: "Harshil Mistry", driverPhone: "+91 98250 44112", status: "Critical (14%)", speed: 0, location: "Naroda GIDC, Ahmedabad", updatedAt: "Battery: 11.2V (Discharged)" },
    { id: "b2", plate: "MH04CR2202", name: "Eicher Pro 1049", model: "Eicher Pro", driver: "Tanmay Shinde", driverPhone: "+91 98920 66778", status: "Critical (16%)", speed: 0, location: "Airoli Knowledge Park, Navi Mumbai", updatedAt: "Battery: 11.4V (Low Voltage Alert)" },
    { id: "b3", plate: "DL01CR3303", name: "Ashok Leyland Dost", model: "Ashok Leyland", driver: "Rohit Kumar", driverPhone: "+91 98110 88990", status: "Critical (18%)", speed: 0, location: "Mayapuri Industrial Phase 1, Delhi", updatedAt: "Battery: 11.6V (Replace Recommended)" },
    { id: "b4", plate: "KA05CR4404", name: "Mahindra Bolero", model: "Mahindra Bolero", driver: "Srinivas Rao", driverPhone: "+91 98450 11223", status: "Critical (12%)", speed: 0, location: "Whitefield Main Rd, Bengaluru", updatedAt: "Battery: 10.9V (Severe Drain)" },
    { id: "b5", plate: "GJ05CR5505", name: "Tata 407 Gold", model: "Tata 407", driver: "Mukesh Patel", driverPhone: "+91 98251 55667", status: "Critical (19%)", speed: 0, location: "Udhna Yard, Surat", updatedAt: "Battery: 11.8V (Low Charge)" },
  ],
  "20% - 40%": [
    { id: "b6", plate: "GJ01MD1101", name: "Tata Ultra T.7", model: "Tata Ultra", driver: "Ketan Trivedi", driverPhone: "+91 98250 33221", status: "Warning (28%)", speed: 45, location: "SG Highway, Ahmedabad", updatedAt: "Battery: 12.1V" },
    { id: "b7", plate: "MH02MD2202", name: "Eicher Pro 3015", model: "Eicher Pro", driver: "Prashant Kadam", driverPhone: "+91 98201 44556", status: "Warning (32%)", speed: 0, location: "Andheri MIDC, Mumbai", updatedAt: "Battery: 12.3V" },
    { id: "b8", plate: "DL02MD3303", name: "BharatBenz 1923C", model: "BharatBenz", driver: "Sukhdev Singh", driverPhone: "+91 98112 55667", status: "Warning (35%)", speed: 52, location: "Delhi-Noida Expressway", updatedAt: "Battery: 12.4V" },
    { id: "b9", plate: "KA02MD4404", name: "Ashok Leyland 3118", model: "Ashok Leyland", driver: "Raghavendra", driverPhone: "+91 98452 77889", status: "Warning (38%)", speed: 60, location: "Hosur Road, Bengaluru", updatedAt: "Battery: 12.5V" },
  ],
  "40% - 60%": [
    { id: "b10", plate: "GJ05NM1101", name: "Volvo FMX 440", model: "Volvo FMX", driver: "Jignesh Solanki", driverPhone: "+91 98253 11223", status: "Normal (48%)", speed: 65, location: "Dumas Road, Surat", updatedAt: "Battery: 12.8V" },
    { id: "b11", plate: "MH12NM2202", name: "Scania G410", model: "Scania G410", driver: "Anand Deshmukh", driverPhone: "+91 98224 44556", status: "Normal (54%)", speed: 72, location: "Hadapsar Industrial, Pune", updatedAt: "Battery: 13.0V" },
  ],
  "60% - 80%": [
    { id: "b12", plate: "GJ01GD1101", name: "Tata Prima 4028", model: "Tata Prima", driver: "Ramesh Barot", driverPhone: "+91 98254 66778", status: "Good (68%)", speed: 70, location: "Sanand GIDC, Ahmedabad", updatedAt: "Battery: 13.4V" },
    { id: "b13", plate: "MH04GD2202", name: "BharatBenz 3528", model: "BharatBenz", driver: "Sanjay More", driverPhone: "+91 98922 88990", status: "Good (72%)", speed: 62, location: "Turbhe Depot, Navi Mumbai", updatedAt: "Battery: 13.6V" },
    { id: "b14", plate: "DL04GD3303", name: "Volvo FH 520", model: "Volvo FH", driver: "Jasbir Singh", driverPhone: "+91 98114 11223", status: "Good (75%)", speed: 80, location: "Gurugram Cyber City, Haryana", updatedAt: "Battery: 13.7V" },
    { id: "b15", plate: "KA04GD4404", name: "Eicher Pro 6028", model: "Eicher Pro", driver: "Naveen Kumar", driverPhone: "+91 98454 44556", status: "Good (78%)", speed: 55, location: "Hebbal Flyover, Bengaluru", updatedAt: "Battery: 13.8V" },
    { id: "b16", plate: "GJ05GD5505", name: "Mahindra Blazo 35", model: "Mahindra Blazo", driver: "Nayan Parmar", driverPhone: "+91 98256 77889", status: "Good (74%)", speed: 68, location: "Palsana Industrial Zone, Surat", updatedAt: "Battery: 13.6V" },
    { id: "b17", plate: "MH14GD6606", name: "Tata Signa 2823", model: "Tata Signa", driver: "Manoj Jagtap", driverPhone: "+91 98226 11223", status: "Good (76%)", speed: 64, location: "Pimpri Chinchwad, Pune", updatedAt: "Battery: 13.7V" },
  ],
  "> 80%": [
    { id: "b18", plate: "GJ01EX1101", name: "Tata Ultra EV", model: "Tata Ultra EV", driver: "Hiren Dave", driverPhone: "+91 98257 33445", status: "Optimal (92%) ⚡", speed: 50, location: "Fast Charger Bay #1, Ahmedabad", updatedAt: "Charging: 92% (14.2V)" },
    { id: "b19", plate: "MH01EX2202", name: "Eicher Pro EV 3015", model: "Eicher Pro EV", driver: "Kailash Mhatre", driverPhone: "+91 98203 55667", status: "Optimal (88%) ⚡", speed: 40, location: "Kurla Depot Charging Hub", updatedAt: "Charging: 88% (14.1V)" },
    { id: "b20", plate: "DL01EX3303", name: "Ashok Leyland BSafe", model: "Ashok Leyland", driver: "Surinder Pal", driverPhone: "+91 98116 77889", status: "Optimal (95%) ⚡", speed: 0, location: "Mayapuri Charging Station", updatedAt: "Charging: 95% (14.4V)" },
    { id: "b21", plate: "KA01EX4404", name: "Mahindra Zor Grand", model: "Mahindra Zor", driver: "Chetan Gowda", driverPhone: "+91 98456 99001", status: "Optimal (86%) ⚡", speed: 35, location: "Koramangala 80ft Rd, Bengaluru", updatedAt: "Charging: 86% (14.0V)" },
    { id: "b22", plate: "GJ05EX5505", name: "Volvo B11R Multi", model: "Volvo B11R", driver: "Dipak Patel", driverPhone: "+91 98258 22334", status: "Optimal (90%) ⚡", speed: 85, location: "Surat-Navsari Toll Plaza", updatedAt: "Charging: 90% (14.2V)" },
    { id: "b23", plate: "MH12EX6606", name: "BharatBenz 1617R", model: "BharatBenz", driver: "Rahul Shinde", driverPhone: "+91 98228 44556", status: "Optimal (94%) ⚡", speed: 55, location: "Pune Bypass Charging Bay", updatedAt: "Charging: 94% (14.3V)" },
    { id: "b24", plate: "DL03EX7707", name: "Tata Prima E.28K", model: "Tata Prima EV", driver: "Kuldeep Mann", driverPhone: "+91 98118 66778", status: "Optimal (89%) ⚡", speed: 0, location: "Narela EV Hub, Delhi", updatedAt: "Charging: 89% (14.1V)" },
  ],
};

export const JOB_DELIVERY_DRILLDOWN: Record<string, DrilldownVehicle[]> = {
  Completed: [
    { id: "j1", plate: "GJ01AZ9821", name: "Route #A-102 (Amazon FBA)", model: "Volvo FMX 440", driver: "Rajesh Sharma", driverPhone: "+91 98250 11223", status: "Delivered", speed: 0, location: "Bhiwandi Hub 3, Mumbai", updatedAt: "Delivered at 14:22" },
    { id: "j2", plate: "MH04CD4412", name: "Route #D-405 (Flipkart Sort)", model: "Tata Prima", driver: "Sunil Verma", driverPhone: "+91 98920 33441", status: "Delivered", speed: 0, location: "Navi Mumbai Hub", updatedAt: "Delivered at 13:50" },
    { id: "j3", plate: "DL01EB5678", name: "Route #N-880 (Blinkit Depot)", model: "Eicher Pro", driver: "Amitabh Sen", driverPhone: "+91 98110 55662", status: "Delivered", speed: 0, location: "Okhla Phase 2, Delhi", updatedAt: "Delivered at 12:15" },
  ],
  Pending: [
    { id: "j4", plate: "KA05MN8899", name: "Route #S-210 (Intercity Express)", model: "BharatBenz 3528C", driver: "Karthik Gowda", driverPhone: "+91 98450 77883", status: "In Transit (ETA: 45 min)", speed: 68, location: "Electronic City Flyover, BLR", updatedAt: "Ping: 2 mins ago" },
    { id: "j5", plate: "GJ05AB1234", name: "Route #G-309 (Cold Chain Cargo)", model: "Ashok Leyland 4220", driver: "Pravin Patel", driverPhone: "+91 98251 99004", status: "In Transit (ETA: 1h 20m)", speed: 58, location: "Ankleshwar Bypass, Gujarat", updatedAt: "Ping: Just now" },
  ],
  Delayed: [
    { id: "j6", plate: "MH12XY7890", name: "Route #M-101 (Pharma Consignment)", model: "Scania G410", driver: "Ganesh Patil", driverPhone: "+91 98220 12345", status: "Traffic Delay (+42 min)", speed: 18, location: "Pune-Mumbai Expressway Ghat", updatedAt: "High congestion reported" },
  ],
  Cancelled: [
    { id: "j7", plate: "DL04JK9911", name: "Route #X-004 (Rejected Consignment)", model: "Tata Ace Gold", driver: "Mohan Lal", driverPhone: "+91 98101 22334", status: "Cancelled by Client", speed: 0, location: "Transport Nagar Depot, Delhi", updatedAt: "Cancelled at 11:30" },
  ],
};

export const CAMERA_STATUS_DRILLDOWN: Record<string, DrilldownVehicle[]> = {
  Online: [
    { id: "c1", plate: "GJ01AZ9821", name: "Dual AI Dashcam + DMS", model: "Volvo FMX 440", driver: "Rajesh Sharma", driverPhone: "+91 98250 11223", status: "1080p Stream Active", speed: 64, location: "Ring Road, Surat", updatedAt: "Bitrate: 2.4 Mbps" },
    { id: "c2", plate: "MH04CD4412", name: "Cabin + Road Cam", model: "Tata Prima", driver: "Sunil Verma", driverPhone: "+91 98920 33441", status: "Live Feed OK", speed: 78, location: "NH 48 Vapi", updatedAt: "Bitrate: 2.1 Mbps" },
  ],
  Offline: [
    { id: "c3", plate: "DL03XX8877", name: "Road Cam #2", model: "Eicher Pro", driver: "Rameshwar Dayal", driverPhone: "+91 98115 33441", status: "Device Offline", speed: 0, location: "Kundli Yard", updatedAt: "Last stream: 4 hours ago" },
  ],
  "Video Loss": [
    { id: "c4", plate: "MH46PQ9081", name: "Cargo Cam Loss", model: "Eicher Pro 3015", driver: "Suresh Chavan", driverPhone: "+91 98205 33221", status: "Video Signal Lost", speed: 0, location: "JNPT Nhava Sheva", updatedAt: "Check harness cable" },
  ],
  Tampered: [
    { id: "c5", plate: "GJ05ND1001", name: "Lens Obstructed", model: "Tata 407 Gold", driver: "Bhavesh Prajapati", driverPhone: "+91 98259 88112", status: "Tamper Detected", speed: 0, location: "Kamrej Highway", updatedAt: "Lens covered / obscured" },
  ],
};

export const GSM_SIGNAL_DRILLDOWN: Record<string, DrilldownVehicle[]> = {
  "Excellent (> -75 dBm)": [
    { id: "g1", plate: "GJ01AZ9821", name: "Volvo FMX 440 Tipper", model: "Volvo FMX 440", driver: "Rajesh Sharma", driverPhone: "+91 98250 11223", status: "Excellent (-62 dBm 4G LTE)", speed: 64, location: "Ring Road, Surat", updatedAt: "CSQ: 31 (100%)" },
    { id: "g2", plate: "MH04CD4412", name: "Tata Prima 4028.S", model: "Tata Prima", driver: "Sunil Verma", driverPhone: "+91 98920 33441", status: "Excellent (-68 dBm 4G LTE)", speed: 78, location: "NH 48 Vapi", updatedAt: "CSQ: 29 (94%)" },
  ],
  "Fair (-75 to -95 dBm)": [
    { id: "g3", plate: "DL01EB5678", name: "Eicher Pro 6028", model: "Eicher Pro", driver: "Amitabh Sen", driverPhone: "+91 98110 55662", status: "Fair (-82 dBm 3G)", speed: 52, location: "Western Express Hwy", updatedAt: "CSQ: 18 (58%)" },
  ],
  "Poor (< -95 dBm)": [
    { id: "g4", plate: "GJ05ND1001", name: "Tata 407 Gold SFC", model: "Tata 407", driver: "Bhavesh Prajapati", driverPhone: "+91 98259 88112", status: "Poor (-104 dBm Fringe)", speed: 0, location: "Rural Kamrej Link", updatedAt: "CSQ: 6 (19% Weak)" },
  ],
};


