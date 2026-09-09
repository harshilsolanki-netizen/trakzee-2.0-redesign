//#region node_modules/.nitro/vite/services/ssr/assets/fleet-DZTK5mNe.js
var RANGE_LABEL = {
	today: "Today",
	"7d": "Last 7 Days",
	"30d": "Last 30 Days"
};
var fleetScore = {
	today: {
		score: 86,
		delta: 1.2
	},
	"7d": {
		score: 90,
		delta: 4.3
	},
	"30d": {
		score: 83,
		delta: -2.1
	}
};
var scoreDistribution = {
	today: [
		{
			bucket: "91-100",
			drivers: 22
		},
		{
			bucket: "81-90",
			drivers: 18
		},
		{
			bucket: "71-80",
			drivers: 14
		},
		{
			bucket: "61-70",
			drivers: 16
		},
		{
			bucket: "51-60",
			drivers: 12
		},
		{
			bucket: "41-50",
			drivers: 8
		},
		{
			bucket: "31-40",
			drivers: 11
		},
		{
			bucket: "21-30",
			drivers: 13
		},
		{
			bucket: "11-20",
			drivers: 4
		},
		{
			bucket: "0-10",
			drivers: 5
		}
	],
	"7d": [
		{
			bucket: "91-100",
			drivers: 50
		},
		{
			bucket: "81-90",
			drivers: 41
		},
		{
			bucket: "71-80",
			drivers: 38
		},
		{
			bucket: "61-70",
			drivers: 43
		},
		{
			bucket: "51-60",
			drivers: 40
		},
		{
			bucket: "41-50",
			drivers: 25
		},
		{
			bucket: "31-40",
			drivers: 33
		},
		{
			bucket: "21-30",
			drivers: 37
		},
		{
			bucket: "11-20",
			drivers: 12
		},
		{
			bucket: "0-10",
			drivers: 15
		}
	],
	"30d": [
		{
			bucket: "91-100",
			drivers: 128
		},
		{
			bucket: "81-90",
			drivers: 112
		},
		{
			bucket: "71-80",
			drivers: 96
		},
		{
			bucket: "61-70",
			drivers: 104
		},
		{
			bucket: "51-60",
			drivers: 88
		},
		{
			bucket: "41-50",
			drivers: 61
		},
		{
			bucket: "31-40",
			drivers: 74
		},
		{
			bucket: "21-30",
			drivers: 82
		},
		{
			bucket: "11-20",
			drivers: 30
		},
		{
			bucket: "0-10",
			drivers: 41
		}
	]
};
var bucketColor = (bucket) => {
	const high = Number(bucket.split("-")[1]);
	if (high >= 91) return "var(--color-danger)";
	if (high >= 81) return "oklch(0.68 0.19 43)";
	if (high >= 71) return "oklch(0.74 0.17 60)";
	if (high >= 61) return "var(--color-warning)";
	if (high >= 51) return "oklch(0.78 0.11 150)";
	if (high >= 41) return "oklch(0.62 0.1 168)";
	if (high >= 31) return "oklch(0.55 0.08 180)";
	if (high >= 21) return "oklch(0.52 0.07 220)";
	if (high >= 11) return "oklch(0.48 0.11 235)";
	return "oklch(0.35 0.06 160)";
};
var riskyDrivers = [
	{
		id: "d1",
		name: "John Smith",
		vehicle: "V0001",
		score: 45,
		level: "High",
		tags: ["fatigue"],
		range: [
			"today",
			"7d",
			"30d"
		]
	},
	{
		id: "d2",
		name: "Jane Doe",
		vehicle: "V0014",
		score: 30,
		level: "High",
		tags: [],
		range: [
			"today",
			"7d",
			"30d"
		]
	},
	{
		id: "d3",
		name: "Mike Johnson",
		vehicle: "V0021",
		score: 10,
		level: "Medium",
		tags: ["fatigue"],
		range: ["7d", "30d"]
	},
	{
		id: "d4",
		name: "Rahul Mehta",
		vehicle: "V0032",
		score: 9,
		level: "Medium",
		tags: [],
		range: ["7d", "30d"]
	},
	{
		id: "d5",
		name: "Suresh Patil",
		vehicle: "V0048",
		score: 8,
		level: "Medium",
		tags: [
			"phone",
			"smoking",
			"distraction",
			"eye"
		],
		range: [
			"today",
			"7d",
			"30d"
		]
	},
	{
		id: "d6",
		name: "Vijay Singh",
		vehicle: "V0051",
		score: 7,
		level: "Low",
		tags: [],
		range: ["30d"]
	},
	{
		id: "d7",
		name: "Nehal Shah",
		vehicle: "V0063",
		score: 6,
		level: "Low",
		tags: ["phone"],
		range: ["today", "30d"]
	}
];
var eventTypes = [
	{
		id: "driver-on-call",
		label: "Driver on Call",
		category: "DMS",
		count: {
			today: 23,
			"7d": 132,
			"30d": 480
		},
		color: "oklch(0.36 0.05 265)",
		violation: true
	},
	{
		id: "yawn",
		label: "Yawn",
		category: "DMS",
		count: {
			today: 12,
			"7d": 74,
			"30d": 260
		},
		color: "oklch(0.74 0.13 48)",
		violation: false
	},
	{
		id: "eye-closed",
		label: "Eye closed",
		category: "DMS",
		count: {
			today: 12,
			"7d": 58,
			"30d": 190
		},
		color: "oklch(0.68 0.14 235)",
		violation: true
	},
	{
		id: "smoking",
		label: "Smoking",
		category: "DMS",
		count: {
			today: 8,
			"7d": 44,
			"30d": 150
		},
		color: "oklch(0.85 0.15 90)",
		violation: true
	},
	{
		id: "missing-face",
		label: "Missing Face",
		category: "DMS",
		count: {
			today: 6,
			"7d": 39,
			"30d": 120
		},
		color: "oklch(0.68 0.17 8)",
		violation: false
	},
	{
		id: "road-sign",
		label: "Road Sign Violation",
		category: "ADAS",
		count: {
			today: 9,
			"7d": 51,
			"30d": 175
		},
		color: "oklch(0.52 0.14 285)",
		violation: true
	},
	{
		id: "vibration",
		label: "Vibration Alarm",
		category: "ADAS",
		count: {
			today: 5,
			"7d": 29,
			"30d": 96
		},
		color: "oklch(0.66 0.11 175)",
		violation: false
	},
	{
		id: "monitoring",
		label: "Monitoring Shelter",
		category: "ADAS",
		count: {
			today: 4,
			"7d": 26,
			"30d": 84
		},
		color: "oklch(0.55 0.16 262)",
		violation: false
	},
	{
		id: "fatigue",
		label: "Fatigue Driving",
		category: "DMS",
		count: {
			today: 7,
			"7d": 47,
			"30d": 158
		},
		color: "oklch(0.63 0.2 38)",
		violation: true
	},
	{
		id: "keep-out",
		label: "Keep Out",
		category: "ADAS",
		count: {
			today: 3,
			"7d": 21,
			"30d": 70
		},
		color: "oklch(0.6 0.15 255)",
		violation: true
	}
];
var highlightEvents = [
	{
		id: "h1",
		label: "Driver Distraction",
		count: 90,
		violation: true,
		range: [
			"today",
			"7d",
			"30d"
		]
	},
	{
		id: "h2",
		label: "Driver On Call",
		count: 23,
		violation: true,
		range: [
			"today",
			"7d",
			"30d"
		]
	},
	{
		id: "h3",
		label: "Eye closed",
		count: 12,
		violation: true,
		range: [
			"today",
			"7d",
			"30d"
		]
	},
	{
		id: "h4",
		label: "Cellphone Distraction",
		count: 8,
		violation: true,
		range: ["7d", "30d"]
	},
	{
		id: "h5",
		label: "Yawn",
		count: 6,
		violation: false,
		range: ["today", "7d"]
	},
	{
		id: "h6",
		label: "Lane Departure",
		count: 5,
		violation: false,
		range: ["7d", "30d"]
	},
	{
		id: "h7",
		label: "Harsh Braking",
		count: 4,
		violation: true,
		range: ["30d"]
	}
];
var cameraStatus = {
	online: 66,
	offline: 35,
	videoLoss: 45,
	tampered: 4
};
var mk = (id, name, company, branch, status, speed, battery, gps, driver, fuel) => ({
	id,
	name,
	company,
	branch,
	status,
	speed,
	gsm: 60 + speed * 7 % 40,
	battery,
	gps,
	driver,
	alerts: speed * 3 % 9,
	fuel,
	tankCapacity: 300,
	odometer: 45e3 + speed * 137,
	duration: `${100 + speed % 90}:${String(speed % 60).padStart(2, "0")}`,
	currentTrip: Number((speed * .42).toFixed(2)),
	remaining: 400 + speed * 6,
	imei: `86${String(1e9 + speed * 991919).slice(0, 13)}`
});
var fleetObjects = [
	mk("o1", "Fuel - 1001", "Company", "Indonesia", "running", 89, 39, 91, null, 64),
	mk("o2", "Mercedes GLE 300", "Company", "Indonesia", "running", 92, 100, 85, null, 210),
	mk("o3", "Scania - 1004", "Company", "Indonesia", "running", 123, 99, 94, null, 180),
	mk("o4", "Temperature - 1005", "Company", "Indonesia", "idle", 16, 9, 96, null, 88),
	mk("o5", "BUS - 130003", "Company", "Thailand", "running", 130, 94, 99, "Shivam Patel", 240),
	mk("o6", "Fuel - 130001", "Company", "Thailand", "stopped", 32, 90, 87, "Khushi Ojha", 110),
	mk("o7", "RPM - 130004", "Company", "Thailand", "running", 145, 10, 86, "Drashti Joshier", 55),
	mk("o8", "SOC - 130002", "Company", "Thailand", "idle", 114, 26, 90, "Chatchai Panlumkhaw", 132),
	mk("o9", "Temperature - 130005", "Company", "Thailand", "running", 92, 61, 100, "Kuldeep Chaurasia", 205),
	mk("o10", "Fuel - 12393", "Company", "Valsad", "running", 146, 52, 86, "Finatrack Driver", 96),
	mk("o11", "Temperature - 12394", "Company", "Valsad", "stopped", 150, 62, 89, "Kanika Agrawal", 143),
	mk("o12", "Tire Management - 12", "Company", "Valsad", "inactive", 73, 52, 99, null, 74),
	mk("o13", "AP39WP4220-CA-01", "Company", "Planet Eco AL Khabaisi", "nodata", 5, null, null, null, 0),
	mk("o14", "HR46F0864-VE-C-02", "Company", "Planet Eco AL Nakheel", "inactive", 35, null, null, null, 0),
	mk("o15", "MH09GJ6798-CAV-03", "Company", "Planet Eco AL Nakheel", "nodata", 31, null, null, null, 0),
	mk("o16", "NL01AJ3382-VE-C-04", "Company", "Planet Eco AL Nakheel", "inactive", 33, null, null, null, 0),
	mk("o17", "RUP-88120", "Company", "HP Branch 1", "running", 61, 78, 92, "Ashok Patel", 158),
	mk("o18", "RUP-88121", "Company", "HP Branch 1", "stopped", 12, 44, 81, "Raman K.", 62),
	mk("o19", "MH12AB1234", "Company", "HP Branch 1", "running", 52, 65, 86, "Ashok Patel", 120),
	mk("o20", "MH12CD5678", "Company", "HP Branch 1", "running", 48, 55, 78, "Raman K.", 240),
	mk("o21", "MH14EF9012", "Company", "HP Branch 1", "running", 45, 80, 72, "Vikram Joshi", 80),
	mk("o22", "MH11GH3456", "Company", "HP Branch 1", "running", 55, 70, 92, "Vijay Singh", 350),
	mk("o23", "MH12JK1313", "Company", "HP Branch 1", "running", 50, 60, 82, "Rahul Mehta", 160),
	mk("o24", "GJ15MM2654", "Company", "Valsad", "running", 47, 75, 79, "Jitendra V.", 180),
	mk("o25", "KA01AB9988", "Company", "Planet Eco Abu Dhabi", "running", 43, 68, 68, "Anand Murthy", 95),
	mk("o26", "DL01TA1122", "Company", "Planet Eco Abu Dhabi", "running", 48, 72, 75, "Harish Chand", 130),
	mk("o27", "TS07FA7788", "Company", "Planet Eco Abu Dhabi", "running", 50, 64, 82, "Venkatesh Rao", 165),
	mk("o28", "TN01HA1234", "Company", "Planet Eco Ajman", "running", 46, 58, 76, "Murugan P.", 125),
	mk("o29", "WB01KA4321", "Company", "Planet Eco Ajman", "running", 50, 62, 81, "Sourav Roy", 250),
	mk("o30", "RJ14CA2468", "Company", "Planet Eco AL Khabaisi", "running", 56, 70, 92, "Mahipal Singh", 375)
];
var STATUS_META = {
	running: {
		label: "Running",
		color: "var(--color-status-running)",
		tint: "oklch(0.62 0.17 148 / 12%)"
	},
	idle: {
		label: "Idle",
		color: "var(--color-status-idle)",
		tint: "oklch(0.82 0.16 84 / 18%)"
	},
	stopped: {
		label: "Stopped",
		color: "var(--color-status-stopped)",
		tint: "oklch(0.6 0.23 26 / 12%)"
	},
	inactive: {
		label: "Inactive",
		color: "var(--color-status-inactive)",
		tint: "oklch(0.55 0.12 275 / 14%)"
	},
	nodata: {
		label: "NoData",
		color: "var(--color-status-nodata)",
		tint: "oklch(0.6 0.02 258 / 12%)"
	}
};
var trips = (seed) => [
	[
		"07:15 AM",
		"Pune Depot",
		42.6,
		"01:20:15",
		"00:18:30",
		"22:21:15",
		0,
		"08:15 AM",
		"Pune City"
	],
	[
		"08:20 AM",
		"Pune Depot",
		58.4,
		"02:05:40",
		"00:22:15",
		"21:32:05",
		1,
		"09:20 AM",
		"Wakad"
	],
	[
		"10:30 AM",
		"Warehouse",
		86.7,
		"03:10:25",
		"00:35:20",
		"20:14:15",
		2,
		"11:30 AM",
		"Nashik Road"
	],
	[
		"12:56 PM",
		"Pune Hub",
		76.4,
		"02:15:35",
		"00:35:20",
		"21:09:05",
		1,
		"01:56 PM",
		"Kolhapur Highway"
	],
	[
		"02:22 PM",
		"Pune Sub Warehouse",
		112.75,
		"03:42:10",
		"00:48:35",
		"19:29:15",
		2,
		"03:22 PM",
		"Aurangabad Road"
	],
	[
		"03:59 PM",
		"Swargate Depot",
		64.2,
		"01:55:45",
		"00:25:15",
		"21:39:00",
		0,
		"04:59 PM",
		"Lonavala"
	]
].slice(0, 4 + seed % 3).map((t) => ({
	date: "31-07-2026",
	firstIgnitionOn: t[0],
	startLocation: t[1],
	distance: t[2],
	running: t[3],
	idle: t[4],
	stop: t[5],
	alerts: t[6],
	lastIgnitionOn: t[7],
	endLocation: t[8]
}));
var travelRows = [
	{
		id: "t1",
		company: "Swargate Division",
		vehicleNo: "MH12AB1234",
		vehicleType: "SUV",
		driver: "Ashok Patel",
		distance: 289.08,
		running: "05:42:18",
		idle: "01:12:35",
		stop: "17:05:07",
		avgSpeed: 52,
		maxSpeed: 86,
		tollCost: 120,
		alerts: 2,
		startLocation: "Pune Depot",
		endLocation: "Mumbai Highway",
		trips: trips(1)
	},
	{
		id: "t2",
		company: "Swargate Division",
		vehicleNo: "MH12CD5678",
		vehicleType: "Truck",
		driver: "Raman K.",
		distance: 514.6,
		running: "09:18:42",
		idle: "02:05:20",
		stop: "12:35:58",
		avgSpeed: 48,
		maxSpeed: 78,
		tollCost: 240,
		alerts: 5,
		startLocation: "Pune Warehouse",
		endLocation: "Nashik Highway",
		trips: trips(2)
	},
	{
		id: "t3",
		company: "Swargate Division",
		vehicleNo: "MH14EF9012",
		vehicleType: "Car",
		driver: "Vikram Joshi",
		distance: 142.35,
		running: "03:25:10",
		idle: "00:45:30",
		stop: "19:49:20",
		avgSpeed: 45,
		maxSpeed: 72,
		tollCost: 80,
		alerts: 1,
		startLocation: "Hinjewadi",
		endLocation: "Wakad",
		trips: trips(3)
	},
	{
		id: "t4",
		company: "Swargate Division",
		vehicleNo: "MH11GH3456",
		vehicleType: "Tanker",
		driver: "Vijay Singh",
		distance: 620.75,
		running: "11:32:15",
		idle: "03:18:40",
		stop: "09:09:05",
		avgSpeed: 55,
		maxSpeed: 92,
		tollCost: 350,
		alerts: 7,
		startLocation: "Pune",
		endLocation: "Ahmedabad Highway",
		trips: trips(4)
	},
	{
		id: "t5",
		company: "Swargate Division",
		vehicleNo: "MH12JK1313",
		vehicleType: "Convertible",
		driver: "Rahul Mehta",
		distance: 356.45,
		running: "07:18:25",
		idle: "01:25:40",
		stop: "15:15:55",
		avgSpeed: 50,
		maxSpeed: 82,
		tollCost: 160,
		alerts: 3,
		startLocation: "Pune Hub",
		endLocation: "Kolhapur",
		trips: trips(5)
	},
	{
		id: "t6",
		company: "Swargate Division",
		vehicleNo: "MH12LM1414",
		vehicleType: "Pickup",
		driver: "Nehal",
		distance: 482.3,
		running: "08:42:15",
		idle: "02:10:35",
		stop: "13:07:10",
		avgSpeed: 46,
		maxSpeed: 76,
		tollCost: 220,
		alerts: 4,
		startLocation: "Pune Warehouse",
		endLocation: "Aurangabad",
		trips: trips(6)
	},
	{
		id: "t7",
		company: "Swargate Division",
		vehicleNo: "MH12MN1515",
		vehicleType: "Wagon",
		driver: "Suresh Patil",
		distance: 275.8,
		running: "06:55:40",
		idle: "01:40:20",
		stop: "15:24:00",
		avgSpeed: 54,
		maxSpeed: 88,
		tollCost: 140,
		alerts: 2,
		startLocation: "Swargate Depot",
		endLocation: "Lonavala",
		trips: trips(7)
	},
	{
		id: "t8",
		company: "Swargate Division",
		vehicleNo: "MH12OP1616",
		vehicleType: "Crossover",
		driver: "Arjun Singh",
		distance: 735.25,
		running: "12:15:30",
		idle: "03:05:15",
		stop: "08:39:15",
		avgSpeed: 58,
		maxSpeed: 96,
		tollCost: 420,
		alerts: 4,
		startLocation: "Pune",
		endLocation: "Surat",
		trips: trips(8)
	},
	{
		id: "t9",
		company: "Swargate Division",
		vehicleNo: "MH12QR1717",
		vehicleType: "Van",
		driver: "Deepak",
		distance: 198.6,
		running: "04:35:20",
		idle: "00:55:45",
		stop: "18:28:55",
		avgSpeed: 42,
		maxSpeed: 70,
		tollCost: 90,
		alerts: 8,
		startLocation: "Pune Market",
		endLocation: "Satara",
		trips: trips(9)
	},
	{
		id: "t10",
		company: "Swargate Division",
		vehicleNo: "MH15ZA9012",
		vehicleType: "Tanker",
		driver: "Suresh",
		distance: 568.9,
		running: "10:25:45",
		idle: "02:35:30",
		stop: "11:00:45",
		avgSpeed: 56,
		maxSpeed: 91,
		tollCost: 310,
		alerts: 6,
		startLocation: "Pune Terminal",
		endLocation: "Nashik",
		trips: trips(10)
	},
	{
		id: "t11",
		company: "Mumbai Metro Fleet",
		vehicleNo: "MH01AX2020",
		vehicleType: "Truck",
		driver: "Ganesh K.",
		distance: 412.3,
		running: "08:12:10",
		idle: "01:45:00",
		stop: "14:02:50",
		avgSpeed: 49,
		maxSpeed: 80,
		tollCost: 200,
		alerts: 3,
		startLocation: "JNPT Port",
		endLocation: "Bhiwandi Hub",
		trips: trips(11)
	},
	{
		id: "t12",
		company: "Mumbai Metro Fleet",
		vehicleNo: "MH02BC3131",
		vehicleType: "Van",
		driver: "Imran Khan",
		distance: 225.4,
		running: "04:55:20",
		idle: "01:10:15",
		stop: "17:54:25",
		avgSpeed: 44,
		maxSpeed: 74,
		tollCost: 110,
		alerts: 1,
		startLocation: "Andheri Depot",
		endLocation: "Thane West",
		trips: trips(12)
	},
	{
		id: "t13",
		company: "Mumbai Metro Fleet",
		vehicleNo: "MH03DE4242",
		vehicleType: "Tanker",
		driver: "Kiran Rane",
		distance: 680.1,
		running: "12:40:00",
		idle: "02:20:10",
		stop: "08:59:50",
		avgSpeed: 57,
		maxSpeed: 94,
		tollCost: 390,
		alerts: 5,
		startLocation: "Mahul Refinery",
		endLocation: "Vapi Industrial",
		trips: trips(13)
	},
	{
		id: "t14",
		company: "Gujarat Logistics",
		vehicleNo: "GJ01XY5555",
		vehicleType: "Truck",
		driver: "Manish Shah",
		distance: 589.6,
		running: "10:50:30",
		idle: "02:15:00",
		stop: "10:54:30",
		avgSpeed: 53,
		maxSpeed: 87,
		tollCost: 320,
		alerts: 4,
		startLocation: "Ahmedabad Ring Rd",
		endLocation: "Baroda GIDC",
		trips: trips(14)
	},
	{
		id: "t15",
		company: "Gujarat Logistics",
		vehicleNo: "GJ05ZZ6789",
		vehicleType: "SUV",
		driver: "Pravin Bhai",
		distance: 310.2,
		running: "06:15:45",
		idle: "00:58:20",
		stop: "16:45:55",
		avgSpeed: 51,
		maxSpeed: 84,
		tollCost: 150,
		alerts: 2,
		startLocation: "Surat Textile Mkt",
		endLocation: "Navsari",
		trips: trips(15)
	},
	{
		id: "t16",
		company: "Gujarat Logistics",
		vehicleNo: "GJ15MM2654",
		vehicleType: "Truck",
		driver: "Jitendra V.",
		distance: 368.58,
		running: "07:22:15",
		idle: "01:30:40",
		stop: "15:07:05",
		avgSpeed: 47,
		maxSpeed: 79,
		tollCost: 180,
		alerts: 3,
		startLocation: "Valsad Depot",
		endLocation: "Vapi GIDC",
		trips: trips(16)
	},
	{
		id: "t17",
		company: "Bangalore Express",
		vehicleNo: "KA01AB9988",
		vehicleType: "Car",
		driver: "Anand Murthy",
		distance: 188.75,
		running: "04:10:00",
		idle: "01:05:30",
		stop: "18:44:30",
		avgSpeed: 43,
		maxSpeed: 68,
		tollCost: 95,
		alerts: 1,
		startLocation: "Electronic City",
		endLocation: "Whitefield",
		trips: trips(17)
	},
	{
		id: "t18",
		company: "Bangalore Express",
		vehicleNo: "KA04CD7766",
		vehicleType: "Truck",
		driver: "Basavaraj S.",
		distance: 645.2,
		running: "11:45:10",
		idle: "02:40:00",
		stop: "09:34:50",
		avgSpeed: 56,
		maxSpeed: 90,
		tollCost: 360,
		alerts: 6,
		startLocation: "Peenya Industrial",
		endLocation: "Hosur Hub",
		trips: trips(18)
	},
	{
		id: "t19",
		company: "Delhi NCR Cargo",
		vehicleNo: "DL01TA1122",
		vehicleType: "Wagon",
		driver: "Harish Chand",
		distance: 295.4,
		running: "06:30:20",
		idle: "01:22:10",
		stop: "16:07:30",
		avgSpeed: 48,
		maxSpeed: 75,
		tollCost: 130,
		alerts: 2,
		startLocation: "Okhla Phase 3",
		endLocation: "Gurugram Cyber Hub",
		trips: trips(19)
	},
	{
		id: "t20",
		company: "Delhi NCR Cargo",
		vehicleNo: "DL08CB3344",
		vehicleType: "Pickup",
		driver: "Satish Kumar",
		distance: 420.8,
		running: "08:15:00",
		idle: "01:50:30",
		stop: "13:54:30",
		avgSpeed: 52,
		maxSpeed: 85,
		tollCost: 210,
		alerts: 4,
		startLocation: "Noida Sector 62",
		endLocation: "Manesar Hub",
		trips: trips(20)
	},
	{
		id: "t21",
		company: "Delhi NCR Cargo",
		vehicleNo: "HR26DK5566",
		vehicleType: "Tanker",
		driver: "Mohan Lal",
		distance: 710.3,
		running: "13:10:40",
		idle: "02:55:00",
		stop: "07:54:20",
		avgSpeed: 58,
		maxSpeed: 93,
		tollCost: 400,
		alerts: 5,
		startLocation: "Panipat Refinery",
		endLocation: "Rewari Junction",
		trips: trips(21)
	},
	{
		id: "t22",
		company: "Hyderabad Logistics",
		vehicleNo: "TS07FA7788",
		vehicleType: "SUV",
		driver: "Venkatesh Rao",
		distance: 340.5,
		running: "06:45:15",
		idle: "01:15:20",
		stop: "15:59:25",
		avgSpeed: 50,
		maxSpeed: 82,
		tollCost: 165,
		alerts: 2,
		startLocation: "HITEC City",
		endLocation: "Secunderabad",
		trips: trips(22)
	},
	{
		id: "t23",
		company: "Hyderabad Logistics",
		vehicleNo: "TS09GB9900",
		vehicleType: "Truck",
		driver: "Srikanth M.",
		distance: 530.2,
		running: "09:50:00",
		idle: "02:10:45",
		stop: "11:59:15",
		avgSpeed: 54,
		maxSpeed: 88,
		tollCost: 280,
		alerts: 3,
		startLocation: "Shamshabad Depot",
		endLocation: "Warangal Highway",
		trips: trips(23)
	},
	{
		id: "t24",
		company: "Chennai Intercity",
		vehicleNo: "TN01HA1234",
		vehicleType: "Van",
		driver: "Murugan P.",
		distance: 260.4,
		running: "05:20:30",
		idle: "01:05:00",
		stop: "17:34:30",
		avgSpeed: 46,
		maxSpeed: 76,
		tollCost: 125,
		alerts: 1,
		startLocation: "Guindy Estate",
		endLocation: "Ennore Port",
		trips: trips(24)
	},
	{
		id: "t25",
		company: "Chennai Intercity",
		vehicleNo: "TN09JB5678",
		vehicleType: "Tanker",
		driver: "Selvam K.",
		distance: 615.8,
		running: "11:15:20",
		idle: "02:30:15",
		stop: "10:14:25",
		avgSpeed: 55,
		maxSpeed: 91,
		tollCost: 340,
		alerts: 6,
		startLocation: "Manali Petrochem",
		endLocation: "Coimbatore Depot",
		trips: trips(25)
	},
	{
		id: "t26",
		company: "Kolkata Freightways",
		vehicleNo: "WB01KA4321",
		vehicleType: "Truck",
		driver: "Sourav Roy",
		distance: 495,
		running: "09:30:00",
		idle: "02:00:30",
		stop: "12:29:30",
		avgSpeed: 50,
		maxSpeed: 81,
		tollCost: 250,
		alerts: 4,
		startLocation: "Howrah Logistics",
		endLocation: "Durgapur Steel Hub",
		trips: trips(26)
	},
	{
		id: "t27",
		company: "Kolkata Freightways",
		vehicleNo: "WB02LB8765",
		vehicleType: "Pickup",
		driver: "Bikas Ghosh",
		distance: 380.2,
		running: "07:40:10",
		idle: "01:35:00",
		stop: "14:44:50",
		avgSpeed: 48,
		maxSpeed: 78,
		tollCost: 190,
		alerts: 2,
		startLocation: "Salt Lake Sector 5",
		endLocation: "Siliguri Road",
		trips: trips(27)
	},
	{
		id: "t28",
		company: "Rajasthan Carriers",
		vehicleNo: "RJ14CA2468",
		vehicleType: "Truck",
		driver: "Mahipal Singh",
		distance: 670.5,
		running: "12:05:30",
		idle: "02:45:10",
		stop: "09:09:20",
		avgSpeed: 56,
		maxSpeed: 92,
		tollCost: 375,
		alerts: 5,
		startLocation: "Jaipur Sitapura",
		endLocation: "Jodhpur GIDC",
		trips: trips(28)
	},
	{
		id: "t29",
		company: "Rajasthan Carriers",
		vehicleNo: "RJ19DB1357",
		vehicleType: "Van",
		driver: "Dinesh Meena",
		distance: 215.6,
		running: "04:45:00",
		idle: "00:50:20",
		stop: "18:24:40",
		avgSpeed: 45,
		maxSpeed: 72,
		tollCost: 105,
		alerts: 1,
		startLocation: "Udaipur Depot",
		endLocation: "Bhilwara",
		trips: trips(29)
	},
	{
		id: "t30",
		company: "Swargate Division",
		vehicleNo: "MH12XY9999",
		vehicleType: "SUV",
		driver: "Sunil Shinde",
		distance: 325.8,
		running: "06:10:45",
		idle: "01:15:00",
		stop: "16:34:15",
		avgSpeed: 53,
		maxSpeed: 86,
		tollCost: 160,
		alerts: 3,
		startLocation: "Pune Airport",
		endLocation: "Mahabaleshwar",
		trips: trips(30)
	},
	{
		id: "t31",
		company: "Swargate Division",
		vehicleNo: "MH12PQ0011",
		vehicleType: "Truck",
		driver: "Amol Deshmukh",
		distance: 540.2,
		running: "10:15:00",
		idle: "02:05:30",
		stop: "11:39:30",
		avgSpeed: 53,
		maxSpeed: 87,
		tollCost: 290,
		alerts: 4,
		startLocation: "Hadapsar Depot",
		endLocation: "Solapur Hub",
		trips: trips(31)
	},
	{
		id: "t32",
		company: "Swargate Division",
		vehicleNo: "MH12RS2233",
		vehicleType: "Car",
		driver: "Prashant G.",
		distance: 165.4,
		running: "03:45:10",
		idle: "00:50:00",
		stop: "19:24:50",
		avgSpeed: 44,
		maxSpeed: 70,
		tollCost: 85,
		alerts: 1,
		startLocation: "Kothrud",
		endLocation: "Chakan MIDC",
		trips: trips(32)
	},
	{
		id: "t33",
		company: "Swargate Division",
		vehicleNo: "MH12TU4455",
		vehicleType: "Tanker",
		driver: "Rajesh Shirodkar",
		distance: 610.8,
		running: "11:20:00",
		idle: "02:45:15",
		stop: "09:54:45",
		avgSpeed: 55,
		maxSpeed: 89,
		tollCost: 330,
		alerts: 5,
		startLocation: "Bhosari GIDC",
		endLocation: "Ratnagiri Port",
		trips: trips(33)
	},
	{
		id: "t34",
		company: "Swargate Division",
		vehicleNo: "MH12VW6677",
		vehicleType: "Pickup",
		driver: "Nitin Jadhav",
		distance: 395.1,
		running: "07:50:20",
		idle: "01:30:00",
		stop: "14:39:40",
		avgSpeed: 50,
		maxSpeed: 83,
		tollCost: 195,
		alerts: 2,
		startLocation: "Katraj Depot",
		endLocation: "Satara MIDC",
		trips: trips(34)
	},
	{
		id: "t35",
		company: "Swargate Division",
		vehicleNo: "MH12ZA8899",
		vehicleType: "Van",
		driver: "Chetan More",
		distance: 240.6,
		running: "05:10:00",
		idle: "01:15:30",
		stop: "17:34:30",
		avgSpeed: 47,
		maxSpeed: 77,
		tollCost: 115,
		alerts: 3,
		startLocation: "Shivajinagar",
		endLocation: "Talegaon Hub",
		trips: trips(35)
	},
	{
		id: "t36",
		company: "Mumbai Metro Fleet",
		vehicleNo: "MH01BB1001",
		vehicleType: "Truck",
		driver: "Sameer Sheikh",
		distance: 480.5,
		running: "09:05:00",
		idle: "01:55:20",
		stop: "12:59:40",
		avgSpeed: 53,
		maxSpeed: 85,
		tollCost: 260,
		alerts: 3,
		startLocation: "Wadala Terminal",
		endLocation: "Nashik Phata",
		trips: trips(36)
	},
	{
		id: "t37",
		company: "Mumbai Metro Fleet",
		vehicleNo: "MH02CC2002",
		vehicleType: "SUV",
		driver: "Alok Verma",
		distance: 315.7,
		running: "06:25:30",
		idle: "01:05:00",
		stop: "16:29:30",
		avgSpeed: 49,
		maxSpeed: 81,
		tollCost: 155,
		alerts: 2,
		startLocation: "Bandra Kurla",
		endLocation: "Alibaug",
		trips: trips(37)
	},
	{
		id: "t38",
		company: "Mumbai Metro Fleet",
		vehicleNo: "MH03DD3003",
		vehicleType: "Tanker",
		driver: "Dhanraj Yadav",
		distance: 695.4,
		running: "12:50:00",
		idle: "02:35:10",
		stop: "08:34:50",
		avgSpeed: 57,
		maxSpeed: 93,
		tollCost: 410,
		alerts: 6,
		startLocation: "Chembur Dep",
		endLocation: "Surat Hazira",
		trips: trips(38)
	},
	{
		id: "t39",
		company: "Mumbai Metro Fleet",
		vehicleNo: "MH04EE4004",
		vehicleType: "Pickup",
		driver: "Sanjay Sawant",
		distance: 370.2,
		running: "07:35:15",
		idle: "01:25:00",
		stop: "14:59:45",
		avgSpeed: 49,
		maxSpeed: 79,
		tollCost: 185,
		alerts: 1,
		startLocation: "Thane Majiwada",
		endLocation: "Pune Pirangut",
		trips: trips(39)
	},
	{
		id: "t40",
		company: "Mumbai Metro Fleet",
		vehicleNo: "MH05FF5005",
		vehicleType: "Wagon",
		driver: "Akshay Kadam",
		distance: 280.9,
		running: "05:40:00",
		idle: "01:10:45",
		stop: "17:09:15",
		avgSpeed: 49,
		maxSpeed: 82,
		tollCost: 140,
		alerts: 2,
		startLocation: "Kalyan Hub",
		endLocation: "Panvel GIDC",
		trips: trips(40)
	},
	{
		id: "t41",
		company: "Gujarat Logistics",
		vehicleNo: "GJ01GG1111",
		vehicleType: "Truck",
		driver: "Hiren Patel",
		distance: 565.3,
		running: "10:30:00",
		idle: "02:10:00",
		stop: "11:20:00",
		avgSpeed: 54,
		maxSpeed: 88,
		tollCost: 310,
		alerts: 4,
		startLocation: "Naroda GIDC",
		endLocation: "Rajkot Shapar",
		trips: trips(41)
	},
	{
		id: "t42",
		company: "Gujarat Logistics",
		vehicleNo: "GJ03HH2222",
		vehicleType: "Car",
		driver: "Jayesh Joshi",
		distance: 195.8,
		running: "04:15:30",
		idle: "00:45:00",
		stop: "18:59:30",
		avgSpeed: 46,
		maxSpeed: 74,
		tollCost: 95,
		alerts: 0,
		startLocation: "Rajkot Aji MIDC",
		endLocation: "Morbi Ceramic",
		trips: trips(42)
	},
	{
		id: "t43",
		company: "Gujarat Logistics",
		vehicleNo: "GJ05JJ3333",
		vehicleType: "Tanker",
		driver: "Paresh Zala",
		distance: 640.2,
		running: "11:55:00",
		idle: "02:50:15",
		stop: "09:14:45",
		avgSpeed: 56,
		maxSpeed: 91,
		tollCost: 360,
		alerts: 5,
		startLocation: "Surat Sachin",
		endLocation: "Bhavnagar Hub",
		trips: trips(43)
	},
	{
		id: "t44",
		company: "Gujarat Logistics",
		vehicleNo: "GJ06KK4444",
		vehicleType: "Pickup",
		driver: "Tushar Rana",
		distance: 410.6,
		running: "08:10:20",
		idle: "01:40:00",
		stop: "14:09:40",
		avgSpeed: 50,
		maxSpeed: 82,
		tollCost: 205,
		alerts: 3,
		startLocation: "Vadodara Makarpura",
		endLocation: "Bharuch GIDC",
		trips: trips(44)
	},
	{
		id: "t45",
		company: "Gujarat Logistics",
		vehicleNo: "GJ21LL5555",
		vehicleType: "Truck",
		driver: "Bhavesh Dave",
		distance: 520.4,
		running: "09:45:00",
		idle: "02:00:10",
		stop: "12:14:50",
		avgSpeed: 53,
		maxSpeed: 86,
		tollCost: 285,
		alerts: 3,
		startLocation: "Navsari Depot",
		endLocation: "Ankleshwar",
		trips: trips(45)
	},
	{
		id: "t46",
		company: "Bangalore Express",
		vehicleNo: "KA01MM6666",
		vehicleType: "SUV",
		driver: "Girish Gowda",
		distance: 330.1,
		running: "06:35:00",
		idle: "01:10:00",
		stop: "16:15:00",
		avgSpeed: 50,
		maxSpeed: 80,
		tollCost: 160,
		alerts: 2,
		startLocation: "Koramangala",
		endLocation: "Mysore Highway",
		trips: trips(46)
	},
	{
		id: "t47",
		company: "Bangalore Express",
		vehicleNo: "KA03NN7777",
		vehicleType: "Truck",
		driver: "Nagaraj Rao",
		distance: 625.8,
		running: "11:40:00",
		idle: "02:30:30",
		stop: "09:49:30",
		avgSpeed: 55,
		maxSpeed: 89,
		tollCost: 350,
		alerts: 5,
		startLocation: "Hebbal Hub",
		endLocation: "Tumkur Industrial",
		trips: trips(47)
	},
	{
		id: "t48",
		company: "Bangalore Express",
		vehicleNo: "KA05PP8888",
		vehicleType: "Van",
		driver: "Ramesh Reddy",
		distance: 235.4,
		running: "05:00:15",
		idle: "01:05:00",
		stop: "17:54:45",
		avgSpeed: 47,
		maxSpeed: 75,
		tollCost: 110,
		alerts: 1,
		startLocation: "Jayanagar",
		endLocation: "Devenahalli Airport",
		trips: trips(48)
	},
	{
		id: "t49",
		company: "Bangalore Express",
		vehicleNo: "KA51QQ9999",
		vehicleType: "Tanker",
		driver: "Praveen Kumar",
		distance: 705.6,
		running: "13:00:00",
		idle: "02:40:00",
		stop: "08:20:00",
		avgSpeed: 58,
		maxSpeed: 94,
		tollCost: 415,
		alerts: 4,
		startLocation: "Bommasandra",
		endLocation: "Salem Steel Hub",
		trips: trips(49)
	},
	{
		id: "t50",
		company: "Delhi NCR Cargo",
		vehicleNo: "DL01RR1010",
		vehicleType: "Truck",
		driver: "Kuldeep Tanwar",
		distance: 490.2,
		running: "09:20:00",
		idle: "01:50:00",
		stop: "12:50:00",
		avgSpeed: 52,
		maxSpeed: 84,
		tollCost: 255,
		alerts: 4,
		startLocation: "Kashmiri Gate",
		endLocation: "Sonipat Kundli",
		trips: trips(50)
	},
	{
		id: "t51",
		company: "Delhi NCR Cargo",
		vehicleNo: "DL04SS2020",
		vehicleType: "SUV",
		driver: "Virender Sehrawat",
		distance: 345.8,
		running: "06:50:00",
		idle: "01:15:30",
		stop: "15:54:30",
		avgSpeed: 51,
		maxSpeed: 83,
		tollCost: 170,
		alerts: 2,
		startLocation: "Connaught Place",
		endLocation: "Agra Expressway",
		trips: trips(51)
	},
	{
		id: "t52",
		company: "Delhi NCR Cargo",
		vehicleNo: "HR55TT3030",
		vehicleType: "Tanker",
		driver: "Dharmendra Singh",
		distance: 660.4,
		running: "12:10:00",
		idle: "02:35:00",
		stop: "09:15:00",
		avgSpeed: 56,
		maxSpeed: 92,
		tollCost: 380,
		alerts: 6,
		startLocation: "Gurugram Udyog",
		endLocation: "Jaipur Highway",
		trips: trips(52)
	},
	{
		id: "t53",
		company: "Delhi NCR Cargo",
		vehicleNo: "UP16UU4040",
		vehicleType: "Pickup",
		driver: "Manoj Sharma",
		distance: 405.3,
		running: "08:00:00",
		idle: "01:30:15",
		stop: "14:29:45",
		avgSpeed: 51,
		maxSpeed: 81,
		tollCost: 200,
		alerts: 2,
		startLocation: "Noida Phase 2",
		endLocation: "Greater Noida Depot",
		trips: trips(53)
	},
	{
		id: "t54",
		company: "Hyderabad Logistics",
		vehicleNo: "TS08VV5050",
		vehicleType: "Truck",
		driver: "Bhadraiah G.",
		distance: 550.6,
		running: "10:15:30",
		idle: "02:10:00",
		stop: "11:34:30",
		avgSpeed: 54,
		maxSpeed: 87,
		tollCost: 300,
		alerts: 3,
		startLocation: "Patancheru GIDC",
		endLocation: "Nizamabad Hub",
		trips: trips(54)
	},
	{
		id: "t55",
		company: "Hyderabad Logistics",
		vehicleNo: "TS10WW6060",
		vehicleType: "Car",
		driver: "Kishore Chary",
		distance: 175.2,
		running: "03:55:00",
		idle: "00:50:00",
		stop: "19:15:00",
		avgSpeed: 45,
		maxSpeed: 71,
		tollCost: 80,
		alerts: 1,
		startLocation: "Banjara Hills",
		endLocation: "Gachibowli",
		trips: trips(55)
	},
	{
		id: "t56",
		company: "Hyderabad Logistics",
		vehicleNo: "TS11XX7070",
		vehicleType: "Tanker",
		driver: "Mallaiah K.",
		distance: 675.8,
		running: "12:30:00",
		idle: "02:45:00",
		stop: "08:45:00",
		avgSpeed: 57,
		maxSpeed: 93,
		tollCost: 395,
		alerts: 5,
		startLocation: "Cherlapally",
		endLocation: "Vijayawada Auto Nagar",
		trips: trips(56)
	},
	{
		id: "t57",
		company: "Chennai Intercity",
		vehicleNo: "TN02YY8080",
		vehicleType: "Truck",
		driver: "Sundaramurthy",
		distance: 510.4,
		running: "09:40:00",
		idle: "01:55:00",
		stop: "12:25:00",
		avgSpeed: 53,
		maxSpeed: 85,
		tollCost: 275,
		alerts: 4,
		startLocation: "Ambattur Estate",
		endLocation: "Tiruchirappalli Hub",
		trips: trips(57)
	},
	{
		id: "t58",
		company: "Chennai Intercity",
		vehicleNo: "TN04ZZ9090",
		vehicleType: "SUV",
		driver: "Karthik Raja",
		distance: 320.6,
		running: "06:20:00",
		idle: "01:05:00",
		stop: "16:35:00",
		avgSpeed: 51,
		maxSpeed: 82,
		tollCost: 155,
		alerts: 2,
		startLocation: "T. Nagar Depot",
		endLocation: "Puducherry Port",
		trips: trips(58)
	},
	{
		id: "t59",
		company: "Kolkata Freightways",
		vehicleNo: "WB04AA1212",
		vehicleType: "Tanker",
		driver: "Debashis Sen",
		distance: 650.2,
		running: "12:00:00",
		idle: "02:30:00",
		stop: "09:30:00",
		avgSpeed: 56,
		maxSpeed: 90,
		tollCost: 370,
		alerts: 5,
		startLocation: "Haldia Petrochem",
		endLocation: "Kharagpur Hub",
		trips: trips(59)
	},
	{
		id: "t60",
		company: "Kolkata Freightways",
		vehicleNo: "WB06BB3434",
		vehicleType: "Wagon",
		driver: "Pranab Mukherjee",
		distance: 270.8,
		running: "05:30:00",
		idle: "01:10:00",
		stop: "17:20:00",
		avgSpeed: 49,
		maxSpeed: 78,
		tollCost: 135,
		alerts: 2,
		startLocation: "Taratala Hub",
		endLocation: "Barasat Depot",
		trips: trips(60)
	},
	{
		id: "t61",
		company: "Rajasthan Carriers",
		vehicleNo: "RJ14CC5656",
		vehicleType: "SUV",
		driver: "Bhanwar Lal",
		distance: 355.4,
		running: "07:05:00",
		idle: "01:20:00",
		stop: "15:35:00",
		avgSpeed: 50,
		maxSpeed: 83,
		tollCost: 175,
		alerts: 3,
		startLocation: "Ajmer Road Jaipur",
		endLocation: "Bikaner Industrial",
		trips: trips(61)
	},
	{
		id: "t62",
		company: "Rajasthan Carriers",
		vehicleNo: "RJ27DD7878",
		vehicleType: "Truck",
		driver: "Kailash Choudhary",
		distance: 630.9,
		running: "11:50:00",
		idle: "02:40:00",
		stop: "09:30:00",
		avgSpeed: 55,
		maxSpeed: 89,
		tollCost: 355,
		alerts: 4,
		startLocation: "Udaipur Sukher",
		endLocation: "Kota Chemical Zone",
		trips: trips(62)
	},
	{
		id: "t63",
		company: "Swargate Division",
		vehicleNo: "MH12EE9090",
		vehicleType: "Truck",
		driver: "Vilas Gaikwad",
		distance: 475.2,
		running: "08:55:00",
		idle: "01:45:00",
		stop: "13:20:00",
		avgSpeed: 53,
		maxSpeed: 84,
		tollCost: 250,
		alerts: 3,
		startLocation: "Chakan Phase 2",
		endLocation: "Solapur bypass",
		trips: trips(63)
	},
	{
		id: "t64",
		company: "Swargate Division",
		vehicleNo: "MH12FF0101",
		vehicleType: "SUV",
		driver: "Nilesh Shinde",
		distance: 305.8,
		running: "06:05:00",
		idle: "01:10:00",
		stop: "16:45:00",
		avgSpeed: 50,
		maxSpeed: 81,
		tollCost: 150,
		alerts: 1,
		startLocation: "Wagholi Hub",
		endLocation: "Baramati MIDC",
		trips: trips(64)
	},
	{
		id: "t65",
		company: "Swargate Division",
		vehicleNo: "MH12GG0202",
		vehicleType: "Van",
		driver: "Santosh Pawar",
		distance: 220.5,
		running: "04:40:00",
		idle: "00:55:00",
		stop: "18:25:00",
		avgSpeed: 47,
		maxSpeed: 75,
		tollCost: 105,
		alerts: 2,
		startLocation: "Camp Pune",
		endLocation: "Daund Junction",
		trips: trips(65)
	}
];
//#endregion
export { eventTypes as a, highlightEvents as c, travelRows as d, cameraStatus as i, riskyDrivers as l, STATUS_META as n, fleetObjects as o, bucketColor as r, fleetScore as s, RANGE_LABEL as t, scoreDistribution as u };
