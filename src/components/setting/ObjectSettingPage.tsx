import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TABS = ["General", "Profile", "Sensors", "Document"] as const;
type Tab = (typeof TABS)[number];

type Form = {
  branch: string;
  name: string;
  trackerId: string;
  deviceType: string;
  imei: string;
  simPrimary: string;
  simSecondary: string;
  timezone: string;
  odometer: string;
  plate: string;
  driver: string;
  notes: string;
};

const INITIAL: Form = {
  branch: "Indonesia",
  name: "Fuel - 1001",
  trackerId: "TRK-100234",
  deviceType: "FMB920",
  imei: "861234567890123",
  simPrimary: "+62812345678",
  simSecondary: "",
  timezone: "Asia/Jakarta",
  odometer: "45211",
  plate: "B 1234 XYZ",
  driver: "Shivam Patel",
  notes: "",
};

const REQUIRED: (keyof Form)[] = [
  "branch",
  "name",
  "trackerId",
  "deviceType",
  "imei",
];

export function ObjectSettingPage() {
  const [tab, setTab] = useState<Tab>("General");
  const [form, setForm] = useState<Form>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});

  const set = (key: keyof Form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const save = () => {
    const next: Partial<Record<keyof Form, string>> = {};
    for (const key of REQUIRED)
      if (!form[key].trim()) next[key] = "This field is required";
    if (form.imei.trim() && !/^\d{15}$/.test(form.imei.trim()))
      next.imei = "IMEI must be 15 digits";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setTab("General");
      toast.error("Fix the highlighted fields before saving");
      return;
    }
    toast.success(`${form.name} saved`);
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-3 scroll-smooth">
      <div className="rounded-md border border-border bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2">
          <h1 className="text-base font-semibold text-foreground">Object</h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setForm(INITIAL);
                setErrors({});
                toast.info("Changes reverted");
              }}
              className="h-8 rounded border border-border px-3 text-xs font-medium transition-colors duration-150 hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              className="h-8 rounded bg-brand px-3 text-xs font-medium text-brand-foreground transition-colors duration-150 hover:opacity-90"
            >
              Save
            </button>
          </div>
        </div>

        <div className="flex gap-1 border-b border-border px-3">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              aria-current={tab === t}
              className={cn(
                "-mb-px border-b-2 px-3 py-2 text-xs font-medium transition-colors duration-150",
                tab === t
                  ? "border-brand text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {tab === "General" ? (
            <>
              <Field
                label="Branch"
                required
                value={form.branch}
                error={errors.branch}
                onChange={(v) => set("branch", v)}
                options={["Indonesia", "Thailand", "Valsad"]}
              />
              <Field
                label="Name"
                required
                value={form.name}
                error={errors.name}
                onChange={(v) => set("name", v)}
              />
              <Field
                label="GPS Tracker ID"
                required
                value={form.trackerId}
                error={errors.trackerId}
                onChange={(v) => set("trackerId", v)}
              />
              <Field
                label="Device Type"
                required
                value={form.deviceType}
                error={errors.deviceType}
                onChange={(v) => set("deviceType", v)}
                options={["FMB920", "FMB003", "Ruptela FM-Pro4"]}
              />
              <Field
                label="IMEI Number"
                required
                value={form.imei}
                error={errors.imei}
                onChange={(v) => set("imei", v)}
              />
              <Field
                label="SIM Number (primary)"
                value={form.simPrimary}
                onChange={(v) => set("simPrimary", v)}
              />
              <Field
                label="SIM Number (secondary)"
                value={form.simSecondary}
                onChange={(v) => set("simSecondary", v)}
              />
              <Field
                label="Timezone"
                value={form.timezone}
                onChange={(v) => set("timezone", v)}
                options={["Asia/Jakarta", "Asia/Bangkok", "Asia/Kolkata"]}
              />
              <Field
                label="Odometer (km)"
                value={form.odometer}
                onChange={(v) => set("odometer", v)}
              />
            </>
          ) : null}

          {tab === "Profile" ? (
            <>
              <Field
                label="Plate Number"
                value={form.plate}
                onChange={(v) => set("plate", v)}
              />
              <Field
                label="Primary Driver"
                value={form.driver}
                onChange={(v) => set("driver", v)}
              />
              <Field
                label="Notes"
                value={form.notes}
                onChange={(v) => set("notes", v)}
              />
            </>
          ) : null}

          {tab === "Sensors" ? (
            <p className="col-span-full text-xs text-muted-foreground">
              No sensors configured yet for {form.name}. Save the general
              details first, then add fuel, temperature or RPM sensors.
            </p>
          ) : null}

          {tab === "Document" ? (
            <p className="col-span-full text-xs text-muted-foreground">
              No documents uploaded for {form.name}.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  error,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string | undefined;
  options?: string[];
}) {
  const id = label.replace(/\W+/g, "-").toLowerCase();
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs font-medium text-foreground">
        {label}
        {required ? <span className="ml-0.5 text-danger">*</span> : null}
      </label>
      {options ? (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-9 w-full rounded border bg-background px-2 text-xs",
            error ? "border-danger" : "border-input",
          )}
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-9 w-full rounded border bg-background px-2 text-xs",
            error ? "border-danger" : "border-input",
          )}
        />
      )}
      {error ? <p className="text-[11px] text-danger">{error}</p> : null}
    </div>
  );
}
