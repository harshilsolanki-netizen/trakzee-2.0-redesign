import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Save,
  Check,
  Calendar as CalendarIcon,
  Truck,
  CreditCard,
  Building2,
  X,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { Checkbox } from "@/components/ui/checkbox";
import { TablePaginationBar } from "@/components/common/TablePaginationBar";

interface RechargeObject {
  id: string;
  name: string;
  deviceType: string;
  imei: string;
  createdDate: string;
  expiryDate: string;
  validityDays: number;
  status: "expired" | "soon" | "sufficient";
}

// Generate 243 soon-to-expire objects matching screenshot
const MOCK_SOON_OBJECTS: RechargeObject[] = Array.from({ length: 243 }, (_, i) => {
  const num = i + 1;
  const imeiNum = String(112233000 + num).padStart(9, "0");
  return {
    id: `hp-soon-${num}`,
    name: `HP Object ${num}`,
    deviceType: "HP HttpPool Advance HP HttpPool Service 5175",
    imei: imeiNum,
    createdDate: "01/05/2026",
    expiryDate: "17/10/2026 (Validity 01 Days)",
    validityDays: 1,
    status: "soon",
  };
});

// Generate 28 sufficient objects matching screenshot tab
const MOCK_SUFFICIENT_OBJECTS: RechargeObject[] = Array.from({ length: 28 }, (_, i) => {
  const num = i + 1;
  const imeiNum = String(112244000 + num).padStart(9, "0");
  return {
    id: `hp-suff-${num}`,
    name: `HP Object Sufficient ${num}`,
    deviceType: "HP HttpPool Advance HP HttpPool Service 5175",
    imei: imeiNum,
    createdDate: "01/05/2026",
    expiryDate: "15/01/2027 (Validity 90 Days)",
    validityDays: 90,
    status: "sufficient",
  };
});

const DURATION_RATES: Record<string, number> = {
  Daily: 50,
  Monthly: 1200,
  Quarterly: 3400,
  "Half Yearly": 6500,
  Yearly: 12000,
};

export function RechargePage() {
  const navigate = useNavigate();

  // Left Form State (Exact fields from screenshot)
  const [company, setCompany] = useState("HP Company");
  const [numberOfObject, setNumberOfObject] = useState<string>("0");
  const [duration, setDuration] = useState<"Daily" | "Monthly" | "Quarterly" | "Half Yearly" | "Yearly">("Daily");
  const [rechargeType, setRechargeType] = useState<"Recharge Till Date" | "Fixed No of Days">("Recharge Till Date");
  const [rechargeTillDate, setRechargeTillDate] = useState("2026-10-25");
  const [fixedDays, setFixedDays] = useState("30");
  const [useWalletBalance, setUseWalletBalance] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("--Select--");
  const [applyTds, setApplyTds] = useState(false);
  const [billAmountInput, setBillAmountInput] = useState<string>("0");
  const [gatewayChargesInput, setGatewayChargesInput] = useState<string>("0");
  const [name, setName] = useState("hpcompany@yopmail.com");
  const [email, setEmail] = useState("hpcompany@yopmail.com");
  const [mobileNumber, setMobileNumber] = useState("8460293942");
  const [additionalInformation, setAdditionalInformation] = useState("");
  const expiryCalculationMode = "From Renewal Date";

  // Right Table State
  const [activeTab, setActiveTab] = useState<"expired" | "soon" | "sufficient">("soon");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Active object dataset by tab
  const currentTabObjects = useMemo(() => {
    if (activeTab === "expired") return [];
    if (activeTab === "soon") return MOCK_SOON_OBJECTS;
    return MOCK_SUFFICIENT_OBJECTS;
  }, [activeTab]);

  // Filtered by search
  const filteredObjects = useMemo(() => {
    if (!searchQuery.trim()) return currentTabObjects;
    const q = searchQuery.toLowerCase().trim();
    return currentTabObjects.filter(
      (obj) =>
        obj.name.toLowerCase().includes(q) ||
        obj.imei.toLowerCase().includes(q) ||
        obj.deviceType.toLowerCase().includes(q)
    );
  }, [currentTabObjects, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredObjects.length / pageSize) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedObjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredObjects.slice(start, start + pageSize);
  }, [filteredObjects, currentPage, pageSize]);

  // Derived calculations
  const selectedCount = selectedIds.size;
  const ratePerUnit = DURATION_RATES[duration] || 50;
  const rawBillAmount = selectedCount * ratePerUnit;
  const tdsAmount = applyTds ? Math.round(rawBillAmount * 0.02) : 0;
  const calculatedBillAmount = Math.max(0, rawBillAmount - tdsAmount);

  // Auto-sync Number of Object and Bill Amount when selection or duration changes
  useEffect(() => {
    setNumberOfObject(String(selectedCount));
  }, [selectedCount]);

  useEffect(() => {
    setBillAmountInput(String(calculatedBillAmount));
  }, [calculatedBillAmount]);

  // Table Selection Handlers
  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isAllCurrentPageSelected =
    paginatedObjects.length > 0 &&
    paginatedObjects.every((obj) => selectedIds.has(obj.id));

  const handleToggleSelectAllPage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (isAllCurrentPageSelected) {
        paginatedObjects.forEach((obj) => next.delete(obj.id));
      } else {
        paginatedObjects.forEach((obj) => next.add(obj.id));
      }
      return next;
    });
  };

  // Actions
  const handleReset = () => {
    setSelectedIds(new Set());
    setPaymentMethod("--Select--");
    setUseWalletBalance(false);
    setApplyTds(false);
    setAdditionalInformation("");
    setDuration("Daily");
    setRechargeType("Recharge Till Date");
    setSearchQuery("");
    setCurrentPage(1);
    setBillAmountInput("0");
    setGatewayChargesInput("0");
    setNumberOfObject("0");
    toast.info("Form reset to default values");
  };

  const handleSave = () => {
    if (selectedCount === 0 && Number(numberOfObject) <= 0) {
      toast.error("Please select at least one object to recharge");
      return;
    }
    if (paymentMethod === "--Select--") {
      toast.error("Please select a valid Payment Method");
      return;
    }
    toast.success(
      `Recharge of ₹${Number(billAmountInput).toLocaleString()} submitted for ${selectedCount || numberOfObject} object(s)!`,
      {
        description: `Payment via ${paymentMethod}. Services updated through ${rechargeTillDate}.`,
      }
    );
  };

  const handleBack = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#F1F5F9] dark:bg-slate-950 overflow-hidden text-xs select-none">
      {/* 1. Header Toolbar with theme-compliant Back button (ChevronLeft icon + "Back" label) */}
      <header className="h-[46px] min-h-[46px] bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 px-4 flex items-center shrink-0 shadow-2xs z-10 select-none">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Back"
          >
            <ChevronLeft className="h-4 w-4 stroke-[2.2]" />
            <span>Back</span>
          </button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
          <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Recharge
          </h1>
        </div>
      </header>

      {/* 2. Main Workspace Layout: 2 Columns (Form & Table) */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-3 p-3 overflow-hidden">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Clean Form Card with Active States on Theme  */}
        {/* ========================================================= */}
        <div className="w-full lg:w-[420px] xl:w-[440px] shrink-0 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs flex flex-col overflow-hidden">
          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3.5 text-xs">
            {/* Company* */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-0.5">
                Company<span className="text-rose-500">*</span>:
              </label>
              <SelectDropdown
                value={company}
                options={["HP Company", "Global Logistics Ltd", "Uffizio Fleet Corp"]}
                onChange={setCompany}
                className="w-full"
                triggerClassName="h-8.5 text-xs rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-[#0089FF]/50 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF]"
              />
            </div>

            {/* Number of Object* */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-0.5">
                Number of Object<span className="text-rose-500">*</span>:
              </label>
              <input
                type="number"
                value={numberOfObject}
                onChange={(e) => setNumberOfObject(e.target.value)}
                className="w-full h-8.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs shadow-2xs transition-all hover:border-[#0089FF]/50 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF]"
              />
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Duration:
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {(["Daily", "Monthly", "Quarterly", "Half Yearly", "Yearly"] as const).map((dur) => (
                  <label
                    key={dur}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs cursor-pointer transition-all",
                      duration === dur
                        ? "border-[#0089FF] bg-sky-50 dark:bg-sky-950/40 text-[#0089FF] font-semibold shadow-2xs"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                    )}
                  >
                    <input
                      type="radio"
                      name="duration"
                      value={dur}
                      checked={duration === dur}
                      onChange={() => setDuration(dur)}
                      className="sr-only"
                    />
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full border flex items-center justify-center shrink-0",
                        duration === dur
                          ? "border-[#0089FF] bg-[#0089FF]"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                      )}
                    >
                      {duration === dur && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span>{dur}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Recharge Type */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Recharge Type:
              </label>
              <div className="flex items-center gap-3">
                {(["Recharge Till Date", "Fixed No of Days"] as const).map((rtype) => (
                  <label
                    key={rtype}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs cursor-pointer transition-all",
                      rechargeType === rtype
                        ? "border-[#0089FF] bg-sky-50 dark:bg-sky-950/40 text-[#0089FF] font-semibold"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                    )}
                  >
                    <input
                      type="radio"
                      name="rechargeType"
                      value={rtype}
                      checked={rechargeType === rtype}
                      onChange={() => setRechargeType(rtype)}
                      className="sr-only"
                    />
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full border flex items-center justify-center shrink-0",
                        rechargeType === rtype
                          ? "border-[#0089FF] bg-[#0089FF]"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                      )}
                    >
                      {rechargeType === rtype && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span>{rtype}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Recharge Till Date* / Fixed Days */}
            {rechargeType === "Recharge Till Date" ? (
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-0.5">
                  Recharge Till Date<span className="text-rose-500">*</span>:
                </label>
                <input
                  type="date"
                  value={rechargeTillDate}
                  onChange={(e) => setRechargeTillDate(e.target.value)}
                  className="w-full h-8.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs shadow-2xs transition-all hover:border-[#0089FF]/50 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF]"
                />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-0.5">
                  Recharge Till Date<span className="text-rose-500">*</span>:
                </label>
                <input
                  type="number"
                  placeholder="30"
                  value={fixedDays}
                  onChange={(e) => setFixedDays(e.target.value)}
                  className="w-full h-8.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs shadow-2xs transition-all hover:border-[#0089FF]/50 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF]"
                />
              </div>
            )}

            {/* Use Wallet Balance */}
            <div className="flex items-center gap-2 pt-0.5">
              <Checkbox
                id="useWallet"
                checked={useWalletBalance}
                onCheckedChange={(checked) => setUseWalletBalance(Boolean(checked))}
                className="h-4 w-4 rounded data-[state=checked]:bg-[#0089FF] data-[state=checked]:border-[#0089FF]"
              />
              <label
                htmlFor="useWallet"
                className="font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Use Wallet Balance:
              </label>
            </div>

            {/* Payment Method* */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-0.5">
                Payment Method<span className="text-rose-500">*</span>:
              </label>
              <SelectDropdown
                value={paymentMethod}
                options={["--Select--", "Credit Card", "Debit Card", "Net Banking", "UPI", "Wallet"]}
                onChange={setPaymentMethod}
                className="w-full"
                triggerClassName="h-8.5 text-xs rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-[#0089FF]/50 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF]"
              />
            </div>

            {/* Apply TDS Deduction (2%) */}
            <div className="flex items-center gap-2 pt-0.5">
              <Checkbox
                id="applyTds"
                checked={applyTds}
                onCheckedChange={(checked) => setApplyTds(Boolean(checked))}
                className="h-4 w-4 rounded data-[state=checked]:bg-[#0089FF] data-[state=checked]:border-[#0089FF]"
              />
              <label
                htmlFor="applyTds"
                className="font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Apply TDS Deduction (2%):
              </label>
            </div>

            {/* Bill Amount* & Gateway Charges* (Interactive with Theme Active State) */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-0.5">
                  Bill Amount<span className="text-rose-500">*</span>:
                </label>
                <input
                  type="number"
                  value={billAmountInput}
                  onChange={(e) => setBillAmountInput(e.target.value)}
                  className="w-full h-8.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-xs shadow-2xs transition-all hover:border-[#0089FF]/50 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-0.5">
                  Gateway Charges<span className="text-rose-500">*</span>:
                </label>
                <input
                  type="number"
                  value={gatewayChargesInput}
                  onChange={(e) => setGatewayChargesInput(e.target.value)}
                  className="w-full h-8.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-xs shadow-2xs transition-all hover:border-[#0089FF]/50 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF]"
                />
              </div>
            </div>

            {/* Name* */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-0.5">
                Name<span className="text-rose-500">*</span>:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-8.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs shadow-2xs transition-all hover:border-[#0089FF]/50 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF]"
              />
            </div>

            {/* Email* */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-0.5">
                Email<span className="text-rose-500">*</span>:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-8.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs shadow-2xs transition-all hover:border-[#0089FF]/50 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF]"
              />
            </div>

            {/* Mobile Number* */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-0.5">
                Mobile Number<span className="text-rose-500">*</span>:
              </label>
              <input
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full h-8.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs shadow-2xs transition-all hover:border-[#0089FF]/50 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF]"
              />
            </div>

            {/* Additional Information */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Additional Information:
              </label>
              <textarea
                rows={2}
                value={additionalInformation}
                onChange={(e) => setAdditionalInformation(e.target.value)}
                placeholder=""
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs shadow-2xs transition-all hover:border-[#0089FF]/50 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF] resize-none"
              />
            </div>

            {/* Expiry Calculation Mode */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Expiry Calculation Mode:
              </label>
              <input
                type="text"
                readOnly
                value={expiryCalculationMode}
                className="w-full h-8.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 text-xs font-medium cursor-default hover:border-[#0089FF]/50 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF]"
              />
            </div>
          </div>

          {/* Form Footer Action Buttons (Theme-Compliant) */}
          <div className="p-3 bg-slate-50/80 dark:bg-slate-900/80 border-t border-[#DFE3EB] dark:border-slate-800 flex items-center justify-end gap-2 shrink-0 select-none">
            <button
              type="button"
              onClick={handleReset}
              className="h-8 px-3.5 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 text-xs shadow-2xs"
              title="Reset Form"
            >
              <RotateCcw className="h-3.5 w-3.5 stroke-[2] text-slate-500" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="h-8 px-4.5 rounded-lg bg-[#0089FF] hover:bg-[#0076DC] text-white font-semibold flex items-center gap-1.5 shadow-xs shadow-[#0089FF]/20 hover:shadow-sm hover:shadow-[#0089FF]/30 active:scale-95 transition-all cursor-pointer text-xs"
              title="Save / Submit Recharge"
            >
              <Save className="h-3.5 w-3.5 stroke-[2]" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Table Card with Trakzee 2.0 Theme Tabs      */}
        {/* ========================================================= */}
        <div className="flex-1 min-w-0 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs flex flex-col overflow-hidden">
          {/* Header Row: Theme-Compliant Underline Tabs + Total Selected Objects */}
          <div className="h-11 px-4 border-b border-[#DFE3EB] dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-900/70 select-none shrink-0">
            {/* Tabs Bar with Active Underline Indicator */}
            <div className="flex items-center gap-6 h-full">
              {[
                { id: "expired", label: "Expired", count: 0 },
                { id: "soon", label: "Soon To be Expired", count: 243 },
                { id: "sufficient", label: "Sufficient", count: 28 },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setCurrentPage(1);
                    }}
                    className={cn(
                      "relative h-full font-semibold transition-all cursor-pointer flex items-center gap-1.5 text-xs whitespace-nowrap",
                      isActive
                        ? "text-[#0089FF] font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:text-[#0089FF]"
                    )}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={cn(
                        "font-bold font-mono text-[11px]",
                        isActive ? "text-[#0089FF]" : "text-slate-400 dark:text-slate-500"
                      )}
                    >
                      [ {tab.count} ]
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0089FF] rounded-t-full shadow-xs" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Total Selected Objects (No background box) */}
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 select-none flex items-center gap-1.5 shrink-0">
              <span>Total Selected Objects</span>
              <span className="font-bold font-mono text-[#0089FF]">[ {selectedCount} ]</span>
            </div>
          </div>

          {/* Search Filter Bar */}
          <div className="px-3.5 py-2 border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by IMEI, Object Name, Device Type"
                className="w-full h-8.5 pl-8 pr-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 shadow-2xs transition-all hover:border-[#0089FF]/50 focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 min-h-0 overflow-auto custom-scrollbar">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold select-none">
                <tr>
                  <th className="w-10 px-3 py-2.5 text-center">
                    <Checkbox
                      checked={isAllCurrentPageSelected}
                      onCheckedChange={handleToggleSelectAllPage}
                      className="h-3.5 w-3.5 rounded data-[state=checked]:bg-[#0089FF] data-[state=checked]:border-[#0089FF]"
                    />
                  </th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700 dark:text-slate-200">
                    Object
                  </th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700 dark:text-slate-200">
                    Device Type
                  </th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700 dark:text-slate-200 font-mono">
                    IMEI No
                  </th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700 dark:text-slate-200">
                    Created Date
                  </th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700 dark:text-slate-200">
                    Expiry Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {paginatedObjects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No objects found
                    </td>
                  </tr>
                ) : (
                  paginatedObjects.map((obj) => {
                    const isSelected = selectedIds.has(obj.id);
                    return (
                      <tr
                        key={obj.id}
                        onClick={() => handleToggleRow(obj.id)}
                        className={cn(
                          "transition-colors cursor-pointer",
                          isSelected
                            ? "bg-sky-50/70 dark:bg-sky-950/30"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                        )}
                      >
                        <td
                          className="w-10 px-3 py-2 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleToggleRow(obj.id)}
                            className="h-3.5 w-3.5 rounded data-[state=checked]:bg-[#0089FF] data-[state=checked]:border-[#0089FF]"
                          />
                        </td>
                        <td className="px-3 py-2 font-semibold text-slate-800 dark:text-slate-100">
                          {obj.name}
                        </td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                          {obj.deviceType}
                        </td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300 font-mono">
                          {obj.imei}
                        </td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                          {obj.createdDate}
                        </td>
                        <td className="px-3 py-2 font-medium">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1",
                              obj.status === "soon"
                                ? "text-amber-600 dark:text-amber-400 font-semibold"
                                : obj.status === "expired"
                                ? "text-rose-600 dark:text-rose-400 font-semibold"
                                : "text-emerald-600 dark:text-emerald-400 font-semibold"
                            )}
                          >
                            {obj.expiryDate}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Standard Application Bottom Frame with Centered Theme Pagination */}
          <TablePaginationBar
            page={currentPage}
            pageSize={pageSize}
            totalRows={filteredObjects.length}
            pageSizeOptions={[10, 15, 20, 25, 50]}
            itemLabel="records"
            onPageChange={(p) => setCurrentPage(p)}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setCurrentPage(1);
            }}
            showReset={false}
            showExport={false}
            className="border-t border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 px-4"
          />
        </div>
      </div>
    </div>
  );
}
