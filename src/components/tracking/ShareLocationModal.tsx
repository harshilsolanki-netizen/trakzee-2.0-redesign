import React, { useState, useEffect } from "react";
import {
  Clock,
  Copy,
  Check,
  Download,
  Link2,
  QrCode,
  Send,
  X,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { type FleetObject } from "@/data/fleet";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ShareHistoryItem {
  id: string;
  vehicleId: string;
  vehicleName: string;
  token: string;
  shareUrl: string;
  createdAt: string;
  expiresAt: string;
  status: "active" | "expired" | "revoked";
  recipientsCount: number;
  emails: string[];
  mobiles: string[];
  reason: string;
  showDriver: boolean;
  showEta: boolean;
  viewCount: number;
}

export interface ShareLocationModalProps {
  open: boolean;
  onClose: () => void;
  vehicle: FleetObject | null;
  allVehicles?: FleetObject[];
  onSelectVehicle?: (vehicle: FleetObject) => void;
}

export function ShareLocationModal({
  open,
  onClose,
  vehicle,
  allVehicles = [],
}: ShareLocationModalProps) {
  const activeVehicle = vehicle || (allVehicles.length > 0 ? allVehicles[0] : null);

  // View Mode: Form vs History
  const [viewMode, setViewMode] = useState<"form" | "history">("form");

  // Validity Main Selector (All options from legacy reference)
  const [validity, setValidity] = useState<string>("2 Hours");

  // ─── Custom Validity Advanced Scheduling ─────────────────────────────────────
  // 1. Schedule Type: Duration | Fixed | Relative
  const [scheduleType, setScheduleType] = useState<"duration" | "fixed" | "relative">("duration");
  
  // 1a. For "Duration": Minutes input
  const [customMinutes, setCustomMinutes] = useState<string>("120");

  // 1b. For "Fixed": Start and End Date & Time
  const [fixedStartDateTime, setFixedStartDateTime] = useState<string>("2026-10-13T13:30");
  const [fixedEndDateTime, setFixedEndDateTime] = useState<string>("2026-10-13T17:30");

  // 1c. For "Relative": Schedule (Daily / Weekly / Monthly), Time Range & Active Validity Date Range
  const [relativeSchedule, setRelativeSchedule] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [selectedMonthDays, setSelectedMonthDays] = useState<number[]>([1]);
  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [relativeStartTime, setRelativeStartTime] = useState<string>("12:00 AM");
  const [relativeEndTime, setRelativeEndTime] = useState<string>("12:00 AM");
  const [relativeStartDate, setRelativeStartDate] = useState<string>("2026-10-13");
  const [relativeEndDate, setRelativeEndDate] = useState<string>("2026-10-13");

  // Geofence & Address options when selected from Validity dropdown
  const [selectedGeofence, setSelectedGeofence] = useState<string>("Uffizio - Head Office");
  const [selectedAddress, setSelectedAddress] = useState<string>("Plot 214, Phase 2, GIDC, Vapi");

  // Form Fields
  const [emails, setEmails] = useState<string>("");
  const [mobiles, setMobiles] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [showDriver, setShowDriver] = useState<boolean>(true);
  const [showEta, setShowEta] = useState<boolean>(false);

  // Dynamic Visibility & Generation Animation: Link and QR Code appear with animation after being requested
  const [isLinkGenerated, setIsLinkGenerated] = useState<boolean>(false);
  const [isQrGenerated, setIsQrGenerated] = useState<boolean>(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState<boolean>(false);
  const [isGeneratingQr, setIsGeneratingQr] = useState<boolean>(false);
  const [justGeneratedLink, setJustGeneratedLink] = useState<boolean>(false);
  const [justGeneratedQr, setJustGeneratedQr] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Unique Share Token per session
  const [shareToken, setShareToken] = useState<string>(() =>
    "tz-" + Math.random().toString(36).substring(2, 8) + Date.now().toString(36).substring(4, 7)
  );

  // Reset conditional fields on modal reopen
  useEffect(() => {
    if (open) {
      setIsLinkGenerated(false);
      setIsQrGenerated(false);
      setIsGeneratingLink(false);
      setIsGeneratingQr(false);
      setJustGeneratedLink(false);
      setJustGeneratedQr(false);
      setIsCopied(false);
      setViewMode("form");
      setShareToken(
        "tz-" + Math.random().toString(36).substring(2, 8) + Date.now().toString(36).substring(4, 7)
      );
    }
  }, [open, vehicle?.id]);

  // History entries state
  const [historyList, setHistoryList] = useState<ShareHistoryItem[]>([
    {
      id: "sh-1",
      vehicleId: activeVehicle?.id || "o1",
      vehicleName: activeVehicle?.name || "1001",
      token: "tz-98a12f",
      shareUrl: `https://trakzee2.uffizio.com/sp/quickview.jsp?param=tz-98a12f`,
      createdAt: "13-10-2026 10:45 AM",
      expiresAt: "13-10-2026 12:45 PM",
      status: "active",
      recipientsCount: 2,
      emails: ["client@logistics.com"],
      mobiles: ["+91 98765 43210"],
      reason: "Urgent transit delivery tracking",
      showDriver: true,
      showEta: true,
      viewCount: 4,
    },
    {
      id: "sh-2",
      vehicleId: activeVehicle?.id || "o1",
      vehicleName: activeVehicle?.name || "1001",
      token: "tz-44b20e",
      shareUrl: `https://trakzee2.uffizio.com/sp/quickview.jsp?param=tz-44b20e`,
      createdAt: "12-10-2026 09:00 AM",
      expiresAt: "12-10-2026 01:00 PM",
      status: "expired",
      recipientsCount: 1,
      emails: ["ops@uffizio.com"],
      mobiles: [],
      reason: "Daily route check",
      showDriver: true,
      showEta: false,
      viewCount: 11,
    },
  ]);

  if (!open || !activeVehicle) return null;

  const trackingUrl = `https://trakzee2.uffizio.com/sp/quickview.jsp?param=${shareToken}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=4&data=${encodeURIComponent(
    trackingUrl
  )}`;

  // Monthly days toggle
  const toggleMonthDay = (day: number) => {
    setSelectedMonthDays((prev) =>
      prev.includes(day)
        ? prev.length > 1
          ? prev.filter((d) => d !== day)
          : prev
        : [...prev, day].sort((a, b) => a - b)
    );
  };

  // Weekly days toggle
  const toggleWeekDay = (day: string) => {
    setSelectedWeekDays((prev) =>
      prev.includes(day)
        ? prev.length > 1
          ? prev.filter((d) => d !== day)
          : prev
        : [...prev, day]
    );
  };

  // 1. Generate Link Action (requested via CTA with tactile animation)
  const handleGenerateLink = () => {
    if (isGeneratingLink) return;
    setIsGeneratingLink(true);

    setTimeout(() => {
      setIsLinkGenerated(true);
      setIsGeneratingLink(false);
      setJustGeneratedLink(true);
      navigator.clipboard.writeText(trackingUrl).catch(() => {});
      setIsCopied(true);
      toast.success("Live tracking link generated and copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2500);
      setTimeout(() => setJustGeneratedLink(false), 2200);
    }, 650);
  };

  // 1b. Direct Copy from Link row
  const handleCopyLink = () => {
    navigator.clipboard.writeText(trackingUrl).catch(() => {});
    setIsCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2500);
  };

  // 2. Generate QR Code Action (requested via CTA with tactile animation)
  const handleGenerateQr = () => {
    if (isGeneratingQr) return;
    setIsGeneratingQr(true);

    setTimeout(() => {
      setIsQrGenerated(true);
      setIsGeneratingQr(false);
      setJustGeneratedQr(true);
      toast.success("QR code generated successfully!");
      setTimeout(() => setJustGeneratedQr(false), 2200);
    }, 750);
  };

  // 2b. Download QR image
  const handleDownloadQr = () => {
    const a = document.createElement("a");
    a.href = qrCodeUrl;
    a.download = `QR_${activeVehicle.name}_${shareToken}.png`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("QR code downloaded!");
  };

  // 3. Send Action
  const handleSend = () => {
    const emailList = emails
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    const mobileList = mobiles
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    if (emailList.length === 0 && mobileList.length === 0) {
      toast.error("Please enter at least one email address or mobile number to send.");
      return;
    }

    const validitySummary =
      validity === "Custom"
        ? scheduleType === "duration"
          ? `${customMinutes} minutes`
          : scheduleType === "fixed"
          ? `Fixed (${fixedStartDateTime} to ${fixedEndDateTime})`
          : `Relative ${relativeSchedule}`
        : validity;

    const newHistoryItem: ShareHistoryItem = {
      id: "sh-" + Date.now(),
      vehicleId: activeVehicle.id,
      vehicleName: activeVehicle.name,
      token: shareToken,
      shareUrl: trackingUrl,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      expiresAt: validitySummary,
      status: "active",
      recipientsCount: emailList.length + mobileList.length,
      emails: emailList,
      mobiles: mobileList,
      reason: reason || "Live tracking",
      showDriver,
      showEta,
      viewCount: 0,
    };

    setHistoryList((prev) => [newHistoryItem, ...prev]);
    toast.success(
      `Live tracking link sent successfully to ${emailList.length + mobileList.length} recipient(s)!`
    );
    onClose();
  };

  // Revoke an active shared link from history
  const handleRevoke = (id: string) => {
    setHistoryList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "revoked" as const } : item))
    );
    toast.info("Tracking link revoked");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150 select-none">
      <div className="relative w-full max-w-[580px] bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* ── Header Bar (Matching Reference & Trakzee 2.0 Theme) ── */}
        <div className="flex h-12 items-center justify-between px-5 bg-white dark:bg-slate-900 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {viewMode === "form"
              ? `Share Live Location (${activeVehicle.name})`
              : `Share History (${activeVehicle.name})`}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* ── Modal Content: Form View vs History View ── */}
        {viewMode === "form" ? (
          <>
            {/* Form Fields: Strict Match to Legacy Reference Layout without Extra Clutter */}
            <div className="p-5 space-y-3.5 overflow-y-auto custom-scrollbar text-xs">
              
              {/* Row 1: Validity Dropdown */}
              <div className="flex items-center gap-3">
                <label className="w-32 sm:w-36 font-medium text-slate-700 dark:text-slate-300 shrink-0">
                  Validity :
                </label>
                <div className="flex-1">
                  <Select value={validity} onValueChange={(val) => setValidity(val)}>
                    <SelectTrigger className="w-full h-8.5 rounded-lg border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all">
                      <SelectValue placeholder="Select Validity" />
                    </SelectTrigger>
                    <SelectContent className="z-[70] max-h-64 bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 shadow-xl rounded-xl">
                      <SelectItem value="Custom">Custom</SelectItem>
                      <SelectItem value="1 Hour">1 Hour</SelectItem>
                      <SelectItem value="2 Hours">2 Hours</SelectItem>
                      <SelectItem value="4 Hours">4 Hours</SelectItem>
                      <SelectItem value="8 Hours">8 Hours</SelectItem>
                      <SelectItem value="12 Hours">12 Hours</SelectItem>
                      <SelectItem value="1 Day">1 Day</SelectItem>
                      <SelectItem value="5 Days">5 Days</SelectItem>
                      <SelectItem value="1 Week">1 Week</SelectItem>
                      <SelectItem value="2 Weeks">2 Weeks</SelectItem>
                      <SelectItem value="Till Upcoming Stop">Till Upcoming Stop</SelectItem>
                      <SelectItem value="Geofence">Geofence</SelectItem>
                      <SelectItem value="Address">Address</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ─── Conditional: Custom Validity Scheduling Section ────────────── */}
              {validity === "Custom" && (
                <div className="p-3.5 rounded-xl border border-[#DFE3EB] dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3 animate-in fade-in duration-150">
                  {/* Schedule Type: Duration | Fixed | Relative (Pinned Header) */}
                  <div className="flex items-center gap-3 shrink-0 pb-2.5 border-b border-[#DFE3EB]/70 dark:border-slate-700/60">
                    <label className="w-28 sm:w-32 font-medium text-slate-700 dark:text-slate-300 shrink-0">
                      Schedule Type :
                    </label>
                    <div className="flex-1">
                      <div className="inline-flex p-0.5 rounded-lg bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-700 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => setScheduleType("duration")}
                          className={cn(
                            "flex-1 sm:flex-initial px-3.5 py-1.5 rounded-md text-xs transition-all cursor-pointer font-medium",
                            scheduleType === "duration"
                              ? "bg-[#0089FF] text-white shadow-2xs font-semibold"
                              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                          )}
                        >
                          Duration
                        </button>
                        <button
                          type="button"
                          onClick={() => setScheduleType("fixed")}
                          className={cn(
                            "flex-1 sm:flex-initial px-3.5 py-1.5 rounded-md text-xs transition-all cursor-pointer font-medium",
                            scheduleType === "fixed"
                              ? "bg-[#0089FF] text-white shadow-2xs font-semibold"
                              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                          )}
                        >
                          Fixed
                        </button>
                        <button
                          type="button"
                          onClick={() => setScheduleType("relative")}
                          className={cn(
                            "flex-1 sm:flex-initial px-3.5 py-1.5 rounded-md text-xs transition-all cursor-pointer font-medium",
                            scheduleType === "relative"
                              ? "bg-[#0089FF] text-white shadow-2xs font-semibold"
                              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                          )}
                        >
                          Relative
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 1. If Duration */}
                  {scheduleType === "duration" && (
                    <div className="flex items-center gap-3 animate-in fade-in duration-150">
                      <div className="w-28 sm:w-32 shrink-0" />
                      <div className="flex-1 space-y-1">
                        <input
                          type="number"
                          min="1"
                          value={customMinutes}
                          onChange={(e) => setCustomMinutes(e.target.value)}
                          placeholder="Enter duration in minutes"
                          className="w-full h-8.5 px-3 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all"
                        />
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                          (minutes)
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 2. If Fixed */}
                  {scheduleType === "fixed" && (
                    <div className="flex items-start gap-3 animate-in fade-in duration-150">
                      <label className="w-28 sm:w-32 pt-2 font-medium text-slate-700 dark:text-slate-300 shrink-0">
                        Start & End Date :
                      </label>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10.5px] text-slate-500 dark:text-slate-400 mb-1">
                            Start Date & Time
                          </label>
                          <input
                            type="datetime-local"
                            value={fixedStartDateTime}
                            onChange={(e) => setFixedStartDateTime(e.target.value)}
                            className="w-full h-8.5 px-2.5 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10.5px] text-slate-500 dark:text-slate-400 mb-1">
                            End Date & Time
                          </label>
                          <input
                            type="datetime-local"
                            value={fixedEndDateTime}
                            onChange={(e) => setFixedEndDateTime(e.target.value)}
                            className="w-full h-8.5 px-2.5 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. If Relative */}
                  {scheduleType === "relative" && (
                    <div className="space-y-2.5 animate-in fade-in duration-150">
                      {/* Schedule: Daily | Weekly | Monthly */}
                      <div className="flex items-start gap-3">
                        <label className="w-28 sm:w-32 pt-1 font-medium text-slate-700 dark:text-slate-300 shrink-0">
                          Schedule :
                        </label>
                        <div className="flex-1 space-y-2">
                          <div className="inline-flex p-0.5 rounded-lg bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-700">
                            <button
                              type="button"
                              onClick={() => setRelativeSchedule("daily")}
                              className={cn(
                                "px-3 py-1 rounded-md text-xs transition-all cursor-pointer font-medium",
                                relativeSchedule === "daily"
                                  ? "bg-[#0089FF] text-white shadow-2xs font-semibold"
                                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                              )}
                            >
                              Daily
                            </button>
                            <button
                              type="button"
                              onClick={() => setRelativeSchedule("weekly")}
                              className={cn(
                                "px-3 py-1 rounded-md text-xs transition-all cursor-pointer font-medium",
                                relativeSchedule === "weekly"
                                  ? "bg-[#0089FF] text-white shadow-2xs font-semibold"
                                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                              )}
                            >
                              Weekly
                            </button>
                            <button
                              type="button"
                              onClick={() => setRelativeSchedule("monthly")}
                              className={cn(
                                "px-3 py-1 rounded-md text-xs transition-all cursor-pointer font-medium",
                                relativeSchedule === "monthly"
                                  ? "bg-[#0089FF] text-white shadow-2xs font-semibold"
                                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                              )}
                            >
                              Monthly
                            </button>
                          </div>

                          {/* Monthly: 1-31 Days Grid */}
                          {relativeSchedule === "monthly" && (
                            <div className="p-2 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-900 space-y-1.5">
                              <div className="flex items-center justify-between text-[10.5px] text-slate-500 dark:text-slate-400 px-0.5">
                                <span>Days of Month ({selectedMonthDays.length} selected):</span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedMonthDays(Array.from({ length: 31 }, (_, i) => i + 1))}
                                    className="hover:text-[#0089FF] font-medium transition-colors cursor-pointer"
                                  >
                                    Select All
                                  </button>
                                  <span>•</span>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedMonthDays([])}
                                    className="hover:text-[#0089FF] font-medium transition-colors cursor-pointer"
                                  >
                                    Clear
                                  </button>
                                </div>
                              </div>
                              <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                                  const isSelected = selectedMonthDays.includes(day);
                                  return (
                                    <button
                                      key={day}
                                      type="button"
                                      onClick={() => toggleMonthDay(day)}
                                      className={cn(
                                        "h-6 rounded text-[11px] font-medium transition-all cursor-pointer flex items-center justify-center",
                                        isSelected
                                          ? "bg-[#0089FF] text-white font-bold shadow-2xs"
                                          : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800"
                                      )}
                                    >
                                      {day}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Weekly: Sun-Sat Buttons */}
                          {relativeSchedule === "weekly" && (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
                                  const isSelected = selectedWeekDays.includes(day);
                                  return (
                                    <button
                                      key={day}
                                      type="button"
                                      onClick={() => toggleWeekDay(day)}
                                      className={cn(
                                        "px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer",
                                        isSelected
                                          ? "bg-[#0089FF] text-white font-bold shadow-2xs"
                                          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-[#DFE3EB] dark:border-slate-700 hover:border-[#0089FF]/50"
                                      )}
                                    >
                                      {day}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Start & End Time (Side-by-side on 1 row for sleek compact layout) */}
                      <div className="flex items-center gap-3">
                        <label className="w-28 sm:w-32 font-medium text-slate-700 dark:text-slate-300 shrink-0">
                          Time Range :
                        </label>
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={relativeStartTime}
                            onChange={(e) => setRelativeStartTime(e.target.value)}
                            placeholder="Start (12:00 AM)"
                            className="w-full h-8.5 px-3 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all"
                          />
                          <input
                            type="text"
                            value={relativeEndTime}
                            onChange={(e) => setRelativeEndTime(e.target.value)}
                            placeholder="End (12:00 AM)"
                            className="w-full h-8.5 px-3 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all"
                          />
                        </div>
                      </div>

                      {/* Validity Date Range */}
                      <div className="flex items-center gap-3">
                        <label className="w-28 sm:w-32 font-medium text-slate-700 dark:text-slate-300 shrink-0">
                          Validity Range :
                        </label>
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            value={relativeStartDate}
                            onChange={(e) => setRelativeStartDate(e.target.value)}
                            className="w-full h-8.5 px-2 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all"
                          />
                          <input
                            type="date"
                            value={relativeEndDate}
                            onChange={(e) => setRelativeEndDate(e.target.value)}
                            className="w-full h-8.5 px-2 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ─── Conditional: Geofence Selection ────────────── */}
              {validity === "Geofence" && (
                <div className="flex items-center gap-3 animate-in fade-in duration-150">
                  <label className="w-32 sm:w-36 font-medium text-slate-700 dark:text-slate-300 shrink-0">
                    Geofence :
                  </label>
                  <div className="flex-1">
                    <Select value={selectedGeofence} onValueChange={(val) => setSelectedGeofence(val)}>
                      <SelectTrigger className="w-full h-8.5 rounded-lg border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all">
                        <SelectValue placeholder="Select Geofence" />
                      </SelectTrigger>
                      <SelectContent className="z-[70] max-h-60 bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 shadow-xl rounded-xl">
                        <SelectItem value="Uffizio - Head Office">Uffizio - Head Office</SelectItem>
                        <SelectItem value="Valsad Depot">Valsad Depot</SelectItem>
                        <SelectItem value="Surat Hub">Surat Hub</SelectItem>
                        <SelectItem value="Mumbai Port Terminal">Mumbai Port Terminal</SelectItem>
                        <SelectItem value="Vapi GIDC Industrial Hub">Vapi GIDC Industrial Hub</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* ─── Conditional: Address Selection ────────────── */}
              {validity === "Address" && (
                <div className="flex items-center gap-3 animate-in fade-in duration-150">
                  <label className="w-32 sm:w-36 font-medium text-slate-700 dark:text-slate-300 shrink-0">
                    Address :
                  </label>
                  <div className="flex-1">
                    <Select value={selectedAddress} onValueChange={(val) => setSelectedAddress(val)}>
                      <SelectTrigger className="w-full h-8.5 rounded-lg border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all">
                        <SelectValue placeholder="Select Address" />
                      </SelectTrigger>
                      <SelectContent className="z-[70] max-h-60 bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 shadow-xl rounded-xl">
                        <SelectItem value="Plot 214, Phase 2, GIDC, Vapi">Plot 214, Phase 2, GIDC, Vapi</SelectItem>
                        <SelectItem value="National Highway 48, Near Toll Plaza, Vapi">National Highway 48, Near Toll Plaza, Vapi</SelectItem>
                        <SelectItem value="Station Road, Valsad, Gujarat">Station Road, Valsad, Gujarat</SelectItem>
                        <SelectItem value="Ring Road, Surat, Gujarat">Ring Road, Surat, Gujarat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Row 2: Email */}
              <div className="flex items-start gap-3">
                <label className="w-32 sm:w-36 pt-2 font-medium text-slate-700 dark:text-slate-300 shrink-0">
                  Email :
                </label>
                <div className="flex-1">
                  <textarea
                    rows={2}
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    placeholder="Use Comma(,) for Multiple Email"
                    className="w-full p-2.5 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Row 3: Mobile Number */}
              <div className="flex items-start gap-3">
                <label className="w-32 sm:w-36 pt-2 font-medium text-slate-700 dark:text-slate-300 shrink-0">
                  Mobile Number :
                </label>
                <div className="flex-1">
                  <textarea
                    rows={2}
                    value={mobiles}
                    onChange={(e) => setMobiles(e.target.value)}
                    placeholder="Use Comma(,) for Multiple Mobile Numbers"
                    className="w-full p-2.5 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Row 4: Reason */}
              <div className="flex items-start gap-3">
                <label className="w-32 sm:w-36 pt-2 font-medium text-slate-700 dark:text-slate-300 shrink-0">
                  Reason :
                </label>
                <div className="flex-1">
                  <textarea
                    rows={2}
                    maxLength={200}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Write the reason in 200 letters."
                    className="w-full p-2.5 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Row 5: Show Driver Details Checkbox */}
              <div className="flex items-center gap-3">
                <span className="w-32 sm:w-36 font-medium text-slate-700 dark:text-slate-300 shrink-0">
                  Show Driver Details:
                </span>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDriver}
                    onChange={(e) => setShowDriver(e.target.checked)}
                    className="h-4 w-4 rounded border-[#DFE3EB] dark:border-slate-700 text-[#0089FF] accent-[#0089FF] cursor-pointer"
                  />
                </label>
              </div>

              {/* Row 6: ETA Checkbox */}
              <div className="flex items-center gap-3">
                <span className="w-32 sm:w-36 font-medium text-slate-700 dark:text-slate-300 shrink-0">
                  ETA:
                </span>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showEta}
                    onChange={(e) => setShowEta(e.target.checked)}
                    className="h-4 w-4 rounded border-[#DFE3EB] dark:border-slate-700 text-[#0089FF] accent-[#0089FF] cursor-pointer"
                  />
                </label>
              </div>

              {/* Loading State: Generating Link Animation */}
              {isGeneratingLink && (
                <div className="flex items-center gap-3 pt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <label className="w-32 sm:w-36 font-medium text-slate-700 dark:text-slate-300 shrink-0 flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0089FF]" />
                    <span>Link :</span>
                  </label>
                  <div className="flex-1 h-8.5 px-3 rounded-lg border border-dashed border-[#0089FF]/60 bg-sky-50/50 dark:bg-sky-950/30 flex items-center gap-2 text-xs text-[#0089FF] animate-pulse">
                    <span className="font-medium">Generating secure live tracking link...</span>
                  </div>
                </div>
              )}

              {/* Conditional Row 7: Link (Appears ONLY after "Generate Link" is clicked) */}
              {isLinkGenerated && !isGeneratingLink && (
                <div
                  className={cn(
                    "flex items-center gap-3 pt-1 transition-all duration-300 animate-in fade-in slide-in-from-top-2",
                    justGeneratedLink && "scale-[1.01]"
                  )}
                >
                  <label className="w-32 sm:w-36 font-medium text-slate-700 dark:text-slate-300 shrink-0 flex items-center gap-1.5">
                    <span>Link :</span>
                    {justGeneratedLink && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-[#0089FF] animate-pulse">
                        Ready
                      </span>
                    )}
                  </label>
                  <div className="flex-1 flex items-center gap-2">
                    <div
                      className={cn(
                        "flex-1 relative flex items-center rounded-lg transition-all duration-300",
                        justGeneratedLink && "ring-2 ring-[#0089FF]/40"
                      )}
                    >
                      <input
                        type="text"
                        readOnly
                        value={trackingUrl}
                        className={cn(
                          "w-full h-8.5 px-3 rounded-lg border text-xs font-mono select-all focus:outline-none transition-colors",
                          justGeneratedLink
                            ? "border-[#0089FF] bg-sky-50/40 dark:bg-sky-950/30 text-[#0089FF] font-semibold"
                            : "border-[#DFE3EB] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                        )}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className={cn(
                        "h-8.5 px-3 rounded-lg border text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs active:scale-95",
                        isCopied
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/20"
                          : "border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-[#0089FF]"
                      )}
                    >
                      {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{isCopied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Loading State: Generating QR Code Animation */}
              {isGeneratingQr && (
                <div className="flex items-start gap-3 pt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <label className="w-32 sm:w-36 pt-2 font-medium text-slate-700 dark:text-slate-300 shrink-0 flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0089FF]" />
                    <span>QR Code :</span>
                  </label>
                  <div className="flex-1 h-24 p-3 rounded-xl border border-dashed border-[#0089FF]/60 bg-sky-50/50 dark:bg-sky-950/30 flex items-center justify-center gap-2.5 text-xs text-[#0089FF] animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin text-[#0089FF]" />
                    <span className="font-medium">Generating scannable QR barcode...</span>
                  </div>
                </div>
              )}

              {/* Conditional Row 8: QR Code (Appears ONLY after "Generate QR Code" is clicked) */}
              {isQrGenerated && !isGeneratingQr && (
                <div
                  className={cn(
                    "flex items-start gap-3 pt-1 transition-all duration-300 animate-in fade-in slide-in-from-top-2",
                    justGeneratedQr && "scale-[1.01]"
                  )}
                >
                  <label className="w-32 sm:w-36 pt-2 font-medium text-slate-700 dark:text-slate-300 shrink-0 flex items-center gap-1.5">
                    <span>QR Code :</span>
                    {justGeneratedQr && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-[#0089FF] animate-pulse">
                        Ready
                      </span>
                    )}
                  </label>
                  <div
                    className={cn(
                      "flex-1 flex items-center gap-4 p-3 rounded-xl border transition-all duration-300",
                      justGeneratedQr
                        ? "border-[#0089FF] ring-2 ring-[#0089FF]/30 bg-sky-50/40 dark:bg-sky-950/30"
                        : "border-[#DFE3EB] dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40"
                    )}
                  >
                    <div className="h-20 w-20 bg-white p-1 rounded-lg border border-[#DFE3EB] dark:border-slate-700 shadow-2xs shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        className="h-full w-full object-contain animate-in zoom-in-90 fade-in duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Scan with camera to open live tracking
                      </span>
                      <button
                        type="button"
                        onClick={handleDownloadQr}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-[#0089FF] transition-colors cursor-pointer shadow-2xs w-fit active:scale-95"
                      >
                        <Download className="h-3.5 w-3.5 text-[#0089FF]" />
                        <span>Download QR</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Footer Bar with the 4 CTAs in a Single Line ── */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#DFE3EB] dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0 flex-wrap gap-2">
              {/* CTA 1: History (Left side) */}
              <button
                type="button"
                onClick={() => setViewMode("history")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-[#0089FF] transition-colors cursor-pointer shadow-2xs active:scale-95"
              >
                <Clock className="h-3.5 w-3.5 text-[#0089FF]" />
                <span>History</span>
              </button>

              {/* CTAs 2, 3, 4: Generate Link, Generate QR Code, Send (Right side) */}
              <div className="flex items-center gap-2">
                {/* CTA 2: Generate Link */}
                <button
                  type="button"
                  disabled={isGeneratingLink}
                  onClick={handleGenerateLink}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer shadow-2xs active:scale-95",
                    isGeneratingLink
                      ? "border-sky-300 bg-sky-50 text-[#0089FF] cursor-wait"
                      : isLinkGenerated
                      ? "border-sky-200 dark:border-sky-900 bg-sky-50/40 dark:bg-sky-950/40 text-[#0089FF]"
                      : "border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-[#0089FF]"
                  )}
                >
                  {isGeneratingLink ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0089FF]" />
                  ) : isLinkGenerated ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5 text-slate-500" />
                  )}
                  <span>
                    {isGeneratingLink ? "Generating..." : isLinkGenerated ? "Link Ready" : "Generate Link"}
                  </span>
                </button>

                {/* CTA 3: Generate QR Code */}
                <button
                  type="button"
                  disabled={isGeneratingQr}
                  onClick={handleGenerateQr}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer shadow-2xs active:scale-95",
                    isGeneratingQr
                      ? "border-sky-300 bg-sky-50 text-[#0089FF] cursor-wait"
                      : isQrGenerated
                      ? "border-sky-200 dark:border-sky-900 bg-sky-50/40 dark:bg-sky-950/40 text-[#0089FF]"
                      : "border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-[#0089FF]"
                  )}
                >
                  {isGeneratingQr ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0089FF]" />
                  ) : isQrGenerated ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <QrCode className="h-3.5 w-3.5 text-slate-500" />
                  )}
                  <span>
                    {isGeneratingQr ? "Generating QR..." : isQrGenerated ? "QR Ready" : "Generate QR Code"}
                  </span>
                </button>

                {/* CTA 4: Send (Primary CTA) */}
                <button
                  type="button"
                  onClick={handleSend}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0089FF] hover:bg-[#0070d6] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer active:scale-95"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* ── History View ── */
          <>
            <div className="p-4 space-y-3 overflow-y-auto custom-scrollbar flex-1 max-h-[60vh] text-xs">
              {historyList.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  No share history available.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {historyList.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-[#DFE3EB] dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                            {item.token}
                          </span>
                          <span
                            className={cn(
                              "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                              item.status === "active"
                                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                : item.status === "expired"
                                ? "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700"
                                : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 border border-rose-200 dark:border-rose-800"
                            )}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate max-w-xs">
                          {item.reason} • Created: {item.createdAt} • Expires: {item.expiresAt}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(item.shareUrl);
                            toast.success("Link copied!");
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700 text-slate-500 hover:text-[#0089FF] transition-colors cursor-pointer"
                          title="Copy Link"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>

                        {item.status === "active" && (
                          <button
                            type="button"
                            onClick={() => handleRevoke(item.id)}
                            className="px-2 py-1 rounded-md text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* History Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#DFE3EB] dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("form")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-[#0089FF] transition-colors cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Share Location</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-2xs"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
