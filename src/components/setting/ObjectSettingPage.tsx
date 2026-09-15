import React, { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  Plus,
  RotateCcw,
  Download,
  Copy,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Trash2,
  Edit2,
  SlidersHorizontal,
  Sliders,
  QrCode,
  FileText,
  Info,
  Truck,
  Eye,
  Fuel,
  Calendar,
  Layers,
  CheckCircle2,
  Printer,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  FuelCalibrationModal,
  type FuelCalibrationData,
} from "@/components/setting/FuelCalibrationModal";
import {
  DocumentUploadModal,
  type VehicleDocument,
} from "@/components/setting/DocumentUploadModal";

/* =========================================================================
   Vehicle / Object Data Types & Rich Mock Dataset (32 Items)
   ========================================================================= */

export type VehicleItem = {
  id: string;
  reseller: string;
  company: string;
  branch: string;
  name: string;
  objectGroup: string;
  imei: string;
  deviceImei: string;
  satelliteImei?: string;
  simPrimary: string;
  simSecondary?: string;
  deviceType: string;
  serverAddress: string;
  distanceCounter: string;
  distanceVariationSign: "+" | "-";
  distanceVariationValue: string;
  speedDetection: string;
  timezone: string;
  createdDate: string;
  installationDate: string;
  sensorCount: number;
  expiryDate: string;
  specification: string;
  isPrimary: boolean;
  ignBasedOnSpeed: boolean;
  unitOfDistance: string;
  trackerId: string;
  serialNo: string;
  copyFrom?: string;
  // Profile fields
  plateNumber: string;
  objectType: string;
  objectCategory: "Moveable" | "Immovable";
  color: string;
  dvirTemplate: string;
  manufactureDate: string;
  purchaseDate: string;
  purchaseAmount: string;
  weightCapacity: string;
  warrantyYears: string;
  fuelType: string;
  permit: string;
  batteryVoltage: string;
  distanceFuelConsumption: string;
  durationFuelConsumption: string;
  // Sensors and Docs count
  documentsCount: number;
};

export type VehicleFilterState = {
  company: string;
  branch: string;
  deviceType: string;
  objectGroup: string;
};

export const DEFAULT_VEHICLE_FILTERS: VehicleFilterState = {
  company: "All",
  branch: "All",
  deviceType: "All",
  objectGroup: "All",
};

export const INITIAL_VEHICLES: VehicleItem[] = [
  {
    id: "veh-1",
    reseller: "HP Reseller",
    company: "HP Company",
    branch: "HP Branch 8",
    name: "HP Boom Barrier Object",
    objectGroup: "Heavy Logistics",
    imei: "123321026",
    deviceImei: "123321026",
    satelliteImei: "",
    simPrimary: "+62 812 3456 7890",
    simSecondary: "",
    deviceType: "HP HttpPool Advance-HP HttpPool Service",
    serverAddress: "3.7.208.99 : 5004 ( TCP )",
    distanceCounter: "GPS",
    distanceVariationSign: "+",
    distanceVariationValue: "0",
    speedDetection: "From Device",
    timezone: "UTC+05:30",
    createdDate: "01/05/2026",
    installationDate: "--",
    sensorCount: 8,
    expiryDate: "16/09/2026, 17/09/2026",
    specification: "Primary",
    isPrimary: true,
    ignBasedOnSpeed: true,
    unitOfDistance: "Kilometer",
    trackerId: "--",
    serialNo: "--",
    plateNumber: "HP-08-BB-1026",
    objectType: "Boom Barrier",
    objectCategory: "Immovable",
    color: "Yellow",
    dvirTemplate: "--Select--",
    manufactureDate: "2023-01-10",
    purchaseDate: "2023-02-15",
    purchaseAmount: "25,000",
    weightCapacity: "0",
    warrantyYears: "2",
    fuelType: "Electric",
    permit: "Industrial Site Permit",
    batteryVoltage: "12v",
    distanceFuelConsumption: "0",
    durationFuelConsumption: "0.0",
    documentsCount: 2,
  },
  {
    id: "veh-2",
    reseller: "HP Reseller",
    company: "HP Company",
    branch: "HP EV Branch 2",
    name: "HP EV Object 37",
    objectGroup: "EV Delivery Fleet",
    imei: "123321117",
    deviceImei: "123321117",
    satelliteImei: "",
    simPrimary: "123321117",
    simSecondary: "",
    deviceType: "HP HttpPool Advance-HP HttpPool Service",
    serverAddress: "3.7.208.99 : 5004 ( TCP )",
    distanceCounter: "GPS",
    distanceVariationSign: "+",
    distanceVariationValue: "0",
    speedDetection: "From Device",
    timezone: "UTC+05:30",
    createdDate: "14/08/2026",
    installationDate: "15/05/2024 05:30 AM",
    sensorCount: 1,
    expiryDate: "16/09/2026, 17/09/2026",
    specification: "Primary",
    isPrimary: true,
    ignBasedOnSpeed: true,
    unitOfDistance: "Kilometer",
    trackerId: "HPEVGPS37",
    serialNo: "HPEVTRACKER37",
    plateNumber: "HP-02-EV-3737",
    objectType: "EV Van",
    objectCategory: "Moveable",
    color: "White",
    dvirTemplate: "Daily EV Inspection",
    manufactureDate: "2024-03-01",
    purchaseDate: "2024-05-15",
    purchaseAmount: "65,000",
    weightCapacity: "3.5",
    warrantyYears: "5",
    fuelType: "EV / Electric",
    permit: "National Commercial EV Permit",
    batteryVoltage: "48v",
    distanceFuelConsumption: "18.2",
    durationFuelConsumption: "1.2",
    documentsCount: 3,
  },
  {
    id: "veh-3",
    reseller: "HP Reseller",
    company: "HP Company",
    branch: "HP Branch 8",
    name: "HP BLE Tamper Object",
    objectGroup: "Asset Protection",
    imei: "123321025",
    deviceImei: "123321025",
    satelliteImei: "",
    simPrimary: "--",
    simSecondary: "",
    deviceType: "HP HttpPool Advance-HP HttpPool Service",
    serverAddress: "3.7.208.99 : 5004 ( TCP )",
    distanceCounter: "GPS",
    distanceVariationSign: "+",
    distanceVariationValue: "0",
    speedDetection: "From Device",
    timezone: "UTC+05:30",
    createdDate: "01/05/2026",
    installationDate: "--",
    sensorCount: 8,
    expiryDate: "16/09/2026, 17/09/2026",
    specification: "Primary",
    isPrimary: true,
    ignBasedOnSpeed: true,
    unitOfDistance: "Kilometer",
    trackerId: "--",
    serialNo: "--",
    plateNumber: "HP-08-BL-1025",
    objectType: "Tamper Beacon",
    objectCategory: "Immovable",
    color: "Black",
    dvirTemplate: "--Select--",
    manufactureDate: "2023-04-12",
    purchaseDate: "2023-05-01",
    purchaseAmount: "8,500",
    weightCapacity: "0",
    warrantyYears: "2",
    fuelType: "Battery",
    permit: "Site Security Permit",
    batteryVoltage: "12v",
    distanceFuelConsumption: "0",
    durationFuelConsumption: "0.0",
    documentsCount: 1,
  },
  {
    id: "veh-4",
    reseller: "HP Reseller",
    company: "HP Company",
    branch: "HP EV Branch 2",
    name: "HP EV Object 29",
    objectGroup: "EV Delivery Fleet",
    imei: "123321109",
    deviceImei: "123321109",
    satelliteImei: "",
    simPrimary: "123321109",
    simSecondary: "",
    deviceType: "HP HttpPool Advance-HP HttpPool Service",
    serverAddress: "3.7.208.99 : 5004 ( TCP )",
    distanceCounter: "GPS",
    distanceVariationSign: "+",
    distanceVariationValue: "0",
    speedDetection: "From Device",
    timezone: "UTC+05:30",
    createdDate: "14/08/2026",
    installationDate: "15/05/2024 05:30 AM",
    sensorCount: 1,
    expiryDate: "16/09/2026, 17/09/2026",
    specification: "Primary",
    isPrimary: true,
    ignBasedOnSpeed: true,
    unitOfDistance: "Kilometer",
    trackerId: "HPEVGPS29",
    serialNo: "HPEVTRACKER29",
    plateNumber: "HP-02-EV-2929",
    objectType: "EV Van",
    objectCategory: "Moveable",
    color: "White",
    dvirTemplate: "Daily EV Inspection",
    manufactureDate: "2024-02-01",
    purchaseDate: "2024-05-10",
    purchaseAmount: "65,000",
    weightCapacity: "3.5",
    warrantyYears: "5",
    fuelType: "EV / Electric",
    permit: "National Commercial EV Permit",
    batteryVoltage: "48v",
    distanceFuelConsumption: "18.0",
    durationFuelConsumption: "1.1",
    documentsCount: 2,
  },
  {
    id: "veh-5",
    reseller: "HP Reseller",
    company: "HP Company",
    branch: "HP Branch 8",
    name: "HP Custom Object",
    objectGroup: "Custom Utility",
    imei: "123321032",
    deviceImei: "123321032",
    satelliteImei: "",
    simPrimary: "--",
    simSecondary: "",
    deviceType: "HP HttpPool Advance-HP HttpPool Service",
    serverAddress: "3.7.208.99 : 5004 ( TCP )",
    distanceCounter: "GPS",
    distanceVariationSign: "+",
    distanceVariationValue: "0",
    speedDetection: "From Device",
    timezone: "UTC+05:30",
    createdDate: "01/05/2026",
    installationDate: "--",
    sensorCount: 8,
    expiryDate: "16/09/2026, 17/09/2026",
    specification: "Primary",
    isPrimary: true,
    ignBasedOnSpeed: true,
    unitOfDistance: "Kilometer",
    trackerId: "--",
    serialNo: "--",
    plateNumber: "HP-08-CU-1032",
    objectType: "Utility Unit",
    objectCategory: "Moveable",
    color: "Silver",
    dvirTemplate: "--Select--",
    manufactureDate: "2023-08-10",
    purchaseDate: "2023-09-01",
    purchaseAmount: "32,000",
    weightCapacity: "5.0",
    warrantyYears: "3",
    fuelType: "Diesel",
    permit: "Special Utility Permit",
    batteryVoltage: "24v",
    distanceFuelConsumption: "12.5",
    durationFuelConsumption: "1.5",
    documentsCount: 2,
  },
  {
    id: "veh-6",
    reseller: "HP Reseller",
    company: "HP Company",
    branch: "HP EV Branch 2",
    name: "HP EV Object 36",
    objectGroup: "EV Delivery Fleet",
    imei: "123321116",
    deviceImei: "123321116",
    satelliteImei: "",
    simPrimary: "123321116",
    simSecondary: "",
    deviceType: "HP HttpPool Advance-HP HttpPool Service",
    serverAddress: "3.7.208.99 : 5004 ( TCP )",
    distanceCounter: "GPS",
    distanceVariationSign: "+",
    distanceVariationValue: "0",
    speedDetection: "From Device",
    timezone: "UTC+05:30",
    createdDate: "14/08/2026",
    installationDate: "15/05/2024 05:30 AM",
    sensorCount: 1,
    expiryDate: "16/09/2026, 17/09/2026",
    specification: "Primary",
    isPrimary: true,
    ignBasedOnSpeed: true,
    unitOfDistance: "Kilometer",
    trackerId: "HPEVGPS36",
    serialNo: "HPEVTRACKER36",
    plateNumber: "HP-02-EV-3636",
    objectType: "EV Van",
    objectCategory: "Moveable",
    color: "White",
    dvirTemplate: "Daily EV Inspection",
    manufactureDate: "2024-03-01",
    purchaseDate: "2024-05-15",
    purchaseAmount: "65,000",
    weightCapacity: "3.5",
    warrantyYears: "5",
    fuelType: "EV / Electric",
    permit: "National Commercial EV Permit",
    batteryVoltage: "48v",
    distanceFuelConsumption: "18.5",
    durationFuelConsumption: "1.2",
    documentsCount: 2,
  },
  {
    id: "veh-7",
    reseller: "HP Reseller",
    company: "HP Company",
    branch: "HP Branch 8",
    name: "HP Crane State Object",
    objectGroup: "Heavy Machinery",
    imei: "123321031",
    deviceImei: "123321031",
    satelliteImei: "",
    simPrimary: "--",
    simSecondary: "",
    deviceType: "HP HttpPool Advance-HP HttpPool Service",
    serverAddress: "3.7.208.99 : 5004 ( TCP )",
    distanceCounter: "GPS",
    distanceVariationSign: "+",
    distanceVariationValue: "0",
    speedDetection: "From Device",
    timezone: "UTC+05:30",
    createdDate: "01/05/2026",
    installationDate: "--",
    sensorCount: 8,
    expiryDate: "16/09/2026, 17/09/2026",
    specification: "Primary",
    isPrimary: true,
    ignBasedOnSpeed: true,
    unitOfDistance: "Kilometer",
    trackerId: "--",
    serialNo: "--",
    plateNumber: "HP-08-CR-1031",
    objectType: "Hydraulic Crane",
    objectCategory: "Moveable",
    color: "Orange",
    dvirTemplate: "Heavy Plant Inspection",
    manufactureDate: "2022-06-15",
    purchaseDate: "2022-08-20",
    purchaseAmount: "180,000",
    weightCapacity: "45.0",
    warrantyYears: "3",
    fuelType: "Diesel",
    permit: "Heavy Equipment Operating Permit",
    batteryVoltage: "24v",
    distanceFuelConsumption: "35.0",
    durationFuelConsumption: "4.5",
    documentsCount: 4,
  },
  {
    id: "veh-8",
    reseller: "HP Reseller",
    company: "HP Company",
    branch: "HP EV Branch 2",
    name: "HP EV Object 35",
    objectGroup: "EV Delivery Fleet",
    imei: "123321115",
    deviceImei: "123321115",
    satelliteImei: "",
    simPrimary: "123321115",
    simSecondary: "",
    deviceType: "HP HttpPool Advance-HP HttpPool Service",
    serverAddress: "3.7.208.99 : 5004 ( TCP )",
    distanceCounter: "GPS",
    distanceVariationSign: "+",
    distanceVariationValue: "0",
    speedDetection: "From Device",
    timezone: "UTC+05:30",
    createdDate: "14/08/2026",
    installationDate: "15/05/2024 05:30 AM",
    sensorCount: 1,
    expiryDate: "16/09/2026, 17/09/2026",
    specification: "Primary",
    isPrimary: true,
    ignBasedOnSpeed: true,
    unitOfDistance: "Kilometer",
    trackerId: "HPEVGPS35",
    serialNo: "HPEVTRACKER35",
    plateNumber: "HP-02-EV-3535",
    objectType: "EV Van",
    objectCategory: "Moveable",
    color: "White",
    dvirTemplate: "Daily EV Inspection",
    manufactureDate: "2024-03-01",
    purchaseDate: "2024-05-15",
    purchaseAmount: "65,000",
    weightCapacity: "3.5",
    warrantyYears: "5",
    fuelType: "EV / Electric",
    permit: "National Commercial EV Permit",
    batteryVoltage: "48v",
    distanceFuelConsumption: "18.2",
    durationFuelConsumption: "1.2",
    documentsCount: 2,
  },
  {
    id: "veh-9",
    reseller: "HP Reseller",
    company: "HP Company",
    branch: "HP Branch 8",
    name: "HP Chiller Object",
    objectGroup: "Cold Chain Logistics",
    imei: "123321030",
    deviceImei: "123321030",
    satelliteImei: "",
    simPrimary: "--",
    simSecondary: "",
    deviceType: "HP HttpPool Advance-HP HttpPool Service",
    serverAddress: "3.7.208.99 : 5004 ( TCP )",
    distanceCounter: "GPS",
    distanceVariationSign: "+",
    distanceVariationValue: "0",
    speedDetection: "From Device",
    timezone: "UTC+05:30",
    createdDate: "01/05/2026",
    installationDate: "--",
    sensorCount: 8,
    expiryDate: "16/09/2026, 17/09/2026",
    specification: "Primary",
    isPrimary: true,
    ignBasedOnSpeed: true,
    unitOfDistance: "Kilometer",
    trackerId: "--",
    serialNo: "--",
    plateNumber: "HP-08-CH-1030",
    objectType: "Reefer Trailer",
    objectCategory: "Moveable",
    color: "Blue",
    dvirTemplate: "Refrigerated Transport Check",
    manufactureDate: "2023-05-10",
    purchaseDate: "2023-06-15",
    purchaseAmount: "95,000",
    weightCapacity: "24.0",
    warrantyYears: "3",
    fuelType: "Diesel + Reefer",
    permit: "Cold Chain Health & Food Permit",
    batteryVoltage: "24v",
    distanceFuelConsumption: "26.0",
    durationFuelConsumption: "2.8",
    documentsCount: 3,
  },
  {
    id: "veh-10",
    reseller: "HP Reseller",
    company: "HP Company",
    branch: "HP EV Branch 2",
    name: "HP EV Object 34",
    objectGroup: "EV Delivery Fleet",
    imei: "123321114",
    deviceImei: "123321114",
    satelliteImei: "",
    simPrimary: "123321114",
    simSecondary: "",
    deviceType: "HP HttpPool Advance-HP HttpPool Service",
    serverAddress: "3.7.208.99 : 5004 ( TCP )",
    distanceCounter: "GPS",
    distanceVariationSign: "+",
    distanceVariationValue: "0",
    speedDetection: "From Device",
    timezone: "UTC+05:30",
    createdDate: "14/08/2026",
    installationDate: "15/05/2024 05:30 AM",
    sensorCount: 1,
    expiryDate: "16/09/2026, 17/09/2026",
    specification: "Primary",
    isPrimary: true,
    ignBasedOnSpeed: true,
    unitOfDistance: "Kilometer",
    trackerId: "HPEVGPS34",
    serialNo: "HPEVTRACKER34",
    plateNumber: "HP-02-EV-3434",
    objectType: "EV Van",
    objectCategory: "Moveable",
    color: "White",
    dvirTemplate: "Daily EV Inspection",
    manufactureDate: "2024-03-01",
    purchaseDate: "2024-05-15",
    purchaseAmount: "65,000",
    weightCapacity: "3.5",
    warrantyYears: "5",
    fuelType: "EV / Electric",
    permit: "National Commercial EV Permit",
    batteryVoltage: "48v",
    distanceFuelConsumption: "18.2",
    durationFuelConsumption: "1.2",
    documentsCount: 2,
  },
  {
    id: "veh-11",
    reseller: "Global Reseller Hub",
    company: "Global Logistics Inc",
    branch: "Central Branch",
    name: "GL Heavy Hauler 101",
    objectGroup: "Heavy Logistics",
    imei: "860492048192001",
    deviceImei: "860492048192001",
    satelliteImei: "",
    simPrimary: "+1 415 555 2671",
    simSecondary: "",
    deviceType: "Teltonika FMB920",
    serverAddress: "3.7.208.99 : 5027 ( TCP )",
    distanceCounter: "Odometer",
    distanceVariationSign: "+",
    distanceVariationValue: "1",
    speedDetection: "GPS Calculation",
    timezone: "UTC-05:00",
    createdDate: "10/02/2026",
    installationDate: "12/02/2026 10:00 AM",
    sensorCount: 6,
    expiryDate: "10/02/2027",
    specification: "Primary",
    isPrimary: true,
    ignBasedOnSpeed: true,
    unitOfDistance: "Miles",
    trackerId: "GLTRK101",
    serialNo: "SN-GL-99821",
    plateNumber: "GL-NY-4921",
    objectType: "Semi Trailer Truck",
    objectCategory: "Moveable",
    color: "Blue",
    dvirTemplate: "Heavy Commercial Daily DVIR",
    manufactureDate: "2022-11-15",
    purchaseDate: "2023-01-20",
    purchaseAmount: "145,000",
    weightCapacity: "40.0",
    warrantyYears: "4",
    fuelType: "Diesel",
    permit: "Interstate Heavy Haul",
    batteryVoltage: "24v",
    distanceFuelConsumption: "6.8",
    durationFuelConsumption: "3.2",
    documentsCount: 4,
  },
  {
    id: "veh-12",
    reseller: "Global Reseller Hub",
    company: "Global Logistics Inc",
    branch: "North Terminal",
    name: "GL Cold Liner Express 08",
    objectGroup: "Cold Chain Logistics",
    imei: "860492048192002",
    deviceImei: "860492048192002",
    satelliteImei: "",
    simPrimary: "+1 415 555 8892",
    simSecondary: "",
    deviceType: "Queclink GV300",
    serverAddress: "3.7.208.99 : 5003 ( TCP )",
    distanceCounter: "GPS",
    distanceVariationSign: "+",
    distanceVariationValue: "0",
    speedDetection: "From Device",
    timezone: "UTC-05:00",
    createdDate: "18/02/2026",
    installationDate: "20/02/2026 02:30 PM",
    sensorCount: 5,
    expiryDate: "18/02/2027",
    specification: "Primary",
    isPrimary: true,
    ignBasedOnSpeed: true,
    unitOfDistance: "Miles",
    trackerId: "GLTRK108",
    serialNo: "SN-GL-99822",
    plateNumber: "GL-IL-8802",
    objectType: "Refrigerated Van",
    objectCategory: "Moveable",
    color: "White",
    dvirTemplate: "Refrigerated Transport Check",
    manufactureDate: "2023-05-12",
    purchaseDate: "2023-07-01",
    purchaseAmount: "92,000",
    weightCapacity: "18.0",
    warrantyYears: "3",
    fuelType: "Diesel + Reefer",
    permit: "Cold Chain Food Safety Permit",
    batteryVoltage: "24v",
    distanceFuelConsumption: "9.5",
    durationFuelConsumption: "2.1",
    documentsCount: 3,
  },
  {
    id: "veh-13",
    reseller: "FleetTech Resellers",
    company: "Fleet Cargo West",
    branch: "West Hub",
    name: "FCW Delivery Sprinter 44",
    objectGroup: "Service Vans",
    imei: "868201092837101",
    deviceImei: "868201092837101",
    satelliteImei: "",
    simPrimary: "+1 206 555 0192",
    simSecondary: "",
    deviceType: "Concox GT06N",
    serverAddress: "3.7.208.99 : 5023 ( TCP )",
    distanceCounter: "GPS",
    distanceVariationSign: "+",
    distanceVariationValue: "0",
    speedDetection: "From Device",
    timezone: "UTC-08:00",
    createdDate: "05/03/2026",
    installationDate: "06/03/2026 09:15 AM",
    sensorCount: 3,
    expiryDate: "05/03/2027",
    specification: "Secondary",
    isPrimary: false,
    ignBasedOnSpeed: true,
    unitOfDistance: "Miles",
    trackerId: "FCW-SP-44",
    serialNo: "SN-FC-4401",
    plateNumber: "WA-772-FC",
    objectType: "Sprinter Van",
    objectCategory: "Moveable",
    color: "Silver",
    dvirTemplate: "Standard Inspection",
    manufactureDate: "2023-09-10",
    purchaseDate: "2023-11-05",
    purchaseAmount: "52,000",
    weightCapacity: "4.5",
    warrantyYears: "3",
    fuelType: "Diesel",
    permit: "Urban Delivery License",
    batteryVoltage: "12v",
    distanceFuelConsumption: "14.2",
    durationFuelConsumption: "1.4",
    documentsCount: 2,
  },
  {
    id: "veh-14",
    reseller: "FleetTech Resellers",
    company: "Fleet Cargo West",
    branch: "West Hub",
    name: "FCW Urban Cargo 12",
    objectGroup: "EV Delivery Fleet",
    imei: "868201092837102",
    deviceImei: "868201092837102",
    satelliteImei: "",
    simPrimary: "+1 206 555 0193",
    simSecondary: "",
    deviceType: "Teltonika FMB920",
    serverAddress: "3.7.208.99 : 5027 ( TCP )",
    distanceCounter: "GPS",
    distanceVariationSign: "+",
    distanceVariationValue: "0",
    speedDetection: "From Device",
    timezone: "UTC-08:00",
    createdDate: "12/03/2026",
    installationDate: "14/03/2026 11:30 AM",
    sensorCount: 2,
    expiryDate: "12/03/2027",
    specification: "Primary",
    isPrimary: true,
    ignBasedOnSpeed: true,
    unitOfDistance: "Miles",
    trackerId: "FCW-EV-12",
    serialNo: "SN-FC-4402",
    plateNumber: "WA-883-EV",
    objectType: "Electric Truck",
    objectCategory: "Moveable",
    color: "White",
    dvirTemplate: "Daily EV Inspection",
    manufactureDate: "2024-01-15",
    purchaseDate: "2024-03-01",
    purchaseAmount: "78,000",
    weightCapacity: "7.5",
    warrantyYears: "5",
    fuelType: "EV / Electric",
    permit: "Zero Emission Cargo Permit",
    batteryVoltage: "48v",
    distanceFuelConsumption: "19.5",
    durationFuelConsumption: "0.9",
    documentsCount: 3,
  },
  {
    id: "veh-15",
    reseller: "FastTrack Telematics",
    company: "FastTrack Mobility",
    branch: "South Depot",
    name: "FTM Heavy Dumper 03",
    objectGroup: "Heavy Machinery",
    imei: "867301928392015",
    deviceImei: "867301928392015",
    satelliteImei: "",
    simPrimary: "+1 305 555 9912",
    simSecondary: "",
    deviceType: "Ruptela Pro4",
    serverAddress: "3.7.208.99 : 5004 ( TCP )",
    distanceCounter: "ECU",
    distanceVariationSign: "+",
    distanceVariationValue: "0",
    speedDetection: "ECU / Speedometer",
    timezone: "UTC-05:00",
    createdDate: "22/03/2026",
    installationDate: "25/03/2026 08:00 AM",
    sensorCount: 7,
    expiryDate: "22/03/2027",
    specification: "Primary",
    isPrimary: true,
    ignBasedOnSpeed: true,
    unitOfDistance: "Miles",
    trackerId: "FTM-DMP-03",
    serialNo: "SN-FT-9915",
    plateNumber: "FL-991-HD",
    objectType: "Mining Dump Truck",
    objectCategory: "Moveable",
    color: "Yellow",
    dvirTemplate: "Heavy Plant Inspection",
    manufactureDate: "2022-04-10",
    purchaseDate: "2022-06-15",
    purchaseAmount: "210,000",
    weightCapacity: "60.0",
    warrantyYears: "3",
    fuelType: "Diesel",
    permit: "Heavy Construction License",
    batteryVoltage: "24v",
    distanceFuelConsumption: "42.0",
    durationFuelConsumption: "5.5",
    documentsCount: 4,
  },
  {
    id: "veh-16",
    reseller: "FastTrack Telematics",
    company: "FastTrack Mobility",
    branch: "South Depot",
    name: "FTM Site Generator Unit",
    objectGroup: "Asset Protection",
    imei: "867301928392016",
    deviceImei: "867301928392016",
    satelliteImei: "",
    simPrimary: "--",
    simSecondary: "",
    deviceType: "HP HttpPool Advance-HP HttpPool Service",
    serverAddress: "3.7.208.99 : 5004 ( TCP )",
    distanceCounter: "GPS",
    distanceVariationSign: "+",
    distanceVariationValue: "0",
    speedDetection: "From Device",
    timezone: "UTC-05:00",
    createdDate: "25/03/2026",
    installationDate: "--",
    sensorCount: 4,
    expiryDate: "25/03/2027",
    specification: "Auxiliary",
    isPrimary: false,
    ignBasedOnSpeed: false,
    unitOfDistance: "Kilometer",
    trackerId: "--",
    serialNo: "--",
    plateNumber: "FL-GEN-16",
    objectType: "Diesel Generator",
    objectCategory: "Immovable",
    color: "Green",
    dvirTemplate: "--Select--",
    manufactureDate: "2023-02-18",
    purchaseDate: "2023-04-01",
    purchaseAmount: "35,000",
    weightCapacity: "0",
    warrantyYears: "2",
    fuelType: "Diesel",
    permit: "Stationary Power Permit",
    batteryVoltage: "12v",
    distanceFuelConsumption: "0",
    durationFuelConsumption: "4.2",
    documentsCount: 2,
  },
  {
    id: "veh-17",
    reseller: "HP Reseller",
    company: "HP Company",
    branch: "HP Branch 8",
    name: "HP Heavy Tanker 09",
    objectGroup: "Heavy Logistics",
    imei: "123321045",
    deviceImei: "123321045",
    satelliteImei: "",
    simPrimary: "+62 812 9988 1234",
    simSecondary: "",
    deviceType: "HP HttpPool Advance-HP HttpPool Service",
    serverAddress: "3.7.208.99 : 5004 ( TCP )",
    distanceCounter: "GPS",
    distanceVariationSign: "+",
    distanceVariationValue: "0",
    speedDetection: "From Device",
    timezone: "UTC+05:30",
    createdDate: "02/04/2026",
    installationDate: "05/04/2026 10:30 AM",
    sensorCount: 8,
    expiryDate: "02/04/2027",
    specification: "Primary",
    isPrimary: true,
    ignBasedOnSpeed: true,
    unitOfDistance: "Kilometer",
    trackerId: "HPTNK09",
    serialNo: "HP-TNK-45",
    plateNumber: "HP-08-TK-1045",
    objectType: "Fuel Tanker Truck",
    objectCategory: "Moveable",
    color: "Silver",
    dvirTemplate: "Heavy Commercial Daily DVIR",
    manufactureDate: "2023-01-20",
    purchaseDate: "2023-03-10",
    purchaseAmount: "135,000",
    weightCapacity: "32.0",
    warrantyYears: "3",
    fuelType: "Diesel",
    permit: "Hazardous Materials Transport",
    batteryVoltage: "24v",
    distanceFuelConsumption: "28.5",
    durationFuelConsumption: "3.1",
    documentsCount: 4,
  },
  {
    id: "veh-18",
    reseller: "HP Reseller",
    company: "HP Company",
    branch: "HP EV Branch 2",
    name: "HP EV Object 41",
    objectGroup: "EV Delivery Fleet",
    imei: "123321121",
    deviceImei: "123321121",
    satelliteImei: "",
    simPrimary: "123321121",
    simSecondary: "",
    deviceType: "HP HttpPool Advance-HP HttpPool Service",
    serverAddress: "3.7.208.99 : 5004 ( TCP )",
    distanceCounter: "GPS",
    distanceVariationSign: "+",
    distanceVariationValue: "0",
    speedDetection: "From Device",
    timezone: "UTC+05:30",
    createdDate: "10/04/2026",
    installationDate: "12/04/2026 09:00 AM",
    sensorCount: 2,
    expiryDate: "10/04/2027",
    specification: "Primary",
    isPrimary: true,
    ignBasedOnSpeed: true,
    unitOfDistance: "Kilometer",
    trackerId: "HPEVGPS41",
    serialNo: "HPEVTRACKER41",
    plateNumber: "HP-02-EV-4141",
    objectType: "EV Delivery Van",
    objectCategory: "Moveable",
    color: "White",
    dvirTemplate: "Daily EV Inspection",
    manufactureDate: "2024-02-10",
    purchaseDate: "2024-04-01",
    purchaseAmount: "65,000",
    weightCapacity: "3.5",
    warrantyYears: "5",
    fuelType: "EV / Electric",
    permit: "National Commercial EV Permit",
    batteryVoltage: "48v",
    distanceFuelConsumption: "18.2",
    durationFuelConsumption: "1.2",
    documentsCount: 2,
  },
  {
    id: "veh-19",
    reseller: "Global Reseller Hub",
    company: "Global Logistics Inc",
    branch: "Central Branch",
    name: "GL Highway Freight 202",
    objectGroup: "Heavy Logistics",
    imei: "860492048192019",
    deviceImei: "860492048192019",
    satelliteImei: "",
    simPrimary: "+1 415 555 4918",
    simSecondary: "",
    deviceType: "Teltonika FMB920",
    serverAddress: "3.7.208.99 : 5027 ( TCP )",
    distanceCounter: "Odometer",
    distanceVariationSign: "+",
    distanceVariationValue: "0",
    speedDetection: "From Device",
    timezone: "UTC-05:00",
    createdDate: "15/04/2026",
    installationDate: "18/04/2026 01:15 PM",
    sensorCount: 6,
    expiryDate: "15/04/2027",
    specification: "Primary",
    isPrimary: true,
    ignBasedOnSpeed: true,
    unitOfDistance: "Miles",
    trackerId: "GLTRK202",
    serialNo: "SN-GL-99829",
    plateNumber: "GL-PA-2022",
    objectType: "Freight Tractor",
    objectCategory: "Moveable",
    color: "Dark Blue",
    dvirTemplate: "Heavy Commercial Daily DVIR",
    manufactureDate: "2023-06-20",
    purchaseDate: "2023-08-15",
    purchaseAmount: "150,000",
    weightCapacity: "42.0",
    warrantyYears: "4",
    fuelType: "Diesel",
    permit: "Interstate Freight Authority",
    batteryVoltage: "24v",
    distanceFuelConsumption: "7.1",
    durationFuelConsumption: "3.0",
    documentsCount: 3,
  },
  {
    id: "veh-20",
    reseller: "FleetTech Resellers",
    company: "Fleet Cargo West",
    branch: "North Terminal",
    name: "FCW Heavy Flatbed 07",
    objectGroup: "Heavy Machinery",
    imei: "868201092837120",
    deviceImei: "868201092837120",
    satelliteImei: "",
    simPrimary: "+1 206 555 7712",
    simSecondary: "",
    deviceType: "Concox GT06N",
    serverAddress: "3.7.208.99 : 5023 ( TCP )",
    distanceCounter: "GPS",
    distanceVariationSign: "+",
    distanceVariationValue: "0",
    speedDetection: "From Device",
    timezone: "UTC-08:00",
    createdDate: "20/04/2026",
    installationDate: "22/04/2026 11:00 AM",
    sensorCount: 5,
    expiryDate: "20/04/2027",
    specification: "Primary",
    isPrimary: true,
    ignBasedOnSpeed: true,
    unitOfDistance: "Miles",
    trackerId: "FCW-FB-07",
    serialNo: "SN-FC-4420",
    plateNumber: "OR-441-FB",
    objectType: "Flatbed Heavy Transport",
    objectCategory: "Moveable",
    color: "Red",
    dvirTemplate: "Heavy Plant Inspection",
    manufactureDate: "2022-10-10",
    purchaseDate: "2022-12-01",
    purchaseAmount: "128,000",
    weightCapacity: "38.0",
    warrantyYears: "3",
    fuelType: "Diesel",
    permit: "Overweight Transport Permit",
    batteryVoltage: "24v",
    distanceFuelConsumption: "24.0",
    durationFuelConsumption: "2.9",
    documentsCount: 3,
  },
  {
    id: "veh-21",
    reseller: "HP Reseller",
    company: "HP Company",
    branch: "HP Branch 8",
    name: "HP Utility Loader 02",
    objectGroup: "Custom Utility",
    imei: "123321051",
    deviceImei: "123321051",
    satelliteImei: "",
    simPrimary: "--",
    simSecondary: "",
    deviceType: "HP HttpPool Advance-HP HttpPool Service",
    serverAddress: "3.7.208.99 : 5004 ( TCP )",
    distanceCounter: "GPS",
    distanceVariationSign: "+",
    distanceVariationValue: "0",
    speedDetection: "From Device",
    timezone: "UTC+05:30",
    createdDate: "24/04/2026",
    installationDate: "--",
    sensorCount: 6,
    expiryDate: "24/04/2027",
    specification: "Secondary",
    isPrimary: false,
    ignBasedOnSpeed: true,
    unitOfDistance: "Kilometer",
    trackerId: "--",
    serialNo: "--",
    plateNumber: "HP-08-LD-1051",
    objectType: "Wheel Loader",
    objectCategory: "Moveable",
    color: "Yellow",
    dvirTemplate: "Standard Inspection",
    manufactureDate: "2023-03-15",
    purchaseDate: "2023-05-10",
    purchaseAmount: "74,000",
    weightCapacity: "12.0",
    warrantyYears: "3",
    fuelType: "Diesel",
    permit: "Site Loader Permit",
    batteryVoltage: "24v",
    distanceFuelConsumption: "15.0",
    durationFuelConsumption: "2.2",
    documentsCount: 2,
  },
  {
    id: "veh-22",
    reseller: "FastTrack Telematics",
    company: "FastTrack Mobility",
    branch: "Central Branch",
    name: "FTM Rapid Courier 19",
    objectGroup: "Service Vans",
    imei: "867301928392022",
    deviceImei: "867301928392022",
    satelliteImei: "",
    simPrimary: "+1 305 555 4481",
    simSecondary: "",
    deviceType: "Meitrack T333",
    serverAddress: "3.7.208.99 : 5004 ( TCP )",
    distanceCounter: "GPS",
    distanceVariationSign: "+",
    distanceVariationValue: "0",
    speedDetection: "From Device",
    timezone: "UTC-05:00",
    createdDate: "28/04/2026",
    installationDate: "30/04/2026 03:00 PM",
    sensorCount: 3,
    expiryDate: "28/04/2027",
    specification: "Primary",
    isPrimary: true,
    ignBasedOnSpeed: true,
    unitOfDistance: "Miles",
    trackerId: "FTM-CR-19",
    serialNo: "SN-FT-9922",
    plateNumber: "FL-882-CR",
    objectType: "Courier Van",
    objectCategory: "Moveable",
    color: "White",
    dvirTemplate: "Standard Inspection",
    manufactureDate: "2024-01-20",
    purchaseDate: "2024-03-15",
    purchaseAmount: "48,000",
    weightCapacity: "3.0",
    warrantyYears: "3",
    fuelType: "Petrol",
    permit: "Commercial Delivery",
    batteryVoltage: "12v",
    distanceFuelConsumption: "15.5",
    durationFuelConsumption: "1.3",
    documentsCount: 2,
  },
  {
    id: "veh-23",
    reseller: "Global Reseller Hub",
    company: "Global Logistics Inc",
    branch: "North Terminal",
    name: "GL Express Reefer 14",
    objectGroup: "Cold Chain Logistics",
    imei: "860492048192023",
    deviceImei: "860492048192023",
    satelliteImei: "",
    simPrimary: "+1 415 555 1923",
    simSecondary: "",
    deviceType: "Queclink GV300",
    serverAddress: "3.7.208.99 : 5003 ( TCP )",
    distanceCounter: "GPS",
    distanceVariationSign: "+",
    distanceVariationValue: "0",
    speedDetection: "From Device",
    timezone: "UTC-05:00",
    createdDate: "02/05/2026",
    installationDate: "04/05/2026 09:30 AM",
    sensorCount: 6,
    expiryDate: "02/05/2027",
    specification: "Primary",
    isPrimary: true,
    ignBasedOnSpeed: true,
    unitOfDistance: "Miles",
    trackerId: "GLTRK214",
    serialNo: "SN-GL-99833",
    plateNumber: "GL-OH-1414",
    objectType: "Refrigerated Transport",
    objectCategory: "Moveable",
    color: "White",
    dvirTemplate: "Refrigerated Transport Check",
    manufactureDate: "2023-08-15",
    purchaseDate: "2023-10-01",
    purchaseAmount: "96,000",
    weightCapacity: "20.0",
    warrantyYears: "3",
    fuelType: "Diesel + Reefer",
    permit: "Cold Chain Food Safety Permit",
    batteryVoltage: "24v",
    distanceFuelConsumption: "10.0",
    durationFuelConsumption: "2.3",
    documentsCount: 3,
  },
  {
    id: "veh-24",
    reseller: "HP Reseller",
    company: "HP Company",
    branch: "HP EV Branch 2",
    name: "HP EV Object 48",
    objectGroup: "EV Delivery Fleet",
    imei: "123321128",
    deviceImei: "123321128",
    satelliteImei: "",
    simPrimary: "123321128",
    simSecondary: "",
    deviceType: "HP HttpPool Advance-HP HttpPool Service",
    serverAddress: "3.7.208.99 : 5004 ( TCP )",
    distanceCounter: "GPS",
    distanceVariationSign: "+",
    distanceVariationValue: "0",
    speedDetection: "From Device",
    timezone: "UTC+05:30",
    createdDate: "08/05/2026",
    installationDate: "10/05/2026 11:15 AM",
    sensorCount: 2,
    expiryDate: "08/05/2027",
    specification: "Primary",
    isPrimary: true,
    ignBasedOnSpeed: true,
    unitOfDistance: "Kilometer",
    trackerId: "HPEVGPS48",
    serialNo: "HPEVTRACKER48",
    plateNumber: "HP-02-EV-4848",
    objectType: "EV Cargo Van",
    objectCategory: "Moveable",
    color: "White",
    dvirTemplate: "Daily EV Inspection",
    manufactureDate: "2024-03-10",
    purchaseDate: "2024-05-01",
    purchaseAmount: "68,000",
    weightCapacity: "3.8",
    warrantyYears: "5",
    fuelType: "EV / Electric",
    permit: "National Commercial EV Permit",
    batteryVoltage: "48v",
    distanceFuelConsumption: "18.0",
    durationFuelConsumption: "1.1",
    documentsCount: 2,
  },
];

const DEVICE_TYPE_OPTIONS = [
  "HP HttpPool Advance-HP HttpPool Service",
  "General General 5004",
  "Teltonika FMB920",
  "Concox GT06N",
  "Queclink GV300",
  "Ruptela Pro4",
  "Meitrack T333",
  "Suntech ST310U",
  "Coban TK103",
  "Bofan PT502",
];

const SPECIFICATION_OPTIONS = ["Primary", "Secondary", "Auxiliary"];
const DISTANCE_UNIT_OPTIONS = ["Kilometer", "Miles", "Meters", "Nautical Miles"];
const DISTANCE_COUNTER_OPTIONS = ["GPS", "Odometer", "ECU"];
const SPEED_DETECTION_OPTIONS = ["From Device", "GPS Calculation", "ECU / Speedometer"];
const TIMEZONE_OPTIONS = [
  "UTC+05:30",
  "UTC+00:00",
  "UTC-05:00",
  "UTC-08:00",
  "UTC+01:00",
  "UTC+04:00",
  "UTC+07:00",
  "UTC+08:00",
];

const OBJECT_GROUP_OPTIONS = [
  "Heavy Logistics",
  "EV Delivery Fleet",
  "Asset Protection",
  "Custom Utility",
  "Heavy Machinery",
  "Cold Chain Logistics",
  "Service Vans",
];

const PAGE_SIZES = [20, 50, 100, 200];

/* Initial Sensors Template for Vehicles */
export type SensorRow = {
  id: string;
  active: boolean;
  connectionType: string;
  connectedSensor: string;
  readingType: string;
  workHourCalculation: boolean;
  hasCalibration: boolean;
};

const DEFAULT_SENSORS: SensorRow[] = [
  { id: "s1", active: true, connectionType: "analog 1", connectedSensor: "Fuel", readingType: "Direct", workHourCalculation: false, hasCalibration: true },
  { id: "s2", active: false, connectionType: "analog 2", connectedSensor: "Fuel", readingType: "Direct", workHourCalculation: false, hasCalibration: true },
  { id: "s3", active: true, connectionType: "Digital Input 1", connectedSensor: "Ignition", readingType: "Direct", workHourCalculation: true, hasCalibration: false },
  { id: "s4", active: true, connectionType: "Digital Input 2", connectedSensor: "Door Sensor", readingType: "Direct", workHourCalculation: false, hasCalibration: false },
  { id: "s5", active: false, connectionType: "Digital Input 3", connectedSensor: "SOS Panic", readingType: "Direct", workHourCalculation: false, hasCalibration: false },
  { id: "s6", active: false, connectionType: "Digital Input 4", connectedSensor: "PTO", readingType: "Direct", workHourCalculation: true, hasCalibration: false },
  { id: "s7", active: true, connectionType: "Fuel Sensor", connectedSensor: "Fuel", readingType: "Direct", workHourCalculation: false, hasCalibration: true },
  { id: "s8", active: true, connectionType: "RPM", connectedSensor: "RPM", readingType: "Direct", workHourCalculation: true, hasCalibration: true },
  { id: "s9", active: true, connectionType: "Temprature", connectedSensor: "Temprature", readingType: "Direct", workHourCalculation: false, hasCalibration: true },
  { id: "s10", active: false, connectionType: "Load Sensor", connectedSensor: "Load Sensor", readingType: "Direct", workHourCalculation: false, hasCalibration: true },
];

const DEFAULT_DOCS: VehicleDocument[] = [
  {
    id: "d1",
    name: "Commercial Vehicle Insurance Policy",
    type: "Insurance Policy",
    docNumber: "POL-ID-992381-X",
    issueDate: "2025-01-01",
    expiryDate: "2026-12-31",
    alertDays: 30,
    fileName: "insurance_policy_2026.pdf",
    fileSize: "1.8 MB",
    status: "Valid",
  },
  {
    id: "d2",
    name: "National Motor Vehicle Registration (RC)",
    type: "Registration Certificate (RC)",
    docNumber: "RC-B-1234-XYZ",
    issueDate: "2022-06-15",
    expiryDate: "2032-06-14",
    alertDays: 60,
    fileName: "registration_certificate.pdf",
    fileSize: "2.4 MB",
    status: "Valid",
  },
];

/* =========================================================================
   Main Object / Vehicle Setting Page Component
   ========================================================================= */

export function ObjectSettingPage() {
  const [vehicles, setVehicles] = useState<VehicleItem[]>(INITIAL_VEHICLES);
  const [searchField, setSearchField] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageSizeOpen, setPageSizeOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Right Side Filter Drawer State
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<VehicleFilterState>(DEFAULT_VEHICLE_FILTERS);

  // Modal State for Vehicle Detail (Add / Edit)
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleItem | null>(null);

  // Modal State for Copy Vehicle
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [copySourceVehicle, setCopySourceVehicle] = useState<VehicleItem | null>(null);

  // QR Code Modal State
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedQrVehicle, setSelectedQrVehicle] = useState<VehicleItem | null>(null);

  const activeDrawerFilterCount = useMemo(() => {
    let count = 0;
    if (activeFilters.company !== "All") count++;
    if (activeFilters.branch !== "All") count++;
    if (activeFilters.deviceType !== "All") count++;
    if (activeFilters.objectGroup !== "All") count++;
    return count;
  }, [activeFilters]);

  const openCreateModal = () => {
    setEditingVehicle(null);
    setDetailModalOpen(true);
  };

  const openEditModal = (item: VehicleItem) => {
    setEditingVehicle(item);
    setDetailModalOpen(true);
  };

  const openCopyModal = (item?: VehicleItem) => {
    setCopySourceVehicle(item || filteredVehicles[0] || vehicles[0] || null);
    setCopyModalOpen(true);
  };

  const openQrModal = (item: VehicleItem) => {
    setSelectedQrVehicle(item);
    setQrModalOpen(true);
  };

  const handleSaveVehicle = (saved: VehicleItem) => {
    if (editingVehicle) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === saved.id ? saved : v)),
      );
      toast.success(`Vehicle "${saved.name}" updated successfully`);
    } else {
      setVehicles((prev) => [saved, ...prev]);
      toast.success(`Vehicle "${saved.name}" added successfully`);
    }
    setDetailModalOpen(false);
  };

  const handleCopySuccess = (newVehicles: VehicleItem[]) => {
    setVehicles((prev) => [...newVehicles, ...prev]);
    setCopyModalOpen(false);
    toast.success(`Successfully copied ${newVehicles.length} vehicle${newVehicles.length > 1 ? "s" : ""}`);
  };

  const handleDeleteVehicle = (id: string) => {
    const item = vehicles.find((v) => v.id === id);
    if (!item) return;
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      toast.success(`Vehicle "${item.name}" deleted`);
    }
  };

  const handleResetTable = () => {
    setSearchQuery("");
    setSearchField("all");
    setActiveFilters(DEFAULT_VEHICLE_FILTERS);
    setCurrentPage(1);
    toast.success("Table filters and search reset");
  };

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    let list = vehicles;

    // Apply Drawer filters
    if (activeFilters.company !== "All") {
      list = list.filter((item) => item.company.toLowerCase() === activeFilters.company.toLowerCase());
    }
    if (activeFilters.branch !== "All") {
      list = list.filter((item) => item.branch.toLowerCase() === activeFilters.branch.toLowerCase());
    }
    if (activeFilters.deviceType !== "All") {
      list = list.filter((item) => item.deviceType.toLowerCase().includes(activeFilters.deviceType.toLowerCase()));
    }
    if (activeFilters.objectGroup !== "All") {
      list = list.filter((item) => item.objectGroup.toLowerCase() === activeFilters.objectGroup.toLowerCase());
    }

    const q = searchQuery.toLowerCase().trim();
    if (!q) return list;

    return list.filter((item) => {
      if (searchField === "company") return item.company.toLowerCase().includes(q);
      if (searchField === "branch") return item.branch.toLowerCase().includes(q);
      if (searchField === "name") return item.name.toLowerCase().includes(q);
      if (searchField === "imei") return item.imei.toLowerCase().includes(q) || item.deviceImei.toLowerCase().includes(q);
      if (searchField === "sim") return item.simPrimary.toLowerCase().includes(q);
      if (searchField === "group") return item.objectGroup.toLowerCase().includes(q);
      if (searchField === "deviceType") return item.deviceType.toLowerCase().includes(q);

      // All fields
      return (
        item.name.toLowerCase().includes(q) ||
        item.imei.toLowerCase().includes(q) ||
        item.simPrimary.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        item.branch.toLowerCase().includes(q) ||
        item.objectGroup.toLowerCase().includes(q) ||
        item.deviceType.toLowerCase().includes(q) ||
        item.plateNumber.toLowerCase().includes(q) ||
        item.trackerId.toLowerCase().includes(q)
      );
    });
  }, [vehicles, activeFilters, searchQuery, searchField]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / pageSize));
  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVehicles.slice(start, start + pageSize);
  }, [filteredVehicles, currentPage, pageSize]);

  const firstRecord = filteredVehicles.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastRecord = Math.min(currentPage * pageSize, filteredVehicles.length);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#F8FAFC] dark:bg-slate-950">
      {/* 1. Top Header Bar with integrated Toolbar matching Alert Setting */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0">
        {/* Left: Page Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold text-slate-900 dark:text-white select-none">
            Vehicle
          </h1>
          <span className="text-[11px] font-semibold text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-[#DFE3EB] dark:border-slate-700">
            {filteredVehicles.length} Total
          </span>
        </div>

        {/* Right Toolbar: Search, Actions, Pagination, + Vehicle */}
        <div className="flex items-center gap-2">
          {/* Search Dropdown + Input Group */}
          <div className="flex items-center rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-background overflow-hidden shadow-2xs h-7.5">
            {/* Field Selector */}
            <div className="relative border-r border-[#DFE3EB] dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
              <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                className="h-7.5 appearance-none bg-transparent pl-2.5 pr-6 text-xs font-semibold text-foreground cursor-pointer focus:outline-none"
              >
                <option value="all">All fields</option>
                <option value="name">Vehicle Name</option>
                <option value="imei">IMEI Number</option>
                <option value="sim">SIM Number</option>
                <option value="company">Company</option>
                <option value="branch">Branch</option>
                <option value="group">Object Group</option>
                <option value="deviceType">Device Type</option>
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none text-muted-foreground" />
            </div>

            {/* Search Input */}
            <div className="relative flex items-center px-2">
              <Search className="h-3.5 w-3.5 text-muted-foreground mr-1.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search in all fields..."
                className="h-full w-32 sm:w-44 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Action Utility Icons: Filter, Download, Copy Vehicle */}
          <div className="flex items-center gap-1">
            {/* Filter Button */}
            <button
              type="button"
              onClick={() => setFilterDrawerOpen(true)}
              className={cn(
                "inline-flex h-7.5 items-center gap-1.5 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-background px-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-[#0089FF]/50 transition-all cursor-pointer shadow-2xs active:scale-98 select-none",
                activeDrawerFilterCount > 0 && "border-[#0089FF] bg-blue-50/70 dark:bg-blue-950/40 text-[#0089FF]",
              )}
              title="Filter Options"
            >
              <SlidersHorizontal className={cn("h-3.5 w-3.5", activeDrawerFilterCount > 0 ? "text-[#0089FF]" : "text-slate-600 dark:text-slate-300")} />
              <span>Filter</span>
              {activeDrawerFilterCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0089FF] text-[10px] font-bold text-white leading-none">
                  {activeDrawerFilterCount}
                </span>
              )}
            </button>

            {/* Export XLS */}
            <button
              type="button"
              onClick={() => toast.success("Exported Vehicle Fleet as XLS")}
              className="inline-flex h-7.5 w-7.5 items-center justify-center rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-background text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-[#0089FF]/50 transition-all cursor-pointer shadow-2xs active:scale-98"
              title="Download Excel XLS"
            >
              <Download className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
            </button>

            {/* Copy Vehicle */}
            <button
              type="button"
              onClick={() => openCopyModal()}
              className="inline-flex h-7.5 w-7.5 items-center justify-center rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-background text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-[#0089FF]/50 transition-all cursor-pointer shadow-2xs active:scale-98"
              title="Copy Vehicle Configuration"
            >
              <Copy className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>

          {/* Vertical Divider */}
          <div className="h-4 w-px bg-border/80 mx-0.5 shrink-0" />

          {/* Page Size Dropdown */}
          <Popover open={pageSizeOpen} onOpenChange={setPageSizeOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "h-7.5 inline-flex items-center gap-1.5 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-background px-2.5 text-xs font-semibold text-foreground cursor-pointer shadow-2xs transition-all select-none hover:bg-muted hover:border-[#0089FF]/50 active:scale-98",
                  pageSizeOpen && "bg-muted border-[#0089FF]/50 ring-2 ring-[#0089FF]/20",
                )}
              >
                <span>{pageSize} / page</span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 opacity-60 transition-transform",
                    pageSizeOpen && "rotate-180",
                  )}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={6}
              className="w-28 p-1 rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md shadow-lg select-none"
            >
              {PAGE_SIZES.map((s) => {
                const isActive = pageSize === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setPageSize(s);
                      setCurrentPage(1);
                      setPageSizeOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-2.5 py-1.5 text-xs rounded-sm cursor-pointer transition-colors text-left select-none",
                      isActive
                        ? "bg-muted font-semibold text-foreground"
                        : "text-foreground hover:bg-muted/80 hover:text-foreground font-medium",
                    )}
                  >
                    <span>{s} / page</span>
                    {isActive && <Check className="h-3.5 w-3.5 text-[#0089FF]" />}
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>

          {/* Range & Navigation Buttons */}
          <div className="flex items-center gap-1">
            <span className="px-1 text-xs font-semibold tabular-nums text-muted-foreground whitespace-nowrap select-none">
              {firstRecord}-{lastRecord} of {filteredVehicles.length}
            </span>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-7.5 w-7.5 inline-flex items-center justify-center rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-background text-foreground disabled:opacity-40 hover:bg-muted transition-all cursor-pointer disabled:cursor-not-allowed shadow-2xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-7.5 w-7.5 inline-flex items-center justify-center rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-background text-foreground disabled:opacity-40 hover:bg-muted transition-all cursor-pointer disabled:cursor-not-allowed shadow-2xs"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Reset Table & Filters Button (Beside + Vehicle) */}
          <button
            type="button"
            onClick={handleResetTable}
            className="inline-flex h-7.5 w-7.5 items-center justify-center rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-background text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-[#0089FF]/50 transition-all cursor-pointer shadow-2xs active:scale-98"
            title="Reset Table"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
          </button>

          {/* Primary Action Button: + Vehicle */}
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-7.5 items-center gap-1.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-3.5 text-xs font-semibold text-white transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Vehicle</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content Area with Clean 21-Column Data Table */}
      <div className="flex-1 min-h-0 min-w-0 flex flex-col p-2.5 overflow-hidden">
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-lg shadow-2xs">
          {/* Scrollable Table Area */}
          <div className="flex-1 min-h-0 overflow-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 z-10 shadow-xs">
                <tr className="bg-[#EAF0F6] text-slate-900 dark:bg-slate-800 dark:text-slate-100 font-bold tracking-wider text-[11px] uppercase border-b border-[#DFE3EB] dark:border-slate-700 select-none whitespace-nowrap">
                  <th className="py-2.5 px-3 border-r border-[#DFE3EB] dark:border-slate-700 text-center w-10">
                    #
                  </th>
                  <th className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-700">
                    Company
                  </th>
                  <th className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-700">
                    Branch
                  </th>
                  <th className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-700">
                    Vehicle Name
                  </th>
                  <th className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-700">
                    Object Group
                  </th>
                  <th className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-700 font-mono">
                    IMEI Number
                  </th>
                  <th className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-700 font-mono">
                    SIM Number
                  </th>
                  <th className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-700">
                    GPS Device Type
                  </th>
                  <th className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-700 text-center">
                    Distance Counter
                  </th>
                  <th className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-700 text-center">
                    Speed Detection
                  </th>
                  <th className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-700">
                    Timezone
                  </th>
                  <th className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-700">
                    Created Date
                  </th>
                  <th className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-700">
                    Installation Date
                  </th>
                  <th className="py-2.5 px-3 border-r border-[#DFE3EB] dark:border-slate-700 text-center">
                    Sensor
                  </th>
                  <th className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-700">
                    Expiry Date
                  </th>
                  <th className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-700 text-center">
                    Specification
                  </th>
                  <th className="py-2.5 px-3 border-r border-[#DFE3EB] dark:border-slate-700 text-center">
                    Primary Vehicle
                  </th>
                  <th className="py-2.5 px-3 border-r border-[#DFE3EB] dark:border-slate-700 text-center">
                    Documents
                  </th>
                  <th className="py-2.5 px-3 border-r border-[#DFE3EB] dark:border-slate-700 text-center">
                    QR Code
                  </th>
                  <th className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-700">
                    GPS Tracker ID
                  </th>
                  <th className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-700">
                    GPS Tracker Serial No
                  </th>
                  <th className="py-2.5 px-3 text-right sticky right-0 bg-[#EAF0F6] dark:bg-slate-800 shadow-l">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFE3EB] dark:divide-slate-800 bg-white dark:bg-slate-900 font-medium whitespace-nowrap">
                {pageRows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => openEditModal(row)}
                  >
                    {/* Index */}
                    <td className="py-2 px-3 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-center text-muted-foreground font-mono text-[11px]">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>

                    {/* Company */}
                    <td className="py-2 px-3.5 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                      {row.company}
                    </td>

                    {/* Branch */}
                    <td className="py-2 px-3.5 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-muted-foreground">
                      {row.branch}
                    </td>

                    {/* Vehicle Name with Status Indicator */}
                    <td className="py-2 px-3.5 border-r border-[#DFE3EB]/70 dark:border-slate-800 font-semibold text-foreground group-hover:text-[#0089FF] transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" title="Active Object" />
                        <span className="truncate">{row.name}</span>
                      </div>
                    </td>

                    {/* Object Group */}
                    <td className="py-2 px-3.5 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px]">
                        {row.objectGroup}
                      </span>
                    </td>

                    {/* IMEI Number */}
                    <td className="py-2 px-3.5 border-r border-[#DFE3EB]/70 dark:border-slate-800 font-mono text-foreground font-semibold">
                      {row.imei}
                    </td>

                    {/* SIM Number */}
                    <td className="py-2 px-3.5 border-r border-[#DFE3EB]/70 dark:border-slate-800 font-mono text-muted-foreground">
                      {row.simPrimary || "--"}
                    </td>

                    {/* GPS Device Type */}
                    <td className="py-2 px-3.5 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-muted-foreground text-[11px] truncate max-w-[200px]" title={row.deviceType}>
                      {row.deviceType}
                    </td>

                    {/* Distance Counter */}
                    <td className="py-2 px-3.5 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-center font-semibold text-slate-700 dark:text-slate-300">
                      {row.distanceCounter}
                    </td>

                    {/* Speed Detection */}
                    <td className="py-2 px-3.5 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-center text-slate-600 dark:text-slate-400 text-[11px]">
                      {row.speedDetection}
                    </td>

                    {/* Timezone */}
                    <td className="py-2 px-3.5 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-muted-foreground font-mono text-[11px]">
                      {row.timezone}
                    </td>

                    {/* Created Date */}
                    <td className="py-2 px-3.5 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-muted-foreground font-mono text-[11px]">
                      {row.createdDate}
                    </td>

                    {/* Installation Date */}
                    <td className="py-2 px-3.5 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-muted-foreground font-mono text-[11px]">
                      {row.installationDate}
                    </td>

                    {/* Sensor Count */}
                    <td className="py-2 px-3 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-center">
                      <span className="font-mono font-bold text-[#0089FF] bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 text-[11px]">
                        {row.sensorCount}
                      </span>
                    </td>

                    {/* Expiry Date */}
                    <td className="py-2 px-3.5 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-muted-foreground font-mono text-[11px]">
                      {row.expiryDate}
                    </td>

                    {/* Specification */}
                    <td className="py-2 px-3.5 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {row.specification}
                      </span>
                    </td>

                    {/* Primary Vehicle Checkmark */}
                    <td className="py-2 px-3 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-center">
                      {row.isPrimary ? (
                        <Check className="h-4 w-4 text-emerald-600 mx-auto stroke-[2.5]" />
                      ) : (
                        <span className="text-slate-300 dark:text-slate-700 font-bold mx-auto text-xs">✕</span>
                      )}
                    </td>

                    {/* Documents */}
                    <td className="py-2 px-3 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => openEditModal(row)}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0089FF] hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                        title="View Attached Documents"
                      >
                        <FileText className="h-3.5 w-3.5 text-blue-500" />
                        <span>{row.documentsCount}</span>
                      </button>
                    </td>

                    {/* QR Code Action Button */}
                    <td className="py-2 px-3 border-r border-[#DFE3EB]/70 dark:border-slate-800 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => openQrModal(row)}
                        className="p-1 rounded text-slate-600 dark:text-slate-300 hover:text-[#0089FF] hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                        title="View Vehicle Pairing QR Code"
                      >
                        <QrCode className="h-4 w-4" />
                      </button>
                    </td>

                    {/* GPS Tracker ID */}
                    <td className="py-2 px-3.5 border-r border-[#DFE3EB]/70 dark:border-slate-800 font-mono text-muted-foreground text-[11px]">
                      {row.trackerId}
                    </td>

                    {/* GPS Tracker Serial No */}
                    <td className="py-2 px-3.5 border-r border-[#DFE3EB]/70 dark:border-slate-800 font-mono text-muted-foreground text-[11px]">
                      {row.serialNo}
                    </td>

                    {/* Actions Column (Sticky Right) */}
                    <td className="py-2 px-3 text-right sticky right-0 bg-white dark:bg-slate-900 shadow-l" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(row)}
                          className="p-1 rounded text-muted-foreground hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit Vehicle"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openCopyModal(row)}
                          className="p-1 rounded text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
                          title="Copy Vehicle Configuration"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteVehicle(row.id)}
                          className="p-1 rounded text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                          title="Delete Vehicle"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 && (
                  <tr>
                    <td colSpan={22} className="py-14 text-center text-xs text-muted-foreground">
                      No vehicles or objects found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. Add / Edit Vehicle Modal (Roomy Fixed Big Dimensions) */}
      <VehicleDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        vehicle={editingVehicle}
        onSave={handleSaveVehicle}
      />

      {/* 4. Copy Vehicle Modal */}
      <CopyVehicleModal
        open={copyModalOpen}
        onClose={() => setCopyModalOpen(false)}
        sourceVehicle={copySourceVehicle}
        allVehicles={vehicles}
        onCopySuccess={handleCopySuccess}
      />

      {/* 5. QR Code Modal */}
      <VehicleQrCodeModal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        vehicle={selectedQrVehicle}
      />

      {/* 6. Right Side Filter Drawer (Matching Alert / Report Drawer) */}
      <VehicleFilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={activeFilters}
        onApply={(nextFilters) => {
          setActiveFilters(nextFilters);
          setCurrentPage(1);
        }}
        onReset={() => {
          setActiveFilters(DEFAULT_VEHICLE_FILTERS);
          setCurrentPage(1);
        }}
        allVehicles={vehicles}
      />
    </div>
  );
}

/* =========================================================================
   Vehicle Filter Drawer (Right Side Panel matching Alert Filter)
   ========================================================================= */

export function VehicleFilterDrawer({
  open,
  onClose,
  filters,
  onApply,
  onReset,
  allVehicles,
}: {
  open: boolean;
  onClose: () => void;
  filters: VehicleFilterState;
  onApply: (nextFilters: VehicleFilterState) => void;
  onReset: () => void;
  allVehicles: VehicleItem[];
}) {
  const [draftCompany, setDraftCompany] = useState(filters.company);
  const [draftBranch, setDraftBranch] = useState(filters.branch);
  const [draftDeviceType, setDraftDeviceType] = useState(filters.deviceType);
  const [draftObjectGroup, setDraftObjectGroup] = useState(filters.objectGroup);

  useEffect(() => {
    if (open) {
      setDraftCompany(filters.company);
      setDraftBranch(filters.branch);
      setDraftDeviceType(filters.deviceType);
      setDraftObjectGroup(filters.objectGroup);
    }
  }, [open, filters]);

  const companyOptions = useMemo(() => {
    const set = new Set<string>(["All"]);
    allVehicles.forEach((v) => set.add(v.company));
    set.add("HP Company");
    set.add("Global Logistics Inc");
    set.add("Fleet Cargo West");
    set.add("FastTrack Mobility");
    return Array.from(set);
  }, [allVehicles]);

  const branchOptions = useMemo(() => {
    const set = new Set<string>(["All"]);
    allVehicles.forEach((v) => {
      if (draftCompany === "All" || v.company.toLowerCase() === draftCompany.toLowerCase()) {
        set.add(v.branch);
      }
    });
    set.add("HP Branch 8");
    set.add("HP EV Branch 2");
    set.add("Central Branch");
    set.add("North Terminal");
    set.add("West Hub");
    set.add("South Depot");
    return Array.from(set);
  }, [allVehicles, draftCompany]);

  const deviceTypeOptions = useMemo(() => {
    return ["All", ...DEVICE_TYPE_OPTIONS];
  }, []);

  const objectGroupOptions = useMemo(() => {
    return ["All", ...OBJECT_GROUP_OPTIONS];
  }, []);

  const handleDrawerApply = () => {
    onApply({
      company: draftCompany,
      branch: draftBranch,
      deviceType: draftDeviceType,
      objectGroup: draftObjectGroup,
    });
    onClose();
    toast.success("Filters applied successfully");
  };

  const handleDrawerReset = () => {
    setDraftCompany("All");
    setDraftBranch("All");
    setDraftDeviceType("All");
    setDraftObjectGroup("All");
    onReset();
    onClose();
    toast.info("Filters reset to default");
  };

  return (
    <>
      {/* Backdrop blur overlay */}
      {open && (
        <div
          className="fixed inset-0 top-[45px] z-30 bg-black/40 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in-0"
          onClick={onClose}
        />
      )}

      {/* Slide-over Drawer Panel */}
      <aside
        className={cn(
          "fixed right-0 top-[45px] bottom-0 z-40 flex w-full max-w-[420px] xl:max-w-[430px] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
      >
        {/* Standardized 56px Header */}
        <header className="flex h-[56px] items-center justify-between border-b border-border px-5 bg-background select-none shrink-0">
          <h2 className="text-[16px] font-semibold tracking-tight text-foreground">
            Filter Options
          </h2>
          <button
            type="button"
            aria-label="Close filter"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs custom-scrollbar">
          {/* 1. Company */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Company <span className="text-muted-foreground font-normal">:</span>
            </label>
            <SelectDropdown
              value={draftCompany}
              options={companyOptions}
              onChange={(val) => {
                setDraftCompany(val);
                setDraftBranch("All");
              }}
              placeholder="Select Company"
            />
          </div>

          {/* 2. Branch */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Branch <span className="text-muted-foreground font-normal">:</span>
            </label>
            <SelectDropdown
              value={draftBranch}
              options={branchOptions}
              onChange={setDraftBranch}
              placeholder="Select Branch"
            />
          </div>

          {/* 3. GPS Device Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              GPS Device Type <span className="text-muted-foreground font-normal">:</span>
            </label>
            <SelectDropdown
              value={draftDeviceType}
              options={deviceTypeOptions}
              onChange={setDraftDeviceType}
              placeholder="Select Device Type"
            />
          </div>

          {/* 4. Object Group */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Object Group <span className="text-muted-foreground font-normal">:</span>
            </label>
            <SelectDropdown
              value={draftObjectGroup}
              options={objectGroupOptions}
              onChange={setDraftObjectGroup}
              placeholder="Select Object Group"
            />
          </div>
        </div>

        {/* Standardized 56px Footer */}
        <footer className="flex h-[56px] items-center justify-between border-t border-border px-5 bg-background select-none shrink-0">
          <button
            type="button"
            onClick={handleDrawerReset}
            className="h-8 rounded-md border border-input/80 bg-background px-4 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer shadow-2xs"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleDrawerApply}
            className="h-8 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-5 text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs active:scale-98"
          >
            Apply
          </button>
        </footer>
      </aside>
    </>
  );
}

/* =========================================================================
   Add Sensor Channel Modal
   ========================================================================= */
export function AddSensorModal({
  open,
  onOpenChange,
  existingSensors,
  onAddSensor,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingSensors: SensorRow[];
  onAddSensor: (newSensor: SensorRow) => void;
}) {
  const [connectionType, setConnectionType] = useState("analog 3");
  const [customConnection, setCustomConnection] = useState("");
  const [connectedSensor, setConnectedSensor] = useState("Fuel");
  const [readingType, setReadingType] = useState("Direct");
  const [workHourCalc, setWorkHourCalc] = useState(false);
  const [hasCalibration, setHasCalibration] = useState(true);
  const [active, setActive] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalConnection =
      connectionType === "Custom Channel"
        ? customConnection.trim() || `Channel ${existingSensors.length + 1}`
        : connectionType;

    const newSensor: SensorRow = {
      id: `sensor-${Date.now()}`,
      active,
      connectionType: finalConnection,
      connectedSensor,
      readingType,
      workHourCalculation: workHourCalc,
      hasCalibration,
    };
    onAddSensor(newSensor);
    toast.success(`Sensor "${finalConnection} (${connectedSensor})" added`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden border border-[#DFE3EB] dark:border-slate-800 bg-background shadow-2xl rounded-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DFE3EB] dark:border-slate-800 bg-background select-none">
          <DialogTitle className="text-[16px] font-bold text-[#1D3B7A] dark:text-blue-400">
            Add Sensor
          </DialogTitle>
          <DialogDescription className="sr-only">
            Add and configure a new hardware or virtual sensor channel
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Connection Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Connection Type / Port <span className="text-rose-500">*</span>
            </label>
            <SelectDropdown
              value={connectionType}
              options={[
                "analog 1",
                "analog 2",
                "analog 3",
                "analog 4",
                "Digital Input 1",
                "Digital Input 2",
                "Digital Input 3",
                "Digital Input 4",
                "Digital Input 5",
                "Digital Input 6",
                "Fuel Sensor",
                "RPM Sensor",
                "Temperature Probe",
                "CAN Bus 1",
                "CAN Bus 2",
                "BLE Sensor 1",
                "BLE Sensor 2",
                "RS485 Port 1",
                "RS232 Port 1",
                "Custom Channel",
              ]}
              onChange={setConnectionType}
              placeholder="Select Connection Type"
            />
            {connectionType === "Custom Channel" && (
              <input
                type="text"
                value={customConnection}
                onChange={(e) => setCustomConnection(e.target.value)}
                placeholder="Enter channel name (e.g. Temperature Probe 1)"
                className="mt-1.5 h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
                required
              />
            )}
          </div>

          {/* Connected Sensor Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Connected Sensor Type <span className="text-rose-500">*</span>
            </label>
            <SelectDropdown
              value={connectedSensor}
              options={[
                "Fuel",
                "Ignition",
                "Door Sensor",
                "SOS Panic",
                "PTO",
                "RPM",
                "Temprature",
                "Load Sensor",
                "Driver ID / RFID",
                "Tire Pressure (TPMS)",
                "Seatbelt Sensor",
                "Air Conditioner (AC)",
                "Beacon / BLE Tag",
              ]}
              onChange={(v) => {
                setConnectedSensor(v);
                if (
                  v === "Fuel" ||
                  v === "RPM" ||
                  v === "Temprature" ||
                  v === "Load Sensor"
                ) {
                  setHasCalibration(true);
                } else {
                  setHasCalibration(false);
                }
              }}
              placeholder="Select Connected Sensor"
            />
          </div>

          {/* Reading Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Reading Type <span className="text-rose-500">*</span>
            </label>
            <SelectDropdown
              value={readingType}
              options={["Direct", "Formula", "Linear", "Inverted"]}
              onChange={setReadingType}
            />
          </div>

          {/* Configuration Flags */}
          <div className="space-y-2.5 pt-1">
            <label className="flex items-center gap-2.5 p-2.5 rounded-md border border-input/80 bg-background cursor-pointer hover:bg-muted/40 transition-all select-none">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="h-4 w-4 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
              />
              <span className="text-xs font-semibold text-foreground">
                Activate Sensor immediately
              </span>
            </label>

            <label className="flex items-center gap-2.5 p-2.5 rounded-md border border-input/80 bg-background cursor-pointer hover:bg-muted/40 transition-all select-none">
              <input
                type="checkbox"
                checked={workHourCalc}
                onChange={(e) => setWorkHourCalc(e.target.checked)}
                className="h-4 w-4 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
              />
              <span className="text-xs font-semibold text-foreground">
                Include in Work Hour Calculation
              </span>
            </label>

            <label className="flex items-center gap-2.5 p-2.5 rounded-md border border-input/80 bg-background cursor-pointer hover:bg-muted/40 transition-all select-none">
              <input
                type="checkbox"
                checked={hasCalibration}
                onChange={(e) => setHasCalibration(e.target.checked)}
                className="h-4 w-4 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
              />
              <span className="text-xs font-semibold text-foreground">
                Support Calibration Table
              </span>
            </label>
          </div>

          {/* Dialog Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DFE3EB] dark:border-slate-800 select-none">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-8 rounded-md border border-input/80 bg-background px-4 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-4 text-xs font-semibold text-white cursor-pointer shadow-xs transition-all active:scale-98"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Sensor</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================================
   Add / Edit Vehicle Modal (Roomy Fixed Big Dimensions across all tabs)
   ========================================================================= */

export function VehicleDetailModal({
  open,
  onClose,
  vehicle,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  vehicle: VehicleItem | null;
  onSave: (v: VehicleItem) => void;
}) {
  const isEdit = Boolean(vehicle);
  const [activeTab, setActiveTab] = useState<"General" | "Profile" | "Sensors" | "Document">("General");

  // Tab 1: General Form State (Default Blank when creating new vehicle)
  const [reseller, setReseller] = useState("");
  const [company, setCompany] = useState("");
  const [branch, setBranch] = useState("");
  const [name, setName] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [serverAddress, setServerAddress] = useState("");
  const [imei, setImei] = useState("");
  const [deviceImei, setDeviceImei] = useState("");
  const [satelliteImei, setSatelliteImei] = useState("");
  const [simPrimary, setSimPrimary] = useState("");
  const [simSecondary, setSimSecondary] = useState("");
  const [distanceCounter, setDistanceCounter] = useState("");
  const [distanceVariationSign, setDistanceVariationSign] = useState<"+" | "-">("+");
  const [distanceVariationValue, setDistanceVariationValue] = useState("");
  const [speedDetection, setSpeedDetection] = useState("");
  const [timezone, setTimezone] = useState("");
  const [specification, setSpecification] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [ignBasedOnSpeed, setIgnBasedOnSpeed] = useState(false);
  const [unitOfDistance, setUnitOfDistance] = useState("Kilometer");
  const [objectGroup, setObjectGroup] = useState("");
  const [trackerId, setTrackerId] = useState("");
  const [serialNo, setSerialNo] = useState("");

  // Tab 2: Profile Form State (Default Blank when creating new vehicle)
  const [plateNumber, setPlateNumber] = useState("");
  const [objectType, setObjectType] = useState("");
  const [objectCategory, setObjectCategory] = useState<"Moveable" | "Immovable">("Moveable");
  const [color, setColor] = useState("");
  const [dvirTemplate, setDvirTemplate] = useState("");
  const [manufactureDate, setManufactureDate] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [installationDate, setInstallationDate] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [weightCapacity, setWeightCapacity] = useState("");
  const [warrantyYears, setWarrantyYears] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [permit, setPermit] = useState("");
  const [batteryVoltage, setBatteryVoltage] = useState("");
  const [distanceFuelConsumption, setDistanceFuelConsumption] = useState("");
  const [durationFuelConsumption, setDurationFuelConsumption] = useState("");

  // Tab 3: Sensors State
  const [sensors, setSensors] = useState<SensorRow[]>(DEFAULT_SENSORS);
  const [addSensorModalOpen, setAddSensorModalOpen] = useState(false);
  const [calibrationModalOpen, setCalibrationModalOpen] = useState(false);
  const [selectedSensorName, setSelectedSensorName] = useState("Fuel Sensor (analog 1)");

  // Tab 4: Documents State
  const [documents, setDocuments] = useState<VehicleDocument[]>([]);
  const [docUploadModalOpen, setDocUploadModalOpen] = useState(false);

  // Sync state when vehicle prop changes or modal opens
  useEffect(() => {
    if (vehicle) {
      setReseller(vehicle.reseller || "");
      setCompany(vehicle.company || "");
      setBranch(vehicle.branch || "");
      setName(vehicle.name || "");
      setDeviceType(vehicle.deviceType || "");
      setServerAddress(vehicle.serverAddress || "");
      setImei(vehicle.imei || "");
      setDeviceImei(vehicle.deviceImei || "");
      setSatelliteImei(vehicle.satelliteImei || "");
      setSimPrimary(vehicle.simPrimary || "");
      setSimSecondary(vehicle.simSecondary || "");
      setDistanceCounter(vehicle.distanceCounter || "GPS");
      setDistanceVariationSign(vehicle.distanceVariationSign || "+");
      setDistanceVariationValue(vehicle.distanceVariationValue || "0");
      setSpeedDetection(vehicle.speedDetection || "From Device");
      setTimezone(vehicle.timezone || "UTC+05:30");
      setSpecification(vehicle.specification || "Primary");
      setIsPrimary(vehicle.isPrimary ?? false);
      setIgnBasedOnSpeed(vehicle.ignBasedOnSpeed ?? false);
      setUnitOfDistance(vehicle.unitOfDistance || "Kilometer");
      setObjectGroup(vehicle.objectGroup || "");
      setTrackerId(vehicle.trackerId || "");
      setSerialNo(vehicle.serialNo || "");
      // Profile
      setPlateNumber(vehicle.plateNumber || "");
      setObjectType(vehicle.objectType || "");
      setObjectCategory(vehicle.objectCategory || "Moveable");
      setColor(vehicle.color || "");
      setDvirTemplate(vehicle.dvirTemplate || "");
      setManufactureDate(vehicle.manufactureDate || "");
      setPurchaseDate(vehicle.purchaseDate || "");
      setInstallationDate(vehicle.installationDate || "");
      setPurchaseAmount(vehicle.purchaseAmount || "");
      setWeightCapacity(vehicle.weightCapacity || "");
      setWarrantyYears(vehicle.warrantyYears || "");
      setFuelType(vehicle.fuelType || "");
      setPermit(vehicle.permit || "");
      setBatteryVoltage(vehicle.batteryVoltage || "");
      setDistanceFuelConsumption(vehicle.distanceFuelConsumption || "");
      setDurationFuelConsumption(vehicle.durationFuelConsumption || "");
      setSensors(DEFAULT_SENSORS);
      setDocuments(DEFAULT_DOCS);
    } else {
      // Blank defaults for Add Vehicle
      setReseller("");
      setCompany("");
      setBranch("");
      setName("");
      setDeviceType("");
      setServerAddress("");
      setImei("");
      setDeviceImei("");
      setSatelliteImei("");
      setSimPrimary("");
      setSimSecondary("");
      setDistanceCounter("");
      setDistanceVariationSign("+");
      setDistanceVariationValue("");
      setSpeedDetection("");
      setTimezone("");
      setSpecification("");
      setIsPrimary(false);
      setIgnBasedOnSpeed(false);
      setUnitOfDistance("Kilometer");
      setObjectGroup("");
      setTrackerId("");
      setSerialNo("");
      // Profile
      setPlateNumber("");
      setObjectType("");
      setObjectCategory("Moveable");
      setColor("");
      setDvirTemplate("");
      setManufactureDate("");
      setPurchaseDate("");
      setInstallationDate("");
      setPurchaseAmount("");
      setWeightCapacity("");
      setWarrantyYears("");
      setFuelType("");
      setPermit("");
      setBatteryVoltage("");
      setDistanceFuelConsumption("");
      setDurationFuelConsumption("");
      setSensors(DEFAULT_SENSORS.map((s) => ({ ...s, active: false, connectedSensor: "" })));
      setDocuments([]);
    }
    setActiveTab("General");
  }, [vehicle, open]);

  // Update server address automatically based on device type
  const handleDeviceTypeChange = (newType: string) => {
    setDeviceType(newType);
    if (newType.includes("5004")) {
      setServerAddress("3.7.208.99 : 5004 ( TCP )");
    } else if (newType.includes("Teltonika")) {
      setServerAddress("3.7.208.99 : 5027 ( TCP )");
    } else if (newType.includes("Concox")) {
      setServerAddress("3.7.208.99 : 5023 ( TCP )");
    } else if (newType.includes("Queclink")) {
      setServerAddress("3.7.208.99 : 5003 ( TCP )");
    } else if (newType.includes("Ruptela")) {
      setServerAddress("3.7.208.99 : 5004 ( TCP )");
    } else if (newType) {
      setServerAddress("3.7.208.99 : 5004 ( TCP )");
    } else {
      setServerAddress("");
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Please enter a Vehicle Name");
      return;
    }
    if (!imei.trim()) {
      toast.error("Please enter an IMEI Number");
      return;
    }

    const payload: VehicleItem = {
      id: vehicle ? vehicle.id : `veh-${Date.now()}`,
      reseller: reseller || "Default Reseller",
      company: company || "HP Company",
      branch: branch || "Main Branch",
      name: name.trim(),
      objectGroup: objectGroup || "General Fleet",
      imei: imei.trim(),
      deviceImei: deviceImei.trim() || imei.trim(),
      satelliteImei,
      simPrimary: simPrimary.trim(),
      simSecondary,
      deviceType: deviceType || "HP HttpPool Advance-HP HttpPool Service",
      serverAddress: serverAddress || "3.7.208.99 : 5004 ( TCP )",
      distanceCounter: distanceCounter || "GPS",
      distanceVariationSign,
      distanceVariationValue: distanceVariationValue || "0",
      speedDetection: speedDetection || "From Device",
      timezone: timezone || "UTC+05:30",
      createdDate: vehicle?.createdDate || "15/09/2026",
      installationDate: installationDate || vehicle?.installationDate || "--",
      sensorCount: sensors.filter((s) => s.active).length,
      expiryDate: vehicle?.expiryDate || "16/09/2027",
      specification: specification || "Primary",
      isPrimary,
      ignBasedOnSpeed,
      unitOfDistance,
      trackerId: trackerId || "--",
      serialNo: serialNo || "--",
      plateNumber,
      objectType: objectType || "Truck",
      objectCategory,
      color: color || "White",
      dvirTemplate,
      manufactureDate,
      purchaseDate,
      purchaseAmount,
      weightCapacity,
      warrantyYears,
      fuelType,
      permit,
      batteryVoltage,
      distanceFuelConsumption,
      durationFuelConsumption,
      documentsCount: documents.length,
    };

    onSave(payload);
  };

  const toggleSensorActive = (id: string) => {
    setSensors((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)),
    );
  };

  const toggleWorkHour = (id: string) => {
    setSensors((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, workHourCalculation: !s.workHourCalculation } : s,
      ),
    );
  };

  const updateSensorField = (
    id: string,
    field: "connectedSensor" | "readingType",
    val: string,
  ) => {
    setSensors((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: val } : s)),
    );
  };

  const openCalibration = (sensor: SensorRow) => {
    setSelectedSensorName(`${sensor.connectedSensor || "Sensor"} (${sensor.connectionType})`);
    setCalibrationModalOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      {/* 
        EXPANSIVE FIXED MODAL:
        - Wide: 94vw max-w-[1340px]
        - Height: Fixed 86vh
        - Dimensions stay completely constant across tabs without resizing or jumping
      */}
      <DialogContent
        overlayClassName="bg-slate-950/80 backdrop-blur-md"
        className="w-[94vw] max-w-[1340px] h-[86vh] max-h-[86vh] p-0 gap-0 overflow-hidden rounded-xl border border-border bg-background shadow-2xl flex flex-col"
      >
        {/* Modal Header matching reference */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2 bg-background shrink-0 select-none">
          <DialogTitle className="text-[18px] font-bold text-[#1D3B7A] dark:text-blue-400">
            {isEdit ? `Edit Vehicle: ${vehicle?.name}` : "Vehicle"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Vehicle & Object Profile Configuration Modal
          </DialogDescription>
        </div>

        {/* Modal Tabs Bar matching screenshot media_1789453348270.png */}
        <div className="relative flex items-center border-b border-[#E2E8F0] dark:border-slate-800 bg-background px-6 shrink-0 select-none gap-6 text-[13.5px] pb-2 pt-1">
          {(["General", "Profile", "Sensors", "Document"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <div key={tab} className="relative flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-[13.5px] select-none",
                    isActive
                      ? "bg-[#E5E7EB] dark:bg-slate-800 text-[#1D3B7A] dark:text-blue-400 font-bold"
                      : "text-[#1D3B7A] dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800/60",
                  )}
                >
                  <span>{tab}</span>
                </button>
                {/* Deep navy blue indicator line for active tab */}
                {isActive && (
                  <div className="absolute -bottom-[9px] left-0 right-0 h-[3px] bg-[#1D3B7A] dark:bg-blue-500 rounded-full" />
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Scrollable Form Body (Fixed flex-1 min-h-0 so size never changes) */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 md:p-8 custom-scrollbar text-xs">
          {/* TAB 1: GENERAL */}
          {activeTab === "General" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Reseller * */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Reseller <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <SelectDropdown
                    value={reseller}
                    options={["HP Reseller", "Global Reseller Hub", "FleetTech Resellers", "FastTrack Telematics"]}
                    onChange={setReseller}
                    placeholder="Select Reseller"
                  />
                </div>

                {/* Company * */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Company <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <SelectDropdown
                    value={company}
                    options={["HP Company", "Global Logistics Inc", "Fleet Cargo West", "FastTrack Mobility"]}
                    onChange={setCompany}
                    placeholder="Select Company"
                  />
                </div>

                {/* Branch * */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Branch <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <SelectDropdown
                    value={branch}
                    options={["HP Branch 8", "HP EV Branch 2", "Central Branch", "North Terminal", "West Hub", "South Depot"]}
                    onChange={setBranch}
                    placeholder="Select Branch"
                  />
                </div>

                {/* Name * */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Name <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Vehicle Name (e.g. HP Boom Barrier)"
                    className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none transition-all"
                  />
                </div>

                {/* Device Type * */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Device Type <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <SelectDropdown
                    value={deviceType}
                    options={DEVICE_TYPE_OPTIONS}
                    onChange={handleDeviceTypeChange}
                    placeholder="Select Device Type"
                  />
                </div>

                {/* Server Address (Read only) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Server Address
                  </label>
                  <input
                    type="text"
                    value={serverAddress}
                    readOnly
                    placeholder="--"
                    className="h-9 w-full rounded-md border border-input/80 bg-muted/40 px-3 font-mono text-xs text-muted-foreground shadow-2xs cursor-not-allowed select-all"
                  />
                </div>

                {/* Distance Counter */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Distance Counter
                  </label>
                  <SelectDropdown
                    value={distanceCounter}
                    options={DISTANCE_COUNTER_OPTIONS}
                    onChange={setDistanceCounter}
                    placeholder="Select Distance Counter"
                  />
                </div>

                {/* Distance Variation */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Distance Variation
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDistanceVariationSign((s) => (s === "+" ? "-" : "+"))}
                      className="h-9 w-9 rounded-md border border-input/80 bg-background font-mono font-bold text-foreground hover:bg-muted text-xs shadow-2xs shrink-0 cursor-pointer"
                    >
                      {distanceVariationSign}
                    </button>
                    <input
                      type="text"
                      value={distanceVariationValue}
                      onChange={(e) => setDistanceVariationValue(e.target.value)}
                      placeholder="0"
                      className="h-9 flex-1 rounded-md border border-input/80 bg-background px-3 font-mono text-xs text-foreground shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
                    />
                    <span className="h-9 flex items-center px-3 rounded-md border border-input/80 bg-muted/30 text-muted-foreground font-bold text-xs shrink-0">
                      %
                    </span>
                  </div>
                </div>

                {/* Speed Detection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Speed Detection
                  </label>
                  <SelectDropdown
                    value={speedDetection}
                    options={SPEED_DETECTION_OPTIONS}
                    onChange={setSpeedDetection}
                    placeholder="Select Speed Detection"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* IMEI Number * */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    IMEI Number <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    value={imei}
                    onChange={(e) => {
                      setImei(e.target.value);
                      if (!deviceImei || deviceImei === imei) {
                        setDeviceImei(e.target.value);
                      }
                    }}
                    placeholder="e.g. 123321026"
                    className="h-9 w-full rounded-md border border-input/80 bg-background px-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none transition-all"
                  />
                </div>

                {/* Device IMEI Number * */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Device IMEI Number <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    value={deviceImei}
                    onChange={(e) => setDeviceImei(e.target.value)}
                    placeholder="e.g. 123321026"
                    className="h-9 w-full rounded-md border border-input/80 bg-background px-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none transition-all"
                  />
                </div>

                {/* Satellite IMEI Number */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Satellite IMEI Number
                  </label>
                  <input
                    type="text"
                    value={satelliteImei}
                    onChange={(e) => setSatelliteImei(e.target.value)}
                    placeholder="Optional satellite tracker IMEI"
                    className="h-9 w-full rounded-md border border-input/80 bg-background px-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none transition-all"
                  />
                </div>

                {/* Primary SIM Number */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Primary Sim Number
                  </label>
                  <input
                    type="text"
                    value={simPrimary}
                    onChange={(e) => setSimPrimary(e.target.value)}
                    placeholder="e.g. +62 812 3456 7890"
                    className="h-9 w-full rounded-md border border-input/80 bg-background px-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none transition-all"
                  />
                </div>

                {/* Secondary SIM Number */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Secondary Sim Number
                  </label>
                  <input
                    type="text"
                    value={simSecondary}
                    onChange={(e) => setSimSecondary(e.target.value)}
                    placeholder="Optional backup SIM"
                    className="h-9 w-full rounded-md border border-input/80 bg-background px-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none transition-all"
                  />
                </div>

                {/* Timezone */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Time Zone
                  </label>
                  <SelectDropdown
                    value={timezone}
                    options={TIMEZONE_OPTIONS}
                    onChange={setTimezone}
                    placeholder="Select Time Zone"
                  />
                </div>

                {/* Specification */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Specification
                  </label>
                  <SelectDropdown
                    value={specification}
                    options={SPECIFICATION_OPTIONS}
                    onChange={setSpecification}
                    placeholder="Select Specification"
                  />
                </div>

                {/* Primary Object & Ign based on Speed Toggles */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <label className="flex items-center gap-2.5 p-2.5 rounded-md border border-input/80 bg-background cursor-pointer hover:bg-muted/40 transition-all select-none">
                    <input
                      type="checkbox"
                      checked={isPrimary}
                      onChange={(e) => setIsPrimary(e.target.checked)}
                      className="h-4 w-4 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-foreground">Primary Object</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 rounded-md border border-input/80 bg-background cursor-pointer hover:bg-muted/40 transition-all select-none">
                    <input
                      type="checkbox"
                      checked={ignBasedOnSpeed}
                      onChange={(e) => setIgnBasedOnSpeed(e.target.checked)}
                      className="h-4 w-4 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-foreground">Ign based on Speed</span>
                  </label>
                </div>

                {/* Unit of Distance */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Unit of distance
                  </label>
                  <SelectDropdown
                    value={unitOfDistance}
                    options={DISTANCE_UNIT_OPTIONS}
                    onChange={setUnitOfDistance}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE */}
          {activeTab === "Profile" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">Plate Number</label>
                  <input
                    type="text"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder="e.g. HP-08-BB-1026"
                    className="h-9 w-full rounded-md border border-input/80 bg-background px-3 font-mono text-xs text-foreground shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">Object Type</label>
                  <SelectDropdown
                    value={objectType}
                    options={["Boom Barrier", "EV Van", "Tamper Beacon", "Utility Unit", "Hydraulic Crane", "Reefer Trailer", "Heavy Truck", "Sprinter Van", "Electric Truck", "Mining Dump Truck", "Fuel Tanker Truck", "Courier Van"]}
                    onChange={setObjectType}
                    placeholder="Select Object Type"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">Object Category</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["Moveable", "Immovable"] as const).map((cat) => (
                      <label
                        key={cat}
                        onClick={() => setObjectCategory(cat)}
                        className={cn(
                          "flex items-center gap-2.5 rounded-md border px-3 py-2 transition-all cursor-pointer select-none text-xs",
                          objectCategory === cat
                            ? "border-[#0089FF] bg-[#0089FF]/5 ring-1 ring-[#0089FF]/30 text-foreground font-semibold"
                            : "border-input/80 bg-background hover:bg-muted/40 text-foreground font-medium",
                        )}
                      >
                        <input
                          type="radio"
                          name="objectCategory"
                          checked={objectCategory === cat}
                          onChange={() => setObjectCategory(cat)}
                          className="accent-[#0089FF] h-4 w-4 cursor-pointer"
                        />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">Color</label>
                  <SelectDropdown
                    value={color}
                    options={["White", "Black", "Blue", "Silver", "Red", "Yellow", "Orange", "Green", "Dark Blue"]}
                    onChange={setColor}
                    placeholder="Select Color"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">DVIR Template</label>
                  <SelectDropdown
                    value={dvirTemplate}
                    options={["--Select--", "Heavy Commercial Daily DVIR", "Daily EV Inspection", "Standard Inspection", "Refrigerated Transport Check", "Heavy Plant Inspection"]}
                    onChange={setDvirTemplate}
                    placeholder="Select DVIR Template"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">Permit</label>
                  <SelectDropdown
                    value={permit}
                    options={["--Select--", "National Commercial EV Permit", "Industrial Site Permit", "Special Utility Permit", "National Permit", "Interstate Heavy Haul", "Cold Chain Food Safety Permit", "Urban Delivery License", "Zero Emission Cargo Permit", "Hazardous Materials Transport"]}
                    onChange={setPermit}
                    placeholder="Select Permit"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">Manufacture Date</label>
                  <input
                    type="date"
                    value={manufactureDate}
                    onChange={(e) => setManufactureDate(e.target.value)}
                    className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">Purchase Date</label>
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">Fuel Type</label>
                  <SelectDropdown
                    value={fuelType}
                    options={["Diesel", "Petrol", "EV / Electric", "Electric", "GAS (CNG / LPG)", "Battery", "Diesel + Reefer"]}
                    onChange={setFuelType}
                    placeholder="Select Fuel Type"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">Battery Voltage</label>
                  <SelectDropdown
                    value={batteryVoltage}
                    options={["12v", "24v", "48v", "3.7v Internal"]}
                    onChange={setBatteryVoltage}
                    placeholder="Select Battery Voltage"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">Distance based Fuel</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={distanceFuelConsumption}
                        onChange={(e) => setDistanceFuelConsumption(e.target.value)}
                        placeholder="18.5"
                        className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
                      />
                      <span className="text-[11px] text-muted-foreground font-semibold shrink-0">Km/L</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">Duration based Fuel</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={durationFuelConsumption}
                        onChange={(e) => setDurationFuelConsumption(e.target.value)}
                        placeholder="1.2"
                        className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
                      />
                      <span className="text-[11px] text-muted-foreground font-semibold shrink-0">L/hr</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SENSORS */}
          {activeTab === "Sensors" && (
            <div className="space-y-3">
              {/* Top Action Bar */}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setAddSensorModalOpen(true)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-3.5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer active:scale-98"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Sensor</span>
                </button>
              </div>

              {/* Data Table */}
              <div className="border border-[#DFE3EB] dark:border-slate-800 rounded-lg overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EAF0F6] dark:bg-slate-800 border-b border-[#DFE3EB] dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold uppercase text-[11px] tracking-wide">
                    <tr>
                      <th className="py-2.5 px-3 w-14 text-center">Active</th>
                      <th className="py-2.5 px-3 w-44">Connection Type</th>
                      <th className="py-2.5 px-3">Connected Sensor</th>
                      <th className="py-2.5 px-3 w-36">Reading Type</th>
                      <th className="py-2.5 px-3 text-center w-36">Work Hour Calc</th>
                      <th className="py-2.5 px-3 text-center w-24">Calibration</th>
                      <th className="py-2.5 px-3 text-center w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DFE3EB] dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {sensors.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-2 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={s.active}
                            onChange={() => toggleSensorActive(s.id)}
                            className="h-4 w-4 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
                          />
                        </td>
                        <td className="py-2 px-3 text-foreground font-semibold">
                          {s.connectionType}
                        </td>
                        <td className="py-1.5 px-3">
                          <SelectDropdown
                            value={s.connectedSensor}
                            options={[
                              "Fuel",
                              "Ignition",
                              "Door Sensor",
                              "SOS Panic",
                              "PTO",
                              "RPM",
                              "Temprature",
                              "Load Sensor",
                              "Driver ID / RFID",
                              "Tire Pressure (TPMS)",
                              "Seatbelt Sensor",
                              "Air Conditioner (AC)",
                              "Beacon / BLE Tag",
                            ]}
                            onChange={(v) => updateSensorField(s.id, "connectedSensor", v)}
                            placeholder="Select Connected Sensor"
                          />
                        </td>
                        <td className="py-1.5 px-3">
                          <SelectDropdown
                            value={s.readingType}
                            options={["Direct", "Formula", "Linear", "Inverted"]}
                            onChange={(v) => updateSensorField(s.id, "readingType", v)}
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={s.workHourCalculation}
                            onChange={() => toggleWorkHour(s.id)}
                            className="h-4 w-4 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          {s.hasCalibration ? (
                            <button
                              type="button"
                              onClick={() => openCalibration(s)}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-input/80 bg-background text-muted-foreground hover:text-[#0089FF] hover:border-[#0089FF]/60 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all cursor-pointer shadow-2xs"
                              title={`Calibrate ${s.connectionType}`}
                            >
                              <Sliders className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <span className="text-muted-foreground font-mono">--</span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setSensors((prev) => prev.filter((item) => item.id !== s.id));
                              toast.info(`Removed sensor channel ${s.connectionType}`);
                            }}
                            className="p-1 rounded-md text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                            title="Delete Sensor"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {sensors.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-xs text-muted-foreground">
                          No sensors configured. Click &quot;Add Sensor&quot; above to add input channels.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: DOCUMENT */}
          {activeTab === "Document" && (
            <div className="space-y-3">
              {/* Top Action Bar */}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setDocUploadModalOpen(true)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-3.5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer active:scale-98"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Document</span>
                </button>
              </div>

              {/* Documents Table */}
              <div className="border border-[#DFE3EB] dark:border-slate-800 rounded-lg overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EAF0F6] dark:bg-slate-800 border-b border-[#DFE3EB] dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold uppercase text-[11px] tracking-wide">
                    <tr>
                      <th className="py-2.5 px-3">Document Title</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Doc # / ID</th>
                      <th className="py-2.5 px-3">Issue Date</th>
                      <th className="py-2.5 px-3">Expiry Date</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right w-20">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DFE3EB] dark:divide-slate-800 bg-white dark:bg-slate-900 font-medium">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-3 text-foreground font-semibold">
                          {doc.name}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {doc.type}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-medium">
                          {doc.docNumber}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">
                          {doc.issueDate}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-foreground font-bold">
                          {doc.expiryDate}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={cn(
                              "px-2 py-0.5 text-[10px] font-bold rounded-full border",
                              doc.status === "Valid" &&
                                "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                              doc.status === "Expiring Soon" &&
                                "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
                              doc.status === "Expired" &&
                                "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20",
                            )}
                          >
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => toast.success(`Downloaded ${doc.fileName}`)}
                              className="p-1 rounded-md text-muted-foreground hover:text-[#0089FF] hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Download Attachment"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
                                toast.info(`Deleted ${doc.name}`);
                              }}
                              className="p-1 rounded-md text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {documents.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-xs text-muted-foreground">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-[#0089FF]">
                              <FileText className="h-5 w-5" />
                            </div>
                            <span className="font-semibold text-foreground">No documents attached yet</span>
                            <span className="text-[11px] text-muted-foreground max-w-xs">
                              Attach insurance certificates, permits, or registration records.
                            </span>
                            <button
                              type="button"
                              onClick={() => setDocUploadModalOpen(true)}
                              className="mt-1 inline-flex h-7.5 items-center gap-1.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-3 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>Add Document</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-border bg-muted/20 px-6 py-3.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setReseller("");
              setCompany("");
              setBranch("");
              setName("");
              setDeviceType("");
              setServerAddress("");
              setImei("");
              setDeviceImei("");
              setSatelliteImei("");
              setSimPrimary("");
              setSimSecondary("");
              setDistanceCounter("");
              setDistanceVariationValue("");
              setSpeedDetection("");
              setTimezone("");
              setSpecification("");
              setIsPrimary(false);
              setIgnBasedOnSpeed(false);
              setPlateNumber("");
              setObjectType("");
              setColor("");
              setDvirTemplate("");
              setPermit("");
              setManufactureDate("");
              setPurchaseDate("");
              setInstallationDate("");
              setFuelType("");
              setBatteryVoltage("");
              setDistanceFuelConsumption("");
              setDurationFuelConsumption("");
              toast.info("Form fields cleared to blank");
            }}
            className="inline-flex h-8.5 items-center gap-1.5 rounded-md border border-input/80 bg-background px-3.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Reset</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-8.5 rounded-md border border-input/80 bg-background px-4 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="h-8.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-5 text-xs font-semibold text-white transition-all cursor-pointer shadow-xs active:scale-98"
            >
              {isEdit ? "Save Changes" : "Create Vehicle"}
            </button>
          </div>
        </div>
      </DialogContent>

      {/* Add Sensor Submodal */}
      <AddSensorModal
        open={addSensorModalOpen}
        onOpenChange={setAddSensorModalOpen}
        existingSensors={sensors}
        onAddSensor={(newSensor) => {
          setSensors((prev) => [...prev, newSensor]);
        }}
      />

      {/* Fuel Calibration Submodal */}
      <FuelCalibrationModal
        open={calibrationModalOpen}
        onOpenChange={setCalibrationModalOpen}
        sensorName={selectedSensorName}
        onSave={() => {
          toast.success("Calibration profile applied to sensor telemetry");
        }}
      />

      {/* Document Upload Submodal */}
      <DocumentUploadModal
        open={docUploadModalOpen}
        onOpenChange={setDocUploadModalOpen}
        onSave={(newDoc) => {
          setDocuments((prev) => [newDoc, ...prev]);
        }}
      />
    </Dialog>
  );
}

/* =========================================================================
   Copy Vehicle Modal
   ========================================================================= */

export function CopyVehicleModal({
  open,
  onClose,
  sourceVehicle,
  allVehicles,
  onCopySuccess,
}: {
  open: boolean;
  onClose: () => void;
  sourceVehicle: VehicleItem | null;
  allVehicles: VehicleItem[];
  onCopySuccess: (copied: VehicleItem[]) => void;
}) {
  const [fromCompany, setFromCompany] = useState(sourceVehicle?.company || "HP Company");
  const [toCompany, setToCompany] = useState("HP Company");
  const [toBranch, setToBranch] = useState("HP Branch 8");
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
  const [vehicleSearch, setVehicleSearch] = useState("");

  useEffect(() => {
    if (open && sourceVehicle) {
      setFromCompany(sourceVehicle.company);
      setSelectedVehicleIds([sourceVehicle.id]);
    }
  }, [open, sourceVehicle]);

  const availableVehicles = useMemo(() => {
    return allVehicles.filter(
      (v) => v.company.toLowerCase() === fromCompany.toLowerCase(),
    );
  }, [allVehicles, fromCompany]);

  const displayedVehicles = useMemo(() => {
    if (!vehicleSearch.trim()) return availableVehicles;
    const q = vehicleSearch.toLowerCase();
    return availableVehicles.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.imei.toLowerCase().includes(q) ||
        v.objectGroup.toLowerCase().includes(q),
    );
  }, [availableVehicles, vehicleSearch]);

  const handleToggleVehicle = (id: string) => {
    setSelectedVehicleIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedVehicleIds.length === availableVehicles.length) {
      setSelectedVehicleIds([]);
    } else {
      setSelectedVehicleIds(availableVehicles.map((v) => v.id));
    }
  };

  const handleCopy = () => {
    if (selectedVehicleIds.length === 0) {
      toast.error("Please select at least one vehicle to copy");
      return;
    }

    const copiedList: VehicleItem[] = selectedVehicleIds.map((id) => {
      const src = allVehicles.find((v) => v.id === id)!;
      const newImei = `${src.imei}_CPY`;
      return {
        ...src,
        id: `veh-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        company: toCompany,
        branch: toBranch,
        name: `${src.name} (Copy)`,
        imei: newImei,
        deviceImei: newImei,
        createdDate: "15/09/2026",
      };
    });

    onCopySuccess(copiedList);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        overlayClassName="bg-slate-950/80 backdrop-blur-md"
        className="max-w-xl max-h-[90vh] p-0 gap-0 overflow-hidden rounded-xl border border-border bg-background shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5 bg-background shrink-0">
          <DialogTitle className="text-sm font-bold text-foreground">
            Copy Vehicle Configuration
          </DialogTitle>
          <DialogDescription className="sr-only">
            Clone vehicle fleet settings from one company / branch to another
          </DialogDescription>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar text-xs">
          {/* Source Company */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              From Company <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <SelectDropdown
              value={fromCompany}
              options={["HP Company", "Global Logistics Inc", "Fleet Cargo West", "FastTrack Mobility"]}
              onChange={(val) => {
                setFromCompany(val);
                setSelectedVehicleIds([]);
              }}
              placeholder="Select Source Company"
            />
          </div>

          {/* Target Company & Branch */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                To Company <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <SelectDropdown
                value={toCompany}
                options={["HP Company", "Global Logistics Inc", "Fleet Cargo West", "FastTrack Mobility"]}
                onChange={setToCompany}
                placeholder="Select Destination Company"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                To Branch <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <SelectDropdown
                value={toBranch}
                options={["HP Branch 8", "HP EV Branch 2", "Central Branch", "North Terminal", "West Hub", "South Depot"]}
                onChange={setToBranch}
                placeholder="Select Destination Branch"
              />
            </div>
          </div>

          {/* Vehicle Multi-select List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Select Vehicles to Clone
              </label>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[11px] font-semibold text-[#0089FF] hover:underline cursor-pointer"
              >
                {selectedVehicleIds.length === availableVehicles.length ? "Deselect All" : "Select All"}
              </button>
            </div>

            <div className="rounded-lg border border-input/80 bg-background overflow-hidden shadow-2xs">
              {availableVehicles.length > 4 && (
                <div className="flex items-center px-3 py-2 border-b border-border/60 bg-muted/20">
                  <Search className="h-3.5 w-3.5 text-muted-foreground mr-2 shrink-0" />
                  <input
                    type="text"
                    value={vehicleSearch}
                    onChange={(e) => setVehicleSearch(e.target.value)}
                    placeholder="Search vehicles to clone..."
                    className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                  />
                </div>
              )}

              <div className="max-h-52 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {displayedVehicles.map((v) => {
                  const isChecked = selectedVehicleIds.includes(v.id);
                  return (
                    <label
                      key={v.id}
                      onClick={() => handleToggleVehicle(v.id)}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-md cursor-pointer transition-colors text-xs select-none",
                        isChecked
                          ? "bg-[#0089FF]/8 border border-[#0089FF]/30 text-foreground font-semibold"
                          : "hover:bg-muted/60 border border-transparent text-muted-foreground hover:text-foreground font-medium",
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="h-4 w-4 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                        />
                        <div className="truncate">
                          <span className="text-foreground font-medium truncate block">{v.name}</span>
                          <span className="text-[11px] text-muted-foreground font-mono truncate block">
                            IMEI: {v.imei} • {v.objectGroup}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border text-slate-700 dark:text-slate-300 shrink-0">
                        {v.deviceType.split(" ")[0]}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-blue-200/80 bg-blue-50/70 dark:border-blue-900/60 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200">
            <Info className="h-4 w-4 text-[#0089FF] shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-semibold text-foreground">Note:</span> Vehicle telemetry sensor maps and configuration profiles will be cloned. Unique IMEIs will receive safe temporary identifiers.
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border bg-muted/20 px-5 py-3 shrink-0">
          <button
            type="button"
            onClick={() => setSelectedVehicleIds([])}
            className="inline-flex h-8.5 items-center gap-1.5 rounded-md border border-input/80 bg-background px-3.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="h-8.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-5 text-xs font-semibold text-white transition-all cursor-pointer shadow-xs active:scale-98"
          >
            Copy {selectedVehicleIds.length > 0 ? `(${selectedVehicleIds.length}) ` : ""}Vehicles
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================================
   QR Code Modal (Device Pairing / Mobile Setup)
   ========================================================================= */

export function VehicleQrCodeModal({
  open,
  onClose,
  vehicle,
}: {
  open: boolean;
  onClose: () => void;
  vehicle: VehicleItem | null;
}) {
  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        overlayClassName="bg-slate-950/80 backdrop-blur-md"
        className="max-w-md p-0 gap-0 overflow-hidden rounded-xl border border-border bg-background shadow-2xl flex flex-col select-none"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5 bg-background shrink-0">
          <DialogTitle className="text-sm font-bold text-foreground">
            Vehicle Pairing QR Code
          </DialogTitle>
          <DialogDescription className="sr-only">
            QR code for quick mobile telemetry sync and driver pairing
          </DialogDescription>
        </div>

        <div className="p-6 flex flex-col items-center text-center space-y-4">
          <div className="p-4 rounded-xl bg-white border-2 border-slate-200 dark:border-slate-700 shadow-inner flex items-center justify-center">
            {/* SVG Representation of a clean scannable QR code */}
            <svg
              className="w-48 h-48"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100" height="100" fill="white" />
              {/* Top Left Corner */}
              <rect x="10" y="10" width="26" height="26" rx="4" fill="#0F172A" />
              <rect x="14" y="14" width="18" height="18" rx="2" fill="white" />
              <rect x="18" y="18" width="10" height="10" rx="1" fill="#0089FF" />
              {/* Top Right Corner */}
              <rect x="64" y="10" width="26" height="26" rx="4" fill="#0F172A" />
              <rect x="68" y="14" width="18" height="18" rx="2" fill="white" />
              <rect x="72" y="18" width="10" height="10" rx="1" fill="#0089FF" />
              {/* Bottom Left Corner */}
              <rect x="10" y="64" width="26" height="26" rx="4" fill="#0F172A" />
              <rect x="14" y="68" width="18" height="18" rx="2" fill="white" />
              <rect x="18" y="72" width="10" height="10" rx="1" fill="#0089FF" />
              {/* QR Pattern Dots */}
              <rect x="42" y="12" width="6" height="6" rx="1" fill="#0F172A" />
              <rect x="52" y="12" width="6" height="6" rx="1" fill="#0F172A" />
              <rect x="42" y="24" width="6" height="6" rx="1" fill="#0F172A" />
              <rect x="52" y="24" width="6" height="6" rx="1" fill="#0F172A" />
              <rect x="12" y="44" width="6" height="6" rx="1" fill="#0F172A" />
              <rect x="24" y="44" width="6" height="6" rx="1" fill="#0F172A" />
              <rect x="42" y="42" width="16" height="16" rx="3" fill="#0089FF" />
              <rect x="64" y="44" width="6" height="6" rx="1" fill="#0F172A" />
              <rect x="76" y="44" width="6" height="6" rx="1" fill="#0F172A" />
              <rect x="44" y="64" width="6" height="6" rx="1" fill="#0F172A" />
              <rect x="54" y="74" width="6" height="6" rx="1" fill="#0F172A" />
              <rect x="64" y="64" width="6" height="6" rx="1" fill="#0F172A" />
              <rect x="76" y="74" width="6" height="6" rx="1" fill="#0F172A" />
              <rect x="84" y="84" width="6" height="6" rx="1" fill="#0F172A" />
            </svg>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">{vehicle.name}</h3>
            <p className="text-xs font-mono text-muted-foreground">IMEI: {vehicle.imei}</p>
            <p className="text-[11px] text-muted-foreground">
              {vehicle.plateNumber || "No Plate"} • {vehicle.company}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border bg-muted/20 px-5 py-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              window.print();
            }}
            className="inline-flex h-8.5 items-center gap-1.5 rounded-md border border-input/80 bg-background px-3.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-muted transition-all cursor-pointer shadow-2xs"
          >
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            <span>Print Badge</span>
          </button>

          <button
            type="button"
            onClick={() => {
              toast.success(`QR Code downloaded for ${vehicle.name}`);
              onClose();
            }}
            className="inline-flex h-8.5 items-center gap-1.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-4 text-xs font-semibold text-white transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PNG</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================================
   Reusable SelectDropdown (Matching Alert Page standard)
   ========================================================================= */

export type DropdownOption =
  | string
  | {
      label: string;
      value?: string;
      description?: string;
    };

function SelectDropdown({
  value,
  options,
  onChange,
  className,
  placeholder,
}: {
  value: string;
  options: DropdownOption[];
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selectedOption = options.find((opt) => {
    if (typeof opt === "object") {
      return (opt.value ?? opt.label) === value || opt.label === value;
    }
    return opt === value;
  });

  const displayLabel = selectedOption
    ? typeof selectedOption === "object"
      ? selectedOption.label
      : selectedOption
    : value || placeholder || "Select";

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input/80 bg-background px-3 text-xs shadow-2xs transition-all hover:border-[#0089FF]/60 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF] cursor-pointer select-none font-normal",
          open && "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-muted/40",
        )}
      >
        <span
          className={cn(
            "truncate",
            value
              ? "text-foreground font-medium"
              : "text-muted-foreground/60 font-normal italic",
          )}
        >
          {displayLabel}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground shrink-0 opacity-70 transition-transform duration-200 ml-1.5",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md p-1 shadow-xl animate-in fade-in-0 zoom-in-95 select-none custom-scrollbar">
          {options.map((opt) => {
            const isObj = typeof opt === "object";
            const optLabel = isObj ? opt.label : opt;
            const optVal = isObj ? (opt.value ?? opt.label) : opt;
            const optDesc = isObj ? opt.description : undefined;
            const isSelected = value === optVal || value === optLabel;

            return (
              <button
                key={optVal}
                type="button"
                onClick={() => {
                  onChange(optVal);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors cursor-pointer select-none",
                  isSelected
                    ? "bg-muted font-semibold text-foreground"
                    : "text-foreground hover:bg-muted/80 font-normal",
                )}
              >
                <div className="flex flex-col min-w-0 pr-2">
                  <span
                    className={cn(
                      "text-xs leading-tight truncate",
                      isSelected
                        ? "font-semibold text-foreground"
                        : "font-medium text-foreground",
                    )}
                  >
                    {optLabel}
                  </span>
                  {optDesc && (
                    <span className="text-[11px] leading-snug text-muted-foreground mt-0.5 font-normal">
                      {optDesc}
                    </span>
                  )}
                </div>
                {isSelected && (
                  <Check className="h-4 w-4 text-[#0089FF] shrink-0 ml-1" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
