import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/setting-Hks4gBhc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	"General",
	"Profile",
	"Sensors",
	"Document"
];
var INITIAL = {
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
	notes: ""
};
var REQUIRED = [
	"branch",
	"name",
	"trackerId",
	"deviceType",
	"imei"
];
function ObjectSettingPage() {
	const [tab, setTab] = (0, import_react.useState)("General");
	const [form, setForm] = (0, import_react.useState)(INITIAL);
	const [errors, setErrors] = (0, import_react.useState)({});
	const set = (key, value) => {
		setForm((f) => ({
			...f,
			[key]: value
		}));
		setErrors((e) => ({
			...e,
			[key]: void 0
		}));
	};
	const save = () => {
		const next = {};
		for (const key of REQUIRED) if (!form[key].trim()) next[key] = "This field is required";
		if (form.imei.trim() && !/^\d{15}$/.test(form.imei.trim())) next.imei = "IMEI must be 15 digits";
		setErrors(next);
		if (Object.keys(next).length > 0) {
			setTab("General");
			toast.error("Fix the highlighted fields before saving");
			return;
		}
		toast.success(`${form.name} saved`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex-1 min-h-0 overflow-y-auto p-3 scroll-smooth",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-md border border-border bg-surface",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-base font-semibold text-foreground",
						children: "Object"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setForm(INITIAL);
								setErrors({});
								toast.info("Changes reverted");
							},
							className: "h-8 rounded border border-border px-3 text-xs font-medium transition-colors duration-150 hover:bg-muted",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: save,
							className: "h-8 rounded bg-brand px-3 text-xs font-medium text-brand-foreground transition-colors duration-150 hover:opacity-90",
							children: "Save"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1 border-b border-border px-3",
					children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab(t),
						"aria-current": tab === t,
						className: cn("-mb-px border-b-2 px-3 py-2 text-xs font-medium transition-colors duration-150", tab === t ? "border-brand text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"),
						children: t
					}, t))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3",
					children: [
						tab === "General" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Branch",
								required: true,
								value: form.branch,
								error: errors.branch,
								onChange: (v) => set("branch", v),
								options: [
									"Indonesia",
									"Thailand",
									"Valsad"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Name",
								required: true,
								value: form.name,
								error: errors.name,
								onChange: (v) => set("name", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "GPS Tracker ID",
								required: true,
								value: form.trackerId,
								error: errors.trackerId,
								onChange: (v) => set("trackerId", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Device Type",
								required: true,
								value: form.deviceType,
								error: errors.deviceType,
								onChange: (v) => set("deviceType", v),
								options: [
									"FMB920",
									"FMB003",
									"Ruptela FM-Pro4"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "IMEI Number",
								required: true,
								value: form.imei,
								error: errors.imei,
								onChange: (v) => set("imei", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "SIM Number (primary)",
								value: form.simPrimary,
								onChange: (v) => set("simPrimary", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "SIM Number (secondary)",
								value: form.simSecondary,
								onChange: (v) => set("simSecondary", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Timezone",
								value: form.timezone,
								onChange: (v) => set("timezone", v),
								options: [
									"Asia/Jakarta",
									"Asia/Bangkok",
									"Asia/Kolkata"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Odometer (km)",
								value: form.odometer,
								onChange: (v) => set("odometer", v)
							})
						] }) : null,
						tab === "Profile" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Plate Number",
								value: form.plate,
								onChange: (v) => set("plate", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Primary Driver",
								value: form.driver,
								onChange: (v) => set("driver", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Notes",
								value: form.notes,
								onChange: (v) => set("notes", v)
							})
						] }) : null,
						tab === "Sensors" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "col-span-full text-xs text-muted-foreground",
							children: [
								"No sensors configured yet for ",
								form.name,
								". Save the general details first, then add fuel, temperature or RPM sensors."
							]
						}) : null,
						tab === "Document" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "col-span-full text-xs text-muted-foreground",
							children: [
								"No documents uploaded for ",
								form.name,
								"."
							]
						}) : null
					]
				})
			]
		})
	});
}
function Field({ label, value, onChange, required, error, options }) {
	const id = label.replace(/\W+/g, "-").toLowerCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				htmlFor: id,
				className: "block text-xs font-semibold text-foreground",
				children: [label, required ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-0.5 text-danger",
					children: "*"
				}) : null]
			}),
			options ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				id,
				value,
				onChange: (e) => onChange(e.target.value),
				className: cn("h-9 w-full rounded border bg-background px-2 text-xs font-medium text-muted-foreground focus:outline-none focus:text-foreground", error ? "border-danger" : "border-input"),
				children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: o,
					children: o
				}, o))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id,
				value,
				onChange: (e) => onChange(e.target.value),
				className: cn("h-9 w-full rounded border bg-background px-2 text-xs font-medium text-muted-foreground focus:outline-none focus:text-foreground", error ? "border-danger" : "border-input")
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-danger",
				children: error
			}) : null
		]
	});
}
var SplitComponent = ObjectSettingPage;
//#endregion
export { SplitComponent as component };
