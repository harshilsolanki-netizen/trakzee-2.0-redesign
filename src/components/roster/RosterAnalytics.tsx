import React from "react";
import {
  TrendingUp,
  Percent,
  Bus,
  Users,
  ShieldCheck,
  AlertTriangle,
  Fuel,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export function RosterAnalytics() {
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#F8FAFC] dark:bg-slate-950 p-4 gap-4 overflow-y-auto custom-scrollbar">
      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5 shrink-0">
        <div className="bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Fleet Seat Occupancy</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-0.5" /> +4.2%
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">88.4%</span>
            <span className="text-xs text-slate-400">Target: 85%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-[#0089FF] h-full rounded-full" style={{ width: "88.4%" }} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">On-Time Pickup Rate</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-0.5" /> +1.8%
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">96.8%</span>
            <span className="text-xs text-slate-400">Tolerance: 5 min</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: "96.8%" }} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">No-Show / Absent Rate</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center">
              <ArrowDownRight className="h-3 w-3 mr-0.5" /> -0.8%
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">2.4%</span>
            <span className="text-xs text-slate-400">Industry avg: 5.1%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: "12%" }} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Route Mileage Savings</span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-0.5" /> ₹18,400
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">340 km</span>
            <span className="text-xs text-slate-400">This Month</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-[#0089FF] h-full rounded-full" style={{ width: "74%" }} />
          </div>
        </div>
      </div>

      {/* Route Efficiency Table */}
      <div className="bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-xl p-4 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Roster Route Performance Comparison
        </h4>
        <p className="text-xs text-slate-500 mb-3">
          Daily passenger shuttle metrics aggregated across active routes
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#DFE3EB] dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-2 px-3">Route Name</th>
                <th className="py-2 px-3 text-center">Allocated Vehicle</th>
                <th className="py-2 px-3 text-center">Roster Headcount</th>
                <th className="py-2 px-3 text-center">Capacity %</th>
                <th className="py-2 px-3 text-center">Avg Trip Duration</th>
                <th className="py-2 px-3 text-right">Route Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFE3EB]/60 dark:divide-slate-800/60 font-medium">
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                  Morning Shift Pickup - Route 1
                </td>
                <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-300">
                  Force Traveler (16 Seater)
                </td>
                <td className="py-3 px-3 text-center font-bold text-[#0089FF]">14 / 16</td>
                <td className="py-3 px-3 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                    87.5%
                  </span>
                </td>
                <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-300">
                  45 mins
                </td>
                <td className="py-3 px-3 text-right font-bold text-emerald-600">98.2%</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                  General Shift Express - Route 3
                </td>
                <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-300">
                  Tata Winger (12 Seater)
                </td>
                <td className="py-3 px-3 text-center font-bold text-[#0089FF]">11 / 12</td>
                <td className="py-3 px-3 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                    91.6%
                  </span>
                </td>
                <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-300">
                  38 mins
                </td>
                <td className="py-3 px-3 text-right font-bold text-emerald-600">95.4%</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                  Night Shuttle Security - Route 5
                </td>
                <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-300">
                  Eicher Skyline (20 Seater)
                </td>
                <td className="py-3 px-3 text-center font-bold text-[#0089FF]">17 / 20</td>
                <td className="py-3 px-3 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[11px]">
                    85.0%
                  </span>
                </td>
                <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-300">
                  52 mins
                </td>
                <td className="py-3 px-3 text-right font-bold text-emerald-600">94.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
