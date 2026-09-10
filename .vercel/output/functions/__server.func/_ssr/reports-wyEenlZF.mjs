//#region node_modules/.nitro/vite/services/ssr/assets/reports-wyEenlZF.js
var CHART_CATEGORIES = [
	{
		category: "activity",
		label: "Activity",
		items: [
			{
				id: "distance",
				label: "Distance",
				metric: "distance",
				unit: "km",
				range: [40, 620],
				category: "activity",
				categoryLabel: "Activity"
			},
			{
				id: "duration",
				label: "Duration",
				metric: "duration",
				unit: "hrs",
				range: [2, 12],
				category: "activity",
				categoryLabel: "Activity"
			},
			{
				id: "speed",
				label: "Speed Vs Time",
				metric: "speed",
				unit: "km/h",
				range: [20, 110],
				category: "activity",
				categoryLabel: "Activity"
			},
			{
				id: "battery_voltage",
				label: "Battery Voltage",
				metric: "battery_voltage",
				unit: "V",
				range: [11.8, 14.4],
				category: "activity",
				categoryLabel: "Activity"
			},
			{
				id: "workhour",
				label: "Object Work Hour",
				metric: "workhour",
				unit: "hrs",
				range: [3, 10],
				category: "activity",
				categoryLabel: "Activity"
			},
			{
				id: "battery_percentage",
				label: "Battery Percentage",
				metric: "battery_percentage",
				unit: "%",
				range: [40, 100],
				category: "activity",
				categoryLabel: "Activity"
			},
			{
				id: "heatmap",
				label: "Heat Map",
				metric: "heatmap",
				unit: "pts",
				range: [10, 95],
				category: "activity",
				categoryLabel: "Activity"
			},
			{
				id: "object_workhour",
				label: "Object Wise Work Hour",
				metric: "object_workhour",
				unit: "hrs",
				range: [4, 11],
				category: "activity",
				categoryLabel: "Activity"
			}
		]
	},
	{
		category: "alert",
		label: "Alert",
		items: [
			{
				id: "alerts",
				label: "Alert Summary",
				metric: "alerts",
				unit: "count",
				range: [1, 20],
				category: "alert",
				categoryLabel: "Alert"
			},
			{
				id: "overspeed_alert",
				label: "Over Speed Alert",
				metric: "overspeed_alert",
				unit: "count",
				range: [0, 15],
				category: "alert",
				categoryLabel: "Alert"
			},
			{
				id: "geofence_alert",
				label: "Geofence Alert",
				metric: "geofence_alert",
				unit: "count",
				range: [0, 8],
				category: "alert",
				categoryLabel: "Alert"
			},
			{
				id: "harsh_brake",
				label: "Harsh Braking",
				metric: "harsh_brake",
				unit: "count",
				range: [0, 12],
				category: "alert",
				categoryLabel: "Alert"
			},
			{
				id: "harsh_accel",
				label: "Harsh Acceleration",
				metric: "harsh_accel",
				unit: "count",
				range: [0, 9],
				category: "alert",
				categoryLabel: "Alert"
			},
			{
				id: "panic_alert",
				label: "Panic Alert",
				metric: "panic_alert",
				unit: "count",
				range: [0, 3],
				category: "alert",
				categoryLabel: "Alert"
			}
		]
	},
	{
		category: "fuel",
		label: "Fuel",
		items: [
			{
				id: "fuel-fill-drain",
				label: "Fuel Fill-Drain",
				metric: "fuel-fill-drain",
				unit: "ltr",
				range: [20, 180],
				category: "fuel",
				categoryLabel: "Fuel"
			},
			{
				id: "fuel_consumption",
				label: "Fuel Consumption",
				metric: "fuel_consumption",
				unit: "ltr/100km",
				range: [18, 38],
				category: "fuel",
				categoryLabel: "Fuel"
			},
			{
				id: "fuel_theft",
				label: "Fuel Theft",
				metric: "fuel_theft",
				unit: "ltr",
				range: [0, 25],
				category: "fuel",
				categoryLabel: "Fuel"
			},
			{
				id: "fuel_daily",
				label: "Daily Fuel Summary",
				metric: "fuel_daily",
				unit: "ltr",
				range: [40, 220],
				category: "fuel",
				categoryLabel: "Fuel"
			}
		]
	},
	{
		category: "adblue",
		label: "AdBlue",
		items: [{
			id: "adblue_level",
			label: "AdBlue Level",
			metric: "adblue_level",
			unit: "%",
			range: [15, 100],
			category: "adblue",
			categoryLabel: "AdBlue"
		}, {
			id: "adblue_consumption",
			label: "AdBlue Consumption",
			metric: "adblue_consumption",
			unit: "ltr",
			range: [2, 18],
			category: "adblue",
			categoryLabel: "AdBlue"
		}]
	},
	{
		category: "expense",
		label: "Expense",
		items: [
			{
				id: "fuel_expense",
				label: "Fuel Expense",
				metric: "fuel_expense",
				unit: "₹",
				range: [2500, 18e3],
				category: "expense",
				categoryLabel: "Expense"
			},
			{
				id: "maintenance_expense",
				label: "Maintenance Expense",
				metric: "maintenance_expense",
				unit: "₹",
				range: [1200, 9500],
				category: "expense",
				categoryLabel: "Expense"
			},
			{
				id: "toll_expense",
				label: "Toll Expense",
				metric: "toll_expense",
				unit: "₹",
				range: [400, 3200],
				category: "expense",
				categoryLabel: "Expense"
			}
		]
	},
	{
		category: "tire",
		label: "Tire",
		items: [
			{
				id: "tire_pressure",
				label: "Tire Pressure",
				metric: "tire_pressure",
				unit: "psi",
				range: [90, 130],
				category: "tire",
				categoryLabel: "Tire"
			},
			{
				id: "tire_temperature",
				label: "Tire Temperature",
				metric: "tire_temperature",
				unit: "°C",
				range: [35, 78],
				category: "tire",
				categoryLabel: "Tire"
			},
			{
				id: "axle_summary",
				label: "Axle Summary",
				metric: "axle_summary",
				unit: "psi",
				range: [95, 125],
				category: "tire",
				categoryLabel: "Tire"
			}
		]
	},
	{
		category: "temperature",
		label: "Temperature",
		items: [
			{
				id: "temp_sensor_1",
				label: "Temperature Sensor 1",
				metric: "temp_sensor_1",
				unit: "°C",
				range: [-18, 8],
				category: "temperature",
				categoryLabel: "Temperature"
			},
			{
				id: "temp_sensor_2",
				label: "Temperature Sensor 2",
				metric: "temp_sensor_2",
				unit: "°C",
				range: [-22, 4],
				category: "temperature",
				categoryLabel: "Temperature"
			},
			{
				id: "multi_temp",
				label: "Multi-Sensor Trend",
				metric: "multi_temp",
				unit: "°C",
				range: [-20, 10],
				category: "temperature",
				categoryLabel: "Temperature"
			}
		]
	},
	{
		category: "load",
		label: "Load",
		items: [
			{
				id: "axle_load",
				label: "Axle Load",
				metric: "axle_load",
				unit: "ton",
				range: [6, 28],
				category: "load",
				categoryLabel: "Load"
			},
			{
				id: "payload_trend",
				label: "Payload Trend",
				metric: "payload_trend",
				unit: "ton",
				range: [10, 35],
				category: "load",
				categoryLabel: "Load"
			},
			{
				id: "overload_summary",
				label: "Overload Summary",
				metric: "overload_summary",
				unit: "count",
				range: [0, 6],
				category: "load",
				categoryLabel: "Load"
			}
		]
	},
	{
		category: "pressure_gauge",
		label: "Pressure Gauge",
		items: [{
			id: "oil_pressure",
			label: "Oil Pressure",
			metric: "oil_pressure",
			unit: "bar",
			range: [2.5, 6.8],
			category: "pressure_gauge",
			categoryLabel: "Pressure Gauge"
		}, {
			id: "air_pressure",
			label: "Air Pressure",
			metric: "air_pressure",
			unit: "bar",
			range: [6, 9.5],
			category: "pressure_gauge",
			categoryLabel: "Pressure Gauge"
		}]
	},
	{
		category: "rotation",
		label: "Rotation",
		items: [
			{
				id: "drum_rotation",
				label: "Drum Rotation",
				metric: "drum_rotation",
				unit: "RPM",
				range: [4, 22],
				category: "rotation",
				categoryLabel: "Rotation"
			},
			{
				id: "rotation_direction",
				label: "Rotation Direction",
				metric: "rotation_direction",
				unit: "RPM",
				range: [-16, 18],
				category: "rotation",
				categoryLabel: "Rotation"
			},
			{
				id: "rotation_work_hour",
				label: "Rotation Work Hours",
				metric: "rotation_work_hour",
				unit: "hrs",
				range: [2, 9],
				category: "rotation",
				categoryLabel: "Rotation"
			}
		]
	},
	{
		category: "bms",
		label: "BMS",
		items: [
			{
				id: "bms_soc",
				label: "State of Charge (SOC)",
				metric: "bms_soc",
				unit: "%",
				range: [20, 100],
				category: "bms",
				categoryLabel: "BMS"
			},
			{
				id: "bms_soh",
				label: "State of Health (SOH)",
				metric: "bms_soh",
				unit: "%",
				range: [85, 100],
				category: "bms",
				categoryLabel: "BMS"
			},
			{
				id: "bms_cell_voltage",
				label: "Cell Voltage",
				metric: "bms_cell_voltage",
				unit: "V",
				range: [3.2, 4.2],
				category: "bms",
				categoryLabel: "BMS"
			},
			{
				id: "bms_cell_temp",
				label: "Cell Temperature",
				metric: "bms_cell_temp",
				unit: "°C",
				range: [24, 46],
				category: "bms",
				categoryLabel: "BMS"
			}
		]
	},
	{
		category: "rpm",
		label: "RPM",
		items: [{
			id: "engine_rpm",
			label: "Engine RPM",
			metric: "engine_rpm",
			unit: "RPM",
			range: [650, 2600],
			category: "rpm",
			categoryLabel: "RPM"
		}, {
			id: "idle_rpm",
			label: "Idle RPM",
			metric: "idle_rpm",
			unit: "RPM",
			range: [600, 950],
			category: "rpm",
			categoryLabel: "RPM"
		}]
	},
	{
		category: "depth",
		label: "Depth",
		items: [{
			id: "depth_level",
			label: "Depth Level",
			metric: "depth_level",
			unit: "m",
			range: [.5, 14],
			category: "depth",
			categoryLabel: "Depth"
		}, {
			id: "water_level",
			label: "Water Level",
			metric: "water_level",
			unit: "%",
			range: [10, 98],
			category: "depth",
			categoryLabel: "Depth"
		}]
	},
	{
		category: "flow_meter",
		label: "Flow Meter",
		items: [{
			id: "flow_rate",
			label: "Flow Rate",
			metric: "flow_rate",
			unit: "L/min",
			range: [12, 145],
			category: "flow_meter",
			categoryLabel: "Flow Meter"
		}, {
			id: "total_flow",
			label: "Total Flow",
			metric: "total_flow",
			unit: "kL",
			range: [2.5, 48],
			category: "flow_meter",
			categoryLabel: "Flow Meter"
		}]
	}
];
function findChartItem(id) {
	for (const cat of CHART_CATEGORIES) {
		const found = cat.items.find((i) => i.id === id);
		if (found) return found;
	}
}
var CHART_VEHICLES = [
	"GJ15MM2654",
	"MH12AB1234",
	"MH11GH3456",
	"MH12CD5678",
	"MH14EF9012",
	"MH12JK1313"
];
function rng(seed) {
	let a = seed >>> 0;
	return () => {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
var hash = (s) => [...s].reduce((h, c) => h * 31 + c.charCodeAt(0) | 0, 7);
var round2 = (n) => Math.round(n * 100) / 100;
function getRangeForChart(chartId) {
	const item = findChartItem(chartId);
	return item ? item.range : [10, 100];
}
/** Level 0 — one value per vehicle for any chart. */
function objectLevelData(chartId) {
	const [min, max] = getRangeForChart(chartId);
	return CHART_VEHICLES.map((v, i) => {
		const r = rng(hash(v + chartId));
		return {
			name: v,
			value: round2(min + r() * (max - min)),
			sr: i + 1
		};
	});
}
var DAILY_DATES = [
	"04-12-2024",
	"05-12-2024",
	"06-12-2024",
	"07-12-2024",
	"08-12-2024",
	"09-12-2024",
	"10-12-2024"
];
/** Level 1 — one value per day for a vehicle. */
function dailyLevelData(chartId, vehicle) {
	const [min, max] = getRangeForChart(chartId);
	return DAILY_DATES.map((d) => {
		const r = rng(hash(vehicle + d + chartId));
		return {
			name: d,
			value: round2(min + r() * (max - min))
		};
	});
}
var pad = (n) => String(n).padStart(2, "0");
/** Level 2 — one value per working hour for a vehicle+day. */
function hourlyLevelData(chartId, vehicle, date) {
	const [min, max] = getRangeForChart(chartId);
	return Array.from({ length: 12 }, (_, i) => {
		const r = rng(hash(vehicle + date + chartId + i));
		return {
			name: `${pad(7 + i)}:00`,
			value: round2(min * .4 + r() * (max - min * .4))
		};
	});
}
function fuelSeries(vehicle) {
	const r = rng(hash(vehicle + "fuel"));
	let fuel = 62;
	return Array.from({ length: 48 }, (_, i) => {
		const hour = 6 + Math.floor(i / 2);
		const ignition = hour >= 22 || hour < 6 ? 0 : r() > .15 ? 1 : 0;
		if (ignition === 1) fuel = Math.max(8, fuel - r() * 1.4);
		if (i === 14 || i === 34) fuel = Math.min(90, fuel + 22 + r() * 8);
		if (i === 26) fuel = Math.max(8, fuel - 14);
		const speed = ignition === 1 ? Math.round(r() * 72) : 0;
		return {
			time: `${pad(hour)}:${i % 2 === 0 ? "00" : "30"}`,
			fuel: round2(fuel),
			fuelRaw: round2(fuel + (r() - .5) * 2.4),
			ignition,
			speed,
			power: 1
		};
	});
}
function fuelEvents(series) {
	const events = [];
	for (let i = 1; i < series.length; i++) {
		const diff = series[i].fuel - series[i - 1].fuel;
		if (diff > 5 || diff < -5) events.push({
			id: `fe${i}`,
			start: series[i - 1].time,
			end: series[i].time,
			type: diff > 0 ? "Fill" : "Drain",
			volume: round2(Math.abs(diff)),
			valid: diff > 0 ? series[i].ignition === 0 || true : series[i].ignition === 0
		});
	}
	return events;
}
/** All 23 categories from the Trakzee Reports Menu Tree */
var REPORT_CATEGORIES = [
	{
		category: "activity",
		label: "Activity",
		items: [
			{
				id: "today-activity",
				name: "Today Activity",
				category: "Activity",
				to: "/report?type=today-activity"
			},
			{
				id: "travel",
				name: "Travel",
				category: "Activity",
				to: "/report?type=travel"
			},
			{
				id: "travel-history",
				name: "Travel History",
				category: "Activity",
				to: "/report?type=travel-history"
			},
			{
				id: "trip",
				name: "Trip",
				category: "Activity",
				to: "/report?type=trip"
			},
			{
				id: "stoppage",
				name: "Stoppage",
				category: "Activity",
				to: "/report?type=stoppage"
			},
			{
				id: "idle",
				name: "Idle",
				category: "Activity",
				to: "/report?type=idle"
			},
			{
				id: "inactive",
				name: "Inactive",
				category: "Activity",
				to: "/report?type=inactive"
			},
			{
				id: "live-matrix",
				name: "Live Matrix",
				category: "Activity",
				to: "/report?type=live-matrix"
			},
			{
				id: "object-efficiency",
				name: "Object Efficiency",
				category: "Activity",
				to: "/report?type=object-efficiency"
			},
			{
				id: "speed-vs-distance",
				name: "Speed vs Distance",
				category: "Activity",
				to: "/report?type=speed-vs-distance"
			},
			{
				id: "status-summary",
				name: "Status Summary",
				category: "Activity",
				to: "/report?type=status-summary"
			},
			{
				id: "object-status",
				name: "Object Status",
				category: "Activity",
				to: "/report?type=object-status"
			},
			{
				id: "object-battery-status",
				name: "Object Battery Status",
				category: "Activity",
				to: "/report?type=object-battery-status"
			},
			{
				id: "daywise-distance",
				name: "Daywise Distance",
				category: "Activity",
				to: "/report?type=daywise-distance"
			},
			{
				id: "work-hour-summary",
				name: "Work Hour Summary",
				category: "Activity",
				to: "/report?type=work-hour-summary"
			},
			{
				id: "overspeed-summary",
				name: "Overspeed Summary",
				category: "Activity",
				to: "/report?type=overspeed-summary"
			},
			{
				id: "utilization-report",
				name: "Utilization Report",
				category: "Activity",
				to: "/report?type=utilization-report"
			},
			{
				id: "daywise-work-hour",
				name: "Daywise Work Hour",
				category: "Activity",
				to: "/report?type=daywise-work-hour"
			},
			{
				id: "object-location",
				name: "Object Location",
				category: "Activity",
				to: "/report?type=object-location"
			},
			{
				id: "object-violation",
				name: "Object Violation",
				category: "Activity",
				to: "/report?type=object-violation"
			},
			{
				id: "object-location-duration",
				name: "Object Location Duration",
				category: "Activity",
				to: "/report?type=object-location-duration"
			},
			{
				id: "daily-hourly-utilization",
				name: "Daily - Hourly Utilization",
				category: "Activity",
				to: "/report?type=daily-hourly-utilization"
			}
		]
	},
	{
		category: "geofence_address",
		label: "Geofence-Address",
		items: [
			{
				id: "geofence-in-out",
				name: "Geofence In/Out",
				category: "Geofence-Address",
				to: "/report?type=geofence-in-out"
			},
			{
				id: "geofence-duration",
				name: "Geofence Duration",
				category: "Geofence-Address",
				to: "/report?type=geofence-duration"
			},
			{
				id: "geofence-detail",
				name: "Geofence Detail",
				category: "Geofence-Address",
				to: "/report?type=geofence-detail"
			},
			{
				id: "address-summary",
				name: "Address Summary",
				category: "Geofence-Address",
				to: "/report?type=address-summary"
			},
			{
				id: "landmark-in-out",
				name: "Landmark In/Out",
				category: "Geofence-Address",
				to: "/report?type=landmark-in-out"
			}
		]
	},
	{
		category: "sensor",
		label: "Sensor",
		items: [
			{
				id: "sensor-summary",
				name: "Sensor Summary",
				category: "Sensor",
				to: "/report?type=sensor-summary"
			},
			{
				id: "digital-sensor",
				name: "Digital Sensor",
				category: "Sensor",
				to: "/report?type=digital-sensor"
			},
			{
				id: "analog-sensor",
				name: "Analog Sensor",
				category: "Sensor",
				to: "/report?type=analog-sensor"
			},
			{
				id: "ble-sensor",
				name: "BLE Sensor",
				category: "Sensor",
				to: "/report?type=ble-sensor"
			}
		]
	},
	{
		category: "alert",
		label: "Alert",
		items: [
			{
				id: "alert-summary",
				name: "Alert Summary",
				category: "Alert",
				to: "/report?type=alert-summary"
			},
			{
				id: "sos-alert",
				name: "SOS Alert",
				category: "Alert",
				to: "/report?type=sos-alert"
			},
			{
				id: "geofence-alert",
				name: "Geofence Alert",
				category: "Alert",
				to: "/report?type=geofence-alert"
			},
			{
				id: "overspeed-alert",
				name: "Overspeed Alert",
				category: "Alert",
				to: "/report?type=overspeed-alert"
			},
			{
				id: "parking-alert",
				name: "Parking Alert",
				category: "Alert",
				to: "/report?type=parking-alert"
			},
			{
				id: "power-cut-alert",
				name: "Power Cut Alert",
				category: "Alert",
				to: "/report?type=power-cut-alert"
			}
		]
	},
	{
		category: "reminder",
		label: "Reminder",
		items: [
			{
				id: "maintenance-reminder",
				name: "Maintenance Reminder",
				category: "Reminder",
				to: "/report?type=maintenance-reminder"
			},
			{
				id: "insurance-renewal",
				name: "Insurance Renewal",
				category: "Reminder",
				to: "/report?type=insurance-renewal"
			},
			{
				id: "fitness-certificate",
				name: "Fitness Certificate",
				category: "Reminder",
				to: "/report?type=fitness-certificate"
			},
			{
				id: "service-due",
				name: "Service Due",
				category: "Reminder",
				to: "/report?type=service-due"
			}
		]
	},
	{
		category: "expense",
		label: "Expense",
		items: [
			{
				id: "expense-summary",
				name: "Expense Summary",
				category: "Expense",
				to: "/report?type=expense-summary"
			},
			{
				id: "fuel-expense",
				name: "Fuel Expense",
				category: "Expense",
				to: "/report?type=fuel-expense"
			},
			{
				id: "toll-expense",
				name: "Toll Expense",
				category: "Expense",
				to: "/report?type=toll-expense"
			},
			{
				id: "driver-allowance",
				name: "Driver Allowance",
				category: "Expense",
				to: "/report?type=driver-allowance"
			}
		]
	},
	{
		category: "fuel",
		label: "Fuel",
		items: [
			{
				id: "fuel-summary",
				name: "Fuel Summary",
				category: "Fuel",
				to: "/report?type=fuel-summary"
			},
			{
				id: "fuel-consumption",
				name: "Fuel Consumption",
				category: "Fuel",
				to: "/report?type=fuel-consumption"
			},
			{
				id: "fuel-refill-drain",
				name: "Fuel Refill & Drain",
				category: "Fuel",
				to: "/report?type=fuel-refill-drain"
			},
			{
				id: "fuel-mileage",
				name: "Fuel Mileage",
				category: "Fuel",
				to: "/report?type=fuel-mileage"
			}
		]
	},
	{
		category: "adblue",
		label: "AdBlue",
		items: [
			{
				id: "adblue-level",
				name: "AdBlue Level",
				category: "AdBlue",
				to: "/report?type=adblue-level"
			},
			{
				id: "adblue-consumption",
				name: "AdBlue Consumption",
				category: "AdBlue",
				to: "/report?type=adblue-consumption"
			},
			{
				id: "adblue-refill",
				name: "AdBlue Refill",
				category: "AdBlue",
				to: "/report?type=adblue-refill"
			}
		]
	},
	{
		category: "rpm",
		label: "RPM",
		items: [
			{
				id: "rpm-summary",
				name: "RPM Summary",
				category: "RPM",
				to: "/report?type=rpm-summary"
			},
			{
				id: "rpm-vs-speed",
				name: "RPM vs Speed",
				category: "RPM",
				to: "/report?type=rpm-vs-speed"
			},
			{
				id: "excessive-rpm-duration",
				name: "Excessive RPM Duration",
				category: "RPM",
				to: "/report?type=excessive-rpm-duration"
			}
		]
	},
	{
		category: "temperature",
		label: "Temperature",
		items: [
			{
				id: "temperature",
				name: "Temperature Summary",
				category: "Temperature",
				to: "/report?type=temperature"
			},
			{
				id: "multi-sensor-temperature",
				name: "Multi-Sensor Temperature",
				category: "Temperature",
				to: "/report?type=multi-sensor-temperature"
			},
			{
				id: "cold-storage-logs",
				name: "Cold Storage Logs",
				category: "Temperature",
				to: "/report?type=cold-storage-logs"
			},
			{
				id: "temperature-violation",
				name: "Temperature Violation",
				category: "Temperature",
				to: "/report?type=temperature-violation"
			}
		]
	},
	{
		category: "job",
		label: "Job",
		items: [
			{
				id: "job",
				name: "Driver Job Summary",
				category: "Job",
				to: "/report?type=job"
			},
			{
				id: "job-status",
				name: "Job Status",
				category: "Job",
				to: "/report?type=job-status"
			},
			{
				id: "delivery-timeline",
				name: "Delivery Timeline",
				category: "Job",
				to: "/report?type=delivery-timeline"
			},
			{
				id: "route-deviation",
				name: "Route Deviation",
				category: "Job",
				to: "/report?type=route-deviation"
			}
		]
	},
	{
		category: "elock",
		label: "Elock",
		items: [
			{
				id: "elock-status",
				name: "E-Lock Status",
				category: "Elock",
				to: "/report?type=elock-status"
			},
			{
				id: "lock-unlock-logs",
				name: "Lock/Unlock Logs",
				category: "Elock",
				to: "/report?type=lock-unlock-logs"
			},
			{
				id: "tamper-alerts",
				name: "Tamper Alerts",
				category: "Elock",
				to: "/report?type=tamper-alerts"
			}
		]
	},
	{
		category: "tire",
		label: "Tire",
		items: [
			{
				id: "tire-pressure-summary",
				name: "Tire Pressure Summary",
				category: "Tire",
				to: "/report?type=tire-pressure-summary"
			},
			{
				id: "tire-temperature",
				name: "Tire Temperature",
				category: "Tire",
				to: "/report?type=tire-temperature"
			},
			{
				id: "tpms-health",
				name: "TPMS Sensor Health",
				category: "Tire",
				to: "/report?type=tpms-health"
			}
		]
	},
	{
		category: "driver",
		label: "Driver",
		items: [
			{
				id: "driver-performance",
				name: "Driver Performance",
				category: "Driver",
				to: "/report?type=driver-performance"
			},
			{
				id: "driver-behavior",
				name: "Driver Behavior",
				category: "Driver",
				to: "/report?type=driver-behavior"
			},
			{
				id: "driver-duty-hours",
				name: "Driver Duty Hours",
				category: "Driver",
				to: "/report?type=driver-duty-hours"
			},
			{
				id: "driver-leaderboard",
				name: "Driver Leaderboard",
				category: "Driver",
				to: "/report?type=driver-leaderboard"
			}
		]
	},
	{
		category: "obd",
		label: "OBD",
		items: [
			{
				id: "obd-codes",
				name: "OBD Diagnostic DTCs",
				category: "OBD",
				to: "/report?type=obd-codes"
			},
			{
				id: "engine-load",
				name: "Engine Load",
				category: "OBD",
				to: "/report?type=engine-load"
			},
			{
				id: "coolant-temp",
				name: "Coolant Temperature",
				category: "OBD",
				to: "/report?type=coolant-temp"
			}
		]
	},
	{
		category: "trip_classification",
		label: "Trip Classification",
		items: [{
			id: "classified-trip-summary",
			name: "Classified Trip Summary",
			category: "Trip Classification",
			to: "/report?type=classified-trip-summary"
		}, {
			id: "business-vs-personal",
			name: "Business vs Personal Trips",
			category: "Trip Classification",
			to: "/report?type=business-vs-personal"
		}]
	},
	{
		category: "billing",
		label: "Billing",
		items: [
			{
				id: "billing-summary",
				name: "Customer Billing Summary",
				category: "Billing",
				to: "/report?type=billing-summary"
			},
			{
				id: "distance-invoicing",
				name: "Distance Invoicing",
				category: "Billing",
				to: "/report?type=distance-invoicing"
			},
			{
				id: "toll-bill-summary",
				name: "Toll Bill Summary",
				category: "Billing",
				to: "/report?type=toll-bill-summary"
			}
		]
	},
	{
		category: "load",
		label: "Load",
		items: [
			{
				id: "axle-load-summary",
				name: "Axle Load Summary",
				category: "Load",
				to: "/report?type=axle-load-summary"
			},
			{
				id: "overload-alerts",
				name: "Overload Alerts",
				category: "Load",
				to: "/report?type=overload-alerts"
			},
			{
				id: "weight-sensor-log",
				name: "Weight Sensor Log",
				category: "Load",
				to: "/report?type=weight-sensor-log"
			}
		]
	},
	{
		category: "customized",
		label: "Customized",
		items: [{
			id: "scheduled-custom-summary",
			name: "Scheduled Custom Summary",
			category: "Customized",
			to: "/report?type=scheduled-custom-summary"
		}, {
			id: "branch-consolidated",
			name: "Multi-Branch Consolidated",
			category: "Customized",
			to: "/report?type=branch-consolidated"
		}]
	},
	{
		category: "logs",
		label: "Logs",
		items: [
			{
				id: "system-audit-logs",
				name: "System Audit Logs",
				category: "Logs",
				to: "/report?type=system-audit-logs"
			},
			{
				id: "user-activity",
				name: "User Activity Log",
				category: "Logs",
				to: "/report?type=user-activity"
			},
			{
				id: "raw-data-logs",
				name: "Device Raw Data Logs",
				category: "Logs",
				to: "/report?type=raw-data-logs"
			}
		]
	},
	{
		category: "kpi",
		label: "KPI",
		items: [
			{
				id: "fleet-utilization-kpi",
				name: "Fleet Utilization KPI",
				category: "KPI",
				to: "/report?type=fleet-utilization-kpi"
			},
			{
				id: "safety-index-kpi",
				name: "Safety Index KPI",
				category: "KPI",
				to: "/report?type=safety-index-kpi"
			},
			{
				id: "fuel-score-kpi",
				name: "Fuel Score KPI",
				category: "KPI",
				to: "/report?type=fuel-score-kpi"
			}
		]
	},
	{
		category: "hardware_maintenance",
		label: "Hardware Maintenance",
		items: [
			{
				id: "device-health",
				name: "Device Health",
				category: "Hardware Maintenance",
				to: "/report?type=device-health"
			},
			{
				id: "battery-health",
				name: "Battery Health",
				category: "Hardware Maintenance",
				to: "/report?type=battery-health"
			},
			{
				id: "sim-status",
				name: "SIM Status",
				category: "Hardware Maintenance",
				to: "/report?type=sim-status"
			},
			{
				id: "gps-accuracy",
				name: "GPS Accuracy",
				category: "Hardware Maintenance",
				to: "/report?type=gps-accuracy"
			}
		]
	},
	{
		category: "employee",
		label: "Employee",
		items: [
			{
				id: "employee-attendance",
				name: "Employee Attendance",
				category: "Employee",
				to: "/report?type=employee-attendance"
			},
			{
				id: "shift-duty",
				name: "Shift Duty",
				category: "Employee",
				to: "/report?type=shift-duty"
			},
			{
				id: "checkin-checkout",
				name: "Check-in / Check-out",
				category: "Employee",
				to: "/report?type=checkin-checkout"
			}
		]
	}
];
var ALL_REPORTS = REPORT_CATEGORIES.flatMap((c) => c.items);
REPORT_CATEGORIES.map((c) => ({
	category: c.label,
	reports: c.items
}));
var findReport = (id) => {
	if (!id) return void 0;
	const cleanId = id.trim().toLowerCase();
	const normalizedId = cleanId.replace(/_/g, "-");
	let rep = ALL_REPORTS.find((r) => r.id.toLowerCase() === cleanId || r.id.toLowerCase() === normalizedId);
	if (rep) return rep;
	rep = ALL_REPORTS.find((r) => r.to.toLowerCase().includes(`type=${cleanId}`) || r.to.toLowerCase().includes(`type=${normalizedId}`));
	if (rep) return rep;
	if (normalizedId === "temperature-summary" || normalizedId === "temperature") return ALL_REPORTS.find((r) => r.id === "temperature");
	if (normalizedId === "driver-job-summary" || normalizedId === "job") return ALL_REPORTS.find((r) => r.id === "job");
	if (normalizedId === "today-activity" || normalizedId === "today") return ALL_REPORTS.find((r) => r.id === "today-activity");
	if (normalizedId === "travel-summary" || normalizedId === "travel") return ALL_REPORTS.find((r) => r.id === "travel");
	rep = ALL_REPORTS.find((r) => r.name.toLowerCase() === cleanId || r.name.toLowerCase().replace(/\s+/g, "-") === normalizedId);
	if (rep) return rep;
	const chart = findChartItem(id);
	if (chart) return {
		id: chart.id,
		name: chart.label,
		category: chart.categoryLabel,
		to: `/charts?chart=${chart.id}`
	};
	return {
		id,
		name: id.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
		category: "General",
		to: `/report?type=${id}`
	};
};
var temperatureSummaryRows = [
	{
		id: "temp-1",
		object: "MH18CC2635",
		vehicleBrand: "AMW",
		vehicleModel: "1518 TP",
		portTemp: "BLE Temperature 1",
		portHumidity: "--",
		distance: 694.42,
		startLocation: "MH NH 325, Maharashtra",
		tempAvg: 9.35,
		tempMin: 0,
		tempMax: 28.9,
		unit: "°C",
		humidityAvg: 0,
		humidityMin: 0,
		humidityMax: 0,
		endLocation: "Station Rd, Chalisgaon",
		daily: [
			{
				date: "27-11-2024",
				distance: 120.4,
				startLocation: "MH NH 325, Maharashtra",
				tempAvg: 8.2,
				tempMin: 1,
				tempMax: 22.4,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Bhadgaon Bypass"
			},
			{
				date: "28-11-2024",
				distance: 245.8,
				startLocation: "Bhadgaon Bypass",
				tempAvg: 10.1,
				tempMin: 0,
				tempMax: 28.9,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Pachora Junction"
			},
			{
				date: "29-11-2024",
				distance: 180.2,
				startLocation: "Pachora Junction",
				tempAvg: 9.8,
				tempMin: 2.1,
				tempMax: 24.5,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Station Rd, Chalisgaon"
			},
			{
				date: "30-11-2024",
				distance: 148.02,
				startLocation: "Station Rd, Chalisgaon",
				tempAvg: 9.3,
				tempMin: 3.5,
				tempMax: 27.1,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Cold Store Hub 4"
			}
		]
	},
	{
		id: "temp-2",
		object: "MP09KL3648",
		vehicleBrand: "Chevrolet",
		vehicleModel: "Car",
		portTemp: "External Temperature",
		portHumidity: "--",
		distance: 900.18,
		startLocation: "MP 02, Vindhyachal",
		tempAvg: 19.65,
		tempMin: -24,
		tempMax: 27.9,
		unit: "°C",
		humidityAvg: 0,
		humidityMin: 0,
		humidityMax: 0,
		endLocation: "Ambica Super Store, Bharuch",
		daily: [
			{
				date: "27-11-2024",
				distance: 210.5,
				startLocation: "MP 02, Vindhyachal",
				tempAvg: 18.2,
				tempMin: -20,
				tempMax: 26.5,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Indore Ring Rd"
			},
			{
				date: "28-11-2024",
				distance: 340,
				startLocation: "Indore Ring Rd",
				tempAvg: 20.4,
				tempMin: -24,
				tempMax: 27.9,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Dahod Toll Plaza"
			},
			{
				date: "29-11-2024",
				distance: 190.4,
				startLocation: "Dahod Toll Plaza",
				tempAvg: 19.8,
				tempMin: -18.5,
				tempMax: 25,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Vadodara Express Hub"
			},
			{
				date: "30-11-2024",
				distance: 159.28,
				startLocation: "Vadodara Express Hub",
				tempAvg: 20.1,
				tempMin: -15,
				tempMax: 27.2,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Ambica Super Store, Bharuch"
			}
		]
	},
	{
		id: "temp-3",
		object: "GJ05YL7865",
		vehicleBrand: "Ashok Leyland",
		vehicleModel: "10 Wheel",
		portTemp: "BLE Temperature 1",
		portHumidity: "--",
		distance: 2340.43,
		startLocation: "Hotel KGN, Surat",
		tempAvg: 4.49,
		tempMin: -22.9,
		tempMax: 27.9,
		unit: "°C",
		humidityAvg: 0,
		humidityMin: 0,
		humidityMax: 0,
		endLocation: "Hotel KGN, Surat",
		daily: [
			{
				date: "27-11-2024",
				distance: 580,
				startLocation: "Hotel KGN, Surat",
				tempAvg: 3.5,
				tempMin: -22,
				tempMax: 25,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Vapi GIDC"
			},
			{
				date: "28-11-2024",
				distance: 620.4,
				startLocation: "Vapi GIDC",
				tempAvg: 4.2,
				tempMin: -22.9,
				tempMax: 27.9,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Bhiwandi Warehouses"
			},
			{
				date: "29-11-2024",
				distance: 590,
				startLocation: "Bhiwandi Warehouses",
				tempAvg: 5.1,
				tempMin: -20.5,
				tempMax: 26.8,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Navi Mumbai Cold Depot"
			},
			{
				date: "30-11-2024",
				distance: 550.03,
				startLocation: "Navi Mumbai Cold Depot",
				tempAvg: 4.9,
				tempMin: -19,
				tempMax: 24.5,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Hotel KGN, Surat"
			}
		]
	},
	{
		id: "temp-4",
		object: "GJ15KL3648",
		vehicleBrand: "AJAX-FIORI",
		vehicleModel: "AGRO 400",
		portTemp: "External Temperature",
		portHumidity: "--",
		distance: 1197.57,
		startLocation: "NH 53, Gujarat (NW)",
		tempAvg: 23.63,
		tempMin: 16,
		tempMax: 16,
		unit: "°C",
		humidityAvg: 0,
		humidityMin: 0,
		humidityMax: 0,
		endLocation: "NH 53, Gujarat",
		daily: [
			{
				date: "27-11-2024",
				distance: 300,
				startLocation: "NH 53, Gujarat (NW)",
				tempAvg: 23.6,
				tempMin: 16,
				tempMax: 16,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Vyara Highway"
			},
			{
				date: "28-11-2024",
				distance: 310.2,
				startLocation: "Vyara Highway",
				tempAvg: 23.6,
				tempMin: 16,
				tempMax: 16,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Songadh Plant"
			},
			{
				date: "29-11-2024",
				distance: 295.4,
				startLocation: "Songadh Plant",
				tempAvg: 23.6,
				tempMin: 16,
				tempMax: 16,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Navapur Depot"
			},
			{
				date: "30-11-2024",
				distance: 291.97,
				startLocation: "Navapur Depot",
				tempAvg: 23.6,
				tempMin: 16,
				tempMax: 16,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "NH 53, Gujarat"
			}
		]
	},
	{
		id: "temp-5",
		object: "MH12BD1165",
		vehicleBrand: "Eicher",
		vehicleModel: "10.59",
		portTemp: "BLE Temperature 1",
		portHumidity: "--",
		distance: 2070.3,
		startLocation: "NH 48, Gujarat (NW)",
		tempAvg: -16.89,
		tempMin: -28.8,
		tempMax: 17.9,
		unit: "°C",
		humidityAvg: 0,
		humidityMin: 0,
		humidityMax: 0,
		endLocation: "Hansraj Talkies, Vadodara",
		daily: [
			{
				date: "27-11-2024",
				distance: 3.9,
				startLocation: "NH 48, Gujarat (NW)",
				tempAvg: -22.45,
				tempMin: -28.8,
				tempMax: -14.1,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Ambica Super Store, Bholav, Bharuch, Gujarat"
			},
			{
				date: "28-11-2024",
				distance: 605.98,
				startLocation: "At Havmor- Ahmedabad",
				tempAvg: -6,
				tempMin: -28.8,
				tempMax: 17.9,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Ambica Super Store, Bholav, Bharuch, Gujarat"
			},
			{
				date: "29-11-2024",
				distance: 23.94,
				startLocation: "Nana Chiloda Gam, Kotarpur, Ahmedabad",
				tempAvg: -15.77,
				tempMin: -27.8,
				tempMax: -17.1,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Ambica Super Store, Bholav, Bharuch, Gujarat"
			},
			{
				date: "30-11-2024",
				distance: 841.4,
				startLocation: "MH SH 141, Jalgaon, Maharashtra (SW)",
				tempAvg: -20.84,
				tempMin: -23.9,
				tempMax: -12.7,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Ambica Super Store, Bholav, Bharuch, Gujarat"
			}
		]
	},
	{
		id: "temp-6",
		object: "MH08EK6348",
		vehicleBrand: "Ashok Leyland",
		vehicleModel: "10 Wheel",
		portTemp: "BLE Temperature 1",
		portHumidity: "--",
		distance: 405.64,
		startLocation: "Shree Ganesh Petrol",
		tempAvg: -14.13,
		tempMin: -28.5,
		tempMax: 30.9,
		unit: "°C",
		humidityAvg: 0,
		humidityMin: 0,
		humidityMax: 0,
		endLocation: "Krishna Park, Mumbai",
		daily: [
			{
				date: "27-11-2024",
				distance: 95.2,
				startLocation: "Shree Ganesh Petrol",
				tempAvg: -12.4,
				tempMin: -26,
				tempMax: 28,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Kalyan Bypass"
			},
			{
				date: "28-11-2024",
				distance: 110.4,
				startLocation: "Kalyan Bypass",
				tempAvg: -15.2,
				tempMin: -28.5,
				tempMax: 30.9,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Thane Majiwada"
			},
			{
				date: "29-11-2024",
				distance: 105,
				startLocation: "Thane Majiwada",
				tempAvg: -14,
				tempMin: -27,
				tempMax: 29.5,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Bandra Kurla Complex"
			},
			{
				date: "30-11-2024",
				distance: 95.04,
				startLocation: "Bandra Kurla Complex",
				tempAvg: -14.8,
				tempMin: -25,
				tempMax: 26,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Krishna Park, Mumbai"
			}
		]
	},
	{
		id: "temp-7",
		object: "KA04CD7788",
		vehicleBrand: "Tata Motors",
		vehicleModel: "Prima 2830",
		portTemp: "BLE Temperature 1",
		portHumidity: "--",
		distance: 1450.2,
		startLocation: "Peenya Industrial Area, Bengaluru",
		tempAvg: 3.2,
		tempMin: -18,
		tempMax: 12.5,
		unit: "°C",
		humidityAvg: 0,
		humidityMin: 0,
		humidityMax: 0,
		endLocation: "Whitefield Cold Hub",
		daily: [
			{
				date: "27-11-2024",
				distance: 360,
				startLocation: "Peenya Industrial Area",
				tempAvg: 2.8,
				tempMin: -18,
				tempMax: 11,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Tumkur Hub"
			},
			{
				date: "28-11-2024",
				distance: 375.2,
				startLocation: "Tumkur Hub",
				tempAvg: 3.5,
				tempMin: -16.5,
				tempMax: 12.5,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Chitradurga"
			},
			{
				date: "29-11-2024",
				distance: 355,
				startLocation: "Chitradurga",
				tempAvg: 3.1,
				tempMin: -17,
				tempMax: 10.8,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Davanagere"
			},
			{
				date: "30-11-2024",
				distance: 360,
				startLocation: "Davanagere",
				tempAvg: 3.4,
				tempMin: -15,
				tempMax: 12,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Whitefield Cold Hub"
			}
		]
	},
	{
		id: "temp-8",
		object: "DL01TA1122",
		vehicleBrand: "Mahindra",
		vehicleModel: "Blazo X",
		portTemp: "External Temperature",
		portHumidity: "--",
		distance: 820.6,
		startLocation: "Kundli Transport Nagar, Delhi",
		tempAvg: -8.4,
		tempMin: -22,
		tempMax: 4.5,
		unit: "°C",
		humidityAvg: 0,
		humidityMin: 0,
		humidityMax: 0,
		endLocation: "Jaipur Agro Mart",
		daily: [
			{
				date: "27-11-2024",
				distance: 200,
				startLocation: "Kundli Transport Nagar",
				tempAvg: -8,
				tempMin: -21,
				tempMax: 4,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Manesar Warehouse"
			},
			{
				date: "28-11-2024",
				distance: 215.6,
				startLocation: "Manesar Warehouse",
				tempAvg: -8.9,
				tempMin: -22,
				tempMax: 4.5,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Neemrana Industrial"
			},
			{
				date: "29-11-2024",
				distance: 205,
				startLocation: "Neemrana Industrial",
				tempAvg: -8.2,
				tempMin: -20.5,
				tempMax: 3.8,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Shahpura"
			},
			{
				date: "30-11-2024",
				distance: 200,
				startLocation: "Shahpura",
				tempAvg: -8.5,
				tempMin: -19.8,
				tempMax: 4.2,
				unit: "°C",
				humidityAvg: 0,
				humidityMin: 0,
				humidityMax: 0,
				endLocation: "Jaipur Agro Mart"
			}
		]
	}
];
var driverJobSummaryRows = [
	{
		id: "job-1",
		company: "Planet Eco Building Materials LLC",
		branch: "Planet Eco Abu Dhabi",
		driver: "Zubair Muhammad",
		distance: 62,
		totalJobCost: 0,
		allocatedJob: 59,
		completedWithoutIssue: 30,
		completedWithIssue: 8,
		failed: 0,
		totalAlert: 0,
		jobs: [{
			jobName: "Mussafah Cement Supply",
			jobId: "Loa401",
			invoiceNumber: "INV-8812",
			shipmentNumber: "SHP-101",
			product: "ReadyMix Grade 40",
			quantity: 12,
			consignName: "Arabtec Construction",
			status: "Completed Without Error",
			plannedStartTime: "5-12-2024 07:30 AM",
			actualStartTime: "5-12-2024 07:32 AM",
			diffStart: "00:02",
			startOdometer: 118450,
			plannedEndTime: "5-12-2024 08:30 AM",
			workEndTime: "5-12-2024 07:32 AM",
			actualEndTime: "5-12-2024 08:24 AM",
			diffEnd: "00:06",
			endOdometer: 118475,
			jobDistance: 25,
			jobDuration: "00:52"
		}, {
			jobName: "Al Reem Island Tower B",
			jobId: "Loa405",
			invoiceNumber: "REQ",
			shipmentNumber: "--",
			product: "Steel Rebars 16mm",
			quantity: 8,
			consignName: "Shapoorji Pallonji",
			status: "Completed Without Error",
			plannedStartTime: "5-12-2024 09:15 AM",
			actualStartTime: "5-12-2024 09:18 AM",
			diffStart: "00:03",
			startOdometer: 118475,
			plannedEndTime: "5-12-2024 10:45 AM",
			workEndTime: "5-12-2024 09:18 AM",
			actualEndTime: "5-12-2024 10:35 AM",
			diffEnd: "00:10",
			endOdometer: 118512,
			jobDistance: 37,
			jobDuration: "01:17"
		}]
	},
	{
		id: "job-2",
		company: "Planet Eco Building Materials LLC",
		branch: "Planet Eco Ajman",
		driver: "Biju Vijayan",
		distance: 261,
		totalJobCost: 0,
		allocatedJob: 89,
		completedWithoutIssue: 47,
		completedWithIssue: 6,
		failed: 0,
		totalAlert: 0,
		jobs: [
			{
				jobName: "Planet Eco Alqouz",
				jobId: "Loa432",
				invoiceNumber: "REQ",
				shipmentNumber: "--",
				product: "--",
				quantity: 0,
				consignName: "--",
				status: "Completed Without Error",
				plannedStartTime: "5-12-2024 08:06 AM",
				actualStartTime: "5-12-2024 08:09 AM",
				diffStart: "00:04",
				startOdometer: 120001.5,
				plannedEndTime: "5-12-2024 08:59 AM",
				workEndTime: "5-12-2024 08:09 AM",
				actualEndTime: "5-12-2024 08:41 AM",
				diffEnd: "00:17",
				endOdometer: 120001.5,
				jobDistance: 0,
				jobDuration: "00:32"
			},
			{
				jobName: "Furin Interior Decoration LLC",
				jobId: "Loa433",
				invoiceNumber: "--",
				shipmentNumber: "--",
				product: "--",
				quantity: 0,
				consignName: "--",
				status: "Delayed",
				plannedStartTime: "5-12-2024 10:11 AM",
				actualStartTime: "5-12-2024 10:15 AM",
				diffStart: "00:05",
				startOdometer: 120031.5,
				plannedEndTime: "5-12-2024 10:23 AM",
				workEndTime: "5-12-2024 10:15 AM",
				actualEndTime: "5-12-2024 10:27 AM",
				diffEnd: "00:05",
				endOdometer: 120031.5,
				jobDistance: 1,
				jobDuration: "00:12"
			},
			{
				jobName: "BAB AL Lewa Technical Services",
				jobId: "Loa438",
				invoiceNumber: "--",
				shipmentNumber: "--",
				product: "--",
				quantity: 0,
				consignName: "--",
				status: "Delayed",
				plannedStartTime: "5-12-2024 10:33 AM",
				actualStartTime: "5-12-2024 10:38 AM",
				diffStart: "00:05",
				startOdometer: 120038.5,
				plannedEndTime: "5-12-2024 10:45 AM",
				workEndTime: "5-12-2024 10:38 AM",
				actualEndTime: "5-12-2024 10:59 AM",
				diffEnd: "00:15",
				endOdometer: 120039.5,
				jobDistance: 1,
				jobDuration: "00:22"
			}
		]
	},
	{
		id: "job-3",
		company: "Planet Eco Building Materials LLC",
		branch: "Planet Eco Ajman",
		driver: "James Lawrence",
		distance: 1027,
		totalJobCost: 0,
		allocatedJob: 43,
		completedWithoutIssue: 28,
		completedWithIssue: 9,
		failed: 0,
		totalAlert: 0,
		jobs: [{
			jobName: "Hamriyah Free Zone Warehouse 12",
			jobId: "Loa450",
			invoiceNumber: "INV-9901",
			shipmentNumber: "SHP-302",
			product: "Gypsum Boards",
			quantity: 150,
			consignName: "Danube Building Materials",
			status: "Completed Without Error",
			plannedStartTime: "6-12-2024 07:00 AM",
			actualStartTime: "6-12-2024 07:05 AM",
			diffStart: "00:05",
			startOdometer: 145200,
			plannedEndTime: "6-12-2024 09:30 AM",
			workEndTime: "6-12-2024 07:05 AM",
			actualEndTime: "6-12-2024 09:15 AM",
			diffEnd: "00:15",
			endOdometer: 145285,
			jobDistance: 85,
			jobDuration: "02:10"
		}]
	},
	{
		id: "job-4",
		company: "Planet Eco Building Materials LLC",
		branch: "Planet Eco Ajman",
		driver: "Sagar Raju",
		distance: 2,
		totalJobCost: 0,
		allocatedJob: 2,
		completedWithoutIssue: 1,
		completedWithIssue: 0,
		failed: 0,
		totalAlert: 0,
		jobs: [{
			jobName: "Ajman Industrial Area 2 Delivery",
			jobId: "Loa460",
			invoiceNumber: "REQ",
			shipmentNumber: "--",
			product: "White Sand 50kg",
			quantity: 20,
			consignName: "Gulf Contracting",
			status: "Completed Without Error",
			plannedStartTime: "6-12-2024 11:00 AM",
			actualStartTime: "6-12-2024 11:02 AM",
			diffStart: "00:02",
			startOdometer: 98400,
			plannedEndTime: "6-12-2024 11:45 AM",
			workEndTime: "6-12-2024 11:02 AM",
			actualEndTime: "6-12-2024 11:30 AM",
			diffEnd: "00:15",
			endOdometer: 98402,
			jobDistance: 2,
			jobDuration: "00:28"
		}]
	},
	{
		id: "job-5",
		company: "Planet Eco Building Materials LLC",
		branch: "Planet Eco AL Khabaisi",
		driver: "Shahpal Hussain",
		distance: 166,
		totalJobCost: 0,
		allocatedJob: 93,
		completedWithoutIssue: 16,
		completedWithIssue: 0,
		failed: 0,
		totalAlert: 0,
		jobs: [{
			jobName: "Deira Commercial Center Refurbish",
			jobId: "Loa472",
			invoiceNumber: "INV-7734",
			shipmentNumber: "SHP-404",
			product: "Thermal Insulation Rolls",
			quantity: 45,
			consignName: "Al Futtaim Engineering",
			status: "Completed Without Error",
			plannedStartTime: "7-12-2024 06:30 AM",
			actualStartTime: "7-12-2024 06:35 AM",
			diffStart: "00:05",
			startOdometer: 87310,
			plannedEndTime: "7-12-2024 08:30 AM",
			workEndTime: "7-12-2024 06:35 AM",
			actualEndTime: "7-12-2024 08:18 AM",
			diffEnd: "00:12",
			endOdometer: 87362,
			jobDistance: 52,
			jobDuration: "01:43"
		}]
	},
	{
		id: "job-6",
		company: "Planet Eco Building Materials LLC",
		branch: "Planet Eco AL Khabaisi",
		driver: "Shams UL Haq",
		distance: 131,
		totalJobCost: 0,
		allocatedJob: 92,
		completedWithoutIssue: 14,
		completedWithIssue: 0,
		failed: 0,
		totalAlert: 0,
		jobs: [{
			jobName: "Al Qusais Industrial Logistics Hub",
			jobId: "Loa480",
			invoiceNumber: "INV-6619",
			shipmentNumber: "SHP-505",
			product: "Ceramic Floor Tiles 60x60",
			quantity: 80,
			consignName: "RAK Ceramics Distribution",
			status: "Completed Without Error",
			plannedStartTime: "7-12-2024 09:00 AM",
			actualStartTime: "7-12-2024 09:04 AM",
			diffStart: "00:04",
			startOdometer: 104200,
			plannedEndTime: "7-12-2024 11:00 AM",
			workEndTime: "7-12-2024 09:04 AM",
			actualEndTime: "7-12-2024 10:45 AM",
			diffEnd: "00:15",
			endOdometer: 104245,
			jobDistance: 45,
			jobDuration: "01:41"
		}]
	},
	{
		id: "job-7",
		company: "Planet Eco Building Materials LLC",
		branch: "Planet Eco AL Nakheel",
		driver: "Raju Rimal",
		distance: 38,
		totalJobCost: 0,
		allocatedJob: 85,
		completedWithoutIssue: 76,
		completedWithIssue: 0,
		failed: 0,
		totalAlert: 0,
		jobs: [{
			jobName: "Ras Al Khaimah Port Facility",
			jobId: "Loa491",
			invoiceNumber: "REQ",
			shipmentNumber: "--",
			product: "Portland Cement Bags",
			quantity: 100,
			consignName: "Stevin Rock LLC",
			status: "Completed Without Error",
			plannedStartTime: "8-12-2024 08:00 AM",
			actualStartTime: "8-12-2024 08:03 AM",
			diffStart: "00:03",
			startOdometer: 76500,
			plannedEndTime: "8-12-2024 09:30 AM",
			workEndTime: "8-12-2024 08:03 AM",
			actualEndTime: "8-12-2024 09:12 AM",
			diffEnd: "00:18",
			endOdometer: 76538,
			jobDistance: 38,
			jobDuration: "01:09"
		}]
	}
];
var COMPANIES = [
	"All",
	"ABC Logistic",
	"XYZ Transport",
	"HP Company",
	"Planet Eco Building Materials LLC",
	"Uffizio Indonesia",
	"Uffizio Thailand"
];
var BRANCHES = [
	"All",
	"HP Branch 1",
	"HP Branch 2",
	"Delhi Branch",
	"Mumbai Branch",
	"Planet Eco Abu Dhabi",
	"Planet Eco Ajman",
	"Planet Eco AL Khabaisi",
	"Planet Eco AL Nakheel",
	"Indonesia",
	"Thailand",
	"Valsad"
];
var VEHICLE_GROUPS = [
	"All",
	"HP Group",
	"Trucks",
	"Buses",
	"Cars",
	"Cold Chain"
];
/** Mapping of which branches belong to which company */
var COMPANY_BRANCHES_MAP = {
	"ABC Logistic": [
		"HP Branch 1",
		"HP Branch 2",
		"Valsad",
		"Planet Eco Abu Dhabi"
	],
	"XYZ Transport": ["Delhi Branch", "Mumbai Branch"],
	"HP Company": [
		"HP Branch 1",
		"HP Branch 2",
		"Valsad"
	],
	"Planet Eco Building Materials LLC": [
		"Planet Eco Abu Dhabi",
		"Planet Eco Ajman",
		"Planet Eco AL Khabaisi",
		"Planet Eco AL Nakheel"
	],
	"Uffizio Indonesia": ["Indonesia"],
	"Uffizio Thailand": ["Thailand"]
};
function getBranchesForCompanies(selectedCompanies) {
	if (!selectedCompanies || selectedCompanies.length === 0 || selectedCompanies.includes("All")) {
		const all = /* @__PURE__ */ new Set();
		Object.values(COMPANY_BRANCHES_MAP).forEach((branches) => {
			branches.forEach((b) => all.add(b));
		});
		return Array.from(all);
	}
	const branchSet = /* @__PURE__ */ new Set();
	for (const company of selectedCompanies) {
		const branches = COMPANY_BRANCHES_MAP[company] || [];
		for (const b of branches) branchSet.add(b);
	}
	return Array.from(branchSet);
}
/** Mapping of which vehicles belong to which branch */
var BRANCH_VEHICLES_MAP = {
	"HP Branch 1": [
		{
			id: "MH03DE4242",
			name: "MH03DE4242",
			imei: "861022839502",
			driver: "EMP-1013"
		},
		{
			id: "TS11XX7070",
			name: "TS11XX7070",
			imei: "861065308624",
			driver: "EMP-1056"
		},
		{
			id: "MH12AB1234",
			name: "MH12AB1234",
			imei: "861028597854",
			driver: "Ashok Patel"
		},
		{
			id: "MH12CD5678",
			name: "MH12CD5678",
			imei: "861011975200",
			driver: "Raman K."
		},
		{
			id: "MH14EF9012",
			name: "MH14EF9012",
			imei: "861012962962",
			driver: "Vikram Joshi"
		},
		{
			id: "MH11GH3456",
			name: "MH11GH3456",
			imei: "861034567890",
			driver: "Vijay Singh"
		},
		{
			id: "MH12JK1313",
			name: "MH12JK1313",
			imei: "861013131313",
			driver: "Rahul Mehta"
		},
		{
			id: "RUP-88120",
			name: "RUP-88120",
			imei: "861088120001",
			driver: "Ashok Patel"
		},
		{
			id: "RUP-88121",
			name: "RUP-88121",
			imei: "861088121002",
			driver: "Raman K."
		}
	],
	"HP Branch 2": [
		{
			id: "HR55TT3030",
			name: "HR55TT3030",
			imei: "861061358008",
			driver: "EMP-1052"
		},
		{
			id: "WB04AA1212",
			name: "WB04AA1212",
			imei: "861068271586",
			driver: "EMP-1059"
		},
		{
			id: "KA04CD7766",
			name: "KA04CD7766",
			imei: "861027777772",
			driver: "EMP-1018"
		}
	],
	"Delhi Branch": [
		{
			id: "DL01TA1122",
			name: "DL01TA1122",
			imei: "861011223344",
			driver: "Harish Chand"
		},
		{
			id: "DL04CA9090",
			name: "DL04CA9090",
			imei: "861090909090",
			driver: "Vikas Sharma"
		},
		{
			id: "DL08AK1212",
			name: "DL08AK1212",
			imei: "861012121212",
			driver: "Rajesh Kumar"
		}
	],
	"Mumbai Branch": [
		{
			id: "MH01AB2020",
			name: "MH01AB2020",
			imei: "861020202020",
			driver: "Sachin T."
		},
		{
			id: "MH02CD3030",
			name: "MH02CD3030",
			imei: "861030303030",
			driver: "Sunil G."
		},
		{
			id: "MH04EF4040",
			name: "MH04EF4040",
			imei: "861040404040",
			driver: "Anil K."
		}
	],
	Valsad: [
		{
			id: "Fuel - 12393",
			name: "Fuel - 12393",
			imei: "861012393001",
			driver: "Finatrack Driver"
		},
		{
			id: "Temperature - 12394",
			name: "Temperature - 12394",
			imei: "861012394002",
			driver: "Kanika Agrawal"
		},
		{
			id: "Tire Management - 12",
			name: "Tire Management - 12",
			imei: "861012121200",
			driver: "Manoj P."
		},
		{
			id: "GJ15MM2654",
			name: "GJ15MM2654",
			imei: "861026541515",
			driver: "Jitendra V."
		}
	],
	"Planet Eco Abu Dhabi": [
		{
			id: "KA01AB9988",
			name: "KA01AB9988",
			imei: "861099880101",
			driver: "Anand Murthy"
		},
		{
			id: "TS07FA7788",
			name: "TS07FA7788",
			imei: "861077880707",
			driver: "Venkatesh Rao"
		},
		{
			id: "AD-99120",
			name: "AD-99120",
			imei: "861099120000",
			driver: "Farooq A."
		}
	],
	"Planet Eco Ajman": [
		{
			id: "TN01HA1234",
			name: "TN01HA1234",
			imei: "861012340101",
			driver: "Murugan P."
		},
		{
			id: "WB01KA4321",
			name: "WB01KA4321",
			imei: "861043210101",
			driver: "Sourav Roy"
		},
		{
			id: "AJ-44510",
			name: "AJ-44510",
			imei: "861044510000",
			driver: "Rashid K."
		}
	],
	"Planet Eco AL Khabaisi": [
		{
			id: "AP39WP4220-CA-01",
			name: "AP39WP4220-CA-01",
			imei: "861042203901",
			driver: "Driver 1"
		},
		{
			id: "RJ14CA2468",
			name: "RJ14CA2468",
			imei: "861037654312",
			driver: "Mahipal Singh"
		},
		{
			id: "KH-77120",
			name: "KH-77120",
			imei: "861077120000",
			driver: "Tariq S."
		}
	],
	"Planet Eco AL Nakheel": [
		{
			id: "HR46F0864-VE-C-02",
			name: "HR46F0864-VE-C-02",
			imei: "861008644602",
			driver: "Driver 2"
		},
		{
			id: "MH09GJ6798-CAV-03",
			name: "MH09GJ6798-CAV-03",
			imei: "861067980903",
			driver: "Driver 3"
		},
		{
			id: "NL01AJ3382-VE-C-04",
			name: "NL01AJ3382-VE-C-04",
			imei: "861033820104",
			driver: "Driver 4"
		}
	],
	Indonesia: [
		{
			id: "Fuel - 1001",
			name: "Fuel - 1001",
			imei: "861088280791",
			driver: "Budi Santoso"
		},
		{
			id: "Mercedes GLE 300",
			name: "Mercedes GLE 300",
			imei: "861091256548",
			driver: "Agus W."
		},
		{
			id: "Scania - 1004",
			name: "Scania - 1004",
			imei: "861122006037",
			driver: "Hendra K."
		},
		{
			id: "Temperature - 1005",
			name: "Temperature - 1005",
			imei: "861015870704",
			driver: "Eko P."
		}
	],
	Thailand: [
		{
			id: "BUS - 130003",
			name: "BUS - 130003",
			imei: "861013000300",
			driver: "Shivam Patel"
		},
		{
			id: "Fuel - 130001",
			name: "Fuel - 130001",
			imei: "861013000100",
			driver: "Khushi Ojha"
		},
		{
			id: "RPM - 130004",
			name: "RPM - 130004",
			imei: "861013000400",
			driver: "Drashti Joshier"
		},
		{
			id: "SOC - 130002",
			name: "SOC - 130002",
			imei: "861013000200",
			driver: "Chatchai Panlumkhaw"
		},
		{
			id: "Temperature - 130005",
			name: "Temperature - 130005",
			imei: "861013000500",
			driver: "Kuldeep Chaurasia"
		}
	]
};
function getVehiclesForBranches(selectedBranches) {
	if (!selectedBranches || selectedBranches.length === 0 || selectedBranches.includes("All")) {
		const allBranches = Object.keys(BRANCH_VEHICLES_MAP);
		const list = [];
		for (const b of allBranches) {
			const vList = BRANCH_VEHICLES_MAP[b] || [];
			for (const v of vList) list.push({
				...v,
				branch: b
			});
		}
		return list;
	}
	const result = [];
	for (const branch of selectedBranches) {
		const list = BRANCH_VEHICLES_MAP[branch] || [];
		for (const v of list) result.push({
			...v,
			branch
		});
	}
	return result;
}
/** Mapping of which groups belong to which branch */
var BRANCH_GROUPS_MAP = {
	"HP Branch 1": [
		"HP Group",
		"Trucks",
		"Buses"
	],
	"HP Branch 2": [
		"HP Group",
		"Trucks",
		"Dumper"
	],
	"Delhi Branch": [
		"Cars",
		"Taxi",
		"Trucks"
	],
	"Mumbai Branch": [
		"SUV",
		"Buses",
		"Trucks"
	],
	"Planet Eco Abu Dhabi": [
		"Trucks",
		"Cars",
		"Cold Chain"
	],
	"Planet Eco Ajman": ["Trucks", "Cold Chain"],
	"Planet Eco AL Khabaisi": [
		"Trucks",
		"Buses",
		"Dumper"
	],
	"Planet Eco AL Nakheel": ["Buses", "Cars"],
	Indonesia: [
		"Trucks",
		"Buses",
		"Cars",
		"SUV"
	],
	Thailand: [
		"Buses",
		"Cold Chain",
		"Trucks"
	],
	Valsad: [
		"HP Group",
		"Trucks",
		"Cold Chain"
	]
};
function getGroupsForBranches(selectedBranches) {
	if (!selectedBranches || selectedBranches.length === 0 || selectedBranches.includes("All")) return [
		"HP Group",
		"Trucks",
		"Buses",
		"Cars",
		"Cold Chain",
		"Dumper",
		"Taxi",
		"SUV"
	];
	const groupSet = /* @__PURE__ */ new Set();
	for (const branch of selectedBranches) {
		const groups = BRANCH_GROUPS_MAP[branch] || ["Trucks", "Buses"];
		for (const g of groups) groupSet.add(g);
	}
	return Array.from(groupSet);
}
var VEHICLE_TYPES = [
	"All",
	"Truck",
	"Bus",
	"SUV",
	"Taxi",
	"Dumper"
];
var VEHICLE_BRANDS = [
	"All",
	"AMW",
	"Ashok Leyland",
	"Chevrolet",
	"AJAX-FIORI",
	"Eicher",
	"Tata Motors",
	"Mahindra",
	"MERCEDES BENZ"
];
var VEHICLE_MODELS = [
	"All",
	"1518 TP",
	"Car",
	"10 Wheel",
	"AGRO 400",
	"10.59",
	"Prima 2830",
	"Blazo X",
	"1616",
	"GLE 300d"
];
var COMPARATORS = [
	"Greater Than",
	"Less Than",
	"Equal To"
];
var DURATION_UNITS = [
	"Hour",
	"Minute",
	"Day"
];
var DATE_PRESETS = [
	"Today",
	"Yesterday",
	"This Week",
	"Last Week",
	"Last 7 Days",
	"This Month",
	"Last Month",
	"Custom Range"
];
//#endregion
export { getVehiclesForBranches as C, temperatureSummaryRows as E, getGroupsForBranches as S, objectLevelData as T, findChartItem as _, CHART_VEHICLES as a, fuelSeries as b, DATE_PRESETS as c, VEHICLE_BRANDS as d, VEHICLE_GROUPS as f, driverJobSummaryRows as g, dailyLevelData as h, CHART_CATEGORIES as i, DURATION_UNITS as l, VEHICLE_TYPES as m, BRANCHES as n, COMPANIES as o, VEHICLE_MODELS as p, BRANCH_VEHICLES_MAP as r, COMPARATORS as s, ALL_REPORTS as t, REPORT_CATEGORIES as u, findReport as v, hourlyLevelData as w, getBranchesForCompanies as x, fuelEvents as y };
