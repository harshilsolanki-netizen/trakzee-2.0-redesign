import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Save,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  ShieldAlert,
  Wrench,
  UserCheck,
  Ban,
  Upload,
  FileText,
  Trash2,
  Paperclip,
  Check,
  RotateCcw,
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

export type VehicleEventType =
  | "Accident"
  | "Breakdown"
  | "In Repair"
  | "Occupied"
  | "Out of Service";

export interface VehicleModeData {
  vehicleId: string;
  eventType: VehicleEventType;
  eventDate: string;
  estRecoveryDate: string;
  location?: string;
  subType?: string; // accidentType | breakdownType | outOfServiceType
  injuryDescription?: string;
  damageDescription?: string;
  oppositeVehicleDetail?: string;
  breakdownDescription?: string;
  remark: string;
  attachmentName?: string;
  updatedAt: string;
}

export interface VehicleModeModalProps {
  open: boolean;
  onClose: () => void;
  vehicle: FleetObject | null;
  currentModeData?: VehicleModeData | null;
  onSaveMode?: (data: VehicleModeData | null) => void;
}

const EVENT_TYPES: {
  id: VehicleEventType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}[] = [
  {
    id: "Accident",
    label: "Accident",
    icon: ShieldAlert,
    color: "#EF4444",
    badgeBg: "bg-rose-50 dark:bg-rose-950/40",
    badgeBorder: "border-rose-200 dark:border-rose-800",
    badgeText: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "Breakdown",
    label: "Breakdown",
    icon: AlertTriangle,
    color: "#F59E0B",
    badgeBg: "bg-amber-50 dark:bg-amber-950/40",
    badgeBorder: "border-amber-200 dark:border-amber-800",
    badgeText: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "In Repair",
    label: "In Repair",
    icon: Wrench,
    color: "#8B5CF6",
    badgeBg: "bg-purple-50 dark:bg-purple-950/40",
    badgeBorder: "border-purple-200 dark:border-purple-800",
    badgeText: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "Occupied",
    label: "Occupied",
    icon: UserCheck,
    color: "#0089FF",
    badgeBg: "bg-sky-50 dark:bg-sky-950/40",
    badgeBorder: "border-sky-200 dark:border-sky-800",
    badgeText: "text-sky-600 dark:text-sky-400",
  },
  {
    id: "Out of Service",
    label: "Out of Service",
    icon: Ban,
    color: "#64748B",
    badgeBg: "bg-slate-100 dark:bg-slate-800/60",
    badgeBorder: "border-slate-200 dark:border-slate-700",
    badgeText: "text-slate-700 dark:text-slate-300",
  },
];

const ACCIDENT_TYPES = [
  "Minor Collision",
  "Major Collision",
  "Rear-End Collision",
  "Head-On Collision",
  "Side Impact (T-Bone)",
  "Rollover",
  "Single Vehicle Accident",
  "Hit and Run",
  "Pedestrian Incident",
];

const BREAKDOWN_TYPES = [
  "Engine Failure",
  "Battery Dead / Alternator",
  "Flat Tire / Blowout",
  "Brake System Failure",
  "Transmission / Clutch Issue",
  "Fuel System / Empty",
  "Electrical Fault",
  "Engine Overheating",
  "Coolant Leak",
  "Suspension Failure",
];

const OUT_OF_SERVICE_TYPES = [
  "Scheduled Maintenance",
  "Document / Permit Expired",
  "Insurance Expired",
  "Fitness Certificate Expired",
  "Driver Unavailable",
  "Temporary Suspension",
  "Decommissioned",
  "Route Blocked",
];

// Helper to format Date to "DD/MM/YYYY hh:mm A"
function formatDateTimeString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = pad(date.getMinutes());
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursStr = pad(hours);

  return `${day}/${month}/${year} ${hoursStr}:${minutes} ${ampm}`;
}

export function VehicleModeModal({
  open,
  onClose,
  vehicle,
  currentModeData,
  onSaveMode,
}: VehicleModeModalProps) {
  // Form State
  const [eventType, setEventType] = useState<VehicleEventType>("Accident");
  const [eventDate, setEventDate] = useState<string>("");
  const [estRecoveryDate, setEstRecoveryDate] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [subType, setSubType] = useState<string>("");
  const [injuryDescription, setInjuryDescription] = useState<string>("");
  const [damageDescription, setDamageDescription] = useState<string>("");
  const [oppositeVehicleDetail, setOppositeVehicleDetail] = useState<string>("");
  const [breakdownDescription, setBreakdownDescription] = useState<string>("");
  const [remark, setRemark] = useState<string>("");
  const [attachmentName, setAttachmentName] = useState<string>("");

  // Sync state whenever modal opens or vehicle changes
  useEffect(() => {
    if (!open) return;

    if (currentModeData) {
      setEventType(currentModeData.eventType);
      setEventDate(currentModeData.eventDate);
      setEstRecoveryDate(currentModeData.estRecoveryDate);
      setLocation(currentModeData.location || "");
      setSubType(currentModeData.subType || "");
      setInjuryDescription(currentModeData.injuryDescription || "");
      setDamageDescription(currentModeData.damageDescription || "");
      setOppositeVehicleDetail(currentModeData.oppositeVehicleDetail || "");
      setBreakdownDescription(currentModeData.breakdownDescription || "");
      setRemark(currentModeData.remark || "");
      setAttachmentName(currentModeData.attachmentName || "");
    } else {
      const now = new Date();
      const recover = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 hours

      setEventType("Accident");
      setEventDate(formatDateTimeString(now));
      setEstRecoveryDate(formatDateTimeString(recover));
      setLocation(vehicle?.address || "Talodo, Southeast Sulawesi, Indonesia");
      setSubType("");
      setInjuryDescription("");
      setDamageDescription("");
      setOppositeVehicleDetail("");
      setBreakdownDescription("");
      setRemark("");
      setAttachmentName("");
    }
  }, [open, currentModeData, vehicle]);

  if (!open || !vehicle) return null;

  const currentTypeConfig =
    EVENT_TYPES.find((t) => t.id === eventType) || EVENT_TYPES[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
      toast.success(`Attached file: ${file.name}`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const modeData: VehicleModeData = {
      vehicleId: vehicle.id,
      eventType,
      eventDate,
      estRecoveryDate,
      location:
        eventType === "Accident" || eventType === "Breakdown"
          ? location
          : undefined,
      subType:
        eventType === "Accident" ||
        eventType === "Breakdown" ||
        eventType === "Out of Service"
          ? subType
          : undefined,
      injuryDescription:
        eventType === "Accident" ? injuryDescription : undefined,
      damageDescription:
        eventType === "Accident" ? damageDescription : undefined,
      oppositeVehicleDetail:
        eventType === "Accident" ? oppositeVehicleDetail : undefined,
      breakdownDescription:
        eventType === "Breakdown" ? breakdownDescription : undefined,
      remark,
      attachmentName:
        eventType === "Accident" || eventType === "Breakdown"
          ? attachmentName
          : undefined,
      updatedAt: new Date().toISOString(),
    };

    if (onSaveMode) {
      onSaveMode(modeData);
    }

    toast.success(`Vehicle mode updated to "${eventType}"`, {
      description: `${vehicle.name} status updated successfully.`,
    });
    onClose();
  };

  const handleClearMode = () => {
    if (onSaveMode) {
      onSaveMode(null);
    }
    toast.info(`Mode cleared for ${vehicle.name}`, {
      description: "Vehicle restored to normal tracking mode.",
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 select-none">
      <div className="relative w-full max-w-[560px] max-h-[90vh] bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* ── 1. Modal Header Bar (Theme Styled) ── */}
        <div className="flex h-13 items-center justify-between px-5 bg-white dark:bg-slate-900 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Mode
            </h2>
            <span className="text-[11px] font-semibold text-[#0089FF] bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-2 py-0.5 rounded-full truncate max-w-[180px]">
              {vehicle.name}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <X className="h-4 w-4 stroke-[2]" />
          </button>
        </div>

        {/* ── 2. Modal Scrollable Form Body ── */}
        <form
          id="vehicle-mode-form"
          onSubmit={handleSave}
          className="p-5 overflow-y-auto space-y-4 custom-scrollbar text-xs"
        >
          {/* Field: Event Type */}
          <div className="grid grid-cols-[135px_1fr] items-center gap-3">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Event Type :
            </label>
            <Select
              value={eventType}
              onValueChange={(val) => {
                setEventType(val as VehicleEventType);
                setSubType(""); // reset sub-type when changing category
              }}
            >
              <SelectTrigger className="h-8.5 text-xs bg-white dark:bg-slate-950 border-[#DFE3EB] dark:border-slate-700 rounded-md font-medium shadow-2xs hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 shadow-xl rounded-lg z-[100000]">
                {EVENT_TYPES.map((t) => {
                  const Icon = t.icon;
                  return (
                    <SelectItem
                      key={t.id}
                      value={t.id}
                      className="cursor-pointer font-medium py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: t.color }} />
                        <span>{t.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Field: Event Date */}
          <div className="grid grid-cols-[135px_1fr] items-center gap-3">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Event Date :
            </label>
            <div className="relative group">
              <input
                type="text"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                placeholder="DD/MM/YYYY hh:mm AM/PM"
                className="w-full h-8.5 px-3 pr-8 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 shadow-2xs hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all font-sans"
              />
              <Clock className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-[#0089FF] absolute right-2.5 top-2.5 pointer-events-none transition-colors" />
            </div>
          </div>

          {/* Field: Est. Recovery Date */}
          <div className="grid grid-cols-[135px_1fr] items-center gap-3">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Est. Recovery Date :
            </label>
            <div className="relative group">
              <input
                type="text"
                value={estRecoveryDate}
                onChange={(e) => setEstRecoveryDate(e.target.value)}
                placeholder="DD/MM/YYYY hh:mm AM/PM"
                className="w-full h-8.5 px-3 pr-8 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 shadow-2xs hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all font-sans"
              />
              <Calendar className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-[#0089FF] absolute right-2.5 top-2.5 pointer-events-none transition-colors" />
            </div>
          </div>

          {/* ── Conditional Fields: Accident & Breakdown Location ── */}
          {(eventType === "Accident" || eventType === "Breakdown") && (
            <div className="grid grid-cols-[135px_1fr] items-center gap-3 animate-in fade-in duration-150">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Location :
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location / street address..."
                  className="w-full h-8.5 px-3 pr-8 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 shadow-2xs hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all font-sans"
                />
                <MapPin className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-[#0089FF] absolute right-2.5 top-2.5 pointer-events-none transition-colors" />
              </div>
            </div>
          )}

          {/* ── Conditional Fields: Accident Type ── */}
          {eventType === "Accident" && (
            <>
              <div className="grid grid-cols-[135px_1fr] items-center gap-3 animate-in fade-in duration-150">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Accident Type :
                </label>
                <Select value={subType} onValueChange={setSubType}>
                  <SelectTrigger className="h-8.5 text-xs bg-white dark:bg-slate-950 border-[#DFE3EB] dark:border-slate-700 rounded-md font-medium shadow-2xs hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all">
                    <SelectValue placeholder="-Select-" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 shadow-xl rounded-lg z-[100000]">
                    {ACCIDENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t} className="cursor-pointer font-medium py-1.5">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-[135px_1fr] items-center gap-3 animate-in fade-in duration-150">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Description of Injury :
                </label>
                <input
                  type="text"
                  value={injuryDescription}
                  onChange={(e) => setInjuryDescription(e.target.value)}
                  placeholder="Details of driver/passenger injury..."
                  className="w-full h-8.5 px-3 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 shadow-2xs hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all font-sans"
                />
              </div>

              <div className="grid grid-cols-[135px_1fr] items-center gap-3 animate-in fade-in duration-150">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Description of Vehicle Damage :
                </label>
                <input
                  type="text"
                  value={damageDescription}
                  onChange={(e) => setDamageDescription(e.target.value)}
                  placeholder="Details of vehicle damage..."
                  className="w-full h-8.5 px-3 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 shadow-2xs hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all font-sans"
                />
              </div>

              <div className="grid grid-cols-[135px_1fr] items-center gap-3 animate-in fade-in duration-150">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Opposite Vehicle Detail :
                </label>
                <input
                  type="text"
                  value={oppositeVehicleDetail}
                  onChange={(e) => setOppositeVehicleDetail(e.target.value)}
                  placeholder="Plate, model, driver of third-party vehicle..."
                  className="w-full h-8.5 px-3 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 shadow-2xs hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all font-sans"
                />
              </div>
            </>
          )}

          {/* ── Conditional Fields: Breakdown Type & Description ── */}
          {eventType === "Breakdown" && (
            <>
              <div className="grid grid-cols-[135px_1fr] items-center gap-3 animate-in fade-in duration-150">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Breakdown Type :
                </label>
                <Select value={subType} onValueChange={setSubType}>
                  <SelectTrigger className="h-8.5 text-xs bg-white dark:bg-slate-950 border-[#DFE3EB] dark:border-slate-700 rounded-md font-medium shadow-2xs hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all">
                    <SelectValue placeholder="-Select-" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 shadow-xl rounded-lg z-[100000]">
                    {BREAKDOWN_TYPES.map((t) => (
                      <SelectItem key={t} value={t} className="cursor-pointer font-medium py-1.5">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-[135px_1fr] items-center gap-3 animate-in fade-in duration-150">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Breakdown description :
                </label>
                <input
                  type="text"
                  value={breakdownDescription}
                  onChange={(e) => setBreakdownDescription(e.target.value)}
                  placeholder="Mechanical failure symptoms..."
                  className="w-full h-8.5 px-3 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 shadow-2xs hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all font-sans"
                />
              </div>
            </>
          )}

          {/* ── Conditional Fields: Out of Service Type ── */}
          {eventType === "Out of Service" && (
            <div className="grid grid-cols-[135px_1fr] items-center gap-3 animate-in fade-in duration-150">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Out Of Service Type :
              </label>
              <Select value={subType} onValueChange={setSubType}>
                <SelectTrigger className="h-8.5 text-xs bg-white dark:bg-slate-950 border-[#DFE3EB] dark:border-slate-700 rounded-md font-medium shadow-2xs hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all">
                  <SelectValue placeholder="-Select-" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 shadow-xl rounded-lg z-[100000]">
                  {OUT_OF_SERVICE_TYPES.map((t) => (
                    <SelectItem key={t} value={t} className="cursor-pointer font-medium py-1.5">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Field: Remark (Always visible) */}
          <div className="grid grid-cols-[135px_1fr] items-start gap-3">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 pt-2">
              Remark :
            </label>
            <textarea
              rows={3}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter incident or dispatch remarks..."
              className="w-full p-2.5 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 shadow-2xs hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all resize-none font-sans"
            />
          </div>

          {/* ── Field: Attachment (Accident & Breakdown only) ── */}
          {(eventType === "Accident" || eventType === "Breakdown") && (
            <div className="grid grid-cols-[135px_1fr] items-center gap-3 animate-in fade-in duration-150">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Attachment :
              </label>
              <div className="flex items-center gap-2">
                <label className="h-8.5 px-3 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-[#0089FF]/5 hover:border-[#0089FF]/60 hover:text-[#0089FF] text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 shadow-2xs">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Choose Files</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>

                {attachmentName ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-[11px] text-[#0089FF] font-medium min-w-0">
                    <Paperclip className="h-3 w-3 shrink-0" />
                    <span className="truncate">{attachmentName}</span>
                    <button
                      type="button"
                      onClick={() => setAttachmentName("")}
                      className="p-0.5 hover:text-rose-500 cursor-pointer ml-1"
                      title="Remove file"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    No file chosen
                  </span>
                )}
              </div>
            </div>
          )}
        </form>

        {/* ── 3. Modal Footer Bar (Theme Styled) ── */}
        <div className="flex h-14 items-center justify-between px-5 border-t border-[#DFE3EB] dark:border-slate-800 bg-[#FAFAFA]/70 dark:bg-slate-950/40 shrink-0 select-none">
          {/* Left: Clear Mode button if mode is currently set */}
          <div>
            {currentModeData && (
              <button
                type="button"
                onClick={handleClearMode}
                className="h-8.5 px-3 rounded-md text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/60 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset to Normal</span>
              </button>
            )}
          </div>

          {/* Right: Save & Cancel Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-8.5 px-4 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-all cursor-pointer active:scale-95 shadow-2xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="vehicle-mode-form"
              className="h-8.5 px-5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] text-white font-bold text-xs shadow-2xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Save className="h-3.5 w-3.5 stroke-[2.2]" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
