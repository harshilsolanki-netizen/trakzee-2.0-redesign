import React, { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  CircleGauge,
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
  MoreVertical,
  Upload,
  Wrench,
  FileSpreadsheet,
  Mail,
  FileEdit,
  AlertTriangle,
  RefreshCw,
  Star,
  Settings,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectDropdown, type DropdownOption } from "@/components/ui/select-dropdown";
import { cn } from "@/lib/utils";
import { useLayoutMode } from "@/lib/useLayoutMode";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ColumnConfigModal,
  type ColumnConfigItem,
  type ReportColumnSettings,
} from "@/components/report/ColumnConfigModal";
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

export const DEFAULT_OBJECT_COLUMNS: ColumnConfigItem[] = [
  { id: "company", label: "Company", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 0 },
  { id: "branch", label: "Branch", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 1 },
  { id: "name", label: "Vehicle Name", showable: true, printable: true, sortable: true, sortPriority: 1, sortDir: "asc", pinned: true, originalIndex: 2 },
  { id: "group", label: "Object Group", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 3 },
  { id: "imei", label: "IMEI Number", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 4 },
  { id: "sim", label: "SIM Number", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 5 },
  { id: "deviceType", label: "GPS Device Type", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 6 },
  { id: "distanceCounter", label: "Distance Counter", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 7 },
  { id: "speedDetection", label: "Speed Detection", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 8 },
  { id: "timezone", label: "Timezone", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 9 },
  { id: "createdDate", label: "Created Date", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 10 },
  { id: "installationDate", label: "Installation Date", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 11 },
  { id: "sensor", label: "Sensor", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 12 },
  { id: "expiryDate", label: "Expiry Date", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 13 },
  { id: "specification", label: "Specification", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 14 },
  { id: "primaryVehicle", label: "Primary Vehicle", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 15 },
  { id: "documents", label: "Documents", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 16 },
  { id: "qrCode", label: "QR Code", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 17 },
  { id: "gpsTrackerId", label: "GPS Tracker ID", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 18 },
  { id: "gpsTrackerSerial", label: "GPS Tracker Serial No", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 19 },
];

function IconButton({
  label,
  onClick,
  disabled,
  children,
  className,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={label}
            onClick={onClick}
            disabled={disabled}
            className={cn(
              "toolbar-icon-btn inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-800 disabled:cursor-not-allowed group",
              className,
            )}
          >
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const VEHICLE_SEARCH_FIELDS = [
  { id: "all", label: "All fields" },
  { id: "name", label: "Vehicle Name" },
  { id: "imei", label: "IMEI Number" },
  { id: "sim", label: "SIM Number" },
  { id: "company", label: "Company" },
  { id: "branch", label: "Branch" },
  { id: "group", label: "Object Group" },
  { id: "deviceType", label: "Device Type" },
];


function renderObjectCell(colId: string, row: VehicleItem) {
  switch (colId) {
    case "company":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap text-foreground font-semibold">
          {row.company}
        </td>
      );
    case "branch":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap text-foreground">
          {row.branch}
        </td>
      );
    case "name":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap font-semibold text-[#0089FF] hover:underline cursor-pointer">
          {row.name}
        </td>
      );
    case "group":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap text-foreground">
          {row.objectGroup}
        </td>
      );
    case "imei":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
          {row.imei}
        </td>
      );
    case "sim":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
          {row.simPrimary}
        </td>
      );
    case "deviceType":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap text-foreground text-xs">
          {row.deviceType}
        </td>
      );
    case "distanceCounter":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 text-center whitespace-nowrap text-foreground">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {row.distanceCounter}
          </span>
        </td>
      );
    case "speedDetection":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 text-center whitespace-nowrap text-foreground">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
            {row.speedDetection}
          </span>
        </td>
      );
    case "timezone":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
          {row.timezone}
        </td>
      );
    case "createdDate":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
          {row.createdDate}
        </td>
      );
    case "installationDate":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
          {row.installationDate}
        </td>
      );
    case "sensor":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 text-center whitespace-nowrap">
          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-bold bg-[#0089FF]/10 text-[#0089FF]">
            {row.sensorCount}
          </span>
        </td>
      );
    case "expiryDate":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
          {row.expiryDate}
        </td>
      );
    case "specification":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 text-center whitespace-nowrap">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
            {row.specification}
          </span>
        </td>
      );
    case "primaryVehicle":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 text-center whitespace-nowrap">
          <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold",
            row.isPrimary ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
          )}>
            {row.isPrimary ? "Primary" : "Secondary"}
          </span>
        </td>
      );
    case "documents":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 text-center whitespace-nowrap">
          <span className="inline-flex items-center justify-center h-5 px-1.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
            {row.documentsCount} Docs
          </span>
        </td>
      );
    case "qrCode":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 text-center whitespace-nowrap">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
            QR Active
          </span>
        </td>
      );
    case "gpsTrackerId":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
          {row.trackerId}
        </td>
      );
    case "gpsTrackerSerial":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
          {row.serialNo}
        </td>
      );
    default:
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap text-foreground">
          {(row as any)[colId] ?? "--"}
        </td>
      );
  }
}

export function ObjectSettingPage({
  initialAction,
  initialTab,
}: {
  initialAction?: string;
  initialTab?: string;
} = {}) {
  const { isSingle } = useLayoutMode();
  const [vehicles, setVehicles] = useState<VehicleItem[]>(INITIAL_VEHICLES);
  const [searchField, setSearchField] = useState("all");
  const selectedSearchFieldLabel = VEHICLE_SEARCH_FIELDS.find((f) => f.id === searchField)?.label || "All fields";
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageSizeOpen, setPageSizeOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Right Side Filter Drawer State
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [columnSettings, setColumnSettings] = useState<ReportColumnSettings>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("trakzee_object_columns_v1");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.columns?.length) return parsed;
        }
      } catch {}
    }
    return {
      columns: DEFAULT_OBJECT_COLUMNS,
      frozenColumnsCount: 1,
      detailDownloadMode: "multiple",
      detailScreenSetting: "summary",
    };
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("trakzee_object_columns_v1", JSON.stringify(columnSettings));
    }
  }, [columnSettings]);

  const [columnModalOpen, setColumnModalOpen] = useState(false);

  const visibleColumns = useMemo(() => {
    return (columnSettings.columns || DEFAULT_OBJECT_COLUMNS).filter((c) => c.showable);
  }, [columnSettings.columns]);

  const [activeFilters, setActiveFilters] = useState<VehicleFilterState>(DEFAULT_VEHICLE_FILTERS);

  // View Mode: "list" for Fleet Table, "form" for In-Screen Add/Edit Vehicle
  const [viewMode, setViewMode] = useState<"list" | "form">(
    initialAction === "add" || initialTab === "add_vehicle" || initialTab === "add" ? "form" : "list"
  );
  const [editingVehicle, setEditingVehicle] = useState<VehicleItem | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Modal State for Copy Vehicle
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [copySourceVehicle, setCopySourceVehicle] = useState<VehicleItem | null>(null);

  // QR Code Modal State
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedQrVehicle, setSelectedQrVehicle] = useState<VehicleItem | null>(null);

  // 3-Dots Overlay Menu & Bulk Modals State
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [bulkUpdateModalOpen, setBulkUpdateModalOpen] = useState(false);
  const [bulkInsertModalOpen, setBulkInsertModalOpen] = useState(false);
  const [bulkMaintenanceModalOpen, setBulkMaintenanceModalOpen] = useState(false);
  const [batchQrModalOpen, setBatchQrModalOpen] = useState(false);

  const activeDrawerFilterCount = useMemo(() => {
    let count = 0;
    if (activeFilters.company !== "All") count++;
    if (activeFilters.branch !== "All") count++;
    if (activeFilters.deviceType !== "All") count++;
    if (activeFilters.objectGroup !== "All") count++;
    return count;
  }, [activeFilters]);

  const openCreateForm = () => {
    setEditingVehicle(null);
    setViewMode("form");
  };

  const openEditForm = (item: VehicleItem) => {
    setEditingVehicle(item);
    setViewMode("form");
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
    setViewMode("list");
  };

  const handleCopySuccess = (newVehicles: VehicleItem[]) => {
    setVehicles((prev) => [...newVehicles, ...prev]);
    setCopyModalOpen(false);
    toast.success(`Successfully copied ${newVehicles.length} vehicle${newVehicles.length > 1 ? "s" : ""}`);
  };

  const handleBulkDeleteSuccess = (deletedIds: string[]) => {
    setVehicles((prev) => prev.filter((v) => !deletedIds.includes(v.id)));
  };

  const handleBulkInsertSuccess = (count: number) => {
    toast.success(`Inserted ${count} objects into the fleet`);
  };

  
  const handleCloneObject = (item: VehicleItem) => {
    const cloned: VehicleItem = {
      ...item,
      id: `veh-${Date.now()}`,
      name: `${item.name} (Copy)`,
      imei: `${Math.floor(100000000 + Math.random() * 900000000)}`,
      deviceImei: `${Math.floor(100000000 + Math.random() * 900000000)}`,
    };
    setVehicles((prev) => [cloned, ...prev]);
    toast.success(`Cloned vehicle "${cloned.name}"`);
  };

  const handleDeleteObject = (id: string) => {
    handleDeleteVehicle(id);
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
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#F0F0F0] dark:bg-slate-950 p-[10px]">
      <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white dark:bg-slate-900 rounded-xl border border-[#DFE3EB]/80 dark:border-slate-800 shadow-2xs">
      {/* 1. Conditional Header: Tabbed View vs Single Screen View (matching reference media_1789714484140.png) */}
      {!isSingle ? (
      <div className="relative flex items-end justify-between h-[45px] pt-[10px] px-0 select-none shrink-0 bg-[#F1F5F9] dark:bg-slate-950 rounded-tl-lg">
        {/* Baseline border that runs across the entire strip under inactive tabs */}
        <div className="absolute left-0 right-0 bottom-0 h-px bg-[#DFE3EB] dark:bg-slate-800 z-0" />

        {/* Tab bar list */}
        <div className="relative z-10 flex min-w-0 flex-1 items-end overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden h-full pl-[10px]">
          <div
            className="group relative flex shrink-0 cursor-pointer items-center gap-2 text-xs transition-all duration-150 select-none h-[35px] px-4 rounded-t-lg bg-white dark:bg-slate-900 border-t border-l border-r border-[#DFE3EB] dark:border-slate-800 text-slate-800 dark:text-white font-semibold mb-[-1px] z-20 shadow-2xs"
          >
            {/* Left Inverted Concave Fillet for Active Tab (curving into baseline) */}
            <div className="absolute -left-[8px] bottom-0 w-[8px] h-[8px] overflow-hidden pointer-events-none z-20">
              <svg className="w-full h-full" viewBox="0 0 8 8" fill="none">
                <path
                  d="M 0 8 L 8 8 L 8 0 C 8 4.418 4.418 8 0 8 Z"
                  className="fill-white dark:fill-slate-900"
                />
                <path
                  d="M 0 8 C 4.418 8 8 4.418 8 0"
                  className="stroke-[#DFE3EB] dark:stroke-slate-800"
                  strokeWidth="1"
                />
              </svg>
            </div>

            {/* Right Inverted Concave Fillet for Active Tab (curving into baseline) */}
            <div className="absolute -right-[8px] bottom-0 w-[8px] h-[8px] overflow-hidden pointer-events-none z-20">
              <svg className="w-full h-full" viewBox="0 0 8 8" fill="none">
                <path
                  d="M 8 8 L 0 8 L 0 0 C 0 4.418 3.582 8 8 8 Z"
                  className="fill-white dark:fill-slate-900"
                />
                <path
                  d="M 8 8 C 3.582 8 0 4.418 0 0"
                  className="stroke-[#DFE3EB] dark:stroke-slate-800"
                  strokeWidth="1"
                />
              </svg>
            </div>

            {/* Star Favorite Icon in List Mode / Back Button in Form Mode */}
            {viewMode === "form" ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewMode("list");
                }}
                className="p-0.5 -ml-1 rounded text-slate-700 dark:text-slate-200 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title="Back to Vehicle List"
              >
                <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFavorite(!isFavorite);
                }}
                className="p-0.5 rounded transition-colors cursor-pointer shrink-0 text-slate-400 hover:text-amber-400"
                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Star
                  className={cn(
                    "h-3.5 w-3.5 transition-colors",
                    isFavorite ? "fill-amber-400 text-amber-400" : ""
                  )}
                />
              </button>
            )}

            {/* Tab Title */}
            <span className="truncate max-w-[180px] whitespace-nowrap text-xs">
              Vehicle
            </span>
          </div>

          
        </div>
      </div>
      ) : (
        /* SINGLE SCREEN TITLE */
        <div className="relative z-20 flex items-center justify-between px-5 pt-5 pb-2.5 select-none shrink-0 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            {viewMode === "form" ? (
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className="p-1 -ml-1 rounded text-slate-700 dark:text-slate-200 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title="Back to Vehicle List"
              >
                <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-1 -ml-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Star
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isFavorite ? "fill-amber-400 text-amber-400" : "text-slate-400 stroke-[2]"
                  )}
                />
              </button>
            )}
            <h1 className="text-[24px] font-medium text-slate-900 dark:text-white tracking-tight">
              {viewMode === "form" ? (editingVehicle ? `Edit: ${editingVehicle.name}` : "Add Vehicle") : "Vehicle"}
            </h1>
          </div>
        </div>
      )}

      {viewMode === "list" ? (
        <>
          {/* 2. Top Single-Row Filter & Utilities Toolbar (Visible only in List Mode) */}
          <div className="relative z-20 flex min-h-[42px] items-center justify-between gap-3 bg-white dark:bg-slate-900 px-5 pb-3.5 shrink-0 select-none">
        {/* Left Toolbar: Filter Pills */}
        <div className="flex items-center min-w-0 overflow-x-auto scrollbar-none gap-3 text-xs select-none">
          {/* Company Filter Pill */}
          <div className="flex items-center gap-1.5 font-medium shrink-0">
            <span className="text-slate-500 dark:text-slate-400 font-normal">Company:</span>
            <span className="text-slate-900 dark:text-white font-semibold cursor-pointer hover:underline inline-flex items-center gap-1">
              ABC Logistic
              <ChevronDown className="h-3 w-3 text-slate-500 dark:text-slate-400" />
            </span>
          </div>

          {/* Divider 1 */}
          <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />

          {/* Branch Filter Pill */}
          <div className="flex items-center gap-1.5 font-medium shrink-0">
            <span className="text-slate-500 dark:text-slate-400 font-normal">Branch:</span>
            <span className="text-slate-900 dark:text-white font-semibold cursor-pointer hover:underline inline-flex items-center gap-1">
              HP Branch +3
              <ChevronDown className="h-3 w-3 text-slate-500 dark:text-slate-400" />
            </span>
          </div>

          {/* Divider 2 */}
          <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />

          {/* Vehicle Filter Pill */}
          <div className="flex items-center gap-1.5 font-medium shrink-0">
            <span className="text-slate-500 dark:text-slate-400 font-normal">Vehicle:</span>
            <span className="text-slate-900 dark:text-white font-semibold cursor-pointer hover:underline inline-flex items-center gap-1">
              HP Branch +30
              <ChevronDown className="h-3 w-3 text-slate-500 dark:text-slate-400" />
            </span>
          </div>

          {/* Divider 3 */}
          <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />

          {/* Filter Button (Matching Report section) */}
          <button
            type="button"
            onClick={() => setFilterDrawerOpen((prev) => !prev)}
            aria-label="Open Filter Drawer"
            className="inline-flex h-7 items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white transition-all cursor-pointer select-none shadow-2xs active:scale-98 shrink-0"
          >
            <SlidersHorizontal className="h-3 w-3 text-slate-500 dark:text-slate-400" />
            <span className="font-medium text-slate-700 dark:text-slate-300">Filter</span>
            {activeDrawerFilterCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold leading-tight bg-[#0089FF] text-white">
                {activeDrawerFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Right Toolbar: Search & + Object & Utilities */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {/* Field Search */}
          <div className="relative flex h-7.5 items-center rounded-md border border-border/80 bg-background shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all overflow-hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  title="Select specific column to search"
                  className="flex h-full items-center gap-1 border-r border-border/60 bg-muted/30 px-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0 select-none"
                >
                  <span className="max-w-[76px] truncate">
                    {searchField === "all" ? "All fields" : selectedSearchFieldLabel}
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="max-h-64 w-52 overflow-y-auto text-xs p-1 rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md shadow-lg z-50 select-none"
              >
                <DropdownMenuItem
                  onClick={() => {
                    setSearchField("all");
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors select-none",
                    searchField === "all"
                      ? "bg-muted font-semibold text-foreground"
                      : "text-foreground hover:bg-muted/80 hover:text-foreground font-medium",
                  )}
                >
                  <span>All fields</span>
                  {searchField === "all" && (
                    <Check className="h-3.5 w-3.5 text-[#0089FF]" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 -mx-1" />
                {VEHICLE_SEARCH_FIELDS.filter((f) => f.id !== "all").map((f) => {
                  const isSelected = searchField === f.id;
                  return (
                    <DropdownMenuItem
                      key={f.id}
                      onClick={() => {
                        setSearchField(f.id);
                        setCurrentPage(1);
                      }}
                      className={cn(
                        "cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors select-none",
                        isSelected
                          ? "bg-muted font-semibold text-foreground"
                          : "text-foreground hover:bg-muted/80 hover:text-foreground font-medium",
                      )}
                    >
                      <span className="truncate">{f.label}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-[#0089FF]" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Search className="ml-2.5 h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search in all fields..."
              className="h-full w-32 sm:w-44 bg-transparent px-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="mr-1.5 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer rounded-full transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Primary Action Button: + Object */}
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex h-7.5 items-center gap-1.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-3.5 text-xs font-semibold text-white transition-all cursor-pointer shadow-xs active:scale-98 ml-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Object</span>
          </button>

          <IconButton
            label="Column Settings"
            onClick={() => setColumnModalOpen(true)}
          >
            <Settings className="h-[18px] w-[18px] text-slate-800 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white stroke-[2.2] transition-colors" />
          </IconButton>

          {/* 3-Dots More Menu */}
          <Popover open={moreMenuOpen} onOpenChange={setMoreMenuOpen}>
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      aria-label="More Fleet Actions"
                      className="toolbar-icon-btn inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-95 group"
                    >
                      <MoreVertical className="h-[18px] w-[18px] text-slate-800 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white stroke-[2.2] transition-colors" />
                    </button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>More fleet actions</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent align="end" sideOffset={6} className="w-52 p-1 rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md shadow-lg select-none z-50">
              <button
                type="button"
                onClick={() => {
                  setBulkUpdateModalOpen(true);
                  setMoreMenuOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md hover:bg-muted text-foreground transition-colors cursor-pointer text-left"
              >
                <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                <span>Bulk Object Update</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setBulkMaintenanceModalOpen(true);
                  setMoreMenuOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md hover:bg-muted text-foreground transition-colors cursor-pointer text-left"
              >
                <Wrench className="h-4 w-4 text-slate-500" />
                <span>Bulk Maintenance</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setBatchQrModalOpen(true);
                  setMoreMenuOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md hover:bg-muted text-foreground transition-colors cursor-pointer text-left"
              >
                <QrCode className="h-4 w-4 text-slate-500" />
                <span>Batch QR Codes</span>
              </button>

              <div className="my-1 border-t border-border/60" />

              <button
                type="button"
                onClick={() => {
                  setBulkDeleteModalOpen(true);
                  setMoreMenuOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md hover:bg-destructive/10 text-destructive transition-colors cursor-pointer text-left"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
                <span>Bulk Delete Objects</span>
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Horizontal divider with 20px space from left and right */}
      <div className="mx-5 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0 relative z-20 bg-white dark:bg-slate-900" />

      {/* 3. Table & Inline Filter Area */}
      <div className="relative min-h-0 flex-1 flex overflow-hidden bg-white dark:bg-slate-900">
        {/* Table Scroll Area */}
        <div className="relative min-h-0 flex-1 overflow-auto overscroll-contain scroll-smooth pt-1 mx-5">
          <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-10 shadow-xs">
                    <tr className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold tracking-wider text-[11px] uppercase border-b border-[#DFE3EB] dark:border-slate-700 select-none whitespace-nowrap h-[38px]">
                      <th className="py-2.5 px-3 text-center w-10 bg-white dark:bg-slate-900">
                        #
                      </th>
                      {visibleColumns.map((col) => {
                        const isCenter = ["distanceCounter", "speedDetection", "sensor", "specification", "primaryVehicle", "documents", "qrCode"].includes(col.id);
                        return (
                          <th
                            key={col.id}
                            className={cn(
                              "py-2.5 px-3.5 bg-white dark:bg-slate-900",
                              isCenter && "text-center",
                              col.pinned && "bg-slate-50/80 dark:bg-slate-800/80",
                            )}
                          >
                            {col.label}
                          </th>
                        );
                      })}
                      <th className="py-2.5 px-3 text-right sticky right-0 bg-white dark:bg-slate-900 shadow-l">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DFE3EB] dark:divide-slate-800 bg-white dark:bg-slate-900 font-medium whitespace-nowrap">
                    {pageRows.map((row, idx) => (
                      <tr
                        key={row.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                        onClick={() => openEditForm(row)}
                      >
                        <td className="py-2 px-3 text-center text-muted-foreground font-mono text-[11px]">
                          {(currentPage - 1) * pageSize + idx + 1}
                        </td>
                        {visibleColumns.map((col) => renderObjectCell(col.id, row))}
                        <td className="py-2 px-3 text-right sticky right-0 bg-white dark:bg-slate-900 shadow-l" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openEditForm(row)}
                              className="p-1 rounded text-muted-foreground hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Edit Object"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCloneObject(row)}
                              className="p-1 rounded text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors cursor-pointer"
                              title="Clone Object"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteObject(row.id)}
                              className="p-1 rounded text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                              title="Delete Object"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {pageRows.length === 0 && (
                      <tr>
                        <td colSpan={visibleColumns.length + 2} className="py-14 text-center text-xs text-muted-foreground">
                          No fleet objects found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
              </table>
        </div>

        {/* Inline Right-Side Filter Panel */}
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

          {/* Horizontal divider with 20px space from left and right */}
          <div className="mx-5 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0" />

          {/* Standard Application Bottom Frame with Centered HubSpot-Style Pagination & Operations */}
          <footer className="flex h-11 items-center justify-between px-5 bg-white dark:bg-slate-900 shrink-0 select-none">
            {/* Left: Total records */}
            <div className="flex items-center min-w-[140px]">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 tabular-nums select-none">
                {filteredVehicles.length.toLocaleString()} records
              </span>
            </div>

            {/* Center: Pagination */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Prev */}
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors px-1.5 py-1 rounded"
              >
                <ChevronLeft className="h-3.5 w-3.5 stroke-[2.2]" />
                <span>Prev</span>
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-0.5 sm:gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const isActive = p === currentPage;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCurrentPage(p)}
                      className={cn(
                        "h-6 min-w-[24px] px-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center justify-center",
                        isActive
                          ? "border border-slate-400 dark:border-slate-500 bg-transparent text-slate-900 dark:text-white font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",
                      )}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              {/* Next */}
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors px-1.5 py-1 rounded"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5 stroke-[2.2]" />
              </button>

              {/* Page Size Selector */}
              <div className="ml-1 sm:ml-2">
                <Popover open={pageSizeOpen} onOpenChange={setPageSizeOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white cursor-pointer select-none transition-colors px-1.5 py-1 rounded bg-transparent border-0 hover:bg-slate-100 dark:hover:bg-slate-800",
                        pageSizeOpen && "bg-slate-100 dark:bg-slate-800 text-black dark:text-white",
                      )}
                    >
                      <span>{pageSize} per page</span>
                      <ChevronDown className={cn("h-3 w-3 opacity-60 transition-transform", pageSizeOpen && "rotate-180")} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="center" sideOffset={6} className="w-32 p-1 rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md shadow-lg select-none z-50">
                    {PAGE_SIZES.map((s) => (
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
                          pageSize === s ? "bg-muted font-semibold text-foreground" : "text-foreground hover:bg-muted/80 hover:text-foreground font-medium",
                        )}
                      >
                        <span>{s} per page</span>
                        {pageSize === s && <Check className="h-3.5 w-3.5 text-[#0089FF]" />}
                      </button>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Right: Other Operations */}
            <div className="flex items-center gap-2 min-w-[140px] justify-end">
              {/* Reset Table (Circular Icon Only) */}
              <button
                type="button"
                onClick={handleResetTable}
                className="inline-flex h-7.5 w-7.5 items-center justify-center rounded-full border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white transition-all cursor-pointer active:scale-95"
                title="Reset Table"
              >
                <RotateCcw className="h-3.5 w-3.5 stroke-[2.2]" />
              </button>

              {/* Download XLS (Label and Icon) */}
              <button
                type="button"
                onClick={() => toast.success("Exported fleet objects as XLS")}
                className="inline-flex h-7.5 items-center gap-1.5 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white transition-all cursor-pointer active:scale-98"
                title="Download Excel XLS"
              >
                <Download className="h-3.5 w-3.5 stroke-[2.2]" />
                <span>Download</span>
              </button>
            </div>
          </footer>
    </>
    ) : (
      /* In-Screen Form View (Direct full-bleed container without extra outer box/borders) */
      <div className="flex-1 min-h-0 min-w-0 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
        <VehicleDetailFormView
          vehicle={editingVehicle}
          onSave={handleSaveVehicle}
          onCancel={() => setViewMode("list")}
        />
      </div>
    )}
      </div>

      {/* 4. Copy Vehicle Modal */}
      <CopyVehicleModal
        open={copyModalOpen}
        onClose={() => setCopyModalOpen(false)}
        sourceVehicle={copySourceVehicle}
        allVehicles={vehicles}
        onCopySuccess={handleCopySuccess}
      />

      {/* 5. Single QR Code Modal */}
      <VehicleQrCodeModal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        vehicle={selectedQrVehicle}
      />

      {/* 6. Bulk Delete Modal */}
      <BulkDeleteModal
        open={bulkDeleteModalOpen}
        onClose={() => setBulkDeleteModalOpen(false)}
        allVehicles={vehicles}
        onDeleteSuccess={handleBulkDeleteSuccess}
      />

      {/* 7. Bulk Update Modal */}
      <BulkUpdateModal
        open={bulkUpdateModalOpen}
        onClose={() => setBulkUpdateModalOpen(false)}
        allVehicles={vehicles}
      />

      {/* 8. Bulk Object Insert Modal */}
      <BulkInsertModal
        open={bulkInsertModalOpen}
        onClose={() => setBulkInsertModalOpen(false)}
        onInsertSuccess={handleBulkInsertSuccess}
      />

      {/* 9. Bulk Maintenance Modal */}
      <BulkMaintenanceModal
        open={bulkMaintenanceModalOpen}
        onClose={() => setBulkMaintenanceModalOpen(false)}
        allVehicles={vehicles}
      />

      {/* 10. Batch QR Code Modal */}
      <QrCodeBatchModal
        open={batchQrModalOpen}
        onClose={() => setBatchQrModalOpen(false)}
        allVehicles={vehicles}
      />

      {/* Column Settings Modal */}
      <ColumnConfigModal
        open={columnModalOpen}
        onClose={() => setColumnModalOpen(false)}
        settings={columnSettings}
        onSave={(newSettings) => {
          setColumnSettings(newSettings);
          try {
            localStorage.setItem("trakzee_object_columns_v1", JSON.stringify(newSettings));
          } catch {}
          setColumnModalOpen(false);
          toast.success("Column settings updated");
        }}
        hideDetailTab={true}
        hidePreferenceTab={true}
        hideTabs={true}
        defaultColumns={DEFAULT_OBJECT_COLUMNS}
        title="Column Setting"
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

  if (!open) return null;

  return (
    <aside className="w-[320px] xl:w-[350px] shrink-0 border-l border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full z-10 select-none animate-in slide-in-from-right duration-200">
      {/* Header matching Reference */}
      <header className="flex h-11 items-center justify-between border-b border-[#DFE3EB] dark:border-slate-800 px-4 bg-white dark:bg-slate-900 select-none shrink-0">
        <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
          Filter Options
        </h2>
        <button
          type="button"
          aria-label="Close filter"
          onClick={onClose}
          className="rounded-md p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs custom-scrollbar">
        {/* 1. Company */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Company <span className="text-slate-400 font-normal">:</span>
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
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Branch <span className="text-slate-400 font-normal">:</span>
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
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            GPS Device Type <span className="text-slate-400 font-normal">:</span>
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
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Object Group <span className="text-slate-400 font-normal">:</span>
          </label>
          <SelectDropdown
            value={draftObjectGroup}
            options={objectGroupOptions}
            onChange={setDraftObjectGroup}
            placeholder="Select Object Group"
          />
        </div>
      </div>

      {/* Footer: Reset left, Apply right */}
      <footer className="flex h-12 items-center justify-between border-t border-[#DFE3EB] dark:border-slate-800 px-4 bg-white dark:bg-slate-900 select-none shrink-0">
        <button
          type="button"
          onClick={handleDrawerReset}
          className="h-8 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
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
              options={["Direct", "Inverse"]}
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
   In-Screen Add / Edit Vehicle Form View (Horizontal Field-Beside-Value Layout)
   ========================================================================= */

export function VehicleDetailFormView({
  vehicle,
  onSave,
  onCancel,
}: {
  vehicle: VehicleItem | null;
  onSave: (v: VehicleItem) => void;
  onCancel: () => void;
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

  // Sync state when vehicle prop changes
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
  }, [vehicle]);

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

  const handleResetForm = () => {
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
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-slate-900">
      {/* In-Screen Form Secondary Tabs Bar (General, Profile, Sensors, Document) */}
      <div className="flex items-center justify-between border-b border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 px-8 shrink-0 select-none text-xs h-10">
        <div className="flex items-center gap-8 h-full">
          {(
            [
              { id: "General", label: "General" },
              { id: "Profile", label: "Profile" },
              { id: "Sensors", label: "Sensors" },
              { id: "Document", label: "Document" },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative h-full flex items-center px-0.5 text-xs transition-colors cursor-pointer select-none border-b-2 line-tab !rounded-none focus:outline-none",
                  isActive
                    ? "border-[#0089FF] text-[#0089FF] dark:text-blue-400 font-bold -mb-[1px]"
                    : "border-transparent text-muted-foreground font-medium hover:text-foreground hover:border-slate-300 dark:hover:border-slate-700",
                )}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* In-Screen Scrollable Form Body */}
      <div className="flex-1 min-h-0 overflow-y-auto px-8 py-6 space-y-3.5 custom-scrollbar text-xs">
        {/* TAB 1: GENERAL (Horizontal Field-Beside-Value Layout) */}
        {activeTab === "General" && (
          <div className="space-y-3.5">
            {/* Reseller * */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Reseller <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <SelectDropdown
                  value={reseller}
                  options={["HP Reseller", "Global Reseller Hub", "FleetTech Resellers", "FastTrack Telematics"]}
                  onChange={setReseller}
                  placeholder="Select Reseller"
                />
              </div>
            </div>

            {/* Company * */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Company <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <SelectDropdown
                  value={company}
                  options={["HP Company", "Global Logistics Inc", "Fleet Cargo West", "FastTrack Mobility"]}
                  onChange={setCompany}
                  placeholder="Select Company"
                />
              </div>
            </div>

            {/* Branch * */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Branch <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <SelectDropdown
                  value={branch}
                  options={["HP Branch 8", "HP EV Branch 2", "Central Branch", "North Terminal", "West Hub", "South Depot"]}
                  onChange={setBranch}
                  placeholder="Select Branch"
                />
              </div>
            </div>

            {/* Vehicle Name * */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Vehicle Name <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Vehicle Name (e.g. HP Boom Barrier)"
                  className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Object Group */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Object Group
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <SelectDropdown
                  value={objectGroup}
                  options={OBJECT_GROUP_OPTIONS}
                  onChange={setObjectGroup}
                  placeholder="Select Object Group"
                />
              </div>
            </div>

            {/* Specification */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Specification
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <SelectDropdown
                  value={specification}
                  options={SPECIFICATION_OPTIONS}
                  onChange={setSpecification}
                  placeholder="Select Specification"
                />
              </div>
            </div>

            {/* Unit of Distance */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Unit of Distance
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <SelectDropdown
                  value={unitOfDistance}
                  options={DISTANCE_UNIT_OPTIONS}
                  onChange={setUnitOfDistance}
                />
              </div>
            </div>

            {/* Device Type * */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Device Type <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <SelectDropdown
                  value={deviceType}
                  options={DEVICE_TYPE_OPTIONS}
                  onChange={handleDeviceTypeChange}
                  placeholder="Select Device Type"
                />
              </div>
            </div>

            {/* Server Address */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Server Address
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <input
                  type="text"
                  value={serverAddress}
                  readOnly
                  placeholder="--"
                  className="h-9 w-full rounded-md border border-input/80 bg-muted/40 px-3 font-mono text-xs text-muted-foreground shadow-2xs cursor-not-allowed select-all"
                />
              </div>
            </div>

            {/* IMEI Number * */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                IMEI Number <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <div className="w-80 sm:w-96 max-w-md">
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
            </div>

            {/* Device IMEI * */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Device IMEI <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <input
                  type="text"
                  value={deviceImei}
                  onChange={(e) => setDeviceImei(e.target.value)}
                  placeholder="e.g. 123321026"
                  className="h-9 w-full rounded-md border border-input/80 bg-background px-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Satellite IMEI */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Satellite IMEI
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <input
                  type="text"
                  value={satelliteImei}
                  onChange={(e) => setSatelliteImei(e.target.value)}
                  placeholder="Optional satellite tracker IMEI"
                  className="h-9 w-full rounded-md border border-input/80 bg-background px-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Primary SIM */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Primary SIM
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <input
                  type="text"
                  value={simPrimary}
                  onChange={(e) => setSimPrimary(e.target.value)}
                  placeholder="+62 812 3456"
                  className="h-9 w-full rounded-md border border-input/80 bg-background px-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Secondary SIM */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Secondary SIM
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <input
                  type="text"
                  value={simSecondary}
                  onChange={(e) => setSimSecondary(e.target.value)}
                  placeholder="Optional backup SIM"
                  className="h-9 w-full rounded-md border border-input/80 bg-background px-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Time Zone */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Time Zone
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <SelectDropdown
                  value={timezone}
                  options={TIMEZONE_OPTIONS}
                  onChange={setTimezone}
                  placeholder="Select Time Zone"
                />
              </div>
            </div>

            {/* Distance Counter */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Distance Counter
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <SelectDropdown
                  value={distanceCounter}
                  options={DISTANCE_COUNTER_OPTIONS}
                  onChange={setDistanceCounter}
                  placeholder="Select Counter"
                />
              </div>
            </div>

            {/* Distance Variation */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Distance Variation
              </label>
              <div className="w-80 sm:w-96 max-w-md flex items-center gap-1.5">
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
                <span className="h-9 flex items-center px-2.5 rounded-md border border-input/80 bg-muted/30 text-muted-foreground font-bold text-xs shrink-0">
                  %
                </span>
              </div>
            </div>

            {/* Speed Detection */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Speed Detection
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <SelectDropdown
                  value={speedDetection}
                  options={SPEED_DETECTION_OPTIONS}
                  onChange={setSpeedDetection}
                  placeholder="Select Speed Detection"
                />
              </div>
            </div>

            {/* Primary Object */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Primary Object
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="h-4 w-4 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-foreground">Set as Primary Object</span>
                </label>
              </div>
            </div>

            {/* Ign based on Speed */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Ign based on Speed
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={ignBasedOnSpeed}
                    onChange={(e) => setIgnBasedOnSpeed(e.target.checked)}
                    className="h-4 w-4 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-foreground">Enable Ignition detection based on speed</span>
                </label>
              </div>
            </div>

            
          </div>
        )}

        {/* TAB 2: PROFILE (Horizontal Field-Beside-Value Layout) */}
        {activeTab === "Profile" && (
          <div className="space-y-3.5">
            {/* Plate Number */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Plate Number
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder="e.g. HP-08-BB-1026"
                  className="h-9 w-full rounded-md border border-input/80 bg-background px-3 font-mono text-xs text-foreground shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
                />
              </div>
            </div>

            {/* Object Type */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Object Type
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <SelectDropdown
                  value={objectType}
                  options={["Boom Barrier", "EV Van", "Tamper Beacon", "Utility Unit", "Hydraulic Crane", "Reefer Trailer", "Heavy Truck", "Sprinter Van", "Electric Truck", "Mining Dump Truck", "Fuel Tanker Truck", "Courier Van"]}
                  onChange={setObjectType}
                  placeholder="Select Object Type"
                />
              </div>
            </div>

            {/* Object Category */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Object Category
              </label>
              <div className="w-80 sm:w-96 max-w-md flex items-center gap-3">
                {(["Moveable", "Immovable"] as const).map((cat) => (
                  <label
                    key={cat}
                    onClick={() => setObjectCategory(cat)}
                    className={cn(
                      "flex-1 flex items-center gap-2 rounded-md border px-3 py-1.5 transition-all cursor-pointer select-none text-xs",
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

            {/* Color */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Color
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <SelectDropdown
                  value={color}
                  options={["White", "Black", "Blue", "Silver", "Red", "Yellow", "Orange", "Green", "Dark Blue"]}
                  onChange={setColor}
                  placeholder="Select Color"
                />
              </div>
            </div>

            {/* DVIR Template */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                DVIR Template
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <SelectDropdown
                  value={dvirTemplate}
                  options={["--Select--", "Heavy Commercial Daily DVIR", "Daily EV Inspection", "Standard Inspection", "Refrigerated Transport Check", "Heavy Plant Inspection"]}
                  onChange={setDvirTemplate}
                  placeholder="Select DVIR Template"
                />
              </div>
            </div>

            {/* Permit */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Permit
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <SelectDropdown
                  value={permit}
                  options={["--Select--", "National Commercial EV Permit", "Industrial Site Permit", "Special Utility Permit", "National Permit", "Interstate Heavy Haul", "Cold Chain Food Safety Permit", "Urban Delivery License", "Zero Emission Cargo Permit", "Hazardous Materials Transport"]}
                  onChange={setPermit}
                  placeholder="Select Permit"
                />
              </div>
            </div>

            {/* Manufacture Date */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Manufacture Date
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <input
                  type="date"
                  value={manufactureDate}
                  onChange={(e) => setManufactureDate(e.target.value)}
                  className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
                />
              </div>
            </div>

            {/* Purchase Date */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Purchase Date
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
                />
              </div>
            </div>

            {/* Purchase Amount ($) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Purchase Amount ($)
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <input
                  type="text"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  placeholder="e.g. 65,000"
                  className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
                />
              </div>
            </div>

            {/* Weight Capacity */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Weight Capacity
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <input
                  type="text"
                  value={weightCapacity}
                  onChange={(e) => setWeightCapacity(e.target.value)}
                  placeholder="e.g. 3.5 Tons"
                  className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
                />
              </div>
            </div>

            {/* Warranty (Years) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Warranty (Years)
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <input
                  type="text"
                  value={warrantyYears}
                  onChange={(e) => setWarrantyYears(e.target.value)}
                  placeholder="e.g. 5"
                  className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
                />
              </div>
            </div>

            {/* Fuel Type */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Fuel Type
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <SelectDropdown
                  value={fuelType}
                  options={["Diesel", "Petrol", "EV / Electric", "Electric", "GAS (CNG / LPG)", "Battery", "Diesel + Reefer"]}
                  onChange={setFuelType}
                  placeholder="Select Fuel Type"
                />
              </div>
            </div>

            {/* Battery Voltage */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Battery Voltage
              </label>
              <div className="w-80 sm:w-96 max-w-md">
                <SelectDropdown
                  value={batteryVoltage}
                  options={["12v", "24v", "48v", "3.7v Internal"]}
                  onChange={setBatteryVoltage}
                  placeholder="Select Battery Voltage"
                />
              </div>
            </div>

            {/* Distance based Fuel */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Distance based Fuel
              </label>
              <div className="w-80 sm:w-96 max-w-md flex items-center gap-1.5">
                <input
                  type="text"
                  value={distanceFuelConsumption}
                  onChange={(e) => setDistanceFuelConsumption(e.target.value)}
                  placeholder="18.5"
                  className="h-9 flex-1 rounded-md border border-input/80 bg-background px-3 text-xs text-foreground shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
                />
                <span className="text-[11px] text-muted-foreground font-semibold shrink-0">Km/L</span>
              </div>
            </div>

            {/* Duration based Fuel */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
              <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
                Duration based Fuel
              </label>
              <div className="w-80 sm:w-96 max-w-md flex items-center gap-1.5">
                <input
                  type="text"
                  value={durationFuelConsumption}
                  onChange={(e) => setDurationFuelConsumption(e.target.value)}
                  placeholder="1.2"
                  className="h-9 flex-1 rounded-md border border-input/80 bg-background px-3 text-xs text-foreground shadow-2xs focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
                />
                <span className="text-[11px] text-muted-foreground font-semibold shrink-0">L/hr</span>
              </div>
            </div>

            
          </div>
        )}

        {/* TAB 3: SENSORS */}
        {activeTab === "Sensors" && (
          <div className="space-y-4">
            {/* Top Action Bar */}
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                <span>Configured Hardware Sensor Inputs</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0089FF]/10 text-[#0089FF]">
                  {sensors.filter((s) => s.active).length} of {sensors.length} Active
                </span>
              </h4>

              <button
                type="button"
                onClick={() => setAddSensorModalOpen(true)}
                className="inline-flex h-8.5 items-center gap-1.5 rounded-lg bg-[#0089FF] hover:bg-[#0070d6] px-4 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Sensor</span>
              </button>
            </div>

            {/* Data Table */}
            <div className="border border-border/80 rounded-xl overflow-hidden shadow-2xs bg-card">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EAF0F6] dark:bg-slate-800 border-b border-[#DFE3EB] dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold uppercase text-[11px] tracking-wide">
                  <tr>
                    <th className="py-3 px-4 w-20 text-center">Active</th>
                    <th className="py-3 px-4 w-52">Connection Type</th>
                    <th className="py-3 px-4 min-w-[220px]">Connected Sensor</th>
                    <th className="py-3 px-4 w-44">Reading Type</th>
                    <th className="py-3 px-4 text-center w-48">Work Hour Calc</th>
                    <th className="py-3 px-4 text-center w-32">Calibration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-background font-medium">
                  {sensors.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={s.active}
                          onChange={() => toggleSensorActive(s.id)}
                          className="h-4 w-4 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
                        />
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-foreground">
                        {s.connectionType}
                      </td>
                      <td className="py-2.5 px-4">
                        <input
                          type="text"
                          value={s.connectedSensor}
                          onChange={(e) => updateSensorField(s.id, "connectedSensor", e.target.value)}
                          placeholder="e.g. Fuel Sensor / SOS Panic"
                          className="h-8 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 shadow-2xs focus:border-[#0089FF] focus:ring-1 focus:ring-[#0089FF] focus:outline-none"
                        />
                      </td>
                      <td className="py-2.5 px-4">
                        <SelectDropdown
                          value={s.readingType}
                          options={["Direct", "Inverse"]}
                          onChange={(val) => updateSensorField(s.id, "readingType", val)}
                        />
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={s.workHourCalculation}
                          onChange={() => toggleWorkHour(s.id)}
                          className="h-4 w-4 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
                        />
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        {s.hasCalibration ? (
                          <button
                            type="button"
                            onClick={() => openCalibration(s)}
                            className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-[#0089FF] hover:bg-blue-100 border border-blue-200 dark:border-blue-900 transition-colors cursor-pointer"
                          >
                            Calibrate
                          </button>
                        ) : (
                          <span className="text-muted-foreground text-[11px]">--</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            
          </div>
        )}

        {/* TAB 4: DOCUMENTS */}
        {activeTab === "Document" && (
          <div className="space-y-4">
            {/* Top Action Bar */}
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                <span>Vehicle Compliance & Registration Documents</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0089FF]/10 text-[#0089FF]">
                  {documents.length} Files Attached
                </span>
              </h4>

              {documents.length > 0 && (
                <button
                  type="button"
                  onClick={() => setDocUploadModalOpen(true)}
                  className="inline-flex h-8.5 items-center gap-1.5 rounded-lg bg-[#0089FF] hover:bg-[#0070d6] px-4 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer active:scale-98"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Document</span>
                </button>
              )}
            </div>

            {/* Documents Table */}
            <div className="border border-border/80 rounded-xl overflow-hidden shadow-2xs bg-card">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EAF0F6] dark:bg-slate-800 border-b border-[#DFE3EB] dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold uppercase text-[11px] tracking-wide">
                  <tr>
                    <th className="py-3 px-4 min-w-[240px]">Document Title</th>
                    <th className="py-3 px-4 w-52">Category</th>
                    <th className="py-3 px-4 w-44">Doc # / ID</th>
                    <th className="py-3 px-4 w-36">Issue Date</th>
                    <th className="py-3 px-4 w-36">Expiry Date</th>
                    <th className="py-3 px-4 w-36 text-center">Status</th>
                    <th className="py-3 px-4 text-right w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-background font-medium">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <p className="text-foreground font-semibold text-xs">{doc.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{doc.fileName} • {doc.fileSize}</p>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground font-medium">
                        {doc.type}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-foreground">
                        {doc.docNumber}
                      </td>
                      <td className="py-3 px-4 font-mono text-muted-foreground">
                        {doc.issueDate}
                      </td>
                      <td className="py-3 px-4 font-mono text-foreground font-bold">
                        {doc.expiryDate}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={cn(
                            "inline-flex items-center justify-center px-2.5 py-0.5 text-[10px] font-bold rounded-full border",
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
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => toast.success(`Downloaded ${doc.fileName}`)}
                            className="p-1.5 rounded-md text-muted-foreground hover:text-[#0089FF] hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
                            className="p-1.5 rounded-md text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
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
                      <td colSpan={7} className="py-14 text-center text-xs text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-[#0089FF]">
                            <FileText className="h-6 w-6" />
                          </div>
                          <span className="font-semibold text-foreground text-sm">No documents attached yet</span>
                          <span className="text-xs text-muted-foreground max-w-sm">
                            Upload digital copies of vehicle registration, insurance policies, emission certificates, and road permits.
                          </span>
                          <button
                            type="button"
                            onClick={() => setDocUploadModalOpen(true)}
                            className="mt-2 inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#0089FF] hover:bg-[#0070d6] px-4 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer"
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

      {/* Horizontal divider with 20px space from left and right */}
      <div className="mx-5 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0" />

      {/* Standard Bottom Footer Frame with Action Buttons */}
      <footer className="flex h-12 items-center justify-start gap-2.5 px-5 bg-white dark:bg-slate-900 shrink-0 select-none">
        <button
          type="button"
          onClick={handleResetForm}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-background px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-[#0089FF]/40 transition-all cursor-pointer shadow-2xs active:scale-98"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
          <span>Reset</span>
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer active:scale-98"
        >
          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Save</span>
        </button>
      </footer>

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
    </div>
  );
}

/* =========================================================================
   Compatibility Wrapper for VehicleDetailModal
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
  if (!open) return null;
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[94vw] max-w-[1180px] h-[88vh] max-h-[88vh] p-0 gap-0 overflow-hidden rounded-2xl border border-border bg-background shadow-2xl flex flex-col">
        <VehicleDetailFormView vehicle={vehicle} onSave={onSave} onCancel={onClose} />
      </DialogContent>
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
   QR Code Batch Modal (Matching reference media_1789455937719.png)
   ========================================================================= */
export function QrCodeBatchModal({
  open,
  onClose,
  allVehicles,
}: {
  open: boolean;
  onClose: () => void;
  allVehicles: VehicleItem[];
}) {
  const [action, setAction] = useState<"Download" | "Email" | "Both">("Both");
  const [email, setEmail] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("All");
  const [fileFormat, setFileFormat] = useState<"PDF" | "JPG" | "JPEG">("PDF");
  const [sortBy, setSortBy] = useState("Vehicle Name");
  const [sortOrder, setSortOrder] = useState("Ascending");

  const handleDownload = () => {
    if ((action === "Email" || action === "Both") && !email.trim()) {
      toast.error("Please enter email recipient address");
      return;
    }
    toast.success(`Generated QR Codes in ${fileFormat} format`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden rounded-xl border border-[#DFE3EB] dark:border-slate-800 bg-background shadow-2xl flex flex-col select-none">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DFE3EB] dark:border-slate-800 bg-background select-none">
          <DialogTitle className="text-[16px] font-bold text-[#1D3B7A] dark:text-blue-400">
            QR Code
          </DialogTitle>
          <DialogDescription className="sr-only">
            Generate and export vehicle QR codes
          </DialogDescription>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {/* Action Radio */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">Action :</label>
            <div className="flex items-center gap-6">
              {(["Download", "Email", "Both"] as const).map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
                  <input
                    type="radio"
                    name="qrAction"
                    checked={action === opt}
                    onChange={() => setAction(opt)}
                    className="accent-[#0089FF] h-4 w-4 cursor-pointer"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Email input (visible if Email or Both) */}
          {(action === "Email" || action === "Both") && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">Email :</label>
              <textarea
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email addresses..."
                rows={2}
                className="w-full rounded-md border border-input/80 bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
              />
            </div>
          )}

          {/* Vehicle Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">Vehicle :</label>
            <SelectDropdown
              value={selectedVehicle}
              options={["All", ...allVehicles.map((v) => v.name)]}
              onChange={setSelectedVehicle}
              placeholder="Select Some Options"
            />
          </div>

          {/* File Format Radio */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">File Format :</label>
            <div className="flex items-center gap-6">
              {(["PDF", "JPG", "JPEG"] as const).map((fmt) => (
                <label key={fmt} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
                  <input
                    type="radio"
                    name="fileFormat"
                    checked={fileFormat === fmt}
                    onChange={() => setFileFormat(fmt)}
                    className="accent-[#0089FF] h-4 w-4 cursor-pointer"
                  />
                  <span>{fmt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort By & Sort Order */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">Sort by :</label>
              <SelectDropdown
                value={sortBy}
                options={["Vehicle Name", "Company", "Branch", "IMEI Number", "Created Date"]}
                onChange={setSortBy}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">Sort Order :</label>
              <SelectDropdown
                value={sortOrder}
                options={["Ascending", "Descending"]}
                onChange={setSortOrder}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-3.5 border-t border-[#DFE3EB] dark:border-slate-800 bg-muted/20">
          <button
            type="button"
            onClick={onClose}
            className="h-8 rounded-md border border-input/80 bg-background px-4 text-xs font-semibold text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer active:scale-98"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================================
   Bulk Maintenance Modal (Matching reference media_1789455943886.png)
   ========================================================================= */
export function BulkMaintenanceModal({
  open,
  onClose,
  allVehicles,
}: {
  open: boolean;
  onClose: () => void;
  allVehicles: VehicleItem[];
}) {
  const [mode, setMode] = useState<"Maintenance" | "Recovery">("Maintenance");
  const [company, setCompany] = useState("HP Company");
  const [branch, setBranch] = useState("HP Branch 8");
  const [object, setObject] = useState("All");
  const [maintenanceFor, setMaintenanceFor] = useState("Accident");
  const [maintenanceDate, setMaintenanceDate] = useState("2026-09-15");
  const [recoveryDate, setRecoveryDate] = useState("2026-09-22");
  const [remarks, setRemarks] = useState("");

  const handleSave = () => {
    toast.success(`Maintenance record saved for ${object === "All" ? `${company} fleet` : object}`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden rounded-xl border border-[#DFE3EB] dark:border-slate-800 bg-background shadow-2xl flex flex-col select-none">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DFE3EB] dark:border-slate-800 bg-background select-none">
          <DialogTitle className="text-[16px] font-bold text-[#1D3B7A] dark:text-blue-400">
            Maintenance / Recovery
          </DialogTitle>
          <DialogDescription className="sr-only">
            Schedule bulk vehicle maintenance and recovery
          </DialogDescription>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {/* Mode */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">Mode :</label>
            <div className="flex items-center gap-6">
              {(["Maintenance", "Recovery"] as const).map((m) => (
                <label key={m} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
                  <input
                    type="radio"
                    name="maintMode"
                    checked={mode === m}
                    onChange={() => setMode(m)}
                    className="accent-[#0089FF] h-4 w-4 cursor-pointer"
                  />
                  <span>{m}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Company & Branch */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Company <span className="text-rose-500">*</span> :
              </label>
              <SelectDropdown
                value={company}
                options={["HP Company", "Global Logistics Inc", "Fleet Cargo West", "FastTrack Mobility"]}
                onChange={setCompany}
                placeholder="Select Company"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Branch <span className="text-rose-500">*</span> :
              </label>
              <SelectDropdown
                value={branch}
                options={["HP Branch 8", "HP EV Branch 2", "Central Branch", "North Terminal", "West Hub", "South Depot"]}
                onChange={setBranch}
                placeholder="Select Branch"
              />
            </div>
          </div>

          {/* Object */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Object <span className="text-rose-500">*</span> :
            </label>
            <SelectDropdown
              value={object}
              options={["All", ...allVehicles.filter(v => v.company === company).map(v => v.name)]}
              onChange={setObject}
              placeholder="Search Object"
            />
          </div>

          {/* Maintenance For */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Maintenance For <span className="text-rose-500">*</span> :
            </label>
            <SelectDropdown
              value={maintenanceFor}
              options={[
                "Accident",
                "Routine Service",
                "Engine Overhaul",
                "Tire Replacement",
                "Brake Overhaul",
                "Battery Maintenance",
                "Scheduled Inspection",
                "Breakdown Repair",
              ]}
              onChange={setMaintenanceFor}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Maintenance Date <span className="text-rose-500">*</span> :
              </label>
              <input
                type="date"
                value={maintenanceDate}
                onChange={(e) => setMaintenanceDate(e.target.value)}
                className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Estimated Recovery Date <span className="text-rose-500">*</span> :
              </label>
              <input
                type="date"
                value={recoveryDate}
                onChange={(e) => setRecoveryDate(e.target.value)}
                className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">Remarks :</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter maintenance notes, garage contact, replacement parts..."
              rows={2}
              className="w-full rounded-md border border-input/80 bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-3.5 border-t border-[#DFE3EB] dark:border-slate-800 bg-muted/20">
          <button
            type="button"
            onClick={onClose}
            className="h-8 rounded-md border border-input/80 bg-background px-4 text-xs font-semibold text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer active:scale-98"
          >
            <Wrench className="h-3.5 w-3.5" />
            <span>Save Record</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================================
   Bulk Update Modal (Matching reference media_1789455950099.png)
   ========================================================================= */
export function BulkUpdateModal({
  open,
  onClose,
  allVehicles,
}: {
  open: boolean;
  onClose: () => void;
  allVehicles: VehicleItem[];
}) {
  const [company, setCompany] = useState("HP Company");
  const [branch, setBranch] = useState("All");
  const [vehicle, setVehicle] = useState("All");
  const [fileName, setFileName] = useState("object_update_sheet.xlsx");

  const handleUploadUpdate = () => {
    toast.success(`Bulk updated objects for ${company} (${branch})`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden rounded-xl border border-[#DFE3EB] dark:border-slate-800 bg-background shadow-2xl flex flex-col select-none">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DFE3EB] dark:border-slate-800 bg-background select-none">
          <DialogTitle className="text-[16px] font-bold text-[#1D3B7A] dark:text-blue-400">
            Object Bulk Update
          </DialogTitle>
          <DialogDescription className="sr-only">
            Update multiple vehicle telemetry configurations via spreadsheet upload
          </DialogDescription>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Company <span className="text-rose-500">*</span> :
              </label>
              <SelectDropdown
                value={company}
                options={["HP Company", "Global Logistics Inc", "Fleet Cargo West", "FastTrack Mobility"]}
                onChange={setCompany}
                placeholder="Select Company"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Branch <span className="text-rose-500">*</span> :
              </label>
              <SelectDropdown
                value={branch}
                options={["All", "HP Branch 8", "HP EV Branch 2", "Central Branch", "North Terminal", "West Hub", "South Depot"]}
                onChange={setBranch}
                placeholder="Select Branch"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">Vehicle :</label>
            <SelectDropdown
              value={vehicle}
              options={["All", ...allVehicles.map(v => v.name)]}
              onChange={setVehicle}
              placeholder="Select Vehicle / Object"
            />
          </div>

          {/* Upload File */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Upload File <span className="text-rose-500">*</span> :
            </label>
            <div className="border-2 border-dashed border-[#DFE3EB] dark:border-slate-700 rounded-lg p-5 text-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
              <Upload className="mx-auto h-7 w-7 text-[#0089FF] mb-1.5" />
              <p className="text-xs font-semibold text-foreground">
                Choose File or drag and drop spreadsheet (.xlsx, .csv)
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Current file: <span className="font-mono font-semibold text-[#0089FF]">{fileName}</span> (24.5 KB)
              </p>
            </div>
            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={() => toast.success("Sample template downloaded: bulk_update_sample.xlsx")}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0089FF] hover:underline cursor-pointer"
              >
                <Download className="h-3 w-3" />
                <span>Download Sample File</span>
              </button>
              <span className="text-[10px] text-muted-foreground">Supported: .XLSX, .CSV</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-3.5 border-t border-[#DFE3EB] dark:border-slate-800 bg-muted/20">
          <button
            type="button"
            onClick={onClose}
            className="h-8 rounded-md border border-input/80 bg-background px-4 text-xs font-semibold text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUploadUpdate}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer active:scale-98"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Upload & Update</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================================
   Bulk Object Insert Modal
   ========================================================================= */
export function BulkInsertModal({
  open,
  onClose,
  onInsertSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onInsertSuccess: (count: number) => void;
}) {
  const [reseller, setReseller] = useState("HP Reseller");
  const [company, setCompany] = useState("HP Company");
  const [branch, setBranch] = useState("HP Branch 8");
  const [deviceType, setDeviceType] = useState("HP HttpPool Advance-HP HttpPool Service");
  const [fileName, setFileName] = useState("new_objects_template.xlsx");

  const handleUploadInsert = () => {
    onInsertSuccess(12);
    toast.success("Successfully imported 12 new vehicles / objects");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden rounded-xl border border-[#DFE3EB] dark:border-slate-800 bg-background shadow-2xl flex flex-col select-none">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DFE3EB] dark:border-slate-800 bg-background select-none">
          <DialogTitle className="text-[16px] font-bold text-[#1D3B7A] dark:text-blue-400">
            Bulk Object Insert
          </DialogTitle>
          <DialogDescription className="sr-only">
            Import new vehicles and objects into the fleet via spreadsheet
          </DialogDescription>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Company <span className="text-rose-500">*</span> :
              </label>
              <SelectDropdown
                value={company}
                options={["HP Company", "Global Logistics Inc", "Fleet Cargo West", "FastTrack Mobility"]}
                onChange={setCompany}
                placeholder="Select Company"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Branch <span className="text-rose-500">*</span> :
              </label>
              <SelectDropdown
                value={branch}
                options={["HP Branch 8", "HP EV Branch 2", "Central Branch", "North Terminal", "West Hub", "South Depot"]}
                onChange={setBranch}
                placeholder="Select Branch"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              GPS Device Type <span className="text-rose-500">*</span> :
            </label>
            <SelectDropdown
              value={deviceType}
              options={DEVICE_TYPE_OPTIONS}
              onChange={setDeviceType}
              placeholder="Select Device Type"
            />
          </div>

          {/* Upload File */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Upload File <span className="text-rose-500">*</span> :
            </label>
            <div className="border-2 border-dashed border-[#DFE3EB] dark:border-slate-700 rounded-lg p-5 text-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
              <Upload className="mx-auto h-7 w-7 text-[#0089FF] mb-1.5" />
              <p className="text-xs font-semibold text-foreground">
                Choose File or drag and drop spreadsheet (.xlsx, .csv)
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Current file: <span className="font-mono font-semibold text-[#0089FF]">{fileName}</span> (32.1 KB)
              </p>
            </div>
            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={() => toast.success("Sample template downloaded: bulk_insert_sample.xlsx")}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0089FF] hover:underline cursor-pointer"
              >
                <Download className="h-3 w-3" />
                <span>Download Sample File</span>
              </button>
              <span className="text-[10px] text-muted-foreground">Headers: Name, IMEI, SIM, Type, Plate</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-3.5 border-t border-[#DFE3EB] dark:border-slate-800 bg-muted/20">
          <button
            type="button"
            onClick={onClose}
            className="h-8 rounded-md border border-input/80 bg-background px-4 text-xs font-semibold text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUploadInsert}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer active:scale-98"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Upload & Insert</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================================
   Bulk Delete Modal
   ========================================================================= */
export function BulkDeleteModal({
  open,
  onClose,
  allVehicles,
  onDeleteSuccess,
}: {
  open: boolean;
  onClose: () => void;
  allVehicles: VehicleItem[];
  onDeleteSuccess: (deletedIds: string[]) => void;
}) {
  const [company, setCompany] = useState("All");
  const [branch, setBranch] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [reason, setReason] = useState("Decommissioned");

  const availableVehicles = useMemo(() => {
    return allVehicles.filter(
      (v) =>
        (company === "All" || v.company === company) &&
        (branch === "All" || v.branch === branch)
    );
  }, [allVehicles, company, branch]);

  const displayedVehicles = useMemo(() => {
    if (!searchTerm.trim()) return availableVehicles;
    const q = searchTerm.toLowerCase();
    return availableVehicles.filter(
      (v) => v.name.toLowerCase().includes(q) || v.imei.toLowerCase().includes(q)
    );
  }, [availableVehicles, searchTerm]);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === availableVehicles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(availableVehicles.map((v) => v.id));
    }
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one vehicle to delete");
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to permanently delete ${selectedIds.length} vehicles?`
      )
    ) {
      onDeleteSuccess(selectedIds);
      toast.success(`Successfully deleted ${selectedIds.length} vehicles`);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] p-0 gap-0 overflow-hidden rounded-xl border border-[#DFE3EB] dark:border-slate-800 bg-background shadow-2xl flex flex-col select-none">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DFE3EB] dark:border-slate-800 bg-background select-none">
          <DialogTitle className="text-[16px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            <span>Bulk Delete Objects</span>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Select and delete multiple vehicle objects in bulk
          </DialogDescription>
        </div>

        <div className="p-6 space-y-4 text-xs overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">Company :</label>
              <SelectDropdown
                value={company}
                options={["All", "HP Company", "Global Logistics Inc", "Fleet Cargo West", "FastTrack Mobility"]}
                onChange={(c) => {
                  setCompany(c);
                  setSelectedIds([]);
                }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">Branch :</label>
              <SelectDropdown
                value={branch}
                options={["All", "HP Branch 8", "HP EV Branch 2", "Central Branch", "North Terminal", "West Hub", "South Depot"]}
                onChange={(b) => {
                  setBranch(b);
                  setSelectedIds([]);
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Select Objects to Delete ({selectedIds.length} / {availableVehicles.length} selected)
              </label>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[11px] font-semibold text-[#0089FF] hover:underline cursor-pointer"
              >
                {selectedIds.length === availableVehicles.length ? "Deselect All" : "Select All"}
              </button>
            </div>

            <div className="rounded-lg border border-input/80 bg-background overflow-hidden shadow-2xs">
              <div className="flex items-center px-3 py-2 border-b border-border/60 bg-muted/20">
                <Search className="h-3.5 w-3.5 text-muted-foreground mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search vehicles to delete..."
                  className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
              </div>

              <div className="max-h-48 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {displayedVehicles.map((v) => {
                  const isChecked = selectedIds.includes(v.id);
                  return (
                    <label
                      key={v.id}
                      onClick={() => handleToggle(v.id)}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors text-xs select-none",
                        isChecked
                          ? "bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 font-semibold"
                          : "hover:bg-muted/60 border border-transparent text-muted-foreground hover:text-foreground font-medium",
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="h-4 w-4 rounded border-input text-rose-600 accent-rose-600 cursor-pointer shrink-0"
                        />
                        <div className="truncate">
                          <span className="text-foreground font-medium truncate block">{v.name}</span>
                          <span className="text-[11px] text-muted-foreground font-mono truncate block">
                            IMEI: {v.imei} • {v.branch}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border text-slate-700 dark:text-slate-300 shrink-0">
                        {v.company}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">Reason for Deletion :</label>
            <SelectDropdown
              value={reason}
              options={["Decommissioned", "Lease Expired", "Duplicate Record", "Transferred to Another Company", "Retired Fleet"]}
              onChange={setReason}
            />
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-rose-200/80 bg-rose-50/70 dark:border-rose-900/60 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200">
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-semibold text-rose-700 dark:text-rose-300">Warning:</span> Bulk deletion permanently removes the selected objects, associated sensors, and alert triggers.
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-3.5 border-t border-[#DFE3EB] dark:border-slate-800 bg-muted/20">
          <button
            type="button"
            onClick={onClose}
            className="h-8 rounded-md border border-input/80 bg-background px-4 text-xs font-semibold text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={selectedIds.length === 0}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-rose-600 hover:bg-rose-700 disabled:opacity-50 px-5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed active:scale-98"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Selected ({selectedIds.length})</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

