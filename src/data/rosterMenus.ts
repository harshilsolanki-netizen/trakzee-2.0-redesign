import type { ComponentType } from "react";
import {
  Activity,
  Route,
  Users,
  Sliders,
  Layers,
  Briefcase,
} from "lucide-react";

export interface RosterReportItem {
  id: string;
  name: string;
  category: string;
  to: string;
}

export interface RosterReportCategory {
  category: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  items: RosterReportItem[];
}

export const ROSTER_REPORT_CATEGORIES: RosterReportCategory[] = [
  {
    category: "activity",
    label: "Activity",
    icon: Activity,
    items: [
      { id: "travel", name: "Travel", category: "Activity", to: "/report?type=travel" },
      { id: "stoppage", name: "Stoppage", category: "Activity", to: "/report?type=stoppage" },
      { id: "idle", name: "Idle", category: "Activity", to: "/report?type=idle" },
      { id: "inactive", name: "Inactive", category: "Activity", to: "/report?type=inactive" },
    ],
  },
  {
    category: "trip",
    label: "Trip",
    icon: Route,
    items: [
      { id: "trip-summary", name: "Trip Summary", category: "Trip", to: "/report?type=trip-summary" },
      { id: "seat-utilization", name: "Seat Utilization", category: "Trip", to: "/report?type=seat-utilization" },
      { id: "on-time-arrival", name: "On Time Arrival", category: "Trip", to: "/report?type=on-time-arrival" },
      { id: "on-time-departure", name: "On Time Departure", category: "Trip", to: "/report?type=on-time-departure" },
      { id: "planned-trip-summary", name: "Planned Trip Summary", category: "Trip", to: "/report?type=planned-trip-summary" },
    ],
  },
  {
    category: "employee",
    label: "Employee",
    icon: Users,
    items: [
      { id: "employee-history", name: "Employee History", category: "Employee", to: "/report?type=employee-history" },
      { id: "vehicle-capacity-non-utilization", name: "Vehicle Capacity Non Utilization", category: "Employee", to: "/report?type=vehicle-capacity-non-utilization" },
    ],
  },
];

export const ALL_ROSTER_REPORTS = ROSTER_REPORT_CATEGORIES.flatMap((c) => c.items);

export interface RosterSettingItem {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  description: string;
  badge?: string;
  route?: string;
  subItems?: Array<{ id: string; name: string; route?: string }>;
}

export interface RosterSettingCategory {
  category: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  description: string;
  count?: number;
  items: RosterSettingItem[];
}

export const ROSTER_SETTING_CATEGORIES: RosterSettingCategory[] = [
  {
    category: "general",
    label: "General",
    icon: Sliders,
    description: "Core administration & access controls",
    items: [
      { id: "super_admin", name: "Super Admin", category: "general", categoryLabel: "General", description: "Super Admin privileges and platform policies" },
      { id: "admin", name: "Admin", category: "general", categoryLabel: "General", description: "Organization administrator access and user privileges" },
      { id: "reseller", name: "Reseller", category: "general", categoryLabel: "General", description: "Reseller account management and tier configuration" },
      { id: "vendor", name: "Vendor", category: "general", categoryLabel: "General", description: "Transport vendors, fleet owners & cab agencies" },
      { id: "company", name: "Company", category: "general", categoryLabel: "General", description: "Corporate entities, client branches & campus locations" },
      { id: "sub_users", name: "Sub Users", category: "general", categoryLabel: "General", description: "Department managers, schedulers & transport desk" },
      { id: "office", name: "Office", category: "general", categoryLabel: "General", description: "Office sites, pickup gates & employee drop points" },
      { id: "et_object", name: "ET Object", category: "general", categoryLabel: "General", description: "Employee transport fleet vehicles, cabs & tracking units" },
      { id: "driver", name: "Driver", category: "general", categoryLabel: "General", description: "Driver records, police verification, license & RFID tags" },
      { id: "alert", name: "Alert", category: "general", categoryLabel: "General", description: "SOS triggers, delay alerts, route deviations & speed limits" },
    ],
  },
  {
    category: "master",
    label: "Master",
    icon: Layers,
    description: "Roster operational masters, routes & vehicles",
    count: 10,
    items: [
      {
        id: "shift",
        name: "Shift",
        category: "master",
        categoryLabel: "Master",
        description: "Shift master timings, morning/general/night shift rosters",
        badge: "2",
        subItems: [
          { id: "shift_master", name: "Shift Master", route: "/roster-management" },
          { id: "shift_schedule", name: "Shift Schedule", route: "/roster-management" },
        ],
      },
      { id: "et_employee", name: "ET Employee", category: "master", categoryLabel: "Master", description: "Employee directory, pickup addresses, departments & passes" },
      {
        id: "shuttle",
        name: "Shuttle",
        category: "master",
        categoryLabel: "Master",
        description: "Shuttle fleet config, fixed routes & seat capacities",
        badge: "4",
        subItems: [
          { id: "shuttle_configuration", name: "Shuttle Configuration", route: "/setting?tab=shuttle_configuration" },
          { id: "shuttle_route", name: "Shuttle Route", route: "/setting?tab=shuttle_configuration" },
          { id: "shuttle_schedule", name: "Shuttle Schedule", route: "/setting?tab=shuttle_configuration" },
          { id: "shuttle_pass", name: "Shuttle Pass", route: "/setting?tab=shuttle_configuration" },
        ],
      },
      { id: "trip_planning", name: "Trip Planning", category: "master", categoryLabel: "Master", description: "Daily pickup & drop trip schedules, checkpoints & map routing", route: "/setting?tab=trip_planning" },
      { id: "address", name: "Address", category: "master", categoryLabel: "Master", description: "Geo-coded pickup locations, employee home points & hubs" },
      { id: "geofence", name: "Geofence", category: "master", categoryLabel: "Master", description: "Office perimeter geofences, depot zones & safe corridors" },
    ],
  },
  {
    category: "contract",
    label: "Contract",
    icon: Briefcase,
    description: "Vendor agreements, service tiers & billing contracts",
    items: [
      { id: "contract", name: "Contract", category: "contract", categoryLabel: "Contract", description: "Transport vendor SLA contracts, vehicle leasing & tariffs" },
    ],
  },
];

export const ALL_ROSTER_SETTINGS = ROSTER_SETTING_CATEGORIES.flatMap((c) => c.items);
