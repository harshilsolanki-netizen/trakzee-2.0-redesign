import React, { useState } from "react";
import {
  Copy,
  Check,
  Code2,
  FileCode,
  Layers,
  Sparkles,
  ArrowRight,
  FolderTree,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";

export function RosterCloneGuide() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCode = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    toast.success("Snippet copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const CLONE_CODE_SNIPPET = `// Method A: Direct Screen Reuse / Embedding (Recommended for 100% sync)
import { TripSchedulePage } from "@/components/setting/TripSchedulePage";
import { ShuttleConfigurationPage } from "@/components/setting/ShuttleConfigurationPage";

export function MyRosterScreen() {
  return (
    <div className="flex-1 h-full">
      {/* Simply render the existing screen directly */}
      <TripSchedulePage />
    </div>
  );
}`;

  const CUSTOM_CLONE_SNIPPET = `// Method B: Independent Cloned Screen (With Custom Roster Columns/Logic)
// 1. Duplicate: src/components/setting/TripSchedulePage.tsx
// 2. Paste to:  src/components/roster/RosterCustomTripPage.tsx
// 3. Customize state, labels, or add Roster specific fields:

import React, { useState } from "react";

export function RosterCustomTripPage() {
  // Add custom roster fields: shiftType, employeeRosterIds, department
  const [shiftFilter, setShiftFilter] = useState("Morning Shift");

  return (
    <div className="p-4">
      {/* Custom Roster Planning UI with cloned Leaflet Map */}
    </div>
  );
}`;

  const ROUTE_REGISTRATION_SNIPPET = `// Registering in TanStack Router:
// File: src/routes/roster-management.tsx
import { createFileRoute } from "@tanstack/react-router";
import { RosterManagementPage } from "@/components/roster/RosterManagementPage";

export const Route = createFileRoute("/roster-management")({
  component: RosterManagementPage,
});`;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#F8FAFC] dark:bg-slate-950 p-6 gap-6 overflow-y-auto custom-scrollbar">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md">
        <div className="flex items-center gap-2 text-blue-100 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="h-4 w-4" />
          <span>Developer Guide & Screen Architecture</span>
        </div>
        <h2 className="text-2xl font-bold">How to Clone Existing Screens & Create New Ones</h2>
        <p className="text-blue-100 text-sm mt-1 max-w-2xl leading-relaxed">
          Follow these 3 proven methods to clone existing Trakzee 2.0 screens (such as Trip Schedule,
          Shuttle Configuration, Tracking) or build brand new custom Roster Management screens.
        </p>
      </div>

      {/* Grid of 3 Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 shrink-0">
        {/* Method 1 */}
        <div className="bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#0089FF] flex items-center justify-center font-bold text-sm mb-3">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              Method A: Direct Embedding
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fastest method. If you want the Roster Management project to use the existing Trip Schedule
              or Shuttle Configuration screens with 100% feature parity, simply import and render them
              inside your Roster sub-tab.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <Check className="h-3.5 w-3.5" />
            <span>Zero duplicate code • Instant updates</span>
          </div>
        </div>

        {/* Method 2 */}
        <div className="bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold text-sm mb-3">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              Method B: Duplicate & Specialize
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Copy <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">TripSchedulePage.tsx</code> to{" "}
              <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">src/components/roster/RosterTripPage.tsx</code>.
              Then add roster-specific fields like shift IDs, employee department filters, and driver checklists.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-[#0089FF] flex items-center gap-1">
            <Layers className="h-3.5 w-3.5" />
            <span>Full customizability per project</span>
          </div>
        </div>

        {/* Method 3 */}
        <div className="bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="h-9 w-9 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold text-sm mb-3">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              Method C: Brand New Screen
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create a new component in <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">src/components/roster/MyScreen.tsx</code>{" "}
              using our unified Trakzee 2.0 shell: 10px frame padding, 24px title font, and card wrappers.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-purple-600 flex items-center gap-1">
            <FileCode className="h-3.5 w-3.5" />
            <span>Consistent design tokens</span>
          </div>
        </div>
      </div>

      {/* Code Snippets Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Code Snippets & Copyable Templates
        </h3>

        {/* Snippet 1 */}
        <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 text-slate-200">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs">
            <span className="font-mono text-slate-400">1. Reusing Cloned Screens (Method A)</span>
            <button
              type="button"
              onClick={() => copyCode(CLONE_CODE_SNIPPET, 1)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white cursor-pointer"
            >
              {copiedIndex === 1 ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedIndex === 1 ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono overflow-x-auto text-blue-300 custom-scrollbar leading-relaxed">
            {CLONE_CODE_SNIPPET}
          </pre>
        </div>

        {/* Snippet 2 */}
        <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 text-slate-200">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs">
            <span className="font-mono text-slate-400">2. Duplicating to a Specialized Screen (Method B)</span>
            <button
              type="button"
              onClick={() => copyCode(CUSTOM_CLONE_SNIPPET, 2)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white cursor-pointer"
            >
              {copiedIndex === 2 ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedIndex === 2 ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono overflow-x-auto text-emerald-300 custom-scrollbar leading-relaxed">
            {CUSTOM_CLONE_SNIPPET}
          </pre>
        </div>

        {/* Snippet 3 */}
        <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 text-slate-200">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs">
            <span className="font-mono text-slate-400">3. Route Registration in TanStack Router</span>
            <button
              type="button"
              onClick={() => copyCode(ROUTE_REGISTRATION_SNIPPET, 3)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white cursor-pointer"
            >
              {copiedIndex === 3 ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedIndex === 3 ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono overflow-x-auto text-amber-300 custom-scrollbar leading-relaxed">
            {ROUTE_REGISTRATION_SNIPPET}
          </pre>
        </div>
      </div>
    </div>
  );
}
