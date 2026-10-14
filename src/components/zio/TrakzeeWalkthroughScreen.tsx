import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Plus,
  Mic,
  Star,
  Search,
  ChevronDown,
  RotateCw,
  Download,
  Settings as SettingsIcon,
  MoreVertical,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  LayoutDashboard,
  MapPin,
  FileText,
  BarChart2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface WalkthroughStepConfig {
  id: number;
  label: string;
  popoverTitle: string;
  popoverBody: string;
  view: "step1-sidebar" | "step2-table" | "form";
  targetRowIndex?: number;
}

const OBJECT_STEPS: WalkthroughStepConfig[] = [
  {
    id: 1,
    label: "Log in and open Settings — General — Object (or Live Tracking).",
    popoverTitle: "Open Settings",
    popoverBody: "Log in and open Settings → General → Company.",
    view: "step1-sidebar",
  },
  {
    id: 2,
    label: "Click the + (add) button.",
    popoverTitle: "Open Settings",
    popoverBody: "Log in and open Settings → General → Company.",
    view: "step2-table",
  },
  {
    id: 3,
    label: "On General Info, enter the Vehicle Plate number and Object Model.",
    popoverTitle: "Fill in the details",
    popoverBody:
      "On My Account, pick the reseller. This field appears only when you create the company from an Admin account.",
    view: "form",
    targetRowIndex: 0, // Reseller *
  },
  {
    id: 4,
    label: "Select the country, state, district, and operational branch depot.",
    popoverTitle: "Select Company",
    popoverBody:
      "On My Account, pick the reseller. This field appears only when you create the company from an Admin account.",
    view: "form",
    targetRowIndex: 1, // Company *
  },
  {
    id: 5,
    label: "Enter the device IMEI number (15 digits) and tracker hardware model.",
    popoverTitle: "Select Branch",
    popoverBody:
      "On My Account, pick the reseller. This field appears only when you create the company from an Admin account.",
    view: "form",
    targetRowIndex: 2, // Branch *
  },
  {
    id: 6,
    label: "Assign the primary fleet driver and emergency contact.",
    popoverTitle: "Enter here the Vehicle Name",
    popoverBody:
      "On My Account, pick the reseller. This field appears only when you create the company from an Admin account.",
    view: "form",
    targetRowIndex: 3, // Vehicle Name *
  },
  {
    id: 7,
    label: "Configure data storage period and GPS telemetry sampling frequency.",
    popoverTitle: "Select the Device type",
    popoverBody:
      "On My Account, pick the reseller. This field appears only when you create the company from an Admin account.",
    view: "form",
    targetRowIndex: 7, // Device Type *
  },
  {
    id: 8,
    label: "Review sensor rules, speed limits, and ignition alert triggers.",
    popoverTitle: "Enter here the IMEI Number",
    popoverBody:
      "On My Account, pick the reseller. This field appears only when you create the company from an Admin account.",
    view: "form",
    targetRowIndex: 9, // IMEI Number *
  },
  {
    id: 9,
    label: "Click Save to enroll vehicle and view on the live tracking map.",
    popoverTitle: "Save",
    popoverBody: "Click on the Save to Add the Object / Vehicle",
    view: "form",
    targetRowIndex: 99, // Save Button
  },
];

interface FormRowDef {
  id: number;
  label: string;
  required: boolean;
  type: "select" | "text";
  placeholder: string;
}

const FORM_ROWS: FormRowDef[] = [
  { id: 0, label: "Reseller", required: true, type: "select", placeholder: "Select Reseller" },
  { id: 1, label: "Company", required: true, type: "select", placeholder: "Select Company" },
  { id: 2, label: "Branch", required: true, type: "select", placeholder: "Select Branch" },
  {
    id: 3,
    label: "Vehicle Name",
    required: true,
    type: "text",
    placeholder: "Enter Vehicle Name (e.g. HP Boom Barrier)",
  },
  { id: 4, label: "Object Group", required: false, type: "select", placeholder: "Select Object Group" },
  { id: 5, label: "Specification", required: false, type: "select", placeholder: "Select Specification" },
  { id: 6, label: "Unit of Distance", required: false, type: "select", placeholder: "Kilometer" },
  { id: 7, label: "Device Type", required: true, type: "select", placeholder: "Select Device Type" },
  { id: 8, label: "Server Address", required: false, type: "text", placeholder: "--" },
  { id: 9, label: "IMEI Number", required: true, type: "text", placeholder: "e.g. 123321826" },
  { id: 10, label: "Device IMEI", required: true, type: "text", placeholder: "e.g. 123321826" },
  {
    id: 11,
    label: "Satellite IMEI",
    required: false,
    type: "text",
    placeholder: "Optional satellite tracker IMEI",
  },
  { id: 12, label: "Primary SIM", required: false, type: "text", placeholder: "+62 812 3456" },
];

/**
 * Renders the exact bold keywords in the left checklist items
 * matching the user's reference screenshots.
 */
function renderChecklistText(id: number, isActive: boolean) {
  if (isActive) {
    switch (id) {
      case 1:
        return "Log in and open Settings — General — Object (or Live Tracking).";
      case 2:
        return "Click the + (add) button.";
      case 3:
        return "On General Info, enter the Vehicle Plate number and Object Model.";
      case 4:
        return "Select the country, state, district, and operational branch depot.";
      case 5:
        return "Enter the device IMEI number (15 digits) and tracker hardware model.";
      case 6:
        return "Assign the primary fleet driver and emergency contact.";
      case 7:
        return "Configure data storage period and GPS telemetry sampling frequency.";
      case 8:
        return "Review sensor rules, speed limits, and ignition alert triggers.";
      case 9:
        return "Click Save to enroll vehicle and view on the live tracking map.";
      default:
        return "";
    }
  }

  switch (id) {
    case 1:
      return (
        <>
          Log in and open <strong className="text-slate-800">Settings — General — Object</strong> (or Live Tracking).
        </>
      );
    case 2:
      return (
        <>
          Click the <strong className="text-slate-800">+ (add)</strong> button.
        </>
      );
    case 3:
      return (
        <>
          On General Info, enter the <strong className="text-slate-800">Vehicle Plate number</strong> and{" "}
          <strong className="text-slate-800">Object Model</strong>.
        </>
      );
    case 4:
      return (
        <>
          Select the country, <strong className="text-slate-800">state, district, and operational branch depot</strong>.
        </>
      );
    case 5:
      return (
        <>
          Enter the device <strong className="text-slate-800">IMEI number</strong> (15 digits) and tracker hardware model.
        </>
      );
    case 6:
      return (
        <>
          Assign the <strong className="text-slate-800">primary fleet driver</strong> and emergency contact.
        </>
      );
    case 7:
      return (
        <>
          Configure <strong className="text-slate-800">data storage</strong> period and GPS telemetry sampling frequency.
        </>
      );
    case 8:
      return (
        <>
          Review <strong className="text-slate-800">sensor rules, speed limits, and ignition alert triggers</strong>.
        </>
      );
    case 9:
      return (
        <>
          Click <strong className="text-slate-800">Save</strong> to enroll vehicle and view on the live tracking map.
        </>
      );
    default:
      return null;
  }
}

interface WalkthroughPopoverProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  body: string;
  placement: "left" | "bottom" | "top";
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
}

/**
 * Blue Popover Tooltip with Beak Pointer
 * Perfect size, clean padding, and a clearly visible background behind Back button.
 */
function WalkthroughPopover({
  stepNumber,
  totalSteps,
  title,
  body,
  placement,
  onBack,
  onNext,
  onClose,
}: WalkthroughPopoverProps) {
  const showBack = stepNumber > 2;

  return (
    <div className="relative w-[270px] sm:w-[285px] rounded-2xl bg-[#0089FF] p-3.5 text-white shadow-2xl space-y-2 select-none animate-in fade-in zoom-in-95 duration-200">
      {/* Beak Pointer */}
      {placement === "left" && (
        <div className="absolute -left-2 top-4 h-0 w-0 border-y-[6px] border-y-transparent border-r-[8px] border-r-[#0089FF]" />
      )}
      {placement === "bottom" && (
        <div className="absolute -top-2 right-8 h-0 w-0 border-x-[6px] border-x-transparent border-b-[8px] border-b-[#0089FF]" />
      )}
      {placement === "top" && (
        <div className="absolute -bottom-2 left-8 h-0 w-0 border-x-[6px] border-x-transparent border-t-[8px] border-t-[#0089FF]" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-white tracking-wide">{title}</h4>
        <button
          type="button"
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Body */}
      <p className="text-[11px] leading-relaxed text-white/95 font-normal">{body}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-white/20">
        <span className="text-[11px] font-medium text-white/90 tabular-nums">
          {stepNumber} of {totalSteps}
        </span>

        <div className="flex items-center gap-1.5">
          {showBack && (
            <button
              type="button"
              onClick={onBack}
              className="text-white hover:text-white/80 font-medium text-xs px-2 py-1 transition-colors cursor-pointer"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            className="flex items-center gap-1 rounded-md bg-white hover:bg-slate-50 active:scale-95 px-3 py-1 text-xs font-bold text-[#0089FF] shadow-xs transition-all cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface TrakzeeWalkthroughScreenProps {
  topic?: "object" | "company";
  userQuery?: string;
  onSendMessage?: (msg: string) => void;
  onClose?: () => void;
  onBack?: () => void;
}

export function TrakzeeWalkthroughScreen({
  topic = "object",
  userQuery,
  onSendMessage,
  onClose,
  onBack,
}: TrakzeeWalkthroughScreenProps) {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [inputMsg, setInputMsg] = useState("");

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (onClose) {
      onClose();
    } else if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Animated Traveling Cursor State
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const formScrollRef = useRef<HTMLDivElement | null>(null);
  const [cursorCoords, setCursorCoords] = useState<{ x: number; y: number }>({ x: 45, y: 240 });
  const [isTraveling, setIsTraveling] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [showSparkle, setShowSparkle] = useState(true);

  const steps = OBJECT_STEPS;
  const currentStep = steps[activeStepIndex] || steps[0]!;

  // Smoothly recalculate cursor position whenever active step changes
  const updateCursorToStep = useCallback((stepIdx: number, animate = true) => {
    if (!rightPanelRef.current) return;

    const panelRect = rightPanelRef.current.getBoundingClientRect();
    const targetEl = document.getElementById(`walkthrough-target-${stepIdx + 1}`);

    if (targetEl) {
      const tRect = targetEl.getBoundingClientRect();

      let targetX = 0;
      let targetY = 0;

      if (stepIdx === 0) {
        // Step 1: Setting icon in middle sidebar
        targetX = tRect.left - panelRect.left + tRect.width / 2 + 10;
        targetY = tRect.top - panelRect.top + tRect.height / 2;
      } else if (stepIdx === 1) {
        // Step 2: + Object button
        targetX = tRect.right - panelRect.left - 24;
        targetY = tRect.top - panelRect.top + tRect.height / 2;
      } else if (stepIdx >= 2 && stepIdx <= 7) {
        // Steps 3 to 8: Form input fields (click right edge of box)
        targetX = tRect.right - panelRect.left - 20;
        targetY = tRect.top - panelRect.top + tRect.height / 2;
      } else if (stepIdx === 8) {
        // Step 9: Save button
        targetX = tRect.left - panelRect.left + tRect.width / 2 + 10;
        targetY = tRect.top - panelRect.top + tRect.height / 2;
      }

      if (animate) {
        setIsTraveling(true);
        setShowSparkle(false);
        setIsClicking(false);

        setCursorCoords({ x: targetX, y: targetY });

        // Travel time is 1150ms (smooth, relaxed, engaging speed)
        const travelTimer = setTimeout(() => {
          setIsTraveling(false);
          setIsClicking(true);
          setShowSparkle(true);

          const clickTimer = setTimeout(() => {
            setIsClicking(false);
          }, 200);

          return () => clearTimeout(clickTimer);
        }, 1150);

        return () => clearTimeout(travelTimer);
      } else {
        setCursorCoords({ x: targetX, y: targetY });
      }
    }
  }, []);

  // Update cursor position whenever active step changes
  useEffect(() => {
    // Scroll target into view if needed
    const targetEl = document.getElementById(`walkthrough-target-${activeStepIndex + 1}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // Measure after layout stabilizes
    const timer = setTimeout(() => {
      updateCursorToStep(activeStepIndex, true);
    }, 80);

    return () => clearTimeout(timer);
  }, [activeStepIndex, updateCursorToStep]);

  // Keep cursor positioned if user manually scrolls the form
  useEffect(() => {
    const scrollContainer = formScrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      if (!isTraveling) {
        updateCursorToStep(activeStepIndex, false);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [activeStepIndex, isTraveling, updateCursorToStep]);

  const handleNext = () => {
    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex((prev) => prev + 1);
    } else {
      toast.success("Object enrollment completed successfully!");
      if (onClose) onClose();
    }
  };

  const handlePrevious = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="flex h-full w-full bg-[#F0F0F0] font-sans text-slate-800 select-none overflow-hidden p-3 gap-3">
      {/* ── LEFT PANEL: CHAT & CHECKLIST (MATCHING REFERENCE EXACTLY) ── */}
      <div className="flex w-[340px] shrink-0 flex-col justify-between rounded-2xl bg-white p-4.5 z-20 shadow-md border border-slate-200/60">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header Row: Back button on left, User message bubble on right */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
              title="Back"
            >
              <ChevronLeft className="h-4 w-4 stroke-[2.2] text-slate-600" />
              <span>Back</span>
            </button>

            <div className="rounded-2xl rounded-br-xs bg-[#f1f5f9] px-3.5 py-2 text-xs font-medium text-slate-800 shadow-2xs">
              {userQuery || "add an object"}
            </div>
          </div>

          {/* Heading Section */}
          <div className="mb-3 space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900">
              Create an object / vehicle
            </h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              An object is tracked on live map and configured under Settings or Live Tracking.
            </p>
          </div>

          {/* 9 Numbered Steps Checklist */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2 scrollbar-thin scrollbar-thumb-slate-200">
            {steps.map((st, idx) => {
              const isActive = idx === activeStepIndex;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className="w-full flex items-start gap-2.5 text-left py-1 cursor-pointer transition-colors group"
                >
                  <span
                    className={cn(
                      "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold mt-0.5 transition-all",
                      isActive
                        ? "bg-[#0089FF] text-white shadow-xs scale-105"
                        : "border border-slate-300 text-slate-400 bg-white group-hover:border-slate-400 group-hover:text-slate-600",
                    )}
                  >
                    {st.id}
                  </span>
                  <span
                    className={cn(
                      "text-[11px] leading-snug flex-1",
                      isActive ? "font-bold text-slate-900" : "font-normal text-slate-600",
                    )}
                  >
                    {renderChecklistText(st.id, isActive)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Input Box: + Ask Zio about your fleet Mic */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 shadow-2xs">
            <button
              type="button"
              className="h-6 w-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputMsg.trim()) {
                  if (onSendMessage) onSendMessage(inputMsg.trim());
                  setInputMsg("");
                }
              }}
              placeholder="Ask Zio about your fleet"
              className="flex-1 bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="button"
              className="h-6 w-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
            >
              <Mic className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Left Arrow Icon matching bottom left in reference image */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleBack}
              className="h-6 w-6 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              title="Back"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: ANIMATED TRAVELING ARROW + STEP VIEW ── */}
      <div
        ref={rightPanelRef}
        className="relative flex-1 flex min-h-0 overflow-hidden gap-3"
      >
        {/* ── ANIMATED TRAVELING CURSOR LAYER ── */}
        <div
          className="absolute pointer-events-none z-50 select-none transition-all duration-[1150ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            left: `${cursorCoords.x}px`,
            top: `${cursorCoords.y}px`,
            transform: "translate(-5px, -4px)",
          }}
        >
          {/* Motion particle aura when traveling across elements */}
          {isTraveling && (
            <div className="absolute -left-3 -top-3 w-10 h-10 rounded-full bg-[#0089FF]/30 blur-xs animate-ping pointer-events-none" />
          )}

          <div
            className={cn(
              "relative transition-transform duration-200",
              isTraveling ? "-rotate-12 scale-110" : "rotate-0",
              isClicking ? "scale-85 translate-y-0.5" : "scale-100",
            )}
          >
            {/* 8-point ray click sparkle burst upon arrival */}
            {showSparkle && !isTraveling && (
              <div className="absolute -left-3.5 -top-3.5 w-7 h-7 flex items-center justify-center animate-in zoom-in-50 duration-200 pointer-events-none">
                <svg
                  className="w-6 h-6 text-slate-800 drop-shadow-xs"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="12" y1="3" x2="12" y2="7" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                  <line x1="3" y1="12" x2="7" y2="12" />
                  <line x1="17" y1="12" x2="21" y2="12" />
                  <line x1="5.6" y1="5.6" x2="8.4" y2="8.4" />
                  <line x1="15.6" y1="15.6" x2="18.4" y2="18.4" />
                  <line x1="5.6" y1="18.4" x2="8.4" y2="15.6" />
                  <line x1="15.6" y1="8.4" x2="18.4" y2="5.6" />
                </svg>
              </div>
            )}

            {/* Sleek arrowhead cursor without tail stick matching modern UI */}
            <svg
              className="w-6.5 h-6.5 drop-shadow-md overflow-visible"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M3.5 2.5 L18 10.5 L11.5 12.5 L8.5 19.5 Z"
                fill="white"
                stroke="#0f172a"
                strokeWidth="1.6"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* ── STEP 1: Dark Sidebar Present + Table View ── */}
        {currentStep.view === "step1-sidebar" && (
          <div className="flex h-full w-full overflow-hidden gap-3">
            {/* Dark Sidebar matching Reference Image 1 */}
            <div className="w-14 shrink-0 rounded-2xl bg-[#111827] border border-slate-800 text-slate-400 flex flex-col items-center py-4 justify-between z-10 shadow-lg">
              <div className="flex flex-col items-center w-full gap-3.5">
                {/* Uffizio Oval Pill Logo */}
                <div className="h-7 w-9 rounded-full bg-white flex items-center justify-center text-[8px] font-black text-slate-950 tracking-tighter shadow-xs">
                  uffizio
                </div>

                {/* Search icon */}
                <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center text-slate-300">
                  <Search className="h-3.5 w-3.5" />
                </div>

                {/* Vertical Navigation Icons */}
                <div className="flex flex-col items-center gap-3 w-full mt-1">
                  <button type="button" className="p-2 text-slate-400 hover:text-white transition-colors">
                    <Star className="h-4 w-4" />
                  </button>
                  <button type="button" className="p-2 text-slate-400 hover:text-white transition-colors">
                    <LayoutDashboard className="h-4 w-4" />
                  </button>
                  <button type="button" className="p-2 text-slate-400 hover:text-white transition-colors">
                    <MapPin className="h-4 w-4" />
                  </button>
                  <button type="button" className="p-2 text-slate-400 hover:text-white transition-colors">
                    <FileText className="h-4 w-4" />
                  </button>
                  <button type="button" className="p-2 text-slate-400 hover:text-white transition-colors">
                    <BarChart2 className="h-4 w-4" />
                  </button>

                  {/* Setting Icon -> ACTIVE TARGET FOR STEP 1 */}
                  <div className="relative">
                    <button
                      id="walkthrough-target-1"
                      type="button"
                      onClick={handleNext}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0089FF] text-white shadow-xs cursor-pointer hover:bg-blue-600 transition-colors"
                    >
                      <SettingsIcon className="h-4.5 w-4.5" />
                    </button>

                    {/* Blue Popover Tooltip for Step 1 */}
                    <div className="absolute left-[calc(100%+16px)] -top-1 z-20">
                      <WalkthroughPopover
                        stepNumber={1}
                        totalSteps={9}
                        title={currentStep.popoverTitle}
                        body={currentStep.popoverBody}
                        placement="left"
                        onBack={handlePrevious}
                        onNext={handleNext}
                        onClose={handleClose}
                      />
                    </div>
                  </div>

                  <button type="button" className="p-2 text-slate-400 hover:text-white transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Vehicle Table to right of dark sidebar */}
            <div className="flex-1 rounded-2xl bg-white p-6 shadow-md border border-slate-200/60 flex flex-col overflow-hidden">
              <VehicleTableView topic={topic} />
            </div>
          </div>
        )}

        {/* ── STEP 2: Table View with + Object Active ── */}
        {currentStep.view === "step2-table" && (
          <div className="flex-1 rounded-2xl bg-white p-6 shadow-md border border-slate-200/60 flex flex-col overflow-hidden">
            <VehicleTableView
              topic={topic}
              isStep2Target
              onAddObjectClick={handleNext}
              stepConfig={currentStep}
              onBack={handlePrevious}
              onNext={handleNext}
              onClose={handleClose}
            />
          </div>
        )}

        {/* ── STEPS 3 to 9: Form View (< Add Vehicle) ── */}
        {currentStep.view === "form" && (
          <div
            ref={formScrollRef}
            className="flex-1 rounded-2xl bg-white p-6 shadow-md border border-slate-200/60 flex flex-col overflow-y-auto"
          >
            {/* Header: < Add Vehicle */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 shrink-0">
              <button
                type="button"
                onClick={() => setActiveStepIndex(1)}
                className="flex items-center gap-1.5 text-lg font-bold text-slate-900 hover:text-[#0089FF] transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5 stroke-[2.2]" />
                <span>Add Vehicle</span>
              </button>
            </div>

            {/* Form Tabs: General, Profile, Sensors, Document */}
            <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-semibold mt-3 shrink-0">
              <button
                type="button"
                className="pb-2 text-[#0089FF] border-b-2 border-[#0089FF] font-bold cursor-pointer"
              >
                General
              </button>
              <button
                type="button"
                className="pb-2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                Profile
              </button>
              <button
                type="button"
                className="pb-2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                Sensors
              </button>
              <button
                type="button"
                className="pb-2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                Document
              </button>
            </div>

            {/* Form Fields: Stacked Single-Column Rows matching Reference 3 to 9 */}
            <div className="py-4 space-y-2.5 max-w-4xl flex-1">
              {FORM_ROWS.map((row) => {
                const isTarget = currentStep.targetRowIndex === row.id;
                const stepTargetId =
                  row.id === 0
                    ? "walkthrough-target-3"
                    : row.id === 1
                    ? "walkthrough-target-4"
                    : row.id === 2
                    ? "walkthrough-target-5"
                    : row.id === 3
                    ? "walkthrough-target-6"
                    : row.id === 7
                    ? "walkthrough-target-7"
                    : row.id === 9
                    ? "walkthrough-target-8"
                    : undefined;

                return (
                  <div
                    key={row.id}
                    className="flex items-center gap-4 text-xs relative group"
                  >
                    {/* Label Column */}
                    <div className="w-40 sm:w-48 shrink-0 font-medium text-slate-700">
                      {row.label} {row.required && <span className="text-red-500 font-bold">*</span>}
                    </div>

                    {/* Input Column */}
                    <div className="relative">
                      <div
                        id={stepTargetId}
                        className={cn(
                          "flex items-center justify-between w-80 sm:w-96 rounded-lg border bg-white px-3 py-2 text-xs transition-all shadow-2xs",
                          isTarget
                            ? "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-blue-50/20"
                            : "border-slate-200 text-slate-400",
                        )}
                      >
                        <span className="text-slate-400 font-normal truncate">
                          {row.placeholder}
                        </span>
                        {row.type === "select" && (
                          <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-2" />
                        )}
                      </div>

                      {/* If this row is the active step target (Steps 3-8) */}
                      {isTarget && (
                        <div className="absolute left-[calc(100%+16px)] -top-1 z-20">
                          <WalkthroughPopover
                            stepNumber={currentStep.id}
                            totalSteps={9}
                            title={currentStep.popoverTitle}
                            body={currentStep.popoverBody}
                            placement="left"
                            onBack={handlePrevious}
                            onNext={handleNext}
                            onClose={handleClose}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Buttons: Reset & Save (TARGET OF STEP 9) */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 max-w-4xl shrink-0">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              >
                <RotateCw className="h-3.5 w-3.5 text-slate-500" />
                <span>Reset</span>
              </button>

              <div className="relative inline-block">
                <button
                  id="walkthrough-target-9"
                  type="button"
                  onClick={handleNext}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg bg-[#0089FF] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-600 transition-colors cursor-pointer",
                    currentStep.targetRowIndex === 99 ? "ring-4 ring-blue-300 animate-pulse" : "",
                  )}
                >
                  <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Save</span>
                </button>

                {/* Step 9 Target: Popover positioned above Save button */}
                {currentStep.targetRowIndex === 99 && (
                  <div className="absolute bottom-[calc(100%+14px)] left-0 z-20">
                    <WalkthroughPopover
                      stepNumber={9}
                      totalSteps={9}
                      title={currentStep.popoverTitle}
                      body={currentStep.popoverBody}
                      placement="top"
                      onBack={handlePrevious}
                      onNext={handleNext}
                      onClose={handleClose}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface VehicleTableViewProps {
  topic?: "object" | "company";
  isStep2Target?: boolean;
  onAddObjectClick?: () => void;
  stepConfig?: WalkthroughStepConfig;
  onBack?: () => void;
  onNext?: () => void;
  onClose?: () => void;
}

function VehicleTableView({
  topic = "object",
  isStep2Target,
  onAddObjectClick,
  stepConfig,
  onBack,
  onNext,
  onClose,
}: VehicleTableViewProps) {
  return (
    <div className="flex flex-col h-full w-full space-y-4">
      {/* Header: Star + Vehicle */}
      <div className="flex items-center gap-2">
        <Star className="h-5 w-5 text-slate-400 stroke-[1.8]" />
        <h1 className="text-2xl font-medium tracking-tight text-slate-900">
          {topic === "company" ? "Company" : "Vehicle"}
        </h1>
      </div>

      {/* Filter Pills and Right Toolbar */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
        {/* Left Skeleton Filter Pills matching reference image */}
        <div className="flex items-center gap-2.5">
          <div className="h-5 w-16 rounded-full bg-slate-200/80" />
          <div className="h-5 w-10 rounded-full bg-slate-200/80" />
          <span className="text-slate-300">-</span>
          <div className="h-5 w-12 rounded-full bg-slate-200/80" />
          <div className="h-5 w-16 rounded-full bg-slate-200/80" />
          <span className="text-slate-300">-</span>
          <div className="h-5 w-12 rounded-full bg-slate-200/80" />
          <div className="h-5 w-18 rounded-full bg-slate-200/80" />
          <span className="text-slate-300">-</span>
          <div className="h-5 w-8 rounded-md border border-slate-200 bg-slate-100 flex items-center justify-center">
            <span className="h-2 w-2 rounded-full bg-slate-300" />
          </div>
        </div>

        {/* Right Toolbar Controls */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 text-xs text-slate-600 font-medium cursor-pointer">
            <span>All fields</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </div>

          <div className="relative w-44">
            <Search className="pointer-events-none absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              readOnly
              placeholder="Search in all fields..."
              className="h-7.5 w-full rounded-md border border-slate-200 bg-slate-50 pl-8 pr-2 text-xs text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* + Object Button -> ACTIVE TARGET FOR STEP 2 */}
          <div className="relative inline-block">
            <button
              id="walkthrough-target-2"
              type="button"
              onClick={onAddObjectClick}
              className="inline-flex h-7.5 items-center gap-1.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-3.5 text-xs font-semibold text-white transition-all cursor-pointer shadow-xs active:scale-98"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>{topic === "company" ? "Company" : "Object"}</span>
            </button>

            {isStep2Target && (
              <>
                {/* Blue Popover Tooltip situated directly below + Object with beak pointing UP */}
                {stepConfig && onBack && onNext && (
                  <div className="absolute top-[calc(100%+14px)] right-0 z-20">
                    <WalkthroughPopover
                      stepNumber={2}
                      totalSteps={9}
                      title={stepConfig.popoverTitle}
                      body={stepConfig.popoverBody}
                      placement="bottom"
                      onBack={onBack}
                      onNext={onNext}
                      onClose={onClose || onNext}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          <button
            type="button"
            className="flex h-7.5 w-7.5 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer"
          >
            <SettingsIcon className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            className="flex h-7.5 w-7.5 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer"
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Table Rows Skeleton matching Reference Screenshots 1 and 2 */}
      <div className="flex-1 overflow-hidden space-y-3.5 pt-1">
        {Array.from({ length: 13 }).map((_, rIdx) => (
          <div key={rIdx} className="flex items-center gap-3 text-xs">
            <span className="h-2 w-2 rounded-full bg-slate-300 shrink-0" />
            <div className="h-2.5 w-16 rounded bg-slate-200/80 shrink-0" />
            <div className="h-2.5 w-18 rounded bg-slate-200/70 shrink-0" />
            <div className="h-2.5 w-24 rounded bg-slate-200/70 shrink-0" />
            <div className="h-2.5 w-20 rounded bg-slate-200/70 shrink-0" />
            <div className="h-2.5 w-14 rounded bg-slate-200/60 shrink-0" />
            <div className="h-2.5 w-16 rounded bg-slate-200/60 shrink-0" />
            <div className="h-2.5 flex-1 rounded bg-slate-200/50" />
            <div className="h-3.5 w-7 rounded-full bg-slate-200 shrink-0 ml-auto" />
            <div className="flex items-center gap-2 shrink-0 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Footer Controls */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          className="flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
        >
          <RotateCw className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
}
