import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sliders,
  RotateCcw,
  Save,
  Plus,
  Trash2,
  Calculator,
  Layers,
  Gauge,
  Cpu,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SelectDropdown } from "@/components/ui/select-dropdown";

export type CalibrationPoint = {
  id: string;
  xValue: number; // Raw input (e.g. Voltage V, Frequency Hz, or ADC)
  volume: number; // Tank volume (Liters)
};

export type FuelCalibrationData = {
  sensorOutputUnit: string;
  conversionFactor: string;
  tankCapacity: string;
  considerBlindArea: boolean;
  formula: string;
  tankType: string;
  tankMaterial: string;
  sensorMounting: string;
  sensorBrand: string;
  sensorModel: string;
  sensorType: string;
  sensorImei: string;
  pin: string;
  installationDate: string;
  temperaturePort: string;
  batteryPort: string;
  humidityPort: string;
  calibrationPoints: CalibrationPoint[];
};

export const DEFAULT_CALIBRATION_DATA: FuelCalibrationData = {
  sensorOutputUnit: "Voltage",
  conversionFactor: "1.0",
  tankCapacity: "1500",
  considerBlindArea: false,
  formula: "x * 300",
  tankType: "Rectangular",
  tankMaterial: "Aluminum",
  sensorMounting: "Top Center",
  sensorBrand: "Omnicomm",
  sensorModel: "LLS 20160",
  sensorType: "Digital RS485",
  sensorImei: "SEN-8821940",
  pin: "AIN1 / RS485",
  installationDate: "2026-01-15",
  temperaturePort: "Port 1",
  batteryPort: "External 24V",
  humidityPort: "--Select--",
  calibrationPoints: [
    { id: "p1", xValue: 0, volume: 0 },
    { id: "p2", xValue: 1.25, volume: 375 },
    { id: "p3", xValue: 2.5, volume: 750 },
    { id: "p4", xValue: 3.75, volume: 1125 },
    { id: "p5", xValue: 5.0, volume: 1500 },
  ],
};

export function FuelCalibrationModal({
  open,
  onOpenChange,
  sensorName = "Fuel Sensor (analog 1)",
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sensorName?: string;
  onSave?: (data: FuelCalibrationData) => void;
}) {
  const [data, setData] = useState<FuelCalibrationData>(DEFAULT_CALIBRATION_DATA);
  const [testRawX, setTestRawX] = useState<string>("2.5");
  const [testResult, setTestResult] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"params" | "matrix">("params");

  const setField = <K extends keyof FuelCalibrationData>(
    key: K,
    val: FuelCalibrationData[K],
  ) => {
    setData((prev) => ({ ...prev, [key]: val }));
  };

  const handleTestFormula = () => {
    try {
      const x = parseFloat(testRawX);
      if (isNaN(x)) {
        toast.error("Enter a valid numeric value for x");
        return;
      }
      // Simple formula evaluator supporting standard math expressions with 'x'
      const sanitized = data.formula.replace(/x/gi, String(x));
      const fn = new Function(`return (${sanitized})`);
      const result = fn();
      setTestResult(`${result.toFixed(2)} Liters`);
      toast.success(`Evaluated formula with x = ${x} → ${result.toFixed(2)} L`);
    } catch {
      toast.error("Invalid formula syntax. Example: x * 300 + 10");
    }
  };

  const addPoint = () => {
    const nextId = `p-${Date.now()}`;
    const lastPoint = data.calibrationPoints[data.calibrationPoints.length - 1];
    const newX = lastPoint ? lastPoint.xValue + 1.0 : 1.0;
    const newVol = lastPoint ? lastPoint.volume + 300 : 300;
    setData((prev) => ({
      ...prev,
      calibrationPoints: [
        ...prev.calibrationPoints,
        { id: nextId, xValue: newX, volume: newVol },
      ],
    }));
  };

  const removePoint = (id: string) => {
    if (data.calibrationPoints.length <= 2) {
      toast.warning("At least 2 calibration points are required for interpolation");
      return;
    }
    setData((prev) => ({
      ...prev,
      calibrationPoints: prev.calibrationPoints.filter((p) => p.id !== id),
    }));
  };

  const updatePoint = (
    id: string,
    field: "xValue" | "volume",
    value: number,
  ) => {
    setData((prev) => ({
      ...prev,
      calibrationPoints: prev.calibrationPoints.map((p) =>
        p.id === id ? { ...p, [field]: value } : p,
      ),
    }));
  };

  const handleSave = () => {
    if (!data.tankCapacity || isNaN(parseFloat(data.tankCapacity))) {
      toast.error("Tank Capacity must be a valid positive number");
      return;
    }
    onSave?.(data);
    toast.success(`Calibration profile for ${sensorName} saved successfully`);
    onOpenChange(false);
  };

  const handleReset = () => {
    setData(DEFAULT_CALIBRATION_DATA);
    setTestResult(null);
    toast.info("Calibration settings reset to defaults");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl rounded-xl">
        {/* Header matching Image 5: Deep Blue / Primary styling */}
        <DialogHeader className="bg-[#0089FF] dark:bg-blue-600 text-white px-5 py-3.5 flex flex-row items-center justify-between space-y-0 select-none">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 backdrop-blur-xs">
              <Sliders className="h-4 w-4 text-white" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-white tracking-tight">
                Fuel Calibration
              </DialogTitle>
              <p className="text-[11px] text-blue-100/90 font-medium">
                {sensorName} · Tank Capacity: {data.tankCapacity}L
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mr-6">
            <button
              type="button"
              onClick={() => setActiveSubTab("params")}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
                activeSubTab === "params"
                  ? "bg-white text-[#0089FF] shadow-xs"
                  : "text-white/80 hover:text-white hover:bg-white/10",
              )}
            >
              Sensor & Tank Specs
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("matrix")}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
                activeSubTab === "matrix"
                  ? "bg-white text-[#0089FF] shadow-xs"
                  : "text-white/80 hover:text-white hover:bg-white/10",
              )}
            >
              Calibration Points Matrix ({data.calibrationPoints.length})
            </button>
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-5 custom-scrollbar text-xs">
          {activeSubTab === "params" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Column: General Section */}
              <div className="space-y-3.5 rounded-lg border border-[#DFE3EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-950/40 p-4">
                <div className="flex items-center gap-2 border-b border-[#DFE3EB] dark:border-slate-800 pb-2">
                  <Gauge className="h-4 w-4 text-[#0089FF]" />
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    General
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <FieldSelect
                      label="Sensor Output Unit (X)"
                      required
                      value={data.sensorOutputUnit}
                      onChange={(v) => setField("sensorOutputUnit", v)}
                      options={[
                        "Voltage",
                        "Frequency",
                        "Percentage",
                        "Liter",
                        "Resistance",
                        "Digital RS-485",
                      ]}
                    />
                    <FieldInput
                      label="Conversion Factor"
                      required
                      value={data.conversionFactor}
                      onChange={(v) => setField("conversionFactor", v)}
                      placeholder="1.0"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FieldInput
                      label="Tank Capacity (L)"
                      required
                      value={data.tankCapacity}
                      onChange={(v) => setField("tankCapacity", v)}
                      placeholder="1500"
                    />
                    <div className="flex flex-col justify-end pb-1.5">
                      <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={data.considerBlindArea}
                          onChange={(e) =>
                            setField("considerBlindArea", e.target.checked)
                          }
                          className="h-4 w-4 rounded border-input text-[#0089FF] focus:ring-[#0089FF]/20 cursor-pointer"
                        />
                        <span>Consider Blind Area</span>
                      </label>
                    </div>
                  </div>

                  {/* Formula with Live Testing */}
                  <div className="space-y-1.5 rounded-md border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-foreground">
                        Formula (f(x))
                      </label>
                      <button
                        type="button"
                        onClick={handleTestFormula}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0089FF] hover:underline cursor-pointer"
                      >
                        <Calculator className="h-3 w-3" />
                        <span>Test Formula</span>
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={data.formula}
                        onChange={(e) => setField("formula", e.target.value)}
                        placeholder="e.g. x * 300"
                        className="flex-1 h-7 rounded border border-input bg-background px-2 text-xs text-foreground font-mono focus:border-[#0089FF] focus:outline-none"
                      />
                      <div className="flex items-center gap-1 bg-muted/40 px-2 py-0.5 rounded border border-border/60">
                        <span className="text-[10px] text-muted-foreground">x =</span>
                        <input
                          type="text"
                          value={testRawX}
                          onChange={(e) => setTestRawX(e.target.value)}
                          className="w-10 h-6 bg-background rounded text-center text-[11px] font-mono border border-input focus:outline-none"
                          placeholder="2.5"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      Formula must contain variable <code className="text-[#0089FF] font-bold">x</code> which will be replaced with value received from device.
                    </p>
                    {testResult && (
                      <div className="mt-1 flex items-center justify-between rounded bg-blue-500/10 px-2 py-1 text-[11px] text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/20">
                        <span>Calculated Volume:</span>
                        <span className="font-mono">{testResult}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FieldSelect
                      label="Tank Type"
                      value={data.tankType}
                      onChange={(v) => setField("tankType", v)}
                      options={[
                        "--Select--",
                        "Rectangular",
                        "Cylindrical Horizontal",
                        "Cylindrical Vertical",
                        "Step Tank",
                      ]}
                    />
                    <FieldSelect
                      label="Tank Material"
                      value={data.tankMaterial}
                      onChange={(v) => setField("tankMaterial", v)}
                      options={[
                        "--Select--",
                        "Aluminum",
                        "Steel",
                        "Plastic",
                        "Composite",
                      ]}
                    />
                  </div>

                  <FieldSelect
                    label="Sensor Mounting"
                    value={data.sensorMounting}
                    onChange={(v) => setField("sensorMounting", v)}
                    options={[
                      "--Select--",
                      "Top Center",
                      "Top Offset",
                      "Bottom",
                      "Flange Side",
                    ]}
                  />
                </div>
              </div>

              {/* Right Column: Sensor Detail & Ports */}
              <div className="space-y-4">
                {/* Sensor Detail Section */}
                <div className="space-y-3 rounded-lg border border-[#DFE3EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-950/40 p-4">
                  <div className="flex items-center gap-2 border-b border-[#DFE3EB] dark:border-slate-800 pb-2">
                    <Cpu className="h-4 w-4 text-[#0089FF]" />
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Sensor Detail
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FieldSelect
                      label="Sensor Brand"
                      value={data.sensorBrand}
                      onChange={(v) => setField("sensorBrand", v)}
                      options={[
                        "--Select--",
                        "Omnicomm",
                        "Teltonika",
                        "Technoton",
                        "Escort",
                        "Ruptela",
                        "Meitrack",
                      ]}
                    />
                    <FieldInput
                      label="Sensor Model"
                      value={data.sensorModel}
                      onChange={(v) => setField("sensorModel", v)}
                      placeholder="e.g. LLS 20160"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FieldSelect
                      label="Sensor Type"
                      value={data.sensorType}
                      onChange={(v) => setField("sensorType", v)}
                      options={[
                        "--Select--",
                        "Digital RS485",
                        "Analog 0-5V",
                        "Frequency 500-1500Hz",
                        "Bluetooth BLE",
                        "CAN Bus J1939",
                      ]}
                    />
                    <FieldInput
                      label="Sensor IMEI / UID / Serial"
                      value={data.sensorImei}
                      onChange={(e) => setField("sensorImei", e)}
                      placeholder="Serial or UID"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FieldInput
                      label="Pin / Channel"
                      value={data.pin}
                      onChange={(e) => setField("pin", e)}
                      placeholder="e.g. AIN1 / RS485"
                    />
                    <FieldInput
                      label="Date of Installation"
                      type="date"
                      value={data.installationDate}
                      onChange={(e) => setField("installationDate", e)}
                    />
                  </div>
                </div>

                {/* Ports Section */}
                <div className="space-y-3 rounded-lg border border-[#DFE3EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-950/40 p-4">
                  <div className="flex items-center gap-2 border-b border-[#DFE3EB] dark:border-slate-800 pb-2">
                    <Layers className="h-4 w-4 text-[#0089FF]" />
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Ports & Auxiliary Telemetry
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <FieldSelect
                      label="Temperature (T)"
                      value={data.temperaturePort}
                      onChange={(v) => setField("temperaturePort", v)}
                      options={["--Select--", "Port 1", "Port 2", "Disabled"]}
                    />
                    <FieldSelect
                      label="Battery (B)"
                      value={data.batteryPort}
                      onChange={(v) => setField("batteryPort", v)}
                      options={[
                        "--Select--",
                        "External 24V",
                        "External 12V",
                        "Internal 3.7V",
                        "Disabled",
                      ]}
                    />
                    <FieldSelect
                      label="Humidity (H)"
                      value={data.humidityPort}
                      onChange={(v) => setField("humidityPort", v)}
                      options={["--Select--", "Port 1", "Port 2", "Disabled"]}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Calibration Matrix Sub-Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border border-border/80">
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    Sensor Calibration Table (X Input vs Volume)
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Define interpolation points to translate raw output ({data.sensorOutputUnit}) into exact tank liters.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={addPoint}
                    className="inline-flex items-center gap-1.5 rounded-md bg-[#0089FF] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0070d6] transition-all cursor-pointer shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Point</span>
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-[#DFE3EB] dark:border-slate-800 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] dark:bg-slate-950/60 border-b border-[#DFE3EB] dark:border-slate-800 text-muted-foreground uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-2.5 px-4 w-12 text-center">#</th>
                      <th className="py-2.5 px-4">
                        Sensor Value (X in {data.sensorOutputUnit})
                      </th>
                      <th className="py-2.5 px-4">Calibrated Volume (Liters)</th>
                      <th className="py-2.5 px-4">Tank Percentage (%)</th>
                      <th className="py-2.5 px-4 text-right w-20">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DFE3EB] dark:divide-slate-800 font-medium">
                    {data.calibrationPoints.map((pt, idx) => {
                      const capacity = parseFloat(data.tankCapacity) || 1500;
                      const pct = ((pt.volume / capacity) * 100).toFixed(1);
                      return (
                        <tr
                          key={pt.id}
                          className="hover:bg-muted/20 transition-colors"
                        >
                          <td className="py-2 px-4 text-center font-mono text-muted-foreground">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-4">
                            <input
                              type="number"
                              step="any"
                              value={pt.xValue}
                              onChange={(e) =>
                                updatePoint(
                                  pt.id,
                                  "xValue",
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              className="h-7 w-32 rounded border border-input bg-background px-2 text-xs font-mono text-foreground focus:border-[#0089FF] focus:outline-none"
                            />
                          </td>
                          <td className="py-2 px-4">
                            <input
                              type="number"
                              step="any"
                              value={pt.volume}
                              onChange={(e) =>
                                updatePoint(
                                  pt.id,
                                  "volume",
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              className="h-7 w-32 rounded border border-input bg-background px-2 text-xs font-mono text-foreground focus:border-[#0089FF] focus:outline-none"
                            />
                          </td>
                          <td className="py-2 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-[#0089FF] h-full rounded-full transition-all"
                                  style={{
                                    width: `${Math.min(100, Math.max(0, parseFloat(pct)))}%`,
                                  }}
                                />
                              </div>
                              <span className="font-mono text-[11px] text-muted-foreground">
                                {pct}%
                              </span>
                            </div>
                          </td>
                          <td className="py-2 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => removePoint(pt.id)}
                              className="p-1 rounded text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                              title="Delete Point"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Save / Reset / Close buttons */}
        <div className="flex items-center justify-between border-t border-[#DFE3EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-950/60 px-5 py-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-4 py-1.5 text-xs font-semibold text-white transition-all cursor-pointer shadow-xs active:scale-98"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Calibration</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-semibold text-foreground">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none transition-all"
      />
    </div>
  );
}

function FieldSelect({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-semibold text-foreground">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      <SelectDropdown
        value={value}
        onChange={onChange}
        options={options}
        triggerClassName="h-8 text-xs font-medium"
      />
    </div>
  );
}
