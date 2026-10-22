import React, { useState } from "react";
import {
  Bluetooth,
  BatteryCharging,
  Signal,
  Thermometer,
  ShieldCheck,
  Tag,
  User,
  Search,
  X,
  Radio,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { type FleetObject } from "@/data/fleet";

interface BleSensorItem {
  id: string;
  name: string;
  type: "temp_humidity" | "door" | "cargo_asset" | "driver_id";
  model: string;
  mac: string;
  status: "connected" | "disconnected";
  battery: number;
  rssi: number;
  primaryValue: string;
  secondaryValue?: string;
  lastUpdate: string;
}

const DEFAULT_BLE_SENSORS: BleSensorItem[] = [
  {
    id: "ble-1",
    name: "Cold Chain Chamber 1",
    type: "temp_humidity",
    model: "Teltonika Blue Coin T",
    mac: "D4:36:39:B2:A1:04",
    status: "connected",
    battery: 94,
    rssi: -62,
    primaryValue: "-18.2 °C",
    secondaryValue: "64% RH",
    lastUpdate: "Just now",
  },
  {
    id: "ble-2",
    name: "Rear Cargo Door Contact",
    type: "door",
    model: "ELA Blue MAG",
    mac: "E1:44:82:1C:F0:88",
    status: "connected",
    battery: 88,
    rssi: -71,
    primaryValue: "Closed (Secure)",
    secondaryValue: "Zero Tamper",
    lastUpdate: "1 min ago",
  },
  {
    id: "ble-3",
    name: "Cargo Pallet Tag #4821",
    type: "cargo_asset",
    model: "Minew BLE Tag S1",
    mac: "AC:23:3F:89:12:3C",
    status: "connected",
    battery: 92,
    rssi: -58,
    primaryValue: "In Range (1.2m)",
    secondaryValue: "Motion: Still",
    lastUpdate: "30s ago",
  },
  {
    id: "ble-4",
    name: "Driver Key Fob BLE",
    type: "driver_id",
    model: "Teltonika Blue Slim ID",
    mac: "F8:87:62:3A:99:11",
    status: "connected",
    battery: 85,
    rssi: -66,
    primaryValue: "Driver Present",
    secondaryValue: "Auth: Verified",
    lastUpdate: "Just now",
  },
];

export function BleDrawerCards({
  vehicle,
  onClose,
}: {
  vehicle: FleetObject;
  onClose?: () => void;
}) {
  const [sensors, setSensors] = useState<BleSensorItem[]>(DEFAULT_BLE_SENSORS);
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("BLE beacon telemetry refreshed");
    }, 400);
  };

  const filteredSensors = sensors.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.model.toLowerCase().includes(search.toLowerCase()) ||
      s.primaryValue.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-2 w-[220px] select-none text-xs pointer-events-auto">
      {/* ── CARD 1: BLE Overview & Header ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-md flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="h-6 w-6 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-900 flex items-center justify-center text-[#0089FF]">
              <Bluetooth className="h-3.5 w-3.5" />
            </div>
            <div>
              <h3 className="font-extrabold text-[12px] text-slate-900 dark:text-slate-100 leading-tight">
                BLE Sensors
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {vehicle.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh BLE Sensors"
              className="p-1 rounded-md text-slate-400 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin text-[#0089FF]")} />
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Pill Strip */}
        <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-2 border border-slate-100 dark:border-slate-800 flex flex-col">
            <span className="text-[9.5px] font-semibold text-slate-500 uppercase tracking-wider">
              Connected
            </span>
            <span className="text-[14px] font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {sensors.filter((s) => s.status === "connected").length} / {sensors.length}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-2 border border-slate-100 dark:border-slate-800 flex flex-col">
            <span className="text-[9.5px] font-semibold text-slate-500 uppercase tracking-wider">
              Avg RSSI
            </span>
            <span className="text-[14px] font-black text-[#0089FF] mt-0.5">
              -64 dBm
            </span>
          </div>
        </div>

        {/* Mini Search Bar */}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800 focus-within:border-[#0089FF]">
          <Search className="h-3 w-3 text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search BLE..."
            className="w-full bg-transparent text-[11px] focus:outline-none placeholder:text-slate-400"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── SENSORS LIST CARDS ── */}
      {filteredSensors.map((s) => {
        const Icon =
          s.type === "temp_humidity"
            ? Thermometer
            : s.type === "door"
              ? ShieldCheck
              : s.type === "cargo_asset"
                ? Tag
                : User;

        return (
          <div
            key={s.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 shadow-md flex flex-col gap-2 hover:border-[#0089FF]/40 transition-colors"
          >
            {/* Top row: Name & Status */}
            <div className="flex items-start justify-between gap-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="h-5 w-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <Icon className="h-3 w-3" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-[11px] text-slate-800 dark:text-slate-200 truncate leading-none">
                    {s.name}
                  </h4>
                  <p className="text-[9px] text-slate-400 truncate mt-0.5">
                    {s.model}
                  </p>
                </div>
              </div>

              <span className="flex h-2 w-2 relative shrink-0 mt-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>

            {/* Middle: Primary Value Highlight */}
            <div className="bg-sky-50/60 dark:bg-sky-950/40 rounded-xl p-2 border border-sky-100 dark:border-sky-900/50 flex items-center justify-between">
              <span className="font-extrabold text-[12px] text-[#0089FF]">
                {s.primaryValue}
              </span>
              {s.secondaryValue && (
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  {s.secondaryValue}
                </span>
              )}
            </div>

            {/* Bottom Telemetry Strip: Battery, RSSI, Update */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-0.5 px-0.5 border-t border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-1" title={`Battery: ${s.battery}%`}>
                <BatteryCharging className="h-3 w-3 text-emerald-500" />
                <span>{s.battery}%</span>
              </div>

              <div className="flex items-center gap-1" title={`Signal: ${s.rssi} dBm`}>
                <Signal className="h-3 w-3 text-sky-500" />
                <span>{s.rssi} dBm</span>
              </div>

              <span className="text-[9.5px] italic text-slate-400">
                {s.lastUpdate}
              </span>
            </div>
          </div>
        );
      })}

      {filteredSensors.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-4 text-center text-slate-400 text-[11px]">
          No BLE sensors match &ldquo;{search}&rdquo;
        </div>
      )}
    </div>
  );
}
