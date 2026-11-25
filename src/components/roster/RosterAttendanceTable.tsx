import React, { useState } from "react";
import {
  UserCheck,
  QrCode,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BoardingLog {
  id: string;
  employeeName: string;
  empId: string;
  phone: string;
  assignedStop: string;
  scheduledTime: string;
  boardedTime: string | null;
  otpStatus: "Verified" | "Pending" | "Bypassed" | "No-Show";
  driverName: string;
  vehicleNo: string;
}

const INITIAL_BOARDING_LOGS: BoardingLog[] = [
  {
    id: "LOG-01",
    employeeName: "Aarav Sharma",
    empId: "EMP-101",
    phone: "+91 98201 12345",
    assignedStop: "Central Fleet Depot, Gate 1",
    scheduledTime: "12:00 PM",
    boardedTime: "11:58 AM",
    otpStatus: "Verified",
    driverName: "Ramesh Pawar",
    vehicleNo: "MH-12-RN-4821",
  },
  {
    id: "LOG-02",
    employeeName: "Pooja Patel",
    empId: "EMP-102",
    phone: "+91 98202 54321",
    assignedStop: "Metro Station Hub, East Exit",
    scheduledTime: "12:20 PM",
    boardedTime: "12:21 PM",
    otpStatus: "Verified",
    driverName: "Ramesh Pawar",
    vehicleNo: "MH-12-RN-4821",
  },
  {
    id: "LOG-03",
    employeeName: "Vikram Malhotra",
    empId: "EMP-103",
    phone: "+91 98203 77889",
    assignedStop: "Corporate Tech Park, Tower B",
    scheduledTime: "12:45 PM",
    boardedTime: null,
    otpStatus: "Pending",
    driverName: "Ramesh Pawar",
    vehicleNo: "MH-12-RN-4821",
  },
  {
    id: "LOG-04",
    employeeName: "Neha Joshi",
    empId: "EMP-104",
    phone: "+91 98204 99001",
    assignedStop: "Kanjurmarg West Crossing",
    scheduledTime: "08:15 AM",
    boardedTime: "08:14 AM",
    otpStatus: "Verified",
    driverName: "Sanjay Shinde",
    vehicleNo: "MH-04-AB-1290",
  },
  {
    id: "LOG-05",
    employeeName: "Amit Desai",
    empId: "EMP-107",
    phone: "+91 98207 44332",
    assignedStop: "Mulund Toll Plaza",
    scheduledTime: "09:30 PM",
    boardedTime: null,
    otpStatus: "No-Show",
    driverName: "Kishore Kumar",
    vehicleNo: "MH-43-CC-9901",
  },
];

export function RosterAttendanceTable() {
  const [logs, setLogs] = useState<BoardingLog[]>(INITIAL_BOARDING_LOGS);
  const [filterQuery, setFilterQuery] = useState("");

  const filtered = logs.filter(
    (l) =>
      l.employeeName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.empId.toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.vehicleNo.toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.assignedStop.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#F8FAFC] dark:bg-slate-950 p-4 gap-4 overflow-y-auto custom-scrollbar">
      <div className="bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-xl shadow-xs flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Header Toolbar */}
        <div className="p-3.5 border-b border-[#DFE3EB] dark:border-slate-800 flex items-center justify-between gap-3 shrink-0 bg-slate-50/50 dark:bg-slate-850">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Driver & Passenger Boarding Log
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live QR / OTP verification for shuttle boarding compliance
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative w-64">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search passenger, vehicle, stop..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="h-8 w-full rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-2.5 text-xs text-foreground placeholder:text-slate-400 focus:border-[#0089FF] focus:outline-none shadow-2xs font-medium"
              />
            </div>

            <button
              type="button"
              onClick={() => toast.success("Exported Boarding Logs to Excel")}
              className="inline-flex h-8 items-center gap-1.5 px-3 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
          <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
            <thead>
              <tr className="border-b border-[#DFE3EB] dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold text-slate-600 dark:text-slate-300 select-none sticky top-0 z-10">
                <th className="py-2.5 px-3.5 w-20">Log ID</th>
                <th className="py-2.5 px-3.5">Passenger</th>
                <th className="py-2.5 px-3.5">Assigned Stop</th>
                <th className="py-2.5 px-3.5 text-center">Scheduled</th>
                <th className="py-2.5 px-3.5 text-center">Boarded At</th>
                <th className="py-2.5 px-3.5 text-center">OTP / QR Verification</th>
                <th className="py-2.5 px-3.5">Driver</th>
                <th className="py-2.5 px-3.5">Vehicle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFE3EB]/70 dark:divide-slate-800/70 font-medium text-slate-700 dark:text-slate-300">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3.5 font-mono text-[11px] text-slate-500 font-semibold">
                    {log.id}
                  </td>
                  <td className="py-2.5 px-3.5">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {log.employeeName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {log.empId} • {log.phone}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-400">
                    {log.assignedStop}
                  </td>
                  <td className="py-2.5 px-3.5 text-center font-mono text-slate-600 dark:text-slate-300">
                    {log.scheduledTime}
                  </td>
                  <td className="py-2.5 px-3.5 text-center font-mono">
                    {log.boardedTime ? (
                      <span className="text-emerald-600 font-semibold">{log.boardedTime}</span>
                    ) : (
                      <span className="text-slate-400 italic">—</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3.5 text-center">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold",
                        log.otpStatus === "Verified" &&
                          "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300",
                        log.otpStatus === "Pending" &&
                          "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300",
                        log.otpStatus === "No-Show" &&
                          "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300"
                      )}
                    >
                      {log.otpStatus === "Verified" && <CheckCircle2 className="h-3 w-3" />}
                      {log.otpStatus === "No-Show" && <XCircle className="h-3 w-3" />}
                      {log.otpStatus === "Pending" && <Clock className="h-3 w-3" />}
                      <span>{log.otpStatus}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-700 dark:text-slate-300">
                    {log.driverName}
                  </td>
                  <td className="py-2.5 px-3.5 font-mono text-slate-600 dark:text-slate-300">
                    {log.vehicleNo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
