import React, { useState } from "react";
import { ChevronLeft, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { FleetObject } from "@/data/fleet";

export function AddVehiclePage({
  onBack,
  onSaveVehicle,
}: {
  onBack: () => void;
  onSaveVehicle: (newVehicle: FleetObject) => void;
}) {
  const [activeTab, setActiveTab] = useState<"general" | "profile" | "sensors" | "document">("general");

  const [form, setForm] = useState({
    reseller: "",
    company: "",
    branch: "",
    name: "",
    objectGroup: "",
    specification: "",
    unitOfDistance: "Kilometer",
    deviceType: "",
    serverAddress: "--",
    imei: "",
    deviceImei: "",
    satelliteImei: "",
    primarySim: "+62 812 3456",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setForm({
      reseller: "",
      company: "",
      branch: "",
      name: "",
      objectGroup: "",
      specification: "",
      unitOfDistance: "Kilometer",
      deviceType: "",
      serverAddress: "--",
      imei: "",
      deviceImei: "",
      satelliteImei: "",
      primarySim: "+62 812 3456",
    });
    toast.info("Form reset to default values");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Vehicle Name is required");
      return;
    }

    const newObj: FleetObject = {
      id: `veh-${Date.now()}`,
      name: form.name.trim(),
      branch: form.branch || "Company",
      imei: form.imei.trim() || `864201${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: "running",
      speed: 45,
      address: "Central Fleet Depot, Gate 1",
      lastUpdated: "Just now",
      ignition: true,
      gps: true,
      driver: "Assigned Driver",
      plateNumber: "GJ 01 AB 9999",
      battery: 98,
    };

    onSaveVehicle(newObj);
    toast.success("Vehicle Added Successfully!", {
      description: `${newObj.name} registered under ${newObj.branch}.`,
    });
    onBack();
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-slate-900 overflow-hidden select-none">
      {/* 1. Top Header with Back Button */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-slate-700 dark:text-slate-200 hover:text-[#0089FF] font-bold text-base transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* 2. Secondary Tab Strip (General, Profile, Sensors, Document) */}
      <div className="flex items-center gap-8 px-8 border-b border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold shrink-0">
        {[
          { id: "general", label: "General" },
          { id: "profile", label: "Profile" },
          { id: "sensors", label: "Sensors" },
          { id: "document", label: "Document" },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "py-3 transition-colors cursor-pointer relative",
                isActive
                  ? "text-[#0089FF] font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200",
              )}
            >
              <span>{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0089FF] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Main Form Body (Matching Image 2 layout) */}
      <div className="flex-1 overflow-y-auto p-8 max-w-3xl custom-scrollbar">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Reseller * */}
          <div className="grid grid-cols-12 items-center gap-4">
            <label className="col-span-3 text-slate-700 dark:text-slate-300 font-medium text-xs">
              Reseller <span className="text-rose-500">*</span>
            </label>
            <div className="col-span-9">
              <select
                value={form.reseller}
                onChange={(e) => handleChange("reseller", e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0089FF] transition-colors"
              >
                <option value="">Select Reseller</option>
                <option value="HP Reseller">HP Reseller</option>
                <option value="Global Reseller Hub">Global Reseller Hub</option>
                <option value="FleetTech Resellers">FleetTech Resellers</option>
              </select>
            </div>
          </div>

          {/* Company * */}
          <div className="grid grid-cols-12 items-center gap-4">
            <label className="col-span-3 text-slate-700 dark:text-slate-300 font-medium text-xs">
              Company <span className="text-rose-500">*</span>
            </label>
            <div className="col-span-9">
              <select
                value={form.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0089FF] transition-colors"
              >
                <option value="">Select Company</option>
                <option value="Agrawal Industries">Agrawal Industries</option>
                <option value="BSJ">BSJ</option>
                <option value="Company">Company</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Thailand">Thailand</option>
                <option value="Valsad">Valsad</option>
              </select>
            </div>
          </div>

          {/* Branch * */}
          <div className="grid grid-cols-12 items-center gap-4">
            <label className="col-span-3 text-slate-700 dark:text-slate-300 font-medium text-xs">
              Branch <span className="text-rose-500">*</span>
            </label>
            <div className="col-span-9">
              <select
                value={form.branch}
                onChange={(e) => handleChange("branch", e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0089FF] transition-colors"
              >
                <option value="">Select Branch</option>
                <option value="Company">Company</option>
                <option value="Agrawal Industries">Agrawal Industries</option>
                <option value="BSJ">BSJ</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Thailand">Thailand</option>
                <option value="Valsad">Valsad</option>
              </select>
            </div>
          </div>

          {/* Vehicle Name * */}
          <div className="grid grid-cols-12 items-center gap-4">
            <label className="col-span-3 text-slate-700 dark:text-slate-300 font-medium text-xs">
              Vehicle Name <span className="text-rose-500">*</span>
            </label>
            <div className="col-span-9">
              <input
                type="text"
                placeholder="Enter Vehicle Name (e.g. HP Boom Barrier)"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF] transition-colors"
              />
            </div>
          </div>

          {/* Object Group */}
          <div className="grid grid-cols-12 items-center gap-4">
            <label className="col-span-3 text-slate-700 dark:text-slate-300 font-medium text-xs">
              Object Group
            </label>
            <div className="col-span-9">
              <select
                value={form.objectGroup}
                onChange={(e) => handleChange("objectGroup", e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0089FF] transition-colors"
              >
                <option value="">Select Object Group</option>
                <option value="Heavy Logistics">Heavy Logistics</option>
                <option value="EV Delivery Fleet">EV Delivery Fleet</option>
                <option value="Asset Protection">Asset Protection</option>
                <option value="Custom Utility">Custom Utility</option>
              </select>
            </div>
          </div>

          {/* Specification */}
          <div className="grid grid-cols-12 items-center gap-4">
            <label className="col-span-3 text-slate-700 dark:text-slate-300 font-medium text-xs">
              Specification
            </label>
            <div className="col-span-9">
              <select
                value={form.specification}
                onChange={(e) => handleChange("specification", e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0089FF] transition-colors"
              >
                <option value="">Select Specification</option>
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
                <option value="Auxiliary">Auxiliary</option>
              </select>
            </div>
          </div>

          {/* Unit of Distance */}
          <div className="grid grid-cols-12 items-center gap-4">
            <label className="col-span-3 text-slate-700 dark:text-slate-300 font-medium text-xs">
              Unit of Distance
            </label>
            <div className="col-span-9">
              <select
                value={form.unitOfDistance}
                onChange={(e) => handleChange("unitOfDistance", e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0089FF] transition-colors"
              >
                <option value="Kilometer">Kilometer</option>
                <option value="Miles">Miles</option>
              </select>
            </div>
          </div>

          {/* Device Type * */}
          <div className="grid grid-cols-12 items-center gap-4">
            <label className="col-span-3 text-slate-700 dark:text-slate-300 font-medium text-xs">
              Device Type <span className="text-rose-500">*</span>
            </label>
            <div className="col-span-9">
              <select
                value={form.deviceType}
                onChange={(e) => handleChange("deviceType", e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0089FF] transition-colors"
              >
                <option value="">Select Device Type</option>
                <option value="Teltonika FMB920">Teltonika FMB920</option>
                <option value="Queclink GV300">Queclink GV300</option>
                <option value="Concox GT06N">Concox GT06N</option>
                <option value="Ruptela Pro4">Ruptela Pro4</option>
              </select>
            </div>
          </div>

          {/* Server Address */}
          <div className="grid grid-cols-12 items-center gap-4">
            <label className="col-span-3 text-slate-700 dark:text-slate-300 font-medium text-xs">
              Server Address
            </label>
            <div className="col-span-9">
              <input
                type="text"
                disabled
                value={form.serverAddress}
                className="w-full h-9 px-3 rounded-lg border border-[#DFE3EB]/70 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-mono cursor-not-allowed"
              />
            </div>
          </div>

          {/* IMEI Number * */}
          <div className="grid grid-cols-12 items-center gap-4">
            <label className="col-span-3 text-slate-700 dark:text-slate-300 font-medium text-xs">
              IMEI Number <span className="text-rose-500">*</span>
            </label>
            <div className="col-span-9">
              <input
                type="text"
                placeholder="e.g. 123321826"
                value={form.imei}
                onChange={(e) => handleChange("imei", e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF] transition-colors font-mono"
              />
            </div>
          </div>

          {/* Device IMEI * */}
          <div className="grid grid-cols-12 items-center gap-4">
            <label className="col-span-3 text-slate-700 dark:text-slate-300 font-medium text-xs">
              Device IMEI <span className="text-rose-500">*</span>
            </label>
            <div className="col-span-9">
              <input
                type="text"
                placeholder="e.g. 123321826"
                value={form.deviceImei}
                onChange={(e) => handleChange("deviceImei", e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF] transition-colors font-mono"
              />
            </div>
          </div>

          {/* Satellite IMEI */}
          <div className="grid grid-cols-12 items-center gap-4">
            <label className="col-span-3 text-slate-700 dark:text-slate-300 font-medium text-xs">
              Satellite IMEI
            </label>
            <div className="col-span-9">
              <input
                type="text"
                placeholder="Optional satellite tracker IMEI"
                value={form.satelliteImei}
                onChange={(e) => handleChange("satelliteImei", e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF] transition-colors font-mono"
              />
            </div>
          </div>

          {/* Primary SIM */}
          <div className="grid grid-cols-12 items-center gap-4">
            <label className="col-span-3 text-slate-700 dark:text-slate-300 font-medium text-xs">
              Primary SIM
            </label>
            <div className="col-span-9">
              <input
                type="text"
                placeholder="+62 812 3456"
                value={form.primarySim}
                onChange={(e) => handleChange("primarySim", e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF] transition-colors font-mono"
              />
            </div>
          </div>
        </form>
      </div>

      {/* 4. Fixed Bottom Action Bar */}
      <div className="flex items-center justify-start gap-3 px-8 py-3.5 border-t border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <button
          type="button"
          onClick={handleReset}
          className="px-5 py-2 rounded-lg border border-[#DFE3EB] dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center gap-1.5 px-6 py-2 rounded-lg bg-[#0089FF] hover:bg-[#0070d6] text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-98"
        >
          <Save className="h-3.5 w-3.5" />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
}
