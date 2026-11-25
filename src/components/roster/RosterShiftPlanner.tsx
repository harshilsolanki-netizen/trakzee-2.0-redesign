import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Bus,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface EmployeeRoster {
  id: string;
  name: string;
  department: string;
  shift: "Morning (07:00 - 15:30)" | "General (09:00 - 18:00)" | "Night (22:00 - 06:30)";
  pickupLocation: string;
  assignedRoute: string;
  assignedVehicle: string;
  status: "Confirmed" | "Pending" | "On-Leave";
}

const INITIAL_ROSTER: EmployeeRoster[] = [
  {
    id: "EMP-101",
    name: "Aarav Sharma",
    department: "Engineering",
    shift: "Morning (07:00 - 15:30)",
    pickupLocation: "Central Fleet Depot, Gate 1",
    assignedRoute: "Morning Shift Pickup - Route 1",
    assignedVehicle: "MH-12-RN-4821 (Force Traveler)",
    status: "Confirmed",
  },
  {
    id: "EMP-102",
    name: "Pooja Patel",
    department: "Operations",
    shift: "Morning (07:00 - 15:30)",
    pickupLocation: "Metro Station Hub, East Exit",
    assignedRoute: "Morning Shift Pickup - Route 1",
    assignedVehicle: "MH-12-RN-4821 (Force Traveler)",
    status: "Confirmed",
  },
  {
    id: "EMP-103",
    name: "Vikram Malhotra",
    department: "Finance",
    shift: "Morning (07:00 - 15:30)",
    pickupLocation: "Corporate Tech Park, Tower B",
    assignedRoute: "Morning Shift Pickup - Route 1",
    assignedVehicle: "MH-12-RN-4821 (Force Traveler)",
    status: "Confirmed",
  },
  {
    id: "EMP-104",
    name: "Neha Joshi",
    department: "Customer Support",
    shift: "General (09:00 - 18:00)",
    pickupLocation: "Kanjurmarg West Crossing",
    assignedRoute: "General Shift Express - Route 3",
    assignedVehicle: "MH-04-AB-1290 (Tata Winger)",
    status: "Pending",
  },
  {
    id: "EMP-105",
    name: "Rohan Varma",
    department: "Logistics",
    shift: "General (09:00 - 18:00)",
    pickupLocation: "Powai Lake Junction",
    assignedRoute: "General Shift Express - Route 3",
    assignedVehicle: "MH-04-AB-1290 (Tata Winger)",
    status: "Confirmed",
  },
  {
    id: "EMP-106",
    name: "Simran Kaur",
    department: "Quality Assurance",
    shift: "Night (22:00 - 06:30)",
    pickupLocation: "Thane Station West",
    assignedRoute: "Night Shuttle Security - Route 5",
    assignedVehicle: "MH-43-CC-9901 (Eicher Skyline)",
    status: "Confirmed",
  },
  {
    id: "EMP-107",
    name: "Amit Desai",
    department: "IT Infrastructure",
    shift: "Night (22:00 - 06:30)",
    pickupLocation: "Mulund Toll Plaza",
    assignedRoute: "Night Shuttle Security - Route 5",
    assignedVehicle: "MH-43-CC-9901 (Eicher Skyline)",
    status: "On-Leave",
  },
];

const SHIFT_TABS = [
  { id: "all", label: "All Shifts", count: 7 },
  { id: "morning", label: "Morning (07:00)", count: 3 },
  { id: "general", label: "General (09:00)", count: 2 },
  { id: "night", label: "Night (22:00)", count: 2 },
];

export function RosterShiftPlanner() {
  const [rosterList, setRosterList] = useState<EmployeeRoster[]>(INITIAL_ROSTER);
  const [selectedShiftTab, setSelectedShiftTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("2026-11-23");

  const filteredRoster = rosterList.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.assignedRoute.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedShiftTab === "morning") return emp.shift.startsWith("Morning");
    if (selectedShiftTab === "general") return emp.shift.startsWith("General");
    if (selectedShiftTab === "night") return emp.shift.startsWith("Night");
    return true;
  });

  const handleQuickAssign = (empId: string) => {
    setRosterList((prev) =>
      prev.map((item) =>
        item.id === empId
          ? { ...item, status: item.status === "Confirmed" ? "Pending" : "Confirmed" }
          : item
      )
    );
    toast.success("Roster status updated successfully");
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#F8FAFC] dark:bg-slate-950 p-4 gap-4 overflow-y-auto custom-scrollbar">
      {/* ── Top Metric Highlights ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <div className="bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Roster Employees
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {rosterList.length} <span className="text-xs font-normal text-slate-400">Scheduled</span>
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#0089FF] flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Active Shuttles & Vans
            </p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              3 <span className="text-xs font-normal text-slate-400">Vehicles on Route</span>
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <Bus className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Seat Capacity Utilization
            </p>
            <p className="text-xl font-bold text-[#0089FF] mt-0.5">
              88.4% <span className="text-xs font-normal text-slate-400">(42 / 48 Seats)</span>
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#0089FF] flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Roster Adherence Rate
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              95.2% <span className="text-xs font-normal text-emerald-500">▲ +2.1%</span>
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* ── Main Shift Management Table Card ── */}
      <div className="bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-xl shadow-xs flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Card Toolbar */}
        <div className="p-3.5 border-b border-[#DFE3EB] dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 bg-slate-50/50 dark:bg-slate-850">
          {/* Shift Filter Tabs */}
          <div className="inline-flex rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5 shadow-2xs">
            {SHIFT_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedShiftTab(tab.id)}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5",
                  selectedShiftTab === tab.id
                    ? "bg-[#0089FF] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full",
                    selectedShiftTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-500"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-56">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search employee, route, pickup..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-full rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-2.5 text-xs text-foreground placeholder:text-slate-400 focus:border-[#0089FF] focus:outline-none shadow-2xs font-medium"
              />
            </div>

            <button
              type="button"
              onClick={() => toast.info("Opening New Shift Roster Wizard")}
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-3 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Add Roster Entry</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
          <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
            <thead>
              <tr className="border-b border-[#DFE3EB] dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold text-slate-600 dark:text-slate-300 select-none sticky top-0 z-10">
                <th className="py-2.5 px-3.5 w-24">Emp ID</th>
                <th className="py-2.5 px-3.5">Employee Name</th>
                <th className="py-2.5 px-3.5">Department</th>
                <th className="py-2.5 px-3.5">Shift Window</th>
                <th className="py-2.5 px-3.5">Pickup Location</th>
                <th className="py-2.5 px-3.5">Assigned Route</th>
                <th className="py-2.5 px-3.5">Vehicle</th>
                <th className="py-2.5 px-3.5 w-28 text-center">Status</th>
                <th className="py-2.5 px-3.5 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFE3EB]/70 dark:divide-slate-800/70 font-medium text-slate-700 dark:text-slate-300">
              {filteredRoster.map((emp) => (
                <tr
                  key={emp.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-2.5 px-3.5 font-mono text-[11px] text-slate-500 font-semibold">
                    {emp.id}
                  </td>
                  <td className="py-2.5 px-3.5 font-bold text-slate-900 dark:text-white">
                    {emp.name}
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px]">
                      {emp.department}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-700 dark:text-slate-300 font-medium">
                    {emp.shift}
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[200px]">{emp.pickupLocation}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5 text-[#0089FF] font-medium">
                    {emp.assignedRoute}
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-300">
                    {emp.assignedVehicle}
                  </td>
                  <td className="py-2.5 px-3.5 text-center">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold",
                        emp.status === "Confirmed" &&
                          "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300",
                        emp.status === "Pending" &&
                          "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300",
                        emp.status === "On-Leave" &&
                          "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300"
                      )}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleQuickAssign(emp.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-md border border-[#DFE3EB] dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs"
                    >
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRoster.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-xs italic">
                    No roster entries match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
