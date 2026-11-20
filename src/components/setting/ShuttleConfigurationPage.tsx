import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  RotateCcw,
  Check,
  Search,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { SelectDropdown, type DropdownOption } from "@/components/ui/select-dropdown";
import { cn } from "@/lib/utils";

// ─── Top Level Tab Types ────────────────────────────────────────────────────────
export type ConfigTopTab =
  | "general"
  | "tracking"
  | "admin_configurations"
  | "employee_app_configurations";

// ─── Sub-category IDs ────────────────────────────────────────────────────────────
export type TrackingSubCategory = "virtual_waypoint";

export type AdminSubCategory =
  | "operations"
  | "attendance"
  | "auto_trip_start"
  | "tripsheets"
  | "booking_restrictions"
  | "manage_bookings";

export type EmployeeAppSubCategory =
  | "booking_features"
  | "route_stop_display"
  | "seat_selection"
  | "employee_booking_restrictions"
  | "employee_communications"
  | "booking_windows";

// ─── Dropdown Options ────────────────────────────────────────────────────────────
const COMPANY_OPTIONS: DropdownOption[] = [
  { value: "CommuteX", label: "CommuteX" },
  { value: "HP Company", label: "HP Company" },
  { value: "ABC Logistics", label: "ABC Logistics" },
  { value: "Uffizio Enterprise", label: "Uffizio Enterprise" },
];

const COPY_FROM_OPTIONS: DropdownOption[] = [
  { value: "Select", label: "Select" },
  { value: "Default Shuttle Config", label: "Default Shuttle Config" },
  { value: "Night Shift Config", label: "Night Shift Config" },
];

const STATUS_OPTIONS: DropdownOption[] = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

// ─── Reusable Field-Beside-Value Row Matching ObjectSettingPage & AlertSettingPage ──
function FormFieldRow({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
      <label className="w-56 sm:w-72 text-left text-xs font-semibold text-foreground shrink-0 select-none">
        {label}
        {required && <span className="text-red-500 font-bold ml-0.5">*</span>} :
      </label>
      <div className="w-80 sm:w-96 max-w-md">{children}</div>
    </div>
  );
}

// ─── Clean Inline Yes / No Radio Control Matching Reference Screenshots ─────────
function YesNoRadio({
  name,
  value,
  onChange,
}: {
  name: string;
  value: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-6 h-9 select-none">
      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-foreground">
        <input
          type="radio"
          name={name}
          checked={value === true}
          onChange={() => onChange(true)}
          className="accent-[#0089FF] h-4 w-4 cursor-pointer"
        />
        <span>Yes</span>
      </label>
      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-foreground">
        <input
          type="radio"
          name={name}
          checked={value === false}
          onChange={() => onChange(false)}
          className="accent-[#0089FF] h-4 w-4 cursor-pointer"
        />
        <span>No</span>
      </label>
    </div>
  );
}

// ─── MAIN SHUTTLE CONFIGURATION COMPONENT ───────────────────────────────────────
export function ShuttleConfigurationPage() {
  const navigate = useNavigate();

  // Top Tabs
  const [topTab, setTopTab] = useState<ConfigTopTab>("general");

  // Sub Category Selections
  const [trackingSub, setTrackingSub] = useState<TrackingSubCategory>("virtual_waypoint");
  const [adminSub, setAdminSub] = useState<AdminSubCategory>("operations");
  const [employeeAppSub, setEmployeeAppSub] = useState<EmployeeAppSubCategory>("booking_features");

  // Side Panel State (Collapsible + Search matching reference image media_1795154342171_cf5e9154.png)
  const [isSidePanelCollapsed, setIsSidePanelCollapsed] = useState(false);
  const [subCategorySearch, setSubCategorySearch] = useState("");

  // 1. General States (Screen 1)
  const [company, setCompany] = useState("CommuteX");
  const [configName, setConfigName] = useState("");
  const [copyFrom, setCopyFrom] = useState("Select");
  const [status, setStatus] = useState("Active");
  const [validFrom, setValidFrom] = useState("");
  const [validTill, setValidTill] = useState("");

  // 2. Tracking States (Screen 2)
  const [virtualWaypointEnabled, setVirtualWaypointEnabled] = useState(false);
  const [geofenceRadius, setGeofenceRadius] = useState("50");
  const [bufferTimeRange, setBufferTimeRange] = useState("30");
  const [approxDistance, setApproxDistance] = useState("1000");

  // 3. Admin Configurations States (Screen 3)
  // Operations (7)
  const [marshalForRoutes, setMarshalForRoutes] = useState(false);
  const [enableMultiDriver, setEnableMultiDriver] = useState(false);
  const [tripEndCutoff, setTripEndCutoff] = useState("0");
  const [saveSeatForMarshal, setSaveSeatForMarshal] = useState(false);
  const [transferEmployees, setTransferEmployees] = useState(false);
  const [allowedTripDays, setAllowedTripDays] = useState("2");
  const [transferEmployeesTimeLimit, setTransferEmployeesTimeLimit] = useState("120");

  // Attendance (2)
  const [autoPunchIn, setAutoPunchIn] = useState(true);
  const [allowQrAttendance, setAllowQrAttendance] = useState(true);

  // Admin Auto Trip Start (5)
  const [autoTripStart, setAutoTripStart] = useState(true);
  const [autoStartBuffer, setAutoStartBuffer] = useState("15");
  const [autoStartGeofenceExit, setAutoStartGeofenceExit] = useState(true);
  const [autoEndTripFinalStop, setAutoEndTripFinalStop] = useState(true);
  const [autoEndBuffer, setAutoEndBuffer] = useState("20");

  // Tripsheets (3)
  const [digitalTripsheet, setDigitalTripsheet] = useState(true);
  const [driverSignature, setDriverSignature] = useState(false);
  const [printManifest, setPrintManifest] = useState(true);

  // Admin Booking Restrictions (4)
  const [restrictAssignedOffice, setRestrictAssignedOffice] = useState(true);
  const [maxActiveBookings, setMaxActiveBookings] = useState("2");
  const [adminCancelCutoff, setAdminCancelCutoff] = useState("1");
  const [crossBranchBooking, setCrossBranchBooking] = useState(false);

  // 4. Employee App Configurations States (Screen 4)
  // Booking Features (7)
  const [radiusVisibility, setRadiusVisibility] = useState("1500");
  const [officeGeofence, setOfficeGeofence] = useState("500");
  const [enableInteroffice, setEnableInteroffice] = useState(false);
  const [showWalkTime, setShowWalkTime] = useState(true);
  const [showSeatAvailability, setShowSeatAvailability] = useState(true);
  const [showSeatNumber, setShowSeatNumber] = useState(true);
  const [startTimeInsteadShift, setStartTimeInsteadShift] = useState(false);

  // Route and Stop Display (6)
  const [displayLiveLocation, setDisplayLiveLocation] = useState(true);
  const [displayEtas, setDisplayEtas] = useState(true);
  const [showPolyline, setShowPolyline] = useState(true);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [trafficHeatmap, setTrafficHeatmap] = useState(false);
  const [showDriverRating, setShowDriverRating] = useState(true);

  // Seat Selection (3)
  const [interactiveSeats, setInteractiveSeats] = useState(true);
  const [reserveFrontSeats, setReserveFrontSeats] = useState(true);
  const [autoAllocateSeat, setAutoAllocateSeat] = useState(false);

  // Employee Booking Restrictions (5)
  const [advanceWindowDays, setAdvanceWindowDays] = useState("7");
  const [cancellationCutoffMins, setCancellationCutoffMins] = useState("60");
  const [noShowPenaltyDays, setNoShowPenaltyDays] = useState("3");
  const [simultaneousBookings, setSimultaneousBookings] = useState(true);
  const [managerApprovalSpecial, setManagerApprovalSpecial] = useState(false);

  // Employee Communications (3)
  const [pushDispatch, setPushDispatch] = useState(true);
  const [smsTracking, setSmsTracking] = useState(true);
  const [alert10MinsAway, setAlert10MinsAway] = useState(true);

  // Booking Windows (5)
  const [morningCutoff, setMorningCutoff] = useState("21:00");
  const [eveningCutoff, setEveningCutoff] = useState("15:00");
  const [emergencyBookings, setEmergencyBookings] = useState(true);
  const [emergencyLeadTime, setEmergencyLeadTime] = useState("30");
  const [weekendBooking, setWeekendBooking] = useState(false);

  const TOP_TABS: { id: ConfigTopTab; label: string }[] = [
    { id: "general", label: "General" },
    { id: "tracking", label: "Tracking" },
    { id: "admin_configurations", label: "Admin Configurations" },
    { id: "employee_app_configurations", label: "Employee App Configurations" },
  ];

  const TRACKING_SUB_CATEGORIES: { id: TrackingSubCategory; name: string; count: number }[] = [
    { id: "virtual_waypoint", name: "Virtual Waypoint", count: 4 },
  ];

  const ADMIN_SUB_CATEGORIES: { id: AdminSubCategory; name: string; count: number }[] = [
    { id: "operations", name: "Operations", count: 7 },
    { id: "attendance", name: "Attendance", count: 2 },
    { id: "auto_trip_start", name: "Admin Auto Trip Start", count: 5 },
    { id: "tripsheets", name: "Tripsheets", count: 3 },
    { id: "booking_restrictions", name: "Admin Booking Restrictions", count: 4 },
    { id: "manage_bookings", name: "Manage Bookings", count: 0 },
  ];

  const EMPLOYEE_APP_SUB_CATEGORIES: { id: EmployeeAppSubCategory; name: string; count: number }[] = [
    { id: "booking_features", name: "Booking Features", count: 7 },
    { id: "route_stop_display", name: "Route and Stop Display", count: 6 },
    { id: "seat_selection", name: "Seat Selection", count: 3 },
    { id: "employee_booking_restrictions", name: "Employee Booking Restrictions", count: 5 },
    { id: "employee_communications", name: "Employee Communications", count: 3 },
    { id: "booking_windows", name: "Booking Windows", count: 5 },
  ];

  // Active sub categories list depending on active top tab
  const activeSubCategoriesList = useMemo(() => {
    if (topTab === "tracking") return TRACKING_SUB_CATEGORIES;
    if (topTab === "admin_configurations") return ADMIN_SUB_CATEGORIES;
    if (topTab === "employee_app_configurations") return EMPLOYEE_APP_SUB_CATEGORIES;
    return [];
  }, [topTab]);

  // Filtered by search input
  const filteredSubCategories = useMemo(() => {
    const q = subCategorySearch.trim().toLowerCase();
    if (!q) return activeSubCategoriesList;
    return activeSubCategoriesList.filter((item) =>
      item.name.toLowerCase().includes(q)
    );
  }, [activeSubCategoriesList, subCategorySearch]);

  const handleReset = () => {
    setCompany("CommuteX");
    setConfigName("");
    setCopyFrom("Select");
    setStatus("Active");
    setValidFrom("");
    setValidTill("");

    setVirtualWaypointEnabled(false);
    setGeofenceRadius("50");
    setBufferTimeRange("30");
    setApproxDistance("1000");

    setMarshalForRoutes(false);
    setEnableMultiDriver(false);
    setTripEndCutoff("0");
    setSaveSeatForMarshal(false);
    setTransferEmployees(false);
    setAllowedTripDays("2");
    setTransferEmployeesTimeLimit("120");

    setRadiusVisibility("1500");
    setOfficeGeofence("500");
    setEnableInteroffice(false);
    setShowWalkTime(true);
    setShowSeatAvailability(true);
    setShowSeatNumber(true);
    setStartTimeInsteadShift(false);

    toast.info("Configuration reset to defaults");
  };

  const handleSave = () => {
    toast.success("Shuttle Configuration saved successfully");
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#F0F0F0] dark:bg-slate-950 p-[10px]">
      <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white dark:bg-slate-900 rounded-xl border border-[#DFE3EB]/80 dark:border-slate-800 shadow-2xs select-none">
        {/* ─── 1. STANDARD SCREEN TITLE BAR (Matching ObjectSettingPage & TireSettingPage) ─── */}
      <div className="relative z-20 flex items-center justify-between px-5 pt-4 pb-2.5 select-none shrink-0 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate({ to: "/setting" })}
            className="p-1 -ml-1 rounded text-slate-700 dark:text-slate-200 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title="Back to Settings"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
          </button>
          <h1 className="text-[24px] font-medium text-slate-900 dark:text-white tracking-tight">
            Shuttle Configuration Detail
          </h1>
        </div>
      </div>

      {/* ─── 2. STANDARD IN-SCREEN PRIMARY LINE TABS BAR ─── */}
      <div className="flex items-center justify-between border-b border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 px-5 shrink-0 select-none text-xs h-10">
        <div className="flex items-center gap-8 h-full">
          {TOP_TABS.map((tab) => {
            const isActive = topTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setTopTab(tab.id);
                  setSubCategorySearch("");
                }}
                className={cn(
                  "relative h-full flex items-center px-0.5 text-xs transition-colors cursor-pointer select-none border-b-2 line-tab !rounded-none focus:outline-none",
                  isActive
                    ? "border-[#0089FF] text-[#0089FF] dark:text-blue-400 font-bold -mb-[1px]"
                    : "border-transparent text-muted-foreground font-medium hover:text-foreground hover:border-slate-300 dark:hover:border-slate-700"
                )}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 3. WORKSPACE AREA (Left Side Panel With Line Separator + Right Form Area) ─── */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* =====================================================================
            LEFT SIDE PANEL (Matching HubSpot Reference media_1795154342171_cf5e9154.png)
            Shown on Tracking, Admin Configurations, and Employee App Configurations
           ===================================================================== */}
        {topTab !== "general" && (
          <aside
            className={cn(
              "border-r border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col min-h-0 shrink-0 select-none transition-all duration-200",
              isSidePanelCollapsed ? "w-12 items-center" : "w-60 sm:w-68"
            )}
          >
            {!isSidePanelCollapsed ? (
              <>
                {/* 1. Header: Sub Category Title + Collapse Button */}
                <div className="px-4 pt-4 pb-3 flex items-center justify-between shrink-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                    Sub Category
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsSidePanelCollapsed(true)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Collapse sidebar"
                  >
                    <PanelLeftClose className="h-4 w-4" />
                  </button>
                </div>

                {/* 2. Search Input Matching Reference */}
                <div className="px-4 pb-3 shrink-0">
                  <div className="relative flex items-center">
                    <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={subCategorySearch}
                      onChange={(e) => setSubCategorySearch(e.target.value)}
                      className="h-8 w-full pl-8 pr-7 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-foreground placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF] focus:ring-1 focus:ring-[#0089FF] shadow-2xs font-medium"
                    />
                    {subCategorySearch && (
                      <button
                        type="button"
                        onClick={() => setSubCategorySearch("")}
                        className="absolute right-2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Sub-Category List Items (Active state matching HubSpot 'My reports 503') */}
                <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1 custom-scrollbar text-xs">
                  {filteredSubCategories.map((cat) => {
                    const isActive =
                      (topTab === "tracking" && cat.id === trackingSub) ||
                      (topTab === "admin_configurations" && cat.id === adminSub) ||
                      (topTab === "employee_app_configurations" && cat.id === employeeAppSub);

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          if (topTab === "tracking") setTrackingSub(cat.id as TrackingSubCategory);
                          if (topTab === "admin_configurations") setAdminSub(cat.id as AdminSubCategory);
                          if (topTab === "employee_app_configurations") setEmployeeAppSub(cat.id as EmployeeAppSubCategory);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors cursor-pointer text-left select-none",
                          isActive
                            ? "bg-[#E2E8F0] dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-2xs"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 font-medium"
                        )}
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="font-mono text-xs text-slate-500 dark:text-slate-400 shrink-0 ml-2">
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                  {filteredSubCategories.length === 0 && (
                    <p className="py-4 text-center text-xs text-muted-foreground italic">
                      No categories found
                    </p>
                  )}
                </div>
              </>
            ) : (
              /* Collapsed State Icon Strip */
              <div className="pt-4 flex flex-col items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsSidePanelCollapsed(false)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Expand sidebar"
                >
                  <PanelLeftOpen className="h-4 w-4" />
                </button>
              </div>
            )}
          </aside>
        )}

        {/* =====================================================================
            RIGHT FORM BODY (Right of the line separator)
           ===================================================================== */}
        <main className="flex-1 min-h-0 overflow-y-auto px-8 py-6 custom-scrollbar">
          {/* TAB 1: GENERAL (Screen 1 - 6 Fields Only, Clean Field-Beside-Value) */}
          {topTab === "general" && (
            <div className="space-y-3.5 max-w-4xl text-xs">
              {/* Company * */}
              <FormFieldRow label="Company" required>
                <SelectDropdown
                  value={company}
                  options={COMPANY_OPTIONS}
                  onChange={setCompany}
                  placeholder="Select Company"
                />
              </FormFieldRow>

              {/* Configuration Name * */}
              <FormFieldRow label="Configuration Name" required>
                <input
                  type="text"
                  value={configName}
                  onChange={(e) => setConfigName(e.target.value)}
                  placeholder=""
                  className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 shadow-2xs transition-all focus:border-[#0089FF] focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 font-medium"
                />
              </FormFieldRow>

              {/* Copy From */}
              <FormFieldRow label="Copy From">
                <SelectDropdown
                  value={copyFrom}
                  options={COPY_FROM_OPTIONS}
                  onChange={setCopyFrom}
                  placeholder="Select"
                />
              </FormFieldRow>

              {/* Status */}
              <FormFieldRow label="Status">
                <SelectDropdown
                  value={status}
                  options={STATUS_OPTIONS}
                  onChange={setStatus}
                  placeholder="Active"
                />
              </FormFieldRow>

              {/* Valid From * */}
              <FormFieldRow label="Valid From" required>
                <input
                  type="date"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground shadow-2xs transition-all focus:border-[#0089FF] focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 font-medium"
                />
              </FormFieldRow>

              {/* Valid Till */}
              <FormFieldRow label="Valid Till">
                <input
                  type="date"
                  value={validTill}
                  onChange={(e) => setValidTill(e.target.value)}
                  className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground shadow-2xs transition-all focus:border-[#0089FF] focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 font-medium"
                />
              </FormFieldRow>
            </div>
          )}

          {/* TAB 2: TRACKING (Screen 2 - Right 4 Fields) */}
          {topTab === "tracking" && (
            <div className="space-y-3.5 max-w-4xl text-xs">
              <FormFieldRow label="Virtual Waypoint Enabled">
                <YesNoRadio
                  name="virtualWaypointEnabled"
                  value={virtualWaypointEnabled}
                  onChange={setVirtualWaypointEnabled}
                />
              </FormFieldRow>

              <FormFieldRow label="Geofence Radius for Virtual Waypoints">
                <input
                  type="text"
                  value={geofenceRadius}
                  onChange={(e) => setGeofenceRadius(e.target.value)}
                  className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground font-mono shadow-2xs focus:border-[#0089FF] focus:outline-none"
                />
              </FormFieldRow>

              <FormFieldRow label="Buffer Time Range for Geofence">
                <input
                  type="text"
                  value={bufferTimeRange}
                  onChange={(e) => setBufferTimeRange(e.target.value)}
                  className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground font-mono shadow-2xs focus:border-[#0089FF] focus:outline-none"
                />
              </FormFieldRow>

              <FormFieldRow label="Approx Distance Between Virtual Waypoints">
                <input
                  type="text"
                  value={approxDistance}
                  onChange={(e) => setApproxDistance(e.target.value)}
                  className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground font-mono shadow-2xs focus:border-[#0089FF] focus:outline-none"
                />
              </FormFieldRow>
            </div>
          )}

          {/* TAB 3: ADMIN CONFIGURATIONS (Screen 3 - Selected Subcategory Form) */}
          {topTab === "admin_configurations" && (
            <div className="space-y-3.5 max-w-4xl text-xs">
              {adminSub === "operations" && (
                <>
                  <FormFieldRow label="Marshal For Routes">
                    <YesNoRadio
                      name="marshalForRoutes"
                      value={marshalForRoutes}
                      onChange={setMarshalForRoutes}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Enable Multi Driver">
                    <YesNoRadio
                      name="enableMultiDriver"
                      value={enableMultiDriver}
                      onChange={setEnableMultiDriver}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Trip End Cutoff Time for Vehicle Change">
                    <input
                      type="text"
                      value={tripEndCutoff}
                      onChange={(e) => setTripEndCutoff(e.target.value)}
                      className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground font-mono shadow-2xs focus:border-[#0089FF] focus:outline-none"
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Save Seat for Marshal">
                    <YesNoRadio
                      name="saveSeatForMarshal"
                      value={saveSeatForMarshal}
                      onChange={setSaveSeatForMarshal}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Transfer Employees Between Routes">
                    <YesNoRadio
                      name="transferEmployees"
                      value={transferEmployees}
                      onChange={setTransferEmployees}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Allowed Trip Days">
                    <input
                      type="text"
                      value={allowedTripDays}
                      onChange={(e) => setAllowedTripDays(e.target.value)}
                      className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground font-mono shadow-2xs focus:border-[#0089FF] focus:outline-none"
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Transfer Employees Between Routes Time Limit">
                    <input
                      type="text"
                      value={transferEmployeesTimeLimit}
                      onChange={(e) => setTransferEmployeesTimeLimit(e.target.value)}
                      className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground font-mono shadow-2xs focus:border-[#0089FF] focus:outline-none"
                    />
                  </FormFieldRow>
                </>
              )}

              {adminSub === "attendance" && (
                <>
                  <FormFieldRow label="Auto Punch In on Boarding">
                    <YesNoRadio
                      name="autoPunchIn"
                      value={autoPunchIn}
                      onChange={setAutoPunchIn}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Allow QR Code Attendance">
                    <YesNoRadio
                      name="allowQrAttendance"
                      value={allowQrAttendance}
                      onChange={setAllowQrAttendance}
                    />
                  </FormFieldRow>
                </>
              )}

              {adminSub === "auto_trip_start" && (
                <>
                  <FormFieldRow label="Enable Auto Trip Start">
                    <YesNoRadio
                      name="autoTripStart"
                      value={autoTripStart}
                      onChange={setAutoTripStart}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Auto Start Buffer Time">
                    <input
                      type="text"
                      value={autoStartBuffer}
                      onChange={(e) => setAutoStartBuffer(e.target.value)}
                      className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground font-mono shadow-2xs focus:border-[#0089FF] focus:outline-none"
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Auto Start On First Geofence Exit">
                    <YesNoRadio
                      name="autoStartGeofenceExit"
                      value={autoStartGeofenceExit}
                      onChange={setAutoStartGeofenceExit}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Auto End Trip When Final Stop Reached">
                    <YesNoRadio
                      name="autoEndTripFinalStop"
                      value={autoEndTripFinalStop}
                      onChange={setAutoEndTripFinalStop}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Auto End Buffer Time">
                    <input
                      type="text"
                      value={autoEndBuffer}
                      onChange={(e) => setAutoEndBuffer(e.target.value)}
                      className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground font-mono shadow-2xs focus:border-[#0089FF] focus:outline-none"
                    />
                  </FormFieldRow>
                </>
              )}

              {adminSub === "tripsheets" && (
                <>
                  <FormFieldRow label="Generate Digital Tripsheet">
                    <YesNoRadio
                      name="digitalTripsheet"
                      value={digitalTripsheet}
                      onChange={setDigitalTripsheet}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Mandatory Driver Signature">
                    <YesNoRadio
                      name="driverSignature"
                      value={driverSignature}
                      onChange={setDriverSignature}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Print Passenger Manifest">
                    <YesNoRadio
                      name="printManifest"
                      value={printManifest}
                      onChange={setPrintManifest}
                    />
                  </FormFieldRow>
                </>
              )}

              {adminSub === "booking_restrictions" && (
                <>
                  <FormFieldRow label="Restrict Bookings to Assigned Office">
                    <YesNoRadio
                      name="restrictAssignedOffice"
                      value={restrictAssignedOffice}
                      onChange={setRestrictAssignedOffice}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Max Active Bookings Per Employee">
                    <input
                      type="text"
                      value={maxActiveBookings}
                      onChange={(e) => setMaxActiveBookings(e.target.value)}
                      className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground font-mono shadow-2xs focus:border-[#0089FF] focus:outline-none"
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Cutoff Hours for Admin Cancellations">
                    <input
                      type="text"
                      value={adminCancelCutoff}
                      onChange={(e) => setAdminCancelCutoff(e.target.value)}
                      className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground font-mono shadow-2xs focus:border-[#0089FF] focus:outline-none"
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Allow Cross-Branch Booking">
                    <YesNoRadio
                      name="crossBranchBooking"
                      value={crossBranchBooking}
                      onChange={setCrossBranchBooking}
                    />
                  </FormFieldRow>
                </>
              )}

              {adminSub === "manage_bookings" && (
                <div className="py-8 text-center text-xs text-muted-foreground italic">
                  No configuration options for this category.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: EMPLOYEE APP CONFIGURATIONS (Screen 4 - Selected Subcategory Form) */}
          {topTab === "employee_app_configurations" && (
            <div className="space-y-3.5 max-w-4xl text-xs">
              {employeeAppSub === "booking_features" && (
                <>
                  <FormFieldRow label="Radius Shuttle Visibility Mts">
                    <input
                      type="text"
                      value={radiusVisibility}
                      onChange={(e) => setRadiusVisibility(e.target.value)}
                      className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground font-mono shadow-2xs focus:border-[#0089FF] focus:outline-none"
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Office Geofence Mts">
                    <input
                      type="text"
                      value={officeGeofence}
                      onChange={(e) => setOfficeGeofence(e.target.value)}
                      className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground font-mono shadow-2xs focus:border-[#0089FF] focus:outline-none"
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Enable Interoffice">
                    <YesNoRadio
                      name="enableInteroffice"
                      value={enableInteroffice}
                      onChange={setEnableInteroffice}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Show Walk to Station Time">
                    <YesNoRadio
                      name="showWalkTime"
                      value={showWalkTime}
                      onChange={setShowWalkTime}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Show Seat Availability">
                    <YesNoRadio
                      name="showSeatAvailability"
                      value={showSeatAvailability}
                      onChange={setShowSeatAvailability}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Show Seat Number on Ticket">
                    <YesNoRadio
                      name="showSeatNumber"
                      value={showSeatNumber}
                      onChange={setShowSeatNumber}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Start Time Instead Shift Time">
                    <YesNoRadio
                      name="startTimeInsteadShift"
                      value={startTimeInsteadShift}
                      onChange={setStartTimeInsteadShift}
                    />
                  </FormFieldRow>
                </>
              )}

              {employeeAppSub === "route_stop_display" && (
                <>
                  <FormFieldRow label="Display Live Shuttle Location">
                    <YesNoRadio
                      name="displayLiveLocation"
                      value={displayLiveLocation}
                      onChange={setDisplayLiveLocation}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Display ETAs at Upcoming Stops">
                    <YesNoRadio
                      name="displayEtas"
                      value={displayEtas}
                      onChange={setDisplayEtas}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Show Route Polyline on Map">
                    <YesNoRadio
                      name="showPolyline"
                      value={showPolyline}
                      onChange={setShowPolyline}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Show Stop Landmark Pictures">
                    <YesNoRadio
                      name="showLandmarks"
                      value={showLandmarks}
                      onChange={setShowLandmarks}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Enable Traffic Heatmap Overlay">
                    <YesNoRadio
                      name="trafficHeatmap"
                      value={trafficHeatmap}
                      onChange={setTrafficHeatmap}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Show Driver Rating to Passenger">
                    <YesNoRadio
                      name="showDriverRating"
                      value={showDriverRating}
                      onChange={setShowDriverRating}
                    />
                  </FormFieldRow>
                </>
              )}

              {employeeAppSub === "seat_selection" && (
                <>
                  <FormFieldRow label="Enable Interactive Seat Selection">
                    <YesNoRadio
                      name="interactiveSeats"
                      value={interactiveSeats}
                      onChange={setInteractiveSeats}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Reserve Front Seats for Women / Special Needs">
                    <YesNoRadio
                      name="reserveFrontSeats"
                      value={reserveFrontSeats}
                      onChange={setReserveFrontSeats}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Auto Allocate Next Best Seat">
                    <YesNoRadio
                      name="autoAllocateSeat"
                      value={autoAllocateSeat}
                      onChange={setAutoAllocateSeat}
                    />
                  </FormFieldRow>
                </>
              )}

              {employeeAppSub === "employee_booking_restrictions" && (
                <>
                  <FormFieldRow label="Booking Advance Window Days">
                    <input
                      type="text"
                      value={advanceWindowDays}
                      onChange={(e) => setAdvanceWindowDays(e.target.value)}
                      className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground font-mono shadow-2xs focus:border-[#0089FF] focus:outline-none"
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Cancellation Cutoff Time">
                    <input
                      type="text"
                      value={cancellationCutoffMins}
                      onChange={(e) => setCancellationCutoffMins(e.target.value)}
                      className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground font-mono shadow-2xs focus:border-[#0089FF] focus:outline-none"
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Maximum No-Show Penalty Days">
                    <input
                      type="text"
                      value={noShowPenaltyDays}
                      onChange={(e) => setNoShowPenaltyDays(e.target.value)}
                      className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground font-mono shadow-2xs focus:border-[#0089FF] focus:outline-none"
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Allow Simultaneous Morning & Evening Bookings">
                    <YesNoRadio
                      name="simultaneousBookings"
                      value={simultaneousBookings}
                      onChange={setSimultaneousBookings}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Require Manager Approval for Special Shifts">
                    <YesNoRadio
                      name="managerApprovalSpecial"
                      value={managerApprovalSpecial}
                      onChange={setManagerApprovalSpecial}
                    />
                  </FormFieldRow>
                </>
              )}

              {employeeAppSub === "employee_communications" && (
                <>
                  <FormFieldRow label="Send Push Notification on Trip Dispatch">
                    <YesNoRadio
                      name="pushDispatch"
                      value={pushDispatch}
                      onChange={setPushDispatch}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Send SMS with Tracking Link">
                    <YesNoRadio
                      name="smsTracking"
                      value={smsTracking}
                      onChange={setSmsTracking}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Alert When Vehicle is 10 Mins Away">
                    <YesNoRadio
                      name="alert10MinsAway"
                      value={alert10MinsAway}
                      onChange={setAlert10MinsAway}
                    />
                  </FormFieldRow>
                </>
              )}

              {employeeAppSub === "booking_windows" && (
                <>
                  <FormFieldRow label="Morning Shift Booking Cutoff">
                    <input
                      type="time"
                      value={morningCutoff}
                      onChange={(e) => setMorningCutoff(e.target.value)}
                      className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground font-mono shadow-2xs focus:border-[#0089FF] focus:outline-none"
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Evening Shift Booking Cutoff">
                    <input
                      type="time"
                      value={eveningCutoff}
                      onChange={(e) => setEveningCutoff(e.target.value)}
                      className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground font-mono shadow-2xs focus:border-[#0089FF] focus:outline-none"
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Allow Emergency Ad-Hoc Bookings">
                    <YesNoRadio
                      name="emergencyBookings"
                      value={emergencyBookings}
                      onChange={setEmergencyBookings}
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Emergency Booking Lead Time">
                    <input
                      type="text"
                      value={emergencyLeadTime}
                      onChange={(e) => setEmergencyLeadTime(e.target.value)}
                      className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground font-mono shadow-2xs focus:border-[#0089FF] focus:outline-none"
                    />
                  </FormFieldRow>

                  <FormFieldRow label="Weekend Booking Window Enabled">
                    <YesNoRadio
                      name="weekendBooking"
                      value={weekendBooking}
                      onChange={setWeekendBooking}
                    />
                  </FormFieldRow>
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ─── 4. HORIZONTAL DIVIDER (Matching VehicleDetailFormView) ─── */}
      <div className="mx-5 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0" />

      {/* ─── 5. STANDARD BOTTOM FOOTER BAR (Matching VehicleDetailFormView & TireSettingPage) ─── */}
      <footer className="flex h-12 items-center justify-start gap-2.5 px-5 bg-white dark:bg-slate-900 shrink-0 select-none">
        <button
          type="button"
          onClick={handleReset}
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
      </div>
    </div>
  );
}
