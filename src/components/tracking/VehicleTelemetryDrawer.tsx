import {
  AlertTriangle,
  Battery,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  FileText,
  Flame,
  Gauge,
  HelpCircle,
  Info,
  Maximize2,
  Phone,
  Radio,
  RefreshCw,
  Share2,
  SlidersHorizontal,
  Thermometer,
  Truck,
  User,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { STATUS_META, type FleetObject } from "@/data/fleet";
import { cn } from "@/lib/utils";

export function VehicleTelemetryDrawer({
  vehicle,
  onClose,
  onSelectVehicle,
  allVehicles,
  className,
}: {
  vehicle: FleetObject;
  onClose: () => void;
  onSelectVehicle: (id: string) => void;
  allVehicles: FleetObject[];
  className?: string;
}) {
  const [activeTab, setActiveTab] = useState<
    "fuel" | "sensors" | "info" | "alerts"
  >("fuel");
  const [objectInfoOpen, setObjectInfoOpen] = useState(true);

  // Fuel percentage
  const fuelVal = vehicle.fuel ?? 46;
  const tankCap = vehicle.tankCapacity ?? 300;
  const fuelPercent = Math.min(
    100,
    Math.max(0, Math.round((fuelVal / tankCap) * 100)),
  );

  // Gauge needle rotation angle (-90deg at 0% to +90deg at 100%)
  const needleAngle = -90 + (fuelPercent / 100) * 180;

  // Format mechanical odometer digits (e.g. 0066460)
  const odoDigits = String(vehicle.odometer ?? 66460)
    .padStart(7, "0")
    .split("");

  const currentIndex = allVehicles.findIndex((v) => v.id === vehicle.id);
  const handlePrev = () => {
    if (currentIndex > 0 && allVehicles[currentIndex - 1]) {
      onSelectVehicle(allVehicles[currentIndex - 1]!.id);
    }
  };
  const handleNext = () => {
    if (
      currentIndex < allVehicles.length - 1 &&
      allVehicles[currentIndex + 1]
    ) {
      onSelectVehicle(allVehicles[currentIndex + 1]!.id);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-card/98 backdrop-blur-xl border border-border rounded-xl shadow-2xl overflow-hidden transition-all duration-200 w-full sm:w-[360px] text-xs",
        className,
      )}
    >
      {/* 1. Header Toolbar with Title, Switcher & Action Icons */}
      <div className="flex h-[45px] items-center justify-between border-b border-border bg-surface-muted/60 px-3 select-none">
        {/* Title & Dropdown */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <span className="font-bold text-xs text-foreground truncate">
            Fuel -{" "}
            {vehicle.name.replace(
              /^(Fuel - |BUS - |RPM - |SOC - |Temperature - )/,
              "",
            )}
          </span>
        </div>

        {/* Quick Utility Icon Actions */}
        <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
          <button
            type="button"
            title="Previous Vehicle"
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            className="p-1.5 rounded-md hover:bg-muted hover:text-foreground disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Next Vehicle"
            onClick={handleNext}
            disabled={currentIndex >= allVehicles.length - 1}
            className="p-1.5 rounded-md hover:bg-muted hover:text-foreground disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Share live vehicle tracking link"
            className="p-1.5 rounded-md hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Close panel"
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-muted hover:text-foreground cursor-pointer ml-0.5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[calc(100vh-220px)]">
        {/* 2. 3D Truck Vehicle Showcase Card */}
        <div className="rounded-md border border-border bg-surface-muted/30 p-3 space-y-2.5">
          {/* Truck Image & Status Badge */}
          <div className="flex items-center justify-between">
            {/* 3D Truck illustration */}
            <div className="relative flex items-center justify-center h-20 w-36 bg-gradient-to-tr from-muted/50 to-transparent rounded-lg p-1 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=400&q=80"
                alt="Commercial Fleet Vehicle"
                className="h-full w-full object-contain filter drop-shadow-md transform -scale-x-100"
              />
            </div>

            {/* Status Pill & Trip Stats */}
            <div className="text-right space-y-1">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold text-[10px] uppercase shadow-2xs"
                style={{
                  background: STATUS_META[vehicle.status].tint,
                  color: STATUS_META[vehicle.status].color,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ background: STATUS_META[vehicle.status].color }}
                />
                {STATUS_META[vehicle.status].label}{" "}
                {vehicle.duration ?? "11h:15"}
              </span>

              <div>
                <span className="text-[10px] text-muted-foreground block">
                  Current Trip
                </span>
                <span className="text-xs font-bold text-foreground tabular-nums">
                  {vehicle.currentTrip ?? "288.44"} km
                </span>
              </div>
            </div>
          </div>

          {/* Mechanical Odometer & Work Hour Box */}
          <div className="flex items-center justify-between border-t border-border/60 pt-2 text-[11px]">
            <div>
              <span className="text-[10px] text-muted-foreground block mb-0.5">
                Odometer
              </span>
              {/* Odometer counter display */}
              <div className="flex gap-0.5 bg-black/90 dark:bg-black p-0.5 rounded border border-slate-700 shadow-inner">
                {odoDigits.map((digit, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center justify-center h-4 w-3 bg-zinc-900 text-white font-mono text-[10px] font-bold rounded-xs border-r border-zinc-800 last:border-0"
                  >
                    {digit}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-muted-foreground block">
                Work Hour
              </span>
              <span className="font-mono font-bold text-foreground tabular-nums text-xs">
                2578 hrs
              </span>
            </div>
          </div>

          {/* Driver Information */}
          <div className="flex items-center justify-between border-t border-border/60 pt-2 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5 truncate">
              <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">
                Driver:{" "}
                <strong className="text-foreground font-medium">
                  {vehicle.driver || "--"}
                </strong>
              </span>
            </div>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline">
              More Details &gt;
            </span>
          </div>
        </div>

        {/* 3. Telemetry Navigation Tabs */}
        <div className="flex border-b border-border text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("fuel")}
            className={cn(
              "flex-1 pb-1.5 border-b-2 transition-colors cursor-pointer text-center",
              activeTab === "fuel"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            # Fuel
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sensors")}
            className={cn(
              "flex-1 pb-1.5 border-b-2 transition-colors cursor-pointer text-center",
              activeTab === "sensors"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            Sensors & OBD
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("alerts")}
            className={cn(
              "flex-1 pb-1.5 border-b-2 transition-colors cursor-pointer text-center",
              activeTab === "alerts"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            Live Alerts
          </button>
        </div>

        {/* 4. Fuel & Sensor Telematics View */}
        {activeTab === "fuel" && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* Circular / Semi-Circular Live Fuel Gauge */}
            <div className="flex flex-col items-center justify-center p-2 rounded-md border border-border bg-surface-muted/20">
              <div className="relative h-28 w-44 flex items-center justify-center">
                {/* SVG Semi-Circle Gauge */}
                <svg
                  className="h-full w-full overflow-visible"
                  viewBox="0 0 160 90"
                >
                  {/* Gauge Background Track */}
                  <path
                    d="M 15 80 A 65 65 0 0 1 145 80"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-muted/40"
                    strokeLinecap="round"
                  />
                  {/* Red low fuel zone */}
                  <path
                    d="M 15 80 A 65 65 0 0 1 45 35"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  {/* Amber medium zone */}
                  <path
                    d="M 45 35 A 65 65 0 0 1 100 16"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="12"
                  />
                  {/* Green good zone */}
                  <path
                    d="M 100 16 A 65 65 0 0 1 145 80"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />

                  {/* Needle */}
                  <g
                    transform={"translate(80, 80) rotate(" + needleAngle + ")"}
                    className="transition-transform duration-500 ease-out"
                  >
                    <polygon points="-3,0 3,0 0,-60" fill="#2563eb" />
                    <circle cx="0" cy="0" r="5" fill="#1e293b" />
                  </g>
                </svg>

                {/* Liters Readout */}
                <div className="absolute bottom-0 text-center">
                  <span className="text-sm font-extrabold text-foreground tabular-nums">
                    {fuelVal}{" "}
                    <span className="text-[10px] font-normal text-muted-foreground">
                      liter
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Tank Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-[11px] rounded-md border border-border p-2.5 bg-card">
              <div>
                <span className="text-[10px] text-muted-foreground block">
                  Tanks
                </span>
                <span className="font-bold text-foreground">1</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">
                  Refill
                </span>
                <span className="font-bold text-foreground">NA 0</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">
                  Drain
                </span>
                <span className="font-bold text-foreground">NA 0</span>
              </div>
              <div className="col-span-3 border-t border-border/40 pt-1.5 flex justify-between">
                <span className="text-muted-foreground">Tank Capacity</span>
                <span className="font-bold text-foreground">
                  {tankCap}.0 liter
                </span>
              </div>
            </div>

            {/* Detailed Consumption & Eco Metrics */}
            <div className="space-y-1.5 rounded-md border border-border p-2.5 bg-card text-[11px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Consumption</span>
                <span className="font-medium text-foreground">
                  Sensor <strong>5.80 L</strong> &nbsp;|&nbsp; CAN{" "}
                  <strong>0.00 L</strong>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Carbon Emission</span>
                <span className="font-medium text-foreground">
                  Sensor <strong>0.00</strong> &nbsp;|&nbsp; CAN{" "}
                  <strong>NA</strong>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  Waste{" "}
                  <HelpCircle className="h-3 w-3 text-muted-foreground/60" />
                </span>
                <span className="font-medium text-foreground">
                  Pre-defined <strong>0 L</strong> &nbsp;|&nbsp; CAN{" "}
                  <strong>0.00 L</strong>
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground text-right italic">
                (Due to 0 hrs idling)
              </p>
              <div className="border-t border-border/40 pt-1.5 flex justify-between">
                <span className="text-muted-foreground">Remaining Range</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  688 km
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Updated</span>
                <span className="font-mono">27-08-2026 11:22 AM</span>
              </div>
            </div>
          </div>
        )}

        {/* Sensors Tab */}
        {activeTab === "sensors" && (
          <div className="space-y-2 text-[11px] animate-in fade-in duration-150">
            <div className="rounded-md border border-border p-2.5 bg-card space-y-1.5">
              <span className="font-bold text-foreground text-xs block mb-1">
                Cold Chain Sensors
              </span>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sensor 1 (Front)</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  -18.4 °C
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sensor 2 (Rear)</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  -19.1 °C
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Door Status</span>
                <span className="font-bold text-foreground">Closed</span>
              </div>
            </div>

            <div className="rounded-md border border-border p-2.5 bg-card space-y-1.5">
              <span className="font-bold text-foreground text-xs block mb-1">
                Engine & Electrical
              </span>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Engine RPM</span>
                <span className="font-mono font-bold text-foreground">
                  1,450 RPM
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Battery Voltage</span>
                <span className="font-mono font-bold text-foreground">
                  24.2 V
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Coolant Temp</span>
                <span className="font-mono font-bold text-foreground">
                  84 °C
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === "alerts" && (
          <div className="space-y-2 text-[11px] animate-in fade-in duration-150">
            <div className="rounded-md border border-border p-2.5 bg-card space-y-2">
              <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Geofence Entry: Kendari Port</span>
              </div>
              <span className="text-[10px] text-muted-foreground block">
                Today at 10:45 AM · Speed: 12 km/h
              </span>
            </div>
          </div>
        )}

        {/* 5. Object Information Collapsible Accordion */}
        <div className="rounded-md border border-border bg-card overflow-hidden">
          <button
            type="button"
            onClick={() => setObjectInfoOpen((prev) => !prev)}
            className="flex items-center justify-between w-full p-2.5 bg-surface-muted/40 font-bold text-xs text-foreground cursor-pointer hover:bg-surface-muted/80 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Object Information</span>
            </div>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform duration-150",
                !objectInfoOpen && "-rotate-90",
              )}
            />
          </button>

          {objectInfoOpen && (
            <div className="p-2.5 space-y-1.5 text-[11px] border-t border-border/60">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Purchase Date</span>
                <span className="font-medium text-foreground">--</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Purchase Amount</span>
                <span className="font-medium text-foreground">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Insurance Expiry</span>
                <span className="font-medium text-foreground">15-12-2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fitness Expiry</span>
                <span className="font-medium text-foreground">20-11-2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pollution Expiry</span>
                <span className="font-medium text-foreground">10-09-2026</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
