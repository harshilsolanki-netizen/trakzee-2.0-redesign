export interface FuelVehicle {
  id: string;
  name: string;
  plateNumber: string;
  vehicleType: "Truck" | "Tipper" | "Tanker" | "Trailer";
  fuelType: "Diesel" | "Petrol";
  currentFuel: number; // in Liters
  capacity: number; // in Liters
  speed: number; // km/h
  ignition: boolean;
  status: "running" | "idle" | "stopped";
  address: string;
  lastUpdated: string;
  branch: string;
  batteryLevel: number; // %
  rssi: number; // dBm
  consumptionRate: number; // L/100km or L/h
  estimatedRangeKm: number;
  temperature?: number; // C
  refillLiters?: number;
  refillCount?: number;
  pilferageLiters?: number;
  pilferageCount?: number;
  distanceKm?: number;
  durationHours?: string;
  consumptionDistanceL?: number;
  consumptionDurationL?: number;
  mileageDistance?: number;
  mileageDuration?: number;
}

export interface FuelStatus {
  status: "normal" | "warning" | "critical";
  label: string;
  color: string;
  badgeBg: string;
}


export interface VehicleFuelTelemetry {
  refillLiters: number;
  refillCount: number;
  pilferageLiters: number;
  pilferageCount: number;
  distanceKm: number;
  durationHours: string;
  consumptionDistanceL: number;
  consumptionDurationL: number;
  mileageDistance: number;
  mileageDuration: number;
}

export function getVehicleFuelTelemetry(vehicle: FuelVehicle): VehicleFuelTelemetry {
  return {
    refillLiters: vehicle.refillLiters ?? Math.round(vehicle.capacity * 0.12),
    refillCount: vehicle.refillCount ?? 2,
    pilferageLiters: vehicle.pilferageLiters ?? Math.round(vehicle.capacity * 0.035),
    pilferageCount: vehicle.pilferageCount ?? 1,
    distanceKm: vehicle.distanceKm ?? 420,
    durationHours: vehicle.durationHours ?? "09:56 hrs",
    consumptionDistanceL: vehicle.consumptionDistanceL ?? Math.round(vehicle.capacity * 0.11),
    consumptionDurationL: vehicle.consumptionDurationL ?? Math.round(vehicle.capacity * 0.035),
    mileageDistance: vehicle.mileageDistance ?? 9.4,
    mileageDuration: vehicle.mileageDuration ?? 8.5,
  };
}

export function getFuelStatus(current: number, capacity: number): FuelStatus {
  const percentage = (current / capacity) * 100;
  if (percentage <= 15) {
    return {
      status: "critical",
      label: "Critical Low",
      color: "#EF4444",
      badgeBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    };
  }
  if (percentage <= 35) {
    return {
      status: "warning",
      label: "Low Fuel",
      color: "#F59E0B",
      badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    };
  }
  return {
    status: "normal",
    label: "Optimal",
    color: "#0089FF",
    badgeBg: "bg-blue-500/10 text-[#0089FF] dark:text-blue-400 border-blue-500/20",
  };
}

export const INITIAL_FUEL_VEHICLES: FuelVehicle[] = [
  {
    id: "v1",
    refillLiters: 36,
    refillCount: 2,
    pilferageLiters: 10,
    pilferageCount: 1,
    distanceKm: 420,
    durationHours: "09:56 hrs",
    consumptionDistanceL: 36,
    consumptionDurationL: 10,
    mileageDistance: 9.4,
    mileageDuration: 8.5,
    name: "GJ15CM1516 - Truck",
    plateNumber: "GJ15CM1516",
    vehicleType: "Truck",
    fuelType: "Petrol",
    currentFuel: 155,
    capacity: 220,
    speed: 60,
    ignition: true,
    status: "running",
    address:
      "Jaikranti College, Dnyaneshwar Building, S.No. 70/2/1, Behind Airoli Railway Station, Mumbai.",
    lastUpdated: "15-11-2024 10:47 AM",
    branch: "Mumbai Central",
    batteryLevel: 94,
    rssi: -68,
    consumptionRate: 18.5,
    estimatedRangeKm: 835,
  },
  {
    id: "v2",
    refillLiters: 48,
    refillCount: 2,
    pilferageLiters: 12,
    pilferageCount: 1,
    distanceKm: 380,
    durationHours: "08:45 hrs",
    consumptionDistanceL: 42,
    consumptionDurationL: 14,
    mileageDistance: 9.0,
    mileageDuration: 8.1,
    name: "DD06KJ1407 - Truck",
    plateNumber: "DD06KJ1407",
    vehicleType: "Truck",
    fuelType: "Petrol",
    currentFuel: 104,
    capacity: 400,
    speed: 45,
    ignition: true,
    status: "running",
    address:
      "A-12, Green Park, Opposite Metro Station, Near Main Market, New Delhi - 110016.",
    lastUpdated: "07-08-2024 01:04 AM",
    branch: "North Logistics Hub",
    batteryLevel: 88,
    rssi: -72,
    consumptionRate: 24.0,
    estimatedRangeKm: 430,
  },
  {
    id: "v3",
    name: "MH48ES8956 - Truck",
    plateNumber: "MH48ES8956",
    vehicleType: "Truck",
    fuelType: "Petrol",
    currentFuel: 179,
    capacity: 277,
    speed: 38,
    ignition: true,
    status: "running",
    address:
      "501, Sea View Apartments, Carter Road, Bandra West, Mumbai - 400050. Landmark: Near Bandstand.",
    lastUpdated: "03-06-2024 01:33 AM",
    branch: "Mumbai Central",
    batteryLevel: 91,
    rssi: -65,
    consumptionRate: 19.2,
    estimatedRangeKm: 930,
  },
  {
    id: "v4",
    name: "KR0RD4050 - Truck",
    plateNumber: "KR0RD4050",
    vehicleType: "Truck",
    fuelType: "Petrol",
    currentFuel: 84,
    capacity: 398,
    speed: 43,
    ignition: true,
    status: "running",
    address:
      "Plot No. 25, 3rd Main, HSR Layout, Sector 2, Bengaluru - 560102. Landmark: Next to NIFT.",
    lastUpdated: "24-11-2024 12:24 AM",
    branch: "South Gateway Hub",
    batteryLevel: 79,
    rssi: -80,
    consumptionRate: 22.8,
    estimatedRangeKm: 368,
  },
  {
    id: "v5",
    name: "TM07MSM2568 - Truck",
    plateNumber: "TM07MSM2568",
    vehicleType: "Truck",
    fuelType: "Petrol",
    currentFuel: 198,
    capacity: 440,
    speed: 30,
    ignition: true,
    status: "running",
    address:
      "No. 8, Old Mahabalipuram Road, Perungudi, Chennai - 600096. Landmark: Near RMZ Millennia.",
    lastUpdated: "21-11-2024 07:03 AM",
    branch: "South Gateway Hub",
    batteryLevel: 95,
    rssi: -60,
    consumptionRate: 23.5,
    estimatedRangeKm: 840,
  },
  {
    id: "v6",
    name: "TS09PB2381 - Truck",
    plateNumber: "TS09PB2381",
    vehicleType: "Truck",
    fuelType: "Petrol",
    currentFuel: 126,
    capacity: 280,
    speed: 26,
    ignition: true,
    status: "running",
    address:
      "202, Silver Springs, Gachibowli, Hyderabad - 500032. Landmark: Opposite DLF Cyber City.",
    lastUpdated: "09-10-2024 10:09 AM",
    branch: "Central Logistics",
    batteryLevel: 86,
    rssi: -75,
    consumptionRate: 17.8,
    estimatedRangeKm: 705,
  },
  {
    id: "v7",
    name: "WB23MB8532 - Truck",
    plateNumber: "WB23MB8532",
    vehicleType: "Truck",
    fuelType: "Petrol",
    currentFuel: 228,
    capacity: 380,
    speed: 50,
    ignition: true,
    status: "running",
    address:
      "10B, Ballygunge Circular Road, Ballygunge, Kolkata - 700019. Landmark: Near South Point School.",
    lastUpdated: "19-11-2024 10:41 AM",
    branch: "East Express Hub",
    batteryLevel: 92,
    rssi: -64,
    consumptionRate: 21.0,
    estimatedRangeKm: 1085,
  },
  {
    id: "v8",
    name: "GJ01VS1211 - Truck",
    plateNumber: "GJ01VS1211",
    vehicleType: "Truck",
    fuelType: "Petrol",
    currentFuel: 10,
    capacity: 250,
    speed: 31,
    ignition: true,
    status: "running",
    address:
      "Shyamal Enclave, Satellite Road, Ahmedabad - 380015. Landmark: Opposite Iscon Mall.",
    lastUpdated: "12-07-2024 10:38 AM",
    branch: "Gujarat West Hub",
    batteryLevel: 68,
    rssi: -84,
    consumptionRate: 18.0,
    estimatedRangeKm: 55,
  },
  {
    id: "v9",
    refillLiters: 36,
    refillCount: 2,
    pilferageLiters: 10,
    pilferageCount: 1,
    distanceKm: 420,
    durationHours: "09:56 hrs",
    consumptionDistanceL: 36,
    consumptionDurationL: 10,
    mileageDistance: 9.4,
    mileageDuration: 8.5,
    name: "MH12AB9088 - Tanker",
    plateNumber: "MH12AB9088",
    vehicleType: "Tanker",
    fuelType: "Diesel",
    currentFuel: 310,
    capacity: 400,
    speed: 55,
    ignition: true,
    status: "running",
    address: "MIDC Phase 2, Chakan Industrial Area, Pune, Maharashtra.",
    lastUpdated: "13-12-2024 05:30 PM",
    branch: "Mumbai Central",
    batteryLevel: 93,
    rssi: -62,
    consumptionRate: 26.5,
    estimatedRangeKm: 1170,
  },
,
  {
    id: "v10",
    name: "TS07UA4390 - Truck",
    plateNumber: "TS07UA4390",
    vehicleType: "Truck",
    fuelType: "Diesel",
    currentFuel: 260,
    capacity: 350,
    speed: 48,
    ignition: true,
    status: "running",
    address: "Financial District, Nanakramguda, Hyderabad, Telangana - 500032.",
    lastUpdated: "13-12-2024 05:22 PM",
    branch: "Hyderabad South Hub",
    batteryLevel: 91,
    rssi: -65,
    consumptionRate: 22.4,
    estimatedRangeKm: 1160,
  },
  {
    id: "v11",
    name: "KA04ME5521 - Tanker",
    plateNumber: "KA04ME5521",
    vehicleType: "Tanker",
    fuelType: "Diesel",
    currentFuel: 340,
    capacity: 450,
    speed: 62,
    ignition: true,
    status: "running",
    address: "Electronic City Phase 1, Hosur Road, Bengaluru, Karnataka - 560100.",
    lastUpdated: "13-12-2024 05:18 PM",
    branch: "South Central Hub",
    batteryLevel: 94,
    rssi: -59,
    consumptionRate: 27.2,
    estimatedRangeKm: 1250,
  },
  {
    id: "v12",
    name: "DL01AA8920 - Tipper",
    plateNumber: "DL01AA8920",
    vehicleType: "Tipper",
    fuelType: "Petrol",
    currentFuel: 140,
    capacity: 220,
    speed: 28,
    ignition: false,
    status: "idle",
    address: "NH-48 Mahipalpur Express Corridor, Near IGI T3, New Delhi - 110037.",
    lastUpdated: "13-12-2024 05:05 PM",
    branch: "Delhi North Hub",
    batteryLevel: 88,
    rssi: -72,
    consumptionRate: 19.5,
    estimatedRangeKm: 715,
  }
];